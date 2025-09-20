# 🌊 GitFlow Workflow Guide

This guide outlines the GitFlow methodology used in The Cosmic Coffeehouse project for version control and branch management.

## 📋 Overview

GitFlow is a branching model that provides a robust framework for managing larger projects with scheduled releases. It assigns specific roles to different branches and defines how they should interact.

## 🌳 Branch Structure

### Main Branches

#### `main` (Production Branch)
- **Purpose**: Contains production-ready code
- **Stability**: Always stable and deployable
- **Protection**: Protected branch, requires PR reviews
- **Deployment**: Automatically deployed to production
- **Tagging**: All releases are tagged here

#### `develop` (Development Branch)
- **Purpose**: Integration branch for features
- **Stability**: Should be stable, tested code
- **Source**: All feature branches branch from here
- **Target**: All feature branches merge back here
- **Updates**: Regularly updated from `main` via merge or rebase

### Supporting Branches

#### Feature Branches (`feature/*`)
- **Purpose**: Develop new features or enhancements
- **Lifetime**: Temporary, deleted after merge
- **Naming**: `feature/feature-name` or `feature/ticket-number`
- **Source**: Branch from `develop`
- **Target**: Merge back to `develop`

#### Release Branches (`release/*`)
- **Purpose**: Prepare new production releases
- **Lifetime**: Temporary, for release preparation
- **Naming**: `release/v1.0.0` or `release/2024-01-15`
- **Source**: Branch from `develop`
- **Target**: Merge to both `main` and `develop`

#### Hotfix Branches (`hotfix/*`)
- **Purpose**: Emergency fixes to production
- **Lifetime**: Temporary, for critical bugs
- **Naming**: `hotfix/critical-bug-fix`
- **Source**: Branch from `main`
- **Target**: Merge to both `main` and `develop`

## 🚀 Workflow Commands

### Starting a New Feature

```bash
# 1. Ensure develop is up to date
git checkout develop
git pull origin develop

# 2. Create feature branch
git checkout -b feature/cors-improvements

# 3. Work on your feature
# ... make changes ...
git add .
git commit -m "feat: implement dynamic CORS origin handling"

# 4. Push feature branch
git push -u origin feature/cors-improvements

# 5. Create Pull Request (via GitHub UI)
# Target: develop ← feature/cors-improvements
```

### Completing a Feature

```bash
# 1. Ensure feature is ready
git checkout feature/cors-improvements
git push origin feature/cors-improvements

# 2. Switch to develop and update
git checkout develop
git pull origin develop

# 3. Merge feature (after PR approval)
git merge feature/cors-improvements

# 4. Push updated develop
git push origin develop

# 5. Clean up feature branch
git branch -d feature/cors-improvements
git push origin --delete feature/cors-improvements
```

### Creating a Release

```bash
# 1. Start from updated develop
git checkout develop
git pull origin develop

# 2. Create release branch
git checkout -b release/v1.1.0

# 3. Update version numbers and prepare release
# Edit package.json, CHANGELOG.md, etc.
git add .
git commit -m "chore: prepare release v1.1.0"

# 4. Push release branch
git push -u origin release/v1.1.0

# 5. Create PR to main for final review
# Target: main ← release/v1.1.0
```

### Finalizing a Release

```bash
# 1. Merge to main (after PR approval)
git checkout main
git pull origin main
git merge release/v1.1.0

# 2. Tag the release
git tag -a v1.1.0 -m "Release version 1.1.0

Features:
- Dynamic CORS configuration
- Image loading improvements
- Enhanced error handling
"

# 3. Push main with tags
git push origin main --tags

# 4. Merge back to develop
git checkout develop
git merge release/v1.1.0
git push origin develop

# 5. Clean up release branch
git branch -d release/v1.1.0
git push origin --delete release/v1.1.0
```

### Emergency Hotfix

```bash
# 1. Start from main
git checkout main
git pull origin main

# 2. Create hotfix branch
git checkout -b hotfix/security-vulnerability

# 3. Fix the critical issue
# ... make urgent changes ...
git add .
git commit -m "fix: resolve critical security vulnerability

This fixes CVE-2024-XXXX by updating dependency
and implementing additional input validation.
"

# 4. Push hotfix branch
git push -u origin hotfix/security-vulnerability

# 5. Create PR to main for urgent review
# Target: main ← hotfix/security-vulnerability
```

### Finalizing a Hotfix

```bash
# 1. Merge to main (after urgent review)
git checkout main
git merge hotfix/security-vulnerability

# 2. Tag the hotfix
git tag -a v1.0.1 -m "Hotfix v1.0.1 - Security vulnerability fix"

# 3. Push main with tags
git push origin main --tags

# 4. Merge back to develop
git checkout develop
git merge hotfix/security-vulnerability
git push origin develop

# 5. Clean up hotfix branch
git branch -d hotfix/security-vulnerability
git push origin --delete hotfix/security-vulnerability
```

## 🛡️ Git Hooks Integration

### Automated Quality Gates
This project implements comprehensive Git hooks that automatically enforce quality standards and GitFlow methodology:

#### Pre-Commit Validation
Every commit is automatically validated for:
- **Code Quality**: ESLint validation with auto-fix suggestions
- **Type Safety**: TypeScript compilation and type checking
- **Build Verification**: Ensures code compiles successfully
- **Test Execution**: Runs relevant unit tests for changed files
- **Security Scanning**: Detects hardcoded secrets and credentials
- **Package Consistency**: Validates package.json/package-lock.json alignment

```bash
# Example pre-commit execution
$ git commit -m "feat(auth): add OAuth2 integration"
🔍 Running pre-commit quality checks...
📝 Checking frontend code quality...
✅ Frontend linting passed
✅ Frontend TypeScript compilation passed
✅ Frontend build check passed
🔒 Checking for sensitive information...
✅ All pre-commit quality checks passed!
[feature/oauth2 a1b2c3d] feat(auth): add OAuth2 integration
```

#### Pre-Push Branch Protection
Enforces GitFlow methodology by preventing direct pushes to protected branches:

```bash
# Attempting to push to protected branch
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

### Git Hooks Workflow Integration

#### Feature Development with Hooks
```bash
# 1. Start feature (hooks guide proper workflow)
git checkout develop
git pull origin develop
git checkout -b feature/user-preferences

# 2. Develop with automatic validation
echo "// Add new feature code" >> src/userPreferences.ts
git add .
git commit -m "feat(user): add preference storage system"
# ↑ Automatically validates: format, code quality, tests, security

# 3. Continue development
echo "// Add tests" >> src/__tests__/userPreferences.test.ts
git add .
git commit -m "test(user): add unit tests for preferences"
# ↑ Each commit automatically validated

# 4. Push feature branch (allowed by pre-push hook)
git push origin feature/user-preferences  # ✅ Allowed

# 5. Attempt direct push to develop (blocked)
git checkout develop
git push origin develop  # ❌ Blocked by pre-push hook
```

## 📝 Commit Message Conventions (Enforced by Hooks)

### Automatic Format Validation
The commit-msg hook automatically validates all commit messages against Conventional Commits format:

### Required Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Valid Types (Enforced)
- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, semicolons, etc.)
- **refactor**: Code refactoring without feature changes
- **test**: Adding or updating tests
- **chore**: Maintenance tasks, dependency updates
- **perf**: Performance improvements
- **ci**: CI/CD changes
- **build**: Build system changes
- **revert**: Reverting previous commits

### Examples
```bash
# Feature commit
git commit -m "feat(auth): implement JWT token refresh mechanism

Add automatic token refresh to prevent user logout
during active sessions. Tokens refresh 5 minutes
before expiration.

Closes #45"

# Bug fix commit
git commit -m "fix(cors): resolve infinite image loading loop

Prevent multiple retry attempts when images fail to load
by implementing proper error state management in ProductCard.

Fixes #78"

# Documentation commit
git commit -m "docs: update GitFlow workflow guide

Add comprehensive examples for feature development,
release management, and hotfix procedures.

Includes command examples and best practices."
```

## 🔄 Branch Protection Rules

### Main Branch Protection
- **Require pull request reviews**: 1+ approvals
- **Dismiss stale reviews**: When new commits are pushed
- **Require status checks**: All CI tests must pass
- **Require up-to-date branches**: Must be current with main
- **Include administrators**: Rules apply to admins too

### Develop Branch Protection
- **Require pull request reviews**: 1+ approvals
- **Require status checks**: All CI tests must pass
- **Allow force pushes**: Only for repository admins
- **Allow deletions**: Not allowed

## 🎯 Best Practices

### Feature Development
1. **Keep features small**: Aim for 1-3 days of work
2. **Regular commits**: Commit frequently with meaningful messages
3. **Sync with develop**: Regularly merge or rebase from develop
4. **Test thoroughly**: Ensure all tests pass before PR
5. **Clean history**: Squash commits if necessary

### Code Review Process
1. **Self-review first**: Review your own PR before requesting review
2. **Provide context**: Write clear PR descriptions
3. **Address feedback**: Respond to all review comments
4. **Update documentation**: Include doc updates in PRs
5. **Verify tests**: Ensure CI passes before merge

### Release Management
1. **Semantic versioning**: Use MAJOR.MINOR.PATCH format
2. **Release notes**: Document all changes in CHANGELOG.md
3. **Version consistency**: Update all version references
4. **Final testing**: Perform comprehensive testing on release branch
5. **Tag consistently**: Use annotated tags with release notes

## 🚨 Git Hooks Troubleshooting

### Common Git Hook Issues

#### Hook Validation Failures

**ESLint Errors:**
```bash
# Error: Pre-commit hook failed on linting
❌ Frontend linting failed
💡 Run 'cd frontend && npm run lint -- --fix' to auto-fix issues

# Solution:
cd frontend
npm run lint -- --fix
# Fix remaining manual issues
git add .
git commit -m "fix(lint): resolve ESLint errors"
```

**TypeScript Compilation Errors:**
```bash
# Error: TypeScript compilation failed
❌ Frontend TypeScript compilation failed
💡 Fix TypeScript errors in frontend code

# Solution:
npm run type-check  # See specific errors
# Fix type errors in your code
git add .
git commit -m "fix(types): resolve TypeScript compilation errors"
```

**Security Scanner Alerts:**
```bash
# Error: Potential hardcoded secrets detected
❌ Potential hardcoded secrets detected in: src/config.ts
💡 Please review and remove any hardcoded secrets, passwords, or API keys

# Solution:
# 1. Review flagged files
git diff --cached

# 2. Remove hardcoded values, use environment variables
# 3. Update .env files instead
git add .
git commit -m "fix(security): remove hardcoded credentials"
```

**Build Failures:**
```bash
# Error: Build verification failed
❌ Frontend build check failed
💡 Fix build errors in frontend code

# Solution:
npm run build  # See specific build errors
# Fix import issues, missing dependencies, etc.
git add .
git commit -m "fix(build): resolve build compilation errors"
```

#### Branch Protection Issues

**Blocked Push to Protected Branch:**
```bash
# Error: Trying to push directly to develop/main
🚫 PUSH REJECTED: Direct pushes to 'develop' branch are not allowed!

# Solution: Use proper GitFlow workflow
git checkout -b feature/my-changes  # Create feature branch
git push origin feature/my-changes  # Push feature branch
# Then create PR on GitHub
```

**Invalid Commit Message Format:**
```bash
# Error: Commit message doesn't follow Conventional Commits
❌ COMMIT REJECTED: Invalid commit message format!

# Solution: Use proper format
git commit -m "feat(auth): add user authentication system"
# or
git commit -m "fix(ui): resolve mobile layout issue"
# or
git commit -m "docs: update development setup guide"
```

### Emergency Procedures

#### Bypassing Hooks (Use Sparingly!)
```bash
# Emergency commit bypass (NOT RECOMMENDED)
git commit --no-verify -m "emergency: critical hotfix for production"

# Emergency push bypass (NOT RECOMMENDED)
git push --no-verify origin main

# ⚠️ WARNING: Use only for genuine emergencies
# Bypassed code may fail CI/CD and should be reviewed ASAP
```

#### Fixing Failed Commits
```bash
# If commit failed due to hooks, fix issues and retry
git add .  # Stage your fixes
git commit  # Reuse the previous commit message

# Or amend the last commit
git add .
git commit --amend --no-edit
```

#### Recovering from Hook Conflicts
```bash
# If hooks seem to be causing git conflicts
git reset --soft HEAD~1  # Undo last commit, keep changes
# Fix the issues
git add .
git commit -m "fix: resolve hook validation issues"
```

### Hook Maintenance

#### Verifying Hook Installation
```bash
# Check that hooks are present and executable
ls -la .git/hooks/pre-commit .git/hooks/pre-push .git/hooks/commit-msg

# Make hooks executable if needed (Unix-like systems)
chmod +x .git/hooks/pre-commit
chmod +x .git/hooks/pre-push
chmod +x .git/hooks/commit-msg
```

#### Updating Hook Logic
```bash
# Hooks are tracked in the repository
# Updates are automatically pulled with git pull
git pull origin develop

# Verify hook updates
cat .git/hooks/pre-commit  # Check hook content
```

## 🚨 Emergency Procedures

### Broken Main Branch
```bash
# 1. Identify the problematic commit
git log --oneline main

# 2. Create hotfix branch from last good commit
git checkout -b hotfix/revert-broken-commit <last-good-commit>

# 3. Revert the problematic changes
git revert <bad-commit-hash>

# 4. Follow standard hotfix process (hooks will validate the revert)
git commit -m "fix: revert problematic commit <commit-hash>"
git push origin hotfix/revert-broken-commit
# Create emergency PR to main
```

### Lost Work Recovery
```bash
# 1. Find lost commits
git reflog

# 2. Create recovery branch
git checkout -b recovery/lost-work
git cherry-pick <lost-commit-hash>

# 3. Create PR to restore work
```

### Merge Conflicts
```bash
# 1. Update your branch
git checkout feature/your-feature
git fetch origin
git merge origin/develop

# 2. Resolve conflicts in your editor
# Edit conflicted files, remove conflict markers

# 3. Complete merge
git add .
git commit -m "resolve: merge conflicts with develop"

# 4. Push updated branch
git push origin feature/your-feature
```

## 📊 Branch Workflow Diagram

```
main        ●─────●─────●─────●  (Production releases)
            │      \     \     │
           /        \     \    │
develop    ●─●─●─●─●─●─●─●─●─●─●  (Integration branch)
           │   │   │   │   │   │
          /    │    \   \   \   \
feature-a ●─●─●      │    \   \   (Feature development)
feature-b      ●─●─●      \   \
release              ●─●─●─●    \ (Release preparation)
hotfix                     ●─●─● (Emergency fixes)
```

## 🔮 Advanced Workflows

### Multiple Features Integration
```bash
# When multiple features need to be tested together
git checkout develop
git checkout -b integration/multi-feature-test
git merge feature/feature-a
git merge feature/feature-b
# Test integration, then merge features individually to develop
```

### Feature Flags
```bash
# For partially complete features
git commit -m "feat: add user preferences (behind feature flag)

Implements user preference storage and API endpoints.
Feature is disabled by default via ENABLE_USER_PREFS flag.

Partial implementation for #123"
```

## 📈 Metrics and Monitoring with Git Hooks

### Quality Metrics Enforcement
Git hooks automatically enforce quality standards and collect metrics:

#### Code Quality Metrics
- **ESLint compliance**: 100% (enforced by pre-commit hook)
- **TypeScript errors**: 0 (enforced by pre-commit hook)
- **Build success rate**: 100% (enforced by pre-commit hook)
- **Security vulnerabilities**: 0 hardcoded secrets (enforced by pre-commit hook)
- **Test coverage**: Maintained for changed files (enforced by pre-commit hook)

#### Workflow Compliance Metrics
- **Conventional commits**: 100% compliance (enforced by commit-msg hook)
- **Direct pushes to protected branches**: 0 occurrences (enforced by pre-push hook)
- **Feature branch usage**: 100% (guided by pre-push hook)
- **GitFlow methodology adherence**: Automated guidance and enforcement

### Branch Health Indicators (Enhanced with Hooks)
- **Feature branch age**: Should be < 1 week
- **Develop stability**: CI should pass consistently + local hook validation
- **Main protection**: Zero direct commits (enforced locally and remotely)
- **Hotfix frequency**: Should be minimal
- **Release cadence**: Regular, predictable releases
- **Hook bypass rate**: Should be < 1% (emergency use only)

### Quality Gate Success Rates
Monitor these metrics to ensure hook effectiveness:

```bash
# Hook success metrics (tracked automatically)
Pre-commit validation success rate: >95%
Commit message format compliance: 100%
Branch protection effectiveness: 100%
Security scan pass rate: 100%
Build verification success rate: >98%
```

### Automation Tools (Integrated with Hooks)
- **Local Git Hooks**: Pre-commit quality gates and branch protection
- **GitHub Actions**: Automated CI/CD pipeline (mirrors local checks)
- **Branch policies**: Enforced locally via hooks + remotely via GitHub settings
- **Conventional commits**: Enforced locally + automated changelog generation
- **Semantic versioning**: Automated version bumping from commit messages
- **Quality metrics**: Automatic collection and enforcement

---

**Flow like the cosmic winds! 🌌⚡**