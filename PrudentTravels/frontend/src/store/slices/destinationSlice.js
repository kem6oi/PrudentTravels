import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  destinations: [],
  currentDestination: null,
  featuredDestinations: [],
  popularDestinations: [],
  loading: false,
  error: null,
  filters: {
    category: '',
    minPrice: '',
    maxPrice: '',
    country: '',
    city: '',
    search: '',
  },
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    limit: 12,
  },
};

const destinationSlice = createSlice({
  name: 'destinations',
  initialState,
  reducers: {
    setDestinations: (state, action) => {
      state.destinations = action.payload.destinations;
      state.pagination = action.payload.pagination;
      state.loading = false;
      state.error = null;
    },
    setCurrentDestination: (state, action) => {
      state.currentDestination = action.payload;
      state.loading = false;
      state.error = null;
    },
    setFeaturedDestinations: (state, action) => {
      state.featuredDestinations = action.payload;
    },
    setPopularDestinations: (state, action) => {
      state.popularDestinations = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
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
  setDestinations,
  setCurrentDestination,
  setFeaturedDestinations,
  setPopularDestinations,
  setFilters,
  resetFilters,
  setLoading,
  setError,
  clearError,
} = destinationSlice.actions;

export default destinationSlice.reducer;