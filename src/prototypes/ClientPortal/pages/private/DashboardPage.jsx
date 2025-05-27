import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  HiOutlineDocumentText, 
  HiOutlineCalendar, 
  HiOutlineChatAlt, 
  HiOutlineClipboardCheck,
  HiOutlineCash,
  HiOutlineExclamation
} from 'react-icons/hi';

const DashboardPage = () => {
  const { user } = useAuth();
  
  // Sample data - in a real app, this would come from API calls
  const recentCases = [
    { id: 1, title: 'Smith v. Johnson', type: 'Personal Injury', status: 'Active', nextHearing: '2023-06-15', priority: 'High' },
    { id: 2, title: 'Estate of Williams', type: 'Probate', status: 'Active', nextHearing: '2023-07-10', priority: 'Medium' },
    { id: 3, title: 'Brown LLC Contract', type: 'Corporate', status: 'Pending', nextHearing: null, priority: 'Low' },
  ];
  
  const upcomingEvents = [
    { id: 1, title: 'Case Review Meeting', date: '2023-05-25', time: '10:00 AM', type: 'Meeting' },
    { id: 2, title: 'Document Submission Deadline', date: '2023-06-01', time: null, type: 'Deadline' },
    { id: 3, title: 'Court Hearing', date: '2023-06-15', time: '9:30 AM', type: 'Hearing' },
  ];
  
  const notifications = [
    { id: 1, message: 'New document uploaded: Settlement Agreement', date: '2023-05-20', read: false },
    { id: 2, message: 'Attorney left a new comment on your case', date: '2023-05-19', read: true },
    { id: 3, message: 'Upcoming deadline reminder: Document Submission', date: '2023-05-18', read: true },
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'High': return 'text-red-600';
      case 'Medium': return 'text-yellow-600';
      case 'Low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };
  
  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="py-4">
          {/* Welcome card */}
          <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800">Welcome back, {user?.firstName || 'Client'}</h2>
              <p className="mt-2 text-gray-600">
                Here's an overview of your legal matters and upcoming events.
              </p>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <HiOutlineDocumentText className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Active Cases</dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">3</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <Link to="/cases" className="font-medium text-[#800000] hover:text-[#600000]">View all</Link>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <HiOutlineCalendar className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Upcoming Events</dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">5</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <Link to="/calendar" className="font-medium text-[#800000] hover:text-[#600000]">View calendar</Link>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <HiOutlineChatAlt className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Messages</dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">2</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <Link to="/messages" className="font-medium text-[#800000] hover:text-[#600000]">View messages</Link>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <HiOutlineClipboardCheck className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Pending Documents</dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">4</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <Link to="/documents" className="font-medium text-[#800000] hover:text-[#600000]">View documents</Link>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Cases */}
          <div className="bg-white shadow rounded-lg mb-8">
            <div className="px-6 py-5 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Cases</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Case Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Next Hearing
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Priority
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">View</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentCases.map((caseItem) => (
                    <tr key={caseItem.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{caseItem.title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{caseItem.type}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(caseItem.status)}`}>
                          {caseItem.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {caseItem.nextHearing ? new Date(caseItem.nextHearing).toLocaleDateString() : 'Not scheduled'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm ${getPriorityColor(caseItem.priority)}`}>{caseItem.priority}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link to={`/cases/${caseItem.id}`} className="text-[#800000] hover:text-[#600000]">View</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
              <div className="text-sm">
                <Link to="/cases" className="font-medium text-[#800000] hover:text-[#600000]">View all cases</Link>
              </div>
            </div>
          </div>

          {/* Two-column layout for mobile responsiveness */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Upcoming Events */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-5 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Upcoming Events</h3>
              </div>
              <div className="p-6 overflow-y-auto" style={{ maxHeight: '350px' }}>
                <ul className="divide-y divide-gray-200">
                  {upcomingEvents.map((event) => (
                    <li key={event.id} className="py-4">
                      <div className="flex space-x-3">
                        <div className="flex-shrink-0">
                          <HiOutlineCalendar className="h-6 w-6 text-gray-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {event.title}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(event.date).toLocaleDateString()} {event.time && `at ${event.time}`}
                          </p>
                          <p className="mt-1 text-sm text-gray-500">
                            Type: {event.type}
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          <Link
                            to={`/calendar/${event.id}`}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-xs rounded-md text-[#800000] hover:text-[#600000]"
                          >
                            Details
                          </Link>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
                <div className="text-sm">
                  <Link to="/calendar" className="font-medium text-[#800000] hover:text-[#600000]">View calendar</Link>
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-5 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Notifications</h3>
              </div>
              <div className="p-6 overflow-y-auto" style={{ maxHeight: '350px' }}>
                <ul className="divide-y divide-gray-200">
                  {notifications.map((notification) => (
                    <li key={notification.id} className="py-4">
                      <div className="flex space-x-3">
                        <div className="flex-shrink-0">
                          {!notification.read && (
                            <span className="inline-block h-2 w-2 rounded-full bg-[#800000]"></span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm ${notification.read ? 'text-gray-500' : 'font-medium text-gray-900'}`}>
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(notification.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
                <div className="text-sm">
                  <Link to="/notifications" className="font-medium text-[#800000] hover:text-[#600000]">View all notifications</Link>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white shadow rounded-lg mt-8">
            <div className="px-6 py-5 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Quick Actions</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
                <Link to="/documents/upload" className="text-center py-3 px-4 rounded-md bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                  <HiOutlineDocumentText className="h-8 w-8 text-[#800000] mx-auto" />
                  <span className="mt-2 block text-sm font-medium text-gray-900">Upload Document</span>
                </Link>
                
                <Link to="/messages/new" className="text-center py-3 px-4 rounded-md bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                  <HiOutlineChatAlt className="h-8 w-8 text-[#800000] mx-auto" />
                  <span className="mt-2 block text-sm font-medium text-gray-900">New Message</span>
                </Link>
                
                <Link to="/invoices" className="text-center py-3 px-4 rounded-md bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                  <HiOutlineCash className="h-8 w-8 text-[#800000] mx-auto" />
                  <span className="mt-2 block text-sm font-medium text-gray-900">View Invoices</span>
                </Link>
                
                <Link to="/support" className="text-center py-3 px-4 rounded-md bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                  <HiOutlineExclamation className="h-8 w-8 text-[#800000] mx-auto" />
                  <span className="mt-2 block text-sm font-medium text-gray-900">Get Support</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;