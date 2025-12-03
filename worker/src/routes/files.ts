import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { attachments } from '../db/schema';
import { eq } from 'drizzle-orm';

export const fileRouter = router({
  // Upload file to R2
  upload: publicProcedure
    .input(
      z.object({
        fileName: z.string(),
        fileContent: z.string(), // base64 encoded
        mimeType: z.string(),
        uploadedById: z.number(),
        relatedType: z.string().optional(),
        relatedId: z.number().optional()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { r2, db } = ctx;

      // Decode base64 content
      const fileBuffer = Uint8Array.from(atob(input.fileContent), (c) =>
        c.charCodeAt(0)
      );

      // Generate unique key
      const fileKey = `${Date.now()}-${input.fileName}`;

      // Upload to R2
      await r2.put(fileKey, fileBuffer, {
        httpMetadata: {
          contentType: input.mimeType
        }
      });

      // Save metadata to D1
      const [attachment] = await db
        .insert(attachments)
        .values({
          fileName: input.fileName,
          fileKey,
          fileSize: fileBuffer.length,
          mimeType: input.mimeType,
          uploadedById: input.uploadedById,
          relatedType: input.relatedType,
          relatedId: input.relatedId
        })
        .returning();

      return {
        success: true,
        data: attachment
      };
    }),

  // Get file download URL
  getDownloadUrl: publicProcedure
    .input(z.object({ fileKey: z.string() }))
    .query(async ({ ctx, input }) => {
      const { r2 } = ctx;

      const object = await r2.get(input.fileKey);

      if (!object) {
        throw new Error('File not found');
      }

      // For production, you'd generate a signed URL
      // For now, we'll return the object metadata
      return {
        success: true,
        fileKey: input.fileKey,
        size: object.size,
        uploaded: object.uploaded
      };
    }),

  // List files by related entity
  listByRelated: publicProcedure
    .input(
      z.object({
        relatedType: z.string(),
        relatedId: z.number()
      })
    )
    .query(async ({ ctx, input }) => {
      const { db } = ctx;

      const files = await db
        .select()
        .from(attachments)
        .where(eq(attachments.relatedType, input.relatedType))
        .where(eq(attachments.relatedId, input.relatedId));

      return {
        data: files
      };
    }),

  // Delete file
  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const { db, r2 } = ctx;

      // Get file metadata
      const [file] = await db
        .select()
        .from(attachments)
        .where(eq(attachments.id, input.id))
        .limit(1);

      if (!file) {
        throw new Error('File not found');
      }

      // Delete from R2
      await r2.delete(file.fileKey);

      // Delete from D1
      await db.delete(attachments).where(eq(attachments.id, input.id));

      return {
        success: true
      };
    })
});
