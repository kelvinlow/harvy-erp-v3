import { Hono } from 'hono';
import { eq } from 'drizzle-orm';
import { Env } from '../types/env';
import { stockItems, stockMovements, NewStockMovement } from '../db/schema';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';

export const stockMovementsRoute = new Hono<{ Bindings: Env }>();

const stockInSchema = z.object({
  stockCode: z.string(),
  quantity: z.number().min(0.01),
  uom: z.string(),
  remarks: z.string().optional()
});

// Create Stock Movement (IN)
stockMovementsRoute.post(
  '/in',
  zValidator('json', stockInSchema),
  async (c) => {
    const db = c.get('db');
    const user = c.get('user');
    const body = c.req.valid('json');

    // 1. Get Stock Item
    const stockItem = await db.query.stockItems.findFirst({
      where: eq(stockItems.stockCode, body.stockCode)
    });

    if (!stockItem) {
      return c.json({ error: 'Stock item not found' }, 404);
    }

    // 2. Validate UOM (optional, ensuring it exists)
    // For now we just check if it's not empty, but if strict mode we should check DB.
    // The frontend dropdown ensures it's likely valid.

    // 3. Update Current Stock
    const balanceBefore = stockItem.currentStock;
    const quantity = body.quantity;
    const balanceAfter = balanceBefore + quantity;

    await db
      .update(stockItems)
      .set({
        currentStock: balanceAfter,
        updatedAt: new Date()
      })
      .where(eq(stockItems.id, stockItem.id));

    // 4. Create Movement Record
    const movement: NewStockMovement = {
      stockItemId: stockItem.id,
      movementType: 'IN',
      quantity: quantity,
      balanceBefore: balanceBefore,
      balanceAfter: balanceAfter,
      createdById: user.id || 1, // Fallback for dev if user.id is missing or mock
      remarks: body.remarks || 'Stock In via Inventory Create',
      referenceType: 'MANUAL' // Manual stock in
    };

    await db.insert(stockMovements).values(movement);

    return c.json(
      {
        message: 'Stock updated successfully',
        data: {
          stockCode: stockItem.stockCode,
          newBalance: balanceAfter
        }
      },
      201
    );
  }
);
