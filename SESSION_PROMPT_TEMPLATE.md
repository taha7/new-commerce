# Session Prompt Template

## 🔥 IMPORTANT: Start Every Session With This Context

**Project**: Multi-Vendor E-Commerce Platform  
**Working Directory**: `/home/tahamohamed/Desktop/cs/non-work/projects/e-commerce/new`

### **📋 Project Specifications (READ FIRST)**

**Architecture**: Microservices with NestJS backend, Next.js frontends, PostgreSQL databases  
**Current Status**: Auth service, Vendor service, and Vendor Portal fully functional  
**Development Environment**: Docker Compose with live reload and Prisma client sync

### **⚙️ Technical Requirements:**
- **Package Manager**: Always use `pnpm` (never npm or yarn)
- **Node.js Version**: 24.11.1 (specified in .nvmrc)
- **Database**: PostgreSQL with separate databases per service (auth_db, vendor_db)
- **ORM**: Prisma with custom output paths for Docker development
- **Authentication**: JWT tokens between services
- **Frontend**: Modern UI with shadcn/ui components and Tailwind CSS

### **🚀 Current Working Services:**
- **Auth Service (Port 3001)**: User registration/login with JWT authentication
- **Vendor Service (Port 3002)**: Vendor profile management with 9 business fields
- **Vendor Portal (Port 3003)**: Next.js 16 dashboard for vendor management
- **PostgreSQL (Port 5432)**: Separate databases per service
- **Redis (Port 6379)**: Caching and sessions
- **RabbitMQ (Port 15672)**: Message queue
- **Elasticsearch (Port 9200)**: Search engine

### **🛍️ Business Logic:**
- **Multi-Vendor Platform**: Each vendor gets their own customizable store
- **Vendor Registration**: 9-field business profile (businessName, businessType, description, contactPhone, address, city, state, zipCode, country)
- **Store Isolation**: Each vendor operates independently
- **Theme System**: Dynamic themes per vendor store (planned)
- **Product Variations**: Complex hierarchical variations (planned)

### **🔧 Development Workflow:**
- Services run in Docker containers with volume mounts for live reload
- Prisma clients generate to `./services/*/generated/prisma-client/`
- After schema changes: `docker compose exec [service] npx prisma db push && npx prisma generate`
- Commit components independently with descriptive messages

### **📁 Project Structure:**
```
├── apps/
│   ├── vendor-portal/     # Next.js 16 - Vendor management (Port 3003)
│   ├── admin/             # React 18 - Platform administration (Port 5173)
│   └── storefront/        # Next.js 15 - Customer stores (Port 3000)
├── services/
│   ├── auth/              # NestJS - Authentication service (Port 3001)
│   ├── vendor/            # NestJS - Vendor management (Port 3002)
│   └── api-gateway/       # NestJS - Request routing (Port 3000)
└── docker-compose.yml     # Development orchestration
```

---

## 🎯 Session Workflow Template

**Copy this for each session:**

### **Today's Goal**: 
[Specific objective - e.g., "Implement product management system for vendors"]

### **What We've Built So Far**: 
- ✅ Auth service with JWT authentication
- ✅ Vendor service with comprehensive business profiles
- ✅ Vendor Portal with modern UI (shadcn/ui)
- ✅ Docker environment with Prisma client sync
- ✅ Clean commit history with component separation
- ✅ **Store Creation System**:
  - Store creation form with auto-slug generation
  - Store listing page with grid layout
  - Store management dashboard integration
  - Backend API for store CRUD operations

### **Current Task**: 
[e.g., "Add product CRUD operations to vendor service"]

### **Expected Deliverables**: 
- [List what should be completed this session]

### **Reference Files**:
- `SETUP.md` - Development environment setup and troubleshooting
- `API.md` - API documentation and endpoint reference
- `README.md` - Project overview and quick start guide

---

## 💡 Development Standards

**Code Quality**:
- Always use TypeScript strict mode
- Implement proper error handling and validation
- Follow microservices principles (separate databases, independent deployment)
- Document APIs and development processes

**Git Workflow**:
- Commit components independently with descriptive messages
- Use conventional commit format: `feat:`, `fix:`, `docs:`, etc.
- Include emoji for visual categorization (🔐 auth, 🏪 vendor, 💻 frontend, 🐳 docker, etc.)

**Architecture Principles**:
- Each service owns its data (separate databases)
- Services communicate via HTTP/JWT
- Frontend applications are service-agnostic
- Infrastructure as code with Docker

---

*🔄 Update this template as the project evolves. Always read this file at session start!*
