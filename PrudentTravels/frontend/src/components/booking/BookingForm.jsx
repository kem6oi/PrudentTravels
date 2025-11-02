import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { HiUser, HiMail, HiPhone, HiUsers } from 'react-icons/hi';
import toast from 'react-hot-toast';

const BookingForm = ({ onSubmit, initialData = {}, destination }) => {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      adults: initialData.adults || 1,
      children: initialData.children || 0,
      infants: initialData.infants || 0,
      firstName: initialData.firstName || '',
      lastName: initialData.lastName || '',
      email: initialData.email || '',
      phone: initialData.phone || '',
      specialRequests: initialData.specialRequests || '',
      promoCode: initialData.promoCode || '',
    },
  });

  const adults = watch('adults');
  const children = watch('children');
  const infants = watch('infants');

  const totalGuests = parseInt(adults) + parseInt(children) + parseInt(infants);
  const maxGroupSize = destination?.maxGroupSize || 10;

  const handleFormSubmit = async (data) => {
    if (totalGuests > maxGroupSize) {
      toast.error(`Maximum group size is ${maxGroupSize} guests`);
      return;
    }

    setLoading(true);
    try {
      await onSubmit(data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Guest Count */}
      <div className="bg-sky-50 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <HiUsers />
          Number of Guests
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Adults */}
          <div>
            <label htmlFor="adults" className="label">
              Adults (18+) *
            </label>
            <input
              id="adults"
              type="number"
              min="1"
              max={maxGroupSize}
              {...register('adults', {
                required: 'At least 1 adult is required',
                min: { value: 1, message: 'At least 1 adult required' },
                max: { value: maxGroupSize, message: `Max ${maxGroupSize} guests` },
              })}
              className="input-field"
            />
            {errors.adults && (
              <p className="error-text">{errors.adults.message}</p>
            )}
          </div>

          {/* Children */}
          <div>
            <label htmlFor="children" className="label">
              Children (2-17)
            </label>
            <input
              id="children"
              type="number"
              min="0"
              max={maxGroupSize - 1}
              {...register('children', {
                min: { value: 0, message: 'Cannot be negative' },
              })}
              className="input-field"
            />
          </div>

          {/* Infants */}
          <div>
            <label htmlFor="infants" className="label">
              Infants (0-1)
            </label>
            <input
              id="infants"
              type="number"
              min="0"
              max={maxGroupSize - 1}
              {...register('infants', {
                min: { value: 0, message: 'Cannot be negative' },
              })}
              className="input-field"
            />
          </div>
        </div>

        <div className="mt-4 p-3 bg-white rounded-lg">
          <p className="text-sm text-gray-600">
            Total Guests: <span className="font-semibold text-gray-900">{totalGuests}</span>
            {maxGroupSize && ` / ${maxGroupSize}`}
          </p>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-sky-50 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Contact Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* First Name */}
          <div>
            <label htmlFor="firstName" className="label">
              First Name *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <HiUser className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="firstName"
                type="text"
                {...register('firstName', {
                  required: 'First name is required',
                })}
                className="input-field pl-10"
                placeholder="John"
              />
            </div>
            {errors.firstName && (
              <p className="error-text">{errors.firstName.message}</p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label htmlFor="lastName" className="label">
              Last Name *
            </label>
            <input
              id="lastName"
              type="text"
              {...register('lastName', {
                required: 'Last name is required',
              })}
              className="input-field"
              placeholder="Doe"
            />
            {errors.lastName && (
              <p className="error-text">{errors.lastName.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="label">
              Email *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <HiMail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                type="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
                className="input-field pl-10"
                placeholder="you@example.com"
              />
            </div>
            {errors.email && (
              <p className="error-text">{errors.email.message}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="label">
              Phone *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <HiPhone className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="phone"
                type="tel"
                {...register('phone', {
                  required: 'Phone is required',
                })}
                className="input-field pl-10"
                placeholder="+1 (555) 000-0000"
              />
            </div>
            {errors.phone && (
              <p className="error-text">{errors.phone.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Special Requests */}
      <div>
        <label htmlFor="specialRequests" className="label">
          Special Requests (Optional)
        </label>
        <textarea
          id="specialRequests"
          rows="4"
          {...register('specialRequests')}
          className="input-field resize-none"
          placeholder="Any special requirements or requests..."
        />
      </div>

      {/* Promo Code */}
      <div>
        <label htmlFor="promoCode" className="label">
          Promo Code (Optional)
        </label>
        <input
          id="promoCode"
          type="text"
          {...register('promoCode')}
          className="input-field"
          placeholder="Enter promo code"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full btn-primary py-3 text-lg"
      >
        {loading ? 'Processing...' : 'Continue to Payment'}
      </button>
    </form>
  );
};

export default BookingForm;
