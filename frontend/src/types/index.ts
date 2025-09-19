// ===============================
// SUPERPOWER COFFEE CAPSULES
// ===============================

export type PowerType = 'mental' | 'physical' | 'mystical' | 'temporal';
export type Rarity = 'common' | 'rare' | 'epic' | 'legendary';
export type PowerIntensity = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export interface SuperpowerCapsule {
  id: string;
  name: string;
  superpower: string;
  description: string;
  powerType: PowerType;
  duration: string; // "30 minutes", "2 hours", "1 day"
  sideEffects: string[];
  rarity: Rarity;
  price: number;
  requiredMachines: string[]; // Array of compatible machine IDs
  flavorProfile: {
    primary: string;
    secondary: string;
    notes: string[];
  };
  intensity: PowerIntensity;
  energyRating: number; // 1-100
  quantumStability: number; // 1-100, affects side effects
  discoveredBy: string;
  discoveryDate: string;
  inStock: number;
  imageUrl: string;
  warnings: string[];
  testimonials: {
    user: string;
    rating: number;
    review: string;
    powerExperience: string;
  }[];
}

// ===============================
// FUTURISTIC COFFEE MACHINES
// ===============================

export type MachineType = 'quantum' | 'plasma' | 'temporal' | 'neural' | 'cosmic';
export type PowerSource = 'quantum-cells' | 'plasma-core' | 'temporal-flux' | 'dark-matter' | 'antimatter';

export interface FuturisticMachine {
  id: string;
  name: string;
  model: string;
  type: MachineType;
  description: string;
  capabilities: string[];
  compatibleCapsuleTypes: PowerType[];
  powerSource: PowerSource;
  price: number;
  dimensions: {
    width: number;
    height: number;
    depth: number;
    weight: number;
  };
  specifications: {
    brewingPressure: string;
    quantumAmplification: number;
    stabilityField: number;
    maxPowerOutput: number;
  };
  warranty: string;
  manufacturingDate: string;
  manufacturer: string;
  safetyRating: number; // 1-100
  efficiencyRating: number; // 1-100
  maintenanceInterval: string;
  inStock: number;
  imageUrl: string;
  manualUrl: string;
  videos: {
    demonstration: string;
    installation: string;
    maintenance: string;
  };
  reviews: {
    user: string;
    rating: number;
    review: string;
    verified: boolean;
  }[];
}

// ===============================
// USER & ORDER MANAGEMENT
// ===============================

export interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  powerLevel: number; // Accumulated from consumed capsules
  favoriteSuperpowers: PowerType[];
  allergies: string[];
  maxIntensityTolerance: PowerIntensity;
  registrationDate: string;
  totalOrders: number;
  loyaltyPoints: number;
  verifiedPowers: string[]; // Powers they've successfully used
  avatar: string;
  preferences: {
    newsletterSubscribed: boolean;
    powerNotifications: boolean;
    safetyReminders: boolean;
  };
}

export interface CartItem {
  id: string;
  productId: string;
  productType: 'capsule' | 'machine';
  quantity: number;
  selectedOptions?: {
    deliveryDate?: string;
    giftWrap?: boolean;
    emergencyDelivery?: boolean;
  };
}

export interface ShippingAddress {
  id: string;
  firstName: string;
  lastName: string;
  company?: string;
  street1: string;
  street2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
  deliveryInstructions?: string;
  securityClearance?: 'standard' | 'enhanced' | 'cosmic'; // For high-power deliveries
}

export interface PaymentMethod {
  id: string;
  type: 'credit-card' | 'quantum-credits' | 'crypto' | 'temporal-transfer';
  lastFour?: string;
  expiryDate?: string;
  isDefault: boolean;
  provider: string;
}

export interface Order {
  id: string;
  userId: string;
  orderNumber: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: OrderStatus;
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  orderDate: string;
  estimatedDelivery: string;
  actualDelivery?: string;
  trackingNumber?: string;
  notes?: string;
  powerSafetyCheck: boolean; // Required for high-intensity orders
}

export interface OrderItem {
  id: string;
  productId: string;
  productType: 'capsule' | 'machine';
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  imageUrl: string;
  specialInstructions?: string;
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'quantum-brewing'
  | 'packaging'
  | 'shipped'
  | 'in-transit'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

// ===============================
// API RESPONSES
// ===============================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface SearchFilters {
  powerType?: PowerType[];
  rarity?: Rarity[];
  priceRange?: {
    min: number;
    max: number;
  };
  intensity?: {
    min: PowerIntensity;
    max: PowerIntensity;
  };
  inStock?: boolean;
  sortBy?: 'name' | 'price' | 'popularity' | 'power' | 'rarity';
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

export interface CompatibilityCheck {
  capsuleId: string;
  machineId: string;
  compatible: boolean;
  powerAmplification?: number;
  stabilityRating?: number;
  safetyWarnings?: string[];
  recommendations?: string[];
}

// ===============================
// SPECIAL EVENTS & PROMOTIONS
// ===============================

export interface Promotion {
  id: string;
  title: string;
  description: string;
  type: 'discount' | 'bundle' | 'free-shipping' | 'power-bonus';
  value: number;
  validFrom: string;
  validTo: string;
  minimumOrder?: number;
  applicableProducts?: string[];
  applicablePowerTypes?: PowerType[];
  maxUsage?: number;
  currentUsage: number;
  code?: string;
  active: boolean;
}

export interface PowerCombination {
  id: string;
  name: string;
  description: string;
  requiredCapsules: string[];
  resultingPower: string;
  duration: string;
  intensity: PowerIntensity;
  riskLevel: 'low' | 'medium' | 'high' | 'extreme';
  discoveredBy: string;
  successRate: number; // Percentage
  sideEffects: string[];
  prerequisites: string[]; // Required user qualifications
}

// ===============================
// TESTING INTERFACES
// ===============================

export interface TestScenario {
  id: string;
  name: string;
  description: string;
  type: 'user-journey' | 'compatibility' | 'power-simulation' | 'inventory';
  steps: TestStep[];
  expectedOutcome: string;
  automationReady: boolean;
}

export interface TestStep {
  id: string;
  description: string;
  action: string;
  expectedResult: string;
  selector?: string;
  testData?: any;
}