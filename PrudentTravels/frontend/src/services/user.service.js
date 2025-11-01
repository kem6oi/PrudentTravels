import api, { apiEndpoints } from './api';

/**
 * Get user profile
 */
export const getProfile = async () => {
  const response = await api.get('/users/profile');
  return response.data;
};

/**
 * Update user profile
 */
export const updateProfile = async (data) => {
  const response = await api.put('/users/profile', data);
  return response.data;
};

/**
 * Update user password
 */
export const updatePassword = async (currentPassword, newPassword) => {
  const response = await api.put(apiEndpoints.auth.updatePassword, {
    currentPassword,
    newPassword,
  });
  return response.data;
};

/**
 * Upload avatar
 */
export const uploadAvatar = async (file) => {
  const formData = new FormData();
  formData.append('avatar', file);

  const response = await api.post('/users/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/**
 * Get user bookings
 */
export const getUserBookings = async (status) => {
  const params = status ? { status } : {};
  const response = await api.get('/users/bookings', { params });
  return response.data;
};

/**
 * Get user reviews
 */
export const getUserReviews = async () => {
  const response = await api.get('/users/reviews');
  return response.data;
};

/**
 * Get wishlist
 */
export const getWishlist = async () => {
  const response = await api.get('/users/wishlist');
  return response.data;
};

/**
 * Add to wishlist
 */
export const addToWishlist = async (destinationId) => {
  const response = await api.post('/users/wishlist', { destinationId });
  return response.data;
};

/**
 * Remove from wishlist
 */
export const removeFromWishlist = async (destinationId) => {
  const response = await api.delete(\`/users/wishlist/\${destinationId}\`);
  return response.data;
};

/**
 * Update preferences
 */
export const updatePreferences = async (preferences) => {
  const response = await api.put('/users/preferences', preferences);
  return response.data;
};

/**
 * Delete account
 */
export const deleteAccount = async () => {
  const response = await api.delete('/users/account');
  return response.data;
};

export default {
  getProfile,
  updateProfile,
  updatePassword,
  uploadAvatar,
  getUserBookings,
  getUserReviews,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  updatePreferences,
  deleteAccount,
};
