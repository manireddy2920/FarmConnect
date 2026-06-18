'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/shared/Navbar';
import StatCard from '@/components/ui/StatCard';
import { IndianRupee, Package, TrendingUp, Loader2, Plus } from 'lucide-react';
import Link from 'next/link';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardData {
  totalProducts: number;
  activeProducts: number;
  totalOrders: number;
  pendingOrders: number;
  totalEarnings: number;
  recentOrders: any[];
  farmer: any;
}

export default function FarmerDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const role = (session?.user as any)?.role;

  useEffect(() => {
    if (status === 'unauthenticated') { router.push('/login'); return; }
    if (status === 'authenticated' && role !== 'farmer') { router.push('/'); return; }
    if (status === 'authenticated' && role === 'farmer') fetchDashboard();
  }, [status, role]);

  const fetchDashboard = async () => {
    try {
      const res = await fetch('/api/farmer/dashboard');
      if (!res.ok) throw new Error('Failed to load dashboard');
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <Loader2 size={40} className="animate-spin text-green-600" />
      </div>
    );
  }

  const farmerName = data?.farmer?.name || session?.user?.name || 'Farmer';
  const recentOrders = data?.recentOrders || [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Farmer Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">Welcome back, {farmerName} 👨‍🌾</p>
          </div>
          <Link href="/farmer/products" className="btn-primary flex items-center gap-2">
            <Plus size={18} /> Add Product
          </Link>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Earnings" value={`₹${(data?.totalEarnings || 0).toLocaleString('en-IN')}`} subtitle="All time" icon={IndianRupee} color="green" />
          <StatCard title="Pending Orders" value={data?.pendingOrders || 0} subtitle="Awaiting action" icon={TrendingUp} color="amber" />
          <StatCard title="Active Products" value={data?.activeProducts || 0} subtitle={`${data?.totalProducts || 0} total`} icon={Package} color="blue" />
          <StatCard title="Total Orders" value={data?.totalOrders || 0} subtitle="All time" icon={IndianRupee} color="green" />
        </div>

        {/* Recent orders */}
        <div className="card p-6 mb-8">
          <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
            <h2 className="font-bold text-lg">Recent Orders</h2>
            <Link href="/farmer/orders" className="text-green-600 text-sm hover:underline">View all →</Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="text-gray-400 text-sm py-6 text-center">No orders yet. Share your products to get started!</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    {['Order ID', 'Consumer', 'Product', 'Qty', 'Amount', 'Status'].map(h => (
                      <th key={h} className="text-left py-3 px-2 text-gray-500 font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order: any) => (
                    <tr key={order._id} className="border-b border-gray-50 dark:border-gray-900 hover:bg-gray-50 dark:hover:bg-gray-900/50">
                      <td className="py-3 px-2 font-mono text-xs text-gray-400">#{order._id?.slice(-6).toUpperCase()}</td>
                      <td className="py-3 px-2 font-medium">{order.consumer_id?.name || '—'}</td>
                      <td className="py-3 px-2">{order.product_id?.crop_name || '—'}</td>
                      <td className="py-3 px-2">{order.quantity}kg</td>
                      <td className="py-3 px-2 font-bold text-green-700">₹{order.total_amount?.toLocaleString('en-IN')}</td>
                      <td className="py-3 px-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${order.order_status === 'delivered' ? 'badge-green' : 'badge-amber'}`}>
                          {order.order_status?.replace(/_/g, ' ')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick links */}
        <div className="grid sm:grid-cols-4 gap-4">
          {[
            { href: '/farmer/products', icon: '🌾', label: 'Manage Products' },
            { href: '/farmer/orders', icon: '📦', label: 'View Orders' },
            { href: '/farmer/insights', icon: '📊', label: 'Sales Insights' },
            { href: '/farmer/profile', icon: '👤', label: 'Edit Profile' },
          ].map(link => (
            <Link key={link.href} href={link.href} className="card p-4 text-center hover:shadow-lg transition-shadow group">
              <div className="text-3xl mb-2">{link.icon}</div>
              <p className="text-sm font-medium group-hover:text-green-700 dark:group-hover:text-green-400">{link.label}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
