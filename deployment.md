# Deployment Guide for Havys ERP v3

This guide documents the steps to deploy the Havys ERP application to Cloudflare. The application consists of a **Next.js Frontend** (Cloudflare Pages) and a **Hono Backend** (Cloudflare Workers) with **D1 Database**.

## Prerequisites

- Cloudflare Account
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/) installed (`npm install -g wrangler`)
- Logged in to Wrangler (`npx wrangler login`)

## 1. Backend Deployment (Cloudflare Workers & D1)

The backend code is located in the `worker/` directory.

### Navigate to Worker Directory

```bash
cd worker
npm install
```

### Database Setup (Production)

1.  **Apply Migrations**
    Sync your database schema changes to the remote Cloudflare D1 database.

    ```bash
    npx wrangler d1 migrations apply havys-erp-db --remote
    ```

2.  **Seed Database (Optional)**
    Populate the remote database with initial production data (Stock items, UOMs, Admin user).
    Ensure `seed_production.sql` is present in the `worker/` directory.
    ```bash
    npx wrangler d1 execute havys-erp-db --remote --file=seed_production.sql
    ```

### Deploy Worker API

Deploy the Hono API worker to production. This uses the configuration in `wrangler.toml` (specifically the `[env.production]` block).

```bash
npx wrangler deploy --env production
```

### Environment Variables & Secrets

To set secrets like `JWT_SECRET` for the production worker:

```bash
npx wrangler secret put JWT_SECRET --env production
```

---

## 2. Frontend Deployment (Cloudflare Pages)

The frontend is a Next.js application in the root directory.

### Build the Application

Navigate back to the project root and build the static assets.

```bash
cd ..
yarn install
yarn build
```

### Deploy to Pages

Deploy the built `.next` folder to Cloudflare Pages.

```bash
npx wrangler pages deploy .next --project-name havys-erp-pages --branch main
```

_Note: Ensure the project name `havys-erp-pages` matches your Cloudflare Pages project name._

## 3. Database Management Cheatsheet

| Task                 | Command                                                                     |
| -------------------- | --------------------------------------------------------------------------- |
| **Local Migration**  | `npx wrangler d1 migrations apply havys-erp-db --local`                     |
| **Remote Migration** | `npx wrangler d1 migrations apply havys-erp-db --remote`                    |
| **Local Seed**       | `npx wrangler d1 execute havys-erp-db --local --file=seed_local.sql`        |
| **Remote Seed**      | `npx wrangler d1 execute havys-erp-db --remote --file=seed_production.sql`  |
| **Update Admin Pwd** | `npx wrangler d1 execute havys-erp-db --remote --command "UPDATE users..."` |

## 4. Troubleshooting

- **File not found errors**: Ensure you are in the correct directory. D1 commands usually run from `worker/`.
- **Worker/Pages mismatch**: `wrangler deploy` is for Workers. `wrangler pages deploy` is for Pages.
- **Password Hashing**: Use the utility script to generate bcrypt hashes for user updates.
  ```bash
  # From project root
  node worker/generate-hash.js "YourPassword123"
  ```
