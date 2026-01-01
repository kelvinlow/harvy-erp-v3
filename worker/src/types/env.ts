export interface Env {
  // D1 Database
  DB: D1Database;

  // R2 Bucket
  BUCKET: R2Bucket;

  // Environment variables
  ENVIRONMENT: string;

  // JWT Secret for authentication
  JWT_SECRET: string;
}

// User type without password hash for context
export type SafeUser = Omit<import('../db/schema').User, 'passwordHash'>;

// Extend Hono's context with our custom bindings
declare module 'hono' {
  interface ContextVariableMap {
    db: import('../db').Database;
    user: SafeUser | null;
    session: import('../db/schema').Session | null;
  }
}
