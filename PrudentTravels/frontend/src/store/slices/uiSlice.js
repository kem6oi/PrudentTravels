import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sidebarOpen: false,
  modalOpen: false,
  modalContent: null,
  theme: localStorage.getItem('theme') || 'light',
  notifications: [],
  isLoading: false,
  searchQuery: '',
  mobileMenuOpen: false,
  activeTab: null,
  breadcrumbs: [],
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    openModal: (state, action) => {
      state.modalOpen = true;
      state.modalContent = action.payload;
    },
    closeModal: (state) => {
      state.modalOpen = false;
      state.modalContent = null;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', state.theme);
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
      localStorage.setItem('theme', action.payload);
    },
    addNotification: (state, action) => {
      state.notifications.push({
        id: Date.now(),
        ...action.payload,
      });
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        (n) => n.id !== action.payload
      );
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setMobileMenuOpen: (state, action) => {
      state.mobileMenuOpen = action.payload;
    },
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    setBreadcrumbs: (state, action) => {
      state.breadcrumbs = action.payload;
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  openModal,
  closeModal,
  toggleTheme,
  setTheme,
  addNotification,
  removeNotification,
  clearNotifications,
  setLoading,
  setSearchQuery,
  setMobileMenuOpen,
  setActiveTab,
  setBreadcrumbs,
} = uiSlice.actions;

export default uiSlice.reducer;