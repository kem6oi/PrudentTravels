import React from 'react';
import { 
  FaMapMarkerAlt, 
  FaClock, 
  FaUsers, 
  FaCalendar,
  FaCheckCircle,
  FaTimesCircle
} from 'react-icons/fa';
import RatingStars from '../reviews/RatingStars';
import { format } from 'date-fns';

const DestinationDetail = ({ destination }) => {
  const {
    name,
    city,
    country,
    description,
    price,
    originalPrice,
    duration,
    maxGroupSize,
    availableDates = [],
    inclusions = [],
    exclusions = [],
    rating,
    reviewCount,
  } = destination;

  const discountPercentage = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-gray-600 mb-2">
          <FaMapMarkerAlt className="text-primary-600" />
          <span>{city}, {country}</span>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{name}</h1>
        <div className="flex items-center gap-4">
          <RatingStars rating={rating || 0} size="large" />
          <span className="text-gray-600">({reviewCount || 0} reviews)</span>
        </div>
      </div>

      {/* Quick Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
          <FaClock className="text-primary-600 text-xl" />
          <div>
            <p className="text-sm text-gray-600">Duration</p>
            <p className="font-semibold">
              {duration?.days || 1}D / {duration?.nights || 0}N
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
          <FaUsers className="text-primary-600 text-xl" />
          <div>
            <p className="text-sm text-gray-600">Group Size</p>
            <p className="font-semibold">Max {maxGroupSize || 10} people</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
          <FaCalendar className="text-primary-600 text-xl" />
          <div>
            <p className="text-sm text-gray-600">Next Available</p>
            <p className="font-semibold">
              {availableDates.length > 0
                ? format(new Date(availableDates[0]), 'MMM dd, yyyy')
                : 'Contact us'}
            </p>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="prose max-w-none">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Trip</h2>
        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
          {description}
        </p>
      </div>

      {/* Inclusions & Exclusions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Inclusions */}
        {inclusions.length > 0 && (
          <div className="bg-green-50 rounded-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FaCheckCircle className="text-green-600" />
              What's Included
            </h3>
            <ul className="space-y-2">
              {inclusions.map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <FaCheckCircle className="text-green-600 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Exclusions */}
        {exclusions.length > 0 && (
          <div className="bg-red-50 rounded-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FaTimesCircle className="text-red-600" />
              What's Not Included
            </h3>
            <ul className="space-y-2">
              {exclusions.map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <FaTimesCircle className="text-red-600 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Pricing */}
      <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl p-6">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-gray-600 mb-1">Starting from</p>
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold text-primary-600">
                ${price}
              </span>
              {originalPrice && (
                <>
                  <span className="text-xl text-gray-400 line-through">
                    ${originalPrice}
                  </span>
                  <span className="badge-danger text-sm">
                    Save {discountPercentage}%
                  </span>
                </>
              )}
            </div>
            <p className="text-gray-600 text-sm mt-1">per person</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DestinationDetail;
