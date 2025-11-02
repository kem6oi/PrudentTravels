import React from 'react';
import { Link } from 'react-router-dom';
import { FaGlobe } from 'react-icons/fa';
import RegisterForm from '../../components/auth/RegisterForm';

const Register = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 to-sky-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <div className="hidden lg:block">
          <Link to="/" className="flex items-center space-x-2 mb-8">
            <FaGlobe className="text-blue-600 text-4xl" />
            <span className="font-display text-3xl font-bold text-blue-600">
              PrudentTravels
            </span>
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Start Your Journey Today
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of travelers discovering amazing destinations around the world.
          </p>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white">
                ✓
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Personalized Experiences</h3>
                <p className="text-gray-600">Get travel recommendations tailored to your preferences</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white">
                ✓
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Best Price Guarantee</h3>
                <p className="text-gray-600">Book with confidence at the best available rates</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white">
                ✓
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Secure Bookings</h3>
                <p className="text-gray-600">Your information is protected with industry-standard security</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Register Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="lg:hidden mb-6 text-center">
            <Link to="/" className="inline-flex items-center space-x-2 mb-4">
              <FaGlobe className="text-blue-600 text-3xl" />
              <span className="font-display text-2xl font-bold text-blue-600">
                PrudentTravels
              </span>
            </Link>
          </div>
          <RegisterForm />
        </div>
      </div>
    </div>
  );
};

export default Register;
