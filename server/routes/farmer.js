const express = require('express');
const router = express.Router();
const User = require('../models/User');
const FarmerProfile = require('../models/FarmerProfile');
const Product = require('../models/Product');
const Order = require('../models/Order');
const { protect, farmerOnly } = require('../middleware/auth');

// Get farmer dashboard stats
router.get('/dashboard', protect, farmerOnly, async (req, res) => {
  try {
    const farmerId = req.user._id;

    const totalProducts = await Product.countDocuments({ farmer_id: farmerId });
    const activeProducts = await Product.countDocuments({ farmer_id: farmerId, status: 'active' });
    const totalOrders = await Order.countDocuments({ farmer_id: farmerId });
    const pendingOrders = await Order.countDocuments({ farmer_id: farmerId, order_status: { $in: ['placed', 'confirmed', 'packed'] } });

    const earningsAgg = await Order.aggregate([
      { $match: { farmer_id: farmerId, payment_status: 'paid' } },
      { $group: { _id: null, total: { $sum: '$total_amount' } } },
    ]);
    const totalEarnings = earningsAgg[0]?.total || 0;

    const recentOrders = await Order.find({ farmer_id: farmerId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('product_id', 'crop_name')
      .populate('consumer_id', 'name');

    const profile = await FarmerProfile.findOne({ user_id: farmerId });

    res.json({
      totalProducts,
      activeProducts,
      totalOrders,
      pendingOrders,
      totalEarnings,
      recentOrders,
      profile,
      farmer: req.user,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get farmer profile
router.get('/profile', protect, farmerOnly, async (req, res) => {
  try {
    const profile = await FarmerProfile.findOne({ user_id: req.user._id });
    res.json({ user: req.user, profile });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update farmer profile
router.put('/profile', protect, farmerOnly, async (req, res) => {
  try {
    const {
      name, phone, avatar,
      district, state, farm_size_acres, farming_type,
      languages_spoken, bio, story, years_farming, family_background,
    } = req.body;

    await User.findByIdAndUpdate(req.user._id, { name, phone, avatar });

    const profile = await FarmerProfile.findOneAndUpdate(
      { user_id: req.user._id },
      { district, state, farm_size_acres, farming_type, languages_spoken, bio, story, years_farming, family_background },
      { new: true, upsert: true }
    );

    res.json({ user: await User.findById(req.user._id), profile });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get farmer insights (analytics)
router.get('/insights', protect, farmerOnly, async (req, res) => {
  try {
    const farmerId = req.user._id;

    // Monthly earnings for last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyEarnings = await Order.aggregate([
      { $match: { farmer_id: farmerId, payment_status: 'paid', createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          total: { $sum: '$total_amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    // Top selling products
    const topProducts = await Order.aggregate([
      { $match: { farmer_id: farmerId } },
      { $group: { _id: '$product_id', totalQty: { $sum: '$quantity' }, totalRevenue: { $sum: '$total_amount' } } },
      { $sort: { totalRevenue: -1 } },
      { $limit: 5 },
      { $lookup: { from: 'products', localField: '_id', foreignField: '_id', as: 'product' } },
      { $unwind: '$product' },
    ]);

    // Category breakdown
    const categoryBreakdown = await Product.aggregate([
      { $match: { farmer_id: farmerId } },
      { $group: { _id: '$category', count: { $sum: 1 }, totalQty: { $sum: '$original_quantity' } } },
    ]);

    res.json({ monthlyEarnings, topProducts, categoryBreakdown });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all farmers (public)
router.get('/', async (req, res) => {
  try {
    const { district, state, verified, page = 1, limit = 20 } = req.query;
    const query = {};
    if (district) query.district = { $regex: district, $options: 'i' };
    if (state) query.state = { $regex: state, $options: 'i' };
    if (verified === 'true') query.verified = true;

    const profiles = await FarmerProfile.find(query)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .populate('user_id', 'name avatar email');

    res.json(profiles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single farmer profile (public)
router.get('/:id', async (req, res) => {
  try {
    const profile = await FarmerProfile.findOne({ user_id: req.params.id }).populate('user_id', 'name avatar email');
    if (!profile) return res.status(404).json({ message: 'Farmer not found' });

    const products = await Product.find({ farmer_id: req.params.id, status: 'active' }).limit(10);
    res.json({ profile, products });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
