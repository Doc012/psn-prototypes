import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { format, parseISO, isAfter, isBefore, addDays } from 'date-fns';
import { 
  HiOutlineDocumentText, 
  HiOutlineCalendar, 
  HiOutlineUser, 
  HiOutlineOfficeBuilding,
  HiOutlineSearch,
  HiOutlineFilter,
  HiOutlineRefresh,
  HiOutlineExclamationCircle,
  HiOutlineClock,
  HiOutlineClipboardCheck,
  HiOutlineChat,
  HiOutlineBriefcase,
  HiOutlineStar,
  HiStar,
  HiChevronDown,
  HiOutlineEye,
  HiOutlineCog,
  HiOutlineDocumentDuplicate,
  HiOutlinePhone,
  HiOutlineArrowNarrowRight,
  HiOutlineBell,
  HiOutlineScale
} from 'react-icons/hi';
import { useAuth } from '../../../context/AuthContext';

const ClientCasesPage = () => {
  const { user } = useAuth();
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    type: '',
    search: '',
    priority: ''
  });
  const [activeTab, setActiveTab] = useState('all');
  const [sortBy, setSortBy] = useState('lastUpdated');
  const [sortDirection, setSortDirection] = useState('desc');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [expandedCase, setExpandedCase] = useState(null);
  const [favorites, setFavorites] = useState([]);
  
  // Updated filter options
  const caseStatuses = ['All', 'Active', 'Pending', 'Closed'];
  const caseTypes = ['All', 'Personal Injury', 'Family Law', 'Corporate', 'Estate Planning', 'Criminal Defense', 'Real Estate'];
  const casePriorities = ['All', 'High', 'Medium', 'Low'];
  
  // Get current year for mock data
  const currentYear = new Date().getFullYear();
  
  // Create more realistic dates based on current date
  const today = new Date();
  const oneWeekAgo = new Date(today);
  oneWeekAgo.setDate(today.getDate() - 7);
  
  const oneMonthAgo = new Date(today);
  oneMonthAgo.setDate(today.getDate() - 30);
  
  const threeMonthsAgo = new Date(today);
  threeMonthsAgo.setDate(today.getDate() - 90);
  
  const inTwoWeeks = new Date(today);
  inTwoWeeks.setDate(today.getDate() + 14);
  
  const inOneMonth = new Date(today);
  inOneMonth.setDate(today.getDate() + 30);
  
  // Mock data with current year
  const mockCases = [
    {
      id: 1,
      title: 'Smith v. Johnson',
      caseNumber: `PI-${currentYear}-1452`,
      type: 'Personal Injury',
      status: 'Active',
      description: 'Auto accident personal injury claim from May 2023 incident on Highway 101. Client sustained injuries requiring physical therapy and ongoing medical treatment.',
      startDate: format(oneMonthAgo, 'yyyy-MM-dd'),
      attorney: {
        id: 3,
        name: 'Sarah Nguyen',
        email: 'sarah.nguyen@psnattorneys.com',
        phone: '(555) 123-4567',
        avatarUrl: 'https://randomuser.me/api/portraits/women/44.jpg'
      },
      nextHearing: format(inTwoWeeks, 'yyyy-MM-dd'),
      nextDeadline: format(addDays(today, 7), 'yyyy-MM-dd'),
      priority: 'High',
      documents: 12,
      messages: 8,
      lastUpdated: format(addDays(today, -2), 'yyyy-MM-dd'),
      progress: 35,
      notes: [
        { date: format(addDays(today, -5), 'yyyy-MM-dd'), content: 'Requested additional medical records', author: 'Sarah Nguyen' },
        { date: format(addDays(today, -10), 'yyyy-MM-dd'), content: 'Settlement negotiations initiated', author: 'Sarah Nguyen' }
      ],
      upcomingTasks: [
        { title: 'Submit medical records', deadline: format(addDays(today, 5), 'yyyy-MM-dd') },
        { title: 'Prepare for deposition', deadline: format(addDays(today, 10), 'yyyy-MM-dd') }
      ]
    },
    {
      id: 2,
      title: 'Estate of Williams',
      caseNumber: `PR-${currentYear}-0783`,
      type: 'Estate Planning',
      status: 'Active',
      description: 'Probate proceedings for the estate of Robert Williams. Handling asset distribution and addressing inheritance claims from multiple beneficiaries.',
      startDate: format(threeMonthsAgo, 'yyyy-MM-dd'),
      attorney: {
        id: 1,
        name: 'John Peterson',
        email: 'john.peterson@psnattorneys.com',
        phone: '(555) 765-4321',
        avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg'
      },
      nextHearing: format(inOneMonth, 'yyyy-MM-dd'),
      nextDeadline: format(addDays(today, 20), 'yyyy-MM-dd'),
      priority: 'Medium',
      documents: 25,
      messages: 5,
      lastUpdated: format(addDays(today, -4), 'yyyy-MM-dd'),
      progress: 60,
      notes: [
        { date: format(addDays(today, -8), 'yyyy-MM-dd'), content: 'Asset inventory completed', author: 'John Peterson' },
        { date: format(addDays(today, -15), 'yyyy-MM-dd'), content: 'Filed probate petition', author: 'John Peterson' }
      ],
      upcomingTasks: [
        { title: 'Review asset valuation', deadline: format(addDays(today, 15), 'yyyy-MM-dd') }
      ]
    },
    {
      id: 3,
      title: 'Brown LLC Contract',
      caseNumber: `CL-${currentYear}-0251`,
      type: 'Corporate',
      status: 'Pending',
      description: 'Contract review and negotiation for software licensing agreement with major technology provider. Addressing intellectual property and liability concerns.',
      startDate: format(addDays(today, -20), 'yyyy-MM-dd'),
      attorney: {
        id: 1,
        name: 'John Peterson',
        email: 'john.peterson@psnattorneys.com',
        phone: '(555) 765-4321',
        avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg'
      },
      nextHearing: null,
      nextDeadline: format(addDays(today, 15), 'yyyy-MM-dd'),
      priority: 'Low',
      documents: 4,
      messages: 12,
      lastUpdated: format(addDays(today, -7), 'yyyy-MM-dd'),
      progress: 25,
      notes: [
        { date: format(addDays(today, -15), 'yyyy-MM-dd'), content: 'Identified contractual risks', author: 'John Peterson' }
      ],
      upcomingTasks: [
        { title: 'Draft counter-proposal', deadline: format(addDays(today, 8), 'yyyy-MM-dd') },
        { title: 'Schedule negotiation call', deadline: format(addDays(today, 6), 'yyyy-MM-dd') }
      ]
    },
    {
      id: 4,
      title: 'Jones Divorce',
      caseNumber: `FL-${currentYear}-0592`,
      type: 'Family Law',
      status: 'Active',
      description: 'Dissolution of marriage and child custody proceedings for the Jones family. Addressing property division and establishing a custody arrangement for two minor children.',
      startDate: format(threeMonthsAgo, 'yyyy-MM-dd'),
      attorney: {
        id: 2,
        name: 'Michael Patel',
        email: 'michael.patel@psnattorneys.com',
        phone: '(555) 987-6543',
        avatarUrl: 'https://randomuser.me/api/portraits/men/56.jpg'
      },
      nextHearing: format(addDays(today, 18), 'yyyy-MM-dd'),
      nextDeadline: format(addDays(today, 10), 'yyyy-MM-dd'),
      priority: 'High',
      documents: 18,
      messages: 24,
      lastUpdated: format(addDays(today, -1), 'yyyy-MM-dd'),
      progress: 70,
      notes: [
        { date: format(addDays(today, -2), 'yyyy-MM-dd'), content: 'Temporary custody arrangement approved', author: 'Michael Patel' },
        { date: format(addDays(today, -12), 'yyyy-MM-dd'), content: 'Financial disclosure completed', author: 'Michael Patel' }
      ],
      upcomingTasks: [
        { title: 'Prepare for custody hearing', deadline: format(addDays(today, 10), 'yyyy-MM-dd') },
        { title: 'Review settlement proposal', deadline: format(addDays(today, 5), 'yyyy-MM-dd') }
      ]
    },
    {
      id: 5,
      title: 'Tucker Real Estate Acquisition',
      caseNumber: `RE-${currentYear-1}-1128`,
      type: 'Real Estate',
      status: 'Closed',
      description: 'Commercial property acquisition and title transfer for downtown office building. Successfully completed due diligence and closed transaction last quarter.',
      startDate: format(addDays(threeMonthsAgo, -90), 'yyyy-MM-dd'),
      attorney: {
        id: 3,
        name: 'Sarah Nguyen',
        email: 'sarah.nguyen@psnattorneys.com',
        phone: '(555) 123-4567',
        avatarUrl: 'https://randomuser.me/api/portraits/women/44.jpg'
      },
      nextHearing: null,
      nextDeadline: null,
      priority: 'Low',
      documents: 32,
      messages: 18,
      lastUpdated: format(addDays(today, -60), 'yyyy-MM-dd'),
      progress: 100,
      notes: [
        { date: format(addDays(today, -75), 'yyyy-MM-dd'), content: 'Closing completed', author: 'Sarah Nguyen' },
        { date: format(addDays(today, -90), 'yyyy-MM-dd'), content: 'Final inspection completed', author: 'Sarah Nguyen' }
      ],
      upcomingTasks: []
    }
  ];
  
  // Load cases data
  useEffect(() => {
    // Simulate API fetch with a timeout
    const fetchCases = async () => {
      setLoading(true);
      try {
        // In a real app, this would be an API call
        setTimeout(() => {
          setCases(mockCases);
          setLoading(false);
        }, 800);
      } catch (err) {
        setError('Failed to load case data. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchCases();
    
    // Load favorites from localStorage in a real app
    setFavorites([1]); // Preset favorite for demo
  }, []);
  
  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };
  
  // Reset all filters
  const resetFilters = () => {
    setFilters({
      status: '',
      type: '',
      search: '',
      priority: ''
    });
    setActiveTab('all');
  };
  
  // Toggle case expanded view
  const toggleCaseExpanded = (caseId) => {
    if (expandedCase === caseId) {
      setExpandedCase(null);
    } else {
      setExpandedCase(caseId);
    }
  };
  
  // Toggle favorite status
  const toggleFavorite = (e, caseId) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (favorites.includes(caseId)) {
      setFavorites(favorites.filter(id => id !== caseId));
    } else {
      setFavorites([...favorites, caseId]);
    }
  };
  
  // Handle sort change
  const handleSortChange = (field) => {
    if (sortBy === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new field and default to descending
      setSortBy(field);
      setSortDirection('desc');
    }
  };
  
  // Filter and sort the cases
  const processedCases = useMemo(() => {
    // First filter the cases
    let result = cases.filter(caseItem => {
      // Filter by active tab (status)
      if (activeTab === 'active' && caseItem.status !== 'Active') return false;
      if (activeTab === 'pending' && caseItem.status !== 'Pending') return false;
      if (activeTab === 'closed' && caseItem.status !== 'Closed') return false;
      if (activeTab === 'favorites' && !favorites.includes(caseItem.id)) return false;
      
      // Filter by dropdown status (if selected)
      if (filters.status && filters.status !== 'All' && caseItem.status !== filters.status) return false;
      
      // Filter by case type (if selected)
      if (filters.type && filters.type !== 'All' && caseItem.type !== filters.type) return false;
      
      // Filter by priority (if selected)
      if (filters.priority && filters.priority !== 'All' && caseItem.priority !== filters.priority) return false;
      
      // Filter by search term (check in title, case number, and description)
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const matchesSearch = 
          caseItem.title.toLowerCase().includes(searchTerm) ||
          caseItem.caseNumber.toLowerCase().includes(searchTerm) ||
          caseItem.description.toLowerCase().includes(searchTerm);
          
        if (!matchesSearch) return false;
      }
      
      return true;
    });
    
    // Then sort the filtered cases
    return result.sort((a, b) => {
      let comparison = 0;
      
      // Sort by selected field
      switch (sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        case 'priority':
          const priorityOrder = { 'High': 1, 'Medium': 2, 'Low': 3 };
          comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
          break;
        case 'lastUpdated':
          comparison = new Date(a.lastUpdated) - new Date(b.lastUpdated);
          break;
        case 'nextDeadline':
          // Handle null dates for next deadline
          if (!a.nextDeadline && !b.nextDeadline) comparison = 0;
          else if (!a.nextDeadline) comparison = 1;
          else if (!b.nextDeadline) comparison = -1;
          else comparison = new Date(a.nextDeadline) - new Date(b.nextDeadline);
          break;
        case 'progress':
          comparison = a.progress - b.progress;
          break;
        default:
          comparison = 0;
      }
      
      // Apply sort direction
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [cases, activeTab, filters, sortBy, sortDirection, favorites]);
  
  // Helper functions
  const formatDate = (dateString) => {
    if (!dateString) return 'Not scheduled';
    
    try {
      const date = parseISO(dateString);
      return format(date, 'MMM d, yyyy');
    } catch (error) {
      console.error("Date formatting error:", error);
      return dateString;
    }
  };
  
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
  
  const getPriorityBadgeColor = (priority) => {
    switch(priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getProgressColor = (progress) => {
    if (progress < 25) return 'bg-red-600';
    if (progress < 50) return 'bg-yellow-600';
    if (progress < 75) return 'bg-blue-600';
    return 'bg-green-600';
  };
  
  const isDeadlineSoon = (dateString) => {
    if (!dateString) return false;
    
    const date = parseISO(dateString);
    const today = new Date();
    const difference = Math.ceil((date - today) / (1000 * 60 * 60 * 24));
    
    return difference >= 0 && difference <= 7;
  };
  
  const getRelativeTimeLabel = (dateString) => {
    if (!dateString) return '';
    
    const date = parseISO(dateString);
    const today = new Date();
    const difference = Math.ceil((date - today) / (1000 * 60 * 60 * 24));
    
    if (difference === 0) return 'Today';
    if (difference === 1) return 'Tomorrow';
    if (difference > 1 && difference <= 7) return `In ${difference} days`;
    if (difference === -1) return 'Yesterday';
    if (difference < -1 && difference >= -7) return `${Math.abs(difference)} days ago`;
    
    return '';
  };
  
  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Cases</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage and track your legal cases
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <Link 
              to="/client-portal/cases/documents"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
            >
              <HiOutlineDocumentDuplicate className="-ml-1 mr-2 h-5 w-5 text-gray-500" />
              All Documents
            </Link>
            <Link 
              to="/client-portal/cases/new-request"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#800000] hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
            >
              <HiOutlineBriefcase className="-ml-1 mr-2 h-5 w-5" />
              New Case Request
            </Link>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="py-4">
          {/* Status Tabs */}
          <div className="mb-6">
            <div className="sm:hidden">
              <label htmlFor="tabs" className="sr-only">Select a tab</label>
              <select
                id="tabs"
                name="tabs"
                className="block w-full rounded-md border-gray-300 focus:border-[#800000] focus:ring-[#800000]"
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value)}
              >
                <option value="all">All Cases</option>
                <option value="active">Active Cases</option>
                <option value="pending">Pending Cases</option>
                <option value="closed">Closed Cases</option>
                <option value="favorites">Favorites</option>
              </select>
            </div>
            <div className="hidden sm:block">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                  {[
                    { name: 'All Cases', value: 'all' },
                    { name: 'Active Cases', value: 'active', count: cases.filter(c => c.status === 'Active').length },
                    { name: 'Pending Cases', value: 'pending', count: cases.filter(c => c.status === 'Pending').length },
                    { name: 'Closed Cases', value: 'closed', count: cases.filter(c => c.status === 'Closed').length },
                    { name: 'Favorites', value: 'favorites', count: favorites.length }
                  ].map((tab) => (
                    <button
                      key={tab.name}
                      onClick={() => setActiveTab(tab.value)}
                      className={`
                        whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center
                        ${activeTab === tab.value 
                          ? 'border-[#800000] text-[#800000]' 
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                      `}
                    >
                      {tab.name}
                      {tab.count !== undefined && (
                        <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                          activeTab === tab.value ? 'bg-[#800000] text-white' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {tab.count}
                        </span>
                      )}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </div>
          
          {/* Filters */}
          <div className="bg-white shadow rounded-lg mb-6">
            <div className="px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label htmlFor="search" className="block text-sm font-medium text-gray-700">
                    Search Cases
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <HiOutlineSearch className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <input
                      type="text"
                      name="search"
                      id="search"
                      value={filters.search}
                      onChange={handleFilterChange}
                      className="focus:ring-[#800000] focus:border-[#800000] block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                      placeholder="Search by title, case # or description"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                    Case Type
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={filters.type}
                    onChange={handleFilterChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm rounded-md"
                  >
                    <option value="">All Types</option>
                    {caseTypes.map((type, index) => (
                      <option key={index} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <div className="flex justify-between">
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                      Priority
                    </label>
                    <button 
                      type="button" 
                      onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                      className="text-sm text-[#800000] hover:text-[#600000] font-medium flex items-center"
                    >
                      {showAdvancedFilters ? 'Hide' : 'Show'} advanced filters
                      <HiChevronDown 
                        className={`ml-1 h-4 w-4 transition-transform ${showAdvancedFilters ? 'transform rotate-180' : ''}`}
                      />
                    </button>
                  </div>
                  <select
                    id="priority"
                    name="priority"
                    value={filters.priority}
                    onChange={handleFilterChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm rounded-md"
                  >
                    <option value="">All Priorities</option>
                    {casePriorities.map((priority, index) => (
                      <option key={index} value={priority}>{priority}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              {/* Advanced filters */}
              {showAdvancedFilters && (
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-4 border-t border-gray-200 pt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Sort By
                    </label>
                    <select
                      value={sortBy}
                      onChange={(e) => handleSortChange(e.target.value)}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm rounded-md"
                    >
                      <option value="lastUpdated">Last Updated</option>
                      <option value="title">Case Title</option>
                      <option value="status">Status</option>
                      <option value="priority">Priority</option>
                      <option value="nextDeadline">Next Deadline</option>
                      <option value="progress">Progress</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Sort Direction
                    </label>
                    <select
                      value={sortDirection}
                      onChange={(e) => setSortDirection(e.target.value)}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm rounded-md"
                    >
                      <option value="desc">Newest First</option>
                      <option value="asc">Oldest First</option>
                    </select>
                  </div>
                  
                  <div className="sm:col-span-2 flex items-end">
                    <button
                      type="button"
                      onClick={resetFilters}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                    >
                      <HiOutlineRefresh className="-ml-1 mr-2 h-5 w-5 text-gray-500" />
                      Reset All Filters
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Cases List */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            {loading ? (
              <div className="px-6 py-16 flex flex-col items-center justify-center">
                <div className="flex items-center justify-center space-x-2 animate-pulse">
                  <div className="w-4 h-4 bg-[#800000] rounded-full"></div>
                  <div className="w-4 h-4 bg-[#800000] rounded-full"></div>
                  <div className="w-4 h-4 bg-[#800000] rounded-full"></div>
                </div>
                <p className="mt-4 text-gray-500">Loading your cases...</p>
              </div>
            ) : error ? (
              <div className="px-6 py-16 flex flex-col items-center justify-center">
                <div className="flex items-center text-red-500">
                  <HiOutlineExclamationCircle className="h-10 w-10" />
                </div>
                <h3 className="mt-2 text-lg font-medium text-gray-900">Error Loading Cases</h3>
                <p className="mt-1 text-gray-500">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-6 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#800000] hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                >
                  <HiOutlineRefresh className="-ml-1 mr-2 h-5 w-5" />
                  Retry
                </button>
              </div>
            ) : processedCases.length === 0 ? (
              <div className="px-6 py-16 flex flex-col items-center justify-center">
                <HiOutlineBriefcase className="h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No cases found</h3>
                <p className="mt-1 text-gray-500">
                  {activeTab !== 'all' 
                    ? `You don't have any ${activeTab === 'favorites' ? 'favorite' : activeTab.toLowerCase()} cases.` 
                    : 'Try adjusting your search or filter criteria.'}
                </p>
                <div className="mt-6 flex space-x-3">
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                  >
                    <HiOutlineRefresh className="-ml-1 mr-2 h-5 w-5 text-gray-500" />
                    Reset Filters
                  </button>
                  <Link 
                    to="/client-portal/cases/new-request"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#800000] hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                  >
                    <HiOutlineBriefcase className="-ml-1 mr-2 h-5 w-5" />
                    Request New Case
                  </Link>
                </div>
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {processedCases.map((caseItem) => (
                  <li key={caseItem.id} className="relative">
                    <div 
                      onClick={() => toggleCaseExpanded(caseItem.id)}
                      className={`block hover:bg-gray-50 transition duration-150 ease-in-out cursor-pointer ${expandedCase === caseItem.id ? 'bg-gray-50' : ''}`}
                    >
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={(e) => toggleFavorite(e, caseItem.id)}
                              className="text-gray-400 hover:text-yellow-400 focus:outline-none"
                            >
                              {favorites.includes(caseItem.id) 
                                ? <HiStar className="h-5 w-5 text-yellow-400" /> 
                                : <HiOutlineStar className="h-5 w-5" />
                              }
                            </button>
                            <p className="text-sm font-medium text-[#800000] truncate flex items-center">
                              {caseItem.title}
                              {isDeadlineSoon(caseItem.nextDeadline) && (
                                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                                  <HiOutlineClock className="mr-1 h-3 w-3" />
                                  Deadline Soon
                                </span>
                              )}
                            </p>
                            <div className="flex-shrink-0 flex">
                              <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(caseItem.status)}`}>
                                {caseItem.status}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <p className="text-sm text-gray-500 whitespace-nowrap">
                              #{caseItem.caseNumber}
                            </p>
                            <span className={`hidden sm:inline-flex px-2 py-0.5 text-xs leading-5 font-medium rounded-full ${getPriorityBadgeColor(caseItem.priority)}`}>
                              {caseItem.priority} Priority
                            </span>
                          </div>
                        </div>
                        
                        <div className="mt-2 sm:flex sm:justify-between">
                          <div className="sm:flex items-center">
                            <p className="flex items-center text-sm text-gray-500">
                              <HiOutlineBriefcase className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                              {caseItem.type}
                            </p>
                            <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                              <HiOutlineCalendar className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                              Started {formatDate(caseItem.startDate)}
                            </p>
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-8 w-8">
                                <img 
                                  className="h-8 w-8 rounded-full" 
                                  src={caseItem.attorney.avatarUrl} 
                                  alt={caseItem.attorney.name}
                                />
                              </div>
                              <div className="ml-2">
                                <p className="text-sm font-medium text-gray-700">{caseItem.attorney.name}</p>
                                <p className="text-xs text-gray-500">Attorney</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium text-gray-700">Case Progress</span>
                            <span className="text-xs font-medium text-gray-700">{caseItem.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`${getProgressColor(caseItem.progress)} h-2 rounded-full`} 
                              style={{ width: `${caseItem.progress}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex flex-wrap items-center gap-y-2 gap-x-4">
                            {caseItem.nextHearing && (
                              <div className="flex items-center text-sm">
                                <span className="px-2 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-medium flex items-center">
                                  <HiOutlineScale className="mr-1 h-4 w-4" />
                                  Hearing: {formatDate(caseItem.nextHearing)}
                                  {getRelativeTimeLabel(caseItem.nextHearing) && (
                                    <span className="ml-1 text-blue-500 font-normal">
                                      ({getRelativeTimeLabel(caseItem.nextHearing)})
                                    </span>
                                  )}
                                </span>
                              </div>
                            )}
                            
                            {caseItem.nextDeadline && (
                              <div className="flex items-center text-sm">
                                <span className={`px-2 py-1 rounded-md ${
                                  isDeadlineSoon(caseItem.nextDeadline) 
                                    ? 'bg-red-50 text-red-700' 
                                    : 'bg-gray-50 text-gray-700'
                                } text-xs font-medium flex items-center`}>
                                  <HiOutlineClock className="mr-1 h-4 w-4" />
                                  Deadline: {formatDate(caseItem.nextDeadline)}
                                  {getRelativeTimeLabel(caseItem.nextDeadline) && (
                                    <span className={`ml-1 ${
                                      isDeadlineSoon(caseItem.nextDeadline) ? 'text-red-500' : 'text-gray-500'
                                    } font-normal`}>
                                      ({getRelativeTimeLabel(caseItem.nextDeadline)})
                                    </span>
                                  )}
                                </span>
                              </div>
                            )}
                          </div>
                          
                          <div className="mt-2 sm:mt-0 flex items-center space-x-4">
                            <div className="flex items-center text-sm text-gray-500">
                              <HiOutlineDocumentText className="mr-1 h-4 w-4" />
                              {caseItem.documents}
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                              <HiOutlineChat className="mr-1 h-4 w-4" />
                              {caseItem.messages}
                            </div>
                            <span className="text-xs text-gray-500">
                              Updated {getRelativeTimeLabel(caseItem.lastUpdated) || formatDate(caseItem.lastUpdated)}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Expanded View */}
                      {expandedCase === caseItem.id && (
                        <div className="px-4 py-5 sm:px-6 border-t border-gray-200 bg-gray-50">
                          <div className="flex flex-col space-y-6">
                            {/* Case Description */}
                            <div>
                              <h4 className="text-sm font-medium text-gray-900">About this case</h4>
                              <p className="mt-1 text-sm text-gray-600">{caseItem.description}</p>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {/* Attorney Contact */}
                              <div className="bg-white p-4 rounded-lg shadow-sm">
                                <h4 className="text-sm font-medium text-gray-900 mb-3">Your Attorney</h4>
                                <div className="flex items-start">
                                  <div className="flex-shrink-0">
                                    <img 
                                      className="h-12 w-12 rounded-full" 
                                      src={caseItem.attorney.avatarUrl} 
                                      alt={caseItem.attorney.name}
                                    />
                                  </div>
                                  <div className="ml-4">
                                    <h5 className="text-sm font-medium text-gray-900">{caseItem.attorney.name}</h5>
                                    <div className="mt-1 flex flex-col space-y-1">
                                      <p className="text-xs text-gray-500">{caseItem.attorney.email}</p>
                                      <p className="text-xs text-gray-500">{caseItem.attorney.phone}</p>
                                    </div>
                                    <div className="mt-3 flex space-x-2">
                                      <Link 
                                        to={`/client-portal/messages/new?attorney=${caseItem.attorney.id}`}
                                        className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                                      >
                                        Message
                                      </Link>
                                      <Link 
                                        to={`/client-portal/calendar/new?attorney=${caseItem.attorney.id}`}
                                        className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                                      >
                                        Schedule Call
                                      </Link>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Recent Notes */}
                              <div className="bg-white p-4 rounded-lg shadow-sm">
                                <div className="flex justify-between items-center mb-3">
                                  <h4 className="text-sm font-medium text-gray-900">Recent Notes</h4>
                                  <Link 
                                    to={`/client-portal/cases/${caseItem.id}/notes`}
                                    className="text-xs text-[#800000] hover:text-[#600000]"
                                  >
                                    View all
                                  </Link>
                                </div>
                                {caseItem.notes && caseItem.notes.length > 0 ? (
                                  <div className="space-y-3">
                                    {caseItem.notes.map((note, idx) => (
                                      <div key={idx} className="text-sm">
                                        <p className="text-gray-600">{note.content}</p>
                                        <div className="mt-1 flex justify-between text-xs text-gray-500">
                                          <span>{note.author}</span>
                                          <span>{formatDate(note.date)}</span>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <p className="text-sm text-gray-500 italic">No recent notes</p>
                                )}
                              </div>
                            </div>
                            
                            {/* Upcoming Tasks */}
                            {caseItem.upcomingTasks && caseItem.upcomingTasks.length > 0 && (
                              <div className="bg-white p-4 rounded-lg shadow-sm">
                                <div className="flex justify-between items-center mb-3">
                                  <h4 className="text-sm font-medium text-gray-900">Upcoming Tasks</h4>
                                  <Link 
                                    to={`/client-portal/cases/${caseItem.id}/tasks`}
                                    className="text-xs text-[#800000] hover:text-[#600000]"
                                  >
                                    View all
                                  </Link>
                                </div>
                                <div className="space-y-2">
                                  {caseItem.upcomingTasks.map((task, idx) => (
                                    <div key={idx} className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded">
                                      <div className="flex items-center">
                                        <HiOutlineClipboardCheck className="h-4 w-4 text-gray-500 mr-2" />
                                        <span className="text-gray-700">{task.title}</span>
                                      </div>
                                      <div className="flex items-center">
                                        <span className={`text-xs ${isDeadlineSoon(task.deadline) ? 'text-red-600' : 'text-gray-500'}`}>
                                          Due: {formatDate(task.deadline)}
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {/* Action Buttons */}
                            <div className="flex flex-wrap gap-3 border-t border-gray-200 pt-4">
                              <Link 
                                to={`/client-portal/cases/${caseItem.id}`}
                                className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-[#800000] hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                              >
                                <HiOutlineEye className="-ml-0.5 mr-2 h-4 w-4" />
                                View Full Case
                              </Link>
                              <Link 
                                to={`/client-portal/cases/${caseItem.id}/documents`}
                                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                              >
                                <HiOutlineDocumentText className="-ml-0.5 mr-2 h-4 w-4" />
                                Documents
                              </Link>
                              <Link 
                                to={`/client-portal/messages?case=${caseItem.id}`}
                                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                              >
                                <HiOutlineChat className="-ml-0.5 mr-2 h-4 w-4" />
                                Messages
                              </Link>
                              <Link 
                                to={`/client-portal/calendar?case=${caseItem.id}`}
                                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                              >
                                <HiOutlineCalendar className="-ml-0.5 mr-2 h-4 w-4" />
                                Calendar
                              </Link>
                              <Link 
                                to={`/client-portal/cases/${caseItem.id}/timeline`}
                                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                              >
                                <HiOutlineArrowNarrowRight className="-ml-0.5 mr-2 h-4 w-4" />
                                Timeline
                              </Link>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          {/* Quick action floating button - only on mobile */}
          <div className="fixed bottom-6 right-6 sm:hidden">
            <Link 
              to="/client-portal/cases/new-request"
              className="h-14 w-14 rounded-full bg-[#800000] shadow-lg flex items-center justify-center text-white"
              aria-label="New case request"
            >
              <HiOutlineBriefcase className="h-6 w-6" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientCasesPage;