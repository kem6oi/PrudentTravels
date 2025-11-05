import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';
import { FaCheckCircle, FaMoneyBillWave, FaInfoCircle, FaUpload } from 'react-icons/fa';
import paymentService from '../../services/payment.service';
import api from '../../services/api';

const PaymentSubmission = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [booking, setBooking] = useState(null);
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [transactionCode, setTransactionCode] = useState('');
  const [paymentProof, setPaymentProof] = useState(null);

  useEffect(() => {
    fetchBookingDetails();
    fetchAvailableCountries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingId]);

  useEffect(() => {
    if (selectedCountry) {
      fetchPaymentMethods();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCountry]);

  const fetchBookingDetails = async () => {
    try {
      const response = await api.get(`/bookings/${bookingId}`);
      if (response.data.success) {
        setBooking(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching booking:', error);
      toast.error('Failed to load booking details');
      navigate('/user/bookings');
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableCountries = async () => {
    try {
      const response = await paymentService.getAvailableCountries();
      if (response.success) {
        setCountries(response.data);
      }
    } catch (error) {
      console.error('Error fetching countries:', error);
      toast.error('Failed to load available countries');
    }
  };

  const fetchPaymentMethods = async () => {
    try {
      const response = await paymentService.getPaymentMethodsByCountry(selectedCountry);
      if (response.success) {
        setPaymentMethods(response.data);
        if (response.data.length > 0) {
          setSelectedPaymentMethod(response.data[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      toast.error('Failed to load payment methods');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size should be less than 5MB');
        return;
      }
      setPaymentProof(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedCountry) {
      toast.error('Please select your country');
      return;
    }

    if (!selectedPaymentMethod) {
      toast.error('Please select a payment method');
      return;
    }

    if (!transactionCode.trim()) {
      toast.error('Please enter transaction code or reference');
      return;
    }

    setSubmitting(true);

    try {
      // For now, we'll handle file upload separately or send base64
      // This is a simplified version - in production you'd want to handle file uploads properly
      const formData = new FormData();
      formData.append('bookingId', bookingId);
      formData.append('paymentMethodId', selectedPaymentMethod.id);
      formData.append('transactionCode', transactionCode);
      if (paymentProof) {
        formData.append('paymentProof', paymentProof);
      }

      const response = await api.post('/bookings/submit-payment', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        toast.success('Payment submitted successfully! Awaiting verification.');
        navigate(`/user/bookings/${bookingId}`);
      }
    } catch (error) {
      console.error('Error submitting payment:', error);
      toast.error(error.response?.data?.message || 'Failed to submit payment');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <Loader fullScreen />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container-custom section-padding py-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Booking Not Found</h2>
          <button onClick={() => navigate('/user/bookings')} className="btn-primary">
            Back to Bookings
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />

      <div className="container-custom section-padding py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Payment</h1>
          <p className="text-gray-600">
            Booking Reference: <span className="font-semibold">{booking.bookingNumber}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Payment Form */}
          <div className="lg:col-span-2">
            <div className="card p-6">
              <form onSubmit={handleSubmit}>
                {/* Country Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Your Country *
                  </label>
                  <select
                    value={selectedCountry}
                    onChange={(e) => {
                      setSelectedCountry(e.target.value);
                      setSelectedPaymentMethod(null);
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  >
                    <option value="">Choose your country...</option>
                    {countries.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Payment Methods */}
                {selectedCountry && paymentMethods.length > 0 && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Payment Method *
                    </label>
                    <div className="space-y-3">
                      {paymentMethods.map((method) => (
                        <div
                          key={method.id}
                          onClick={() => setSelectedPaymentMethod(method)}
                          className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            selectedPaymentMethod?.id === method.id
                              ? 'border-primary-600 bg-primary-50'
                              : 'border-gray-200 hover:border-primary-300'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <FaMoneyBillWave className="text-primary-600" />
                                <h3 className="font-semibold text-gray-900">
                                  {method.providerName}
                                </h3>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">
                                {method.methodType.replace('_', ' ').toUpperCase()}
                              </p>
                              {method.accountName && (
                                <p className="text-sm text-gray-700">
                                  <span className="font-medium">Account Name:</span> {method.accountName}
                                </p>
                              )}
                              {method.accountNumber && (
                                <p className="text-sm text-gray-700">
                                  <span className="font-medium">Account Number:</span> {method.accountNumber}
                                </p>
                              )}
                              {method.bankName && (
                                <p className="text-sm text-gray-700">
                                  <span className="font-medium">Bank:</span> {method.bankName}
                                </p>
                              )}
                              {method.instructions && (
                                <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded">
                                  <p className="text-xs text-blue-800 flex items-start gap-2">
                                    <FaInfoCircle className="mt-0.5 flex-shrink-0" />
                                    <span>{method.instructions}</span>
                                  </p>
                                </div>
                              )}
                            </div>
                            {selectedPaymentMethod?.id === method.id && (
                              <FaCheckCircle className="text-primary-600 text-xl" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* No Payment Methods Available */}
                {selectedCountry && paymentMethods.length === 0 && (
                  <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-yellow-800">
                      No payment methods are currently available for {selectedCountry}.
                      Please contact support for assistance.
                    </p>
                  </div>
                )}

                {/* Transaction Code Input */}
                {selectedPaymentMethod && (
                  <>
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Transaction Code / Reference Number *
                      </label>
                      <input
                        type="text"
                        value={transactionCode}
                        onChange={(e) => setTransactionCode(e.target.value)}
                        placeholder="Enter transaction code or reference"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        required
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Enter the transaction code or reference number from your payment
                      </p>
                    </div>

                    {/* Payment Proof Upload */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Payment Proof (Optional)
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                          id="paymentProof"
                        />
                        <label
                          htmlFor="paymentProof"
                          className="cursor-pointer flex flex-col items-center"
                        >
                          <FaUpload className="text-3xl text-gray-400 mb-2" />
                          <span className="text-sm text-gray-600">
                            {paymentProof ? paymentProof.name : 'Click to upload screenshot'}
                          </span>
                          <span className="text-xs text-gray-500 mt-1">
                            PNG, JPG up to 5MB
                          </span>
                        </label>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? 'Submitting...' : 'Submit Payment'}
                    </button>
                  </>
                )}
              </form>
            </div>
          </div>

          {/* Right Column - Booking Summary */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Booking Summary</h3>

              <div className="space-y-3 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Destination</p>
                  <p className="font-semibold text-gray-900">{booking.destination?.name}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Check-in</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(booking.checkInDate).toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Check-out</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(booking.checkOutDate).toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Guests</p>
                  <p className="font-semibold text-gray-900">
                    {booking.adults} Adult{booking.adults !== 1 ? 's' : ''}
                    {booking.children > 0 && `, ${booking.children} Child${booking.children !== 1 ? 'ren' : ''}`}
                    {booking.infants > 0 && `, ${booking.infants} Infant${booking.infants !== 1 ? 's' : ''}`}
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-lg font-bold text-gray-900">Total Amount</span>
                  <span className="text-2xl font-bold text-primary-600">
                    ${booking.totalAmount?.toFixed(2)}
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  Including taxes and fees
                </p>
              </div>

              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <FaInfoCircle className="inline mr-2" />
                  After submitting payment, our team will verify your transaction within 24 hours.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PaymentSubmission;
