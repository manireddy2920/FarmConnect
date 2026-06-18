'use client';

import Link from 'next/link';
import { ArrowRight, Shield, Truck, Leaf } from 'lucide-react';
import Image from 'next/image';

const heroImages = [
  { src: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=600&q=80', alt: 'Farmer in field' },
  { src: 'https://images.unsplash.com/photo-1506484381205-f7945653044d?w=600&q=80', alt: 'Fresh vegetables' },
  { src: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=600&q=80', alt: 'Organic farm' },
  { src: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&q=80', alt: 'Fresh tomatoes' },
];

export default function HeroSection() {
  return (
    <section className="hero-gradient text-white relative overflow-hidden min-h-[600px]">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-green-300/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 relative">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left: copy */}
          <div className="space-y-7">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-sm font-medium">
              <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
              🌾 Blockchain-Verified Farm to Table
            </div>

            <h1 className="text-4xl md:text-6xl font-bold leading-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
              Fresh from the{' '}
              <span className="text-amber-400">Farm</span>,<br />
              Direct to Your{' '}
              <span className="text-amber-400">Table</span>
            </h1>

            <p className="text-green-100 text-lg leading-relaxed max-w-lg">
              FarmConnect eliminates middlemen — farmers earn more, you pay less. Every product is blockchain-verified. Scan the QR code to trace your food from seed to plate.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/shop"
                className="bg-amber-400 hover:bg-amber-500 text-gray-900 font-bold px-8 py-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-amber-400/30 hover:scale-105 flex items-center gap-2"
              >
                Start Shopping <ArrowRight size={18} />
              </Link>
              <Link
                href="/register?role=farmer"
                className="border-2 border-white/60 hover:border-white text-white font-bold px-8 py-4 rounded-xl transition-all hover:bg-white/10"
              >
                Join as Farmer
              </Link>
            </div>

            <div className="flex flex-wrap gap-6 text-sm text-green-200">
              <div className="flex items-center gap-2">
                <Shield size={16} className="text-amber-400" />
                Blockchain Verified
              </div>
              <div className="flex items-center gap-2">
                <Truck size={16} className="text-amber-400" />
                48-Hour Delivery
              </div>
              <div className="flex items-center gap-2">
                <Leaf size={16} className="text-amber-400" />
                Farm Fresh
              </div>
            </div>
          </div>

          {/* Right: image grid — 2×2, perfectly aligned */}
          <div className="hidden md:grid grid-cols-2 gap-4 h-[420px]">
            {heroImages.map((img, i) => (
              <div
                key={i}
                className={`relative rounded-2xl overflow-hidden shadow-xl ${
                  i % 2 === 0 ? 'mt-6' : 'mb-6'
                }`}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover"
                  loading={i === 0 ? 'eager' : 'lazy'}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
