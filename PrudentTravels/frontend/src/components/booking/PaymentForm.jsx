import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { HiCreditCard, HiLockClosed } from 'react-icons/hi';
import toast from 'react-hot-toast';

const PaymentForm = ({ amount, onSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [cardComplete, setCardComplete] = useState(false);

  // Ensure amount is a valid number
  const numericAmount = Number(amount) || 0;

  const CARD_ELEMENT_OPTIONS = {
    style: {
      base: {
        color: '#1f2937',
        fontFamily: '"Inter", sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: '#9ca3af',
        },
      },
      invalid: {
        color: '#ef4444',
        iconColor: '#ef4444',
      },
    },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      toast.error('Payment system is not ready. Please try again.');
      return;
    }

    if (!cardComplete) {
      toast.error('Please complete your card details');
      return;
    }

    setLoading(true);

    try {
      // Get card element
      const cardElement = elements.getElement(CardElement);

      // Create payment method
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (error) {
        toast.error(error.message);
        setLoading(false);
        return;
      }

      // Call success callback with payment method
      await onSuccess(paymentMethod);
      
      toast.success('Payment successful!');
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Payment Amount */}
      <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg p-6">
        <div className="text-center">
          <p className="text-gray-600 mb-2">Total Amount</p>
          <p className="text-4xl font-bold text-primary-600">
            ${numericAmount.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Card Details */}
      <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <HiCreditCard className="text-2xl text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Card Details</h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="label">Card Information</label>
            <div className="border border-gray-300 rounded-lg p-4 focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-transparent">
              <CardElement
                options={CARD_ELEMENT_OPTIONS}
                onChange={(e) => setCardComplete(e.complete)}
              />
            </div>
          </div>

          {/* Security Note */}
          <div className="flex items-start gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
            <HiLockClosed className="text-green-600 mt-0.5 flex-shrink-0" />
            <p>
              Your payment information is encrypted and secure. We never store your card details.
            </p>
          </div>
        </div>
      </div>

      {/* Accepted Cards */}
      <div className="flex items-center justify-center gap-3 text-gray-400">
        <img src="/images/visa.svg" alt="Visa" className="h-8 opacity-50" />
        <img src="/images/mastercard.svg" alt="Mastercard" className="h-8 opacity-50" />
        <img src="/images/amex.svg" alt="American Express" className="h-8 opacity-50" />
        <img src="/images/discover.svg" alt="Discover" className="h-8 opacity-50" />
      </div>

      {/* Terms & Conditions */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-gray-700">
          By confirming your payment, you agree to our{' '}
          <a href="/terms" className="text-primary-600 hover:underline">
            Terms & Conditions
          </a>{' '}
          and{' '}
          <a href="/cancellation" className="text-primary-600 hover:underline">
            Cancellation Policy
          </a>
          .
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 btn-ghost py-3 text-base"
            disabled={loading}
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={!stripe || loading || !cardComplete}
          className="flex-1 btn-primary py-3 text-base flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              Processing...
            </>
          ) : (
            <>
              <HiLockClosed />
              Pay ${numericAmount.toFixed(2)}
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default PaymentForm;
