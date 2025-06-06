import React, { useState, useEffect, Fragment } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Dialog, Menu, Transition } from '@headlessui/react';
import { useAuth } from '../../../context/AuthContext';
import { format, parseISO, isAfter } from 'date-fns';
import { 
  HiOutlineBriefcase, 
  HiOutlineSearch, 
  HiOutlineFilter, 
  HiOutlinePlus,
  HiOutlineCalendar,
  HiOutlineDocumentText,
  HiOutlineUserGroup,
  HiOutlineOfficeBuilding,
  HiOutlineClock,
  HiOutlineCash,
  HiOutlineExclamation,
  HiOutlineExclamationCircle,
  HiOutlineCheckCircle,
  HiOutlineCog,
  HiChevronDown,
  HiOutlinePencilAlt,
  HiOutlineTrash,
  HiOutlineDotsVertical,
  HiOutlineClipboardList,
  HiOutlineX,
  HiOutlineRefresh,
  HiOutlineTag,
  HiOutlineAdjustments, // Use this instead of HiOutlineSort
  HiOutlineArrowUp,
  HiOutlineArrowDown,
  HiOutlineEye,
  HiOutlinePhotograph,
  HiOutlineCloudUpload,
  HiOutlineUsers,
  HiOutlineViewGrid,  // Add this import
} from 'react-icons/hi';

const AttorneyCasesPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cases, setCases] = useState([]);
  const [filteredCases, setFilteredCases] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [sortField, setSortField] = useState('lastActivityDate');
  const [sortDirection, setSortDirection] = useState('desc');
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [isAddCaseModalOpen, setIsAddCaseModalOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [newCase, setNewCase] = useState({
    title: '',
    clientId: '',
    type: 'personal-injury',
    description: '',
    priority: 'medium',
  });
  const [viewStyle, setViewStyle] = useState('table'); // 'table' or 'card'

  // Mock clients data
  const clients = [
    { id: 1, name: 'Sarah Smith', email: 'sarah.smith@example.com' },
    { id: 2, name: 'Robert Williams', email: 'robert.williams@example.com' },
    { id: 3, name: 'Amanda Jones', email: 'amanda.jones@example.com' },
    { id: 4, name: 'Thomas Brown', email: 'thomas.brown@example.com' },
    { id: 5, name: 'Elizabeth Taylor', email: 'elizabeth.taylor@example.com' },
    { id: 6, name: 'Michael Johnson', email: 'michael.johnson@example.com' },
  ];

  // Case type options
  const caseTypes = [
    { id: 'personal-injury', name: 'Personal Injury' },
    { id: 'family-law', name: 'Family Law' },
    { id: 'corporate', name: 'Corporate' },
    { id: 'estate-planning', name: 'Estate Planning' },
    { id: 'criminal-defense', name: 'Criminal Defense' },
    { id: 'employment', name: 'Employment' },
    { id: 'immigration', name: 'Immigration' },
    { id: 'intellectual-property', name: 'Intellectual Property' },
    { id: 'real-estate', name: 'Real Estate' },
    { id: 'tax', name: 'Tax Law' },
  ];

  // Mock data for cases
  const mockCases = [
    {
      id: 1,
      title: 'Smith v. Johnson',
      caseNumber: 'PI-2025-0042',
      type: 'personal-injury',
      typeLabel: 'Personal Injury',
      client: {
        id: 1,
        name: 'Sarah Smith',
        email: 'sarah.smith@example.com',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      },
      status: 'active',
      priority: 'high',
      judge: 'Hon. Robert Stevens',
      court: 'Johannesburg High Court',
      filingDate: '2025-03-15',
      nextHearing: '2025-06-10',
      lastActivityDate: '2025-06-01',
      lastActivity: 'Prepared settlement proposal',
      assignedTo: 'Jennifer Wilson',
      description: 'Personal injury case involving automobile accident. Client seeking damages for medical expenses and lost wages.',
      billableHours: 32.5,
      billingStatus: 'current',
      tags: ['auto accident', 'insurance claim'],
      deadlines: [
        { id: 101, title: 'Submit Settlement Proposal', date: '2025-06-10', completed: false },
        { id: 102, title: 'Expert Witness Deposition', date: '2025-06-25', completed: false }
      ],
      documents: [
        { id: 201, name: 'Medical Report.pdf', uploadDate: '2025-04-10', type: 'evidence' },
        { id: 202, name: 'Accident Photos.zip', uploadDate: '2025-04-02', type: 'evidence' },
        { id: 203, name: 'Initial Demand Letter.docx', uploadDate: '2025-04-15', type: 'correspondence' }
      ]
    },
    {
      id: 2,
      title: 'Estate of Williams',
      caseNumber: 'EP-2025-0078',
      type: 'estate-planning',
      typeLabel: 'Estate Planning',
      client: {
        id: 2,
        name: 'Robert Williams',
        email: 'robert.williams@example.com',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      },
      status: 'active',
      priority: 'medium',
      judge: 'N/A',
      court: 'N/A',
      filingDate: '2025-04-05',
      nextHearing: null,
      lastActivityDate: '2025-05-30',
      lastActivity: 'Updated will and testament',
      assignedTo: 'Jennifer Wilson',
      description: 'Estate planning for high net worth client. Includes trust formation, will creation, and tax planning.',
      billableHours: 12.5,
      billingStatus: 'current',
      tags: ['trust', 'will', 'estate'],
      deadlines: [
        { id: 103, title: 'File Trust Documents', date: '2025-06-20', completed: false }
      ],
      documents: [
        { id: 204, name: 'Last Will and Testament.docx', uploadDate: '2025-05-10', type: 'legal document' },
        { id: 205, name: 'Trust Agreement.pdf', uploadDate: '2025-05-25', type: 'legal document' }
      ]
    },
    {
      id: 3,
      title: 'Jones Divorce',
      caseNumber: 'FL-2025-0134',
      type: 'family-law',
      typeLabel: 'Family Law',
      client: {
        id: 3,
        name: 'Amanda Jones',
        email: 'amanda.jones@example.com',
        avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      },
      status: 'active',
      priority: 'high',
      judge: 'Hon. Sandra Williams',
      court: 'Cape Town Family Court',
      filingDate: '2025-02-28',
      nextHearing: '2025-06-15',
      lastActivityDate: '2025-05-25',
      lastActivity: 'Prepared for mediation session',
      assignedTo: 'Daniel Thompson',
      description: 'Divorce proceedings involving child custody disputes and division of significant assets.',
      billableHours: 28.0,
      billingStatus: 'overdue',
      tags: ['divorce', 'custody', 'mediation'],
      deadlines: [
        { id: 104, title: 'Mediation Session', date: '2025-06-07', completed: false },
        { id: 105, title: 'Court Hearing', date: '2025-06-25', completed: false }
      ],
      documents: [
        { id: 206, name: 'Asset Inventory.xlsx', uploadDate: '2025-03-15', type: 'financial' },
        { id: 207, name: 'Custody Proposal.pdf', uploadDate: '2025-04-20', type: 'legal document' },
        { id: 208, name: 'Mediation Brief.docx', uploadDate: '2025-05-25', type: 'legal document' }
      ]
    },
    {
      id: 4,
      title: 'Brown LLC Contract',
      caseNumber: 'CORP-2025-0056',
      type: 'corporate',
      typeLabel: 'Corporate',
      client: {
        id: 4,
        name: 'Thomas Brown',
        email: 'thomas.brown@example.com',
        avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      },
      status: 'pending',
      priority: 'low',
      judge: 'N/A',
      court: 'N/A',
      filingDate: '2025-05-01',
      nextHearing: null,
      lastActivityDate: '2025-05-29',
      lastActivity: 'Reviewed contract revisions',
      assignedTo: 'Jennifer Wilson',
      description: 'Corporate contract review and negotiation for supplier agreement.',
      billableHours: 8.5,
      billingStatus: 'current',
      tags: ['contract', 'commercial', 'negotiation'],
      deadlines: [
        { id: 106, title: 'Contract Review Completion', date: '2025-06-15', completed: false }
      ],
      documents: [
        { id: 209, name: 'Supplier Agreement.docx', uploadDate: '2025-05-02', type: 'contract' },
        { id: 210, name: 'Negotiation Notes.pdf', uploadDate: '2025-05-20', type: 'internal' }
      ]
    },
    {
      id: 5,
      title: 'Taylor v. Insurance Co.',
      caseNumber: 'PI-2025-0063',
      type: 'personal-injury',
      typeLabel: 'Personal Injury',
      client: {
        id: 5,
        name: 'Elizabeth Taylor',
        email: 'elizabeth.taylor@example.com',
        avatarUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      },
      status: 'active',
      priority: 'medium',
      judge: 'Hon. Michael Langford',
      court: 'Pretoria High Court',
      filingDate: '2025-04-12',
      nextHearing: '2025-07-20',
      lastActivityDate: '2025-05-28',
      lastActivity: 'Received insurance response',
      assignedTo: 'Daniel Thompson',
      description: 'Insurance claim dispute for workplace injury. Client seeking compensation for permanent disability.',
      billableHours: 18.5,
      billingStatus: 'current',
      tags: ['insurance', 'workplace injury', 'disability'],
      deadlines: [
        { id: 107, title: 'Expert Medical Evaluation', date: '2025-06-30', completed: false },
        { id: 108, title: 'Response to Discovery', date: '2025-07-15', completed: false }
      ],
      documents: [
        { id: 211, name: 'Medical Evaluation.pdf', uploadDate: '2025-04-15', type: 'evidence' },
        { id: 212, name: 'Insurance Correspondence.pdf', uploadDate: '2025-05-20', type: 'correspondence' }
      ]
    },
    {
      id: 6,
      title: 'Johnson Criminal Defense',
      caseNumber: 'CR-2025-0092',
      type: 'criminal-defense',
      typeLabel: 'Criminal Defense',
      client: {
        id: 6,
        name: 'Michael Johnson',
        email: 'michael.johnson@example.com',
        avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      },
      status: 'active',
      priority: 'high',
      judge: 'Hon. Patricia Edwards',
      court: 'Durban Criminal Court',
      filingDate: '2025-05-10',
      nextHearing: '2025-06-05',
      lastActivityDate: '2025-06-01',
      lastActivity: 'Prepared defense strategy',
      assignedTo: 'Daniel Thompson',
      description: 'Criminal defense case for alleged fraud charges. Focus on procedural violations during investigation.',
      billableHours: 22.0,
      billingStatus: 'pending',
      tags: ['criminal', 'fraud', 'defense'],
      deadlines: [
        { id: 109, title: 'Motion to Dismiss Filing', date: '2025-06-03', completed: false },
        { id: 110, title: 'Preliminary Hearing', date: '2025-06-05', completed: false }
      ],
      documents: [
        { id: 213, name: 'Police Report.pdf', uploadDate: '2025-05-12', type: 'evidence' },
        { id: 214, name: 'Character References.pdf', uploadDate: '2025-05-20', type: 'evidence' },
        { id: 215, name: 'Motion to Dismiss.docx', uploadDate: '2025-05-30', type: 'legal document' }
      ]
    }
  ];

  // Load mock data
  useEffect(() => {
    const fetchCases = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        setCases(mockCases);
        setFilteredCases(mockCases);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching cases:', error);
        setError('Failed to load cases. Please try again.');
        setLoading(false);
      }
    };

    fetchCases();
  }, []);

  // Filter and sort cases when filter criteria or search term changes
  useEffect(() => {
    let result = [...cases];
    
    // Apply search filter
    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      result = result.filter(
        (caseItem) =>
          caseItem.title.toLowerCase().includes(lowercasedTerm) ||
          caseItem.caseNumber.toLowerCase().includes(lowercasedTerm) ||
          caseItem.client.name.toLowerCase().includes(lowercasedTerm) ||
          caseItem.description.toLowerCase().includes(lowercasedTerm) ||
          caseItem.typeLabel.toLowerCase().includes(lowercasedTerm)
      );
    }
    
    // Apply status filter
    if (filterStatus !== 'all') {
      result = result.filter((caseItem) => caseItem.status === filterStatus);
    }
    
    // Apply type filter
    if (filterType !== 'all') {
      result = result.filter((caseItem) => caseItem.type === filterType);
    }
    
    // Apply priority filter
    if (filterPriority !== 'all') {
      result = result.filter((caseItem) => caseItem.priority === filterPriority);
    }
    
    // Apply sorting
    result.sort((a, b) => {
      if (sortField === 'title') {
        return sortDirection === 'asc'
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      } else if (sortField === 'client') {
        return sortDirection === 'asc'
          ? a.client.name.localeCompare(b.client.name)
          : b.client.name.localeCompare(a.client.name);
      } else if (sortField === 'lastActivityDate') {
        return sortDirection === 'asc'
          ? new Date(a.lastActivityDate) - new Date(b.lastActivityDate)
          : new Date(b.lastActivityDate) - new Date(a.lastActivityDate);
      } else if (sortField === 'priority') {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return sortDirection === 'asc'
          ? priorityOrder[a.priority] - priorityOrder[b.priority]
          : priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      return 0;
    });
    
    setFilteredCases(result);
  }, [cases, searchTerm, filterStatus, filterType, filterPriority, sortField, sortDirection]);

  // Toggle sort direction or change sort field
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm('');
    setFilterStatus('all');
    setFilterType('all');
    setFilterPriority('all');
    setSortField('lastActivityDate');
    setSortDirection('desc');
  };

  // Handle filter changes
  const handleFilterChange = (filter, value) => {
    switch (filter) {
      case 'status':
        setFilterStatus(value);
        break;
      case 'type':
        setFilterType(value);
        break;
      case 'priority':
        setFilterPriority(value);
        break;
      default:
        break;
    }
  };

  // Handle opening case details
  const handleCaseClick = (caseItem) => {
    navigate(`/attorney/cases/${caseItem.id}`);
  };

  // Handle add new case
  const handleAddCase = () => {
    setIsAddCaseModalOpen(true);
  };

  // Handle new case input change
  const handleNewCaseChange = (e) => {
    const { name, value } = e.target;
    setNewCase((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle submit new case
  const handleSubmitNewCase = (e) => {
    e.preventDefault();
    
    // Simulate API call
    const newCaseItem = {
      id: cases.length + 1,
      title: newCase.title,
      caseNumber: `${newCase.type.toUpperCase().substring(0, 4)}-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
      type: newCase.type,
      typeLabel: caseTypes.find(type => type.id === newCase.type)?.name || 'Other',
      client: clients.find(client => client.id === parseInt(newCase.clientId)) || {
        id: 1,
        name: 'Unknown Client',
        email: 'unknown@example.com'
      },
      status: 'active',
      priority: newCase.priority,
      judge: 'TBD',
      court: 'TBD',
      filingDate: format(new Date(), 'yyyy-MM-dd'),
      nextHearing: null,
      lastActivityDate: format(new Date(), 'yyyy-MM-dd'),
      lastActivity: 'Case created',
      assignedTo: user?.displayName || 'Current User',
      description: newCase.description,
      billableHours: 0,
      billingStatus: 'pending',
      tags: [],
      deadlines: [],
      documents: []
    };
    
    setCases((prev) => [newCaseItem, ...prev]);
    setIsAddCaseModalOpen(false);
    setNewCase({
      title: '',
      clientId: '',
      type: 'personal-injury',
      description: '',
      priority: 'medium',
    });
  };

  // Handle delete case
  const handleDeleteCase = (e, caseItem) => {
    e.stopPropagation();
    setSelectedCase(caseItem);
    setIsDeleteModalOpen(true);
  };

  // Confirm delete case
  const confirmDeleteCase = () => {
    if (selectedCase) {
      setCases((prev) => prev.filter((caseItem) => caseItem.id !== selectedCase.id));
      setIsDeleteModalOpen(false);
      setSelectedCase(null);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return format(parseISO(dateString), 'd MMM yyyy');
  };

  // Check if deadline is upcoming (within 3 days)
  const isUpcomingDeadline = (dateString) => {
    if (!dateString) return false;
    const deadlineDate = parseISO(dateString);
    const today = new Date();
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(today.getDate() + 3);
    
    return isAfter(deadlineDate, today) && !isAfter(deadlineDate, threeDaysFromNow);
  };

  // Get status badge color
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get priority badge color
  const getPriorityBadgeColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-red-700';
      case 'medium':
        return 'text-yellow-700';
      case 'low':
        return 'text-green-700';
      default:
        return 'text-gray-700';
    }
  };

  // Get priority indicator
  const getPriorityIndicator = (priority) => {
    switch (priority) {
      case 'high':
        return <span className="flex h-2.5 w-2.5 rounded-full bg-red-600 mr-2"></span>;
      case 'medium':
        return <span className="flex h-2.5 w-2.5 rounded-full bg-yellow-500 mr-2"></span>;
      case 'low':
        return <span className="flex h-2.5 w-2.5 rounded-full bg-green-500 mr-2"></span>;
      default:
        return null;
    }
  };

  // Get case type icon
  const getCaseTypeIcon = (type) => {
    switch (type) {
      case 'personal-injury':
        return <HiOutlineExclamationCircle className="h-5 w-5 text-red-500" />;
      case 'family-law':
        return <HiOutlineUserGroup className="h-5 w-5 text-blue-500" />;
      case 'corporate':
        return <HiOutlineOfficeBuilding className="h-5 w-5 text-gray-500" />;
      case 'estate-planning':
        return <HiOutlineDocumentText className="h-5 w-5 text-green-500" />;
      case 'criminal-defense':
        return <HiOutlineBriefcase className="h-5 w-5 text-purple-500" />;
      default:
        return <HiOutlineBriefcase className="h-5 w-5 text-gray-500" />;
    }
  };

  // Get document type icon
  const getDocumentTypeIcon = (type) => {
    switch (type) {
      case 'evidence':
        return <HiOutlinePhotograph className="h-5 w-5 text-blue-500" />;
      case 'legal document':
        return <HiOutlineDocumentText className="h-5 w-5 text-purple-500" />;
      case 'correspondence':
        return <HiOutlineMail className="h-5 w-5 text-green-500" />;
      case 'contract':
        return <HiOutlineClipboardList className="h-5 w-5 text-gray-500" />;
      case 'financial':
        return <HiOutlineCash className="h-5 w-5 text-yellow-500" />;
      default:
        return <HiOutlineDocumentText className="h-5 w-5 text-gray-500" />;
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
              <span className="mt-4 text-gray-600">Loading cases...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Header */}
        <div className="md:flex md:items-center md:justify-between mb-6">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-semibold text-gray-900 flex items-center">
              <HiOutlineBriefcase className="h-6 w-6 text-[#800000] mr-2" />
              Case Management
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage and track all your active legal cases
            </p>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <button
              type="button"
              onClick={handleAddCase}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#800000] hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
            >
              <HiOutlinePlus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              New Case
            </button>
          </div>
        </div>

        {/* Error message */}
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

        {/* Search and Filters */}
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
                placeholder="Search cases by title, number, client..."
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
                  <HiOutlineViewGrid className="h-5 w-5" />
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
                  {(filterStatus !== 'all' || filterType !== 'all' || filterPriority !== 'all') && (
                    <span className="ml-1 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#800000] text-white">
                      {[
                        filterStatus !== 'all' ? 1 : 0,
                        filterType !== 'all' ? 1 : 0,
                        filterPriority !== 'all' ? 1 : 0,
                      ].reduce((a, b) => a + b, 0)}
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
                          <option value="pending">Pending</option>
                          <option value="closed">Closed</option>
                        </select>
                      </div>
                      
                      <div className="mb-4">
                        <label htmlFor="type-filter" className="block text-sm font-medium text-gray-700">
                          Case Type
                        </label>
                        <select
                          id="type-filter"
                          name="type-filter"
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm rounded-md"
                          value={filterType}
                          onChange={(e) => handleFilterChange('type', e.target.value)}
                        >
                          <option value="all">All Types</option>
                          {caseTypes.map((type) => (
                            <option key={type.id} value={type.id}>
                              {type.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="mb-4">
                        <label htmlFor="priority-filter" className="block text-sm font-medium text-gray-700">
                          Priority
                        </label>
                        <select
                          id="priority-filter"
                          name="priority-filter"
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm rounded-md"
                          value={filterPriority}
                          onChange={(e) => handleFilterChange('priority', e.target.value)}
                        >
                          <option value="all">All Priorities</option>
                          <option value="high">High</option>
                          <option value="medium">Medium</option>
                          <option value="low">Low</option>
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
                Type: {caseTypes.find(t => t.id === filterType)?.name || filterType}
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
            {filterPriority !== 'all' && (
              <div className="inline-flex rounded-full items-center py-1 pl-3 pr-1 text-sm font-medium bg-gray-100 text-gray-800">
                Priority: {filterPriority.charAt(0).toUpperCase() + filterPriority.slice(1)}
                <button
                  type="button"
                  onClick={() => setFilterPriority('all')}
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

        {/* Results count */}
        <div className="mb-4 flex justify-between items-center">
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">{filteredCases.length}</span> cases
            {filteredCases.length !== cases.length && (
              <>
                {' '}
                (filtered from <span className="font-medium">{cases.length}</span> total)
              </>
            )}
          </p>
          <div className="flex items-center text-sm text-gray-500">
            <span className="mr-1">Sort by:</span>
            <button
              className={`px-3 py-1 rounded-md text-sm ${
                sortField === 'lastActivityDate' ? 'bg-gray-100 font-medium' : ''
              }`}
              onClick={() => handleSort('lastActivityDate')}
            >
              Recent Activity
            </button>
            <button
              className={`px-3 py-1 rounded-md text-sm ${
                sortField === 'priority' ? 'bg-gray-100 font-medium' : ''
              }`}
              onClick={() => handleSort('priority')}
            >
              Priority
            </button>
            <button
              className={`px-3 py-1 rounded-md text-sm ${
                sortField === 'title' ? 'bg-gray-100 font-medium' : ''
              }`}
              onClick={() => handleSort('title')}
            >
              Title
            </button>
          </div>
        </div>

        {/* Card view */}
        {viewStyle === 'card' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {filteredCases.length === 0 ? (
              <div className="col-span-full bg-white rounded-lg shadow-sm p-6 text-center">
                <div className="flex flex-col items-center">
                  <HiOutlineBriefcase className="h-10 w-10 text-gray-300" />
                  <p className="mt-2 text-sm font-medium">No cases found</p>
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
              filteredCases.map((caseItem) => {
                // Find the next deadline for this case
                const nextDeadline = caseItem.deadlines && caseItem.deadlines.length > 0
                  ? caseItem.deadlines.sort((a, b) => new Date(a.date) - new Date(b.date))[0]
                  : null;
                
                return (
                  <div 
                    key={caseItem.id} 
                    className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all cursor-pointer"
                    onClick={() => handleCaseClick(caseItem)}
                  >
                    <div className="p-5">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-md bg-gray-50 flex items-center justify-center border border-gray-200 mr-3">
                            {getCaseTypeIcon(caseItem.type)}
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-900 line-clamp-1">{caseItem.title}</h3>
                            <p className="text-xs text-gray-500 mt-0.5">{caseItem.caseNumber}</p>
                          </div>
                        </div>
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(caseItem.status)}`}>
                          {caseItem.status.charAt(0).toUpperCase() + caseItem.status.slice(1)}
                        </span>
                      </div>
                      
                      <div className="flex items-center mb-3">
                        <img 
                          className="h-6 w-6 rounded-full mr-2"
                          src={caseItem.client.avatarUrl}
                          alt={caseItem.client.name}
                        />
                        <div className="text-xs text-gray-700">{caseItem.client.name}</div>
                      </div>
                      
                      <div className="flex justify-between mb-3">
                        <div>
                          <p className="text-xs text-gray-500">Priority</p>
                          <div className="flex items-center mt-1">
                            {getPriorityIndicator(caseItem.priority)}
                            <span className={`text-xs ${getPriorityBadgeColor(caseItem.priority)}`}>
                              {caseItem.priority.charAt(0).toUpperCase() + caseItem.priority.slice(1)}
                            </span>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Last Activity</p>
                          <p className="text-xs font-medium mt-1">{formatDate(caseItem.lastActivityDate)}</p>
                        </div>
                      </div>
                      
                      {nextDeadline && (
                        <div className="mb-3">
                          <p className="text-xs text-gray-500">Next Deadline</p>
                          <div className="mt-1">
                            <p className={`text-xs ${isUpcomingDeadline(nextDeadline.date) ? 'font-medium text-red-600' : 'text-gray-900'}`}>
                              {nextDeadline.title} - {formatDate(nextDeadline.date)}
                            </p>
                          </div>
                        </div>
                      )}
                      
                      {caseItem.tags && caseItem.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {caseItem.tags.slice(0, 3).map((tag, index) => (
                            <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                              {tag}
                            </span>
                          ))}
                          {caseItem.tags.length > 3 && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                              +{caseItem.tags.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="bg-gray-50 px-5 py-3 border-t border-gray-200 flex justify-between">
                      <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          className="text-gray-600 hover:text-[#800000]"
                          title="View Documents"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/attorney/cases/${caseItem.id}/documents`);
                          }}
                        >
                          <HiOutlineDocumentText className="h-5 w-5" />
                        </button>
                        <button
                          className="text-gray-600 hover:text-[#800000]"
                          title="View Calendar"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/attorney/cases/${caseItem.id}/calendar`);
                          }}
                        >
                          <HiOutlineCalendar className="h-5 w-5" />
                        </button>
                      </div>
                      <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          className="text-gray-600 hover:text-[#800000]"
                          title="Edit Case"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/attorney/cases/${caseItem.id}/edit`);
                          }}
                        >
                          <HiOutlinePencilAlt className="h-5 w-5" />
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
                                      to={`/attorney/cases/${caseItem.id}`}
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
                                      to={`/attorney/cases/${caseItem.id}/documents`}
                                      className={`${
                                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                      } flex px-4 py-2 text-sm`}
                                    >
                                      <HiOutlineDocumentText className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
                                      Documents
                                    </Link>
                                  )}
                                </Menu.Item>
                                <Menu.Item>
                                  {({ active }) => (
                                    <Link
                                      to={`/attorney/cases/${caseItem.id}/calendar`}
                                      className={`${
                                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                      } flex px-4 py-2 text-sm`}
                                    >
                                      <HiOutlineCalendar className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
                                      Calendar
                                    </Link>
                                  )}
                                </Menu.Item>
                                <Menu.Item>
                                  {({ active }) => (
                                    <button
                                      className={`${
                                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                      } flex w-full px-4 py-2 text-sm`}
                                      onClick={(e) => handleDeleteCase(e, caseItem)}
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
                    </div>
                  </div>
                );
              })
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
                      onClick={() => handleSort('title')}
                    >
                      <div className="flex items-center">
                        <span>Case</span>
                        {sortField === 'title' && (
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
                      onClick={() => handleSort('client')}
                    >
                      <div className="flex items-center">
                        <span>Client</span>
                        {sortField === 'client' && (
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
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('priority')}
                    >
                      <div className="flex items-center">
                        <span>Priority</span>
                        {sortField === 'priority' && (
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
                      Next Deadline
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
                  {filteredCases.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-10 text-center text-gray-500">
                        <div className="flex flex-col items-center">
                          <HiOutlineBriefcase className="h-10 w-10 text-gray-300" />
                          <p className="mt-2 text-sm font-medium">No cases found</p>
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
                    filteredCases.map((caseItem) => {
                      // Find the next deadline for this case
                      const nextDeadline = caseItem.deadlines && caseItem.deadlines.length > 0
                        ? caseItem.deadlines.sort((a, b) => new Date(a.date) - new Date(b.date))[0]
                        : null;
                      
                      return (
                        <tr 
                          key={caseItem.id} 
                          className="hover:bg-gray-50 cursor-pointer"
                          onClick={() => handleCaseClick(caseItem)}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0">
                                <div className="h-10 w-10 rounded-md bg-gray-50 flex items-center justify-center border border-gray-200">
                                  {getCaseTypeIcon(caseItem.type)}
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{caseItem.title}</div>
                                <div className="text-xs text-gray-500 flex items-center mt-1">
                                  <HiOutlineTag className="mr-1 h-3 w-3" />
                                  {caseItem.caseNumber}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <img 
                                className="h-8 w-8 rounded-full mr-2"
                                src={caseItem.client.avatarUrl}
                                alt={caseItem.client.name}
                              />
                              <div>
                                <div className="text-sm font-medium text-gray-900">{caseItem.client.name}</div>
                                <div className="text-xs text-gray-500 mt-0.5">{caseItem.client.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(caseItem.status)}`}>
                              {caseItem.status.charAt(0).toUpperCase() + caseItem.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {getPriorityIndicator(caseItem.priority)}
                              <span className={`text-sm ${getPriorityBadgeColor(caseItem.priority)}`}>
                                {caseItem.priority.charAt(0).toUpperCase() + caseItem.priority.slice(1)}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {nextDeadline ? (
                              <div>
                                <div className={`text-sm ${isUpcomingDeadline(nextDeadline.date) ? 'font-medium text-red-600' : 'text-gray-900'}`}>
                                  {formatDate(nextDeadline.date)}
                                </div>
                                <div className="text-xs text-gray-500 mt-0.5">
                                  {nextDeadline.title}
                                </div>
                              </div>
                            ) : (
                              <span className="text-sm text-gray-500">No deadlines</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{formatDate(caseItem.lastActivityDate)}</div>
                            <div className="text-xs text-gray-500 mt-0.5">{caseItem.lastActivity}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end items-center space-x-2" onClick={(e) => e.stopPropagation()}>
                              <button
                                className="text-[#800000] hover:text-[#600000]"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/attorney/cases/${caseItem.id}/edit`);
                                }}
                              >
                                <HiOutlinePencilAlt className="h-5 w-5" />
                              </button>
                              <Menu as="div" className="relative inline-block text-left">
                                <div>
                                  <Menu.Button className="inline-flex justify-center text-gray-500 hover:text-gray-700">
                                    <HiOutlineDotsVertical className="h-5 w-5" aria-hidden="true" />
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
                                      <Menu.Item>
                                        {({ active }) => (
                                          <Link
                                            to={`/attorney/cases/${caseItem.id}`}
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
                                            to={`/attorney/cases/${caseItem.id}/documents`}
                                            className={`${
                                              active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                            } flex px-4 py-2 text-sm`}
                                          >
                                            <HiOutlineDocumentText className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
                                            Documents
                                          </Link>
                                        )}
                                      </Menu.Item>
                                      <Menu.Item>
                                        {({ active }) => (
                                          <Link
                                            to={`/attorney/cases/${caseItem.id}/calendar`}
                                            className={`${
                                              active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                            } flex px-4 py-2 text-sm`}
                                          >
                                            <HiOutlineCalendar className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
                                            Calendar
                                          </Link>
                                        )}
                                      </Menu.Item>
                                      <Menu.Item>
                                        {({ active }) => (
                                          <button
                                            className={`${
                                              active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                            } flex w-full px-4 py-2 text-sm`}
                                            onClick={(e) => handleDeleteCase(e, caseItem)}
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
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Add Case Modal */}
        <Transition appear show={isAddCaseModalOpen} as={Fragment}>
          <Dialog
            as="div"
            className="fixed inset-0 z-10 overflow-y-auto"
            onClose={() => setIsAddCaseModalOpen(false)}
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
                    Add New Case
                  </Dialog.Title>
                  <form onSubmit={handleSubmitNewCase} className="mt-4">
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                          Case Title *
                        </label>
                        <input
                          type="text"
                          name="title"
                          id="title"
                          required
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm"
                          value={newCase.title}
                          onChange={handleNewCaseChange}
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="clientId" className="block text-sm font-medium text-gray-700">
                          Client *
                        </label>
                        <select
                          id="clientId"
                          name="clientId"
                          required
                          className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm"
                          value={newCase.clientId}
                          onChange={handleNewCaseChange}
                        >
                          <option value="">Select a client</option>
                          {clients.map((client) => (
                            <option key={client.id} value={client.id}>
                              {client.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                          Case Type *
                        </label>
                        <select
                          id="type"
                          name="type"
                          required
                          className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm"
                          value={newCase.type}
                          onChange={handleNewCaseChange}
                        >
                          {caseTypes.map((type) => (
                            <option key={type.id} value={type.id}>
                              {type.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                          Priority
                        </label>
                        <select
                          id="priority"
                          name="priority"
                          className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm"
                          value={newCase.priority}
                          onChange={handleNewCaseChange}
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </select>
                      </div>
                      
                      <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                          Description
                        </label>
                        <textarea
                          id="description"
                          name="description"
                          rows="3"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm"
                          value={newCase.description}
                          onChange={handleNewCaseChange}
                        ></textarea>
                      </div>
                    </div>
                    <div className="mt-6">
                      <button
                        type="submit"
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#800000] hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                      >
                        <HiOutlinePlus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                        Create Case
                      </button>
                    </div>
                  </form>
                </div>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition>

        {/* Delete Confirmation Modal */}
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
                    Delete Case
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to delete this case? This action cannot be undone.
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
                      onClick={confirmDeleteCase}
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

export default AttorneyCasesPage;
