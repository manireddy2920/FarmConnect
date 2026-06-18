const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  farmer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  crop_name: { type: String, required: true, trim: true },
  variety: { type: String, trim: true },
  category: { type: String, enum: ['vegetables', 'fruits', 'grains', 'dairy', 'herbs', 'other'], default: 'vegetables' },
  quantity_kg: { type: Number, required: true, min: 0 },
  original_quantity: { type: Number },
  price_per_kg: { type: Number, required: true, min: 0 },
  harvest_date: { type: Date, required: true },
  available_until: { type: Date },
  storage_method: { type: String },
  organic: { type: Boolean, default: false },
  certification_hash: { type: String },
  blockchain_hash: { type: String },
  photos: [{ type: String }],
  status: { type: String, enum: ['active', 'sold', 'donated', 'expired', 'pending'], default: 'active' },
  district: { type: String },
  state: { type: String },
  co2_saved_per_kg: { type: Number, default: 0.21 },
  description: { type: String },
  ai_suggested_min: { type: Number },
  ai_suggested_max: { type: Number },
  views: { type: Number, default: 0 },
  orders_count: { type: Number, default: 0 },
  freshness_score: { type: Number, default: 100 },
}, { timestamps: true });

// Auto-generate blockchain hash
productSchema.pre('save', function(next) {
  if (!this.blockchain_hash) {
    this.blockchain_hash = '0x' + Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('');
  }
  if (!this.original_quantity) {
    this.original_quantity = this.quantity_kg;
  }
  next();
});

// Virtual for freshness score
productSchema.virtual('computed_freshness').get(function() {
  const daysSinceHarvest = Math.floor((Date.now() - this.harvest_date) / (1000 * 60 * 60 * 24));
  return Math.max(0, 100 - (daysSinceHarvest * 8));
});

module.exports = mongoose.model('Product', productSchema);
