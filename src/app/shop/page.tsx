'use client';

import { useState, useMemo, useEffect } from 'react';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import ProductCard from '@/components/ui/ProductCard';
import { SlidersHorizontal, Search, X, Loader2 } from 'lucide-react';

const categories = ['All', 'Vegetables', 'Fruits', 'Grains', 'Dairy', 'Herbs'];

interface Product {
  _id: string;
  crop_name: string;
  variety?: string;
  category: string;
  quantity_kg: number;
  original_quantity: number;
  price_per_kg: number;
  harvest_date: string;
  organic: boolean;
  photos: string[];
  status: string;
  district: string;
  state: string;
  farmer_id: { _id: string; name: string; avatar?: string } | string;
  farmer_name?: string;
  freshness_score?: number;
}

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [organicOnly, setOrganicOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState(500);
  const [sortBy, setSortBy] = useState('freshness');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams({ limit: '100', sort: sortBy });
        if (category !== 'All') params.set('category', category.toLowerCase());
        if (organicOnly) params.set('organic', 'true');
        if (search) params.set('search', search);

        const res = await fetch(`/api/products?${params}`);
        if (!res.ok) throw new Error('Failed to fetch products');
        const data = await res.json();
        setProducts(data.products || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchProducts, 300);
    return () => clearTimeout(debounce);
  }, [search, category, organicOnly, sortBy]);

  const filtered = useMemo(() => {
    return products.filter(p => p.price_per_kg <= maxPrice);
  }, [products, maxPrice]);

  const recommended = useMemo(() => {
    return products.filter(p => p.organic).slice(0, 4);
  }, [products]);

  return (
    <div className="min-h-screen dark:bg-gray-950">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="section-title mb-2">Fresh From the Farm</h1>
          <p className="text-gray-500">
            {loading ? 'Loading products...' : `${filtered.length} products available from verified farmers`}
          </p>
        </div>

        {/* Search + Sort bar */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="relative flex-1 min-w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search vegetables, farmers..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-field pl-10"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X size={16} className="text-gray-400" />
              </button>
            )}
          </div>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="input-field w-auto">
            <option value="freshness">Freshest First</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="newest">Newest First</option>
          </select>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 border border-gray-200 dark:border-gray-700 px-4 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <SlidersHorizontal size={18} /> Filters
          </button>
        </div>

        {/* Category tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                category === cat
                  ? 'bg-green-700 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-green-50 dark:hover:bg-green-900/20'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Filters panel */}
        {showFilters && (
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 mb-6 grid sm:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Max Price: ₹{maxPrice}/kg</label>
              <input
                type="range" min={10} max={500} value={maxPrice}
                onChange={e => setMaxPrice(Number(e.target.value))}
                className="w-full accent-green-600"
              />
            </div>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <div
                  className={`w-12 h-6 rounded-full transition-colors ${organicOnly ? 'bg-green-600' : 'bg-gray-300'} relative`}
                  onClick={() => setOrganicOnly(!organicOnly)}
                  role="switch"
                  aria-checked={organicOnly}
                >
                  <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${organicOnly ? 'left-6' : 'left-0.5'} shadow`} />
                </div>
                <span className="text-sm font-medium">Organic Only 🌿</span>
              </label>
            </div>
          </div>
        )}

        {/* Recommended row */}
        {recommended.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">⭐ Organic Picks</h2>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {recommended.map(p => (
                <div key={p._id} className="flex-shrink-0 w-52 card p-3 flex items-center gap-3">
                  <img
                    src={p.photos?.[0] || '/placeholder-produce.jpg'}
                    alt={p.crop_name}
                    className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="font-semibold text-sm truncate">{p.crop_name}</p>
                    <p className="text-green-700 font-bold">₹{p.price_per_kg}/kg</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Products grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-gray-400">
            <Loader2 size={40} className="animate-spin text-green-600" />
            <p>Loading fresh produce...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">⚠️</div>
            <p className="text-lg font-medium text-gray-600 dark:text-gray-400">Could not load products</p>
            <p className="text-sm text-gray-400 mt-1">{error}</p>
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map(product => {
              const farmerObj = typeof product.farmer_id === 'object' && product.farmer_id !== null
                ? product.farmer_id
                : null;
              const normalised = {
                ...product,
                farmer_id: farmerObj?._id ?? (product.farmer_id as string) ?? '',
                farmer_name: product.farmer_name ?? farmerObj?.name ?? 'Farmer',
                carbon_saved_per_kg: (product as any).carbon_saved_per_kg ?? 0.21,
                blockchain_hash: (product as any).blockchain_hash ?? '',
              };
              return <ProductCard key={product._id} product={normalised} />;
            })}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-400">
            <div className="text-6xl mb-4">🌱</div>
            <p className="text-xl font-medium">No products found</p>
            <p className="text-sm mt-2">Try adjusting your filters</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
