import { REGEX_PATTERNS, ERROR_MESSAGES } from './constants';

/**
 * Validate email
 */
export const validateEmail = (email) => {
  if (!email) {
    return ERROR_MESSAGES.REQUIRED;
  }

  if (!REGEX_PATTERNS.EMAIL.test(email)) {
    return ERROR_MESSAGES.INVALID_EMAIL;
  }

  return '';
};

/**
 * Validate password
 */
export const validatePassword = (password) => {
  if (!password) {
    return ERROR_MESSAGES.REQUIRED;
  }

  if (!REGEX_PATTERNS.PASSWORD.test(password)) {
    return ERROR_MESSAGES.WEAK_PASSWORD;
  }

  return '';
};

/**
 * Validate confirm password
 */
export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) {
    return ERROR_MESSAGES.REQUIRED;
  }

  if (password !== confirmPassword) {
    return ERROR_MESSAGES.PASSWORD_MISMATCH;
  }

  return '';
};

/**
 * Validate required field
 */
export const validateRequired = (value, fieldName = 'This field') => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return \`\${fieldName} is required\`;
  }

  return '';
};

/**
 * Validate phone number
 */
export const validatePhone = (phone) => {
  if (!phone) {
    return ERROR_MESSAGES.REQUIRED;
  }

  if (!REGEX_PATTERNS.PHONE.test(phone)) {
    return ERROR_MESSAGES.INVALID_PHONE;
  }

  return '';
};

/**
 * Validate min length
 */
export const validateMinLength = (value, minLength, fieldName = 'This field') => {
  if (!value || value.length < minLength) {
    return \`\${fieldName} must be at least \${minLength} characters\`;
  }

  return '';
};

/**
 * Validate max length
 */
export const validateMaxLength = (value, maxLength, fieldName = 'This field') => {
  if (value && value.length > maxLength) {
    return \`\${fieldName} must be no more than \${maxLength} characters\`;
  }

  return '';
};

/**
 * Validate number
 */
export const validateNumber = (value, fieldName = 'This field') => {
  if (isNaN(value)) {
    return \`\${fieldName} must be a number\`;
  }

  return '';
};

/**
 * Validate min value
 */
export const validateMinValue = (value, minValue, fieldName = 'This field') => {
  if (Number(value) < minValue) {
    return \`\${fieldName} must be at least \${minValue}\`;
  }

  return '';
};

/**
 * Validate max value
 */
export const validateMaxValue = (value, maxValue, fieldName = 'This field') => {
  if (Number(value) > maxValue) {
    return \`\${fieldName} must be no more than \${maxValue}\`;
  }

  return '';
};

/**
 * Validate date
 */
export const validateDate = (date, fieldName = 'Date') => {
  if (!date) {
    return \`\${fieldName} is required\`;
  }

  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) {
    return \`Invalid \${fieldName.toLowerCase()}\`;
  }

  return '';
};

/**
 * Validate future date
 */
export const validateFutureDate = (date, fieldName = 'Date') => {
  const error = validateDate(date, fieldName);
  if (error) return error;

  if (new Date(date) < new Date()) {
    return \`\${fieldName} must be in the future\`;
  }

  return '';
};

/**
 * Validate date range
 */
export const validateDateRange = (startDate, endDate) => {
  const startError = validateDate(startDate, 'Start date');
  if (startError) return startError;

  const endError = validateDate(endDate, 'End date');
  if (endError) return endError;

  if (new Date(endDate) <= new Date(startDate)) {
    return 'End date must be after start date';
  }

  return '';
};

/**
 * Validate file size
 */
export const validateFileSize = (file, maxSize) => {
  if (!file) {
    return 'File is required';
  }

  if (file.size > maxSize) {
    const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(2);
    return \`File size must be less than \${maxSizeMB}MB\`;
  }

  return '';
};

/**
 * Validate file type
 */
export const validateFileType = (file, allowedTypes) => {
  if (!file) {
    return 'File is required';
  }

  if (!allowedTypes.includes(file.type)) {
    return 'Invalid file type';
  }

  return '';
};

/**
 * Validate URL
 */
export const validateUrl = (url) => {
  if (!url) {
    return ERROR_MESSAGES.REQUIRED;
  }

  if (!REGEX_PATTERNS.URL.test(url)) {
    return 'Invalid URL';
  }

  return '';
};

/**
 * Validate rating
 */
export const validateRating = (rating) => {
  if (!rating) {
    return 'Rating is required';
  }

  if (rating < 1 || rating > 5) {
    return 'Rating must be between 1 and 5';
  }

  return '';
};

/**
 * Validate booking dates
 */
export const validateBookingDates = (checkIn, checkOut) => {
  if (!checkIn) {
    return 'Check-in date is required';
  }

  if (!checkOut) {
    return 'Check-out date is required';
  }

  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (checkInDate < today) {
    return 'Check-in date cannot be in the past';
  }

  if (checkOutDate <= checkInDate) {
    return 'Check-out date must be after check-in date';
  }

  return '';
};

/**
 * Validate guest count
 */
export const validateGuestCount = (adults, children = 0, infants = 0, maxGuests) => {
  const totalGuests = adults + children + infants;

  if (adults < 1) {
    return 'At least 1 adult is required';
  }

  if (maxGuests && totalGuests > maxGuests) {
    return \`Total guests cannot exceed \${maxGuests}\`;
  }

  return '';
};

/**
 * Combined login form validation
 */
export const validateLoginForm = (email, password) => {
  const errors = {};

  const emailError = validateEmail(email);
  if (emailError) errors.email = emailError;

  if (!password) {
    errors.password = ERROR_MESSAGES.REQUIRED;
  }

  return errors;
};

/**
 * Combined registration form validation
 */
export const validateRegisterForm = (data) => {
  const errors = {};

  const firstNameError = validateRequired(data.firstName, 'First name');
  if (firstNameError) errors.firstName = firstNameError;

  const lastNameError = validateRequired(data.lastName, 'Last name');
  if (lastNameError) errors.lastName = lastNameError;

  const emailError = validateEmail(data.email);
  if (emailError) errors.email = emailError;

  const passwordError = validatePassword(data.password);
  if (passwordError) errors.password = passwordError;

  const confirmPasswordError = validateConfirmPassword(data.password, data.confirmPassword);
  if (confirmPasswordError) errors.confirmPassword = confirmPasswordError;

  return errors;
};

/**
 * Combined booking form validation
 */
export const validateBookingForm = (data) => {
  const errors = {};

  const dateError = validateBookingDates(data.checkInDate, data.checkOutDate);
  if (dateError) errors.dates = dateError;

  const guestError = validateGuestCount(data.adults, data.children, data.infants, data.maxGuests);
  if (guestError) errors.guests = guestError;

  return errors;
};
