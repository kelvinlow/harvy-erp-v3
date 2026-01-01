import { Context, Next } from 'hono';
import { eq, and, gt } from 'drizzle-orm';
import { Env, SafeUser } from '../types/env';
import { users, sessions } from '../db/schema';
import { verifyToken } from '../utils/auth';

type Role = 'admin' | 'manager' | 'user';

/**
 * Authentication middleware - validates JWT token and loads user
 * Does not block requests without auth - use requireAuth for that
 */
export async function authMiddleware(
  c: Context<{ Bindings: Env }>,
  next: Next
) {
  const authHeader = c.req.header('Authorization');

  c.set('user', null);
  c.set('session', null);

  if (!authHeader?.startsWith('Bearer ')) {
    return next();
  }

  const token = authHeader.substring(7);

  try {
    // Verify JWT token
    const payload = await verifyToken(token, c.env.JWT_SECRET);
    if (!payload) {
      return next();
    }

    const db = c.get('db');

    // Check session exists and is not expired
    const sessionResult = await db
      .select()
      .from(sessions)
      .where(
        and(
          eq(sessions.id, payload.sessionId),
          eq(sessions.token, token),
          gt(sessions.expiresAt, new Date())
        )
      );

    if (sessionResult.length === 0) {
      return next();
    }

    const session = sessionResult[0];

    // Load user
    const userResult = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
        department: users.department,
        status: users.status,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
        lastLoginAt: users.lastLoginAt
      })
      .from(users)
      .where(eq(users.id, session.userId));

    if (userResult.length === 0 || userResult[0].status !== 'active') {
      return next();
    }

    c.set('user', userResult[0] as SafeUser);
    c.set('session', session);

    // Update session last activity
    await db
      .update(sessions)
      .set({ lastActivityAt: new Date() })
      .where(eq(sessions.id, session.id));
  } catch (error) {
    console.error('Auth middleware error:', error);
  }

  return next();
}

/**
 * Middleware that requires authentication
 * Returns 401 if user is not authenticated
 */
export function requireAuth() {
  return async (c: Context<{ Bindings: Env }>, next: Next) => {
    const user = c.get('user');

    if (!user) {
      return c.json(
        {
          error: 'Unauthorized',
          message: 'Authentication required'
        },
        401
      );
    }

    return next();
  };
}

/**
 * Middleware that requires specific role(s)
 * Returns 403 if user doesn't have required role
 */
export function requireRole(...allowedRoles: Role[]) {
  return async (c: Context<{ Bindings: Env }>, next: Next) => {
    const user = c.get('user');

    if (!user) {
      return c.json(
        {
          error: 'Unauthorized',
          message: 'Authentication required'
        },
        401
      );
    }

    if (!allowedRoles.includes(user.role as Role)) {
      return c.json(
        {
          error: 'Forbidden',
          message: `This action requires one of the following roles: ${allowedRoles.join(
            ', '
          )}`
        },
        403
      );
    }

    return next();
  };
}

/**
 * Middleware that requires admin role
 */
export function requireAdmin() {
  return requireRole('admin');
}

/**
 * Middleware that requires admin or manager role
 */
export function requireManager() {
  return requireRole('admin', 'manager');
}

/**
 * Permission-based middleware
 * Allows custom permission checks based on resource ownership, etc.
 */
export function requirePermission(
  checkFn: (c: Context<{ Bindings: Env }>) => boolean | Promise<boolean>
) {
  return async (c: Context<{ Bindings: Env }>, next: Next) => {
    const user = c.get('user');

    if (!user) {
      return c.json(
        {
          error: 'Unauthorized',
          message: 'Authentication required'
        },
        401
      );
    }

    const hasPermission = await checkFn(c);

    if (!hasPermission) {
      return c.json(
        {
          error: 'Forbidden',
          message: 'You do not have permission to perform this action'
        },
        403
      );
    }

    return next();
  };
}

/**
 * Optional auth middleware - loads user if token present but doesn't block
 * Useful for public endpoints that behave differently for authenticated users
 */
export function optionalAuth() {
  return async (c: Context<{ Bindings: Env }>, next: Next) => {
    // Auth is already loaded by authMiddleware, just continue
    return next();
  };
}
