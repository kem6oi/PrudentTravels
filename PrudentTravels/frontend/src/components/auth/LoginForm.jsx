import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { HiMail, HiLockClosed, HiEye, HiEyeOff } from 'react-icons/hi';
import { useAuth } from '../../hooks/useAuth';
import Loader from '../common/Loader';

const LoginForm = ({ transparent = false }) => {
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const result = await login(data.email, data.password);
    if (result.success) {
      // Navigate based on user role
      const user = JSON.parse(localStorage.getItem('user'));
      if (user?.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (user?.role === 'support') {
        navigate('/support/dashboard');
      } else {
        navigate('/user/dashboard');
      }
    } else if (result.suspended) {
      // Redirect to suspended page if account is suspended
      navigate('/suspended');
    }
  };

  if (loading) {
    return <Loader />;
  }

  // Conditional class names based on transparent prop
  const labelClass = transparent
    ? 'block text-sm font-medium text-white/90 mb-2'
    : 'label';
  const inputClass = transparent
    ? 'w-full px-4 py-3 pl-10 bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all'
    : 'input-field pl-10';
  const inputClassWithButton = transparent
    ? 'w-full px-4 py-3 pl-10 pr-10 bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all'
    : 'input-field pl-10 pr-10';
  const iconClass = transparent ? 'h-5 w-5 text-white/70' : 'h-5 w-5 text-gray-400';
  const errorClass = transparent
    ? 'mt-1 text-sm text-red-300'
    : 'error-text';
  const linkClass = transparent
    ? 'text-sm font-medium text-white hover:text-white/80 transition-colors'
    : 'text-sm font-medium text-primary-600 hover:text-primary-500';
  const buttonClass = transparent
    ? 'w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-white/50 transform hover:scale-[1.02] transition-all duration-300 shadow-lg'
    : 'w-full btn-primary py-3 text-base';
  const textClass = transparent
    ? 'text-center text-sm text-white/80'
    : 'text-center text-sm text-gray-600';
  const checkboxTextClass = transparent
    ? 'ml-2 block text-sm text-white/90'
    : 'ml-2 block text-sm text-gray-700';

  return (
    <div className="w-full">
      {!transparent && (
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
          <p className="text-gray-600">Sign in to your account to continue</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Email Field */}
        <div>
          <label htmlFor="email" className={labelClass}>
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <HiMail className={iconClass} />
            </div>
            <input
              id="email"
              type="email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
              className={inputClass}
              placeholder="you@example.com"
            />
          </div>
          {errors.email && (
            <p className={errorClass}>{errors.email.message}</p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <label htmlFor="password" className={labelClass}>
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <HiLockClosed className={iconClass} />
            </div>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
              className={inputClassWithButton}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPassword ? (
                <HiEyeOff className={`${iconClass} hover:text-opacity-80 transition-colors`} />
              ) : (
                <HiEye className={`${iconClass} hover:text-opacity-80 transition-colors`} />
              )}
            </button>
          </div>
          {errors.password && (
            <p className={errorClass}>{errors.password.message}</p>
          )}
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember"
              type="checkbox"
              className={
                transparent
                  ? 'h-4 w-4 bg-white/10 border-white/30 rounded focus:ring-white/50'
                  : 'h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded'
              }
            />
            <label htmlFor="remember" className={checkboxTextClass}>
              Remember me
            </label>
          </div>
          <Link to="/forgot-password" className={linkClass}>
            Forgot password?
          </Link>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={buttonClass}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>

        {/* Sign Up Link */}
        <p className={textClass}>
          Don't have an account?{' '}
          <Link
            to="/register"
            className={transparent ? 'font-bold text-white hover:text-white/80' : 'font-medium text-primary-600 hover:text-primary-500'}
          >
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;
