import { Hono } from 'hono';
import { eq, like, or, desc, asc, sql } from 'drizzle-orm';
import { Env } from '../types/env';
import {
  stockItems,
  NewStockItem,
  purchaseOrders,
  poItems,
  suppliers
} from '../db/schema';

export const stockItemsRoute = new Hono<{ Bindings: Env }>();

// Get all stock items with optional search and pagination
stockItemsRoute.get('/', async (c) => {
  const db = c.get('db');
  const search = c.req.query('search');
  const category = c.req.query('category');
  const page = parseInt(c.req.query('page') || '1');
  const limit = parseInt(c.req.query('limit') || '50');
  const sortBy = c.req.query('sortBy') || 'stockCode';
  const sortOrder = c.req.query('sortOrder') || 'asc';

  const offset = (page - 1) * limit;

  let query = db.select().from(stockItems);

  // Apply search filter
  if (search) {
    query = query.where(
      or(
        like(stockItems.stockCode, `%${search}%`),
        like(stockItems.description, `%${search}%`)
      )
    ) as typeof query;
  }

  // Apply category filter
  if (category) {
    query = query.where(eq(stockItems.category, category)) as typeof query;
  }

  // Apply sorting
  const orderColumn =
    stockItems[sortBy as keyof typeof stockItems] || stockItems.stockCode;
  query = query.orderBy(
    sortOrder === 'desc' ? desc(orderColumn as any) : asc(orderColumn as any)
  ) as typeof query;

  // Apply pagination
  query = query.limit(limit).offset(offset) as typeof query;

  const result = await query;

  // Get total count
  const countResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(stockItems);
  const total = countResult[0]?.count || 0;

  return c.json({
    data: result,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  });
});

// Get stock item by ID
stockItemsRoute.get('/:id', async (c) => {
  const db = c.get('db');
  const id = parseInt(c.req.param('id'));

  const result = await db
    .select()
    .from(stockItems)
    .where(eq(stockItems.id, id));

  if (result.length === 0) {
    return c.json({ error: 'Stock item not found' }, 404);
  }

  return c.json({ data: result[0] });
});

// Get stock item by stock code
stockItemsRoute.get('/code/:stockCode', async (c) => {
  const db = c.get('db');
  const stockCode = c.req.param('stockCode');

  const result = await db
    .select()
    .from(stockItems)
    .where(eq(stockItems.stockCode, stockCode));

  if (result.length === 0) {
    return c.json({ error: 'Stock item not found' }, 404);
  }

  return c.json({ data: result[0] });
});

// Create stock item
stockItemsRoute.post('/', async (c) => {
  const db = c.get('db');
  const body = await c.req.json<
    Omit<NewStockItem, 'id' | 'createdAt' | 'updatedAt'>
  >();

  // Check if stock code already exists
  const existing = await db
    .select()
    .from(stockItems)
    .where(eq(stockItems.stockCode, body.stockCode));
  if (existing.length > 0) {
    return c.json({ error: 'Stock code already exists' }, 409);
  }

  const result = await db
    .insert(stockItems)
    .values({
      stockCode: body.stockCode,
      description: body.description,
      category: body.category,
      uom: body.uom,
      currentStock: body.currentStock || 0,
      unitPrice: body.unitPrice || 0,
      minStockLevel: body.minStockLevel,
      maxStockLevel: body.maxStockLevel,
      location: body.location
    })
    .returning();

  return c.json({ data: result[0] }, 201);
});

// Update stock item
stockItemsRoute.put('/:id', async (c) => {
  const db = c.get('db');
  const id = parseInt(c.req.param('id'));
  const body = await c.req.json<Partial<NewStockItem>>();

  const result = await db
    .update(stockItems)
    .set({
      ...body,
      updatedAt: new Date()
    })
    .where(eq(stockItems.id, id))
    .returning();

  if (result.length === 0) {
    return c.json({ error: 'Stock item not found' }, 404);
  }

  return c.json({ data: result[0] });
});

// Delete stock item
stockItemsRoute.delete('/:id', async (c) => {
  const db = c.get('db');
  const id = parseInt(c.req.param('id'));

  const result = await db
    .delete(stockItems)
    .where(eq(stockItems.id, id))
    .returning();

  if (result.length === 0) {
    return c.json({ error: 'Stock item not found' }, 404);
  }

  return c.json({ message: 'Stock item deleted successfully' });
});

// Get all categories
stockItemsRoute.get('/meta/categories', async (c) => {
  const db = c.get('db');

  const result = await db
    .selectDistinct({ category: stockItems.category })
    .from(stockItems)
    .where(sql`${stockItems.category} IS NOT NULL`);

  return c.json({ data: result.map((r) => r.category) });
});

// Update stock level (for inventory adjustments)
stockItemsRoute.patch('/:id/stock', async (c) => {
  const db = c.get('db');
  const id = parseInt(c.req.param('id'));
  const body = await c.req.json<{
    quantity: number;
    operation: 'add' | 'subtract' | 'set';
  }>();

  const existing = await db
    .select()
    .from(stockItems)
    .where(eq(stockItems.id, id));
  if (existing.length === 0) {
    return c.json({ error: 'Stock item not found' }, 404);
  }

  const currentStock = existing[0].currentStock;
  let newStock: number;

  switch (body.operation) {
    case 'add':
      newStock = currentStock + body.quantity;
      break;
    case 'subtract':
      newStock = currentStock - body.quantity;
      if (newStock < 0) {
        return c.json({ error: 'Insufficient stock' }, 400);
      }
      break;
    case 'set':
      newStock = body.quantity;
      break;
    default:
      return c.json({ error: 'Invalid operation' }, 400);
  }

  const result = await db
    .update(stockItems)
    .set({
      currentStock: newStock,
      updatedAt: new Date()
    })
    .where(eq(stockItems.id, id))
    .returning();

  return c.json({ data: result[0] });
});
// Get price history for a stock item
stockItemsRoute.get('/:stockCode/price-history', async (c) => {
  const db = c.get('db');
  const stockCode = c.req.param('stockCode');

  const history = await db
    .select({
      date: purchaseOrders.orderDate,
      documentNo: purchaseOrders.poNumber,
      supplier: suppliers.name,
      price: poItems.unitPrice
    })
    .from(poItems)
    .innerJoin(purchaseOrders, eq(poItems.poId, purchaseOrders.id))
    .innerJoin(suppliers, eq(purchaseOrders.supplierId, suppliers.id))
    .where(eq(poItems.stockCode, stockCode))
    .orderBy(desc(purchaseOrders.orderDate));

  return c.json({ data: history });
});
