# Production Deployment Guide

This document covers everything that differs between the current dev setup and a production deployment.

---

## 1. Infrastructure

### Separate Database Instances
Currently both `auth_db` and `vendor_db` run on the **same single PostgreSQL container** (`ecommerce_postgres`). In production, each service should have its own isolated database instance (separate RDS instances, managed Postgres services, etc.) so a failure or maintenance window in one doesn't affect the other.

### Enable the API Gateway
The API Gateway is commented out in `docker-compose.yml`. In production:
- Uncomment and deploy the `api-gateway` service
- All frontend apps must call the **gateway** (single entry point), not the auth/vendor services directly
- The gateway handles CORS, rate limiting, and request routing centrally

### Future Services (not yet enabled)
- **RabbitMQ** — message broker for async events between services (Phase 4+)
- **Elasticsearch** — full-text search (Phase 4+)

Both are scaffolded in `docker-compose.yml` but commented out.

### Container Production Config
Add to each service in your production compose/k8s manifests:
```yaml
restart: unless-stopped
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:<PORT>/health"]
  interval: 30s
  timeout: 10s
  retries: 3
deploy:
  resources:
    limits:
      memory: 512M
```

---

## 2. Secrets & Environment Variables

### Secrets that MUST change before production

| Location | Variable | Current value |
|----------|----------|---------------|
| `docker-compose.yml`, `services/auth/.env`, `services/vendor/.env` | `JWT_SECRET` | `your-secret-key-change-in-production` |
| `docker-compose.yml` | `POSTGRES_PASSWORD` | `password` |
| `docker-compose.yml` | `POSTGRES_USER` | `user` |

Generate a proper JWT secret:
```bash
openssl rand -base64 64
```

### Secrets Management
- Use AWS Secrets Manager, HashiCorp Vault, or Docker Secrets — do **not** put real credentials in `docker-compose.yml` or committed `.env` files
- Reference `.env.example` files in each service for the full list of required variables
- Set `NODE_ENV=production` in all services

---

## 3. Vendor Subdomain Routing

This is the most significant production-only feature. Each vendor store has a unique `slug` (enforced in `vendor_db`). In production, that slug becomes the subdomain.

Example: store slug `acme-shoes` → `acme-shoes.yourdomain.com`

### DNS
Add a **wildcard A record** in your DNS provider:
```
*.yourdomain.com  →  <your load balancer / server IP>
```

### TLS Certificate
You need a **wildcard certificate** for `*.yourdomain.com`:
- **Let's Encrypt**: use `certbot` with the DNS-01 challenge (not HTTP-01 — that won't work for wildcards)
- **AWS**: use ACM, which supports wildcard certs natively with Route 53 validation

### Reverse Proxy (Nginx / Caddy / AWS ALB)
The reverse proxy reads the `Host` header and routes accordingly:

```nginx
# Nginx example
server {
    listen 443 ssl;
    server_name ~^(?<slug>[^.]+)\.yourdomain\.com$;

    # Route vendor storefronts
    location / {
        proxy_pass http://storefront:3000;
        proxy_set_header X-Store-Slug $slug;
        proxy_set_header X-Forwarded-Host $host;
    }
}

server {
    listen 443 ssl;
    server_name yourdomain.com vendors.yourdomain.com;
    # vendor portal, storefront root, etc.
}
```

### Storefront App (Next.js)
Update `apps/storefront/src/middleware.ts` to read the subdomain from the request and pass it as context:

```ts
// Extract slug from host header
const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host') ?? ''
const slug = host.split('.')[0] // e.g. "acme-shoes"
// Fetch store by slug from vendor service, render accordingly
```

### Vendor Service
Update `BASE_DOMAIN` env var:
```
# dev
BASE_DOMAIN=localhost:3003

# production
BASE_DOMAIN=yourdomain.com
```

The store's public URL then becomes `https://${store.slug}.${BASE_DOMAIN}`.

---

## 4. CORS Configuration

`services/auth/src/main.ts` and `services/vendor/src/main.ts` have **hardcoded** localhost origins:
```ts
origin: ['http://localhost:3000', 'http://localhost:3003']
```

In production, drive CORS from environment variables (the API Gateway already does this correctly via `CORS_ORIGIN`):
```ts
origin: process.env.CORS_ORIGIN?.split(',') ?? []
```

Set `CORS_ORIGIN` to your production domains. For subdomain routing, you'll need to either:
- Enumerate all expected origins, or
- Use a regex/function to allow `*.yourdomain.com`

---

## 5. Frontend API URLs

Several pages have **hardcoded localhost URLs** that will break in production:

| File | Hardcoded URL |
|------|---------------|
| `apps/vendor-portal/src/app/login/page.tsx` | `http://localhost:3001/auth/login` |
| `apps/vendor-portal/src/app/stores/page.tsx` | `http://localhost:3002/vendor/stores` |
| `apps/storefront/src/app/vendors/create/page.tsx` | `http://localhost:3001`, `http://localhost:3002`, `http://localhost:3003` |

`apps/vendor-portal/src/lib/api/products.ts` already does this correctly:
```ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002'
```

Apply the same pattern everywhere. In production set:
```
NEXT_PUBLIC_API_URL=https://api.yourdomain.com  # the API gateway
```

---

## 6. Database

### Migrations
- **Dev**: `prisma db push` (schema sync, no migration history) — fine for development
- **Production**: `prisma migrate deploy` (applies migration files in order, safe for prod)

The current Dockerfiles run migrations at container startup with silent failure:
```sh
npx prisma migrate deploy || echo "Migration failed, continuing..."
```
Remove the `|| echo` fallback — if migrations fail, the container should fail too, not silently serve stale schema.

Preferred production approach: run `prisma migrate deploy` as a **pre-deploy job** (init container / CI step), not at startup.

### Connection Pooling
NestJS + Prisma can exhaust DB connections under load. Add connection limits to your `DATABASE_URL`:
```
DATABASE_URL=postgresql://user:pass@host:5432/db?connection_limit=10&pool_timeout=20
```
Or deploy **PgBouncer** in front of Postgres.

### Backups
- AWS RDS: enable automated backups + point-in-time recovery
- Self-hosted: set up a `pg_dump` cron job, store dumps in S3 with lifecycle policies

---

## 7. File Uploads & Static Assets

The vendor service stores uploaded images at `/app/public/uploads` **inside the container**. This is ephemeral — uploads are lost when the container is redeployed.

In production:
1. Replace local disk writes in `services/vendor/src/upload.service.ts` with an **S3 upload**
2. Set `BASE_URL` env var to your **CDN domain** (CloudFront, etc.) instead of `http://localhost:3002`
3. The `@nestjs/serve-static` module serving `/app/public` can be removed once assets are on a CDN

---

## 8. Security Hardening

### Auth Cookies
`apps/vendor-portal/src/app/login/page.tsx` sets the token cookie without security flags:
```ts
// Current
document.cookie = `token=${token}; path=/; max-age=${60 * 60 * 24 * 7}`

// Production
document.cookie = `token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; Secure; HttpOnly; SameSite=Strict`
```
Note: `HttpOnly` means the cookie can't be read by JS — you'll need to move token reads to server-side if you add this flag.

### Next.js Security Headers
Add to `apps/vendor-portal/next.config.ts` and `apps/storefront/next.config.ts`:
```ts
async headers() {
  return [{
    source: '/(.*)',
    headers: [
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    ],
  }]
}
```

### Remove Debug Logs
`apps/vendor-portal/src/app/stores/page.tsx` logs the auth token to the browser console:
```ts
console.log("Fetching stores with token:", token)  // remove this
```

### JWT Secret Validation
`services/vendor/src/auth.guard.ts` reads `process.env.JWT_SECRET` without checking it exists. Add a startup guard in `main.ts`:
```ts
if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is required')
```

---

## 9. Logging & Observability

### Structured Logging
Replace `console.log/error` in NestJS services with **Winston** or **Pino**:
```ts
import { Logger } from '@nestjs/common'
private readonly logger = new Logger(VendorService.name)
this.logger.log('store created', { storeId, userId })
```

### Health Endpoints
Add a `/health` endpoint to each service (used by load balancer health checks and container healthchecks):
```ts
@Get('health')
health() { return { status: 'ok' } }
```

### Error Tracking
Integrate **Sentry** in both Next.js apps and NestJS services to capture unhandled errors in production.

---

## 10. CI/CD

- Run `prisma migrate deploy` as a **pre-deploy step**, not inside the container startup script
- Build production Docker images without the dev volume mounts (source code should be baked into the image)
- Set up a **staging environment** that mirrors production — especially important for testing subdomain routing before it goes live
- Store all secrets in your CI/CD secret store (GitHub Actions secrets, AWS Parameter Store, etc.), never in the repository
