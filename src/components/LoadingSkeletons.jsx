import { Card } from './Card';

export const SkeletonPulse = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-700/50 rounded ${className}`} />
);

export const HeroSkeleton = () => (
  <Card className="bg-gradient-to-br from-primary-500/15 to-accent-blue/10 border-primary-500/30">
    <div className="animate-pulse">
      {/* Header */}
      <div className="mb-6">
        <SkeletonPulse className="h-8 w-48 mb-2" />
        <SkeletonPulse className="h-4 w-32" />
      </div>

      {/* Summary */}
      <div className="mb-6 space-y-2">
        <SkeletonPulse className="h-4 w-full" />
        <SkeletonPulse className="h-4 w-3/4" />
      </div>

      {/* Badges */}
      <div className="flex gap-4 mb-6">
        <SkeletonPulse className="h-10 w-32" />
        <SkeletonPulse className="h-10 w-32" />
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-dark-bg/30 rounded-lg p-4">
            <SkeletonPulse className="h-4 w-16 mb-2" />
            <SkeletonPulse className="h-8 w-20 mb-1" />
            <SkeletonPulse className="h-3 w-12" />
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div className="flex gap-4">
        <SkeletonPulse className="h-10 w-40" />
        <SkeletonPulse className="h-10 w-32" />
      </div>
    </div>
  </Card>
);

export const SessionCardSkeleton = () => (
  <Card className="animate-pulse">
    {/* Header */}
    <div className="flex items-start justify-between mb-4">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <SkeletonPulse className="h-3 w-24" />
          <SkeletonPulse className="h-3 w-16" />
        </div>
        <SkeletonPulse className="h-8 w-32" />
      </div>
      <SkeletonPulse className="h-8 w-8 rounded-lg" />
    </div>

    {/* Metrics */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-dark-bg/50 rounded-lg p-4">
          <SkeletonPulse className="h-3 w-12 mb-2" />
          <SkeletonPulse className="h-6 w-16 mb-1" />
          <SkeletonPulse className="h-3 w-10" />
        </div>
      ))}
    </div>
  </Card>
);

export const CardGridSkeleton = ({ count = 3 }) => (
  <div className="space-y-4">
    {Array.from({ length: count }).map((_, i) => (
      <SessionCardSkeleton key={i} />
    ))}
  </div>
);

export const StatCardSkeleton = () => (
  <Card className="animate-pulse">
    <div className="flex items-center justify-between mb-4">
      <SkeletonPulse className="h-6 w-32" />
      <SkeletonPulse className="h-8 w-8 rounded" />
    </div>
    <SkeletonPulse className="h-10 w-24 mb-2" />
    <SkeletonPulse className="h-4 w-20" />
  </Card>
);
