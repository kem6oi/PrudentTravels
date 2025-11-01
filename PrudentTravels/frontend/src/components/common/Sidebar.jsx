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
  HiSupport
} from 'react-icons/hi';
import { FaGlobe } from 'react-icons/fa';
import { logout } from '../../store/slices/authSlice';
import toast from 'react-hot-toast';

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

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

    return baseItems[user?.role] || baseItems.traveler;
  };

  const menuItems = getMenuItems();

  return (
    <aside className="bg-white border-r h-screen sticky top-0 w-64 flex-shrink-0">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="p-6 border-b">
          <NavLink to="/" className="flex items-center space-x-2">
            <FaGlobe className="text-primary-600 text-2xl" />
            <span className="font-display text-xl font-bold gradient-text">
              PrudentTravels
            </span>
          </NavLink>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 custom-scrollbar">
          <div className="space-y-1 px-3">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-3 w-full text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
          >
            <HiLogout className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
