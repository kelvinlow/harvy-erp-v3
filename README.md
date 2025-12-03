# 🚀 Harvy ERP Backend - Complete Setup Guide

## ✅ What We've Built

Cloudflare Worker backend is now scaffolded with:

### Stack

- **Hono**: Ultra-fast web framework
- **tRPC**: Type-safe API layer
- **Drizzle ORM**: Type-safe database queries
- **Cloudflare D1**: SQLite database
- **Cloudflare R2**: Object storage

### Features

✅ Purchase Requisition CRUD APIs  
✅ File upload/download to R2  
✅ Type-safe database schema  
✅ End-to-end type safety with tRPC  
✅ Local development setup

---

## 📋 Setup Steps

### Step 1: Create D1 Database (Via Dashboard - Easier)

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **Workers & Pages** → **D1**
3. Click **Create database**
4. Name it: `harvy-erp-db`
5. Copy the **Database ID** shown after creation
6. Open `worker/wrangler.toml` and paste it:

```toml
[[d1_databases]]
binding = "DB"
database_name = "harvy-erp-db"
database_id = "YOUR_DATABASE_ID_HERE"  # ← Paste here
```

### Step 2: Create R2 Bucket (Via Dashboard)

1. In Cloudflare Dashboard, go to **R2**
2. Click **Create bucket**
3. Name it: `harvy-erp-files`
4. That's it! (The name in `wrangler.toml` already matches)

### Step 3: Generate Database Migrations

```bash
yarn db:generate
```

This creates SQL migration files in `worker/migrations/`

### Step 4: Apply Migrations to D1

```bash
yarn db:migrate
```

This creates all tables in your D1 database

### Step 5: Start Development Server

```bash
yarn worker:dev
```

Your API will be at: `http://localhost:8787`

---

## 🧪 Testing Your API

### Test Health Endpoint

```bash
curl http://localhost:8787/health
```

Expected response:

```json
{
  "status": "ok",
  "timestamp": "2025-12-03T..."
}
```

### Test tRPC Endpoint

Create a test file `test-api.ts`:

```typescript
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from './worker/src/router';

const client = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:8787/trpc'
    })
  ]
});

// Test: List purchase requisitions
const result = await client.purchaseRequisition.list.query({
  limit: 10,
  offset: 0
});

console.log(result);
```

---

## 🔗 Integrating with Next.js Frontend

### 1. Install tRPC React Query Integration

```bash
yarn add @trpc/react-query @tanstack/react-query
```

### 2. Create tRPC Client

Create `lib/trpc.ts`:

```typescript
import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '../worker/src/router';

export const trpc = createTRPCReact<AppRouter>();
```

### 3. Create tRPC Provider

Create `components/providers/trpc-provider.tsx`:

```typescript
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { useState } from 'react';
import { trpc } from '@/lib/trpc';

export function TRPCProvider({ children }: { children: React.Node }) {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8787/trpc'
        })
      ]
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
}
```

### 4. Wrap Your App

Update `app/layout.tsx`:

```typescript
import { TRPCProvider } from '@/components/providers/trpc-provider';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <TRPCProvider>{children}</TRPCProvider>
      </body>
    </html>
  );
}
```

### 5. Use in Components

```typescript
'use client';

import { trpc } from '@/lib/trpc';

export function PurchaseRequisitionList() {
  const { data, isLoading } = trpc.purchaseRequisition.list.useQuery({
    limit: 10,
    offset: 0
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {data?.data.map((pr) => (
        <div key={pr.id}>{pr.title}</div>
      ))}
    </div>
  );
}
```

---

## 📂 Project Structure

```
harvy-erp-v3/
├── app/                          # Next.js frontend
├── components/                   # React components
├── worker/                       # ← NEW: Cloudflare Worker
│   ├── src/
│   │   ├── db/
│   │   │   └── schema.ts        # Database models
│   │   ├── routes/
│   │   │   ├── purchase-requisition.ts
│   │   │   └── files.ts
│   │   ├── types/
│   │   │   └── global.d.ts
│   │   ├── index.ts             # Hono app
│   │   ├── router.ts            # tRPC router
│   │   └── trpc.ts              # tRPC setup
│   ├── migrations/               # Auto-generated
│   ├── wrangler.toml            # Worker config
│   └── drizzle.config.ts        # DB config
└── package.json
```

---

## 🚀 Deployment

### Deploy Worker to Production

```bash
yarn worker:deploy
```

This deploys your API to Cloudflare's edge network globally!

### Update Frontend Environment Variable

Add to `.env.production`:

```env
NEXT_PUBLIC_API_URL=https://harvy-erp-api.your-subdomain.workers.dev/trpc
```

Replace with your actual Workers URL

---

## 🛠️ Available Commands

| Command              | Description                     |
| -------------------- | ------------------------------- |
| `yarn worker:dev`    | Start local development server  |
| `yarn worker:deploy` | Deploy to Cloudflare Workers    |
| `yarn db:generate`   | Generate migrations from schema |
| `yarn db:migrate`    | Apply migrations to D1          |
| `yarn db:studio`     | Open Drizzle Studio (DB GUI)    |

---

## 📊 Database Schema

Current tables:

- **users** - User accounts
- **purchase_requisitions** - PR records
- **pr_items** - PR line items
- **stock_items** - Inventory items
- **attachments** - File metadata (R2)

View schema: `worker/src/db/schema.ts`

---

## 🔐 Next Steps (Recommended)

1. **Add Authentication**

   - Implement JWT tokens
   - Add user login/signup routes
   - Protect tRPC procedures

2. **Add More Entities**

   - Purchase Orders
   - Stock Movements
   - Suppliers
   - Customers

3. **Set Up CI/CD**

   - GitHub Actions for auto-deployment
   - Run migrations on deploy

4. **Add Testing**
   - Unit tests for tRPC procedures
   - Integration tests with test D1 database

---

## ❓ Troubleshooting

**Q: "Database not found" error**  
A: Make sure you've created the D1 database and updated `database_id` in `wrangler.toml`, then run migrations.

**Q: Type errors in IDE**  
A: Run `yarn` to ensure `@cloudflare/workers-types` is installed.

**Q: CORS errors in browser**  
A: Update the `origin` array in `worker/src/index. ts` to include your frontend URL.

**Q: R2 upload fails**  
A: Verify the R2 bucket exists and has the correct name in `wrangler.toml`.

---

## 📚 Resources

- [Hono Documentation](https://hono.dev/)
- [tRPC Documentation](https://trpc.io/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [Cloudflare D1](https://developers.cloudflare.com/d1/)
- [Cloudflare R2](https://developers.cloudflare.com/r2/)

---

## 🎉 You're All Set!

Your full-stack ERP system is now ready:

- ✅ Type-safe Next.js frontend (Cloudflare Pages)
- ✅ Type-safe Hono + tRPC API (Cloudflare Workers)
- ✅ Cloudflare D1 database
- ✅ Cloudflare R2 file storage

All running on Cloudflare's global edge network! 🌍
