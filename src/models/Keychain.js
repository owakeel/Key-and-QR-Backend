import mongoose from 'mongoose';

const keychainSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Owner ID is required']
  },
  permanentQuoteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quote',
    required: [true, 'Permanent quote is required']
  },
  giftNote: {
    type: String,
    trim: true,
    maxlength: [200, 'Gift note cannot be more than 200 characters']
  },
  qrCodeUrl: {
    type: String,
    required: [true, 'QR Code URL is required']
  },
  designId: {
    type: String,
    required: [true, 'Design ID is required']
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'gifted'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Indexes
keychainSchema.index({ ownerId: 1 });
keychainSchema.index({ permanentQuoteId: 1 });
keychainSchema.index({ status: 1 });

const Keychain = mongoose.model('Keychain', keychainSchema);
export default Keychain;