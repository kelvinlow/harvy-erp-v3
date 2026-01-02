# 🚀 Quick Start: Authentication Setup

## Initial Setup (One-time)

### 1. Apply Database Migrations

```bash
cd worker

# Local database
npx wrangler d1 migrations apply havys-erp-db --local

# Remote database (for production)
npx wrangler d1 migrations apply havys-erp-db --remote
```

### 2. Create Admin User

```bash
# Generate password hash
node generate-hash.js "YourSecurePassword123!"

# Copy the hash from output, then run:
npx wrangler d1 execute havys-erp-db --local --command "UPDATE users SET password_hash='<paste-hash-here>' WHERE email='admin@havys.com'"
```

### 3. Start Development Server

```bash
npx wrangler dev --local
```

## Testing Authentication

### Login

```bash
curl -X POST http://localhost:8787/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@havys.com",
    "password": "YourSecurePassword123!"
  }'
```

Save the token from the response!

### Get Current User

```bash
curl http://localhost:8787/api/v1/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Access Protected Endpoint

```bash
curl http://localhost:8787/api/v1/users \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Create New User (Admin Only)

```bash
curl -X POST http://localhost:8787/api/v1/auth/register \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@havys.com",
    "password": "User123!",
    "name": "Regular User",
    "role": "user",
    "department": "Sales"
  }'
```

### Change Password

```bash
curl -X POST http://localhost:8787/api/v1/auth/change-password \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "OldPassword123!",
    "newPassword": "NewPassword123!"
  }'
```

### Logout

```bash
curl -X POST http://localhost:8787/api/v1/auth/logout \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Adding Auth to Your Routes

### Example: Protect a Route

```typescript
import { requireAuth } from '../middleware/auth';

// Before (no auth)
stockItemsRoute.get('/', async (c) => {
  const db = c.get('db');
  const result = await db.select().from(stockItems);
  return c.json({ data: result });
});

// After (with auth)
stockItemsRoute.get('/', requireAuth(), async (c) => {
  const db = c.get('db');
  const user = c.get('user'); // User is now available!
  const result = await db.select().from(stockItems);
  return c.json({ data: result });
});
```

### Example: Admin-Only Route

```typescript
import { requireAdmin } from '../middleware/auth';

stockItemsRoute.delete('/:id', requireAdmin(), async (c) => {
  // Only admins can delete stock items
  const db = c.get('db');
  const id = parseInt(c.req.param('id'));
  await db.delete(stockItems).where(eq(stockItems.id, id));
  return c.json({ message: 'Deleted' });
});
```

### Example: Role-Based Access

```typescript
import { requireRole } from '../middleware/auth';

// Allow both admins and managers
purchaseOrdersRoute.patch(
  '/:id/approve',
  requireRole('admin', 'manager'),
  async (c) => {
    // Approve PO logic
  }
);
```

### Example: Custom Permission

```typescript
import { requirePermission } from '../middleware/auth';

purchaseRequisitionsRoute.put(
  '/:id',
  requirePermission(async (c) => {
    const user = c.get('user');
    const id = parseInt(c.req.param('id'));
    const db = c.get('db');

    // Get the PR
    const pr = await db
      .select()
      .from(purchaseRequisitions)
      .where(eq(purchaseRequisitions.id, id));

    if (pr.length === 0) return false;

    // Allow if user is admin or the requester
    return user.role === 'admin' || pr[0].requestedById === user.id;
  }),
  async (c) => {
    // Update PR logic
  }
);
```

## Production Deployment

### 1. Update JWT Secret

Edit `wrangler.toml`:

```toml
[env.production]
vars = {
  ENVIRONMENT = "production",
  JWT_SECRET = "use-a-very-long-random-string-at-least-32-characters-long"
}
```

Generate a secure secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 2. Deploy

```bash
# Apply migrations to production
npx wrangler d1 migrations apply havys-erp-db --remote

# Deploy worker
npx wrangler deploy
```

### 3. Create Production Admin

```bash
# Generate hash
node generate-hash.js "ProductionAdminPassword123!"

# Update remote database
npx wrangler d1 execute havys-erp-db --remote --command "UPDATE users SET password_hash='<hash>' WHERE email='admin@havys.com'"
```

## Common Issues

### "Invalid credentials"

- Check password is correct
- Verify user exists: `npx wrangler d1 execute havys-erp-db --local --command "SELECT * FROM users WHERE email='admin@havys.com'"`
- Ensure user status is 'active'

### "Unauthorized"

- Check token is included in Authorization header
- Verify token hasn't expired (7 days)
- Try logging in again to get a new token

### "Forbidden"

- User doesn't have required role
- Check user role: `GET /api/v1/auth/me`

## Security Checklist

Before going to production:

- [ ] Change JWT_SECRET to a secure random string
- [ ] Change admin password
- [ ] Review CORS settings in `src/index.ts`
- [ ] Enable HTTPS (automatic with Cloudflare)
- [ ] Set up monitoring
- [ ] Test all auth flows
- [ ] Document your API for frontend team

## Frontend Integration Example

```typescript
// Login function
async function login(email: string, password: string) {
  const response = await fetch(
    'https://your-worker.workers.dev/api/v1/auth/login',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    }
  );

  const data = await response.json();

  if (response.ok) {
    // Store token
    localStorage.setItem('token', data.data.token);
    localStorage.setItem('user', JSON.stringify(data.data.user));
    return data.data;
  } else {
    throw new Error(data.error);
  }
}

// Authenticated API call
async function fetchUsers() {
  const token = localStorage.getItem('token');

  const response = await fetch('https://your-worker.workers.dev/api/v1/users', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (response.status === 401) {
    // Token expired, redirect to login
    window.location.href = '/login';
    return;
  }

  return response.json();
}
```

## Need Help?

Check the full documentation:

- `README.md` - Complete API reference
- `AUTH_IMPLEMENTATION.md` - Detailed implementation guide
