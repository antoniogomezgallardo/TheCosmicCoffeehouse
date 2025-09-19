# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This repository is for a Senior QA Engineer interview preparation project called "The Cosmic Coffeehouse" - an e-commerce application designed to demonstrate comprehensive testing practices and QA engineering expertise.

## Architecture

This is a full-stack e-commerce application with a comprehensive testing strategy:

### Application Architecture
- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript + MongoDB + Mongoose
- **Authentication**: JWT-based authentication with Express middleware
- **Infrastructure**: Docker containers with GitHub Actions CI/CD

### Testing Architecture (Complete Test Pyramid)
- **Unit Testing**: Jest + React Testing Library (frontend), Jest + Supertest (backend)
- **Integration Testing**: Supertest for API integration, MongoDB Memory Server for isolated DB tests
- **Contract Testing**: Pact for consumer-driven contracts, JSON Schema validation
- **E2E Testing**: Playwright with Page Object Model pattern, cross-browser testing
- **API Testing**: Supertest (native) + Postman collections for demonstrations
- **Performance Testing**: K6 for load testing, Artillery as backup
- **Security Testing**: OWASP ZAP integration, Snyk for dependency scanning
- **Monitoring**: Winston logging + Prometheus + Grafana

## Development Commands

### Application Development
```bash
npm run dev          # Start development environment
npm run build        # Production build
npm run docker:up    # Start with Docker Compose
```

### Testing Commands
```bash
npm run test         # Run all tests
npm run test:unit    # Unit tests only
npm run test:integration  # Integration tests
npm run test:e2e     # End-to-end tests
npm run test:api     # API tests
npm run test:perf    # Performance tests
npm run test:security # Security tests
npm run coverage     # Generate coverage report
```

### Quality & CI/CD
```bash
npm run lint         # ESLint checking
npm run type-check   # TypeScript validation
npm run audit        # Security audit
npm run ci           # Full CI pipeline locally
```

## Project Structure

The repository follows a monorepo structure with clear separation:
```
├── frontend/         # React TypeScript application
├── backend/          # Express TypeScript API
├── qa-automation/    # Testing frameworks and test suites
│   ├── playwright/   # E2E tests with Page Object Model
│   ├── api-tests/    # REST API test suites
│   ├── performance/  # K6 performance tests
│   └── security/     # Security testing configurations
├── ci-cd/           # Pipeline configurations for multiple platforms
└── docs/            # QA documentation and interview preparation
```

## Key Principles

### GitFlow Methodology
- All development on feature branches from `develop`
- Merge to `develop` before creating new branches
- Release branches for production deployments
- Always commit as the main user (configured in global CLAUDE.md)

### Testing Strategy
This project demonstrates the "Quality Guardian" approach:
- **Prevention over Detection**: Shift-left testing practices
- **Risk-based Testing**: Priority matrix for test coverage
- **Complete Test Pyramid**: Unit (40%), Integration (25%), Contract (10%), Component (15%), E2E (10%)
- **Quality Gates**: Coverage >85%, <2% flaky tests, <30min execution time

### Quality Metrics Targets
- Unit Test Coverage: >85%
- Integration Test Coverage: >70%
- E2E Critical Path Coverage: 100%
- API Response Time: <200ms (95th percentile)
- Pipeline Success Rate: >95%

## Interview Demonstration Features

The project is specifically designed to showcase Senior QA Engineer capabilities:
- Live test execution with multiple frameworks
- CI/CD pipeline with quality gates
- Performance bottleneck identification
- Security vulnerability scanning
- Real-time monitoring and alerting
- Test automation framework architecture

## Special Notes

- MongoDB Memory Server used for test isolation
- Docker configurations ready for multiple environments
- Multiple CI/CD platform configs (GitHub Actions, Jenkins, Azure, AWS)
- Comprehensive documentation following QA best practices
- Built to demonstrate shift-left and shift-right testing approaches
- remember to use gitflow each time we use any git command