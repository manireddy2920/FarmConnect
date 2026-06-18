'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useCartStore, useUIStore } from '@/store';
import { ShoppingCart, Sun, Moon, User, Menu, X, Leaf, Bell } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const { data: session } = useSession();
  const { getItemCount } = useCartStore();
  const { theme, toggleTheme } = useUIStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const cartCount = getItemCount();
  const role = (session?.user as any)?.role;
  const tokenBalance = (session?.user as any)?.token_balance || 0;

  return (
    <nav className="sticky top-0 z-50 bg-white/95 dark:bg-gray-950/95 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-green-700 dark:text-green-400">
            <div className="w-8 h-8 bg-green-700 rounded-lg flex items-center justify-center">
              <Leaf size={18} className="text-white" />
            </div>
            <span style={{ fontFamily: 'Playfair Display, serif' }}>FarmConnect</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600 dark:text-gray-300">
            <Link href="/shop" className="hover:text-green-700 transition-colors">Shop</Link>
            <Link href="/groupbuy" className="hover:text-green-700 transition-colors">Group Buy</Link>
            <Link href="/subscription" className="hover:text-green-700 transition-colors">Subscribe</Link>
            <Link href="/meal-planner" className="hover:text-green-700 transition-colors">Meal Planner</Link>
            <Link href="/community" className="hover:text-green-700 transition-colors">Community</Link>
            {role === 'farmer' && <Link href="/farmer/dashboard" className="hover:text-green-700 transition-colors">Farmer Hub</Link>}
            {role === 'admin' && <Link href="/admin" className="hover:text-green-700 transition-colors">Admin</Link>}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Token balance */}
            {session && (
              <div className="hidden sm:flex items-center gap-1 token-badge px-3 py-1 rounded-full text-sm">
                <span>🌾</span>
                <span>{tokenBalance} FT</span>
              </div>
            )}

            {/* Theme toggle */}
            <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" aria-label="Toggle theme">
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Cart */}
            <Link href="/cart" className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Auth */}
            {session ? (
              <div className="relative group">
                <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                  <User size={20} />
                  <span className="hidden sm:block text-sm font-medium">{session.user?.name?.split(' ')[0]}</span>
                </button>
                <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all py-2 z-50">
                  <Link href="/orders" className="block px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800">My Orders</Link>
                  <Link href="/subscription" className="block px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800">Subscription</Link>
                  {role === 'farmer' && <Link href="/farmer/dashboard" className="block px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800">Farmer Dashboard</Link>}
                  <hr className="my-1 border-gray-100 dark:border-gray-700" />
                  <button onClick={() => signOut()} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-gray-800">Sign Out</button>
                </div>
              </div>
            ) : (
              <Link href="/login" className="btn-primary py-2 px-4 text-sm">Login</Link>
            )}

            {/* Mobile menu */}
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 rounded-lg hover:bg-gray-100">
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800 px-4 py-3 space-y-2">
          {[
            { href: '/shop', label: 'Shop' },
            { href: '/groupbuy', label: 'Group Buy' },
            { href: '/subscription', label: 'Subscribe' },
            { href: '/meal-planner', label: 'Meal Planner' },
            { href: '/community', label: 'Community' },
            { href: '/events', label: 'Events' },
          ].map(link => (
            <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)}
              className="block py-2 px-3 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 text-sm font-medium">
              {link.label}
            </Link>
          ))}
          {role === 'farmer' && <Link href="/farmer/dashboard" onClick={() => setMenuOpen(false)} className="block py-2 px-3 rounded-lg hover:bg-green-50 text-sm font-medium">Farmer Hub</Link>}
        </div>
      )}
    </nav>
  );
}
