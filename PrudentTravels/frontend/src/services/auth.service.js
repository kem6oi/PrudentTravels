import api, { apiEndpoints } from './api';

export const authService = {
  // Login
  login: async (email, password) => {
    const response = await api.post(apiEndpoints.auth.login, { email, password });
    return response.data;
  },

  // Register
  register: async (userData) => {
    const response = await api.post(apiEndpoints.auth.register, userData);
    return response.data;
  },

  // Logout
  logout: async () => {
    try {
      await api.post(apiEndpoints.auth.logout);
    } catch (error) {
      // Even if logout fails on server, clear local data
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Get current user
  getMe: async () => {
    const response = await api.get(apiEndpoints.auth.me);
    return response.data;
  },

  // Update profile
  updateProfile: async (data) => {
    const response = await api.put(apiEndpoints.auth.updateProfile, data);
    return response.data;
  },

  // Update password
  updatePassword: async (currentPassword, newPassword) => {
    const response = await api.put(apiEndpoints.auth.updatePassword, {
      currentPassword,
      newPassword,
    });
    return response.data;
  },

  // Forgot password
  forgotPassword: async (email) => {
    const response = await api.post(apiEndpoints.auth.forgotPassword, { email });
    return response.data;
  },

  // Reset password
  resetPassword: async (token, password) => {
    const response = await api.post(apiEndpoints.auth.resetPassword, {
      token,
      password,
    });
    return response.data;
  },

  // Verify email
  verifyEmail: async (token) => {
    const response = await api.get(apiEndpoints.auth.verifyEmail(token));
    return response.data;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // Get stored token
  getToken: () => {
    return localStorage.getItem('token');
  },

  // Get stored user
  getStoredUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Save auth data
  saveAuthData: (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  },

  // Clear auth data
  clearAuthData: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

export default authService;