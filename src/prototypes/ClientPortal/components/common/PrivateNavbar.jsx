import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  HiOutlineMenu, 
  HiOutlineBell, 
  HiOutlineMailOpen,
  HiOutlineLogout,
  HiOutlineUser,
  HiOutlineCog
} from 'react-icons/hi';

const PrivateNavbar = ({ openSidebar }) => {
  const { currentUser, logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }
      
      if (
        notificationRef.current && 
        !notificationRef.current.contains(event.target)
      ) {
        setNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const mockNotifications = [
    {
      id: 1,
      title: 'Document Uploaded',
      message: 'Your case files have been updated',
      time: '2 hours ago',
      unread: true
    },
    {
      id: 2,
      title: 'Meeting Scheduled',
      message: 'Consultation on May 25th at 10 AM',
      time: '1 day ago',
      unread: false
    },
    {
      id: 3,
      title: 'Case Status Update',
      message: 'Your case #122 has moved to review',
      time: '3 days ago',
      unread: false
    }
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 z-10">
      <div className="px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              type="button"
              className="text-gray-500 hover:text-[#800000] focus:outline-none md:hidden"
              onClick={openSidebar}
            >
              <HiOutlineMenu className="h-6 w-6" />
            </button>

            <div className="flex-shrink-0 flex items-center ml-4 md:ml-0">
              <Link to="/dashboard" className="flex items-center">
                <span className="text-lg font-semibold text-[#800000]">
                  PSN Client Portal
                </span>
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Notifications dropdown */}
            <div className="relative" ref={notificationRef}>
              <button
                type="button"
                className="relative p-1 rounded-full text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
              >
                <span className="sr-only">View notifications</span>
                <HiOutlineBell className="h-6 w-6" />
                {mockNotifications.some(note => note.unread) && (
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                )}
              </button>
              
              {notificationsOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1 divide-y divide-gray-100">
                    <div className="px-4 py-3">
                      <p className="text-sm font-medium text-gray-900">Notifications</p>
                    </div>
                    
                    <div className="max-h-64 overflow-y-auto">
                      {mockNotifications.map((notification) => (
                        <a
                          key={notification.id}
                          href="#"
                          className={`flex px-4 py-3 hover:bg-gray-50 ${notification.unread ? 'bg-blue-50' : ''}`}
                        >
                          <div className="flex-shrink-0 bg-[#800000] rounded-full p-2 flex items-center justify-center">
                            <HiOutlineMailOpen className="h-5 w-5 text-white" />
                          </div>
                          <div className="ml-3 w-0 flex-1">
                            <p className={`text-sm font-medium text-gray-900 ${notification.unread ? 'font-semibold' : ''}`}>
                              {notification.title}
                            </p>
                            <p className="text-sm text-gray-500 truncate">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {notification.time}
                            </p>
                          </div>
                        </a>
                      ))}
                    </div>
                    
                    <div className="px-4 py-2 text-center">
                      <a href="#" className="text-sm font-medium text-[#800000] hover:text-[#600000]">
                        View all notifications
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile dropdown */}
            <div className="relative" ref={dropdownRef}>
              <div>
                <button
                  type="button"
                  className="flex items-center space-x-3 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000] rounded-full"
                  onClick={() => setProfileOpen(!profileOpen)}
                >
                  <span className="sr-only">Open user menu</span>
                  <img
                    className="h-8 w-8 rounded-full border border-gray-300"
                    src={currentUser?.avatar || "https://via.placeholder.com/40"}
                    alt="User avatar"
                  />
                  <div className="hidden md:flex md:flex-col md:items-start">
                    <span className="text-sm font-medium text-gray-700">
                      {currentUser?.firstName} {currentUser?.lastName}
                    </span>
                    <span className="text-xs text-gray-500 capitalize">
                      {currentUser?.role || 'User'}
                    </span>
                  </div>
                </button>
              </div>

              {profileOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    <Link
                      to="/dashboard/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setProfileOpen(false)}
                    >
                      <HiOutlineUser className="mr-3 h-5 w-5 text-gray-400" />
                      Your Profile
                    </Link>
                    <Link
                      to="/dashboard/settings"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setProfileOpen(false)}
                    >
                      <HiOutlineCog className="mr-3 h-5 w-5 text-gray-400" />
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <HiOutlineLogout className="mr-3 h-5 w-5 text-gray-400" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default PrivateNavbar;