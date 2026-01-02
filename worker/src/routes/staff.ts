import { Hono } from 'hono';
import { eq } from 'drizzle-orm';
import { Env } from '../types/env';
import { staff } from '../db/schema';

export const staffRoute = new Hono<{ Bindings: Env }>();

// Get all staff
staffRoute.get('/', async (c) => {
  const db = c.get('db');
  const result = await db.select().from(staff).all();
  return c.json({ data: result });
});

// Get staff by ID (integer) or Staff ID (string)
staffRoute.get('/:id', async (c) => {
  const db = c.get('db');
  const idParam = c.req.param('id');

  // Try to parse as integer
  let id = parseInt(idParam);
  let result;

  if (!isNaN(id)) {
    result = await db.select().from(staff).where(eq(staff.id, id)).get();
  }

  if (!result) {
    // Try finding by staffId
    result = await db
      .select()
      .from(staff)
      .where(eq(staff.staffId, idParam))
      .get();
  }

  if (!result) {
    return c.json({ error: 'Staff member not found' }, 404);
  }

  return c.json({ data: result });
});
