import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bars3Icon, XMarkIcon, UserCircleIcon, HeartIcon, CalendarDaysIcon, Cog6ToothIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../hooks/useAuth';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Destinations', href: '/destinations' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">PT</span>
            </div>
            <span className="text-xl font-bold text-gray-900 hidden sm:block">PrudentTravels</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link key={item.name} to={item.href} className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                {item.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated && user ? (
              <Menu as="div" className="relative">
                <Menu.Button className="flex items-center space-x-2">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 font-semibold">{user.firstName?.[0]}{user.lastName?.[0]}</span>
                  </div>
                </Menu.Button>
                <Transition as={Fragment} enter="transition ease-out duration-100" enterFrom="transform opacity-0 scale-95" enterTo="transform opacity-100 scale-100">
                  <Menu.Items className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg">
                    <Menu.Item>
                      <Link to="/user/profile" className="flex items-center px-4 py-2 hover:bg-blue-50"><UserCircleIcon className="h-5 w-5 mr-2" />Profile</Link>
                    </Menu.Item>
                    <Menu.Item>
                      <button onClick={handleLogout} className="flex items-center px-4 py-2 w-full hover:bg-red-50"><ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />Sign Out</button>
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </Menu>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-blue-600 font-medium">Sign In</Link>
                <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
