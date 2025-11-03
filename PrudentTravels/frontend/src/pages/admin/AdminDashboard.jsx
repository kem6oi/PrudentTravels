import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { HiUsers, HiGlobe, HiCalendar, HiCurrencyDollar } from 'react-icons/hi';
import Sidebar from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import api, { apiEndpoints } from '../../services/api';
import { SidebarProvider } from '../../contexts/SidebarContext';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDestinations: 0,
    totalBookings: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get(apiEndpoints.admin.dashboard);
      setStats(response.data.data || stats);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const statCards = [
    {
      icon: HiUsers,
      label: 'Total Users',
      value: stats.totalUsers,
      color: 'bg-blue-500',
      link: '/admin/users',
    },
    {
      icon: HiGlobe,
      label: 'Destinations',
      value: stats.totalDestinations,
      color: 'bg-green-500',
      link: '/admin/destinations',
    },
    {
      icon: HiCalendar,
      label: 'Bookings',
      value: stats.totalBookings,
      color: 'bg-purple-500',
      link: '/admin/bookings',
    },
    {
      icon: HiCurrencyDollar,
      label: 'Revenue',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      color: 'bg-yellow-500',
      link: '/admin/analytics',
    },
  ];

  const revenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue',
        data: [12000, 19000, 15000, 25000, 22000, 30000],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const bookingsData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Bookings',
        data: [12, 19, 15, 25, 22, 30, 28],
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
      },
    ],
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-sky-50">
        <Sidebar />
        <div className="flex-1 overflow-auto">
          <Navbar title="Admin Dashboard" />
        
        <main className="p-8">
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

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="card p-6">
              <h3 className="text-xl font-bold mb-4">Revenue Overview</h3>
              <Line data={revenueData} options={{ responsive: true }} />
            </div>
            <div className="card p-6">
              <h3 className="text-xl font-bold mb-4">Weekly Bookings</h3>
              <Bar data={bookingsData} options={{ responsive: true }} />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card p-6">
            <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link to="/admin/destinations/add" className="btn-primary text-center">
                Add New Destination
              </Link>
              <Link to="/admin/promos" className="btn-primary text-center">
                Manage Promo Codes
              </Link>
              <Link to="/admin/users" className="btn-primary text-center">
                View All Users
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;
