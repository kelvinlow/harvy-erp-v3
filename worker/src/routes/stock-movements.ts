import { Hono } from 'hono';
import { eq, desc, and, gte, lte, sql } from 'drizzle-orm';
import { Env } from '../types/env';
import {
  stockMovements,
  stockItems,
  users,
  NewStockMovement
} from '../db/schema';

export const stockMovementsRoute = new Hono<{ Bindings: Env }>();

// Get all stock movements with filters
stockMovementsRoute.get('/', async (c) => {
  const db = c.get('db');
  const stockItemId = c.req.query('stockItemId');
  const movementType = c.req.query('movementType');
  const startDate = c.req.query('startDate');
  const endDate = c.req.query('endDate');
  const page = parseInt(c.req.query('page') || '1');
  const limit = parseInt(c.req.query('limit') || '50');

  const offset = (page - 1) * limit;

  // Build conditions
  const conditions = [];
  if (stockItemId) {
    conditions.push(eq(stockMovements.stockItemId, parseInt(stockItemId)));
  }
  if (movementType) {
    conditions.push(eq(stockMovements.movementType, movementType as any));
  }
  if (startDate) {
    conditions.push(gte(stockMovements.createdAt, new Date(startDate)));
  }
  if (endDate) {
    conditions.push(lte(stockMovements.createdAt, new Date(endDate)));
  }

  let query = db
    .select({
      movement: stockMovements,
      stockItem: {
        id: stockItems.id,
        stockCode: stockItems.stockCode,
        description: stockItems.description
      },
      createdBy: {
        id: users.id,
        name: users.name
      }
    })
    .from(stockMovements)
    .leftJoin(stockItems, eq(stockMovements.stockItemId, stockItems.id))
    .leftJoin(users, eq(stockMovements.createdById, users.id));

  if (conditions.length > 0) {
    query = query.where(and(...conditions)) as typeof query;
  }

  query = query
    .orderBy(desc(stockMovements.createdAt))
    .limit(limit)
    .offset(offset) as typeof query;

  const result = await query;

  // Get total count
  let countQuery = db
    .select({ count: sql<number>`count(*)` })
    .from(stockMovements);
  if (conditions.length > 0) {
    countQuery = countQuery.where(and(...conditions)) as typeof countQuery;
  }
  const countResult = await countQuery;
  const total = countResult[0]?.count || 0;

  return c.json({
    data: result.map((r: any) => ({
      ...r.movement,
      stockItem: r.stockItem,
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

// Get stock movement by ID
stockMovementsRoute.get('/:id', async (c) => {
  const db = c.get('db');
  const id = parseInt(c.req.param('id'));

  const result = await db
    .select({
      movement: stockMovements,
      stockItem: stockItems,
      createdBy: {
        id: users.id,
        name: users.name,
        email: users.email
      }
    })
    .from(stockMovements)
    .leftJoin(stockItems, eq(stockMovements.stockItemId, stockItems.id))
    .leftJoin(users, eq(stockMovements.createdById, users.id))
    .where(eq(stockMovements.id, id));

  if (result.length === 0) {
    return c.json({ error: 'Stock movement not found' }, 404);
  }

  return c.json({
    data: {
      ...result[0].movement,
      stockItem: result[0].stockItem,
      createdBy: result[0].createdBy
    }
  });
});

// Create stock movement (and update stock level)
stockMovementsRoute.post('/', async (c) => {
  const db = c.get('db');
  const body = await c.req.json<{
    stockItemId: number;
    movementType: string;
    quantity: number;
    referenceType?: string;
    referenceId?: number;
    remarks?: string;
    createdById: number;
  }>();

  // Get current stock level
  const stockItem = await db
    .select()
    .from(stockItems)
    .where(eq(stockItems.id, body.stockItemId));
  if (stockItem.length === 0) {
    return c.json({ error: 'Stock item not found' }, 404);
  }

  const currentStock = stockItem[0].currentStock;
  let newStock: number;

  // Calculate new stock based on movement type
  switch (body.movementType) {
    case 'IN':
    case 'RETURN':
      newStock = currentStock + body.quantity;
      break;
    case 'OUT':
    case 'TRANSFER':
      newStock = currentStock - body.quantity;
      if (newStock < 0) {
        return c.json({ error: 'Insufficient stock' }, 400);
      }
      break;
    case 'ADJUSTMENT':
      // For adjustments, quantity can be positive or negative
      newStock = currentStock + body.quantity;
      if (newStock < 0) {
        return c.json(
          { error: 'Adjustment would result in negative stock' },
          400
        );
      }
      break;
    default:
      return c.json({ error: 'Invalid movement type' }, 400);
  }

  // Create movement record
  const movementResult = await db
    .insert(stockMovements)
    .values({
      stockItemId: body.stockItemId,
      movementType: body.movementType as any,
      quantity: body.quantity,
      balanceBefore: currentStock,
      balanceAfter: newStock,
      referenceType: body.referenceType,
      referenceId: body.referenceId,
      remarks: body.remarks,
      createdById: body.createdById
    })
    .returning();

  // Update stock level
  await db
    .update(stockItems)
    .set({
      currentStock: newStock,
      updatedAt: new Date()
    })
    .where(eq(stockItems.id, body.stockItemId));

  return c.json({ data: movementResult[0] }, 201);
});

// Get stock ledger for a specific item
stockMovementsRoute.get('/ledger/:stockItemId', async (c) => {
  const db = c.get('db');
  const stockItemId = parseInt(c.req.param('stockItemId'));
  const startDate = c.req.query('startDate');
  const endDate = c.req.query('endDate');
  const page = parseInt(c.req.query('page') || '1');
  const limit = parseInt(c.req.query('limit') || '100');

  const offset = (page - 1) * limit;

  // Build conditions
  const conditions = [eq(stockMovements.stockItemId, stockItemId)];
  if (startDate) {
    conditions.push(gte(stockMovements.createdAt, new Date(startDate)));
  }
  if (endDate) {
    conditions.push(lte(stockMovements.createdAt, new Date(endDate)));
  }

  // Get stock item info
  const stockItem = await db
    .select()
    .from(stockItems)
    .where(eq(stockItems.id, stockItemId));
  if (stockItem.length === 0) {
    return c.json({ error: 'Stock item not found' }, 404);
  }

  // Get movements
  const movements = await db
    .select({
      movement: stockMovements,
      createdBy: {
        id: users.id,
        name: users.name
      }
    })
    .from(stockMovements)
    .leftJoin(users, eq(stockMovements.createdById, users.id))
    .where(and(...conditions))
    .orderBy(desc(stockMovements.createdAt))
    .limit(limit)
    .offset(offset);

  // Get total count
  const countResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(stockMovements)
    .where(and(...conditions));
  const total = countResult[0]?.count || 0;

  return c.json({
    data: {
      stockItem: stockItem[0],
      movements: movements.map((m: any) => ({
        ...m.movement,
        createdBy: m.createdBy
      }))
    },
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  });
});
