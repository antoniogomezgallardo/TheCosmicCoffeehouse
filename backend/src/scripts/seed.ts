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
  },
  // Additional Mental Power Capsules
  {
    name: 'Memory Palace Supreme',
    superpower: 'Perfect Memory & Recall',
    description: 'Achieve photographic memory and instant recall of any information for 8 hours.',
    powerType: 'mental',
    duration: '8 hours',
    sideEffects: ['Information overload sensitivity', 'Temporary difficulty forgetting'],
    rarity: 'rare',
    price: 199.99,
    requiredMachines: ['mach-001', 'mach-006'],
    flavorProfile: {
      primary: 'Ethiopian Cerebral',
      secondary: 'Memory Enhancers',
      notes: ['Bacopa extract', 'Neural pathway amplifiers']
    },
    intensity: 6,
    energyRating: 80,
    quantumStability: 94,
    discoveredBy: 'Cognitive Sciences Institute',
    discoveryDate: new Date('2386-05-20'),
    inStock: 78,
    imageUrl: '/images/capsules/memory-palace.png',
    warnings: ['Do not use during traumatic events'],
    isActive: true
  },
  {
    name: 'Time Perception Accelerator',
    superpower: 'Accelerated Time Perception',
    description: 'Experience time in slow motion, gaining split-second decision making for 2 hours.',
    powerType: 'mental',
    duration: '2 hours',
    sideEffects: ['Normal time feels sluggish afterward', 'Temporal disorientation'],
    rarity: 'epic',
    price: 389.99,
    requiredMachines: ['mach-001', 'mach-007'],
    flavorProfile: {
      primary: 'Temporal Colombian',
      secondary: 'Chronoton Infusion',
      notes: ['Time-dilating compounds', 'Perception accelerants']
    },
    intensity: 9,
    energyRating: 92,
    quantumStability: 87,
    discoveredBy: 'Chronos Research Division',
    discoveryDate: new Date('2388-11-11'),
    inStock: 34,
    imageUrl: '/images/capsules/time-perception.png',
    warnings: ['Do not operate vehicles or machinery'],
    isActive: true
  },
  {
    name: 'Emotional Empathy Link',
    superpower: 'Emotional Detection & Empathy',
    description: 'Sense and understand the emotions of others within 50 meters for 4 hours.',
    powerType: 'mental',
    duration: '4 hours',
    sideEffects: ['Emotional overflow', 'Difficulty distinguishing own emotions'],
    rarity: 'rare',
    price: 159.99,
    requiredMachines: ['mach-001', 'mach-004'],
    flavorProfile: {
      primary: 'Compassionate Kenya',
      secondary: 'Empathic Enhancers',
      notes: ['Mirror neuron activators', 'Emotional resonance herbs']
    },
    intensity: 5,
    energyRating: 70,
    quantumStability: 91,
    discoveredBy: 'Empathy Research Center',
    discoveryDate: new Date('2385-07-14'),
    inStock: 112,
    imageUrl: '/images/capsules/emotional-empathy.png',
    warnings: ['Avoid crowded areas initially'],
    isActive: true
  },
  // Physical Power Capsules
  {
    name: 'Lightning Speed Formula',
    superpower: 'Super Speed',
    description: 'Move at superhuman speeds up to 60 mph for 3 hours.',
    powerType: 'physical',
    duration: '3 hours',
    sideEffects: ['Increased caloric needs', 'Motion blur vision'],
    rarity: 'epic',
    price: 299.99,
    requiredMachines: ['mach-002', 'mach-008'],
    flavorProfile: {
      primary: 'Velocity Venezuelan',
      secondary: 'Kinetic Boosters',
      notes: ['Adrenaline amplifiers', 'Muscle fiber accelerants']
    },
    intensity: 8,
    energyRating: 95,
    quantumStability: 89,
    discoveredBy: 'Velocity Labs',
    discoveryDate: new Date('2386-03-22'),
    inStock: 56,
    imageUrl: '/images/capsules/lightning-speed.png',
    warnings: ['Practice in safe, open areas first'],
    isActive: true
  },
  {
    name: 'Iron Skin Defense',
    superpower: 'Enhanced Durability',
    description: 'Gain diamond-hard skin that deflects bullets and absorbs impacts for 5 hours.',
    powerType: 'physical',
    duration: '5 hours',
    sideEffects: ['Reduced tactile sensitivity', 'Slight stiffness'],
    rarity: 'rare',
    price: 219.99,
    requiredMachines: ['mach-002', 'mach-005'],
    flavorProfile: {
      primary: 'Fortified Brazilian',
      secondary: 'Defense Compounds',
      notes: ['Collagen strengtheners', 'Molecular hardening agents']
    },
    intensity: 7,
    energyRating: 85,
    quantumStability: 96,
    discoveredBy: 'Defense Tech Industries',
    discoveryDate: new Date('2385-12-08'),
    inStock: 89,
    imageUrl: '/images/capsules/iron-skin.png',
    warnings: ['Test sensitivity gradually'],
    isActive: true
  },
  {
    name: 'Regeneration Catalyst',
    superpower: 'Rapid Healing',
    description: 'Accelerate natural healing processes by 100x for 6 hours.',
    powerType: 'physical',
    duration: '6 hours',
    sideEffects: ['Increased appetite', 'Temporary fatigue after effect'],
    rarity: 'legendary',
    price: 599.99,
    requiredMachines: ['mach-002', 'mach-006'],
    flavorProfile: {
      primary: 'Healing Hawaiian Kona',
      secondary: 'Regenerative Enzymes',
      notes: ['Stem cell activators', 'DNA repair compounds']
    },
    intensity: 9,
    energyRating: 98,
    quantumStability: 94,
    discoveredBy: 'Bio-Regeneration Corp',
    discoveryDate: new Date('2389-04-17'),
    inStock: 12,
    imageUrl: '/images/capsules/regeneration.png',
    warnings: ['Medical supervision recommended'],
    isActive: true
  },
  {
    name: 'Gravity Defiance Blend',
    superpower: 'Limited Flight',
    description: 'Defy gravity and achieve controlled flight up to 200 feet for 90 minutes.',
    powerType: 'physical',
    duration: '90 minutes',
    sideEffects: ['Altitude sickness', 'Landing coordination difficulty'],
    rarity: 'epic',
    price: 449.99,
    requiredMachines: ['mach-002', 'mach-007'],
    flavorProfile: {
      primary: 'Weightless Jamaican',
      secondary: 'Anti-Gravity Particles',
      notes: ['Levitation compounds', 'Gravitational field disruptors']
    },
    intensity: 9,
    energyRating: 90,
    quantumStability: 82,
    discoveredBy: 'Aerospace Anomalies Lab',
    discoveryDate: new Date('2387-09-30'),
    inStock: 41,
    imageUrl: '/images/capsules/gravity-defiance.png',
    warnings: ['Flight training required', 'Weather dependent'],
    isActive: true
  },
  // Mystical Power Capsules
  {
    name: 'Elemental Fire Control',
    superpower: 'Pyrokinesis',
    description: 'Generate and control flames with your mind for 3 hours.',
    powerType: 'mystical',
    duration: '3 hours',
    sideEffects: ['Heat sensitivity', 'Slight dehydration'],
    rarity: 'epic',
    price: 359.99,
    requiredMachines: ['mach-003', 'mach-009'],
    flavorProfile: {
      primary: 'Volcanic Sumatra',
      secondary: 'Elemental Essence',
      notes: ['Fire salamander extract', 'Thermal energy catalysts']
    },
    intensity: 8,
    energyRating: 88,
    quantumStability: 85,
    discoveredBy: 'Elemental Studies Academy',
    discoveryDate: new Date('2387-06-21'),
    inStock: 67,
    imageUrl: '/images/capsules/elemental-fire.png',
    warnings: ['Fire safety equipment required', 'Use in fireproof areas only'],
    isActive: true
  },
  {
    name: 'Astral Projection Brew',
    superpower: 'Astral Projection',
    description: 'Separate your spirit from your body and travel ethereally for 2 hours.',
    powerType: 'mystical',
    duration: '2 hours',
    sideEffects: ['Disorientation upon return', 'Spiritual fatigue'],
    rarity: 'legendary',
    price: 699.99,
    requiredMachines: ['mach-003', 'mach-006'],
    flavorProfile: {
      primary: 'Ethereal Ethiopian',
      secondary: 'Spiritual Enhancers',
      notes: ['Astral plane stabilizers', 'Consciousness separators']
    },
    intensity: 10,
    energyRating: 95,
    quantumStability: 78,
    discoveredBy: 'Metaphysical Research Institute',
    discoveryDate: new Date('2389-10-31'),
    inStock: 8,
    imageUrl: '/images/capsules/astral-projection.png',
    warnings: ['Requires spiritual guide', 'Meditation experience recommended'],
    isActive: true
  },
  {
    name: 'Reality Phase Shifter',
    superpower: 'Dimensional Phasing',
    description: 'Phase through solid objects by shifting between dimensional planes for 45 minutes.',
    powerType: 'mystical',
    duration: '45 minutes',
    sideEffects: ['Dimensional echo syndrome', 'Temporary translucency'],
    rarity: 'legendary',
    price: 799.99,
    requiredMachines: ['mach-003', 'mach-007'],
    flavorProfile: {
      primary: 'Interdimensional Blend',
      secondary: 'Phase Modifiers',
      notes: ['Quantum tunneling agents', 'Reality anchor suppressors']
    },
    intensity: 10,
    energyRating: 85,
    quantumStability: 72,
    discoveredBy: 'Dimensional Physics Consortium',
    discoveryDate: new Date('2388-12-25'),
    inStock: 5,
    imageUrl: '/images/capsules/reality-phase.png',
    warnings: ['Do not phase while holding objects', 'Avoid electronic devices'],
    isActive: true
  },
  {
    name: 'Weather Command Elixir',
    superpower: 'Weather Manipulation',
    description: 'Control local weather patterns within a 1-mile radius for 4 hours.',
    powerType: 'mystical',
    duration: '4 hours',
    sideEffects: ['Barometric pressure sensitivity', 'Weather pattern addiction'],
    rarity: 'epic',
    price: 429.99,
    requiredMachines: ['mach-003', 'mach-009'],
    flavorProfile: {
      primary: 'Storm-charged Guatemalan',
      secondary: 'Atmospheric Modifiers',
      notes: ['Lightning essence', 'Cloud formation catalysts']
    },
    intensity: 9,
    energyRating: 92,
    quantumStability: 80,
    discoveredBy: 'Atmospheric Control Division',
    discoveryDate: new Date('2386-08-15'),
    inStock: 23,
    imageUrl: '/images/capsules/weather-command.png',
    warnings: ['Monitor local weather alerts', 'Environmental impact awareness required'],
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
  },
  // Additional Advanced Machines
  {
    name: 'Neural Nexus Processor',
    machineModel: 'NNP-MIND-5000',
    type: 'neural',
    description: 'Specialized mental enhancement brewing system with neural pattern optimization.',
    capabilities: ['Synaptic frequency tuning', 'Brainwave synchronization', 'Memory engram enhancement'],
    compatibleCapsuleTypes: ['mental'],
    powerSource: 'bio-neural-cells',
    price: 18999.99,
    dimensions: {
      width: 52,
      height: 45,
      depth: 38,
      weight: 28.5
    },
    specifications: {
      brewingPressure: '12-25 bars + neural flux',
      quantumAmplification: 96,
      stabilityField: 98,
      maxPowerOutput: 350
    },
    warranty: '12 years + neural protection guarantee',
    manufacturingDate: new Date('2391-01-20'),
    manufacturer: 'NeuroTech Brewing Corporation',
    safetyRating: 99,
    efficiencyRating: 94,
    maintenanceInterval: 'Every 800 brews',
    inStock: 15,
    imageUrl: '/images/machines/neural-nexus.png',
    manualUrl: '/manuals/nnp-mind-5000-manual.pdf',
    isActive: true
  },
  {
    name: 'Titan Force Amplifier',
    machineModel: 'TFA-MUSCLE-8000',
    type: 'physical',
    description: 'High-intensity physical enhancement brewing system for maximum power output.',
    capabilities: ['Molecular muscle fiber enhancement', 'Kinetic energy amplification', 'Cellular reinforcement'],
    compatibleCapsuleTypes: ['physical'],
    powerSource: 'kinetic-generators',
    price: 15999.99,
    dimensions: {
      width: 48,
      height: 42,
      depth: 35,
      weight: 35.2
    },
    specifications: {
      brewingPressure: '20-35 bars + kinetic boost',
      quantumAmplification: 88,
      stabilityField: 95,
      maxPowerOutput: 420
    },
    warranty: '8 years + physical enhancement guarantee',
    manufacturingDate: new Date('2390-09-12'),
    manufacturer: 'Titan Industries',
    safetyRating: 96,
    efficiencyRating: 91,
    maintenanceInterval: 'Every 1200 brews',
    inStock: 31,
    imageUrl: '/images/machines/titan-force.png',
    manualUrl: '/manuals/tfa-muscle-8000-manual.pdf',
    isActive: true
  },
  {
    name: 'Mystical Essence Extractor',
    machineModel: 'MEE-SPIRIT-9000',
    type: 'mystical',
    description: 'Ethereal brewing system designed for mystical and supernatural power extraction.',
    capabilities: ['Astral plane brewing', 'Elemental essence extraction', 'Dimensional energy channeling'],
    compatibleCapsuleTypes: ['mystical'],
    powerSource: 'ethereal-crystals',
    price: 22999.99,
    dimensions: {
      width: 55,
      height: 48,
      depth: 42,
      weight: 24.8
    },
    specifications: {
      brewingPressure: '5-15 bars + ethereal resonance',
      quantumAmplification: 92,
      stabilityField: 87,
      maxPowerOutput: 300
    },
    warranty: '15 years + mystical protection ward',
    manufacturingDate: new Date('2391-03-21'),
    manufacturer: 'Ethereal Technologies',
    safetyRating: 91,
    efficiencyRating: 89,
    maintenanceInterval: 'Every 2000 brews',
    inStock: 8,
    imageUrl: '/images/machines/mystical-essence.png',
    manualUrl: '/manuals/mee-spirit-9000-manual.pdf',
    isActive: true
  },
  {
    name: 'Temporal Fusion Chamber',
    machineModel: 'TFC-TIME-7500',
    type: 'temporal',
    description: 'Advanced time-manipulation brewing system for temporal and chronological powers.',
    capabilities: ['Temporal field generation', 'Chronoton infusion', 'Time-dilation brewing'],
    compatibleCapsuleTypes: ['mental', 'mystical'],
    powerSource: 'temporal-cores',
    price: 29999.99,
    dimensions: {
      width: 60,
      height: 55,
      depth: 50,
      weight: 42.0
    },
    specifications: {
      brewingPressure: '8-22 bars + temporal flux',
      quantumAmplification: 94,
      stabilityField: 89,
      maxPowerOutput: 380
    },
    warranty: '20 years + temporal anomaly insurance',
    manufacturingDate: new Date('2391-07-04'),
    manufacturer: 'ChronoTech Dynamics',
    safetyRating: 98,
    efficiencyRating: 97,
    maintenanceInterval: 'Every 500 brews',
    inStock: 4,
    imageUrl: '/images/machines/temporal-fusion.png',
    manualUrl: '/manuals/tfc-time-7500-manual.pdf',
    isActive: true
  },
  {
    name: 'Elemental Harmony Synthesizer',
    machineModel: 'EHS-ELEMENT-6000',
    type: 'elemental',
    description: 'Multi-elemental brewing system that harmonizes fire, water, earth, and air essences.',
    capabilities: ['Four-element synthesis', 'Elemental balance optimization', 'Seasonal power cycling'],
    compatibleCapsuleTypes: ['mystical', 'physical'],
    powerSource: 'elemental-stones',
    price: 16999.99,
    dimensions: {
      width: 46,
      height: 40,
      depth: 36,
      weight: 26.4
    },
    specifications: {
      brewingPressure: '12-28 bars + elemental resonance',
      quantumAmplification: 85,
      stabilityField: 93,
      maxPowerOutput: 290
    },
    warranty: '10 years + elemental protection seal',
    manufacturingDate: new Date('2390-12-21'),
    manufacturer: 'Elemental Harmonics Ltd',
    safetyRating: 95,
    efficiencyRating: 88,
    maintenanceInterval: 'Every 1800 brews',
    inStock: 19,
    imageUrl: '/images/machines/elemental-harmony.png',
    manualUrl: '/manuals/ehs-element-6000-manual.pdf',
    isActive: true
  },
  {
    name: 'Portable Power Pod',
    machineModel: 'PPP-COMPACT-300',
    type: 'portable',
    description: 'Compact, travel-friendly brewing system for on-the-go superpower activation.',
    capabilities: ['Rapid brewing (5 minutes)', 'Battery operation', 'Lightweight design'],
    compatibleCapsuleTypes: ['mental', 'physical'],
    powerSource: 'compact-batteries',
    price: 2999.99,
    dimensions: {
      width: 25,
      height: 20,
      depth: 18,
      weight: 4.2
    },
    specifications: {
      brewingPressure: '8-12 bars + micro-amplification',
      quantumAmplification: 65,
      stabilityField: 82,
      maxPowerOutput: 120
    },
    warranty: '3 years + portability guarantee',
    manufacturingDate: new Date('2390-04-10'),
    manufacturer: 'MicroBrew Technologies',
    safetyRating: 89,
    efficiencyRating: 76,
    maintenanceInterval: 'Every 3000 brews',
    inStock: 156,
    imageUrl: '/images/machines/portable-pod.png',
    manualUrl: '/manuals/ppp-compact-300-manual.pdf',
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
    console.log(`✅ Seeded ${seedCapsules.length} capsules (16 total - complete collection!)`);

    // Seed machines
    console.log('⚙️ Seeding futuristic machines...');
    await Machine.insertMany(seedMachines);
    console.log(`✅ Seeded ${seedMachines.length} machines (8 total - full range!)`);

    console.log('\n🎉 EXPANDED CATALOG SUMMARY:');
    console.log('📦 Capsules by Power Type:');
    console.log('   🧠 Mental: 8 capsules (telepathy, memory, focus, empathy, time perception)');
    console.log('   💪 Physical: 4 capsules (strength, speed, defense, healing, flight)');
    console.log('   🔮 Mystical: 4 capsules (invisibility, fire control, astral projection, weather control)');
    console.log('\n🚀 Machines by Type:');
    console.log('   ⚛️ Quantum: 1 machine (mental specialization)');
    console.log('   🌌 Cosmic: 1 machine (universal compatibility)');
    console.log('   🧠 Neural: 1 machine (advanced mental enhancement)');
    console.log('   💪 Physical: 1 machine (strength & physical powers)');
    console.log('   🔮 Mystical: 1 machine (supernatural powers)');
    console.log('   ⏰ Temporal: 1 machine (time manipulation)');
    console.log('   🌊 Elemental: 1 machine (elemental harmony)');
    console.log('   📱 Portable: 1 machine (travel-friendly)');

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