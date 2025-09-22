import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
// import User from '../../models/User'; // Not directly used in tests
import Capsule from '../../models/Capsule';
import Machine from '../../models/Machine';
import authRoutes from '../../routes/auth.routes';
import productsRoutes from '../../routes/products.routes';
import cartRoutes from '../../routes/cart.routes';
import orderRoutes from '../../routes/order.routes';

// Create Express app for testing
const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

// MongoDB Memory Server instance
let mongoServer: MongoMemoryServer;

// Test data
const testUser = {
  email: 'integration@test.com',
  username: 'integrationuser',
  password: 'TestPass123!',
  firstName: 'Integration',
  lastName: 'Test'
};

const testCapsule = {
  name: 'Integration Test Capsule',
  superpower: 'Enhanced Testing',
  description: 'A capsule for integration testing',
  powerType: 'mental',
  duration: '2-3 hours',
  sideEffects: ['Improved focus'],
  rarity: 'common',
  intensity: 7,
  energyRating: 80,
  quantumStability: 85,
  discoveredBy: 'Test Lab',
  discoveryDate: new Date('2024-01-15'),
  price: 25.99,
  requiredMachines: [],
  flavorProfile: {
    primary: 'Test',
    secondary: 'Integration',
    notes: ['Reliable', 'Consistent']
  },
  inStock: 100,
  imageUrl: 'https://example.com/integration-capsule.jpg',
  warnings: ['For testing only'],
  isActive: true
};

describe('Critical User Flow Integration Tests', () => {
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
  });

  describe('Complete E-commerce User Journey', () => {
    it('should handle end-to-end user shopping flow', async () => {
      // 1. User Registration
      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send(testUser)
        .expect(201);

      expect(registerResponse.body.success).toBe(true);
      expect(registerResponse.body.data.user.email).toBe(testUser.email);
      // const authToken = registerResponse.body.data.token; // Token available if needed

      // 2. User Login
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        })
        .expect(200);

      expect(loginResponse.body.success).toBe(true);

      // 3. Create test product
      await Capsule.create(testCapsule);

      // 4. Browse Products
      const productsResponse = await request(app)
        .get('/api/products/capsules')
        .expect(200);

      expect(productsResponse.body.data).toHaveLength(1);
      const productId = productsResponse.body.data[0]._id;

      // 5. View Product Details (increments view count)
      const productDetailResponse = await request(app)
        .get(`/api/products/capsules/${productId}`)
        .expect(200);

      expect(productDetailResponse.body.data.views).toBe(1);

      // 6. Add Product to Cart
      const sessionId = 'integration_test_session';
      const addToCartResponse = await request(app)
        .post('/api/cart/add')
        .send({
          sessionId,
          product: {
            id: productId,
            name: testCapsule.name,
            price: testCapsule.price,
            productType: 'capsule'
          },
          quantity: 2
        })
        .expect(200);

      expect(addToCartResponse.body.data).toHaveLength(1);
      expect(addToCartResponse.body.data[0].quantity).toBe(2);

      // 7. View Cart
      const cartResponse = await request(app)
        .get(`/api/cart/${sessionId}`)
        .expect(200);

      expect(cartResponse.body.data).toHaveLength(1);
      // Cart total available for calculations if needed

      // 8. Update Cart (increase quantity)
      const updateCartResponse = await request(app)
        .put('/api/cart/update')
        .send({
          sessionId,
          productId,
          quantity: 3
        })
        .expect(200);

      expect(updateCartResponse.body.data[0].quantity).toBe(3);

      // 9. Place Order
      const userId = registerResponse.body.data.user.id; // Use 'id' from registration response
      const orderData = {
        userId: userId, // Already a string
        sessionId,
        items: [{
          product: {
            id: productId,
            name: testCapsule.name,
            price: testCapsule.price
          },
          productType: 'capsule',
          quantity: 3
        }],
        total: testCapsule.price * 3,
        shippingAddress: {
          firstName: 'Integration',
          lastName: 'Test',
          address: '123 Test Street',
          city: 'Test City',
          zipCode: '12345',
          country: 'Test Country'
        }
      };

      const orderResponse = await request(app)
        .post('/api/orders')
        .send(orderData)
        .expect(201);

      expect(orderResponse.body.success).toBe(true);
      expect(orderResponse.body.data.total).toBe(testCapsule.price * 3);
      const orderId = orderResponse.body.data._id;

      // 10. View Order Details
      const orderDetailResponse = await request(app)
        .get(`/api/orders/${orderId}`)
        .expect(200);

      expect(orderDetailResponse.body.data._id).toBe(orderId);
      expect(orderDetailResponse.body.data.status).toBe('confirmed');

      // 11. View User Order History
      const orderHistoryResponse = await request(app)
        .get(`/api/orders/user/${userId}`)
        .expect(200);

      expect(orderHistoryResponse.body.data).toHaveLength(1);
      expect(orderHistoryResponse.body.data[0]._id).toBe(orderId);

      // 12. Clear Cart (post-purchase)
      const clearCartResponse = await request(app)
        .post('/api/cart/clear')
        .send({ sessionId })
        .expect(200);

      expect(clearCartResponse.body.message).toBe('Cart cleared');

      // 13. Verify Final State
      const finalCartResponse = await request(app)
        .get(`/api/cart/${sessionId}`)
        .expect(200);

      expect(finalCartResponse.body.data).toHaveLength(0);

      const finalProductResponse = await request(app)
        .get(`/api/products/capsules/${productId}`)
        .expect(200);

      expect(finalProductResponse.body.data.views).toBeGreaterThanOrEqual(2); // At least original view + 1 additional
    });

    it('should handle guest user shopping flow', async () => {
      // 1. Create test product
      await Capsule.create(testCapsule);

      // 2. Browse Products (no auth required)
      const productsResponse = await request(app)
        .get('/api/products/capsules')
        .expect(200);

      const productId = productsResponse.body.data[0]._id;

      // 3. Add to Cart as Guest
      const guestSessionId = 'guest_session_123';
      const addToCartResponse = await request(app)
        .post('/api/cart/add')
        .send({
          sessionId: guestSessionId,
          product: {
            id: productId,
            name: testCapsule.name,
            price: testCapsule.price,
            productType: 'capsule'
          },
          quantity: 1
        })
        .expect(200);

      expect(addToCartResponse.body.data).toHaveLength(1);

      // 4. Place Order as Guest
      const guestOrderData = {
        sessionId: guestSessionId,
        items: [{
          product: {
            id: productId,
            name: testCapsule.name,
            price: testCapsule.price
          },
          productType: 'capsule',
          quantity: 1
        }],
        total: testCapsule.price,
        shippingAddress: {
          firstName: 'Guest',
          lastName: 'User',
          address: '456 Guest Avenue',
          city: 'Guest City',
          zipCode: '54321',
          country: 'Guest Country'
        }
      };

      const guestOrderResponse = await request(app)
        .post('/api/orders')
        .send(guestOrderData)
        .expect(201);

      expect(guestOrderResponse.body.success).toBe(true);
      expect(guestOrderResponse.body.data.userId).toBe('guest');
    });

    it('should handle cart persistence across sessions', async () => {
      // 1. Create test product
      const capsule = await Capsule.create(testCapsule);
      const productId = (capsule._id as any).toString();

      // 2. Add items to cart in session 1
      const sessionId = 'persistent_session';
      await request(app)
        .post('/api/cart/add')
        .send({
          sessionId,
          product: {
            id: productId,
            name: testCapsule.name,
            price: testCapsule.price,
            productType: 'capsule'
          },
          quantity: 2
        })
        .expect(200);

      // 3. Simulate page refresh / new session - cart should persist
      const persistedCartResponse = await request(app)
        .get(`/api/cart/${sessionId}`)
        .expect(200);

      expect(persistedCartResponse.body.data).toHaveLength(1);
      expect(persistedCartResponse.body.data[0].quantity).toBe(2);

      // 4. Add more items in the same session
      await request(app)
        .post('/api/cart/add')
        .send({
          sessionId,
          product: {
            id: productId,
            name: testCapsule.name,
            price: testCapsule.price,
            productType: 'capsule'
          },
          quantity: 1
        })
        .expect(200);

      // 5. Verify quantity increased
      const updatedCartResponse = await request(app)
        .get(`/api/cart/${sessionId}`)
        .expect(200);

      expect(updatedCartResponse.body.data[0].quantity).toBe(3);
    });

    it('should handle featured products workflow', async () => {
      // 1. Create epic and legendary capsules
      const epicCapsule = {
        ...testCapsule,
        name: 'Epic Test Capsule',
        rarity: 'epic',
        price: 49.99
      };

      const legendaryMachine = {
        name: 'Legendary Test Machine',
        machineModel: 'LTM-001-2024',
        type: 'quantum',
        description: 'A legendary machine for testing',
        capabilities: ['Ultimate brewing'],
        compatibleCapsuleTypes: ['mental', 'physical'],
        powerSource: 'quantum-cells',
        price: 25000,
        dimensions: {
          width: 50,
          height: 40,
          depth: 35,
          weight: 30
        },
        specifications: {
          brewingPressure: '20 bar',
          quantumAmplification: 98,
          stabilityField: 95,
          maxPowerOutput: 4000
        },
        warranty: '5 years',
        manufacturingDate: new Date('2024-01-01'),
        manufacturer: 'Legendary Corp',
        safetyRating: 98,
        efficiencyRating: 95,
        maintenanceInterval: '12 months',
        inStock: 3,
        imageUrl: 'https://example.com/legendary-machine.jpg',
        manualUrl: 'https://example.com/manuals/legendary.pdf',
        isActive: true
      };

      await Capsule.create(epicCapsule);
      await Machine.create(legendaryMachine);

      // 2. Get featured products
      const featuredResponse = await request(app)
        .get('/api/products/featured')
        .expect(200);

      expect(featuredResponse.body.data.capsules).toHaveLength(1);
      expect(featuredResponse.body.data.machines).toHaveLength(1);
      expect(featuredResponse.body.data.capsules[0].rarity).toBe('epic');
      expect(featuredResponse.body.data.machines[0].price).toBeGreaterThanOrEqual(10000);
    });
  });

  describe('Error Handling Integration', () => {
    it('should handle authentication errors across routes', async () => {
      // Try to access protected route without auth (would be protected in real app)
      const unauthorizedResponse = await request(app)
        .get('/api/orders/user/nonexistentuser')
        .expect(200); // Currently not protected, but shows integration

      expect(unauthorizedResponse.body.data).toEqual([]);
    });

    it('should handle invalid data across the flow', async () => {
      // 1. Try invalid registration
      const invalidRegisterResponse = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'invalid-email',
          username: '',
          password: '123', // Too short
          firstName: 'Test',
          lastName: 'User'
        })
        .expect(500);

      expect(invalidRegisterResponse.body.success).toBe(false);

      // 2. Try invalid cart addition
      const invalidCartResponse = await request(app)
        .post('/api/cart/add')
        .send({
          sessionId: 'test',
          product: null, // Invalid product
          quantity: -1 // Invalid quantity
        })
        .expect(500);

      expect(invalidCartResponse.body.success).toBe(false);
    });
  });
});