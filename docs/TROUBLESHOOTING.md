# 🔧 Troubleshooting Guide

This guide covers common issues and their solutions for The Cosmic Coffeehouse project.

## 🚨 Common Issues and Fixes

### CORS Configuration Issues

**Problem**: Frontend cannot communicate with backend, browser shows CORS errors
```
Access to fetch at 'http://localhost:3000/api/...' from origin 'http://localhost:5173' has been blocked by CORS policy
```

**Root Cause**: The backend CORS configuration doesn't allow requests from the current frontend port.

**Solution**:
1. **Automatic**: The backend now supports dynamic CORS origin handling for multiple ports
2. **Manual**: Set the `ALLOWED_ORIGINS` environment variable in backend `.env`:
   ```env
   ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174,http://localhost:3000
   ```

**Recent Fix**: Implemented dynamic CORS origin validation (commit 43c9656)

### Image Loading Infinite Loop

**Problem**: Browser console shows continuous GET requests to non-existent images, causing performance issues.

**Root Cause**: Product cards were retrying failed image loads indefinitely without error state management.

**Solution**:
- Added `imageError` state to prevent multiple retries
- Created fallback placeholder system with cosmic-themed SVG
- Enhanced error handling in `ProductCard.tsx`

**Recent Fix**: Resolved infinite image loading loop (commit f02b5e1)

### Database Connection Issues

**Problem**: Backend fails to start with MongoDB connection errors
```
MongooseError: Could not connect to any servers in your MongoDB Atlas cluster
```

**Solutions**:
1. **Local MongoDB**: Ensure Docker container is running
   ```bash
   npm run start:mongo
   ```

2. **Check MongoDB Status**:
   ```bash
   docker ps | grep mongo
   ```

3. **Reset Database**:
   ```bash
   npm run stop:docker
   npm run start:mongo
   cd backend && npm run seed
   ```

4. **Verify Connection String**: Check `MONGODB_URI` in backend `.env`

### Frontend Build Issues

**Problem**: Vite development server fails to start or shows port conflicts

**Solutions**:
1. **Port Conflict**:
   ```bash
   # Kill processes on port 5173
   npx kill-port 5173
   # Or use different port
   npm run dev -- --port 5174
   ```

2. **Clear Cache**:
   ```bash
   cd frontend
   rm -rf node_modules/.vite
   npm run dev
   ```

3. **Dependencies Issue**:
   ```bash
   cd frontend
   rm -rf node_modules
   npm install
   ```

### Authentication/JWT Issues

**Problem**: Users get logged out frequently or authentication fails

**Solutions**:
1. **Check JWT Secret**: Verify `JWT_SECRET` in backend `.env`
2. **Token Expiry**: Default is 15 minutes, extend if needed in backend `.env`:
   ```env
   JWT_EXPIRES_IN=24h
   ```
3. **Clear Browser Storage**:
   ```javascript
   localStorage.clear()
   sessionStorage.clear()
   ```

### GitHub Issues Template Errors

**Problem**: GitHub issue templates don't appear or show validation errors

**Root Cause**: GitHub issue forms don't support default values for dropdown fields.

**Solution**: Removed invalid `default` attributes from all dropdown fields in issue templates.

**Recent Fix**: Fixed GitHub issue template validation (commit 0aed2b1)

## 🐛 Development Issues

### Environment Variables Not Loading

**Problem**: Application behavior suggests environment variables aren't being read

**Solutions**:
1. **Check File Names**:
   - Backend: `.env` in `backend/` directory
   - Frontend: `.env` in `frontend/` directory

2. **Verify Variable Names**:
   - Backend: Standard names (no `VITE_` prefix)
   - Frontend: Must start with `VITE_` prefix

3. **Restart Servers**: Environment changes require restart
   ```bash
   npm run stop
   npm run dev
   ```

### Database Seeding Failures

**Problem**: Database seeding script fails or creates incomplete data

**Solutions**:
1. **Clear Existing Data**:
   ```bash
   cd backend
   npm run seed
   ```

2. **Check MongoDB Connection**: Ensure MongoDB is running before seeding

3. **Verify Seed Data**: Check `backend/src/scripts/seed.ts` for data integrity

### TypeScript Compilation Errors

**Problem**: TypeScript errors prevent development or builds

**Solutions**:
1. **Check Types**:
   ```bash
   npm run type-check
   ```

2. **Update Dependencies**:
   ```bash
   npm install
   cd frontend && npm install
   cd ../backend && npm install
   ```

3. **Clear TypeScript Cache**:
   ```bash
   # In project root
   find . -name "*.tsbuildinfo" -delete
   ```

## 🔄 Development Workflow Issues

### Git Flow Issues

**Problem**: Confusion about branch management or merge conflicts

**Solutions**:
1. **Standard GitFlow Process**:
   ```bash
   # Start new feature
   git checkout develop
   git pull origin develop
   git checkout -b feature/feature-name

   # Complete feature
   git checkout develop
   git merge feature/feature-name
   git push origin develop
   ```

2. **Merge Conflicts**:
   ```bash
   git checkout develop
   git pull origin develop
   git checkout feature/branch-name
   git merge develop
   # Resolve conflicts, then commit
   ```

### Performance Issues

**Problem**: Application runs slowly or consumes excessive resources

**Solutions**:
1. **Database Queries**: Check for N+1 queries in backend logs
2. **Frontend Optimization**: Use React DevTools Profiler
3. **Memory Leaks**: Check for unclosed connections or listeners
4. **Docker Resources**: Increase Docker memory allocation if needed

## 🧪 Testing Issues

### Test Failures After Updates

**Problem**: Tests fail after recent fixes or changes

**Solutions**:
1. **Update Test Snapshots** (if using):
   ```bash
   npm run test -- --updateSnapshot
   ```

2. **Clear Test Cache**:
   ```bash
   npm run test -- --clearCache
   ```

3. **Check Test Dependencies**: Ensure test databases and mocks are properly set up

## 📊 Monitoring and Debugging

### Debug Mode

**Enable detailed logging**:
```bash
# Backend debug mode
cd backend
NODE_ENV=development DEBUG=* npm run dev

# Frontend with detailed errors
cd frontend
VITE_DEBUG=true npm run dev
```

### Health Checks

**Verify system health**:
```bash
# API health check
curl http://localhost:3000/health

# MongoDB connection
curl http://localhost:3000/api

# Frontend status
curl http://localhost:5173
```

### Log Analysis

**Check application logs**:
- Backend logs: Console output from Express server
- Frontend logs: Browser developer console
- Database logs: Docker logs for MongoDB container
  ```bash
  docker logs cosmic-mongo
  ```

## 🆘 Emergency Procedures

### Complete Reset

**If all else fails, perform a complete reset**:
```bash
# Stop all services
npm run stop

# Clean all dependencies
rm -rf node_modules
rm -rf frontend/node_modules
rm -rf backend/node_modules

# Clean Docker
docker stop cosmic-mongo
docker rm cosmic-mongo

# Reinstall everything
npm run install:all

# Restart services
npm run start:mongo
npm run dev
```

### Backup and Recovery

**Create backup before major changes**:
```bash
# Backup database
docker exec cosmic-mongo mongodump --db cosmic-coffeehouse --out /backup

# Backup environment files
cp backend/.env backend/.env.backup
cp frontend/.env frontend/.env.backup
```

## 📞 Getting Help

### Debug Information to Collect

When reporting issues, include:
1. **Error Messages**: Full console output
2. **Environment**: OS, Node.js version, Docker version
3. **Steps to Reproduce**: Exact sequence that caused the issue
4. **Expected vs Actual**: What should happen vs what actually happens
5. **Recent Changes**: Any modifications made before the issue appeared

### Resources

- **Project Documentation**: `/docs` directory
- **API Documentation**: `http://localhost:3000/api`
- **GitHub Issues**: Use project issue templates
- **Git History**: Check recent commits for related changes

---

**Remember**: Most issues can be resolved with a fresh restart and environment verification. Always check the basics first! ⚡