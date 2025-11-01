import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// Lazy load pages for better performance
const Home = React.lazy(() => import('../pages/public/Home'));
const Login = React.lazy(() => import('../pages/public/Login'));
const Destinations = React.lazy(() => import('../pages/public/Destinations'));
const DestinationDetail = React.lazy(() => import('../pages/public/DestinationDetail'));
const About = React.lazy(() => import('../pages/public/About'));
const Contact = React.lazy(() => import('../pages/public/Contact'));

const Dashboard = React.lazy(() => import('../pages/user/Dashboard'));
const Profile = React.lazy(() => import('../pages/user/Profile'));
const Bookings = React.lazy(() => import('../pages/user/Bookings'));
const Wishlist = React.lazy(() => import('../pages/user/Wishlist'));
const Reviews = React.lazy(() => import('../pages/user/Reviews'));
const Settings = React.lazy(() => import('../pages/user/Settings'));

const AdminDashboard = React.lazy(() => import('../pages/admin/AdminDashboard'));
const Analytics = React.lazy(() => import('../pages/admin/Analytics'));
const DestinationManager = React.lazy(() => import('../pages/admin/DestinationManager'));
const BookingManager = React.lazy(() => import('../pages/admin/BookingManager'));
const UserManager = React.lazy(() => import('../pages/admin/UserManager'));
const PromoManager = React.lazy(() => import('../pages/admin/PromoManager'));
const AddDestination = React.lazy(() => import('../pages/admin/AddDestination'));
const EditDestination = React.lazy(() => import('../pages/admin/EditDestination'));

/**
 * Protected Route wrapper
 */
const ProtectedRoute = ({ children, requireAdmin = false, requireSupport = false }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  if (requireSupport && user?.role !== 'support' && user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};

/**
 * Main App Routes
 */
const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/destinations" element={<Destinations />} />
      <Route path="/destinations/:id" element={<DestinationDetail />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />

      {/* User Routes */}
      <Route
        path="/user/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/bookings"
        element={
          <ProtectedRoute>
            <Bookings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/wishlist"
        element={
          <ProtectedRoute>
            <Wishlist />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/reviews"
        element={
          <ProtectedRoute>
            <Reviews />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute requireAdmin>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/analytics"
        element={
          <ProtectedRoute requireAdmin>
            <Analytics />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/destinations"
        element={
          <ProtectedRoute requireAdmin>
            <DestinationManager />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/destinations/add"
        element={
          <ProtectedRoute requireAdmin>
            <AddDestination />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/destinations/edit/:id"
        element={
          <ProtectedRoute requireAdmin>
            <EditDestination />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/bookings"
        element={
          <ProtectedRoute requireAdmin>
            <BookingManager />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute requireAdmin>
            <UserManager />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/promos"
        element={
          <ProtectedRoute requireAdmin>
            <PromoManager />
          </ProtectedRoute>
        }
      />

      {/* 404 - Redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
