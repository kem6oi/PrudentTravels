import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaShare } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import ImageGallery from '../../components/destination/ImageGallery';
import DestinationDetail from '../../components/destination/DestinationDetail';
import ReviewCard from '../../components/reviews/ReviewCard';
import Loader from '../../components/common/Loader';
import api, { apiEndpoints } from '../../services/api';
import toast from 'react-hot-toast';

const DestinationDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [destination, setDestination] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    fetchDestination();
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchDestination = async () => {
    try {
      const response = await api.get(apiEndpoints.destinations.getOne(id));
      setDestination(response.data.data);
    } catch (error) {
      console.error('Error fetching destination:', error);
      toast.error('Failed to load destination');
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await api.get(`${apiEndpoints.reviews.getAll}?destinationId=${id}`);
      setReviews(response.data.data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const handleBookNow = () => {
    if (!isAuthenticated) {
      toast.error('Please login to book');
      navigate('/login');
      return;
    }
    navigate(`/booking/${id}`);
  };

  const handleWishlist = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add to wishlist');
      return;
    }
    // Toggle wishlist
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: destination?.name,
        text: destination?.shortDescription,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <Loader fullScreen />
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container-custom section-padding py-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Destination Not Found</h2>
          <button onClick={() => navigate('/destinations')} className="btn-primary">
            Back to Destinations
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const images = [
    destination.mainImage,
    ...(destination.additionalImages || []),
  ].filter(Boolean);

  return (
    <div className="min-h-screen bg-sky-50">
      <Header />

      <div className="container-custom section-padding py-8">
        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mb-4">
          <button
            onClick={handleWishlist}
            className="btn-ghost flex items-center gap-2"
          >
            {isWishlisted ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
            {isWishlisted ? 'Saved' : 'Save'}
          </button>
          <button onClick={handleShare} className="btn-ghost flex items-center gap-2">
            <FaShare />
            Share
          </button>
        </div>

        {/* Image Gallery */}
        <ImageGallery images={images} title={destination.name} />

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Left Column - Details */}
          <div className="lg:col-span-2">
            <DestinationDetail destination={destination} />

            {/* Reviews Section */}
            <div className="mt-12">
              <h2 className="text-3xl font-bold mb-6">Reviews</h2>
              {reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No reviews yet. Be the first to review!</p>
              )}
            </div>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="card p-6">
                <div className="mb-6">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-3xl font-bold text-primary-600">
                      ${destination.price}
                    </span>
                    <span className="text-gray-600">per person</span>
                  </div>
                  {destination.originalPrice && (
                    <p className="text-sm text-gray-500 line-through">
                      ${destination.originalPrice}
                    </p>
                  )}
                </div>

                <button
                  onClick={handleBookNow}
                  className="w-full btn-primary py-3 text-lg mb-4"
                >
                  Book Now
                </button>

                <p className="text-center text-sm text-gray-500">
                  You won't be charged yet
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default DestinationDetailPage;
