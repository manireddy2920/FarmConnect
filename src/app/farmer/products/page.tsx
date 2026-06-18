'use client';

import { useState } from 'react';
import Navbar from '@/components/shared/Navbar';
import { mockProducts, generateBlockchainHash } from '@/lib/mockData';
import { Plus, Edit, Trash2, X, Leaf, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const CATEGORIES = ['vegetables', 'fruits', 'grains', 'dairy', 'herbs', 'other'];

const empty = {
  crop_name: '', variety: '', category: 'vegetables', quantity_kg: '',
  price_per_kg: '', harvest_date: '', available_until: '', storage_method: '',
  organic: false, photos: [''],
};

export default function FarmerProductsPage() {
  const [products, setProducts] = useState(mockProducts.filter(p => p.farmer_id === 'farmer1'));
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<any>(empty);
  const [aiPrice, setAiPrice] = useState<{ min: number; max: number } | null>(null);
  const [saving, setSaving] = useState(false);

  const set = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }));

  const showAiPrice = () => {
    if (!form.crop_name) return;
    const base = Math.floor(Math.random() * 40) + 20;
    setAiPrice({ min: base, max: base + 15 });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await new Promise(r => setTimeout(r, 1000));
    if (editId) {
      setProducts(ps => ps.map(p => p._id === editId ? { ...p, ...form, quantity_kg: Number(form.quantity_kg), price_per_kg: Number(form.price_per_kg) } : p));
      toast.success('Product updated!');
    } else {
      const newProduct = {
        ...form,
        _id: `prod${Date.now()}`,
        farmer_id: 'farmer1',
        farmer_name: 'Ravi Kumar',
        farmer_district: 'Warangal',
        quantity_kg: Number(form.quantity_kg),
        original_quantity: Number(form.quantity_kg),
        price_per_kg: Number(form.price_per_kg),
        blockchain_hash: generateBlockchainHash(),
        status: 'active',
        carbon_saved_per_kg: 0.21,
        district: 'Warangal',
        photos: form.photos.filter(Boolean),
      };
      setProducts(ps => [newProduct, ...ps]);
      toast.success('Product listed on blockchain! 🎉');
    }
    setSaving(false);
    setShowForm(false);
    setEditId(null);
    setForm(empty);
    setAiPrice(null);
  };

  const handleEdit = (p: any) => {
    setForm({ ...p, quantity_kg: p.quantity_kg.toString(), price_per_kg: p.price_per_kg.toString() });
    setEditId(p._id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setProducts(ps => ps.filter(p => p._id !== id));
    toast.success('Product removed');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Products</h1>
            <p className="text-gray-500 text-sm mt-1">{products.length} products listed</p>
          </div>
          <button onClick={() => { setShowForm(true); setEditId(null); setForm(empty); }} className="btn-primary flex items-center gap-2">
            <Plus size={18} /> Add Product
          </button>
        </div>

        {/* Products table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  {['Product', 'Category', 'Qty (kg)', 'Price/kg', 'Harvest Date', 'Status', 'Actions'].map(h => (
                    <th key={h} className="text-left py-3 px-4 text-gray-500 font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p._id} className="border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img src={p.photos[0]} alt={p.crop_name} className="w-10 h-10 rounded-lg object-cover" />
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">{p.crop_name}</p>
                          {p.variety && <p className="text-xs text-gray-400">{p.variety}</p>}
                          {p.organic && <span className="badge-green text-xs flex items-center gap-1 w-fit mt-0.5"><Leaf size={8} />Organic</span>}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 capitalize text-gray-600 dark:text-gray-300">{p.category}</td>
                    <td className="py-3 px-4">
                      <span className={p.quantity_kg / p.original_quantity < 0.1 ? 'text-red-600 font-bold' : 'text-gray-900 dark:text-white font-semibold'}>
                        {p.quantity_kg}
                      </span>
                      {p.quantity_kg / p.original_quantity < 0.1 && <p className="text-xs text-red-500">Low stock!</p>}
                    </td>
                    <td className="py-3 px-4 font-semibold text-green-700 dark:text-green-400">₹{p.price_per_kg}</td>
                    <td className="py-3 px-4 text-gray-500">{format(new Date(p.harvest_date), 'dd MMM yyyy')}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${p.status === 'active' ? 'badge-green' : 'badge-amber'}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(p)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"><Edit size={14} /></button>
                        <button onClick={() => handleDelete(p._id)} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add/Edit Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-2xl w-full my-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">{editId ? 'Edit Product' : 'Add New Product'}</h2>
                <button onClick={() => setShowForm(false)}><X size={20} /></button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium block mb-1">Crop Name *</label>
                    <input value={form.crop_name} onChange={e => { set('crop_name', e.target.value); setAiPrice(null); }} className="input-field" placeholder="e.g. Tomatoes" required />
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-1">Variety</label>
                    <input value={form.variety} onChange={e => set('variety', e.target.value)} className="input-field" placeholder="e.g. Desi Red" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium block mb-1">Category *</label>
                    <select value={form.category} onChange={e => set('category', e.target.value)} className="input-field">
                      {CATEGORIES.map(c => <option key={c} value={c} className="capitalize">{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-1">Quantity (kg) *</label>
                    <input type="number" min="1" value={form.quantity_kg} onChange={e => set('quantity_kg', e.target.value)} className="input-field" placeholder="100" required />
                  </div>
                </div>

                {/* AI Price Suggestion */}
                <div>
                  <label className="text-sm font-medium block mb-1">Price per kg (₹) *</label>
                  <div className="flex gap-2">
                    <input type="number" min="1" value={form.price_per_kg} onChange={e => set('price_per_kg', e.target.value)} className="input-field flex-1" placeholder="45" required />
                    <button type="button" onClick={showAiPrice} className="btn-outline px-3 flex items-center gap-1 text-sm whitespace-nowrap">
                      <TrendingUp size={14} /> AI Suggest
                    </button>
                  </div>
                  {aiPrice && (
                    <div className="mt-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-xl text-sm">
                      <p className="text-green-700 dark:text-green-400 font-medium">🤖 AI Suggestion for {form.crop_name}:</p>
                      <p className="text-green-600 text-xs mt-1">Based on current demand and season, suggested price is <strong>₹{aiPrice.min}–₹{aiPrice.max}/kg</strong></p>
                      <div className="flex gap-2 mt-2">
                        <button type="button" onClick={() => set('price_per_kg', aiPrice.min.toString())} className="text-xs bg-green-600 text-white px-2 py-1 rounded">Use ₹{aiPrice.min}</button>
                        <button type="button" onClick={() => set('price_per_kg', aiPrice.max.toString())} className="text-xs bg-green-600 text-white px-2 py-1 rounded">Use ₹{aiPrice.max}</button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium block mb-1">Harvest Date *</label>
                    <input type="date" value={form.harvest_date?.split('T')[0] || ''} onChange={e => set('harvest_date', e.target.value)} className="input-field" required />
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-1">Available Until *</label>
                    <input type="date" value={form.available_until?.split('T')[0] || ''} onChange={e => set('available_until', e.target.value)} className="input-field" required />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium block mb-1">Storage Method</label>
                  <input value={form.storage_method} onChange={e => set('storage_method', e.target.value)} className="input-field" placeholder="e.g. Cool dry place, Refrigerate" />
                </div>

                <div>
                  <label className="text-sm font-medium block mb-1">Photo URLs (up to 4)</label>
                  {[0, 1, 2, 3].map(i => (
                    <input key={i} value={form.photos?.[i] || ''} onChange={e => { const ph = [...(form.photos || [])]; ph[i] = e.target.value; set('photos', ph); }} className="input-field mb-2 text-sm" placeholder={`Photo URL ${i + 1}`} />
                  ))}
                </div>

                <label className="flex items-center gap-3 cursor-pointer">
                  <div onClick={() => set('organic', !form.organic)} className={`w-12 h-6 rounded-full transition-colors ${form.organic ? 'bg-green-600' : 'bg-gray-300'} relative flex-shrink-0`}>
                    <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${form.organic ? 'left-6' : 'left-0.5'} shadow`} />
                  </div>
                  <span className="text-sm font-medium">🌿 Organic Certified Product</span>
                </label>

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowForm(false)} className="flex-1 border border-gray-200 dark:border-gray-700 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium">Cancel</button>
                  <button type="submit" disabled={saving} className="btn-primary flex-1 flex items-center justify-center gap-2">
                    {saving ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving...</> : (editId ? 'Update Product' : 'List Product')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
