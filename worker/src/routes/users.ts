import { Hono } from 'hono';
import { eq } from 'drizzle-orm';
import { Env } from '../types/env';
import { users, NewUser } from '../db/schema';

export const usersRoute = new Hono<{ Bindings: Env }>();

// Get all users
usersRoute.get('/', async (c) => {
  const db = c.get('db');
  const result = await db.select().from(users);
  return c.json({ data: result });
});

// Get user by ID
usersRoute.get('/:id', async (c) => {
  const db = c.get('db');
  const id = parseInt(c.req.param('id'));

  const result = await db.select().from(users).where(eq(users.id, id));

  if (result.length === 0) {
    return c.json({ error: 'User not found' }, 404);
  }

  return c.json({ data: result[0] });
});

// Create user
usersRoute.post('/', async (c) => {
  const db = c.get('db');
  const body = await c.req.json<
    Omit<NewUser, 'id' | 'createdAt' | 'updatedAt'>
  >();

  const result = await db
    .insert(users)
    .values({
      email: body.email,
      name: body.name,
      role: body.role || 'user',
      department: body.department
    })
    .returning();

  return c.json({ data: result[0] }, 201);
});

// Update user
usersRoute.put('/:id', async (c) => {
  const db = c.get('db');
  const id = parseInt(c.req.param('id'));
  const body = await c.req.json<Partial<NewUser>>();

  const result = await db
    .update(users)
    .set({
      ...body,
      updatedAt: new Date()
    })
    .where(eq(users.id, id))
    .returning();

  if (result.length === 0) {
    return c.json({ error: 'User not found' }, 404);
  }

  return c.json({ data: result[0] });
});

// Delete user
usersRoute.delete('/:id', async (c) => {
  const db = c.get('db');
  const id = parseInt(c.req.param('id'));

  const result = await db.delete(users).where(eq(users.id, id)).returning();

  if (result.length === 0) {
    return c.json({ error: 'User not found' }, 404);
  }

  return c.json({ message: 'User deleted successfully' });
});
