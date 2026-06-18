'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Leaf, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await signIn('credentials', { email, password, redirect: false });
    setLoading(false);
    if (result?.error) {
      toast.error('Invalid email or password');
    } else {
      toast.success('Welcome back!');
      router.push(params.get('callbackUrl') || '/shop');
    }
  };

  const handleGoogle = () => signIn('google', { callbackUrl: '/shop' });

  const demoLogins = [
    { label: '👨‍🌾 Farmer', email: 'ravi@farm.in', password: 'farmer123' },
    { label: '🛒 Consumer', email: 'priya@consumer.in', password: 'consumer123' },
    { label: '⚙️ Admin', email: 'admin@farmconnect.in', password: 'admin123' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-amber-50 dark:from-gray-950 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 bg-green-700 rounded-xl flex items-center justify-center">
            <Leaf size={20} className="text-white" />
          </div>
          <span className="text-2xl font-bold text-green-800 dark:text-green-400" style={{ fontFamily: 'Playfair Display, serif' }}>FarmConnect</span>
        </Link>

        <div className="card p-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">Welcome Back</h1>
          <p className="text-gray-500 text-center text-sm mb-6">Sign in to your FarmConnect account</p>

          <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-700">
            <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-2">⚡ Quick Demo Login</p>
            <div className="flex flex-wrap gap-2">
              {demoLogins.map(d => (
                <button key={d.email} onClick={() => { setEmail(d.email); setPassword(d.password); }}
                  className="text-xs bg-white dark:bg-gray-800 border border-amber-200 dark:border-amber-700 px-3 py-1 rounded-full hover:bg-amber-100 transition-colors">
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="input-field" placeholder="you@example.com" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} className="input-field pr-10" placeholder="••••••••" required />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
              {loading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Signing in...</> : 'Sign In'}
            </button>
          </form>

          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
            <span className="text-gray-400 text-sm">or</span>
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
          </div>

          <button onClick={handleGoogle} className="w-full flex items-center justify-center gap-3 border border-gray-200 dark:border-gray-700 py-3 px-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium">
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
            Continue with Google
          </button>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?{' '}
            <Link href="/register" className="text-green-700 dark:text-green-400 font-semibold hover:underline">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
