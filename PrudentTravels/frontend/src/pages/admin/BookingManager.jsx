import React, { useEffect, useState } from 'react';
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
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await api.get(apiEndpoints.bookings.getAll);
      setBookings(response.data.data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = bookings.filter(b => 
    filter === 'all' || b.status === filter
    </SidebarProvider>
  );

  return (
    <SidebarProvider>
    <div className="flex h-screen bg-sky-50">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Navbar title="Manage Bookings" />
        
        <main className="p-8">
          {/* Filters */}
          <div className="flex gap-4 mb-6">
            {['all', 'pending', 'confirmed', 'cancelled', 'completed'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-6 py-2 rounded-lg font-medium capitalize ${
                  filter === status
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-700'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Bookings Table */}
          {loading ? (
            <Loader />
          ) : (
            <div className="card overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-sky-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Booking ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Destination
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-sky-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        #{booking.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {booking.user?.firstName} {booking.user?.lastName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {booking.destination?.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {booking.checkInDate && format(new Date(booking.checkInDate), 'MMM dd, yyyy')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`badge ${
                          booking.status === 'confirmed' ? 'badge-success' :
                          booking.status === 'pending' ? 'badge-warning' :
                          'badge-danger'
                        }`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        ${booking.totalPrice}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
    </SidebarProvider>
  );
};

export default BookingManager;
