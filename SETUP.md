# Development Environment Setup Guide

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

## 🎯 Next Steps

Once everything is running:
1. Access API Gateway at http://localhost:3000
2. Start building features in the services
3. Run frontend apps locally for UI development
4. Use the database and Redis for data persistence

---

**Note**: This setup is optimized for development. All services run in Docker for consistency, while frontend apps run locally for fast development cycles.
