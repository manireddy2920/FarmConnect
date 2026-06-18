'use client';

import { useState } from 'react';
import Navbar from '@/components/shared/Navbar';
import { mockFarmers } from '@/lib/mockData';
import { CheckCircle, Edit, Heart } from 'lucide-react';
import toast from 'react-hot-toast';

export default function FarmerProfilePage() {
  const farmer = mockFarmers[0];
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ bio: farmer.bio, story: farmer.story, video_url: '' });
  const [donating, setDonating] = useState(false);
  const [donationAmt, setDonationAmt] = useState(50);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const save = () => {
    setEditing(false);
    toast.success('Profile updated!');
  };

  const donate = () => {
    setDonating(false);
    toast.success(`Thank you! ₹${donationAmt} sent to ${farmer.name} 💚`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Cover */}
        <div className="h-40 rounded-2xl bg-gradient-to-r from-green-700 to-green-500 mb-0 relative">
          <div className="absolute bottom-0 translate-y-1/2 left-8">
            <img src={farmer.avatar} alt={farmer.name} className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-900 object-cover shadow-lg" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md border border-gray-100 dark:border-gray-800 pt-16 pb-6 px-8 mb-6">
          <div className="flex flex-wrap justify-between items-start gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: 'Playfair Display, serif' }}>{farmer.name}</h1>
                {farmer.verified && <CheckCircle size={20} className="text-green-600" />}
              </div>
              <p className="text-green-700 dark:text-green-400 font-medium">{farmer.district}, {farmer.state}</p>
              <p className="text-gray-500 text-sm">{farmer.years_of_farming} years of farming · {farmer.farming_type} · Verified Farmer</p>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="badge-green">📱 Telugu, Hindi</span>
                <span className="badge-green">🌿 Organic</span>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setDonating(true)} className="flex items-center gap-2 border border-pink-300 text-pink-600 px-4 py-2 rounded-xl hover:bg-pink-50 transition-colors text-sm font-medium">
                <Heart size={14} /> Support
              </button>
              <button onClick={() => setEditing(true)} className="btn-outline text-sm py-2 px-4 flex items-center gap-2">
                <Edit size={14} /> Edit Profile
              </button>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Bio & Story */}
          <div className="card p-6 space-y-4">
            <h2 className="font-bold text-lg">About</h2>
            {editing ? (
              <>
                <div>
                  <label className="text-sm font-medium block mb-1">Bio (max 200 chars)</label>
                  <textarea value={form.bio} onChange={e => set('bio', e.target.value)} maxLength={200} rows={3} className="input-field text-sm resize-none" />
                  <p className="text-xs text-gray-400 mt-1">{form.bio?.length || 0}/200</p>
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Farm Story (max 500 chars)</label>
                  <textarea value={form.story} onChange={e => set('story', e.target.value)} maxLength={500} rows={5} className="input-field text-sm resize-none" />
                  <p className="text-xs text-gray-400 mt-1">{form.story?.length || 0}/500</p>
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Video Story URL</label>
                  <input value={form.video_url} onChange={e => set('video_url', e.target.value)} className="input-field text-sm" placeholder="YouTube embed URL" />
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setEditing(false)} className="flex-1 border border-gray-200 dark:border-gray-700 py-2 rounded-xl text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Cancel</button>
                  <button onClick={save} className="btn-primary flex-1 text-sm py-2">Save Changes</button>
                </div>
              </>
            ) : (
              <>
                <p className="text-gray-600 dark:text-gray-300 text-sm">{form.bio}</p>
                <div className="border-t border-gray-100 dark:border-gray-800 pt-4">
                  <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">My Story</p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed italic">"{form.story}"</p>
                </div>
              </>
            )}
          </div>

          {/* Certifications & Stats */}
          <div className="space-y-4">
            <div className="card p-6">
              <h2 className="font-bold text-lg mb-4">Certifications</h2>
              {farmer.certifications.length > 0 ? farmer.certifications.map((c, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
                  <CheckCircle size={18} className="text-green-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm">{c.name} <span className="badge-green ml-1">Verified</span></p>
                    <p className="text-xs text-gray-500 mt-0.5">Issued: {new Date(c.issue_date).toLocaleDateString('en-IN')}</p>
                    <p className="hash-text text-xs mt-1">{c.hash}</p>
                  </div>
                </div>
              )) : (
                <p className="text-gray-400 text-sm">No certifications yet.</p>
              )}
            </div>

            <div className="card p-6">
              <h2 className="font-bold text-lg mb-4">Earnings Summary</h2>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-xl text-center">
                  <p className="text-xl font-bold text-green-700">₹{(farmer.total_earned / 1000).toFixed(0)}K</p>
                  <p className="text-xs text-gray-500">Total Earned</p>
                </div>
                <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-xl text-center">
                  <p className="text-xl font-bold text-amber-700">₹{farmer.pending_payout.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">Pending Payout</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Support modal */}
        {donating && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50" onClick={() => setDonating(false)}>
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-sm w-full" onClick={e => e.stopPropagation()}>
              <h2 className="text-xl font-bold mb-2">Support {farmer.name} 💚</h2>
              <p className="text-gray-500 text-sm mb-4">Your contribution helps farmers invest in better tools and seeds.</p>
              <div className="flex gap-3 mb-4">
                {[10, 50, 100].map(amt => (
                  <button key={amt} onClick={() => setDonationAmt(amt)} className={`flex-1 py-2 rounded-xl border-2 font-bold transition-all ${donationAmt === amt ? 'border-green-600 bg-green-50 dark:bg-green-900/30 text-green-700' : 'border-gray-200 dark:border-gray-700'}`}>
                    ₹{amt}
                  </button>
                ))}
              </div>
              <button onClick={donate} className="btn-primary w-full">Send ₹{donationAmt} 💚</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
