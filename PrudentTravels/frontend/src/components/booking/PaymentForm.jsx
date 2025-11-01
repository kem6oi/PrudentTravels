import React, { useState } from 'react';
import { CreditCardIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { validateCardNumber, validateCVV, validateExpiryDate } from '../../utils/validators';
import Alert from '../common/Alert';
import { InlineLoader } from '../common/Loader';
import { formatCurrency } from '../../utils/formatters';

const PaymentForm = ({ amount, onSubmit, isLoading = false }) => {
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
    saveCard: false,
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let formattedValue = type === 'checkbox' ? checked : value;

    // Format card number with spaces
    if (name === 'cardNumber') {
      formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
    }

    // Format expiry date
    if (name === 'expiryDate') {
      formattedValue = value
        .replace(/\s/g, '')
        .replace(/(\d{2})(\d{0,2})/, '$1/$2')
        .substr(0, 5);
    }

    setFormData(prev => ({
      ...prev,
      [name]: formattedValue,
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.cardHolder.trim()) {
      newErrors.cardHolder = 'Card holder name is required';
    }

    const cardNumberError = validateCardNumber(formData.cardNumber.replace(/\s/g, ''));
    if (cardNumberError) newErrors.cardNumber = cardNumberError;

    const expiryError = validateExpiryDate(formData.expiryDate);
    if (expiryError) newErrors.expiryDate = expiryError;

    const cvvError = validateCVV(formData.cvv);
    if (cvvError) newErrors.cvv = cvvError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    if (!validateForm()) return;

    try {
      await onSubmit({
        cardNumber: formData.cardNumber.replace(/\s/g, ''),
        cardHolder: formData.cardHolder,
        expiryDate: formData.expiryDate,
        cvv: formData.cvv,
        saveCard: formData.saveCard,
      });
    } catch (error) {
      setApiError(error.message || 'Payment failed. Please try again.');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-900">Payment Details</h3>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <LockClosedIcon className="h-4 w-4" />
          <span>Secure Payment</span>
        </div>
      </div>

      {/* Amount Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-gray-700 font-medium">Total Amount</span>
          <span className="text-2xl font-bold text-blue-600">{formatCurrency(amount)}</span>
        </div>
      </div>

      {apiError && (
        <Alert
          type="error"
          message={apiError}
          onClose={() => setApiError('')}
          className="mb-6"
        />
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Card Number */}
        <div>
          <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-2">
            Card Number
          </label>
          <div className="relative">
            <input
              type="text"
              id="cardNumber"
              name="cardNumber"
              value={formData.cardNumber}
              onChange={handleChange}
              maxLength="19"
              className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                errors.cardNumber ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="1234 5678 9012 3456"
              disabled={isLoading}
            />
            <CreditCardIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
          {errors.cardNumber && (
            <p className="mt-1 text-sm text-red-600">{errors.cardNumber}</p>
          )}
        </div>

        {/* Card Holder Name */}
        <div>
          <label htmlFor="cardHolder" className="block text-sm font-medium text-gray-700 mb-2">
            Card Holder Name
          </label>
          <input
            type="text"
            id="cardHolder"
            name="cardHolder"
            value={formData.cardHolder}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
              errors.cardHolder ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="John Doe"
            disabled={isLoading}
          />
          {errors.cardHolder && (
            <p className="mt-1 text-sm text-red-600">{errors.cardHolder}</p>
          )}
        </div>

        {/* Expiry & CVV */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-2">
              Expiry Date
            </label>
            <input
              type="text"
              id="expiryDate"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              maxLength="5"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                errors.expiryDate ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="MM/YY"
              disabled={isLoading}
            />
            {errors.expiryDate && (
              <p className="mt-1 text-sm text-red-600">{errors.expiryDate}</p>
            )}
          </div>

          <div>
            <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-2">
              CVV
            </label>
            <input
              type="text"
              id="cvv"
              name="cvv"
              value={formData.cvv}
              onChange={handleChange}
              maxLength="4"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                errors.cvv ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="123"
              disabled={isLoading}
            />
            {errors.cvv && (
              <p className="mt-1 text-sm text-red-600">{errors.cvv}</p>
            )}
          </div>
        </div>

        {/* Save Card */}
        <div>
          <label className="flex items-start">
            <input
              type="checkbox"
              name="saveCard"
              checked={formData.saveCard}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
              disabled={isLoading}
            />
            <span className="ml-2 text-sm text-gray-700">
              Save this card for future bookings
            </span>
          </label>
        </div>

        {/* Security Notice */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <LockClosedIcon className="h-5 w-5 text-gray-500 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-gray-600">
              <p className="font-medium mb-1">Your payment is secure</p>
              <p>We use industry-standard encryption to protect your card information. Your details are never stored on our servers.</p>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <InlineLoader size="sm" color="white" />
              <span className="ml-2">Processing Payment...</span>
            </>
          ) : (
            `Pay ${formatCurrency(amount)}`
          )}
        </button>

        {/* Accepted Cards */}
        <div className="flex items-center justify-center gap-4 pt-4">
          <img src="/images/visa.svg" alt="Visa" className="h-8" />
          <img src="/images/mastercard.svg" alt="Mastercard" className="h-8" />
          <img src="/images/amex.svg" alt="American Express" className="h-8" />
          <img src="/images/discover.svg" alt="Discover" className="h-8" />
        </div>
      </form>
    </div>
  );
};

export default PaymentForm;
