import { Hono } from 'hono';
import { eq, desc, sql, and, gte, lte } from 'drizzle-orm';
import { Env } from '../types/env';
import {
  purchaseOrders,
  poItems,
  suppliers,
  users,
  NewPurchaseOrder,
  NewPOItem
} from '../db/schema';

export const purchaseOrdersRoute = new Hono<{ Bindings: Env }>();

// Generate PO number
async function generatePONumber(db: any): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = `PO-${year}-`;

  const lastPO = await db
    .select()
    .from(purchaseOrders)
    .where(sql`${purchaseOrders.poNumber} LIKE ${prefix + '%'}`)
    .orderBy(desc(purchaseOrders.id))
    .limit(1);

  let nextNumber = 1;
  if (lastPO.length > 0) {
    const lastNumber = parseInt(lastPO[0].poNumber.replace(prefix, ''));
    nextNumber = lastNumber + 1;
  }

  return `${prefix}${nextNumber.toString().padStart(5, '0')}`;
}

// Get all purchase orders
purchaseOrdersRoute.get('/', async (c) => {
  const db = c.get('db');
  const status = c.req.query('status');
  const supplierId = c.req.query('supplierId');
  const startDate = c.req.query('startDate');
  const endDate = c.req.query('endDate');
  const page = parseInt(c.req.query('page') || '1');
  const limit = parseInt(c.req.query('limit') || '50');

  const offset = (page - 1) * limit;

  // Build conditions
  const conditions = [];
  if (status) {
    conditions.push(eq(purchaseOrders.status, status as any));
  }
  if (supplierId) {
    conditions.push(eq(purchaseOrders.supplierId, parseInt(supplierId)));
  }
  if (startDate) {
    conditions.push(gte(purchaseOrders.createdAt, new Date(startDate)));
  }
  if (endDate) {
    conditions.push(lte(purchaseOrders.createdAt, new Date(endDate)));
  }

  let query = db
    .select({
      po: purchaseOrders,
      supplier: {
        id: suppliers.id,
        name: suppliers.name,
        supplierCode: suppliers.supplierCode
      },
      createdBy: {
        id: users.id,
        name: users.name
      }
    })
    .from(purchaseOrders)
    .leftJoin(suppliers, eq(purchaseOrders.supplierId, suppliers.id))
    .leftJoin(users, eq(purchaseOrders.createdById, users.id));

  if (conditions.length > 0) {
    query = query.where(and(...conditions)) as typeof query;
  }

  query = query
    .orderBy(desc(purchaseOrders.createdAt))
    .limit(limit)
    .offset(offset) as typeof query;

  const result = await query;

  // Get total count
  const countResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(purchaseOrders);
  const total = countResult[0]?.count || 0;

  return c.json({
    data: result.map((r: any) => ({
      ...r.po,
      supplier: r.supplier,
      createdBy: r.createdBy
    })),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  });
});

// Get PO by ID with items
purchaseOrdersRoute.get('/:id', async (c) => {
  const db = c.get('db');
  const id = parseInt(c.req.param('id'));

  const poResult = await db
    .select({
      po: purchaseOrders,
      supplier: suppliers,
      createdBy: {
        id: users.id,
        name: users.name,
        email: users.email
      }
    })
    .from(purchaseOrders)
    .leftJoin(suppliers, eq(purchaseOrders.supplierId, suppliers.id))
    .leftJoin(users, eq(purchaseOrders.createdById, users.id))
    .where(eq(purchaseOrders.id, id));

  if (poResult.length === 0) {
    return c.json({ error: 'Purchase order not found' }, 404);
  }

  const items = await db.select().from(poItems).where(eq(poItems.poId, id));

  return c.json({
    data: {
      ...poResult[0].po,
      supplier: poResult[0].supplier,
      createdBy: poResult[0].createdBy,
      items
    }
  });
});

// Create PO with items
purchaseOrdersRoute.post('/', async (c) => {
  const db = c.get('db');
  const body = await c.req.json<{
    prId?: number;
    supplierId: number;
    orderDate?: string;
    expectedDeliveryDate?: string;
    currency?: string;
    paymentTerms?: string;
    remarks?: string;
    createdById: number;
    items: Omit<NewPOItem, 'id' | 'poId' | 'createdAt'>[];
  }>();

  const poNumber = await generatePONumber(db);

  // Calculate total amount
  const totalAmount = body.items.reduce(
    (sum, item) => sum + item.totalPrice,
    0
  );

  // Insert PO
  const poResult = await db
    .insert(purchaseOrders)
    .values({
      poNumber,
      prId: body.prId,
      supplierId: body.supplierId,
      status: 'DRAFT',
      orderDate: body.orderDate ? new Date(body.orderDate) : null,
      expectedDeliveryDate: body.expectedDeliveryDate
        ? new Date(body.expectedDeliveryDate)
        : null,
      totalAmount,
      currency: body.currency || 'MYR',
      paymentTerms: body.paymentTerms,
      remarks: body.remarks,
      createdById: body.createdById
    })
    .returning();

  const po = poResult[0];

  // Insert items
  if (body.items.length > 0) {
    await db.insert(poItems).values(
      body.items.map((item) => ({
        poId: po.id,
        stockCode: item.stockCode,
        description: item.description,
        quantity: item.quantity,
        receivedQuantity: 0,
        uom: item.uom,
        unitPrice: item.unitPrice,
        discount: item.discount || 0,
        taxCode: item.taxCode,
        taxRate: item.taxRate || 0,
        totalPrice: item.totalPrice
      }))
    );
  }

  const items = await db.select().from(poItems).where(eq(poItems.poId, po.id));

  return c.json(
    {
      data: {
        ...po,
        items
      }
    },
    201
  );
});

// Update PO
purchaseOrdersRoute.put('/:id', async (c) => {
  const db = c.get('db');
  const id = parseInt(c.req.param('id'));
  const body = await c.req.json<{
    supplierId?: number;
    orderDate?: string;
    expectedDeliveryDate?: string;
    currency?: string;
    paymentTerms?: string;
    remarks?: string;
    items?: Omit<NewPOItem, 'id' | 'poId' | 'createdAt'>[];
  }>();

  // Check if PO exists and is editable
  const existing = await db
    .select()
    .from(purchaseOrders)
    .where(eq(purchaseOrders.id, id));
  if (existing.length === 0) {
    return c.json({ error: 'Purchase order not found' }, 404);
  }

  if (!['DRAFT', 'PENDING'].includes(existing[0].status)) {
    return c.json(
      { error: 'Cannot edit PO that is not in DRAFT or PENDING status' },
      400
    );
  }

  // Build updates
  const updates: any = {
    updatedAt: new Date()
  };
  if (body.supplierId) updates.supplierId = body.supplierId;
  if (body.orderDate) updates.orderDate = new Date(body.orderDate);
  if (body.expectedDeliveryDate)
    updates.expectedDeliveryDate = new Date(body.expectedDeliveryDate);
  if (body.currency) updates.currency = body.currency;
  if (body.paymentTerms !== undefined) updates.paymentTerms = body.paymentTerms;
  if (body.remarks !== undefined) updates.remarks = body.remarks;

  // Update items if provided
  if (body.items) {
    // Delete existing items
    await db.delete(poItems).where(eq(poItems.poId, id));

    // Insert new items
    if (body.items.length > 0) {
      await db.insert(poItems).values(
        body.items.map((item) => ({
          poId: id,
          stockCode: item.stockCode,
          description: item.description,
          quantity: item.quantity,
          receivedQuantity: 0,
          uom: item.uom,
          unitPrice: item.unitPrice,
          discount: item.discount || 0,
          taxCode: item.taxCode,
          taxRate: item.taxRate || 0,
          totalPrice: item.totalPrice
        }))
      );
    }

    // Recalculate total
    updates.totalAmount = body.items.reduce(
      (sum, item) => sum + item.totalPrice,
      0
    );
  }

  const poResult = await db
    .update(purchaseOrders)
    .set(updates)
    .where(eq(purchaseOrders.id, id))
    .returning();

  const items = await db.select().from(poItems).where(eq(poItems.poId, id));

  return c.json({
    data: {
      ...poResult[0],
      items
    }
  });
});

// Update PO status
purchaseOrdersRoute.patch('/:id/status', async (c) => {
  const db = c.get('db');
  const id = parseInt(c.req.param('id'));
  const body = await c.req.json<{ status: string; approvedById?: number }>();

  const validStatuses = [
    'DRAFT',
    'PENDING',
    'APPROVED',
    'SENT',
    'PARTIAL',
    'COMPLETED',
    'CANCELLED'
  ];
  if (!validStatuses.includes(body.status)) {
    return c.json({ error: 'Invalid status' }, 400);
  }

  const updates: any = {
    status: body.status,
    updatedAt: new Date()
  };

  if (body.status === 'APPROVED' && body.approvedById) {
    updates.approvedById = body.approvedById;
    updates.approvedAt = new Date();
  }

  const result = await db
    .update(purchaseOrders)
    .set(updates)
    .where(eq(purchaseOrders.id, id))
    .returning();

  if (result.length === 0) {
    return c.json({ error: 'Purchase order not found' }, 404);
  }

  return c.json({ data: result[0] });
});

// Delete PO
purchaseOrdersRoute.delete('/:id', async (c) => {
  const db = c.get('db');
  const id = parseInt(c.req.param('id'));

  const existing = await db
    .select()
    .from(purchaseOrders)
    .where(eq(purchaseOrders.id, id));
  if (existing.length === 0) {
    return c.json({ error: 'Purchase order not found' }, 404);
  }

  if (!['DRAFT', 'CANCELLED'].includes(existing[0].status)) {
    return c.json(
      { error: 'Cannot delete PO that is not in DRAFT or CANCELLED status' },
      400
    );
  }

  await db.delete(purchaseOrders).where(eq(purchaseOrders.id, id));

  return c.json({ message: 'Purchase order deleted successfully' });
});
