# Environment Setup Guide

## Quick Start

Each service needs a `.env` file. Copy the `.env.example` to `.env` for each service:

```bash
# Auth Service
cd services/auth
cp .env.example .env

# API Gateway
cd services/api-gateway
cp .env.example .env

# Vendor Service already has .env created
```

## Port Configuration

| Service | Port | Purpose |
|---------|------|---------|
| **API Gateway** | 3000 | Main entry point for all client requests |
| **Auth Service** | 3001 | Authentication and authorization |
| **Vendor Service** | 3002 | Store and vendor management |

## Running Services

Start each service in a separate terminal:

```bash
# Terminal 1: API Gateway
cd services/api-gateway
pnpm run start:dev

# Terminal 2: Auth Service
cd services/auth
pnpm run start:dev

# Terminal 3: Vendor Service
cd services/vendor
pnpm run start:dev
```

All services will log their startup URL to the console.
