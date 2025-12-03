import { router } from './trpc';
import { purchaseRequisitionRouter } from './routes/purchase-requisition';
import { fileRouter } from './routes/files';

// Combine all routers
export const appRouter = router({
  purchaseRequisition: purchaseRequisitionRouter,
  files: fileRouter
});

// Export type definition for use in frontend
export type AppRouter = typeof appRouter;
