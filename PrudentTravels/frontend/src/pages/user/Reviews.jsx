import React, { useEffect, useState } from 'react';
import { HiStar } from 'react-icons/hi';
import Sidebar from '../../components/common/Sidebar';
import { SidebarProvider } from '../../contexts/SidebarContext';
import Navbar from '../../components/common/Navbar';
import ReviewCard from '../../components/reviews/ReviewCard';
import Modal from '../../components/common/Modal';
import ReviewForm from '../../components/reviews/ReviewForm';
import Loader from '../../components/common/Loader';
import api, { apiEndpoints } from '../../services/api';
import toast from 'react-hot-toast';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingReview, setEditingReview] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await api.get(`${apiEndpoints.reviews.getAll}?myReviews=true`);
      setReviews(response.data.data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
    setShowEditModal(true);
  };

  const handleUpdateReview = async (data) => {
    try {
      await api.put(apiEndpoints.reviews.update(editingReview.id), data);
      toast.success('Review updated successfully');
      setShowEditModal(false);
      setEditingReview(null);
      fetchReviews();
    } catch (error) {
      toast.error('Failed to update review');
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) {
      return;
    }

    try {
      await api.delete(apiEndpoints.reviews.delete(reviewId));
      toast.success('Review deleted successfully');
      fetchReviews();
    } catch (error) {
      toast.error('Failed to delete review');
    }
  };

  return (
    <SidebarProvider>
    <div className="flex h-screen bg-sky-50">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Navbar title="My Reviews" />
        
        <main className="p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Your Reviews
            </h2>
            <p className="text-gray-600">
              {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'} written
            </p>
          </div>

          {loading ? (
            <Loader />
          ) : reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((review) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  showActions
                  onEdit={handleEditReview}
                  onDelete={handleDeleteReview}
                />
              ))}
            </div>
          ) : (
            <div className="card p-12 text-center">
              <HiStar className="mx-auto text-6xl text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No reviews yet
              </h3>
              <p className="text-gray-600 mb-6">
                Share your travel experiences with others
              </p>
              <a href="/user/bookings" className="btn-primary">
                View My Bookings
              </a>
            </div>
          )}

          {/* Edit Review Modal */}
          <Modal
            isOpen={showEditModal}
            onClose={() => {
              setShowEditModal(false);
              setEditingReview(null);
            }}
            title="Edit Review"
            size="large"
          >
            {editingReview && (
              <ReviewForm
                initialData={editingReview}
                onSubmit={handleUpdateReview}
                onCancel={() => {
                  setShowEditModal(false);
                  setEditingReview(null);
                }}
              />
            )}
          </Modal>
        </main>
      </div>
    </div>
    </SidebarProvider>
  );
};

export default Reviews;
