import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { HiTicket, HiClock, HiCheckCircle, HiExclamation } from 'react-icons/hi';
import Sidebar from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';
import api, { apiEndpoints } from '../../services/api';
import { SidebarProvider } from '../../contexts/SidebarContext';

const SupportDashboard = () => {
  const [stats, setStats] = useState({
    totalTickets: 0,
    openTickets: 0,
    inProgress: 0,
    resolved: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get(apiEndpoints.support.tickets.getAll);
      const tickets = response.data.data || [];
      setStats({
        totalTickets: tickets.length,
        openTickets: tickets.filter(t => t.status === 'open').length,
        inProgress: tickets.filter(t => t.status === 'in_progress').length,
        resolved: tickets.filter(t => t.status === 'resolved').length,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const statCards = [
    { icon: HiTicket, label: 'Total Tickets', value: stats.totalTickets, color: 'bg-blue-500' },
    { icon: HiClock, label: 'Open', value: stats.openTickets, color: 'bg-yellow-500' },
    { icon: HiExclamation, label: 'In Progress', value: stats.inProgress, color: 'bg-orange-500' },
    { icon: HiCheckCircle, label: 'Resolved', value: stats.resolved, color: 'bg-green-500' },
  ];

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-sky-50">
        <Sidebar />
        <div className="flex-1 overflow-auto">
          <Navbar title="Support Dashboard" />
        
        <main className="p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Support Dashboard</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((stat, index) => (
              <div key={index} className="card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`${stat.color} text-white p-4 rounded-lg`}>
                    <stat.icon className="text-2xl" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Link to="/support/tickets" className="card p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold mb-2">View All Tickets</h3>
              <p className="text-gray-600">Manage and respond to support tickets</p>
            </Link>
            <Link to="/support/live-chat" className="card p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold mb-2">Live Chat</h3>
              <p className="text-gray-600">Chat with customers in real-time</p>
            </Link>
          </div>
        </main>
      </div>
    </div>
    </SidebarProvider>
  );
};

export default SupportDashboard;
