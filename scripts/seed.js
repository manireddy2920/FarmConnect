/**
 * FarmConnect Database Seed Script
 * Run with: node scripts/seed.js
 * Make sure MONGODB_URI is set in .env.local
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/farmconnect';

// ── Schemas ─────────────────────────────────────────────────────────────────
const UserSchema = new mongoose.Schema({
  name: String, email: { type: String, unique: true }, password: String,
  role: String, phone: String, language: { type: String, default: 'en' },
  token_balance: { type: Number, default: 0 }, referral_code: String,
  avatar: String, created_at: { type: Date, default: Date.now },
});

const FarmerProfileSchema = new mongoose.Schema({
  user_id: mongoose.Schema.Types.ObjectId, aadhaar_url: String,
  district: String, state: String, farming_type: String,
  bio: String, story: String, video_url: String, verified: Boolean,
  verification_date: Date, certifications: Array,
  languages_spoken: [String], years_of_farming: Number,
  total_earned: { type: Number, default: 0 },
  pending_payout: { type: Number, default: 0 },
});

const ProductSchema = new mongoose.Schema({
  farmer_id: mongoose.Schema.Types.ObjectId, crop_name: String,
  variety: String, category: String, quantity_kg: Number,
  original_quantity: Number, price_per_kg: Number, harvest_date: Date,
  available_until: Date, storage_method: String, organic: Boolean,
  blockchain_hash: { type: String, unique: true }, photos: [String],
  status: String, district: String, state: String,
  carbon_saved_per_kg: { type: Number, default: 0.21 },
  created_at: { type: Date, default: Date.now },
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);
const FarmerProfile = mongoose.models.FarmerProfile || mongoose.model('FarmerProfile', FarmerProfileSchema);
const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

function randomHash() {
  return '0x' + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
}

async function seed() {
  console.log('🌱 Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected!');

  // Clear existing data
  await Promise.all([User.deleteMany({}), FarmerProfile.deleteMany({}), Product.deleteMany({})]);
  console.log('🧹 Cleared existing data');

  const password = await bcrypt.hash('demo1234', 12);

  // ── Create users ──────────────────────────────────────────────────────────
  const [adminUser, farmer1, farmer2, farmer3, consumer1] = await User.insertMany([
    { name: 'FarmConnect Admin', email: 'admin@farmconnect.com', password, role: 'admin',
      phone: '+91 99999 00000', referral_code: 'ADMIN001', token_balance: 0 },
    { name: 'Ravi Kumar', email: 'ravi@farm.com', password, role: 'farmer',
      phone: '+91 98765 43210', referral_code: 'RAVI001', token_balance: 0,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' },
    { name: 'Lakshmi Devi', email: 'lakshmi@farm.com', password, role: 'farmer',
      phone: '+91 87654 32109', referral_code: 'LAKS001', token_balance: 0,
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150' },
    { name: 'Suresh Reddy', email: 'suresh@farm.com', password, role: 'farmer',
      phone: '+91 76543 21098', referral_code: 'SURE001', token_balance: 0,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150' },
    { name: 'Priya Sharma', email: 'priya@consumer.com', password, role: 'consumer',
      phone: '+91 65432 10987', referral_code: 'PRIY001', token_balance: 150 },
  ]);

  console.log('👥 Users created');

  // ── Farmer profiles ───────────────────────────────────────────────────────
  await FarmerProfile.insertMany([
    {
      user_id: farmer1._id, district: 'Warangal', state: 'Telangana',
      farming_type: 'organic', verified: true, verification_date: new Date('2024-01-15'),
      bio: 'Third-generation farmer growing the finest organic vegetables in Warangal district.',
      story: 'My grandfather started this farm in 1952. I switched to certified organic farming three years ago to protect our soil and provide healthier food to city families.',
      languages_spoken: ['Telugu', 'Hindi'], years_of_farming: 15,
      total_earned: 84500, pending_payout: 3200,
      certifications: [{ name: 'India Organic', hash: randomHash(), issue_date: new Date('2023-01-15') }],
    },
    {
      user_id: farmer2._id, district: 'Nalgonda', state: 'Telangana',
      farming_type: 'organic', verified: true, verification_date: new Date('2023-08-10'),
      bio: 'Specializing in traditional rice varieties and millets. Preserving heritage seeds.',
      story: 'I am passionate about preserving heirloom seeds. My farm grows 12 varieties of traditional rice that were nearly extinct.',
      languages_spoken: ['Telugu'], years_of_farming: 22,
      total_earned: 125000, pending_payout: 8900,
      certifications: [],
    },
    {
      user_id: farmer3._id, district: 'Karimnagar', state: 'Telangana',
      farming_type: 'conventional', verified: true, verification_date: new Date('2023-06-20'),
      bio: 'Large-scale vegetable farming with modern techniques. Reliable supply all year.',
      story: 'I run a 50-acre farm using precision agriculture with drip irrigation and soil testing.',
      languages_spoken: ['Telugu', 'Hindi', 'English'], years_of_farming: 10,
      total_earned: 210000, pending_payout: 15000,
      certifications: [],
    },
  ]);

  console.log('🌾 Farmer profiles created');

  // ── Products ──────────────────────────────────────────────────────────────
  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;

  await Product.insertMany([
    {
      farmer_id: farmer1._id, crop_name: 'Tomatoes', variety: 'Desi Red',
      category: 'vegetables', quantity_kg: 150, original_quantity: 200,
      price_per_kg: 35, harvest_date: new Date(now - 2 * day), available_until: new Date(now + 5 * day),
      storage_method: 'Cool dry place', organic: true, blockchain_hash: randomHash(),
      photos: ['https://images.unsplash.com/photo-1546470427-227c0a5e3e97?w=400','https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400'],
      status: 'active', district: 'Warangal', state: 'Telangana',
    },
    {
      farmer_id: farmer2._id, crop_name: 'Basmati Rice', variety: 'Traditional Sona Masoori',
      category: 'grains', quantity_kg: 500, original_quantity: 800,
      price_per_kg: 55, harvest_date: new Date(now - 10 * day), available_until: new Date(now + 30 * day),
      storage_method: 'Airtight bags, cool place', organic: true, blockchain_hash: randomHash(),
      photos: ['https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400'],
      status: 'active', district: 'Nalgonda', state: 'Telangana',
    },
    {
      farmer_id: farmer3._id, crop_name: 'Spinach', variety: 'Palak',
      category: 'vegetables', quantity_kg: 80, original_quantity: 100,
      price_per_kg: 28, harvest_date: new Date(now - 1 * day), available_until: new Date(now + 3 * day),
      storage_method: 'Refrigerate', organic: false, blockchain_hash: randomHash(),
      photos: ['https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400'],
      status: 'active', district: 'Karimnagar', state: 'Telangana',
    },
    {
      farmer_id: farmer1._id, crop_name: 'Brinjal', variety: 'Purple Round',
      category: 'vegetables', quantity_kg: 60, original_quantity: 80,
      price_per_kg: 25, harvest_date: new Date(now - 3 * day), available_until: new Date(now + 4 * day),
      storage_method: 'Cool dry place', organic: true, blockchain_hash: randomHash(),
      photos: ['https://images.unsplash.com/photo-1659904604064-9d5e6f93ad05?w=400'],
      status: 'active', district: 'Warangal', state: 'Telangana',
    },
    {
      farmer_id: farmer2._id, crop_name: 'Mango', variety: 'Alphonso',
      category: 'fruits', quantity_kg: 120, original_quantity: 200,
      price_per_kg: 120, harvest_date: new Date(now - 5 * day), available_until: new Date(now + 7 * day),
      storage_method: 'Room temperature or refrigerate', organic: true, blockchain_hash: randomHash(),
      photos: ['https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400'],
      status: 'active', district: 'Nalgonda', state: 'Telangana',
    },
    {
      farmer_id: farmer3._id, crop_name: 'Onion', variety: 'Red Onion',
      category: 'vegetables', quantity_kg: 300, original_quantity: 500,
      price_per_kg: 22, harvest_date: new Date(now - 7 * day), available_until: new Date(now + 20 * day),
      storage_method: 'Cool dry place, avoid moisture', organic: false, blockchain_hash: randomHash(),
      photos: ['https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400'],
      status: 'active', district: 'Karimnagar', state: 'Telangana',
    },
  ]);

  console.log('🛒 Products created');
  console.log('\n✅ Database seeded successfully!\n');
  console.log('Demo login credentials (password: demo1234):');
  console.log('  Admin    → admin@farmconnect.com');
  console.log('  Farmer 1 → ravi@farm.com');
  console.log('  Farmer 2 → lakshmi@farm.com');
  console.log('  Farmer 3 → suresh@farm.com');
  console.log('  Consumer → priya@consumer.com');

  await mongoose.disconnect();
}

seed().catch(err => { console.error('❌ Seed failed:', err); process.exit(1); });
