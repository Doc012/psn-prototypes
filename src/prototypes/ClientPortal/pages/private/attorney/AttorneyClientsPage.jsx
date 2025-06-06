import React, { useState, useEffect, Fragment } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Dialog, Menu, Transition } from '@headlessui/react';
import {
  HiOutlineUsers,
  HiOutlineSearch,
  HiOutlineFilter,
  HiOutlinePlus,
  HiOutlineUserCircle,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineOfficeBuilding,
  HiOutlineCalendar,
  HiOutlineDocumentText,
  HiOutlineClock,
  HiOutlineExclamation,
  HiOutlinePencilAlt,
  HiOutlineTrash,
  HiOutlineDotsVertical,
  HiOutlineX,
  HiOutlineRefresh,
  HiOutlineEye,
  HiOutlineAdjustments,
  HiOutlineArrowUp,
  HiOutlineArrowDown,
  HiOutlineClipboardList,
  HiSortAscending,
  HiSortDescending,
} from 'react-icons/hi';
// Fix the import path to match your project structure
import { useAuth } from '../../../context/AuthContext';

const AttorneyClientsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [isAddClientModalOpen, setIsAddClientModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [viewStyle, setViewStyle] = useState('table');
  
  const clientTypes = [
    { id: 'individual', name: 'Individual' },
    { id: 'business', name: 'Business' },
    { id: 'nonprofit', name: 'Non-Profit' },
    { id: 'government', name: 'Government' },
  ];
  
  const [newClient, setNewClient] = useState({
    name: '',
    email: '',
    phone: '',
    type: 'individual',
    address: '',
    status: 'active',
    notes: '',
  });

  // Mock data - would be replaced with actual API calls
  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        // Mock API response
        const mockClients = [
          {
            id: '1',
            name: 'John Smith',
            email: 'john.smith@example.com',
            phone: '(555) 123-4567',
            type: 'individual',
            address: '123 Main St, Anytown, CA 90210',
            status: 'active',
            avatarUrl: 'https://randomuser.me/api/portraits/men/1.jpg',
            caseCount: 2,
            lastActivity: 'Document uploaded',
            lastActivityDate: '2025-05-28T14:30:00',
            dateAdded: '2024-02-15T09:00:00'
          },
          {
            id: '2',
            name: 'Acme Corporation',
            email: 'contact@acmecorp.com',
            phone: '(555) 987-6543',
            type: 'business',
            address: '456 Business Ave, Commerce City, NY 10001',
            status: 'active',
            avatarUrl: 'https://ui-avatars.com/api/?name=Acme+Corporation&background=0D8ABC&color=fff',
            caseCount: 5,
            lastActivity: 'Payment received',
            lastActivityDate: '2025-05-30T11:15:00',
            dateAdded: '2024-01-10T13:45:00'
          },
          {
            id: '3',
            name: 'Sarah Johnson',
            email: 'sarah.j@example.com',
            phone: '(555) 345-6789',
            type: 'individual',
            address: '789 Residential Blvd, Hometown, TX 75001',
            status: 'inactive',
            avatarUrl: 'https://randomuser.me/api/portraits/women/2.jpg',
            caseCount: 1,
            lastActivity: 'Case closed',
            lastActivityDate: '2025-04-15T16:20:00',
            dateAdded: '2024-03-05T10:30:00'
          },
          {
            id: '4',
            name: 'Community Foundation',
            email: 'info@communityfoundation.org',
            phone: '(555) 234-5678',
            type: 'nonprofit',
            address: '101 Charity Lane, Helpville, CA 92101',
            status: 'active',
            avatarUrl: 'https://ui-avatars.com/api/?name=Community+Foundation&background=27AE60&color=fff',
            caseCount: 3,
            lastActivity: 'Meeting scheduled',
            lastActivityDate: '2025-05-29T09:45:00',
            dateAdded: '2024-02-20T14:15:00'
          },
          {
            id: '5',
            name: 'Michael Rodriguez',
            email: 'm.rodriguez@example.com',
            phone: '(555) 876-5432',
            type: 'individual',
            address: '567 Oak Street, Springfield, IL 62701',
            status: 'active',
            avatarUrl: 'https://randomuser.me/api/portraits/men/3.jpg',
            caseCount: 2,
            lastActivity: 'Document reviewed',
            lastActivityDate: '2025-05-31T13:10:00',
            dateAdded: '2024-04-10T11:00:00'
          },
          {
            id: '6',
            name: 'City of Metropolis',
            email: 'legal@metropolis.gov',
            phone: '(555) 789-0123',
            type: 'government',
            address: '1 Government Plaza, Metropolis, NY 10002',
            status: 'active',
            avatarUrl: 'https://ui-avatars.com/api/?name=City+of+Metropolis&background=D35400&color=fff',
            caseCount: 4,
            lastActivity: 'Contract reviewed',
            lastActivityDate: '2025-05-27T15:30:00',
            dateAdded: '2024-01-05T08:30:00'
          }
        ];
        
        setClients(mockClients);
        setFilteredClients(mockClients);
        setLoading(false);
      } catch (err) {
        setError('Failed to load clients. Please try again later.');
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  // Filter and sort clients
  useEffect(() => {
    let result = [...clients];
    
    // Apply search filter
    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      result = result.filter(client => 
        client.name.toLowerCase().includes(lowercasedTerm) ||
        client.email.toLowerCase().includes(lowercasedTerm) ||
        client.phone.includes(searchTerm)
      );
    }
    
    // Apply status filter
    if (filterStatus !== 'all') {
      result = result.filter(client => client.status === filterStatus);
    }
    
    // Apply type filter
    if (filterType !== 'all') {
      result = result.filter(client => client.type === filterType);
    }
    
    // Apply sorting
    result.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      if (sortField === 'lastActivityDate' || sortField === 'dateAdded') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    
    setFilteredClients(result);
  }, [clients, searchTerm, filterStatus, filterType, sortField, sortDirection]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (filterType, value) => {
    if (filterType === 'status') {
      setFilterStatus(value);
    } else if (filterType === 'type') {
      setFilterType(value);
    }
    
    // Close filter menu after selection on mobile
    if (window.innerWidth < 768) {
      setIsFilterMenuOpen(false);
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const resetFilters = () => {
    setSearchTerm('');
    setFilterStatus('all');
    setFilterType('all');
    setIsFilterMenuOpen(false);
  };

  const handleAddClient = () => {
    setIsAddClientModalOpen(true);
  };

  const handleNewClientChange = (e) => {
    const { name, value } = e.target;
    setNewClient(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitNewClient = (e) => {
    e.preventDefault();
    // In a real app, you would send this data to your API
    const newClientWithId = {
      ...newClient,
      id: `temp-${Date.now()}`,
      avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(newClient.name)}&background=random&color=fff`,
      caseCount: 0,
      lastActivity: 'Client added',
      lastActivityDate: new Date().toISOString(),
      dateAdded: new Date().toISOString()
    };
    
    setClients(prev => [newClientWithId, ...prev]);
    setIsAddClientModalOpen(false);
    setNewClient({
      name: '',
      email: '',
      phone: '',
      type: 'individual',
      address: '',
      status: 'active',
      notes: ''
    });
  };

  const handleDeleteClient = (e, client) => {
    e.stopPropagation();
    setSelectedClient(client);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteClient = () => {
    // In a real app, you would call your API to delete the client
    setClients(prev => prev.filter(c => c.id !== selectedClient.id));
    setIsDeleteModalOpen(false);
    setSelectedClient(null);
  };

  const handleClientClick = (client) => {
    // Navigate to client details page
    navigate(`/attorney/clients/${client.id}`);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getClientTypeIcon = (type) => {
    switch (type) {
      case 'individual':
        return <HiOutlineUserCircle className="h-6 w-6 text-blue-500" />;
      case 'business':
        return <HiOutlineOfficeBuilding className="h-6 w-6 text-indigo-500" />;
      case 'nonprofit':
        return <HiOutlineUsers className="h-6 w-6 text-green-500" />;
      case 'government':
        return <HiOutlineOfficeBuilding className="h-6 w-6 text-orange-500" />;
      default:
        return <HiOutlineUserCircle className="h-6 w-6 text-gray-500" />;
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Page header */}
        <div className="md:flex md:items-center md:justify-between mb-6">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-semibold text-gray-900 flex items-center">
              <HiOutlineUsers className="h-6 w-6 text-[#800000] mr-2" />
              Client Management
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your clients and their information
            </p>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <button
              type="button"
              onClick={handleAddClient}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#800000] hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
            >
              <HiOutlinePlus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              New Client
            </button>
          </div>
        </div>

        {/* Error alert */}
        {error && (
          <div className="rounded-md bg-red-50 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <HiOutlineExclamation className="h-5 w-5 text-red-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">{error}</h3>
              </div>
            </div>
          </div>
        )}

        {/* Search and filters */}
        <div className="bg-white shadow-sm rounded-lg p-4 mb-6">
          <div className="md:flex md:items-center md:justify-between">
            <div className="relative rounded-md shadow-sm md:w-96">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <HiOutlineSearch className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                type="text"
                name="search"
                id="search"
                value={searchTerm}
                onChange={handleSearchChange}
                className="focus:ring-[#800000] focus:border-[#800000] block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                placeholder="Search clients by name, email, phone..."
              />
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-2">
              <div className="flex items-center space-x-2 mr-2">
                <button
                  type="button"
                  onClick={() => setViewStyle('table')}
                  className={`p-1.5 rounded-md ${viewStyle === 'table' ? 'bg-gray-100 text-gray-800' : 'text-gray-500 hover:bg-gray-50'}`}
                  title="Table View"
                >
                  <HiOutlineClipboardList className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewStyle('card')}
                  className={`p-1.5 rounded-md ${viewStyle === 'card' ? 'bg-gray-100 text-gray-800' : 'text-gray-500 hover:bg-gray-50'}`}
                  title="Card View"
                >
                  <HiOutlineUsers className="h-5 w-5" />
                </button>
              </div>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                >
                  <HiOutlineFilter className="-ml-1 mr-2 h-5 w-5 text-gray-400" aria-hidden="true" />
                  Filters
                  {(filterStatus !== 'all' || filterType !== 'all') && (
                    <span className="ml-1 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#800000] text-white">
                      {{
                        [filterStatus !== 'all']: 1,
                        [filterType !== 'all']: 1
                      }[true]}
                    </span>
                  )}
                </button>
                {isFilterMenuOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-72 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                    <div className="py-1 border-b border-gray-200">
                      <div className="px-4 py-2 text-sm font-medium text-gray-700 flex justify-between items-center">
                        <span>Filters</span>
                        <button
                          type="button"
                          onClick={resetFilters}
                          className="text-sm text-[#800000] hover:text-[#600000]"
                        >
                          Reset all
                        </button>
                      </div>
                    </div>
                    <div className="py-2 px-4">
                      <div className="mb-4">
                        <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700">
                          Status
                        </label>
                        <select
                          id="status-filter"
                          name="status-filter"
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm rounded-md"
                          value={filterStatus}
                          onChange={(e) => handleFilterChange('status', e.target.value)}
                        >
                          <option value="all">All Statuses</option>
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                          <option value="pending">Pending</option>
                        </select>
                      </div>
                      
                      <div className="mb-4">
                        <label htmlFor="type-filter" className="block text-sm font-medium text-gray-700">
                          Client Type
                        </label>
                        <select
                          id="type-filter"
                          name="type-filter"
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm rounded-md"
                          value={filterType}
                          onChange={(e) => handleFilterChange('type', e.target.value)}
                        >
                          <option value="all">All Types</option>
                          {clientTypes.map((type) => (
                            <option key={type.id} value={type.id}>
                              {type.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => resetFilters()}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                >
                  <HiOutlineRefresh className="-ml-1 mr-2 h-5 w-5 text-gray-400" aria-hidden="true" />
                  Reset
                </button>
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                >
                  <HiOutlineAdjustments className="-ml-1 mr-2 h-5 w-5 text-gray-400" aria-hidden="true" />
                  {sortDirection === 'asc' ? (
                    <HiOutlineArrowUp className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  ) : (
                    <HiOutlineArrowDown className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {filterStatus !== 'all' && (
              <div className="inline-flex rounded-full items-center py-1 pl-3 pr-1 text-sm font-medium bg-gray-100 text-gray-800">
                Status: {filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)}
                <button
                  type="button"
                  onClick={() => setFilterStatus('all')}
                  className="flex-shrink-0 ml-1 h-5 w-5 rounded-full inline-flex items-center justify-center text-gray-400 hover:bg-gray-200 hover:text-gray-500 focus:outline-none"
                >
                  <span className="sr-only">Remove filter</span>
                  <HiOutlineX className="h-3 w-3" aria-hidden="true" />
                </button>
              </div>
            )}
            {filterType !== 'all' && (
              <div className="inline-flex rounded-full items-center py-1 pl-3 pr-1 text-sm font-medium bg-gray-100 text-gray-800">
                Type: {clientTypes.find(t => t.id === filterType)?.name || filterType}
                <button
                  type="button"
                  onClick={() => setFilterType('all')}
                  className="flex-shrink-0 ml-1 h-5 w-5 rounded-full inline-flex items-center justify-center text-gray-400 hover:bg-gray-200 hover:text-gray-500 focus:outline-none"
                >
                  <span className="sr-only">Remove filter</span>
                  <HiOutlineX className="h-3 w-3" aria-hidden="true" />
                </button>
              </div>
            )}
            {searchTerm && (
              <div className="inline-flex rounded-full items-center py-1 pl-3 pr-1 text-sm font-medium bg-gray-100 text-gray-800">
                Search: {searchTerm}
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="flex-shrink-0 ml-1 h-5 w-5 rounded-full inline-flex items-center justify-center text-gray-400 hover:bg-gray-200 hover:text-gray-500 focus:outline-none"
                >
                  <span className="sr-only">Remove filter</span>
                  <HiOutlineX className="h-3 w-3" aria-hidden="true" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Client count and sort options */}
        <div className="mb-4 flex justify-between items-center">
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">{filteredClients.length}</span> clients
            {filteredClients.length !== clients.length && (
              <>
                {' '}
                (filtered from <span className="font-medium">{clients.length}</span> total)
              </>
            )}
          </p>
          <div className="flex items-center text-sm text-gray-500">
            <span className="mr-1">Sort by:</span>
            <button
              className={`px-3 py-1 rounded-md text-sm ${
                sortField === 'name' ? 'bg-gray-100 font-medium' : ''
              }`}
              onClick={() => handleSort('name')}
            >
              Name
            </button>
            <button
              className={`px-3 py-1 rounded-md text-sm ${
                sortField === 'caseCount' ? 'bg-gray-100 font-medium' : ''
              }`}
              onClick={() => handleSort('caseCount')}
            >
              Cases
            </button>
            <button
              className={`px-3 py-1 rounded-md text-sm ${
                sortField === 'lastActivityDate' ? 'bg-gray-100 font-medium' : ''
              }`}
              onClick={() => handleSort('lastActivityDate')}
            >
              Recent Activity
            </button>
          </div>
        </div>

        {/* Loading state */}
        {loading ? (
          <div className="bg-white shadow rounded-lg p-8 flex justify-center">
            <div className="animate-pulse flex flex-col items-center">
              <div className="rounded-full bg-gray-200 h-12 w-12 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-48 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-64"></div>
              <div className="mt-4 text-sm text-gray-500">Loading clients...</div>
            </div>
          </div>
        ) : (
          <>
            {/* Card view */}
            {viewStyle === 'card' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {filteredClients.length === 0 ? (
                  <div className="col-span-full bg-white rounded-lg shadow-sm p-6 text-center">
                    <div className="flex flex-col items-center">
                      <HiOutlineUsers className="h-10 w-10 text-gray-300" />
                      <p className="mt-2 text-sm font-medium">No clients found</p>
                      <p className="mt-1 text-sm">Try adjusting your search or filters</p>
                      <button
                        type="button"
                        onClick={resetFilters}
                        className="mt-4 inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                      >
                        <HiOutlineRefresh className="-ml-1 mr-1 h-4 w-4" aria-hidden="true" />
                        Reset filters
                      </button>
                    </div>
                  </div>
                ) : (
                  filteredClients.map((client) => (
                    <div
                      key={client.id}
                      className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200 cursor-pointer"
                      onClick={() => handleClientClick(client)}
                    >
                      <div className="p-5">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center">
                            <img
                              className="h-12 w-12 rounded-full mr-4"
                              src={client.avatarUrl}
                              alt={client.name}
                            />
                            <div>
                              <h3 className="text-lg font-medium text-gray-900">{client.name}</h3>
                              <p className="text-sm text-gray-500 flex items-center mt-1">
                                {getClientTypeIcon(client.type)}
                                <span className="ml-1">{clientTypes.find(t => t.id === client.type)?.name}</span>
                              </p>
                            </div>
                          </div>
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(client.status)}`}>
                            {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                          </span>
                        </div>
                        <div className="mt-4 grid grid-cols-1 gap-2">
                          <div className="flex items-center text-sm text-gray-600">
                            <HiOutlineMail className="mr-1.5 h-4 w-4 text-gray-400" />
                            <span className="truncate">{client.email}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <HiOutlinePhone className="mr-1.5 h-4 w-4 text-gray-400" />
                            <span>{client.phone}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <HiOutlineOfficeBuilding className="mr-1.5 h-4 w-4 text-gray-400 flex-shrink-0" />
                            <span className="truncate">{client.address}</span>
                          </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center text-sm text-gray-500">
                              <HiOutlineDocumentText className="mr-1.5 h-4 w-4 text-gray-400" />
                              <span>{client.caseCount} {client.caseCount === 1 ? 'case' : 'cases'}</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                              <HiOutlineClock className="mr-1.5 h-4 w-4 text-gray-400" />
                              <span>{formatDate(client.lastActivityDate)}</span>
                            </div>
                          </div>
                          <div className="mt-2 flex justify-end space-x-2" onClick={(e) => e.stopPropagation()}>
                            <button
                              className="text-gray-400 hover:text-gray-500"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/attorney/clients/${client.id}/edit`);
                              }}
                              title="Edit Client"
                            >
                              <HiOutlinePencilAlt className="h-5 w-5" />
                            </button>
                            <button
                              className="text-gray-400 hover:text-red-500"
                              onClick={(e) => handleDeleteClient(e, client)}
                              title="Delete Client"
                            >
                              <HiOutlineTrash className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Table view */}
            {viewStyle === 'table' && (
              <div className="bg-white shadow-sm overflow-hidden rounded-lg">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                          onClick={() => handleSort('name')}
                        >
                          <div className="flex items-center">
                            <span>Client</span>
                            {sortField === 'name' && (
                              <span className="ml-2">
                                {sortDirection === 'asc' ? (
                                  <HiOutlineArrowUp className="h-4 w-4" />
                                ) : (
                                  <HiOutlineArrowDown className="h-4 w-4" />
                                )}
                              </span>
                            )}
                          </div>
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                          onClick={() => handleSort('type')}
                        >
                          <div className="flex items-center">
                            <span>Type</span>
                            {sortField === 'type' && (
                              <span className="ml-2">
                                {sortDirection === 'asc' ? (
                                  <HiOutlineArrowUp className="h-4 w-4" />
                                ) : (
                                  <HiOutlineArrowDown className="h-4 w-4" />
                                )}
                              </span>
                            )}
                          </div>
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Contact
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                          onClick={() => handleSort('caseCount')}
                        >
                          <div className="flex items-center">
                            <span>Cases</span>
                            {sortField === 'caseCount' && (
                              <span className="ml-2">
                                {sortDirection === 'asc' ? (
                                  <HiOutlineArrowUp className="h-4 w-4" />
                                ) : (
                                  <HiOutlineArrowDown className="h-4 w-4" />
                                )}
                              </span>
                            )}
                          </div>
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                          onClick={() => handleSort('lastActivityDate')}
                        >
                          <div className="flex items-center">
                            <span>Last Activity</span>
                            {sortField === 'lastActivityDate' && (
                              <span className="ml-2">
                                {sortDirection === 'asc' ? (
                                  <HiOutlineArrowUp className="h-4 w-4" />
                                ) : (
                                  <HiOutlineArrowDown className="h-4 w-4" />
                                )}
                              </span>
                            )}
                          </div>
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredClients.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="px-6 py-10 text-center text-gray-500">
                            <div className="flex flex-col items-center">
                              <HiOutlineUsers className="h-10 w-10 text-gray-300" />
                              <p className="mt-2 text-sm font-medium">No clients found</p>
                              <p className="mt-1 text-sm">Try adjusting your search or filters</p>
                              <button
                                type="button"
                                onClick={resetFilters}
                                className="mt-4 inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                              >
                                <HiOutlineRefresh className="-ml-1 mr-1 h-4 w-4" aria-hidden="true" />
                                Reset filters
                              </button>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        filteredClients.map((client) => (
                          <tr 
                            key={client.id} 
                            className="hover:bg-gray-50 cursor-pointer"
                            onClick={() => handleClientClick(client)}
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0">
                                  <img
                                    className="h-10 w-10 rounded-full"
                                    src={client.avatarUrl}
                                    alt={client.name}
                                  />
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{client.name}</div>
                                  <div className="text-xs text-gray-500 mt-1">Client since {formatDate(client.dateAdded)}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                {getClientTypeIcon(client.type)}
                                <span className="ml-2 text-sm text-gray-900">
                                  {clientTypes.find(t => t.id === client.type)?.name}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{client.email}</div>
                              <div className="text-sm text-gray-500">{client.phone}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(client.status)}`}>
                                {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {client.caseCount}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{formatDate(client.lastActivityDate)}</div>
                              <div className="text-xs text-gray-500">{client.lastActivity}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex justify-end space-x-2" onClick={(e) => e.stopPropagation()}>
                                <button
                                  className="text-gray-600 hover:text-[#800000]"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/attorney/clients/${client.id}/edit`);
                                  }}
                                  title="Edit Client"
                                >
                                  <HiOutlinePencilAlt className="h-5 w-5" />
                                </button>
                                <button
                                  className="text-gray-600 hover:text-red-600"
                                  onClick={(e) => handleDeleteClient(e, client)}
                                  title="Delete Client"
                                >
                                  <HiOutlineTrash className="h-5 w-5" />
                                </button>
                                <Menu as="div" className="relative inline-block text-left">
                                  <Menu.Button className="text-gray-600 hover:text-[#800000]">
                                    <HiOutlineDotsVertical className="h-5 w-5" />
                                  </Menu.Button>
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
                                        <Menu.Item>
                                          {({ active }) => (
                                            <Link
                                              to={`/attorney/clients/${client.id}`}
                                              className={`${
                                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                              } flex px-4 py-2 text-sm`}
                                            >
                                              <HiOutlineEye className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
                                              View details
                                            </Link>
                                          )}
                                        </Menu.Item>
                                        <Menu.Item>
                                          {({ active }) => (
                                            <Link
                                              to={`/attorney/clients/${client.id}/cases`}
                                              className={`${
                                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                              } flex px-4 py-2 text-sm`}
                                            >
                                              <HiOutlineDocumentText className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
                                              View cases
                                            </Link>
                                          )}
                                        </Menu.Item>
                                        <Menu.Item>
                                          {({ active }) => (
                                            <Link
                                              to={`/attorney/clients/${client.id}/edit`}
                                              className={`${
                                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                              } flex px-4 py-2 text-sm`}
                                            >
                                              <HiOutlinePencilAlt className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
                                              Edit client
                                            </Link>
                                          )}
                                        </Menu.Item>
                                        <Menu.Item>
                                          {({ active }) => (
                                            <button
                                              className={`${
                                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                              } flex w-full px-4 py-2 text-sm`}
                                              onClick={(e) => handleDeleteClient(e, client)}
                                            >
                                              <HiOutlineTrash className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
                                              Delete
                                            </button>
                                          )}
                                        </Menu.Item>
                                      </div>
                                    </Menu.Items>
                                  </Transition>
                                </Menu>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}

        {/* Add Client Modal */}
        <Transition appear show={isAddClientModalOpen} as={Fragment}>
          <Dialog
            as="div"
            className="fixed inset-0 z-10 overflow-y-auto"
            onClose={() => setIsAddClientModalOpen(false)}
          >
            <div className="min-h-screen px-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
              </Transition.Child>

              {/* This element is to trick the browser into centering the modal contents. */}
              <span
                className="inline-block h-screen align-middle"
                aria-hidden="true"
              >
                &#8203;
              </span>
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Add New Client
                  </Dialog.Title>
                  <form onSubmit={handleSubmitNewClient} className="mt-4">
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                          Client Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          id="name"
                          required
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm"
                          value={newClient.name}
                          onChange={handleNewClientChange}
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                          Email *
                        </label>
                        <input
                          type="email"
                          name="email"
                          id="email"
                          required
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm"
                          value={newClient.email}
                          onChange={handleNewClientChange}
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                          Phone
                        </label>
                        <input
                          type="text"
                          name="phone"
                          id="phone"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm"
                          value={newClient.phone}
                          onChange={handleNewClientChange}
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                          Client Type
                        </label>
                        <select
                          id="type"
                          name="type"
                          className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm"
                          value={newClient.type}
                          onChange={handleNewClientChange}
                        >
                          {clientTypes.map((type) => (
                            <option key={type.id} value={type.id}>
                              {type.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                          Address
                        </label>
                        <input
                          type="text"
                          name="address"
                          id="address"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm"
                          value={newClient.address}
                          onChange={handleNewClientChange}
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                          Status
                        </label>
                        <select
                          id="status"
                          name="status"
                          className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm"
                          value={newClient.status}
                          onChange={handleNewClientChange}
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                          <option value="pending">Pending</option>
                        </select>
                      </div>
                      
                      <div>
                        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                          Notes
                        </label>
                        <textarea
                          id="notes"
                          name="notes"
                          rows="3"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm"
                          value={newClient.notes}
                          onChange={handleNewClientChange}
                        ></textarea>
                      </div>
                    </div>
                    
                    <div className="mt-6 flex justify-end">
                      <button
                        type="button"
                        onClick={() => setIsAddClientModalOpen(false)}
                        className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000] mr-3"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#800000] hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                      >
                        <HiOutlinePlus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                        Create Client
                      </button>
                    </div>
                  </form>
                </div>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition>

        {/* Delete Client Confirmation Modal */}
        <Transition appear show={isDeleteModalOpen} as={Fragment}>
          <Dialog
            as="div"
            className="fixed inset-0 z-10 overflow-y-auto"
            onClose={() => setIsDeleteModalOpen(false)}
          >
            <div className="min-h-screen px-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
              </Transition.Child>

              {/* This element is to trick the browser into centering the modal contents. */}
              <span
                className="inline-block h-screen align-middle"
                aria-hidden="true"
              >
                &#8203;
              </span>
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Delete Client
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to delete <span className="font-medium">{selectedClient?.name}</span>? This action cannot be undone.
                      {selectedClient?.caseCount > 0 && (
                        <span className="block mt-2 text-red-500">
                          Warning: This client has {selectedClient.caseCount} active {selectedClient.caseCount === 1 ? 'case' : 'cases'}.
                        </span>
                      )}
                    </p>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setIsDeleteModalOpen(false)}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000] mr-2"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={confirmDeleteClient}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600"
                    >
                      <HiOutlineTrash className="mr-2 h-5 w-5" aria-hidden="true" />
                      Delete
                    </button>
                  </div>
                </div>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition>
      </div>
    </div>
  );
};

export default AttorneyClientsPage;
