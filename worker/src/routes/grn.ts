import { Hono } from 'hono';
import { eq, desc, sql } from 'drizzle-orm';
import { Env } from '../types/env';
import {
  goodsReceivedNotes,
  grnItems,
  purchaseOrders,
  poItems,
  suppliers,
  users,
  stockItems,
  stockMovements
} from '../db/schema';

export const goodsReceivedNotesRoute = new Hono<{ Bindings: Env }>();

// Generate GRN number
async function generateGRNNumber(db: any): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = `GRN-${year}-`;

  const lastGRN = await db
    .select()
    .from(goodsReceivedNotes)
    .where(sql`${goodsReceivedNotes.grnNumber} LIKE ${prefix + '%'}`)
    .orderBy(desc(goodsReceivedNotes.id))
    .limit(1);

  let nextNumber = 1;
  if (lastGRN.length > 0) {
    const lastNumber = parseInt(lastGRN[0].grnNumber.replace(prefix, ''));
    nextNumber = lastNumber + 1;
  }

  return `${prefix}${nextNumber.toString().padStart(5, '0')}`;
}

// Get all GRNs
goodsReceivedNotesRoute.get('/', async (c) => {
  const db = c.get('db');
  const page = parseInt(c.req.query('page') || '1');
  const limit = parseInt(c.req.query('limit') || '50');
  const offset = (page - 1) * limit;

  const result = await db
    .select({
      grn: goodsReceivedNotes,
      supplier: { id: suppliers.id, name: suppliers.name },
      receivedBy: { id: users.id, name: users.name }
    })
    .from(goodsReceivedNotes)
    .leftJoin(suppliers, eq(goodsReceivedNotes.supplierId, suppliers.id))
    .leftJoin(users, eq(goodsReceivedNotes.receivedById, users.id))
    .orderBy(desc(goodsReceivedNotes.createdAt))
    .limit(limit)
    .offset(offset);

  const countResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(goodsReceivedNotes);
  const total = countResult[0]?.count || 0;

  return c.json({
    data: result.map((r: any) => ({
      ...r.grn,
      supplier: r.supplier,
      receivedBy: r.receivedBy
    })),
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
  });
});

// Get GRN by ID
goodsReceivedNotesRoute.get('/:id', async (c) => {
  const db = c.get('db');
  const id = parseInt(c.req.param('id'));

  const grnResult = await db
    .select({
      grn: goodsReceivedNotes,
      supplier: suppliers,
      receivedBy: { id: users.id, name: users.name }
    })
    .from(goodsReceivedNotes)
    .leftJoin(suppliers, eq(goodsReceivedNotes.supplierId, suppliers.id))
    .leftJoin(users, eq(goodsReceivedNotes.receivedById, users.id))
    .where(eq(goodsReceivedNotes.id, id));

  if (grnResult.length === 0) return c.json({ error: 'GRN not found' }, 404);

  const items = await db.select().from(grnItems).where(eq(grnItems.grnId, id));

  return c.json({
    data: {
      ...grnResult[0].grn,
      supplier: grnResult[0].supplier,
      receivedBy: grnResult[0].receivedBy,
      items
    }
  });
});

// Create GRN
goodsReceivedNotesRoute.post('/', async (c) => {
  const db = c.get('db');
  const body = await c.req.json<any>();

  const grnNumber = await generateGRNNumber(db);

  const grnResult = await db
    .insert(goodsReceivedNotes)
    .values({
      grnNumber,
      poId: body.poId,
      supplierId: body.supplierId,
      receivedDate: new Date(body.receivedDate),
      deliveryOrderNo: body.deliveryOrderNo,
      invoiceNo: body.invoiceNo,
      status: 'DRAFT',
      remarks: body.remarks,
      receivedById: body.receivedById
    })
    .returning();

  const grn = grnResult[0];

  if (body.items?.length > 0) {
    await db.insert(grnItems).values(
      body.items.map((item: any) => ({
        grnId: grn.id,
        poItemId: item.poItemId,
        stockCode: item.stockCode,
        description: item.description,
        orderedQuantity: item.orderedQuantity,
        receivedQuantity: item.receivedQuantity,
        uom: item.uom,
        remarks: item.remarks
      }))
    );
  }

  const items = await db
    .select()
    .from(grnItems)
    .where(eq(grnItems.grnId, grn.id));
  return c.json({ data: { ...grn, items } }, 201);
});

// Complete GRN (updates stock)
goodsReceivedNotesRoute.post('/:id/complete', async (c) => {
  const db = c.get('db');
  const id = parseInt(c.req.param('id'));
  const body = await c.req.json<{ completedById: number }>();

  const grn = await db
    .select()
    .from(goodsReceivedNotes)
    .where(eq(goodsReceivedNotes.id, id));
  if (grn.length === 0) return c.json({ error: 'GRN not found' }, 404);
  if (grn[0].status !== 'DRAFT')
    return c.json({ error: 'GRN is not in DRAFT status' }, 400);

  const items = await db.select().from(grnItems).where(eq(grnItems.grnId, id));

  // Update stock for each item
  for (const item of items) {
    const stock = await db
      .select()
      .from(stockItems)
      .where(eq(stockItems.stockCode, item.stockCode));
    if (stock.length > 0) {
      const currentStock = stock[0].currentStock;
      const newStock = currentStock + item.receivedQuantity;

      await db.insert(stockMovements).values({
        stockItemId: stock[0].id,
        movementType: 'IN',
        quantity: item.receivedQuantity,
        balanceBefore: currentStock,
        balanceAfter: newStock,
        referenceType: 'GRN',
        referenceId: id,
        remarks: `Received from GRN ${grn[0].grnNumber}`,
        createdById: body.completedById
      });

      await db
        .update(stockItems)
        .set({ currentStock: newStock, updatedAt: new Date() })
        .where(eq(stockItems.id, stock[0].id));
    }

    // Update PO item received quantity if linked
    if (item.poItemId) {
      const poItem = await db
        .select()
        .from(poItems)
        .where(eq(poItems.id, item.poItemId));
      if (poItem.length > 0) {
        await db
          .update(poItems)
          .set({
            receivedQuantity:
              (poItem[0].receivedQuantity || 0) + item.receivedQuantity
          })
          .where(eq(poItems.id, item.poItemId));
      }
    }
  }

  await db
    .update(goodsReceivedNotes)
    .set({ status: 'COMPLETED', updatedAt: new Date() })
    .where(eq(goodsReceivedNotes.id, id));

  return c.json({ message: 'GRN completed successfully' });
});

// Delete GRN
goodsReceivedNotesRoute.delete('/:id', async (c) => {
  const db = c.get('db');
  const id = parseInt(c.req.param('id'));

  const grn = await db
    .select()
    .from(goodsReceivedNotes)
    .where(eq(goodsReceivedNotes.id, id));
  if (grn.length === 0) return c.json({ error: 'GRN not found' }, 404);
  if (grn[0].status !== 'DRAFT')
    return c.json(
      { error: 'Cannot delete GRN that is not in DRAFT status' },
      400
    );

  await db.delete(goodsReceivedNotes).where(eq(goodsReceivedNotes.id, id));
  return c.json({ message: 'GRN deleted successfully' });
});
