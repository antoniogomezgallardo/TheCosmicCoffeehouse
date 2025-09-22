import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import Capsule from '../../models/Capsule';
import { PowerType, Rarity } from '../../types';

// MongoDB Memory Server instance
let mongoServer: MongoMemoryServer;

// Test data
const validCapsuleData = {
  name: 'Test Telekinesis Capsule',
  superpower: 'Telekinesis',
  description: 'Grants the ability to move objects with your mind',
  powerType: PowerType.MENTAL,
  duration: '2 hours',
  sideEffects: ['Mild headache', 'Temporary fatigue'],
  rarity: Rarity.RARE,
  price: 299.99,
  requiredMachines: ['neural-link-v2', 'quantum-processor'],
  flavorProfile: {
    primary: 'Mint',
    secondary: 'Citrus',
    notes: ['Refreshing', 'Energizing']
  },
  intensity: 7,
  energyRating: 85,
  quantumStability: 92,
  discoveredBy: 'Dr. Sarah Chen',
  discoveryDate: new Date('2023-01-15'),
  inStock: 50,
  imageUrl: 'https://example.com/telekinesis.jpg',
  warnings: ['Do not use while driving', 'Avoid heavy machinery'],
  testimonials: [],
  views: 0,
  purchases: 0,
  rating: 0,
  isActive: true
};

describe('Capsule Model', () => {
  // Setup and teardown
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await Capsule.deleteMany({});
    jest.clearAllMocks();
  });

  describe('Schema Validation', () => {
    it('should create a capsule with valid data', async () => {
      const capsule = new Capsule(validCapsuleData);
      const savedCapsule = await capsule.save();

      expect(savedCapsule._id).toBeDefined();
      expect(savedCapsule.name).toBe(validCapsuleData.name);
      expect(savedCapsule.powerType).toBe(validCapsuleData.powerType);
      expect(savedCapsule.rarity).toBe(validCapsuleData.rarity);
      expect(savedCapsule.price).toBe(validCapsuleData.price);
      expect(savedCapsule.intensity).toBe(validCapsuleData.intensity);
    });

    it('should require name field', async () => {
      const capsuleData = { ...validCapsuleData };
      delete (capsuleData as any).name;

      const capsule = new Capsule(capsuleData);

      await expect(capsule.save()).rejects.toThrow('required');
    });

    it('should enforce unique name constraint', async () => {
      // Create first capsule
      const capsule1 = new Capsule(validCapsuleData);
      await capsule1.save();

      // Try to create second capsule with same name
      const capsule2 = new Capsule(validCapsuleData);

      await expect(capsule2.save()).rejects.toThrow();
    });

    it('should validate powerType enum', async () => {
      const capsuleData = { ...validCapsuleData, powerType: 'invalid-power' };
      const capsule = new Capsule(capsuleData);

      await expect(capsule.save()).rejects.toThrow();
    });

    it('should validate rarity enum', async () => {
      const capsuleData = { ...validCapsuleData, rarity: 'invalid-rarity' };
      const capsule = new Capsule(capsuleData);

      await expect(capsule.save()).rejects.toThrow();
    });

    it('should validate price minimum value', async () => {
      const capsuleData = { ...validCapsuleData, price: -10 };
      const capsule = new Capsule(capsuleData);

      await expect(capsule.save()).rejects.toThrow();
    });

    it('should validate intensity range (1-10)', async () => {
      const invalidIntensities = [0, 11, -5];

      for (const intensity of invalidIntensities) {
        const capsuleData = {
          ...validCapsuleData,
          name: `Test Capsule ${intensity}`,
          intensity
        };
        const capsule = new Capsule(capsuleData);

        await expect(capsule.save()).rejects.toThrow();
      }
    });

    it('should validate energyRating range (1-100)', async () => {
      const invalidEnergyRatings = [0, 101, -10];

      for (const energyRating of invalidEnergyRatings) {
        const capsuleData = {
          ...validCapsuleData,
          name: `Test Energy ${energyRating}`,
          energyRating
        };
        const capsule = new Capsule(capsuleData);

        await expect(capsule.save()).rejects.toThrow();
      }
    });

    it('should set default values correctly', async () => {
      const minimalData = {
        ...validCapsuleData,
        inStock: undefined,
        views: undefined,
        purchases: undefined,
        rating: undefined,
        isActive: undefined
      };

      const capsule = new Capsule(minimalData);
      const savedCapsule = await capsule.save();

      expect(savedCapsule.inStock).toBe(0);
      expect(savedCapsule.views).toBe(0);
      expect(savedCapsule.purchases).toBe(0);
      expect(savedCapsule.rating).toBe(0);
      expect(savedCapsule.isActive).toBe(true);
    });

    it('should trim name field', async () => {
      const capsuleData = {
        ...validCapsuleData,
        name: '  Trimmed Capsule  '
      };

      const capsule = new Capsule(capsuleData);
      const savedCapsule = await capsule.save();

      expect(savedCapsule.name).toBe('Trimmed Capsule');
    });

    it('should validate required fields', async () => {
      const requiredFields = ['superpower', 'description', 'powerType', 'duration', 'rarity', 'price', 'intensity', 'energyRating', 'quantumStability', 'discoveredBy', 'discoveryDate', 'imageUrl'];

      for (const field of requiredFields) {
        const capsuleData = { ...validCapsuleData };
        delete (capsuleData as any)[field];
        (capsuleData as any).name = `Test ${field}`;

        const capsule = new Capsule(capsuleData);

        await expect(capsule.save()).rejects.toThrow();
      }
    });
  });

  describe('Business Logic - Instance Methods', () => {
    let capsule: any;

    beforeEach(async () => {
      capsule = new Capsule(validCapsuleData);
      await capsule.save();
    });

    describe('Machine Compatibility', () => {
      it('should check compatibility with required machines', () => {
        const isCompatible = capsule.isCompatibleWith('neural-link-v2');
        expect(isCompatible).toBe(true);
      });

      it('should return false for incompatible machines', () => {
        const isCompatible = capsule.isCompatibleWith('plasma-core-v1');
        expect(isCompatible).toBe(false);
      });

      it('should handle edge cases in compatibility check', () => {
        expect(capsule.isCompatibleWith('')).toBe(false);
        expect(capsule.isCompatibleWith(null)).toBe(false);
        expect(capsule.isCompatibleWith(undefined)).toBe(false);
      });
    });

    describe('Stock Management', () => {
      it('should add stock correctly', async () => {
        const initialStock = capsule.inStock;
        await capsule.updateStock(10, 'add');

        expect(capsule.inStock).toBe(initialStock + 10);
      });

      it('should remove stock correctly', async () => {
        capsule.inStock = 100;
        await capsule.save();

        await capsule.updateStock(30, 'remove');

        expect(capsule.inStock).toBe(70);
      });

      it('should throw error when removing more stock than available', async () => {
        capsule.inStock = 5;
        await capsule.save();

        try {
          await (capsule as any).updateStock(10, 'remove');
          throw new Error('Expected updateStock to throw an error');
        } catch (error: any) {
          expect(error.message).toBe('Insufficient stock');
        }
      });

      it('should handle exact stock removal', async () => {
        capsule.inStock = 25;
        await capsule.save();

        await capsule.updateStock(25, 'remove');

        expect(capsule.inStock).toBe(0);
      });
    });

    describe('Rating and Testimonials', () => {
      it('should add testimonial and update rating', async () => {
        const testimonial = {
          userId: 'user123',
          user: 'John Doe',
          rating: 5,
          review: 'Amazing capsule!',
          powerExperience: 'Incredible telekinetic abilities'
        };

        await capsule.addTestimonial(testimonial);

        expect(capsule.testimonials).toHaveLength(1);
        expect(capsule.testimonials[0].user).toBe('John Doe');
        expect(capsule.rating).toBe(5);
      });

      it('should calculate average rating with multiple testimonials', async () => {
        const testimonials = [
          {
            userId: 'user1',
            user: 'User One',
            rating: 4,
            review: 'Good capsule',
            powerExperience: 'Nice experience'
          },
          {
            userId: 'user2',
            user: 'User Two',
            rating: 5,
            review: 'Excellent!',
            powerExperience: 'Amazing power'
          },
          {
            userId: 'user3',
            user: 'User Three',
            rating: 3,
            review: 'Decent',
            powerExperience: 'Okay experience'
          }
        ];

        for (const testimonial of testimonials) {
          await capsule.addTestimonial(testimonial);
        }

        expect(capsule.testimonials).toHaveLength(3);
        expect(capsule.rating).toBe(4); // (4 + 5 + 3) / 3 = 4
      });
    });
  });

  describe('Static Methods - Product Discovery', () => {
    beforeEach(async () => {
      // Create test capsules with different properties
      const testCapsules = [
        {
          ...validCapsuleData,
          name: 'Mental Power Capsule',
          powerType: PowerType.MENTAL,
          rarity: Rarity.COMMON,
          rating: 4.5,
          purchases: 100,
          views: 500,
          inStock: 20,
          isActive: true
        },
        {
          ...validCapsuleData,
          name: 'Physical Strength Capsule',
          powerType: PowerType.PHYSICAL,
          rarity: Rarity.RARE,
          rating: 4.8,
          purchases: 150,
          views: 750,
          inStock: 15,
          isActive: true
        },
        {
          ...validCapsuleData,
          name: 'Mystical Power Capsule',
          powerType: PowerType.MYSTICAL,
          rarity: Rarity.LEGENDARY,
          rating: 4.9,
          purchases: 200,
          views: 1000,
          inStock: 5,
          isActive: true
        },
        {
          ...validCapsuleData,
          name: 'Inactive Capsule',
          powerType: PowerType.TEMPORAL,
          rarity: Rarity.EPIC,
          rating: 3.0,
          purchases: 50,
          views: 200,
          inStock: 0,
          isActive: false
        }
      ];

      for (const capsuleData of testCapsules) {
        const capsule = new Capsule(capsuleData);
        await capsule.save();
      }
    });

    it('should find capsules by power type', async () => {
      const mentalCapsules = await (Capsule as any).findByPowerType(PowerType.MENTAL);

      expect(mentalCapsules).toHaveLength(1);
      expect(mentalCapsules[0].powerType).toBe(PowerType.MENTAL);
      expect(mentalCapsules[0].name).toBe('Mental Power Capsule');
    });

    it('should find capsules by rarity', async () => {
      const legendaryCapules = await (Capsule as any).findByRarity(Rarity.LEGENDARY);

      expect(legendaryCapules).toHaveLength(1);
      expect(legendaryCapules[0].rarity).toBe(Rarity.LEGENDARY);
      expect(legendaryCapules[0].name).toBe('Mystical Power Capsule');
    });

    it('should find popular capsules sorted by rating', async () => {
      const popularCapsules = await (Capsule as any).findPopular(3);

      expect(popularCapsules).toHaveLength(3);
      expect(popularCapsules[0].name).toBe('Mystical Power Capsule'); // Highest rating (4.9)
    });

    it('should find new arrivals sorted by creation date', async () => {
      const newArrivals = await (Capsule as any).findNewArrivals(3);

      expect(newArrivals).toHaveLength(3);
      expect(newArrivals.every((c: any) => c.isActive && c.inStock > 0)).toBe(true);
    });

    it('should only return active capsules with stock in discovery methods', async () => {
      const powerTypeCapsules = await (Capsule as any).findByPowerType(PowerType.TEMPORAL);
      const rarityCapsules = await (Capsule as any).findByRarity(Rarity.EPIC);

      // Should not include inactive capsule with no stock
      expect(powerTypeCapsules).toHaveLength(0);
      expect(rarityCapsules).toHaveLength(0);
    });
  });

  describe('Pre-save Hooks - Business Rules', () => {
    it('should auto-adjust intensity for legendary capsules (min 8)', async () => {
      const capsuleData = {
        ...validCapsuleData,
        name: 'Legendary Test Capsule',
        rarity: Rarity.LEGENDARY,
        intensity: 5 // Below minimum for legendary
      };

      const capsule = new Capsule(capsuleData);
      const savedCapsule = await capsule.save();

      expect(savedCapsule.intensity).toBe(8);
    });

    it('should auto-adjust intensity for common capsules (max 6)', async () => {
      const capsuleData = {
        ...validCapsuleData,
        name: 'Common Test Capsule',
        rarity: Rarity.COMMON,
        intensity: 8 // Above maximum for common
      };

      const capsule = new Capsule(capsuleData);
      const savedCapsule = await capsule.save();

      expect(savedCapsule.intensity).toBe(6);
    });

    it('should not modify intensity for rare and epic capsules', async () => {
      const testCases = [
        { rarity: Rarity.RARE, intensity: 7 },
        { rarity: Rarity.EPIC, intensity: 9 }
      ];

      for (const testCase of testCases) {
        const capsuleData = {
          ...validCapsuleData,
          name: `${testCase.rarity} Intensity Test`,
          rarity: testCase.rarity,
          intensity: testCase.intensity
        };

        const capsule = new Capsule(capsuleData);
        const savedCapsule = await capsule.save();

        expect(savedCapsule.intensity).toBe(testCase.intensity);
      }
    });
  });

  describe('Data Integrity and Edge Cases', () => {
    it('should handle complex flavor profile data', async () => {
      const complexFlavorData = {
        ...validCapsuleData,
        name: 'Complex Flavor Capsule',
        flavorProfile: {
          primary: 'Dark Chocolate',
          secondary: 'Vanilla',
          notes: ['Rich', 'Smooth', 'Energizing', 'Mystical']
        }
      };

      const capsule = new Capsule(complexFlavorData);
      const savedCapsule = await capsule.save();

      expect(savedCapsule.flavorProfile.primary).toBe('Dark Chocolate');
      expect(savedCapsule.flavorProfile.notes).toHaveLength(4);
    });

    it('should handle multiple side effects and warnings', async () => {
      const capsuleData = {
        ...validCapsuleData,
        name: 'High Risk Capsule',
        sideEffects: ['Headache', 'Nausea', 'Dizziness', 'Temporary memory loss'],
        warnings: ['Avoid alcohol', 'Do not drive', 'Consult physician', 'Not for pregnant women']
      };

      const capsule = new Capsule(capsuleData);
      const savedCapsule = await capsule.save();

      expect(savedCapsule.sideEffects).toHaveLength(4);
      expect(savedCapsule.warnings).toHaveLength(4);
    });

    it('should handle boundary values correctly', async () => {
      const boundaryData = {
        ...validCapsuleData,
        name: 'Boundary Test Capsule',
        price: 0.01, // Minimum valid price
        intensity: 1, // Minimum intensity
        energyRating: 1, // Minimum energy
        quantumStability: 100, // Maximum stability
        inStock: 0 // Minimum stock
      };

      const capsule = new Capsule(boundaryData);
      const savedCapsule = await capsule.save();

      expect(savedCapsule.price).toBe(0.01);
      expect(savedCapsule.intensity).toBe(1);
      expect(savedCapsule.energyRating).toBe(1);
      expect(savedCapsule.quantumStability).toBe(100);
      expect(savedCapsule.inStock).toBe(0);
    });

    it('should support text search functionality', async () => {
      const searchableCapsule = new Capsule({
        ...validCapsuleData,
        name: 'Telekinetic Mind Reader Supreme',
        superpower: 'Advanced Telepathy with Telekinesis',
        description: 'Ultimate mental power capsule for reading minds and moving objects'
      });
      await searchableCapsule.save();

      const results = await Capsule.find({
        $text: { $search: 'telepathy mind reading' }
      });

      expect(results).toHaveLength(1);
      expect(results[0].name).toBe('Telekinetic Mind Reader Supreme');
    });

    it('should handle sequential stock updates correctly', async () => {
      const capsule = new Capsule({ ...validCapsuleData, inStock: 100 });
      await capsule.save();

      // Perform sequential stock updates
      await (capsule as any).updateStock(10, 'remove');
      await (capsule as any).updateStock(20, 'remove');
      await (capsule as any).updateStock(5, 'add');

      const updatedCapsule = await Capsule.findById(capsule._id);
      expect(updatedCapsule?.inStock).toBe(75); // 100 - 10 - 20 + 5
    });
  });

  describe('Performance and Indexing', () => {
    it('should have proper indexes for efficient querying', async () => {
      const indexes = await Capsule.collection.getIndexes();

      // Check for critical indexes
      expect(indexes).toHaveProperty('name_1');
      expect(indexes).toHaveProperty('powerType_1');
      expect(indexes).toHaveProperty('inStock_1_isActive_1');
    });

    it('should efficiently query by multiple criteria', async () => {
      // Create multiple capsules for testing
      const capsules = [];
      for (let i = 0; i < 10; i++) {
        capsules.push(new Capsule({
          ...validCapsuleData,
          name: `Performance Test Capsule ${i}`,
          powerType: i % 2 === 0 ? PowerType.MENTAL : PowerType.PHYSICAL,
          rarity: i % 3 === 0 ? Rarity.LEGENDARY : Rarity.COMMON,
          inStock: i * 10,
          isActive: i % 4 !== 0
        }));
      }

      await Promise.all(capsules.map(c => c.save()));

      const startTime = Date.now();

      const results = await Capsule.find({
        powerType: PowerType.MENTAL,
        isActive: true,
        inStock: { $gt: 0 }
      }).limit(5);

      const endTime = Date.now();

      expect(results.length).toBeGreaterThan(0);
      expect(endTime - startTime).toBeLessThan(100); // Should be fast with proper indexes
    });
  });
});