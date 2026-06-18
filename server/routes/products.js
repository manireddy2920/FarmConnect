const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const FarmerProfile = require('../models/FarmerProfile');
const User = require('../models/User');
const { protect, farmerOnly } = require('../middleware/auth');

// Get all products (public)
router.get('/', async (req, res) => {
  try {
    const { category, organic, min_price, max_price, search, district, sort = 'createdAt', page = 1, limit = 20 } = req.query;
    const query = { status: 'active', quantity_kg: { $gt: 0 } };
    if (category) query.category = category;
    if (organic === 'true') query.organic = true;
    if (min_price || max_price) query.price_per_kg = {};
    if (min_price) query.price_per_kg.$gte = Number(min_price);
    if (max_price) query.price_per_kg.$lte = Number(max_price);
    if (search) query.crop_name = { $regex: search, $options: 'i' };
    if (district) query.district = { $regex: district, $options: 'i' };

    const sortMap = { freshness: { harvest_date: -1 }, price_asc: { price_per_kg: 1 }, price_desc: { price_per_kg: -1 }, newest: { harvest_date: -1 }, default: { createdAt: -1 } };
    const sortObj = sortMap[sort] || sortMap.default;

    const products = await Product.find(query).sort(sortObj).limit(Number(limit)).skip((Number(page) - 1) * Number(limit)).populate('farmer_id', 'name avatar');
    const total = await Product.countDocuments(query);

    // Add freshness score
    const enriched = products.map(p => {
      const obj = p.toObject();
      const days = Math.floor((Date.now() - new Date(p.harvest_date)) / 86400000);
      obj.freshness_score = Math.max(0, 100 - days * 8);
      return obj;
    });

    res.json({ products: enriched, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single product (public)
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('farmer_id', 'name avatar email');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    const profile = await FarmerProfile.findOne({ user_id: product.farmer_id._id });
    const obj = product.toObject();
    const days = Math.floor((Date.now() - new Date(product.harvest_date)) / 86400000);
    obj.freshness_score = Math.max(0, 100 - days * 8);
    obj.farmer_profile = profile;
    await Product.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });
    res.json(obj);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// QR journey (public)
router.get('/:id/journey', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('farmer_id', 'name');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    const profile = await FarmerProfile.findOne({ user_id: product.farmer_id._id });
    const harvestDate = new Date(product.harvest_date);
    const journey = [
      { step: 'Seed Planted', date: new Date(harvestDate - 90*86400000), location: profile?.district || 'Farm', actor: product.farmer_id.name, hash: '0x' + Math.random().toString(16).substr(2,8), completed: true },
      { step: 'Crop Tended', date: new Date(harvestDate - 30*86400000), location: profile?.district || 'Farm', actor: product.farmer_id.name, hash: '0x' + Math.random().toString(16).substr(2,8), completed: true },
      { step: 'Harvested', date: harvestDate, location: profile?.district || 'Farm', actor: product.farmer_id.name, hash: '0x' + Math.random().toString(16).substr(2,8), completed: true },
      { step: 'Quality Checked', date: new Date(harvestDate.getTime() + 12*3600000), location: profile?.district || 'Farm', actor: 'FarmConnect Quality Team', hash: '0x' + Math.random().toString(16).substr(2,8), completed: true },
      { step: 'Packed & Labeled', date: new Date(harvestDate.getTime() + 18*3600000), location: profile?.state || 'Packing Center', actor: 'FarmConnect Logistics', hash: '0x' + Math.random().toString(16).substr(2,8), completed: true },
      { step: 'Dispatched', date: new Date(harvestDate.getTime() + 24*3600000), location: 'Distribution Hub', actor: 'Delivery Partner', hash: '0x' + Math.random().toString(16).substr(2,8), completed: product.status !== 'active' },
      { step: 'Delivered', date: new Date(harvestDate.getTime() + 48*3600000), location: 'Consumer Address', actor: 'Delivery Partner', hash: '0x' + Math.random().toString(16).substr(2,8), completed: false },
    ];
    res.json({ product, journey, blockchain_hash: product.blockchain_hash });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Farmer: add product
router.post('/', protect, farmerOnly, async (req, res) => {
  try {
    const profile = await FarmerProfile.findOne({ user_id: req.user._id });
    const product = await Product.create({
      ...req.body,
      farmer_id: req.user._id,
      original_quantity: req.body.quantity_kg,
      district: profile?.district,
      state: profile?.state,
    });
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Farmer: update product
router.put('/:id', protect, farmerOnly, async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate({ _id: req.params.id, farmer_id: req.user._id }, req.body, { new: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Farmer: delete product
router.delete('/:id', protect, farmerOnly, async (req, res) => {
  try {
    await Product.findOneAndDelete({ _id: req.params.id, farmer_id: req.user._id });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Farmer: get my products
router.get('/farmer/my', protect, farmerOnly, async (req, res) => {
  try {
    const products = await Product.find({ farmer_id: req.user._id }).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// AI price suggestion
router.get('/ai/price-suggestion', protect, async (req, res) => {
  try {
    const { crop_name, quantity } = req.query;
    const similar = await Product.find({ crop_name: { $regex: crop_name, $options: 'i' }, status: 'active' });
    const prices = similar.map(p => p.price_per_kg);
    const avg = prices.length ? prices.reduce((a, b) => a + b, 0) / prices.length : 50;
    const trend = [avg * 0.9, avg * 0.95, avg, avg * 1.02, avg * 1.05, avg * 1.03, avg * 1.08];
    res.json({ min: Math.floor(avg * 0.9), max: Math.ceil(avg * 1.15), avg: Math.round(avg), trend, message: `Based on ${similar.length} similar listings` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
