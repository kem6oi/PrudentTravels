import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { HiCalendar, HiUsers, HiCreditCard, HiArrowLeft } from 'react-icons/hi';
import Sidebar from '../../components/common/Sidebar';
import { SidebarProvider } from '../../contexts/SidebarContext';
import Navbar from '../../components/common/Navbar';
import Loader from '../../components/common/Loader';
import api, { apiEndpoints } from '../../services/api';
import { format, differenceInDays } from 'date-fns';
import toast from 'react-hot-toast';

const BookingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchBookingDetails = async () => {
    try {
      const response = await api.get(apiEndpoints.bookings.getOne(id));
      setBooking(response.data.data);
    } catch (error) {
      console.error('Error fetching booking details:', error);
      toast.error('Failed to load booking details');
      navigate('/user/bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookingDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleCancelBooking = async () => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      await api.post(apiEndpoints.bookings.cancel(id));
      toast.success('Booking cancelled successfully');
      fetchBookingDetails();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel booking');
    }
  };

  if (loading) {
    return (
      <SidebarProvider>
        <div className="flex h-screen bg-sky-50">
          <Sidebar />
          <div className="flex-1 overflow-auto">
            <Navbar title="Booking Details" />
            <main className="p-8">
              <Loader />
            </main>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  if (!booking) {
    return (
      <SidebarProvider>
        <div className="flex h-screen bg-sky-50">
          <Sidebar />
          <div className="flex-1 overflow-auto">
            <Navbar title="Booking Details" />
            <main className="p-8">
              <div className="card p-12 text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Booking Not Found</h3>
                <p className="text-gray-600 mb-6">The booking you're looking for doesn't exist or you don't have access to it.</p>
                <Link to="/user/bookings" className="btn-primary">
                  Back to Bookings
                </Link>
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  const nights = differenceInDays(
    new Date(booking.checkOutDate),
    new Date(booking.checkInDate)
  );

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-sky-50">
        <Sidebar />
        <div className="flex-1 overflow-auto">
          <Navbar title="Booking Details" />

          <main className="p-8">
            {/* Back Button */}
            <Link
              to="/user/bookings"
              className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-6"
            >
              <HiArrowLeft />
              Back to My Bookings
            </Link>

            {/* Booking Header */}
            <div className="card p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {booking.destination?.name}
                  </h1>
                  <p className="text-gray-600">
                    {booking.destination?.city}, {booking.destination?.country}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Booking #{booking.bookingNumber}
                  </p>
                </div>
                <span className={`badge text-lg ${
                  booking.status === 'confirmed' ? 'badge-success' :
                  booking.status === 'pending' ? 'badge-warning' :
                  booking.status === 'completed' ? 'badge-info' :
                  'badge-danger'
                }`}>
                  {booking.status}
                </span>
              </div>

              {/* Destination Image */}
              {booking.destination?.mainImage && (
                <img
                  src={booking.destination.mainImage}
                  alt={booking.destination.name}
                  className="w-full h-64 object-cover rounded-lg"
                />
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Details */}
              <div className="lg:col-span-2 space-y-6">
                {/* Travel Dates */}
                <div className="card p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <HiCalendar className="text-primary-600" />
                    Travel Dates
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Check-in</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {format(new Date(booking.checkInDate), 'EEEE, MMMM dd, yyyy')}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Check-out</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {format(new Date(booking.checkOutDate), 'EEEE, MMMM dd, yyyy')}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 p-4 bg-sky-50 rounded-lg">
                    <p className="text-sm text-gray-600">Total Duration</p>
                    <p className="text-lg font-semibold text-primary-600">{nights} nights</p>
                  </div>
                </div>

                {/* Guest Information */}
                <div className="card p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <HiUsers className="text-primary-600" />
                    Guest Information
                  </h2>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Adults</p>
                      <p className="text-2xl font-bold text-gray-900">{booking.adults}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Children</p>
                      <p className="text-2xl font-bold text-gray-900">{booking.children}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Infants</p>
                      <p className="text-2xl font-bold text-gray-900">{booking.infants}</p>
                    </div>
                  </div>
                  <div className="p-4 bg-sky-50 rounded-lg">
                    <p className="text-sm text-gray-600">Total Guests</p>
                    <p className="text-lg font-semibold text-primary-600">{booking.totalGuests}</p>
                  </div>
                </div>

                {/* Special Requests */}
                {booking.specialRequests && (
                  <div className="card p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Special Requests</h2>
                    <p className="text-gray-600">{booking.specialRequests}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="card p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Actions</h2>
                  <div className="flex gap-3">
                    {booking.status === 'confirmed' && (
                      <button
                        onClick={handleCancelBooking}
                        className="btn-outline border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                      >
                        Cancel Booking
                      </button>
                    )}
                    {booking.status === 'completed' && (
                      <Link
                        to={`/destinations/${booking.destination?.slug}`}
                        className="btn-primary"
                      >
                        Leave a Review
                      </Link>
                    )}
                  </div>
                </div>
              </div>

              {/* Sidebar - Pricing & Payment */}
              <div className="space-y-6">
                {/* Price Breakdown */}
                <div className="card p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <HiCreditCard className="text-primary-600" />
                    Price Details
                  </h2>
                  <div className="space-y-3">
                    <div className="flex justify-between text-gray-600">
                      <span>Base Price</span>
                      <span>${Number(booking.basePrice).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Taxes</span>
                      <span>${Number(booking.taxes).toFixed(2)}</span>
                    </div>
                    {booking.discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount</span>
                        <span>-${Number(booking.discount).toFixed(2)}</span>
                      </div>
                    )}
                    {booking.promoCode && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Promo Code</span>
                        <span className="badge badge-success">{booking.promoCode}</span>
                      </div>
                    )}
                    <div className="border-t pt-3 mt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-gray-900">Total</span>
                        <span className="text-2xl font-bold text-primary-600">
                          ${Number(booking.totalAmount).toFixed(2)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{booking.currency}</p>
                    </div>
                  </div>
                </div>

                {/* Payment Status */}
                <div className="card p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Status</h2>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Status</span>
                      <span className={`badge ${
                        booking.paymentStatus === 'success' ? 'badge-success' :
                        booking.paymentStatus === 'pending' ? 'badge-warning' :
                        booking.paymentStatus === 'failed' ? 'badge-danger' :
                        'badge-info'
                      }`}>
                        {booking.paymentStatus}
                      </span>
                    </div>
                    {booking.paymentMethod && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Method</span>
                        <span className="text-gray-900 capitalize">{booking.paymentMethod}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Booking Info */}
                <div className="card p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Booking Information</h2>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Booked on</span>
                      <span className="text-gray-900">
                        {format(new Date(booking.createdAt), 'MMM dd, yyyy')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last updated</span>
                      <span className="text-gray-900">
                        {format(new Date(booking.updatedAt), 'MMM dd, yyyy')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default BookingDetail;
