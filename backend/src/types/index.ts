import { Request } from 'express';
import { Document } from 'mongoose';

// ===============================
// POWER TYPES & ENUMS
// ===============================

export enum PowerType {
  MENTAL = 'mental',
  PHYSICAL = 'physical',
  MYSTICAL = 'mystical',
  TEMPORAL = 'temporal'
}

export enum Rarity {
  COMMON = 'common',
  RARE = 'rare',
  EPIC = 'epic',
  LEGENDARY = 'legendary'
}

export enum MachineType {
  QUANTUM = 'quantum',
  PLASMA = 'plasma',
  TEMPORAL = 'temporal',
  NEURAL = 'neural',
  COSMIC = 'cosmic'
}

export enum PowerSource {
  QUANTUM_CELLS = 'quantum-cells',
  PLASMA_CORE = 'plasma-core',
  TEMPORAL_FLUX = 'temporal-flux',
  DARK_MATTER = 'dark-matter',
  ANTIMATTER = 'antimatter',
  COSMIC = 'cosmic'
}

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PROCESSING = 'processing',
  QUANTUM_BREWING = 'quantum-brewing',
  PACKAGING = 'packaging',
  SHIPPED = 'shipped',
  IN_TRANSIT = 'in-transit',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded'
}

// ===============================
// DOCUMENT INTERFACES
// ===============================

export interface IUser extends Document {
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  powerLevel: number;
  favoriteSuperpowers: PowerType[];
  allergies: string[];
  maxIntensityTolerance: number;
  registrationDate: Date;
  totalOrders: number;
  loyaltyPoints: number;
  verifiedPowers: string[];
  avatar?: string;
  preferences: {
    newsletterSubscribed: boolean;
    powerNotifications: boolean;
    safetyReminders: boolean;
  };
  refreshToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateAuthToken(): string;
  generateRefreshToken(): string;
}

export interface ICapsule extends Document {
  name: string;
  superpower: string;
  description: string;
  powerType: PowerType;
  duration: string;
  sideEffects: string[];
  rarity: Rarity;
  price: number;
  requiredMachines: string[];
  flavorProfile: {
    primary: string;
    secondary: string;
    notes: string[];
  };
  intensity: number;
  energyRating: number;
  quantumStability: number;
  discoveredBy: string;
  discoveryDate: Date;
  inStock: number;
  imageUrl: string;
  warnings: string[];
  testimonials: {
    userId: string;
    user: string;
    rating: number;
    review: string;
    powerExperience: string;
    createdAt: Date;
  }[];
  views: number;
  purchases: number;
  rating: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IMachine extends Document {
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
  manufacturingDate: Date;
  manufacturer: string;
  safetyRating: number;
  efficiencyRating: number;
  maintenanceInterval: string;
  inStock: number;
  imageUrl: string;
  manualUrl: string;
  videos: {
    demonstration?: string;
    installation?: string;
    maintenance?: string;
  };
  reviews: {
    userId: string;
    user: string;
    rating: number;
    review: string;
    verified: boolean;
    createdAt: Date;
  }[];
  views: number;
  purchases: number;
  rating: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICartItem {
  productId: string;
  productType: 'capsule' | 'machine';
  quantity: number;
  selectedOptions?: {
    deliveryDate?: Date;
    giftWrap?: boolean;
    emergencyDelivery?: boolean;
  };
}

export interface ICart extends Document {
  userId: string;
  items: ICartItem[];
  subtotal: number;
  estimatedTax: number;
  estimatedShipping: number;
  estimatedTotal: number;
  appliedPromotions: string[];
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IShippingAddress {
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
  securityClearance?: 'standard' | 'enhanced' | 'cosmic';
}

export interface IOrder extends Document {
  userId: string;
  orderNumber: string;
  items: {
    productId: string;
    productType: 'capsule' | 'machine';
    productName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    imageUrl: string;
    specialInstructions?: string;
  }[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: OrderStatus;
  shippingAddress: IShippingAddress;
  paymentMethod: {
    type: 'credit-card' | 'quantum-credits' | 'crypto' | 'temporal-transfer';
    lastFour?: string;
    provider: string;
  };
  orderDate: Date;
  estimatedDelivery: Date;
  actualDelivery?: Date;
  trackingNumber?: string;
  notes?: string;
  powerSafetyCheck: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPromotion extends Document {
  title: string;
  description: string;
  type: 'discount' | 'bundle' | 'free-shipping' | 'power-bonus';
  value: number;
  validFrom: Date;
  validTo: Date;
  minimumOrder?: number;
  applicableProducts?: string[];
  applicablePowerTypes?: PowerType[];
  maxUsage?: number;
  currentUsage: number;
  code?: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICompatibilityCheck extends Document {
  capsuleId: string;
  machineId: string;
  compatible: boolean;
  powerAmplification?: number;
  stabilityRating?: number;
  safetyWarnings?: string[];
  recommendations?: string[];
  testedBy: string;
  testedDate: Date;
}

// ===============================
// REQUEST INTERFACES
// ===============================

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    username: string;
    powerLevel: number;
  };
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

export interface CapsuleFilterQuery extends PaginationQuery {
  powerType?: PowerType | PowerType[];
  rarity?: Rarity | Rarity[];
  minPrice?: number;
  maxPrice?: number;
  minIntensity?: number;
  maxIntensity?: number;
  inStock?: boolean;
}

export interface MachineFilterQuery extends PaginationQuery {
  type?: MachineType | MachineType[];
  powerSource?: PowerSource | PowerSource[];
  minPrice?: number;
  maxPrice?: number;
  compatibleWith?: PowerType;
  inStock?: boolean;
}

// ===============================
// API RESPONSE INTERFACES
// ===============================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
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

export interface TokenPayload {
  id: string;
  email: string;
  username: string;
  powerLevel: number;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

// ===============================
// VALIDATION SCHEMAS
// ===============================

export interface RegisterInput {
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface CreateCapsuleInput {
  name: string;
  superpower: string;
  description: string;
  powerType: PowerType;
  duration: string;
  sideEffects: string[];
  rarity: Rarity;
  price: number;
  requiredMachines: string[];
  flavorProfile: {
    primary: string;
    secondary: string;
    notes: string[];
  };
  intensity: number;
  energyRating: number;
  quantumStability: number;
  discoveredBy: string;
  discoveryDate: Date;
  inStock: number;
  imageUrl: string;
  warnings: string[];
}

export interface CreateMachineInput {
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
  manufacturingDate: Date;
  manufacturer: string;
  safetyRating: number;
  efficiencyRating: number;
  maintenanceInterval: string;
  inStock: number;
  imageUrl: string;
  manualUrl: string;
}

export interface CreateOrderInput {
  items: ICartItem[];
  shippingAddress: IShippingAddress;
  paymentMethod: {
    type: 'credit-card' | 'quantum-credits' | 'crypto' | 'temporal-transfer';
    lastFour?: string;
    provider: string;
  };
  notes?: string;
}

// ===============================
// ERROR CODES
// ===============================

export enum ErrorCode {
  // Authentication
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  TOKEN_INVALID = 'TOKEN_INVALID',
  UNAUTHORIZED = 'UNAUTHORIZED',

  // Validation
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_INPUT = 'INVALID_INPUT',

  // Resources
  RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',
  RESOURCE_ALREADY_EXISTS = 'RESOURCE_ALREADY_EXISTS',

  // Business Logic
  INSUFFICIENT_STOCK = 'INSUFFICIENT_STOCK',
  INCOMPATIBLE_CAPSULE_MACHINE = 'INCOMPATIBLE_CAPSULE_MACHINE',
  POWER_LEVEL_TOO_LOW = 'POWER_LEVEL_TOO_LOW',
  INTENSITY_TOO_HIGH = 'INTENSITY_TOO_HIGH',

  // Server
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',

  // Payment
  PAYMENT_FAILED = 'PAYMENT_FAILED',
  INSUFFICIENT_FUNDS = 'INSUFFICIENT_FUNDS',

  // Order
  ORDER_CANNOT_BE_CANCELLED = 'ORDER_CANNOT_BE_CANCELLED',
  ORDER_ALREADY_DELIVERED = 'ORDER_ALREADY_DELIVERED'
}