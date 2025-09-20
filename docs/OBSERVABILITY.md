# The Cosmic Coffeehouse - Observability Stack

## Overview

The Cosmic Coffeehouse employs a production-ready observability stack using **Prometheus** for metrics collection and **Grafana** for visualization and dashboards. This monitoring system provides comprehensive insights into application performance, business metrics, and system health.

### Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│                 │    │                 │    │                 │
│  Express API    │───▶│   Prometheus    │───▶│    Grafana      │
│  (Port 3001)    │    │  (Port 9090)    │    │  (Port 3002)    │
│                 │    │                 │    │                 │
│ /metrics        │    │ Scrapes every   │    │ Dashboards &    │
│ endpoint        │    │ 10 seconds      │    │ Visualization   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Key Benefits

**For Technical Teams:**
- Real-time performance monitoring
- Error rate tracking and alerting
- Resource utilization insights
- API response time analysis

**For Business Teams:**
- Customer behavior tracking
- Order and sales metrics
- Product engagement insights
- User registration trends

---

## Quick Start Guide

### 1. Start the Monitoring Stack

```bash
# Start Prometheus and Grafana services
docker-compose up prometheus grafana -d

# Verify services are running
docker ps | grep -E "(cosmic-prometheus|cosmic-grafana)"
```

### 2. Access the Tools

| Service | URL | Credentials |
|---------|-----|-------------|
| **Grafana Dashboard** | http://localhost:3002 | admin / admin |
| **Prometheus Web UI** | http://localhost:9090 | None |
| **API Metrics Endpoint** | http://localhost:3001/metrics | None |

### 3. Validate Setup

```bash
# Check if metrics are being collected
curl http://localhost:3001/metrics | grep cosmic_coffeehouse

# Verify Prometheus is scraping
# Go to http://localhost:9090/targets and check if "cosmic-coffeehouse-api" is UP
```

### 4. View Dashboard

1. Open Grafana at http://localhost:3002
2. Login with admin/admin
3. Navigate to **Dashboards** → **The Cosmic Coffeehouse API Dashboard**
4. You should see 6 panels with real-time metrics

---

## Metrics Catalog

### HTTP Performance Metrics

| Metric Name | Type | Description | Labels |
|-------------|------|-------------|--------|
| `http_request_duration_seconds` | Histogram | Time taken to process HTTP requests | method, route, status_code |
| `http_requests_total` | Counter | Total number of HTTP requests | method, route, status_code |
| `http_request_size_bytes` | Histogram | Size of HTTP request bodies | method, route |
| `http_response_size_bytes` | Histogram | Size of HTTP response bodies | method, route |

**Business Value:** Track API performance, identify slow endpoints, monitor traffic patterns.

### Business Metrics

| Metric Name | Type | Description | Labels |
|-------------|------|-------------|--------|
| `cosmic_coffeehouse_orders_total` | Counter | Total orders created | product_type, user_type |
| `cosmic_coffeehouse_product_views_total` | Counter | Product page views | product_type, product_id |
| `cosmic_coffeehouse_cart_additions_total` | Counter | Items added to cart | product_type, user_type |
| `cosmic_coffeehouse_user_registrations_total` | Counter | New user registrations | none |
| `cosmic_coffeehouse_auth_attempts_total` | Counter | Authentication attempts | method, status |

**Business Value:** Track conversion funnel, monitor product popularity, analyze user behavior.

### Application Health Metrics

| Metric Name | Type | Description | Labels |
|-------------|------|-------------|--------|
| `cosmic_coffeehouse_active_sessions` | Gauge | Current active user sessions | none |
| `cosmic_coffeehouse_database_connections_active` | Gauge | Active MongoDB connections | none |
| `cosmic_coffeehouse_errors_total` | Counter | Application errors | error_type, severity |
| `cosmic_coffeehouse_database_query_duration_seconds` | Histogram | Database query execution time | operation, collection |

**Business Value:** Ensure system reliability, detect issues early, plan capacity.

### System Performance Metrics

| Metric Name | Type | Description | Labels |
|-------------|------|-------------|--------|
| `process_cpu_seconds_total` | Counter | CPU time used by Node.js process | none |
| `process_resident_memory_bytes` | Gauge | Memory usage by Node.js process | none |
| `cosmic_coffeehouse_cpu_usage_percent` | Gauge | Current CPU usage percentage | none |
| `cosmic_coffeehouse_memory_usage_bytes` | Gauge | Current memory usage | none |

**Business Value:** Monitor resource consumption, plan infrastructure scaling.

---

## Dashboard Guide

### Panel 1: HTTP Requests per Second
- **Purpose:** Monitor API traffic in real-time
- **Query:** `rate(http_requests_total[5m])`
- **Interpretation:** Spikes indicate high traffic; drops may indicate issues

### Panel 2: Response Time (95th percentile)
- **Purpose:** Track API performance for most users
- **Query:** `histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) * 1000`
- **Interpretation:** Values >1000ms indicate performance issues

### Panel 3: Business Metrics
- **Purpose:** Monitor business KPIs
- **Queries:** Orders, product views, cart additions
- **Interpretation:** Track conversion funnel and business growth

### Panel 4: Error Rate
- **Purpose:** Monitor application stability
- **Query:** `rate(cosmic_coffeehouse_errors_total[5m]) * 60`
- **Interpretation:** >5 errors/minute requires investigation

### Panel 5: Memory Usage
- **Purpose:** Monitor resource consumption
- **Query:** `process_resident_memory_bytes`
- **Interpretation:** Consistent growth may indicate memory leaks

### Panel 6: CPU Usage
- **Purpose:** Monitor processing load
- **Query:** `rate(process_cpu_seconds_total[5m]) * 100`
- **Interpretation:** >80% sustained usage indicates need for scaling

---

## Configuration Reference

### Prometheus Configuration

**File:** `monitoring/prometheus.yml`

```yaml
# Key settings
scrape_interval: 15s        # How often to scrape metrics
scrape_configs:
  - job_name: 'cosmic-coffeehouse-api'
    static_configs:
      - targets: ['backend:3001']
    metrics_path: '/metrics'
    scrape_interval: 10s
```

### Grafana Configuration

**Datasource:** `monitoring/grafana/datasources/prometheus.yml`
```yaml
datasources:
  - name: Prometheus
    type: prometheus
    url: http://prometheus:9090
    isDefault: true
```

**Dashboard:** `monitoring/grafana/dashboards/cosmic-coffeehouse-api.json`
- Pre-configured with 6 panels
- 5-second refresh rate
- 1-hour time range by default

### Docker Compose Services

```yaml
prometheus:
  image: prom/prometheus:latest
  ports: ["9090:9090"]
  volumes: ["./monitoring/prometheus.yml:/etc/prometheus/prometheus.yml"]

grafana:
  image: grafana/grafana:latest
  ports: ["3002:3000"]
  environment: ["GF_SECURITY_ADMIN_PASSWORD=admin"]
```

---

## Development Guide

### Adding New Metrics

1. **Define the metric** in `backend/src/metrics/prometheus.ts`:

```typescript
private myNewMetric!: promClient.Counter<string>;

// In initializeMetrics()
this.myNewMetric = new promClient.Counter({
  name: 'cosmic_coffeehouse_my_new_metric_total',
  help: 'Description of what this measures',
  labelNames: ['label1', 'label2'],
  registers: [this.register]
});
```

2. **Add a method** to record the metric:

```typescript
public recordMyNewEvent(label1Value: string, label2Value: string) {
  this.myNewMetric.inc({ label1: label1Value, label2: label2Value });
}
```

3. **Use in your code**:

```typescript
import { metrics } from '../metrics/prometheus';

// In your route handler
metrics.recordMyNewEvent('value1', 'value2');
```

### Testing Metrics Locally

```bash
# 1. Start the backend
npm run dev:backend

# 2. Generate some traffic
curl http://localhost:3001/api/products

# 3. Check metrics
curl http://localhost:3001/metrics | grep cosmic_coffeehouse

# 4. Verify in Prometheus
# Go to http://localhost:9090 and query your metric
```

### Best Practices

1. **Metric Naming:**
   - Use `cosmic_coffeehouse_` prefix
   - Use descriptive names: `orders_total` not `orders`
   - Use underscores, not hyphens

2. **Labels:**
   - Keep cardinality low (< 100 unique values per label)
   - Use meaningful labels: `product_type`, `user_type`
   - Avoid user IDs or timestamps as labels

3. **Metric Types:**
   - **Counter:** For things that only increase (orders, errors)
   - **Gauge:** For things that go up/down (memory, active users)
   - **Histogram:** For measuring distributions (response time, request size)

---

## Troubleshooting

### Metrics Not Appearing

**Issue:** No custom metrics visible in Prometheus

**Solutions:**
1. Check if metrics endpoint is working:
   ```bash
   curl http://localhost:3001/metrics
   ```

2. Verify Prometheus is scraping:
   - Go to http://localhost:9090/targets
   - Check if "cosmic-coffeehouse-api" target is UP

3. Check server logs for errors:
   ```bash
   docker logs cosmic-backend
   ```

### Grafana Dashboard Empty

**Issue:** Dashboard panels show "No data"

**Solutions:**
1. Verify datasource connection:
   - Go to Configuration → Data Sources
   - Test Prometheus connection

2. Check query syntax in panel edit mode
3. Verify time range settings (last 1 hour)

### High Memory Usage

**Issue:** Node.js process consuming excessive memory

**Investigation:**
1. Check memory metrics in Grafana
2. Look for memory leaks:
   ```bash
   curl http://localhost:3001/metrics | grep memory
   ```

### Container Connection Issues

**Issue:** Prometheus can't reach backend service

**Solutions:**
1. Verify Docker network:
   ```bash
   docker network ls
   docker inspect cosmic-network
   ```

2. Check service names in docker-compose.yml
3. Ensure all services are on same network

---

## Future Enhancements

### Alerting Setup

**Recommended Alerts:**
- API response time > 2 seconds
- Error rate > 5 per minute
- Memory usage > 80%
- Order rate drops > 50% from baseline

**Implementation:**
1. Add alertmanager service to docker-compose.yml
2. Create alert rules in Prometheus
3. Configure notification channels (email, Slack)

### Additional Monitoring

**Tools to Consider:**
- **Jaeger/Zipkin:** Distributed tracing
- **ELK Stack:** Log aggregation and analysis
- **cAdvisor:** Container metrics
- **Node Exporter:** Server hardware metrics

### Scaling Considerations

**For Production:**
- Use Prometheus federation for multiple instances
- Implement long-term storage (Thanos, Cortex)
- Set up high availability Grafana
- Configure backup strategies for dashboards

---

## Support and Resources

### Internal Resources
- **API Documentation:** http://localhost:3001/api/docs
- **Health Check:** http://localhost:3001/health
- **Metrics Endpoint:** http://localhost:3001/metrics

### External Documentation
- [Prometheus Documentation](https://prometheus.io/docs/)
- [Grafana Documentation](https://grafana.com/docs/)
- [prom-client Library](https://github.com/siimon/prom-client)

### Getting Help
For issues with the observability stack:
1. Check this documentation first
2. Review server logs: `docker logs cosmic-backend`
3. Verify configuration files in `monitoring/` directory
4. Test individual components (API → Prometheus → Grafana)

---

**Last Updated:** January 2025
**Version:** 1.0
**Maintained by:** The Cosmic Coffeehouse Engineering Team