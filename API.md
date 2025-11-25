# API Documentation

## Current Implementation Status

**✅ Implemented Services:**
- Authentication Service (Port 3001)
- Vendor Service (Port 3002)  
- API Gateway (Port 3000)

**🗄️ Database Architecture:**
- `auth_db`: User authentication and profiles
- `vendor_db`: Vendor profiles and store configurations

---

## Authentication Service

**Base URL:** `http://localhost:3001`  
**Database:** `auth_db`

### Endpoints

#### POST /auth/register
Register a new user account.

**Request:**
```json
{
  "email": "vendor@example.com",
  "password": "securePassword123"
}
```

**Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "cmidiavpi0000jkw9b2hngt87",
    "email": "vendor@example.com",
    "verified": false,
    "createdAt": "2025-11-24T18:54:53.191Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error (409):**
```json
{
  "statusCode": 409,
  "message": "User with this email already exists"
}
```

#### POST /auth/login  
Authenticate existing user.

**Request:**
```json
{
  "email": "vendor@example.com", 
  "password": "securePassword123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "user": {
    "id": "cmidiavpi0000jkw9b2hngt87",
    "email": "vendor@example.com",
    "verified": false,
    "createdAt": "2025-11-24T18:54:53.191Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error (401):**
```json
{
  "statusCode": 401,
  "message": "Invalid email or password"
}
```

---

## Vendor Service

**Base URL:** `http://localhost:3002`  
**Database:** `vendor_db`  
**Authentication:** JWT Bearer token required

### Headers
```
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

### Endpoints

#### POST /vendor/profile
Create vendor business profile.

**Request:**
```json
{
  "businessName": "Amazing Electronics Store",
  "businessType": "Electronics Retail",
  "description": "High-quality electronics and gadgets",
  "contactPhone": "+1-555-123-4567",
  "address": "123 Commerce Street",
  "city": "New York",
  "state": "NY", 
  "zipCode": "10001",
  "country": "United States"
}
```

**Response (201):**
```json
{
  "message": "Vendor profile created successfully",
  "vendor": {
    "id": "vendor_abc123",
    "userId": "cmidiavpi0000jkw9b2hngt87",
    "businessName": "Amazing Electronics Store",
    "businessType": "Electronics Retail", 
    "description": "High-quality electronics and gadgets",
    "contactPhone": "+1-555-123-4567",
    "address": "123 Commerce Street",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001", 
    "country": "United States",
    "verified": false,
    "createdAt": "2025-11-24T19:00:00.000Z",
    "updatedAt": "2025-11-24T19:00:00.000Z"
  }
}
```

**Error (400):**
```json
{
  "statusCode": 400,
  "message": ["businessName must not be empty", "address must not be empty"]
}
```

**Error (409):**
```json
{
  "statusCode": 409,
  "message": "Vendor profile already exists for this user"
}
```

#### GET /vendor/profile
Get vendor profile for authenticated user.

**Response (200):**
```json
{
  "id": "vendor_abc123",
  "userId": "cmidiavpi0000jkw9b2hngt87",
  "businessName": "Amazing Electronics Store",
  "businessType": "Electronics Retail",
  "description": "High-quality electronics and gadgets",
  "contactPhone": "+1-555-123-4567", 
  "address": "123 Commerce Street",
  "city": "New York",
  "state": "NY",
  "zipCode": "10001",
  "country": "United States",
  "verified": false,
  "createdAt": "2025-11-24T19:00:00.000Z",
  "updatedAt": "2025-11-24T19:00:00.000Z"
}
```

**Error (404):**
```json
{
  "statusCode": 404,
  "message": "Vendor profile not found"
}
```

#### POST /vendor/stores
Create a new store for the vendor.

**Request:**
```json
{
  "name": "Electronics Plus NYC",
  "description": "Premium electronics in Manhattan", 
  "slug": "electronics-plus-nyc",
  "settings": {
    "theme": "modern-dark",
    "primaryColor": "#1f2937",
    "accentColor": "#3b82f6"
  }
}
```

**Response (201):**
```json
{
  "message": "Store created successfully",
  "store": {
    "id": "store_xyz789",
    "vendorId": "vendor_abc123", 
    "name": "Electronics Plus NYC",
    "description": "Premium electronics in Manhattan",
    "slug": "electronics-plus-nyc",
    "settings": {
      "theme": "modern-dark",
      "primaryColor": "#1f2937", 
      "accentColor": "#3b82f6"
    },
    "active": true,
    "createdAt": "2025-11-24T19:15:00.000Z",
    "updatedAt": "2025-11-24T19:15:00.000Z"
  }
}
```

#### GET /vendor/stores
Get all stores for the authenticated vendor.

**Response (200):**
```json
{
  "stores": [
    {
      "id": "store_xyz789",
      "vendorId": "vendor_abc123",
      "name": "Electronics Plus NYC", 
      "description": "Premium electronics in Manhattan",
      "slug": "electronics-plus-nyc",
      "settings": {
        "theme": "modern-dark",
        "primaryColor": "#1f2937",
        "accentColor": "#3b82f6"
      },
      "active": true,
      "createdAt": "2025-11-24T19:15:00.000Z",
      "updatedAt": "2025-11-24T19:15:00.000Z"
    }
  ]
}
```

---

## API Gateway

**Base URL:** `http://localhost:3000`  
**Purpose:** Central entry point, request routing, CORS handling

### Features
- **Request Routing**: Forwards requests to appropriate services
- **CORS Handling**: Configured for frontend applications  
- **Rate Limiting**: Prevents API abuse
- **Logging**: Request/response logging for monitoring

### Route Mapping
```
/auth/*     → Auth Service (Port 3001)
/vendor/*   → Vendor Service (Port 3002)
```

---

## Error Handling

### Standard Error Format
All services return errors in this format:

```json
{
  "statusCode": 400,
  "message": "Error description" | ["Array", "of", "errors"],
  "error": "Bad Request" 
}
```

### HTTP Status Codes
- **200**: Success
- **201**: Created
- **400**: Bad Request (validation errors)
- **401**: Unauthorized (missing/invalid token)
- **403**: Forbidden (insufficient permissions)
- **404**: Not Found
- **409**: Conflict (duplicate resource)
- **500**: Internal Server Error

---

## Authentication Flow

### 1. User Registration
```bash
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"vendor@example.com","password":"secure123"}'
```

### 2. Store JWT Token
Save the returned token for subsequent requests.

### 3. Create Vendor Profile  
```bash
curl -X POST http://localhost:3002/vendor/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt-token>" \
  -d '{"businessName":"My Store","businessType":"Retail",...}'
```

### 4. Access Protected Resources
Include JWT token in all vendor service requests:
```bash
curl -H "Authorization: Bearer <jwt-token>" \
  http://localhost:3002/vendor/profile
```

---

## Development Testing

### Using curl
```bash
# Register user
TOKEN=$(curl -s -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}' \
  | jq -r '.token')

# Create vendor profile
curl -X POST http://localhost:3002/vendor/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"businessName":"Test Store","businessType":"Retail","address":"123 Test St","city":"Test City","state":"TS","zipCode":"12345","country":"USA"}'

# Get vendor profile
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3002/vendor/profile
```

### Using Frontend
1. Visit http://localhost:3003
2. Register new account
3. Complete vendor profile form
4. Access vendor dashboard
5. Create and manage stores
