import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      if (status === 401) {
        // Unauthorized - clear auth and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        toast.error('Session expired. Please login again.');
      } else if (status === 403) {
        toast.error('You do not have permission to perform this action.');
      } else if (status === 404) {
        toast.error('Resource not found.');
      } else if (status === 500) {
        toast.error('Server error. Please try again later.');
      } else if (data?.message) {
        toast.error(data.message);
      }
    } else if (error.request) {
      // Request was made but no response
      toast.error('Network error. Please check your connection.');
    } else {
      // Something else happened
      toast.error('An unexpected error occurred.');
    }
    
    return Promise.reject(error);
  }
);

export default api;

// API endpoint helper functions
export const apiEndpoints = {
  // Auth endpoints
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    me: '/auth/me',
    updateProfile: '/auth/update-details',
    updatePassword: '/auth/update-password',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
    verifyEmail: (token) => `/auth/verify-email/${token}`,
  },

  // Destination endpoints
  destinations: {
    getAll: '/destinations',
    getOne: (id) => `/destinations/${id}`,
    create: '/destinations',
    update: (id) => `/destinations/${id}`,
    delete: (id) => `/destinations/${id}`,
    featured: '/destinations/featured',
    popular: '/destinations/popular',
    related: (id) => `/destinations/${id}/related`,
  },

  // Booking endpoints
  bookings: {
    getAll: '/bookings',
    getOne: (id) => `/bookings/${id}`,
    create: '/bookings',
    update: (id) => `/bookings/${id}`,
    cancel: (id) => `/bookings/${id}/cancel`,
    myBookings: '/bookings/my-bookings',
  },

  // Review endpoints
  reviews: {
    getAll: '/reviews',
    getOne: (id) => `/reviews/${id}`,
    create: '/reviews',
    update: (id) => `/reviews/${id}`,
    delete: (id) => `/reviews/${id}`,
    helpful: (id) => `/reviews/${id}/helpful`,
  },

  // Payment endpoints
  payments: {
    create: '/payments',
    verify: '/payments/verify',
    refund: (id) => `/payments/${id}/refund`,
  },

  // Support endpoints
  support: {
    tickets: {
      getAll: '/support/tickets',
      getOne: (id) => `/support/tickets/${id}`,
      create: '/support/tickets',
      update: (id) => `/support/tickets/${id}`,
      assign: (id) => `/support/tickets/${id}/assign`,
      myTickets: '/support/my-tickets',
    },
  },

  // Admin endpoints
  admin: {
    dashboard: '/admin/dashboard',
    users: {
      getAll: '/admin/users',
      getOne: (id) => `/admin/users/${id}`,
      update: (id) => `/admin/users/${id}`,
      delete: (id) => `/admin/users/${id}`,
    },
    analytics: '/admin/analytics',
    reports: '/admin/reports',
  },

  // Wishlist endpoints
  wishlist: {
    get: '/wishlist',
    add: '/wishlist/add',
    remove: '/wishlist/remove',
  },

  // Promo endpoints
  promos: {
    validate: '/promos/validate',
    getAll: '/promos',
    create: '/promos',
    update: (id) => `/promos/${id}`,
    delete: (id) => `/promos/${id}`,
  },
};