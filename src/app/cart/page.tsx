'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import { useCartStore } from '@/store';
import { Trash2, ShoppingBag, Shield, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCartStore();
  const [coupon, setCoupon] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [checkoutMode, setCheckoutMode] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [deliverySlot, setDeliverySlot] = useState('morning');
  const [address, setAddress] = useState({ line1: '', city: '', state: '', pincode: '' });
  const [placing, setPlacing] = useState(false);

  const subtotal = getTotal();
  const delivery = subtotal > 500 ? 0 : 40;
  const discount = couponApplied ? Math.round(subtotal * 0.1) : 0;
  const total = subtotal + delivery - discount;

  const applyCoupon = () => {
    if (coupon.toUpperCase() === 'FARM10') {
      setCouponApplied(true);
      toast.success('10% discount applied!');
    } else {
      toast.error('Invalid coupon code');
    }
  };

  const placeOrder = async () => {
    if (!address.line1 || !address.city) {
      toast.error('Please fill delivery address');
      return;
    }
    setPlacing(true);
    await new Promise(r => setTimeout(r, 2000));
    toast.success('Order placed! Payment held in escrow. 🎉');
    clearCart();
    router.push('/orders');
    setPlacing(false);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen dark:bg-gray-950">
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 py-20 text-center">
          <div className="text-8xl mb-6">🛒</div>
          <h2 className="text-2xl font-bold mb-3">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Discover fresh produce from verified local farmers</p>
          <Link href="/shop" className="btn-primary inline-flex items-center gap-2">
            <ShoppingBag size={18} /> Browse Products
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen dark:bg-gray-950">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="section-title mb-8">Your Cart</h1>
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map(item => (
              <div key={item.product_id} className="card p-4 flex items-center gap-4">
                <img src={item.photo} alt={item.crop_name} className="w-20 h-20 rounded-xl object-cover" />
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">{item.crop_name}</p>
                      <p className="text-sm text-gray-500">by {item.farmer_name}</p>
                      {item.organic && <span className="badge-green text-xs">🌿 Organic</span>}
                    </div>
                    <button onClick={() => removeItem(item.product_id)} className="text-red-400 hover:text-red-600 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                      <button onClick={() => updateQuantity(item.product_id, item.quantity - 1)} className="px-3 py-1 hover:bg-gray-50 dark:hover:bg-gray-800 font-bold">−</button>
                      <span className="px-3 py-1 font-semibold text-sm">{item.quantity} kg</span>
                      <button onClick={() => updateQuantity(item.product_id, item.quantity + 1)} className="px-3 py-1 hover:bg-gray-50 dark:hover:bg-gray-800 font-bold">+</button>
                    </div>
                    <p className="font-bold text-green-700">₹{(item.price_per_kg * item.quantity).toFixed(0)}</p>
                  </div>
                </div>
              </div>
            ))}

            {/* Checkout form */}
            {checkoutMode && (
              <div className="card p-6 space-y-4">
                <h2 className="font-bold text-lg">Delivery Details</h2>
                <div>
                  <label className="text-sm font-medium block mb-1">Street Address</label>
                  <input className="input-field" placeholder="House no, Street name" value={address.line1} onChange={e => setAddress(a => ({ ...a, line1: e.target.value }))} />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-sm font-medium block mb-1">City</label>
                    <input className="input-field" placeholder="City" value={address.city} onChange={e => setAddress(a => ({ ...a, city: e.target.value }))} />
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-1">State</label>
                    <input className="input-field" placeholder="State" value={address.state} onChange={e => setAddress(a => ({ ...a, state: e.target.value }))} />
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-1">Pincode</label>
                    <input className="input-field" placeholder="500001" value={address.pincode} onChange={e => setAddress(a => ({ ...a, pincode: e.target.value }))} />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium block mb-2">Delivery Slot</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[{ v: 'morning', l: '🌅 Morning (6AM–12PM)' }, { v: 'evening', l: '🌆 Evening (4PM–8PM)' }].map(slot => (
                      <button key={slot.v} onClick={() => setDeliverySlot(slot.v)} className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${deliverySlot === slot.v ? 'border-green-600 bg-green-50 dark:bg-green-900/30' : 'border-gray-200 dark:border-gray-700'}`}>
                        {slot.l}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium block mb-2">Payment Method</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { v: 'upi', l: '📱 UPI' },
                      { v: 'card', l: '💳 Card' },
                      { v: 'netbanking', l: '🏦 Net Banking' },
                      { v: 'cod', l: '💵 Cash on Delivery' },
                    ].map(pm => (
                      <button key={pm.v} onClick={() => setPaymentMethod(pm.v)} className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${paymentMethod === pm.v ? 'border-green-600 bg-green-50 dark:bg-green-900/30' : 'border-gray-200 dark:border-gray-700'}`}>
                        {pm.l}
                        {pm.v === 'cod' && total > 2000 && <span className="block text-xs text-red-500">Not available above ₹2000</span>}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="space-y-4">
            <div className="card p-6">
              <h2 className="font-bold text-lg mb-4">Order Summary</h2>
              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>₹{subtotal}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Delivery</span><span className={delivery === 0 ? 'text-green-600' : ''}>{delivery === 0 ? 'FREE' : `₹${delivery}`}</span></div>
                {discount > 0 && <div className="flex justify-between text-green-600"><span>Discount (FARM10)</span><span>−₹{discount}</span></div>}
                <div className="border-t border-gray-100 dark:border-gray-800 pt-2 flex justify-between font-bold text-base">
                  <span>Total</span><span className="text-green-700">₹{total}</span>
                </div>
              </div>

              {/* Coupon */}
              <div className="flex gap-2 mb-4">
                <input placeholder="Coupon code (try FARM10)" value={coupon} onChange={e => setCoupon(e.target.value)} className="input-field text-sm" />
                <button onClick={applyCoupon} className="btn-outline py-2 px-3 text-sm whitespace-nowrap">Apply</button>
              </div>

              {/* Escrow banner */}
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 p-3 rounded-xl text-xs text-amber-800 dark:text-amber-300 flex gap-2 mb-4">
                <Shield size={14} className="flex-shrink-0 mt-0.5" />
                Payment held in escrow. Released to farmer only after you confirm delivery.
              </div>

              {!checkoutMode ? (
                <button onClick={() => setCheckoutMode(true)} className="btn-primary w-full flex items-center justify-center gap-2">
                  Proceed to Checkout <ArrowRight size={16} />
                </button>
              ) : (
                <button
                  onClick={placeOrder}
                  disabled={placing || (paymentMethod === 'cod' && total > 2000)}
                  className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {placing ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Placing Order...</> : `Pay ₹${total} & Place Order`}
                </button>
              )}
            </div>

            {/* FarmToken earn */}
            <div className="card p-4 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-200">
              <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">🌾 Earn FarmTokens</p>
              <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">You'll earn <strong>10 FarmTokens</strong> when this order is delivered. Redeem 100 tokens = ₹10 off.</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
