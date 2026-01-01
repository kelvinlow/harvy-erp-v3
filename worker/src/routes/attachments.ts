import { Hono } from 'hono';
import { eq, and } from 'drizzle-orm';
import { Env } from '../types/env';
import { attachments, users, NewAttachment } from '../db/schema';
import { nanoid } from '../utils/nanoid';

export const attachmentsRoute = new Hono<{ Bindings: Env }>();

// Get attachments by related entity
attachmentsRoute.get('/', async (c) => {
  const db = c.get('db');
  const relatedType = c.req.query('relatedType');
  const relatedId = c.req.query('relatedId');

  if (!relatedType || !relatedId) {
    return c.json({ error: 'relatedType and relatedId are required' }, 400);
  }

  const result = await db
    .select({
      attachment: attachments,
      uploadedBy: {
        id: users.id,
        name: users.name
      }
    })
    .from(attachments)
    .leftJoin(users, eq(attachments.uploadedById, users.id))
    .where(
      and(
        eq(attachments.relatedType, relatedType),
        eq(attachments.relatedId, parseInt(relatedId))
      )
    );

  return c.json({
    data: result.map((r) => ({
      ...r.attachment,
      uploadedBy: r.uploadedBy
    }))
  });
});

// Get attachment by ID
attachmentsRoute.get('/:id', async (c) => {
  const db = c.get('db');
  const id = parseInt(c.req.param('id'));

  const result = await db
    .select({
      attachment: attachments,
      uploadedBy: {
        id: users.id,
        name: users.name
      }
    })
    .from(attachments)
    .leftJoin(users, eq(attachments.uploadedById, users.id))
    .where(eq(attachments.id, id));

  if (result.length === 0) {
    return c.json({ error: 'Attachment not found' }, 404);
  }

  return c.json({
    data: {
      ...result[0].attachment,
      uploadedBy: result[0].uploadedBy
    }
  });
});

// Upload file to R2 and create attachment record
attachmentsRoute.post('/upload', async (c) => {
  const db = c.get('db');
  const bucket = c.env.BUCKET;

  const formData = await c.req.formData();
  const file = formData.get('file') as File;
  const uploadedById = formData.get('uploadedById') as string;
  const relatedType = formData.get('relatedType') as string | null;
  const relatedId = formData.get('relatedId') as string | null;

  if (!file || !uploadedById) {
    return c.json({ error: 'file and uploadedById are required' }, 400);
  }

  // Generate unique file key
  const fileExt = file.name.split('.').pop() || '';
  const fileKey = `${relatedType || 'general'}/${nanoid()}.${fileExt}`;

  // Upload to R2
  await bucket.put(fileKey, file.stream(), {
    httpMetadata: {
      contentType: file.type
    },
    customMetadata: {
      originalName: file.name,
      uploadedById
    }
  });

  // Create attachment record
  const result = await db
    .insert(attachments)
    .values({
      fileName: file.name,
      fileKey,
      fileSize: file.size,
      mimeType: file.type,
      uploadedById: parseInt(uploadedById),
      relatedType: relatedType || null,
      relatedId: relatedId ? parseInt(relatedId) : null
    })
    .returning();

  return c.json({ data: result[0] }, 201);
});

// Get download URL for attachment
attachmentsRoute.get('/:id/download', async (c) => {
  const db = c.get('db');
  const bucket = c.env.BUCKET;
  const id = parseInt(c.req.param('id'));

  const result = await db
    .select()
    .from(attachments)
    .where(eq(attachments.id, id));

  if (result.length === 0) {
    return c.json({ error: 'Attachment not found' }, 404);
  }

  const attachment = result[0];
  const object = await bucket.get(attachment.fileKey);

  if (!object) {
    return c.json({ error: 'File not found in storage' }, 404);
  }

  // Return the file directly
  const headers = new Headers();
  headers.set('Content-Type', attachment.mimeType);
  headers.set(
    'Content-Disposition',
    `attachment; filename="${attachment.fileName}"`
  );
  headers.set('Content-Length', attachment.fileSize.toString());

  return new Response(object.body, { headers });
});

// Delete attachment
attachmentsRoute.delete('/:id', async (c) => {
  const db = c.get('db');
  const bucket = c.env.BUCKET;
  const id = parseInt(c.req.param('id'));

  const result = await db
    .select()
    .from(attachments)
    .where(eq(attachments.id, id));

  if (result.length === 0) {
    return c.json({ error: 'Attachment not found' }, 404);
  }

  const attachment = result[0];

  // Delete from R2
  await bucket.delete(attachment.fileKey);

  // Delete record
  await db.delete(attachments).where(eq(attachments.id, id));

  return c.json({ message: 'Attachment deleted successfully' });
});

// Update attachment relation
attachmentsRoute.patch('/:id/relate', async (c) => {
  const db = c.get('db');
  const id = parseInt(c.req.param('id'));
  const body = await c.req.json<{ relatedType: string; relatedId: number }>();

  const result = await db
    .update(attachments)
    .set({
      relatedType: body.relatedType,
      relatedId: body.relatedId
    })
    .where(eq(attachments.id, id))
    .returning();

  if (result.length === 0) {
    return c.json({ error: 'Attachment not found' }, 404);
  }

  return c.json({ data: result[0] });
});
