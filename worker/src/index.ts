import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import { secureHeaders } from 'hono/secure-headers';
import { timing } from 'hono/timing';

import { Env } from './types/env';
import { createDb } from './db';
import { authMiddleware } from './middleware/auth';

// Import routes
import { authRoute } from './routes/auth';
import { usersRoute } from './routes/users';
import { stockItemsRoute } from './routes/stock-items';
import { suppliersRoute } from './routes/suppliers';
import { purchaseRequisitionsRoute } from './routes/purchase-requisitions';
import { purchaseOrdersRoute } from './routes/purchase-orders';
import { stockMovementsRoute } from './routes/stock-movements';
import { attachmentsRoute } from './routes/attachments';
import { goodsReceivedNotesRoute } from './routes/grn';
import { internalTransfersRoute } from './routes/internal-transfers';
import { uomRoute } from './routes/uom';
import { staffRoute } from './routes/staff';

// Create Hono app
const app = new Hono<{ Bindings: Env }>();

// Global middleware
app.use('*', logger());
app.use('*', timing());
app.use('*', prettyJSON());
app.use('*', secureHeaders());
app.use(
  '*',
  cors({
    origin: [
      'http://localhost:3000',
      'https://havys-erp.pages.dev',
      'https://main.havys-erp-v3.pages.dev'
    ],
    allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    exposeHeaders: ['Content-Length'],
    maxAge: 86400,
    credentials: true
  })
);

// Database middleware - inject Drizzle instance into context
app.use('*', async (c, next) => {
  const db = createDb(c.env.DB);
  c.set('db', db);
  await next();
});

// Authentication middleware - loads user from JWT token if present
app.use('*', authMiddleware);

// Health check endpoint
app.get('/', (c) => {
  return c.json({
    name: 'Havys ERP API',
    version: '1.0.0',
    status: 'healthy',
    environment: c.env.ENVIRONMENT,
    timestamp: new Date().toISOString()
  });
});

// API routes
const api = app.basePath('/api/v1');

// Public auth routes (no auth required)
api.route('/auth', authRoute);

// Protected routes
api.route('/users', usersRoute);
api.route('/stock-items', stockItemsRoute);
api.route('/suppliers', suppliersRoute);
api.route('/purchase-requisitions', purchaseRequisitionsRoute);
api.route('/purchase-orders', purchaseOrdersRoute);
api.route('/stock-movements', stockMovementsRoute);
api.route('/attachments', attachmentsRoute);
api.route('/grn', goodsReceivedNotesRoute);
api.route('/internal-transfers', internalTransfersRoute);
api.route('/uom', uomRoute);
api.route('/staff', staffRoute);

// 404 handler
app.notFound((c) => {
  return c.json(
    {
      error: 'Not Found',
      message: `Route ${c.req.method} ${c.req.path} not found`
    },
    404
  );
});

// Error handler
app.onError((err, c) => {
  console.error('Error:', err);
  return c.json(
    {
      error: 'Internal Server Error',
      message:
        c.env.ENVIRONMENT === 'development'
          ? err.message
          : 'Something went wrong'
    },
    500
  );
});

export default app;
