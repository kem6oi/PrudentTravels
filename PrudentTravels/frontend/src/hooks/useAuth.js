import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  loginStart,
  loginSuccess,
  loginFailure,
  logout as logoutAction,
  updateUser,
} from '../store/slices/authSlice';
import api, { apiEndpoints } from '../services/api';
import toast from 'react-hot-toast';

/**
 * Custom hook for authentication
 */
export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token, isAuthenticated, loading, error } = useSelector((state) => state.auth);

  /**
   * Login user
   */
  const login = async (email, password) => {
    try {
      dispatch(loginStart());

      const response = await api.post(apiEndpoints.auth.login, {
        email,
        password,
      });

      const { user, token } = response.data.data;

      dispatch(loginSuccess({ user, token }));
      toast.success('Login successful!');

      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      dispatch(loginFailure(message));
      toast.error(message);
      return { success: false, error: message };
    }
  };

  /**
   * Register user
   */
  const register = async (data) => {
    try {
      dispatch(loginStart());

      const response = await api.post(apiEndpoints.auth.register, data);

      const { user, token } = response.data.data;

      dispatch(loginSuccess({ user, token }));
      toast.success('Registration successful!');

      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      dispatch(loginFailure(message));
      toast.error(message);
      return { success: false, error: message };
    }
  };

  /**
   * Logout user
   */
  const logout = () => {
    dispatch(logoutAction());
    toast.success('Logged out successfully');
    navigate('/login');
  };

  /**
   * Update user profile
   */
  const updateUserProfile = (updates) => {
    dispatch(updateUser(updates));
  };

  /**
   * Forgot password
   */
  const forgotPassword = async (email) => {
    try {
      await api.post(apiEndpoints.auth.forgotPassword, { email });
      toast.success('Password reset email sent!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to send reset email';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  /**
   * Reset password
   */
  const resetPassword = async (token, password) => {
    try {
      await api.post(apiEndpoints.auth.resetPassword, { token, password });
      toast.success('Password reset successful!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to reset password';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  /**
   * Check if user is authenticated
   */
  const checkAuth = () => {
    return isAuthenticated && !!token;
  };

  /**
   * Check if user is admin
   */
  const isAdmin = () => {
    return user?.role === 'admin';
  };

  /**
   * Check if user is support
   */
  const isSupport = () => {
    return user?.role === 'support';
  };

  /**
   * Check if user has role
   */
  const hasRole = (roles) => {
    if (!user) return false;
    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(user.role);
  };

  return {
    user,
    token,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout,
    updateUserProfile,
    forgotPassword,
    resetPassword,
    checkAuth,
    isAdmin,
    isSupport,
    hasRole,
  };
};

export default useAuth;
