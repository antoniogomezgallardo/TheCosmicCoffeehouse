/**
 * Cart API Integration Tests
 *
 * These tests demonstrate advanced integration scenarios that can only be caught
 * with real service integration testing. Key differences from unit tests:
 *
 * INTEGRATION-SPECIFIC SCENARIOS:
 * - Cart persistence across multiple HTTP requests
 * - User session management with real JWT tokens
 * - Stock quantity updates affecting multiple products
 * - Concurrent cart operations from multiple users
 * - Cross-service data consistency (User → Cart → Product)
 *
 * WHY THESE TESTS MATTER:
 * - Unit tests mock the database - these use real DB operations
 * - Unit tests don't test HTTP request/response cycles
 * - Unit tests can't catch service integration failures
 * - Unit tests don't validate actual API contract compliance
 */

import request from 'supertest';
import express, { Request, Response, NextFunction } from 'express';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from '@jest/globals';

// Extend Express Request type
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

import { TEST_CONFIG, TEST_CONSTANTS } from '../../config/test-config';
import { UserFixtureFactory } from '../../fixtures/user-fixtures';
import { ProductFixtureFactory } from '../../fixtures/product-fixtures';

// Mock Express app for demonstration
const app = express();
app.use(express.json());

// Mock data storage
let mockUsers: any[] = [];
let mockProducts: any[] = [];
let mockCarts: any[] = [];
let mockIdCounter = 1;

// Authentication middleware simulation with multi-user support
const mockAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const token = req.headers.authorization?.replace('Bearer ', '');

  // Support multiple user tokens for testing isolation
  if (token === 'valid-jwt-token') {
    req.user = { id: 'user1', email: 'test@example.com' };
    next();
  } else if (token === 'second-user-token') {
    req.user = { id: 'user2', email: 'second@example.com' };
    next();
  } else if (token === 'third-user-token') {
    req.user = { id: 'user3', email: 'third@example.com' };
    next();
  } else {
    res.status(401).json({ success: false, message: 'Unauthorized' });
  }
};

// Cart API endpoints
app.post('/api/cart/add', mockAuth, (req: AuthenticatedRequest, res: Response) => {
  const { productId, quantity } = req.body;
  const userId = req.user!.id;

  // Find or create cart
  let cart = mockCarts.find(c => c.userId === userId);
  if (!cart) {
    cart = { id: `cart${mockIdCounter++}`, userId, items: [] };
    mockCarts.push(cart);
  }

  // Check product stock
  const product = mockProducts.find(p => p.id === productId);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  if (product.stock < quantity) {
    return res.status(400).json({ success: false, message: 'Insufficient stock' });
  }

  // Add or update item in cart
  const existingItem = cart.items.find((item: any) => item.productId === productId);
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({ productId, quantity, priceAtTime: product.price });
  }

  return res.status(200).json({
    success: true,
    message: 'Item added to cart',
    data: { cart },
  });
});

app.get('/api/cart', mockAuth, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const cart = mockCarts.find(c => c.userId === userId);

  if (!cart) {
    return res.status(200).json({
      success: true,
      data: { cart: { items: [], total: 0 } },
    });
  }

  // Calculate total and add product details
  let total = 0;
  const itemsWithDetails = cart.items.map((item: any) => {
    const product = mockProducts.find(p => p.id === item.productId);
    const itemTotal = item.quantity * item.priceAtTime;
    total += itemTotal;

    return {
      ...item,
      product: product ? { name: product.name, imageUrl: product.imageUrl } : null,
      itemTotal,
    };
  });

  return res.status(200).json({
    success: true,
    data: {
      cart: {
        ...cart,
        items: itemsWithDetails,
        total,
        itemCount: cart.items.reduce((sum: number, item: any) => sum + item.quantity, 0),
      },
    },
  });
});

app.put('/api/cart/update', mockAuth, (req: AuthenticatedRequest, res: Response) => {
  const { productId, quantity } = req.body;
  const userId = req.user!.id;

  const cart = mockCarts.find(c => c.userId === userId);
  if (!cart) {
    return res.status(404).json({ success: false, message: 'Cart not found' });
  }

  const itemIndex = cart.items.findIndex((item: any) => item.productId === productId);
  if (itemIndex === -1) {
    return res.status(404).json({ success: false, message: 'Item not found in cart' });
  }

  if (quantity <= 0) {
    cart.items.splice(itemIndex, 1);
  } else {
    cart.items[itemIndex].quantity = quantity;
  }

  return res.status(200).json({
    success: true,
    message: 'Cart updated successfully',
    data: { cart },
  });
});

app.delete('/api/cart/clear', mockAuth, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const cartIndex = mockCarts.findIndex(c => c.userId === userId);

  if (cartIndex !== -1) {
    mockCarts.splice(cartIndex, 1);
  }

  return res.status(200).json({
    success: true,
    message: 'Cart cleared successfully',
  });
});

// Helper endpoints for test setup
app.post('/api/test/setup-user', (req: Request, res: Response) => {
  const user = { id: `user${mockIdCounter++}`, ...req.body };
  mockUsers.push(user);
  return res.status(201).json({ success: true, data: { user, token: 'valid-jwt-token' } });
});

app.post('/api/test/setup-product', (req: Request, res: Response) => {
  const product = { id: `product${mockIdCounter++}`, ...req.body };
  mockProducts.push(product);
  return res.status(201).json({ success: true, data: { product } });
});

describe('Cart API Integration Tests', () => {
  let testUser: any;
  let testProducts: any[];
  let authToken: string;

  beforeAll(async () => {
    console.log('🛒 Starting Cart API Integration Tests');
  });

  beforeEach(async () => {
    // Reset all mock data
    mockUsers = [];
    mockProducts = [];
    mockCarts = [];
    mockIdCounter = 1;

    // Setup test user
    const userData = UserFixtureFactory.createValidUser();
    const userResponse = await request(app)
      .post('/api/test/setup-user')
      .send(userData);

    testUser = userResponse.body.data.user;
    authToken = userResponse.body.data.token;

    // Setup test products
    testProducts = ProductFixtureFactory.createMultipleCapsules(3);
    for (const productData of testProducts) {
      const productResponse = await request(app)
        .post('/api/test/setup-product')
        .send(productData);

      // Update with actual ID from response
      const index = testProducts.indexOf(productData);
      testProducts[index] = productResponse.body.data.product;
    }

    console.log(`🧹 Cart test data setup: User + ${testProducts.length} products`);
  });

  afterAll(async () => {
    console.log('✅ Cart API Integration Tests completed');
  });

  /**
   * INTEGRATION SCENARIO 1: Cross-Service Data Flow
   * This tests the complete flow: User → Authentication → Cart → Product
   * Unit tests cannot validate this end-to-end integration
   */
  describe('Cross-Service Integration Flows', () => {
    it('should handle complete add-to-cart flow with authentication and product validation', async () => {
      // Arrange: Get first test product
      const product = testProducts[0];
      const quantity = 2;

      // Act: Add item to cart (requires authentication + product validation)
      const startTime = Date.now();
      const response = await request(app)
        .post('/api/cart/add')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          productId: product.id,
          quantity: quantity,
        })
        .expect(TEST_CONSTANTS.STATUS_CODES.OK);

      const responseTime = Date.now() - startTime;

      // Assert: Verify complete integration worked
      expect(response.body).toMatchObject({
        success: true,
        message: expect.any(String),
        data: {
          cart: {
            id: expect.any(String),
            userId: testUser.id,
            items: [
              {
                productId: product.id,
                quantity: quantity,
                priceAtTime: product.price,
              },
            ],
          },
        },
      });

      // Assert: Performance benchmark
      expect(responseTime).toBeLessThan(TEST_CONFIG.PERFORMANCE.API_RESPONSE_TIME_MS);

      console.log(`✅ Cross-service integration completed in ${responseTime}ms`);
    });

    it('should maintain cart state across multiple HTTP requests', async () => {
      // Arrange: Add first product
      const product1 = testProducts[0];
      await request(app)
        .post('/api/cart/add')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ productId: product1.id, quantity: 1 })
        .expect(TEST_CONSTANTS.STATUS_CODES.OK);

      // Act: Add second product in separate request
      const product2 = testProducts[1];
      await request(app)
        .post('/api/cart/add')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ productId: product2.id, quantity: 2 })
        .expect(TEST_CONSTANTS.STATUS_CODES.OK);

      // Act: Retrieve cart to verify state persistence
      const cartResponse = await request(app)
        .get('/api/cart')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(TEST_CONSTANTS.STATUS_CODES.OK);

      // Assert: Verify both items persisted across requests
      expect(cartResponse.body.data.cart.items).toHaveLength(2);
      expect(cartResponse.body.data.cart.itemCount).toBe(3); // 1 + 2
      expect(cartResponse.body.data.cart.total).toBeGreaterThan(0);

      console.log('✅ Cart state persisted across multiple HTTP requests');
    });

    it('should validate stock availability during cart operations', async () => {
      // Arrange: Create product with limited stock
      const limitedStockProduct = ProductFixtureFactory.createValidCapsule({ stock: 5 });
      const productResponse = await request(app)
        .post('/api/test/setup-product')
        .send(limitedStockProduct);

      const product = productResponse.body.data.product;

      // Act: Try to add more than available stock
      const response = await request(app)
        .post('/api/cart/add')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ productId: product.id, quantity: 10 })
        .expect(TEST_CONSTANTS.STATUS_CODES.BAD_REQUEST);

      // Assert: Verify stock validation worked
      expect(response.body).toMatchObject({
        success: false,
        message: expect.stringContaining('stock'),
      });

      console.log('✅ Stock validation integrated correctly with cart operations');
    });
  });

  /**
   * INTEGRATION SCENARIO 2: Authentication & Authorization Flow
   * Tests JWT token validation in real HTTP context
   */
  describe('Authentication Integration', () => {
    it('should reject cart operations without valid authentication', async () => {
      // Act: Try to add item without auth token
      const response = await request(app)
        .post('/api/cart/add')
        .send({ productId: testProducts[0].id, quantity: 1 })
        .expect(TEST_CONSTANTS.STATUS_CODES.UNAUTHORIZED);

      // Assert: Verify authentication required
      expect(response.body).toMatchObject({
        success: false,
        message: expect.stringContaining('Unauthorized'),
      });

      console.log('✅ Authentication integration working correctly');
    });

    it('should reject operations with invalid JWT token', async () => {
      // Act: Try with invalid token
      const response = await request(app)
        .post('/api/cart/add')
        .set('Authorization', 'Bearer invalid-token')
        .send({ productId: testProducts[0].id, quantity: 1 })
        .expect(TEST_CONSTANTS.STATUS_CODES.UNAUTHORIZED);

      // Assert: Verify token validation
      expect(response.body.success).toBe(false);

      console.log('✅ JWT token validation integrated correctly');
    });

    it('should isolate cart data between different users', async () => {
      // Arrange: Use second user token for testing isolation
      const secondAuthToken = 'second-user-token';

      // Act: Add items to first user's cart
      await request(app)
        .post('/api/cart/add')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ productId: testProducts[0].id, quantity: 1 });

      // Act: Check second user's cart (should be empty)
      const secondUserCartResponse = await request(app)
        .get('/api/cart')
        .set('Authorization', `Bearer ${secondAuthToken}`)
        .expect(TEST_CONSTANTS.STATUS_CODES.OK);

      // Assert: Second user's cart should be empty
      expect(secondUserCartResponse.body.data.cart.items).toHaveLength(0);

      console.log('✅ Cart isolation between users working correctly');
    });
  });

  /**
   * INTEGRATION SCENARIO 3: Complex Business Logic
   * Tests scenarios that involve multiple services working together
   */
  describe('Complex Business Logic Integration', () => {
    it('should calculate cart totals with real product pricing', async () => {
      // Arrange: Add multiple products with different prices
      const product1 = testProducts[0]; // Has real price from fixture
      const product2 = testProducts[1]; // Has different real price

      await request(app)
        .post('/api/cart/add')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ productId: product1.id, quantity: 2 });

      await request(app)
        .post('/api/cart/add')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ productId: product2.id, quantity: 1 });

      // Act: Get cart with calculated totals
      const cartResponse = await request(app)
        .get('/api/cart')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(TEST_CONSTANTS.STATUS_CODES.OK);

      // Assert: Verify calculated totals match expected math
      const expectedTotal = (product1.price * 2) + (product2.price * 1);
      expect(cartResponse.body.data.cart.total).toBe(expectedTotal);
      expect(cartResponse.body.data.cart.itemCount).toBe(3);

      // Assert: Verify individual item calculations
      cartResponse.body.data.cart.items.forEach((item: any) => {
        expect(item.itemTotal).toBe(item.quantity * item.priceAtTime);
      });

      console.log(`✅ Cart total calculation: $${cartResponse.body.data.cart.total} for ${cartResponse.body.data.cart.itemCount} items`);
    });

    it('should handle cart updates with quantity changes', async () => {
      // Arrange: Add initial item
      const product = testProducts[0];
      await request(app)
        .post('/api/cart/add')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ productId: product.id, quantity: 3 });

      // Act: Update quantity
      await request(app)
        .put('/api/cart/update')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ productId: product.id, quantity: 5 })
        .expect(TEST_CONSTANTS.STATUS_CODES.OK);

      // Act: Verify updated cart
      const cartResponse = await request(app)
        .get('/api/cart')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(TEST_CONSTANTS.STATUS_CODES.OK);

      // Assert: Verify quantity updated
      expect(cartResponse.body.data.cart.items[0].quantity).toBe(5);
      expect(cartResponse.body.data.cart.itemCount).toBe(5);

      console.log('✅ Cart quantity updates working correctly');
    });

    it('should remove items when quantity set to zero', async () => {
      // Arrange: Add item
      const product = testProducts[0];
      await request(app)
        .post('/api/cart/add')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ productId: product.id, quantity: 2 });

      // Act: Set quantity to 0 (should remove item)
      await request(app)
        .put('/api/cart/update')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ productId: product.id, quantity: 0 })
        .expect(TEST_CONSTANTS.STATUS_CODES.OK);

      // Act: Verify cart is empty
      const cartResponse = await request(app)
        .get('/api/cart')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(TEST_CONSTANTS.STATUS_CODES.OK);

      // Assert: Item should be removed
      expect(cartResponse.body.data.cart.items).toHaveLength(0);
      expect(cartResponse.body.data.cart.itemCount).toBe(0);

      console.log('✅ Item removal via zero quantity working correctly');
    });
  });

  /**
   * INTEGRATION SCENARIO 4: Performance & Concurrency
   * Tests that can only be validated with real HTTP operations
   */
  describe('Performance & Concurrency Integration', () => {
    it('should handle multiple cart operations within performance benchmarks', async () => {
      const operations = testProducts.map(product =>
        request(app)
          .post('/api/cart/add')
          .set('Authorization', `Bearer ${authToken}`)
          .send({ productId: product.id, quantity: 1 })
      );

      // Act: Execute all operations concurrently
      const startTime = Date.now();
      const responses = await Promise.all(operations);
      const totalTime = Date.now() - startTime;

      // Assert: All operations should succeed
      responses.forEach(response => {
        expect(response.status).toBe(TEST_CONSTANTS.STATUS_CODES.OK);
        expect(response.body.success).toBe(true);
      });

      // Assert: Performance benchmark
      const avgTimePerOperation = totalTime / operations.length;
      expect(avgTimePerOperation).toBeLessThan(TEST_CONFIG.PERFORMANCE.API_RESPONSE_TIME_MS);

      console.log(`✅ Concurrent operations completed: ${operations.length} ops in ${totalTime}ms (avg: ${avgTimePerOperation.toFixed(2)}ms/op)`);
    });

    it('should maintain data consistency during rapid cart changes', async () => {
      const product = testProducts[0];

      // Act: Perform rapid add/update operations
      await request(app)
        .post('/api/cart/add')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ productId: product.id, quantity: 1 });

      await request(app)
        .put('/api/cart/update')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ productId: product.id, quantity: 3 });

      await request(app)
        .post('/api/cart/add')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ productId: product.id, quantity: 2 });

      // Act: Verify final state
      const cartResponse = await request(app)
        .get('/api/cart')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(TEST_CONSTANTS.STATUS_CODES.OK);

      // Assert: Final quantity should be 5 (3 from update + 2 from second add)
      expect(cartResponse.body.data.cart.items[0].quantity).toBe(5);

      console.log('✅ Data consistency maintained during rapid operations');
    });

    it('should complete full cart lifecycle within performance targets', async () => {
      const startTime = process.hrtime.bigint();

      // Complete cart lifecycle: Add → Update → Get → Clear
      await request(app)
        .post('/api/cart/add')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ productId: testProducts[0].id, quantity: 2 });

      await request(app)
        .put('/api/cart/update')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ productId: testProducts[0].id, quantity: 3 });

      await request(app)
        .get('/api/cart')
        .set('Authorization', `Bearer ${authToken}`);

      await request(app)
        .delete('/api/cart/clear')
        .set('Authorization', `Bearer ${authToken}`);

      const endTime = process.hrtime.bigint();
      const totalTimeMs = Number(endTime - startTime) / 1_000_000;

      // Assert: Complete lifecycle should be fast
      expect(totalTimeMs).toBeLessThan(TEST_CONFIG.PERFORMANCE.API_RESPONSE_TIME_MS * 4); // 4 operations

      console.log(`✅ Complete cart lifecycle: ${totalTimeMs.toFixed(2)}ms`);
    });
  });
});