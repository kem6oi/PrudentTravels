import React, { useState } from 'react';
import Sidebar from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';
import { Line, Bar, Pie } from 'react-chartjs-2';

const Analytics = () => {
  const [dateRange, setDateRange] = useState('7days');

  const revenueData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Revenue',
        data: [45000, 52000, 48000, 61000],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
      },
    ],
  };

  const destinationData = {
    labels: ['Beach', 'Mountain', 'City', 'Cultural', 'Adventure'],
    datasets: [
      {
        label: 'Bookings by Category',
        data: [300, 250, 180, 150, 220],
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

  const userGrowthData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'New Users',
        data: [120, 190, 150, 250, 220, 300],
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
      },
    ],
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Navbar title="Analytics" />
        
        <main className="p-8">
          {/* Date Range Selector */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Analytics Overview</h2>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="input-field w-48"
            >
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
              <option value="year">This Year</option>
            </select>
          </div>

          {/* Charts Grid */}
          <div className="space-y-6">
            <div className="card p-6">
              <h3 className="text-xl font-bold mb-4">Revenue Trends</h3>
              <Line data={revenueData} options={{ responsive: true, maintainAspectRatio: true }} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="card p-6">
                <h3 className="text-xl font-bold mb-4">Bookings by Category</h3>
                <Pie data={destinationData} options={{ responsive: true }} />
              </div>
              <div className="card p-6">
                <h3 className="text-xl font-bold mb-4">User Growth</h3>
                <Bar data={userGrowthData} options={{ responsive: true }} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Analytics;
