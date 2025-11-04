import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/auth/ProtectedRoute';

// Public Pages
import Home from '../pages/public/Home';
import Login from '../pages/public/Login';
import Register from '../pages/public/Register';
import Destinations from '../pages/public/Destinations';
import DestinationDetail from '../pages/public/DestinationDetail';
import About from '../pages/public/About';
import Contact from '../pages/public/Contact';
import Suspended from '../pages/public/Suspended';

// Auth Components
import ForgotPassword from '../components/auth/ForgotPassword';

// User Pages
import UserDashboard from '../pages/user/Dashboard';
import UserProfile from '../pages/user/Profile';
import UserBooking from '../pages/user/Booking';
import UserBookings from '../pages/user/Bookings';
import UserWishlist from '../pages/user/Wishlist';
import UserReviews from '../pages/user/Reviews';
import UserSettings from '../pages/user/Settings';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import Analytics from '../pages/admin/Analytics';
import DestinationManager from '../pages/admin/DestinationManager';
import AddDestination from '../pages/admin/AddDestination';
import EditDestination from '../pages/admin/EditDestination';
import BookingManager from '../pages/admin/BookingManager';
import UserManager from '../pages/admin/UserManager';
import PromoManager from '../pages/admin/PromoManager';
import AdminSettings from '../pages/admin/Settings';

// Support Pages
import SupportDashboard from '../pages/support/SupportDashboard';
import TicketList from '../pages/support/TicketList';
import TicketDetail from '../pages/support/TicketDetail';
import FAQManager from '../pages/support/FAQManager';
import LiveChat from '../pages/support/LiveChat';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/suspended" element={<Suspended />} />
      <Route path="/destinations" element={<Destinations />} />
      <Route path="/destinations/:id" element={<DestinationDetail />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />

      {/* User Routes - Protected */}
      <Route element={<ProtectedRoute allowedRoles={['traveler', 'admin', 'support']} />}>
        <Route path="/user/dashboard" element={<UserDashboard />} />
        <Route path="/user/profile" element={<UserProfile />} />
        <Route path="/booking/:id" element={<UserBooking />} />
        <Route path="/user/bookings" element={<UserBookings />} />
        <Route path="/user/wishlist" element={<UserWishlist />} />
        <Route path="/user/reviews" element={<UserReviews />} />
        <Route path="/user/settings" element={<UserSettings />} />
      </Route>

      {/* Admin Routes - Protected */}
      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/analytics" element={<Analytics />} />
        <Route path="/admin/destinations" element={<DestinationManager />} />
        <Route path="/admin/destinations/add" element={<AddDestination />} />
        <Route path="/admin/destinations/edit/:id" element={<EditDestination />} />
        <Route path="/admin/bookings" element={<BookingManager />} />
        <Route path="/admin/users" element={<UserManager />} />
        <Route path="/admin/promos" element={<PromoManager />} />
        <Route path="/admin/settings" element={<AdminSettings />} />
      </Route>

      {/* Support Routes - Protected */}
      <Route element={<ProtectedRoute allowedRoles={['support', 'admin']} />}>
        <Route path="/support/dashboard" element={<SupportDashboard />} />
        <Route path="/support/tickets" element={<TicketList />} />
        <Route path="/support/tickets/:id" element={<TicketDetail />} />
        <Route path="/support/faq" element={<FAQManager />} />
        <Route path="/support/live-chat" element={<LiveChat />} />
      </Route>

      {/* Redirect to home for unknown routes */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
