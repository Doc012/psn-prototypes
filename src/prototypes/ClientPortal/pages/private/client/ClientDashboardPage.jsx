import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { format, parseISO, isPast, addDays } from 'date-fns';
import { 
  HiOutlineDocumentText, 
  HiOutlineCalendar, 
  HiOutlineChatAlt, 
  HiOutlineClipboardCheck,
  HiOutlineCash,
  HiOutlineExclamation,
  HiOutlineClock,
  HiOutlineChartBar,
  HiOutlineBell,
  HiOutlineScale,
  HiOutlineUserCircle,
  HiOutlinePhone,
  HiOutlineCheckCircle,
  HiOutlineDocumentAdd,
  HiOutlineExclamationCircle,
  HiOutlineInformationCircle,
  HiOutlineArrowSmRight,
  HiChevronRight,
  HiOutlineEye
} from 'react-icons/hi';

const ClientDashboardPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [cases, setCases] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [caseProgress, setCaseProgress] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Fetch client data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real app, these would be API calls
        // For now, use mock data
        
        // Sample data - in a real app, this would come from API calls
        const mockCases = [
          { 
            id: 1, 
            title: 'Smith v. Johnson', 
            type: 'Personal Injury', 
            status: 'Active', 
            nextHearing: '2023-06-15', 
            priority: 'High',
            attorney: 'Sarah Johnson',
            attorneyAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
            progress: 65,
            description: 'Personal injury claim related to car accident on Highway 101'
          },
          { 
            id: 2, 
            title: 'Estate of Williams', 
            type: 'Probate', 
            status: 'Active', 
            nextHearing: '2023-07-10', 
            priority: 'Medium',
            attorney: 'Michael Rodriguez',
            attorneyAvatar: 'https://randomuser.me/api/portraits/men/22.jpg',
            progress: 40,
            description: 'Probate proceeding for the estate of Jane Williams'
          },
          { 
            id: 3, 
            title: 'Brown LLC Contract', 
            type: 'Corporate', 
            status: 'Pending', 
            nextHearing: null, 
            priority: 'Low',
            attorney: 'Sarah Johnson',
            attorneyAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
            progress: 25,
            description: 'Review and negotiation of service agreement with Brown LLC'
          },
        ];
        
        const mockEvents = [
          { 
            id: 1, 
            title: 'Case Review Meeting', 
            date: '2023-05-25', 
            time: '10:00 AM', 
            type: 'Meeting',
            location: 'Zoom Video Conference',
            caseId: 1,
            caseName: 'Smith v. Johnson',
            participants: ['Sarah Johnson', 'You']
          },
          { 
            id: 2, 
            title: 'Document Submission Deadline', 
            date: '2023-06-01', 
            time: null, 
            type: 'Deadline',
            caseId: 2,
            caseName: 'Estate of Williams',
            description: 'Submit all financial records for the estate'
          },
          { 
            id: 3, 
            title: 'Court Hearing', 
            date: '2023-06-15', 
            time: '9:30 AM', 
            type: 'Hearing',
            location: 'County Courthouse, Room 302',
            caseId: 1,
            caseName: 'Smith v. Johnson',
            description: 'Motion hearing for discovery issues'
          },
          { 
            id: 4, 
            title: 'Contract Review Call', 
            date: '2023-05-30', 
            time: '2:00 PM', 
            type: 'Meeting',
            location: 'Phone Call',
            caseId: 3,
            caseName: 'Brown LLC Contract',
            participants: ['Sarah Johnson', 'You', 'Brown LLC Representative']
          },
        ];
        
        const mockNotifications = [
          { 
            id: 1, 
            message: 'New document uploaded: Settlement Agreement', 
            date: '2023-05-20', 
            read: false,
            type: 'document',
            caseId: 1,
            link: '/client-portal/documents/45'
          },
          { 
            id: 2, 
            message: 'Attorney Sarah Johnson added a note to your case', 
            date: '2023-05-18', 
            read: false,
            type: 'note',
            caseId: 1,
            link: '/client-portal/cases/1'
          },
          { 
            id: 3, 
            message: 'Upcoming court date reminder: June 15 at 9:30 AM', 
            date: '2023-05-15', 
            read: true,
            type: 'reminder',
            caseId: 1,
            link: '/client-portal/calendar'
          },
          { 
            id: 4, 
            message: 'New invoice #INV-2023-001 available for payment', 
            date: '2023-05-10', 
            read: true,
            type: 'invoice',
            caseId: 1,
            link: '/client-portal/invoices/1'
          },
        ];
        
        const mockDocuments = [
          { 
            id: 1, 
            name: 'Settlement Agreement.pdf', 
            uploadDate: '2023-05-20', 
            status: 'Needs Review',
            size: '1.2 MB',
            caseId: 1,
            caseName: 'Smith v. Johnson',
            uploadedBy: 'Sarah Johnson'
          },
          { 
            id: 2, 
            name: 'Medical Records.pdf', 
            uploadDate: '2023-05-15', 
            status: 'Approved',
            size: '3.5 MB',
            caseId: 1,
            caseName: 'Smith v. Johnson',
            uploadedBy: 'You'
          },
          { 
            id: 3, 
            name: 'Witness Statement.docx', 
            uploadDate: '2023-05-10', 
            status: 'Approved',
            size: '450 KB',
            caseId: 1,
            caseName: 'Smith v. Johnson',
            uploadedBy: 'Sarah Johnson'
          },
          { 
            id: 4, 
            name: 'Contract Draft.docx', 
            uploadDate: '2023-05-05', 
            status: 'Needs Signature',
            size: '780 KB',
            caseId: 3,
            caseName: 'Brown LLC Contract',
            uploadedBy: 'Sarah Johnson'
          },
        ];
        
        const mockInvoices = [
          { 
            id: 1, 
            number: 'INV-2023-001', 
            amount: 1250.00, 
            dueDate: '2023-06-01', 
            status: 'Unpaid',
            caseId: 1,
            caseName: 'Smith v. Johnson',
            issueDate: '2023-05-10',
            description: 'Legal services for April 2023'
          },
          { 
            id: 2, 
            number: 'INV-2023-002', 
            amount: 750.00, 
            dueDate: '2023-05-15', 
            status: 'Paid',
            caseId: 2, 
            caseName: 'Estate of Williams',
            issueDate: '2023-04-30',
            paymentDate: '2023-05-12',
            description: 'Legal services for estate planning'
          },
        ];
        
        // Generate case progress data
        const mockCaseProgress = mockCases.map(c => ({
          id: c.id,
          name: c.title,
          progress: c.progress,
          nextStep: c.progress < 30 ? 'Document Collection' : 
                    c.progress < 60 ? 'Case Review' : 
                    c.progress < 90 ? 'Settlement Negotiation' : 'Case Closing',
          attorney: c.attorney,
          status: c.status
        }));
        
        // Generate recent activity
        const mockRecentActivity = [
          {
            id: 1,
            type: 'document',
            description: 'Settlement Agreement.pdf was uploaded',
            date: '2023-05-20T10:30:00Z',
            user: 'Sarah Johnson',
            userRole: 'Attorney',
            caseId: 1,
            caseName: 'Smith v. Johnson',
            link: '/client-portal/documents/1'
          },
          {
            id: 2,
            type: 'note',
            description: 'Attorney added a note to your case',
            date: '2023-05-18T14:15:00Z',
            user: 'Sarah Johnson',
            userRole: 'Attorney',
            caseId: 1,
            caseName: 'Smith v. Johnson',
            link: '/client-portal/cases/1'
          },
          {
            id: 3,
            type: 'status',
            description: 'Case status updated to "Active"',
            date: '2023-05-17T09:45:00Z',
            user: 'System',
            userRole: 'System',
            caseId: 1,
            caseName: 'Smith v. Johnson',
            link: '/client-portal/cases/1'
          },
          {
            id: 4,
            type: 'payment',
            description: 'Payment of $750.00 received for Invoice #INV-2023-002',
            date: '2023-05-12T11:20:00Z',
            user: 'Accounting Department',
            userRole: 'Finance',
            caseId: 2,
            caseName: 'Estate of Williams',
            link: '/client-portal/invoices/2'
          },
          {
            id: 5,
            type: 'document',
            description: 'You uploaded Medical Records.pdf',
            date: '2023-05-15T16:30:00Z',
            user: 'You',
            userRole: 'Client',
            caseId: 1,
            caseName: 'Smith v. Johnson',
            link: '/client-portal/documents/2'
          }
        ];
        
        setCases(mockCases);
        setUpcomingEvents(mockEvents);
        setNotifications(mockNotifications);
        setDocuments(mockDocuments);
        setInvoices(mockInvoices);
        setCaseProgress(mockCaseProgress);
        setRecentActivity(mockRecentActivity);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching client dashboard data:', error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Helper functions
  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'text-red-600 font-medium';
      case 'Medium':
        return 'text-yellow-600';
      case 'Low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return 'Not scheduled';
    
    const date = parseISO(dateString);
    return format(date, 'MMM d, yyyy');
  };
  
  const getActivityIcon = (type) => {
    switch(type) {
      case 'document':
        return <HiOutlineDocumentText className="h-5 w-5 text-blue-500" />;
      case 'note':
        return <HiOutlineChatAlt className="h-5 w-5 text-indigo-500" />;
      case 'status':
        return <HiOutlineCheckCircle className="h-5 w-5 text-green-500" />;
      case 'payment':
        return <HiOutlineCash className="h-5 w-5 text-green-500" />;
      case 'meeting':
        return <HiOutlineCalendar className="h-5 w-5 text-purple-500" />;
      default:
        return <HiOutlineInformationCircle className="h-5 w-5 text-gray-500" />;
    }
  };
  
  const getNotificationIcon = (type) => {
    switch(type) {
      case 'document':
        return <HiOutlineDocumentText className="h-5 w-5 text-blue-500" />;
      case 'note':
        return <HiOutlineChatAlt className="h-5 w-5 text-indigo-500" />;
      case 'reminder':
        return <HiOutlineClock className="h-5 w-5 text-yellow-500" />;
      case 'invoice':
        return <HiOutlineCash className="h-5 w-5 text-green-500" />;
      default:
        return <HiOutlineBell className="h-5 w-5 text-gray-500" />;
    }
  };
  
  const getEventIcon = (type) => {
    switch(type) {
      case 'Meeting':
        return <div className="bg-purple-100 p-2 rounded-full"><HiOutlinePhone className="h-5 w-5 text-purple-600" /></div>;
      case 'Deadline':
        return <div className="bg-red-100 p-2 rounded-full"><HiOutlineClock className="h-5 w-5 text-red-600" /></div>;
      case 'Hearing':
        return <div className="bg-blue-100 p-2 rounded-full"><HiOutlineScale className="h-5 w-5 text-blue-600" /></div>;
      default:
        return <div className="bg-gray-100 p-2 rounded-full"><HiOutlineCalendar className="h-5 w-5 text-gray-600" /></div>;
    }
  };
  
  const isUpcoming = (dateString) => {
    if (!dateString) return false;
    
    const date = parseISO(dateString);
    return !isPast(date) || isPast(addDays(date, 1)); // Consider "today" as upcoming
  };
  
  const formatEventDate = (dateString, timeString) => {
    if (!dateString) return '';
    
    const date = parseISO(dateString);
    return `${format(date, 'E, MMM d')}${timeString ? ` • ${timeString}` : ''}`;
  };
  
  const formatActivityDate = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return format(date, 'MMM d, h:mm a');
  };
  
  if (loading) {
    return (
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="flex justify-center items-center py-12">
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
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Header with greeting and time-based message */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.firstName || 'Client'}</h1>
              <p className="mt-1 text-sm text-gray-500">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="inline-flex items-center px-4 py-2 bg-[#800000] bg-opacity-10 rounded-md">
                <HiOutlineInformationCircle className="h-5 w-5 text-[#800000] mr-2" />
                <span className="text-sm text-[#800000] font-medium">
                  {notifications.filter(n => !n.read).length > 0 
                    ? `You have ${notifications.filter(n => !n.read).length} unread notification${notifications.filter(n => !n.read).length !== 1 ? 's' : ''}`
                    : 'You\'re all caught up!'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('overview')}
                className={`${
                  activeTab === 'overview'
                    ? 'border-[#800000] text-[#800000]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('cases')}
                className={`${
                  activeTab === 'cases'
                    ? 'border-[#800000] text-[#800000]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                My Cases
              </button>
              <button
                onClick={() => setActiveTab('calendar')}
                className={`${
                  activeTab === 'calendar'
                    ? 'border-[#800000] text-[#800000]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Calendar
              </button>
              <button
                onClick={() => setActiveTab('activity')}
                className={`${
                  activeTab === 'activity'
                    ? 'border-[#800000] text-[#800000]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Recent Activity
              </button>
            </nav>
          </div>
        </div>
        
        {/* Tab Content */}
        <div className="py-4">
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div>
              {/* Key metrics */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                        <HiOutlineDocumentText className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">Active Cases</dt>
                          <dd>
                            <div className="text-lg font-bold text-gray-900">{cases.filter(c => c.status === 'Active').length}</div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-5 py-3">
                    <div className="text-sm">
                      <Link to="/client-portal/cases" className="font-medium text-[#800000] hover:text-[#600000] flex items-center justify-between">
                        View all cases
                        <HiChevronRight className="h-5 w-5" />
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
                        <HiOutlineCalendar className="h-6 w-6 text-purple-600" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">Upcoming Events</dt>
                          <dd>
                            <div className="text-lg font-bold text-gray-900">
                              {upcomingEvents.filter(e => isUpcoming(e.date)).length}
                            </div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-5 py-3">
                    <div className="text-sm">
                      <Link to="/client-portal/calendar" className="font-medium text-[#800000] hover:text-[#600000] flex items-center justify-between">
                        View calendar
                        <HiChevronRight className="h-5 w-5" />
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                        <HiOutlineDocumentAdd className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">Documents Pending</dt>
                          <dd>
                            <div className="text-lg font-bold text-gray-900">
                              {documents.filter(d => d.status === 'Needs Review' || d.status === 'Needs Signature').length}
                            </div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-5 py-3">
                    <div className="text-sm">
                      <Link to="/client-portal/documents" className="font-medium text-[#800000] hover:text-[#600000] flex items-center justify-between">
                        View documents
                        <HiChevronRight className="h-5 w-5" />
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-red-100 rounded-md p-3">
                        <HiOutlineCash className="h-6 w-6 text-red-600" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">Unpaid Invoices</dt>
                          <dd>
                            <div className="text-lg font-bold text-gray-900">
                              {invoices.filter(i => i.status === 'Unpaid').length}
                            </div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-5 py-3">
                    <div className="text-sm">
                      <Link to="/client-portal/invoices" className="font-medium text-[#800000] hover:text-[#600000] flex items-center justify-between">
                        View invoices
                        <HiChevronRight className="h-5 w-5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Two-column layout - case progress and upcoming events */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Case progress */}
                <div className="lg:col-span-2">
                  <div className="bg-white shadow rounded-lg">
                    <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
                      <h3 className="text-lg font-medium text-gray-900">Case Progress</h3>
                      <Link to="/client-portal/cases" className="text-sm font-medium text-[#800000] hover:text-[#600000]">
                        View all
                      </Link>
                    </div>
                    <div className="px-6 py-4">
                      {caseProgress.length > 0 ? (
                        <div className="space-y-5">
                          {caseProgress.map((item) => (
                            <div key={item.id} className="relative">
                              <div className="flex items-center justify-between mb-2">
                                <div>
                                  <h4 className="text-sm font-medium text-gray-900">{item.name}</h4>
                                  <div className="flex items-center mt-1">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                                      {item.status}
                                    </span>
                                    <span className="ml-2 text-xs text-gray-500">
                                      Current step: {item.nextStep}
                                    </span>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <span className="text-sm font-medium text-gray-900">{item.progress}%</span>
                                  <div className="text-xs text-gray-500 mt-1">
                                    Attorney: {item.attorney}
                                  </div>
                                </div>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div 
                                  className="bg-[#800000] h-2.5 rounded-full" 
                                  style={{ width: `${item.progress}%` }}
                                ></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-4">
                          <p className="text-sm text-gray-500">No active cases to display.</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Recent notifications */}
                  <div className="bg-white shadow rounded-lg mt-6">
                    <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
                      <h3 className="text-lg font-medium text-gray-900">Recent Notifications</h3>
                      <Link to="/client-portal/notifications" className="text-sm font-medium text-[#800000] hover:text-[#600000]">
                        View all
                      </Link>
                    </div>
                    <div className="divide-y divide-gray-200">
                      {notifications.slice(0, 3).map((notification) => (
                        <Link 
                          key={notification.id} 
                          to={notification.link}
                          className={`block px-6 py-4 hover:bg-gray-50 ${!notification.read ? 'bg-blue-50 hover:bg-blue-50' : ''}`}
                        >
                          <div className="flex items-start">
                            <div className="flex-shrink-0 mt-0.5">
                              {getNotificationIcon(notification.type)}
                            </div>
                            <div className="ml-4 flex-1">
                              <div className="flex justify-between">
                                <p className={`text-sm ${!notification.read ? 'font-medium text-gray-900' : 'text-gray-500'}`}>
                                  {notification.message}
                                </p>
                                {!notification.read && (
                                  <span className="ml-2 flex-shrink-0 inline-block px-2 py-0.5 text-xs font-medium bg-[#800000] text-white rounded-full">
                                    New
                                  </span>
                                )}
                              </div>
                              <p className="mt-1 text-xs text-gray-500">
                                {formatDate(notification.date)}
                              </p>
                            </div>
                          </div>
                        </Link>
                      ))}
                      {notifications.length === 0 && (
                        <div className="px-6 py-4 text-center">
                          <p className="text-sm text-gray-500">No notifications to display.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Upcoming events */}
                <div>
                  <div className="bg-white shadow rounded-lg">
                    <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
                      <h3 className="text-lg font-medium text-gray-900">Upcoming Events</h3>
                      <Link to="/client-portal/calendar" className="text-sm font-medium text-[#800000] hover:text-[#600000]">
                        View calendar
                      </Link>
                    </div>
                    <div className="p-6 space-y-6">
                      {upcomingEvents.filter(e => isUpcoming(e.date)).slice(0, 3).map((event) => (
                        <div key={event.id} className="flex space-x-4">
                          <div className="flex-shrink-0">
                            {getEventIcon(event.type)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="text-sm font-medium text-gray-900 truncate">{event.title}</h4>
                            <p className="mt-1 text-sm text-[#800000]">
                              {formatEventDate(event.date, event.time)}
                            </p>
                            <div className="mt-2">
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                {event.caseName}
                              </span>
                            </div>
                            {event.location && (
                              <p className="mt-1 text-xs text-gray-500">
                                Location: {event.location}
                              </p>
                            )}
                            <div className="mt-3">
                              <Link 
                                to={`/client-portal/calendar/${event.id}`}
                                className="text-xs font-medium text-[#800000] hover:text-[#600000]"
                              >
                                View details
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}
                      {upcomingEvents.filter(e => isUpcoming(e.date)).length === 0 && (
                        <div className="text-center py-4">
                          <HiOutlineCalendar className="mx-auto h-12 w-12 text-gray-400" />
                          <h3 className="mt-2 text-sm font-medium text-gray-900">No upcoming events</h3>
                          <p className="mt-1 text-sm text-gray-500">You have no scheduled events coming up.</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="bg-white shadow rounded-lg mt-6">
                    <div className="px-6 py-5 border-b border-gray-200">
                      <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
                    </div>
                    <div className="p-6 grid grid-cols-2 gap-4">
                      <Link 
                        to="/client-portal/documents/upload" 
                        className="text-center py-4 px-2 rounded-lg bg-[#800000] bg-opacity-5 hover:bg-opacity-10 transition-colors duration-200 flex flex-col items-center"
                      >
                        <HiOutlineDocumentAdd className="h-8 w-8 text-[#800000]" />
                        <span className="mt-2 text-sm font-medium text-[#800000]">Upload Document</span>
                      </Link>
                      
                      <Link 
                        to="/client-portal/messages/new" 
                        className="text-center py-4 px-2 rounded-lg bg-[#800000] bg-opacity-5 hover:bg-opacity-10 transition-colors duration-200 flex flex-col items-center"
                      >
                        <HiOutlineChatAlt className="h-8 w-8 text-[#800000]" />
                        <span className="mt-2 text-sm font-medium text-[#800000]">New Message</span>
                      </Link>
                      
                      <Link 
                        to="/client-portal/calendar/new" 
                        className="text-center py-4 px-2 rounded-lg bg-[#800000] bg-opacity-5 hover:bg-opacity-10 transition-colors duration-200 flex flex-col items-center"
                      >
                        <HiOutlineCalendar className="h-8 w-8 text-[#800000]" />
                        <span className="mt-2 text-sm font-medium text-[#800000]">Schedule Meeting</span>
                      </Link>
                      
                      <Link 
                        to="/client-portal/support" 
                        className="text-center py-4 px-2 rounded-lg bg-[#800000] bg-opacity-5 hover:bg-opacity-10 transition-colors duration-200 flex flex-col items-center"
                      >
                        <HiOutlineExclamationCircle className="h-8 w-8 text-[#800000]" />
                        <span className="mt-2 text-sm font-medium text-[#800000]">Get Support</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CASES TAB */}
          {activeTab === 'cases' && (
            <div>
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">All Cases</h3>
                  <span className="text-sm text-gray-500">
                    {cases.length} case{cases.length !== 1 ? 's' : ''}
                  </span>
                </div>
                {cases.length > 0 ? (
                  <div>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Case
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
                              Attorney
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Progress
                            </th>
                            <th scope="col" className="relative px-6 py-3">
                              <span className="sr-only">View</span>
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {cases.map((caseItem) => (
                            <tr key={caseItem.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{caseItem.title}</div>
                                <div className="text-xs text-gray-500 mt-1 max-w-xs truncate">{caseItem.description}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">{caseItem.type}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(caseItem.status)}`}>
                                  {caseItem.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {caseItem.nextHearing ? formatDate(caseItem.nextHearing) : 'Not scheduled'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="flex-shrink-0 h-8 w-8">
                                    <img
                                      className="h-8 w-8 rounded-full"
                                      src={caseItem.attorneyAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(caseItem.attorney)}&background=800000&color=ffffff`}
                                      alt={caseItem.attorney}
                                    />
                                  </div>
                                  <div className="ml-3">
                                    <div className="text-sm font-medium text-gray-900">{caseItem.attorney}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div 
                                      className="bg-[#800000] h-2.5 rounded-full" 
                                      style={{ width: `${caseItem.progress}%` }}
                                    ></div>
                                  </div>
                                  <span className="ml-2 text-xs font-medium">{caseItem.progress}%</span>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <Link to={`/client-portal/cases/${caseItem.id}`} className="text-[#800000] hover:text-[#600000]">
                                  View
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <HiOutlineDocumentText className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No cases</h3>
                    <p className="mt-1 text-sm text-gray-500">You don't have any active cases at the moment.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* CALENDAR TAB */}
          {activeTab === 'calendar' && (
            <div>
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Events list */}
                <div className="lg:col-span-2">
                  <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
                      <h3 className="text-lg font-medium text-gray-900">Upcoming Events</h3>
                      <Link to="/client-portal/calendar/new" className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#800000] hover:bg-[#600000]">
                        Add Event
                      </Link>
                    </div>
                    <div className="divide-y divide-gray-200">
                      {upcomingEvents.filter(e => isUpcoming(e.date)).length > 0 ? (
                        upcomingEvents.filter(e => isUpcoming(e.date)).map((event) => (
                          <div key={event.id} className="px-6 py-4 flex items-start hover:bg-gray-50">
                            <div className="flex-shrink-0">
                              {getEventIcon(event.type)}
                            </div>
                            <div className="ml-4 flex-1">
                              <div className="flex justify-between">
                                <div>
                                  <h4 className="text-sm font-medium text-gray-900">{event.title}</h4>
                                  <p className="mt-1 text-sm text-[#800000]">
                                    {formatEventDate(event.date, event.time)}
                                  </p>
                                  <div className="mt-2 flex flex-wrap items-center gap-2">
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                      {event.caseName}
                                    </span>
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                      {event.type}
                                    </span>
                                  </div>
                                  {event.location && (
                                    <p className="mt-2 text-xs text-gray-500 flex items-center">
                                      <span className="mr-1">📍</span> {event.location}
                                    </p>
                                  )}
                                </div>
                                <div className="flex">
                                  <Link 
                                    to={`/client-portal/calendar/${event.id}`}
                                    className="text-[#800000] hover:text-[#600000]"
                                  >
                                    <HiOutlineEye className="h-5 w-5" />
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-12">
                          <HiOutlineCalendar className="mx-auto h-12 w-12 text-gray-400" />
                          <h3 className="mt-2 text-sm font-medium text-gray-900">No upcoming events</h3>
                          <p className="mt-1 text-sm text-gray-500">You have no scheduled events coming up.</p>
                          <div className="mt-6">
                            <Link 
                              to="/client-portal/calendar/new"
                              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#800000] hover:bg-[#600000]"
                            >
                              Schedule an event
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Event types */}
                <div>
                  <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <div className="px-6 py-5 border-b border-gray-200">
                      <h3 className="text-lg font-medium text-gray-900">Calendar Legend</h3>
                    </div>
                    <div className="px-6 py-4 space-y-4">
                      <div className="flex items-center">
                        <div className="bg-purple-100 p-2 rounded-full">
                          <HiOutlinePhone className="h-5 w-5 text-purple-600" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">Meetings</p>
                          <p className="text-xs text-gray-500">Client consultations, conference calls</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="bg-blue-100 p-2 rounded-full">
                          <HiOutlineScale className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">Hearings</p>
                          <p className="text-xs text-gray-500">Court appearances, mediations</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="bg-red-100 p-2 rounded-full">
                          <HiOutlineClock className="h-5 w-5 text-red-600" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">Deadlines</p>
                          <p className="text-xs text-gray-500">Filing deadlines, document submissions</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white shadow overflow-hidden sm:rounded-lg mt-6">
                    <div className="px-6 py-5 border-b border-gray-200">
                      <h3 className="text-lg font-medium text-gray-900">Case Summary</h3>
                    </div>
                    <div className="px-6 py-4">
                      <div className="space-y-4">
                        {cases.map(caseItem => (
                          <div key={caseItem.id} className="flex items-center justify-between">
                            <div>
                              <h4 className="text-sm font-medium text-gray-900">{caseItem.title}</h4>
                              <p className="text-xs text-gray-500">{caseItem.type}</p>
                            </div>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(caseItem.status)}`}>
                              {caseItem.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ACTIVITY TAB */}
          {activeTab === 'activity' && (
            <div>
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-6 py-5 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
                </div>
                <div className="px-6 py-4">
                  <div className="flow-root">
                    <ul className="-mb-8">
                      {recentActivity.map((activity, activityIdx) => (
                        <li key={activity.id}>
                          <div className="relative pb-8">
                            {activityIdx !== recentActivity.length - 1 ? (
                              <span className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                            ) : null}
                            <div className="relative flex items-start space-x-3">
                              <div className="relative">
                                <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center ring-8 ring-white">
                                  {getActivityIcon(activity.type)}
                                </div>
                              </div>
                              <div className="min-w-0 flex-1">
                                <div>
                                  <div className="text-sm font-medium text-gray-900">
                                    {activity.user}
                                    {activity.userRole !== 'You' && (
                                      <span className="ml-1 text-xs text-gray-500">({activity.userRole})</span>
                                    )}
                                  </div>
                                  <p className="mt-0.5 text-sm text-gray-500">
                                    {formatActivityDate(activity.date)}
                                  </p>
                                </div>
                                <div className="mt-2 text-sm text-gray-700">
                                  <p>{activity.description}</p>
                                </div>
                                <div className="mt-2">
                                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                    {activity.caseName}
                                  </span>
                                </div>
                                <div className="mt-2">
                                  <Link 
                                    to={activity.link}
                                    className="text-sm font-medium text-[#800000] hover:text-[#600000] flex items-center"
                                  >
                                    View details
                                    <HiOutlineArrowSmRight className="ml-1 h-4 w-4" />
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientDashboardPage;