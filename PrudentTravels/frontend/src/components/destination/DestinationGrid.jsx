import React from 'react';
import DestinationCard from './DestinationCard';
import { CardSkeleton } from '../common/Loader';

const DestinationGrid = ({ 
  destinations = [], 
  isLoading = false, 
  emptyMessage = 'No destinations found',
  className = '' 
}) => {
  if (isLoading) {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
        {[...Array(6)].map((_, index) => (
          <CardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (destinations.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-12 h-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Destinations Found</h3>
        <p className="text-gray-600">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {destinations.map((destination, index) => (
        <DestinationCard 
          key={destination.id || index} 
          destination={destination} 
          index={index}
        />
      ))}
    </div>
  );
};

export default DestinationGrid;
