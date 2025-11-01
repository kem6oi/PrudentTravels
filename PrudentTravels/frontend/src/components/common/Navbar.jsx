import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaBell, FaUserCircle } from 'react-icons/fa';

const Navbar = ({ title = 'Dashboard' }) => {
  const user = useSelector((state) => state.auth.user);

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-30">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <FaBell className="w-6 h-6" />
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
            </button>

            {/* User Profile */}
            <Link 
              to="/user/profile" 
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
            >
              {user?.profileImage ? (
                <img
                  src={user.profileImage}
                  alt={user.firstName}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <FaUserCircle className="w-10 h-10 text-gray-400" />
              )}
              <div className="hidden md:block">
                <p className="text-sm font-medium text-gray-900">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
