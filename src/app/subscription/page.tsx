'use client';

import { useState } from 'react';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import { CheckCircle, Pause, Play } from 'lucide-react';
import toast from 'react-hot-toast';

const plans = [
  {
    id: 'basic',
    name: 'Basic',
    price: 499,
    freq: 'week',
    highlight: 'Perfect for singles & couples',
    contents: ['3 kg mixed seasonal vegetables', 'Curated by our farm experts', 'Includes 3–4 varieties'],
    color: 'border-gray-200 dark:border-gray-700',
    badge: '',
  },
  {
    id: 'family',
    name: 'Family',
    price: 899,
    freq: 'week',
    highlight: 'Most popular for families',
    contents: ['6 kg mixed seasonal vegetables', '2 bonus fruit picks', 'Includes 6–8 varieties', 'Priority harvest scheduling'],
    color: 'border-green-600',
    badge: '⭐ Most Popular',
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 1299,
    freq: 'week',
    highlight: 'The complete farm basket',
    contents: ['6 kg vegetables', '2 kg seasonal fruits', '1 kg grains or pulses', 'Includes 10+ varieties', 'Dedicated farmer liaison', 'Carbon offset certificate'],
    color: 'border-amber-500',
    badge: '🌟 Best Value',
  },
];

export default function SubscriptionPage() {
  const [subscribed, setSubscribed] = useState<string | null>('family');
  const [paused, setPaused] = useState(false);
  const nextDelivery = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' });

  const subscribe = (id: string) => {
    setSubscribed(id);
    toast.success(`Subscribed to ${plans.find(p => p.id === id)?.name} plan! 🎉`);
  };

  const togglePause = () => {
    setPaused(!paused);
    toast.success(paused ? 'Subscription resumed!' : 'Subscription paused.');
  };

  return (
    <div className="min-h-screen dark:bg-gray-950">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="section-title">Weekly Farm Baskets</h1>
          <p className="text-gray-500 text-lg mt-2">Fresh produce delivered to your door every week. Cancel or pause anytime.</p>
        </div>

        {/* Active subscription banner */}
        {subscribed && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-2xl p-5 mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-bold text-green-800 dark:text-green-300">✅ Active Subscription: {plans.find(p => p.id === subscribed)?.name} Plan</p>
              <p className="text-green-600 text-sm mt-0.5">Next delivery: <strong>{nextDelivery}</strong> {paused && '(Paused)'}</p>
            </div>
            <button onClick={togglePause} className="flex items-center gap-2 border border-green-600 text-green-700 px-4 py-2 rounded-xl text-sm font-medium hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors">
              {paused ? <><Play size={14} /> Resume</> : <><Pause size={14} /> Pause</>}
            </button>
          </div>
        )}

        {/* Plans */}
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map(plan => (
            <div key={plan.id} className={`card p-6 border-2 relative flex flex-col ${plan.color} ${subscribed === plan.id ? 'shadow-xl' : ''}`}>
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-700 text-white text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                  {plan.badge}
                </div>
              )}
              <div className="mb-4 pt-2">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{plan.name}</h2>
                <p className="text-gray-500 text-sm">{plan.highlight}</p>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-bold text-green-700 dark:text-green-400">₹{plan.price}</span>
                <span className="text-gray-500">/{plan.freq}</span>
              </div>
              <ul className="space-y-2 mb-6 flex-1">
                {plan.contents.map((c, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <CheckCircle size={14} className="text-green-600 mt-0.5 flex-shrink-0" />
                    {c}
                  </li>
                ))}
              </ul>
              {subscribed === plan.id ? (
                <div className="text-center text-green-700 dark:text-green-400 font-semibold py-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
                  ✅ Current Plan
                </div>
              ) : (
                <button onClick={() => subscribe(plan.id)} className="btn-primary w-full">
                  Subscribe ₹{plan.price}/week
                </button>
              )}
            </div>
          ))}
        </div>

        <p className="text-center text-gray-400 text-sm mt-8">
          🔒 Secure payments · Cancel anytime · Freshness guaranteed or full refund
        </p>
      </div>
      <Footer />
    </div>
  );
}
