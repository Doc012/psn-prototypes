import React from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import {
  HiX,
  HiOutlineHome,
  HiOutlineDocumentText,
  HiOutlineCalendar,
  HiOutlineChatAlt,
  HiOutlineClipboardCheck,
  HiOutlineDocumentDuplicate,
  HiOutlineUserGroup,
  HiOutlineCog,
  HiOutlineChevronRight,
  HiOutlineClock,
  HiOutlineUser,
  HiOutlineChartBar,
  HiOutlineShieldCheck,
  HiOutlineQuestionMarkCircle,
  HiOutlineOfficeBuilding,
  HiOutlineBriefcase,
  HiOutlineCash,
  HiOutlineLogout,
  HiOutlineBell, // Add this import for notifications icon
} from 'react-icons/hi';

const Sidebar = ({ isOpen, setIsOpen, isCollapsed = true }) => {
  const { user, userRole } = useAuth(); // Use userRole directly from context
  const location = useLocation();

  // Helper function to check if a link is active
  const isLinkActive = (href) => {
    return location.pathname === href || location.pathname.startsWith(`${href}/`);
  };

  // Fix for the navItems with unique keys
  // Define navigation items based on user role
  let navItems = [];
  
  if (userRole === 'attorney') {
    navItems = [
      { id: 'attorney-dashboard', name: 'Dashboard', href: '/client-portal/attorney/dashboard', icon: HiOutlineHome },
      { id: 'attorney-cases', name: 'Cases', href: '/client-portal/attorney/cases', icon: HiOutlineDocumentText },
      { id: 'attorney-clients', name: 'Clients', href: '/client-portal/attorney/clients', icon: HiOutlineUserGroup },
      { id: 'attorney-documents', name: 'Documents', href: '/client-portal/attorney/documents', icon: HiOutlineDocumentDuplicate },
      { id: 'attorney-messages', name: 'Messages', href: '/client-portal/attorney/messages', icon: HiOutlineChatAlt },
      { id: 'attorney-billing', name: 'Billing', href: '/client-portal/attorney/billing', icon: HiOutlineClipboardCheck },
      { id: 'attorney-time-tracking', name: 'Time Tracking', href: '/client-portal/attorney/time-tracking', icon: HiOutlineClock },
      { id: 'attorney-calendar', name: 'Calendar', href: '/client-portal/attorney/calendar', icon: HiOutlineCalendar },
      { id: 'attorney-profile', name: 'Profile', href: '/client-portal/attorney/profile', icon: HiOutlineUser },
     ];
  } else if (userRole === 'admin') {
    navItems = [
      { id: 'admin-dashboard', name: 'Dashboard', href: '/client-portal/admin/dashboard', icon: HiOutlineHome },
      { id: 'admin-firm', name: 'Firm Management', href: '/client-portal/admin/firm', icon: HiOutlineOfficeBuilding },
      { id: 'admin-attorneys', name: 'Attorneys', href: '/client-portal/admin/attorneys', icon: HiOutlineBriefcase },
      { id: 'admin-clients', name: 'Clients', href: '/client-portal/admin/clients', icon: HiOutlineUserGroup },
      { id: 'admin-cases', name: 'Cases', href: '/client-portal/admin/cases', icon: HiOutlineDocumentText },
      { id: 'admin-billing', name: 'Billing & Finance', href: '/client-portal/admin/billing', icon: HiOutlineCash },
      { id: 'admin-documents', name: 'Document Center', href: '/client-portal/admin/documents', icon: HiOutlineDocumentDuplicate },
      { id: 'admin-time', name: 'Time & Activities', href: '/client-portal/admin/time', icon: HiOutlineClock },
      { id: 'admin-reports', name: 'Reports & Analytics', href: '/client-portal/admin/reports', icon: HiOutlineChartBar },
      { id: 'admin-calendar', name: 'Calendar', href: '/client-portal/admin/calendar', icon: HiOutlineCalendar },
      { id: 'admin-security', name: 'Security', href: '/client-portal/admin/security', icon: HiOutlineShieldCheck },
      { id: 'admin-settings', name: 'System Settings', href: '/client-portal/admin/settings', icon: HiOutlineCog },
      { id: 'admin-profile', name: 'Profile', href: '/client-portal/admin/profile', icon: HiOutlineUser },
    ];
  } else {
    // Default client navigation
    navItems = [
      { id: 'client-dashboard', name: 'Dashboard', href: '/client-portal/dashboard', icon: HiOutlineHome },
      { id: 'client-cases', name: 'Cases', href: '/client-portal/cases', icon: HiOutlineDocumentText },
      { id: 'client-messages', name: 'Messages', href: '/client-portal/messages', icon: HiOutlineChatAlt },
      { id: 'client-documents', name: 'Documents', href: '/client-portal/documents', icon: HiOutlineDocumentDuplicate },
      { id: 'client-calendar', name: 'Calendar', href: '/client-portal/calendar', icon: HiOutlineCalendar },
      { id: 'client-invoices', name: 'Invoices', href: '/client-portal/invoices', icon: HiOutlineClipboardCheck },
      { id: 'client-notifications', name: 'Notifications', href: '/client-portal/notifications', icon: HiOutlineBell },
      { id: 'client-profile', name: 'Profile', href: '/client-portal/profile', icon: HiOutlineUser },
      { id: 'client-support', name: 'Support', href: '/client-portal/support', icon: HiOutlineQuestionMarkCircle },
    ];
  }

  // Animation variants
  const sidebarVariants = {
    expanded: { width: '16rem' }, // 64px × 4 = 256px = 16rem
    collapsed: { width: '5rem' }   // 80px = 5rem
  };

  return (
    <motion.div 
      initial="collapsed"
      animate={isCollapsed ? "collapsed" : "expanded"}
      variants={sidebarVariants}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={`
        fixed inset-y-0 left-0 z-40 bg-white shadow-lg transform 
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0 transition-transform duration-300 ease-in-out
        border-r border-gray-200 flex-shrink-0 overflow-hidden
      `}
    >
      <div className="h-full flex flex-col">
        {/* Sidebar header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <Link to={`/client-portal/${userRole === 'admin' ? 'admin/dashboard' : userRole === 'attorney' ? 'attorney/dashboard' : 'dashboard'}`} className="flex items-center overflow-hidden">
            <img
              className="h-8 w-auto"
              src="/logo.png"
              alt="PSN Attorneys"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740";
              }}
            />
            {!isCollapsed && (
              <motion.span 
                initial={isCollapsed ? { opacity: 0 } : { opacity: 1 }}
                animate={isCollapsed ? { opacity: 0 } : { opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="ml-2 text-lg font-semibold text-[#800000] whitespace-nowrap"
              >
                PSN Portal
              </motion.span>
            )}
          </Link>
          <button
            className="lg:hidden text-gray-500 hover:text-gray-600"
            onClick={() => setIsOpen(false)}
          >
            <HiX className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation items */}
        <nav className="flex-1 px-2 py-4 bg-white space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const active = isLinkActive(item.href);
            
            return (
              <NavLink
                key={item.id}  // Use the unique id as key instead of name
                to={item.href}
                className={`group flex items-center px-2 py-2 text-base font-medium rounded-md transition-all duration-300 ${
                  active
                    ? 'bg-[#800000]/10 text-[#800000]'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                } ${isCollapsed ? 'justify-center' : ''}`}
                title={item.name}
              >
                <item.icon
                  className={`flex-shrink-0 h-6 w-6 ${
                    active
                      ? 'text-[#800000]'
                      : 'text-gray-400 group-hover:text-gray-500'
                  }`}
                  aria-hidden="true"
                />
                
                {!isCollapsed && (
                  <motion.span 
                    initial={isCollapsed ? { opacity: 0, width: 0 } : { opacity: 1, width: 'auto' }}
                    animate={isCollapsed ? { opacity: 0, width: 0 } : { opacity: 1, width: 'auto' }}
                    transition={{ duration: 0.2 }}
                    className="ml-3 whitespace-nowrap overflow-hidden"
                  >
                    {item.name}
                  </motion.span>
                )}
                
                {isCollapsed && active && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute right-2 text-[#800000]"
                  >
                    <HiOutlineChevronRight className="h-4 w-4" />
                  </motion.div>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Sidebar footer */}
        <div className={`p-4 border-t border-gray-200 ${isCollapsed ? 'flex justify-center' : ''}`}>
          <div className="flex items-center">
            {!isCollapsed && (
              <motion.div 
                initial={isCollapsed ? { opacity: 0, width: 0 } : { opacity: 1, width: 'auto' }}
                animate={isCollapsed ? { opacity: 0, width: 0 } : { opacity: 1, width: 'auto' }}
                className="mr-3 text-sm text-gray-500"
              >
                <span className="font-medium text-gray-700">
                  {user?.firstName || 'User'}
                </span>
                <span className="block text-xs capitalize">
                  {userRole}
                </span>
              </motion.div>
            )}
          </div>
          {/* Logout button */}
          <div className="mt-4">
            <button
              onClick={() => {
                // You can add your logout logic here
                // For example: logout() if you have a logout function in your auth context
                if (window.confirm('Are you sure you want to log out?')) {
                  // Navigate to login page or call logout function from auth context
                  window.location.href = '/client-portal/login';
                }
              }}
              className={`flex items-center justify-center p-2 rounded-full text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all duration-300`}
              title="Log out"
            >
              <HiOutlineLogout className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar;