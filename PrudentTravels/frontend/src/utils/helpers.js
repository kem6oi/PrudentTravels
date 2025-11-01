import { BOOKING_STATUS, PAYMENT_STATUS, TICKET_STATUS } from './constants';

/**
 * Debounce function
 */
export const debounce = (func, wait = 300) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function
 */
export const throttle = (func, limit = 300) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * Check if user is admin
 */
export const isAdmin = (user) => {
  return user && user.role === 'admin';
};

/**
 * Check if user is support
 */
export const isSupport = (user) => {
  return user && user.role === 'support';
};

/**
 * Check if user has role
 */
export const hasRole = (user, roles) => {
  if (!user) return false;
  const roleArray = Array.isArray(roles) ? roles : [roles];
  return roleArray.includes(user.role);
};

/**
 * Get status color class
 */
export const getStatusColor = (status, type = 'booking') => {
  const colorMap = {
    booking: {
      [BOOKING_STATUS.PENDING]: 'yellow',
      [BOOKING_STATUS.CONFIRMED]: 'blue',
      [BOOKING_STATUS.CANCELLED]: 'red',
      [BOOKING_STATUS.COMPLETED]: 'green',
      [BOOKING_STATUS.REFUNDED]: 'purple',
    },
    payment: {
      [PAYMENT_STATUS.PENDING]: 'yellow',
      [PAYMENT_STATUS.SUCCESS]: 'green',
      [PAYMENT_STATUS.FAILED]: 'red',
      [PAYMENT_STATUS.REFUNDED]: 'purple',
    },
    ticket: {
      [TICKET_STATUS.OPEN]: 'blue',
      [TICKET_STATUS.IN_PROGRESS]: 'yellow',
      [TICKET_STATUS.RESOLVED]: 'green',
      [TICKET_STATUS.CLOSED]: 'gray',
    },
  };

  return colorMap[type]?.[status] || 'gray';
};

/**
 * Calculate total price
 */
export const calculateTotalPrice = (basePrice, nights, guests = 1, taxRate = 0.1, discount = 0) => {
  const subtotal = basePrice * nights * guests;
  const tax = subtotal * taxRate;
  const discountAmount = subtotal * (discount / 100);
  const total = subtotal + tax - discountAmount;

  return {
    subtotal: Number(subtotal.toFixed(2)),
    tax: Number(tax.toFixed(2)),
    discount: Number(discountAmount.toFixed(2)),
    total: Number(total.toFixed(2)),
  };
};

/**
 * Validate email
 */
export const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

/**
 * Validate password strength
 */
export const isStrongPassword = (password) => {
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return re.test(password);
};

/**
 * Generate random string
 */
export const generateRandomString = (length = 10) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Deep clone object
 */
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Check if object is empty
 */
export const isEmpty = (obj) => {
  if (obj === null || obj === undefined) return true;
  if (typeof obj === 'string') return obj.trim().length === 0;
  if (Array.isArray(obj)) return obj.length === 0;
  if (typeof obj === 'object') return Object.keys(obj).length === 0;
  return false;
};

/**
 * Remove duplicates from array
 */
export const removeDuplicates = (arr, key) => {
  if (!key) return [...new Set(arr)];
  return arr.filter((item, index, self) =>
    index === self.findIndex((t) => t[key] === item[key])
  );
};

/**
 * Sort array of objects by key
 */
export const sortBy = (arr, key, order = 'asc') => {
  return [...arr].sort((a, b) => {
    if (a[key] < b[key]) return order === 'asc' ? -1 : 1;
    if (a[key] > b[key]) return order === 'asc' ? 1 : -1;
    return 0;
  });
};

/**
 * Group array by key
 */
export const groupBy = (arr, key) => {
  return arr.reduce((acc, item) => {
    const group = item[key];
    if (!acc[group]) acc[group] = [];
    acc[group].push(item);
    return acc;
  }, {});
};

/**
 * Calculate pagination
 */
export const calculatePagination = (totalItems, currentPage, itemsPerPage) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;

  return {
    totalPages,
    hasNextPage,
    hasPrevPage,
    startIndex: (currentPage - 1) * itemsPerPage,
    endIndex: Math.min(currentPage * itemsPerPage, totalItems),
  };
};

/**
 * Get image URL
 */
export const getImageUrl = (url) => {
  if (!url) return '/images/placeholder.jpg';
  if (url.startsWith('http')) return url;
  return \`\${process.env.REACT_APP_API_URL || 'http://localhost:5000'}\${url}\`;
};

/**
 * Handle API error
 */
export const handleApiError = (error) => {
  if (error.response) {
    return error.response.data?.message || 'An error occurred';
  } else if (error.request) {
    return 'Network error. Please check your connection.';
  } else {
    return error.message || 'An unexpected error occurred';
  }
};

/**
 * Download file
 */
export const downloadFile = (url, filename) => {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Copy to clipboard
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
};

/**
 * Scroll to top
 */
export const scrollToTop = (behavior = 'smooth') => {
  window.scrollTo({
    top: 0,
    behavior,
  });
};

/**
 * Scroll to element
 */
export const scrollToElement = (elementId, behavior = 'smooth') => {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({ behavior });
  }
};

/**
 * Check if element is in viewport
 */
export const isInViewport = (element) => {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

/**
 * Format search params
 */
export const formatSearchParams = (params) => {
  const searchParams = new URLSearchParams();

  Object.keys(params).forEach(key => {
    const value = params[key];
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        value.forEach(item => searchParams.append(key, item));
      } else {
        searchParams.append(key, value);
      }
    }
  });

  return searchParams.toString();
};

/**
 * Get average rating
 */
export const getAverageRating = (reviews) => {
  if (!reviews || reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  return (sum / reviews.length).toFixed(1);
};

/**
 * Check if date is in the past
 */
export const isPastDate = (date) => {
  return new Date(date) < new Date();
};

/**
 * Check if date is in the future
 */
export const isFutureDate = (date) => {
  return new Date(date) > new Date();
};

/**
 * Get query param
 */
export const getQueryParam = (name) => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
};
