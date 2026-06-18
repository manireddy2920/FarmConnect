'use client';

import { calculateFreshnessScore, getFreshnessLabel } from '@/lib/mockData';

interface FreshnessScoreProps {
  harvestDate: string;
  size?: 'sm' | 'md' | 'lg';
  showBar?: boolean;
}

export default function FreshnessScore({ harvestDate, size = 'md', showBar = true }: FreshnessScoreProps) {
  const score = calculateFreshnessScore(harvestDate);
  const { label, color } = getFreshnessLabel(score);

  const colorMap = {
    green: { badge: 'bg-green-100 text-green-800', bar: 'freshness-bar-green' },
    amber: { badge: 'bg-amber-100 text-amber-800', bar: 'freshness-bar-amber' },
    red: { badge: 'bg-red-100 text-red-800', bar: 'freshness-bar-red' },
  };

  const sizeMap = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2 py-1',
    lg: 'text-sm px-3 py-1',
  };

  const { badge, bar } = colorMap[color as keyof typeof colorMap];

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className={`${badge} ${sizeMap[size]} rounded-full font-semibold`}>
          🌿 {label} ({score}/100)
        </span>
      </div>
      {showBar && (
        <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
          <div
            className={`h-full rounded-full ${bar} transition-all duration-500`}
            style={{ width: `${score}%` }}
          />
        </div>
      )}
    </div>
  );
}
