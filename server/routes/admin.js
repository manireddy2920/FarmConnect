const express = require('express');
const router = express.Router();
const User = require('../models/User');
const FarmerProfile = require('../models/FarmerProfile');
const Product = require('../models/Product');
const Order = require('../models/Order');
const { Dispute } = require('../models/index');
const { protect, adminOnly } = require('../middleware/auth');

// All admin routes require auth + admin role
router.use(protect, adminOnly);

// Dashboard stats
router.get('/dashboard', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalFarmers = await User.countDocuments({ role: 'farmer' });
    const totalConsumers = await User.countDocuments({ role: 'consumer' });
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const openDisputes = await Dispute.countDocuments({ status: 'open' });

    const revenueAgg = await Order.aggregate([
      { $match: { payment_status: 'paid' } },
      { $group: { _id: null, total: { $sum: '$total_amount' } } },
    ]);
    const totalRevenue = revenueAgg[0]?.total || 0;

    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5).select('-password');
    const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5)
      .populate('consumer_id', 'name')
      .populate('farmer_id', 'name')
      .populate('product_id', 'crop_name');

    res.json({
      totalUsers, totalFarmers, totalConsumers,
      totalProducts, totalOrders, openDisputes, totalRevenue,
      recentUsers, recentOrders,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Users management
router.get('/users', async (req, res) => {
  try {
    const { role, page = 1, limit = 20, search } = req.query;
    const query = {};
    if (role) query.role = role;
    if (search) query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await User.countDocuments(query);
    res.json({ users, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/users/:id/toggle', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.is_active = !user.is_active;
    await user.save();
    res.json({ message: `User ${user.is_active ? 'activated' : 'deactivated'}`, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Farmer verification
router.get('/farmers/pending', async (req, res) => {
  try {
    const pending = await FarmerProfile.find({ verified: false }).populate('user_id', 'name email phone');
    res.json(pending);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/farmers/:id/verify', async (req, res) => {
  try {
    const profile = await FarmerProfile.findOneAndUpdate(
      { user_id: req.params.id },
      { verified: true, verification_date: new Date() },
      { new: true }
    );
    if (!profile) return res.status(404).json({ message: 'Farmer profile not found' });
    res.json({ message: 'Farmer verified', profile });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Products management
router.get('/products', async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const query = status ? { status } : {};
    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .populate('farmer_id', 'name email');

    const total = await Product.countDocuments(query);
    res.json({ products, total });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/products/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Disputes management
router.get('/disputes', async (req, res) => {
  try {
    const disputes = await Dispute.find()
      .sort({ createdAt: -1 })
      .populate('order_id')
      .populate('raised_by', 'name email');
    res.json(disputes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/disputes/:id/resolve', async (req, res) => {
  try {
    const { resolution } = req.body;
    const dispute = await Dispute.findByIdAndUpdate(
      req.params.id,
      { status: 'resolved', resolution, resolved_by: req.user._id },
      { new: true }
    );
    res.json(dispute);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Orders overview
router.get('/orders', async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const query = status ? { order_status: status } : {};
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .populate('consumer_id', 'name email')
      .populate('farmer_id', 'name email')
      .populate('product_id', 'crop_name');

    const total = await Order.countDocuments(query);
    res.json({ orders, total });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
