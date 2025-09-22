# 🚀 The Cosmic Coffeehouse

> **A Futuristic E-commerce Experience for Superpower Enhancement**
> *Senior QA Engineer Interview Preparation Project*

Welcome to The Cosmic Coffeehouse - where science fiction meets caffeine! This is a comprehensive full-stack e-commerce application designed to demonstrate advanced QA engineering practices and modern web development technologies.

## 🌌 Project Overview

The Cosmic Coffeehouse is a sci-fi themed e-commerce platform selling:
- **Superpower Coffee Capsules**: Temporary enhancement capsules for mental, physical, mystical, and temporal abilities
- **Futuristic Brewing Machines**: Advanced quantum-powered coffee machines from across the galaxy

### 🎯 Purpose
This project serves as a comprehensive demonstration for Senior QA Engineer interview preparation, showcasing:
- Complete test automation frameworks
- Quality assurance best practices
- Modern full-stack development
- CI/CD pipeline implementation
- Risk-based testing strategies

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for blazing-fast development
- **Tailwind CSS** with custom sci-fi design system
- **React Router** for navigation
- **Axios** for API communication

### Backend
- **Node.js** with Express framework
- **TypeScript** for type safety
- **MongoDB** with Mongoose ODM
- **JWT** authentication with bcrypt
- **Express middleware** for security

### Infrastructure
- **Docker** for MongoDB containerization
- **Cross-platform scripts** for development
- **ESLint & Prettier** for code quality
- **Git Flow** methodology

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React + TS    │    │  Express + TS   │    │   MongoDB       │
│   Frontend      │◄──►│   Backend       │◄──►│   Database      │
│   Port: 5173    │    │   Port: 3000    │    │   Port: 27017   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │     Future      │
                    │   QA Tooling    │
                    │  (Next Phase)   │
                    └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- Docker Desktop
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/antoniogomezgallardo/TheCosmicCoffeehouse.git
   cd TheCosmicCoffeehouse
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start MongoDB with Docker**
   ```bash
   npm run start:mongo
   ```

4. **Start the development servers**
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000

### 🎮 Development Commands

```bash
# Development
npm run dev              # Start both frontend and backend
npm run start:mongo      # Start MongoDB container
npm run stop             # Stop all development servers safely
npm run restart          # Restart everything

# Building
npm run build           # Build for production
npm run preview         # Preview production build

# Code Quality
npm run lint            # Run ESLint
npm run format          # Format code with Prettier
npm run type-check      # TypeScript validation

# Testing (New in September 2025)
npm run test            # Run all tests
npm run test:unit       # Unit tests only
npm run test:coverage   # Generate coverage report
npm run test:watch      # Watch mode for development

# CI/CD Integration
npm run ci              # Full CI pipeline locally
```

## 📁 Project Structure

```
TheCosmicCoffeehouse/
├── frontend/                 # React TypeScript application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Route-based page components
│   │   ├── contexts/        # React contexts (auth, cart)
│   │   ├── services/        # API communication
│   │   ├── test/            # Test setup and utilities
│   │   └── types/           # TypeScript definitions
│   ├── vitest.config.ts     # Vitest configuration
│   └── package.json
├── backend/                  # Express TypeScript API
│   ├── src/
│   │   ├── models/          # Mongoose schemas
│   │   ├── routes/          # API endpoints
│   │   ├── middleware/      # Express middleware (logging, auth)
│   │   ├── config/          # Configuration (logger, database)
│   │   ├── tests/           # Test suites (unit, integration)
│   │   ├── scripts/         # Database seeding
│   │   └── types/           # TypeScript definitions
│   ├── jest.config.js       # Jest configuration
│   └── package.json
├── .github/
│   └── workflows/
│       └── quality-gate.yml # CI/CD pipeline configuration
├── .git/hooks/              # Local quality gates
│   └── pre-commit           # Pre-commit validation
├── scripts/                 # Development utilities
├── .claude/                 # Claude Code configuration
└── docs/                    # Comprehensive documentation
    ├── ci-cd/               # CI/CD pipeline documentation
    ├── development/         # Development guides and TypeScript docs
    ├── observability/       # Logging and monitoring
    ├── quality-gates/       # Pre-commit hooks and quality
    └── testing/             # Test configuration and strategies
```

## 🌟 Features

### Current MVP Features
- ✅ **User Authentication**: Registration, login, JWT-based auth
- ✅ **Product Catalog**: Dynamic product listing with filtering
- ✅ **Shopping Cart**: Add, remove, update quantities
- ✅ **Sci-Fi Design System**: Custom Tailwind theme with animations
- ✅ **Responsive Design**: Mobile-first approach
- ✅ **API Integration**: Full REST API with MongoDB

### ✅ Recent QA Implementations (September 2025)
- ✅ **Comprehensive Testing Suite**: Jest (backend) + Vitest (frontend) with 110+ passing tests
- ✅ **CI/CD Pipeline**: GitHub Actions with comprehensive quality gates and matrix testing
- ✅ **Application Logging**: Winston-based structured logging with specialized QA observability
- ✅ **Security Testing**: Multi-layered security scanning with Snyk integration
- ✅ **TypeScript Improvements**: Zero 'any' types with comprehensive type safety
- ✅ **Pre-commit Quality Gates**: Local validation with intelligent file detection

## 🧪 Quality Assurance Strategy

This project implements a comprehensive QA approach designed for interview demonstration:

### Test Pyramid Distribution
```
        E2E (10%)
       ┌─────────┐
      ┌───────────┐
     │ Component  │ (15%)
    ┌─────────────┐
   │  Integration │ (25%)
  ┌───────────────┐
 │     Unit       │ (40%)
└─────────────────┘
   Contract (10%)
```

### Testing Pyramid Implementation
- **Unit Tests**: Jest + Supertest (backend), Vitest + React Testing Library (frontend)
- **Integration Tests**: API integration with MongoDB Memory Server for database isolation
- **CI/CD Testing**: GitHub Actions matrix testing across Node.js 18 & 20
- **TypeScript Validation**: Strict type checking with zero 'any' types
- **Security Testing**: Snyk + NPM audit with high-severity thresholds
- **Pre-commit Validation**: Local quality gates with intelligent file detection

### Quality Gates (Implemented)
- **Code Coverage**: 65%+ lines, 60%+ functions, 50%+ branches (enforced in CI/CD)
- **Security Scanning**: High-severity vulnerability detection and blocking
- **TypeScript Safety**: 100% type coverage with strict mode enabled
- **Build Verification**: Cross-platform build validation
- **Performance Monitoring**: Response time baselines and slow query detection

## 🗂️ Database Schema

### Collections
- **Users**: Authentication and user profiles
- **Capsules**: Superpower coffee products
- **Machines**: Brewing equipment
- **Orders**: Purchase transactions
- **Cart Items**: Shopping cart state

### Sample Data
The database is seeded with:
- 4 unique superpower capsules (Mental, Physical, Mystical, Temporal)
- 2 futuristic brewing machines
- 2 test user accounts

## 🔐 Environment Configuration

### Required Environment Variables

**Backend (.env)**
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/cosmic-coffeehouse
JWT_SECRET=your-cosmic-secret-key
JWT_EXPIRES_IN=15m
NODE_ENV=development
```

**Frontend (.env)**
```env
VITE_API_URL=http://localhost:3000
```

## 📊 API Documentation

### Interactive Documentation
- **Swagger UI**: http://localhost:3000/api/docs - Interactive API documentation with OpenAPI 3.0
- **JSON Spec**: http://localhost:3000/api/docs.json - Raw OpenAPI specification

### Key Features
- ✅ **Complete OpenAPI 3.0 Specification** with comprehensive schemas
- ✅ **Interactive Swagger UI** with custom cosmic theme
- ✅ **Comprehensive JSDoc Comments** on all API routes
- ✅ **Schema Validation** for all request/response models
- ✅ **Authentication Integration** with JWT Bearer tokens
- ✅ **Try-it-out Functionality** for live API testing

### Quick API Reference

#### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

#### Product Endpoints
- `GET /api/products/capsules` - List all capsules with filtering
- `GET /api/products/capsules/:id` - Get specific capsule
- `GET /api/products/machines` - List all machines with filtering
- `GET /api/products/machines/:id` - Get specific machine
- `GET /api/products/featured` - Get featured products

#### Cart Endpoints
- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update/:id` - Update cart item
- `DELETE /api/cart/remove/:id` - Remove cart item

#### Order Endpoints
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get specific order

#### Health Endpoints
- `GET /health` - Application health check endpoint

## 🔄 Development Workflow (GitFlow + Local Protection)

### 🛡️ Local Git Hooks Protection
This project implements automated local quality gates that prevent problematic code from reaching the remote repository:

- **Pre-Commit Validation**: Automatic ESLint, TypeScript, build checks, and security scanning
- **Branch Protection**: Prevents direct pushes to main/develop branches
- **Commit Message Validation**: Enforces Conventional Commits format
- **Smart Checks**: Only validates changed files for optimal performance

### Development Workflow with Hooks
```bash
# Start new feature
git checkout develop
git pull origin develop
git checkout -b feature/new-feature

# Development with automatic validation
# ... make changes ...
git add .
git commit -m "feat: add new feature"  # Validates: commit format, code quality, tests
git push origin feature/new-feature    # ✅ Allowed for feature branches

# Attempting direct push to protected branches
git checkout develop
git push origin develop                # ❌ BLOCKED by pre-push hook

# Correct workflow - use Pull Requests
# 1. Push feature branch (allowed)
# 2. Create PR: feature/new-feature → develop
# 3. Get approval and merge via GitHub UI

# Release workflow
git checkout -b release/v1.0.0
# ... final testing and fixes ...
git commit -m "chore: prepare release v1.0.0"  # Validates automatically
# Create PR: release/v1.0.0 → main
# Merge via GitHub UI with approvals
```

### Git Hook Benefits
- **Quality Assurance**: Catches issues before they reach remote repository
- **Consistency**: Enforces coding standards across all developers
- **Education**: Guides proper GitFlow methodology
- **Speed**: Fast, selective validation

## 🐛 Known Issues & QA Opportunities

The application currently has intentional issues to demonstrate QA processes:
- Form validation edge cases
- API error handling scenarios
- Performance optimization opportunities
- Accessibility improvements needed

## 🛡️ Security

- JWT token-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- CORS configuration
- Environment variable protection

## 🤝 Contributing

This project is designed for interview demonstration. For development:

1. **Clone and setup** - Git hooks are automatically installed
2. **Create feature branch** from `develop` (never work directly on main/develop)
3. **Implement changes** - Pre-commit hooks will validate your code automatically
4. **Commit with proper format** - Use Conventional Commits (enforced by hooks)
5. **Push feature branch** - Pre-push hook allows feature branches only
6. **Submit PR** with comprehensive description to `develop`
7. **Ensure quality gates pass** - Both local hooks and CI/CD must pass

### 🔧 Local Development Setup
```bash
git clone [repository-url]
cd TheCosmicCoffeehouse
npm install                    # Installs dependencies
# Git hooks are already installed and active
git checkout -b feature/my-feature  # Start development
```

### 🚨 Important Git Hook Rules
- **No direct pushes** to main/develop branches
- **Automatic quality checks** on every commit
- **Conventional commit format** required
- **Security scanning** prevents secrets in commits

## 📝 License

This project is created for interview preparation purposes.

## 📞 Support

For questions about this project or QA demonstration:
- Create GitHub Issues for bug reports
- Use Discussions for general questions
- Reference the `docs/` folder for detailed documentation

---

**Built with ⚡ by a passionate QA Engineer | Ready for interview demonstration**