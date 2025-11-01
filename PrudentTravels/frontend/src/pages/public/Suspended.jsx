import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaGlobe, FaExclamationTriangle, FaEnvelope } from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';

const Suspended = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [suspensionInfo, setSuspensionInfo] = useState(null);

  useEffect(() => {
    // Get suspension info from localStorage
    const info = localStorage.getItem('suspensionInfo');
    if (info) {
      setSuspensionInfo(JSON.parse(info));
    }
  }, []);

  const handleLogout = () => {
    // Clear suspension info
    localStorage.removeItem('suspensionInfo');
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center space-x-2 mb-6">
              <FaGlobe className="text-primary-600 text-4xl" />
              <span className="font-display text-3xl font-bold gradient-text">
                PrudentTravels
              </span>
            </Link>
          </div>

          {/* Warning Icon */}
          <div className="flex justify-center mb-6">
            <div className="bg-red-100 rounded-full p-6">
              <FaExclamationTriangle className="text-red-600 text-5xl" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 text-center mb-4">
            Account Suspended
          </h1>

          {/* Message */}
          <div className="bg-red-50 border-l-4 border-red-500 p-6 mb-8 rounded">
            <p className="text-gray-700 text-lg mb-4">
              We regret to inform you that your PrudentTravels account has been suspended.
            </p>
            
            {suspensionInfo?.reason && (
              <div className="mt-4">
                <p className="font-semibold text-gray-900 mb-2">Reason:</p>
                <p className="text-gray-700">{suspensionInfo.reason}</p>
              </div>
            )}
          </div>

          {/* Information Box */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-gray-900 mb-3">
              While your account is suspended, you cannot:
            </h3>
            <ul className="space-y-2 text-gray-700 list-disc list-inside">
              <li>Access your account dashboard</li>
              <li>Make new bookings</li>
              <li>View or modify existing bookings</li>
              <li>Use PrudentTravels services</li>
            </ul>
          </div>

          {/* Contact Support */}
          <div className="bg-blue-50 rounded-lg p-6 mb-8">
            <div className="flex items-start space-x-3">
              <FaEnvelope className="text-blue-600 text-2xl mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Need Help?
                </h3>
                <p className="text-gray-700 mb-4">
                  If you believe this suspension was made in error or would like to appeal this decision, 
                  please contact our support team.
                </p>
                <Link
                  to="/contact"
                  className="inline-block btn-primary text-sm"
                  onClick={handleLogout}
                >
                  Contact Support
                </Link>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleLogout}
              className="btn-outline px-8 py-3"
            >
              Log Out
            </button>
            <Link
              to="/"
              className="btn-secondary px-8 py-3 text-center"
              onClick={handleLogout}
            >
              Go to Homepage
            </Link>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center text-gray-600 mt-8 text-sm">
          You will receive an email notification if your account status changes.
        </p>
      </div>
    </div>
  );
};

export default Suspended;
