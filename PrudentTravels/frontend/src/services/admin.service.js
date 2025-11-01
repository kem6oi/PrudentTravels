import api, { apiEndpoints } from './api';

/**
 * Get admin dashboard stats
 */
export const getDashboardStats = async () => {
  const response = await api.get(apiEndpoints.admin.dashboard);
  return response.data;
};

/**
 * Get all users
 */
export const getAllUsers = async (filters = {}) => {
  const response = await api.get(apiEndpoints.admin.users.getAll, { params: filters });
  return response.data;
};

/**
 * Get user by ID
 */
export const getUserById = async (id) => {
  const response = await api.get(apiEndpoints.admin.users.getOne(id));
  return response.data;
};

/**
 * Update user
 */
export const updateUser = async (id, data) => {
  const response = await api.put(apiEndpoints.admin.users.update(id), data);
  return response.data;
};

/**
 * Delete user
 */
export const deleteUser = async (id) => {
  const response = await api.delete(apiEndpoints.admin.users.delete(id));
  return response.data;
};

/**
 * Toggle user status
 */
export const toggleUserStatus = async (id) => {
  const response = await api.patch(\`/admin/users/\${id}/toggle-status\`);
  return response.data;
};

/**
 * Get analytics
 */
export const getAnalytics = async (params = {}) => {
  const response = await api.get(apiEndpoints.admin.analytics, { params });
  return response.data;
};

/**
 * Get booking analytics
 */
export const getBookingAnalytics = async (startDate, endDate) => {
  const response = await api.get('/admin/analytics/bookings', {
    params: { startDate, endDate },
  });
  return response.data;
};

/**
 * Get revenue analytics
 */
export const getRevenueAnalytics = async (period = 'month') => {
  const response = await api.get('/admin/analytics/revenue', {
    params: { period },
  });
  return response.data;
};

/**
 * Get popular destinations
 */
export const getPopularDestinations = async (limit = 10) => {
  const response = await api.get('/admin/analytics/popular-destinations', {
    params: { limit },
  });
  return response.data;
};

/**
 * Get all destinations (admin)
 */
export const getAllDestinations = async (filters = {}) => {
  const response = await api.get('/admin/destinations', { params: filters });
  return response.data;
};

/**
 * Create destination
 */
export const createDestination = async (data) => {
  const response = await api.post('/admin/destinations', data);
  return response.data;
};

/**
 * Update destination
 */
export const updateDestination = async (id, data) => {
  const response = await api.put(\`/admin/destinations/\${id}\`, data);
  return response.data;
};

/**
 * Delete destination
 */
export const deleteDestination = async (id) => {
  const response = await api.delete(\`/admin/destinations/\${id}\`);
  return response.data;
};

/**
 * Get all promo codes
 */
export const getAllPromoCodes = async () => {
  const response = await api.get(apiEndpoints.promos.getAll);
  return response.data;
};

/**
 * Create promo code
 */
export const createPromoCode = async (data) => {
  const response = await api.post(apiEndpoints.promos.create, data);
  return response.data;
};

/**
 * Update promo code
 */
export const updatePromoCode = async (id, data) => {
  const response = await api.put(apiEndpoints.promos.update(id), data);
  return response.data;
};

/**
 * Delete promo code
 */
export const deletePromoCode = async (id) => {
  const response = await api.delete(apiEndpoints.promos.delete(id));
  return response.data;
};

/**
 * Get all support tickets
 */
export const getAllTickets = async (filters = {}) => {
  const response = await api.get('/admin/support/tickets', { params: filters });
  return response.data;
};

/**
 * Assign ticket
 */
export const assignTicket = async (ticketId, agentId) => {
  const response = await api.post(\`/admin/support/tickets/\${ticketId}/assign\`, { agentId });
  return response.data;
};

/**
 * Update ticket status
 */
export const updateTicketStatus = async (ticketId, status) => {
  const response = await api.patch(\`/admin/support/tickets/\${ticketId}/status\`, { status });
  return response.data;
};

export default {
  getDashboardStats,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  toggleUserStatus,
  getAnalytics,
  getBookingAnalytics,
  getRevenueAnalytics,
  getPopularDestinations,
  getAllDestinations,
  createDestination,
  updateDestination,
  deleteDestination,
  getAllPromoCodes,
  createPromoCode,
  updatePromoCode,
  deletePromoCode,
  getAllTickets,
  assignTicket,
  updateTicketStatus,
};
