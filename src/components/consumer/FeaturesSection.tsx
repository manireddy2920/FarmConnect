'use client';

import { Shield, Zap, Users, Leaf, BarChart3, QrCode } from 'lucide-react';

export default function FeaturesSection() {
  const features = [
    {
      icon: Shield,
      title: 'Blockchain Verified',
      description: 'Every product has a unique blockchain hash. Scan QR to trace the complete journey from farm to your doorstep.',
      color: 'text-green-600 bg-green-100',
    },
    {
      icon: Zap,
      title: 'AI-Powered Freshness',
      description: 'Our smart algorithm calculates a freshness score based on harvest date. You always know how fresh your produce is.',
      color: 'text-amber-600 bg-amber-100',
    },
    {
      icon: Users,
      title: 'Fair to Farmers',
      description: 'Escrow payments ensure farmers get paid immediately after you confirm delivery. No delays, no middlemen.',
      color: 'text-blue-600 bg-blue-100',
    },
    {
      icon: Leaf,
      title: 'Carbon Tracking',
      description: 'Every purchase shows CO₂ saved vs supermarket supply chains. Know the environmental impact of your food.',
      color: 'text-emerald-600 bg-emerald-100',
    },
    {
      icon: BarChart3,
      title: 'AI Meal Planner',
      description: 'Tell us your family size and preference. Our AI generates a 7-day meal plan and auto-fills your cart with seasonal ingredients.',
      color: 'text-purple-600 bg-purple-100',
    },
    {
      icon: QrCode,
      title: 'FarmToken Rewards',
      description: 'Earn FarmTokens on every order, review, and referral. Redeem for discounts at checkout. Shop more, save more.',
      color: 'text-orange-600 bg-orange-100',
    },
  ];

  return (
    <section className="py-20 bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="section-title">Why Choose FarmConnect?</h2>
          <p className="text-gray-500 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            We combine technology and trust to revolutionize how India eats — fresher, fairer, and fully transparent.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div key={i} className="group p-6 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-green-200 dark:hover:border-green-700 hover:shadow-lg transition-all duration-300">
              <div className={`inline-flex p-3 rounded-xl mb-4 ${f.color}`}>
                <f.icon size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{f.title}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
