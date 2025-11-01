import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  bookings: [],
  currentBooking: null,
  recentBookings: [],
  loading: false,
  error: null,
  bookingForm: {
    destinationId: null,
    checkInDate: '',
    checkOutDate: '',
    adults: 1,
    children: 0,
    infants: 0,
    specialRequests: '',
    promoCode: '',
  },
  bookingStep: 1, // 1: Select Dates, 2: Guest Details, 3: Payment, 4: Confirmation
};

const bookingSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {
    setBookings: (state, action) => {
      state.bookings = action.payload;
      state.loading = false;
      state.error = null;
    },
    setCurrentBooking: (state, action) => {
      state.currentBooking = action.payload;
      state.loading = false;
      state.error = null;
    },
    updateBookingForm: (state, action) => {
      state.bookingForm = { ...state.bookingForm, ...action.payload };
    },
    resetBookingForm: (state) => {
      state.bookingForm = initialState.bookingForm;
      state.bookingStep = 1;
    },
    setBookingStep: (state, action) => {
      state.bookingStep = action.payload;
    },
    addBooking: (state, action) => {
      state.bookings.unshift(action.payload);
    },
    updateBooking: (state, action) => {
      const index = state.bookings.findIndex(b => b.id === action.payload.id);
      if (index !== -1) {
        state.bookings[index] = action.payload;
      }
    },
    removeBooking: (state, action) => {
      state.bookings = state.bookings.filter(b => b.id !== action.payload);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setBookings,
  setCurrentBooking,
  updateBookingForm,
  resetBookingForm,
  setBookingStep,
  addBooking,
  updateBooking,
  removeBooking,
  setLoading,
  setError,
  clearError,
} = bookingSlice.actions;

export default bookingSlice.reducer;