import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'rectangular' | 'circular';
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '', variant = 'rectangular' }) => {
  const baseClasses = "animate-pulse bg-gray-200 dark:bg-gray-700";
  const radius = variant === 'circular' ? 'rounded-full' : variant === 'text' ? 'rounded-md' : 'rounded-2xl';
  
  return (
    <div className={`${baseClasses} ${radius} ${className}`} />
  );
};

export const CardSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-3xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
    <Skeleton className="w-full aspect-[4/3] mb-4" />
    <Skeleton className="h-6 w-3/4 mb-2" variant="text" />
    <div className="flex gap-4 mb-3">
      <Skeleton className="h-4 w-12" variant="text" />
      <Skeleton className="h-4 w-12" variant="text" />
    </div>
    <div className="flex justify-between items-center">
      <Skeleton className="h-6 w-16" variant="text" />
      <Skeleton className="h-8 w-8" variant="circular" />
    </div>
  </div>
);