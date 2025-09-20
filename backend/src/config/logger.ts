import winston from 'winston';
import path from 'path';

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define colors for different log levels
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'cyan',
};

// Tell winston to use our custom colors
winston.addColors(colors);

// Define log format
const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`,
  ),
);

// Define transports
const transports = [
  // Console transport for development
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize({ all: true }),
      winston.format.simple()
    )
  }),

  // File transport for errors
  new winston.transports.File({
    filename: path.join(process.cwd(), 'logs', 'error.log'),
    level: 'error',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
    maxsize: 5242880, // 5MB
    maxFiles: 5,
  }),

  // File transport for all logs
  new winston.transports.File({
    filename: path.join(process.cwd(), 'logs', 'combined.log'),
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
    maxsize: 5242880, // 5MB
    maxFiles: 5,
  }),

  // File transport for HTTP requests
  new winston.transports.File({
    filename: path.join(process.cwd(), 'logs', 'access.log'),
    level: 'http',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
    maxsize: 5242880, // 5MB
    maxFiles: 5,
  }),
];

// Create logger instance
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  levels,
  format,
  transports,
  exitOnError: false,
});

// Create logs directory if it doesn't exist
import fs from 'fs';
const logDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Enhanced logging methods
export const Logger = {
  error: (message: string, meta?: any) => {
    logger.error(message, meta);
  },

  warn: (message: string, meta?: any) => {
    logger.warn(message, meta);
  },

  info: (message: string, meta?: any) => {
    logger.info(message, meta);
  },

  http: (message: string, meta?: any) => {
    logger.http(message, meta);
  },

  debug: (message: string, meta?: any) => {
    logger.debug(message, meta);
  },

  // Specialized logging methods for QA observability
  auth: (action: string, userId?: string, meta?: any) => {
    logger.info(`🔐 AUTH: ${action}`, {
      category: 'authentication',
      userId,
      timestamp: new Date().toISOString(),
      ...meta
    });
  },

  api: (method: string, endpoint: string, statusCode: number, responseTime: number, meta?: any) => {
    logger.http(`🌐 API: ${method} ${endpoint} - ${statusCode} (${responseTime}ms)`, {
      category: 'api',
      method,
      endpoint,
      statusCode,
      responseTime,
      timestamp: new Date().toISOString(),
      ...meta
    });
  },

  database: (operation: string, collection: string, meta?: any) => {
    logger.info(`🗃️ DB: ${operation} on ${collection}`, {
      category: 'database',
      operation,
      collection,
      timestamp: new Date().toISOString(),
      ...meta
    });
  },

  security: (event: string, severity: 'low' | 'medium' | 'high' | 'critical', meta?: any) => {
    const level = severity === 'critical' || severity === 'high' ? 'error' : 'warn';
    logger[level](`🛡️ SECURITY [${severity.toUpperCase()}]: ${event}`, {
      category: 'security',
      severity,
      timestamp: new Date().toISOString(),
      ...meta
    });
  },

  performance: (metric: string, value: number, unit: string, meta?: any) => {
    logger.info(`📊 PERF: ${metric} = ${value}${unit}`, {
      category: 'performance',
      metric,
      value,
      unit,
      timestamp: new Date().toISOString(),
      ...meta
    });
  },

  business: (event: string, meta?: any) => {
    logger.info(`💼 BUSINESS: ${event}`, {
      category: 'business',
      timestamp: new Date().toISOString(),
      ...meta
    });
  }
};

export default logger;