# 🏗️ Project Structure Guide

This document provides a comprehensive overview of The Cosmic Coffeehouse project structure, including recent improvements and organizational patterns.

## 📁 Root Directory Structure

```
TheCosmicCoffeehouse/
├── .claude/                    # Claude Code configuration
│   ├── settings.json          # Project-specific Claude settings
│   └── settings.local.json    # Local overrides (git-ignored)
├── .git/                      # Git repository data
├── .github/                   # GitHub-specific configurations
│   ├── ISSUE_TEMPLATE/        # Issue templates (recently fixed)
│   │   ├── bug_report.yml     # Bug report template
│   │   ├── feature_request.yml # Feature request template
│   │   └── test_case.yml      # Test case template
│   └── workflows/             # GitHub Actions (future CI/CD)
├── backend/                   # Express.js API server
├── frontend/                  # React.js client application
├── docs/                      # Project documentation
├── scripts/                   # Development utility scripts
├── qa-automation/             # Testing frameworks (future)
├── ci-cd/                     # CI/CD configurations (future)
├── .gitignore                 # Git ignore patterns
├── CLAUDE.md                  # Claude Code project instructions
├── README.md                  # Main project documentation
├── package.json               # Root package configuration
├── package-lock.json          # Dependency lock file
└── docker-compose.yml         # Docker services configuration
```

## 🎛️ Backend Structure (`/backend`)

```
backend/
├── src/                       # Source code
│   ├── config/               # Configuration modules
│   │   └── database.ts       # MongoDB connection setup
│   ├── controllers/          # Request handlers
│   │   ├── auth.controller.ts
│   │   ├── cart.controller.ts
│   │   └── products.controller.ts
│   ├── middleware/           # Express middleware
│   │   ├── auth.middleware.ts
│   │   ├── error.middleware.ts
│   │   └── validation.middleware.ts
│   ├── models/               # Mongoose schemas
│   │   ├── User.ts           # User authentication model
│   │   ├── Capsule.ts        # Capsule product model
│   │   ├── Machine.ts        # Machine product model
│   │   └── Cart.ts           # Shopping cart model
│   ├── routes/               # API route definitions
│   │   ├── auth.routes.ts    # Authentication endpoints
│   │   ├── cart.routes.ts    # Cart management endpoints
│   │   ├── order.routes.ts   # Order processing endpoints
│   │   └── products.routes.ts # Product catalog endpoints
│   ├── scripts/              # Database and utility scripts
│   │   └── seed.ts           # Database seeding script
│   ├── services/             # Business logic
│   │   ├── auth.service.ts
│   │   ├── email.service.ts
│   │   └── payment.service.ts
│   ├── tests/                # Test files
│   │   ├── unit/            # Unit tests
│   │   ├── integration/     # Integration tests
│   │   └── fixtures/        # Test data
│   ├── types/                # TypeScript type definitions
│   │   └── index.ts         # Shared type definitions
│   ├── utils/                # Utility functions
│   │   ├── logger.ts        # Logging utilities
│   │   └── helpers.ts       # General helpers
│   ├── validators/           # Input validation schemas
│   │   ├── auth.validator.ts
│   │   └── product.validator.ts
│   └── server.ts             # Main application entry point
├── dist/                     # Compiled JavaScript (build output)
├── node_modules/             # Dependencies
├── .env                      # Environment variables
├── .env.example              # Environment template
├── package.json              # Backend dependencies and scripts
├── package-lock.json         # Dependency lock file
├── tsconfig.json             # TypeScript configuration
├── .eslintrc.js             # ESLint configuration
└── README.md                 # Backend-specific documentation
```

### Recent Backend Improvements
- **Enhanced CORS Configuration**: Dynamic origin handling in `server.ts`
- **Improved Error Handling**: Structured error responses across all endpoints
- **Database Seeding**: Comprehensive sample data in `scripts/seed.ts`
- **Type Safety**: Full TypeScript implementation with strict mode

## 🎨 Frontend Structure (`/frontend`)

```
frontend/
├── src/                      # Source code
│   ├── components/          # Reusable UI components
│   │   ├── Auth/           # Authentication components
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   ├── Cart/           # Shopping cart components
│   │   │   ├── CartItem.tsx
│   │   │   ├── CartSummary.tsx
│   │   │   └── CartModal.tsx
│   │   ├── Layout/         # Layout components
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Navigation.tsx
│   │   │   └── Sidebar.tsx
│   │   ├── Products/       # Product-related components
│   │   │   ├── ProductCard.tsx      # Recently fixed image loading
│   │   │   ├── ProductList.tsx
│   │   │   ├── ProductFilter.tsx
│   │   │   └── ProductDetails.tsx
│   │   └── UI/             # Generic UI components
│   │       ├── Button.tsx
│   │       ├── Modal.tsx
│   │       ├── LoadingSpinner.tsx
│   │       └── ErrorBoundary.tsx
│   ├── contexts/           # React Context providers
│   │   ├── AuthContext.tsx # Authentication state
│   │   ├── CartContext.tsx # Shopping cart state
│   │   └── ThemeContext.tsx # UI theme state
│   ├── hooks/              # Custom React hooks
│   │   ├── useAuth.ts      # Authentication hook
│   │   ├── useCart.ts      # Cart management hook
│   │   ├── useApi.ts       # API interaction hook
│   │   └── useLocalStorage.ts # Local storage hook
│   ├── pages/              # Route-based page components
│   │   ├── Home.tsx        # Landing page
│   │   ├── Products.tsx    # Product catalog page
│   │   ├── ProductDetail.tsx # Individual product page
│   │   ├── Cart.tsx        # Shopping cart page
│   │   ├── Checkout.tsx    # Checkout process page
│   │   ├── Login.tsx       # User login page
│   │   ├── Register.tsx    # User registration page
│   │   └── Profile.tsx     # User profile page
│   ├── services/           # API communication
│   │   ├── api.ts          # Axios configuration and interceptors
│   │   ├── auth.service.ts # Authentication API calls
│   │   ├── cart.service.ts # Cart API calls
│   │   └── products.service.ts # Product API calls
│   ├── styles/             # CSS and styling
│   │   ├── globals.css     # Global styles
│   │   ├── tailwind.css    # Tailwind CSS imports
│   │   └── components/     # Component-specific styles
│   ├── types/              # TypeScript type definitions
│   │   ├── auth.types.ts   # Authentication types
│   │   ├── cart.types.ts   # Cart types
│   │   ├── product.types.ts # Product types
│   │   └── api.types.ts    # API response types
│   ├── utils/              # Utility functions
│   │   ├── constants.ts    # Application constants
│   │   ├── formatters.ts   # Data formatting functions
│   │   ├── validators.ts   # Client-side validation
│   │   └── helpers.ts      # General utility functions
│   ├── App.tsx             # Main application component
│   ├── main.tsx            # Application entry point
│   └── vite-env.d.ts       # Vite environment types
├── public/                 # Static assets
│   ├── images/             # Image assets (recently organized)
│   │   ├── capsules/       # Product images for capsules
│   │   ├── machines/       # Product images for machines
│   │   └── placeholder.svg # Fallback image (recently added)
│   ├── icons/              # Icon assets
│   ├── favicon.ico         # Site favicon
│   └── index.html          # HTML template
├── dist/                   # Build output
├── node_modules/           # Dependencies
├── .env                    # Environment variables
├── .env.example            # Environment template
├── package.json            # Frontend dependencies and scripts
├── package-lock.json       # Dependency lock file
├── tsconfig.json           # TypeScript configuration
├── tsconfig.node.json      # Node-specific TypeScript config
├── vite.config.ts          # Vite build configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── .eslintrc.js           # ESLint configuration
├── .prettierrc            # Prettier configuration
└── README.md              # Frontend-specific documentation
```

### Recent Frontend Improvements
- **Image Loading Fix**: Resolved infinite loop in `ProductCard.tsx`
- **Placeholder System**: Added fallback images with cosmic theme
- **Error Boundaries**: Enhanced error handling in UI components
- **Type Safety**: Comprehensive TypeScript types for all components

## 📚 Documentation Structure (`/docs`)

```
docs/
├── DATABASE_MANAGEMENT.md     # Database operations guide (new)
├── GITFLOW_WORKFLOW.md        # GitFlow methodology guide (new)
├── PROJECT_STRUCTURE.md       # This document (new)
├── TROUBLESHOOTING.md         # Common issues and fixes (new)
├── QA-Master-Learning-OnePager.md # QA learning guide
├── Quality-Guardian-Manifesto.md  # QA philosophy and principles
├── Testing-Principles.md      # Testing strategies and approaches
├── bug-reports/               # Bug report templates and examples
│   └── README.md
├── qa-processes/              # QA methodologies and workflows
│   ├── README.md
│   ├── github-qa-workflow.md  # GitHub integration for QA
│   └── interview-demo-script.md # Interview demonstration script
├── test-cases/                # Test case documentation
│   └── README.md
└── test-plans/                # Test plan templates
    └── README.md
```

### Documentation Improvements
- **Comprehensive Guides**: Added troubleshooting, database, and GitFlow guides
- **Practical Examples**: All guides include working code examples
- **QA Focus**: Documentation designed for QA engineer interview demonstration
- **Maintenance**: Regular updates to reflect recent fixes and improvements

## 🧪 QA Automation Structure (`/qa-automation`) - Future

```
qa-automation/
├── playwright/               # End-to-end testing
│   ├── tests/
│   ├── page-objects/
│   ├── fixtures/
│   └── playwright.config.ts
├── api-tests/               # API testing
│   ├── tests/
│   ├── schemas/
│   └── postman/
├── performance/             # Performance testing
│   ├── k6/
│   ├── artillery/
│   └── reports/
├── security/                # Security testing
│   ├── zap/
│   ├── snyk/
│   └── configs/
└── visual/                  # Visual regression testing
    ├── tests/
    └── baselines/
```

## 🚀 Scripts Structure (`/scripts`)

```
scripts/
├── start-servers.bat        # Windows server startup
├── stop-servers.bat         # Windows server shutdown
├── start-servers.sh         # Unix server startup
├── stop-servers.sh          # Unix server shutdown
├── stop-servers.js          # Cross-platform server management
├── setup-dev-env.js         # Development environment setup
└── README.md                # Scripts documentation
```

## 🐳 CI/CD Structure (`/ci-cd`) - Future

```
ci-cd/
├── github-actions/          # GitHub Actions workflows
├── jenkins/                 # Jenkins pipeline configurations
├── azure-devops/           # Azure DevOps pipelines
├── aws-codepipeline/       # AWS CodePipeline setup
└── docker/                 # Docker configurations
    ├── Dockerfile.frontend
    ├── Dockerfile.backend
    └── docker-compose.prod.yml
```

## 🔧 Configuration Files

### Root Level
- **package.json**: Monorepo scripts and dev dependencies
- **docker-compose.yml**: MongoDB service configuration
- **CLAUDE.md**: Claude Code project instructions
- **.gitignore**: Git ignore patterns for all environments

### Backend Configuration
- **tsconfig.json**: TypeScript compiler options
- **.env**: Environment variables (not in git)
- **.env.example**: Environment template
- **.eslintrc.js**: Code linting rules

### Frontend Configuration
- **vite.config.ts**: Build tool configuration
- **tailwind.config.js**: CSS framework setup
- **tsconfig.json**: TypeScript settings
- **.prettierrc**: Code formatting rules

## 📊 File Organization Patterns

### Naming Conventions
- **Components**: PascalCase (e.g., `ProductCard.tsx`)
- **Files**: camelCase (e.g., `authService.ts`)
- **Directories**: kebab-case (e.g., `qa-processes/`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_BASE_URL`)

### Import Structure
```typescript
// External libraries
import React from 'react';
import axios from 'axios';

// Internal utilities
import { formatPrice } from '../utils/formatters';

// Components
import Button from '../UI/Button';

// Types
import type { Product } from '../types/product.types';
```

### Export Patterns
```typescript
// Named exports for utilities
export const formatPrice = (price: number) => { ... };
export const validateEmail = (email: string) => { ... };

// Default exports for components
export default function ProductCard({ product }: Props) { ... }
```

## 🔮 Future Structure Improvements

### Planned Additions
- **Microservices**: Separate services for different domains
- **Testing Infrastructure**: Comprehensive test automation structure
- **Monitoring**: Observability and logging infrastructure
- **Documentation**: API documentation with OpenAPI/Swagger
- **Deployment**: Production deployment configurations

### Scalability Considerations
- **Module Federation**: For micro-frontend architecture
- **Monorepo Tools**: Nx or Lerna for better monorepo management
- **Code Splitting**: Optimized bundle organization
- **CDN Integration**: Asset optimization and delivery

## 📈 Metrics and Monitoring

### Code Organization Metrics
- **Dependency Depth**: Avoid deep nested dependencies
- **Module Coupling**: Minimize cross-module dependencies
- **Code Duplication**: DRY principle enforcement
- **Test Coverage**: Maintain >85% coverage across all modules

### Maintenance Best Practices
- **Regular Refactoring**: Keep structure clean and organized
- **Documentation Updates**: Maintain current documentation
- **Dependency Updates**: Regular security and feature updates
- **Architecture Reviews**: Periodic structure assessments

---

**Structure that scales to cosmic proportions! 🌌⚡**