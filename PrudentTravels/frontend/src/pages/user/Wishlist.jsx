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
    <div className="flex h-screen bg-slate-900">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Navbar title="My Wishlist" />

        <main className="p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-serif font-bold text-slate-100 mb-2">
              Saved Destinations
            </h2>
            <p className="text-slate-300">
              {wishlistItems.length} {wishlistItems.length === 1 ? 'destination' : 'destinations'} saved
            </p>
          </div>

          {!loading && wishlistItems.length === 0 ? (
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-12 text-center">
              <HiHeart className="mx-auto text-6xl text-slate-600 mb-4" />
              <h3 className="text-xl font-semibold text-slate-200 mb-2">
                Your wishlist is empty
              </h3>
              <p className="text-slate-400 mb-6">
                Start adding destinations you'd like to visit
              </p>
              <a href="/destinations" className="inline-flex items-center px-6 py-3 bg-slate-700 hover:bg-slate-600 text-slate-100 font-semibold rounded-xl transition-colors">
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
