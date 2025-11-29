# 🛍️ Multi-Vendor E-Commerce Platform

A modern, scalable multi-vendor e-commerce platform built with microservices architecture, where each vendor can have their own customized website with different themes and branding.

## 🎯 Vision

Create a comprehensive e-commerce ecosystem that allows multiple vendors to operate their own stores under a unified platform, with complete customization capabilities and enterprise-grade scalability.

## ✨ Key Features

### 🏪 Multi-Vendor Architecture
- **Vendor Isolation**: Each vendor gets their own subdomain (vendor1.platform.com)
- **Custom Themes**: Dynamic theme loading and customization per vendor
- **Independent Branding**: Complete control over store appearance and branding
- **Scalable Infrastructure**: Docker-based containerization with auto-scaling capabilities

### 🛒 Advanced E-Commerce Features
- **Complex Product Variations**: Hierarchical variations (Material → Color → Size)
- **Real-time Inventory**: Live stock tracking and management
- **Multi-Vendor Cart**: Smart cart splitting across vendors
- **Advanced Search**: Elasticsearch-powered product discovery
- **Payment Processing**: Multiple payment gateway support

### 🎨 Theme System
- **Dynamic Loading**: Themes loaded per vendor request
- **Component-Based**: Customizable headers, footers, product cards
- **Real-time Preview**: Live theme preview in admin panel
- **Theme Marketplace**: Vendor can choose from available themes

## 🏗️ Technology Stack

### **Frontend Applications**
- **Storefront**: Next.js 16 with App Router (Customer-facing)
- **Admin Panel**: React 18 + Vite + TailwindCSS (Platform administration)
- **Vendor Portal**: Next.js 16 + shadcn/ui (Vendor management dashboard)

### **Backend Microservices**
- **API Gateway**: Request routing, authentication, rate limiting (NestJS 11) - Port 3000
- **Auth Service**: JWT authentication, user registration and management (NestJS 11) - Port 3001
- **Vendor Service**: Store creation, vendor profiles, store management (NestJS 11) - Port 3002
- **Product Service**: Product catalog, variations, inventory management (NestJS) *[Phase 2]*
- **Theme Service**: Dynamic theme management and customization (NestJS) *[Phase 3]*
- **Order Service**: Cart, checkout, order processing (NestJS) *[Phase 4]*
- **Payment Service**: Payment gateway integrations (NestJS) *[Phase 4]*
- **Search Service**: Elasticsearch integration (NestJS) *[Phase 4]*
- **Notification Service**: Email, SMS, push notifications (NestJS) *[Phase 2+]*

### **Infrastructure & Data**
- **Orchestration**: Docker Compose (development), Kubernetes (production)
- **Database Architecture**: 
  - **Separate Databases per Service** (microservices pattern)
  - `auth_db`: User authentication and profiles
  - `vendor_db`: Vendor data, stores, and configurations
  - `gateway_db`: API gateway logs and routing data
- **Database Engine**: PostgreSQL 16 Alpine
- **Caching**: Redis 7 Alpine
- **Message Queue**: RabbitMQ 3 with Management UI
- **Search Engine**: Elasticsearch 8.11.1 (for product search)

### **Development Tools**
- **ORM**: Prisma 5.20.0 with code-first migrations
- **Package Manager**: PNPM with workspace configuration
- **Runtime**: Node.js 24.11.1
- **Containerization**: Docker with multi-stage builds
- **UI Components**: shadcn/ui with Tailwind CSS 4
- **Cache**: Redis
- **Message Queue**: RabbitMQ
- **Search Engine**: Elasticsearch
- **Monitoring**: Prometheus + Grafana
- **Logging**: Docker Compose logs (development), ELK Stack (production)

## � Project Structure

```
e-commerce/
├── apps/                           # Frontend applications
│   ├── admin/                      # Platform admin dashboard (React + Vite)
│   ├── storefront/                 # Customer-facing store (Next.js 16)
│   └── vendor-portal/              # Vendor management portal (Next.js 16)
├── services/                       # Backend microservices
│   ├── api-gateway/               # Main API gateway (NestJS)
│   ├── auth/                      # Authentication service (NestJS)
│   └── vendor/                    # Vendor management service (NestJS)
├── scripts/                       # Database and setup scripts
│   └── init-databases.sql         # PostgreSQL database initialization
├── docker-compose.yml             # Development environment setup
├── pnpm-workspace.yaml           # PNPM monorepo configuration
└── README.md                      # This file
```

### Database Architecture

```
PostgreSQL Instance (Port 5432)
├── auth_db                        # Authentication service database
│   ├── users                      # User accounts and profiles
│   └── _prisma_migrations         # Auth service migrations
├── vendor_db                      # Vendor service database
│   ├── vendors                    # Vendor profiles and business info
│   ├── stores                     # Store configurations and settings
│   └── _prisma_migrations         # Vendor service migrations
└── gateway_db                     # API Gateway database (future)
    └── logs                       # API logs and analytics
```

## 🚀 Getting Started

### Prerequisites
- **Node.js 24.11.1** (set as default via nvm)
- **PNPM 8+** (workspace support)
- **Docker & Docker Compose** (for services)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd e-commerce
   ```

2. **Set up Node.js version**
   ```bash
   nvm use 24.11.1
   nvm alias default 24.11.1
   ```

3. **Install dependencies**
   ```bash
   pnpm install  # Installs all workspace dependencies
   ```

4. **Start backend services**
   ```bash
   # Start all backend services and infrastructure
   docker compose up -d
   
   # Wait for services to be ready (check logs)
   docker compose logs -f
   ```

5. **Initialize databases**
   ```bash
   # Database schemas are automatically created
   # Run migrations for each service
   docker compose exec auth npx prisma db push
   docker compose exec vendor npx prisma db push
   ```

6. **Generate Prisma clients**
   ```bash
   # Generate TypeScript clients for development
   docker compose exec auth npx prisma generate
   docker compose exec vendor npx prisma generate
   ```

7. **Start frontend applications**
   ```bash
   # Terminal 1: Vendor Portal
   cd apps/vendor-portal && npm run dev  # http://localhost:3003
   
   # Terminal 2: Admin Panel  
   cd apps/admin && npm run dev          # http://localhost:5173
   
   # Terminal 3: Storefront
   cd apps/storefront && npm run dev     # http://localhost:3000 (Next.js)
   ```

### Service URLs (Development)

| Service | URL | Description |
|---------|-----|-------------|
| API Gateway | http://localhost:3000 | Main API entry point |
| Auth Service | http://localhost:3001 | User authentication |
| Vendor Service | http://localhost:3002 | Vendor management |
| Vendor Portal | http://localhost:3003 | Vendor dashboard (frontend) |
| Admin Panel | http://localhost:5173 | Platform administration |
| RabbitMQ UI | http://localhost:15672 | Message queue management |
| Elasticsearch | http://localhost:9200 | Search engine |

> **⚡ Development Note**: After any changes to Prisma schema files (`services/*/prisma/schema.prisma`), you need to:
> 1. Push changes: `docker compose exec auth npx prisma db push` (and vendor)
> 2. Regenerate clients: `docker compose exec auth npx prisma generate` (and vendor)
> 
> The generated client files are auto-synced to your host editor for TypeScript intellisense.

## 📚 Documentation

- **[SETUP.md](./SETUP.md)** - Complete development environment setup guide
- **[API.md](./API.md)** - API documentation and endpoint reference  
- **[SESSION_PROMPT_TEMPLATE.md](./SESSION_PROMPT_TEMPLATE.md)** - Development session context

## 🧪 Testing the Implementation

### Quick Test: Full Registration Flow
```bash
# 1. Register a new user
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"vendor@example.com","password":"secure123"}'

# 2. Use the returned JWT token to create vendor profile
# (Replace <token> with actual token from step 1)
curl -X POST http://localhost:3002/vendor/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"businessName":"My Store","businessType":"Retail","address":"123 Main St","city":"NYC","state":"NY","zipCode":"10001","country":"USA"}'
```

### Frontend Testing
1. **Vendor Portal**: http://localhost:3003
   - Register new account
   - Complete vendor profile  
   - Access dashboard
2. **Admin Panel**: http://localhost:5173 (basic setup)

### Service URLs (when running)
- **API Gateway**: http://localhost:3000
- **Auth Service**: http://localhost:3001  
- **Vendor Service**: http://localhost:3002
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379
- **Elasticsearch**: http://localhost:9200
- **RabbitMQ Management**: http://localhost:15672 (user/password)

## 📁 Project Structure

```
├── .github/                 # GitHub Actions workflows
├── apps/                    # Frontend applications
│   ├── admin/              # React admin panel (Vite)
│   ├── storefront/         # Next.js customer storefront
│   └── vendor-portal/      # Next.js vendor dashboard
├── services/               # Backend microservices (NestJS)
│   ├── api-gateway/        # Main entry point (Port 3000)
│   ├── auth/              # Authentication service (Port 3001)
│   ├── vendor/            # Vendor management (Port 3002)
│   ├── product/           # Product catalog service
│   ├── order/             # Order management service
│   ├── payment/           # Payment processing service
│   ├── theme/             # Theme management service
│   ├── search/            # Elasticsearch service
│   └── notification/      # Notification service
├── shared/                 # Shared libraries
│   ├── types/             # TypeScript type definitions
│   ├── utils/             # Shared utilities
│   └── contracts/         # API contracts
├── infrastructure/        # Deployment configs
│   ├── docker/           # Docker configurations
│   ├── kubernetes/       # K8s manifests
│   └── terraform/        # Infrastructure as code
├── docker-compose.yml     # Local development infrastructure
├── pnpm-workspace.yaml   # PNPM workspace configuration
└── package.json          # Root package.json
```

## 🔄 Development Workflow

### Phase-Based Development
We follow a structured approach divided into 5 phases:

1. **Phase 1: Vendor Foundation** - Vendor registration, store creation, store configuration, and subdomain preview
2. **Phase 2: Core Logic** - Product system, inventory management, basic storefront features
3. **Phase 3: Multi-Tenancy** - Dynamic subdomain routing, theme system, advanced store customization
4. **Phase 4: Advanced Features** - Orders, payments, admin panel, search functionality
5. **Phase 5: Production** - Deployment, optimization, monitoring, performance tuning

### Phase 1 Goals (Current Focus)
- ✅ **Vendor Registration**: Complete signup and authentication system
- ✅ **Store Creation**: Vendors can create and name their stores
- 🚧 **Store Configuration**: Basic store settings (name, description, branding colors, contact info)
- 🚧 **Subdomain Preview**: Vendors can see their future subdomain (vendor-name.platform.com)
- ✅ **Vendor Dashboard**: Simple interface to manage store settings
- ❌ **Product Management**: Not included in Phase 1 (comes in Phase 2)

### Service Ports
| Service | Port | Purpose |
|---------|------|---------|
| API Gateway | 3000 | Main entry point |
| Auth Service | 3001 | Authentication |
| Vendor Service | 3002 | Vendor management |
| Product Service | 3003 | Product catalog |
| Order Service | 3004 | Order processing |
| Payment Service | 3005 | Payments |
| Theme Service | 3006 | Theme management |
| Search Service | 3007 | Search functionality |
| Notification Service | 3008 | Notifications |

## 🛠️ Architecture Decisions

### Multi-Tenancy Strategy
- **Shared Database**: Single PostgreSQL instance with tenant isolation
- **Subdomain Routing**: Each vendor gets vendor.platform.com
- **Theme Isolation**: Vendor-specific theme loading
- **Data Separation**: Row-level security with vendor_id

### Microservices Communication
- **API Gateway**: Central entry point with request routing
- **Event-Driven**: RabbitMQ for async communication
- **Service Discovery**: Kubernetes native service discovery
- **Circuit Breakers**: Resilience patterns for service failures

### Database Design
- **Multi-tenant**: Single database with vendor isolation
- **Complex Variations**: Hierarchical product variation system
- **Inventory Tracking**: Real-time stock management
- **Audit Trail**: Complete order and change history

## 🧪 Testing Strategy

```bash
# Run all tests
pnpm test

# Run tests for specific service
cd services/auth && pnpm test

# Run e2e tests
pnpm test:e2e

# Run tests with coverage
pnpm test:cov
```

## 🚢 Deployment

### Local Development
```bash
# Start all services (infrastructure + microservices)
pnpm run docker:up

# Start frontend apps for development
pnpm run dev:admin        # React admin panel
pnpm run dev:storefront   # Next.js storefront

# View logs
pnpm run docker:logs

# Stop everything
pnpm run docker:down
```

### Kubernetes Production
```bash
# Apply Kubernetes manifests
kubectl apply -f infrastructure/kubernetes/

# Monitor deployments
kubectl get pods -n ecommerce
```

## 📊 Monitoring & Observability

- **Metrics**: Prometheus metrics collection
- **Dashboards**: Grafana dashboards for service monitoring
- **Logging**: Centralized logging with ELK stack
- **Tracing**: Distributed tracing for request flows
- **Health Checks**: Kubernetes-native health monitoring

## 🔐 Security

- **Authentication**: JWT-based with refresh tokens
- **Authorization**: Role-based access control (RBAC)
- **API Security**: Rate limiting, request validation
- **Data Protection**: Encryption at rest and in transit
- **Multi-tenancy**: Strict tenant data isolation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📈 Performance

- **Caching**: Multi-level caching (Redis, CDN, Browser)
- **Database**: Optimized queries with proper indexing
- **Images**: Next.js image optimization
- **CDN**: Static asset delivery optimization
- **Auto-scaling**: Kubernetes HPA for traffic spikes

## 📚 Learning Resources

This project serves as a comprehensive learning platform for:
- **Microservices Architecture**: Service design and communication
- **Multi-tenancy**: Tenant isolation strategies
- **Kubernetes**: Container orchestration and scaling
- **Modern Frontend**: Next.js 15, React 18, modern patterns
- **DevOps**: CI/CD, monitoring, deployment automation

## 📝 Documentation

- **API Documentation**: Available at `/api/docs` when running
- **Architecture Diagrams**: In `/docs/architecture/`
- **Setup Guides**: Service-specific README files
- **Session Templates**: `/SESSION_PROMPT_TEMPLATE.md` for development sessions

## 🗺️ Roadmap

### Phase 1: Vendor Foundation (Current) 🚧
- [x] **Infrastructure Setup**: Docker services, database, development environment
- [x] **Service Architecture**: API Gateway, Auth Service, Vendor Service running
- [ ] **Vendor Registration**: Complete signup flow with email verification
- [ ] **Store Creation**: Vendors can create stores with basic information
- [ ] **Store Configuration**: 
  - Store name, description, and contact information
  - Basic branding (colors, logo upload)
  - Business details (category, location)
  - Store settings (timezone, currency)
- [ ] **Subdomain Preview**: Show vendors their future subdomain URL
- [ ] **Vendor Dashboard**: Interface to manage store settings and view subdomain

### Future Phases
- [ ] **Phase 2**: Product management and inventory system
- [ ] **Phase 3**: Dynamic subdomain routing and theme system  
- [ ] **Phase 4**: Order management and payment processing
- [ ] **Phase 5**: Production deployment and optimization

### Phase 1 Success Criteria
✅ **Vendor can register an account**
✅ **Vendor can log in and access dashboard**  
✅ **Vendor can create a store with configuration**
✅ **Vendor can see their subdomain preview (vendor-name.platform.com)**
✅ **Store settings are persistent and editable**

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with modern web technologies and best practices
- Inspired by enterprise-grade e-commerce solutions
- Designed for scalability and maintainability

---

**Note**: This is an active learning project where we implement enterprise-grade features step by step. Each phase builds upon the previous one, ensuring a solid understanding of modern web architecture.

For development sessions, refer to `SESSION_PROMPT_TEMPLATE.md` for consistent context and progress tracking.
