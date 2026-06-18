'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Leaf, User, Tractor, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RegisterForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [role, setRole] = useState<'farmer' | 'consumer'>(
    (params.get('role') as 'farmer' | 'consumer') || 'consumer'
  );
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', password: '', phone: '',
    district: '', state: '', farming_type: 'organic', languages: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, role }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');
      toast.success('Account created! Please login.');
      router.push('/login');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-amber-50 dark:from-gray-950 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 bg-green-700 rounded-xl flex items-center justify-center">
            <Leaf size={20} className="text-white" />
          </div>
          <span className="text-2xl font-bold text-green-800 dark:text-green-400" style={{ fontFamily: 'Playfair Display, serif' }}>FarmConnect</span>
        </Link>

        <div className="card p-8">
          <h1 className="text-2xl font-bold text-center mb-2">Create Account</h1>
          <p className="text-gray-500 text-center text-sm mb-6">Join the FarmConnect community</p>

          <div className="grid grid-cols-2 gap-3 mb-6">
            {[
              { value: 'consumer', label: 'Consumer', sub: 'Buy fresh produce', icon: User },
              { value: 'farmer', label: 'Farmer', sub: 'Sell your harvest', icon: Tractor },
            ].map(({ value, label, sub, icon: Icon }) => (
              <button key={value} type="button" onClick={() => setRole(value as 'farmer' | 'consumer')}
                className={`p-4 rounded-xl border-2 text-left transition-all ${role === value ? 'border-green-600 bg-green-50 dark:bg-green-900/30' : 'border-gray-200 dark:border-gray-700 hover:border-green-300'}`}>
                <div className="flex items-start justify-between">
                  <Icon size={22} className={role === value ? 'text-green-700' : 'text-gray-400'} />
                  {role === value && <CheckCircle size={16} className="text-green-600" />}
                </div>
                <p className={`font-bold mt-2 ${role === value ? 'text-green-800 dark:text-green-400' : 'text-gray-700 dark:text-gray-300'}`}>{label}</p>
                <p className="text-xs text-gray-500">{sub}</p>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Full Name *</label>
                <input type="text" value={form.name} onChange={e => set('name', e.target.value)} className="input-field" placeholder="Your name" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone *</label>
                <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} className="input-field" placeholder="10-digit number" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email Address *</label>
              <input type="email" value={form.email} onChange={e => set('email', e.target.value)} className="input-field" placeholder="you@example.com" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password *</label>
              <input type="password" value={form.password} onChange={e => set('password', e.target.value)} className="input-field" placeholder="Min 8 characters" minLength={8} required />
            </div>

            {role === 'farmer' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">District *</label>
                    <input type="text" value={form.district} onChange={e => set('district', e.target.value)} className="input-field" placeholder="e.g. Warangal" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">State *</label>
                    <input type="text" value={form.state} onChange={e => set('state', e.target.value)} className="input-field" placeholder="e.g. Telangana" required />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Farming Type *</label>
                  <select value={form.farming_type} onChange={e => set('farming_type', e.target.value)} className="input-field">
                    <option value="organic">Organic</option>
                    <option value="conventional">Conventional</option>
                    <option value="mixed">Mixed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Languages Spoken</label>
                  <input type="text" value={form.languages} onChange={e => set('languages', e.target.value)} className="input-field" placeholder="e.g. Telugu, Hindi" />
                </div>
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl p-3 text-sm text-amber-800 dark:text-amber-300">
                  📋 After registration, your account will show <strong>Pending Verification</strong> until our admin approves it (usually within 24 hours).
                </div>
              </>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
              {loading
                ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating account...</>
                : `Create ${role === 'farmer' ? 'Farmer' : 'Consumer'} Account`}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-4">
            Already have an account?{' '}
            <Link href="/login" className="text-green-700 dark:text-green-400 font-semibold hover:underline">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
