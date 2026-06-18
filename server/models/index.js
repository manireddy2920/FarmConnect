const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  order_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  consumer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  farmer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  freshness_rating: { type: Number, min: 1, max: 5, required: true },
  taste_rating: { type: Number, min: 1, max: 5, required: true },
  packaging_rating: { type: Number, min: 1, max: 5, required: true },
  text: { type: String, maxlength: 500 },
  blockchain_hash: { type: String },
}, { timestamps: true });

reviewSchema.pre('save', function(next) {
  if (!this.blockchain_hash) {
    this.blockchain_hash = '0x' + Array.from({length: 40}, () => Math.floor(Math.random() * 16).toString(16)).join('');
  }
  next();
});

const subscriptionSchema = new mongoose.Schema({
  consumer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  plan_type: { type: String, enum: ['basic', 'family', 'premium'], required: true },
  start_date: { type: Date, default: Date.now },
  next_delivery: { type: Date },
  status: { type: String, enum: ['active', 'paused', 'cancelled'], default: 'active' },
  paused: { type: Boolean, default: false },
  delivery_address: {
    street: String,
    city: String,
    state: String,
    pincode: String,
  },
  delivery_slot: { type: String, enum: ['morning', 'evening'], default: 'morning' },
}, { timestamps: true });

const groupBuySchema = new mongoose.Schema({
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  title: { type: String, required: true },
  target_qty: { type: Number, required: true },
  current_qty: { type: Number, default: 0 },
  original_price: { type: Number, required: true },
  discount_price: { type: Number, required: true },
  deadline: { type: Date, required: true },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  status: { type: String, enum: ['active', 'completed', 'failed'], default: 'active' },
}, { timestamps: true });

const communityPostSchema = new mongoose.Schema({
  author_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, enum: ['crop_tips', 'market_prices', 'govt_schemes', 'success_stories'], default: 'crop_tips' },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  replies: [{
    author_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    content: String,
    createdAt: { type: Date, default: Date.now },
  }],
  district: { type: String },
}, { timestamps: true });

const disputeSchema = new mongoose.Schema({
  order_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  raised_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  issue_text: { type: String, required: true },
  status: { type: String, enum: ['open', 'resolved', 'escalated'], default: 'open' },
  resolution: { type: String },
  resolved_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = {
  Review: mongoose.model('Review', reviewSchema),
  Subscription: mongoose.model('Subscription', subscriptionSchema),
  GroupBuy: mongoose.model('GroupBuy', groupBuySchema),
  CommunityPost: mongoose.model('CommunityPost', communityPostSchema),
  Dispute: mongoose.model('Dispute', disputeSchema),
};
