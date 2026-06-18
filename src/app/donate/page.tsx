'use client';

import { useState } from 'react';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import { Heart, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const SURPLUS = [
  { _id: 's1', farmer: 'Ravi Kumar', district: 'Warangal', crop: 'Tomatoes', qty: '50 kg', photo: 'https://images.unsplash.com/photo-1546470427-227c0a5e3e97?w=300', matched: false },
  { _id: 's2', farmer: 'Lakshmi Devi', district: 'Nalgonda', crop: 'Rice', qty: '100 kg', photo: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300', matched: false },
  { _id: 's3', farmer: 'Suresh Reddy', district: 'Karimnagar', crop: 'Spinach', qty: '30 kg', photo: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=300', matched: false },
];

const NGOS = [
  { name: 'Hyderabad Food Bank', location: 'Hyderabad', focus: 'Urban poor & daily wage workers' },
  { name: 'Telangana NGO Trust', location: 'Warangal', focus: 'School children & rural families' },
  { name: 'GreenMeal Foundation', location: 'Karimnagar', focus: 'Old age homes & orphanages' },
];

export default function DonatePage() {
  const [surplus, setSurplus] = useState(SURPLUS);

  const match = (id: string) => {
    setSurplus(s => s.map(item => item._id === id ? { ...item, matched: true } : item));
    toast.success('Surplus matched and dispatch initiated! 💚');
  };

  return (
    <div className="min-h-screen dark:bg-gray-950">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Hero */}
        <div className="text-center mb-10">
          <div className="text-5xl mb-4">💚</div>
          <h1 className="section-title">Surplus Food Donation</h1>
          <p className="text-gray-500 text-lg mt-2 max-w-2xl mx-auto">
            Farmers with surplus stock donate to partner NGOs. Together we fight food waste and hunger.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { value: '2,400 kg', label: 'Food Donated' },
            { value: '8,000+', label: 'Meals Provided' },
            { value: '12 NGOs', label: 'Partner Organisations' },
          ].map((s, i) => (
            <div key={i} className="card p-5 text-center">
              <p className="text-2xl font-bold text-green-700 dark:text-green-400" style={{ fontFamily: 'Playfair Display, serif' }}>{s.value}</p>
              <p className="text-gray-500 text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Available surplus */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">🌾 Available Surplus</h2>
            <div className="space-y-4">
              {surplus.map(item => (
                <div key={item._id} className="card p-4 flex items-center gap-4">
                  <img src={item.photo} alt={item.crop} className="w-16 h-16 rounded-xl object-cover" />
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 dark:text-white">{item.crop}</p>
                    <p className="text-sm text-gray-500">by {item.farmer} · {item.district}</p>
                    <p className="text-green-700 dark:text-green-400 font-semibold text-sm">{item.qty} available</p>
                  </div>
                  {item.matched ? (
                    <span className="flex items-center gap-1 text-green-600 text-sm font-semibold">
                      <CheckCircle size={14} /> Matched
                    </span>
                  ) : (
                    <button onClick={() => match(item._id)} className="btn-primary text-sm py-2 px-3 flex items-center gap-1">
                      <Heart size={13} /> Match
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Partner NGOs */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">🤝 Partner NGOs</h2>
            <div className="space-y-4">
              {NGOS.map((ngo, i) => (
                <div key={i} className="card p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center text-xl">🏢</div>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">{ngo.name}</p>
                      <p className="text-sm text-gray-500">📍 {ngo.location}</p>
                      <p className="text-xs text-gray-400 mt-1">{ngo.focus}</p>
                    </div>
                  </div>
                </div>
              ))}

              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-2xl p-5">
                <p className="font-bold text-green-800 dark:text-green-300 mb-2">Are you a farmer?</p>
                <p className="text-green-700 dark:text-green-400 text-sm mb-3">Mark your surplus products as "Donate" in your product listing and we'll handle the rest.</p>
                <a href="/farmer/products" className="btn-primary text-sm py-2 px-4 inline-flex">Go to My Products →</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
