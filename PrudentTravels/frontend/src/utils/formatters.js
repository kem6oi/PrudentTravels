import { format, formatDistance, formatRelative, parseISO, differenceInDays } from 'date-fns';
import { DATE_FORMATS, CURRENCIES } from './constants';

/**
 * Format currency with symbol
 */
export const formatCurrency = (amount, currencyCode = 'USD') => {
  const currency = CURRENCIES[currencyCode] || CURRENCIES.USD;

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.code,
  }).format(amount);
};

/**
 * Format date to display format
 */
export const formatDate = (date, formatStr = DATE_FORMATS.DISPLAY) => {
  if (!date) return '';

  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, formatStr);
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};

/**
 * Format date to relative time (e.g., "2 hours ago")
 */
export const formatRelativeTime = (date) => {
  if (!date) return '';

  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return formatDistance(dateObj, new Date(), { addSuffix: true });
  } catch (error) {
    console.error('Error formatting relative time:', error);
    return '';
  }
};

/**
 * Format date to relative format (e.g., "Today at 3:45 PM")
 */
export const formatRelativeDate = (date) => {
  if (!date) return '';

  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return formatRelative(dateObj, new Date());
  } catch (error) {
    console.error('Error formatting relative date:', error);
    return '';
  }
};

/**
 * Calculate number of nights between two dates
 */
export const calculateNights = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return 0;

  try {
    const checkInDate = typeof checkIn === 'string' ? parseISO(checkIn) : checkIn;
    const checkOutDate = typeof checkOut === 'string' ? parseISO(checkOut) : checkOut;
    return differenceInDays(checkOutDate, checkInDate);
  } catch (error) {
    console.error('Error calculating nights:', error);
    return 0;
  }
};

/**
 * Format phone number
 */
export const formatPhoneNumber = (phone) => {
  if (!phone) return '';

  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '');

  // Format as (XXX) XXX-XXXX
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);

  if (match) {
    return \`(\${match[1]}) \${match[2]}-\${match[3]}\`;
  }

  return phone;
};

/**
 * Format file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Format number with commas
 */
export const formatNumber = (num) => {
  if (num === null || num === undefined) return '0';
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

/**
 * Format percentage
 */
export const formatPercentage = (value, decimals = 0) => {
  if (value === null || value === undefined) return '0%';
  return \`\${Number(value).toFixed(decimals)}%\`;
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Capitalize first letter
 */
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Format name (first name + last name)
 */
export const formatName = (firstName, lastName) => {
  return [firstName, lastName].filter(Boolean).join(' ');
};

/**
 * Get initials from name
 */
export const getInitials = (firstName, lastName) => {
  const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : '';
  const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : '';
  return firstInitial + lastInitial;
};

/**
 * Format booking number
 */
export const formatBookingNumber = (bookingNumber) => {
  if (!bookingNumber) return '';
  // Format as PT-XXXX-XXXX
  return bookingNumber.replace(/(.{2})(.{4})(.{4})/, '$1-$2-$3');
};

/**
 * Format rating display
 */
export const formatRating = (rating) => {
  if (rating === null || rating === undefined) return '0.0';
  return Number(rating).toFixed(1);
};

/**
 * Format address
 */
export const formatAddress = (address) => {
  if (!address) return '';

  const parts = [];

  if (address.street) parts.push(address.street);
  if (address.city) parts.push(address.city);
  if (address.state) parts.push(address.state);
  if (address.zipCode) parts.push(address.zipCode);
  if (address.country) parts.push(address.country);

  return parts.join(', ');
};

/**
 * Format guest count
 */
export const formatGuestCount = (adults, children = 0, infants = 0) => {
  const parts = [];

  if (adults) parts.push(\`\${adults} \${adults === 1 ? 'adult' : 'adults'}\`);
  if (children) parts.push(\`\${children} \${children === 1 ? 'child' : 'children'}\`);
  if (infants) parts.push(\`\${infants} \${infants === 1 ? 'infant' : 'infants'}\`);

  return parts.join(', ');
};

/**
 * Format status badge text
 */
export const formatStatusBadge = (status) => {
  if (!status) return '';
  return status.split('_').map(capitalize).join(' ');
};

/**
 * Parse query string to object
 */
export const parseQueryString = (queryString) => {
  if (!queryString) return {};

  return queryString
    .substring(1)
    .split('&')
    .reduce((acc, pair) => {
      const [key, value] = pair.split('=');
      acc[decodeURIComponent(key)] = decodeURIComponent(value || '');
      return acc;
    }, {});
};

/**
 * Convert object to query string
 */
export const toQueryString = (obj) => {
  if (!obj || Object.keys(obj).length === 0) return '';

  return '?' + Object.keys(obj)
    .filter(key => obj[key] !== undefined && obj[key] !== null && obj[key] !== '')
    .map(key => \`\${encodeURIComponent(key)}=\${encodeURIComponent(obj[key])}\`)
    .join('&');
};
