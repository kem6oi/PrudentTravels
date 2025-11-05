import React, { useEffect, useState } from 'react';
import { FaCheckCircle, FaTimesCircle, FaMoneyBillWave, FaImage, FaCopy } from 'react-icons/fa';
import toast from 'react-hot-toast';
import api from '../../services/api';
import Loader from '../../components/common/Loader';

const PaymentVerification = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchPendingPayments();
  }, []);

  const fetchPendingPayments = async () => {
    setLoading(true);
    try {
      const response = await api.get('/payments/pending');
      if (response.data.success) {
        setPayments(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching pending payments:', error);
      toast.error('Failed to load pending payments');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPayment = async (paymentId) => {
    if (!window.confirm('Are you sure you want to approve this payment?')) {
      return;
    }

    setProcessing(true);
    try {
      const response = await api.put(`/payments/${paymentId}/verify`);
      if (response.data.success) {
        toast.success('Payment verified successfully');
        fetchPendingPayments();
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      toast.error(error.response?.data?.message || 'Failed to verify payment');
    } finally {
      setProcessing(false);
    }
  };

  const handleRejectPayment = async () => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }

    setProcessing(true);
    try {
      const response = await api.put(`/payments/${selectedPayment.id}/reject`, {
        reason: rejectionReason
      });
      if (response.data.success) {
        toast.success('Payment rejected');
        setShowRejectModal(false);
        setRejectionReason('');
        setSelectedPayment(null);
        fetchPendingPayments();
      }
    } catch (error) {
      console.error('Error rejecting payment:', error);
      toast.error(error.response?.data?.message || 'Failed to reject payment');
    } finally {
      setProcessing(false);
    }
  };

  const openRejectModal = (payment) => {
    setSelectedPayment(payment);
    setShowRejectModal(true);
  };

  const closeRejectModal = () => {
    setShowRejectModal(false);
    setRejectionReason('');
    setSelectedPayment(null);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Verification</h1>
        <p className="text-gray-600">
          Review and verify pending manual payments submitted by users
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Pending Payments</p>
              <p className="text-3xl font-bold text-primary-600">{payments.length}</p>
            </div>
            <FaMoneyBillWave className="text-4xl text-primary-200" />
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Amount</p>
              <p className="text-3xl font-bold text-green-600">
                ${payments.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0).toFixed(2)}
              </p>
            </div>
            <FaMoneyBillWave className="text-4xl text-green-200" />
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">With Proof</p>
              <p className="text-3xl font-bold text-blue-600">
                {payments.filter(p => p.paymentProof).length}
              </p>
            </div>
            <FaImage className="text-4xl text-blue-200" />
          </div>
        </div>
      </div>

      {/* Payments List */}
      {payments.length === 0 ? (
        <div className="card p-12 text-center">
          <FaCheckCircle className="text-6xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No Pending Payments
          </h3>
          <p className="text-gray-500">
            All payments have been verified. New submissions will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {payments.map((payment) => (
            <div key={payment.id} className="card p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Payment & Booking Info */}
                <div className="lg:col-span-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Payment Details
                  </h3>

                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-500">Amount</p>
                      <p className="text-2xl font-bold text-primary-600">
                        ${parseFloat(payment.amount).toFixed(2)} {payment.currency}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">Transaction Code</p>
                      <div className="flex items-center gap-2">
                        <p className="font-mono font-semibold text-gray-900">
                          {payment.transactionCode}
                        </p>
                        <button
                          onClick={() => copyToClipboard(payment.transactionCode)}
                          className="text-gray-400 hover:text-primary-600"
                        >
                          <FaCopy />
                        </button>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">Payment Method</p>
                      <p className="font-semibold text-gray-900">
                        {payment.paymentMethod?.providerName || 'N/A'}
                      </p>
                      <p className="text-sm text-gray-600">
                        {payment.paymentMethod?.methodType?.replace('_', ' ').toUpperCase() || 'Manual'}
                      </p>
                      <p className="text-sm text-gray-600">
                        {payment.paymentMethod?.country || ''}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">Booking Reference</p>
                      <p className="font-semibold text-gray-900">
                        {payment.booking?.bookingNumber}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">Submitted</p>
                      <p className="text-sm text-gray-700">
                        {new Date(payment.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Payment Proof */}
                  {payment.paymentProof && (
                    <div className="mt-4">
                      <p className="text-xs text-gray-500 mb-2">Payment Proof</p>
                      <a
                        href={`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${payment.paymentProof}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700"
                      >
                        <FaImage />
                        View Screenshot
                      </a>
                    </div>
                  )}
                </div>

                {/* Middle Column - Customer & Booking Info */}
                <div className="lg:col-span-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Customer Information
                  </h3>

                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-500">Name</p>
                      <p className="font-semibold text-gray-900">
                        {payment.user?.firstName} {payment.user?.lastName}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="text-sm text-gray-700">{payment.user?.email}</p>
                    </div>

                    {payment.user?.phone && (
                      <div>
                        <p className="text-xs text-gray-500">Phone</p>
                        <p className="text-sm text-gray-700">{payment.user.phone}</p>
                      </div>
                    )}
                  </div>

                  <div className="mt-6">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">
                      Booking Details
                    </h4>
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs text-gray-500">Destination</p>
                        <p className="font-semibold text-gray-900">
                          {payment.booking?.destination?.title}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500">Travel Dates</p>
                        <p className="text-sm text-gray-700">
                          {new Date(payment.booking?.checkInDate).toLocaleDateString()} - {' '}
                          {new Date(payment.booking?.checkOutDate).toLocaleDateString()}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500">Guests</p>
                        <p className="text-sm text-gray-700">
                          {payment.booking?.adults} Adult(s)
                          {payment.booking?.children > 0 && `, ${payment.booking.children} Child(ren)`}
                          {payment.booking?.infants > 0 && `, ${payment.booking.infants} Infant(s)`}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500">Booking Status</p>
                        <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ${
                          payment.booking?.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          payment.booking?.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {payment.booking?.status?.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Actions */}
                <div className="lg:col-span-1 flex flex-col justify-center">
                  <div className="space-y-3">
                    <button
                      onClick={() => handleVerifyPayment(payment.id)}
                      disabled={processing}
                      className="w-full btn-primary py-3 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <FaCheckCircle />
                      Approve Payment
                    </button>

                    <button
                      onClick={() => openRejectModal(payment)}
                      disabled={processing}
                      className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <FaTimesCircle />
                      Reject Payment
                    </button>

                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-xs text-blue-800">
                        <strong>Note:</strong> Approving will confirm the booking and notify the customer.
                        Rejecting will notify the customer with the provided reason.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Reject Payment
            </h3>
            <p className="text-gray-600 mb-4">
              Please provide a reason for rejecting this payment. The customer will be notified.
            </p>

            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter rejection reason..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent mb-4"
              rows="4"
            />

            <div className="flex gap-3">
              <button
                onClick={closeRejectModal}
                disabled={processing}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectPayment}
                disabled={processing || !rejectionReason.trim()}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {processing ? 'Rejecting...' : 'Reject Payment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentVerification;
