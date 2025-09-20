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

## 📝 Commit Message Conventions

### Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, semicolons, etc.)
- **refactor**: Code refactoring without feature changes
- **test**: Adding or updating tests
- **chore**: Maintenance tasks, dependency updates

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

## 🚨 Emergency Procedures

### Broken Main Branch
```bash
# 1. Identify the problematic commit
git log --oneline main

# 2. Create hotfix branch from last good commit
git checkout -b hotfix/revert-broken-commit <last-good-commit>

# 3. Revert the problematic changes
git revert <bad-commit-hash>

# 4. Follow standard hotfix process
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

## 📈 Metrics and Monitoring

### Branch Health Indicators
- **Feature branch age**: Should be < 1 week
- **Develop stability**: CI should pass consistently
- **Main protection**: Zero direct commits to main
- **Hotfix frequency**: Should be minimal
- **Release cadence**: Regular, predictable releases

### Automation Tools
- **GitHub Actions**: Automated CI/CD pipeline
- **Branch policies**: Enforced via GitHub settings
- **Conventional commits**: Automated changelog generation
- **Semantic versioning**: Automated version bumping

---

**Flow like the cosmic winds! 🌌⚡**