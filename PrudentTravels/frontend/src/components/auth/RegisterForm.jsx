import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { HiMail, HiLockClosed, HiEye, HiEyeOff, HiUser, HiPhone } from 'react-icons/hi';
import { useAuth } from '../../hooks/useAuth';
import Loader from '../common/Loader';

const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register: registerUser, loading } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch('password');

  const onSubmit = async (data) => {
    const { confirmPassword, ...userData } = data;
    const result = await registerUser(userData);
    if (result.success) {
      navigate('/user/dashboard');
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-slate-100 mb-2">Create Account</h2>
        <p className="text-slate-300">Begin your travel journey</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* First Name & Last Name */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-slate-200 mb-2">
              First Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <HiUser className="h-5 w-5 text-slate-400" />
              </div>
              <input
                id="firstName"
                type="text"
                {...register('firstName', {
                  required: 'First name is required',
                  minLength: {
                    value: 2,
                    message: 'Must be at least 2 characters',
                  },
                })}
                className="w-full px-4 py-2.5 pl-10 bg-slate-800/50 border border-slate-600/50 rounded-xl text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500/50 focus:border-slate-500 transition-all"
                placeholder="John"
              />
            </div>
            {errors.firstName && (
              <p className="mt-1 text-sm text-red-300">{errors.firstName.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-slate-200 mb-2">
              Last Name
            </label>
            <input
              id="lastName"
              type="text"
              {...register('lastName', {
                required: 'Last name is required',
                minLength: {
                  value: 2,
                  message: 'Must be at least 2 characters',
                },
              })}
              className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-600/50 rounded-xl text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500/50 focus:border-slate-500 transition-all"
              placeholder="Doe"
            />
            {errors.lastName && (
              <p className="mt-1 text-sm text-red-300">{errors.lastName.message}</p>
            )}
          </div>
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-200 mb-2">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <HiMail className="h-5 w-5 text-slate-400" />
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
              className="w-full px-4 py-2.5 pl-10 bg-slate-800/50 border border-slate-600/50 rounded-xl text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500/50 focus:border-slate-500 transition-all"
              placeholder="you@example.com"
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-sm text-red-300">{errors.email.message}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-slate-200 mb-2">
            Phone Number
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <HiPhone className="h-5 w-5 text-slate-400" />
            </div>
            <input
              id="phone"
              type="tel"
              {...register('phone', {
                required: 'Phone number is required',
                pattern: {
                  value: /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
                  message: 'Invalid phone number',
                },
              })}
              className="w-full px-4 py-2.5 pl-10 bg-slate-800/50 border border-slate-600/50 rounded-xl text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500/50 focus:border-slate-500 transition-all"
              placeholder="+1 (555) 000-0000"
            />
          </div>
          {errors.phone && (
            <p className="mt-1 text-sm text-red-300">{errors.phone.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-slate-200 mb-2">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <HiLockClosed className="h-5 w-5 text-slate-400" />
            </div>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters',
                },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                  message: 'Must contain uppercase, lowercase, and number',
                },
              })}
              className="w-full px-4 py-2.5 pl-10 pr-10 bg-slate-800/50 border border-slate-600/50 rounded-xl text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500/50 focus:border-slate-500 transition-all"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPassword ? (
                <HiEyeOff className="h-5 w-5 text-slate-400 hover:text-slate-300 transition-colors" />
              ) : (
                <HiEye className="h-5 w-5 text-slate-400 hover:text-slate-300 transition-colors" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-red-300">{errors.password.message}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-200 mb-2">
            Confirm Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <HiLockClosed className="h-5 w-5 text-slate-400" />
            </div>
            <input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (value) =>
                  value === password || 'Passwords do not match',
              })}
              className="w-full px-4 py-2.5 pl-10 pr-10 bg-slate-800/50 border border-slate-600/50 rounded-xl text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500/50 focus:border-slate-500 transition-all"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showConfirmPassword ? (
                <HiEyeOff className="h-5 w-5 text-slate-400 hover:text-slate-300 transition-colors" />
              ) : (
                <HiEye className="h-5 w-5 text-slate-400 hover:text-slate-300 transition-colors" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-300">{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* Terms & Conditions */}
        <div className="flex items-start pt-2">
          <input
            id="terms"
            type="checkbox"
            {...register('terms', {
              required: 'You must accept the terms and conditions',
            })}
            className="h-4 w-4 bg-slate-700/50 border-slate-500 rounded focus:ring-slate-500/50 text-slate-400 mt-1"
          />
          <label htmlFor="terms" className="ml-2 block text-sm text-slate-300">
            I agree to the{' '}
            <Link to="/terms" className="text-slate-200 hover:text-slate-100 underline decoration-slate-400">
              Terms and Conditions
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="text-slate-200 hover:text-slate-100 underline decoration-slate-400">
              Privacy Policy
            </Link>
          </label>
        </div>
        {errors.terms && (
          <p className="mt-1 text-sm text-red-300">{errors.terms.message}</p>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-6 bg-gradient-to-r from-slate-700 to-slate-600 text-slate-100 font-semibold rounded-xl hover:from-slate-600 hover:to-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500/50 transform hover:scale-[1.02] transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>

        {/* Sign In Link */}
        <p className="text-center text-sm text-slate-300">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-semibold text-slate-200 hover:text-slate-100 underline decoration-slate-400"
          >
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
};

export default RegisterForm;
