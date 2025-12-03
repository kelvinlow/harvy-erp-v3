import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { trpcServer } from '@hono/trpc-server';
import { drizzle } from 'drizzle-orm/d1';
import { appRouter } from './router';
import { createContext } from './trpc';
import * as schema from './db/schema';

// Define Cloudflare Worker bindings
export interface Env {
  DB: D1Database; // D1 database binding
  R2_BUCKET: R2Bucket; // R2 bucket binding
}

const app = new Hono<{ Bindings: Env }>();

// CORS middleware
app.use(
  '*',
  cors({
    origin: ['http://localhost:3000', 'https://your-production-domain.com'],
    credentials: true
  })
);

// Health check endpoint
app.get('/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// tRPC endpoint
app.use(
  '/trpc/*',
  trpcServer({
    router: appRouter,
    createContext: (opts, c) => {
      const db = drizzle(c.env.DB, { schema });
      return createContext(opts, c.env, db);
    }
  })
);

// Sample REST endpoint (Hono without tRPC)
app.get('/api/hello', (c) => {
  return c.json({ message: 'Hello from Cloudflare Worker!' });
});

// R2 file download endpoint (public access)
app.get('/files/:key', async (c) => {
  const key = c.req.param('key');
  const object = await c.env.R2_BUCKET.get(key);

  if (!object) {
    return c.json({ error: 'File not found' }, 404);
  }

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set('etag', object.httpEtag);

  return new Response(object.body, {
    headers
  });
});

// 404 handler
app.notFound((c) => {
  return c.json({ error: 'Not Found' }, 404);
});

// Error handler
app.onError((err, c) => {
  console.error('Error:', err);
  return c.json(
    {
      error: err.message || 'Internal Server Error'
    },
    500
  );
});

export default app;
