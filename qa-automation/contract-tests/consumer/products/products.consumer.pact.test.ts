/**
 * Products API Consumer Contract Tests
 *
 * These tests define the contract expectations from the frontend's perspective
 * for all product-related endpoints (capsules and machines).
 */

import { Pact } from '@pact-foundation/pact';
import { like, eachLike, iso8601DateTimeWithMillis, integer, decimal } from '@pact-foundation/pact/src/dsl/matchers';
import axios from 'axios';
import path from 'path';
import {
  PACT_CONSUMER_CONFIG,
  API_ENDPOINTS,
  PROVIDER_STATES,
} from '../config/pact.consumer.config';

describe('Products API Consumer Contract', () => {
  const provider = new Pact({
    consumer: PACT_CONSUMER_CONFIG.consumer,
    provider: PACT_CONSUMER_CONFIG.provider,
    port: PACT_CONSUMER_CONFIG.port,
    dir: path.resolve(process.cwd(), 'pacts'),
    logLevel: 'info',
  });

  const baseURL = `http://localhost:${PACT_CONSUMER_CONFIG.port}`;

  beforeAll(() => provider.setup());
  afterEach(() => provider.verify());
  afterAll(() => provider.finalize());

  describe('GET /api/products/capsules', () => {
    it('should retrieve a list of coffee capsules', async () => {
      await provider.addInteraction({
        state: PROVIDER_STATES.PRODUCTS_EXIST,
        uponReceiving: 'a request for all capsules',
        withRequest: {
          method: 'GET',
          path: API_ENDPOINTS.PRODUCTS.GET_CAPSULES,
        },
        willRespondWith: {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
          body: {
            success: true,
            message: 'Capsules retrieved successfully',
            data: {
              capsules: eachLike({
                id: like('507f1f77bcf86cd799439011'),
                name: like('Quantum Roast'),
                description: like('A powerful blend for morning energy'),
                price: decimal(12.99),
                intensity: integer(8),
                flavorProfile: like('Bold and Rich'),
                powerBoost: integer(75),
                stock: integer(100),
                imageUrl: like('https://cosmic.com/images/quantum-roast.jpg'),
                isActive: like(true),
                category: like('capsule'),
                createdAt: iso8601DateTimeWithMillis(),
                updatedAt: iso8601DateTimeWithMillis(),
              }),
              total: integer(10),
              page: integer(1),
              limit: integer(10),
            },
          },
        },
      });

      const response = await axios.get(`${baseURL}${API_ENDPOINTS.PRODUCTS.GET_CAPSULES}`);

      expect(response.status).toBe(200);
      expect(response.data.success).toBe(true);
      expect(response.data.data.capsules).toBeInstanceOf(Array);
      expect(response.data.data.capsules.length).toBeGreaterThan(0);
      expect(response.data.data.capsules[0]).toHaveProperty('id');
      expect(response.data.data.capsules[0]).toHaveProperty('name');
      expect(response.data.data.capsules[0]).toHaveProperty('price');
      expect(response.data.data.capsules[0]).toHaveProperty('powerBoost');
    });

    it('should filter capsules by intensity', async () => {
      await provider.addInteraction({
        state: PROVIDER_STATES.PRODUCTS_EXIST,
        uponReceiving: 'a request for high intensity capsules',
        withRequest: {
          method: 'GET',
          path: API_ENDPOINTS.PRODUCTS.GET_CAPSULES,
          query: {
            minIntensity: '7',
            maxIntensity: '10',
          },
        },
        willRespondWith: {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
          body: {
            success: true,
            message: 'Capsules retrieved successfully',
            data: {
              capsules: eachLike({
                id: like('507f1f77bcf86cd799439011'),
                name: like('Supernova Espresso'),
                intensity: integer(9), // High intensity
                price: decimal(14.99),
                powerBoost: integer(85),
                stock: integer(50),
              }),
              total: integer(3),
              page: integer(1),
              limit: integer(10),
            },
          },
        },
      });

      const response = await axios.get(`${baseURL}${API_ENDPOINTS.PRODUCTS.GET_CAPSULES}`, {
        params: {
          minIntensity: '7',
          maxIntensity: '10',
        },
      });

      expect(response.status).toBe(200);
      expect(response.data.success).toBe(true);
      expect(response.data.data.capsules).toBeInstanceOf(Array);
      response.data.data.capsules.forEach((capsule: any) => {
        expect(capsule.intensity).toBeGreaterThanOrEqual(7);
        expect(capsule.intensity).toBeLessThanOrEqual(10);
      });
    });

    it('should handle no capsules found', async () => {
      await provider.addInteraction({
        state: 'no products exist',
        uponReceiving: 'a request when no capsules exist',
        withRequest: {
          method: 'GET',
          path: API_ENDPOINTS.PRODUCTS.GET_CAPSULES,
        },
        willRespondWith: {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
          body: {
            success: true,
            message: 'No capsules found',
            data: {
              capsules: [],
              total: 0,
              page: 1,
              limit: 10,
            },
          },
        },
      });

      const response = await axios.get(`${baseURL}${API_ENDPOINTS.PRODUCTS.GET_CAPSULES}`);

      expect(response.status).toBe(200);
      expect(response.data.success).toBe(true);
      expect(response.data.data.capsules).toEqual([]);
      expect(response.data.data.total).toBe(0);
    });
  });

  describe('GET /api/products/capsules/:id', () => {
    it('should retrieve a specific capsule by ID', async () => {
      const capsuleId = '507f1f77bcf86cd799439011';

      await provider.addInteraction({
        state: PROVIDER_STATES.PRODUCT_WITH_ID_EXISTS,
        uponReceiving: 'a request for a specific capsule',
        withRequest: {
          method: 'GET',
          path: `/api/products/capsules/${capsuleId}`,
        },
        willRespondWith: {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
          body: {
            success: true,
            message: 'Capsule retrieved successfully',
            data: {
              capsule: {
                id: capsuleId,
                name: like('Quantum Roast'),
                description: like('A powerful blend for morning energy'),
                price: decimal(12.99),
                intensity: integer(8),
                flavorProfile: like('Bold and Rich'),
                powerBoost: integer(75),
                stock: integer(100),
                imageUrl: like('https://cosmic.com/images/quantum-roast.jpg'),
                isActive: true,
                category: 'capsule',
                ingredients: eachLike('Arabica beans'),
                brewingTips: like('Best at 95°C'),
                reviews: eachLike({
                  userId: like('507f1f77bcf86cd799439012'),
                  rating: integer(5),
                  comment: like('Excellent morning coffee!'),
                  createdAt: iso8601DateTimeWithMillis(),
                }),
                createdAt: iso8601DateTimeWithMillis(),
                updatedAt: iso8601DateTimeWithMillis(),
              },
            },
          },
        },
      });

      const response = await axios.get(`${baseURL}/api/products/capsules/${capsuleId}`);

      expect(response.status).toBe(200);
      expect(response.data.success).toBe(true);
      expect(response.data.data.capsule.id).toBe(capsuleId);
      expect(response.data.data.capsule.category).toBe('capsule');
      expect(response.data.data.capsule.reviews).toBeInstanceOf(Array);
    });

    it('should return 404 for non-existent capsule', async () => {
      const nonExistentId = '507f1f77bcf86cd799439999';

      await provider.addInteraction({
        state: 'product does not exist',
        uponReceiving: 'a request for non-existent capsule',
        withRequest: {
          method: 'GET',
          path: `/api/products/capsules/${nonExistentId}`,
        },
        willRespondWith: {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
          },
          body: {
            success: false,
            message: like('Capsule not found'),
            error: 'NOT_FOUND',
          },
        },
      });

      try {
        await axios.get(`${baseURL}/api/products/capsules/${nonExistentId}`);
      } catch (error: any) {
        expect(error.response.status).toBe(404);
        expect(error.response.data.success).toBe(false);
        expect(error.response.data.error).toBe('NOT_FOUND');
      }
    });
  });

  describe('GET /api/products/machines', () => {
    it('should retrieve a list of quantum brewing machines', async () => {
      await provider.addInteraction({
        state: PROVIDER_STATES.PRODUCTS_EXIST,
        uponReceiving: 'a request for all machines',
        withRequest: {
          method: 'GET',
          path: API_ENDPOINTS.PRODUCTS.GET_MACHINES,
        },
        willRespondWith: {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
          body: {
            success: true,
            message: 'Machines retrieved successfully',
            data: {
              machines: eachLike({
                id: like('507f1f77bcf86cd799440001'),
                name: like('QuantumBrew X1'),
                description: like('Professional quantum brewing system'),
                price: decimal(899.99),
                model: like('QBX1-2024'),
                features: eachLike('Quantum extraction'),
                specifications: {
                  dimensions: like('30x40x35 cm'),
                  weight: like('8.5 kg'),
                  power: like('1500W'),
                  capacity: like('2.5L water tank'),
                },
                stock: integer(15),
                imageUrl: like('https://cosmic.com/images/quantum-brew-x1.jpg'),
                isActive: true,
                category: 'machine',
                warranty: like('2 years'),
                createdAt: iso8601DateTimeWithMillis(),
                updatedAt: iso8601DateTimeWithMillis(),
              }),
              total: integer(5),
              page: integer(1),
              limit: integer(10),
            },
          },
        },
      });

      const response = await axios.get(`${baseURL}${API_ENDPOINTS.PRODUCTS.GET_MACHINES}`);

      expect(response.status).toBe(200);
      expect(response.data.success).toBe(true);
      expect(response.data.data.machines).toBeInstanceOf(Array);
      expect(response.data.data.machines[0]).toHaveProperty('model');
      expect(response.data.data.machines[0]).toHaveProperty('specifications');
      expect(response.data.data.machines[0]).toHaveProperty('warranty');
    });

    it('should filter machines by price range', async () => {
      await provider.addInteraction({
        state: PROVIDER_STATES.PRODUCTS_EXIST,
        uponReceiving: 'a request for machines in price range',
        withRequest: {
          method: 'GET',
          path: API_ENDPOINTS.PRODUCTS.GET_MACHINES,
          query: {
            minPrice: '500',
            maxPrice: '1500',
          },
        },
        willRespondWith: {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
          body: {
            success: true,
            message: 'Machines retrieved successfully',
            data: {
              machines: eachLike({
                id: like('507f1f77bcf86cd799440001'),
                name: like('QuantumBrew Pro'),
                price: decimal(1299.99), // Within range
                model: like('QBP-2024'),
                stock: integer(8),
              }),
              total: integer(2),
              page: integer(1),
              limit: integer(10),
            },
          },
        },
      });

      const response = await axios.get(`${baseURL}${API_ENDPOINTS.PRODUCTS.GET_MACHINES}`, {
        params: {
          minPrice: '500',
          maxPrice: '1500',
        },
      });

      expect(response.status).toBe(200);
      expect(response.data.success).toBe(true);
      response.data.data.machines.forEach((machine: any) => {
        expect(machine.price).toBeGreaterThanOrEqual(500);
        expect(machine.price).toBeLessThanOrEqual(1500);
      });
    });
  });

  describe('GET /api/products/machines/:id', () => {
    it('should retrieve a specific machine by ID', async () => {
      const machineId = '507f1f77bcf86cd799440001';

      await provider.addInteraction({
        state: PROVIDER_STATES.PRODUCT_WITH_ID_EXISTS,
        uponReceiving: 'a request for a specific machine',
        withRequest: {
          method: 'GET',
          path: `/api/products/machines/${machineId}`,
        },
        willRespondWith: {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
          body: {
            success: true,
            message: 'Machine retrieved successfully',
            data: {
              machine: {
                id: machineId,
                name: like('QuantumBrew X1'),
                description: like('Professional quantum brewing system'),
                price: decimal(899.99),
                model: like('QBX1-2024'),
                features: eachLike('Quantum extraction'),
                specifications: {
                  dimensions: like('30x40x35 cm'),
                  weight: like('8.5 kg'),
                  power: like('1500W'),
                  capacity: like('2.5L water tank'),
                  brewingModes: eachLike('Espresso'),
                },
                stock: integer(15),
                imageUrl: like('https://cosmic.com/images/quantum-brew-x1.jpg'),
                gallery: eachLike('https://cosmic.com/images/qbx1-gallery-1.jpg'),
                isActive: true,
                category: 'machine',
                warranty: '2 years',
                supportDocuments: eachLike({
                  type: like('manual'),
                  url: like('https://cosmic.com/docs/qbx1-manual.pdf'),
                }),
                reviews: eachLike({
                  userId: like('507f1f77bcf86cd799439012'),
                  rating: integer(5),
                  comment: like('Best investment for coffee lovers!'),
                  createdAt: iso8601DateTimeWithMillis(),
                }),
                createdAt: iso8601DateTimeWithMillis(),
                updatedAt: iso8601DateTimeWithMillis(),
              },
            },
          },
        },
      });

      const response = await axios.get(`${baseURL}/api/products/machines/${machineId}`);

      expect(response.status).toBe(200);
      expect(response.data.success).toBe(true);
      expect(response.data.data.machine.id).toBe(machineId);
      expect(response.data.data.machine.category).toBe('machine');
      expect(response.data.data.machine.specifications).toBeDefined();
      expect(response.data.data.machine.warranty).toBe('2 years');
    });

    it('should handle out of stock products', async () => {
      const productId = '507f1f77bcf86cd799439011';

      await provider.addInteraction({
        state: PROVIDER_STATES.PRODUCT_OUT_OF_STOCK,
        uponReceiving: 'a request for out of stock product',
        withRequest: {
          method: 'GET',
          path: `/api/products/capsules/${productId}`,
        },
        willRespondWith: {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
          body: {
            success: true,
            message: 'Product retrieved but out of stock',
            data: {
              capsule: {
                id: productId,
                name: like('Limited Edition Cosmic Blend'),
                stock: 0,
                isActive: true,
                availability: 'out_of_stock',
                nextRestockDate: iso8601DateTimeWithMillis(),
                notifyWhenAvailable: true,
              },
            },
          },
        },
      });

      const response = await axios.get(`${baseURL}/api/products/capsules/${productId}`);

      expect(response.status).toBe(200);
      expect(response.data.data.capsule.stock).toBe(0);
      expect(response.data.data.capsule.availability).toBe('out_of_stock');
      expect(response.data.data.capsule.nextRestockDate).toBeDefined();
    });
  });
});