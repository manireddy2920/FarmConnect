'use client';

import { useState } from 'react';
import Navbar from '@/components/shared/Navbar';
import { mockFarmers, mockOrders } from '@/lib/mockData';
import { Users, ShoppingBag, AlertTriangle, TrendingUp, CheckCircle, X } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';

const pendingFarmers = [
  { _id: 'pf1', name: 'Venkat Rao', phone: '+91 98887 77665', district: 'Khammam', state: 'Telangana', farming_type: 'organic', applied: '2024-07-20', aadhaar: 'Uploaded' },
  { _id: 'pf2', name: 'Sujatha Devi', phone: '+91 87776 66554', district: 'Medak', state: 'Telangana', farming_type: 'conventional', applied: '2024-07-21', aadhaar: 'Uploaded' },
];

const disputes = [
  { _id: 'd1', order_id: 'order3', buyer: 'Kiran Kumar', seller: 'Ravi Kumar', issue: 'Received damaged tomatoes. Quality was not as advertised.', amount: 350 },
  { _id: 'd2', order_id: 'order4', buyer: 'Meena Sharma', seller: 'Lakshmi Devi', issue: 'Rice delivered was different variety than ordered.', amount: 550 },
];

const dailyOrders = [
  { day: 'Mon', orders: 45 }, { day: 'Tue', orders: 62 }, { day: 'Wed', orders: 38 },
  { day: 'Thu', orders: 78 }, { day: 'Fri', orders: 91 }, { day: 'Sat', orders: 104 }, { day: 'Sun', orders: 67 },
];

export default function AdminPage() {
  const [farmers, setFarmers] = useState(pendingFarmers);
  const [disputeList, setDisputeList] = useState(disputes);
  const [activeTab, setActiveTab] = useState<'overview' | 'approvals' | 'transactions' | 'disputes'>('overview');

  const approveFarmer = (id: string) => {
    setFarmers(fs => fs.filter(f => f._id !== id));
    toast.success('Farmer approved & notified!');
  };

  const rejectFarmer = (id: string) => {
    setFarmers(fs => fs.filter(f => f._id !== id));
    toast.error('Farmer rejected.');
  };

  const resolveDispute = (id: string, action: string) => {
    setDisputeList(ds => ds.filter(d => d._id !== id));
    const msgs: Record<string, string> = { refund: 'Buyer refunded ✅', release: 'Payment released to farmer ✅', escalate: 'Dispute escalated to senior team' };
    toast.success(msgs[action]);
  };

  const tabs = [
    { id: 'overview', label: '📊 Overview' },
    { id: 'approvals', label: `👨‍🌾 Approvals (${farmers.length})` },
    { id: 'transactions', label: '💳 Transactions' },
    { id: 'disputes', label: `⚠️ Disputes (${disputeList.length})` },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
            <p className="text-gray-500 text-sm">FarmConnect Operations Centre</p>
          </div>
          <span className="bg-red-100 text-red-700 text-xs font-bold px-3 py-1 rounded-full">🔐 Admin Access</span>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id as any)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === t.id ? 'bg-green-700 text-white' : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700'}`}>
              {t.label}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {[
                { label: 'Pending Approvals', value: farmers.length, icon: Users, color: 'text-amber-600 bg-amber-100' },
                { label: 'Orders Today', value: 104, icon: ShoppingBag, color: 'text-green-600 bg-green-100' },
                { label: 'Active Disputes', value: disputeList.length, icon: AlertTriangle, color: 'text-red-600 bg-red-100' },
                { label: 'Revenue This Month', value: '₹4.2L', icon: TrendingUp, color: 'text-blue-600 bg-blue-100' },
              ].map((s, i) => (
                <div key={i} className="card p-5">
                  <div className={`inline-flex p-2 rounded-lg mb-3 ${s.color}`}><s.icon size={18} /></div>
                  <p className="text-gray-500 text-sm">{s.label}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{s.value}</p>
                </div>
              ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <div className="card p-6">
                <h2 className="font-bold text-lg mb-4">Daily Orders (This Week)</h2>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={dailyOrders}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="orders" fill="#40916C" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="card p-6">
                <h2 className="font-bold text-lg mb-4">NGO Surplus Matching</h2>
                <div className="space-y-3">
                  {[
                    { farmer: 'Ravi Kumar', crop: 'Tomatoes', qty: '50 kg', ngo: 'Hyderabad Food Bank' },
                    { farmer: 'Lakshmi Devi', crop: 'Rice', qty: '100 kg', ngo: 'Telangana NGO Trust' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-xl">
                      <div>
                        <p className="font-medium text-sm">{item.farmer} → {item.ngo}</p>
                        <p className="text-xs text-gray-500">{item.crop} · {item.qty}</p>
                      </div>
                      <button onClick={() => toast.success('Dispatch initiated!')} className="text-xs btn-primary py-1 px-3">Match & Dispatch</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'approvals' && (
          <div className="card overflow-hidden">
            {farmers.length === 0 ? (
              <div className="p-10 text-center text-gray-400">
                <CheckCircle size={40} className="text-green-400 mx-auto mb-2" />
                <p>All farmer applications processed!</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      {['Farmer', 'Phone', 'Location', 'Type', 'Aadhaar', 'Applied', 'Actions'].map(h => (
                        <th key={h} className="text-left py-3 px-4 text-gray-500 font-semibold">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {farmers.map(f => (
                      <tr key={f._id} className="border-t border-gray-100 dark:border-gray-800">
                        <td className="py-3 px-4 font-semibold">{f.name}</td>
                        <td className="py-3 px-4 text-gray-500">{f.phone}</td>
                        <td className="py-3 px-4 text-gray-500">{f.district}, {f.state}</td>
                        <td className="py-3 px-4 capitalize">{f.farming_type}</td>
                        <td className="py-3 px-4 text-green-600 text-xs font-medium">{f.aadhaar}</td>
                        <td className="py-3 px-4 text-gray-400 text-xs">{f.applied}</td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <button onClick={() => approveFarmer(f._id)} className="flex items-center gap-1 bg-green-600 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-green-700 transition-colors">
                              <CheckCircle size={12} /> Approve
                            </button>
                            <button onClick={() => rejectFarmer(f._id)} className="flex items-center gap-1 bg-red-100 text-red-600 text-xs px-3 py-1.5 rounded-lg hover:bg-red-200 transition-colors">
                              <X size={12} /> Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    {['Order ID', 'Buyer', 'Farmer', 'Product', 'Amount', 'Escrow', 'Date'].map(h => (
                      <th key={h} className="text-left py-3 px-4 text-gray-500 font-semibold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {mockOrders.map(o => (
                    <tr key={o._id} className="border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/50">
                      <td className="py-3 px-4 font-mono text-xs text-gray-400">#{o._id}</td>
                      <td className="py-3 px-4 font-medium">{o.consumer_name}</td>
                      <td className="py-3 px-4">{o.farmer_name}</td>
                      <td className="py-3 px-4">{o.product_name}</td>
                      <td className="py-3 px-4 font-bold text-green-700">₹{o.total_amount}</td>
                      <td className="py-3 px-4"><span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${o.escrow_status === 'released' ? 'badge-green' : 'badge-amber'}`}>{o.escrow_status}</span></td>
                      <td className="py-3 px-4 text-xs text-gray-400">{new Date(o.created_at).toLocaleDateString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'disputes' && (
          <div className="space-y-4">
            {disputeList.length === 0 ? (
              <div className="card p-10 text-center text-gray-400">
                <CheckCircle size={40} className="text-green-400 mx-auto mb-2" />
                <p>No open disputes!</p>
              </div>
            ) : disputeList.map(d => (
              <div key={d._id} className="card p-6">
                <div className="flex flex-wrap gap-4 justify-between mb-3">
                  <div>
                    <p className="font-bold">{d.buyer} vs {d.seller}</p>
                    <p className="text-sm text-gray-500">Order #{d.order_id} · ₹{d.amount}</p>
                  </div>
                  <span className="badge-red text-xs font-semibold">Open Dispute</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 bg-gray-50 dark:bg-gray-900 p-3 rounded-xl">"{d.issue}"</p>
                <div className="flex flex-wrap gap-3">
                  <button onClick={() => resolveDispute(d._id, 'refund')} className="text-sm bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors">💰 Refund Buyer</button>
                  <button onClick={() => resolveDispute(d._id, 'release')} className="text-sm bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition-colors">✅ Release to Farmer</button>
                  <button onClick={() => resolveDispute(d._id, 'escalate')} className="text-sm bg-amber-500 text-white px-4 py-2 rounded-xl hover:bg-amber-600 transition-colors">⬆️ Escalate</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
