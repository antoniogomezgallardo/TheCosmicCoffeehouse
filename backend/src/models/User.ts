import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { IUser, PowerType } from '../types';

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30,
    index: true
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  powerLevel: {
    type: Number,
    default: 1,
    min: 1,
    max: 100
  },
  favoriteSuperpowers: [{
    type: String,
    enum: Object.values(PowerType)
  }],
  allergies: [{
    type: String
  }],
  maxIntensityTolerance: {
    type: Number,
    default: 5,
    min: 1,
    max: 10
  },
  registrationDate: {
    type: Date,
    default: Date.now
  },
  totalOrders: {
    type: Number,
    default: 0
  },
  loyaltyPoints: {
    type: Number,
    default: 0
  },
  verifiedPowers: [{
    type: String
  }],
  avatar: {
    type: String,
    default: '/images/avatars/default-cosmic-user.jpg'
  },
  preferences: {
    newsletterSubscribed: { type: Boolean, default: true },
    powerNotifications: { type: Boolean, default: true },
    safetyReminders: { type: Boolean, default: true }
  },
  refreshToken: {
    type: String,
    select: false
  },
  resetPasswordToken: {
    type: String,
    select: false
  },
  resetPasswordExpires: {
    type: Date,
    select: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for efficient querying
userSchema.index({ email: 1, username: 1 });
userSchema.index({ powerLevel: -1 });
userSchema.index({ loyaltyPoints: -1 });

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for power tier
userSchema.virtual('powerTier').get(function() {
  if (this.powerLevel >= 80) return 'Legendary';
  if (this.powerLevel >= 60) return 'Epic';
  if (this.powerLevel >= 40) return 'Rare';
  if (this.powerLevel >= 20) return 'Uncommon';
  return 'Common';
});

// Virtual for loyalty tier
userSchema.virtual('loyaltyTier').get(function() {
  if (this.loyaltyPoints >= 10000) return 'Cosmic Elite';
  if (this.loyaltyPoints >= 5000) return 'Quantum Member';
  if (this.loyaltyPoints >= 2000) return 'Plasma Level';
  if (this.loyaltyPoints >= 500) return 'Energy User';
  return 'Starter';
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(Number(process.env.BCRYPT_ROUNDS) || 10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    return false;
  }
};

// Generate JWT token
userSchema.methods.generateAuthToken = function(): string {
  const payload = {
    id: this._id,
    email: this.email,
    username: this.username,
    powerLevel: this.powerLevel
  };

  return jwt.sign(
    payload,
    process.env.JWT_SECRET || 'cosmic-secret-key',
    { expiresIn: process.env.JWT_EXPIRES_IN || '15m' } as any
  );
};

// Generate refresh token
userSchema.methods.generateRefreshToken = function(): string {
  const payload = {
    id: this._id,
    tokenVersion: Date.now()
  };

  return jwt.sign(
    payload,
    process.env.JWT_REFRESH_SECRET || 'cosmic-refresh-secret',
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' } as any
  );
};

// Method to increase power level
userSchema.methods.increasePowerLevel = function(amount: number) {
  this.powerLevel = Math.min(100, this.powerLevel + amount);
  return this.save();
};

// Method to add loyalty points
userSchema.methods.addLoyaltyPoints = function(points: number) {
  this.loyaltyPoints += points;

  // Award bonus points based on tier
  if (this.loyaltyPoints >= 10000 && this.loyaltyPoints - points < 10000) {
    this.loyaltyPoints += 1000; // Bonus for reaching Cosmic Elite
  } else if (this.loyaltyPoints >= 5000 && this.loyaltyPoints - points < 5000) {
    this.loyaltyPoints += 500; // Bonus for reaching Quantum Member
  }

  return this.save();
};

// Method to verify a power
userSchema.methods.verifyPower = function(power: string) {
  if (!this.verifiedPowers.includes(power)) {
    this.verifiedPowers.push(power);
    this.powerLevel = Math.min(100, this.powerLevel + 5); // Bonus for verifying new power
  }
  return this.save();
};

// Method to check if user can handle capsule intensity
userSchema.methods.canHandleIntensity = function(intensity: number): boolean {
  return intensity <= this.maxIntensityTolerance;
};

// Static method to find by email or username
userSchema.statics.findByCredentials = async function(identifier: string) {
  return this.findOne({
    $or: [
      { email: identifier.toLowerCase() },
      { username: identifier }
    ]
  }).select('+password +refreshToken');
};

// Static method to find power users
userSchema.statics.findPowerUsers = function(minPowerLevel: number = 50) {
  return this.find({ powerLevel: { $gte: minPowerLevel } })
    .sort({ powerLevel: -1, loyaltyPoints: -1 });
};

// Static method to find loyal customers
userSchema.statics.findLoyalCustomers = function(minPoints: number = 1000) {
  return this.find({ loyaltyPoints: { $gte: minPoints } })
    .sort({ loyaltyPoints: -1 });
};

// Remove sensitive data when converting to JSON
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  delete user.refreshToken;
  delete user.resetPasswordToken;
  delete user.resetPasswordExpires;
  delete user.__v;
  return user;
};

const User = mongoose.model<IUser>('User', userSchema);

export default User;