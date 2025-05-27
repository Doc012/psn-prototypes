import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { 
  HiOutlineUser, 
  HiOutlineUserGroup, 
  HiOutlineBriefcase, 
  HiOutlineDocumentText,
  HiOutlineShieldCheck,
  HiOutlineCash,
  HiOutlineExclamationCircle,
  HiOutlineChartBar,
  HiOutlineCheckCircle,
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineUserAdd,
  HiOutlineDocumentAdd,
  HiOutlineAnnotation
} from 'react-icons/hi';

const AdminDashboardPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeAttorneys: 0,
    activeClients: 0,
    totalCases: 0,
    activeCases: 0,
    revenueThisMonth: 0,
    pendingInvoices: 0
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentCases, setRecentCases] = useState([]);
  const [systemAlerts, setSystemAlerts] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  
  // Mock data for users
  const mockUsers = [
    {
      id: 1,
      name: 'John Peterson',
      email: 'john.peterson@psnattorneys.com',
      role: 'Attorney',
      status: 'Active',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      createdAt: '2023-01-15T09:30:00Z'
    },
    {
      id: 2,
      name: 'Sarah Nguyen',
      email: 'sarah.nguyen@psnattorneys.com',
      role: 'Attorney',
      status: 'Active',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      createdAt: '2023-02-10T14:20:00Z'
    },
    {
      id: 3,
      name: 'Michael Patel',
      email: 'michael.patel@psnattorneys.com',
      role: 'Attorney',
      status: 'Active',
      avatarUrl: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      createdAt: '2023-03-05T11:45:00Z'
    },
    {
      id: 101,
      name: 'Sarah Smith',
      email: 'sarah.smith@example.com',
      role: 'Client',
      status: 'Active',
      avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      createdAt: '2023-05-12T10:15:00Z'
    },
    {
      id: 102,
      name: 'Robert Williams',
      email: 'robert.williams@example.com',
      role: 'Client',
      status: 'Active',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      createdAt: '2023-05-18T09:05:00Z'
    }
  ];
  
  // Mock data for cases
  const mockCases = [
    {
      id: 1,
      title: 'Smith v. Johnson',
      caseNumber: 'PI-2023-1452',
      type: 'Personal Injury',
      status: 'Active',
      assignedAttorney: 'Sarah Nguyen',
      client: 'Sarah Smith',
      startDate: '2023-05-12',
      lastActivity: '2023-05-20'
    },
    {
      id: 2,
      title: 'Estate of Williams',
      caseNumber: 'PR-2023-0783',
      type: 'Estate Planning',
      status: 'Active',
      assignedAttorney: 'John Peterson',
      client: 'Robert Williams',
      startDate: '2023-04-03',
      lastActivity: '2023-05-18'
    },
    {
      id: 3,
      title: 'Brown LLC Contract',
      caseNumber: 'CL-2023-0251',
      type: 'Corporate',
      status: 'Pending',
      assignedAttorney: 'John Peterson',
      client: 'Thomas Brown',
      startDate: '2023-05-01',
      lastActivity: '2023-05-15'
    },
    {
      id: 4,
      title: 'Jones Divorce',
      caseNumber: 'FL-2023-0592',
      type: 'Family Law',
      status: 'Active',
      assignedAttorney: 'Michael Patel',
      client: 'Amanda Jones',
      startDate: '2023-02-15',
      lastActivity: '2023-05-19'
    }
  ];
  
  // Mock system alerts
  const mockAlerts = [
    {
      id: 1,
      type: 'security',
      title: 'Security Alert',
      message: 'Multiple failed login attempts detected for user account michael.patel@psnattorneys.com',
      severity: 'high',
      timestamp: '2023-05-20T15:30:00Z',
      resolved: false
    },
    {
      id: 2,
      type: 'system',
      title: 'System Maintenance',
      message: 'Scheduled maintenance planned for May 25, 2023 from 11:00 PM to 2:00 AM EDT.',
      severity: 'medium',
      timestamp: '2023-05-18T09:00:00Z',
      resolved: false
    },
    {
      id: 3,
      type: 'billing',
      title: 'Billing Issue',
      message: 'Invoice #INV-2023-5612 was declined due to expired payment method.',
      severity: 'medium',
      timestamp: '2023-05-19T10:45:00Z',
      resolved: true
    },
    {
      id: 4,
      type: 'security',
      title: 'New Device Login',
      message: 'New device login detected for user john.peterson@psnattorneys.com from IP 192.168.1.105.',
      severity: 'low',
      timestamp: '2023-05-17T13:20:00Z',
      resolved: true
    }
  ];
  
  // Mock upcoming events
  const mockEvents = [
    {
      id: 1,
      title: 'New User Training',
      type: 'Training',
      description: 'Orientation for new employees and system training',
      date: '2023-05-24',
      time: '10:00 AM'
    },
    {
      id: 2,
      title: 'Quarterly Billing Review',
      type: 'Meeting',
      description: 'Review of Q2 billing and financial projections',
      date: '2023-05-30',
      time: '2:00 PM'
    },
    {
      id: 3,
      title: 'System Maintenance',
      type: 'Maintenance',
      description: 'Scheduled downtime for system updates',
      date: '2023-05-25',
      time: '11:00 PM'
    },
    {
      id: 4,
      title: 'Security Protocol Update',
      type: 'Admin',
      description: 'Implementation of new security measures',
      date: '2023-06-02',
      time: '9:00 AM'
    }
  ];
  
  // Load data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate API delay
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Calculate stats from mock data
        const attorneys = mockUsers.filter(user => user.role === 'Attorney' && user.status === 'Active');
        const clients = mockUsers.filter(user => user.role === 'Client' && user.status === 'Active');
        const activeCases = mockCases.filter(c => c.status === 'Active');
        
        // Set statistics
        setStats({
          totalUsers: mockUsers.length,
          activeAttorneys: attorneys.length,
          activeClients: clients.length,
          totalCases: mockCases.length,
          activeCases: activeCases.length,
          revenueThisMonth: 98750,
          pendingInvoices: 12
        });
        
        // Set recent users (sort by most recent)
        setRecentUsers(
          [...mockUsers].sort((a, b) => 
            new Date(b.createdAt) - new Date(a.createdAt)
          ).slice(0, 5)
        );
        
        // Set recent cases (sort by most recent activity)
        setRecentCases(
          [...mockCases].sort((a, b) => 
            new Date(b.lastActivity) - new Date(a.lastActivity)
          ).slice(0, 5)
        );
        
        // Set system alerts (sort by most recent and unresolved first)
        setSystemAlerts(
          [...mockAlerts].sort((a, b) => {
            // Sort by unresolved first
            if (a.resolved !== b.resolved) {
              return a.resolved ? 1 : -1;
            }
            // Then by timestamp (most recent first)
            return new Date(b.timestamp) - new Date(a.timestamp);
          })
        );
        
        // Set upcoming events (sort by nearest date)
        setUpcomingEvents(
          [...mockEvents].sort((a, b) => 
            new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`)
          )
        );
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching admin dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Format date helper
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };
  
  // Get relative time
  const getRelativeTime = (timestamp) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffInMs = now - date;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    
    if (diffInDays > 0) {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    } else if (diffInHours > 0) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else if (diffInMinutes > 0) {
      return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  };
  
  // Get alert type icon
  const getAlertIcon = (type) => {
    switch (type) {
      case 'security':
        return <HiOutlineShieldCheck className="h-5 w-5 text-red-500" />;
      case 'system':
        return <HiOutlineExclamationCircle className="h-5 w-5 text-blue-500" />;
      case 'billing':
        return <HiOutlineCash className="h-5 w-5 text-yellow-500" />;
      default:
        return <HiOutlineExclamationCircle className="h-5 w-5 text-gray-500" />;
    }
  };
  
  // Get severity class
  const getSeverityClass = (severity) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Get status badge color
  const getStatusColor = (status) => {
    switch(status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Inactive': return 'bg-red-100 text-red-800';
      case 'Closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };
  
  // Get event type icon
  const getEventIcon = (type) => {
    switch (type) {
      case 'Training':
        return <HiOutlineUserGroup className="h-5 w-5 text-blue-500" />;
      case 'Meeting':
        return <HiOutlineAnnotation className="h-5 w-5 text-purple-500" />;
      case 'Maintenance':
        return <HiOutlineClock className="h-5 w-5 text-yellow-500" />;
      case 'Admin':
        return <HiOutlineShieldCheck className="h-5 w-5 text-green-500" />;
      default:
        return <HiOutlineCalendar className="h-5 w-5 text-gray-500" />;
    }
  };
  
  if (loading) {
    return (
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="flex justify-center items-center h-64">
            <div className="flex flex-col items-center">
              <svg className="animate-spin h-10 w-10 text-[#800000]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="mt-4 text-gray-600">Loading admin dashboard...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <HiOutlineExclamationCircle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  {error}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Admin Dashboard</h1>
          <span className="text-sm text-gray-500">
            Welcome back, {user?.firstName || 'Admin'} | {new Date().toLocaleDateString()}
          </span>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="py-4">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <HiOutlineUserGroup className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">{stats.totalUsers}</div>
                        <div className="ml-4">
                          <span className="text-sm text-gray-500">
                            {stats.activeAttorneys} attorneys / {stats.activeClients} clients
                          </span>
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <Link to="/users" className="font-medium text-[#800000] hover:text-[#600000]">View all users</Link>
                </div>
              </div>
            </div>
            
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <HiOutlineBriefcase className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Active Cases</dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">{stats.activeCases}</div>
                        <div className="ml-4">
                          <span className="text-sm text-gray-500">of {stats.totalCases} total</span>
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <Link to="/cases" className="font-medium text-[#800000] hover:text-[#600000]">View all cases</Link>
                </div>
              </div>
            </div>
            
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <HiOutlineCash className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Monthly Revenue</dt>
                      <dd>
                        <div className="text-2xl font-semibold text-gray-900">{formatCurrency(stats.revenueThisMonth)}</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <Link to="/billing" className="font-medium text-[#800000] hover:text-[#600000]">View finances</Link>
                </div>
              </div>
            </div>
            
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <HiOutlineDocumentText className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Pending Invoices</dt>
                      <dd>
                        <div className="text-2xl font-semibold text-gray-900">{stats.pendingInvoices}</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <Link to="/invoices" className="font-medium text-[#800000] hover:text-[#600000]">View invoices</Link>
                </div>
              </div>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="bg-white shadow rounded-lg mb-6">
            <div className="px-6 py-5 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Quick Actions</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
                <Link to="/users/new" className="text-center py-4 px-4 rounded-md bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                  <HiOutlineUserAdd className="h-8 w-8 text-[#800000] mx-auto" />
                  <span className="mt-2 block text-sm font-medium text-gray-900">Add User</span>
                </Link>
                
                <Link to="/cases/new" className="text-center py-4 px-4 rounded-md bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                  <HiOutlineDocumentAdd className="h-8 w-8 text-[#800000] mx-auto" />
                  <span className="mt-2 block text-sm font-medium text-gray-900">Create Case</span>
                </Link>
                
                <Link to="/invoices/create" className="text-center py-4 px-4 rounded-md bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                  <HiOutlineCash className="h-8 w-8 text-[#800000] mx-auto" />
                  <span className="mt-2 block text-sm font-medium text-gray-900">Generate Invoice</span>
                </Link>
                
                <Link to="/reports" className="text-center py-4 px-4 rounded-md bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                  <HiOutlineChartBar className="h-8 w-8 text-[#800000] mx-auto" />
                  <span className="mt-2 block text-sm font-medium text-gray-900">View Reports</span>
                </Link>
              </div>
            </div>
          </div>
          
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Recently Added Users */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-5 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Recently Added Users</h3>
              </div>
              <ul className="divide-y divide-gray-200">
                {recentUsers.length === 0 ? (
                  <li className="px-6 py-4 text-center text-gray-500">
                    No recent users found
                  </li>
                ) : (
                  recentUsers.map((user) => (
                    <li key={user.id} className="px-6 py-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <img 
                            className="h-10 w-10 rounded-full" 
                            src={user.avatarUrl} 
                            alt={user.name} 
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {user.name}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            {user.email}
                          </p>
                        </div>
                        <div>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                            {user.role}
                          </span>
                        </div>
                        <div className="text-sm text-gray-500">
                          {getRelativeTime(user.createdAt)}
                        </div>
                      </div>
                    </li>
                  ))
                )}
              </ul>
              <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
                <div className="text-sm">
                  <Link to="/users" className="font-medium text-[#800000] hover:text-[#600000]">View all users</Link>
                </div>
              </div>
            </div>
            
            {/* System Alerts */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-5 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">System Alerts</h3>
              </div>
              <ul className="divide-y divide-gray-200">
                {systemAlerts.length === 0 ? (
                  <li className="px-6 py-4 text-center text-gray-500">
                    No system alerts
                  </li>
                ) : (
                  systemAlerts.map((alert) => (
                    <li key={alert.id} className={`px-6 py-4 ${!alert.resolved ? 'bg-red-50' : ''}`}>
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          {getAlertIcon(alert.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center">
                            <p className="text-sm font-medium text-gray-900 truncate mr-2">
                              {alert.title}
                            </p>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityClass(alert.severity)}`}>
                              {alert.severity}
                            </span>
                            {alert.resolved && (
                              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                <HiOutlineCheckCircle className="mr-1 h-3 w-3" />
                                Resolved
                              </span>
                            )}
                          </div>
                          <p className="mt-1 text-sm text-gray-500">
                            {alert.message}
                          </p>
                          <div className="mt-1 text-xs text-gray-500">
                            {getRelativeTime(alert.timestamp)}
                          </div>
                        </div>
                        <div>
                          {!alert.resolved && (
                            <button
                              type="button"
                              className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                            >
                              Resolve
                            </button>
                          )}
                        </div>
                      </div>
                    </li>
                  ))
                )}
              </ul>
              <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
                <div className="text-sm">
                  <Link to="/alerts" className="font-medium text-[#800000] hover:text-[#600000]">View all alerts</Link>
                </div>
              </div>
            </div>
            
            {/* Recent Cases */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-5 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Cases</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Case
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Attorney
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Activity
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentCases.map((caseItem) => (
                      <tr key={caseItem.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-[#800000]">{caseItem.title}</div>
                          <div className="text-xs text-gray-500">{caseItem.caseNumber}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{caseItem.assignedAttorney}</div>
                          <div className="text-xs text-gray-500">Client: {caseItem.client}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(caseItem.status)}`}>
                            {caseItem.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(caseItem.lastActivity)}
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
            
            {/* Upcoming Events */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-5 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Upcoming Events</h3>
              </div>
              <ul className="divide-y divide-gray-200">
                {upcomingEvents.length === 0 ? (
                  <li className="px-6 py-4 text-center text-gray-500">
                    No upcoming events
                  </li>
                ) : (
                  upcomingEvents.map((event) => (
                    <li key={event.id} className="px-6 py-4">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 pt-0.5">
                          {getEventIcon(event.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center">
                            <p className="text-sm font-medium text-gray-900 truncate mr-2">
                              {event.title}
                            </p>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              {event.type}
                            </span>
                          </div>
                          <p className="mt-1 text-sm text-gray-500">
                            {event.description}
                          </p>
                        </div>
                        <div className="flex-shrink-0 text-right">
                          <p className="text-sm font-medium text-gray-900">
                            {formatDate(event.date)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {event.time}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))
                )}
              </ul>
              <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
                <div className="text-sm">
                  <Link to="/calendar" className="font-medium text-[#800000] hover:text-[#600000]">View calendar</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;