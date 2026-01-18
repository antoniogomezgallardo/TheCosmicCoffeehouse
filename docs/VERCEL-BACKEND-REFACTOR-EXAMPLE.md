# Vercel Backend Refactoring Example

This document provides concrete code examples for adapting the Express backend to work with Vercel's serverless infrastructure.

## Current Architecture vs Vercel Architecture

### Current: Traditional Express Server
```
backend/
├── src/
│   ├── server.ts          # Entry point with app.listen()
│   ├── config/
│   │   └── database.ts    # Persistent MongoDB connection
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── product.routes.ts
│   │   └── order.routes.ts
│   └── middleware/
```

### Vercel: Serverless Functions
```
backend/
├── api/
│   └── index.ts           # Serverless entry point
├── src/
│   ├── app.ts             # Express app WITHOUT app.listen()
│   ├── config/
│   │   └── database.vercel.ts  # Connection caching
│   ├── routes/
│   └── middleware/
```

---

## Step 1: Extract Express App

### Before: `backend/src/server.ts`
```typescript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import connectDB from './config/database';
import authRoutes from './routes/auth.routes';
import productRoutes from './routes/product.routes';

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// Connect to database and start server
connectDB().then(() => {
  app.listen(3001, () => {
    console.log('Server running on port 3001');
  });
});
```

### After: `backend/src/app.ts` (Serverless Compatible)
```typescript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './routes/auth.routes';
import productRoutes from './routes/product.routes';

// Create Express app
export const app = express();

// CORS configuration for Vercel
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(helmet({
  contentSecurityPolicy: false, // Adjust for your needs
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
});

// Note: NO app.listen() here - that's for local development only
```

### After: `backend/src/server.local.ts` (For local development)
```typescript
import { app } from './app';
import connectDB from './config/database';

const PORT = process.env.PORT || 3001;

// Connect to database and start server (local only)
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`API docs: http://localhost:${PORT}/api/docs`);
  });
}).catch((error) => {
  console.error('Failed to connect to database:', error);
  process.exit(1);
});
```

Update `package.json`:
```json
{
  "scripts": {
    "dev": "nodemon --exec ts-node src/server.local.ts",
    "start": "node dist/server.local.js",
    "build": "tsc -p tsconfig.build.json"
  }
}
```

---

## Step 2: MongoDB Connection Caching

### Before: `backend/src/config/database.ts`
```typescript
import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectDB;
```

### After: `backend/src/config/database.vercel.ts`
```typescript
import mongoose from 'mongoose';

// Caching variable to store the connection
let cachedConnection: typeof mongoose | null = null;

/**
 * Connect to MongoDB with connection caching for serverless
 *
 * Serverless functions are stateless and can be invoked multiple times.
 * To avoid opening new connections on every invocation, we cache the
 * connection and reuse it across function calls.
 */
export async function connectToDatabase() {
  // If we have a cached connection and it's ready, return it
  if (cachedConnection && mongoose.connection.readyState === 1) {
    console.log('Using cached MongoDB connection');
    return cachedConnection;
  }

  // If connection exists but is not ready, close it
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }

  try {
    // Create new connection with optimized settings for serverless
    const connection = await mongoose.connect(process.env.MONGODB_URI!, {
      // Limit connection pool size (serverless has limited concurrent executions)
      maxPoolSize: 10,
      minPoolSize: 2,

      // Shorter timeouts for serverless (fail fast)
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,

      // Enable connection monitoring
      monitorCommands: process.env.NODE_ENV === 'development',

      // Buffer commands until connection is established
      bufferCommands: false,
    });

    console.log('New MongoDB connection established');

    // Cache the connection
    cachedConnection = connection;

    return connection;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    cachedConnection = null;
    throw error;
  }
}

/**
 * Disconnect from MongoDB (useful for cleanup)
 */
export async function disconnectFromDatabase() {
  if (cachedConnection) {
    await mongoose.connection.close();
    cachedConnection = null;
    console.log('MongoDB connection closed');
  }
}
```

---

## Step 3: Create Vercel Serverless Entry Point

### Create: `backend/api/index.ts`
```typescript
import { VercelRequest, VercelResponse } from '@vercel/node';
import { app } from '../src/app';
import { connectToDatabase } from '../src/config/database.vercel';

/**
 * Vercel serverless function handler
 *
 * This function is invoked for every HTTP request to /api/*
 * It ensures database connection before processing the request
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Ensure database connection (uses cached connection if available)
    await connectToDatabase();

    // Pass request to Express app
    return app(req, res);
  } catch (error) {
    console.error('Serverless function error:', error);

    return res.status(500).json({
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development'
        ? (error as Error).message
        : 'An unexpected error occurred'
    });
  }
}
```

---

## Step 4: Update TypeScript Configuration

### `backend/tsconfig.vercel.json` (for Vercel builds)
```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./",
    "module": "commonjs",
    "target": "ES2020",
    "moduleResolution": "node",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "strict": true
  },
  "include": [
    "src/**/*",
    "api/**/*"
  ],
  "exclude": [
    "node_modules",
    "**/*.test.ts",
    "**/*.spec.ts"
  ]
}
```

---

## Step 5: Environment Variables Configuration

### `.env.production` (example - DO NOT commit)
```bash
# Vercel Production Environment
NODE_ENV=production

# MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cosmic_coffeehouse?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your-production-jwt-secret-here-use-strong-random-value
JWT_REFRESH_SECRET=your-production-refresh-secret-here
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# CORS
FRONTEND_URL=https://your-app.vercel.app
ALLOWED_ORIGINS=https://your-app.vercel.app,https://your-app-preview.vercel.app

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100

# Security
BCRYPT_ROUNDS=12
```

### Setting in Vercel Dashboard
```bash
# Using Vercel CLI
vercel env add MONGODB_URI production
vercel env add JWT_SECRET production
vercel env add JWT_REFRESH_SECRET production

# Or via Vercel Dashboard:
# Project Settings → Environment Variables → Add
```

---

## Step 6: Update Middleware for Serverless

### Rate Limiting Adjustment

**Problem**: Traditional rate limiting uses in-memory storage, which doesn't work across serverless function invocations.

### Before: `backend/src/middleware/rateLimiter.ts`
```typescript
import rateLimit from 'express-rate-limit';

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
});
```

### After: Use Vercel Edge Config or external store
```typescript
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { createClient } from 'redis';

// Option 1: Use Redis (recommended for production)
const redisClient = createClient({
  url: process.env.REDIS_URL
});

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  store: new RedisStore({
    client: redisClient,
    prefix: 'rl:' // Rate limit prefix
  }),
  message: 'Too many requests from this IP'
});

// Option 2: Use Vercel's built-in rate limiting (Pro plan)
// Configure in vercel.json instead:
// "limits": {
//   "maxDuration": 10
// }
```

---

## Step 7: Frontend API Configuration

### Before: `frontend/src/config/api.ts`
```typescript
export const API_BASE_URL = 'http://localhost:3001/api';
```

### After: Use relative URLs
```typescript
// Automatically uses same domain in production, localhost in development
export const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? '/api'
  : 'http://localhost:3001/api';
```

### Update Axios instance: `frontend/src/services/api.service.ts`
```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true // Important for JWT cookies
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
```

---

## Step 8: Package Dependencies

### Install Vercel dependencies
```bash
cd backend
npm install @vercel/node

# If using Redis for rate limiting
npm install redis rate-limit-redis
```

### Update `backend/package.json`
```json
{
  "scripts": {
    "dev": "nodemon --exec ts-node src/server.local.ts",
    "build": "tsc -p tsconfig.vercel.json",
    "start": "node dist/server.local.js",
    "vercel-build": "npm run build"
  },
  "dependencies": {
    "@vercel/node": "^3.0.0",
    "express": "^5.1.0",
    "mongoose": "^8.18.1",
    // ... other dependencies
  }
}
```

---

## Step 9: Testing Locally with Vercel CLI

### Install and configure Vercel CLI
```bash
npm install -g vercel

# Login to Vercel
vercel login

# Link project to Vercel
vercel link

# Pull environment variables
vercel env pull .env.local

# Run local development server (simulates Vercel environment)
vercel dev
```

This will:
- Run frontend on port 3000
- Run backend serverless functions on `/api`
- Simulate Vercel's routing and environment

---

## Step 10: Deployment

### Deploy to preview
```bash
vercel
```

### Deploy to production
```bash
vercel --prod
```

### Monitor deployment
```bash
# Check deployment status
vercel ls

# View logs
vercel logs <deployment-url>
```

---

## Common Issues and Solutions

### Issue 1: "Cannot find module '@vercel/node'"
**Solution**: Install dependencies
```bash
cd backend && npm install @vercel/node
```

### Issue 2: MongoDB connection timeout
**Solution**:
1. Check MongoDB Atlas IP whitelist (should be `0.0.0.0/0`)
2. Verify connection string is correct
3. Check if cluster is paused (Atlas free tier pauses after inactivity)

### Issue 3: CORS errors in production
**Solution**: Update `ALLOWED_ORIGINS` environment variable
```bash
vercel env add ALLOWED_ORIGINS production
# Enter: https://your-app.vercel.app
```

### Issue 4: Serverless function timeout
**Solution**:
1. Optimize database queries
2. Add indexes to MongoDB collections
3. Consider upgrading to Vercel Pro for longer timeout limits
4. Move long-running tasks to background jobs

### Issue 5: Cold start performance
**Solution**:
1. Implement connection caching (already done above)
2. Use Vercel Pro for faster cold starts
3. Consider keeping functions "warm" with cron jobs
4. Optimize bundle size (remove unused dependencies)

---

## Performance Monitoring

### Add Vercel Analytics
```typescript
// frontend/src/main.tsx
import { Analytics } from '@vercel/analytics/react';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
    <Analytics />
  </React.StrictMode>
);
```

### Add Error Tracking (Sentry)
```typescript
// backend/api/index.ts
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

---

## Summary

This refactoring transforms a traditional Express application into a Vercel-compatible serverless application while maintaining the same functionality. Key changes:

1. ✅ Separated Express app from server startup
2. ✅ Implemented MongoDB connection caching
3. ✅ Created Vercel serverless entry point
4. ✅ Updated environment variable management
5. ✅ Adjusted middleware for serverless constraints
6. ✅ Configured frontend to use relative API URLs
7. ✅ Added local testing with Vercel CLI

**Estimated refactoring time**: 4-6 hours for experienced developer

---

**Document Version**: 1.0
**Last Updated**: 2026-01-18
**Author**: QA Engineering Team
