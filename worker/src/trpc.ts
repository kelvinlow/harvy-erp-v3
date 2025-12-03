import { initTRPC } from '@trpc/server';
import { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';
import type { DrizzleD1Database } from 'drizzle-orm/d1';
import * as schema from './db/schema';

// Define the context type
export interface Context extends Record<string, unknown> {
  db: DrizzleD1Database<typeof schema>;
  r2: R2Bucket;
  env: Env;
}

// Create context from Cloudflare Worker bindings
export const createContext = (
  opts: FetchCreateContextFnOptions,
  env: Env,
  db: DrizzleD1Database<typeof schema>
): Context => {
  return {
    db,
    r2: env.R2_BUCKET,
    env
  };
};

// Initialize tRPC
const t = initTRPC.context<Context>().create();

// Export router and procedure helpers
export const router = t.router;
export const publicProcedure = t.procedure;
