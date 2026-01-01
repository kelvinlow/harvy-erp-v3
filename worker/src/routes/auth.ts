import { Hono } from 'hono';
import { eq } from 'drizzle-orm';
import { Env } from '../types/env';
import { users, sessions } from '../db/schema';
import {
  hashPassword,
  verifyPassword,
  generateToken,
  generateSessionId
} from '../utils/auth';

export const authRoute = new Hono<{ Bindings: Env }>();

// Login
authRoute.post('/login', async (c) => {
  const db = c.get('db');
  const body = await c.req.json<{ email: string; password: string }>();

  if (!body.email || !body.password) {
    return c.json({ error: 'Email and password are required' }, 400);
  }

  // Find user by email
  const result = await db
    .select()
    .from(users)
    .where(eq(users.email, body.email.toLowerCase()));

  if (result.length === 0) {
    return c.json({ error: 'Invalid credentials' }, 401);
  }

  const user = result[0];

  // Check if user is active
  if (user.status !== 'active') {
    return c.json({ error: 'Account is disabled' }, 403);
  }

  // Verify password
  if (!user.passwordHash) {
    return c.json(
      { error: 'Password not set. Please contact administrator.' },
      401
    );
  }

  const isValid = await verifyPassword(body.password, user.passwordHash);
  if (!isValid) {
    return c.json({ error: 'Invalid credentials' }, 401);
  }

  // Generate session
  const sessionId = generateSessionId();
  const token = await generateToken(
    { userId: user.id, sessionId },
    c.env.JWT_SECRET
  );

  // Calculate expiry (7 days)
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  // Store session in database
  await db.insert(sessions).values({
    id: sessionId,
    userId: user.id,
    token,
    expiresAt,
    userAgent: c.req.header('User-Agent') || null,
    ipAddress:
      c.req.header('CF-Connecting-IP') ||
      c.req.header('X-Forwarded-For') ||
      null
  });

  // Update last login
  await db
    .update(users)
    .set({ lastLoginAt: new Date() })
    .where(eq(users.id, user.id));

  return c.json({
    data: {
      token,
      expiresAt: expiresAt.toISOString(),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        department: user.department
      }
    }
  });
});

// Logout
authRoute.post('/logout', async (c) => {
  const db = c.get('db');
  const authHeader = c.req.header('Authorization');

  if (!authHeader?.startsWith('Bearer ')) {
    return c.json({ message: 'Logged out' });
  }

  const token = authHeader.substring(7);

  // Delete session
  await db.delete(sessions).where(eq(sessions.token, token));

  return c.json({ message: 'Logged out successfully' });
});

// Get current user
authRoute.get('/me', async (c) => {
  const user = c.get('user');

  if (!user) {
    return c.json({ error: 'Not authenticated' }, 401);
  }

  return c.json({
    data: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      department: user.department
    }
  });
});

// Change password
authRoute.post('/change-password', async (c) => {
  const db = c.get('db');
  const user = c.get('user');

  if (!user) {
    return c.json({ error: 'Not authenticated' }, 401);
  }

  const body = await c.req.json<{
    currentPassword: string;
    newPassword: string;
  }>();

  if (!body.currentPassword || !body.newPassword) {
    return c.json(
      { error: 'Current password and new password are required' },
      400
    );
  }

  if (body.newPassword.length < 8) {
    return c.json({ error: 'Password must be at least 8 characters' }, 400);
  }

  // Get full user with password hash
  const result = await db.select().from(users).where(eq(users.id, user.id));
  if (result.length === 0) {
    return c.json({ error: 'User not found' }, 404);
  }

  const fullUser = result[0];

  // Verify current password
  if (fullUser.passwordHash) {
    const isValid = await verifyPassword(
      body.currentPassword,
      fullUser.passwordHash
    );
    if (!isValid) {
      return c.json({ error: 'Current password is incorrect' }, 401);
    }
  }

  // Hash and update new password
  const newPasswordHash = await hashPassword(body.newPassword);
  await db
    .update(users)
    .set({ passwordHash: newPasswordHash, updatedAt: new Date() })
    .where(eq(users.id, user.id));

  return c.json({ message: 'Password changed successfully' });
});

// Refresh token (extend session)
authRoute.post('/refresh', async (c) => {
  const db = c.get('db');
  const user = c.get('user');
  const session = c.get('session');

  if (!user || !session) {
    return c.json({ error: 'Not authenticated' }, 401);
  }

  // Generate new token
  const newToken = await generateToken(
    { userId: user.id, sessionId: session.id },
    c.env.JWT_SECRET
  );
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  // Update session
  await db
    .update(sessions)
    .set({ token: newToken, expiresAt })
    .where(eq(sessions.id, session.id));

  return c.json({
    data: {
      token: newToken,
      expiresAt: expiresAt.toISOString()
    }
  });
});

// Register (admin only - for creating new users with password)
authRoute.post('/register', async (c) => {
  const db = c.get('db');
  const currentUser = c.get('user');

  // Only admins can register new users
  if (!currentUser || currentUser.role !== 'admin') {
    return c.json({ error: 'Unauthorized' }, 403);
  }

  const body = await c.req.json<{
    email: string;
    password: string;
    name: string;
    role?: string;
    department?: string;
  }>();

  if (!body.email || !body.password || !body.name) {
    return c.json({ error: 'Email, password, and name are required' }, 400);
  }

  if (body.password.length < 8) {
    return c.json({ error: 'Password must be at least 8 characters' }, 400);
  }

  // Check if email already exists
  const existing = await db
    .select()
    .from(users)
    .where(eq(users.email, body.email.toLowerCase()));
  if (existing.length > 0) {
    return c.json({ error: 'Email already registered' }, 409);
  }

  // Hash password
  const passwordHash = await hashPassword(body.password);

  // Create user
  const result = await db
    .insert(users)
    .values({
      email: body.email.toLowerCase(),
      name: body.name,
      passwordHash,
      role: (body.role as 'admin' | 'user' | 'manager') || 'user',
      department: body.department,
      status: 'active'
    })
    .returning();

  const newUser = result[0];

  return c.json(
    {
      data: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        department: newUser.department
      }
    },
    201
  );
});
