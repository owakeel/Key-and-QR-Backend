import mongoose from 'mongoose';

const weeklyQuoteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  quoteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quote',
    required: [true, 'Quote ID is required']
  },
  deliveredAt: {
    type: Date,
    default: Date.now
  },
  isRead: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Compound index to ensure one quote per user per week
weeklyQuoteSchema.index({ 
  userId: 1, 
  quoteId: 1,
  deliveredAt: 1 
});

// Index for efficient querying
weeklyQuoteSchema.index({ userId: 1, deliveredAt: -1 });

const WeeklyQuote = mongoose.model('WeeklyQuote', weeklyQuoteSchema);
export default WeeklyQuote;