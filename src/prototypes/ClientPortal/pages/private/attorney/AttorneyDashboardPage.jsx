import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { format, formatDistanceToNow, isToday, isYesterday, parseISO } from 'date-fns';
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
  HiOutlineExclamationCircle,
  HiOutlineBell,
  HiOutlineCheck,
  HiOutlineRefresh,
  HiOutlineCog,
  HiOutlineColorSwatch,
  HiOutlineMail // Add this missing icon
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
  const [viewMode, setViewMode] = useState('all'); // 'all', 'urgent', 'recent'
  
  // Mock data for cases - using more recent dates
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
      lastActivity: '2025-06-01', // Current year
      deadlines: [
        { id: 1, title: 'Submit Settlement Proposal', date: '2025-06-10' },
        { id: 2, title: 'Expert Witness Deposition', date: '2025-06-25' }
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
      lastActivity: '2025-06-02', // Current year
      deadlines: [
        { id: 3, title: 'File Probate Documents', date: '2025-06-20' }
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
      lastActivity: '2025-06-01', // Current year
      deadlines: [
        { id: 4, title: 'Mediation Session', date: '2025-06-07' },
        { id: 5, title: 'Court Hearing', date: '2025-06-25' }
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
      lastActivity: '2025-06-01', // Current year
      deadlines: [
        { id: 6, title: 'Contract Review Completion', date: '2025-06-05' }
      ]
    }
  ];
  
  // Mock recent activity data - with current year timestamps
  const mockActivities = [
    { 
      id: 1, 
      type: 'comment', 
      description: 'You added a comment on Smith v. Johnson case',
      caseId: 1,
      caseName: 'Smith v. Johnson',
      timestamp: '2025-06-03T14:30:00Z' // Today
    },
    { 
      id: 2, 
      type: 'document', 
      description: 'You uploaded "Settlement Analysis" document to Jones Divorce case',
      caseId: 3,
      caseName: 'Jones Divorce',
      timestamp: '2025-06-03T11:15:00Z' // Today
    },
    { 
      id: 3, 
      type: 'meeting', 
      description: 'Meeting with Robert Williams Jr. scheduled for Estate of Williams case',
      caseId: 2,
      caseName: 'Estate of Williams',
      timestamp: '2025-06-02T16:45:00Z' // Yesterday
    },
    { 
      id: 4, 
      type: 'billing', 
      description: 'You recorded 3.5 billable hours for Brown LLC Contract case',
      caseId: 4,
      caseName: 'Brown LLC Contract',
      timestamp: '2025-06-02T10:20:00Z' // Yesterday
    },
    { 
      id: 5, 
      type: 'document', 
      description: 'You reviewed "Medical Records" document for Smith v. Johnson case',
      caseId: 1,
      caseName: 'Smith v. Johnson',
      timestamp: '2025-06-01T09:45:00Z' // 2 days ago
    }
  ];
  
  // Mock client messages data - with current year timestamps
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
      timestamp: '2025-06-03T09:15:00Z', // Today
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
      timestamp: '2025-06-02T16:30:00Z', // Yesterday
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
      timestamp: '2025-06-01T11:45:00Z', // 2 days ago
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
            value: 342500, // R22750 in Rands (approximately)
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
  
  // Format date helper with improved display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    
    if (isToday(date)) {
      return 'Today';
    } else if (isYesterday(date)) {
      return 'Yesterday';
    } else {
      return format(date, 'd MMM yyyy');
    }
  };
  
  // Format time helper for timestamps
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return format(date, 'h:mm a');
  };
  
  // Format for relative time (e.g., "2 days ago")
  const getRelativeTime = (timestamp) => {
    try {
      const date = typeof timestamp === 'string' ? parseISO(timestamp) : new Date(timestamp);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      console.error('Invalid date format:', timestamp);
      return 'recently';
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
  
  // Format currency in Rands
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Filter items based on view mode
  const getFilteredCases = () => {
    if (viewMode === 'urgent') {
      return cases.filter(c => c.priority === 'High');
    } else if (viewMode === 'recent') {
      return [...cases].sort((a, b) => new Date(b.lastActivity) - new Date(a.lastActivity));
    }
    return cases;
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
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-gray-200 pb-5">
          <div className="flex items-center mb-4 sm:mb-0">
            <div className="h-12 w-12 bg-[#800000] text-white rounded-lg flex items-center justify-center mr-4">
              <HiOutlineBriefcase className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Attorney Dashboard</h1>
              <p className="text-sm text-gray-500">
                Welcome back, {user?.firstName || 'Attorney'} | {format(new Date(), 'EEEE, d MMMM yyyy')}
              </p>
            </div>
          </div>
          <div className="flex space-x-3">
            <button 
              className={`px-3 py-2 text-sm rounded-md ${viewMode === 'all' ? 'bg-[#800000] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              onClick={() => setViewMode('all')}
            >
              All Cases
            </button>
            <button 
              className={`px-3 py-2 text-sm rounded-md ${viewMode === 'urgent' ? 'bg-[#800000] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              onClick={() => setViewMode('urgent')}
            >
              Urgent
            </button>
            <button 
              className={`px-3 py-2 text-sm rounded-md ${viewMode === 'recent' ? 'bg-[#800000] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              onClick={() => setViewMode('recent')}
            >
              Recent
            </button>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="py-5">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
            <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-blue-50 p-3 rounded-md">
                    <HiOutlineBriefcase className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Active Cases</dt>
                      <dd>
                        <div className="text-lg font-semibold text-gray-900">{stats.activeCases}</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3 border-t border-gray-200">
                <div className="text-sm">
                  <Link to="/client-portal/attorney/cases" className="font-medium text-[#800000] hover:text-[#600000] flex items-center">
                    View all cases
                    <HiChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-green-50 p-3 rounded-md">
                    <HiOutlineUserGroup className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Clients Represented</dt>
                      <dd>
                        <div className="text-lg font-semibold text-gray-900">{stats.clientsRepresented}</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3 border-t border-gray-200">
                <div className="text-sm">
                  <Link to="/client-portal/attorney/clients" className="font-medium text-[#800000] hover:text-[#600000] flex items-center">
                    View all clients
                    <HiChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-purple-50 p-3 rounded-md">
                    <HiOutlineDocumentText className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Documents Needing Review</dt>
                      <dd>
                        <div className="text-lg font-semibold text-gray-900">{stats.documentsRequiringReview}</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3 border-t border-gray-200">
                <div className="text-sm">
                  <Link to="/client-portal/attorney/documents" className="font-medium text-[#800000] hover:text-[#600000] flex items-center">
                    Review documents
                    <HiChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-amber-50 p-3 rounded-md">
                    <HiOutlineCalendar className="h-6 w-6 text-amber-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Upcoming Events</dt>
                      <dd>
                        <div className="text-lg font-semibold text-gray-900">{stats.upcomingEvents}</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3 border-t border-gray-200">
                <div className="text-sm">
                  <Link to="/client-portal/attorney/calendar" className="font-medium text-[#800000] hover:text-[#600000] flex items-center">
                    View calendar
                    <HiChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          {/* Billable Hours and Revenue */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 mb-6">
            <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-indigo-50 p-3 rounded-md">
                    <HiOutlineClock className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Billable Hours ({stats.billableHours.timeframe})</dt>
                      <dd className="flex items-baseline mt-2">
                        <div className="text-2xl font-semibold text-gray-900">
                          {stats.billableHours.value}h
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
              <div className="bg-gray-50 px-5 py-3 border-t border-gray-200">
                <div className="text-sm">
                  <Link to="/client-portal/attorney/time-tracking" className="font-medium text-[#800000] hover:text-[#600000] flex items-center">
                    Track time
                    <HiChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-emerald-50 p-3 rounded-md">
                    <HiOutlineChartBar className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Revenue Generated ({stats.revenueGenerated.timeframe})</dt>
                      <dd className="flex items-baseline mt-2">
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
              <div className="bg-gray-50 px-5 py-3 border-t border-gray-200">
                <div className="text-sm">
                  <Link to="/client-portal/attorney/billing" className="font-medium text-[#800000] hover:text-[#600000] flex items-center">
                    View billing
                    <HiChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Cases Section */}
            <div className="bg-white shadow-sm rounded-lg border border-gray-200">
              <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                  <HiOutlineBriefcase className="mr-2 h-5 w-5 text-gray-500" />
                  My Cases
                </h3>
                <button className="text-sm text-[#800000] hover:text-[#600000] flex items-center">
                  <HiOutlineRefresh className="mr-1 h-4 w-4" />
                  Refresh
                </button>
              </div>
              <ul className="divide-y divide-gray-200">
                {getFilteredCases().length === 0 ? (
                  <li className="px-6 py-4 text-center text-gray-500">
                    No active cases found
                  </li>
                ) : (
                  getFilteredCases().map((caseItem) => (
                    <li key={caseItem.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                      <div className="cursor-pointer" onClick={() => toggleCase(caseItem.id)}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <span className="text-sm font-medium text-[#800000]">{caseItem.title}</span>
                            <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(caseItem.status)}`}>
                              {caseItem.status}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <span className={`mr-2 text-xs font-medium ${getPriorityColor(caseItem.priority)}`}>
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
                        <div className="mt-3 bg-gray-50 p-4 rounded-md border border-gray-200">
                          <div className="mb-3">
                            <div className="flex items-center text-sm">
                              <img 
                                src={caseItem.client.avatarUrl} 
                                alt={caseItem.client.name}
                                className="h-10 w-10 rounded-full mr-3 border-2 border-white shadow-sm"
                              />
                              <div>
                                <span className="font-medium text-gray-900">{caseItem.client.name}</span>
                                <div className="text-gray-500 text-xs flex items-center mt-1">
                                  <HiOutlineMail className="mr-1 h-3 w-3" />
                                  {caseItem.client.email}
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {caseItem.deadlines.length > 0 && (
                            <div className="mt-3">
                              <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 flex items-center">
                                <HiOutlineCalendar className="mr-1 h-4 w-4" />
                                Upcoming Deadlines
                              </h4>
                              <ul className="space-y-2 bg-white p-3 rounded-md border border-gray-100">
                                {caseItem.deadlines.map((deadline) => (
                                  <li key={deadline.id} className="text-sm">
                                    <div className="flex items-center">
                                      <div className={`w-2 h-2 rounded-full mr-2 ${isUpcomingDeadline(deadline.date) ? 'bg-red-500' : 'bg-gray-300'}`}></div>
                                      <span className="mr-2 font-medium">{deadline.title}:</span>
                                      <span className={`${isUpcomingDeadline(deadline.date) ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
                                        {formatDate(deadline.date)}
                                      </span>
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          <div className="mt-4 flex justify-between">
                            <div className="flex space-x-2">
                              <button className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]">
                                <HiOutlineChatAlt2 className="mr-1 h-3 w-3" />
                                Message
                              </button>
                              <button className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]">
                                <HiOutlineCalendar className="mr-1 h-3 w-3" />
                                Schedule
                              </button>
                            </div>
                            <Link
                              to={`/client-portal/attorney/cases`}
                              className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-[#800000] hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                            >
                              View Details
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
                  <Link to="/client-portal/attorney/cases" className="font-medium text-[#800000] hover:text-[#600000] flex items-center">
                    View all cases
                    <HiChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Recent Activity */}
            <div className="bg-white shadow-sm rounded-lg border border-gray-200">
              <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                  <HiOutlineClock className="mr-2 h-5 w-5 text-gray-500" />
                  Recent Activity
                </h3>
                <button className="text-sm text-[#800000] hover:text-[#600000] flex items-center">
                  <HiOutlineRefresh className="mr-1 h-4 w-4" />
                  Refresh
                </button>
              </div>
              <ul className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
                {recentActivity.length === 0 ? (
                  <li className="px-6 py-4 text-center text-gray-500">
                    No recent activity
                  </li>
                ) : (
                  recentActivity.map((activity) => (
                    <li key={activity.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
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
                              to={`/client-portal/attorney/cases`}
                              className="font-medium text-[#800000] hover:text-[#600000] truncate"
                            >
                              {activity.caseName}
                            </Link>
                            <span className="mx-1">•</span>
                            <span className="font-medium">{getRelativeTime(activity.timestamp)}</span>
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
                  <Link to="/client-portal/attorney/dashboard" className="font-medium text-[#800000] hover:text-[#600000] flex items-center">
                    View all activity
                    <HiChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Upcoming Deadlines */}
            <div className="bg-white shadow-sm rounded-lg border border-gray-200">
              <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                  <HiOutlineCalendar className="mr-2 h-5 w-5 text-gray-500" />
                  Upcoming Deadlines
                </h3>
                <Link to="/client-portal/attorney/calendar" className="text-sm text-[#800000] hover:text-[#600000]">
                  View calendar
                </Link>
              </div>
              <ul className="divide-y divide-gray-200">
                {upcomingDeadlines.length === 0 ? (
                  <li className="px-6 py-4 text-center text-gray-500">
                    No upcoming deadlines
                  </li>
                ) : (
                  upcomingDeadlines.slice(0, 5).map((deadline) => (
                    <li key={deadline.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between">
                        <div className="flex items-start">
                          <div className={`flex-shrink-0 mt-0.5 w-2 h-2 rounded-full mr-3 ${
                            isUpcomingDeadline(deadline.date) ? 'bg-red-500' : 'bg-gray-300'
                          }`}></div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{deadline.title}</p>
                            <div className="mt-1 flex items-center text-xs text-gray-500">
                              <Link 
                                to={`/client-portal/attorney/cases`}
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
                          <div className={`text-sm px-2.5 py-0.5 rounded-full ${
                            isUpcomingDeadline(deadline.date) 
                              ? 'bg-red-100 text-red-800 font-medium' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
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
                  <Link to="/client-portal/attorney/calendar" className="font-medium text-[#800000] hover:text-[#600000] flex items-center">
                    View all deadlines
                    <HiChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Client Messages */}
            <div className="bg-white shadow-sm rounded-lg border border-gray-200">
              <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                  <HiOutlineChatAlt2 className="mr-2 h-5 w-5 text-gray-500" />
                  Client Messages
                </h3>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  {clientMessages.filter(m => !m.read).length} unread
                </span>
              </div>
              <ul className="divide-y divide-gray-200">
                {clientMessages.length === 0 ? (
                  <li className="px-6 py-4 text-center text-gray-500">
                    No unread messages
                  </li>
                ) : (
                  clientMessages.map((message) => (
                    <li key={message.id} className={`px-6 py-4 hover:bg-gray-50 transition-colors ${!message.read ? 'bg-blue-50' : ''}`}>
                      <div className="flex space-x-3">
                        <div className="flex-shrink-0">
                          <img 
                            className="h-10 w-10 rounded-full border-2 border-white shadow-sm" 
                            src={message.client.avatarUrl} 
                            alt={message.client.name} 
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex justify-between">
                            <p className="text-sm font-medium text-gray-900 flex items-center">
                              {message.client.name}
                              {!message.read && (
                                <span className="ml-2 w-2 h-2 bg-blue-600 rounded-full"></span>
                              )}
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
                                to={`/client-portal/attorney/cases`}
                                className="font-medium text-[#800000] hover:text-[#600000]"
                              >
                                {message.caseName}
                              </Link>
                            </div>
                            <Link 
                              to={`/client-portal/attorney/messages`}
                              className="text-xs font-medium text-[#800000] hover:text-[#600000] flex items-center"
                            >
                              Reply
                              <HiChevronRight className="ml-1 h-3 w-3" />
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
                  <Link to="/client-portal/attorney/messages" className="font-medium text-[#800000] hover:text-[#600000] flex items-center">
                    View all messages
                    <HiChevronRight className="ml-1 h-4 w-4" />
                  </Link>
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