import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { HiCalendar, HiUsers, HiClock } from 'react-icons/hi';
import Sidebar from '../../components/common/Sidebar';
import { SidebarProvider } from '../../contexts/SidebarContext';
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

  // Ensure bookings is always an array
  const safeBookings = Array.isArray(bookings) ? bookings : [];

  const filters = [
    { value: 'all', label: 'All Bookings', count: safeBookings.length },
    { value: 'upcoming', label: 'Upcoming', count: safeBookings.filter(b => b.status === 'confirmed').length },
    { value: 'past', label: 'Past', count: safeBookings.filter(b => b.status === 'completed').length },
    { value: 'cancelled', label: 'Cancelled', count: safeBookings.filter(b => b.status === 'cancelled').length },
  ];

  return (
    <SidebarProvider>
    <div className="flex h-screen bg-slate-900">
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
                className={`px-6 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${
                  filter === f.value
                    ? 'bg-slate-700 text-slate-100'
                    : 'bg-slate-800/50 text-slate-300 hover:bg-slate-800'
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
                  <div key={booking.id} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Destination Image */}
                      <img
                        src={booking.destination?.mainImage || 'https://via.placeholder.com/200'}
                        alt={booking.destination?.name}
                        className="w-full md:w-48 h-48 rounded-xl object-cover"
                      />

                      {/* Booking Details */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-2xl font-serif font-bold text-slate-100 mb-1">
                              {booking.destination?.name}
                            </h3>
                            <p className="text-slate-300">
                              {booking.destination?.city}, {booking.destination?.country}
                            </p>
                          </div>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            booking.status === 'confirmed' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                            booking.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' :
                            booking.status === 'completed' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                            'bg-red-500/20 text-red-300 border border-red-500/30'
                          }`}>
                            {booking.status}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="flex items-center gap-2 text-slate-300">
                            <HiCalendar className="text-slate-400" />
                            <div className="text-sm">
                              <p className="font-medium">Check-in</p>
                              <p className="text-slate-400">{format(new Date(booking.checkInDate), 'MMM dd, yyyy')}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-slate-300">
                            <HiCalendar className="text-slate-400" />
                            <div className="text-sm">
                              <p className="font-medium">Check-out</p>
                              <p className="text-slate-400">{format(new Date(booking.checkOutDate), 'MMM dd, yyyy')}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-slate-300">
                            <HiUsers className="text-slate-400" />
                            <div className="text-sm">
                              <p className="font-medium">Guests</p>
                              <p className="text-slate-400">{totalGuests} guests, {nights} nights</p>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3">
                          <Link
                            to={`/user/bookings/${booking.id}`}
                            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-100 font-medium rounded-lg transition-colors text-sm"
                          >
                            View Details
                          </Link>
                          {booking.status === 'confirmed' && (
                            <button
                              onClick={() => handleCancelBooking(booking.id)}
                              className="px-4 py-2 border border-red-500/50 text-red-300 hover:bg-red-500/20 rounded-lg transition-colors text-sm font-medium"
                            >
                              Cancel Booking
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <p className="text-sm text-slate-400 mb-1">Total Price</p>
                        <p className="text-3xl font-bold text-slate-100">
                          ${Number(booking.totalAmount).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-12 text-center">
              <HiClock className="mx-auto text-6xl text-slate-600 mb-4" />
              <h3 className="text-xl font-semibold text-slate-200 mb-2">
                No bookings found
              </h3>
              <p className="text-slate-400 mb-6">
                {filter === 'all'
                  ? "You haven't made any bookings yet"
                  : `No ${filter} bookings`}
              </p>
              <Link to="/destinations" className="inline-flex items-center px-6 py-3 bg-slate-700 hover:bg-slate-600 text-slate-100 font-semibold rounded-xl transition-colors">
                Browse Destinations
              </Link>
            </div>
          )}
        </main>
      </div>
    </div>
    </SidebarProvider>
  );
};

export default Bookings;
