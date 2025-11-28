# Development Environment Setup Guide

## 🎯 Current Implementation Status

**✅ Completed Features:**
- ✅ Microservices architecture with separate databases
- ✅ User authentication with JWT (Auth Service)
- ✅ Vendor profile creation and management (Vendor Service) 
- ✅ Vendor Portal frontend with shadcn/ui
- ✅ Database separation (auth_db, vendor_db)
- ✅ Docker containerization and service orchestration

**🚧 Current Phase**: Integration testing and vendor store creation

**📋 Next Features**: Product management, store theming, subdomain routing

## 🚀 Quick Start Guide

### 1. Set up Node.js Environment
```bash
# Use Node.js 24 (required)
nvm use 24.11.1
nvm alias default 24.11.1

# Verify version
node --version  # Should show v24.11.1
```

### 2. Install Dependencies
```bash
# Install all workspace dependencies
pnpm install
```

### 3. Start Backend Services
```bash
# Start all services with Docker Compose
docker compose up -d

# Check services are running
docker compose ps

# View logs (optional)
docker compose logs -f
```

### 4. Initialize Databases
```bash
# Push database schemas (creates tables)
docker compose exec auth npx prisma db push
docker compose exec vendor npx prisma db push

# Verify databases
docker compose exec postgres psql -U user -d auth_db -c "\dt"
docker compose exec postgres psql -U user -d vendor_db -c "\dt"
```

### 5. Generate Prisma Clients
```bash
# Generate TypeScript clients for development
docker compose exec auth npx prisma generate
docker compose exec vendor npx prisma generate

# Verify client generation (should show generated files)
ls -la services/auth/generated/prisma-client/
ls -la services/vendor/generated/prisma-client/
```

> **📝 Note**: Prisma clients are auto-generated and should not be committed to Git. 
> They need to be regenerated after schema changes or when setting up a new environment.

### 6. Start Frontend Applications
```bash
# Terminal 1: Vendor Portal (main focus)
cd apps/vendor-portal && npm run dev

# Terminal 2: Admin Panel (optional)
cd apps/admin && npm run dev

# Terminal 3: Storefront (future)
cd apps/storefront && npm run dev
```

## 📋 Prerequisites

- **Node.js 24.11.1** (exact version required)
- **PNPM 8+** (workspace support)
- **Docker & Docker Compose** (for backend services)

## 🌐 Service URLs & Ports

| Service | Port | URL | Purpose | Status |
|---------|------|-----|---------|--------|
| **API Gateway** | 3000 | http://localhost:3000 | Main entry point for all requests | ✅ Running |
| **Auth Service** | 3001 | http://localhost:3001 | User authentication and JWT | ✅ Running |
| **Vendor Service** | 3002 | http://localhost:3002 | Vendor profiles and stores | ✅ Running |
| **Vendor Portal** | 3003 | http://localhost:3003 | Vendor dashboard (Next.js) | ✅ Complete |
| **Admin Panel** | 5173 | http://localhost:5173 | Platform admin (React) | 🚧 Basic setup |
| **Storefront** | 3000 | http://localhost:3000 | Customer store (Next.js) | 📋 Future |

### Infrastructure Services

| Service | Port | URL | Credentials | Purpose |
|---------|------|-----|-------------|---------|
| **PostgreSQL** | 5432 | localhost:5432 | user/password | Database cluster |
| **Redis** | 6379 | localhost:6379 | No auth | Caching and sessions |
| **RabbitMQ** | 15672 | http://localhost:15672 | user/password | Message queue UI |
| **Elasticsearch** | 9200 | http://localhost:9200 | No auth | Search engine |

## 🗃️ Database Configuration

### Database Separation Architecture
Each microservice has its own dedicated database following microservices best practices:

```
PostgreSQL Instance (Port 5432)
├── auth_db                    # Authentication Service Database
│   ├── users                  # User accounts, profiles, authentication
│   └── _prisma_migrations     # Schema version control
│
├── vendor_db                  # Vendor Service Database  
│   ├── vendors               # Vendor business profiles
│   ├── stores                # Store configurations and settings
│   └── _prisma_migrations    # Schema version control
│
└── gateway_db                # API Gateway Database (future)
    └── logs                  # Request logs, analytics, rate limiting
```

### Database Connection Strings
```bash
# Auth Service
DATABASE_URL="postgresql://user:password@postgres:5432/auth_db"

# Vendor Service  
DATABASE_URL="postgresql://user:password@postgres:5432/vendor_db"

# API Gateway (future)
DATABASE_URL="postgresql://user:password@postgres:5432/gateway_db"
```

### Database Management Commands
```bash
# View all databases
docker compose exec postgres psql -U user -d postgres -c "\l"

# Connect to specific database
docker compose exec postgres psql -U user -d auth_db

# Check tables in auth database
docker compose exec postgres psql -U user -d auth_db -c "\dt"

# Check tables in vendor database  
docker compose exec postgres psql -U user -d vendor_db -c "\dt"

# Reset database schema (development only)
docker compose exec auth npx prisma migrate reset --force
docker compose exec vendor npx prisma migrate reset --force
```

## 🖥️ Development Workflow

### Backend Services
All backend services run in Docker containers automatically. They restart on file changes during development.

```bash
# Check service status
docker compose ps

# View logs for specific service
docker compose logs auth -f
docker compose logs vendor -f
docker compose logs api-gateway -f

# Restart specific service
docker compose restart auth
docker compose restart vendor
```

### Frontend Development  
Run frontend apps locally for fast development with hot reload:

```bash
# Vendor Portal (primary frontend) - Next.js 16
cd apps/vendor-portal && npm run dev    # http://localhost:3003

# Admin Panel - React + Vite
cd apps/admin && npm run dev            # http://localhost:5173
pnpm run dev:storefront   # Available at http://localhost:3001
```

## 🔍 Useful Commands

# Storefront - Next.js 16 (future development)
cd apps/storefront && npm run dev       # http://localhost:3000
```

## 🧪 Testing the Current Implementation

### 1. Test User Registration Flow
```bash
# Test auth service directly
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"vendor@example.com","password":"secure123"}'

# Should return: user object + JWT token
```

### 2. Test Vendor Portal UI Flow
1. Open http://localhost:3003
2. Click "Get Started" → Registration page
3. Create account with email/password
4. Complete vendor profile form
5. Access vendor dashboard

### 3. Test Vendor Profile Creation
```bash
# Get JWT token from registration response, then:
curl -X POST http://localhost:3002/vendor/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-jwt-token>" \
  -d '{
    "businessName": "My Store",
    "businessType": "Retail", 
    "address": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  }'
```

## 🔗 Current API Endpoints

### Auth Service (Port 3001)
```bash
POST /auth/register      # User registration
POST /auth/login         # User login
```

### Vendor Service (Port 3002) 
```bash
POST /vendor/profile     # Create vendor profile (JWT required)
GET  /vendor/profile     # Get vendor profile (JWT required)
POST /vendor/stores      # Create store (JWT required) 
GET  /vendor/stores      # List vendor stores (JWT required)
```

### API Gateway (Port 3000)
```bash
# Routes all requests to appropriate services
# Handles CORS, rate limiting, authentication
```

## 🛠️ Development Commands

### Docker Management
```bash
# Check service status
docker compose ps

# View logs for specific service
docker compose logs auth -f
docker compose logs vendor -f
docker compose logs api-gateway -f

# Restart specific service after code changes
docker compose restart auth
docker compose restart vendor

# Complete rebuild (after major changes)
docker compose down
docker compose up --build -d
```

### Database Management
```bash
# View Prisma schema changes
docker compose exec auth npx prisma db push --dry-run
docker compose exec vendor npx prisma db push --dry-run

# Apply schema changes
docker compose exec auth npx prisma db push
docker compose exec vendor npx prisma db push

# Generate new Prisma client
docker compose exec auth npx prisma generate
docker compose exec vendor npx prisma generate
```

## 🛠️ Troubleshooting

### Prisma Client Issues

**🔧 TypeScript errors about missing Prisma types?**
```bash
# Regenerate Prisma clients
docker compose exec auth npx prisma generate
docker compose exec vendor npx prisma generate

# Verify generated files exist
ls -la services/auth/generated/prisma-client/
ls -la services/vendor/generated/prisma-client/
```

**🔧 "Cannot find module '../generated/prisma-client'" error?**
```bash
# Ensure containers are running
docker compose ps

# Generate clients if missing
docker compose exec auth npx prisma generate
docker compose exec vendor npx prisma generate

# Restart TypeScript language server in your editor
# VS Code: Ctrl+Shift+P → "TypeScript: Restart TS Server"
```

**🔧 Schema changes not reflected in types?**
```bash
# 1. Push schema changes to database
docker compose exec auth npx prisma db push
docker compose exec vendor npx prisma db push

# 2. Regenerate client types
docker compose exec auth npx prisma generate
docker compose exec vendor npx prisma generate

# 3. Restart containers if needed
docker compose restart auth vendor
```

### Services not starting?
```bash
# Check Docker is running
docker --version

# View detailed logs  
docker compose logs -f

# Check for port conflicts
lsof -i :3000 -i :3001 -i :3002 -i :5432
```

### Database connection issues?
```bash
# Check if PostgreSQL is running
docker compose exec postgres pg_isready -U user

# Connect to database directly
docker compose exec postgres psql -U user -d auth_db

# Reset database completely (development only)
docker compose down -v
docker compose up -d
```

### Frontend build errors?
```bash
# Check Node.js version
node --version  # Should be 24.11.1

# Clear dependencies and reinstall
rm -rf node_modules apps/*/node_modules
pnpm install

# Check for TypeScript errors
cd apps/vendor-portal && npm run build
```

### Port conflicts?
If you have other services running on these ports, either:
1. Stop conflicting services
2. Modify ports in `docker-compose.yml`
3. Use different port mappings

### Need to reset everything?
```bash
# Nuclear option: remove everything
docker compose down -v --remove-orphans
docker system prune -a --volumes
rm -rf node_modules apps/*/node_modules

# Start fresh
pnpm install
docker compose up -d
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
