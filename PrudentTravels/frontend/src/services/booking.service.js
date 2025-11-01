import api, { apiEndpoints } from './api';

/**
 * Get all bookings (admin)
 */
export const getAllBookings = async (filters = {}) => {
  const response = await api.get(apiEndpoints.bookings.getAll, { params: filters });
  return response.data;
};

/**
 * Get user's bookings
 */
export const getMyBookings = async () => {
  const response = await api.get(apiEndpoints.bookings.myBookings);
  return response.data;
};

/**
 * Get booking by ID
 */
export const getBookingById = async (id) => {
  const response = await api.get(apiEndpoints.bookings.getOne(id));
  return response.data;
};

/**
 * Create new booking
 */
export const createBooking = async (bookingData) => {
  const response = await api.post(apiEndpoints.bookings.create, bookingData);
  return response.data;
};

/**
 * Update booking
 */
export const updateBooking = async (id, updates) => {
  const response = await api.put(apiEndpoints.bookings.update(id), updates);
  return response.data;
};

/**
 * Cancel booking
 */
export const cancelBooking = async (id, reason) => {
  const response = await api.post(apiEndpoints.bookings.cancel(id), { reason });
  return response.data;
};

/**
 * Check availability
 */
export const checkAvailability = async (destinationId, checkInDate, checkOutDate) => {
  const response = await api.get(\`/bookings/availability?destinationId=\${destinationId}&checkInDate=\${checkInDate}&checkOutDate=\${checkOutDate}\`);
  return response.data;
};

export default {
  getAllBookings,
  getMyBookings,
  getBookingById,
  createBooking,
  updateBooking,
  cancelBooking,
  checkAvailability,
};
