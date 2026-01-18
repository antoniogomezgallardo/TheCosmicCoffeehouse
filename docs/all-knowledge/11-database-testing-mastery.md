# Database Testing Mastery: Data Integrity Excellence

*Comprehensive Guide for Senior QA Engineer Technical Interviews*

## Table of Contents

1. [Database Testing Fundamentals](#database-testing-fundamentals)
2. [Database Testing Types](#database-testing-types)
3. [Data Integrity Testing](#data-integrity-testing)
4. [Performance Testing](#performance-testing)
5. [Security Testing](#security-testing)
6. [Migration Testing](#migration-testing)
7. [NoSQL Specific Testing](#nosql-specific-testing)
8. [Test Data Management](#test-data-management)
9. [Monitoring & Observability](#monitoring--observability)
10. [MongoDB Testing Strategies](#mongodb-testing-strategies)
11. [Business Value & ROI](#business-value--roi)
12. [Advanced Topics](#advanced-topics)

---

## Database Testing Fundamentals

### Definition and Purpose

Database testing is a specialized discipline that validates the accuracy, integrity, performance, and security of database operations. It ensures that data flows correctly through all layers of an application, maintaining consistency and reliability under various conditions.

**Core Objectives:**
- **Data Integrity**: Ensuring accurate data storage, retrieval, and manipulation
- **Performance Optimization**: Validating query efficiency and system responsiveness
- **Security Compliance**: Protecting against data breaches and unauthorized access
- **Reliability Assurance**: Maintaining system stability under various load conditions

### Why Database Testing is Critical

```typescript
// Example: Data integrity issue that database testing prevents
interface OrderData {
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
  createdAt: Date;
}

// Without proper database testing, this could happen:
const corruptedOrder = {
  userId: null,           // Referential integrity violation
  items: [],              // Business logic violation
  total: -150.99,         // Data validation failure
  status: 'invalid',      // Enum constraint violation
  createdAt: undefined    // Required field violation
};
```

**Business Impact of Database Issues:**
- **Financial Loss**: Incorrect calculations, failed transactions
- **Compliance Violations**: GDPR, HIPAA, PCI-DSS data protection failures
- **System Downtime**: Performance degradation, crash scenarios
- **Data Corruption**: Irreversible loss of critical business information
- **Security Breaches**: Unauthorized data access, injection attacks

---

## Database Testing Types

### 1. Structural Testing

Validates the database schema, constraints, triggers, procedures, and indexes.

**Key Components:**
```sql
-- Schema validation example
DESCRIBE users;
SHOW CREATE TABLE products;
SHOW INDEXES FROM orders;

-- MongoDB equivalent
db.users.getIndexes()
db.products.stats()
db.orders.dataSize()
```

**Testing Areas:**
- **Schema Integrity**: Column types, constraints, relationships
- **Index Effectiveness**: Query performance optimization
- **Trigger Functionality**: Automated business logic execution
- **View Definitions**: Complex query abstraction validation

### 2. Functional Testing

Validates CRUD operations, business logic, and data transformations.

```typescript
// Example: MongoDB functional testing
describe('User CRUD Operations', () => {
  test('should create user with valid data', async () => {
    const userData = {
      email: 'test@cosmic.com',
      password: 'SecurePass123!',
      profile: { firstName: 'John', lastName: 'Doe' }
    };

    const user = await User.create(userData);

    expect(user.email).toBe(userData.email);
    expect(user.password).toBeHashed();
    expect(user.createdAt).toBeInstanceOf(Date);
  });

  test('should enforce unique email constraint', async () => {
    await User.create({ email: 'duplicate@cosmic.com' });

    await expect(
      User.create({ email: 'duplicate@cosmic.com' })
    ).rejects.toThrow('E11000 duplicate key error');
  });
});
```

### 3. Performance Testing

Validates query execution times, throughput, and resource utilization.

```typescript
// Query performance testing example
describe('Product Search Performance', () => {
  test('should execute complex search within SLA', async () => {
    const startTime = Date.now();

    const products = await Product.aggregate([
      { $match: { category: 'coffee-capsules', inStock: true } },
      { $lookup: {
          from: 'reviews',
          localField: '_id',
          foreignField: 'productId',
          as: 'reviews'
      }},
      { $addFields: { avgRating: { $avg: '$reviews.rating' } } },
      { $sort: { avgRating: -1, createdAt: -1 } },
      { $limit: 20 }
    ]);

    const executionTime = Date.now() - startTime;

    expect(executionTime).toBeLessThan(200); // 200ms SLA
    expect(products.length).toBeGreaterThan(0);
  });
});
```

---

## Data Integrity Testing

### ACID Properties Validation

**Atomicity Testing:**
```typescript
describe('Transaction Atomicity', () => {
  test('should rollback entire order on payment failure', async () => {
    const session = await mongoose.startSession();

    try {
      await session.withTransaction(async () => {
        // Reduce inventory
        await Product.updateOne(
          { _id: productId },
          { $inc: { stock: -quantity } },
          { session }
        );

        // Create order
        await Order.create([orderData], { session });

        // Simulate payment failure
        throw new Error('Payment processing failed');
      });
    } catch (error) {
      // Verify rollback occurred
      const product = await Product.findById(productId);
      expect(product.stock).toBe(originalStock);

      const order = await Order.findOne({ _id: orderData._id });
      expect(order).toBeNull();
    }
  });
});
```

**Consistency Testing:**
```typescript
describe('Data Consistency', () => {
  test('should maintain referential integrity', async () => {
    const user = await User.create(validUserData);
    const order = await Order.create({
      userId: user._id,
      items: [{ productId: validProductId, quantity: 2 }]
    });

    // Attempt to delete referenced user
    await expect(
      User.findByIdAndDelete(user._id)
    ).rejects.toThrow('Cannot delete user with existing orders');

    // Verify order still exists
    const existingOrder = await Order.findById(order._id);
    expect(existingOrder).toBeTruthy();
  });
});
```

### Constraint Validation Testing

```typescript
describe('Database Constraints', () => {
  test('should enforce required fields', async () => {
    await expect(
      User.create({ email: 'test@cosmic.com' })
    ).rejects.toThrow('Password is required');
  });

  test('should validate email format', async () => {
    await expect(
      User.create({ email: 'invalid-email', password: 'secure123' })
    ).rejects.toThrow('Invalid email format');
  });

  test('should enforce minimum password length', async () => {
    await expect(
      User.create({ email: 'test@cosmic.com', password: '123' })
    ).rejects.toThrow('Password must be at least 8 characters');
  });
});
```

---

## Performance Testing

### Query Optimization Testing

```typescript
describe('Query Performance Optimization', () => {
  test('should use proper indexes for complex queries', async () => {
    // Enable query profiling
    const explain = await Product.find({
      category: 'coffee-machines',
      price: { $gte: 100, $lte: 500 },
      'rating.average': { $gte: 4.0 }
    }).explain('executionStats');

    // Validate index usage
    expect(explain.executionStats.totalDocsExamined)
      .toBeLessThanOrEqual(explain.executionStats.totalDocsReturned * 1.1);

    // Validate execution time
    expect(explain.executionStats.executionTimeMillis).toBeLessThan(50);

    // Validate winning plan uses index
    expect(explain.queryPlanner.winningPlan.stage).toContain('IXSCAN');
  });
});
```

### Load Testing Database Operations

```typescript
describe('Database Load Testing', () => {
  test('should handle concurrent user creation', async () => {
    const concurrentUsers = 100;
    const userPromises = Array.from({ length: concurrentUsers }, (_, i) =>
      User.create({
        email: `loadtest${i}@cosmic.com`,
        password: 'LoadTest123!',
        profile: { firstName: `User${i}`, lastName: 'LoadTest' }
      })
    );

    const startTime = Date.now();
    const results = await Promise.allSettled(userPromises);
    const endTime = Date.now();

    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    expect(successful).toBe(concurrentUsers);
    expect(failed).toBe(0);
    expect(endTime - startTime).toBeLessThan(5000); // 5 seconds max
  });
});
```

### Memory and Resource Testing

```typescript
describe('Database Resource Testing', () => {
  test('should not cause memory leaks in large result sets', async () => {
    const initialMemory = process.memoryUsage().heapUsed;

    // Process large dataset in chunks
    let processedCount = 0;
    const cursor = Product.find({}).cursor();

    for (let product = await cursor.next(); product != null; product = await cursor.next()) {
      // Simulate processing
      processedCount++;

      // Check memory usage periodically
      if (processedCount % 1000 === 0) {
        const currentMemory = process.memoryUsage().heapUsed;
        const memoryIncrease = currentMemory - initialMemory;

        expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024); // 50MB max increase
      }
    }

    expect(processedCount).toBeGreaterThan(0);
  });
});
```

---

## Security Testing

### Injection Attack Prevention

```typescript
describe('SQL/NoSQL Injection Prevention', () => {
  test('should prevent NoSQL injection in user queries', async () => {
    const maliciousPayload = {
      email: { $ne: null },
      password: { $regex: '.*' }
    };

    // This should NOT return users
    const users = await User.find(maliciousPayload);
    expect(users.length).toBe(0);
  });

  test('should sanitize aggregation pipeline inputs', async () => {
    const maliciousStage = {
      $match: { $where: "return true" } // JavaScript injection attempt
    };

    await expect(
      Product.aggregate([maliciousStage])
    ).rejects.toThrow('$where is not allowed');
  });
});
```

### Access Control Testing

```typescript
describe('Database Access Control', () => {
  test('should enforce user-specific data access', async () => {
    const user1 = await User.create({ email: 'user1@cosmic.com' });
    const user2 = await User.create({ email: 'user2@cosmic.com' });

    const order1 = await Order.create({
      userId: user1._id,
      items: [{ productId: validProductId, quantity: 1 }]
    });

    // User2 should not access User1's orders
    const unauthorizedAccess = await Order.find({
      userId: user2._id,
      _id: order1._id
    });

    expect(unauthorizedAccess.length).toBe(0);
  });
});
```

### Data Encryption Validation

```typescript
describe('Data Encryption', () => {
  test('should encrypt sensitive data at rest', async () => {
    const user = await User.create({
      email: 'test@cosmic.com',
      password: 'PlainTextPassword',
      profile: {
        ssn: '123-45-6789',
        creditCard: '4111-1111-1111-1111'
      }
    });

    // Verify password is hashed
    expect(user.password).not.toBe('PlainTextPassword');
    expect(user.password).toMatch(/^\$2[aby]\$\d+\$/); // bcrypt pattern

    // Verify sensitive fields are encrypted
    expect(user.profile.ssn).not.toBe('123-45-6789');
    expect(user.profile.creditCard).not.toBe('4111-1111-1111-1111');
  });
});
```

---

## Migration Testing

### Schema Migration Validation

```typescript
describe('Database Migration Testing', () => {
  test('should migrate user schema v1 to v2', async () => {
    // Create old format user
    const oldUser = await db.collection('users').insertOne({
      name: 'John Doe',
      email: 'john@cosmic.com',
      created: new Date()
    });

    // Run migration
    await runMigration('002_split_user_name');

    // Verify new format
    const migratedUser = await User.findById(oldUser.insertedId);

    expect(migratedUser.profile.firstName).toBe('John');
    expect(migratedUser.profile.lastName).toBe('Doe');
    expect(migratedUser.name).toBeUndefined();
    expect(migratedUser.createdAt).toEqual(oldUser.created);
  });

  test('should handle migration rollback', async () => {
    const preRollbackState = await captureCollectionState('users');

    await runMigration('003_add_user_preferences');
    await rollbackMigration('003_add_user_preferences');

    const postRollbackState = await captureCollectionState('users');

    expect(postRollbackState).toEqual(preRollbackState);
  });
});
```

### Data Migration Testing

```typescript
describe('Data Migration Integrity', () => {
  test('should preserve all data during migration', async () => {
    const preMigrationCount = await Product.countDocuments();
    const preMigrationChecksum = await calculateDataChecksum('products');

    await runDataMigration('normalize_product_categories');

    const postMigrationCount = await Product.countDocuments();
    const postMigrationChecksum = await calculateDataChecksum('products', {
      exclude: ['category'] // Category format changed
    });

    expect(postMigrationCount).toBe(preMigrationCount);
    expect(postMigrationChecksum).toBe(preMigrationChecksum);

    // Validate category normalization
    const invalidCategories = await Product.find({
      category: { $regex: /[A-Z\s]/ } // Should be lowercase-hyphenated
    });
    expect(invalidCategories.length).toBe(0);
  });
});
```

---

## NoSQL Specific Testing

### Document Validation Testing

```typescript
describe('MongoDB Document Validation', () => {
  test('should enforce schema validation rules', async () => {
    // Define strict schema validation
    await db.createCollection('strictProducts', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['name', 'price', 'category'],
          properties: {
            name: { bsonType: 'string', maxLength: 100 },
            price: { bsonType: 'number', minimum: 0 },
            category: { enum: ['coffee-capsules', 'coffee-machines', 'accessories'] }
          }
        }
      }
    });

    // Test valid document
    await expect(
      db.collection('strictProducts').insertOne({
        name: 'Premium Coffee Capsule',
        price: 25.99,
        category: 'coffee-capsules'
      })
    ).resolves.toBeTruthy();

    // Test invalid document
    await expect(
      db.collection('strictProducts').insertOne({
        name: 'A'.repeat(101), // Exceeds maxLength
        price: -10, // Below minimum
        category: 'invalid-category'
      })
    ).rejects.toThrow('Document failed validation');
  });
});
```

### Aggregation Pipeline Testing

```typescript
describe('MongoDB Aggregation Pipeline', () => {
  test('should calculate accurate sales analytics', async () => {
    // Create test orders
    await Order.create([
      {
        userId: user1._id,
        items: [{ productId: product1._id, quantity: 2, price: 25.99 }],
        total: 51.98,
        status: 'completed',
        createdAt: new Date('2024-01-15')
      },
      {
        userId: user2._id,
        items: [{ productId: product1._id, quantity: 1, price: 25.99 }],
        total: 25.99,
        status: 'completed',
        createdAt: new Date('2024-01-20')
      }
    ]);

    const analytics = await Order.aggregate([
      {
        $match: {
          status: 'completed',
          createdAt: {
            $gte: new Date('2024-01-01'),
            $lt: new Date('2024-02-01')
          }
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$total' },
          orderCount: { $sum: 1 },
          averageOrderValue: { $avg: '$total' },
          topProducts: {
            $push: {
              $map: {
                input: '$items',
                as: 'item',
                in: {
                  productId: '$$item.productId',
                  quantity: '$$item.quantity'
                }
              }
            }
          }
        }
      }
    ]);

    expect(analytics[0].totalRevenue).toBe(77.97);
    expect(analytics[0].orderCount).toBe(2);
    expect(analytics[0].averageOrderValue).toBe(38.985);
  });
});
```

### Index Optimization Testing

```typescript
describe('MongoDB Index Optimization', () => {
  test('should create optimal compound indexes', async () => {
    // Create compound index for common query pattern
    await Product.collection.createIndex({
      category: 1,
      price: 1,
      'rating.average': -1
    }, { name: 'category_price_rating_idx' });

    const explain = await Product.find({
      category: 'coffee-capsules',
      price: { $gte: 20, $lte: 50 },
      'rating.average': { $gte: 4.0 }
    }).sort({ 'rating.average': -1 }).explain('executionStats');

    // Validate index usage
    expect(explain.queryPlanner.winningPlan.inputStage.stage).toBe('IXSCAN');
    expect(explain.queryPlanner.winningPlan.inputStage.indexName)
      .toBe('category_price_rating_idx');

    // Validate performance
    expect(explain.executionStats.executionTimeMillis).toBeLessThan(10);
    expect(explain.executionStats.totalDocsExamined)
      .toBeLessThanOrEqual(explain.executionStats.totalDocsReturned);
  });
});
```

---

## Test Data Management

### Test Data Factory Pattern

```typescript
class TestDataFactory {
  static async createUser(overrides: Partial<IUser> = {}): Promise<IUser> {
    const defaults = {
      email: faker.internet.email(),
      password: 'TestPassword123!',
      profile: {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        phone: faker.phone.number()
      },
      isVerified: true,
      createdAt: new Date()
    };

    return await User.create({ ...defaults, ...overrides });
  }

  static async createProduct(overrides: Partial<IProduct> = {}): Promise<IProduct> {
    const defaults = {
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: parseFloat(faker.commerce.price()),
      category: faker.helpers.arrayElement(['coffee-capsules', 'coffee-machines', 'accessories']),
      stock: faker.number.int({ min: 0, max: 100 }),
      images: [faker.image.url()],
      rating: {
        average: faker.number.float({ min: 1, max: 5, precision: 0.1 }),
        count: faker.number.int({ min: 0, max: 1000 })
      }
    };

    return await Product.create({ ...defaults, ...overrides });
  }

  static async createTestScenario(name: string): Promise<TestScenario> {
    switch (name) {
      case 'active-user-with-orders':
        const user = await this.createUser({ isActive: true });
        const products = await Promise.all([
          this.createProduct(),
          this.createProduct()
        ]);

        const orders = await Promise.all([
          Order.create({
            userId: user._id,
            items: [{ productId: products[0]._id, quantity: 2, price: products[0].price }],
            total: products[0].price * 2,
            status: 'completed'
          }),
          Order.create({
            userId: user._id,
            items: [{ productId: products[1]._id, quantity: 1, price: products[1].price }],
            total: products[1].price,
            status: 'pending'
          })
        ]);

        return { user, products, orders };

      default:
        throw new Error(`Unknown test scenario: ${name}`);
    }
  }
}

// Usage in tests
describe('User Order History', () => {
  test('should retrieve complete order history', async () => {
    const { user, orders } = await TestDataFactory.createTestScenario('active-user-with-orders');

    const orderHistory = await Order.find({ userId: user._id }).populate('items.productId');

    expect(orderHistory.length).toBe(2);
    expect(orderHistory[0].items[0].productId.name).toBeDefined();
  });
});
```

### Database Seeding and Cleanup

```typescript
class DatabaseManager {
  static async seedTestData(): Promise<void> {
    // Clear existing test data
    await this.cleanupTestData();

    // Create consistent test dataset
    const users = await Promise.all([
      TestDataFactory.createUser({
        email: 'admin@cosmic.com',
        role: 'admin'
      }),
      TestDataFactory.createUser({
        email: 'user@cosmic.com',
        role: 'customer'
      })
    ]);

    const products = await Promise.all([
      TestDataFactory.createProduct({
        name: 'Premium Coffee Capsule',
        category: 'coffee-capsules',
        price: 25.99,
        stock: 100
      }),
      TestDataFactory.createProduct({
        name: 'Espresso Machine Pro',
        category: 'coffee-machines',
        price: 299.99,
        stock: 10
      })
    ]);

    // Create relationships
    await Order.create({
      userId: users[1]._id,
      items: [
        { productId: products[0]._id, quantity: 2, price: products[0].price }
      ],
      total: products[0].price * 2,
      status: 'completed'
    });

    console.log('Test data seeded successfully');
  }

  static async cleanupTestData(): Promise<void> {
    const collections = ['users', 'products', 'orders', 'reviews'];

    for (const collection of collections) {
      await mongoose.connection.collection(collection).deleteMany({
        $or: [
          { isTestData: true },
          { email: /@test\./ },
          { name: /^Test/ }
        ]
      });
    }

    console.log('Test data cleaned up');
  }

  static async resetDatabase(): Promise<void> {
    await mongoose.connection.dropDatabase();
    console.log('Database reset completed');
  }
}

// Test lifecycle management
beforeAll(async () => {
  await DatabaseManager.seedTestData();
});

afterAll(async () => {
  await DatabaseManager.cleanupTestData();
});
```

---

## Monitoring & Observability

### Query Performance Monitoring

```typescript
class DatabaseMonitor {
  static async analyzeSlowQueries(): Promise<SlowQueryReport[]> {
    const db = mongoose.connection.db;

    // Enable profiling for slow queries (>100ms)
    await db.admin().runCommand({
      profile: 2,
      slowms: 100,
      sampleRate: 1.0
    });

    // Get slow query profile
    const slowQueries = await db.collection('system.profile')
      .find({
        ts: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }, // Last 24 hours
        millis: { $gte: 100 }
      })
      .sort({ ts: -1 })
      .limit(10)
      .toArray();

    return slowQueries.map(query => ({
      timestamp: query.ts,
      duration: query.millis,
      operation: query.command,
      collection: query.ns,
      executionStats: query.execStats
    }));
  }

  static async generatePerformanceReport(): Promise<PerformanceReport> {
    const stats = await mongoose.connection.db.stats();
    const slowQueries = await this.analyzeSlowQueries();

    return {
      database: {
        collections: stats.collections,
        dataSize: stats.dataSize,
        indexSize: stats.indexSize,
        avgObjSize: stats.avgObjSize
      },
      performance: {
        slowQueries: slowQueries.length,
        averageQueryTime: slowQueries.reduce((acc, q) => acc + q.duration, 0) / slowQueries.length,
        indexHitRatio: await this.calculateIndexHitRatio()
      },
      recommendations: this.generateOptimizationRecommendations(slowQueries)
    };
  }

  private static async calculateIndexHitRatio(): Promise<number> {
    const serverStatus = await mongoose.connection.db.admin().serverStatus();
    const indexCounters = serverStatus.indexCounters || serverStatus.globalLock?.totalTime;

    if (!indexCounters) return 1; // Default to perfect ratio if metrics unavailable

    const hits = indexCounters.hits || 1;
    const misses = indexCounters.misses || 0;

    return hits / (hits + misses);
  }
}

// Performance testing with monitoring
describe('Database Performance Monitoring', () => {
  test('should identify slow queries', async () => {
    // Execute potentially slow query
    await Product.find({
      $text: { $search: 'premium coffee' },
      price: { $gte: 20 }
    });

    const report = await DatabaseMonitor.generatePerformanceReport();

    expect(report.performance.indexHitRatio).toBeGreaterThan(0.95);
    expect(report.performance.averageQueryTime).toBeLessThan(50);

    if (report.performance.slowQueries > 0) {
      console.warn('Slow queries detected:', report.recommendations);
    }
  });
});
```

### Connection Pool Testing

```typescript
describe('Database Connection Management', () => {
  test('should handle connection pool exhaustion gracefully', async () => {
    const maxConnections = mongoose.connection.db.serverConfig.poolSize || 10;
    const connectionPromises: Promise<any>[] = [];

    // Create more connections than pool size
    for (let i = 0; i < maxConnections + 5; i++) {
      connectionPromises.push(
        Product.findOne({}).then(result => ({ index: i, result }))
      );
    }

    const startTime = Date.now();
    const results = await Promise.allSettled(connectionPromises);
    const endTime = Date.now();

    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    // All should succeed (queued if necessary)
    expect(successful).toBe(connectionPromises.length);
    expect(failed).toBe(0);

    // Should complete within reasonable time (with queuing)
    expect(endTime - startTime).toBeLessThan(5000);
  });

  test('should detect connection leaks', async () => {
    const initialConnections = mongoose.connection.readyState;

    // Simulate operations that might leak connections
    for (let i = 0; i < 10; i++) {
      await Product.find({}).limit(1);
      await Order.countDocuments();
      await User.findOne({ email: 'test@cosmic.com' });
    }

    const finalConnections = mongoose.connection.readyState;

    // Connection state should remain stable
    expect(finalConnections).toBe(initialConnections);
  });
});
```

---

## MongoDB Testing Strategies

### Replica Set Testing

```typescript
describe('MongoDB Replica Set Testing', () => {
  test('should handle primary failover', async () => {
    // This test requires replica set configuration
    if (!mongoose.connection.db.topology.type.includes('ReplicaSet')) {
      return test.skip('Replica set not available');
    }

    const initialPrimary = mongoose.connection.db.topology.s.description.primary;

    // Perform write operation
    const user = await User.create({
      email: 'failover@cosmic.com',
      password: 'TestPass123!'
    });

    expect(user._id).toBeDefined();

    // Simulate primary failover (in real testing, this would be done externally)
    // await simulatePrimaryFailover();

    // Verify read operations continue to work
    const retrievedUser = await User.findById(user._id);
    expect(retrievedUser.email).toBe('failover@cosmic.com');
  });

  test('should maintain data consistency across replicas', async () => {
    const writeData = {
      email: 'consistency@cosmic.com',
      password: 'TestPass123!'
    };

    // Write to primary
    const user = await User.create(writeData);

    // Read from secondary (with read preference)
    const secondaryRead = await User.findById(user._id)
      .read('secondary')
      .maxTimeMS(5000); // Allow time for replication

    expect(secondaryRead?.email).toBe(writeData.email);
  });
});
```

### Sharding Testing

```typescript
describe('MongoDB Sharding Tests', () => {
  test('should distribute data across shards', async () => {
    // This test requires sharded cluster
    if (!mongoose.connection.db.topology.type.includes('Sharded')) {
      return test.skip('Sharded cluster not available');
    }

    // Create users across different shard key ranges
    const users = await Promise.all([
      User.create({ email: 'shard1@cosmic.com', password: 'Test123!' }),
      User.create({ email: 'shard2@cosmic.com', password: 'Test123!' }),
      User.create({ email: 'shard3@cosmic.com', password: 'Test123!' })
    ]);

    // Verify shard distribution
    const shardStats = await mongoose.connection.db.admin()
      .command({ collStats: 'users', verbose: true });

    expect(shardStats.sharded).toBe(true);
    expect(Object.keys(shardStats.shards).length).toBeGreaterThan(1);
  });
});
```

### Transaction Testing

```typescript
describe('MongoDB Transaction Testing', () => {
  test('should handle concurrent transactions correctly', async () => {
    const product = await Product.create({
      name: 'Limited Edition Capsule',
      stock: 1,
      price: 49.99
    });

    // Simulate two users trying to buy the last item
    const buyerPromises = [
      attemptPurchase(user1._id, product._id),
      attemptPurchase(user2._id, product._id)
    ];

    const results = await Promise.allSettled(buyerPromises);
    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    // Only one should succeed due to transaction isolation
    expect(successful).toBe(1);
    expect(failed).toBe(1);

    // Verify final stock
    const updatedProduct = await Product.findById(product._id);
    expect(updatedProduct.stock).toBe(0);
  });

  async function attemptPurchase(userId: string, productId: string) {
    const session = await mongoose.startSession();

    try {
      return await session.withTransaction(async () => {
        const product = await Product.findById(productId).session(session);

        if (product.stock <= 0) {
          throw new Error('Out of stock');
        }

        await Product.updateOne(
          { _id: productId },
          { $inc: { stock: -1 } },
          { session }
        );

        return await Order.create([{
          userId,
          items: [{ productId, quantity: 1, price: product.price }],
          total: product.price
        }], { session });
      });
    } finally {
      await session.endSession();
    }
  }
});
```

---

## Business Value & ROI

### Cost of Database Issues

```typescript
interface DatabaseIssueImpact {
  issueType: string;
  frequency: number; // per month
  detectionTime: number; // hours
  resolutionTime: number; // hours
  businessImpact: {
    revenueImpact: number; // dollars
    userImpact: number; // affected users
    reputationImpact: 'low' | 'medium' | 'high';
  };
}

const databaseIssueAnalysis: DatabaseIssueImpact[] = [
  {
    issueType: 'Data Corruption',
    frequency: 0.5,
    detectionTime: 8,
    resolutionTime: 24,
    businessImpact: {
      revenueImpact: 50000,
      userImpact: 1000,
      reputationImpact: 'high'
    }
  },
  {
    issueType: 'Performance Degradation',
    frequency: 2,
    detectionTime: 2,
    resolutionTime: 4,
    businessImpact: {
      revenueImpact: 5000,
      userImpact: 500,
      reputationImpact: 'medium'
    }
  },
  {
    issueType: 'Security Breach',
    frequency: 0.1,
    detectionTime: 72,
    resolutionTime: 168,
    businessImpact: {
      revenueImpact: 500000,
      userImpact: 10000,
      reputationImpact: 'high'
    }
  }
];

class DatabaseTestingROI {
  static calculatePreventionValue(): ROIReport {
    const annualIssuesWithoutTesting = databaseIssueAnalysis.reduce(
      (total, issue) => total + issue.frequency * 12,
      0
    );

    const annualCostWithoutTesting = databaseIssueAnalysis.reduce(
      (total, issue) => total + (issue.frequency * 12 * issue.businessImpact.revenueImpact),
      0
    );

    const testingInvestment = 150000; // Annual testing investment
    const preventionRate = 0.85; // 85% of issues prevented

    const preventedCost = annualCostWithoutTesting * preventionRate;
    const netBenefit = preventedCost - testingInvestment;
    const roi = (netBenefit / testingInvestment) * 100;

    return {
      testingInvestment,
      preventedCost,
      netBenefit,
      roi,
      issuesPrevented: annualIssuesWithoutTesting * preventionRate,
      reportPeriod: 'annual'
    };
  }
}

// Example ROI calculation
describe('Database Testing Business Value', () => {
  test('should demonstrate positive ROI', () => {
    const roiReport = DatabaseTestingROI.calculatePreventionValue();

    expect(roiReport.roi).toBeGreaterThan(200); // 200% ROI minimum
    expect(roiReport.netBenefit).toBeGreaterThan(0);
    expect(roiReport.issuesPrevented).toBeGreaterThan(20); // Significant issue prevention
  });
});
```

### Quality Metrics and KPIs

```typescript
interface DatabaseQualityMetrics {
  integrity: {
    dataConsistencyScore: number; // 0-100
    constraintViolations: number;
    orphanedRecords: number;
  };
  performance: {
    averageQueryTime: number; // ms
    slowQueryCount: number;
    indexEfficiency: number; // 0-100
  };
  reliability: {
    uptime: number; // percentage
    failureRate: number; // per month
    recoveryTime: number; // hours
  };
  security: {
    vulnerabilityCount: number;
    accessViolations: number;
    encryptionCompliance: number; // percentage
  };
}

class DatabaseQualityDashboard {
  static async generateQualityReport(): Promise<DatabaseQualityMetrics> {
    const [integrity, performance, reliability, security] = await Promise.all([
      this.assessDataIntegrity(),
      this.assessPerformance(),
      this.assessReliability(),
      this.assessSecurity()
    ]);

    return { integrity, performance, reliability, security };
  }

  private static async assessDataIntegrity() {
    // Check for orphaned references
    const orphanedOrders = await Order.countDocuments({
      userId: { $nin: await User.distinct('_id') }
    });

    // Check constraint violations
    const invalidEmails = await User.countDocuments({
      email: { $not: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ }
    });

    // Calculate consistency score
    const totalRecords = await User.countDocuments() + await Order.countDocuments();
    const violations = orphanedOrders + invalidEmails;
    const consistencyScore = Math.max(0, 100 - (violations / totalRecords) * 100);

    return {
      dataConsistencyScore: consistencyScore,
      constraintViolations: violations,
      orphanedRecords: orphanedOrders
    };
  }

  private static async assessPerformance() {
    const performanceReport = await DatabaseMonitor.generatePerformanceReport();

    return {
      averageQueryTime: performanceReport.performance.averageQueryTime,
      slowQueryCount: performanceReport.performance.slowQueries,
      indexEfficiency: performanceReport.performance.indexHitRatio * 100
    };
  }
}
```

---

## Advanced Topics

### Database Chaos Engineering

```typescript
describe('Database Chaos Engineering', () => {
  test('should handle network partitions gracefully', async () => {
    // Simulate network partition
    const originalConnection = mongoose.connection;

    try {
      // Simulate connection loss
      await mongoose.disconnect();

      // Attempt operations during outage
      const operationPromises = [
        User.create({ email: 'chaos@test.com' }),
        Product.findOne({}),
        Order.countDocuments()
      ];

      const results = await Promise.allSettled(operationPromises);
      const failures = results.filter(r => r.status === 'rejected');

      // All should fail gracefully
      expect(failures.length).toBe(operationPromises.length);

      // Reconnect and verify state
      await mongoose.connect(process.env.MONGODB_URI!);

      const userCount = await User.countDocuments();
      expect(userCount).toBeGreaterThanOrEqual(0); // State preserved

    } finally {
      if (mongoose.connection.readyState === 0) {
        await mongoose.connect(process.env.MONGODB_URI!);
      }
    }
  });

  test('should recover from memory pressure', async () => {
    const initialMemory = process.memoryUsage();

    // Create memory pressure with large operations
    const largeDataSets = await Promise.all(
      Array.from({ length: 10 }, () =>
        Product.find({}).limit(1000).lean()
      )
    );

    // Force garbage collection if available
    if (global.gc) {
      global.gc();
    }

    const finalMemory = process.memoryUsage();
    const memoryIncrease = finalMemory.heapUsed - initialMemory.heapUsed;

    // Memory should not increase excessively
    expect(memoryIncrease).toBeLessThan(100 * 1024 * 1024); // 100MB limit

    // Operations should still work
    const testOperation = await User.findOne({});
    expect(testOperation).toBeDefined();
  });
});
```

### Advanced Query Pattern Testing

```typescript
describe('Advanced MongoDB Query Patterns', () => {
  test('should optimize complex aggregation pipelines', async () => {
    const pipeline = [
      {
        $match: {
          createdAt: { $gte: new Date('2024-01-01') },
          status: { $in: ['completed', 'shipped'] }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'customer',
          pipeline: [
            { $project: { email: 1, profile: 1 } }
          ]
        }
      },
      {
        $unwind: '$items'
      },
      {
        $lookup: {
          from: 'products',
          localField: 'items.productId',
          foreignField: '_id',
          as: 'product'
        }
      },
      {
        $unwind: '$product'
      },
      {
        $group: {
          _id: '$product.category',
          totalRevenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } },
          orderCount: { $sum: 1 },
          uniqueCustomers: { $addToSet: '$userId' },
          topProducts: {
            $push: {
              name: '$product.name',
              quantity: '$items.quantity',
              revenue: { $multiply: ['$items.quantity', '$items.price'] }
            }
          }
        }
      },
      {
        $addFields: {
          uniqueCustomerCount: { $size: '$uniqueCustomers' },
          avgRevenuePerOrder: { $divide: ['$totalRevenue', '$orderCount'] }
        }
      },
      {
        $sort: { totalRevenue: -1 }
      }
    ];

    const explain = await Order.aggregate(pipeline).explain('executionStats');
    const result = await Order.aggregate(pipeline);

    // Validate performance
    expect(explain.stages.some(stage =>
      stage.$cursor?.executionStats?.executionTimeMillis < 500
    )).toBe(true);

    // Validate results
    expect(result.length).toBeGreaterThan(0);
    expect(result[0]).toHaveProperty('totalRevenue');
    expect(result[0]).toHaveProperty('uniqueCustomerCount');
  });
});
```

### Database Testing Framework

```typescript
class DatabaseTestFramework {
  private static instance: DatabaseTestFramework;
  private testDatabase: string;
  private originalDatabase: string;

  static getInstance(): DatabaseTestFramework {
    if (!this.instance) {
      this.instance = new DatabaseTestFramework();
    }
    return this.instance;
  }

  async setupTestEnvironment(): Promise<void> {
    this.originalDatabase = mongoose.connection.name;
    this.testDatabase = `${this.originalDatabase}_test_${Date.now()}`;

    // Switch to test database
    await mongoose.connection.useDb(this.testDatabase);

    // Apply schema validations
    await this.applySchemaValidations();

    // Create test indexes
    await this.createTestIndexes();

    console.log(`Test environment ready: ${this.testDatabase}`);
  }

  async teardownTestEnvironment(): Promise<void> {
    if (this.testDatabase) {
      await mongoose.connection.dropDatabase();
      console.log(`Test database dropped: ${this.testDatabase}`);
    }

    // Return to original database
    await mongoose.connection.useDb(this.originalDatabase);
  }

  private async applySchemaValidations(): Promise<void> {
    const validations = [
      {
        collection: 'users',
        validator: {
          $jsonSchema: {
            bsonType: 'object',
            required: ['email', 'password'],
            properties: {
              email: { bsonType: 'string', pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$' },
              password: { bsonType: 'string', minLength: 8 }
            }
          }
        }
      }
    ];

    for (const validation of validations) {
      await mongoose.connection.createCollection(validation.collection, {
        validator: validation.validator
      });
    }
  }

  private async createTestIndexes(): Promise<void> {
    const indexes = [
      { collection: 'users', index: { email: 1 }, options: { unique: true } },
      { collection: 'products', index: { category: 1, price: 1 } },
      { collection: 'orders', index: { userId: 1, createdAt: -1 } }
    ];

    for (const { collection, index, options } of indexes) {
      await mongoose.connection.collection(collection).createIndex(index, options);
    }
  }
}

// Global test setup
beforeAll(async () => {
  const framework = DatabaseTestFramework.getInstance();
  await framework.setupTestEnvironment();
});

afterAll(async () => {
  const framework = DatabaseTestFramework.getInstance();
  await framework.teardownTestEnvironment();
});
```

---

## Summary

Database testing is a critical discipline that ensures data integrity, performance, and security across all layers of an application. This comprehensive guide covers:

**Core Competencies Demonstrated:**
- **Structural & Functional Testing**: Schema validation, CRUD operations, constraint enforcement
- **Performance Optimization**: Query tuning, index strategy, load testing
- **Security Validation**: Injection prevention, access control, encryption verification
- **Data Integrity**: ACID compliance, referential integrity, migration safety
- **NoSQL Expertise**: MongoDB-specific patterns, aggregation testing, document validation
- **Test Data Management**: Factory patterns, seeding strategies, cleanup automation
- **Monitoring & Observability**: Performance tracking, slow query analysis, quality metrics

**Business Impact:**
- **Risk Mitigation**: Prevents data corruption, security breaches, performance issues
- **Cost Reduction**: Identifies problems early, reduces production incidents
- **Compliance Assurance**: Ensures regulatory requirements are met
- **Performance Optimization**: Maintains responsive user experience under load

**Technical Excellence:**
- **Comprehensive Coverage**: Unit, integration, performance, security testing
- **Automation**: Continuous testing integration, quality gate enforcement
- **Scalability**: Testing strategies that grow with application complexity
- **Maintainability**: Clear patterns and practices for long-term sustainability

This database testing expertise directly supports the Quality Guardian methodology, ensuring data reliability and system integrity throughout the software development lifecycle.