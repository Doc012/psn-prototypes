import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import ClientNavbar from './ClientNavbar';
import ClientSidebar from './ClientSidebar';
import { useAuth } from '../../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { HiX, HiMenu, HiOutlineExclamation, HiChevronLeft, HiChevronRight } from 'react-icons/hi';

const ClientLayout = () => {
  const { user } = useAuth();
  const location = useLocation();
  const dashboardPath = '/client-portal/dashboard';
  
  const [sidebarOpen, setSidebarOpen] = useState(false); // Mobile sidebar visibility
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true); // Start collapsed
  const [pageLoading, setPageLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [showWelcome, setShowWelcome] = useState(true);

  // Reset page loading on route change
  useEffect(() => {
    setPageLoading(true);
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [location.pathname]);

  // Close sidebar on mobile when route changes
  useEffect(() => {
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  }, [location.pathname]);

  // Mock welcome notification
  useEffect(() => {
    if (showWelcome) {
      const timer = setTimeout(() => {
        setShowWelcome(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [showWelcome]);

  // Handle sidebar toggle
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Add this section for the desktop sidebar collapse toggle
  const toggleSidebarCollapse = () => {
    setSidebarCollapsed(prev => !prev);
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Mobile sidebar backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-20 bg-gray-600 bg-opacity-50 transition-opacity lg:hidden"
            onClick={() => setSidebarOpen(false)}
          ></motion.div>
        )}
      </AnimatePresence>

      {/* Client-specific Sidebar component */}
      <AnimatePresence>
        <ClientSidebar 
          isOpen={sidebarOpen} 
          setIsOpen={setSidebarOpen} 
          isCollapsed={sidebarCollapsed} 
        />
      </AnimatePresence>
      
      {/* Mobile sidebar open button - easier to reach */}
      <div className="lg:hidden fixed bottom-4 left-4 z-30">
        <motion.button
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.4 }}
          onClick={toggleSidebar}
          className={`p-3 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000] ${
            sidebarOpen ? 'bg-white text-[#800000]' : 'bg-[#800000] text-white'
          }`}
        >
          {sidebarOpen ? <HiX className="h-6 w-6" /> : <HiMenu className="h-6 w-6" />}
        </motion.button>
      </div>
      
      {/* Desktop sidebar collapse/expand button */}
      <div className="hidden lg:block fixed z-30 transition-all duration-300 ease-in-out"
        style={{ 
          left: sidebarCollapsed ? '5rem' : '16rem',
          top: '50%',
          transform: 'translateY(-50%)'
        }}
      >
        <button 
          onClick={toggleSidebarCollapse}
          className="bg-white h-8 w-8 rounded-full shadow-md flex items-center justify-center text-gray-500 hover:text-[#800000] transition-colors duration-300 border border-gray-200"
        >
          {sidebarCollapsed ? (
            <HiChevronRight className="h-5 w-5" />
          ) : (
            <HiChevronLeft className="h-5 w-5" />
          )}
        </button>
      </div>
      
      {/* Main content area - ensure initial margins match collapsed state */}
      <div 
        className="flex flex-col flex-1 overflow-hidden transition-all duration-300 ease-in-out"
        style={{ 
          marginLeft: sidebarCollapsed ? '5rem' : '0rem',
        }}
      >
        <ClientNavbar 
          openSidebar={toggleSidebar} 
          isSidebarOpen={sidebarOpen}
          user={user}
          dashboardPath={dashboardPath}
        />
        
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          {/* Page content container with animations */}
          <div className="py-6 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto">
            {/* Welcome alert */}
            <AnimatePresence>
              {showWelcome && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mb-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-md shadow-sm"
                >
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <HiOutlineExclamation className="h-5 w-5 text-blue-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-blue-700">
                        Welcome back, {user?.firstName || 'User'}! You have {notifications.length || '3'} new notifications.
                      </p>
                    </div>
                    <div className="ml-auto pl-3">
                      <div className="-mx-1.5 -my-1.5">
                        <button
                          onClick={() => setShowWelcome(false)}
                          className="inline-flex bg-blue-50 rounded-md p-1.5 text-blue-500 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <span className="sr-only">Dismiss</span>
                          <HiX className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Page loading animation */}
            <AnimatePresence>
              {pageLoading ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full flex justify-center items-center py-12"
                >
                  <div className="animate-pulse flex space-x-4 max-w-lg w-full">
                    <div className="flex-1 space-y-6 py-1">
                      <div className="h-2 bg-gray-200 rounded"></div>
                      <div className="space-y-3">
                        <div className="grid grid-cols-3 gap-4">
                          <div className="h-2 bg-gray-200 rounded col-span-2"></div>
                          <div className="h-2 bg-gray-200 rounded col-span-1"></div>
                        </div>
                        <div className="h-2 bg-gray-200 rounded"></div>
                      </div>
                      <div className="h-32 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="min-h-[80vh]"
                >
                  <Outlet />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Footer */}
            <motion.footer
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-10 pt-6 border-t border-gray-200"
            >
              <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center">
                  <div className="text-sm text-gray-500 mb-4 md:mb-0">
                    &copy; {new Date().getFullYear()} PSN Attorneys Portal
                  </div>
                  <div className="flex space-x-6 text-sm text-gray-500">
                    <a 
                      href="#" 
                      className="hover:text-[#800000] transition-colors duration-300"
                    >
                      Privacy Policy
                    </a>
                    <a 
                      href="#" 
                      className="hover:text-[#800000] transition-colors duration-300"
                    >
                      Terms of Service
                    </a>
                    <a 
                      href="#" 
                      className="hover:text-[#800000] transition-colors duration-300"
                    >
                      Support
                    </a>
                  </div>
                </div>
              </div>
            </motion.footer>
          </div>
        </main>
      </div>
      
      {/* Quick help button */}
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="fixed bottom-4 right-4 z-30"
      >
        <button 
          className="bg-[#800000] shadow-lg p-3 rounded-full text-white hover:bg-[#600000] transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
          onClick={() => {
            // You could trigger a help modal here
            console.log('Help button clicked');
          }}
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      </motion.div>
    </div>
  );
};

export default ClientLayout;