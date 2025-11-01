import React from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaMapMarkerAlt, FaClock, FaUsers } from 'react-icons/fa';
import { motion } from 'framer-motion';

const DestinationCard = ({ destination, index = 0 }) => {
  const {
    id,
    slug,
    name,
    mainImage,
    shortDescription,
    city,
    country,
    price,
    originalPrice,
    rating,
    reviewCount,
    duration,
    maxGroupSize,
    category = [],
  } = destination;

  const discountPercentage = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="card group cursor-pointer overflow-hidden hover:shadow-xl transition-all duration-300"
    >
      <Link to={`/destinations/${slug || id}`}>
        {/* Image Section */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={mainImage || 'https://via.placeholder.com/400x300'}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          
          {/* Discount Badge */}
          {discountPercentage > 0 && (
            <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-semibold">
              -{discountPercentage}%
            </div>
          )}

          {/* Category Badge */}
          {category.length > 0 && (
            <div className="absolute top-3 right-3 bg-primary-600 text-white px-2 py-1 rounded-md text-xs">
              {category[0]}
            </div>
          )}

          {/* Overlay with quick info */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-3 left-3 right-3 text-white">
              <div className="flex items-center gap-3 text-sm">
                <span className="flex items-center gap-1">
                  <FaClock className="text-xs" />
                  {duration?.days || 1}D {duration?.nights || 0}N
                </span>
                <span className="flex items-center gap-1">
                  <FaUsers className="text-xs" />
                  Max {maxGroupSize || 10}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4">
          {/* Location */}
          <div className="flex items-center gap-1 text-gray-500 text-sm mb-2">
            <FaMapMarkerAlt className="text-xs" />
            <span>{city}, {country}</span>
          </div>

          {/* Title */}
          <h3 className="font-semibold text-lg mb-2 line-clamp-1 group-hover:text-primary-600 transition-colors">
            {name}
          </h3>

          {/* Description */}
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {shortDescription}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  className={`text-xs ${
                    i < Math.floor(rating || 0)
                      ? 'text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-medium">{rating || 0}</span>
            <span className="text-gray-500 text-sm">({reviewCount || 0} reviews)</span>
          </div>

          {/* Price */}
          <div className="flex items-end justify-between pt-3 border-t">
            <div>
              <span className="text-gray-500 text-sm">From</span>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-primary-600">
                  ${price}
                </span>
                {originalPrice && (
                  <span className="text-sm text-gray-400 line-through">
                    ${originalPrice}
                  </span>
                )}
              </div>
              <span className="text-gray-500 text-xs">per person</span>
            </div>
            
            <button className="btn-primary py-2 px-4 text-sm">
              View Details
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default DestinationCard;