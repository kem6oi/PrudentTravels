import React, { useEffect, useState } from 'react';
import { HiCheck, HiX, HiEye, HiFilter } from 'react-icons/hi';
import Sidebar from '../../components/common/Sidebar';
import { SidebarProvider } from '../../contexts/SidebarContext';
import Navbar from '../../components/common/Navbar';
import Loader from '../../components/common/Loader';
import { format } from 'date-fns';
import api, { apiEndpoints } from '../../services/api';
import toast from 'react-hot-toast';

const BookingManager = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending'); // Default to pending for admin review
  const [actionLoading, setActionLoading] = useState({});

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await api.get(apiEndpoints.bookings.getAll);
      const bookingsData = response.data.data?.bookings || response.data.data || [];
      setBookings(bookingsData);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to approve this booking?')) {
      return;
    }

    setActionLoading({ ...actionLoading, [bookingId]: 'approving' });
    try {
      await api.put(apiEndpoints.bookings.update(bookingId), {
        status: 'confirmed'
      });
      toast.success('Booking approved successfully');
      fetchBookings();
    } catch (error) {
      console.error('Error approving booking:', error);
      toast.error('Failed to approve booking');
    } finally {
      setActionLoading({ ...actionLoading, [bookingId]: null });
    }
  };

  const handleRejectBooking = async (bookingId) => {
    const reason = window.prompt('Please provide a reason for cancellation:');
    if (!reason) {
      return;
    }

    setActionLoading({ ...actionLoading, [bookingId]: 'rejecting' });
    try {
      await api.post(apiEndpoints.bookings.cancel(bookingId), {
        reason
      });
      toast.success('Booking cancelled successfully');
      fetchBookings();
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast.error('Failed to cancel booking');
    } finally {
      setActionLoading({ ...actionLoading, [bookingId]: null });
    }
  };

  const safeBookings = Array.isArray(bookings) ? bookings : [];

  // Calculate counts for each filter
  const counts = {
    all: safeBookings.length,
    pending: safeBookings.filter(b => b.status === 'pending').length,
    awaitingPayment: safeBookings.filter(b =>
      b.status === 'pending' || (b.status === 'confirmed' && b.paymentStatus === 'pending')
    ).length,
    confirmed: safeBookings.filter(b => b.status === 'confirmed').length,
    cancelled: safeBookings.filter(b => b.status === 'cancelled').length,
    completed: safeBookings.filter(b => b.status === 'completed').length,
  };

  // Filter bookings based on selected filter
  const getFilteredBookings = () => {
    switch (filter) {
      case 'pending':
        return safeBookings.filter(b => b.status === 'pending');
      case 'awaitingPayment':
        return safeBookings.filter(b =>
          b.status === 'pending' || (b.status === 'confirmed' && b.paymentStatus === 'pending')
        );
      case 'confirmed':
        return safeBookings.filter(b => b.status === 'confirmed');
      case 'cancelled':
        return safeBookings.filter(b => b.status === 'cancelled');
      case 'completed':
        return safeBookings.filter(b => b.status === 'completed');
      default:
        return safeBookings;
    }
  };

  const filteredBookings = getFilteredBookings();

  const filters = [
    { value: 'pending', label: 'Pending Approval', count: counts.pending, color: 'bg-yellow-100 text-yellow-800' },
    { value: 'awaitingPayment', label: 'Awaiting Payment', count: counts.awaitingPayment, color: 'bg-orange-100 text-orange-800' },
    { value: 'confirmed', label: 'Confirmed', count: counts.confirmed, color: 'bg-green-100 text-green-800' },
    { value: 'cancelled', label: 'Cancelled', count: counts.cancelled, color: 'bg-red-100 text-red-800' },
    { value: 'completed', label: 'Completed', count: counts.completed, color: 'bg-blue-100 text-blue-800' },
    { value: 'all', label: 'All Bookings', count: counts.all, color: 'bg-gray-100 text-gray-800' },
  ];

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-sky-50">
        <Sidebar />
        <div className="flex-1 overflow-auto">
          <Navbar title="Manage Bookings" />

          <main className="p-8">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Management</h1>
              <p className="text-gray-600">Review and approve customer bookings</p>
            </div>

            {/* Status Filter Tabs */}
            <div className="mb-6 flex items-center gap-3 overflow-x-auto pb-2">
              <HiFilter className="text-gray-400 text-xl flex-shrink-0" />
              {filters.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setFilter(f.value)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                    filter === f.value
                      ? 'bg-primary-600 text-white shadow-md transform scale-105'
                      : 'bg-white text-gray-700 hover:bg-gray-50 hover:shadow'
                  }`}
                >
                  <span>{f.label}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                    filter === f.value ? 'bg-white bg-opacity-30' : f.color
                  }`}>
                    {f.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Bookings Table */}
            {loading ? (
              <Loader />
            ) : filteredBookings.length === 0 ? (
              <div className="card p-12 text-center">
                <div className="text-6xl mb-4">📋</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No {filter !== 'all' && `${filter} `}bookings found
                </h3>
                <p className="text-gray-600">
                  {filter === 'pending'
                    ? 'All bookings have been reviewed!'
                    : 'There are no bookings matching this filter.'}
                </p>
              </div>
            ) : (
              <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Booking
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Customer
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Destination
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Travel Dates
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Guests
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Payment
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredBookings.map((booking) => (
                        <tr key={booking.id} className="hover:bg-sky-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm">
                              <div className="font-medium text-gray-900">
                                {booking.bookingNumber}
                              </div>
                              <div className="text-gray-500 text-xs">
                                {format(new Date(booking.createdAt), 'MMM dd, yyyy')}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm">
                              <div className="font-medium text-gray-900">
                                {booking.user?.firstName} {booking.user?.lastName}
                              </div>
                              <div className="text-gray-500 text-xs">
                                {booking.user?.email}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                              {booking.destination?.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {booking.destination?.city}, {booking.destination?.country}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div>
                              {booking.checkInDate && format(new Date(booking.checkInDate), 'MMM dd')} -{' '}
                              {booking.checkOutDate && format(new Date(booking.checkOutDate), 'MMM dd, yyyy')}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {booking.totalGuests || (booking.adults + (booking.children || 0) + (booking.infants || 0))}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                              booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                              booking.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {booking.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              booking.paymentStatus === 'success' ? 'bg-green-100 text-green-800' :
                              booking.paymentStatus === 'pending' ? 'bg-orange-100 text-orange-800' :
                              booking.paymentStatus === 'failed' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {booking.paymentStatus || 'pending'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                            ${Number(booking.totalAmount).toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end gap-2">
                              {booking.status === 'pending' && (
                                <>
                                  <button
                                    onClick={() => handleApproveBooking(booking.id)}
                                    disabled={actionLoading[booking.id] === 'approving'}
                                    className="inline-flex items-center px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    title="Approve booking"
                                  >
                                    <HiCheck className="mr-1" />
                                    {actionLoading[booking.id] === 'approving' ? 'Approving...' : 'Approve'}
                                  </button>
                                  <button
                                    onClick={() => handleRejectBooking(booking.id)}
                                    disabled={actionLoading[booking.id] === 'rejecting'}
                                    className="inline-flex items-center px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    title="Reject booking"
                                  >
                                    <HiX className="mr-1" />
                                    {actionLoading[booking.id] === 'rejecting' ? 'Rejecting...' : 'Reject'}
                                  </button>
                                </>
                              )}
                              <button
                                onClick={() => window.open(`/user/bookings/${booking.id}`, '_blank')}
                                className="inline-flex items-center px-3 py-1.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                                title="View details"
                              >
                                <HiEye className="mr-1" />
                                View
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Summary Stats */}
            {!loading && (
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="card p-4">
                  <div className="text-sm text-gray-600 mb-1">Pending Approval</div>
                  <div className="text-2xl font-bold text-yellow-600">{counts.pending}</div>
                </div>
                <div className="card p-4">
                  <div className="text-sm text-gray-600 mb-1">Confirmed</div>
                  <div className="text-2xl font-bold text-green-600">{counts.confirmed}</div>
                </div>
                <div className="card p-4">
                  <div className="text-sm text-gray-600 mb-1">Awaiting Payment</div>
                  <div className="text-2xl font-bold text-orange-600">{counts.awaitingPayment}</div>
                </div>
                <div className="card p-4">
                  <div className="text-sm text-gray-600 mb-1">Total Bookings</div>
                  <div className="text-2xl font-bold text-primary-600">{counts.all}</div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default BookingManager;
