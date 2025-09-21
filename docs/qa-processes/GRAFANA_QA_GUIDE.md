# 📊 Grafana for QA Engineers: Complete Practical Guide

## Table of Contents
1. [Introduction: Why QA Needs Grafana](#introduction-why-qa-needs-grafana)
2. [Quick Start for QA Engineers](#quick-start-for-qa-engineers)
3. [5 Essential QA Workflows](#5-essential-qa-workflows)
4. [QA-Specific Queries Cheat Sheet](#qa-specific-queries-cheat-sheet)
5. [Creating QA Dashboards](#creating-qa-dashboards)
6. [Troubleshooting & Best Practices](#troubleshooting--best-practices)

---

## Introduction: Why QA Needs Grafana

### What is Grafana?
Grafana is a visualization and monitoring platform that helps QA engineers:
- **See what users experience** in real-time
- **Validate test results** with production metrics
- **Identify issues** before they become critical
- **Prove quality improvements** with data

### Key Concepts for QA
- **Dashboard**: Visual display of metrics (your monitoring cockpit)
- **Panel**: Individual chart/graph within a dashboard
- **Query**: Question you ask the data (e.g., "How many errors in last hour?")
- **Alert**: Automatic notification when metrics exceed thresholds
- **Time Range**: Period you're analyzing (last 5 min, 1 hour, 7 days, etc.)

---

## Quick Start for QA Engineers

### 🚀 Access Grafana (The Cosmic Coffeehouse)
```bash
# 1. Start monitoring stack
docker-compose up prometheus grafana -d

# 2. Open browser
http://localhost:3002

# 3. Login
Username: admin
Password: admin
```

### 🎯 First Things to Check
1. **Navigate to Dashboards** → Click "Dashboards" in left menu
2. **Open API Dashboard** → "The Cosmic Coffeehouse API Dashboard"
3. **Set Time Range** → Top right, select "Last 1 hour"
4. **Auto-refresh** → Click refresh icon, select "5s"

### 🔥 QUICK GUIDE: How to See Recent API Calls

#### Want to see the last API calls made? Here's the fastest way:

**Method 1: Use Explore Tab (Easiest)**
```
1. Click "Explore" (compass icon) in left menu
2. Make sure "Prometheus" is selected as data source
3. Paste this query:
   increase(http_requests_total[5m])
4. Click "Run query"
5. Change view from "Graph" to "Table"
6. You'll see: Endpoint, Method, Status Code, Count
```

**Method 2: Create Quick Panel**
```
1. In any dashboard, click "Add panel"
2. Choose "Table" as visualization
3. Paste this query:
   topk(20, increase(http_requests_total[5m])) by (method, route, status_code)
4. Apply → Save
```

**Method 3: View Raw Logs (Outside Grafana)**
```bash
# See live API calls as they happen
docker logs cosmic-backend --follow | grep "GET\|POST\|PUT\|DELETE"

# See last 50 API calls
docker logs cosmic-backend --tail 50
```

**What you WON'T see in Grafana (by default):**
- Request body/payload
- Response data
- User session details
- Actual log messages

**What you WILL see in Grafana:**
- Which endpoints were called
- HTTP methods used
- Response status codes
- Response times
- Error counts
- Request frequency

---

## 5 Essential QA Workflows

### Workflow 1: Performance Testing Validation
**Scenario**: You're running performance tests and need to validate results

#### Steps:
1. **Before Test Execution**
   ```
   Dashboard → Time Range → Custom → Set start time
   Note the baseline metrics:
   - Average response time
   - Requests per second
   - Error rate
   ```

2. **During Test Execution**
   - Watch Panel: "Response Time (95th percentile)"
   - Query to add:
   ```promql
   histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[1m])) * 1000
   ```

3. **Key Metrics to Monitor**
   | Metric | Acceptable | Warning | Critical |
   |--------|-----------|---------|----------|
   | Response Time (95th) | <200ms | 200-500ms | >500ms |
   | Error Rate | <1% | 1-5% | >5% |
   | CPU Usage | <50% | 50-80% | >80% |
   | Memory Growth | <10MB/min | 10-50MB/min | >50MB/min |

4. **Generate Report**
   - Click Share → Export → Save as PDF
   - Include time range of test execution

#### Example Query for Performance Test:
```promql
# API endpoints response time during load test
avg by (route) (
  rate(http_request_duration_seconds_sum[5m])
  /
  rate(http_request_duration_seconds_count[5m])
) * 1000
```

---

### Workflow 2: Load Test Monitoring
**Scenario**: Running load test with 1000 concurrent users

#### Pre-Test Setup:
1. **Create Load Test Dashboard**
   ```
   Dashboards → New → New Dashboard
   Name: "Load Test - [Date]"
   ```

2. **Add Essential Panels**:

   **Panel 1: Requests Per Second**
   ```promql
   sum(rate(http_requests_total[30s]))
   ```

   **Panel 2: Response Time Distribution**
   ```promql
   histogram_quantile(0.5, rate(http_request_duration_seconds_bucket[30s])) * 1000
   histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[30s])) * 1000
   histogram_quantile(0.99, rate(http_request_duration_seconds_bucket[30s])) * 1000
   ```

   **Panel 3: Error Rate**
   ```promql
   sum(rate(http_requests_total{status_code=~"5.."}[30s]))
   /
   sum(rate(http_requests_total[30s])) * 100
   ```

   **Panel 4: Active Users/Sessions**
   ```promql
   cosmic_coffeehouse_active_sessions
   ```

3. **During Load Test**:
   - Set refresh to "5s"
   - Watch for:
     - Sudden spike in response times
     - Error rate increases
     - Memory/CPU hitting limits
     - Database connection exhaustion

4. **Post-Test Analysis**:
   ```promql
   # Find breaking point - when errors started
   increase(http_requests_total{status_code=~"5.."}[1m])

   # Identify slowest endpoints under load
   topk(5,
     avg by (route) (
       rate(http_request_duration_seconds_sum[5m])
       /
       rate(http_request_duration_seconds_count[5m])
     )
   )
   ```

---

### Workflow 3: Error Investigation & Root Cause Analysis
**Scenario**: Users report intermittent errors

#### Investigation Steps:

1. **Find When Errors Started**
   ```promql
   # Error timeline
   sum(rate(cosmic_coffeehouse_errors_total[5m])) * 300
   ```
   - Look for patterns: specific times, regular intervals

2. **Identify Error Types**
   ```promql
   # Errors by type
   sum by (error_type) (
     rate(cosmic_coffeehouse_errors_total[1h])
   )
   ```

3. **Correlate with Other Metrics**
   ```promql
   # Check if errors correlate with high load
   sum(rate(http_requests_total[5m]))

   # Check if errors correlate with slow queries
   histogram_quantile(0.95,
     rate(cosmic_coffeehouse_database_query_duration_seconds_bucket[5m])
   )

   # Check memory issues during error spike
   process_resident_memory_bytes
   ```

4. **Find Affected Endpoints**
   ```promql
   # Which endpoints are failing
   sum by (route) (
     rate(http_requests_total{status_code=~"5.."}[5m])
   ) > 0
   ```

5. **User Impact Assessment**
   ```promql
   # How many users affected
   count(
     increase(http_requests_total{status_code=~"5.."}[1h]) > 0
   )

   # Failed transactions
   sum(increase(cosmic_coffeehouse_orders_total{status="failed"}[1h]))
   ```

#### Create Error Investigation Dashboard:
```yaml
Row 1: Error Overview
- Total errors (counter)
- Error rate (graph)
- Errors by type (pie chart)

Row 2: Impact Analysis
- Failed requests by endpoint (table)
- User sessions affected (stat)
- Failed business transactions (stat)

Row 3: System Health During Errors
- CPU usage (graph)
- Memory usage (graph)
- Database connections (graph)
```

---

### Workflow 4: Release Comparison & Regression Detection
**Scenario**: New release deployed, need to verify no regressions

#### Pre-Release Baseline:
1. **Capture Baseline Metrics** (1 week before release)
   ```promql
   # Save these values
   # Avg Response Time
   avg(rate(http_request_duration_seconds_sum[1d])/rate(http_request_duration_seconds_count[1d]))

   # Error Rate
   sum(rate(http_requests_total{status_code=~"5.."}[1d]))/sum(rate(http_requests_total[1d]))

   # Throughput
   sum(rate(http_requests_total[1d]))
   ```

2. **Post-Release Monitoring** (First 24 hours)

   **Create Release Comparison Dashboard**:
   ```promql
   # Response time comparison
   # Current (post-release)
   avg(rate(http_request_duration_seconds_sum[1h])/rate(http_request_duration_seconds_count[1h]))

   # Add annotation for release time
   ```

3. **Regression Checks**:
   ```promql
   # Performance regression (>20% slower)
   (
     avg(rate(http_request_duration_seconds_sum[1h])/rate(http_request_duration_seconds_count[1h]))
     /
     avg(rate(http_request_duration_seconds_sum[1h] offset 1w)/rate(http_request_duration_seconds_count[1h] offset 1w))
   ) > 1.2

   # Error rate regression
   (
     sum(rate(http_requests_total{status_code=~"5.."}[1h]))
     >
     sum(rate(http_requests_total{status_code=~"5.."} offset 1w[1h])) * 1.5
   )
   ```

4. **Business Metrics Comparison**:
   ```promql
   # Orders per hour - current vs last week
   sum(increase(cosmic_coffeehouse_orders_total[1h]))
   vs
   sum(increase(cosmic_coffeehouse_orders_total offset 1w[1h]))

   # Cart conversion rate
   sum(increase(cosmic_coffeehouse_orders_total[1h]))
   /
   sum(increase(cosmic_coffeehouse_cart_additions_total[1h]))
   ```

---

### Workflow 5: User Journey Health Monitoring
**Scenario**: Monitor critical user paths (Browse → Add to Cart → Checkout)

#### Setup User Journey Dashboard:

1. **Funnel Visualization**
   ```promql
   # Step 1: Product Views
   sum(increase(cosmic_coffeehouse_product_views_total[1h]))

   # Step 2: Cart Additions
   sum(increase(cosmic_coffeehouse_cart_additions_total[1h]))

   # Step 3: Checkout Started
   sum(increase(http_requests_total{route="/api/checkout"}[1h]))

   # Step 4: Orders Completed
   sum(increase(cosmic_coffeehouse_orders_total[1h]))
   ```

2. **Conversion Rates**
   ```promql
   # View to Cart conversion
   (sum(increase(cosmic_coffeehouse_cart_additions_total[1h]))
   /
   sum(increase(cosmic_coffeehouse_product_views_total[1h]))) * 100

   # Cart to Order conversion
   (sum(increase(cosmic_coffeehouse_orders_total[1h]))
   /
   sum(increase(cosmic_coffeehouse_cart_additions_total[1h]))) * 100
   ```

3. **Journey Performance**
   ```promql
   # Response time per journey step
   avg by (route) (
     rate(http_request_duration_seconds_sum{
       route=~"/api/products|/api/cart|/api/checkout|/api/orders"
     }[5m])
     /
     rate(http_request_duration_seconds_count{
       route=~"/api/products|/api/cart|/api/checkout|/api/orders"
     }[5m])
   ) * 1000
   ```

4. **Drop-off Analysis**
   ```promql
   # Where users abandon
   sum(increase(cosmic_coffeehouse_cart_additions_total[1h]))
   -
   sum(increase(cosmic_coffeehouse_orders_total[1h]))
   ```

---

## QA-Specific Queries Cheat Sheet

### 🔍 Viewing Recent API Calls and User Activity
```promql
# LAST API CALLS - Most Recent Requests (Last 5 minutes)
# This shows you exactly which endpoints were called
topk(20,
  increase(http_requests_total[5m]) > 0
) by (method, route, status_code)

# View specific user's recent activity (if user_id is tracked)
# Note: User tracking requires custom metric implementation
sum by (route, method) (
  increase(http_requests_total{user_id="specific_user"}[1h])
)

# Last 10 endpoints hit in order (most recent first)
sort_desc(
  increase(http_requests_total[1m])
) by (route, method, status_code)

# See exact timestamps of recent errors
# Go to Explore tab and run:
http_requests_total{status_code=~"4..|5.."}

# View recent API calls with response times
topk(50,
  avg by (method, route, status_code) (
    rate(http_request_duration_seconds_sum[5m])
    /
    rate(http_request_duration_seconds_count[5m])
  ) * 1000
)

# Activity timeline - requests per minute for last hour
sum by (route) (
  increase(http_requests_total[1m])
)[60m:1m]
```

### 📋 How to See Actual Logs in Grafana

**Important Note**: Grafana shows **metrics** (numbers/counts), not raw logs by default. For actual log lines, you need:

1. **Option A: Loki Integration** (Log Aggregation)
   ```yaml
   # If Loki is configured, use Explore tab:
   {job="cosmic-coffeehouse"} |= "error"
   {job="cosmic-coffeehouse"} |~ "user.*login"
   {job="cosmic-coffeehouse"} | json | user_id="12345"
   ```

2. **Option B: View Logs Outside Grafana**
   ```bash
   # Docker logs for recent API calls
   docker logs cosmic-backend --tail 100 --follow

   # Filter for specific user
   docker logs cosmic-backend 2>&1 | grep "user_id:12345"

   # See last 50 error logs
   docker logs cosmic-backend 2>&1 | grep -i error | tail -50
   ```

3. **Option C: Explore Tab for Metrics Details**
   ```
   1. Go to Explore (compass icon in left menu)
   2. Select Prometheus datasource
   3. Run: http_requests_total
   4. Switch to "Table" view
   5. You'll see: Time, Method, Route, Status Code, Value
   ```

### 🎯 Creating a "Recent API Calls" Dashboard Panel

**Step-by-Step Instructions:**

1. **Create New Panel for Last API Calls**
   ```
   Dashboard → Add Panel → Add New Panel
   ```

2. **Configure as Table Panel**
   ```yaml
   Panel Type: Table
   Title: Recent API Calls (Last 5 Minutes)
   ```

3. **Query for Recent Calls**
   ```promql
   # In Query box, enter:
   topk(20,
     sum by (method, route, status_code, __name__) (
       increase(http_requests_total[5m])
     )
   ) > 0
   ```

4. **Format the Table**
   ```
   Transform → Add transformation → Organize fields
   - Rename "route" to "Endpoint"
   - Rename "method" to "Method"
   - Rename "status_code" to "Status"
   - Rename "Value" to "Count"
   ```

5. **Sort by Time**
   ```
   Transform → Add transformation → Sort by
   - Field: Time
   - Order: Descending (newest first)
   ```

### 🔍 Performance Testing Queries
```promql
# Find slowest endpoints
topk(10, avg by (route) (rate(http_request_duration_seconds_sum[5m])/rate(http_request_duration_seconds_count[5m])))

# Response time by percentile
histogram_quantile(0.50, rate(http_request_duration_seconds_bucket[5m]))  # Median
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))  # 95th percentile
histogram_quantile(0.99, rate(http_request_duration_seconds_bucket[5m]))  # 99th percentile

# Requests per second by endpoint
sum by (route) (rate(http_requests_total[1m]))

# Average response time trend
avg(rate(http_request_duration_seconds_sum[5m])/rate(http_request_duration_seconds_count[5m]))
```

### 🐛 Error Detection Queries
```promql
# Error rate percentage
(sum(rate(http_requests_total{status_code=~"5.."}[5m]))/sum(rate(http_requests_total[5m]))) * 100

# Errors by endpoint
sum by (route, status_code) (rate(http_requests_total{status_code=~"4..|5.."}[5m]))

# Error spike detection
rate(cosmic_coffeehouse_errors_total[1m]) > 0.1

# Failed authentication attempts
sum(increase(cosmic_coffeehouse_auth_attempts_total{status="failed"}[1h]))
```

### 📊 Load Testing Queries
```promql
# Concurrent users/sessions
cosmic_coffeehouse_active_sessions

# Database connection saturation
cosmic_coffeehouse_database_connections_active / 100  # assuming 100 max connections

# Memory leak detection
rate(process_resident_memory_bytes[5m]) > 0  # positive rate = growing memory

# CPU saturation
rate(process_cpu_seconds_total[5m]) * 100
```

### 💼 Business Metrics Queries
```promql
# Hourly order rate
sum(increase(cosmic_coffeehouse_orders_total[1h]))

# Product popularity
topk(5, sum by (product_id) (increase(cosmic_coffeehouse_product_views_total[24h])))

# User registration trend
sum(increase(cosmic_coffeehouse_user_registrations_total[1d]))

# Revenue per hour (if price was tracked)
sum(increase(cosmic_coffeehouse_orders_total[1h])) * 25  # assuming $25 avg order
```

### 🔄 Comparison Queries
```promql
# Compare with yesterday
rate(http_requests_total[1h]) / rate(http_requests_total offset 1d[1h])

# Week-over-week comparison
sum(increase(cosmic_coffeehouse_orders_total[1d]))
/
sum(increase(cosmic_coffeehouse_orders_total offset 1w[1d]))

# Performance degradation check
avg(rate(http_request_duration_seconds_sum[1h])/rate(http_request_duration_seconds_count[1h]))
>
avg(rate(http_request_duration_seconds_sum offset 1h[1h])/rate(http_request_duration_seconds_count offset 1h[1h])) * 1.2
```

---

## Creating QA Dashboards

### Step-by-Step: Create a Test Execution Dashboard

1. **Navigate to Dashboards**
   ```
   Click + → Dashboard → Add new panel
   ```

2. **Panel 1: Test Status Overview**
   ```yaml
   Title: Current Test Status
   Type: Stat
   Query: sum(rate(http_requests_total[1m]))
   Unit: requests/sec
   Thresholds:
     - 0: green
     - 100: yellow
     - 500: red
   ```

3. **Panel 2: Error Trending**
   ```yaml
   Title: Error Rate Trend
   Type: Time series
   Query: sum(rate(http_requests_total{status_code=~"5.."}[1m]))
   Legend: Errors/sec
   Alert: When above 5 for 2 minutes
   ```

4. **Panel 3: Performance Baseline**
   ```yaml
   Title: Response Time vs Baseline
   Type: Time series
   Queries:
     - Current: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))
     - Baseline: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket offset 1d[5m]))
   ```

5. **Panel 4: Test Coverage**
   ```yaml
   Title: API Coverage
   Type: Table
   Query: sum by (route) (increase(http_requests_total[1h])) > 0
   Format: Table
   Columns: Endpoint, Hits, Last Tested
   ```

### Template Variables for Dynamic Dashboards

1. **Add Environment Variable**
   ```
   Settings → Variables → New
   Name: environment
   Type: Custom
   Values: dev, staging, production
   ```

2. **Add Time Range Variable**
   ```
   Name: test_duration
   Type: Interval
   Values: 5m,15m,1h,6h,24h
   ```

3. **Use in Queries**
   ```promql
   sum(rate(http_requests_total{environment="$environment"}[$test_duration]))
   ```

---

## Troubleshooting & Best Practices

### Common QA Scenarios & Solutions

#### Scenario: "Dashboard shows 'No Data'"
**Solutions:**
1. Check time range (data might be outside selected range)
2. Verify service is running: `curl http://localhost:3001/metrics`
3. Check Prometheus targets: http://localhost:9090/targets
4. Verify query syntax in panel edit mode

#### Scenario: "Need to correlate test failure with metrics"
**Solution:**
```promql
# Add annotation at test failure time
# Dashboard → Settings → Annotations → New
Query: cosmic_coffeehouse_errors_total
Title: Test Failure
Tags: test, failure
```

#### Scenario: "Performance looks different in test vs production"
**Solutions:**
1. Check data volume differences:
   ```promql
   sum(rate(http_requests_total[1h]))
   ```
2. Compare resource utilization:
   ```promql
   avg(rate(process_cpu_seconds_total[5m])) * 100
   ```
3. Check cache hit rates if applicable

### QA Best Practices with Grafana

#### 1. Before Test Execution
- [ ] Note baseline metrics
- [ ] Clear or mark dashboard
- [ ] Set appropriate time range
- [ ] Enable auto-refresh (5s or 10s)
- [ ] Create test-specific dashboard

#### 2. During Test Execution
- [ ] Watch real-time metrics
- [ ] Set up alerts for thresholds
- [ ] Take screenshots of anomalies
- [ ] Note exact timestamps of issues

#### 3. After Test Execution
- [ ] Export dashboard as PDF/PNG
- [ ] Save dashboard with test name/date
- [ ] Create annotations for key events
- [ ] Compare with previous test runs
- [ ] Generate metrics report

### Creating Alerts for QA

#### Alert 1: Performance Degradation
```yaml
Alert: Response Time Degradation
Query: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 0.5
For: 5 minutes
Severity: Warning
Message: "95th percentile response time exceeds 500ms"
```

#### Alert 2: Error Rate Spike
```yaml
Alert: High Error Rate
Query: sum(rate(http_requests_total{status_code=~"5.."}[1m])) > 5
For: 2 minutes
Severity: Critical
Message: "Error rate exceeds 5 requests/minute"
```

#### Alert 3: Memory Leak Detection
```yaml
Alert: Potential Memory Leak
Query: increase(process_resident_memory_bytes[1h]) > 100000000  # 100MB
For: 30 minutes
Severity: Warning
Message: "Memory increased by 100MB in last hour"
```

### Sharing Findings with Dev Team

#### 1. Export Evidence
```bash
# Screenshot specific panel
Panel → Menu → Share → Direct link rendered image

# Export entire dashboard
Dashboard → Share → Export → Save to file
```

#### 2. Create Issue Report Template
```markdown
## Performance Issue Report

**Test Type:** [Load Test/Regression/User Journey]
**Date/Time:** [Timestamp]
**Dashboard Link:** [Grafana URL]

### Metrics Summary
- Response Time (95th): [X ms]
- Error Rate: [X%]
- Throughput: [X req/sec]

### Evidence
[Grafana Screenshots]

### Query to Reproduce
\```promql
[Include exact Prometheus query]
\```

### Impact
- Affected Endpoints: [List]
- User Impact: [Number/Percentage]
- Business Impact: [Orders/Revenue]
```

---

## Quick Reference Card

### Essential URLs (The Cosmic Coffeehouse)
- **Grafana**: http://localhost:3002
- **Prometheus**: http://localhost:9090
- **Metrics Raw**: http://localhost:3001/metrics

### Key Keyboard Shortcuts
- `e` - Edit panel
- `v` - Toggle fullscreen
- `p + s` - Share panel
- `d + r` - Refresh dashboard
- `t + z` - Zoom out time range
- `ctrl + z` - Undo zoom

### Time Range Shortcuts
- `t + 5` - Last 5 minutes
- `t + 1` - Last 1 hour
- `t + 6` - Last 6 hours
- `t + 2` - Last 2 days
- `t + 7` - Last 7 days

### Essential Metrics for QA
| What to Monitor | Metric | Good | Warning | Bad |
|-----------------|--------|------|---------|-----|
| API Performance | `http_request_duration_seconds` | <200ms | 200-500ms | >500ms |
| Error Rate | `http_requests_total{status_code=~"5.."}` | <1% | 1-5% | >5% |
| Throughput | `http_requests_total` | Stable | ±20% | ±50% |
| Memory | `process_resident_memory_bytes` | Stable | Growing slowly | Rapid growth |
| CPU | `process_cpu_seconds_total` | <50% | 50-80% | >80% |

---

## Additional Resources

### Learning Path
1. **Week 1**: Master basic queries and navigation
2. **Week 2**: Create your first QA dashboard
3. **Week 3**: Set up alerts and notifications
4. **Week 4**: Advanced queries and correlations

### Useful Links
- [PromQL Basics](https://prometheus.io/docs/prometheus/latest/querying/basics/)
- [Grafana Panel Types](https://grafana.com/docs/grafana/latest/panels/panel-types/)
- [Alert Best Practices](https://grafana.com/docs/grafana/latest/alerting/fundamentals/)

### Pro Tips for QA Engineers
1. **Always compare**: Never look at metrics in isolation
2. **Baseline everything**: Know your normal before finding abnormal
3. **Correlate metrics**: Problems rarely affect just one metric
4. **Document anomalies**: Screenshot + timestamp + query
5. **Share dashboards**: Make your findings visible to the team

---

**Remember**: Grafana is your window into what's really happening in your application. Use it to validate your test results, prove issues exist, and demonstrate the impact of quality improvements.

**Last Updated**: January 2025
**Version**: 1.0
**For**: QA Engineers working with The Cosmic Coffeehouse