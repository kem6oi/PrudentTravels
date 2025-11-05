import api from './api';

/**
 * Get available countries with payment methods
 */
export const getAvailableCountries = async () => {
  const response = await api.get('/payment-methods/countries');
  return response.data;
};

/**
 * Get payment methods by country
 */
export const getPaymentMethodsByCountry = async (country) => {
  const response = await api.get(`/payment-methods/by-country/${country}`);
  return response.data;
};

/**
 * Submit payment with transaction code and proof
 */
export const submitPayment = async (paymentData) => {
  const response = await api.post('/bookings/submit-payment', paymentData);
  return response.data;
};

/**
 * Get payment details for a booking
 */
export const getPaymentByBooking = async (bookingId) => {
  const response = await api.get(`/bookings/${bookingId}/payment`);
  return response.data;
};

const paymentService = {
  getAvailableCountries,
  getPaymentMethodsByCountry,
  submitPayment,
  getPaymentByBooking
};

export default paymentService;
