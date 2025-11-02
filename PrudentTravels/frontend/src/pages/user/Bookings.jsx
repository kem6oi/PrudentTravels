import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { HiCalendar, HiUsers, HiClock } from 'react-icons/hi';
import Sidebar from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';
import Loader from '../../components/common/Loader';
import api, { apiEndpoints } from '../../services/api';
import { format, differenceInDays } from 'date-fns';
import toast from 'react-hot-toast';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, upcoming, past, cancelled

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await api.get(apiEndpoints.bookings.myBookings);
      setBookings(response.data.data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      await api.put(apiEndpoints.bookings.cancel(bookingId));
      toast.success('Booking cancelled successfully');
      fetchBookings();
    } catch (error) {
      toast.error('Failed to cancel booking');
    }
  };

  const getFilteredBookings = () => {
    const now = new Date();
    switch (filter) {
      case 'upcoming':
        return bookings.filter(b => b.status === 'confirmed' && new Date(b.checkInDate) > now);
      case 'past':
        return bookings.filter(b => b.status === 'completed' || new Date(b.checkOutDate) < now);
      case 'cancelled':
        return bookings.filter(b => b.status === 'cancelled');
      default:
        return bookings;
    }
  };

  const filteredBookings = getFilteredBookings();

  const filters = [
    { value: 'all', label: 'All Bookings', count: bookings.length },
    { value: 'upcoming', label: 'Upcoming', count: bookings.filter(b => b.status === 'confirmed').length },
    { value: 'past', label: 'Past', count: bookings.filter(b => b.status === 'completed').length },
    { value: 'cancelled', label: 'Cancelled', count: bookings.filter(b => b.status === 'cancelled').length },
  ];

  return (
    <div className="flex h-screen bg-sky-50">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Navbar title="My Bookings" />
        
        <main className="p-8">
          {/* Filter Tabs */}
          <div className="flex gap-4 mb-6 overflow-x-auto">
            {filters.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`px-6 py-3 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  filter === f.value
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {f.label} ({f.count})
              </button>
            ))}
          </div>

          {/* Bookings List */}
          {loading ? (
            <Loader />
          ) : filteredBookings.length > 0 ? (
            <div className="space-y-4">
              {filteredBookings.map((booking) => {
                const nights = differenceInDays(
                  new Date(booking.checkOutDate),
                  new Date(booking.checkInDate)
                );
                const totalGuests = (booking.adults || 0) + (booking.children || 0) + (booking.infants || 0);

                return (
                  <div key={booking.id} className="card p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Destination Image */}
                      <img
                        src={booking.destination?.mainImage || 'https://via.placeholder.com/200'}
                        alt={booking.destination?.name}
                        className="w-full md:w-48 h-48 rounded-lg object-cover"
                      />

                      {/* Booking Details */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-1">
                              {booking.destination?.name}
                            </h3>
                            <p className="text-gray-600">
                              {booking.destination?.city}, {booking.destination?.country}
                            </p>
                          </div>
                          <span className={`badge ${
                            booking.status === 'confirmed' ? 'badge-success' :
                            booking.status === 'pending' ? 'badge-warning' :
                            booking.status === 'completed' ? 'badge-info' :
                            'badge-danger'
                          }`}>
                            {booking.status}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="flex items-center gap-2 text-gray-600">
                            <HiCalendar className="text-primary-600" />
                            <div className="text-sm">
                              <p className="font-medium">Check-in</p>
                              <p>{format(new Date(booking.checkInDate), 'MMM dd, yyyy')}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <HiCalendar className="text-primary-600" />
                            <div className="text-sm">
                              <p className="font-medium">Check-out</p>
                              <p>{format(new Date(booking.checkOutDate), 'MMM dd, yyyy')}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <HiUsers className="text-primary-600" />
                            <div className="text-sm">
                              <p className="font-medium">Guests</p>
                              <p>{totalGuests} guests, {nights} nights</p>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3">
                          <Link
                            to={`/user/bookings/${booking.id}`}
                            className="btn-primary text-sm"
                          >
                            View Details
                          </Link>
                          {booking.status === 'confirmed' && (
                            <button
                              onClick={() => handleCancelBooking(booking.id)}
                              className="btn-outline text-sm border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                            >
                              Cancel Booking
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <p className="text-sm text-gray-600 mb-1">Total Price</p>
                        <p className="text-3xl font-bold text-primary-600">
                          ${booking.totalPrice}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="card p-12 text-center">
              <HiClock className="mx-auto text-6xl text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No bookings found
              </h3>
              <p className="text-gray-600 mb-6">
                {filter === 'all' 
                  ? "You haven't made any bookings yet"
                  : `No ${filter} bookings`}
              </p>
              <Link to="/destinations" className="btn-primary">
                Browse Destinations
              </Link>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Bookings;
