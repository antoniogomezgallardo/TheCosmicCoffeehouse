import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import Capsule from '../../models/Capsule';
import Machine from '../../models/Machine';
import productsRoutes from '../../routes/products.routes';

// Create Express app for testing
const app = express();
app.use(express.json());
app.use('/api/products', productsRoutes);

// MongoDB Memory Server instance
let mongoServer: MongoMemoryServer;

// Test data fixtures
const sampleCapsules = [
  {
    name: 'Cosmic Energy Blend',
    superpower: 'Enhanced Mental Clarity',
    description: 'A powerful blend that enhances mental clarity',
    powerType: 'mental',
    duration: '4-6 hours',
    sideEffects: ['Mild headache', 'Increased focus'],
    rarity: 'common',
    intensity: 7,
    energyRating: 80,
    quantumStability: 85,
    discoveredBy: 'Dr. Cosmic',
    discoveryDate: new Date('2024-01-15'),
    price: 15.99,
    requiredMachines: [],
    flavorProfile: {
      primary: 'Coffee',
      secondary: 'Vanilla',
      notes: ['Sweet', 'Smooth']
    },
    inStock: 50,
    imageUrl: 'https://example.com/cosmic-energy.jpg',
    warnings: ['May cause jitters'],
    isActive: true,
    views: 0
  },
  {
    name: 'Legendary Time Capsule',
    superpower: 'Time Manipulation',
    description: 'Grants the power to slow down time perception',
    powerType: 'temporal',
    duration: '2-3 hours',
    sideEffects: ['Temporal disorientation'],
    rarity: 'legendary',
    intensity: 10,
    energyRating: 100,
    quantumStability: 95,
    discoveredBy: 'Dr. Time',
    discoveryDate: new Date('2024-02-20'),
    price: 99.99,
    requiredMachines: [],
    flavorProfile: {
      primary: 'Dark Roast',
      secondary: 'Caramel',
      notes: ['Bold', 'Complex']
    },
    inStock: 5,
    imageUrl: 'https://example.com/time-capsule.jpg',
    warnings: ['May cause temporal confusion'],
    isActive: true,
    views: 0
  },
  {
    name: 'Epic Strength Boost',
    superpower: 'Physical Enhancement',
    description: 'Enhances physical strength dramatically',
    powerType: 'physical',
    duration: '3-4 hours',
    sideEffects: ['Muscle soreness'],
    rarity: 'epic',
    intensity: 9,
    energyRating: 95,
    quantumStability: 90,
    discoveredBy: 'Dr. Strong',
    discoveryDate: new Date('2024-03-10'),
    price: 49.99,
    requiredMachines: [],
    flavorProfile: {
      primary: 'Espresso',
      secondary: 'Chocolate',
      notes: ['Rich', 'Intense']
    },
    inStock: 20,
    imageUrl: 'https://example.com/strength-boost.jpg',
    warnings: ['Not for children'],
    isActive: true,
    views: 0
  },
  {
    name: 'Inactive Test Capsule',
    superpower: 'Test Power',
    description: 'This capsule should not appear in results',
    powerType: 'mental',
    duration: '1-2 hours',
    sideEffects: ['None'],
    rarity: 'common',
    intensity: 5,
    energyRating: 50,
    quantumStability: 60,
    discoveredBy: 'Test Lab',
    discoveryDate: new Date('2024-04-01'),
    price: 10.99,
    requiredMachines: [],
    flavorProfile: {
      primary: 'Mild',
      secondary: 'Neutral',
      notes: ['Bland']
    },
    inStock: 0,
    imageUrl: 'https://example.com/test-capsule.jpg',
    warnings: [],
    isActive: false,
    views: 0
  }
];

const sampleMachines = [
  {
    name: 'Quantum Brew Pro X1',
    machineModel: 'QBP-X1-2024',
    type: 'quantum',
    description: 'Professional quantum brewing machine',
    capabilities: ['Quantum brewing', 'Automatic temperature control'],
    compatibleCapsuleTypes: ['mental', 'physical'],
    powerSource: 'quantum-cells',
    price: 15000,
    dimensions: {
      width: 45,
      height: 35,
      depth: 30,
      weight: 25
    },
    specifications: {
      brewingPressure: '15 bar',
      quantumAmplification: 95,
      stabilityField: 90,
      maxPowerOutput: 2500
    },
    warranty: '2 years',
    manufacturingDate: new Date('2024-01-01'),
    manufacturer: 'Quantum Corp',
    safetyRating: 95,
    efficiencyRating: 90,
    maintenanceInterval: '6 months',
    inStock: 10,
    imageUrl: 'https://example.com/quantum-pro.jpg',
    manualUrl: 'https://example.com/manuals/quantum-pro.pdf',
    isActive: true,
    views: 0
  },
  {
    name: 'Basic Brew Machine',
    machineModel: 'BBM-001-2024',
    type: 'portable',
    description: 'Entry level brewing machine',
    capabilities: ['Basic brewing', 'Manual controls'],
    compatibleCapsuleTypes: ['mental'],
    powerSource: 'compact-batteries',
    price: 5000,
    dimensions: {
      width: 30,
      height: 25,
      depth: 20,
      weight: 15
    },
    specifications: {
      brewingPressure: '9 bar',
      quantumAmplification: 60,
      stabilityField: 70,
      maxPowerOutput: 1000
    },
    warranty: '1 year',
    manufacturingDate: new Date('2024-02-01'),
    manufacturer: 'Basic Corp',
    safetyRating: 85,
    efficiencyRating: 75,
    maintenanceInterval: '3 months',
    inStock: 25,
    imageUrl: 'https://example.com/basic-brew.jpg',
    manualUrl: 'https://example.com/manuals/basic-brew.pdf',
    isActive: true,
    views: 0
  },
  {
    name: 'Ultra Premium Quantum Master',
    machineModel: 'QPM-ULTRA-2024',
    type: 'quantum',
    description: 'The ultimate quantum brewing experience',
    capabilities: ['Ultra quantum brewing', 'AI controls', 'Self-maintenance'],
    compatibleCapsuleTypes: ['mental', 'physical', 'temporal'],
    powerSource: 'quantum-cells',
    price: 50000,
    dimensions: {
      width: 60,
      height: 50,
      depth: 40,
      weight: 45
    },
    specifications: {
      brewingPressure: '20 bar',
      quantumAmplification: 99,
      stabilityField: 98,
      maxPowerOutput: 5000
    },
    warranty: '5 years',
    manufacturingDate: new Date('2024-03-01'),
    manufacturer: 'Ultra Corp',
    safetyRating: 99,
    efficiencyRating: 98,
    maintenanceInterval: '12 months',
    inStock: 2,
    imageUrl: 'https://example.com/ultra-quantum.jpg',
    manualUrl: 'https://example.com/manuals/ultra-quantum.pdf',
    isActive: true,
    views: 0
  },
  {
    name: 'Inactive Machine',
    machineModel: 'INACTIVE-001',
    type: 'portable',
    description: 'This machine should not appear in results',
    capabilities: ['Basic brewing'],
    compatibleCapsuleTypes: ['mental'],
    powerSource: 'kinetic-generators',
    price: 1000,
    dimensions: {
      width: 20,
      height: 15,
      depth: 15,
      weight: 8
    },
    specifications: {
      brewingPressure: '5 bar',
      quantumAmplification: 30,
      stabilityField: 40,
      maxPowerOutput: 500
    },
    warranty: '6 months',
    manufacturingDate: new Date('2024-04-01'),
    manufacturer: 'Test Corp',
    safetyRating: 60,
    efficiencyRating: 50,
    maintenanceInterval: '1 month',
    inStock: 0,
    imageUrl: 'https://example.com/inactive.jpg',
    manualUrl: 'https://example.com/manuals/inactive.pdf',
    isActive: false,
    views: 0
  }
];

describe('Products Routes', () => {
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
    await Capsule.deleteMany({});
    await Machine.deleteMany({});
    jest.clearAllMocks();

    // Insert test data
    await Capsule.insertMany(sampleCapsules);
    await Machine.insertMany(sampleMachines);
  });

  describe('GET /api/products/capsules', () => {
    describe('Happy Path', () => {
      it('should return all active capsules', async () => {
        const response = await request(app)
          .get('/api/products/capsules')
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveLength(3); // Only active capsules

        // Verify all returned capsules are active
        response.body.data.forEach((capsule: any) => {
          expect(capsule.isActive).toBe(true);
        });
      });

      it('should return capsules sorted by creation date (newest first)', async () => {
        const response = await request(app)
          .get('/api/products/capsules')
          .expect(200);

        const capsules = response.body.data;
        expect(capsules).toHaveLength(3);

        // Verify descending order by creation date
        for (let i = 0; i < capsules.length - 1; i++) {
          const currentDate = new Date(capsules[i].createdAt);
          const nextDate = new Date(capsules[i + 1].createdAt);
          expect(currentDate.getTime()).toBeGreaterThanOrEqual(nextDate.getTime());
        }
      });

      it('should return empty array when no active capsules exist', async () => {
        // Make all capsules inactive
        await Capsule.updateMany({}, { isActive: false });

        const response = await request(app)
          .get('/api/products/capsules')
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data).toEqual([]);
      });

      it('should include all required capsule fields', async () => {
        const response = await request(app)
          .get('/api/products/capsules')
          .expect(200);

        const capsule = response.body.data[0];
        expect(capsule).toHaveProperty('_id');
        expect(capsule).toHaveProperty('name');
        expect(capsule).toHaveProperty('description');
        expect(capsule).toHaveProperty('powerType');
        expect(capsule).toHaveProperty('rarity');
        expect(capsule).toHaveProperty('intensity');
        expect(capsule).toHaveProperty('energyRating');
        expect(capsule).toHaveProperty('price');
        expect(capsule).toHaveProperty('inStock');
        expect(capsule).toHaveProperty('isActive');
        expect(capsule).toHaveProperty('views');
        expect(capsule).toHaveProperty('createdAt');
      });
    });

    describe('Error Handling', () => {
      it('should handle database errors gracefully', async () => {
        // Close database connection to simulate error
        await mongoose.disconnect();

        const response = await request(app)
          .get('/api/products/capsules')
          .expect(500);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toBeDefined();

        // Reconnect for other tests
        const mongoUri = mongoServer.getUri();
        await mongoose.connect(mongoUri);
      });
    });
  });

  describe('GET /api/products/capsules/:id', () => {
    let capsuleId: string;

    beforeEach(async () => {
      const capsule = await Capsule.findOne({ name: 'Cosmic Energy Blend' });
      capsuleId = (capsule!._id as any).toString();
    });

    describe('Happy Path', () => {
      it('should return specific capsule by ID', async () => {
        const response = await request(app)
          .get(`/api/products/capsules/${capsuleId}`)
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data._id).toBe(capsuleId);
        expect(response.body.data.name).toBe('Cosmic Energy Blend');
      });

      it('should increment view count when retrieving capsule', async () => {
        // Get initial view count
        const initialCapsule = await Capsule.findById(capsuleId);
        const initialViews = initialCapsule!.views;

        // Request the capsule
        const response = await request(app)
          .get(`/api/products/capsules/${capsuleId}`)
          .expect(200);

        expect(response.body.data.views).toBe(initialViews + 1);

        // Verify in database
        const updatedCapsule = await Capsule.findById(capsuleId);
        expect(updatedCapsule!.views).toBe(initialViews + 1);
      });

      it('should handle multiple consecutive views', async () => {
        // Make multiple requests
        await request(app).get(`/api/products/capsules/${capsuleId}`);
        await request(app).get(`/api/products/capsules/${capsuleId}`);
        const response = await request(app)
          .get(`/api/products/capsules/${capsuleId}`)
          .expect(200);

        expect(response.body.data.views).toBe(3);
      });
    });

    describe('Error Cases', () => {
      it('should return 404 for non-existent capsule ID', async () => {
        const nonExistentId = new mongoose.Types.ObjectId();

        const response = await request(app)
          .get(`/api/products/capsules/${nonExistentId}`)
          .expect(404);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Capsule not found');
      });

      it('should handle invalid ObjectId format', async () => {
        const response = await request(app)
          .get('/api/products/capsules/invalid_id_format')
          .expect(500);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toBeDefined();
      });

      it('should handle very long ID parameter', async () => {
        const longId = 'a'.repeat(1000);

        const response = await request(app)
          .get(`/api/products/capsules/${longId}`)
          .expect(500);

        expect(response.body.success).toBe(false);
      });
    });

    describe('Database Integration', () => {
      it('should handle database errors gracefully', async () => {
        // Close database connection to simulate error
        await mongoose.disconnect();

        const response = await request(app)
          .get(`/api/products/capsules/${capsuleId}`)
          .expect(500);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toBeDefined();

        // Reconnect for other tests
        const mongoUri = mongoServer.getUri();
        await mongoose.connect(mongoUri);
      });
    });
  });

  describe('GET /api/products/machines', () => {
    describe('Happy Path', () => {
      it('should return all active machines', async () => {
        const response = await request(app)
          .get('/api/products/machines')
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveLength(3); // Only active machines

        // Verify all returned machines are active
        response.body.data.forEach((machine: any) => {
          expect(machine.isActive).toBe(true);
        });
      });

      it('should return machines sorted by creation date (newest first)', async () => {
        const response = await request(app)
          .get('/api/products/machines')
          .expect(200);

        const machines = response.body.data;
        expect(machines).toHaveLength(3);

        // Verify descending order by creation date
        for (let i = 0; i < machines.length - 1; i++) {
          const currentDate = new Date(machines[i].createdAt);
          const nextDate = new Date(machines[i + 1].createdAt);
          expect(currentDate.getTime()).toBeGreaterThanOrEqual(nextDate.getTime());
        }
      });

      it('should return empty array when no active machines exist', async () => {
        // Make all machines inactive
        await Machine.updateMany({}, { isActive: false });

        const response = await request(app)
          .get('/api/products/machines')
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data).toEqual([]);
      });

      it('should include all required machine fields', async () => {
        const response = await request(app)
          .get('/api/products/machines')
          .expect(200);

        const machine = response.body.data[0];
        expect(machine).toHaveProperty('_id');
        expect(machine).toHaveProperty('name');
        expect(machine).toHaveProperty('machineModel');
        expect(machine).toHaveProperty('description');
        expect(machine).toHaveProperty('price');
        expect(machine).toHaveProperty('specifications');
        expect(machine).toHaveProperty('type');
        expect(machine).toHaveProperty('powerSource');
        expect(machine).toHaveProperty('inStock');
        expect(machine).toHaveProperty('isActive');
        expect(machine).toHaveProperty('views');
        expect(machine).toHaveProperty('createdAt');
      });
    });

    describe('Error Handling', () => {
      it('should handle database errors gracefully', async () => {
        // Close database connection to simulate error
        await mongoose.disconnect();

        const response = await request(app)
          .get('/api/products/machines')
          .expect(500);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toBeDefined();

        // Reconnect for other tests
        const mongoUri = mongoServer.getUri();
        await mongoose.connect(mongoUri);
      });
    });
  });

  describe('GET /api/products/machines/:id', () => {
    let machineId: string;

    beforeEach(async () => {
      const machine = await Machine.findOne({ name: 'Quantum Brew Pro X1' });
      machineId = (machine!._id as any).toString();
    });

    describe('Happy Path', () => {
      it('should return specific machine by ID', async () => {
        const response = await request(app)
          .get(`/api/products/machines/${machineId}`)
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data._id).toBe(machineId);
        expect(response.body.data.name).toBe('Quantum Brew Pro X1');
      });

      it('should increment view count when retrieving machine', async () => {
        // Get initial view count
        const initialMachine = await Machine.findById(machineId);
        const initialViews = initialMachine!.views;

        // Request the machine
        const response = await request(app)
          .get(`/api/products/machines/${machineId}`)
          .expect(200);

        expect(response.body.data.views).toBe(initialViews + 1);

        // Verify in database
        const updatedMachine = await Machine.findById(machineId);
        expect(updatedMachine!.views).toBe(initialViews + 1);
      });

      it('should handle multiple consecutive views', async () => {
        // Make multiple requests
        await request(app).get(`/api/products/machines/${machineId}`);
        await request(app).get(`/api/products/machines/${machineId}`);
        const response = await request(app)
          .get(`/api/products/machines/${machineId}`)
          .expect(200);

        expect(response.body.data.views).toBe(3);
      });
    });

    describe('Error Cases', () => {
      it('should return 404 for non-existent machine ID', async () => {
        const nonExistentId = new mongoose.Types.ObjectId();

        const response = await request(app)
          .get(`/api/products/machines/${nonExistentId}`)
          .expect(404);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Machine not found');
      });

      it('should handle invalid ObjectId format', async () => {
        const response = await request(app)
          .get('/api/products/machines/invalid_id_format')
          .expect(500);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toBeDefined();
      });

      it('should handle very long ID parameter', async () => {
        const longId = 'a'.repeat(1000);

        const response = await request(app)
          .get(`/api/products/machines/${longId}`)
          .expect(500);

        expect(response.body.success).toBe(false);
      });
    });

    describe('Database Integration', () => {
      it('should handle database errors gracefully', async () => {
        // Close database connection to simulate error
        await mongoose.disconnect();

        const response = await request(app)
          .get(`/api/products/machines/${machineId}`)
          .expect(500);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toBeDefined();

        // Reconnect for other tests
        const mongoUri = mongoServer.getUri();
        await mongoose.connect(mongoUri);
      });
    });
  });

  describe('GET /api/products/featured', () => {
    describe('Happy Path', () => {
      it('should return featured capsules and machines', async () => {
        const response = await request(app)
          .get('/api/products/featured')
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveProperty('capsules');
        expect(response.body.data).toHaveProperty('machines');
        expect(Array.isArray(response.body.data.capsules)).toBe(true);
        expect(Array.isArray(response.body.data.machines)).toBe(true);
      });

      it('should return only epic and legendary capsules', async () => {
        const response = await request(app)
          .get('/api/products/featured')
          .expect(200);

        const capsules = response.body.data.capsules;
        capsules.forEach((capsule: any) => {
          expect(['epic', 'legendary']).toContain(capsule.rarity);
          expect(capsule.isActive).toBe(true);
        });
      });

      it('should return only high-end machines (price >= 10000)', async () => {
        const response = await request(app)
          .get('/api/products/featured')
          .expect(200);

        const machines = response.body.data.machines;
        machines.forEach((machine: any) => {
          expect(machine.price).toBeGreaterThanOrEqual(10000);
          expect(machine.isActive).toBe(true);
        });
      });

      it('should limit capsules to maximum 4 items', async () => {
        // Add more epic/legendary capsules to test limit
        const extraCapsules = Array.from({ length: 6 }, (_, i) => ({
          name: `Extra Epic Capsule ${i}`,
          superpower: `Extra Epic Power ${i}`,
          description: 'Extra epic capsule for testing',
          powerType: 'mental',
          duration: '2-3 hours',
          sideEffects: ['None'],
          rarity: 'epic',
          intensity: 8,
          energyRating: 85,
          quantumStability: 80,
          discoveredBy: 'Test Lab',
          discoveryDate: new Date('2024-05-01'),
          price: 39.99,
          requiredMachines: [],
          flavorProfile: {
            primary: 'Test',
            secondary: 'Flavor',
            notes: ['Testing']
          },
          inStock: 10,
          imageUrl: `https://example.com/extra-epic-${i}.jpg`,
          warnings: [],
          isActive: true,
          views: 0
        }));

        await Capsule.insertMany(extraCapsules);

        const response = await request(app)
          .get('/api/products/featured')
          .expect(200);

        expect(response.body.data.capsules.length).toBeLessThanOrEqual(4);
      });

      it('should limit machines to maximum 4 items', async () => {
        // Add more expensive machines to test limit
        const extraMachines = Array.from({ length: 6 }, (_, i) => ({
          name: `Extra Premium Machine ${i}`,
          machineModel: `EPM-${i}-2024`,
          type: 'quantum',
          description: 'Extra premium machine for testing',
          capabilities: ['Premium brewing'],
          compatibleCapsuleTypes: ['mental', 'physical'],
          powerSource: 'quantum-cells',
          price: 20000 + i * 1000,
          dimensions: {
            width: 50,
            height: 40,
            depth: 35,
            weight: 30
          },
          specifications: {
            brewingPressure: '18 bar',
            quantumAmplification: 90,
            stabilityField: 85,
            maxPowerOutput: 3000
          },
          warranty: '3 years',
          manufacturingDate: new Date('2024-05-01'),
          manufacturer: 'Test Corp',
          safetyRating: 90,
          efficiencyRating: 85,
          maintenanceInterval: '9 months',
          inStock: 5,
          imageUrl: `https://example.com/extra-premium-${i}.jpg`,
          manualUrl: `https://example.com/manuals/extra-premium-${i}.pdf`,
          isActive: true,
          views: 0
        }));

        await Machine.insertMany(extraMachines);

        const response = await request(app)
          .get('/api/products/featured')
          .expect(200);

        expect(response.body.data.machines.length).toBeLessThanOrEqual(4);
      });

      it('should handle empty results gracefully', async () => {
        // Remove all epic/legendary capsules and expensive machines
        await Capsule.updateMany({ rarity: { $in: ['epic', 'legendary'] } }, { isActive: false });
        await Machine.updateMany({ price: { $gte: 10000 } }, { isActive: false });

        const response = await request(app)
          .get('/api/products/featured')
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data.capsules).toEqual([]);
        expect(response.body.data.machines).toEqual([]);
      });
    });

    describe('Business Logic', () => {
      it('should only include active products in featured selection', async () => {
        // Make some epic/legendary capsules inactive
        await Capsule.updateOne({ rarity: 'legendary' }, { isActive: false });

        const response = await request(app)
          .get('/api/products/featured')
          .expect(200);

        const capsules = response.body.data.capsules;
        capsules.forEach((capsule: any) => {
          expect(capsule.isActive).toBe(true);
        });

        // Should not include the deactivated legendary capsule
        const legendaryCount = capsules.filter((c: any) => c.rarity === 'legendary').length;
        expect(legendaryCount).toBe(0);
      });

      it('should maintain proper data structure for featured products', async () => {
        const response = await request(app)
          .get('/api/products/featured')
          .expect(200);

        expect(response.body).toMatchObject({
          success: true,
          data: {
            capsules: expect.any(Array),
            machines: expect.any(Array)
          }
        });
      });
    });

    describe('Error Handling', () => {
      it('should handle database errors gracefully', async () => {
        // Close database connection to simulate error
        await mongoose.disconnect();

        const response = await request(app)
          .get('/api/products/featured')
          .expect(500);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toBeDefined();

        // Reconnect for other tests
        const mongoUri = mongoServer.getUri();
        await mongoose.connect(mongoUri);
      });
    });
  });

  describe('Integration Tests - Product Catalog Workflow', () => {
    it('should handle complete product browsing workflow', async () => {
      // 1. Browse all capsules
      const capsulesResponse = await request(app)
        .get('/api/products/capsules')
        .expect(200);

      expect(capsulesResponse.body.data.length).toBeGreaterThan(0);
      const firstCapsule = capsulesResponse.body.data[0];

      // 2. View specific capsule details
      const capsuleDetailResponse = await request(app)
        .get(`/api/products/capsules/${firstCapsule._id}`)
        .expect(200);

      expect(capsuleDetailResponse.body.data.views).toBe(firstCapsule.views + 1);

      // 3. Browse all machines
      const machinesResponse = await request(app)
        .get('/api/products/machines')
        .expect(200);

      expect(machinesResponse.body.data.length).toBeGreaterThan(0);
      const firstMachine = machinesResponse.body.data[0];

      // 4. View specific machine details
      const machineDetailResponse = await request(app)
        .get(`/api/products/machines/${firstMachine._id}`)
        .expect(200);

      expect(machineDetailResponse.body.data.views).toBe(firstMachine.views + 1);

      // 5. Check featured products
      const featuredResponse = await request(app)
        .get('/api/products/featured')
        .expect(200);

      expect(featuredResponse.body.data.capsules).toBeDefined();
      expect(featuredResponse.body.data.machines).toBeDefined();
    });

    it('should maintain view count consistency', async () => {
      const capsule = await Capsule.findOne({ name: 'Cosmic Energy Blend' });
      const initialViews = capsule!.views;

      // View the same capsule multiple times
      for (let i = 0; i < 5; i++) {
        await request(app)
          .get(`/api/products/capsules/${(capsule!._id as any).toString()}`)
          .expect(200);
      }

      // Verify final view count
      const finalCapsule = await Capsule.findById((capsule!._id as any).toString());
      expect(finalCapsule!.views).toBe(initialViews + 5);
    });

    it('should handle concurrent product requests', async () => {
      const capsule = await Capsule.findOne({ name: 'Cosmic Energy Blend' });
      const machine = await Machine.findOne({ name: 'Quantum Brew Pro X1' });

      // Make concurrent requests
      const requests = [
        request(app).get('/api/products/capsules'),
        request(app).get('/api/products/machines'),
        request(app).get('/api/products/featured'),
        request(app).get(`/api/products/capsules/${(capsule!._id as any).toString()}`),
        request(app).get(`/api/products/machines/${(machine!._id as any).toString()}`)
      ];

      const responses = await Promise.all(requests);

      // All requests should succeed
      responses.forEach(response => {
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
      });
    });
  });

  describe('Performance Tests', () => {
    it('should handle bulk product requests efficiently', async () => {
      const startTime = Date.now();

      // Create multiple product requests
      const requests = [];
      for (let i = 0; i < 20; i++) {
        requests.push(request(app).get('/api/products/capsules'));
        requests.push(request(app).get('/api/products/machines'));
        requests.push(request(app).get('/api/products/featured'));
      }

      const responses = await Promise.all(requests);
      const endTime = Date.now();

      // All requests should succeed
      responses.forEach(response => {
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
      });

      // Performance should be reasonable (less than 10 seconds for 60 requests)
      expect(endTime - startTime).toBeLessThan(10000);
    });

    it('should handle rapid view count increments', async () => {
      const capsule = await Capsule.findOne({ name: 'Cosmic Energy Blend' });
      const initialViews = capsule!.views;

      // Make 10 rapid concurrent view requests
      const viewRequests = Array.from({ length: 10 }, () =>
        request(app).get(`/api/products/capsules/${(capsule!._id as any).toString()}`)
      );

      const responses = await Promise.all(viewRequests);

      // All requests should succeed
      responses.forEach(response => {
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
      });

      // Final view count should be incremented (may be less than 10 due to race conditions)
      const finalCapsule = await Capsule.findById((capsule!._id as any).toString());
      expect(finalCapsule!.views).toBeGreaterThan(initialViews);
      expect(finalCapsule!.views).toBeLessThanOrEqual(initialViews + 10);
    });
  });

  describe('Data Validation Tests', () => {
    it('should return products with consistent data types', async () => {
      const response = await request(app)
        .get('/api/products/capsules')
        .expect(200);

      const capsule = response.body.data[0];
      expect(typeof capsule.name).toBe('string');
      expect(typeof capsule.price).toBe('number');
      expect(typeof capsule.intensity).toBe('number');
      expect(typeof capsule.energyRating).toBe('number');
      expect(typeof capsule.inStock).toBe('number');
      expect(typeof capsule.isActive).toBe('boolean');
      expect(typeof capsule.views).toBe('number');
    });

    it('should return machines with consistent data types', async () => {
      const response = await request(app)
        .get('/api/products/machines')
        .expect(200);

      const machine = response.body.data[0];
      expect(typeof machine.name).toBe('string');
      expect(typeof machine.machineModel).toBe('string');
      expect(typeof machine.price).toBe('number');
      expect(typeof machine.inStock).toBe('number');
      expect(typeof machine.isActive).toBe('boolean');
      expect(typeof machine.views).toBe('number');
      expect(typeof machine.specifications).toBe('object');
    });
  });
});