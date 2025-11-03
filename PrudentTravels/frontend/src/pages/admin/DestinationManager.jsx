import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { HiPlus, HiPencil, HiTrash, HiSearch } from 'react-icons/hi';
import Sidebar from '../../components/common/Sidebar';
import { SidebarProvider } from '../../contexts/SidebarContext';
import Navbar from '../../components/common/Navbar';
import Loader from '../../components/common/Loader';
import api, { apiEndpoints } from '../../services/api';
import toast from 'react-hot-toast';

const DestinationManager = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    try {
      // Fetch all destinations (active and inactive) for admin view
      const response = await api.get(apiEndpoints.destinations.getAll, {
        params: { active: 'all' }
      });
      setDestinations(response.data.data?.destinations || []);
    } catch (error) {
      console.error('Error fetching destinations:', error);
      toast.error('Failed to load destinations');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this destination?')) {
      return;
    }

    try {
      await api.delete(apiEndpoints.destinations.delete(id));
      toast.success('Destination deleted successfully');
      fetchDestinations();
    } catch (error) {
      toast.error('Failed to delete destination');
    }
  };

  const safeDestinations = Array.isArray(destinations) ? destinations : [];
  const filteredDestinations = safeDestinations.filter(dest =>
    dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dest.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SidebarProvider>
    <div className="flex h-screen bg-sky-50">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Navbar title="Manage Destinations" />
        
        <main className="p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex-1 max-w-md relative">
              <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search destinations..."
                className="input-field pl-10"
              />
            </div>
            <Link to="/admin/destinations/add" className="btn-primary flex items-center gap-2">
              <HiPlus />
              Add Destination
            </Link>
          </div>

          {/* Destinations Table */}
          {loading ? (
            <Loader />
          ) : (
            <div className="card overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-sky-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Destination
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredDestinations.map((destination) => (
                    <tr key={destination.id} className="hover:bg-sky-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            src={destination.mainImage || 'https://via.placeholder.com/50'}
                            alt={destination.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {destination.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {destination.city}, {destination.country}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          ${destination.price}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`badge ${
                          destination.isActive ? 'badge-success' : 'badge-danger'
                        }`}>
                          {destination.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link
                          to={`/admin/destinations/edit/${destination.id}`}
                          className="text-primary-600 hover:text-primary-900 mr-4"
                        >
                          <HiPencil className="inline w-5 h-5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(destination.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <HiTrash className="inline w-5 h-5" />
                        </button>
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

export default DestinationManager;
