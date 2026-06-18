'use client';

import Navbar from '@/components/shared/Navbar';
import { mockSalesData, mockDemandTrends, mockProducts } from '@/lib/mockData';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const COLORS = ['#2D6A4F', '#40916C', '#E9C46A', '#F4A261', '#E76F51', '#264653'];

const topCrops = [
  { name: 'Tomatoes', sales: 320 },
  { name: 'Brinjal', sales: 185 },
  { name: 'Spinach', sales: 142 },
  { name: 'Chillies', sales: 98 },
  { name: 'Cucumber', sales: 75 },
];

const categoryData = [
  { name: 'Vegetables', value: 65 },
  { name: 'Fruits', value: 20 },
  { name: 'Grains', value: 15 },
];

export default function FarmerInsightsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Sales Insights</h1>
        <p className="text-gray-500 mb-8">Performance overview for July 2024</p>

        {/* KPI cards */}
        <div className="grid sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Revenue', value: '₹84,500', delta: '+18%' },
            { label: 'Orders Fulfilled', value: '124', delta: '+12%' },
            { label: 'Avg Order Value', value: '₹681', delta: '+5%' },
            { label: 'Repeat Buyers', value: '67%', delta: '+3%' },
          ].map((k, i) => (
            <div key={i} className="card p-5">
              <p className="text-gray-500 text-sm mb-1">{k.label}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{k.value}</p>
              <p className="text-green-600 text-sm font-semibold mt-1">{k.delta} vs last month</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Monthly sales chart */}
          <div className="card p-6">
            <h2 className="font-bold text-lg mb-4">Monthly Earnings (₹)</h2>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={mockSalesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `₹${v / 1000}K`} />
                <Tooltip formatter={(v: number) => [`₹${v.toLocaleString()}`, 'Earnings']} />
                <Line type="monotone" dataKey="sales" stroke="#2D6A4F" strokeWidth={2.5} dot={{ fill: '#2D6A4F', r: 5 }} activeDot={{ r: 7 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Top crops */}
          <div className="card p-6">
            <h2 className="font-bold text-lg mb-4">Top Crops by Sales Volume (kg)</h2>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={topCrops} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={70} />
                <Tooltip formatter={(v: number) => [`${v} kg`, 'Sold']} />
                <Bar dataKey="sales" fill="#40916C" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Sales by category pie */}
          <div className="card p-6">
            <h2 className="font-bold text-lg mb-4">Sales by Category</h2>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={5} dataKey="value">
                  {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Legend />
                <Tooltip formatter={(v: number) => [`${v}%`, '']} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Demand forecast */}
          <div className="card p-6">
            <h2 className="font-bold text-lg mb-4">District Demand Forecast</h2>
            <p className="text-xs text-gray-500 mb-4">Top 5 trending crops in Telangana this week</p>
            <div className="space-y-3">
              {mockDemandTrends.map((d, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">{d.crop}</span>
                    <span className={`font-bold ${d.demand_change > 0 ? 'text-green-600' : 'text-red-500'}`}>
                      {d.demand_change > 0 ? '▲' : '▼'} {Math.abs(d.demand_change)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${d.demand_change > 0 ? 'bg-green-500' : 'bg-red-400'}`}
                      style={{ width: `${Math.min(100, Math.abs(d.demand_change) * 2)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
