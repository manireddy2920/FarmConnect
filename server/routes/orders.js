const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const { Review } = require('../models/index');
const { protect, farmerOnly, consumerOnly } = require('../middleware/auth');

// Place order
router.post('/', protect, async (req, res) => {
  try {
    const { product_id, quantity, payment_method, delivery_address, delivery_slot, coupon_code } = req.body;
    const product = await Product.findById(product_id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (product.quantity_kg < quantity) return res.status(400).json({ message: 'Insufficient stock' });

    const total_amount = product.price_per_kg * quantity;
    const estimated_delivery = new Date(Date.now() + 2 * 86400000);

    const order = await Order.create({
      consumer_id: req.user._id,
      farmer_id: product.farmer_id,
      product_id,
      quantity,
      total_amount,
      payment_method: payment_method || 'upi',
      delivery_address,
      delivery_slot: delivery_slot || 'morning',
      coupon_code,
      payment_status: 'paid',
      escrow_status: 'held',
      estimated_delivery,
      status_history: [{ status: 'placed', note: 'Order placed successfully' }],
    });

    // Decrement stock
    await Product.findByIdAndUpdate(product_id, { $inc: { quantity_kg: -quantity, orders_count: 1 } });

    // Add tokens to consumer
    await User.findByIdAndUpdate(req.user._id, { $inc: { token_balance: 10 } });

    await order.populate(['consumer_id', 'farmer_id', 'product_id']);
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get consumer orders
router.get('/my', protect, async (req, res) => {
  try {
    const orders = await Order.find({ consumer_id: req.user._id }).sort({ createdAt: -1 }).populate('product_id', 'crop_name photos price_per_kg').populate('farmer_id', 'name');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get farmer orders
router.get('/farmer', protect, farmerOnly, async (req, res) => {
  try {
    const orders = await Order.find({ farmer_id: req.user._id }).sort({ createdAt: -1 }).populate('product_id', 'crop_name photos').populate('consumer_id', 'name phone');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single order
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('product_id').populate('farmer_id', 'name phone avatar').populate('consumer_id', 'name phone');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update order status (farmer)
router.put('/:id/status', protect, async (req, res) => {
  try {
    const { status, note } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    order.order_status = status;
    order.status_history.push({ status, note: note || '' });
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Confirm delivery (consumer) — releases escrow
router.put('/:id/confirm-delivery', protect, async (req, res) => {
  try {
    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, consumer_id: req.user._id },
      { order_status: 'delivered', escrow_status: 'released', $push: { status_history: { status: 'delivered', note: 'Delivery confirmed by consumer' } } },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: 'Order not found' });
    // Update farmer earnings
    await User.findByIdAndUpdate(order.farmer_id, { $inc: { token_balance: 5 } });
    res.json({ ...order.toObject(), payment_released: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Submit review
router.post('/:id/review', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    const review = await Review.create({
      order_id: order._id,
      consumer_id: req.user._id,
      farmer_id: order.farmer_id,
      product_id: order.product_id,
      ...req.body,
    });
    await Order.findByIdAndUpdate(order._id, { review_submitted: true });
    await User.findByIdAndUpdate(req.user._id, { $inc: { token_balance: 5 } });
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get reviews for a product
router.get('/reviews/:productId', async (req, res) => {
  try {
    const reviews = await Review.find({ product_id: req.params.productId }).populate('consumer_id', 'name avatar');
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
