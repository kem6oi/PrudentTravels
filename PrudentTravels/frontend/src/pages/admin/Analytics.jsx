import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/common/Sidebar';
import { SidebarProvider } from '../../contexts/SidebarContext';
import Navbar from '../../components/common/Navbar';
import Loader from '../../components/common/Loader';
import { Line, Bar, Pie } from 'react-chartjs-2';
import api, { apiEndpoints } from '../../services/api';
import toast from 'react-hot-toast';

const Analytics = () => {
  const [dateRange, setDateRange] = useState('30days');
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [revenueAnalytics, setRevenueAnalytics] = useState([]);
  const [popularDestinations, setPopularDestinations] = useState([]);

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      // Fetch multiple analytics endpoints in parallel
      const [dashboardRes, revenueRes, popularDestRes] = await Promise.all([
        api.get(apiEndpoints.admin.dashboard),
        api.get('/admin/analytics/revenue', { params: { period: 'month' } }),
        api.get('/admin/analytics/popular-destinations', { params: { limit: 5 } })
      ]);

      setAnalyticsData(dashboardRes.data.data);
      setRevenueAnalytics(revenueRes.data.data || []);
      setPopularDestinations(popularDestRes.data.data || []);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  // Prepare chart data from real backend data
  const revenueData = {
    labels: revenueAnalytics.map(r => r.period || 'N/A'),
    datasets: [
      {
        label: 'Revenue',
        data: revenueAnalytics.map(r => parseFloat(r.revenue) || 0),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const destinationData = {
    labels: popularDestinations.map(d => d.name || 'Unknown'),
    datasets: [
      {
        label: 'Bookings',
        data: popularDestinations.map(d => parseInt(d.bookingCount) || 0),
        backgroundColor: [
          'rgba(59, 130, 246, 0.5)',
          'rgba(16, 185, 129, 0.5)',
          'rgba(251, 191, 36, 0.5)',
          'rgba(239, 68, 68, 0.5)',
          'rgba(139, 92, 246, 0.5)',
        ],
      },
    ],
  };

  const bookingStatusData = {
    labels: ['Pending', 'Confirmed', 'Completed'],
    datasets: [
      {
        label: 'Bookings by Status',
        data: [
          analyticsData?.bookings?.pending || 0,
          analyticsData?.bookings?.confirmed || 0,
          analyticsData?.bookings?.completed || 0,
        ],
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
      },
    ],
  };

  if (loading) {
    return (
      <SidebarProvider>
        <div className="flex h-screen bg-sky-50">
          <Sidebar />
          <div className="flex-1 overflow-auto">
            <Navbar title="Analytics" />
            <main className="p-8">
              <Loader />
            </main>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
    <div className="flex h-screen bg-sky-50">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Navbar title="Analytics" />
        
        <main className="p-8">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="card p-6">
              <p className="text-gray-600 text-sm mb-1">Total Users</p>
              <p className="text-3xl font-bold text-gray-900">{analyticsData?.users?.total || 0}</p>
              <p className="text-sm text-gray-500 mt-1">{analyticsData?.users?.active || 0} active</p>
            </div>
            <div className="card p-6">
              <p className="text-gray-600 text-sm mb-1">Total Bookings</p>
              <p className="text-3xl font-bold text-gray-900">{analyticsData?.bookings?.total || 0}</p>
              <p className="text-sm text-gray-500 mt-1">{analyticsData?.bookings?.pending || 0} pending</p>
            </div>
            <div className="card p-6">
              <p className="text-gray-600 text-sm mb-1">Total Destinations</p>
              <p className="text-3xl font-bold text-gray-900">{analyticsData?.destinations?.total || 0}</p>
              <p className="text-sm text-gray-500 mt-1">{analyticsData?.destinations?.active || 0} active</p>
            </div>
            <div className="card p-6">
              <p className="text-gray-600 text-sm mb-1">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-900">${(analyticsData?.revenue?.total || 0).toLocaleString()}</p>
              <p className="text-sm text-gray-500 mt-1">This month: ${(analyticsData?.revenue?.thisMonth || 0).toLocaleString()}</p>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="space-y-6">
            <div className="card p-6">
              <h3 className="text-xl font-bold mb-4">Revenue Trends (Monthly)</h3>
              {revenueAnalytics.length > 0 ? (
                <Line data={revenueData} options={{ responsive: true, maintainAspectRatio: true }} />
              ) : (
                <p className="text-gray-500 text-center py-8">No revenue data available</p>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="card p-6">
                <h3 className="text-xl font-bold mb-4">Popular Destinations</h3>
                {popularDestinations.length > 0 ? (
                  <Pie data={destinationData} options={{ responsive: true }} />
                ) : (
                  <p className="text-gray-500 text-center py-8">No destination data available</p>
                )}
              </div>
              <div className="card p-6">
                <h3 className="text-xl font-bold mb-4">Bookings by Status</h3>
                <Bar data={bookingStatusData} options={{ responsive: true }} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
    </SidebarProvider>
  );
};

export default Analytics;
