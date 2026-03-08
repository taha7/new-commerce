# Multi-Vendor E-Commerce Platform

A scalable multi-vendor e-commerce platform built with a microservices architecture. Each vendor gets their own independently branded store under a unified platform.

## What's Built (Phase 1)

- **Vendor registration & authentication** — JWT-based signup/login via Auth Service
- **Vendor profiles** — Business details (name, type, address, contact)
- **Store management** — Create and manage multiple stores with slugs and settings
- **Vendor Portal** — Full Next.js 16 dashboard for vendors to manage their account and stores

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Vendor Portal | Next.js 16, React 19, shadcn/ui, Tailwind CSS 4 |
| Admin Panel | React 18, Vite, Tailwind CSS |
| Auth Service | NestJS 11, Prisma 5, PostgreSQL, JWT |
| Vendor Service | NestJS 11, Prisma 5, PostgreSQL |
| API Gateway | NestJS 11 |
| Database | PostgreSQL 16 (separate DB per service) |
| Caching | Redis 7 |
| Package Manager | pnpm 8 (workspace monorepo) |
| Runtime | Node.js 24.11.1 |
| Containerization | Docker Compose |

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Frontends                        │
│  Vendor Portal (3003)    Admin Panel (5173)         │
└────────────────┬────────────────────────────────────┘
                 │ HTTP (direct in dev)
┌────────────────▼────────────────────────────────────┐
│              Backend Services                       │
│  Auth Service (3001)    Vendor Service (3002)       │
└────────────────┬────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────┐
│              Infrastructure                         │
│  PostgreSQL (5432)    Redis (6379)                  │
│  auth_db / vendor_db                                │
└─────────────────────────────────────────────────────┘
```

> **Note**: The API Gateway (port 3000) is scaffolded but bypassed in development — frontends call Auth and Vendor services directly.

## Service Ports

| Service | Port | Status |
|---------|------|--------|
| Auth Service | 3001 | ✅ Running |
| Vendor Service | 3002 | ✅ Running |
| Vendor Portal | 3003 | ✅ Running |
| Admin Panel | 5173 | 🚧 Basic setup |
| API Gateway | 3000 | 🚧 Scaffolded |
| PostgreSQL | 5432 | ✅ Running |
| Redis | 6379 | ✅ Running |

## Quick Start

```bash
# 1. Install dependencies
pnpm install

# 2. Start backend infrastructure + services
docker compose up -d

# 3. Initialize databases (first time only)
docker compose exec auth npx prisma db push
docker compose exec vendor npx prisma db push
docker compose exec auth npx prisma generate
docker compose exec vendor npx prisma generate

# 4. Start the Vendor Portal
pnpm run dev:vendor-portal   # http://localhost:3003
```

See [DEVELOPMENT.md](./DEVELOPMENT.md) for full setup instructions, all available commands, architecture details, and troubleshooting.

## API Reference

See [API.md](./API.md) for complete endpoint documentation including request/response examples.

## Roadmap

### Phase 1 — Vendor Foundation ✅
- [x] Auth service (register, login, JWT)
- [x] Vendor profiles (9 business fields)
- [x] Store creation and management
- [x] Vendor Portal dashboard (Next.js 16 + shadcn/ui)
- [ ] Store configuration (branding, colors, contact info)

### Phase 2 — Product Catalog 📋
- [ ] Product management with complex variations (Material → Color → Size)
- [ ] Inventory tracking
- [ ] Category system
- [ ] Image uploads

### Phase 3 — Multi-Tenancy 📋
- [ ] Dynamic subdomain routing (`vendor.platform.com`)
- [ ] Theme system with per-vendor customization
- [ ] Theme marketplace

### Phase 4 — Transactions 📋
- [ ] Order management
- [ ] Multi-vendor cart splitting
- [ ] Payment gateway integration
- [ ] Elasticsearch-powered search

### Phase 5 — Production 📋
- [ ] Kubernetes deployment
- [ ] Monitoring (Prometheus + Grafana)
- [ ] CI/CD pipeline

## License

MIT
