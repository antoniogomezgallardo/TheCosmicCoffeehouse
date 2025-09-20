import { Request, Response, NextFunction } from 'express';
import { Logger } from '../config/logger';

// Request logging middleware
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();

  // Log incoming request
  Logger.http(`📥 ${req.method} ${req.path}`, {
    method: req.method,
    url: req.url,
    userAgent: req.get('User-Agent'),
    ip: req.ip,
    timestamp: new Date().toISOString()
  });

  // Capture response finish event
  res.on('finish', function() {
    const responseTime = Date.now() - startTime;

    Logger.api(
      req.method,
      req.path,
      res.statusCode,
      responseTime,
      {
        userAgent: req.get('User-Agent'),
        ip: req.ip,
        contentLength: res.get('Content-Length') || 0
      }
    );

    // Log slow requests
    if (responseTime > 1000) {
      Logger.performance('slow_request', responseTime, 'ms', {
        method: req.method,
        path: req.path,
        statusCode: res.statusCode
      });
    }

    // Log errors
    if (res.statusCode >= 400) {
      Logger.error(`Request failed with status ${res.statusCode}`, {
        method: req.method,
        path: req.path,
        statusCode: res.statusCode
      });
    }
  });

  next();
};

// Error logging middleware
export const errorLogger = (error: Error, req: Request, res: Response, next: NextFunction) => {
  Logger.error(`💥 ${error.name}: ${error.message}`, {
    stack: error.stack,
    method: req.method,
    url: req.url,
    body: req.body,
    params: req.params,
    query: req.query,
    userAgent: req.get('User-Agent'),
    ip: req.ip,
    timestamp: new Date().toISOString()
  });

  next(error);
};

// Security logging middleware
export const securityLogger = (req: Request, res: Response, next: NextFunction) => {
  // Log authentication attempts
  if (req.path.includes('/auth/')) {
    Logger.auth(`Authentication attempt on ${req.path}`, undefined, {
      method: req.method,
      path: req.path,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });
  }

  // Log suspicious patterns
  const suspiciousPatterns = [
    /\.\./,  // Directory traversal
    /<script/i,  // XSS attempts
    /union.*select/i,  // SQL injection
    /exec\(/i,  // Code execution
  ];

  const requestData = JSON.stringify({
    body: req.body,
    query: req.query,
    params: req.params
  });

  for (const pattern of suspiciousPatterns) {
    if (pattern.test(requestData) || pattern.test(req.url)) {
      Logger.security('Suspicious request pattern detected', 'medium', {
        pattern: pattern.toString(),
        method: req.method,
        url: req.url,
        body: req.body,
        ip: req.ip,
        userAgent: req.get('User-Agent')
      });
      break;
    }
  }

  next();
};

// Business metrics logging middleware
export const businessLogger = (req: Request, res: Response, next: NextFunction) => {
  // Capture response finish event for business logging
  res.on('finish', function() {
    // Log successful purchases/orders
    if (req.path.includes('/api/orders') && req.method === 'POST' && res.statusCode === 201) {
      Logger.business('Order created', {
        userId: (req as any).user?.id
      });
      // Order created event logged
    }

    // Log product views
    if (req.path.includes('/api/products/') && req.method === 'GET' && res.statusCode === 200) {
      Logger.business('Product viewed', {
        productType: req.path.includes('capsules') ? 'capsule' : 'machine',
        userId: (req as any).user?.id
      });
      // Product viewed event logged
    }

    // Log cart additions
    if (req.path.includes('/api/cart/add') && req.method === 'POST' && res.statusCode === 200) {
      Logger.business('Item added to cart', {
        userId: (req as any).user?.id || req.body?.sessionId
      });
      // Cart addition event logged
    }
  });

  next();
};

// Database operation logging
export const databaseLogger = {
  logFind: (collection: string, query: any, resultCount?: number) => {
    Logger.database('FIND', collection, {
      query: JSON.stringify(query),
      resultCount
    });
  },

  logInsert: (collection: string, document: any) => {
    Logger.database('INSERT', collection, {
      documentId: document._id || document.id,
      documentType: collection
    });
  },

  logUpdate: (collection: string, query: any, update: any) => {
    Logger.database('UPDATE', collection, {
      query: JSON.stringify(query),
      update: JSON.stringify(update)
    });
  },

  logDelete: (collection: string, query: any) => {
    Logger.database('DELETE', collection, {
      query: JSON.stringify(query)
    });
  }
};

