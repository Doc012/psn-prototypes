import React from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { motion } from 'framer-motion';
import {
  HiX,
  HiOutlineHome,
  HiOutlineDocumentText,
  HiOutlineCalendar,
  HiOutlineChatAlt,
  HiOutlineClipboardCheck,
  HiOutlineDocumentDuplicate,
  HiOutlineCog,
  HiOutlineChevronRight,
  HiOutlineUser,
  HiOutlineQuestionMarkCircle
} from 'react-icons/hi';

const ClientSidebar = ({ isOpen, setIsOpen, isCollapsed = true }) => {
  const { user } = useAuth();
  const location = useLocation();

  // Helper function to check if a link is active
  const isLinkActive = (href) => {
    return location.pathname === href || location.pathname.startsWith(`${href}/`);
  };

  // Define client-specific navigation items
  const navItems = [
    { name: 'Dashboard', href: '/client-portal/dashboard', icon: HiOutlineHome },
    { name: 'My Cases', href: '/client-portal/cases', icon: HiOutlineDocumentText },
    { name: 'Invoices', href: '/client-portal/invoices', icon: HiOutlineClipboardCheck },
    { name: 'Messages', href: '/client-portal/messages', icon: HiOutlineChatAlt },
    { name: 'Documents', href: '/client-portal/documents', icon: HiOutlineDocumentDuplicate },
    { name: 'Calendar', href: '/client-portal/calendar', icon: HiOutlineCalendar },
    { name: 'Profile', href: '/client-portal/profile', icon: HiOutlineUser },
    { name: 'Support', href: '/client-portal/support', icon: HiOutlineQuestionMarkCircle },
  ];

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
          <Link to="/client-portal/dashboard" className="flex items-center overflow-hidden">
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
                Client Portal
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
          {navItems.map((item, index) => {
            const active = isLinkActive(item.href);
            
            return (
              <NavLink
                key={item.name}
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
                  Client
                </span>
              </motion.div>
            )}
            <Link
              to="/client-portal/profile"
              className={`flex items-center justify-center p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-300`}
              title="Settings"
            >
              <HiOutlineCog className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ClientSidebar;