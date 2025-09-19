# ⚡ The Cosmic Coffeehouse - Backend API

> **Quantum-Powered Express API for Superpower E-commerce**

A robust Node.js Express API serving The Cosmic Coffeehouse frontend with TypeScript, MongoDB, and JWT authentication. This backend manages the intergalactic commerce of superpower-granting coffee capsules and quantum brewing machines.

## 🚀 Features

### Current Implementation
- ✅ **Express.js** with TypeScript for type-safe API development
- ✅ **MongoDB** with Mongoose ODM for data persistence
- ✅ **JWT Authentication** with bcrypt password hashing
- ✅ **RESTful API Design** following industry best practices
- ✅ **Data Validation** with Mongoose schemas
- ✅ **CORS Configuration** for cross-origin requests
- ✅ **Environment Configuration** with dotenv
- ✅ **Database Seeding** with sample cosmic products

### 🔮 Upcoming Features
- 🔄 **Unit Testing** with Jest and Supertest
- 🔄 **API Documentation** with Swagger/OpenAPI
- 🔄 **Rate Limiting** and security middleware
- 🔄 **Logging** with Winston
- 🔄 **Input Validation** with express-validator
- 🔄 **Error Handling** middleware

## 🛠️ Technology Stack

- **Node.js** - JavaScript runtime environment
- **Express.js** - Fast, unopinionated web framework
- **TypeScript** - Type safety and enhanced developer experience
- **MongoDB** - NoSQL database for flexible data storage
- **Mongoose** - Elegant MongoDB object modeling
- **JWT** - JSON Web Tokens for stateless authentication
- **bcrypt** - Password hashing and comparison
- **cors** - Cross-Origin Resource Sharing middleware
- **dotenv** - Environment variable management

## 📁 Project Structure

```
src/
├── models/              # Mongoose schemas and models
│   ├── User.ts         # User authentication model
│   ├── Capsule.ts      # Superpower capsule model
│   ├── Machine.ts      # Brewing machine model
│   └── Cart.ts         # Shopping cart model (future)
├── routes/             # Express route handlers
│   ├── auth.ts         # Authentication endpoints
│   ├── capsules.ts     # Capsule CRUD operations
│   ├── machines.ts     # Machine CRUD operations
│   └── cart.ts         # Cart operations (future)
├── scripts/            # Database utilities
│   └── seedDatabase.ts # Sample data seeding
├── types/              # TypeScript type definitions
│   └── index.ts        # Shared type definitions
└── server.ts           # Main application entry point
```

## 🗂️ Database Schema

### User Model
```typescript
interface IUser {
  username: string;        // Unique cosmic callsign
  email: string;          // Galactic communication address
  password: string;       // Encrypted with bcrypt
  powerLevel: number;     // User's current enhancement level
  credits: number;        // Cosmic currency balance
  createdAt: Date;        // Account creation timestamp
  updatedAt: Date;        // Last modification timestamp
}
```

### Capsule Model
```typescript
interface ICapsule {
  name: string;           // Product name
  description: string;    // Detailed product description
  price: number;          // Cost in cosmic credits
  powerType: 'mental' | 'physical' | 'mystical' | 'temporal';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  duration: number;       // Effect duration in minutes
  strength: number;       // Enhancement strength (1-10)
  sideEffects: string[];  // Potential side effects
  inStock: boolean;       // Availability status
  imageUrl: string;       // Product image reference
}
```

### Machine Model
```typescript
interface IMachine {
  name: string;           // Machine model name
  description: string;    // Technical specifications
  price: number;          // Cost in cosmic credits
  machineModel: string;   // Model identifier
  powerOutput: number;    // Brewing power capacity
  compatibility: string[];// Compatible capsule types
  efficiency: number;     // Energy efficiency rating
  warranty: number;       // Warranty period in years
  inStock: boolean;       // Availability status
  imageUrl: string;       // Product image reference
}
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Docker)
- npm or yarn

### Installation

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start MongoDB**
   ```bash
   # Using Docker (recommended)
   docker run -d --name cosmic-mongo -p 27017:27017 mongo:latest

   # Or start local MongoDB service
   mongod
   ```

5. **Seed the database**
   ```bash
   npm run seed
   ```

6. **Start development server**
   ```bash
   npm run dev
   ```

7. **Access the API**
   - Backend API: http://localhost:3000

### Development Commands

```bash
# Development
npm run dev              # Start development server with nodemon
npm run build            # Compile TypeScript to JavaScript
npm run start            # Start production server
npm run seed             # Seed database with sample data

# Code Quality
npm run lint             # Run ESLint
npm run type-check       # TypeScript validation

# Database
npm run db:reset         # Reset and reseed database
npm run db:backup        # Backup current database
npm run db:restore       # Restore from backup

# Testing (Future)
npm run test             # Run unit tests
npm run test:integration # Run integration tests
npm run test:coverage    # Generate coverage report
```

## 🔐 Environment Configuration

### Required Environment Variables

Create a `.env` file in the backend directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/cosmic-coffeehouse

# Authentication Configuration
JWT_SECRET=your-super-secret-cosmic-key-here
JWT_EXPIRES_IN=15m

# CORS Configuration
FRONTEND_URL=http://localhost:5173

# Security Configuration
BCRYPT_ROUNDS=12

# Feature Flags (Future)
ENABLE_RATE_LIMITING=false
ENABLE_API_DOCS=true
LOG_LEVEL=debug
```

## 📊 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "username": "cosmic_pilot",
  "email": "pilot@cosmic.coffee",
  "password": "SecurePassword123"
}
```

#### Login User
```http
POST /auth/login
Content-Type: application/json

{
  "email": "pilot@cosmic.coffee",
  "password": "SecurePassword123"
}
```

#### Get User Profile
```http
GET /auth/profile
Authorization: Bearer <jwt_token>
```

### Product Endpoints

#### Get All Capsules
```http
GET /api/capsules
Query Parameters:
  - powerType: string (optional)
  - rarity: string (optional)
  - minPrice: number (optional)
  - maxPrice: number (optional)
```

#### Get Capsule by ID
```http
GET /api/capsules/:id
```

#### Get All Machines
```http
GET /api/machines
Query Parameters:
  - minPrice: number (optional)
  - maxPrice: number (optional)
  - powerOutput: number (optional)
```

#### Get Machine by ID
```http
GET /api/machines/:id
```

#### Get Featured Products
```http
GET /api/products/featured
```

### Cart Endpoints (Future Implementation)

#### Get User Cart
```http
GET /api/cart
Authorization: Bearer <jwt_token>
```

#### Add Item to Cart
```http
POST /api/cart/add
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "productId": "product_id_here",
  "productType": "capsule" | "machine",
  "quantity": 1
}
```

#### Update Cart Item
```http
PUT /api/cart/update/:itemId
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "quantity": 2
}
```

#### Remove Cart Item
```http
DELETE /api/cart/remove/:itemId
Authorization: Bearer <jwt_token>
```

## 🔒 Authentication & Authorization

### JWT Token Structure
```json
{
  "id": "user_id",
  "email": "user@example.com",
  "username": "cosmic_user",
  "powerLevel": 42,
  "iat": 1234567890,
  "exp": 1234567890
}
```

### Middleware
- **authenticateToken**: Validates JWT tokens
- **cors**: Enables cross-origin requests
- **express.json**: Parses JSON request bodies
- **express.urlencoded**: Parses URL-encoded data

## 🧪 Testing Strategy (Planned)

### Unit Testing
- **Jest** for test framework
- **Supertest** for HTTP endpoint testing
- **MongoDB Memory Server** for isolated database testing
- **Mock functions** for external dependencies

### Integration Testing
- Full API endpoint testing
- Database integration tests
- Authentication flow testing
- Error handling verification

### Test Coverage Targets
- Line Coverage: >85%
- Function Coverage: >90%
- Branch Coverage: >80%

## 🎯 Sample Data

The database seeding script populates the following:

### Superpower Capsules
1. **Neural Boost Alpha** - Mental enhancement capsule
2. **Titan Strength Serum** - Physical augmentation capsule
3. **Shadow Veil Extract** - Mystical invisibility capsule
4. **Chronos Essence** - Temporal manipulation capsule

### Quantum Machines
1. **QuantumBrew Pro X1** - Professional-grade brewing system
2. **CosmicPress Elite** - High-efficiency extraction machine

### Test Users
1. **cosmic_admin** - Administrator account
2. **test_pilot** - Standard user account

## 🚀 Performance Considerations

### Current Optimizations
- Mongoose connection pooling
- JSON response compression
- Efficient database queries
- Password hashing optimization

### Planned Optimizations
- Redis caching for frequently accessed data
- Database indexing for search queries
- API response pagination
- Request/response compression
- Connection keep-alive optimization

## 🛡️ Security Features

### Current Implementation
- Password hashing with bcrypt (12 rounds)
- JWT token-based authentication
- CORS configuration for allowed origins
- Environment variable protection
- Input sanitization via Mongoose schemas

### Planned Security Features
- Rate limiting middleware
- Request validation with express-validator
- Helmet.js for security headers
- API key authentication for admin endpoints
- SQL injection prevention (already handled by MongoDB)
- XSS protection middleware

## 🔧 Configuration Files

### TypeScript Configuration
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true
  }
}
```

### Package.json Scripts
```json
{
  "scripts": {
    "dev": "nodemon src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "seed": "ts-node src/scripts/seedDatabase.ts",
    "lint": "eslint src/**/*.ts",
    "type-check": "tsc --noEmit"
  }
}
```

## 🐛 Known Issues

Current issues for QA demonstration:
- Error handling middleware not implemented
- Input validation could be more comprehensive
- API response standardization needed
- Rate limiting not implemented
- Logging system not configured

## 📈 Future Enhancements

### Immediate Priorities
- Comprehensive error handling middleware
- API documentation with Swagger/OpenAPI
- Input validation with express-validator
- Structured logging with Winston
- Rate limiting and security headers

### Long-term Goals
- **Microservices Architecture** for scalability
- **GraphQL API** alongside REST endpoints
- **Real-time Features** with Socket.IO
- **Caching Layer** with Redis
- **Background Jobs** with Bull Queue
- **Health Check Endpoints** for monitoring
- **API Versioning** for backward compatibility

## 📞 Support & Maintenance

### Development Guidelines
1. Follow TypeScript best practices
2. Maintain consistent error handling
3. Write comprehensive tests for new features
4. Document API changes in this README
5. Use meaningful commit messages

### Database Management
- Regular backups before major updates
- Monitor query performance
- Index optimization for search features
- Schema versioning for migrations

---

**Built with ⚡ for intergalactic commerce and superpower distribution**