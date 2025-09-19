import mongoose, { Schema } from 'mongoose';
import { ICapsule, PowerType, Rarity } from '../types';

const testimonialSchema = new Schema({
  userId: { type: String },
  user: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  review: { type: String, required: true },
  powerExperience: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const capsuleSchema = new Schema<ICapsule>({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true
  },
  superpower: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true,
    maxlength: 1000
  },
  powerType: {
    type: String,
    required: true,
    enum: Object.values(PowerType),
    index: true
  },
  duration: {
    type: String,
    required: true
  },
  sideEffects: [{
    type: String,
    required: true
  }],
  rarity: {
    type: String,
    required: true,
    enum: Object.values(Rarity),
    index: true
  },
  price: {
    type: Number,
    required: true,
    min: 0,
    index: true
  },
  requiredMachines: [{
    type: String,
    required: true
  }],
  flavorProfile: {
    primary: { type: String, required: true },
    secondary: { type: String, required: true },
    notes: [{ type: String }]
  },
  intensity: {
    type: Number,
    required: true,
    min: 1,
    max: 10,
    index: true
  },
  energyRating: {
    type: Number,
    required: true,
    min: 1,
    max: 100
  },
  quantumStability: {
    type: Number,
    required: true,
    min: 1,
    max: 100
  },
  discoveredBy: {
    type: String,
    required: true
  },
  discoveryDate: {
    type: Date,
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
  warnings: [{
    type: String
  }],
  testimonials: [testimonialSchema],
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
capsuleSchema.index({ name: 'text', superpower: 'text', description: 'text' });
capsuleSchema.index({ powerType: 1, rarity: 1, price: 1 });
capsuleSchema.index({ inStock: 1, isActive: 1 });
capsuleSchema.index({ rating: -1, purchases: -1 });

// Virtual for availability
capsuleSchema.virtual('isAvailable').get(function() {
  return this.inStock > 0 && this.isActive;
});

// Virtual for popularity score
capsuleSchema.virtual('popularityScore').get(function() {
  return (this.rating * 20) + (this.purchases * 0.1) + (this.views * 0.01);
});

// Method to check compatibility with a machine
capsuleSchema.methods.isCompatibleWith = function(machineId: string): boolean {
  return this.requiredMachines.includes(machineId);
};

// Method to add a testimonial
capsuleSchema.methods.addTestimonial = function(testimonial: any) {
  this.testimonials.push(testimonial);
  // Recalculate average rating
  const totalRating = this.testimonials.reduce((sum, t) => sum + t.rating, 0);
  this.rating = totalRating / this.testimonials.length;
  return this.save();
};

// Method to update stock
capsuleSchema.methods.updateStock = function(quantity: number, operation: 'add' | 'remove') {
  if (operation === 'remove' && this.inStock < quantity) {
    throw new Error('Insufficient stock');
  }
  this.inStock = operation === 'add' ? this.inStock + quantity : this.inStock - quantity;
  return this.save();
};

// Static method to find by power type
capsuleSchema.statics.findByPowerType = function(powerType: PowerType) {
  return this.find({ powerType, isActive: true, inStock: { $gt: 0 } });
};

// Static method to find by rarity
capsuleSchema.statics.findByRarity = function(rarity: Rarity) {
  return this.find({ rarity, isActive: true, inStock: { $gt: 0 } });
};

// Static method to find popular capsules
capsuleSchema.statics.findPopular = function(limit: number = 10) {
  return this.find({ isActive: true, inStock: { $gt: 0 } })
    .sort({ rating: -1, purchases: -1, views: -1 })
    .limit(limit);
};

// Static method to find new arrivals
capsuleSchema.statics.findNewArrivals = function(limit: number = 10) {
  return this.find({ isActive: true, inStock: { $gt: 0 } })
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Pre-save hook to validate intensity based on rarity
capsuleSchema.pre('save', function(next) {
  // Ensure legendary capsules have high intensity
  if (this.rarity === Rarity.LEGENDARY && this.intensity < 8) {
    this.intensity = 8;
  }
  // Ensure common capsules don't have extreme intensity
  if (this.rarity === Rarity.COMMON && this.intensity > 6) {
    this.intensity = 6;
  }
  next();
});

const Capsule = mongoose.model<ICapsule>('Capsule', capsuleSchema);

export default Capsule;