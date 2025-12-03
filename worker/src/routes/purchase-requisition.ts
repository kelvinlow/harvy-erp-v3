import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { purchaseRequisitions, prItems } from '../db/schema';
import { eq, desc } from 'drizzle-orm';

export const purchaseRequisitionRouter = router({
  // Get all purchase requisitions
  list: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(10),
        offset: z.number().min(0).default(0),
        status: z.string().optional()
      })
    )
    .query(async ({ ctx, input }) => {
      const { db } = ctx;
      const { limit, offset, status } = input;

      let query = db
        .select()
        .from(purchaseRequisitions)
        .orderBy(desc(purchaseRequisitions.createdAt))
        .limit(limit)
        .offset(offset);

      if (status) {
        query = query.where(eq(purchaseRequisitions.status, status)) as any;
      }

      const results = await query;
      return {
        data: results,
        total: results.length,
        limit,
        offset
      };
    }),

  // Get single purchase requisition with items
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const { db } = ctx;

      const [pr] = await db
        .select()
        .from(purchaseRequisitions)
        .where(eq(purchaseRequisitions.id, input.id))
        .limit(1);

      if (!pr) {
        throw new Error('Purchase requisition not found');
      }

      const items = await db
        .select()
        .from(prItems)
        .where(eq(prItems.prId, input.id));

      return {
        ...pr,
        items
      };
    }),

  // Create new purchase requisition
  create: publicProcedure
    .input(
      z.object({
        title: z.string().min(1),
        department: z.string(),
        company: z.string(),
        urgency: z.enum(['Low', 'Medium', 'High']),
        requestedById: z.number(),
        notes: z.string().optional(),
        items: z.array(
          z.object({
            stockCode: z.string(),
            description: z.string(),
            quantity: z.number(),
            uom: z.string(),
            unitPrice: z.number(),
            totalPrice: z.number()
          })
        )
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;
      const { items, ...prData } = input;

      // Generate PR number
      const prNumber = `PR${Date.now()}`;

      // Calculate total
      const totalAmount = items.reduce((sum, item) => sum + item.totalPrice, 0);

      // Insert PR
      const [newPR] = await db
        .insert(purchaseRequisitions)
        .values({
          ...prData,
          prNumber,
          totalAmount,
          status: 'DRAFT'
        })
        .returning();

      // Insert items
      if (items.length > 0) {
        await db.insert(prItems).values(
          items.map((item) => ({
            ...item,
            prId: newPR.id
          }))
        );
      }

      return {
        success: true,
        data: newPR
      };
    }),

  // Update status
  updateStatus: publicProcedure
    .input(
      z.object({
        id: z.number(),
        status: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;

      const [updated] = await db
        .update(purchaseRequisitions)
        .set({
          status: input.status,
          updatedAt: new Date()
        })
        .where(eq(purchaseRequisitions.id, input.id))
        .returning();

      return {
        success: true,
        data: updated
      };
    })
});
