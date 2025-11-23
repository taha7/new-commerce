# 🛍️ Multi-Vendor E-Commerce Platform

A modern, scalable multi-vendor e-commerce platform built with microservices architecture, where each vendor can have their own customized website with different themes and branding.

## 🎯 Vision

Create a comprehensive e-commerce ecosystem that allows multiple vendors to operate their own stores under a unified platform, with complete customization capabilities and enterprise-grade scalability.

## ✨ Key Features

### 🏪 Multi-Vendor Architecture
- **Vendor Isolation**: Each vendor gets their own subdomain (vendor1.platform.com)
- **Custom Themes**: Dynamic theme loading and customization per vendor
- **Independent Branding**: Complete control over store appearance and branding
- **Scalable Infrastructure**: Kubernetes-based auto-scaling for high traffic

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

### **Frontend**
- **Storefront**: Next.js 15 with App Router
- **Admin Panel**: React 18 + Vite + TailwindCSS
- **Vendor Portal**: Next.js 15 for vendor management

### **Backend Microservices**
- **API Gateway**: Request routing, authentication, rate limiting (NestJS)
- **Auth Service**: JWT, OAuth, multi-tenant authentication (NestJS)
- **Vendor Service**: Vendor management and store configuration (NestJS)
- **Product Service**: Catalog, variations, inventory management (NestJS)
- **Theme Service**: Dynamic theme management (NestJS)
- **Order Service**: Cart, checkout, order processing (NestJS)
- **Payment Service**: Payment gateway integrations (NestJS)
- **Search Service**: Elasticsearch integration (NestJS)
- **Notification Service**: Email, SMS, push notifications (NestJS)

### **Infrastructure**
- **Orchestration**: Kubernetes
- **Database**: PostgreSQL (multi-tenant architecture)
- **Cache**: Redis
- **Message Queue**: RabbitMQ
- **Search Engine**: Elasticsearch
- **Monitoring**: Prometheus + Grafana
- **Logging**: ELK Stack

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PNPM 8+
- Docker & Docker Compose
- Kubernetes (for production)

### Development Setup

1. **Clone the repository**
   ```bash
   git clone git@github-personal:taha7/new-commerce.git
   cd new-commerce
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Start infrastructure services**
   ```bash
   docker-compose up -d
   ```

4. **Set up environment variables**
   ```bash
   # Copy environment files for each service
   cd services/auth && cp .env.example .env
   cd ../api-gateway && cp .env.example .env
   # Vendor service already has .env
   ```

5. **Start development services**
   ```bash
   # Start all services in development mode
   pnpm dev
   
   # Or start individual services:
   cd services/api-gateway && pnpm run start:dev    # Port 3000
   cd services/auth && pnpm run start:dev           # Port 3001  
   cd services/vendor && pnpm run start:dev         # Port 3002
   ```

6. **Start frontend applications**
   ```bash
   cd apps/admin && pnpm dev         # Admin panel
   cd apps/storefront && pnpm dev    # Customer storefront
   ```

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

1. **Phase 1: Foundation** - Monorepo setup, core services, development environment
2. **Phase 2: Core Logic** - Vendor management, product system, basic storefront  
3. **Phase 3: Multi-Tenancy** - Subdomain routing, theme system, Kubernetes
4. **Phase 4: Advanced Features** - Orders, payments, admin panel, search
5. **Phase 5: Production** - Deployment, optimization, monitoring

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
docker-compose up -d  # Infrastructure only
pnpm dev             # All services in development mode
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

- [x] **Phase 1**: Foundation and core services setup
- [ ] **Phase 2**: Vendor management and product system
- [ ] **Phase 3**: Multi-tenancy and theme system  
- [ ] **Phase 4**: Order management and payments
- [ ] **Phase 5**: Production deployment and optimization

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with modern web technologies and best practices
- Inspired by enterprise-grade e-commerce solutions
- Designed for scalability and maintainability

---

**Note**: This is an active learning project where we implement enterprise-grade features step by step. Each phase builds upon the previous one, ensuring a solid understanding of modern web architecture.

For development sessions, refer to `SESSION_PROMPT_TEMPLATE.md` for consistent context and progress tracking.
