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
- **Auth Service**: JWT, OAuth, user registration and authentication (NestJS)
- **Vendor Service**: Store creation, vendor management, store configuration (NestJS)
- **Product Service**: Product catalog, variations, inventory management (NestJS) *[Phase 2]*
- **Theme Service**: Dynamic theme management and customization (NestJS) *[Phase 3]*
- **Order Service**: Cart, checkout, order processing (NestJS) *[Phase 4]*
- **Payment Service**: Payment gateway integrations (NestJS) *[Phase 4]*
- **Search Service**: Elasticsearch integration (NestJS) *[Phase 4]*
- **Notification Service**: Email, SMS, push notifications (NestJS) *[Phase 2+]*

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
- Node.js 24+
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

3. **Start all services with Docker**
   ```bash
   # Build and start all services and infrastructure
   pnpm run docker:build
   pnpm run docker:up
   
   # View logs
   pnpm run docker:logs
   
   # Stop all services
   pnpm run docker:down
   ```

4. **Set up environment variables (optional)**
   ```bash
   # Copy environment files for each service if customization needed
   cd services/auth && cp .env.example .env
   cd ../api-gateway && cp .env.example .env
   cd ../vendor && cp .env.example .env
   ```

5. **Start frontend applications (for development)**
   ```bash
   # Run frontend apps locally for fast development
   pnpm run dev:admin        # Admin panel at http://localhost:5173
   pnpm run dev:storefront   # Customer storefront at http://localhost:3000
   ```

### Service URLs (when running)
- **API Gateway**: http://localhost:3000
- **Auth Service**: http://localhost:3001  
- **Vendor Service**: http://localhost:3002
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379
- **Elasticsearch**: http://localhost:9200
- **RabbitMQ Management**: http://localhost:15672 (user/password)

6. **Verify everything is running**
   ```bash
   # Check service status
   curl http://localhost:3000  # API Gateway
   curl http://localhost:3001  # Auth Service
   curl http://localhost:3002  # Vendor Service
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

1. **Phase 1: Vendor Foundation** - Vendor registration, store creation, store configuration, and subdomain preview
2. **Phase 2: Core Logic** - Product system, inventory management, basic storefront features
3. **Phase 3: Multi-Tenancy** - Dynamic subdomain routing, theme system, advanced store customization
4. **Phase 4: Advanced Features** - Orders, payments, admin panel, search functionality
5. **Phase 5: Production** - Deployment, optimization, monitoring, performance tuning

### Phase 1 Goals (Current Focus)
- ✅ **Vendor Registration**: Complete signup and authentication system
- 🚧 **Store Creation**: Vendors can create and name their stores
- 🚧 **Store Configuration**: Basic store settings (name, description, branding colors, contact info)
- 🚧 **Subdomain Preview**: Vendors can see their future subdomain (vendor-name.platform.com)
- 🚧 **Vendor Dashboard**: Simple interface to manage store settings
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
