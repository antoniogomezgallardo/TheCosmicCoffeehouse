import mongoose, { Schema } from 'mongoose';
import { IMachine, MachineType, PowerSource, PowerType } from '../types';

const reviewSchema = new Schema({
  userId: { type: String },
  user: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  review: { type: String, required: true },
  verified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const machineSchema = new Schema<IMachine>({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true
  },
  machineModel: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    required: true,
    enum: Object.values(MachineType),
    index: true
  },
  description: {
    type: String,
    required: true,
    maxlength: 1000
  },
  capabilities: [{
    type: String,
    required: true
  }],
  compatibleCapsuleTypes: [{
    type: String,
    required: true,
    enum: Object.values(PowerType)
  }],
  powerSource: {
    type: String,
    required: true,
    enum: Object.values(PowerSource),
    index: true
  },
  price: {
    type: Number,
    required: true,
    min: 0,
    index: true
  },
  dimensions: {
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    depth: { type: Number, required: true },
    weight: { type: Number, required: true }
  },
  specifications: {
    brewingPressure: { type: String, required: true },
    quantumAmplification: { type: Number, required: true, min: 0, max: 100 },
    stabilityField: { type: Number, required: true, min: 0, max: 100 },
    maxPowerOutput: { type: Number, required: true, min: 0 }
  },
  warranty: {
    type: String,
    required: true
  },
  manufacturingDate: {
    type: Date,
    required: true
  },
  manufacturer: {
    type: String,
    required: true
  },
  safetyRating: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  efficiencyRating: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  maintenanceInterval: {
    type: String,
    required: true
  },
  inStock: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
    index: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  manualUrl: {
    type: String,
    required: true
  },
  videos: {
    demonstration: { type: String },
    installation: { type: String },
    maintenance: { type: String }
  },
  reviews: [reviewSchema],
  views: {
    type: Number,
    default: 0
  },
  purchases: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for efficient querying
machineSchema.index({ name: 'text', machineModel: 'text', description: 'text' });
machineSchema.index({ type: 1, powerSource: 1, price: 1 });
machineSchema.index({ inStock: 1, isActive: 1 });
machineSchema.index({ rating: -1, purchases: -1 });
machineSchema.index({ 'specifications.maxPowerOutput': -1 });

// Virtual for availability
machineSchema.virtual('isAvailable').get(function() {
  return this.inStock > 0 && this.isActive;
});

// Virtual for power efficiency ratio
machineSchema.virtual('powerEfficiencyRatio').get(function() {
  return (this.specifications.maxPowerOutput / 100) * this.efficiencyRating;
});

// Virtual for overall performance score
machineSchema.virtual('performanceScore').get(function() {
  return (
    (this.specifications.quantumAmplification * 0.3) +
    (this.specifications.stabilityField * 0.3) +
    (this.safetyRating * 0.2) +
    (this.efficiencyRating * 0.2)
  );
});

// Method to check if compatible with a capsule type
machineSchema.methods.isCompatibleWithCapsuleType = function(powerType: PowerType): boolean {
  return this.compatibleCapsuleTypes.includes(powerType);
};

// Method to add a review
machineSchema.methods.addReview = function(review: any) {
  this.reviews.push(review);
  // Recalculate average rating
  const totalRating = this.reviews.reduce((sum: number, r: any) => sum + r.rating, 0);
  this.rating = totalRating / this.reviews.length;
  return this.save();
};

// Method to update stock
machineSchema.methods.updateStock = function(quantity: number, operation: 'add' | 'remove') {
  if (operation === 'remove' && this.inStock < quantity) {
    throw new Error('Insufficient stock');
  }
  this.inStock = operation === 'add' ? this.inStock + quantity : this.inStock - quantity;
  return this.save();
};

// Static method to find by type
machineSchema.statics.findByType = function(type: MachineType) {
  return this.find({ type, isActive: true, inStock: { $gt: 0 } });
};

// Static method to find by power source
machineSchema.statics.findByPowerSource = function(powerSource: PowerSource) {
  return this.find({ powerSource, isActive: true, inStock: { $gt: 0 } });
};

// Static method to find machines compatible with capsule type
machineSchema.statics.findCompatibleWithCapsuleType = function(powerType: PowerType) {
  return this.find({
    compatibleCapsuleTypes: powerType,
    isActive: true,
    inStock: { $gt: 0 }
  });
};

// Static method to find high-performance machines
machineSchema.statics.findHighPerformance = function(limit: number = 10) {
  return this.find({ isActive: true, inStock: { $gt: 0 } })
    .sort({ 'specifications.maxPowerOutput': -1, rating: -1 })
    .limit(limit);
};

// Static method to find budget-friendly machines
machineSchema.statics.findBudgetFriendly = function(maxPrice: number, limit: number = 10) {
  return this.find({
    price: { $lte: maxPrice },
    isActive: true,
    inStock: { $gt: 0 }
  })
    .sort({ price: 1, rating: -1 })
    .limit(limit);
};

// Pre-save hook to validate specifications
machineSchema.pre('save', function(next) {
  // Ensure high-end machines have proper specs
  if (this.price > 10000) {
    if (this.specifications.quantumAmplification < 85) {
      this.specifications.quantumAmplification = 85;
    }
    if (this.safetyRating < 90) {
      this.safetyRating = 90;
    }
  }
  next();
});

const Machine = mongoose.model<IMachine>('Machine', machineSchema);

export default Machine;