import { Hono } from 'hono';
import { eq, desc, sql } from 'drizzle-orm';
import { Env } from '../types/env';
import {
  internalTransfers,
  transferItems,
  stockItems,
  stockMovements,
  users
} from '../db/schema';

export const internalTransfersRoute = new Hono<{ Bindings: Env }>();

// Generate transfer number
async function generateTransferNumber(db: any): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = `TRF-${year}-`;

  const lastTransfer = await db
    .select()
    .from(internalTransfers)
    .where(sql`${internalTransfers.transferNumber} LIKE ${prefix + '%'}`)
    .orderBy(desc(internalTransfers.id))
    .limit(1);

  let nextNumber = 1;
  if (lastTransfer.length > 0) {
    const lastNumber = parseInt(
      lastTransfer[0].transferNumber.replace(prefix, '')
    );
    nextNumber = lastNumber + 1;
  }

  return `${prefix}${nextNumber.toString().padStart(5, '0')}`;
}

// Get all transfers
internalTransfersRoute.get('/', async (c) => {
  const db = c.get('db');
  const page = parseInt(c.req.query('page') || '1');
  const limit = parseInt(c.req.query('limit') || '50');
  const offset = (page - 1) * limit;

  const result = await db
    .select({
      transfer: internalTransfers,
      requestedBy: { id: users.id, name: users.name }
    })
    .from(internalTransfers)
    .leftJoin(users, eq(internalTransfers.requestedById, users.id))
    .orderBy(desc(internalTransfers.createdAt))
    .limit(limit)
    .offset(offset);

  const countResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(internalTransfers);
  const total = countResult[0]?.count || 0;

  return c.json({
    data: result.map((r: any) => ({
      ...r.transfer,
      requestedBy: r.requestedBy
    })),
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
  });
});

// Get transfer by ID
internalTransfersRoute.get('/:id', async (c) => {
  const db = c.get('db');
  const id = parseInt(c.req.param('id'));

  const transferResult = await db
    .select({
      transfer: internalTransfers,
      requestedBy: { id: users.id, name: users.name }
    })
    .from(internalTransfers)
    .leftJoin(users, eq(internalTransfers.requestedById, users.id))
    .where(eq(internalTransfers.id, id));

  if (transferResult.length === 0)
    return c.json({ error: 'Transfer not found' }, 404);

  const items = await db
    .select({
      item: transferItems,
      stockItem: {
        id: stockItems.id,
        stockCode: stockItems.stockCode,
        description: stockItems.description
      }
    })
    .from(transferItems)
    .leftJoin(stockItems, eq(transferItems.stockItemId, stockItems.id))
    .where(eq(transferItems.transferId, id));

  return c.json({
    data: {
      ...transferResult[0].transfer,
      requestedBy: transferResult[0].requestedBy,
      items: items.map((i: any) => ({ ...i.item, stockItem: i.stockItem }))
    }
  });
});

// Create transfer
internalTransfersRoute.post('/', async (c) => {
  const db = c.get('db');
  const body = await c.req.json<any>();

  const transferNumber = await generateTransferNumber(db);

  const transferResult = await db
    .insert(internalTransfers)
    .values({
      transferNumber,
      fromLocation: body.fromLocation,
      toLocation: body.toLocation,
      status: 'DRAFT',
      requestedById: body.requestedById,
      remarks: body.remarks
    })
    .returning();

  const transfer = transferResult[0];

  if (body.items?.length > 0) {
    await db.insert(transferItems).values(
      body.items.map((item: any) => ({
        transferId: transfer.id,
        stockItemId: item.stockItemId,
        quantity: item.quantity,
        remarks: item.remarks
      }))
    );
  }

  const items = await db
    .select()
    .from(transferItems)
    .where(eq(transferItems.transferId, transfer.id));
  return c.json({ data: { ...transfer, items } }, 201);
});

// Complete transfer (updates stock)
internalTransfersRoute.post('/:id/complete', async (c) => {
  const db = c.get('db');
  const id = parseInt(c.req.param('id'));
  const body = await c.req.json<{ completedById: number }>();

  const transfer = await db
    .select()
    .from(internalTransfers)
    .where(eq(internalTransfers.id, id));
  if (transfer.length === 0)
    return c.json({ error: 'Transfer not found' }, 404);
  if (transfer[0].status !== 'IN_TRANSIT')
    return c.json({ error: 'Transfer must be IN_TRANSIT to complete' }, 400);

  const items = await db
    .select()
    .from(transferItems)
    .where(eq(transferItems.transferId, id));

  // Update stock for each item
  for (const item of items) {
    const stock = await db
      .select()
      .from(stockItems)
      .where(eq(stockItems.id, item.stockItemId));
    if (stock.length > 0) {
      // Update received quantity
      await db
        .update(transferItems)
        .set({ receivedQuantity: item.quantity })
        .where(eq(transferItems.id, item.id));
    }
  }

  await db
    .update(internalTransfers)
    .set({ status: 'COMPLETED', updatedAt: new Date() })
    .where(eq(internalTransfers.id, id));

  return c.json({ message: 'Transfer completed successfully' });
});

// Update transfer status
internalTransfersRoute.patch('/:id/status', async (c) => {
  const db = c.get('db');
  const id = parseInt(c.req.param('id'));
  const body = await c.req.json<{ status: string; approvedById?: number }>();

  const validStatuses = [
    'DRAFT',
    'PENDING',
    'IN_TRANSIT',
    'COMPLETED',
    'CANCELLED'
  ];
  if (!validStatuses.includes(body.status))
    return c.json({ error: 'Invalid status' }, 400);

  const updates: any = { status: body.status, updatedAt: new Date() };
  if (body.approvedById) updates.approvedById = body.approvedById;

  // If moving to IN_TRANSIT, deduct stock from source location
  if (body.status === 'IN_TRANSIT') {
    const transfer = await db
      .select()
      .from(internalTransfers)
      .where(eq(internalTransfers.id, id));
    if (transfer.length > 0) {
      const items = await db
        .select()
        .from(transferItems)
        .where(eq(transferItems.transferId, id));

      for (const item of items) {
        const stock = await db
          .select()
          .from(stockItems)
          .where(eq(stockItems.id, item.stockItemId));
        if (stock.length > 0) {
          const currentStock = stock[0].currentStock;
          const newStock = currentStock - item.quantity;

          if (newStock < 0)
            return c.json(
              { error: `Insufficient stock for ${stock[0].stockCode}` },
              400
            );

          await db.insert(stockMovements).values({
            stockItemId: stock[0].id,
            movementType: 'TRANSFER',
            quantity: item.quantity,
            balanceBefore: currentStock,
            balanceAfter: newStock,
            referenceType: 'TRANSFER',
            referenceId: id,
            remarks: `Transfer to ${transfer[0].toLocation}`,
            createdById: body.approvedById || transfer[0].requestedById
          });

          await db
            .update(stockItems)
            .set({ currentStock: newStock, updatedAt: new Date() })
            .where(eq(stockItems.id, stock[0].id));
        }
      }
    }
  }

  const result = await db
    .update(internalTransfers)
    .set(updates)
    .where(eq(internalTransfers.id, id))
    .returning();
  if (result.length === 0) return c.json({ error: 'Transfer not found' }, 404);

  return c.json({ data: result[0] });
});

// Delete transfer
internalTransfersRoute.delete('/:id', async (c) => {
  const db = c.get('db');
  const id = parseInt(c.req.param('id'));

  const transfer = await db
    .select()
    .from(internalTransfers)
    .where(eq(internalTransfers.id, id));
  if (transfer.length === 0)
    return c.json({ error: 'Transfer not found' }, 404);
  if (!['DRAFT', 'CANCELLED'].includes(transfer[0].status)) {
    return c.json(
      {
        error: 'Cannot delete transfer that is not in DRAFT or CANCELLED status'
      },
      400
    );
  }

  await db.delete(internalTransfers).where(eq(internalTransfers.id, id));
  return c.json({ message: 'Transfer deleted successfully' });
});
