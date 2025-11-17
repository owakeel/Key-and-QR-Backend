import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required']
  },
  country: {
    type: String,
    required: [true, 'Country is required']
  },
  state: {
    type: String,
    required: [true, 'State is required']
  },
  city: {
    type: String,
    required: [true, 'City is required']
  },
  street: {
    type: String,
    required: [true, 'Street address is required']
  },
  postalCode: {
    type: String,
    required: [true, 'Postal code is required']
  }
});

const orderItemSchema = new mongoose.Schema({
  productType: {
    type: String,
    required: [true, 'Product type is required'],
    enum: ['keychain', 'subscription']
  },
  keychainDesignId: {
    type: String,
    required: function() {
      return this.productType === 'keychain';
    }
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be at least 1']
  },
  unitPrice: {
    type: Number,
    required: [true, 'Unit price is required'],
    min: [0, 'Unit price cannot be negative']
  },
  totalPrice: {
    type: Number,
    required: [true, 'Total price is required'],
    min: [0, 'Total price cannot be negative']
  }
});

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  shippingAddress: {
    type: addressSchema,
    required: [true, 'Shipping address is required']
  },
  billingAddress: {
    type: addressSchema,
    required: [true, 'Billing address is required']
  },
  subtotal: {
    type: Number,
    required: [true, 'Subtotal is required'],
    min: [0, 'Subtotal cannot be negative']
  },
  shippingFee: {
    type: Number,
    required: [true, 'Shipping fee is required'],
    min: [0, 'Shipping fee cannot be negative']
  },
  total: {
    type: Number,
    required: [true, 'Total amount is required'],
    min: [0, 'Total cannot be negative']
  },
  currency: {
    type: String,
    default: 'USD',
    enum: ['USD', 'EUR', 'GBP', 'BDT']
  },
  paymentStatus: {
    type: String,
    required: [true, 'Payment status is required'],
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    required: [true, 'Payment method is required'],
    enum: ['card', 'paypal', 'bank-transfer']
  },
  paymentReference: {
    type: String
  },
  orderStatus: {
    type: String,
    required: [true, 'Order status is required'],
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  items: [orderItemSchema]
}, {
  timestamps: true
});

// Indexes
orderSchema.index({ userId: 1 });
orderSchema.index({ paymentStatus: 1 });
orderSchema.index({ orderStatus: 1 });
orderSchema.index({ createdAt: -1 });

// Virtual for formatted order number
orderSchema.virtual('orderNumber').get(function() {
  return `ORD-${this._id.toString().slice(-8).toUpperCase()}`;
});

// Calculate totals before save
orderSchema.pre('save', function(next) {
  if (this.items && this.items.length > 0) {
    this.subtotal = this.items.reduce((total, item) => total + item.totalPrice, 0);
    this.total = this.subtotal + this.shippingFee;
  }
  next();
});

const Order = mongoose.model('Order', orderSchema);
export default Order;