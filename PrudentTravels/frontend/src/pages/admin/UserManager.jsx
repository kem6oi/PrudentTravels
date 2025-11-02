import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';
import Loader from '../../components/common/Loader';
import api, { apiEndpoints } from '../../services/api';
import toast from 'react-hot-toast';
import { FaBan, FaCheck } from 'react-icons/fa';

const UserManager = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [suspensionReason, setSuspensionReason] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get(apiEndpoints.admin.users.getAll);
      setUsers(response.data.data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleSuspend = async (userId) => {
    if (!suspensionReason.trim()) {
      toast.error('Please provide a reason for suspension');
      return;
    }

    setActionLoading(userId);
    try {
      await api.put(`/admin/users/${userId}/suspend`, {
        reason: suspensionReason
      });
      toast.success('User account suspended successfully');
      setShowSuspendModal(false);
      setSelectedUser(null);
      setSuspensionReason('');
      fetchUsers();
    } catch (error) {
      console.error('Error suspending user:', error);
      toast.error(error.response?.data?.message || 'Failed to suspend user');
    } finally {
      setActionLoading(null);
    }
  };

  const handleUnsuspend = async (userId) => {
    if (!window.confirm('Are you sure you want to unsuspend this user?')) {
      return;
    }

    setActionLoading(userId);
    try {
      await api.put(`/admin/users/${userId}/unsuspend`);
      toast.success('User account unsuspended successfully');
      fetchUsers();
    } catch (error) {
      console.error('Error unsuspending user:', error);
      toast.error(error.response?.data?.message || 'Failed to unsuspend user');
    } finally {
      setActionLoading(null);
    }
  };

  const openSuspendModal = (user) => {
    setSelectedUser(user);
    setShowSuspendModal(true);
  };

  const closeSuspendModal = () => {
    setShowSuspendModal(false);
    setSelectedUser(null);
    setSuspensionReason('');
  };

  const getStatusBadge = (user) => {
    if (user.isSuspended) {
      return <span className="badge bg-red-100 text-red-800">Suspended</span>;
    }
    if (!user.isActive) {
      return <span className="badge bg-gray-100 text-gray-800">Inactive</span>;
    }
    return <span className="badge bg-green-100 text-green-800">Active</span>;
  };

  return (
    <div className="flex h-screen bg-sky-50">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Navbar title="Manage Users" />
        
        <main className="p-8">
          {loading ? (
            <Loader />
          ) : (
            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-sky-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-sky-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="badge badge-info capitalize">
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(user)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            {user.role !== 'admin' && (
                              <>
                                {user.isSuspended ? (
                                  <button
                                    onClick={() => handleUnsuspend(user.id)}
                                    disabled={actionLoading === user.id}
                                    className="text-green-600 hover:text-green-900 p-2 rounded hover:bg-green-50"
                                    title="Unsuspend user"
                                  >
                                    <FaCheck />
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => openSuspendModal(user)}
                                    disabled={actionLoading === user.id}
                                    className="text-red-600 hover:text-red-900 p-2 rounded hover:bg-red-50"
                                    title="Suspend user"
                                  >
                                    <FaBan />
                                  </button>
                                )}
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Suspension Modal */}
      {showSuspendModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Suspend User Account
            </h3>
            <p className="text-gray-600 mb-4">
              You are about to suspend <strong>{selectedUser.firstName} {selectedUser.lastName}</strong>'s account.
              {selectedUser.role === 'traveler' && ' They will receive an email notification.'}
            </p>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for suspension *
              </label>
              <textarea
                value={suspensionReason}
                onChange={(e) => setSuspensionReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                rows="4"
                placeholder="Enter the reason for suspension..."
                required
              />
            </div>
            <div className="flex space-x-3">
              <button
                onClick={closeSuspendModal}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-sky-50"
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button
                onClick={() => handleSuspend(selectedUser.id)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                disabled={actionLoading || !suspensionReason.trim()}
              >
                {actionLoading ? 'Suspending...' : 'Suspend Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManager;
