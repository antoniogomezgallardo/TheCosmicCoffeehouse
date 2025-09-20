import promClient from 'prom-client';

export class PrometheusMetrics {
  private static instance: PrometheusMetrics;
  private register: promClient.Registry;

  // HTTP metrics
  private httpRequestDuration!: promClient.Histogram<string>;
  private httpRequestsTotal!: promClient.Counter<string>;
  private httpRequestSizeBytes!: promClient.Histogram<string>;
  private httpResponseSizeBytes!: promClient.Histogram<string>;

  // Business metrics
  private ordersTotal!: promClient.Counter<string>;
  private productViewsTotal!: promClient.Counter<string>;
  private cartAdditionsTotal!: promClient.Counter<string>;
  private userRegistrationsTotal!: promClient.Counter<string>;
  private authenticationAttemptsTotal!: promClient.Counter<string>;

  // Application metrics
  private activeSessions!: promClient.Gauge<string>;
  private databaseConnectionsActive!: promClient.Gauge<string>;
  private errorRateTotal!: promClient.Counter<string>;

  // Performance metrics
  private databaseQueryDuration!: promClient.Histogram<string>;
  private cpuUsage!: promClient.Gauge<string>;
  private memoryUsage!: promClient.Gauge<string>;

  private constructor() {
    this.register = new promClient.Registry();

    // Add default metrics (CPU, memory, etc.)
    promClient.collectDefaultMetrics({ register: this.register });

    this.initializeMetrics();
  }

  public static getInstance(): PrometheusMetrics {
    if (!PrometheusMetrics.instance) {
      PrometheusMetrics.instance = new PrometheusMetrics();
    }
    return PrometheusMetrics.instance;
  }

  private initializeMetrics() {
    // HTTP Request Duration
    this.httpRequestDuration = new promClient.Histogram({
      name: 'http_request_duration_seconds',
      help: 'Duration of HTTP requests in seconds',
      labelNames: ['method', 'route', 'status_code'],
      buckets: [0.001, 0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
      registers: [this.register]
    });

    // HTTP Requests Total
    this.httpRequestsTotal = new promClient.Counter({
      name: 'http_requests_total',
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'route', 'status_code'],
      registers: [this.register]
    });

    // HTTP Request Size
    this.httpRequestSizeBytes = new promClient.Histogram({
      name: 'http_request_size_bytes',
      help: 'Size of HTTP requests in bytes',
      labelNames: ['method', 'route'],
      buckets: [1, 100, 1000, 10000, 100000, 1000000],
      registers: [this.register]
    });

    // HTTP Response Size
    this.httpResponseSizeBytes = new promClient.Histogram({
      name: 'http_response_size_bytes',
      help: 'Size of HTTP responses in bytes',
      labelNames: ['method', 'route'],
      buckets: [1, 100, 1000, 10000, 100000, 1000000],
      registers: [this.register]
    });

    // Business Metrics
    this.ordersTotal = new promClient.Counter({
      name: 'cosmic_coffeehouse_orders_total',
      help: 'Total number of orders created',
      labelNames: ['product_type', 'user_type'],
      registers: [this.register]
    });

    this.productViewsTotal = new promClient.Counter({
      name: 'cosmic_coffeehouse_product_views_total',
      help: 'Total number of product views',
      labelNames: ['product_type', 'product_id'],
      registers: [this.register]
    });

    this.cartAdditionsTotal = new promClient.Counter({
      name: 'cosmic_coffeehouse_cart_additions_total',
      help: 'Total number of items added to cart',
      labelNames: ['product_type', 'user_type'],
      registers: [this.register]
    });

    this.userRegistrationsTotal = new promClient.Counter({
      name: 'cosmic_coffeehouse_user_registrations_total',
      help: 'Total number of user registrations',
      registers: [this.register]
    });

    this.authenticationAttemptsTotal = new promClient.Counter({
      name: 'cosmic_coffeehouse_auth_attempts_total',
      help: 'Total number of authentication attempts',
      labelNames: ['method', 'status'],
      registers: [this.register]
    });

    // Application Metrics
    this.activeSessions = new promClient.Gauge({
      name: 'cosmic_coffeehouse_active_sessions',
      help: 'Number of active user sessions',
      registers: [this.register]
    });

    this.databaseConnectionsActive = new promClient.Gauge({
      name: 'cosmic_coffeehouse_database_connections_active',
      help: 'Number of active database connections',
      registers: [this.register]
    });

    this.errorRateTotal = new promClient.Counter({
      name: 'cosmic_coffeehouse_errors_total',
      help: 'Total number of application errors',
      labelNames: ['error_type', 'severity'],
      registers: [this.register]
    });

    // Performance Metrics
    this.databaseQueryDuration = new promClient.Histogram({
      name: 'cosmic_coffeehouse_database_query_duration_seconds',
      help: 'Duration of database queries in seconds',
      labelNames: ['operation', 'collection'],
      buckets: [0.001, 0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2, 5],
      registers: [this.register]
    });

    this.cpuUsage = new promClient.Gauge({
      name: 'cosmic_coffeehouse_cpu_usage_percent',
      help: 'Current CPU usage percentage',
      registers: [this.register]
    });

    this.memoryUsage = new promClient.Gauge({
      name: 'cosmic_coffeehouse_memory_usage_bytes',
      help: 'Current memory usage in bytes',
      registers: [this.register]
    });
  }

  // HTTP Metrics Methods
  public recordHttpRequest(method: string, route: string, statusCode: number, duration: number, requestSize?: number, responseSize?: number) {
    const labels = { method, route, status_code: statusCode.toString() };

    this.httpRequestDuration.observe(labels, duration / 1000); // Convert ms to seconds
    this.httpRequestsTotal.inc(labels);

    if (requestSize) {
      this.httpRequestSizeBytes.observe({ method, route }, requestSize);
    }

    if (responseSize) {
      this.httpResponseSizeBytes.observe({ method, route }, responseSize);
    }
  }

  // Business Metrics Methods
  public recordOrder(productType: string, userType: string = 'registered') {
    this.ordersTotal.inc({ product_type: productType, user_type: userType });
  }

  public recordProductView(productType: string, productId: string) {
    this.productViewsTotal.inc({ product_type: productType, product_id: productId });
  }

  public recordCartAddition(productType: string, userType: string = 'registered') {
    this.cartAdditionsTotal.inc({ product_type: productType, user_type: userType });
  }

  public recordUserRegistration() {
    this.userRegistrationsTotal.inc();
  }

  public recordAuthenticationAttempt(method: string, status: string) {
    this.authenticationAttemptsTotal.inc({ method, status });
  }

  // Application Metrics Methods
  public setActiveSessions(count: number) {
    this.activeSessions.set(count);
  }

  public setDatabaseConnections(count: number) {
    this.databaseConnectionsActive.set(count);
  }

  public recordError(errorType: string, severity: string) {
    this.errorRateTotal.inc({ error_type: errorType, severity });
  }

  // Performance Metrics Methods
  public recordDatabaseQuery(operation: string, collection: string, duration: number) {
    this.databaseQueryDuration.observe({ operation, collection }, duration / 1000);
  }

  public updateSystemMetrics() {
    // Update CPU and memory usage
    const usage = process.cpuUsage();
    const memUsage = process.memoryUsage();

    this.cpuUsage.set((usage.user + usage.system) / 1000000); // Convert to percentage
    this.memoryUsage.set(memUsage.heapUsed);
  }

  // Registry access
  public getRegistry(): promClient.Registry {
    return this.register;
  }

  public async getMetrics(): Promise<string> {
    this.updateSystemMetrics();
    return this.register.metrics();
  }

  // Reset metrics (useful for testing)
  public reset() {
    this.register.clear();
    this.initializeMetrics();
  }
}

export const metrics = PrometheusMetrics.getInstance();