'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import { mockGroupBuys } from '@/lib/mockData';
import { Clock, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';

function Countdown({ deadline }: { deadline: string }) {
  const [timeLeft, setTimeLeft] = useState('');
  useEffect(() => {
    const update = () => setTimeLeft(formatDistanceToNow(new Date(deadline), { addSuffix: true }));
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [deadline]);
  return <span>{timeLeft}</span>;
}

export default function GroupBuyPage() {
  const [deals, setDeals] = useState(mockGroupBuys);
  const [joining, setJoining] = useState<string | null>(null);
  const [joined, setJoined] = useState<Set<string>>(new Set());

  const joinDeal = async (id: string, qty: number) => {
    setJoining(id);
    await new Promise(r => setTimeout(r, 1200));
    setDeals(ds => ds.map(d => d._id === id ? { ...d, current_qty: d.current_qty + 2, participants: d.participants + 1 } : d));
    setJoined(s => new Set([...s, id]));
    toast.success('You\'ve joined the group buy! 🎉');
    setJoining(null);
  };

  return (
    <div className="min-h-screen dark:bg-gray-950">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <h1 className="section-title">Group Buying Deals</h1>
          <p className="text-gray-500 text-lg mt-2">When more people buy together, everyone pays less. Join a deal and unlock bulk pricing!</p>
        </div>

        <div className="space-y-6">
          {deals.map(deal => {
            const pct = Math.round((deal.current_qty / deal.target_qty) * 100);
            const isJoined = joined.has(deal._id);
            const discount = Math.round((1 - deal.discount_price / deal.original_price) * 100);

            return (
              <div key={deal._id} className="card p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <img src={deal.image} alt={deal.product_name} className="w-full md:w-48 h-36 rounded-xl object-cover" />
                  <div className="flex-1 space-y-3">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{deal.product_name}</h2>
                        <p className="text-sm text-gray-500">by {deal.farmer_name}</p>
                      </div>
                      <div className="text-right">
                        <span className="bg-red-100 text-red-700 text-sm font-bold px-3 py-1 rounded-full">{discount}% OFF</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div>
                        <span className="text-gray-400 line-through text-sm">₹{deal.original_price}/kg</span>
                        <span className="text-2xl font-bold text-green-700 dark:text-green-400 ml-2">₹{deal.discount_price}/kg</span>
                        <span className="text-gray-500 text-sm"> when target hit</span>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-gray-700 dark:text-gray-300">{deal.current_qty} / {deal.target_qty} kg filled</span>
                        <span className="text-green-600 font-bold">{pct}%</span>
                      </div>
                      <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-3">
                        <div
                          className="h-3 rounded-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-500 relative overflow-hidden"
                          style={{ width: `${pct}%` }}
                        >
                          <div className="absolute inset-0 bg-white/20 animate-pulse" />
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1"><Users size={14} /> {deal.participants} participants</span>
                      <span className="flex items-center gap-1"><Clock size={14} /> Ends <Countdown deadline={deal.deadline} /></span>
                    </div>

                    {isJoined ? (
                      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 p-3 rounded-xl text-sm text-green-700 font-medium">
                        ✅ You've joined this deal! You'll be charged ₹{deal.discount_price}/kg when the target is reached.
                      </div>
                    ) : (
                      <button
                        onClick={() => joinDeal(deal._id, 2)}
                        disabled={joining === deal._id}
                        className="btn-primary flex items-center gap-2"
                      >
                        {joining === deal._id ? (
                          <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Joining...</>
                        ) : `Join Deal — ₹${deal.discount_price}/kg`}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-10 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 rounded-2xl p-6 text-center">
          <p className="text-2xl mb-2">🤝</p>
          <h3 className="font-bold text-lg text-amber-800 dark:text-amber-300 mb-2">How Group Buying Works</h3>
          <p className="text-amber-700 dark:text-amber-400 text-sm max-w-lg mx-auto">Join a deal with other consumers. Once the target quantity is reached, everyone gets the discounted price. Your payment is only charged when the deal is complete. No commitment needed if the target isn't met.</p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
