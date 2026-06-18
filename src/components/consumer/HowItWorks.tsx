'use client';

export default function HowItWorks() {
  const steps = [
    { step: '01', title: 'Browse Fresh Produce', description: 'Explore products from verified local farmers with freshness scores and full traceability info.', icon: '🛒' },
    { step: '02', title: 'Place Your Order', description: 'Add to cart and pay securely. Your payment is held in smart contract escrow until delivery.', icon: '💳' },
    { step: '03', title: 'Farmer Packs Fresh', description: 'Your chosen farmer is notified and packs your order fresh — often within hours of harvest.', icon: '📦' },
    { step: '04', title: 'Delivered to Your Door', description: 'Receive same or next-day delivery. Confirm receipt to release payment to the farmer.', icon: '🚚' },
  ];

  return (
    <section className="py-20 bg-green-50 dark:bg-green-950/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="section-title">How It Works</h2>
          <p className="text-gray-500 dark:text-gray-400 text-lg">From farm to your plate in 4 simple steps</p>
        </div>
        <div className="relative">
          {/* Connector line */}
          <div className="hidden md:block absolute top-16 left-0 right-0 h-0.5 bg-green-200 dark:bg-green-800 z-0" style={{ marginLeft: '12.5%', marginRight: '12.5%' }} />
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 relative z-10">
            {steps.map((s, i) => (
              <div key={i} className="text-center">
                <div className="w-20 h-20 bg-green-700 rounded-full flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg relative">
                  {s.icon}
                  <span className="absolute -top-1 -right-1 w-7 h-7 bg-amber-400 text-gray-900 text-xs font-bold rounded-full flex items-center justify-center">
                    {s.step}
                  </span>
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">{s.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
