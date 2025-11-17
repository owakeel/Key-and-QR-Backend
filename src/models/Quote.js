import mongoose from 'mongoose';

const quoteSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Quote text is required'],
    trim: true,
    maxlength: [500, 'Quote cannot be more than 500 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: ['motivational', 'spiritual', 'love', 'friendship', 'business'],
      message: 'Category is either: motivational, spiritual, love, friendship, business'
    }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes
quoteSchema.index({ category: 1 });
quoteSchema.index({ isActive: 1 });

const Quote = mongoose.model('Quote', quoteSchema);
export default Quote;