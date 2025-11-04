import React from 'react';
import { FaMapMarkerAlt, FaClock, FaUsers, FaCalendar } from 'react-icons/fa';
import { format, differenceInDays } from 'date-fns';

const BookingSummary = ({ booking, destination, editable = false, onEdit }) => {
  const {
    checkInDate,
    checkOutDate,
    adults = 1,
    children = 0,
    infants = 0,
    promoCode,
    promoDiscount = 0,
  } = booking || {};

  const nights = checkInDate && checkOutDate
    ? differenceInDays(new Date(checkOutDate), new Date(checkInDate))
    : 0;

  const totalGuests = adults + children + infants;
  const pricePerPerson = Number(destination?.price) || 0;
  const subtotal = Number(pricePerPerson * (adults + children)) || 0;
  const discount = Number(promoDiscount) || 0;
  const total = Number(subtotal - discount) || 0;

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden sticky top-24">
      {/* Destination Header */}
      <div className="relative h-48">
        <img
          src={destination?.mainImage || 'https://via.placeholder.com/400x300'}
          alt={destination?.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <h3 className="text-xl font-bold mb-1">{destination?.name}</h3>
          <p className="flex items-center gap-1 text-sm">
            <FaMapMarkerAlt />
            {destination?.city}, {destination?.country}
          </p>
        </div>
      </div>

      {/* Booking Details */}
      <div className="p-6 space-y-4">
        {/* Dates */}
        {checkInDate && checkOutDate && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 flex items-center gap-2">
                <FaCalendar className="text-primary-600" />
                Check-in
              </span>
              <span className="font-medium">
                {format(new Date(checkInDate), 'MMM dd, yyyy')}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 flex items-center gap-2">
                <FaCalendar className="text-primary-600" />
                Check-out
              </span>
              <span className="font-medium">
                {format(new Date(checkOutDate), 'MMM dd, yyyy')}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 flex items-center gap-2">
                <FaClock className="text-primary-600" />
                Duration
              </span>
              <span className="font-medium">{nights} nights</span>
            </div>
          </div>
        )}

        {/* Guests */}
        <div className="border-t pt-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-600 flex items-center gap-2">
              <FaUsers className="text-primary-600" />
              Guests
            </span>
            <span className="font-medium">{totalGuests} total</span>
          </div>
          <div className="text-sm text-gray-600 space-y-1 ml-7">
            {adults > 0 && <div>{adults} Adult{adults > 1 ? 's' : ''}</div>}
            {children > 0 && <div>{children} Child{children > 1 ? 'ren' : ''}</div>}
            {infants > 0 && <div>{infants} Infant{infants > 1 ? 's' : ''}</div>}
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="border-t pt-4 space-y-2">
          <h4 className="font-semibold text-gray-900 mb-3">Price Breakdown</h4>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">
              ${pricePerPerson} × {adults + children} {adults + children === 1 ? 'guest' : 'guests'}
            </span>
            <span className="font-medium">${subtotal.toFixed(2)}</span>
          </div>

          {infants > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Infants (Free)</span>
              <span className="font-medium">$0.00</span>
            </div>
          )}

          {promoCode && discount > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Promo: {promoCode}</span>
              <span className="font-medium">-${discount.toFixed(2)}</span>
            </div>
          )}

          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Service Fee</span>
            <span className="font-medium">$0.00</span>
          </div>
        </div>

        {/* Total */}
        <div className="border-t pt-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-gray-900">Total</span>
            <span className="text-2xl font-bold text-primary-600">
              ${total.toFixed(2)}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            All taxes and fees included
          </p>
        </div>

        {/* Edit Button */}
        {editable && onEdit && (
          <button
            onClick={onEdit}
            className="w-full btn-outline py-2 text-sm"
          >
            Edit Booking Details
          </button>
        )}
      </div>
    </div>
  );
};

export default BookingSummary;
