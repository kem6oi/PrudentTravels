import React from 'react';
import { FaThumbsUp, FaUserCircle } from 'react-icons/fa';
import { HiDotsVertical } from 'react-icons/hi';
import { format } from 'date-fns';
import RatingStars from './RatingStars';

const ReviewCard = ({ review, onHelpful, showActions = false, onEdit, onDelete }) => {
  const {
    id,
    user,
    rating,
    title,
    comment,
    images = [],
    helpfulCount = 0,
    isHelpful = false,
    createdAt,
    verified = false,
  } = review;

  const formatDate = (date) => {
    try {
      return format(new Date(date), 'MMM dd, yyyy');
    } catch (error) {
      return 'N/A';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-3">
          {/* User Avatar */}
          {user?.profileImage ? (
            <img
              src={user.profileImage}
              alt={user.firstName}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <FaUserCircle className="w-12 h-12 text-gray-400" />
          )}

          {/* User Info */}
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-gray-900">
                {user?.firstName} {user?.lastName}
              </h4>
              {verified && (
                <span className="badge-success text-xs">Verified</span>
              )}
            </div>
            <RatingStars rating={rating} size="small" showNumber={false} />
            <p className="text-sm text-gray-500">{formatDate(createdAt)}</p>
          </div>
        </div>

        {/* Actions Menu */}
        {showActions && (
          <div className="relative group">
            <button className="p-1 hover:bg-gray-100 rounded-full">
              <HiDotsVertical className="w-5 h-5 text-gray-400" />
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 hidden group-hover:block z-10">
              <button
                onClick={() => onEdit?.(review)}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Edit Review
              </button>
              <button
                onClick={() => onDelete?.(id)}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                Delete Review
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Review Content */}
      <div className="mb-4">
        {title && (
          <h5 className="font-semibold text-gray-900 mb-2">{title}</h5>
        )}
        <p className="text-gray-700 leading-relaxed">{comment}</p>
      </div>

      {/* Review Images */}
      {images.length > 0 && (
        <div className="flex gap-2 mb-4 overflow-x-auto">
          {images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Review ${index + 1}`}
              className="w-24 h-24 rounded-lg object-cover cursor-pointer hover:opacity-90 transition-opacity"
            />
          ))}
        </div>
      )}

      {/* Footer - Helpful Button */}
      <div className="flex items-center justify-between pt-4 border-t">
        <button
          onClick={() => onHelpful?.(id)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            isHelpful
              ? 'bg-primary-50 text-primary-600'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <FaThumbsUp className="w-4 h-4" />
          <span className="text-sm font-medium">
            Helpful {helpfulCount > 0 && `(${helpfulCount})`}
          </span>
        </button>
      </div>
    </div>
  );
};

export default ReviewCard;
