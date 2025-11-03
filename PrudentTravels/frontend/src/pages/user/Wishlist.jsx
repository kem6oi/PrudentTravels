import React, { useEffect, useState } from 'react';
import { HiHeart } from 'react-icons/hi';
import Sidebar from '../../components/common/Sidebar';
import { SidebarProvider } from '../../contexts/SidebarContext';
import Navbar from '../../components/common/Navbar';
import DestinationGrid from '../../components/destination/DestinationGrid';
import api, { apiEndpoints } from '../../services/api';
import toast from 'react-hot-toast';

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const response = await api.get(apiEndpoints.wishlist.get);
      setWishlistItems(response.data.data || []);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      toast.error('Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SidebarProvider>
    <div className="flex h-screen bg-sky-50">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Navbar title="My Wishlist" />
        
        <main className="p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Saved Destinations
            </h2>
            <p className="text-gray-600">
              {wishlistItems.length} {wishlistItems.length === 1 ? 'destination' : 'destinations'} saved
            </p>
          </div>

          {!loading && wishlistItems.length === 0 ? (
            <div className="card p-12 text-center">
              <HiHeart className="mx-auto text-6xl text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Your wishlist is empty
              </h3>
              <p className="text-gray-600 mb-6">
                Start adding destinations you'd like to visit
              </p>
              <a href="/destinations" className="btn-primary">
                Browse Destinations
              </a>
            </div>
          ) : (
            <DestinationGrid
              destinations={wishlistItems}
              loading={loading}
              columns={3}
            />
          )}
        </main>
      </div>
    </div>
    </SidebarProvider>
  );
};

export default Wishlist;
