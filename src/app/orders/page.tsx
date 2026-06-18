'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import { CheckCircle, Package, Truck, MapPin, Clock, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const STATUS_STEPS = ['placed', 'confirmed', 'packed', 'pickedup', 'out_for_delivery', 'delivered'];
const STATUS_LABELS: Record<string, string> = {
  placed: 'Order Placed',
  confirmed: 'Confirmed',
  packed: 'Packed',
  pickedup: 'Picked Up',
  out_for_delivery: 'On the Way',
  delivered: 'Delivered',
};
const STATUS_ICONS: Record<string, any> = {
  placed: Clock,
  confirmed: CheckCircle,
  packed: Package,
  pickedup: Package,
  out_for_delivery: Truck,
  delivered: CheckCircle,
};

interface Order {
  _id: string;
  product_id: { _id: string; crop_name: string; photos: string[]; price_per_kg: number } | null;
  farmer_id: { _id: string; name: string; phone?: string } | null;
  quantity: number;
  total_amount: number;
  payment_method: string;
  escrow_status: string;
  order_status: string;
  delivery_partner?: string;
  delivery_partner_phone?: string;
  transaction_hash?: string;
  createdAt: string;
}

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/orders');
      return;
    }
    if (status === 'authenticated') fetchOrders();
  }, [status]);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      if (!res.ok) throw new Error('Failed to load orders');
      const data = await res.json();
      setOrders(data);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelivery = async (orderId: string) => {
    setConfirming(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}/confirm`, { method: 'PUT' });
      if (!res.ok) throw new Error('Failed to confirm delivery');
      setOrders(prev =>
        prev.map(o =>
          o._id === orderId ? { ...o, order_status: 'delivered', escrow_status: 'released' } : o
        )
      );
      toast.success('Delivery confirmed! Payment released to farmer. 🎉');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setConfirming(null);
    }
  };

  return (
    <div className="min-h-screen dark:bg-gray-950">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="section-title mb-8">My Orders</h1>

        {loading ? (
          <div className="flex flex-col items-center py-24 gap-4 text-gray-400">
            <Loader2 size={36} className="animate-spin text-green-600" />
            <p>Loading your orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📦</div>
            <p className="text-xl font-medium text-gray-500">No orders yet</p>
            <p className="text-sm text-gray-400 mt-2">
              Start shopping to see your orders here
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map(order => {
              const currentStep = STATUS_STEPS.indexOf(order.order_status);
              const productName =
                typeof order.product_id === 'object' && order.product_id
                  ? order.product_id.crop_name
                  : 'Product';
              const farmerName =
                typeof order.farmer_id === 'object' && order.farmer_id
                  ? order.farmer_id.name
                  : 'Farmer';

              return (
                <div key={order._id} className="card p-6">
                  <div className="flex items-start justify-between mb-4 gap-4 flex-wrap">
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white text-lg">{productName}</p>
                      <p className="text-sm text-gray-500">
                        Order #{order._id.slice(-8).toUpperCase()} · {order.quantity}kg · ₹{order.total_amount}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Placed {format(new Date(order.createdAt), 'dd MMM yyyy, h:mm a')}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-semibold px-3 py-1.5 rounded-full whitespace-nowrap ${
                        order.escrow_status === 'released'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                      }`}
                    >
                      {order.escrow_status === 'released' ? '✅ Payment Released' : '🔒 In Escrow'}
                    </span>
                  </div>

                  {/* Status stepper */}
                  <div className="flex items-start mb-6 overflow-x-auto gap-0 pb-1">
                    {STATUS_STEPS.map((step, i) => {
                      const completed = i <= currentStep;
                      const Icon = STATUS_ICONS[step];
                      return (
                        <div key={step} className="flex items-start flex-shrink-0">
                          <div className="flex flex-col items-center">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                completed
                                  ? 'bg-green-600 text-white'
                                  : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                              }`}
                            >
                              <Icon size={14} />
                            </div>
                            <p
                              className={`text-xs mt-1 text-center w-16 leading-tight ${
                                completed
                                  ? 'text-green-700 dark:text-green-400 font-medium'
                                  : 'text-gray-400'
                              }`}
                            >
                              {STATUS_LABELS[step]}
                            </p>
                          </div>
                          {i < STATUS_STEPS.length - 1 && (
                            <div
                              className={`h-0.5 w-6 md:w-10 mx-1 mt-4 flex-shrink-0 ${
                                i < currentStep ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'
                              }`}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Delivery info */}
                  {order.delivery_partner && (
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
                      <MapPin size={14} />
                      <span>
                        {order.delivery_partner}
                        {order.delivery_partner_phone && ` · ${order.delivery_partner_phone}`}
                      </span>
                    </div>
                  )}

                  {/* Farmer + transaction info */}
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 flex justify-between items-center gap-4 flex-wrap">
                    <div>
                      <p className="text-xs text-gray-500">Farmer</p>
                      <p className="font-medium text-sm">{farmerName}</p>
                    </div>
                    {order.transaction_hash && (
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Transaction</p>
                        <p className="hash-text">{order.transaction_hash.slice(0, 18)}…</p>
                      </div>
                    )}
                  </div>

                  {/* Confirm delivery */}
                  {order.order_status === 'out_for_delivery' && (
                    <button
                      onClick={() => confirmDelivery(order._id)}
                      disabled={confirming === order._id}
                      className="btn-primary mt-4 w-full flex items-center justify-center gap-2"
                    >
                      {confirming === order._id ? (
                        <>
                          <Loader2 size={16} className="animate-spin" /> Confirming…
                        </>
                      ) : (
                        '✅ Confirm Delivery & Release Payment'
                      )}
                    </button>
                  )}

                  {order.order_status === 'delivered' && order.escrow_status === 'released' && (
                    <div className="mt-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-3 rounded-xl text-sm text-green-700 dark:text-green-300 text-center font-medium">
                      💚 Payment released to {farmerName}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
