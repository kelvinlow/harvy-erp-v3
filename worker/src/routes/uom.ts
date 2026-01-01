import { Hono } from 'hono';
import { eq, asc, like, or } from 'drizzle-orm';
import { Env } from '../types/env';
import { unitsOfMeasure, NewUOM } from '../db/schema';

export const uomRoute = new Hono<{ Bindings: Env }>();

// Get all UOMs with optional search
uomRoute.get('/', async (c) => {
  const db = c.get('db');
  const search = c.req.query('search');

  let query = db.select().from(unitsOfMeasure);

  if (search) {
    query = query.where(
      or(
        like(unitsOfMeasure.code, `%${search}%`),
        like(unitsOfMeasure.description, `%${search}%`)
      )
    ) as typeof query;
  }

  query = query.orderBy(asc(unitsOfMeasure.code)) as typeof query;

  const result = await query;

  return c.json({ data: result });
});

// Create UOM
uomRoute.post('/', async (c) => {
  const db = c.get('db');
  const body = await c.req.json<NewUOM>();

  const existing = await db
    .select()
    .from(unitsOfMeasure)
    .where(eq(unitsOfMeasure.code, body.code));

  if (existing.length > 0) {
    return c.json({ error: 'UOM code already exists' }, 409);
  }

  const result = await db
    .insert(unitsOfMeasure)
    .values({
      code: body.code,
      description: body.description
    })
    .returning();

  return c.json({ data: result[0] }, 201);
});

// Update UOM
uomRoute.put('/:id', async (c) => {
  const db = c.get('db');
  const id = parseInt(c.req.param('id'));
  const body = await c.req.json<Partial<NewUOM>>();

  const result = await db
    .update(unitsOfMeasure)
    .set({
      ...body,
      updatedAt: new Date()
    })
    .where(eq(unitsOfMeasure.id, id))
    .returning();

  if (result.length === 0) {
    return c.json({ error: 'UOM not found' }, 404);
  }

  return c.json({ data: result[0] });
});

// Delete UOM
uomRoute.delete('/:id', async (c) => {
  const db = c.get('db');
  const id = parseInt(c.req.param('id'));

  const result = await db
    .delete(unitsOfMeasure)
    .where(eq(unitsOfMeasure.id, id))
    .returning();

  if (result.length === 0) {
    return c.json({ error: 'UOM not found' }, 404);
  }

  return c.json({ message: 'UOM deleted successfully' });
});
