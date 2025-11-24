# Development Environment Setup Guide

## 🎯 Phase 1 Development Focus

**Current Goal**: Build vendor registration, store creation, store configuration, and subdomain preview functionality.

**What we're NOT building yet**: Product management, orders, payments, or complex themes. Those come in later phases.

## 🚀 Quick Start (Docker-First Approach)

The easiest way to get started is using Docker Compose, which runs all services and infrastructure:

```bash
# Build and start everything
pnpm run docker:build
pnpm run docker:up

# Verify services are running
curl http://localhost:3000  # API Gateway
curl http://localhost:3001  # Auth Service  
curl http://localhost:3002  # Vendor Service

# View logs
pnpm run docker:logs

# Stop everything
pnpm run docker:down
```

## 📋 Prerequisites

- **Node.js 24+** (for frontend development)
- **PNPM 8+** (package manager)
- **Docker & Docker Compose** (for services)

## 🔧 Environment Configuration (Optional)

Services use default environment variables that work out of the box. Only customize if needed:

```bash
# Copy example files to customize settings
cd services/auth && cp .env.example .env
cd ../api-gateway && cp .env.example .env  
cd ../vendor && cp .env.example .env
```

## 🌐 Service URLs & Ports

| Service | Port | URL | Purpose |
|---------|------|-----|---------|
| **API Gateway** | 3000 | http://localhost:3000 | Main entry point for all client requests |
| **Auth Service** | 3001 | http://localhost:3001 | Authentication and authorization |
| **Vendor Service** | 3002 | http://localhost:3002 | Store and vendor management |
| **PostgreSQL** | 5432 | localhost:5432 | Main database |
| **Redis** | 6379 | localhost:6379 | Caching and sessions |
| **Elasticsearch** | 9200 | http://localhost:9200 | Search functionality |
| **RabbitMQ** | 15672 | http://localhost:15672 | Message queue management UI |

## 🖥️ Development Workflow

### Backend Services
All backend services run in Docker containers automatically. No need to run them individually.

### Frontend Development  
Run frontend apps locally for fast development with hot reload:

```bash
# Start admin panel (React + Vite)
pnpm run dev:admin        # Available at http://localhost:5173

# Start storefront (Next.js)
pnpm run dev:storefront   # Available at http://localhost:3001
```

## 🔍 Useful Commands

```bash
# Check service status
docker compose ps

# View logs for specific service
docker compose logs api-gateway
docker compose logs auth
docker compose logs vendor

# Rebuild services after code changes
pnpm run docker:build

# Clean everything (removes volumes)
pnpm run docker:clean
```

## 🛠️ Troubleshooting

### Services not starting?
```bash
# Check Docker is running
docker --version

# View detailed logs
pnpm run docker:logs

# Restart everything fresh
pnpm run docker:down
pnpm run docker:up
```

### Port conflicts?
If you have other services running on these ports, stop them or modify the ports in `docker-compose.yml`.

### Need to reset everything?
```bash
# This removes all containers, networks, and volumes
pnpm run docker:clean
```

## 🎯 Phase 1 Development Tasks

Once everything is running, you'll be building these features:

### 1. **Vendor Registration & Authentication** 
- User signup with email/password
- Email verification flow
- Login/logout functionality
- JWT token management

### 2. **Store Creation**
- New vendor can create their first store
- Store name validation (for subdomain generation)
- Basic store information capture

### 3. **Store Configuration Interface**
```bash
# Key store settings to implement:
- Store name & description
- Contact information (email, phone, address)
- Basic branding (primary color, logo upload)
- Business details (category, timezone, currency)
- Store settings (open hours, policies)
```

### 4. **Subdomain Preview**
- Show vendors their subdomain: `{store-name}.platform.com`
- Validate subdomain availability
- Display preview of how their store will be accessible

### 5. **Vendor Dashboard**
- Simple UI to edit store settings
- View current store configuration
- See subdomain URL and status

## 🛠️ Development Approach

### Backend (Services)
- **Auth Service**: Handle user registration, login, JWT tokens
- **Vendor Service**: Store CRUD operations, subdomain generation
- **API Gateway**: Route requests, authenticate users

### Frontend (Apps)
- **Admin Panel**: For platform administration *(Phase 4)*
- **Vendor Dashboard**: For vendors to manage their stores
- **Storefront**: Customer-facing store *(Phase 2+)*

### Database Schema (Phase 1)
```sql
-- Core tables needed for Phase 1
users (id, email, password, verified_at, created_at)
vendors (id, user_id, created_at)
stores (id, vendor_id, name, slug, description, settings, created_at)
```
4. Use the database and Redis for data persistence

## ✅ Phase 1 Success Criteria

You'll know Phase 1 is complete when:
- ✅ A vendor can register an account with email verification
- ✅ A vendor can login and access their dashboard  
- ✅ A vendor can create a store with configuration
- ✅ A vendor can see their subdomain preview (e.g., `my-store.platform.com`)
- ✅ Store settings are saved and can be edited
- ✅ Basic vendor dashboard is functional

**Phase 2 starts** when vendors can begin adding products to their configured stores.

---

**Note**: Focus only on vendor registration, store creation, and configuration. Product management, ordering, and payments are explicitly out of scope for Phase 1.
