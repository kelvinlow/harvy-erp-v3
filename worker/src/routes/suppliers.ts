import { Hono } from 'hono';
import { eq, like, or, desc, asc, sql } from 'drizzle-orm';
import { Env } from '../types/env';
import { suppliers, NewSupplier } from '../db/schema';

export const suppliersRoute = new Hono<{ Bindings: Env }>();

// Get all suppliers with optional search and pagination
suppliersRoute.get('/', async (c) => {
  const db = c.get('db');
  const search = c.req.query('search');
  const status = c.req.query('status');
  const page = parseInt(c.req.query('page') || '1');
  const limit = parseInt(c.req.query('limit') || '50');

  const offset = (page - 1) * limit;

  let query = db.select().from(suppliers);

  // Apply search filter
  if (search) {
    query = query.where(
      or(
        like(suppliers.supplierCode, `%${search}%`),
        like(suppliers.name, `%${search}%`),
        like(suppliers.email, `%${search}%`)
      )
    ) as typeof query;
  }

  // Apply status filter
  if (status) {
    query = query.where(
      eq(suppliers.status, status as 'active' | 'inactive')
    ) as typeof query;
  }

  query = query
    .orderBy(asc(suppliers.name))
    .limit(limit)
    .offset(offset) as typeof query;

  const result = await query;

  // Get total count
  const countResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(suppliers);
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

// Get supplier by ID
suppliersRoute.get('/:id', async (c) => {
  const db = c.get('db');
  const id = parseInt(c.req.param('id'));

  const result = await db.select().from(suppliers).where(eq(suppliers.id, id));

  if (result.length === 0) {
    return c.json({ error: 'Supplier not found' }, 404);
  }

  return c.json({ data: result[0] });
});

// Create supplier
suppliersRoute.post('/', async (c) => {
  const db = c.get('db');
  const body = await c.req.json<
    Omit<NewSupplier, 'id' | 'createdAt' | 'updatedAt'>
  >();

  // Check if supplier code already exists
  const existing = await db
    .select()
    .from(suppliers)
    .where(eq(suppliers.supplierCode, body.supplierCode));
  if (existing.length > 0) {
    return c.json({ error: 'Supplier code already exists' }, 409);
  }

  const result = await db
    .insert(suppliers)
    .values({
      supplierCode: body.supplierCode,
      name: body.name,
      contactPerson: body.contactPerson,
      email: body.email,
      phone: body.phone,
      address: body.address,
      paymentTerms: body.paymentTerms,
      status: body.status || 'active'
    })
    .returning();

  return c.json({ data: result[0] }, 201);
});

// Update supplier
suppliersRoute.put('/:id', async (c) => {
  const db = c.get('db');
  const id = parseInt(c.req.param('id'));
  const body = await c.req.json<Partial<NewSupplier>>();

  const result = await db
    .update(suppliers)
    .set({
      ...body,
      updatedAt: new Date()
    })
    .where(eq(suppliers.id, id))
    .returning();

  if (result.length === 0) {
    return c.json({ error: 'Supplier not found' }, 404);
  }

  return c.json({ data: result[0] });
});

// Delete supplier
suppliersRoute.delete('/:id', async (c) => {
  const db = c.get('db');
  const id = parseInt(c.req.param('id'));

  const result = await db
    .delete(suppliers)
    .where(eq(suppliers.id, id))
    .returning();

  if (result.length === 0) {
    return c.json({ error: 'Supplier not found' }, 404);
  }

  return c.json({ message: 'Supplier deleted successfully' });
});

// Toggle supplier status
suppliersRoute.patch('/:id/status', async (c) => {
  const db = c.get('db');
  const id = parseInt(c.req.param('id'));
  const body = await c.req.json<{ status: 'active' | 'inactive' }>();

  const result = await db
    .update(suppliers)
    .set({
      status: body.status,
      updatedAt: new Date()
    })
    .where(eq(suppliers.id, id))
    .returning();

  if (result.length === 0) {
    return c.json({ error: 'Supplier not found' }, 404);
  }

  return c.json({ data: result[0] });
});
