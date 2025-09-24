/**
 * Product Fixtures for API Integration Tests
 */

export interface TestCapsule {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  flavorProfile: string;
  intensity: number;
  powerBoost: number;
  imageUrl: string;
  isActive?: boolean;
}

/**
 * Generate unique product test data
 */
export class ProductFixtureFactory {
  private static counter = 0;
  private static getUniqueId(): string {
    return `${Date.now()}-${++this.counter}-${Math.random().toString(36).substring(7)}`;
  }

  /**
   * Create a valid test capsule with unique data
   */
  static createValidCapsule(overrides: Partial<TestCapsule> = {}): TestCapsule {
    const uniqueId = this.getUniqueId();

    return {
      name: `Test Cosmic Blend ${uniqueId}`,
      description: `Test capsule for API integration testing - ${uniqueId}`,
      price: 15.99,
      stock: 100,
      category: 'premium',
      flavorProfile: 'rich',
      intensity: 8,
      powerBoost: 25,
      imageUrl: `https://example.com/test-capsule-${uniqueId}.jpg`,
      isActive: true,
      ...overrides,
    };
  }

  /**
   * Create multiple test capsules with different characteristics
   */
  static createMultipleCapsules(count: number): TestCapsule[] {
    const categories = ['premium', 'standard', 'decaf', 'specialty'];
    const flavorProfiles = ['rich', 'smooth', 'bold', 'mild', 'fruity'];
    const intensities = [3, 5, 7, 8, 10];

    return Array.from({ length: count }, (_, index) => {
      const uniqueId = this.getUniqueId();

      return {
        name: `Test Capsule ${index + 1} - ${uniqueId}`,
        description: `Test capsule #${index + 1} for API testing`,
        price: Math.round((10 + Math.random() * 20) * 100) / 100, // Price between 10-30
        stock: Math.floor(Math.random() * 200) + 10, // Stock between 10-210
        category: categories[index % categories.length] as string,
        flavorProfile: flavorProfiles[index % flavorProfiles.length] as string,
        intensity: intensities[index % intensities.length] as number,
        powerBoost: Math.floor(Math.random() * 50) + 10, // Power boost 10-60
        imageUrl: `https://example.com/test-capsule-${index + 1}-${uniqueId}.jpg`,
        isActive: Math.random() > 0.1, // 90% active
      };
    });
  }

  /**
   * Create capsules with specific categories for testing
   */
  static createCapsulesByCategory(category: string, count: number = 3): TestCapsule[] {
    return Array.from({ length: count }, (_, index) => {
      const uniqueId = this.getUniqueId();

      const categoryConfigs = {
        premium: { priceBase: 20, powerBoostBase: 40, intensityBase: 8 },
        standard: { priceBase: 15, powerBoostBase: 25, intensityBase: 6 },
        decaf: { priceBase: 12, powerBoostBase: 5, intensityBase: 3 },
        specialty: { priceBase: 25, powerBoostBase: 50, intensityBase: 9 },
      };

      const config = categoryConfigs[category as keyof typeof categoryConfigs] || categoryConfigs.standard;

      return {
        name: `${category} Test Capsule ${index + 1} - ${uniqueId}`,
        description: `Test ${category} capsule for API integration`,
        price: config.priceBase + Math.random() * 5,
        stock: Math.floor(Math.random() * 100) + 20,
        category,
        flavorProfile: category === 'decaf' ? 'mild' : 'rich',
        intensity: config.intensityBase + Math.floor(Math.random() * 2),
        powerBoost: config.powerBoostBase + Math.floor(Math.random() * 10),
        imageUrl: `https://example.com/${category}-capsule-${index + 1}-${uniqueId}.jpg`,
        isActive: true,
      };
    });
  }

  /**
   * Create invalid capsule data for validation testing
   */
  static createInvalidCapsuleData(): Array<{ data: Partial<TestCapsule>; expectedError: string }> {
    return [
      {
        data: { name: '', description: 'Valid description', price: 15.99, stock: 100 },
        expectedError: 'name',
      },
      {
        data: { name: 'Valid Name', description: '', price: 15.99, stock: 100 },
        expectedError: 'description',
      },
      {
        data: { name: 'Valid Name', description: 'Valid description', price: -5, stock: 100 },
        expectedError: 'price',
      },
      {
        data: { name: 'Valid Name', description: 'Valid description', price: 15.99, stock: -10 },
        expectedError: 'stock',
      },
      {
        data: { name: 'Valid Name', description: 'Valid description', price: 15.99, stock: 100, intensity: 15 },
        expectedError: 'intensity',
      },
      {
        data: { name: 'Valid Name', description: 'Valid description', price: 15.99, stock: 100, powerBoost: -5 },
        expectedError: 'powerBoost',
      },
    ];
  }

  /**
   * Create capsules for stock management testing
   */
  static createStockTestCapsules(): {
    inStock: TestCapsule;
    lowStock: TestCapsule;
    outOfStock: TestCapsule;
  } {
    const uniqueId = this.getUniqueId();

    return {
      inStock: this.createValidCapsule({
        name: `In Stock Capsule ${uniqueId}`,
        stock: 100,
      }),
      lowStock: this.createValidCapsule({
        name: `Low Stock Capsule ${uniqueId}`,
        stock: 5,
      }),
      outOfStock: this.createValidCapsule({
        name: `Out of Stock Capsule ${uniqueId}`,
        stock: 0,
      }),
    };
  }

  /**
   * Create capsules for price range testing
   */
  static createPriceRangeCapsules(): TestCapsule[] {
    const priceRanges = [
      { name: 'Budget', price: 8.99 },
      { name: 'Standard', price: 15.99 },
      { name: 'Premium', price: 22.99 },
      { name: 'Luxury', price: 35.99 },
    ];

    return priceRanges.map((range, index) => {
      const uniqueId = this.getUniqueId();

      return this.createValidCapsule({
        name: `${range.name} Test Capsule ${uniqueId}`,
        price: range.price,
        category: range.name.toLowerCase(),
      });
    });
  }
}

/**
 * Predefined test capsules for specific scenarios
 */
export const PREDEFINED_TEST_CAPSULES = {
  PREMIUM_CAPSULE: {
    name: 'Premium Test Cosmic Blend',
    description: 'Premium test capsule with high intensity and power boost',
    price: 24.99,
    stock: 50,
    category: 'premium',
    flavorProfile: 'rich',
    intensity: 9,
    powerBoost: 45,
    imageUrl: 'https://example.com/premium-test-capsule.jpg',
    isActive: true,
  },

  STANDARD_CAPSULE: {
    name: 'Standard Test Morning Blend',
    description: 'Standard test capsule for everyday testing',
    price: 15.99,
    stock: 100,
    category: 'standard',
    flavorProfile: 'smooth',
    intensity: 6,
    powerBoost: 25,
    imageUrl: 'https://example.com/standard-test-capsule.jpg',
    isActive: true,
  },

  DECAF_CAPSULE: {
    name: 'Decaf Test Evening Blend',
    description: 'Decaf test capsule for low-intensity testing',
    price: 12.99,
    stock: 75,
    category: 'decaf',
    flavorProfile: 'mild',
    intensity: 3,
    powerBoost: 5,
    imageUrl: 'https://example.com/decaf-test-capsule.jpg',
    isActive: true,
  },
} as const;