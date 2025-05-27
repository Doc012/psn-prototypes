import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { 
  HiOutlineDocumentText, 
  HiOutlineCalendar, 
  HiOutlineUserGroup, 
  HiOutlineClock,
  HiOutlineBriefcase,
  HiOutlineChartBar,
  HiOutlineChatAlt2,
  HiOutlineClipboardCheck,
  HiChevronRight,
  HiChevronDown,
  HiOutlineExclamationCircle
} from 'react-icons/hi';

const AttorneyDashboardPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    activeCases: 0,
    clientsRepresented: 0,
    documentsRequiringReview: 0,
    upcomingEvents: 0,
    billableHours: {
      value: 0,
      change: 0,
      timeframe: 'this month'
    },
    revenueGenerated: {
      value: 0,
      change: 0,
      timeframe: 'this month'
    }
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState([]);
  const [clientMessages, setClientMessages] = useState([]);
  const [openCaseId, setOpenCaseId] = useState(null);
  
  // Mock data for cases
  const cases = [
    {
      id: 1,
      title: 'Smith v. Johnson',
      type: 'Personal Injury',
      client: {
        id: 101,
        name: 'Sarah Smith',
        email: 'sarah.smith@example.com',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      },
      status: 'Active',
      priority: 'High',
      lastActivity: '2023-05-20',
      deadlines: [
        { id: 1, title: 'Submit Settlement Proposal', date: '2023-06-01' },
        { id: 2, title: 'Expert Witness Deposition', date: '2023-06-15' }
      ]
    },
    {
      id: 2,
      title: 'Estate of Williams',
      type: 'Estate Planning',
      client: {
        id: 102,
        name: 'Robert Williams Jr.',
        email: 'robert.williams@example.com',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      },
      status: 'Active',
      priority: 'Medium',
      lastActivity: '2023-05-18',
      deadlines: [
        { id: 3, title: 'File Probate Documents', date: '2023-06-20' }
      ]
    },
    {
      id: 3,
      title: 'Jones Divorce',
      type: 'Family Law',
      client: {
        id: 103,
        name: 'Amanda Jones',
        email: 'amanda.jones@example.com',
        avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      },
      status: 'Active',
      priority: 'High',
      lastActivity: '2023-05-19',
      deadlines: [
        { id: 4, title: 'Mediation Session', date: '2023-05-30' },
        { id: 5, title: 'Court Hearing', date: '2023-06-25' }
      ]
    },
    {
      id: 4,
      title: 'Brown LLC Contract',
      type: 'Corporate',
      client: {
        id: 104,
        name: 'Thomas Brown',
        email: 'thomas.brown@brownllc.com',
        avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      },
      status: 'Pending',
      priority: 'Low',
      lastActivity: '2023-05-15',
      deadlines: [
        { id: 6, title: 'Contract Review Completion', date: '2023-06-05' }
      ]
    }
  ];
  
  // Mock recent activity data
  const mockActivities = [
    { 
      id: 1, 
      type: 'comment', 
      description: 'You added a comment on Smith v. Johnson case',
      caseId: 1,
      caseName: 'Smith v. Johnson',
      timestamp: '2023-05-20T14:30:00Z' 
    },
    { 
      id: 2, 
      type: 'document', 
      description: 'You uploaded "Settlement Analysis" document to Jones Divorce case',
      caseId: 3,
      caseName: 'Jones Divorce',
      timestamp: '2023-05-19T11:15:00Z' 
    },
    { 
      id: 3, 
      type: 'meeting', 
      description: 'Meeting with Robert Williams Jr. scheduled for Estate of Williams case',
      caseId: 2,
      caseName: 'Estate of Williams',
      timestamp: '2023-05-18T16:45:00Z' 
    },
    { 
      id: 4, 
      type: 'billing', 
      description: 'You recorded 3.5 billable hours for Brown LLC Contract case',
      caseId: 4,
      caseName: 'Brown LLC Contract',
      timestamp: '2023-05-18T10:20:00Z' 
    },
    { 
      id: 5, 
      type: 'document', 
      description: 'You reviewed "Medical Records" document for Smith v. Johnson case',
      caseId: 1,
      caseName: 'Smith v. Johnson',
      timestamp: '2023-05-17T09:45:00Z' 
    }
  ];
  
  // Mock client messages data
  const mockMessages = [
    {
      id: 1,
      client: {
        id: 101,
        name: 'Sarah Smith',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      },
      caseId: 1,
      caseName: 'Smith v. Johnson',
      message: 'Do you have any updates on the settlement offer? I\'m eager to hear back from the insurance company.',
      timestamp: '2023-05-20T09:15:00Z',
      read: false
    },
    {
      id: 2,
      client: {
        id: 103,
        name: 'Amanda Jones',
        avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      },
      caseId: 3,
      caseName: 'Jones Divorce',
      message: 'I reviewed the mediation agreement but have some concerns about the child custody arrangements we discussed.',
      timestamp: '2023-05-19T16:30:00Z',
      read: false
    },
    {
      id: 3,
      client: {
        id: 102,
        name: 'Robert Williams Jr.',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      },
      caseId: 2,
      caseName: 'Estate of Williams',
      message: 'I found some additional financial documents that might be relevant for the estate planning. When can I drop them off?',
      timestamp: '2023-05-18T11:45:00Z',
      read: true
    }
  ];
  
  // Load data on component mount
  useEffect(() => {
    const fetchData = async () => {
      // In a real app, these would be separate API calls
      try {
        // Simulate API delay
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Set statistics
        setStats({
          activeCases: cases.filter(c => c.status === 'Active').length,
          clientsRepresented: new Set(cases.map(c => c.client.id)).size,
          documentsRequiringReview: 8,
          upcomingEvents: 12,
          billableHours: {
            value: 47.5,
            change: 3.8,
            timeframe: 'this month'
          },
          revenueGenerated: {
            value: 22750,
            change: 5.2,
            timeframe: 'this month'
          }
        });
        
        // Set activity data
        setRecentActivity(mockActivities);
        
        // Set upcoming deadlines (combine deadlines from all cases and sort by date)
        const deadlines = cases.flatMap(c => 
          c.deadlines.map(d => ({
            ...d,
            caseId: c.id,
            caseName: c.title,
            caseType: c.type,
            client: c.client
          }))
        ).sort((a, b) => new Date(a.date) - new Date(b.date));
        
        setUpcomingDeadlines(deadlines);
        
        // Set client messages
        setClientMessages(mockMessages);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching attorney dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Handle case accordion toggle
  const toggleCase = (caseId) => {
    if (openCaseId === caseId) {
      setOpenCaseId(null);
    } else {
      setOpenCaseId(caseId);
    }
  };
  
  // Format date helper
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };
  
  // Format time helper for timestamps
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Format for relative time (e.g., "2 days ago")
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
  
  // Get activity icon based on type
  const getActivityIcon = (type) => {
    switch (type) {
      case 'comment':
        return <HiOutlineChatAlt2 className="h-5 w-5 text-blue-500" />;
      case 'document':
        return <HiOutlineDocumentText className="h-5 w-5 text-purple-500" />;
      case 'meeting':
        return <HiOutlineCalendar className="h-5 w-5 text-green-500" />;
      case 'billing':
        return <HiOutlineClipboardCheck className="h-5 w-5 text-orange-500" />;
      default:
        return <HiOutlineBriefcase className="h-5 w-5 text-gray-500" />;
    }
  };
  
  // Get status badge color
  const getStatusColor = (status) => {
    switch(status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };
  
  // Get priority color
  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'High': return 'text-red-600';
      case 'Medium': return 'text-yellow-600';
      case 'Low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };
  
  // Calculate whether a deadline is upcoming (within 7 days)
  const isUpcomingDeadline = (dateString) => {
    const now = new Date();
    const deadline = new Date(dateString);
    const diffInDays = Math.floor((deadline - now) / (1000 * 60 * 60 * 24));
    return diffInDays >= 0 && diffInDays <= 7;
  };
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
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
              <span className="mt-4 text-gray-600">Loading attorney dashboard...</span>
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
          <h1 className="text-2xl font-semibold text-gray-900">Attorney Dashboard</h1>
          <span className="text-sm text-gray-500">
            Welcome back, {user?.firstName || 'Attorney'} | {new Date().toLocaleDateString()}
          </span>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="py-4">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-6">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <HiOutlineBriefcase className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Active Cases</dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">{stats.activeCases}</div>
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
                    <HiOutlineUserGroup className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Clients Represented</dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">{stats.clientsRepresented}</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <Link to="/clients" className="font-medium text-[#800000] hover:text-[#600000]">View all clients</Link>
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
                      <dt className="text-sm font-medium text-gray-500 truncate">Documents Needing Review</dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">{stats.documentsRequiringReview}</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <Link to="/documents/pending" className="font-medium text-[#800000] hover:text-[#600000]">Review documents</Link>
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
                        <div className="text-lg font-medium text-gray-900">{stats.upcomingEvents}</div>
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
          </div>
          
          {/* Billable Hours and Revenue */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 mb-6">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <HiOutlineClock className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Billable Hours ({stats.billableHours.timeframe})</dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">
                          {stats.billableHours.value}
                        </div>
                        <div className={`ml-2 flex items-baseline text-sm font-semibold ${stats.billableHours.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {stats.billableHours.change >= 0 ? '↑' : '↓'}
                          {Math.abs(stats.billableHours.change)}%
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <Link to="/time-tracking" className="font-medium text-[#800000] hover:text-[#600000]">Track time</Link>
                </div>
              </div>
            </div>
            
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <HiOutlineChartBar className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Revenue Generated ({stats.revenueGenerated.timeframe})</dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">
                          {formatCurrency(stats.revenueGenerated.value)}
                        </div>
                        <div className={`ml-2 flex items-baseline text-sm font-semibold ${stats.revenueGenerated.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {stats.revenueGenerated.change >= 0 ? '↑' : '↓'}
                          {Math.abs(stats.revenueGenerated.change)}%
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <Link to="/billing" className="font-medium text-[#800000] hover:text-[#600000]">View billing</Link>
                </div>
              </div>
            </div>
          </div>
          
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Cases Section */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-5 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">My Cases</h3>
              </div>
              <ul className="divide-y divide-gray-200">
                {cases.length === 0 ? (
                  <li className="px-6 py-4 text-center text-gray-500">
                    No active cases found
                  </li>
                ) : (
                  cases.map((caseItem) => (
                    <li key={caseItem.id} className="px-6 py-4">
                      <div className="cursor-pointer" onClick={() => toggleCase(caseItem.id)}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <span className="text-sm font-medium text-[#800000]">{caseItem.title}</span>
                            <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(caseItem.status)}`}>
                              {caseItem.status}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <span className={`mr-2 text-xs ${getPriorityColor(caseItem.priority)}`}>
                              {caseItem.priority}
                            </span>
                            {openCaseId === caseItem.id ? (
                              <HiChevronDown className="h-5 w-5 text-gray-500" />
                            ) : (
                              <HiChevronRight className="h-5 w-5 text-gray-500" />
                            )}
                          </div>
                        </div>
                        
                        <div className="mt-1 text-sm text-gray-500">
                          {caseItem.type} • Last activity: {formatDate(caseItem.lastActivity)}
                        </div>
                      </div>
                      
                      {/* Expanded Case Details */}
                      {openCaseId === caseItem.id && (
                        <div className="mt-3 bg-gray-50 p-3 rounded-md">
                          <div className="mb-2">
                            <div className="flex items-center text-sm">
                              <img 
                                src={caseItem.client.avatarUrl} 
                                alt={caseItem.client.name}
                                className="h-8 w-8 rounded-full mr-2"
                              />
                              <div>
                                <span className="font-medium">{caseItem.client.name}</span>
                                <span className="text-gray-500 text-xs ml-2">{caseItem.client.email}</span>
                              </div>
                            </div>
                          </div>
                          
                          {caseItem.deadlines.length > 0 && (
                            <div className="mt-2">
                              <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                                Upcoming Deadlines
                              </h4>
                              <ul className="space-y-1">
                                {caseItem.deadlines.map((deadline) => (
                                  <li key={deadline.id} className="text-sm">
                                    <div className="flex items-center">
                                      <HiOutlineCalendar className="mr-1 h-4 w-4 text-gray-400" />
                                      <span className="mr-2">{deadline.title}:</span>
                                      <span className={`${isUpcomingDeadline(deadline.date) ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
                                        {formatDate(deadline.date)}
                                      </span>
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          <div className="mt-3 text-right">
                            <Link
                              to={`/cases/${caseItem.id}`}
                              className="inline-flex items-center text-xs font-medium text-[#800000] hover:text-[#600000]"
                            >
                              View Case Details
                              <HiChevronRight className="ml-1 h-4 w-4" />
                            </Link>
                          </div>
                        </div>
                      )}
                    </li>
                  ))
                )}
              </ul>
              <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
                <div className="text-sm">
                  <Link to="/cases" className="font-medium text-[#800000] hover:text-[#600000]">View all cases</Link>
                </div>
              </div>
            </div>
            
            {/* Recent Activity */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-5 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Activity</h3>
              </div>
              <ul className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
                {recentActivity.length === 0 ? (
                  <li className="px-6 py-4 text-center text-gray-500">
                    No recent activity
                  </li>
                ) : (
                  recentActivity.map((activity) => (
                    <li key={activity.id} className="px-6 py-4">
                      <div className="flex space-x-3">
                        <div className="flex-shrink-0">
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm text-gray-800">
                            {activity.description}
                          </p>
                          <div className="mt-1 flex items-center text-xs text-gray-500">
                            <Link 
                              to={`/cases/${activity.caseId}`}
                              className="font-medium text-[#800000] hover:text-[#600000] truncate"
                            >
                              {activity.caseName}
                            </Link>
                            <span className="mx-1">•</span>
                            <span>{getRelativeTime(activity.timestamp)}</span>
                            <span className="mx-1">•</span>
                            <span>{formatTime(activity.timestamp)}</span>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))
                )}
              </ul>
              <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
                <div className="text-sm">
                  <Link to="/activity" className="font-medium text-[#800000] hover:text-[#600000]">View all activity</Link>
                </div>
              </div>
            </div>
            
            {/* Upcoming Deadlines */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-5 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Upcoming Deadlines</h3>
              </div>
              <ul className="divide-y divide-gray-200">
                {upcomingDeadlines.length === 0 ? (
                  <li className="px-6 py-4 text-center text-gray-500">
                    No upcoming deadlines
                  </li>
                ) : (
                  upcomingDeadlines.slice(0, 5).map((deadline) => (
                    <li key={deadline.id} className="px-6 py-4">
                      <div className="flex justify-between">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 mt-0.5">
                            <HiOutlineCalendar className="h-5 w-5 text-gray-400" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">{deadline.title}</p>
                            <div className="mt-1 flex items-center text-xs text-gray-500">
                              <Link 
                                to={`/cases/${deadline.caseId}`}
                                className="font-medium text-[#800000] hover:text-[#600000]"
                              >
                                {deadline.caseName}
                              </Link>
                              <span className="mx-1">•</span>
                              <span>{deadline.caseType}</span>
                            </div>
                          </div>
                        </div>
                        <div className="ml-3 flex-shrink-0">
                          <div className={`text-sm ${isUpcomingDeadline(deadline.date) ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
                            {formatDate(deadline.date)}
                          </div>
                        </div>
                      </div>
                    </li>
                  ))
                )}
              </ul>
              <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
                <div className="text-sm">
                  <Link to="/calendar" className="font-medium text-[#800000] hover:text-[#600000]">View all deadlines</Link>
                </div>
              </div>
            </div>
            
            {/* Client Messages */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-5 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Client Messages</h3>
              </div>
              <ul className="divide-y divide-gray-200">
                {clientMessages.length === 0 ? (
                  <li className="px-6 py-4 text-center text-gray-500">
                    No unread messages
                  </li>
                ) : (
                  clientMessages.map((message) => (
                    <li key={message.id} className={`px-6 py-4 ${!message.read ? 'bg-blue-50' : ''}`}>
                      <div className="flex space-x-3">
                        <div className="flex-shrink-0">
                          <img 
                            className="h-10 w-10 rounded-full" 
                            src={message.client.avatarUrl} 
                            alt={message.client.name} 
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex justify-between">
                            <p className="text-sm font-medium text-gray-900">
                              {message.client.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {getRelativeTime(message.timestamp)}
                            </p>
                          </div>
                          <div className="mt-1">
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {message.message}
                            </p>
                          </div>
                          <div className="mt-2 flex justify-between">
                            <div className="text-xs text-gray-500">
                              <Link 
                                to={`/cases/${message.caseId}`}
                                className="font-medium text-[#800000] hover:text-[#600000]"
                              >
                                {message.caseName}
                              </Link>
                            </div>
                            <Link 
                              to={`/messages/${message.id}`}
                              className="text-xs font-medium text-[#800000] hover:text-[#600000]"
                            >
                              Reply
                            </Link>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))
                )}
              </ul>
              <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
                <div className="text-sm">
                  <Link to="/messages" className="font-medium text-[#800000] hover:text-[#600000]">View all messages</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttorneyDashboardPage;