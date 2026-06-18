'use client';

import { useState } from 'react';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import { mockCommunityPosts } from '@/lib/mockData';
import { Heart, MessageCircle, Plus, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

const CATEGORIES = ['All', 'Crop Tips', 'Market Prices', 'Government Schemes', 'Success Stories'];

export default function CommunityPage() {
  const [posts, setPosts] = useState(mockCommunityPosts);
  const [filter, setFilter] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [liked, setLiked] = useState<Set<string>>(new Set());
  const [form, setForm] = useState({ category: 'Crop Tips', title: '', content: '' });

  const toggleLike = (id: string) => {
    const newLiked = new Set(liked);
    if (liked.has(id)) {
      newLiked.delete(id);
      setPosts(ps => ps.map(p => p._id === id ? { ...p, likes: p.likes - 1 } : p));
    } else {
      newLiked.add(id);
      setPosts(ps => ps.map(p => p._id === id ? { ...p, likes: p.likes + 1 } : p));
    }
    setLiked(newLiked);
  };

  const submitPost = (e: React.FormEvent) => {
    e.preventDefault();
    const newPost = {
      _id: `post${Date.now()}`,
      author: 'You',
      district: 'Hyderabad',
      category: form.category,
      title: form.title,
      content: form.content,
      likes: 0,
      replies: 0,
      created_at: new Date().toISOString(),
    };
    setPosts([newPost, ...posts]);
    setShowForm(false);
    setForm({ category: 'Crop Tips', title: '', content: '' });
    toast.success('Post published!');
  };

  const filtered = filter === 'All' ? posts : posts.filter(p => p.category === filter);

  const categoryColors: Record<string, string> = {
    'Crop Tips': 'bg-green-100 text-green-700',
    'Market Prices': 'bg-blue-100 text-blue-700',
    'Government Schemes': 'bg-purple-100 text-purple-700',
    'Success Stories': 'bg-amber-100 text-amber-700',
  };

  return (
    <div className="min-h-screen dark:bg-gray-950">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="section-title mb-1">Farmer Community</h1>
            <p className="text-gray-500">Share knowledge, discuss markets, inspire each other</p>
          </div>
          <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2">
            <Plus size={18} /> New Post
          </button>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setFilter(cat)} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${filter === cat ? 'bg-green-700 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-green-50'}`}>
              {cat}
            </button>
          ))}
        </div>

        {/* Posts */}
        <div className="space-y-4">
          {filtered.map(post => (
            <div key={post._id} className="card p-6">
              <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${categoryColors[post.category] || 'bg-gray-100 text-gray-600'}`}>
                  {post.category}
                </span>
                <span className="text-xs text-gray-400">{formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}</span>
              </div>

              <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2">{post.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">{post.content}</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-sm">👨‍🌾</div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{post.author}</p>
                    <p className="text-xs text-gray-400">{post.district}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button onClick={() => toggleLike(post._id)} className={`flex items-center gap-1 text-sm transition-colors ${liked.has(post._id) ? 'text-red-500' : 'text-gray-400 hover:text-red-400'}`}>
                    <Heart size={14} fill={liked.has(post._id) ? 'currentColor' : 'none'} /> {post.likes}
                  </button>
                  <button className="flex items-center gap-1 text-sm text-gray-400 hover:text-green-600 transition-colors">
                    <MessageCircle size={14} /> {post.replies}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* New post modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-lg w-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-lg">Create Post</h2>
                <button onClick={() => setShowForm(false)}><X size={20} /></button>
              </div>
              <form onSubmit={submitPost} className="space-y-4">
                <div>
                  <label className="text-sm font-medium block mb-1">Category</label>
                  <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="input-field">
                    {CATEGORIES.slice(1).map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Title *</label>
                  <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="input-field" placeholder="What's your post about?" required />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Content *</label>
                  <textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} className="input-field resize-none" rows={4} placeholder="Share your knowledge, experience, or questions..." required />
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setShowForm(false)} className="flex-1 border border-gray-200 dark:border-gray-700 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Cancel</button>
                  <button type="submit" className="btn-primary flex-1">Publish Post</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
