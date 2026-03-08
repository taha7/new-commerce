# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Multi-vendor e-commerce platform using a **pnpm monorepo** with microservices backend (NestJS) and multiple frontend apps (Next.js, React+Vite). Currently in Phase 1 (Vendor Foundation). All backend services run in Docker; frontend apps run locally.

## Commands

### Root-level (run from repo root)
```bash
pnpm install                    # Install all workspace dependencies
pnpm run docker:up              # Start all Docker services (postgres + backend services)
pnpm run docker:down            # Stop Docker services
pnpm run docker:logs            # Follow logs for all Docker services
pnpm run docker:clean           # Stop and remove volumes/orphans
pnpm run dev:vendor-portal      # Run vendor portal dev server (port 3003)
pnpm run dev:admin              # Run admin panel dev server (port 5173)
pnpm run dev:storefront         # Run storefront dev server
pnpm run lint                   # Lint all packages
pnpm run test                   # Test all packages
```

### Per-service (inside services/auth, services/vendor, services/api-gateway)
```bash
pnpm test                       # Run unit tests (Jest, matches *.spec.ts in src/)
pnpm test:watch                 # Watch mode
pnpm test:cov                   # With coverage
pnpm test:e2e                   # E2E tests (./test/jest-e2e.json)
pnpm run lint                   # ESLint with auto-fix
pnpm run build                  # nest build
```

### Prisma (run inside Docker containers)
```bash
docker compose exec auth npx prisma db push        # Push auth schema to auth_db
docker compose exec vendor npx prisma db push      # Push vendor schema to vendor_db
docker compose exec auth npx prisma generate       # Regenerate auth Prisma client
docker compose exec vendor npx prisma generate     # Regenerate vendor Prisma client
docker compose exec vendor npx prisma migrate dev  # Create migration
```

> After any Prisma schema change, always db push + generate.

## Architecture

### Monorepo Structure
```
apps/
  admin/           React 18 + Vite + TailwindCSS (port 5173)
  storefront/      Next.js 16 App Router (port 3000)
  vendor-portal/   Next.js 16 App Router + shadcn/ui (port 3003)
services/
  api-gateway/     NestJS 11 (port 3000 in Docker) — routing/CORS/rate-limiting
  auth/            NestJS 11 (port 3001) — JWT auth, user management
  vendor/          NestJS 11 (port 3002) — vendor profiles, stores, products
```

### Data Flow
- **Frontend → API Gateway (3000) → Auth/Vendor services** (gateway commented out in dev; frontends call services directly at 3001/3002)
- JWT token stored in `localStorage` + cookie in vendor-portal; decoded client-side with `getCurrentUser()` in `src/lib/auth.ts`
- Vendor-portal middleware (`src/middleware.ts`) protects routes using the cookie

### Database Architecture
Each NestJS service has its own PostgreSQL database (microservices isolation):
- `auth_db` — `users` table (managed by `services/auth/prisma/schema.prisma`)
- `vendor_db` — `vendors`, `stores`, full product catalog with variants (managed by `services/vendor/prisma/schema.prisma`)

Auth service generates Prisma client to `services/auth/generated/prisma-client/`. Vendor service uses default output (node_modules).

### NestJS Service Pattern
Each service follows standard NestJS structure: `app.module.ts` → controller → service → Prisma. All vendor routes use `JwtAuthGuard` which validates the JWT and injects `req.user.userId`. DTOs use `class-validator` with `ValidationPipe`.

### Vendor Service Notable Details
- `vendor.service.ts` extracts `userId` from JWT (not from request body) — vendor is always tied to the authenticated user
- Product schema is fully built in `vendor_db` (Phase 2 models already in schema): `Product`, `ProductVariant`, `VariantAttribute`, `VariantAttributeValue`, `ProductImage`, `Category`
- Prices stored in **cents/pence** (integers)
- Store `slug` must be unique (used for future subdomain routing)
- `settings` field on `Store` is JSON (theme, colors, etc.)

### Vendor Portal (Next.js) Structure
```
src/
  app/           App Router pages (login, /, stores/create, stores/[storeId])
  components/    UI components (shadcn/ui based)
  hooks/         Custom React hooks
  lib/
    auth.ts      JWT decode + localStorage/cookie helpers
    api/         API client functions (products.ts, etc.)
    utils.ts     Utility helpers
  middleware.ts  Route protection (checks token cookie)
```

### Service Ports Reference
| Service | Port |
|---------|------|
| API Gateway | 3000 |
| Auth Service | 3001 |
| Vendor Service | 3002 |
| Vendor Portal (frontend) | 3003 |
| Admin Panel (frontend) | 5173 |
| PostgreSQL | 5432 |
| Redis | 6379 |

## Development Notes

- **Node.js 24.11.1** required (use `nvm use 24.11.1`)
- **pnpm 8+** required
- API Gateway is commented out in `docker-compose.yml` during Phase 1; frontends call Auth/Vendor services directly
- RabbitMQ and Elasticsearch are also commented out in docker-compose (Phase 4+)
- Vendor service has a `public/` directory served as static files via `@nestjs/serve-static` (for uploaded images)
- When adding new Prisma models, always run `db push` + `generate` inside the Docker container; the generated client syncs to the host for TypeScript intellisense
