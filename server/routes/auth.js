const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const FarmerProfile = require('../models/FarmerProfile');
const { protect } = require('../middleware/auth');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET || 'farmconnect_secret', { expiresIn: '30d' });

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, phone, language, district, state, farming_type, languages_spoken } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already registered' });

    const user = await User.create({ name, email, password, role: role || 'consumer', phone, language: language || 'en' });

    if (role === 'farmer') {
      await FarmerProfile.create({
        user_id: user._id,
        district: district || '',
        state: state || '',
        farming_type: farming_type || 'conventional',
        languages_spoken: languages_spoken || ['en'],
        verified: false,
      });
    }

    res.status(201).json({ token: generateToken(user._id), user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    res.json({ token: generateToken(user._id), user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get current user
router.get('/me', protect, async (req, res) => {
  res.json(req.user);
});

// Update profile
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, phone, language, avatar } = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, { name, phone, language, avatar }, { new: true });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Seed demo data
router.post('/seed', async (req, res) => {
  try {
    const Product = require('../models/Product');
    const { CommunityPost, GroupBuy } = require('../models/index');

    // Create admin
    let admin = await User.findOne({ email: 'admin@farmconnect.in' });
    if (!admin) {
      admin = await User.create({ name: 'FarmConnect Admin', email: 'admin@farmconnect.in', password: 'admin123', role: 'admin', phone: '9876543210' });
    }

    // Create demo farmers
    const farmersData = [
      { name: 'Ravi Kumar', email: 'ravi@farm.in', district: 'Warangal', state: 'Telangana', bio: 'Organic farmer for 15 years', story: 'Started with 2 acres, now 12 acres of certified organic land. My family has been farming for 3 generations.' },
      { name: 'Lakshmi Devi', email: 'lakshmi@farm.in', district: 'Krishna', state: 'Andhra Pradesh', bio: 'Specialises in leafy greens', story: 'Pioneered hydroponic farming in our village. Supplying fresh greens to Hyderabad for 5 years.' },
      { name: 'Suresh Yadav', email: 'suresh@farm.in', district: 'Medak', state: 'Telangana', bio: 'Traditional grain farmer', story: 'Grows heritage varieties of rice and millets. Winner of state agriculture award 2022.' },
    ];

    const farmerUsers = [];
    for (const fd of farmersData) {
      let u = await User.findOne({ email: fd.email });
      if (!u) u = await User.create({ name: fd.name, email: fd.email, password: 'farmer123', role: 'farmer', phone: '9' + Math.floor(Math.random()*1000000000) });
      let fp = await FarmerProfile.findOne({ user_id: u._id });
      if (!fp) fp = await FarmerProfile.create({ user_id: u._id, district: fd.district, state: fd.state, farming_type: 'organic', bio: fd.bio, story: fd.story, verified: true, verification_date: new Date() });
      farmerUsers.push(u);
    }

    // Create demo consumers
    const consumersData = [
      { name: 'Priya Sharma', email: 'priya@consumer.in' },
      { name: 'Arjun Mehta', email: 'arjun@consumer.in' },
    ];
    const consumerUsers = [];
    for (const cd of consumersData) {
      let u = await User.findOne({ email: cd.email });
      if (!u) u = await User.create({ name: cd.name, email: cd.email, password: 'consumer123', role: 'consumer', token_balance: 150 });
      consumerUsers.push(u);
    }

    // Create demo products
    const productsData = [
      { crop_name: 'Tomatoes', variety: 'Cherry Tomato', category: 'vegetables', quantity_kg: 50, price_per_kg: 45, harvest_date: new Date(Date.now() - 2*86400000), organic: true, photos: ['https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400'], district: 'Warangal', state: 'Telangana' },
      { crop_name: 'Spinach', variety: 'Baby Spinach', category: 'vegetables', quantity_kg: 30, price_per_kg: 35, harvest_date: new Date(Date.now() - 1*86400000), organic: true, photos: ['https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400'], district: 'Warangal', state: 'Telangana' },
      { crop_name: 'Mango', variety: 'Alphonso', category: 'fruits', quantity_kg: 100, price_per_kg: 120, harvest_date: new Date(Date.now() - 3*86400000), organic: false, photos: ['https://images.unsplash.com/photo-1605027990121-cbae9e0642df?w=400'], district: 'Krishna', state: 'Andhra Pradesh' },
      { crop_name: 'Rice', variety: 'Sona Masuri', category: 'grains', quantity_kg: 200, price_per_kg: 55, harvest_date: new Date(Date.now() - 5*86400000), organic: false, photos: ['https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400'], district: 'Medak', state: 'Telangana' },
      { crop_name: 'Brinjal', variety: 'Long Purple', category: 'vegetables', quantity_kg: 40, price_per_kg: 28, harvest_date: new Date(Date.now() - 1*86400000), organic: true, photos: ['https://images.unsplash.com/photo-1615484477778-ca3b77940c25?w=400'], district: 'Krishna', state: 'Andhra Pradesh' },
      { crop_name: 'Banana', variety: 'Robusta', category: 'fruits', quantity_kg: 80, price_per_kg: 32, harvest_date: new Date(Date.now() - 2*86400000), organic: false, photos: ['https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400'], district: 'Medak', state: 'Telangana' },
    ];

    for (let i = 0; i < productsData.length; i++) {
      const pd = productsData[i];
      const farmer = farmerUsers[i % farmerUsers.length];
      const existing = await Product.findOne({ crop_name: pd.crop_name, farmer_id: farmer._id });
      if (!existing) await Product.create({ ...pd, farmer_id: farmer._id, original_quantity: pd.quantity_kg, status: 'active' });
    }

    // Community posts
    const posts = [
      { title: 'Best practices for organic tomato farming', content: 'After 10 years of organic farming, here are my top tips...', category: 'crop_tips', district: 'Warangal' },
      { title: 'Mango prices expected to rise 20% this season', content: 'Due to unseasonal rains, mango output is down by 15%...', category: 'market_prices', district: 'Krishna' },
      { title: 'PM Kisan scheme - New registration open', content: 'The government has opened new registrations for PM Kisan Samman Nidhi...', category: 'govt_schemes', district: 'Medak' },
    ];
    for (let i = 0; i < posts.length; i++) {
      const existing = await CommunityPost.findOne({ title: posts[i].title });
      if (!existing) await CommunityPost.create({ ...posts[i], author_id: farmerUsers[i % farmerUsers.length]._id });
    }

    // Group buys
    const products = await Product.find().limit(2);
    for (const p of products) {
      const existing = await GroupBuy.findOne({ product_id: p._id });
      if (!existing) await GroupBuy.create({
        product_id: p._id,
        title: `Group Buy: ${p.crop_name}`,
        target_qty: 100,
        current_qty: Math.floor(Math.random() * 70) + 10,
        original_price: p.price_per_kg,
        discount_price: Math.floor(p.price_per_kg * 0.85),
        deadline: new Date(Date.now() + 3*86400000),
        participants: consumerUsers.map(u => u._id),
        status: 'active',
      });
    }

    res.json({ message: 'Demo data seeded successfully', admin: { email: 'admin@farmconnect.in', password: 'admin123' }, farmer: { email: 'ravi@farm.in', password: 'farmer123' }, consumer: { email: 'priya@consumer.in', password: 'consumer123' } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
