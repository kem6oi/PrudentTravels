import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  MapIcon,
  CalendarDaysIcon,
  UserGroupIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  TicketIcon,
  TagIcon
} from '@heroicons/react/24/outline';

const Sidebar = ({ isOpen, onClose, role = 'user' }) => {
  const location = useLocation();

  const userLinks = [
    { name: 'Dashboard', href: '/user/dashboard', icon: HomeIcon },
    { name: 'My Bookings', href: '/user/bookings', icon: CalendarDaysIcon },
    { name: 'Wishlist', href: '/user/wishlist', icon: MapIcon },
    { name: 'Reviews', href: '/user/reviews', icon: TicketIcon },
    { name: 'Settings', href: '/user/settings', icon: Cog6ToothIcon },
  ];

  const adminLinks = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: HomeIcon },
    { name: 'Analytics', href: '/admin/analytics', icon: ChartBarIcon },
    { name: 'Destinations', href: '/admin/destinations', icon: MapIcon },
    { name: 'Bookings', href: '/admin/bookings', icon: CalendarDaysIcon },
    { name: 'Users', href: '/admin/users', icon: UserGroupIcon },
    { name: 'Promo Codes', href: '/admin/promos', icon: TagIcon },
    { name: 'Settings', href: '/admin/settings', icon: Cog6ToothIcon },
  ];

  const links = role === 'admin' ? adminLinks : userLinks;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 z-50 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-4">
          <h2 className="text-xl font-bold text-gray-900 mb-6">{role === 'admin' ? 'Admin Panel' : 'My Account'}</h2>
          <nav className="space-y-2">
            {links.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={onClose}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <link.icon className="h-5 w-5" />
                  <span className="font-medium">{link.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
