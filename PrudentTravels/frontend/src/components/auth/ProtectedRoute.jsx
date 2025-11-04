import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectUser } from '../../store/slices/authSlice';

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);

  console.log('[ProtectedRoute] Auth check:', {
    isAuthenticated,
    userRole: user?.role,
    allowedRoles,
    user,
  });

  if (!isAuthenticated) {
    // Not logged in, redirect to login page
    console.log('[ProtectedRoute] Not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    // User doesn't have required role, redirect to home
    console.log('[ProtectedRoute] User role not allowed, redirecting to home');
    return <Navigate to="/" replace />;
  }

  // User is authenticated and has required role (if specified)
  console.log('[ProtectedRoute] Access granted');
  return <Outlet />;
};

export default ProtectedRoute;