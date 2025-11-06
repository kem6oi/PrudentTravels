import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HiMail, HiCheckCircle, HiRefresh } from 'react-icons/hi';
import { FaGlobe } from 'react-icons/fa';
import api, { apiEndpoints } from '../../services/api';
import toast from 'react-hot-toast';

const VerifyEmail = () => {
  const location = useLocation();
  const email = location.state?.email || '';
  const [resending, setResending] = useState(false);

  const handleResendEmail = async () => {
    setResending(true);
    try {
      await api.post(apiEndpoints.auth.resendVerification, { email });
      toast.success('Verification email sent! Please check your inbox.');
    } catch (error) {
      toast.error('Failed to resend email. Please try again.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-3 group">
            <FaGlobe className="text-slate-300 text-4xl group-hover:text-slate-100 transition-colors" />
            <span className="font-serif text-3xl font-bold text-slate-100">
              PrudentTravels
            </span>
          </Link>
        </div>

        {/* Main Card */}
        <div className="bg-slate-900/40 backdrop-blur-2xl rounded-3xl shadow-2xl border border-slate-700/50 p-8 sm:p-12 text-center">
          {/* Icon */}
          <div className="mb-6">
            <div className="mx-auto w-24 h-24 bg-blue-500/20 rounded-full flex items-center justify-center border-2 border-blue-500/30">
              <HiMail className="text-5xl text-blue-300" />
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-slate-100 mb-4">
            Verify Your Email
          </h1>

          {/* Description */}
          <div className="space-y-4 mb-8">
            <p className="text-lg text-slate-300">
              We've sent a verification email to:
            </p>
            <p className="text-xl font-semibold text-slate-100 bg-slate-800/50 rounded-xl py-3 px-4 border border-slate-700/50">
              {email || 'your email address'}
            </p>
            <p className="text-slate-400">
              Please check your inbox and click the verification link to activate your account.
            </p>
          </div>

          {/* Instructions */}
          <div className="bg-slate-800/30 rounded-2xl p-6 mb-8 border border-slate-700/30">
            <div className="flex items-start gap-3 text-left">
              <HiCheckCircle className="text-green-400 text-xl flex-shrink-0 mt-0.5" />
              <div className="space-y-2 text-slate-300 text-sm">
                <p className="font-medium text-slate-200">What to do next:</p>
                <ul className="space-y-1 ml-1">
                  <li>• Check your email inbox for our verification message</li>
                  <li>• Click the verification link in the email</li>
                  <li>• If you don't see it, check your spam folder</li>
                  <li>• The link will expire in 24 hours</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-4">
            <button
              onClick={handleResendEmail}
              disabled={resending}
              className="w-full py-3 px-6 bg-gradient-to-r from-slate-700 to-slate-600 text-slate-100 font-semibold rounded-xl hover:from-slate-600 hover:to-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500/50 transform hover:scale-[1.02] transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <HiRefresh className={resending ? 'animate-spin' : ''} />
              {resending ? 'Sending...' : 'Resend Verification Email'}
            </button>

            <div className="pt-4 border-t border-slate-700/50">
              <p className="text-sm text-slate-400 mb-3">
                Already verified your email?
              </p>
              <Link
                to="/login"
                className="inline-flex items-center px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded-xl transition-colors"
              >
                Go to Login
              </Link>
            </div>
          </div>
        </div>

        {/* Footer Help */}
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-400">
            Need help?{' '}
            <Link to="/contact" className="text-slate-300 hover:text-slate-100 underline decoration-slate-500">
              Contact Support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
