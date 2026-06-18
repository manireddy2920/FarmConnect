import Link from 'next/link';
import { Leaf, Heart } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-green-950 text-green-100 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <Leaf size={18} className="text-white" />
              </div>
              <span className="font-bold text-xl text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
                FarmConnect
              </span>
            </div>
            <p className="text-green-300 text-sm leading-relaxed">
              Connecting Indian farmers directly with urban consumers. Fair prices, full transparency, blockchain verified.
            </p>
            <div className="flex gap-4 mt-5">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="text-green-400 hover:text-amber-400 text-sm transition-colors"
              >
                Facebook
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="text-green-400 hover:text-amber-400 text-sm transition-colors"
              >
                Twitter
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-green-400 hover:text-amber-400 text-sm transition-colors"
              >
                Instagram
              </a>
            </div>
          </div>

          {/* For Consumers */}
          <div>
            <h4 className="font-bold text-white mb-4">For Consumers</h4>
            <ul className="space-y-2 text-sm text-green-300">
              {[
                ['Shop Fresh Produce', '/shop'],
                ['Group Buy', '/groupbuy'],
                ['Subscription Box', '/subscription'],
                ['Meal Planner', '/meal-planner'],
                ['My Orders', '/orders'],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="hover:text-amber-400 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Farmers */}
          <div>
            <h4 className="font-bold text-white mb-4">For Farmers</h4>
            <ul className="space-y-2 text-sm text-green-300">
              {[
                ['Farmer Dashboard', '/farmer/dashboard'],
                ['List Products', '/farmer/products'],
                ['Manage Orders', '/farmer/orders'],
                ['Sales Insights', '/farmer/insights'],
                ['Community Forum', '/community'],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="hover:text-amber-400 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Platform */}
          <div>
            <h4 className="font-bold text-white mb-4">Platform</h4>
            <ul className="space-y-2 text-sm text-green-300">
              {[
                ['Events', '/events'],
                ['Donate', '/donate'],
                ['Community Forum', '/community'],
                ['Register as Farmer', '/register?role=farmer'],
                ['Register as Consumer', '/register'],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="hover:text-amber-400 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-green-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-green-400">
          <p>© {year} FarmConnect. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with <Heart size={14} className="text-amber-400 mx-1" /> for Indian farmers
          </p>
          <p>Empowering farmers through direct trade.</p>
        </div>
      </div>
    </footer>
  );
}
