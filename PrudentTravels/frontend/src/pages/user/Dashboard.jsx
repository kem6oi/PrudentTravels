import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { HiCalendar, HiHeart, HiStar } from 'react-icons/hi';
import { FaPlane } from 'react-icons/fa';
import Sidebar from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';
import api, { apiEndpoints } from '../../services/api';
import { format } from 'date-fns';

const Dashboard = () => {
  const user = useSelector((state) => state.auth.user);
  const [stats, setStats] = useState({
    totalBookings: 0,
    upcomingTrips: 0,
    wishlistItems: 0,
    reviews: 0,
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [bookingsRes] = await Promise.all([
        api.get(apiEndpoints.bookings.myBookings),
      ]);

      const bookings = bookingsRes.data.data || [];
      const upcoming = bookings.filter(b => b.status === 'confirmed' && new Date(b.checkInDate) > new Date());
      
      setStats({
        totalBookings: bookings.length,
        upcomingTrips: upcoming.length,
        wishlistItems: 0, // Would fetch from wishlist API
        reviews: 0, // Would fetch from reviews API
      });
      
      setRecentBookings(bookings.slice(0, 3));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      icon: HiCalendar,
      label: 'Total Bookings',
      value: stats.totalBookings,
      color: 'bg-blue-500',
      link: '/user/bookings',
    },
    {
      icon: FaPlane,
      label: 'Upcoming Trips',
      value: stats.upcomingTrips,
      color: 'bg-green-500',
      link: '/user/bookings',
    },
    {
      icon: HiHeart,
      label: 'Wishlist',
      value: stats.wishlistItems,
      color: 'bg-red-500',
      link: '/user/wishlist',
    },
    {
      icon: HiStar,
      label: 'Reviews',
      value: stats.reviews,
      color: 'bg-yellow-500',
      link: '/user/reviews',
    },
  ];

  return (
    <div className="flex h-screen bg-sky-50">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Navbar title="Dashboard" />
        
        <main className="p-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {user?.firstName}!
            </h1>
            <p className="text-gray-600">
              Here's what's happening with your travels
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((stat, index) => (
              <Link
                key={index}
                to={stat.link}
                className="card p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`${stat.color} text-white p-4 rounded-lg`}>
                    <stat.icon className="text-2xl" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Recent Bookings */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Recent Bookings</h2>
              <Link to="/user/bookings" className="text-primary-600 hover:text-primary-700 font-medium">
                View All
              </Link>
            </div>

            {loading ? (
              <p className="text-gray-600 text-center py-8">Loading...</p>
            ) : recentBookings.length > 0 ? (
              <div className="space-y-4">
                {recentBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={booking.destination?.mainImage || 'https://via.placeholder.com/80'}
                        alt={booking.destination?.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {booking.destination?.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {booking.checkInDate && format(new Date(booking.checkInDate), 'MMM dd, yyyy')}
                        </p>
                        <span className={`badge ${
                          booking.status === 'confirmed' ? 'badge-success' :
                          booking.status === 'pending' ? 'badge-warning' :
                          'badge-danger'
                        }`}>
                          {booking.status}
                        </span>
                      </div>
                    </div>
                    <Link
                      to={`/user/bookings/${booking.id}`}
                      className="btn-primary text-sm"
                    >
                      View Details
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FaPlane className="mx-auto text-6xl text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No bookings yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Start exploring amazing destinations
                </p>
                <Link to="/destinations" className="btn-primary">
                  Browse Destinations
                </Link>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
