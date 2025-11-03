import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import SearchBar from '../../components/destination/SearchBar';
import DestinationGrid from '../../components/destination/DestinationGrid';
import api, { apiEndpoints } from '../../services/api';
import { PAGINATION } from '../../utils/constants';

const Destinations = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    country: searchParams.get('country') || '',
  });

  useEffect(() => {
    fetchDestinations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, pagination.currentPage]);

  const fetchDestinations = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.currentPage,
        limit: PAGINATION.DEFAULT_LIMIT,
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value !== '')
        ),
      };

      console.log('[Destinations] Fetching with params:', params);
      const response = await api.get(apiEndpoints.destinations.getAll, { params });
      
      const destinations = response.data.data?.destinations || [];
      console.log('[Destinations] Received destinations:', destinations.length);
      
      // Log any destinations with missing id or slug
      destinations.forEach((dest, index) => {
        if (!dest.id && !dest.slug) {
          console.warn(`[Destinations] Destination at index ${index} is missing both id and slug:`, dest);
        }
      });
      
      setDestinations(destinations);
      setPagination(response.data.data?.pagination || pagination);
    } catch (error) {
      console.error('[Destinations] Error fetching destinations:', error);
      console.error('[Destinations] Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setFilters({ ...filters, search: query });
    updateSearchParams({ ...filters, search: query });
  };

  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
    updateSearchParams({ ...filters, ...newFilters });
  };

  const updateSearchParams = (newFilters) => {
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    setSearchParams(params);
  };

  return (
    <div className="min-h-screen bg-sky-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-16">
        <div className="container-custom section-padding text-center">
          <h1 className="text-5xl font-bold mb-4">Explore Destinations</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Discover amazing places around the world for your next adventure
          </p>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="container-custom section-padding py-8">
        <SearchBar
          onSearch={handleSearch}
          onFilterChange={handleFilterChange}
          initialFilters={filters}
        />
      </section>

      {/* Results */}
      <section className="container-custom section-padding pb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {loading ? 'Loading...' : `${pagination.totalItems} Destinations Found`}
          </h2>
          {/* Sort dropdown could go here */}
        </div>

        <DestinationGrid
          destinations={destinations}
          loading={loading}
          emptyMessage="No destinations match your search criteria"
        />

        {/* Pagination */}
        {!loading && pagination.totalPages > 1 && (
          <div className="flex justify-center mt-8 gap-2">
            <button
              onClick={() => setPagination({ ...pagination, currentPage: pagination.currentPage - 1 })}
              disabled={pagination.currentPage === 1}
              className="btn-ghost px-4 py-2 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-gray-700">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            <button
              onClick={() => setPagination({ ...pagination, currentPage: pagination.currentPage + 1 })}
              disabled={pagination.currentPage === pagination.totalPages}
              className="btn-ghost px-4 py-2 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default Destinations;
