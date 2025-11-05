import React from 'react';
import { Link } from 'react-router-dom';
import { FaGlobe } from 'react-icons/fa';
import RegisterForm from '../../components/auth/RegisterForm';

const Register = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* Left Side - Minimal Branding */}
        <div className="hidden lg:block space-y-8">
          <Link to="/" className="inline-flex items-center space-x-3 group">
            <FaGlobe className="text-slate-300 text-4xl group-hover:text-slate-100 transition-colors" />
            <span className="font-serif text-4xl font-bold text-slate-100">
              PrudentTravels
            </span>
          </Link>
          <div className="space-y-4">
            <h1 className="text-4xl lg:text-5xl font-serif font-bold text-slate-100 leading-tight">
              Begin Your Adventure
            </h1>
            <p className="text-xl text-slate-300 font-light">
              Join travelers discovering extraordinary destinations
            </p>
          </div>

          {/* Minimal Feature List */}
          <div className="space-y-4 pt-4">
            <div className="flex items-center space-x-3 text-slate-300">
              <div className="flex-shrink-0 w-2 h-2 bg-slate-400 rounded-full"></div>
              <span className="text-lg">Personalized experiences</span>
            </div>
            <div className="flex items-center space-x-3 text-slate-300">
              <div className="flex-shrink-0 w-2 h-2 bg-slate-400 rounded-full"></div>
              <span className="text-lg">Best price guarantee</span>
            </div>
            <div className="flex items-center space-x-3 text-slate-300">
              <div className="flex-shrink-0 w-2 h-2 bg-slate-400 rounded-full"></div>
              <span className="text-lg">Secure bookings</span>
            </div>
          </div>
        </div>

        {/* Right Side - Register Form with Glass Effect */}
        <div className="bg-slate-900/40 backdrop-blur-2xl rounded-3xl shadow-2xl border border-slate-700/50 p-6 sm:p-8 lg:p-10">
          <div className="lg:hidden mb-6 text-center">
            <Link to="/" className="inline-flex items-center justify-center space-x-2 mb-4">
              <FaGlobe className="text-slate-300 text-3xl" />
              <span className="font-serif text-2xl font-bold text-slate-100">
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
