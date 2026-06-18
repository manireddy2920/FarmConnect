'use client';

import { useEffect, useState } from 'react';

interface Stats {
  totalFarmers: number;
  totalOrders: number;
  totalConsumers: number;
}

function formatNumber(n: number): string {
  if (n >= 100000) return `${(n / 100000).toFixed(1)}L+`;
  if (n >= 1000) return `${(n / 1000).toFixed(0)}K+`;
  return `${n}+`;
}

export default function StatsSection() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(r => r.json())
      .then(data => setStats(data))
      .catch(() => {});
  }, []);

  const items = [
    {
      value: stats ? formatNumber(stats.totalFarmers) : '—',
      label: 'Farmers Connected',
      icon: '👨‍🌾',
    },
    {
      value: stats ? formatNumber(stats.totalOrders) : '—',
      label: 'Orders Fulfilled',
      icon: '📦',
    },
    {
      value: stats ? formatNumber(stats.totalConsumers) : '—',
      label: 'Happy Consumers',
      icon: '😊',
    },
    {
      value: '48 hrs',
      label: 'Farm to Doorstep',
      icon: '🚚',
    },
  ];

  return (
    <section className="bg-green-50 dark:bg-green-950/30 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {items.map((stat, i) => (
            <div key={i} className="text-center p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-sm">
              <div className="text-4xl mb-2">{stat.icon}</div>
              <div
                className="text-2xl md:text-3xl font-bold text-green-700 dark:text-green-400"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                {stat.value}
              </div>
              <div className="text-gray-500 dark:text-gray-400 text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
