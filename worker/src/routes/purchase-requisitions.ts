import { Hono } from 'hono';
import { eq, desc, sql, and, gte, lte } from 'drizzle-orm';
import { Env } from '../types/env';
import {
  purchaseRequisitions,
  prItems,
  users,
  purchaseOrders,
  NewPRItem
} from '../db/schema';
import { Database } from '../db';

export const purchaseRequisitionsRoute = new Hono<{ Bindings: Env }>();

// Generate PR number
async function generatePRNumber(db: Database): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = `PR-${year}-`;

  const lastPR = await db
    .select()
    .from(purchaseRequisitions)
    .where(sql`${purchaseRequisitions.prNumber} LIKE ${prefix + '%'}`)
    .orderBy(desc(purchaseRequisitions.id))
    .limit(1);

  let nextNumber = 1;
  if (lastPR.length > 0) {
    const lastNumber = parseInt(lastPR[0].prNumber.replace(prefix, ''));
    nextNumber = lastNumber + 1;
  }

  return `${prefix}${nextNumber.toString().padStart(5, '0')}`;
}

// Get all purchase requisitions with optional filters
purchaseRequisitionsRoute.get('/', async (c) => {
  const db = c.get('db');
  const status = c.req.query('status');
  const department = c.req.query('department');
  const startDate = c.req.query('startDate');
  const endDate = c.req.query('endDate');
  const page = parseInt(c.req.query('page') || '1');
  const limit = parseInt(c.req.query('limit') || '50');

  const offset = (page - 1) * limit;

  // Build conditions
  const conditions = [];
  if (status) {
    conditions.push(eq(purchaseRequisitions.status, status as any));
  }
  if (department) {
    conditions.push(eq(purchaseRequisitions.department, department));
  }
  if (startDate) {
    conditions.push(gte(purchaseRequisitions.createdAt, new Date(startDate)));
  }
  if (endDate) {
    conditions.push(lte(purchaseRequisitions.createdAt, new Date(endDate)));
  }

  const baseQuery = db
    .select({
      pr: purchaseRequisitions,
      requestedBy: {
        id: users.id,
        name: users.name,
        email: users.email
      },
      poNumber: purchaseOrders.poNumber
    })
    .from(purchaseRequisitions)
    .leftJoin(users, eq(purchaseRequisitions.requestedById, users.id))
    .leftJoin(purchaseOrders, eq(purchaseRequisitions.id, purchaseOrders.prId));

  let query: any = baseQuery;

  if (conditions.length > 0) {
    query = query.where(and(...conditions)) as typeof query;
  }

  query = query
    .orderBy(desc(purchaseRequisitions.createdAt))
    .limit(limit)
    .offset(offset) as typeof query;

  const result = await query;

  // Get total count
  const countResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(purchaseRequisitions);
  const total = countResult[0]?.count || 0;

  return c.json({
    data: (result as any[]).map((r: any) => ({
      ...r.pr,
      requestedBy: r.requestedBy,
      poNumber: r.poNumber
    })),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  });
});

// Get PR by ID with items
purchaseRequisitionsRoute.get('/:id', async (c) => {
  const db = c.get('db');
  const id = parseInt(c.req.param('id'));

  const prResult = await db
    .select({
      pr: purchaseRequisitions,
      requestedBy: {
        id: users.id,
        name: users.name,
        email: users.email
      }
    })
    .from(purchaseRequisitions)
    .leftJoin(users, eq(purchaseRequisitions.requestedById, users.id))
    .where(eq(purchaseRequisitions.id, id));

  if (prResult.length === 0) {
    return c.json({ error: 'Purchase requisition not found' }, 404);
  }

  const items = await db.select().from(prItems).where(eq(prItems.prId, id));

  return c.json({
    data: {
      ...prResult[0].pr,
      requestedBy: prResult[0].requestedBy,
      items
    }
  });
});

// Create PR with items
purchaseRequisitionsRoute.post('/', async (c) => {
  const db = c.get('db');
  const body = await c.req.json<{
    title?: string;
    requestedById: number;
    department: string;
    departmentCode?: string;
    company: string;
    urgency?: 'Low' | 'Medium' | 'High' | 'Critical';
    currency?: string;
    notes?: string;
    employeeNo?: string;
    employeeName?: string;
    referenceNo?: string;
    items: (Omit<NewPRItem, 'id' | 'prId' | 'createdAt'> & {
      station?: string;
    })[];
  }>();

  const prNumber = await generatePRNumber(db);

  // Calculate total amount
  const totalAmount = body.items.reduce(
    (sum, item) => sum + item.totalPrice,
    0
  );

  // Insert PR
  const prResult = await db
    .insert(purchaseRequisitions)
    .values({
      prNumber,
      title: body.title || `Requisition for ${body.department}`,
      status: 'PENDING',
      requestedById: body.requestedById,
      department: body.department,
      departmentCode: body.departmentCode,
      company: body.company,
      urgency: body.urgency || 'Medium',
      employeeNo: body.employeeNo,
      employeeName: body.employeeName,
      referenceNo: body.referenceNo,
      totalAmount,
      currency: body.currency || 'MYR',
      notes: body.notes
    })
    .returning();

  const pr = prResult[0];

  // Insert items
  if (body.items.length > 0) {
    await db.insert(prItems).values(
      body.items.map((item) => ({
        prId: pr.id,
        stockCode: item.stockCode,
        description: item.description,
        quantity: item.quantity,
        uom: item.uom,
        unitPrice: item.unitPrice,
        discount: item.discount || 0,
        taxCode: item.taxCode,
        taxRate: item.taxRate || 0,
        totalPrice: item.totalPrice,
        station: item.station
      }))
    );
  }

  const items = await db.select().from(prItems).where(eq(prItems.prId, pr.id));

  return c.json(
    {
      data: {
        ...pr,
        items
      }
    },
    201
  );
});

// Update PR
purchaseRequisitionsRoute.put('/:id', async (c) => {
  const db = c.get('db');
  const id = parseInt(c.req.param('id'));
  const body = await c.req.json<{
    title?: string;
    department?: string;
    company?: string;
    urgency?: 'Low' | 'Medium' | 'High' | 'Critical';
    currency?: string;
    notes?: string;
    items?: Omit<NewPRItem, 'id' | 'prId' | 'createdAt'>[];
  }>();

  // Check if PR exists and is editable
  const existing = await db
    .select()
    .from(purchaseRequisitions)
    .where(eq(purchaseRequisitions.id, id));
  if (existing.length === 0) {
    return c.json({ error: 'Purchase requisition not found' }, 404);
  }

  if (!['DRAFT', 'REJECTED'].includes(existing[0].status)) {
    return c.json(
      { error: 'Cannot edit PR that is not in DRAFT or REJECTED status' },
      400
    );
  }

  // Update PR
  const updates: any = {
    updatedAt: new Date()
  };
  if (body.title) updates.title = body.title;
  if (body.department) updates.department = body.department;
  if (body.company) updates.company = body.company;
  if (body.urgency) updates.urgency = body.urgency;
  if (body.currency) updates.currency = body.currency;
  if (body.notes !== undefined) updates.notes = body.notes;

  // Update items if provided
  if (body.items) {
    // Delete existing items
    await db.delete(prItems).where(eq(prItems.prId, id));

    // Insert new items
    if (body.items.length > 0) {
      await db.insert(prItems).values(
        body.items.map((item) => ({
          prId: id,
          stockCode: item.stockCode,
          description: item.description,
          quantity: item.quantity,
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

  const prResult = await db
    .update(purchaseRequisitions)
    .set(updates)
    .where(eq(purchaseRequisitions.id, id))
    .returning();

  const items = await db.select().from(prItems).where(eq(prItems.prId, id));

  return c.json({
    data: {
      ...prResult[0],
      items
    }
  });
});

// Update PR status
purchaseRequisitionsRoute.patch('/:id/status', async (c) => {
  const db = c.get('db');
  const id = parseInt(c.req.param('id'));
  const body = await c.req.json<{ status: string; approvedById?: number }>();

  const validStatuses = [
    'DRAFT',
    'PENDING',
    'APPROVED',
    'REJECTED',
    'CANCELLED',
    'COMPLETED'
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
    .update(purchaseRequisitions)
    .set(updates)
    .where(eq(purchaseRequisitions.id, id))
    .returning();

  if (result.length === 0) {
    return c.json({ error: 'Purchase requisition not found' }, 404);
  }

  return c.json({ data: result[0] });
});

// Delete PR
purchaseRequisitionsRoute.delete('/:id', async (c) => {
  const db = c.get('db');
  const id = parseInt(c.req.param('id'));

  // Check if PR exists and is deletable
  const existing = await db
    .select()
    .from(purchaseRequisitions)
    .where(eq(purchaseRequisitions.id, id));
  if (existing.length === 0) {
    return c.json({ error: 'Purchase requisition not found' }, 404);
  }

  if (!['DRAFT', 'CANCELLED'].includes(existing[0].status)) {
    return c.json(
      { error: 'Cannot delete PR that is not in DRAFT or CANCELLED status' },
      400
    );
  }

  // Items will be cascade deleted due to foreign key constraint
  await db.delete(purchaseRequisitions).where(eq(purchaseRequisitions.id, id));

  return c.json({ message: 'Purchase requisition deleted successfully' });
});
