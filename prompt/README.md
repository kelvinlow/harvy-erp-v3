# Havys ERP API

Backend API for Havys ERP built with **Hono** and **Drizzle ORM** on **Cloudflare Workers**.

## Tech Stack

- **Runtime**: Cloudflare Workers
- **Framework**: Hono v4
- **ORM**: Drizzle ORM
- **Database**: Cloudflare D1 (SQLite)
- **Storage**: Cloudflare R2
- **Authentication**: JWT with PBKDF2 password hashing

## Features

✅ **Authentication & Authorization**

- JWT-based authentication
- PBKDF2 password hashing (100,000 iterations)
- Role-based access control (Admin, Manager, User)
- Session management with expiry
- Secure password change endpoint

✅ **Complete ERP Modules**

- User Management
- Stock/Inventory Management
- Supplier Management
- Purchase Requisitions (PR)
- Purchase Orders (PO)
- Goods Received Notes (GRN)
- Stock Movements & Ledger
- Internal Transfers
- File Attachments (R2 Storage)

## Project Structure

```
worker/
├── src/
│   ├── db/
│   │   ├── index.ts          # Database initialization
│   │   └── schema.ts         # Drizzle schema (14 tables)
│   ├── middleware/
│   │   └── auth.ts           # Auth middleware & guards
│   ├── routes/
│   │   ├── auth.ts           # Authentication endpoints
│   │   ├── users.ts          # Users API
│   │   ├── stock-items.ts    # Stock items API
│   │   ├── suppliers.ts      # Suppliers API
│   │   ├── purchase-requisitions.ts  # PR API
│   │   ├── purchase-orders.ts        # PO API
│   │   ├── stock-movements.ts        # Stock movements API
│   │   ├── attachments.ts    # File attachments API (R2)
│   │   ├── grn.ts           # Goods Received Notes API
│   │   └── internal-transfers.ts     # Internal transfers API
│   ├── types/
│   │   └── env.ts           # Environment bindings types
│   ├── utils/
│   │   ├── auth.ts          # Auth utilities (JWT, hashing)
│   │   └── nanoid.ts        # ID generator
│   └── index.ts             # Main Hono app entry point
├── migrations/              # Drizzle migrations
├── drizzle.config.ts       # Drizzle configuration
├── wrangler.toml           # Cloudflare Workers configuration
├── generate-hash.js        # Password hash generator
├── package.json
└── tsconfig.json
```

## Getting Started

### Prerequisites

- Node.js 18+
- Yarn
- Cloudflare account with D1 and R2 access

### Installation

```bash
cd worker
yarn install
```

### Database Setup

1. **Apply migrations to local D1:**

```bash
npx wrangler d1 migrations apply havys-erp-db --local
```

2. **Create initial admin user:**

First, generate a password hash:

```bash
node generate-hash.js "YourSecurePassword123!"
```

Then update the existing user with the hash:

```bash
npx wrangler d1 execute havys-erp-db --local --command "UPDATE users SET password_hash='<hash-from-above>' WHERE email='admin@havys.com'"
```

### Local Development

Start the development server:

```bash
yarn dev
# or
npx wrangler dev --local
```

The API will be available at `http://localhost:8787`

### Database Migrations

Generate new migrations after schema changes:

```bash
yarn db:generate
# or
npx drizzle-kit generate
```

Apply migrations to remote D1:

```bash
npx wrangler d1 migrations apply havys-erp-db --remote
```

## Authentication

### Login

```bash
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "admin@havys.com",
  "password": "YourPassword123!"
}

# Response:
{
  "data": {
    "token": "eyJhbGc...",
    "expiresAt": "2025-01-03T00:00:00.000Z",
    "user": {
      "id": 1,
      "email": "admin@havys.com",
      "name": "Admin User",
      "role": "admin",
      "department": null
    }
  }
}
```

### Using the Token

Include the JWT token in the Authorization header for protected endpoints:

```bash
GET /api/v1/users
Authorization: Bearer eyJhbGc...
```

### Auth Endpoints

- `POST /api/v1/auth/login` - Login with email/password
- `POST /api/v1/auth/logout` - Logout (invalidate session)
- `GET /api/v1/auth/me` - Get current user info
- `POST /api/v1/auth/change-password` - Change password
- `POST /api/v1/auth/refresh` - Refresh token (extend session)
- `POST /api/v1/auth/register` - Register new user (admin only)

## Authorization Middleware

### Available Guards

```typescript
import {
  requireAuth,
  requireRole,
  requireAdmin,
  requireManager
} from './middleware/auth';

// Require authentication
app.get('/protected', requireAuth(), async (c) => {
  const user = c.get('user'); // User is available
  // ...
});

// Require specific role
app.post('/admin-only', requireAdmin(), async (c) => {
  // Only admins can access
});

// Require one of multiple roles
app.post('/managers', requireRole('admin', 'manager'), async (c) => {
  // Admins and managers can access
});
```

### Roles

- **admin**: Full system access
- **manager**: Can manage operations
- **user**: Basic access

## API Endpoints

### Health Check

- `GET /` - API health status

### Authentication

- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/logout` - Logout
- `GET /api/v1/auth/me` - Get current user
- `POST /api/v1/auth/change-password` - Change password
- `POST /api/v1/auth/refresh` - Refresh token
- `POST /api/v1/auth/register` - Register user (admin only)

### Users

- `GET /api/v1/users` - List all users
- `GET /api/v1/users/:id` - Get user by ID
- `POST /api/v1/users` - Create user
- `PUT /api/v1/users/:id` - Update user
- `DELETE /api/v1/users/:id` - Delete user

### Stock Items

- `GET /api/v1/stock-items` - List stock items (with pagination & search)
- `GET /api/v1/stock-items/:id` - Get stock item by ID
- `GET /api/v1/stock-items/code/:stockCode` - Get by stock code
- `POST /api/v1/stock-items` - Create stock item
- `PUT /api/v1/stock-items/:id` - Update stock item
- `DELETE /api/v1/stock-items/:id` - Delete stock item
- `PATCH /api/v1/stock-items/:id/stock` - Adjust stock level
- `GET /api/v1/stock-items/meta/categories` - Get all categories

### Suppliers

- `GET /api/v1/suppliers` - List suppliers
- `GET /api/v1/suppliers/:id` - Get supplier by ID
- `POST /api/v1/suppliers` - Create supplier
- `PUT /api/v1/suppliers/:id` - Update supplier
- `DELETE /api/v1/suppliers/:id` - Delete supplier
- `PATCH /api/v1/suppliers/:id/status` - Toggle status

### Purchase Requisitions

- `GET /api/v1/purchase-requisitions` - List PRs (with filters)
- `GET /api/v1/purchase-requisitions/:id` - Get PR with items
- `POST /api/v1/purchase-requisitions` - Create PR
- `PUT /api/v1/purchase-requisitions/:id` - Update PR
- `PATCH /api/v1/purchase-requisitions/:id/status` - Update status
- `DELETE /api/v1/purchase-requisitions/:id` - Delete PR

### Purchase Orders

- `GET /api/v1/purchase-orders` - List POs
- `GET /api/v1/purchase-orders/:id` - Get PO with items
- `POST /api/v1/purchase-orders` - Create PO
- `PUT /api/v1/purchase-orders/:id` - Update PO
- `PATCH /api/v1/purchase-orders/:id/status` - Update status
- `DELETE /api/v1/purchase-orders/:id` - Delete PO

### Stock Movements

- `GET /api/v1/stock-movements` - List movements
- `GET /api/v1/stock-movements/:id` - Get movement by ID
- `POST /api/v1/stock-movements` - Create movement
- `GET /api/v1/stock-movements/ledger/:stockItemId` - Get stock ledger

### Attachments (R2)

- `GET /api/v1/attachments` - List attachments by entity
- `GET /api/v1/attachments/:id` - Get attachment info
- `POST /api/v1/attachments/upload` - Upload file
- `GET /api/v1/attachments/:id/download` - Download file
- `DELETE /api/v1/attachments/:id` - Delete attachment
- `PATCH /api/v1/attachments/:id/relate` - Update relation

### Goods Received Notes (GRN)

- `GET /api/v1/grn` - List GRNs
- `GET /api/v1/grn/:id` - Get GRN with items
- `POST /api/v1/grn` - Create GRN
- `POST /api/v1/grn/:id/complete` - Complete GRN (updates stock)
- `DELETE /api/v1/grn/:id` - Delete GRN

### Internal Transfers

- `GET /api/v1/internal-transfers` - List transfers
- `GET /api/v1/internal-transfers/:id` - Get transfer with items
- `POST /api/v1/internal-transfers` - Create transfer
- `PATCH /api/v1/internal-transfers/:id/status` - Update status
- `POST /api/v1/internal-transfers/:id/complete` - Complete transfer
- `DELETE /api/v1/internal-transfers/:id` - Delete transfer

## Deployment

### Deploy to Cloudflare Workers

1. **Update JWT_SECRET in wrangler.toml** for production:

```toml
[env.production]
vars = { ENVIRONMENT = "production", JWT_SECRET = "your-very-long-random-secret-key-here" }
```

2. **Apply migrations to remote D1**:

```bash
npx wrangler d1 migrations apply havys-erp-db --remote
```

3. **Deploy**:

```bash
yarn deploy
# or
npx wrangler deploy
```

## Environment Variables

Configured in `wrangler.toml`:

- `ENVIRONMENT` - Current environment (development/production)
- `JWT_SECRET` - Secret key for JWT signing (⚠️ **CHANGE THIS IN PRODUCTION**)

## Bindings

- `DB` - D1 Database binding
- `BUCKET` - R2 Bucket binding for file storage

## Security Notes

⚠️ **IMPORTANT**: Before deploying to production:

1. **Change JWT_SECRET** to a long, random string (minimum 32 characters)
2. **Change admin password** immediately after first login
3. **Enable HTTPS** (automatic with Cloudflare Workers)
4. **Review CORS settings** in `src/index.ts`
5. **Set up proper access controls** for your D1 database and R2 bucket

## Database Schema

14 tables with complete ERP functionality:

- `users` - User accounts with authentication
- `sessions` - Active user sessions
- `stock_items` - Inventory master data
- `suppliers` - Supplier master data
- `purchase_requisitions` - PR headers
- `pr_items` - PR line items
- `purchase_orders` - PO headers
- `po_items` - PO line items
- `goods_received_notes` - GRN headers
- `grn_items` - GRN line items
- `stock_movements` - Stock ledger/audit trail
- `internal_transfers` - Transfer headers
- `transfer_items` - Transfer line items
- `attachments` - File metadata (R2 storage)
