# Development Guide

## Prerequisites

- **Node.js 24.11.1** — use `nvm use 24.11.1` (set as default with `nvm alias default 24.11.1`)
- **pnpm 8+** — workspace support required
- **Docker & Docker Compose** — all backend services run in containers

## Startup Sequence

### 1. Install dependencies
```bash
pnpm install
```

### 2. Start backend services
```bash
docker compose up -d

# Verify everything started
docker compose ps
```

### 3. Initialize databases (first time only, or after schema reset)
```bash
docker compose exec auth npx prisma db push
docker compose exec vendor npx prisma db push

docker compose exec auth npx prisma generate
docker compose exec vendor npx prisma generate
```

> The generated Prisma clients sync to your host filesystem — this gives TypeScript intellisense without running inside Docker.

### 4. Start frontend apps
```bash
# Vendor Portal (main app) — http://localhost:3003
pnpm run dev:vendor-portal

# Admin Panel — http://localhost:5173
pnpm run dev:admin
```

---

## Commands Reference

### Root-level (run from repo root)

```bash
pnpm run docker:up          # Start Docker services
pnpm run docker:down        # Stop Docker services
pnpm run docker:logs        # Follow logs for all services
pnpm run docker:build       # Rebuild Docker images
pnpm run docker:clean       # Stop and remove all volumes/orphans

pnpm run dev:vendor-portal  # Start Vendor Portal dev server
pnpm run dev:admin          # Start Admin Panel dev server
pnpm run dev:storefront     # Start Storefront dev server

pnpm run build              # Build all services and apps
pnpm run lint               # Lint all packages
pnpm run test               # Test all packages
```

### Per-service (cd into services/auth, services/vendor, etc.)

```bash
pnpm test               # Run unit tests (*.spec.ts in src/)
pnpm test:watch         # Watch mode
pnpm test:cov           # With coverage report
pnpm test:e2e           # E2E tests (./test/jest-e2e.json)
pnpm run lint           # ESLint with auto-fix
pnpm run build          # nest build
pnpm run start:dev      # Run locally (outside Docker, for debugging)
```

### Docker service management

```bash
docker compose logs auth -f          # Follow auth service logs
docker compose logs vendor -f        # Follow vendor service logs
docker compose restart auth          # Restart a specific service
docker compose up --build -d         # Rebuild and restart all services
```

---

## Prisma Workflow

After any change to a `prisma/schema.prisma` file:

```bash
# 1. Push schema changes to the database
docker compose exec auth npx prisma db push
docker compose exec vendor npx prisma db push

# 2. Regenerate TypeScript client
docker compose exec auth npx prisma generate
docker compose exec vendor npx prisma generate

# 3. Restart TS server in VS Code (Ctrl+Shift+P → "TypeScript: Restart TS Server")
```

Other useful Prisma commands:

```bash
# Dry-run to preview schema changes
docker compose exec vendor npx prisma db push --dry-run

# Create a named migration (instead of db push)
docker compose exec vendor npx prisma migrate dev --name <migration-name>

# Reset database (development only — destroys all data)
docker compose exec auth npx prisma migrate reset --force

# Inspect database directly
docker compose exec postgres psql -U user -d auth_db -c "\dt"
docker compose exec postgres psql -U user -d vendor_db -c "\dt"
```

**Auth service** generates client to `services/auth/generated/prisma-client/`.
**Vendor service** uses default output (`node_modules/@prisma/client`).

---

## Architecture

### Data Flow

```
Vendor Portal (Next.js)
  ├── Calls Auth Service (3001) for login/register
  └── Calls Vendor Service (3002) for profiles and stores

JWT token stored in localStorage + cookie
Middleware (src/middleware.ts) protects routes using the cookie
```

> The API Gateway is scaffolded but commented out in `docker-compose.yml` during Phase 1. Frontends call services directly.

### Database Architecture

Each service owns its own database — no cross-service DB access:

```
PostgreSQL (5432)
├── auth_db     → services/auth/prisma/schema.prisma
│   └── users
└── vendor_db   → services/vendor/prisma/schema.prisma
    ├── vendors
    ├── stores
    ├── products, product_variants, variant_attributes (Phase 2 — schema ready)
    ├── categories, tags
    └── product_images
```

### NestJS Service Pattern

All backend services follow the same structure:

```
app.module.ts
  └── imports: [ConfigModule, JwtModule, PrismaService]
        ↓
  controller (validates DTO with ValidationPipe)
        ↓
  service (business logic)
        ↓
  PrismaService (database access)
```

All Vendor Service routes are protected by `JwtAuthGuard` (`src/auth.guard.ts`), which validates the Bearer token and injects `req.user.userId`. The `userId` comes from the JWT — never from the request body.

### Vendor Portal Structure

```
apps/vendor-portal/src/
├── app/                  # Next.js App Router pages
│   ├── page.tsx          # Dashboard (protected)
│   ├── login/            # Login page
│   └── stores/
│       ├── create/       # Create store form
│       └── [storeId]/    # Store detail/edit
├── components/           # shadcn/ui based components
├── hooks/                # Custom React hooks
├── lib/
│   ├── auth.ts           # JWT decode + localStorage/cookie helpers
│   ├── api/              # API client functions
│   └── utils.ts
└── middleware.ts         # Route protection (checks token cookie)
```

### Key Design Decisions

- **Prices in cents** — all price fields in `vendor_db` are integers (cents/pence)
- **Store slugs are unique** — used as the future subdomain identifier
- **Store `settings` field is JSON** — stores theme, colors, and other config
- **Phase 2 product schema already in `vendor_db`** — `Product`, `ProductVariant`, `VariantAttribute`, etc. are modeled and ready

---

## Troubleshooting

### TypeScript errors about missing Prisma types
```bash
docker compose exec auth npx prisma generate
docker compose exec vendor npx prisma generate
# Then restart the TS server in VS Code
```

### Services not starting
```bash
docker compose logs -f              # Check logs for errors
lsof -i :3001 -i :3002 -i :5432    # Check for port conflicts
docker compose ps                   # Check container status
```

### Database connection errors
```bash
docker compose exec postgres pg_isready -U user   # Check postgres is up
docker compose exec postgres psql -U user -d auth_db  # Direct connection
```

### Frontend build errors
```bash
node --version          # Must be 24.11.1
rm -rf node_modules apps/*/node_modules
pnpm install
```

### Full reset (destroys all data)
```bash
docker compose down -v --remove-orphans
docker compose up -d
# Then re-run prisma db push + generate
```
