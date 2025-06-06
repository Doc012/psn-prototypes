import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { 
  HiOutlineMenu, 
  HiOutlineBell, 
  HiOutlineMailOpen,
  HiOutlineLogout,
  HiOutlineUser,
  HiOutlineCog,
  HiOutlineQuestionMarkCircle,
  HiOutlineDocumentText
} from 'react-icons/hi';

const ClientNavbar = ({ openSidebar }) => {
  const { user, logout } = useAuth();
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
      navigate('/client-portal/login');
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
              <Link to="/client-portal/dashboard" className="flex items-center">
                <span className="text-lg font-semibold text-[#800000]">
                  Client Dashboard
                </span>
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Quick actions */}
            <div className="hidden md:flex space-x-2">
              <Link
                to="/client-portal/documents/upload"
                className="p-1 rounded-full text-gray-500 hover:text-[#800000] focus:outline-none"
                title="Upload Document"
              >
                <HiOutlineDocumentText className="h-6 w-6" />
              </Link>
              <Link
                to="/client-portal/support"
                className="p-1 rounded-full text-gray-500 hover:text-[#800000] focus:outline-none"
                title="Get Support"
              >
                <HiOutlineQuestionMarkCircle className="h-6 w-6" />
              </Link>
            </div>
            
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
                      <Link to="/client-portal/notifications" className="text-sm font-medium text-[#800000] hover:text-[#600000]">
                        View all notifications
                      </Link>
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
                    src={user?.avatar || "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740"}
                    alt="User avatar"
                  />
                  <div className="hidden md:flex md:flex-col md:items-start">
                    <span className="text-sm font-medium text-gray-700">
                      {user?.firstName} {user?.lastName}
                    </span>
                    <span className="text-xs text-gray-500 capitalize">
                      Client
                    </span>
                  </div>
                </button>
              </div>

              {profileOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    <Link
                      to="/client-portal/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setProfileOpen(false)}
                    >
                      <HiOutlineUser className="mr-3 h-5 w-5 text-gray-400" />
                      Your Profile
                    </Link>
                    <Link
                      to="/client-portal/cases"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setProfileOpen(false)}
                    >
                      <HiOutlineDocumentText className="mr-3 h-5 w-5 text-gray-400" />
                      My Cases
                    </Link>
                    <Link
                      to="/client-portal/support"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setProfileOpen(false)}
                    >
                      <HiOutlineQuestionMarkCircle className="mr-3 h-5 w-5 text-gray-400" />
                      Get Support
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

export default ClientNavbar;