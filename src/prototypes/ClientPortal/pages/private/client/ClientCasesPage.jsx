import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  HiOutlineDocumentText, 
  HiOutlineCalendar, 
  HiOutlineUser, 
  HiOutlineOfficeBuilding,
  HiOutlineSearch,
  HiOutlineFilter,
  HiOutlineRefresh,
  HiOutlineExclamationCircle
} from 'react-icons/hi';

const ClientCasesPage = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    type: '',
    search: ''
  });
  const [activeTab, setActiveTab] = useState('all');
  
  // Filter options for dropdown selects
  const caseStatuses = ['All', 'Active', 'Pending', 'Closed'];
  const caseTypes = ['All', 'Personal Injury', 'Family Law', 'Corporate', 'Estate Planning', 'Criminal Defense', 'Real Estate'];
  
  // Mock data - in a real app, this would come from an API
  const mockCases = [
    {
      id: 1,
      title: 'Smith v. Johnson',
      caseNumber: 'PI-2023-1452',
      type: 'Personal Injury',
      status: 'Active',
      description: 'Auto accident personal injury claim from May 2023 incident.',
      startDate: '2023-05-12',
      attorney: {
        id: 3,
        name: 'Sarah Nguyen',
        email: 'sarah.nguyen@psnattorneys.com',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      },
      nextHearing: '2023-06-15',
      nextDeadline: '2023-06-01',
      priority: 'High',
      documents: 12,
      messages: 8,
      lastUpdated: '2023-05-20'
    },
    {
      id: 2,
      title: 'Estate of Williams',
      caseNumber: 'PR-2023-0783',
      type: 'Estate Planning',
      status: 'Active',
      description: 'Probate proceedings for the estate of Robert Williams.',
      startDate: '2023-04-03',
      attorney: {
        id: 1,
        name: 'John Peterson',
        email: 'john.peterson@psnattorneys.com',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      },
      nextHearing: '2023-07-10',
      nextDeadline: '2023-06-20',
      priority: 'Medium',
      documents: 25,
      messages: 5,
      lastUpdated: '2023-05-18'
    },
    {
      id: 3,
      title: 'Brown LLC Contract',
      caseNumber: 'CL-2023-0251',
      type: 'Corporate',
      status: 'Pending',
      description: 'Contract review and negotiation for software licensing agreement.',
      startDate: '2023-05-01',
      attorney: {
        id: 1,
        name: 'John Peterson',
        email: 'john.peterson@psnattorneys.com',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      },
      nextHearing: null,
      nextDeadline: '2023-06-05',
      priority: 'Low',
      documents: 4,
      messages: 12,
      lastUpdated: '2023-05-15'
    },
    {
      id: 4,
      title: 'Jones Divorce',
      caseNumber: 'FL-2023-0592',
      type: 'Family Law',
      status: 'Active',
      description: 'Dissolution of marriage and child custody proceedings.',
      startDate: '2023-02-15',
      attorney: {
        id: 2,
        name: 'Michael Patel',
        email: 'michael.patel@psnattorneys.com',
        avatarUrl: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      },
      nextHearing: '2023-06-30',
      nextDeadline: '2023-06-10',
      priority: 'High',
      documents: 18,
      messages: 24,
      lastUpdated: '2023-05-19'
    },
    {
      id: 5,
      title: 'Tucker Real Estate Acquisition',
      caseNumber: 'RE-2022-1128',
      type: 'Real Estate',
      status: 'Closed',
      description: 'Commercial property acquisition and title transfer.',
      startDate: '2022-11-05',
      attorney: {
        id: 3,
        name: 'Sarah Nguyen',
        email: 'sarah.nguyen@psnattorneys.com',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      },
      nextHearing: null,
      nextDeadline: null,
      priority: 'Low',
      documents: 32,
      messages: 18,
      lastUpdated: '2023-03-10'
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
      search: ''
    });
    setActiveTab('all');
  };
  
  // Filter the cases based on current filters
  const filteredCases = cases.filter(caseItem => {
    // Filter by active tab (status)
    if (activeTab === 'active' && caseItem.status !== 'Active') return false;
    if (activeTab === 'pending' && caseItem.status !== 'Pending') return false;
    if (activeTab === 'closed' && caseItem.status !== 'Closed') return false;
    
    // Filter by dropdown status (if selected)
    if (filters.status && filters.status !== 'All' && caseItem.status !== filters.status) return false;
    
    // Filter by case type (if selected)
    if (filters.type && filters.type !== 'All' && caseItem.type !== filters.type) return false;
    
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
  
  // Helper function to format dates
  const formatDate = (dateString) => {
    if (!dateString) return 'Not scheduled';
    return new Date(dateString).toLocaleDateString();
  };
  
  // Helper function to determine status badge colors
  const getStatusColor = (status) => {
    switch(status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };
  
  // Helper function for priority colors
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
        <h1 className="text-2xl font-semibold text-gray-900">My Cases</h1>
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
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm rounded-md"
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value)}
              >
                <option value="all">All Cases</option>
                <option value="active">Active Cases</option>
                <option value="pending">Pending Cases</option>
                <option value="closed">Closed Cases</option>
              </select>
            </div>
            <div className="hidden sm:block">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                  {[
                    { name: 'All Cases', value: 'all' },
                    { name: 'Active Cases', value: 'active' },
                    { name: 'Pending Cases', value: 'pending' },
                    { name: 'Closed Cases', value: 'closed' },
                  ].map((tab) => (
                    <button
                      key={tab.name}
                      onClick={() => setActiveTab(tab.value)}
                      className={`
                        whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                        ${activeTab === tab.value 
                          ? 'border-[#800000] text-[#800000]' 
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                      `}
                    >
                      {tab.name}
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
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                    Case Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm rounded-md"
                  >
                    <option value="">All Statuses</option>
                    {caseStatuses.map((status, index) => (
                      <option key={index} value={status}>{status}</option>
                    ))}
                  </select>
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
              </div>
              
              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={resetFilters}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                >
                  <HiOutlineRefresh className="-ml-1 mr-2 h-5 w-5 text-gray-500" />
                  Reset Filters
                </button>
              </div>
            </div>
          </div>
          
          {/* Cases List */}
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {loading ? (
                <li className="px-6 py-4 flex items-center justify-center">
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-[#800000]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Loading cases...</span>
                  </div>
                </li>
              ) : error ? (
                <li className="px-6 py-4 flex items-center justify-center">
                  <div className="flex items-center text-red-500">
                    <HiOutlineExclamationCircle className="-ml-1 mr-2 h-5 w-5" />
                    <span>{error}</span>
                  </div>
                </li>
              ) : filteredCases.length === 0 ? (
                <li className="px-6 py-4 flex items-center justify-center">
                  <div className="text-center">
                    <HiOutlineFilter className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No cases found</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Try adjusting your search or filter criteria.
                    </p>
                    <div className="mt-6">
                      <button
                        type="button"
                        onClick={resetFilters}
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#800000] hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                      >
                        <HiOutlineRefresh className="-ml-1 mr-2 h-5 w-5" />
                        Reset Filters
                      </button>
                    </div>
                  </div>
                </li>
              ) : (
                filteredCases.map((caseItem) => (
                  <li key={caseItem.id}>
                    <Link to={`/cases/${caseItem.id}`} className="block hover:bg-gray-50">
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <p className="text-sm font-medium text-[#800000] truncate">
                              {caseItem.title}
                            </p>
                            <div className="ml-2 flex-shrink-0 flex">
                              <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(caseItem.status)}`}>
                                {caseItem.status}
                              </p>
                            </div>
                          </div>
                          <div className="ml-2 flex-shrink-0 flex">
                            <p className="text-sm text-gray-500">
                              Case #{caseItem.caseNumber}
                            </p>
                          </div>
                        </div>
                        
                        <div className="mt-2 sm:flex sm:justify-between">
                          <div className="sm:flex">
                            <p className="flex items-center text-sm text-gray-500">
                              <HiOutlineDocumentText className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                              {caseItem.type}
                            </p>
                            <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                              <HiOutlineCalendar className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                              Started {formatDate(caseItem.startDate)}
                            </p>
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                            <HiOutlineUser className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                            <p>
                              {caseItem.attorney.name}
                            </p>
                          </div>
                        </div>
                        
                        <div className="mt-2 sm:flex sm:justify-between">
                          <p className="text-sm text-gray-700 line-clamp-1">
                            {caseItem.description}
                          </p>
                        </div>
                        
                        <div className="mt-2 sm:flex sm:justify-between">
                          <div className="sm:flex items-center">
                            {caseItem.nextHearing && (
                              <div className="flex items-center text-sm text-gray-500 mr-6">
                                <span className="mr-1">Next Hearing:</span>
                                <span className="font-medium">{formatDate(caseItem.nextHearing)}</span>
                              </div>
                            )}
                            {caseItem.nextDeadline && (
                              <div className="flex items-center text-sm text-gray-500">
                                <span className="mr-1">Next Deadline:</span>
                                <span className="font-medium">{formatDate(caseItem.nextDeadline)}</span>
                              </div>
                            )}
                          </div>
                          <div className="mt-2 flex items-center text-sm sm:mt-0">
                            <span className={`mr-3 ${getPriorityColor(caseItem.priority)}`}>
                              {caseItem.priority} Priority
                            </span>
                            <span className="text-gray-500">
                              {caseItem.documents} documents
                            </span>
                            <span className="mx-2 text-gray-500">•</span>
                            <span className="text-gray-500">
                              {caseItem.messages} messages
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientCasesPage;