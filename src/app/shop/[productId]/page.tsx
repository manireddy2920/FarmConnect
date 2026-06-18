'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import { mockProducts, mockJourneySteps, calculateFreshnessScore, getFreshnessLabel } from '@/lib/mockData';
import FreshnessScore from '@/components/ui/FreshnessScore';
import { useCartStore } from '@/store';
import { QRCodeSVG } from 'qrcode.react';
import { ShoppingCart, CheckCircle, Leaf, Shield, X, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function ProductDetailPage() {
  const { productId } = useParams<{ productId: string }>();
  const [activePhoto, setActivePhoto] = useState(0);
  const [qty, setQty] = useState(1);
  const [showJourney, setShowJourney] = useState(false);
  const { addItem } = useCartStore();

  const product = mockProducts.find(p => p._id === productId) || mockProducts[0];
  const steps = mockJourneySteps(productId);
  const score = calculateFreshnessScore(product.harvest_date);
  const { label: freshnessLabel } = getFreshnessLabel(score);

  const handleAddToCart = () => {
    addItem({
      product_id: product._id,
      crop_name: product.crop_name,
      farmer_name: product.farmer_name,
      price_per_kg: product.price_per_kg,
      quantity: qty,
      photo: product.photos[0],
      organic: product.organic,
      farmer_id: product.farmer_id,
    });
    toast.success(`${qty}kg ${product.crop_name} added to cart!`);
  };

  return (
    <div className="min-h-screen dark:bg-gray-950">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Photos */}
          <div className="space-y-4">
            <div className="rounded-2xl overflow-hidden bg-gray-100 h-96">
              <img src={product.photos[activePhoto] || product.photos[0]} alt={product.crop_name} className="w-full h-full object-cover" />
            </div>
            <div className="flex gap-3 overflow-x-auto">
              {product.photos.map((p, i) => (
                <button key={i} onClick={() => setActivePhoto(i)} className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 ${activePhoto === i ? 'border-green-600' : 'border-transparent'}`}>
                  <img src={p} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                {product.organic && (
                  <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                    <Leaf size={10} /> Certified Organic
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
                {product.crop_name}
                {product.variety && <span className="text-gray-400 text-xl ml-2">({product.variety})</span>}
              </h1>
              <p className="text-gray-500 flex items-center gap-1 mt-2"><MapPin size={14} /> {product.district}</p>
            </div>

            <FreshnessScore harvestDate={product.harvest_date} size="lg" />

            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-green-700 dark:text-green-400">₹{product.price_per_kg}</span>
              <span className="text-gray-500 text-lg">/kg</span>
              <span className="text-sm text-gray-400 ml-2">{product.quantity_kg}kg available</span>
            </div>

            {/* Carbon saved */}
            <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-xl flex items-center gap-3">
              <span className="text-2xl">🌱</span>
              <div>
                <p className="font-semibold text-green-800 dark:text-green-300 text-sm">Carbon Saved</p>
                <p className="text-green-600 text-xs">{(product.carbon_saved_per_kg * 50).toFixed(1)} kg CO₂ saved vs supermarket supply chain</p>
              </div>
            </div>

            {/* Blockchain hash */}
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Shield size={16} className="text-green-600" />
                <span className="text-sm font-semibold">Blockchain Verified</span>
              </div>
              <p className="hash-text text-xs break-all">{product.blockchain_hash}</p>
            </div>

            {/* Qty and Cart */}
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 font-bold text-lg">−</button>
                <span className="px-4 py-3 font-semibold min-w-[50px] text-center">{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.quantity_kg, q + 1))} className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 font-bold text-lg">+</button>
              </div>
              <button onClick={handleAddToCart} className="btn-primary flex-1 flex items-center justify-center gap-2">
                <ShoppingCart size={18} /> Add ₹{(product.price_per_kg * qty).toFixed(0)} to Cart
              </button>
            </div>

            {/* QR Trace button */}
            <button
              onClick={() => setShowJourney(true)}
              className="w-full border-2 border-green-600 text-green-700 dark:text-green-400 py-3 rounded-xl font-semibold hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors flex items-center justify-center gap-2"
            >
              📡 Trace Farm-to-Table Journey
            </button>

            {/* Farmer card */}
            <div className="card p-4">
              <p className="text-xs text-gray-500 mb-2">Grown by</p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-2xl">👨‍🌾</div>
                <div className="flex-1">
                  <p className="font-bold">{product.farmer_name}</p>
                  <p className="text-sm text-gray-500">{product.district} · Verified Farmer</p>
                </div>
                <Link href={`/shop?farmer=${product.farmer_id}`} className="text-green-600 text-sm font-medium hover:underline">View Profile →</Link>
              </div>
            </div>

            {/* Escrow banner */}
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 p-3 rounded-xl text-sm text-amber-800 dark:text-amber-300 flex items-start gap-2">
              <Shield size={16} className="mt-0.5 flex-shrink-0" />
              Your payment is held in escrow and released to the farmer only after you confirm delivery.
            </div>
          </div>
        </div>

        {/* QR Code section */}
        <div className="mt-10 card p-6 flex flex-col sm:flex-row items-center gap-6">
          <QRCodeSVG value={`${process.env.NEXT_PUBLIC_APP_URL || 'https://farmconnect.app'}/qr/${product._id}`} size={120} level="H" />
          <div>
            <h3 className="font-bold text-lg mb-1">Scan for Full Provenance</h3>
            <p className="text-gray-500 text-sm">This QR code links to the public traceability page. Anyone can scan it to see the complete farm-to-table journey of this product.</p>
            <Link href={`/qr/${product._id}`} className="text-green-600 text-sm font-medium hover:underline mt-2 block">View Journey Page →</Link>
          </div>
        </div>
      </div>

      {/* Journey Modal */}
      {showJourney && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={() => setShowJourney(false)}>
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Farm-to-Table Journey</h2>
              <button onClick={() => setShowJourney(false)}><X size={20} /></button>
            </div>
            <div className="space-y-0">
              {steps.map((step, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0 ${step.completed ? 'bg-green-100' : 'bg-gray-100 dark:bg-gray-800'}`}>
                      {step.completed ? '✅' : '⏳'}
                    </div>
                    {i < steps.length - 1 && <div className={`w-0.5 flex-1 my-1 ${step.completed ? 'bg-green-300' : 'bg-gray-200 dark:bg-gray-700'}`} style={{ minHeight: 24 }} />}
                  </div>
                  <div className="pb-6 flex-1">
                    <p className={`font-bold ${step.completed ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>{step.step}</p>
                    {step.date && <p className="text-xs text-gray-500 mt-0.5">{new Date(step.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>}
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">{step.location} · {step.actor}</p>
                    {step.hash && <p className="hash-text text-xs mt-1">{step.hash}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
