import React from 'react';

/**
 * Loading spinner component
 */
const Loader = ({ size = 'md', color = 'blue', fullScreen = false, text = '' }) => {
  const sizeClasses = {
    sm: 'h-6 w-6 border-2',
    md: 'h-12 w-12 border-3',
    lg: 'h-16 w-16 border-4',
    xl: 'h-24 w-24 border-4',
  };

  const colorClasses = {
    blue: 'border-blue-600 border-t-transparent',
    white: 'border-white border-t-transparent',
    gray: 'border-gray-600 border-t-transparent',
    green: 'border-green-600 border-t-transparent',
    red: 'border-red-600 border-t-transparent',
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-4">
      <div
        className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-spin`}
        role="status"
        aria-label="Loading"
      />
      {text && <p className="text-gray-600 text-sm font-medium">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-90">
        {spinner}
      </div>
    );
  }

  return <div className="flex items-center justify-center p-8">{spinner}</div>;
};

/**
 * Inline loader for buttons and small spaces
 */
export const InlineLoader = ({ size = 'sm', color = 'white' }) => {
  const sizeClasses = {
    xs: 'h-3 w-3 border',
    sm: 'h-4 w-4 border-2',
    md: 'h-5 w-5 border-2',
  };

  const colorClasses = {
    blue: 'border-blue-600 border-t-transparent',
    white: 'border-white border-t-transparent',
    gray: 'border-gray-600 border-t-transparent',
  };

  return (
    <div
      className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-spin`}
      role="status"
      aria-label="Loading"
    />
  );
};

/**
 * Skeleton loader for content placeholder
 */
export const Skeleton = ({ className = '', count = 1, height = '20px' }) => {
  return (
    <>
      {[...Array(count)].map((_, index) => (
        <div
          key={index}
          className={`animate-pulse bg-gray-200 rounded ${className}`}
          style={{ height }}
        />
      ))}
    </>
  );
};

/**
 * Card skeleton loader
 */
export const CardSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <Skeleton height="200px" className="w-full" />
      <div className="p-4 space-y-3">
        <Skeleton height="24px" className="w-3/4" />
        <Skeleton height="16px" className="w-full" />
        <Skeleton height="16px" className="w-5/6" />
        <div className="flex justify-between items-center pt-2">
          <Skeleton height="20px" className="w-1/4" />
          <Skeleton height="32px" className="w-1/3" />
        </div>
      </div>
    </div>
  );
};

export default Loader;
