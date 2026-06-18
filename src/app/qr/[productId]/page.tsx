import { mockProducts, mockJourneySteps } from '@/lib/mockData';
import { CheckCircle, Shield, Leaf } from 'lucide-react';
import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react';

export default function QRPage({ params }: { params: { productId: string } }) {
  const product = mockProducts.find(p => p._id === params.productId) || mockProducts[0];
  const steps = mockJourneySteps(params.productId);
  const score = Math.max(0, 100 - (Math.floor((Date.now() - new Date(product.harvest_date).getTime()) / (1000 * 60 * 60 * 24)) * 8));

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-amber-50">
      {/* Header */}
      <div className="bg-green-800 text-white py-4 px-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-bold" style={{ fontFamily: 'Playfair Display, serif' }}>🌿 FarmConnect</Link>
          <span className="text-green-200 text-sm">Farm-to-Table Tracker</span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* Product header */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex gap-4 items-start">
            {product.photos[0] && (
              <img src={product.photos[0]} alt={product.crop_name} className="w-24 h-24 rounded-xl object-cover" />
            )}
            <div className="flex-1">
              <div className="flex flex-wrap gap-2 mb-1">
                {product.organic && (
                  <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Leaf size={10} /> Certified Organic
                  </span>
                )}
              </div>
              <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>{product.crop_name}</h1>
              {product.variety && <p className="text-gray-500">{product.variety}</p>}
              <p className="text-green-700 font-semibold mt-1">Grown by {product.farmer_name} · {product.district}</p>
            </div>
          </div>

          {/* Freshness */}
          <div className="mt-4 p-3 bg-gray-50 rounded-xl">
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium">Freshness Score</span>
              <span className={`font-bold ${score >= 80 ? 'text-green-600' : score >= 50 ? 'text-amber-600' : 'text-red-500'}`}>{score}/100</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className={`h-2 rounded-full ${score >= 80 ? 'freshness-bar-green' : score >= 50 ? 'freshness-bar-amber' : 'freshness-bar-red'}`} style={{ width: `${score}%` }} />
            </div>
            <p className="text-xs text-gray-500 mt-1">Harvested {Math.floor((Date.now() - new Date(product.harvest_date).getTime()) / (1000 * 60 * 60 * 24))} day(s) ago</p>
          </div>

          {/* Hash */}
          <div className="mt-3 p-3 bg-green-50 rounded-xl flex items-start gap-2">
            <Shield size={14} className="text-green-600 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-green-800">Blockchain Product ID</p>
              <p className="hash-text text-xs break-all mt-0.5">{product.blockchain_hash}</p>
            </div>
          </div>
        </div>

        {/* Journey timeline */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            📡 Farm-to-Table Journey
          </h2>
          <div className="space-y-0">
            {steps.map((step, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0 border-2 ${step.completed ? 'bg-green-100 border-green-400' : 'bg-gray-50 border-gray-200'}`}>
                    {step.completed ? '✅' : '⏳'}
                  </div>
                  {i < steps.length - 1 && (
                    <div className={`w-0.5 flex-1 my-1 ${step.completed ? 'bg-green-300' : 'bg-gray-200'}`} style={{ minHeight: 32 }} />
                  )}
                </div>
                <div className="pb-6 flex-1 min-w-0">
                  <p className={`font-bold text-sm ${step.completed ? 'text-gray-900' : 'text-gray-400'}`}>{step.step}</p>
                  {step.date && (
                    <p className="text-xs text-gray-500 mt-0.5">
                      {new Date(step.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  )}
                  <p className="text-xs text-gray-500">{step.location}</p>
                  <p className="text-xs text-gray-400">{step.actor}</p>
                  {step.hash && <p className="hash-text text-xs mt-1">{step.hash}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* QR self-ref */}
        <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center gap-3 text-center">
          <QRCodeSVG value={`https://farmconnect.app/qr/${product._id}`} size={100} />
          <p className="text-xs text-gray-500">Share this QR code to let others verify this product's journey</p>
          <Link href={`/shop/${product._id}`} className="btn-primary text-sm py-2 px-4">
            Buy This Product →
          </Link>
        </div>
      </div>
    </div>
  );
}
