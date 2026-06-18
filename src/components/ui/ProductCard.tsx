'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Leaf, MapPin, Calendar } from 'lucide-react';
import { useCartStore } from '@/store';
import FreshnessScore from './FreshnessScore';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

interface ProductCardProps {
  product: {
    _id: string;
    crop_name: string;
    variety?: string;
    farmer_name: string;
    farmer_id: string;
    price_per_kg: number;
    quantity_kg: number;
    harvest_date: string;
    organic: boolean;
    photos: string[];
    district: string;
    carbon_saved_per_kg: number;
    blockchain_hash: string;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCartStore();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      product_id: product._id,
      crop_name: product.crop_name,
      farmer_name: product.farmer_name,
      price_per_kg: product.price_per_kg,
      quantity: 1,
      photo: product.photos[0] || '',
      organic: product.organic,
      farmer_id: product.farmer_id,
    });
    toast.success(`${product.crop_name} added to cart!`);
  };

  const photo = product.photos[0] || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400';

  return (
    <Link href={`/shop/${product._id}`} className="block">
      <div className="card card-hover overflow-hidden group">
        {/* Image */}
        <div className="relative h-48 overflow-hidden bg-gray-100">
          <img
            src={photo}
            alt={product.crop_name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {product.organic && (
            <div className="absolute top-2 left-2 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
              <Leaf size={10} /> Organic
            </div>
          )}
          <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
            🌱 {(product.carbon_saved_per_kg * 50).toFixed(1)} kg CO₂ saved
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white text-lg leading-tight">{product.crop_name}</h3>
            {product.variety && <p className="text-gray-500 dark:text-gray-400 text-xs">{product.variety}</p>}
          </div>

          <FreshnessScore harvestDate={product.harvest_date} size="sm" />

          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <MapPin size={12} /> {product.district}
            <span>·</span>
            <Calendar size={12} /> {format(new Date(product.harvest_date), 'MMM d')}
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-2xl font-bold text-green-700 dark:text-green-400">₹{product.price_per_kg}</span>
              <span className="text-gray-500 text-sm">/kg</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">{product.quantity_kg}kg left</span>
              <button
                onClick={handleAddToCart}
                className="btn-primary py-2 px-3 text-sm flex items-center gap-1"
              >
                <ShoppingCart size={14} /> Add
              </button>
            </div>
          </div>

          <div className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
            <span>👨‍🌾</span>
            <span className="font-medium text-green-700 dark:text-green-400">{product.farmer_name}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
