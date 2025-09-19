# ☕ The Cosmic Coffeehouse

> **Senior QA Engineer Interview Preparation Project**
> A comprehensive e-commerce testing demonstration showcasing advanced QA engineering practices

## 🎯 Project Overview

This project demonstrates expertise in:
- **Complete Testing Pyramid**: Unit, Integration, Contract, Component, E2E testing
- **Modern Test Automation**: Playwright, Jest, Supertest, Pact, K6
- **Quality Engineering**: Shift-left practices, CI/CD integration, monitoring
- **DevOps Integration**: Docker, GitHub Actions, multi-cloud deployment strategies

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React + TS    │    │  Express + TS   │    │   MongoDB       │
│   Frontend      │◄──►│   Backend       │◄──►│   Database      │
│   Port: 3000    │    │   Port: 3001    │    │   Port: 27017   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   Monitoring    │
                    │ Prometheus +    │
                    │   Grafana       │
                    └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- Git

### Installation
```bash
# Clone and install
git clone https://github.com/antoniogomezgallardo/TheCosmicCoffeehouse.git
cd TheCosmicCoffeehouse
npm run install:all

# Start with Docker (recommended)
npm run docker:up

# Or start locally
npm run dev
```

### Access Points
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Monitoring**: http://localhost:3002 (Grafana)
- **Metrics**: http://localhost:9090 (Prometheus)

## 🧪 Testing Strategy

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

### Test Execution
```bash
# Run all tests
npm test

# Individual test suites
npm run test:unit          # Unit tests
npm run test:integration   # Integration tests
npm run test:e2e          # End-to-end tests
npm run test:api          # API tests
npm run test:performance  # Performance tests
npm run test:security     # Security tests

# Coverage reports
npm run coverage
```

## 📊 Quality Metrics

### Current Targets
- **Unit Test Coverage**: >85%
- **Integration Coverage**: >70%
- **E2E Critical Paths**: 100%
- **API Response Time**: <200ms
- **Pipeline Success Rate**: >95%
- **Flaky Test Rate**: <2%

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

## 🏢 Enterprise Configurations

Ready-to-deploy configurations for:
- **GitHub Actions** (implemented)
- **Jenkins** (enterprise CI/CD)
- **Azure DevOps** (Microsoft ecosystem)
- **AWS CodeBuild** (cloud-native)

## 📈 Monitoring & Observability

- **Logs**: Winston + structured logging
- **Metrics**: Prometheus + custom metrics
- **Dashboards**: Grafana with QA-specific dashboards
- **Alerts**: Performance and error rate monitoring

## 🛡️ Security & Compliance

- **Static Analysis**: ESLint security rules
- **Dependency Scanning**: Snyk integration
- **Dynamic Testing**: OWASP ZAP integration
- **Authentication**: JWT with secure practices

## 📚 Documentation

- [Quality Guardian Manifesto](./Quality-Guardian-Manifesto.md)
- [Testing Principles](./Testing-Principles.md)
- [QA Master Learning Guide](./QA-Master-Learning-OnePager.md)
- [Interview Preparation Plan](./Senior-QA-Interview-Master-Plan.md)

## 🎓 Learning Outcomes

This project demonstrates:
1. **Strategic QA Leadership**: Quality-first mindset and prevention over detection
2. **Technical Excellence**: Modern tools and frameworks
3. **Process Optimization**: Efficient testing strategies
4. **Team Enablement**: Self-service testing and documentation
5. **Business Value**: Metrics that matter and risk-based approaches

---

**Built with ❤️ for quality engineering excellence**