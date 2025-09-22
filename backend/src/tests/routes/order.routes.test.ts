import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import orderRoutes from '../../routes/order.routes';

// Create Express app for testing
const app = express();
app.use(express.json());
app.use('/api/orders', orderRoutes);

// MongoDB Memory Server instance
let mongoServer: MongoMemoryServer;

// Test data fixtures
const validOrderData = {
  userId: 'user_123',
  sessionId: 'session_456',
  items: [
    {
      product: {
        id: 'capsule_123',
        name: 'Cosmic Blend',
        price: 15.99
      },
      productType: 'capsule',
      quantity: 2
    },
    {
      product: {
        id: 'machine_456',
        name: 'Coffee Pro X1',
        price: 299.99
      },
      productType: 'machine',
      quantity: 1
    }
  ],
  total: 331.97,
  shippingAddress: {
    firstName: 'John',
    lastName: 'Doe',
    address: '123 Cosmic Street',
    city: 'New York',
    zipCode: '10001',
    country: 'USA'
  }
};

const guestOrderData = {
  sessionId: 'guest_session_789',
  items: [
    {
      product: {
        id: 'capsule_789',
        name: 'Energy Boost',
        price: 19.99
      },
      productType: 'capsule',
      quantity: 3
    }
  ],
  total: 59.97,
  shippingAddress: {
    firstName: 'Jane',
    lastName: 'Smith',
    address: '456 Galaxy Avenue',
    city: 'Los Angeles',
    zipCode: '90210',
    country: 'USA'
  }
};

describe('Order Routes', () => {
  // Setup and teardown
  beforeAll(async () => {
    // Create MongoDB Memory Server
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    // Connect to the in-memory database
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    // Clean up
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    // Clear all collections before each test
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
    jest.clearAllMocks();
  });

  describe('POST /api/orders', () => {
    describe('Happy Path', () => {
      it('should create order for authenticated user', async () => {
        const response = await request(app)
          .post('/api/orders')
          .send(validOrderData)
          .expect(201);

        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('Order placed successfully!');
        expect(response.body.data).toMatchObject({
          userId: validOrderData.userId,
          sessionId: validOrderData.sessionId,
          items: validOrderData.items,
          total: validOrderData.total,
          shippingAddress: validOrderData.shippingAddress,
          status: 'confirmed'
        });
        expect(response.body.data._id).toBeDefined();
        expect(response.body.data.createdAt).toBeDefined();
      });

      it('should create order for guest user', async () => {
        const response = await request(app)
          .post('/api/orders')
          .send(guestOrderData)
          .expect(201);

        expect(response.body.success).toBe(true);
        expect(response.body.data.userId).toBe('guest');
        expect(response.body.data.sessionId).toBe(guestOrderData.sessionId);
        expect(response.body.data.items).toEqual(guestOrderData.items);
        expect(response.body.data.total).toBe(guestOrderData.total);
      });

      it('should create order with minimal required fields', async () => {
        const minimalOrder = {
          items: [
            {
              product: { id: 'product_1', name: 'Test Product', price: 10.99 },
              productType: 'capsule',
              quantity: 1
            }
          ],
          total: 10.99,
          shippingAddress: {
            firstName: 'Test',
            lastName: 'User',
            address: '123 Test St',
            city: 'Test City',
            zipCode: '12345',
            country: 'Test Country'
          }
        };

        const response = await request(app)
          .post('/api/orders')
          .send(minimalOrder)
          .expect(201);

        expect(response.body.success).toBe(true);
        expect(response.body.data.userId).toBe('guest');
        expect(response.body.data.status).toBe('confirmed');
      });

      it('should handle multiple items in order', async () => {
        const multiItemOrder = {
          ...validOrderData,
          items: [
            ...validOrderData.items,
            {
              product: { id: 'accessory_1', name: 'Coffee Filters', price: 5.99 },
              productType: 'accessory',
              quantity: 5
            }
          ],
          total: 361.92 // Updated total
        };

        const response = await request(app)
          .post('/api/orders')
          .send(multiItemOrder)
          .expect(201);

        expect(response.body.success).toBe(true);
        expect(response.body.data.items).toHaveLength(3);
        expect(response.body.data.total).toBe(361.92);
      });

      it('should handle large order values', async () => {
        const largeOrder = {
          ...validOrderData,
          total: 9999.99
        };

        const response = await request(app)
          .post('/api/orders')
          .send(largeOrder)
          .expect(201);

        expect(response.body.success).toBe(true);
        expect(response.body.data.total).toBe(9999.99);
      });
    });

    describe('Input Validation', () => {
      it('should handle missing items field gracefully', async () => {
        const invalidOrder = {
          ...validOrderData,
          items: undefined
        };
        delete invalidOrder.items;

        const response = await request(app)
          .post('/api/orders')
          .send(invalidOrder)
          .expect(201);

        expect(response.body.success).toBe(true);
        expect(response.body.data.items).toEqual([]);
      });

      it('should handle missing total field gracefully', async () => {
        const invalidOrder = {
          ...validOrderData,
          total: undefined
        };
        delete invalidOrder.total;

        const response = await request(app)
          .post('/api/orders')
          .send(invalidOrder)
          .expect(201);

        expect(response.body.success).toBe(true);
        expect(response.body.data.total).toBeUndefined();
      });

      it('should handle missing shipping address gracefully', async () => {
        const invalidOrder = {
          ...validOrderData,
          shippingAddress: undefined
        };
        delete invalidOrder.shippingAddress;

        const response = await request(app)
          .post('/api/orders')
          .send(invalidOrder)
          .expect(201);

        expect(response.body.success).toBe(true);
        expect(response.body.data.shippingAddress).toBeUndefined();
      });

      it('should handle empty items array', async () => {
        const invalidOrder = {
          ...validOrderData,
          items: []
        };

        const response = await request(app)
          .post('/api/orders')
          .send(invalidOrder)
          .expect(201);

        // Order is created even with empty items - business logic decision
        expect(response.body.success).toBe(true);
        expect(response.body.data.items).toEqual([]);
      });

      it('should handle zero total', async () => {
        const zeroTotalOrder = {
          ...validOrderData,
          total: 0
        };

        const response = await request(app)
          .post('/api/orders')
          .send(zeroTotalOrder)
          .expect(201);

        expect(response.body.success).toBe(true);
        expect(response.body.data.total).toBe(0);
      });

      it('should handle negative total', async () => {
        const negativeTotalOrder = {
          ...validOrderData,
          total: -10.99
        };

        const response = await request(app)
          .post('/api/orders')
          .send(negativeTotalOrder)
          .expect(201);

        // System allows negative totals (could be refunds/adjustments)
        expect(response.body.success).toBe(true);
        expect(response.body.data.total).toBe(-10.99);
      });
    });

    describe('Edge Cases', () => {
      it('should handle very long user IDs', async () => {
        const longUserIdOrder = {
          ...validOrderData,
          userId: 'a'.repeat(1000)
        };

        const response = await request(app)
          .post('/api/orders')
          .send(longUserIdOrder)
          .expect(201);

        expect(response.body.success).toBe(true);
        expect(response.body.data.userId).toBe('a'.repeat(1000));
      });

      it('should handle special characters in address', async () => {
        const specialCharOrder = {
          ...validOrderData,
          shippingAddress: {
            ...validOrderData.shippingAddress,
            address: '123 Cosmic St. Apt #456 (Unit B) & Co.',
            firstName: 'José',
            lastName: 'García-López'
          }
        };

        const response = await request(app)
          .post('/api/orders')
          .send(specialCharOrder)
          .expect(201);

        expect(response.body.success).toBe(true);
        expect(response.body.data.shippingAddress.firstName).toBe('José');
        expect(response.body.data.shippingAddress.lastName).toBe('García-López');
      });

      it('should handle malformed JSON', async () => {
        const response = await request(app)
          .post('/api/orders')
          .send('invalid json string')
          .expect(500);

        expect(response.body.success).toBe(false);
      });
    });

    describe('Database Integration', () => {
      it('should persist order to database', async () => {
        const response = await request(app)
          .post('/api/orders')
          .send(validOrderData)
          .expect(201);

        const orderId = response.body.data._id;

        // Verify order exists in database
        const savedOrder = await mongoose.connection.collection('orders').findOne(
          { _id: new mongoose.Types.ObjectId(orderId) }
        );

        expect(savedOrder).toBeDefined();
        expect(savedOrder!.userId).toBe(validOrderData.userId);
        expect(savedOrder!.total).toBe(validOrderData.total);
      });

      it('should handle database connection errors gracefully', async () => {
        // Close database connection to simulate error
        await mongoose.disconnect();

        const response = await request(app)
          .post('/api/orders')
          .send(validOrderData)
          .expect(500);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toBeDefined();

        // Reconnect for other tests
        const mongoUri = mongoServer.getUri();
        await mongoose.connect(mongoUri);
      });
    });
  });

  describe('GET /api/orders/user/:userId', () => {
    let createdOrders: any[] = [];

    beforeEach(async () => {
      // Create test orders for the user
      createdOrders = [];
      for (let i = 0; i < 3; i++) {
        const response = await request(app)
          .post('/api/orders')
          .send({
            ...validOrderData,
            userId: 'test_user_123',
            sessionId: `session_${i}`,
            total: 100 + i * 50
          });
        createdOrders.push(response.body.data);
      }

      // Create order for different user
      await request(app)
        .post('/api/orders')
        .send({
          ...validOrderData,
          userId: 'different_user_456'
        });
    });

    describe('Happy Path', () => {
      it('should retrieve all orders for specific user', async () => {
        const response = await request(app)
          .get('/api/orders/user/test_user_123')
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveLength(3);

        // Verify all orders belong to the correct user
        response.body.data.forEach((order: any) => {
          expect(order.userId).toBe('test_user_123');
        });
      });

      it('should return orders sorted by creation date (newest first)', async () => {
        const response = await request(app)
          .get('/api/orders/user/test_user_123')
          .expect(200);

        const orders = response.body.data;
        expect(orders).toHaveLength(3);

        // Verify descending order by creation date
        for (let i = 0; i < orders.length - 1; i++) {
          const currentDate = new Date(orders[i].createdAt);
          const nextDate = new Date(orders[i + 1].createdAt);
          expect(currentDate.getTime()).toBeGreaterThanOrEqual(nextDate.getTime());
        }
      });

      it('should return empty array for user with no orders', async () => {
        const response = await request(app)
          .get('/api/orders/user/user_with_no_orders')
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data).toEqual([]);
      });

      it('should handle guest user orders', async () => {
        // Create guest order
        await request(app)
          .post('/api/orders')
          .send({
            ...guestOrderData,
            userId: 'guest'
          });

        const response = await request(app)
          .get('/api/orders/user/guest')
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data.length).toBeGreaterThan(0);
        expect(response.body.data[0].userId).toBe('guest');
      });
    });

    describe('Edge Cases', () => {
      it('should handle special characters in user ID', async () => {
        const specialUserId = 'user_with_special-chars!@#$%';

        // Create order for special user ID
        await request(app)
          .post('/api/orders')
          .send({
            ...validOrderData,
            userId: specialUserId
          });

        const response = await request(app)
          .get(`/api/orders/user/${encodeURIComponent(specialUserId)}`)
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveLength(1);
        expect(response.body.data[0].userId).toBe(specialUserId);
      });

      it('should handle very long user ID', async () => {
        const longUserId = 'a'.repeat(500);

        await request(app)
          .post('/api/orders')
          .send({
            ...validOrderData,
            userId: longUserId
          });

        const response = await request(app)
          .get(`/api/orders/user/${longUserId}`)
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data[0].userId).toBe(longUserId);
      });
    });

    describe('Error Handling', () => {
      it('should handle database errors gracefully', async () => {
        // Close database connection to simulate error
        await mongoose.disconnect();

        const response = await request(app)
          .get('/api/orders/user/test_user_123')
          .expect(500);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toBeDefined();

        // Reconnect for other tests
        const mongoUri = mongoServer.getUri();
        await mongoose.connect(mongoUri);
      });
    });
  });

  describe('GET /api/orders/:id', () => {
    let createdOrder: any;

    beforeEach(async () => {
      // Create a test order
      const response = await request(app)
        .post('/api/orders')
        .send(validOrderData);
      createdOrder = response.body.data;
    });

    describe('Happy Path', () => {
      it('should retrieve order by valid ID', async () => {
        const response = await request(app)
          .get(`/api/orders/${createdOrder._id}`)
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data._id).toBe(createdOrder._id);
        expect(response.body.data.userId).toBe(validOrderData.userId);
        expect(response.body.data.total).toBe(validOrderData.total);
        expect(response.body.data.items).toEqual(validOrderData.items);
      });

      it('should return complete order details', async () => {
        const response = await request(app)
          .get(`/api/orders/${createdOrder._id}`)
          .expect(200);

        const order = response.body.data;
        expect(order).toHaveProperty('_id');
        expect(order).toHaveProperty('userId');
        expect(order).toHaveProperty('sessionId');
        expect(order).toHaveProperty('items');
        expect(order).toHaveProperty('total');
        expect(order).toHaveProperty('shippingAddress');
        expect(order).toHaveProperty('status');
        expect(order).toHaveProperty('createdAt');
      });
    });

    describe('Error Cases', () => {
      it('should return 404 for non-existent order ID', async () => {
        const nonExistentId = new mongoose.Types.ObjectId();

        const response = await request(app)
          .get(`/api/orders/${nonExistentId}`)
          .expect(404);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Order not found');
      });

      it('should handle invalid ObjectId format', async () => {
        const response = await request(app)
          .get('/api/orders/invalid_id_format')
          .expect(500);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toBeDefined();
      });

      it('should handle empty ID parameter', async () => {
        await request(app)
          .get('/api/orders/')
          .expect(404); // Route not found
      });

      it('should handle very long ID parameter', async () => {
        const longId = 'a'.repeat(1000);

        const response = await request(app)
          .get(`/api/orders/${longId}`)
          .expect(500);

        expect(response.body.success).toBe(false);
      });
    });

    describe('Database Integration', () => {
      it('should handle database errors gracefully', async () => {
        // Close database connection to simulate error
        await mongoose.disconnect();

        const response = await request(app)
          .get(`/api/orders/${createdOrder._id}`)
          .expect(500);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toBeDefined();

        // Reconnect for other tests
        const mongoUri = mongoServer.getUri();
        await mongoose.connect(mongoUri);
      });
    });
  });

  describe('Integration Tests - Full Order Workflow', () => {
    it('should handle complete order lifecycle', async () => {
      // 1. Create an order
      const createResponse = await request(app)
        .post('/api/orders')
        .send(validOrderData)
        .expect(201);

      const orderId = createResponse.body.data._id;
      const userId = validOrderData.userId;

      // 2. Retrieve the specific order
      const getOrderResponse = await request(app)
        .get(`/api/orders/${orderId}`)
        .expect(200);

      expect(getOrderResponse.body.data._id).toBe(orderId);

      // 3. Retrieve user's order history
      const getUserOrdersResponse = await request(app)
        .get(`/api/orders/user/${userId}`)
        .expect(200);

      expect(getUserOrdersResponse.body.data).toHaveLength(1);
      expect(getUserOrdersResponse.body.data[0]._id).toBe(orderId);

      // 4. Create another order for same user
      await request(app)
        .post('/api/orders')
        .send({
          ...validOrderData,
          sessionId: 'different_session',
          total: 599.99
        })
        .expect(201);

      // 5. Verify user now has 2 orders
      const finalUserOrdersResponse = await request(app)
        .get(`/api/orders/user/${userId}`)
        .expect(200);

      expect(finalUserOrdersResponse.body.data).toHaveLength(2);

      // Verify newest order is first (sorted by creation date desc)
      const orders = finalUserOrdersResponse.body.data;
      expect(orders[0].total).toBe(599.99); // Second order
      expect(orders[1].total).toBe(331.97); // First order
    });

    it('should handle concurrent order creation', async () => {
      const orderPromises = [];

      // Create 5 orders simultaneously
      for (let i = 0; i < 5; i++) {
        orderPromises.push(
          request(app)
            .post('/api/orders')
            .send({
              ...validOrderData,
              userId: `concurrent_user_${i}`,
              sessionId: `concurrent_session_${i}`,
              total: 100 + i * 10
            })
        );
      }

      const responses = await Promise.all(orderPromises);

      // All orders should be created successfully
      responses.forEach((response, index) => {
        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.data.userId).toBe(`concurrent_user_${index}`);
        expect(response.body.data.total).toBe(100 + index * 10);
      });
    });

    it('should maintain data consistency across operations', async () => {
      // Create multiple orders with different patterns
      const orderPatterns = [
        { userId: 'user_A', total: 100 },
        { userId: 'user_A', total: 200 },
        { userId: 'user_B', total: 150 },
        { userId: 'guest', total: 75 },
        { userId: 'guest', total: 300 }
      ];

      const createdOrders = [];
      for (const pattern of orderPatterns) {
        const response = await request(app)
          .post('/api/orders')
          .send({
            ...validOrderData,
            ...pattern,
            sessionId: `session_${Math.random()}`
          });
        createdOrders.push(response.body.data);
      }

      // Verify user A has 2 orders
      const userAOrders = await request(app)
        .get('/api/orders/user/user_A')
        .expect(200);
      expect(userAOrders.body.data).toHaveLength(2);

      // Verify user B has 1 order
      const userBOrders = await request(app)
        .get('/api/orders/user/user_B')
        .expect(200);
      expect(userBOrders.body.data).toHaveLength(1);

      // Verify guest has 2 orders
      const guestOrders = await request(app)
        .get('/api/orders/user/guest')
        .expect(200);
      expect(guestOrders.body.data).toHaveLength(2);

      // Verify each order can be retrieved individually
      for (const order of createdOrders) {
        const response = await request(app)
          .get(`/api/orders/${order._id}`)
          .expect(200);
        expect(response.body.data._id).toBe(order._id);
      }
    });
  });

  describe('Performance Tests', () => {
    it('should handle bulk order creation efficiently', async () => {
      const startTime = Date.now();
      const bulkOrders = [];

      // Create 20 orders
      for (let i = 0; i < 20; i++) {
        bulkOrders.push(
          request(app)
            .post('/api/orders')
            .send({
              ...validOrderData,
              userId: `bulk_user_${i % 5}`, // 5 different users
              sessionId: `bulk_session_${i}`,
              total: Math.random() * 1000
            })
        );
      }

      const responses = await Promise.all(bulkOrders);
      const endTime = Date.now();

      // All orders should succeed
      responses.forEach(response => {
        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
      });

      // Performance should be reasonable (less than 10 seconds)
      expect(endTime - startTime).toBeLessThan(10000);

      // Verify data integrity
      const userOrders = await request(app)
        .get('/api/orders/user/bulk_user_0')
        .expect(200);
      expect(userOrders.body.data).toHaveLength(4); // Every 5th order (0, 5, 10, 15)
    });
  });
});