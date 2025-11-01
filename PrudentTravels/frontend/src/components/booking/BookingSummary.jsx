import React from 'react';
import { 
  MapPinIcon, 
  CalendarDaysIcon, 
  UserGroupIcon, 
  ClockIcon,
  CheckCircleIcon 
} from '@heroicons/react/24/outline';
import { formatDate, formatCurrency, calculateNights } from '../../utils/formatters';
import { BOOKING_STATUS } from '../../utils/constants';

const BookingSummary = ({ booking, destination, showActions = false, onCancel, onReview }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case BOOKING_STATUS.CONFIRMED:
        return 'bg-green-100 text-green-800';
      case BOOKING_STATUS.PENDING:
        return 'bg-yellow-100 text-yellow-800';
      case BOOKING_STATUS.CANCELLED:
        return 'bg-red-100 text-red-800';
      case BOOKING_STATUS.COMPLETED:
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const nights = calculateNights(booking.checkInDate, booking.checkOutDate);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Destination Image */}
      {destination?.mainImage && (
        <div className="relative h-48">
          <img
            src={destination.mainImage}
            alt={destination.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 right-4">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </span>
          </div>
        </div>
      )}

      {/* Booking Details */}
      <div className="p-6 space-y-4">
        {/* Destination Name */}
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-1">{destination?.name}</h3>
          <div className="flex items-center text-gray-600 text-sm">
            <MapPinIcon className="h-4 w-4 mr-1" />
            <span>{destination?.city}, {destination?.country}</span>
          </div>
        </div>

        {/* Booking Reference */}
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-500 mb-1">Booking Reference</p>
          <p className="font-mono text-sm font-semibold text-gray-900">{booking.bookingNumber}</p>
        </div>

        {/* Trip Details */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500 mb-1 flex items-center">
              <CalendarDaysIcon className="h-4 w-4 mr-1" />
              Check-in
            </p>
            <p className="font-medium text-gray-900">{formatDate(booking.checkInDate)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1 flex items-center">
              <CalendarDaysIcon className="h-4 w-4 mr-1" />
              Check-out
            </p>
            <p className="font-medium text-gray-900">{formatDate(booking.checkOutDate)}</p>
          </div>
        </div>

        {/* Duration & Guests */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500 mb-1 flex items-center">
              <ClockIcon className="h-4 w-4 mr-1" />
              Duration
            </p>
            <p className="font-medium text-gray-900">{nights} {nights === 1 ? 'Night' : 'Nights'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1 flex items-center">
              <UserGroupIcon className="h-4 w-4 mr-1" />
              Guests
            </p>
            <p className="font-medium text-gray-900">{booking.guests} {booking.guests === 1 ? 'Guest' : 'Guests'}</p>
          </div>
        </div>

        {/* Special Requests */}
        {booking.specialRequests && (
          <div>
            <p className="text-xs text-gray-500 mb-1">Special Requests</p>
            <p className="text-sm text-gray-700">{booking.specialRequests}</p>
          </div>
        )}

        {/* Price Breakdown */}
        <div className="border-t border-gray-200 pt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Price per person</span>
            <span>{formatCurrency(destination?.price || 0)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Guests × Duration</span>
            <span>{booking.guests} × {nights} nights</span>
          </div>
          {booking.discount > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Discount</span>
              <span>- {formatCurrency(booking.discount)}</span>
            </div>
          )}
          <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t">
            <span>Total</span>
            <span className="text-blue-600">{formatCurrency(booking.totalPrice)}</span>
          </div>
        </div>

        {/* Payment Status */}
        {booking.paymentStatus && (
          <div className="flex items-center gap-2 text-sm">
            {booking.paymentStatus === 'paid' && (
              <>
                <CheckCircleIcon className="h-5 w-5 text-green-600" />
                <span className="text-green-600 font-medium">Payment Confirmed</span>
              </>
            )}
            {booking.paymentStatus === 'pending' && (
              <>
                <span className="text-yellow-600 font-medium">Payment Pending</span>
              </>
            )}
          </div>
        )}

        {/* Actions */}
        {showActions && (
          <div className="flex gap-3 pt-4 border-t">
            {booking.status === BOOKING_STATUS.CONFIRMED && (
              <button
                onClick={() => onCancel?.(booking.id)}
                className="flex-1 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium"
              >
                Cancel Booking
              </button>
            )}
            {booking.status === BOOKING_STATUS.COMPLETED && !booking.hasReview && (
              <button
                onClick={() => onReview?.(booking.id)}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Write Review
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingSummary;
