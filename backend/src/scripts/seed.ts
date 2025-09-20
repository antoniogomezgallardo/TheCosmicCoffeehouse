import dotenv from 'dotenv';
import Capsule from '../models/Capsule';
import Machine from '../models/Machine';
import User from '../models/User';
import { connectDatabase } from '../config/database';

dotenv.config();

const seedCapsules = [
  {
    name: 'Telepathic Blend Supreme',
    superpower: 'Mind Reading & Telepathic Communication',
    description: 'Experience the ability to read thoughts and communicate telepathically with others within a 100-meter radius.',
    powerType: 'mental',
    duration: '3 hours',
    sideEffects: ['Mild headache for first 30 minutes', 'Temporary oversensitivity'],
    rarity: 'epic',
    price: 299.99,
    requiredMachines: ['mach-001', 'mach-004'],
    flavorProfile: {
      primary: 'Dark Chocolate',
      secondary: 'Lavender',
      notes: ['Subtle mint', 'Neural enhancement herbs']
    },
    intensity: 8,
    energyRating: 85,
    quantumStability: 92,
    discoveredBy: 'Dr. Elena Mindbridge',
    discoveryDate: new Date('2387-03-15'),
    inStock: 47,
    imageUrl: '/images/capsules/telepathic-blend.png',
    warnings: ['Do not use during important negotiations without consent'],
    isActive: true
  },
  {
    name: 'Hercules Roast',
    superpower: 'Super Strength',
    description: 'Gain the strength of 50 humans for 4 hours. Lift cars with ease!',
    powerType: 'physical',
    duration: '4 hours',
    sideEffects: ['Increased appetite', 'Difficulty controlling strength'],
    rarity: 'rare',
    price: 189.99,
    requiredMachines: ['mach-002', 'mach-005'],
    flavorProfile: {
      primary: 'Robust Brazilian',
      secondary: 'Protein Enhancement',
      notes: ['Creatine infusion', 'Molecular muscle amplifiers']
    },
    intensity: 7,
    energyRating: 95,
    quantumStability: 95,
    discoveredBy: 'Olympus Strength Labs',
    discoveryDate: new Date('2385-11-08'),
    inStock: 156,
    imageUrl: '/images/capsules/hercules-roast.png',
    warnings: ['Be careful with handshakes'],
    isActive: true
  },
  {
    name: 'Phantom Brew',
    superpower: 'Invisibility',
    description: 'Become completely invisible to all forms of detection for 45 minutes.',
    powerType: 'mystical',
    duration: '45 minutes',
    sideEffects: ['Slight transparency after effect', 'Clothing may become visible first'],
    rarity: 'rare',
    price: 279.99,
    requiredMachines: ['mach-003', 'mach-005'],
    flavorProfile: {
      primary: 'Guatemalan Phantom',
      secondary: 'Dimensional Shift',
      notes: ['Phase-shifting molecules', 'Light-bending compounds']
    },
    intensity: 6,
    energyRating: 70,
    quantumStability: 85,
    discoveredBy: 'Invisible College of Sciences',
    discoveryDate: new Date('2386-10-31'),
    inStock: 89,
    imageUrl: '/images/capsules/phantom-brew.png',
    warnings: ['Do not drive vehicles while invisible'],
    isActive: true
  },
  {
    name: 'Enhanced Focus Blend',
    superpower: 'Laser Focus & Concentration',
    description: 'Eliminate all distractions and focus intensely on any task for 6 hours.',
    powerType: 'mental',
    duration: '6 hours',
    sideEffects: ['May ignore important interruptions', 'Slight tunnel vision'],
    rarity: 'common',
    price: 49.99,
    requiredMachines: ['mach-001', 'mach-004', 'mach-005'],
    flavorProfile: {
      primary: 'Costa Rican Bright',
      secondary: 'Concentration Herbs',
      notes: ['Ginkgo extract', 'Nootropic blend']
    },
    intensity: 4,
    energyRating: 75,
    quantumStability: 98,
    discoveredBy: 'Focus Labs International',
    discoveryDate: new Date('2384-01-15'),
    inStock: 245,
    imageUrl: '/images/capsules/enhanced-focus.png',
    warnings: ['Set alarms for important breaks'],
    isActive: true
  }
];

const seedMachines = [
  {
    name: 'Quantum Brewmaster 3000',
    machineModel: 'QBM-3000-X',
    type: 'quantum',
    description: 'The ultimate brewing machine for mental enhancement capsules.',
    capabilities: ['Quantum-level molecular brewing', 'Neural pathway optimization'],
    compatibleCapsuleTypes: ['mental'],
    powerSource: 'quantum-cells',
    price: 12999.99,
    dimensions: {
      width: 45,
      height: 38,
      depth: 32,
      weight: 18.5
    },
    specifications: {
      brewingPressure: '15 bars + quantum flux',
      quantumAmplification: 95,
      stabilityField: 99,
      maxPowerOutput: 250
    },
    warranty: '10 years + quantum insurance',
    manufacturingDate: new Date('2390-03-15'),
    manufacturer: 'Heisenberg Brewing Technologies',
    safetyRating: 98,
    efficiencyRating: 96,
    maintenanceInterval: 'Every 1000 brews',
    inStock: 23,
    imageUrl: '/images/machines/quantum-brewmaster.png',
    manualUrl: '/manuals/qbm-3000-manual.pdf',
    isActive: true
  },
  {
    name: 'Universal Cosmic Brewer',
    machineModel: 'UCB-OMNI-2390',
    type: 'cosmic',
    description: 'The versatile all-in-one brewing solution for home users.',
    capabilities: ['Multi-spectrum brewing', 'Adaptive power field adjustment'],
    compatibleCapsuleTypes: ['mental', 'physical', 'mystical'],
    powerSource: 'cosmic',
    price: 4999.99,
    dimensions: {
      width: 35,
      height: 32,
      depth: 25,
      weight: 12.8
    },
    specifications: {
      brewingPressure: '10-18 bars (adaptive)',
      quantumAmplification: 78,
      stabilityField: 91,
      maxPowerOutput: 180
    },
    warranty: '5 years + cosmic energy guarantee',
    manufacturingDate: new Date('2390-06-15'),
    manufacturer: 'Cosmic Brewing Solutions',
    safetyRating: 94,
    efficiencyRating: 86,
    maintenanceInterval: 'Every 1500 brews',
    inStock: 67,
    imageUrl: '/images/machines/universal-cosmic-brewer.png',
    manualUrl: '/manuals/ucb-omni-manual.pdf',
    isActive: true
  }
];

const seedUsers = [
  {
    email: 'john@cosmic.com',
    username: 'cosmicjohn',
    password: 'Test123!@#',
    firstName: 'John',
    lastName: 'Cosmic',
    powerLevel: 25,
    favoriteSuperpowers: ['mental', 'physical']
  },
  {
    email: 'jane@quantum.com',
    username: 'quantumjane',
    password: 'Test123!@#',
    firstName: 'Jane',
    lastName: 'Quantum',
    powerLevel: 45,
    favoriteSuperpowers: ['mystical', 'temporal']
  }
];

const seedDatabase = async () => {
  try {
    await connectDatabase();

    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await Capsule.deleteMany({});
    await Machine.deleteMany({});
    await User.deleteMany({});

    // Seed capsules
    console.log('☕ Seeding superpower capsules...');
    await Capsule.insertMany(seedCapsules);
    console.log(`✅ Seeded ${seedCapsules.length} capsules`);

    // Seed machines
    console.log('⚙️ Seeding futuristic machines...');
    await Machine.insertMany(seedMachines);
    console.log(`✅ Seeded ${seedMachines.length} machines`);

    // Seed users
    console.log('👤 Creating test users...');
    for (const userData of seedUsers) {
      const user = new User(userData);
      await user.save();
    }
    console.log(`✅ Created ${seedUsers.length} test users`);

    console.log('🎉 Database seeded successfully!');
    console.log('\nTest Credentials:');
    console.log('Email: john@cosmic.com | Password: Test123!@#');
    console.log('Email: jane@quantum.com | Password: Test123!@#');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();