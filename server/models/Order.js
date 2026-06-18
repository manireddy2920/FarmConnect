const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  consumer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  farmer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1 },
  total_amount: { type: Number, required: true },
  payment_method: { type: String, enum: ['upi', 'card', 'netbanking', 'wallet', 'cod'], default: 'upi' },
  payment_status: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
  escrow_status: { type: String, enum: ['held', 'released', 'refunded'], default: 'held' },
  order_status: {
    type: String,
    enum: ['placed', 'confirmed', 'packed', 'picked_up', 'out_for_delivery', 'delivered', 'cancelled'],
    default: 'placed'
  },
  delivery_address: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    landmark: String,
  },
  delivery_slot: { type: String, enum: ['morning', 'evening'], default: 'morning' },
  delivery_partner: { type: String, default: 'FarmConnect Delivery' },
  delivery_partner_phone: { type: String, default: '+91 98765 43210' },
  transaction_hash: { type: String },
  coupon_code: { type: String },
  discount_amount: { type: Number, default: 0 },
  status_history: [{
    status: String,
    timestamp: { type: Date, default: Date.now },
    note: String,
  }],
  review_submitted: { type: Boolean, default: false },
  estimated_delivery: { type: Date },
}, { timestamps: true });

orderSchema.pre('save', function(next) {
  if (!this.transaction_hash) {
    this.transaction_hash = '0x' + Array.from({length: 40}, () => Math.floor(Math.random() * 16).toString(16)).join('');
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
