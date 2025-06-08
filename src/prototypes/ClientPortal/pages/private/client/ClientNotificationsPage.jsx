import React, { useState, useEffect, Fragment } from 'react';
import { 
  HiOutlineBell, 
  HiOutlineCheckCircle,
  HiOutlineDocumentText, 
  HiOutlineCalendar, 
  HiOutlineCash, 
  HiOutlineChatAlt, 
  HiOutlineExclamation,
  HiOutlineInformationCircle,
  HiDotsVertical,
  HiX,
  HiOutlineTrash,
  HiOutlineEye,
  HiOutlineEyeOff
} from 'react-icons/hi';
import { Menu, Transition } from '@headlessui/react';
import { format, parseISO, isToday, isYesterday, formatDistanceToNow } from 'date-fns';

const ClientNotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Fetch notifications (mock data)
  useEffect(() => {
    const fetchNotifications = async () => {
      setIsLoading(true);
      
      // Simulate API call delay
      setTimeout(() => {
        const mockNotifications = [
          {
            id: 1,
            type: 'case_update',
            title: 'Case Update',
            message: 'Your case #CT-2023-0454 has been updated with new information.',
            date: '2025-06-05T10:30:00Z',
            isRead: false,
            isImportant: true,
            caseId: 'CT-2023-0454',
            icon: 'document'
          },
          {
            id: 2,
            type: 'document',
            title: 'New Document Available',
            message: 'A new document "Settlement Agreement" has been uploaded to your case file.',
            date: '2025-06-04T14:22:00Z',
            isRead: true,
            isImportant: false,
            documentId: 'DOC-2023-1254',
            icon: 'document'
          },
          {
            id: 3,
            type: 'appointment',
            title: 'Appointment Reminder',
            message: 'Reminder: You have a consultation with Atty. John Smith tomorrow at 10:00 AM.',
            date: '2025-06-03T09:15:00Z',
            isRead: false,
            isImportant: true,
            appointmentId: 'APT-2023-0345',
            icon: 'calendar'
          },
          {
            id: 4,
            type: 'invoice',
            title: 'New Invoice',
            message: 'Invoice #INV-2023-0872 for R2,500.00 has been issued. Payment is due by June 15, 2025.',
            date: '2025-06-02T16:45:00Z',
            isRead: true,
            isImportant: false,
            invoiceId: 'INV-2023-0872',
            icon: 'invoice'
          },
          {
            id: 5,
            type: 'message',
            title: 'New Message',
            message: 'You have received a new message from Atty. Sarah Johnson regarding your case.',
            date: '2025-06-02T11:20:00Z',
            isRead: false,
            isImportant: false,
            messageId: 'MSG-2023-0621',
            icon: 'message'
          },
          {
            id: 6,
            type: 'case_update',
            title: 'Case Status Change',
            message: 'Your case #CT-2023-0454 status has been changed to "In Negotiation".',
            date: '2025-06-01T14:10:00Z',
            isRead: true,
            isImportant: true,
            caseId: 'CT-2023-0454',
            icon: 'document'
          },
          {
            id: 7,
            type: 'system',
            title: 'System Maintenance',
            message: 'Our portal will be undergoing maintenance on June 10, 2025 from 22:00 to 00:00 SAST.',
            date: '2025-05-30T08:30:00Z',
            isRead: true,
            isImportant: false,
            icon: 'info'
          },
          {
            id: 8,
            type: 'document',
            title: 'Document Signed',
            message: 'The document "Power of Attorney" has been successfully signed by all parties.',
            date: '2025-05-29T15:45:00Z',
            isRead: true,
            isImportant: false,
            documentId: 'DOC-2023-1240',
            icon: 'document'
          },
          {
            id: 9,
            type: 'appointment',
            title: 'Appointment Changed',
            message: 'Your appointment on June 12, 2025 has been rescheduled to June 14, 2025 at 14:00 PM.',
            date: '2025-05-28T10:15:00Z',
            isRead: false,
            isImportant: true,
            appointmentId: 'APT-2023-0352',
            icon: 'calendar'
          },
          {
            id: 10,
            type: 'invoice',
            title: 'Payment Received',
            message: 'Your payment of R1,800.00 for Invoice #INV-2023-0840 has been received. Thank you!',
            date: '2025-05-25T09:30:00Z',
            isRead: true,
            isImportant: false,
            invoiceId: 'INV-2023-0840',
            icon: 'invoice'
          }
        ];

        setNotifications(mockNotifications);
        setIsLoading(false);
      }, 800);
    };

    fetchNotifications();
  }, []);

  // Format date for display
  const formatNotificationDate = (dateString) => {
    const date = parseISO(dateString);
    if (isToday(date)) {
      return `Today, ${format(date, 'h:mm a')}`;
    } else if (isYesterday(date)) {
      return `Yesterday, ${format(date, 'h:mm a')}`;
    } else if (date > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) {
      return formatDistanceToNow(date, { addSuffix: true });
    } else {
      return format(date, 'MMM d, yyyy');
    }
  };

  // Get icon component based on notification type
  const getNotificationIcon = (notification) => {
    switch(notification.icon) {
      case 'document':
        return <HiOutlineDocumentText className="h-6 w-6" />;
      case 'calendar':
        return <HiOutlineCalendar className="h-6 w-6" />;
      case 'invoice':
        return <HiOutlineCash className="h-6 w-6" />;
      case 'message':
        return <HiOutlineChatAlt className="h-6 w-6" />;
      case 'warning':
        return <HiOutlineExclamation className="h-6 w-6" />;
      case 'info':
        return <HiOutlineInformationCircle className="h-6 w-6" />;
      default:
        return <HiOutlineBell className="h-6 w-6" />;
    }
  };

  // Get icon background color based on notification type
  const getIconBackgroundColor = (notification) => {
    switch(notification.type) {
      case 'case_update':
        return 'bg-[#800000] bg-opacity-10 text-[#800000]';
      case 'document':
        return 'bg-blue-100 text-blue-600';
      case 'appointment':
        return 'bg-yellow-100 text-yellow-600';
      case 'invoice':
        return 'bg-green-100 text-green-600';
      case 'message':
        return 'bg-purple-100 text-purple-600';
      case 'system':
        return 'bg-gray-100 text-gray-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  // Mark notification as read
  const markAsRead = (id) => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => 
        notification.id === id ? { ...notification, isRead: true } : notification
      )
    );
  };

  // Mark notification as unread
  const markAsUnread = (id) => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => 
        notification.id === id ? { ...notification, isRead: false } : notification
      )
    );
  };

  // Toggle important status
  const toggleImportant = (id) => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => 
        notification.id === id ? { ...notification, isImportant: !notification.isImportant } : notification
      )
    );
  };

  // Delete notification
  const deleteNotification = (id) => {
    setNotifications(prevNotifications => 
      prevNotifications.filter(notification => notification.id !== id)
    );
  };

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => ({ ...notification, isRead: true }))
    );
  };

  // Filter notifications based on active tab
  const filteredNotifications = notifications.filter(notification => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        notification.title.toLowerCase().includes(query) ||
        notification.message.toLowerCase().includes(query)
      );
    }
    
    switch(activeTab) {
      case 'unread':
        return !notification.isRead;
      case 'important':
        return notification.isImportant;
      case 'case_updates':
        return notification.type === 'case_update';
      case 'documents':
        return notification.type === 'document';
      case 'appointments':
        return notification.type === 'appointment';
      case 'invoices':
        return notification.type === 'invoice';
      case 'messages':
        return notification.type === 'message';
      default:
        return true;
    }
  });

  // Count unread notifications
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Notifications</h1>
          <div className="flex items-center space-x-3">
            {unreadCount > 0 && (
              <button 
                onClick={markAllAsRead}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
              >
                <HiOutlineCheckCircle className="-ml-0.5 mr-2 h-4 w-4" />
                Mark all as read
              </button>
            )}
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-4">
        <div className="py-4">
          {/* Search bar */}
          <div className="mb-6">
            <div className="relative rounded-md shadow-sm">
              <input
                type="text"
                className="focus:ring-[#800000] focus:border-[#800000] block w-full pr-10 sm:text-sm border-gray-300 rounded-md"
                placeholder="Search notifications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-6 overflow-x-auto" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('all')}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'all'
                    ? 'border-[#800000] text-[#800000]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveTab('unread')}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'unread'
                    ? 'border-[#800000] text-[#800000]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Unread
                {unreadCount > 0 && (
                  <span className="ml-2 py-0.5 px-2 text-xs rounded-full bg-[#800000] text-white">
                    {unreadCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('important')}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'important'
                    ? 'border-[#800000] text-[#800000]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Important
              </button>
              <button
                onClick={() => setActiveTab('case_updates')}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'case_updates'
                    ? 'border-[#800000] text-[#800000]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Case Updates
              </button>
              <button
                onClick={() => setActiveTab('documents')}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'documents'
                    ? 'border-[#800000] text-[#800000]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Documents
              </button>
              <button
                onClick={() => setActiveTab('appointments')}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'appointments'
                    ? 'border-[#800000] text-[#800000]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Appointments
              </button>
              <button
                onClick={() => setActiveTab('invoices')}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'invoices'
                    ? 'border-[#800000] text-[#800000]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Invoices
              </button>
              <button
                onClick={() => setActiveTab('messages')}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'messages'
                    ? 'border-[#800000] text-[#800000]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Messages
              </button>
            </nav>
          </div>
          
          {/* Notifications list */}
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            {isLoading ? (
              <div className="p-4">
                <div className="animate-pulse space-y-4">
                  {[...Array(5)].map((_, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="h-12 w-12 rounded-full bg-gray-200"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                        <div className="h-8 bg-gray-200 rounded w-full"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div className="py-12 text-center">
                <HiOutlineBell className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No notifications</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchQuery 
                    ? "No notifications match your search." 
                    : "You don't have any notifications at the moment."}
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {filteredNotifications.map((notification) => (
                  <li 
                    key={notification.id} 
                    className={`${
                      notification.isRead ? 'bg-white' : 'bg-gray-50'
                    } hover:bg-gray-50 transition-colors duration-150 ease-in-out`}
                  >
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-start">
                        <div className={`flex-shrink-0 rounded-full p-2 ${getIconBackgroundColor(notification)}`}>
                          {getNotificationIcon(notification)}
                        </div>
                        <div className="ml-4 flex-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <p className={`text-sm font-medium ${notification.isRead ? 'text-gray-700' : 'text-gray-900'}`}>
                                {notification.title}
                              </p>
                              {notification.isImportant && (
                                <span className="ml-2 py-0.5 px-2 text-xs rounded-full bg-red-100 text-red-800">
                                  Important
                                </span>
                              )}
                              {!notification.isRead && (
                                <span className="ml-2 h-2 w-2 flex-shrink-0 rounded-full bg-[#800000]" aria-hidden="true"></span>
                              )}
                            </div>
                            <div className="flex items-center">
                              <span className="text-xs text-gray-500">
                                {formatNotificationDate(notification.date)}
                              </span>
                              <Menu as="div" className="ml-3 relative inline-block text-left">
                                <div>
                                  <Menu.Button className="rounded-full flex items-center text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]">
                                    <span className="sr-only">Open options</span>
                                    <HiDotsVertical className="h-5 w-5" aria-hidden="true" />
                                  </Menu.Button>
                                </div>

                                <Transition
                                  as={Fragment}
                                  enter="transition ease-out duration-100"
                                  enterFrom="transform opacity-0 scale-95"
                                  enterTo="transform opacity-100 scale-100"
                                  leave="transition ease-in duration-75"
                                  leaveFrom="transform opacity-100 scale-100"
                                  leaveTo="transform opacity-0 scale-95"
                                >
                                  <Menu.Items className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                                    <div className="py-1">
                                      {notification.isRead ? (
                                        <Menu.Item>
                                          {({ active }) => (
                                            <button
                                              onClick={() => markAsUnread(notification.id)}
                                              className={`${
                                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                              } w-full text-left px-4 py-2 text-sm flex items-center`}
                                            >
                                              <HiOutlineEye className="mr-3 h-5 w-5 text-gray-400" />
                                              Mark as unread
                                            </button>
                                          )}
                                        </Menu.Item>
                                      ) : (
                                        <Menu.Item>
                                          {({ active }) => (
                                            <button
                                              onClick={() => markAsRead(notification.id)}
                                              className={`${
                                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                              } w-full text-left px-4 py-2 text-sm flex items-center`}
                                            >
                                              <HiOutlineEyeOff className="mr-3 h-5 w-5 text-gray-400" />
                                              Mark as read
                                            </button>
                                          )}
                                        </Menu.Item>
                                      )}
                                      <Menu.Item>
                                        {({ active }) => (
                                          <button
                                            onClick={() => toggleImportant(notification.id)}
                                            className={`${
                                              active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                            } w-full text-left px-4 py-2 text-sm flex items-center`}
                                          >
                                            <HiOutlineExclamation className="mr-3 h-5 w-5 text-gray-400" />
                                            {notification.isImportant ? 'Remove importance' : 'Mark as important'}
                                          </button>
                                        )}
                                      </Menu.Item>
                                      <Menu.Item>
                                        {({ active }) => (
                                          <button
                                            onClick={() => deleteNotification(notification.id)}
                                            className={`${
                                              active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                            } w-full text-left px-4 py-2 text-sm flex items-center`}
                                          >
                                            <HiOutlineTrash className="mr-3 h-5 w-5 text-gray-400" />
                                            Delete
                                          </button>
                                        )}
                                      </Menu.Item>
                                    </div>
                                  </Menu.Items>
                                </Transition>
                              </Menu>
                            </div>
                          </div>
                          <p className={`mt-1 text-sm ${notification.isRead ? 'text-gray-500' : 'text-gray-700'}`}>
                            {notification.message}
                          </p>
                          <div className="mt-2">
                            <button 
                              className="inline-flex items-center text-sm font-medium text-[#800000] hover:text-[#600000]"
                              onClick={() => markAsRead(notification.id)}
                            >
                              View Details
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientNotificationsPage;
