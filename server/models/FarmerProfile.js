const mongoose = require('mongoose');

const farmerProfileSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  aadhaar_number: { type: String },
  aadhaar_url: { type: String },
  farm_location_lat: { type: Number },
  farm_location_lng: { type: Number },
  district: { type: String },
  state: { type: String },
  farm_size_acres: { type: Number },
  farming_type: { type: String, enum: ['organic', 'conventional', 'mixed'], default: 'conventional' },
  languages_spoken: [{ type: String }],
  bio: { type: String, maxlength: 200 },
  story: { type: String, maxlength: 500 },
  video_url: { type: String },
  profile_photo: { type: String },
  years_farming: { type: Number, default: 1 },
  family_background: { type: String },
  certifications: [{
    name: { type: String },
    hash: { type: String },
    issue_date: { type: Date },
    verified: { type: Boolean, default: false },
  }],
  verified: { type: Boolean, default: false },
  verification_date: { type: Date },
  total_earned: { type: Number, default: 0 },
  total_orders: { type: Number, default: 0 },
  rating: { type: Number, default: 4.5 },
}, { timestamps: true });

module.exports = mongoose.model('FarmerProfile', farmerProfileSchema);
