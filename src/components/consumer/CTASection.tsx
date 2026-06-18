'use client';

import Link from 'next/link';
import { ArrowRight, ShieldCheck, Leaf } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="py-20 hero-gradient text-white">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 text-sm font-medium mb-6">
          <Leaf size={14} className="text-amber-400" />
          Join the Farm-to-Table Movement
        </div>

        <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
          Ready to Eat Fresh &<br />
          <span className="text-amber-400">Support Farmers?</span>
        </h2>

        <p className="text-green-100 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
          Buy directly from verified farmers. Get blockchain-traced freshness, fair prices, and the story behind every product on your plate.
        </p>

        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <Link
            href="/shop"
            className="bg-amber-400 hover:bg-amber-500 text-gray-900 font-bold px-8 py-4 rounded-xl flex items-center gap-2 transition-all hover:scale-105 shadow-lg"
          >
            Shop Fresh Now <ArrowRight size={18} />
          </Link>
          <Link
            href="/register?role=farmer"
            className="border-2 border-white/60 hover:border-white text-white font-bold px-8 py-4 rounded-xl transition-all hover:bg-white/10"
          >
            Register as Farmer →
          </Link>
        </div>

        <div className="flex flex-wrap justify-center gap-6 text-green-300 text-sm">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-amber-400" />
            Blockchain-secured payments
          </div>
          <div className="flex items-center gap-2">
            <Leaf size={16} className="text-amber-400" />
            Certified organic options
          </div>
        </div>
      </div>
    </section>
  );
}
