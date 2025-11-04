import React from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

const RatingStars = ({
  rating = 0,
  size = 'medium',
  showNumber = true,
  interactive = false,
  onRate,
  className = ''
}) => {
  // Ensure rating is a valid number
  const numericRating = Number(rating) || 0;

  const sizes = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-xl',
    xlarge: 'text-2xl',
  };

  const renderStar = (index) => {
    const starValue = index + 1;
    const filled = numericRating >= starValue;
    const halfFilled = numericRating >= starValue - 0.5 && numericRating < starValue;

    const handleClick = () => {
      if (interactive && onRate) {
        onRate(starValue);
      }
    };

    const starClass = `${sizes[size]} ${
      interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''
    }`;

    if (filled) {
      return (
        <FaStar
          key={index}
          className={`${starClass} text-yellow-400`}
          onClick={handleClick}
        />
      );
    } else if (halfFilled) {
      return (
        <FaStarHalfAlt
          key={index}
          className={`${starClass} text-yellow-400`}
          onClick={handleClick}
        />
      );
    } else {
      return (
        <FaRegStar
          key={index}
          className={`${starClass} ${
            interactive ? 'text-gray-400' : 'text-gray-300'
          }`}
          onClick={handleClick}
        />
      );
    }
  };

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {[...Array(5)].map((_, index) => renderStar(index))}
      {showNumber && (
        <span className={`ml-1 font-medium text-gray-700 ${sizes[size]}`}>
          {numericRating.toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default RatingStars;
