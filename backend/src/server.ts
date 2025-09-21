import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger';
import { connectDatabase } from './config/database';
import { Logger } from './config/logger';
import {
  requestLogger,
  errorLogger,
  securityLogger,
  businessLogger
} from './middleware/logging';

// Load environment variables
dotenv.config();

// Create Express app
const app: Application = express();
const PORT = process.env.PORT || 3001;

// CORS configuration - handle multiple origins
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
  : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'];

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or postman)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(compression());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Enhanced logging middleware
app.use(requestLogger);
app.use(securityLogger);
app.use(businessLogger);

// Health check endpoint
app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'online',
    message: '🚀 The Cosmic Coffeehouse API is operational!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Swagger API Documentation
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customCss: `
    .topbar-wrapper .download-url-wrapper { display: none }
    .swagger-ui .topbar { background-color: #1a1a2e; }
    .swagger-ui .info .title { color: #16213e; }
    .swagger-ui .scheme-container { background-color: #0f4c75; }
    .swagger-ui .btn.authorize { background-color: #3282b8; border-color: #3282b8; }
    .swagger-ui .btn.authorize:hover { background-color: #bbe1fa; }
    .swagger-ui .opblock.opblock-get .opblock-summary-method { background: #61affe; }
    .swagger-ui .opblock.opblock-post .opblock-summary-method { background: #49cc90; }
    .swagger-ui .opblock.opblock-put .opblock-summary-method { background: #fca130; }
    .swagger-ui .opblock.opblock-delete .opblock-summary-method { background: #f93e3e; }
  `,
  customSiteTitle: 'The Cosmic Coffeehouse API Documentation',
  customfavIcon: '/favicon.ico',
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    filter: true,
    showExtensions: true,
    showCommonExtensions: true,
    docExpansion: 'list'
  }
}));

// Serve raw OpenAPI JSON
app.get('/api/docs.json', (_req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});


// API Info endpoint
app.get('/api', (_req, res) => {
  res.status(200).json({
    name: 'The Cosmic Coffeehouse API',
    version: '1.1.0',
    description: 'Superpower Coffee E-commerce Platform',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      products: '/api/products',
      cart: '/api/cart',
      orders: '/api/orders'
    },
    documentation: '/api/docs',
    powerLevel: 'MAXIMUM'
  });
});

// Import routes
import authRoutes from './routes/auth.routes';
import productsRoutes from './routes/products.routes';
import cartRoutes from './routes/cart.routes';
import orderRoutes from './routes/order.routes';

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'RESOURCE_NOT_FOUND',
      message: `Cannot ${req.method} ${req.url}`,
      suggestion: 'Check the API documentation at /api for available endpoints'
    }
  });
});

// Error handling middleware
app.use(errorLogger);
app.use((error: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  Logger.error('Unhandled application error', {
    error: error.message,
    stack: error.stack,
    statusCode: error.statusCode
  });

  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';
  const code = error.code || 'INTERNAL_SERVER_ERROR';

  res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    }
  });
});

// Start server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDatabase();

    // Start Express server
    app.listen(PORT, () => {
      Logger.info(`🚀 THE COSMIC COFFEEHOUSE API SERVER STARTED`, {
        port: PORT,
        environment: process.env.NODE_ENV || 'development',
        powerLevel: 'MAXIMUM'
      });

      console.log(`
╔══════════════════════════════════════════════════════════╗
║                                                          ║
║     ☕ THE COSMIC COFFEEHOUSE API SERVER ☕               ║
║                                                          ║
║     🚀 Server running on port ${PORT}                       ║
║     🌌 Environment: ${process.env.NODE_ENV || 'development'}                 ║
║     ⚡ Power Level: MAXIMUM                             ║
║     🔮 Superpower Coffee API: ONLINE                    ║
║     🔮 Superpower Coffee API: ONLINE                    ║
║                                                          ║
║     Health Check: /health                                ║
║     API Documentation: /api/docs                         ║
║     Ready to serve superpowers in coffee form!           ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    Logger.error('Failed to start server', { error: (error as Error).message });
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (error: Error) => {
  Logger.error('Unhandled Promise Rejection', { error: error.message, stack: error.stack });
  console.error('Unhandled Rejection:', error);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  Logger.error('Uncaught Exception', { error: error.message, stack: error.stack });
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Start the server
startServer();

export default app;