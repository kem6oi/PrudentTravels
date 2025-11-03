import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/common/Sidebar';
import { SidebarProvider } from '../../contexts/SidebarContext';
import Navbar from '../../components/common/Navbar';
import Loader from '../../components/common/Loader';
import { format } from 'date-fns';
import api, { apiEndpoints } from '../../services/api';

const TicketList = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await api.get(apiEndpoints.support.tickets.getAll);
      setTickets(response.data.data || []);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTickets = tickets.filter(t => 
    filter === 'all' || t.status === filter
    </SidebarProvider>
  );

  return (
    <SidebarProvider>
    <div className="flex h-screen bg-sky-50">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Navbar title="Support Tickets" />
        
        <main className="p-8">
          <div className="flex gap-4 mb-6">
            {['all', 'open', 'in_progress', 'resolved', 'closed'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-6 py-2 rounded-lg font-medium capitalize ${
                  filter === status ? 'bg-primary-600 text-white' : 'bg-white text-gray-700'
                }`}
              >
                {status.replace('_', ' ')}
              </button>
            ))}
          </div>

          {loading ? (
            <Loader />
          ) : (
            <div className="card overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-sky-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Ticket ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Subject
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Priority
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Created
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTickets.map((ticket) => (
                    <tr key={ticket.id} className="hover:bg-sky-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link to={`/support/tickets/${ticket.id}`} className="text-primary-600 hover:underline">
                          #{ticket.id}
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{ticket.subject}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {ticket.user?.firstName} {ticket.user?.lastName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`badge ${
                          ticket.priority === 'urgent' ? 'badge-danger' :
                          ticket.priority === 'high' ? 'badge-warning' :
                          'badge-info'
                        }`}>
                          {ticket.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`badge ${
                          ticket.status === 'open' ? 'badge-warning' :
                          ticket.status === 'in_progress' ? 'badge-info' :
                          'badge-success'
                        }`}>
                          {ticket.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {ticket.createdAt && format(new Date(ticket.createdAt), 'MMM dd, yyyy')}
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

export default TicketList;
