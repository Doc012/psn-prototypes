import React, { useState, useEffect, useMemo, Fragment } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { format, parseISO, isAfter, isBefore, addDays } from 'date-fns';
import { Dialog, Transition } from '@headlessui/react';
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
  HiOutlineScale,
  HiOutlinePlus,
  HiOutlineX,
  HiOutlineCheck,
  HiOutlineUpload,
  HiOutlineDownload,
  HiOutlineClipboard,
  HiOutlinePencilAlt
} from 'react-icons/hi';
import { useAuth } from '../../../context/AuthContext';

const ClientCasesPage = () => {
  const navigate = useNavigate();
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
  
  // New state variables for enhanced functionality
  const [showNewCaseModal, setShowNewCaseModal] = useState(false);
  const [newCaseData, setNewCaseData] = useState({
    title: '',
    type: 'Personal Injury',
    description: '',
    priority: 'Medium',
    documents: []
  });
  const [newCaseSuccess, setNewCaseSuccess] = useState(false);
  const [newCaseError, setNewCaseError] = useState('');
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);
  const [newTask, setNewTask] = useState({
    title: '',
    deadline: format(addDays(new Date(), 7), 'yyyy-MM-dd'),
    description: '',
    priority: 'Medium'
  });
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadDescription, setUploadDescription] = useState('');
  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [showActionMenu, setShowActionMenu] = useState(false);
  const [actionCaseId, setActionCaseId] = useState(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
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
        { id: 1, title: 'Submit medical records', deadline: format(addDays(today, 5), 'yyyy-MM-dd'), completed: false, description: 'Send all recent medical reports related to the injury' },
        { id: 2, title: 'Prepare for deposition', deadline: format(addDays(today, 10), 'yyyy-MM-dd'), completed: false, description: 'Review all case details and prepare for upcoming deposition' }
      ],
      documentList: [
        { id: 101, name: 'Accident Report.pdf', type: 'PDF', size: '2.4 MB', uploaded: format(addDays(today, -25), 'yyyy-MM-dd'), status: 'Reviewed' },
        { id: 102, name: 'Medical Records.pdf', type: 'PDF', size: '5.7 MB', uploaded: format(addDays(today, -20), 'yyyy-MM-dd'), status: 'Reviewed' },
        { id: 103, name: 'Witness Statement.docx', type: 'DOCX', size: '1.2 MB', uploaded: format(addDays(today, -15), 'yyyy-MM-dd'), status: 'Reviewed' }
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
        { id: 3, title: 'Review asset valuation', deadline: format(addDays(today, 15), 'yyyy-MM-dd'), completed: false, description: 'Check and confirm valuation of all estate assets' }
      ],
      documentList: [
        { id: 201, name: 'Will.pdf', type: 'PDF', size: '1.8 MB', uploaded: format(addDays(today, -60), 'yyyy-MM-dd'), status: 'Reviewed' },
        { id: 202, name: 'Asset Inventory.xlsx', type: 'XLSX', size: '3.2 MB', uploaded: format(addDays(today, -8), 'yyyy-MM-dd'), status: 'Reviewed' }
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
        { id: 4, title: 'Draft counter-proposal', deadline: format(addDays(today, 8), 'yyyy-MM-dd'), completed: false, description: 'Prepare counter-proposal for licensing terms' },
        { id: 5, title: 'Schedule negotiation call', deadline: format(addDays(today, 6), 'yyyy-MM-dd'), completed: false, description: 'Set up call with opposing counsel to discuss terms' }
      ],
      documentList: [
        { id: 301, name: 'Original Contract.pdf', type: 'PDF', size: '3.5 MB', uploaded: format(addDays(today, -20), 'yyyy-MM-dd'), status: 'Reviewed' },
        { id: 302, name: 'Contract Analysis.docx', type: 'DOCX', size: '1.1 MB', uploaded: format(addDays(today, -15), 'yyyy-MM-dd'), status: 'Reviewed' }
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
        { id: 6, title: 'Prepare for custody hearing', deadline: format(addDays(today, 10), 'yyyy-MM-dd'), completed: false, description: 'Prepare all evidence and statements for custody hearing' },
        { id: 7, title: 'Review settlement proposal', deadline: format(addDays(today, 5), 'yyyy-MM-dd'), completed: false, description: 'Review proposed settlement for property division' }
      ],
      documentList: [
        { id: 401, name: 'Financial Disclosures.pdf', type: 'PDF', size: '4.2 MB', uploaded: format(addDays(today, -12), 'yyyy-MM-dd'), status: 'Reviewed' },
        { id: 402, name: 'Custody Proposal.docx', type: 'DOCX', size: '1.8 MB', uploaded: format(addDays(today, -5), 'yyyy-MM-dd'), status: 'Pending Review' }
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
      upcomingTasks: [],
      documentList: [
        { id: 501, name: 'Purchase Agreement.pdf', type: 'PDF', size: '3.1 MB', uploaded: format(addDays(today, -95), 'yyyy-MM-dd'), status: 'Reviewed' },
        { id: 502, name: 'Closing Documents.pdf', type: 'PDF', size: '8.5 MB', uploaded: format(addDays(today, -75), 'yyyy-MM-dd'), status: 'Reviewed' },
        { id: 503, name: 'Property Inspection.pdf', type: 'PDF', size: '5.2 MB', uploaded: format(addDays(today, -90), 'yyyy-MM-dd'), status: 'Reviewed' }
      ]
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
      showSuccess(`Case removed from favorites`);
    } else {
      setFavorites([...favorites, caseId]);
      showSuccess(`Case added to favorites`);
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
  
  // Handle new case input changes
  const handleNewCaseChange = (e) => {
    const { name, value } = e.target;
    setNewCaseData({
      ...newCaseData,
      [name]: value
    });
  };
  
  // Handle file upload change
  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setUploadFile(e.target.files[0]);
    }
  };
  
  // Submit new case request
  const submitNewCase = () => {
    setNewCaseError('');
    
    // Validate inputs
    if (!newCaseData.title.trim()) {
      setNewCaseError('Case title is required');
      return;
    }
    
    if (!newCaseData.description.trim()) {
      setNewCaseError('Case description is required');
      return;
    }
    
    // Simulate API call
    setLoading(true);
    
    setTimeout(() => {
      // Create new case object
      const newCase = {
        id: cases.length + 1,
        title: newCaseData.title,
        caseNumber: `NEW-${currentYear}-${Math.floor(1000 + Math.random() * 9000)}`,
        type: newCaseData.type,
        status: 'Pending',
        description: newCaseData.description,
        startDate: format(new Date(), 'yyyy-MM-dd'),
        attorney: null, // Will be assigned later
        nextHearing: null,
        nextDeadline: null,
        priority: newCaseData.priority,
        documents: 0,
        messages: 0,
        lastUpdated: format(new Date(), 'yyyy-MM-dd'),
        progress: 5,
        notes: [],
        upcomingTasks: [],
        documentList: []
      };
      
      // Add to cases array
      setCases([newCase, ...cases]);
      
      // Show success and reset form
      setNewCaseSuccess(true);
      setLoading(false);
      
      // Close modal after delay
      setTimeout(() => {
        setNewCaseSuccess(false);
        setShowNewCaseModal(false);
        setNewCaseData({
          title: '',
          type: 'Personal Injury',
          description: '',
          priority: 'Medium',
          documents: []
        });
        showSuccess("New case request submitted successfully");
      }, 1500);
    }, 1000);
  };
  
  // Add new task to a case
  const addNewTask = () => {
    if (!newTask.title.trim()) {
      return;
    }
    
    const updatedCases = cases.map(caseItem => {
      if (caseItem.id === selectedCase) {
        const updatedTasks = [
          ...caseItem.upcomingTasks,
          {
            id: Math.floor(Math.random() * 1000), // Generate random ID
            title: newTask.title,
            deadline: newTask.deadline,
            description: newTask.description,
            completed: false
          }
        ];
        
        return {
          ...caseItem,
          upcomingTasks: updatedTasks
        };
      }
      return caseItem;
    });
    
    setCases(updatedCases);
    setShowTaskModal(false);
    setNewTask({
      title: '',
      deadline: format(addDays(new Date(), 7), 'yyyy-MM-dd'),
      description: '',
      priority: 'Medium'
    });
    showSuccess("Task added successfully");
  };
  
  // Toggle task completion
  const toggleTaskCompletion = (caseId, taskId) => {
    const updatedCases = cases.map(caseItem => {
      if (caseItem.id === caseId) {
        const updatedTasks = caseItem.upcomingTasks.map(task => {
          if (task.id === taskId) {
            return { ...task, completed: !task.completed };
          }
          return task;
        });
        
        return {
          ...caseItem,
          upcomingTasks: updatedTasks
        };
      }
      return caseItem;
    });
    
    setCases(updatedCases);
    showSuccess(updatedCases.find(c => c.id === caseId).upcomingTasks.find(t => t.id === taskId).completed ? 
      "Task marked as completed" : "Task marked as incomplete");
  };
  
  // Upload document
  const uploadDocument = () => {
    if (!uploadFile || !uploadDescription.trim() || !selectedCase) {
      return;
    }
    
    setUploadingFile(true);
    
    // Simulate file upload
    setTimeout(() => {
      const updatedCases = cases.map(caseItem => {
        if (caseItem.id === selectedCase) {
          const newDocument = {
            id: Math.floor(Math.random() * 1000),
            name: uploadFile.name,
            type: uploadFile.name.split('.').pop().toUpperCase(),
            size: `${(uploadFile.size / (1024 * 1024)).toFixed(1)} MB`,
            uploaded: format(new Date(), 'yyyy-MM-dd'),
            status: 'Pending Review',
            description: uploadDescription
          };
          
          return {
            ...caseItem,
            documents: caseItem.documents + 1,
            documentList: [...(caseItem.documentList || []), newDocument]
          };
        }
        return caseItem;
      });
      
      setCases(updatedCases);
      setUploadingFile(false);
      setUploadSuccess(true);
      
      setTimeout(() => {
        setUploadSuccess(false);
        setShowUploadModal(false);
        setUploadFile(null);
        setUploadDescription('');
        showSuccess("Document uploaded successfully");
      }, 1500);
    }, 1500);
  };
  
  // Show success alert with timer
  const showSuccess = (message) => {
    setSuccessMessage(message);
    setShowSuccessAlert(true);
    setTimeout(() => {
      setShowSuccessAlert(false);
    }, 3000);
  };
  
  // Open action menu for a case
  const openActionMenu = (e, caseId) => {
    e.preventDefault();
    e.stopPropagation();
    setActionCaseId(caseId);
    setShowActionMenu(true);
  };
  
  // Open task modal for a specific case
  const openTaskModal = (caseId) => {
    setSelectedCase(caseId);
    setShowTaskModal(true);
    setShowActionMenu(false);
  };
  
  // Open upload modal for a specific case
  const openUploadModal = (caseId) => {
    setSelectedCase(caseId);
    setShowUploadModal(true);
    setShowActionMenu(false);
  };
  
  // Handle view case details
  const viewCaseDetails = (caseId) => {
    navigate(`/client-portal/cases/${caseId}`);
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
  
  // Get document icon based on file type
  const getDocumentIcon = (fileType) => {
    switch(fileType.toLowerCase()) {
      case 'pdf':
        return <HiOutlineDocumentText className="h-5 w-5 text-red-500" />;
      case 'docx':
      case 'doc':
        return <HiOutlineDocumentText className="h-5 w-5 text-blue-500" />;
      case 'xlsx':
      case 'xls':
        return <HiOutlineDocumentText className="h-5 w-5 text-green-500" />;
      default:
        return <HiOutlineDocumentText className="h-5 w-5 text-gray-500" />;
    }
  };
  
  return (
    <div className="py-6">
      {/* Success Alert */}
      {showSuccessAlert && (
        <div className="fixed top-20 right-4 z-50 bg-green-50 p-4 rounded-md shadow-lg border border-green-100 transition-all duration-500 ease-in-out transform translate-x-0 opacity-100">
          <div className="flex">
            <div className="flex-shrink-0">
              <HiOutlineCheck className="h-5 w-5 text-green-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">{successMessage}</p>
            </div>
            <div className="ml-auto pl-3">
              <div className="-mx-1.5 -my-1.5">
                <button
                  onClick={() => setShowSuccessAlert(false)}
                  className="inline-flex rounded-md p-1.5 text-green-500 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <span className="sr-only">Dismiss</span>
                  <HiOutlineX className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
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
              to="/client-portal/documents"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
            >
              <HiOutlineDocumentText className="-ml-1 mr-2 h-5 w-5 text-gray-500" />
              Documents
            </Link>
            <button
              onClick={() => {
                setNewCaseData({
                  title: '',
                  type: 'Personal Injury',
                  description: '',
                  priority: 'Medium',
                  documents: []
                });
                setNewCaseError('');
                setNewCaseSuccess(false);
                setShowNewCaseModal(true);
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#800000] hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
            >
              <HiOutlinePlus className="-ml-1 mr-2 h-5 w-5" />
              New Case Request
            </button>
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
                  <button
                    onClick={() => setShowNewCaseModal(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#800000] hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                  >
                    <HiOutlinePlus className="-ml-1 mr-2 h-5 w-5" />
                    Request New Case
                  </button>
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
                            <button
                              onClick={(e) => openActionMenu(e, caseItem.id)}
                              className="ml-2 p-1 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                              title="More actions"
                            >
                              <HiOutlineCog className="h-5 w-5" aria-hidden="true" />
                            </button>
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
                              {caseItem.attorney ? (
                                <>
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
                                </>
                              ) : (
                                <span className="text-sm italic text-gray-500">Attorney not yet assigned</span>
                              )}
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
                                {caseItem.attorney ? (
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
                                ) : (
                                  <div className="flex flex-col items-center justify-center py-4">
                                    <HiOutlineUser className="h-12 w-12 text-gray-300" />
                                    <p className="mt-2 text-sm text-gray-500">An attorney will be assigned to your case soon</p>
                                  </div>
                                )}
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
                                        <span className={`text-xs ${task.completed ? 'text-green-600' : 'text-gray-500'}`}>
                                          {task.completed ? 'Completed' : `Due: ${formatDate(task.deadline)}`}
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
      
      {/* Simplified New Case Modal */}
      {showNewCaseModal && (
        <div className="fixed z-50 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">
            <div className="fixed inset-0 bg-black bg-opacity-30" onClick={() => setShowNewCaseModal(false)}></div>
            
            <div className="relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full sm:p-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Request New Case</h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500">Fill out the details below to request a new case.</p>
              </div>
              
              <div className="mt-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                      Case Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      id="title"
                      value={newCaseData.title}
                      onChange={handleNewCaseChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#800000] focus:border-[#800000] sm:text-sm"
                      placeholder="Enter a brief title for your case"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                      Case Type
                    </label>
                    <select
                      id="type"
                      name="type"
                      value={newCaseData.type}
                      onChange={handleNewCaseChange}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#800000] focus:border-[#800000] sm:text-sm rounded-md"
                    >
                      {caseTypes.map((type, index) => (
                        <option key={index} value={type}>{type}</option>
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
                      value={newCaseData.priority}
                      onChange={handleNewCaseChange}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#800000] focus:border-[#800000] sm:text-sm rounded-md"
                    >
                      {casePriorities.map((priority, index) => (
                        <option key={index} value={priority}>{priority}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={newCaseData.description}
                      onChange={handleNewCaseChange}
                      rows={3}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#800000] focus:border-[#800000] sm:text-sm"
                      placeholder="Provide a detailed description of the case"
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowNewCaseModal(false)}
                  className="mr-3 inline-flex justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={submitNewCase}
                  className="inline-flex justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#800000] hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                >
                  Submit Request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Task Modal */}
      <Transition.Root show={showTaskModal} as={Fragment}>
        <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto" onClose={() => setShowTaskModal(false)}>
          <div className="flex items-center justify-center min-h-screen px-4 text-center">
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
            <span className="hidden align-middle h-screen" aria-hidden="true">&#8203;</span>
            
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform rounded-lg shadow-xl bg-white">
                <div>
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Add New Task
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Add a new task for this case.
                    </p>
                  </div>
                </div>
                
                <div className="mt-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label htmlFor="task-title" className="block text-sm font-medium text-gray-700">
                        Task Title
                      </label>
                      <input
                        type="text"
                        name="title"
                        id="task-title"
                        value={newTask.title}
                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#800000] focus:border-[#800000] sm:text-sm"
                        placeholder="Enter a brief title for the task"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="task-deadline" className="block text-sm font-medium text-gray-700">
                        Deadline
                      </label>
                      <input
                        type="date"
                        name="deadline"
                        id="task-deadline"
                        value={newTask.deadline}
                        onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#800000] focus:border-[#800000] sm:text-sm"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="task-priority" className="block text-sm font-medium text-gray-700">
                        Priority
                      </label>
                      <select
                        id="task-priority"
                        name="priority"
                        value={newTask.priority}
                        onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#800000] focus:border-[#800000] sm:text-sm rounded-md"
                      >
                        {casePriorities.map((priority, index) => (
                          <option key={index} value={priority}>{priority}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="task-description" className="block text-sm font-medium text-gray-700">
                        Description
                      </label>
                      <textarea
                        id="task-description"
                        name="description"
                        value={newTask.description}
                        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                        rows={3}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#800000] focus:border-[#800000] sm:text-sm"
                        placeholder="Provide a detailed description of the task"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={addNewTask}
                    className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#800000] hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000] w-full"
                  >
                    {loading ? (
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                      </svg>
                    ) : null}
                    Add Task
                  </button>
                </div>
                
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={() => setShowTaskModal(false)}
                    className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000] w-full"
                  >
                    <HiOutlineX className="-ml-1 mr-2 h-5 w-5" />
                    Cancel
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
          
      {/* Upload Document Modal */}
      <Transition.Root show={showUploadModal} as={Fragment}>
        <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto" onClose={() => setShowUploadModal(false)}>
          <div className="flex items-center justify-center min-h-screen px-4 text-center">
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
            <span className="hidden align-middle h-screen" aria-hidden="true">&#8203;</span>
            
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform rounded-lg shadow-xl bg-white">
                <div>
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Upload Document
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Upload relevant documents for your case.
                    </p>
                  </div>
                               </div>
                
                <div className="mt-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700">
                        Select File
                      </label>
                      <input
                        type="file"
                        id="file-upload"
                        onChange={handleFileChange}
                        className="mt-1 block w-full text-sm text-gray-500
                          file:py-2 file:px-4
                          file:border file:border-gray-300
                          file:rounded-md file:text-sm file:font-medium
                          hover:file:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-[#800000] focus:border-[#800000]"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="upload-description" className="block text-sm font-medium text-gray-700">
                        Description
                      </label>
                      <textarea
                        id="upload-description"
                        value={uploadDescription}
                        onChange={(e) => setUploadDescription(e.target.value)}
                        rows={3}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#800000] focus:border-[#800000] sm:text-sm"
                        placeholder="Optional: Describe the document you're uploading"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={uploadDocument}
                    className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#800000] hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000] w-full"
                  >
                    {uploadingFile ? (
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                      </svg>
                    ) : null}
                    Upload Document
                  </button>
                </div>
                
                {/* Success message after upload */}
                {uploadSuccess && (
                  <div className="mt-4 text-sm text-green-600">
                    Document uploaded successfully!
                  </div>
                )}
                
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000] w-full"
                  >
                    <HiOutlineX className="-ml-1 mr-2 h-5 w-5" />
                    Cancel
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
};

export default ClientCasesPage;