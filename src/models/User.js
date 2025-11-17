import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false
  },
  isSubscribed: {
    type: Boolean,
    default: false
  },
  subscriptionStart: {
    type: Date
  },
  subscriptionEnd: {
    type: Date
  },
  selectedCategory: {
    type: String,
    enum: ['motivational', 'spiritual', 'love', 'friendship', 'business'],
    default: 'motivational'
  },
  nextQuoteAvailableAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ isSubscribed: 1 });

// Password hashing middleware
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Instance method to check password
userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// Check if subscription is active
userSchema.methods.isSubscriptionActive = function() {
  return this.isSubscribed && this.subscriptionEnd > new Date();
};

const User = mongoose.model('User', userSchema);
export default User;
