'use client';

import { useState } from 'react';
import Navbar from '@/components/shared/Navbar';
import { mockOrders } from '@/lib/mockData';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const NEXT_STATUS: Record<string, string> = {
  placed: 'confirmed',
  confirmed: 'packed',
  packed: 'pickedup',
  pickedup: 'out_for_delivery',
};

const STATUS_LABEL: Record<string, string> = {
  placed: 'Order Placed',
  confirmed: 'Confirmed',
  packed: 'Packed',
  pickedup: 'Picked Up',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
};

export default function FarmerOrdersPage() {
  const [orders, setOrders] = useState(mockOrders);
  const [filter, setFilter] = useState('all');

  const advance = (id: string, current: string) => {
    const next = NEXT_STATUS[current];
    if (!next) return;
    setOrders(os => os.map(o => o._id === id ? { ...o, order_status: next } : o));
    toast.success(`Order moved to: ${STATUS_LABEL[next]}`);
  };

  const filtered = filter === 'all' ? orders : orders.filter(o => o.order_status === filter);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Incoming Orders</h1>

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {['all', 'placed', 'confirmed', 'packed', 'out_for_delivery', 'delivered'].map(s => (
            <button key={s} onClick={() => setFilter(s)} className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all capitalize ${filter === s ? 'bg-green-700 text-white' : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700'}`}>
              {s.replace(/_/g, ' ')}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <div className="text-5xl mb-4">📦</div>
              <p>No orders in this status</p>
            </div>
          ) : filtered.map(order => (
            <div key={order._id} className="card p-6">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <p className="font-bold text-lg text-gray-900 dark:text-white">{order.product_name}</p>
                  <p className="text-sm text-gray-500">Order #{order._id} · {order.quantity}kg · ₹{order.total_amount}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{format(new Date(order.created_at), 'dd MMM yyyy, h:mm a')}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${order.order_status === 'delivered' ? 'bg-green-100 text-green-700' : order.order_status === 'placed' ? 'bg-blue-100 text-blue-700' : 'badge-amber'}`}>
                    {STATUS_LABEL[order.order_status]}
                  </span>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 flex flex-wrap gap-6 mb-4 text-sm">
                <div><p className="text-gray-400 text-xs">Consumer</p><p className="font-medium">{order.consumer_name}</p></div>
                <div><p className="text-gray-400 text-xs">Payment</p><p className="font-medium capitalize">{order.payment_method}</p></div>
                <div><p className="text-gray-400 text-xs">Escrow</p><p className={`font-medium ${order.escrow_status === 'released' ? 'text-green-600' : 'text-amber-600'}`}>{order.escrow_status === 'released' ? '✅ Released' : '🔒 Held'}</p></div>
                <div><p className="text-gray-400 text-xs">Delivery Slot</p><p className="font-medium capitalize">{order.delivery_slot}</p></div>
              </div>

              {NEXT_STATUS[order.order_status] && (
                <button
                  onClick={() => advance(order._id, order.order_status)}
                  className="btn-primary text-sm py-2 px-4"
                >
                  Mark as {STATUS_LABEL[NEXT_STATUS[order.order_status]]} →
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
