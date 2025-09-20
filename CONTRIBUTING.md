# 🤝 Contributing to The Cosmic Coffeehouse

Welcome to The Cosmic Coffeehouse! This guide will help you contribute effectively to our QA demonstration project while following our comprehensive quality standards.

## 🚀 Quick Start for Contributors

### Prerequisites
- Node.js (v18+)
- Docker Desktop
- Git
- Code editor (VS Code recommended)

### Initial Setup
```bash
# 1. Clone the repository
git clone https://github.com/antoniogomezgallardo/TheCosmicCoffeehouse.git
cd TheCosmicCoffeehouse

# 2. Install dependencies
npm install

# 3. Git hooks are automatically active - no additional setup needed!

# 4. Start development environment
npm run dev

# 5. Verify setup
npm run test    # Should pass all tests
```

## 🛡️ Local Quality Gates (Git Hooks)

This project implements comprehensive local Git hooks that automatically enforce quality standards. Understanding these is crucial for successful contributions.

### Pre-Commit Hook
**Automatically runs on every `git commit`**

#### What it checks:
- **ESLint validation** for code quality and style
- **TypeScript compilation** to catch type errors
- **Build verification** to ensure code compiles
- **Unit tests** for modified components
- **Security scanning** to detect hardcoded secrets
- **Package consistency** between package.json and package-lock.json

#### Smart validation:
- Only checks **changed files** for optimal performance
- Detects whether frontend or backend files were modified
- Runs appropriate checks for each area

#### Example output:
```bash
$ git commit -m "feat: add user preferences"
🔍 Running pre-commit quality checks...
📝 Checking frontend code quality...
✅ Frontend linting passed
✅ Frontend TypeScript compilation passed
✅ Frontend build check passed
🔒 Checking for sensitive information...
✅ All pre-commit quality checks passed!
```

### Pre-Push Hook
**Automatically runs on every `git push`**

#### Branch Protection:
- **Blocks direct pushes** to `main` and `develop` branches
- **Enforces GitFlow methodology** by requiring feature branches
- **Provides clear guidance** on proper workflow

#### Example output:
```bash
$ git push origin develop
🚫 PUSH REJECTED: Direct pushes to 'develop' branch are not allowed!

📋 Branch Protection Rules:
   • Protected branches: main, develop
   • Changes must be made through Pull Requests
   • Status checks must pass before merging

💡 To make changes to 'develop':
   1. Create a feature branch: git checkout -b feature/your-feature
   2. Make your changes and commit them
   3. Push the feature branch: git push origin feature/your-feature
   4. Create a Pull Request on GitHub
```

### Commit Message Hook
**Automatically runs on every `git commit`**

#### Enforces Conventional Commits format:
```
type(scope): description

Valid types: feat, fix, docs, style, refactor, test, chore, perf, ci, build, revert
```

#### Examples of valid commits:
```bash
✅ git commit -m "feat(auth): add JWT token refresh mechanism"
✅ git commit -m "fix(cart): resolve checkout calculation bug"
✅ git commit -m "docs: update contributing guidelines"
✅ git commit -m "test: add unit tests for user service"
✅ git commit -m "chore: update dependencies"
```

#### Invalid commit examples:
```bash
❌ git commit -m "updated stuff"
❌ git commit -m "fixes"
❌ git commit -m "WIP"
```

## 🌊 GitFlow Development Workflow

### 1. Starting a New Feature

```bash
# Always start from the latest develop
git checkout develop
git pull origin develop

# Create your feature branch
git checkout -b feature/user-dashboard

# Make your changes
# ... code, test, iterate ...

# Commit with proper format (validated by hooks)
git add .
git commit -m "feat(dashboard): implement user activity widgets"

# Push your feature branch (hooks allow this)
git push origin feature/user-dashboard
```

### 2. Making Changes

```bash
# Continue development
git add modified-files
git commit -m "feat(dashboard): add responsive design for mobile"

# The pre-commit hook will automatically:
# ✅ Run ESLint on your changed files
# ✅ Check TypeScript compilation
# ✅ Verify build succeeds
# ✅ Run relevant unit tests
# ✅ Scan for security issues
```

### 3. Creating a Pull Request

1. **Push your feature branch** (already done above)
2. **Go to GitHub** and create a new Pull Request
3. **Target**: `develop` branch (not `main`)
4. **Fill out the PR template** with:
   - Clear description of changes
   - Testing performed
   - Screenshots (for UI changes)
   - Breaking changes (if any)

### 4. PR Review Process

- **Automated checks** will run (CI/CD pipeline)
- **Manual code review** required (minimum 1 approval)
- **Address feedback** by pushing new commits to your branch
- **Squash and merge** when approved

### 5. After Merge

```bash
# Switch back to develop and update
git checkout develop
git pull origin develop

# Delete your local feature branch
git branch -d feature/user-dashboard

# Delete remote feature branch (optional, GitHub can do this)
git push origin --delete feature/user-dashboard
```

## 🧪 Testing Guidelines

### Test Types Required

#### Unit Tests
- **Location**: `__tests__` directories or `.test.ts` files
- **Framework**: Jest + React Testing Library
- **Coverage**: Aim for >85% coverage
- **Run**: `npm run test:unit`

#### Integration Tests
- **Location**: `src/tests/integration/`
- **Focus**: API endpoints, database interactions
- **Run**: `npm run test:integration`

#### E2E Tests (when available)
- **Framework**: Playwright
- **Location**: `qa-automation/playwright/`
- **Run**: `npm run test:e2e`

### Writing Quality Tests

```typescript
// ✅ Good unit test example
describe('UserService', () => {
  it('should create user with valid data', async () => {
    const userData = { email: 'test@example.com', password: 'ValidPass123!' };
    const result = await UserService.createUser(userData);

    expect(result.success).toBe(true);
    expect(result.user.email).toBe(userData.email);
    expect(result.user.password).toBeUndefined(); // Password should not be returned
  });
});
```

## 🏗️ Code Quality Standards

### TypeScript Guidelines
- **Strict mode enabled** - no `any` types unless absolutely necessary
- **Interface definitions** for all API responses and props
- **Proper error handling** with typed exceptions
- **JSDoc comments** for public methods

### ESLint Configuration
- **Automatic fixes** available: `npm run lint -- --fix`
- **Pre-commit validation** ensures compliance
- **Custom rules** for React hooks and accessibility

### Code Style
- **Prettier formatting** (runs automatically)
- **Consistent naming**: camelCase for variables, PascalCase for components
- **File organization**: Group imports, separate concerns
- **Component structure**: Props interface, component, export

## 🚨 Troubleshooting Git Hooks

### Common Issues and Solutions

#### Pre-commit hook fails on linting
```bash
# Fix automatically (when possible)
cd frontend  # or backend
npm run lint -- --fix

# Manual fix required for remaining issues
# Edit files to resolve linting errors
```

#### TypeScript compilation errors
```bash
# Check specific errors
npm run type-check

# Common fixes:
# - Add missing type annotations
# - Import required types
# - Fix interface mismatches
```

#### Build failures
```bash
# Check build output
npm run build

# Common issues:
# - Missing dependencies
# - Import path errors
# - Environment variable issues
```

#### Security scanner detects secrets
```bash
# Review flagged files
git diff --cached

# Remove hardcoded values and use:
# - Environment variables
# - Configuration files (not committed)
# - Secure credential stores
```

#### Commit message validation fails
```bash
# Check the error message for guidance
# Fix format to match: type(scope): description

# Examples:
git commit -m "feat(auth): add login validation"
git commit -m "fix(ui): resolve responsive layout issue"
git commit -m "docs: update API documentation"
```

### Bypassing Hooks (Emergency Only)
```bash
# Skip pre-commit (NOT RECOMMENDED)
git commit --no-verify -m "emergency: critical hotfix"

# Skip pre-push (NOT RECOMMENDED)
git push --no-verify origin feature/emergency-fix
```

**⚠️ Warning**: Only use `--no-verify` for genuine emergencies. Code that bypasses hooks may be rejected during review.

## 🔧 Development Environment Setup

### VS Code Configuration
Recommended extensions:
- ESLint
- Prettier
- TypeScript and JavaScript Language Features
- GitLens
- Playwright Test for VS Code

### Environment Variables
Create `.env` files in both frontend and backend directories:

**Backend `.env`:**
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/cosmic-coffeehouse
JWT_SECRET=your-development-secret
NODE_ENV=development
```

**Frontend `.env`:**
```env
VITE_API_URL=http://localhost:3000
```

## 📋 Contribution Checklist

Before submitting your PR, ensure:

- [ ] **Git hooks pass** (automatic validation)
- [ ] **Tests added/updated** for new functionality
- [ ] **Documentation updated** if needed
- [ ] **TypeScript types defined** for new interfaces
- [ ] **ESLint warnings resolved**
- [ ] **Build succeeds** in both development and production
- [ ] **Manual testing performed**
- [ ] **Accessibility considered** (for UI changes)
- [ ] **Mobile responsiveness checked** (for UI changes)
- [ ] **PR description is comprehensive**

## 🎯 Project-Specific Guidelines

### QA Demonstration Focus
This project is designed to showcase QA engineering capabilities:

- **Quality over speed** - prefer robust, well-tested solutions
- **Documentation matters** - include comprehensive JSDoc comments
- **Error handling** - implement proper error boundaries and validation
- **Testing approaches** - demonstrate various testing strategies
- **Security awareness** - follow secure coding practices

### UI/UX Considerations
- **Sci-fi theme consistency** - follow the established design system
- **Accessibility** - ensure WCAG 2.1 compliance
- **Performance** - optimize for mobile and slow connections
- **User experience** - intuitive navigation and clear feedback

### API Development
- **OpenAPI documentation** - update Swagger specs for new endpoints
- **Input validation** - validate all incoming data
- **Error responses** - provide clear, consistent error messages
- **Security** - implement proper authentication and authorization

## 🆘 Getting Help

### Resources
- **Project Documentation**: `/docs` directory
- **API Documentation**: http://localhost:3000/api/docs (when running)
- **GitHub Issues**: For bug reports and feature requests
- **GitHub Discussions**: For questions and general discussion

### Contact
- Create a GitHub Issue for bugs or feature requests
- Use GitHub Discussions for questions about contributing
- Review existing documentation in the `/docs` folder

## 🎉 Recognition

Contributors who follow these guidelines and submit quality PRs will be recognized in:
- Project README acknowledgments
- Release notes mentions
- GitHub contributor graphs

Thank you for contributing to The Cosmic Coffeehouse! Your quality-focused approach helps make this project an excellent demonstration of modern QA engineering practices.

---

**Quality is not an act, it is a habit. - Aristotle** ⚡🌌