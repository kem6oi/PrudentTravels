import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  HiHome,
  HiUser,
  HiCalendar,
  HiStar,
  HiCog,
  HiHeart,
  HiLogout,
  HiChartBar,
  HiUserGroup,
  HiTicket,
  HiGlobe,
  HiSupport,
  HiCreditCard,
  HiCurrencyDollar
} from 'react-icons/hi';
import { FaGlobe } from 'react-icons/fa';
import { logout } from '../../store/slices/authSlice';
import toast from 'react-hot-toast';
import { useSidebar } from '../../contexts/SidebarContext';

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const { isExpanded, collapseSidebar } = useSidebar();

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
    navigate('/');
  };

  // Define menu items based on user role
  const getMenuItems = () => {
    const baseItems = {
      traveler: [
        { path: '/user/dashboard', icon: HiHome, label: 'Dashboard' },
        { path: '/user/profile', icon: HiUser, label: 'Profile' },
        { path: '/user/bookings', icon: HiCalendar, label: 'My Bookings' },
        { path: '/user/wishlist', icon: HiHeart, label: 'Wishlist' },
        { path: '/user/reviews', icon: HiStar, label: 'My Reviews' },
        { path: '/user/settings', icon: HiCog, label: 'Settings' },
      ],
      admin: [
        { path: '/admin/dashboard', icon: HiHome, label: 'Dashboard' },
        { path: '/admin/analytics', icon: HiChartBar, label: 'Analytics' },
        { path: '/admin/destinations', icon: HiGlobe, label: 'Destinations' },
        { path: '/admin/bookings', icon: HiCalendar, label: 'Bookings' },
        { path: '/admin/users', icon: HiUserGroup, label: 'Users' },
        { path: '/admin/payment-verification', icon: HiCurrencyDollar, label: 'Payment Verification' },
        { path: '/admin/payment-methods', icon: HiCreditCard, label: 'Payment Methods' },
        { path: '/admin/promos', icon: HiTicket, label: 'Promo Codes' },
        { path: '/admin/settings', icon: HiCog, label: 'Settings' },
      ],
      support: [
        { path: '/support/dashboard', icon: HiHome, label: 'Dashboard' },
        { path: '/support/tickets', icon: HiSupport, label: 'Tickets' },
        { path: '/support/live-chat', icon: HiUserGroup, label: 'Live Chat' },
        { path: '/support/faq', icon: HiCog, label: 'FAQ Manager' },
      ],
    };

    const items = baseItems[user?.role] || baseItems.traveler;
    return Array.isArray(items) ? items : baseItems.traveler;
  };

  const menuItems = getMenuItems();

  return (
    <>
      {/* Overlay for mobile when sidebar is expanded */}
      {isExpanded && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={collapseSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          bg-white border-r h-screen sticky top-0 flex-shrink-0 z-50
          transition-all duration-300 ease-in-out
          ${isExpanded ? 'w-64' : 'w-0 lg:w-20'}
          ${isExpanded ? 'fixed lg:relative' : 'hidden lg:block'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className={`border-b ${isExpanded ? 'p-6' : 'p-4'} transition-all duration-300`}>
            <NavLink to="/" className={`flex items-center ${isExpanded ? 'space-x-2' : 'justify-center'}`}>
              <FaGlobe className={`text-primary-600 ${isExpanded ? 'text-2xl' : 'text-xl'} transition-all duration-300`} />
              <span
                className={`font-display text-xl font-bold gradient-text whitespace-nowrap overflow-hidden transition-all duration-300 ${
                  isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0'
                }`}
              >
                PrudentTravels
              </span>
            </NavLink>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-6 custom-scrollbar">
            <div className={`space-y-1 ${isExpanded ? 'px-3' : 'px-2'}`}>
              {menuItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center ${isExpanded ? 'space-x-3 px-4' : 'justify-center px-3'} py-3 rounded-lg transition-all duration-300 ${
                      isActive
                        ? 'bg-primary-50 text-primary-600'
                        : 'text-gray-700 hover:bg-sky-50'
                    }`
                  }
                  title={!isExpanded ? item.label : undefined}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  <span
                    className={`font-medium whitespace-nowrap overflow-hidden transition-all duration-300 ${
                      isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0'
                    }`}
                  >
                    {item.label}
                  </span>
                </NavLink>
              ))}
            </div>
          </nav>

          {/* Logout Button */}
          <div className={`border-t ${isExpanded ? 'p-4' : 'p-2'}`}>
            <button
              onClick={handleLogout}
              className={`flex items-center ${isExpanded ? 'space-x-3 px-4' : 'justify-center px-3'} py-3 w-full text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all duration-300`}
              title={!isExpanded ? 'Logout' : undefined}
            >
              <HiLogout className="w-5 h-5 flex-shrink-0" />
              <span
                className={`font-medium whitespace-nowrap overflow-hidden transition-all duration-300 ${
                  isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0'
                }`}
              >
                Logout
              </span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
