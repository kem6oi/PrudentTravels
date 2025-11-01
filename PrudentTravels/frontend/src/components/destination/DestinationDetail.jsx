import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPinIcon, 
  StarIcon, 
  ClockIcon, 
  UserGroupIcon,
  CheckCircleIcon,
  HeartIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { formatCurrency } from '../../utils/formatters';
import ImageGallery from './ImageGallery';
import BookingForm from '../booking/BookingForm';

const DestinationDetail = ({ destination, onAddToWishlist, onBook, isInWishlist = false }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'itinerary', label: 'Itinerary' },
    { id: 'inclusions', label: 'What's Included' },
    { id: 'reviews', label: 'Reviews' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Image Gallery */}
      <ImageGallery images={destination.images || [destination.mainImage]} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <div>
            <div className="flex items-start justify-between mb-2">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{destination.name}</h1>
                <div className="flex items-center gap-4 text-gray-600">
                  <span className="flex items-center gap-1">
                    <MapPinIcon className="h-5 w-5" />
                    {destination.city}, {destination.country}
                  </span>
                  <span className="flex items-center gap-1">
                    <ClockIcon className="h-5 w-5" />
                    {destination.duration?.days}D/{destination.duration?.nights}N
                  </span>
                  <span className="flex items-center gap-1">
                    <UserGroupIcon className="h-5 w-5" />
                    Max {destination.maxGroupSize} guests
                  </span>
                </div>
              </div>

              {/* Wishlist Button */}
              <button
                onClick={() => onAddToWishlist?.(destination.id)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                {isInWishlist ? (
                  <HeartIconSolid className="h-6 w-6 text-red-500" />
                ) : (
                  <HeartIcon className="h-6 w-6 text-gray-400" />
                )}
              </button>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(destination.rating || 0)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="font-semibold text-gray-900">{destination.rating}</span>
              <span className="text-gray-600">({destination.reviewCount} reviews)</span>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex gap-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`pb-4 px-1 border-b-2 font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="prose max-w-none">
            {activeTab === 'overview' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-3">About This Destination</h3>
                  <p className="text-gray-700 leading-relaxed">{destination.description}</p>
                </div>

                {destination.highlights && (
                  <div>
                    <h3 className="text-xl font-semibold mb-3">Highlights</h3>
                    <ul className="space-y-2">
                      {destination.highlights.map((highlight, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircleIcon className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'itinerary' && destination.itinerary && (
              <div className="space-y-6">
                {destination.itinerary.map((day, index) => (
                  <div key={index} className="border-l-4 border-blue-600 pl-4">
                    <h4 className="font-semibold text-lg mb-2">Day {day.day}: {day.title}</h4>
                    <p className="text-gray-700">{day.description}</p>
                    {day.activities && (
                      <ul className="mt-2 space-y-1">
                        {day.activities.map((activity, i) => (
                          <li key={i} className="text-gray-600 text-sm">• {activity}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'inclusions' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-lg mb-3 text-green-600">What's Included</h4>
                  <ul className="space-y-2">
                    {destination.inclusions?.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircleIcon className="h-5 w-5 text-green-600 flex-shrink-0" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-lg mb-3 text-red-600">What's Not Included</h4>
                  <ul className="space-y-2">
                    {destination.exclusions?.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-gray-400">✕</span>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <p className="text-gray-600">Reviews content would go here...</p>
              </div>
            )}
          </div>
        </div>

        {/* Booking Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-4">
            <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-blue-600">
                  {formatCurrency(destination.price)}
                </span>
                <span className="text-gray-600">per person</span>
              </div>
              {destination.originalPrice && (
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-gray-500 line-through">
                    {formatCurrency(destination.originalPrice)}
                  </span>
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
                    Save {Math.round(((destination.originalPrice - destination.price) / destination.originalPrice) * 100)}%
                  </span>
                </div>
              )}
            </div>

            <BookingForm destination={destination} onSubmit={onBook} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DestinationDetail;
