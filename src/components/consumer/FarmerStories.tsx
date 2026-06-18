'use client';

import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface FarmerProfile {
  _id: string;
  user_id: { _id: string; name: string; avatar?: string };
  district: string;
  state: string;
  farming_type: string;
  bio?: string;
  story?: string;
  years_farming?: number;
  verified: boolean;
  total_earned?: number;
  certifications?: { name: string; hash: string }[];
}

export default function FarmerStories() {
  const [farmers, setFarmers] = useState<FarmerProfile[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/farmers?verified=true&limit=6')
      .then(r => r.json())
      .then(data => {
        setFarmers(Array.isArray(data) ? data : []);
      })
      .catch(() => setFarmers([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-white dark:bg-gray-950 flex justify-center">
        <Loader2 size={32} className="animate-spin text-green-600" />
      </section>
    );
  }

  if (farmers.length === 0) return null;

  const farmer = farmers[current];
  const farmerName = farmer.user_id?.name || 'Farmer';
  const farmerId = farmer.user_id?._id || farmer._id;
  const avatar = farmer.user_id?.avatar;
  const certifications = farmer.certifications || [];

  return (
    <section className="py-20 bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="section-title">Know Your Farmer</h2>
          <p className="text-gray-500 dark:text-gray-400 text-lg">Real people, real farms, real food</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-amber-50 dark:from-green-950/30 dark:to-amber-950/20 rounded-3xl p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            {/* Left */}
            <div className="text-center md:text-left">
              <div className="w-32 h-32 rounded-full mx-auto md:mx-0 overflow-hidden border-4 border-green-200 shadow-lg mb-4 bg-green-100 flex items-center justify-center">
                {avatar ? (
                  <img src={avatar} alt={farmerName} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-5xl">👨‍🌾</span>
                )}
              </div>

              <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
                  {farmerName}
                </h3>
                {farmer.verified && <CheckCircle size={20} className="text-green-600 flex-shrink-0" />}
              </div>

              <p className="text-green-700 dark:text-green-400 font-medium mb-1">
                {farmer.district}, {farmer.state}
              </p>
              <p className="text-gray-500 text-sm mb-4">
                {farmer.years_farming ? `${farmer.years_farming} years farming · ` : ''}{farmer.farming_type}
              </p>

              {farmer.story && (
                <div className="bg-white dark:bg-gray-900 rounded-xl p-4 mb-4 text-left shadow-sm">
                  <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">Their Story</p>
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed italic">
                    "{farmer.story}"
                  </p>
                </div>
              )}

              <div className="flex gap-3 justify-center md:justify-start flex-wrap">
                <Link href={`/shop?farmer=${farmerId}`} className="btn-primary text-sm py-2 px-4">
                  Buy from {farmerName.split(' ')[0]}
                </Link>
                <Link href="/register?role=farmer" className="btn-outline text-sm py-2 px-4">
                  Join as Farmer
                </Link>
              </div>
            </div>

            {/* Right */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {farmer.total_earned ? (
                  <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow-sm text-center">
                    <p className="text-2xl font-bold text-green-700">
                      ₹{(farmer.total_earned / 1000).toFixed(0)}K
                    </p>
                    <p className="text-gray-500 text-xs">Total Earned</p>
                  </div>
                ) : null}
                <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow-sm text-center">
                  <p className="text-2xl font-bold text-amber-600">{certifications.length}</p>
                  <p className="text-gray-500 text-xs">Certifications</p>
                </div>
              </div>

              {certifications.length > 0 && (
                <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow-sm">
                  <p className="text-xs text-gray-500 mb-2">Certifications</p>
                  {certifications.map((c, i) => (
                    <div key={i} className="flex items-center gap-2 mb-1">
                      <CheckCircle size={14} className="text-green-600 flex-shrink-0" />
                      <span className="text-sm font-medium">{c.name}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="bg-green-700 text-white p-4 rounded-xl">
                <p className="text-green-200 text-xs mb-1">Our Promise</p>
                <p className="font-medium text-sm italic">
                  "Every seed we plant is a promise to the families who eat our food."
                </p>
              </div>
            </div>
          </div>

          {/* Navigation dots */}
          {farmers.length > 1 && (
            <div className="flex justify-center gap-4 mt-8">
              <button
                onClick={() => setCurrent(c => (c - 1 + farmers.length) % farmers.length)}
                className="p-2 rounded-full bg-white dark:bg-gray-800 shadow hover:shadow-md transition-all"
                aria-label="Previous farmer"
              >
                <ChevronLeft size={20} />
              </button>
              <div className="flex gap-2 items-center">
                {farmers.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    aria-label={`Farmer ${i + 1}`}
                    className={`h-2 rounded-full transition-all ${i === current ? 'bg-green-700 w-6' : 'bg-gray-300 w-2'}`}
                  />
                ))}
              </div>
              <button
                onClick={() => setCurrent(c => (c + 1) % farmers.length)}
                className="p-2 rounded-full bg-white dark:bg-gray-800 shadow hover:shadow-md transition-all"
                aria-label="Next farmer"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
