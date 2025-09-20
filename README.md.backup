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
│   │   └── types/           # TypeScript definitions
│   ├── public/              # Static assets
│   └── package.json
├── backend/                  # Express TypeScript API
│   ├── src/
│   │   ├── models/          # Mongoose schemas
│   │   ├── routes/          # API endpoints
│   │   ├── scripts/         # Database seeding
│   │   └── types/           # TypeScript definitions
│   └── package.json
├── scripts/                  # Development utilities
├── .claude/                  # Claude Code configuration
└── docs/                     # Project documentation
```

## 🌟 Features

### Current MVP Features
- ✅ **User Authentication**: Registration, login, JWT-based auth
- ✅ **Product Catalog**: Dynamic product listing with filtering
- ✅ **Shopping Cart**: Add, remove, update quantities
- ✅ **Sci-Fi Design System**: Custom Tailwind theme with animations
- ✅ **Responsive Design**: Mobile-first approach
- ✅ **API Integration**: Full REST API with MongoDB

### 🔮 Upcoming Features (QA Phase)
- 🔄 **Comprehensive Testing Suite**
- 🔄 **CI/CD Pipeline**
- 🔄 **Performance Monitoring**
- 🔄 **Security Testing**
- 🔄 **Bug Tracking System**

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

### Testing Pyramid
- **Unit Tests**: Jest + React Testing Library (frontend), Jest + Supertest (backend)
- **Integration Tests**: Supertest for API integration, MongoDB Memory Server for isolated DB tests
- **Contract Testing**: Pact for consumer-driven contracts, JSON Schema validation
- **E2E Tests**: Playwright with Page Object Model pattern, cross-browser testing
- **Performance Tests**: K6 for load testing, Artillery as backup
- **Security Tests**: OWASP ZAP integration, Snyk for dependency scanning

### Quality Gates
- Code Coverage > 85%
- Zero critical security vulnerabilities
- Performance budget compliance
- Accessibility standards (WCAG 2.1)

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

### Authentication Endpoints
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/profile` - Get user profile

### Product Endpoints
- `GET /capsules` - List all capsules
- `GET /capsules/:id` - Get specific capsule
- `GET /machines` - List all machines
- `GET /machines/:id` - Get specific machine

### Cart Endpoints
- `GET /cart` - Get user's cart
- `POST /cart/add` - Add item to cart
- `PUT /cart/update` - Update cart item
- `DELETE /cart/remove` - Remove cart item

## 🔄 Development Workflow (GitFlow)

```bash
# Start new feature
git checkout develop
git pull origin develop
git checkout -b feature/new-feature

# Development and testing
# ... make changes ...
git add .
git commit -m "feat: add new feature"

# Merge to develop
git checkout develop
git merge feature/new-feature
git push origin develop

# Release workflow
git checkout -b release/v1.0.0
# ... final testing and fixes ...
git checkout main
git merge release/v1.0.0
git tag v1.0.0
git push origin main --tags
```

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

1. Create feature branch from `develop`
2. Implement changes with tests
3. Submit PR with comprehensive description
4. Ensure all quality gates pass

## 📝 License

This project is created for interview preparation purposes.

## 📞 Support

For questions about this project or QA demonstration:
- Create GitHub Issues for bug reports
- Use Discussions for general questions
- Reference the `docs/` folder for detailed documentation

---

**Built with ⚡ by a passionate QA Engineer | Ready for interview demonstration**