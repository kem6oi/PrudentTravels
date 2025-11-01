import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';
import Loader from '../../components/common/Loader';
import { format } from 'date-fns';
import api, { apiEndpoints } from '../../services/api';
import toast from 'react-hot-toast';

const TicketDetail = () => {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reply, setReply] = useState('');

  useEffect(() => {
    fetchTicket();
  }, [id]);

  const fetchTicket = async () => {
    try {
      const response = await api.get(apiEndpoints.support.tickets.getOne(id));
      setTicket(response.data.data);
    } catch (error) {
      console.error('Error fetching ticket:', error);
      toast.error('Failed to load ticket');
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (e) => {
    e.preventDefault();
    try {
      await api.post(`${apiEndpoints.support.tickets.getOne(id)}/reply`, {
        message: reply,
      });
      toast.success('Reply sent successfully');
      setReply('');
      fetchTicket();
    } catch (error) {
      toast.error('Failed to send reply');
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1">
          <Navbar title="Ticket Details" />
          <Loader fullScreen />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Navbar title={`Ticket #${ticket?.id}`} />
        
        <main className="p-8">
          <div className="max-w-4xl mx-auto">
            {/* Ticket Header */}
            <div className="card p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {ticket?.subject}
                  </h1>
                  <p className="text-gray-600">
                    By {ticket?.user?.firstName} {ticket?.user?.lastName} •{' '}
                    {ticket?.createdAt && format(new Date(ticket.createdAt), 'MMM dd, yyyy HH:mm')}
                  </p>
                </div>
                <div className="flex gap-2">
                  <span className={`badge ${
                    ticket?.priority === 'urgent' ? 'badge-danger' :
                    ticket?.priority === 'high' ? 'badge-warning' :
                    'badge-info'
                  }`}>
                    {ticket?.priority}
                  </span>
                  <span className={`badge ${
                    ticket?.status === 'open' ? 'badge-warning' :
                    ticket?.status === 'in_progress' ? 'badge-info' :
                    'badge-success'
                  }`}>
                    {ticket?.status?.replace('_', ' ')}
                  </span>
                </div>
              </div>
              <p className="text-gray-700">{ticket?.message}</p>
            </div>

            {/* Reply Form */}
            <div className="card p-6">
              <h3 className="text-lg font-bold mb-4">Reply to Ticket</h3>
              <form onSubmit={handleReply}>
                <textarea
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  rows="4"
                  className="input-field resize-none mb-4"
                  placeholder="Type your reply..."
                  required
                />
                <button type="submit" className="btn-primary">
                  Send Reply
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TicketDetail;
