# 🛠️ Development Environment Setup

This guide provides comprehensive instructions for setting up the local development environment for The Cosmic Coffeehouse, including Git hooks configuration and quality assurance tooling.

## 📋 Prerequisites

### Required Software
- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher)
- **Docker Desktop** (for MongoDB)
- **Git** (v2.28.0 or higher)

### Recommended Tools
- **VS Code** with extensions:
  - ESLint
  - Prettier - Code formatter
  - TypeScript and JavaScript Language Features
  - GitLens
  - Playwright Test for VS Code (for E2E testing)

### System Requirements
- **RAM**: 8GB minimum, 16GB recommended
- **Storage**: 5GB free space
- **OS**: Windows 10/11, macOS 10.15+, or Linux Ubuntu 18.04+

## 🚀 Quick Setup

### 1. Clone and Initialize
```bash
# Clone the repository
git clone https://github.com/antoniogomezgallardo/TheCosmicCoffeehouse.git
cd TheCosmicCoffeehouse

# Install all dependencies
npm install

# Git hooks are automatically active - no additional setup needed!
```

### 2. Environment Configuration
Create environment files for both frontend and backend:

**Backend Environment** (`backend/.env`):
```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/cosmic-coffeehouse

# Authentication
JWT_SECRET=your-cosmic-development-secret-key-change-in-production
JWT_EXPIRES_IN=15m

# CORS Configuration (automatically handles development ports)
CORS_ORIGIN=auto
```

**Frontend Environment** (`frontend/.env`):
```env
# API Configuration
VITE_API_URL=http://localhost:3000

# Development Configuration
VITE_NODE_ENV=development
```

### 3. Start Development Environment
```bash
# Start MongoDB container
npm run start:mongo

# Start both frontend and backend in development mode
npm run dev

# Verify setup
npm test
```

### 4. Verify Installation
Access these URLs to confirm everything is working:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **API Documentation**: http://localhost:3000/api/docs
- **Health Check**: http://localhost:3000/api/admin/health

## 🛡️ Git Hooks Configuration

### Automatic Setup
Git hooks are **automatically installed** when you clone the repository and run `npm install`. No manual configuration is required.

### Hook Verification
Verify that Git hooks are properly installed and executable:

```bash
# Check hook files exist and are executable
ls -la .git/hooks/pre-commit .git/hooks/pre-push .git/hooks/commit-msg

# Expected output (on Unix-like systems):
# -rwxr-xr-x 1 user group 3933 date .git/hooks/pre-commit
# -rwxr-xr-x 1 user group 1301 date .git/hooks/pre-push
# -rwxr-xr-x 1 user group 1271 date .git/hooks/commit-msg
```

### Test Git Hooks
```bash
# Test commit message validation
git commit --allow-empty -m "invalid format"
# Should be rejected with format guidance

# Test branch protection
git checkout develop
git push origin develop
# Should be blocked with workflow instructions

# Test pre-commit validation
# Make a change with intentional linting errors and try to commit
# Should be blocked with fix suggestions
```

## 🔧 Development Commands

### Application Management
```bash
# Development
npm run dev              # Start both frontend and backend
npm run dev:frontend     # Start only frontend (port 5173)
npm run dev:backend      # Start only backend (port 3000)

# Database
npm run start:mongo      # Start MongoDB container
npm run stop:mongo       # Stop MongoDB container
npm run seed             # Reseed database with sample data

# Lifecycle
npm run build           # Build for production
npm run preview         # Preview production build
npm run stop            # Stop all development servers
npm run restart         # Restart everything
```

### Quality Assurance
```bash
# Code Quality
npm run lint            # Run ESLint on all code
npm run lint:fix        # Auto-fix ESLint issues
npm run format          # Format code with Prettier
npm run type-check      # TypeScript validation

# Testing
npm run test            # Run all tests
npm run test:unit       # Unit tests only
npm run test:integration # Integration tests
npm run test:watch      # Run tests in watch mode
npm run coverage        # Generate coverage report

# Security & Dependencies
npm run audit           # Security vulnerability scan
npm run audit:fix       # Auto-fix security issues
npm run update-deps     # Update dependencies safely
```

### Git & Workflow
```bash
# Feature Development
npm run feature:start   # Interactive feature branch creation
npm run feature:finish  # Complete feature with PR template

# Release Management
npm run release:prepare # Prepare release branch
npm run release:finish  # Complete release with tagging

# Maintenance
npm run git:clean       # Clean up merged branches
npm run git:status      # Enhanced git status with hooks info
```

## 🧪 Testing Environment

### Test Database Setup
The project uses MongoDB Memory Server for isolated testing:

```bash
# No additional setup required - runs automatically during tests
npm run test:integration

# For manual testing with real database
npm run test:integration:real
```

### Test Data Management
```bash
# Reset test data
npm run test:reset

# Generate test data
npm run test:seed

# Clean test artifacts
npm run test:clean
```

## 🔍 Quality Gates Deep Dive

### Pre-Commit Hook Details
The pre-commit hook runs selective validation based on changed files:

#### Frontend Changes Trigger:
- **ESLint validation** with auto-fix suggestions
- **TypeScript compilation** check
- **Build verification** to ensure code compiles
- **Unit tests** for modified components

#### Backend Changes Trigger:
- **ESLint validation** with auto-fix suggestions
- **TypeScript type checking**
- **Unit tests** with coverage reporting
- **API endpoint validation**

#### Always Runs:
- **Security scanning** for hardcoded secrets
- **Package consistency** checks
- **Commit message format** validation

### Pre-Push Hook Protection
Prevents direct pushes to protected branches:

```bash
# Allowed pushes
git push origin feature/new-feature  ✅
git push origin bugfix/fix-issue     ✅
git push origin hotfix/urgent-fix    ✅

# Blocked pushes
git push origin main                 ❌
git push origin develop              ❌
```

### Commit Message Validation
Enforces Conventional Commits format:

```bash
# Valid formats
feat(auth): add OAuth2 integration
fix(ui): resolve mobile layout issue
docs: update API documentation
test: add unit tests for user service
chore: update dependencies

# Invalid formats (will be rejected)
"updated stuff"
"fixes"
"WIP"
"asdf"
```

## 🚨 Troubleshooting

### Common Setup Issues

#### Node.js Version Issues
```bash
# Check Node.js version
node --version  # Should be v18.0.0+

# Using Node Version Manager (nvm)
nvm install 18
nvm use 18
```

#### Docker Issues
```bash
# Check Docker is running
docker --version
docker ps

# Restart Docker Desktop if needed
# On Windows/Mac: Restart Docker Desktop application
# On Linux: sudo systemctl restart docker
```

#### Port Conflicts
```bash
# Check what's using ports 3000, 5173, 27017
netstat -tulpn | grep -E ":(3000|5173|27017)\s"

# Kill processes using required ports
sudo kill -9 $(lsof -t -i:3000)  # Backend
sudo kill -9 $(lsof -t -i:5173)  # Frontend
sudo kill -9 $(lsof -t -i:27017) # MongoDB
```

### Git Hooks Issues

#### Hooks Not Executing
```bash
# Make hooks executable (Unix-like systems)
chmod +x .git/hooks/pre-commit
chmod +x .git/hooks/pre-push
chmod +x .git/hooks/commit-msg

# On Windows with Git Bash
git config core.fileMode false
```

#### ESLint Failures
```bash
# Auto-fix common issues
cd frontend && npm run lint -- --fix
cd backend && npm run lint -- --fix

# Manual fixes may be required for remaining issues
```

#### TypeScript Compilation Errors
```bash
# Check specific errors
npm run type-check

# Common solutions:
# - Add missing type imports
# - Update interface definitions
# - Fix type annotations
```

#### Security Scan False Positives
```bash
# Review flagged files
git diff --cached

# Common false positives:
# - Test files with mock credentials
# - Documentation examples
# - Configuration templates

# Use environment variables for real secrets
```

### Performance Issues

#### Slow Hook Execution
```bash
# Hooks only check modified files, but if still slow:

# Check what files changed
git status

# Clear node_modules and reinstall if needed
rm -rf node_modules package-lock.json
npm install
```

#### Memory Issues During Development
```bash
# Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=4096"

# Or add to package.json scripts:
"dev": "NODE_OPTIONS='--max-old-space-size=4096' concurrently ..."
```

## 🔧 IDE Configuration

### VS Code Settings
Create `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "git.enableSmartCommit": true,
  "git.confirmSync": false,
  "files.exclude": {
    "**/node_modules": true,
    "**/dist": true,
    "**/.git": true
  }
}
```

### VS Code Tasks
Create `.vscode/tasks.json`:

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Start Development",
      "type": "shell",
      "command": "npm run dev",
      "group": "build",
      "presentation": {
        "reveal": "always",
        "panel": "new"
      }
    },
    {
      "label": "Run Tests",
      "type": "shell",
      "command": "npm test",
      "group": "test"
    }
  ]
}
```

## 📊 Development Metrics

### Performance Targets
- **Build time**: < 30 seconds for full build
- **Hot reload**: < 2 seconds for changes
- **Test execution**: < 10 seconds for unit tests
- **Hook validation**: < 5 seconds for pre-commit

### Quality Metrics
- **Code coverage**: > 85% for new code
- **ESLint errors**: 0 errors, warnings acceptable
- **TypeScript errors**: 0 errors
- **Security vulnerabilities**: 0 high/critical

## 🎯 Next Steps

After completing the setup:

1. **Read** the [Contributing Guide](CONTRIBUTING.md)
2. **Review** the [GitFlow Workflow](docs/GITFLOW_WORKFLOW.md)
3. **Explore** the API documentation at http://localhost:3000/api/docs
4. **Run** the full test suite: `npm test`
5. **Create** your first feature branch: `git checkout -b feature/explore-codebase`

## 🆘 Getting Help

### Documentation Resources
- **[Contributing Guidelines](CONTRIBUTING.md)** - Development workflow and standards
- **[API Documentation](http://localhost:3000/api/docs)** - Interactive API reference
- **[Project Structure](docs/PROJECT_STRUCTURE.md)** - Codebase organization
- **[GitFlow Workflow](docs/GITFLOW_WORKFLOW.md)** - Git branching strategy

### Support Channels
- **GitHub Issues** - Bug reports and feature requests
- **GitHub Discussions** - Questions and general discussion
- **Code Comments** - Inline documentation and examples

### Emergency Procedures
```bash
# If Git hooks are preventing urgent fixes
git commit --no-verify -m "emergency: critical hotfix"
git push --no-verify origin main

# ⚠️ Use only for genuine emergencies
# All bypassed changes should be reviewed ASAP
```

---

**Ready to build the future of coffee? Let's code! ⚡🌌**