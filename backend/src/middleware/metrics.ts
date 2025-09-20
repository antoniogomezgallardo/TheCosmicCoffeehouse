import { Request, Response, NextFunction } from 'express';
import { metrics } from '../metrics/prometheus';

export const metricsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();
  const originalSend = res.send;

  // Override res.send to capture response size
  res.send = function(this: Response, data: any) {
    const responseSize = Buffer.byteLength(JSON.stringify(data), 'utf8');

    // Store response size for later use
    (res as any).responseSize = responseSize;

    return originalSend.call(this, data);
  };

  // Capture when response finishes
  res.on('finish', function() {
    const duration = Date.now() - startTime;
    const route = req.route?.path || req.path;
    const requestSize = req.get('content-length') ? parseInt(req.get('content-length')!) : 0;
    const responseSize = (res as any).responseSize || 0;

    // Record HTTP metrics
    metrics.recordHttpRequest(
      req.method,
      route,
      res.statusCode,
      duration,
      requestSize,
      responseSize
    );

    // Record business metrics based on endpoints
    recordBusinessMetrics(req, res);

    // Record errors
    if (res.statusCode >= 400) {
      const errorType = res.statusCode >= 500 ? 'server_error' : 'client_error';
      const severity = res.statusCode >= 500 ? 'high' : 'medium';
      metrics.recordError(errorType, severity);
    }
  });

  next();
};

function recordBusinessMetrics(req: Request, res: Response) {
  const userType = (req as any).user ? 'registered' : 'guest';

  // Order creation
  if (req.path.includes('/api/orders') && req.method === 'POST' && res.statusCode === 201) {
    // Extract product type from request body if available
    const productType = req.body?.items?.[0]?.type || 'unknown';
    metrics.recordOrder(productType, userType);
  }

  // Product views
  if (req.path.includes('/api/products/') && req.method === 'GET' && res.statusCode === 200) {
    const productType = req.path.includes('capsules') ? 'capsule' :
                       req.path.includes('machines') ? 'machine' : 'unknown';
    const productId = req.params.id || 'list';
    metrics.recordProductView(productType, productId);
  }

  // Cart additions
  if (req.path.includes('/api/cart/add') && req.method === 'POST' && res.statusCode === 200) {
    const productType = req.body?.type || 'unknown';
    metrics.recordCartAddition(productType, userType);
  }

  // User registrations
  if (req.path.includes('/api/auth/register') && req.method === 'POST' && res.statusCode === 201) {
    metrics.recordUserRegistration();
  }

  // Authentication attempts
  if (req.path.includes('/api/auth/login') && req.method === 'POST') {
    const status = res.statusCode === 200 ? 'success' : 'failure';
    metrics.recordAuthenticationAttempt('login', status);
  }
}

// Middleware to expose metrics endpoint
export const metricsEndpoint = async (req: Request, res: Response) => {
  try {
    const metricsData = await metrics.getMetrics();
    res.set('Content-Type', 'text/plain');
    res.send(metricsData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to collect metrics' });
  }
};