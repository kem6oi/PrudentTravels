import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import {  CalendarIcon, UserGroupIcon, ClockIcon } from '@heroicons/react/24/outline';
import { validateBookingDates, validateGuestCount } from '../../utils/validators';
import { calculateNights, formatCurrency } from '../../utils/formatters';
import Alert from '../common/Alert';
import { InlineLoader } from '../common/Loader';
import 'react-datepicker/dist/react-datepicker.css';

const BookingForm = ({ destination, onSubmit, isLoading = false }) => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    checkInDate: null,
    checkOutDate: null,
    guests: 1,
    specialRequests: '',
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    const dateError = validateBookingDates(formData.checkInDate, formData.checkOutDate);
    if (dateError) newErrors.dates = dateError;

    const guestError = validateGuestCount(formData.guests, destination.maxGroupSize);
    if (guestError) newErrors.guests = guestError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateTotalPrice = () => {
    if (!formData.checkInDate || !formData.checkOutDate) return 0;
    const nights = calculateNights(formData.checkInDate, formData.checkOutDate);
    return destination.price * formData.guests * (destination.duration?.nights || nights);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    if (!validateForm()) return;

    try {
      await onSubmit({
        destinationId: destination.id,
        checkInDate: formData.checkInDate,
        checkOutDate: formData.checkOutDate,
        guests: formData.guests,
        specialRequests: formData.specialRequests,
        totalPrice: calculateTotalPrice(),
      });
    } catch (error) {
      setApiError(error.message || 'Booking failed. Please try again.');
    }
  };

  const nights = formData.checkInDate && formData.checkOutDate 
    ? calculateNights(formData.checkInDate, formData.checkOutDate)
    : destination.duration?.nights || 0;

  const totalPrice = calculateTotalPrice();

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Book Your Trip</h3>

      {apiError && (
        <Alert
          type="error"
          message={apiError}
          onClose={() => setApiError('')}
          className="mb-6"
        />
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Check-in Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Check-in Date
          </label>
          <div className="relative">
            <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
            <DatePicker
              selected={formData.checkInDate}
              onChange={(date) => handleChange('checkInDate', date)}
              minDate={new Date()}
              maxDate={formData.checkOutDate}
              placeholderText="Select check-in date"
              className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.dates ? 'border-red-500' : 'border-gray-300'
              }`}
              dateFormat="MMM dd, yyyy"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Check-out Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Check-out Date
          </label>
          <div className="relative">
            <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
            <DatePicker
              selected={formData.checkOutDate}
              onChange={(date) => handleChange('checkOutDate', date)}
              minDate={formData.checkInDate || new Date()}
              placeholderText="Select check-out date"
              className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.dates ? 'border-red-500' : 'border-gray-300'
              }`}
              dateFormat="MMM dd, yyyy"
              disabled={isLoading}
            />
          </div>
          {errors.dates && (
            <p className="mt-1 text-sm text-red-600">{errors.dates}</p>
          )}
        </div>

        {/* Number of Guests */}
        <div>
          <label htmlFor="guests" className="block text-sm font-medium text-gray-700 mb-2">
            Number of Guests
          </label>
          <div className="relative">
            <UserGroupIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="number"
              id="guests"
              min="1"
              max={destination.maxGroupSize || 10}
              value={formData.guests}
              onChange={(e) => handleChange('guests', parseInt(e.target.value))}
              className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.guests ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={isLoading}
            />
          </div>
          {errors.guests && (
            <p className="mt-1 text-sm text-red-600">{errors.guests}</p>
          )}
          <p className="mt-1 text-sm text-gray-500">
            Maximum {destination.maxGroupSize || 10} guests
          </p>
        </div>

        {/* Special Requests */}
        <div>
          <label htmlFor="specialRequests" className="block text-sm font-medium text-gray-700 mb-2">
            Special Requests (Optional)
          </label>
          <textarea
            id="specialRequests"
            rows="4"
            value={formData.specialRequests}
            onChange={(e) => handleChange('specialRequests', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Any special requirements or preferences..."
            disabled={isLoading}
          />
        </div>

        {/* Price Summary */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Price per person</span>
            <span className="font-medium">{formatCurrency(destination.price)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Number of guests</span>
            <span className="font-medium">{formData.guests}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 flex items-center">
              <ClockIcon className="h-4 w-4 mr-1" />
              Duration
            </span>
            <span className="font-medium">{nights} {nights === 1 ? 'night' : 'nights'}</span>
          </div>
          <div className="pt-3 border-t border-gray-200 flex items-center justify-between">
            <span className="text-lg font-semibold text-gray-900">Total</span>
            <span className="text-2xl font-bold text-blue-600">{formatCurrency(totalPrice)}</span>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || !formData.checkInDate || !formData.checkOutDate}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <InlineLoader size="sm" color="white" />
              <span className="ml-2">Processing...</span>
            </>
          ) : (
            'Continue to Payment'
          )}
        </button>

        <p className="text-xs text-gray-500 text-center">
          By continuing, you agree to our Terms & Conditions and Cancellation Policy
        </p>
      </form>
    </div>
  );
};

export default BookingForm;
