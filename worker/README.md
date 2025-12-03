# Harvy ERP - Worker Backend Setup

This directory contains the Cloudflare Worker API backend for Harvy ERP.

## Stack

- **Framework**: Hono (ultra-fast web framework for edge)
- **ORM**: Drizzle ORM
- **Database**: Cloudflare D1 (SQLite)
- **Storage**: Cloudflare R2 (object storage)
- **API**: tRPC (type-safe APIs)

## Setup Instructions

### 1. Create D1 Database

```bash
# Create the database
npx wrangler d1 create harvy-erp-db

# Copy the database_id from the output and update worker/wrangler.toml
```

### 2. Create R2 Bucket

```bash
# Create the R2 bucket
npx wrangler r2 bucket create harvy-erp-files
```

### 3. Generate Database Migrations

```bash
# Generate migration files from schema
yarn db:generate
```

### 4. Run Migrations

```bash
# Apply migrations to your D1 database
yarn db:migrate
```

### 5. Start Local Development

```bash
# Start the worker locally
yarn worker:dev
```

The worker will be available at `http://localhost:8787`

## Endpoints

### Health Check

```
GET http://localhost:8787/health
```

### tRPC API

All tRPC endpoints are available at:

```
POST http://localhost:8787/trpc/*
```

### Example tRPC Calls

#### List Purchase Requisitions

```typescript
// In your Next.js frontend
const { data } = await trpc.purchaseRequisition.list.query({
  limit: 10,
  offset: 0
});
```

#### Create Purchase Requisition

```typescript
const result = await trpc.purchaseRequisition.create.mutate({
  title: 'Office Supplies',
  department: 'IT',
  company: 'Harvy Oil Mill',
  urgency: 'Medium',
  requestedById: 1,
  notes: 'Urgent items needed',
  items: [
    {
      stockCode: 'IT-001',
      description: 'Laptop',
      quantity: 2,
      uom: 'EA',
      unitPrice: 5000,
      totalPrice: 10000
    }
  ]
});
```

#### Upload File to R2

```typescript
const result = await trpc.files.upload.mutate({
  fileName: 'document.pdf',
  fileContent: base64String,
  mimeType: 'application/pdf',
  uploadedById: 1,
  relatedType: 'purchase_requisition',
  relatedId: 123
});
```

## Deployment

### Deploy to Production

```bash
yarn worker:deploy
```

## Database Management

### Open Drizzle Studio (Visual Database Editor)

```bash
yarn db:studio
```

This will open a web interface at `https://local.drizzle.studio` where you can:

- View and edit data
- Inspect schema
- Run queries

### Execute SQL Directly

```bash
npx wrangler d1 execute harvy-erp-db --command "SELECT * FROM users"
```

## Project Structure

```
worker/
├── src/
│   ├── db/
│   │   └── schema.ts          # Database schema (Drizzle)
│   ├── routes/
│   │   ├── purchase-requisition.ts  # PR endpoints
│   │   └── files.ts           # R2 file management
│   ├── types/
│   │   └── global.d.ts        # TypeScript global types
│   ├── index.ts               # Hono app entry point
│   ├── router.ts              # Main tRPC router
│   └── trpc.ts                # tRPC initialization
├── migrations/                # Generated SQL migrations
├── drizzle.config.ts          # Drizzle configuration
├── tsconfig.json              # TypeScript config
└── wrangler.toml              # Cloudflare Worker config
```

## Environment Variables

For remote migration management, set these in your `.env`:

```env
CLOUDFLARE_ACCOUNT_ID=your_account_id
CLOUDFLARE_DATABASE_ID=your_database_id
CLOUDFLARE_API_TOKEN=your_api_token
```

## Next Steps

1. **Set up frontend tRPC client** - Connect your Next.js app to this backend
2. **Add authentication** - Implement JWT or session-based auth
3. **Add more routes** - Expand with other business logic
4. **Set up CI/CD** - Automate deployments with GitHub Actions

## Troubleshooting

### "Database not found" error

Make sure you've:

1. Created the D1 database with `wrangler d1 create`
2. Updated the `database_id` in `wrangler.toml`
3. Run migrations with `yarn db:migrate`

### "R2 bucket not found" error

Create the R2 bucket:

```bash
npx wrangler r2 bucket create harvy-erp-files
```

### Type errors in IDE

Make sure `@cloudflare/workers-types` is installed and worker's `tsconfig.json` includes the types.
