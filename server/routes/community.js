const express = require('express');
const router = express.Router();
const { CommunityPost } = require('../models/index');
const { protect } = require('../middleware/auth');

// Get all posts (public)
router.get('/', async (req, res) => {
  try {
    const { category, district, page = 1, limit = 20, search } = req.query;
    const query = {};
    if (category) query.category = category;
    if (district) query.district = { $regex: district, $options: 'i' };
    if (search) query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { content: { $regex: search, $options: 'i' } },
    ];

    const posts = await CommunityPost.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .populate('author_id', 'name avatar role');

    const total = await CommunityPost.countDocuments(query);
    res.json({ posts, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single post (public)
router.get('/:id', async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id)
      .populate('author_id', 'name avatar role')
      .populate('replies.author_id', 'name avatar role');
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create post (authenticated)
router.post('/', protect, async (req, res) => {
  try {
    const { title, content, category, district } = req.body;
    const post = await CommunityPost.create({
      author_id: req.user._id,
      title,
      content,
      category: category || 'crop_tips',
      district,
    });
    await post.populate('author_id', 'name avatar role');
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Like / unlike post (authenticated)
router.put('/:id/like', protect, async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const liked = post.likes.includes(req.user._id);
    if (liked) {
      post.likes = post.likes.filter(id => id.toString() !== req.user._id.toString());
    } else {
      post.likes.push(req.user._id);
    }
    await post.save();
    res.json({ likes: post.likes.length, liked: !liked });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Reply to post (authenticated)
router.post('/:id/reply', protect, async (req, res) => {
  try {
    const { content } = req.body;
    const post = await CommunityPost.findByIdAndUpdate(
      req.params.id,
      { $push: { replies: { author_id: req.user._id, content } } },
      { new: true }
    ).populate('replies.author_id', 'name avatar role');

    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.status(201).json(post.replies[post.replies.length - 1]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete post (author only)
router.delete('/:id', protect, async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.author_id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await CommunityPost.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
