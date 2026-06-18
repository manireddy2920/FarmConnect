const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { Subscription, GroupBuy } = require('../models/index');
const { protect, consumerOnly } = require('../middleware/auth');

// Get consumer dashboard
router.get('/dashboard', protect, async (req, res) => {
  try {
    const consumerId = req.user._id;

    const totalOrders = await Order.countDocuments({ consumer_id: consumerId });
    const activeOrders = await Order.countDocuments({
      consumer_id: consumerId,
      order_status: { $in: ['placed', 'confirmed', 'packed', 'out_for_delivery'] },
    });

    const recentOrders = await Order.find({ consumer_id: consumerId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('product_id', 'crop_name photos price_per_kg')
      .populate('farmer_id', 'name');

    const subscription = await Subscription.findOne({ consumer_id: consumerId, status: 'active' });

    const spendingAgg = await Order.aggregate([
      { $match: { consumer_id: consumerId, payment_status: 'paid' } },
      { $group: { _id: null, total: { $sum: '$total_amount' } } },
    ]);
    const totalSpent = spendingAgg[0]?.total || 0;

    res.json({
      totalOrders,
      activeOrders,
      recentOrders,
      subscription,
      totalSpent,
      tokenBalance: req.user.token_balance,
      consumer: req.user,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get consumer wishlist / saved farmers
router.get('/saved', protect, async (req, res) => {
  try {
    // For now return top-rated products as recommendations
    const recommended = await Product.find({ status: 'active', organic: true })
      .sort({ orders_count: -1 })
      .limit(10)
      .populate('farmer_id', 'name avatar');
    res.json(recommended);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Subscription routes
router.get('/subscription', protect, async (req, res) => {
  try {
    const sub = await Subscription.findOne({ consumer_id: req.user._id, status: 'active' });
    res.json(sub);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/subscription', protect, async (req, res) => {
  try {
    const { plan_type, delivery_address, delivery_slot } = req.body;

    // Cancel existing subscription if any
    await Subscription.updateMany({ consumer_id: req.user._id }, { status: 'cancelled' });

    const nextDelivery = new Date();
    nextDelivery.setDate(nextDelivery.getDate() + 2);

    const sub = await Subscription.create({
      consumer_id: req.user._id,
      plan_type,
      delivery_address,
      delivery_slot: delivery_slot || 'morning',
      next_delivery: nextDelivery,
    });

    res.status(201).json(sub);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/subscription/pause', protect, async (req, res) => {
  try {
    const sub = await Subscription.findOneAndUpdate(
      { consumer_id: req.user._id, status: 'active' },
      { paused: true },
      { new: true }
    );
    res.json(sub);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/subscription', protect, async (req, res) => {
  try {
    await Subscription.findOneAndUpdate(
      { consumer_id: req.user._id },
      { status: 'cancelled' }
    );
    res.json({ message: 'Subscription cancelled' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Group buy routes
router.get('/groupbuy', async (req, res) => {
  try {
    const groupBuys = await GroupBuy.find({ status: 'active', deadline: { $gte: new Date() } })
      .populate('product_id', 'crop_name photos category')
      .sort({ deadline: 1 });
    res.json(groupBuys);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/groupbuy/:id/join', protect, async (req, res) => {
  try {
    const { quantity } = req.body;
    const gb = await GroupBuy.findById(req.params.id);
    if (!gb) return res.status(404).json({ message: 'Group buy not found' });
    if (gb.status !== 'active') return res.status(400).json({ message: 'Group buy is not active' });

    if (!gb.participants.includes(req.user._id)) {
      gb.participants.push(req.user._id);
    }
    gb.current_qty += Number(quantity) || 1;
    if (gb.current_qty >= gb.target_qty) gb.status = 'completed';
    await gb.save();

    res.json(gb);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Token balance
router.get('/tokens', protect, async (req, res) => {
  try {
    res.json({ balance: req.user.token_balance });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
