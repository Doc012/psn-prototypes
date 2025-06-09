import { useState, Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import {
  HiOutlineClock,
  HiOutlineCalendar,
  HiOutlinePlay,
  HiOutlineStop,
  HiOutlineUserGroup,
  HiOutlineDocumentText,
  HiOutlineSearch,
  HiOutlineFilter,
  HiOutlineCurrencyDollar,
  HiOutlineClipboardCheck,
  HiOutlinePlusCircle,
  HiOutlinePencilAlt,
  HiOutlineTrash,
  HiOutlineExclamation,
  HiOutlineTag,
  HiOutlineCheckCircle,
  HiOutlineX,
} from 'react-icons/hi';

const AdminTimeActivitiesPage = () => {
  // State
  const [isAddingTimeEntry, setIsAddingTimeEntry] = useState(false);
  const [isEditingTimeEntry, setIsEditingTimeEntry] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [activeTimer, setActiveTimer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState('all');
  const [selectedCase, setSelectedCase] = useState('all');
  const [selectedTimeframe, setSelectedTimeframe] = useState('today');
  const [selectedStaffMember, setSelectedStaffMember] = useState('all');
  const [selectedActivity, setSelectedActivity] = useState('all');
  const [newTimeEntry, setNewTimeEntry] = useState({
    description: '',
    clientId: '',
    caseId: '',
    activityTypeId: '',
    date: new Date().toISOString().substr(0, 10),
    startTime: '',
    endTime: '',
    duration: '',
    billable: true,
    rate: '',
    notes: '',
  });
  const [selectedTimeEntry, setSelectedTimeEntry] = useState(null);
  const [filterBillable, setFilterBillable] = useState('all');
  const [filterApproval, setFilterApproval] = useState('all');
  const [timerTick, setTimerTick] = useState(0);
  const [toast, setToast] = useState(null);

  // Set up timer update effect
  useEffect(() => {
    let interval;
    if (activeTimer) {
      interval = setInterval(() => {
        setTimerTick(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeTimer]);

  // Mock data
  const clients = [
    { id: 'client1', name: 'Maropeng Holdings' },
    { id: 'client2', name: 'Thabo Mbekhi Foundation' },
    { id: 'client3', name: 'Ubuntu Technologies' },
    { id: 'client4', name: 'Ndlovu Family Trust' },
    { id: 'client5', name: 'Bongani Investments' },
  ];

  const cases = [
    { id: 'case1', clientId: 'client1', title: 'Corporate Restructuring' },
    { id: 'case2', clientId: 'client1', title: 'Trademark Registration' },
    { id: 'case3', clientId: 'client2', title: 'Charitable Status Application' },
    { id: 'case4', clientId: 'client3', title: 'Software Licensing Dispute' },
    { id: 'case5', clientId: 'client4', title: 'Estate Planning' },
    { id: 'case6', clientId: 'client5', title: 'Property Acquisition' },
  ];

  const activityTypes = [
    { id: 'research', name: 'Legal Research', defaultRate: 1800 },
    { id: 'drafting', name: 'Document Drafting', defaultRate: 2200 },
    { id: 'clientMeeting', name: 'Client Meeting', defaultRate: 2500 },
    { id: 'courtAppearance', name: 'Court Appearance', defaultRate: 3000 },
    { id: 'phoneCall', name: 'Phone Consultation', defaultRate: 1500 },
    { id: 'negotiation', name: 'Negotiation', defaultRate: 2800 },
    { id: 'review', name: 'Document Review', defaultRate: 2000 },
    { id: 'travel', name: 'Travel Time', defaultRate: 1200 },
    { id: 'admin', name: 'Administrative Work', defaultRate: 900 },
  ];

  const staffMembers = [
    { id: 'staff1', name: 'Sipho Nkosi', role: 'Senior Partner', rate: 3500 },
    { id: 'staff2', name: 'Thandi Modise', role: 'Partner', rate: 2800 },
    { id: 'staff3', name: 'Nomsa Dlamini', role: 'Senior Associate', rate: 2200 },
    { id: 'staff4', name: 'Blessing Moyo', role: 'Associate', rate: 1800 },
    { id: 'staff5', name: 'Kagiso Tau', role: 'Junior Associate', rate: 1400 },
    { id: 'staff6', name: 'Zanele Mbeki', role: 'Paralegal', rate: 950 },
  ];

  const timeEntries = [
    {
      id: 'entry1',
      staffMemberId: 'staff1',
      staffMember: 'Sipho Nkosi',
      clientId: 'client1',
      client: 'Maropeng Holdings',
      caseId: 'case1',
      case: 'Corporate Restructuring',
      activityTypeId: 'clientMeeting',
      activityType: 'Client Meeting',
      description: 'Initial consultation regarding corporate restructuring options',
      date: '2025-06-05',
      startTime: '09:00',
      endTime: '10:30',
      duration: 90, // minutes
      billable: true,
      rate: 3500,
      amount: 5250, // 1.5 hours * 3500
      approved: true,
      invoiced: true,
      notes: 'Discussed tax implications and potential timeline for restructuring',
    },
    {
      id: 'entry2',
      staffMemberId: 'staff1',
      staffMember: 'Sipho Nkosi',
      clientId: 'client1',
      client: 'Maropeng Holdings',
      caseId: 'case1',
      case: 'Corporate Restructuring',
      activityTypeId: 'drafting',
      activityType: 'Document Drafting',
      description: 'Preparing restructuring proposal and shareholder agreement',
      date: '2025-06-05',
      startTime: '11:00',
      endTime: '13:00',
      duration: 120, // minutes
      billable: true,
      rate: 3500,
      amount: 7000, // 2 hours * 3500
      approved: true,
      invoiced: false,
      notes: 'First draft of restructuring proposal with tax considerations',
    },
    {
      id: 'entry3',
      staffMemberId: 'staff3',
      staffMember: 'Nomsa Dlamini',
      clientId: 'client1',
      client: 'Maropeng Holdings',
      caseId: 'case1',
      case: 'Corporate Restructuring',
      activityTypeId: 'research',
      activityType: 'Legal Research',
      description: 'Research on corporate tax implications for restructuring',
      date: '2025-06-05',
      startTime: '14:00',
      endTime: '17:00',
      duration: 180, // minutes
      billable: true,
      rate: 2200,
      amount: 6600, // 3 hours * 2200
      approved: false,
      invoiced: false,
      notes: 'Focused on tax exemptions and compliance requirements',
    },
    {
      id: 'entry4',
      staffMemberId: 'staff2',
      staffMember: 'Thandi Modise',
      clientId: 'client2',
      client: 'Thabo Mbekhi Foundation',
      caseId: 'case3',
      case: 'Charitable Status Application',
      activityTypeId: 'review',
      activityType: 'Document Review',
      description: 'Review of charitable status application documents',
      date: '2025-06-05',
      startTime: '09:30',
      endTime: '11:30',
      duration: 120, // minutes
      billable: true,
      rate: 2800,
      amount: 5600, // 2 hours * 2800
      approved: true,
      invoiced: false,
      notes: 'Identified several issues with the application that need to be addressed',
    },
    {
      id: 'entry5',
      staffMemberId: 'staff4',
      staffMember: 'Blessing Moyo',
      clientId: 'client3',
      client: 'Ubuntu Technologies',
      caseId: 'case4',
      case: 'Software Licensing Dispute',
      activityTypeId: 'negotiation',
      activityType: 'Negotiation',
      description: 'Settlement negotiation with opposing counsel',
      date: '2025-06-05',
      startTime: '13:00',
      endTime: '15:30',
      duration: 150, // minutes
      billable: true,
      rate: 1800,
      amount: 4500, // 2.5 hours * 1800
      approved: true,
      invoiced: false,
      notes: 'Made progress on key terms, follow-up meeting scheduled',
    },
    {
      id: 'entry6',
      staffMemberId: 'staff5',
      staffMember: 'Kagiso Tau',
      clientId: 'client4',
      client: 'Ndlovu Family Trust',
      caseId: 'case5',
      case: 'Estate Planning',
      activityTypeId: 'drafting',
      activityType: 'Document Drafting',
      description: 'Drafting trust amendment documents',
      date: '2025-06-06',
      startTime: '09:00',
      endTime: '12:00',
      duration: 180, // minutes
      billable: true,
      rate: 1400,
      amount: 4200, // 3 hours * 1400
      approved: false,
      invoiced: false,
      notes: 'Incorporating changes requested by client regarding beneficiaries',
    },
    {
      id: 'entry7',
      staffMemberId: 'staff6',
      staffMember: 'Zanele Mbeki',
      clientId: 'client5',
      client: 'Bongani Investments',
      caseId: 'case6',
      case: 'Property Acquisition',
      activityTypeId: 'admin',
      activityType: 'Administrative Work',
      description: 'Organizing property documentation and due diligence materials',
      date: '2025-06-06',
      startTime: '10:00',
      endTime: '13:00',
      duration: 180, // minutes
      billable: true,
      rate: 950,
      amount: 2850, // 3 hours * 950
      approved: false,
      invoiced: false,
      notes: 'Created organized file structure for all property documents',
    },
    {
      id: 'entry8',
      staffMemberId: 'staff3',
      staffMember: 'Nomsa Dlamini',
      clientId: 'client3',
      client: 'Ubuntu Technologies',
      caseId: 'case4',
      case: 'Software Licensing Dispute',
      activityTypeId: 'research',
      activityType: 'Legal Research',
      description: 'Research on software licensing precedents',
      date: '2025-06-06',
      startTime: '14:00',
      endTime: '17:00',
      duration: 180, // minutes
      billable: true,
      rate: 2200,
      amount: 6600, // 3 hours * 2200
      approved: false,
      invoiced: false,
      notes: 'Found several relevant cases that support our position',
    },
  ];

  // Helper functions
  const getClientCases = (clientId) => {
    if (!clientId) return [];
    return cases.filter(c => c.clientId === clientId);
  };

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const calculateAmount = (duration, rate) => {
    if (!duration || !rate) return 0;
    // Convert minutes to hours for calculation
    return (duration / 60) * rate;
  };

  // Format timer display
  const formatTimerDisplay = () => {
    if (!activeTimer) return "00:00:00";
    
    const elapsedMs = new Date() - new Date(activeTimer.startTime);
    const hours = Math.floor(elapsedMs / 3600000);
    const minutes = Math.floor((elapsedMs % 3600000) / 60000);
    const seconds = Math.floor((elapsedMs % 60000) / 1000);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Filter functions
  const getFilteredTimeEntries = () => {
    let filtered = [...timeEntries];

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(entry => 
        entry.description.toLowerCase().includes(searchLower) ||
        entry.client.toLowerCase().includes(searchLower) ||
        entry.case.toLowerCase().includes(searchLower) ||
        entry.staffMember.toLowerCase().includes(searchLower) ||
        entry.activityType.toLowerCase().includes(searchLower)
      );
    }

    // Apply client filter
    if (selectedClient !== 'all') {
      filtered = filtered.filter(entry => entry.clientId === selectedClient);
    }

    // Apply case filter
    if (selectedCase !== 'all') {
      filtered = filtered.filter(entry => entry.caseId === selectedCase);
    }

    // Apply timeframe filter
    if (selectedTimeframe !== 'all') {
      const today = new Date().toISOString().substr(0, 10);
      const yesterday = new Date(Date.now() - 86400000).toISOString().substr(0, 10);
      const thisWeekStart = new Date(Date.now() - (new Date().getDay() * 86400000)).toISOString().substr(0, 10);
      const thisMonthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().substr(0, 10);
      
      switch (selectedTimeframe) {
        case 'today':
          filtered = filtered.filter(entry => entry.date === today);
          break;
        case 'yesterday':
          filtered = filtered.filter(entry => entry.date === yesterday);
          break;
        case 'thisWeek':
          filtered = filtered.filter(entry => entry.date >= thisWeekStart);
          break;
        case 'thisMonth':
          filtered = filtered.filter(entry => entry.date >= thisMonthStart);
          break;
        default:
          break;
      }
    }

    // Apply staff member filter
    if (selectedStaffMember !== 'all') {
      filtered = filtered.filter(entry => entry.staffMemberId === selectedStaffMember);
    }

    // Apply activity type filter
    if (selectedActivity !== 'all') {
      filtered = filtered.filter(entry => entry.activityTypeId === selectedActivity);
    }

    // Apply billable filter
    if (filterBillable !== 'all') {
      filtered = filtered.filter(entry => 
        (filterBillable === 'billable' && entry.billable) || 
        (filterBillable === 'nonBillable' && !entry.billable)
      );
    }

    // Apply approval filter
    if (filterApproval !== 'all') {
      filtered = filtered.filter(entry => 
        (filterApproval === 'approved' && entry.approved) || 
        (filterApproval === 'unapproved' && !entry.approved)
      );
    }

    return filtered;
  };

  // Calculation functions
  const calculateTotalTime = (entries) => {
    return entries.reduce((total, entry) => total + entry.duration, 0);
  };

  const calculateTotalBillable = (entries) => {
    return entries.reduce((total, entry) => total + (entry.billable ? entry.amount : 0), 0);
  };

  // Get summary stats
  const filteredEntries = getFilteredTimeEntries();
  const totalTime = calculateTotalTime(filteredEntries);
  const totalBillable = calculateTotalBillable(filteredEntries);
  const billablePercentage = filteredEntries.length > 0 
    ? Math.round((filteredEntries.filter(e => e.billable).length / filteredEntries.length) * 100) 
    : 0;

  // Toast notification function
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000); // Auto-dismiss after 3 seconds
  };

  // Event handlers
  const handleAddTimeEntry = () => {
    showToast("Add time entry feature coming soon!", "success");
    setIsAddingTimeEntry(false);
  };

  const handleEditTimeEntry = () => {
    showToast("Edit time entry feature coming soon!", "success");
    setIsEditingTimeEntry(false);
  };

  const handleDeleteTimeEntry = () => {
    showToast("Delete time entry feature coming soon!", "success");
    setShowDeleteConfirmation(false);
  };

  const startTimer = () => {
    const newTimer = {
      startTime: new Date(),
      clientId: newTimeEntry.clientId,
      caseId: newTimeEntry.caseId,
      activityTypeId: newTimeEntry.activityTypeId,
      description: newTimeEntry.description,
    };
    setActiveTimer(newTimer);
    setIsAddingTimeEntry(false);
  };

  const stopTimer = () => {
    if (!activeTimer) return;
    
    const duration = Math.round((new Date() - new Date(activeTimer.startTime)) / 60000); // minutes
    
    // Prepare time entry from active timer
    const timerEntry = {
      ...newTimeEntry,
      clientId: activeTimer.clientId,
      caseId: activeTimer.caseId,
      activityTypeId: activeTimer.activityTypeId,
      description: activeTimer.description,
      startTime: new Date(activeTimer.startTime).toTimeString().substring(0, 5),
      endTime: new Date().toTimeString().substring(0, 5),
      duration: duration,
    };
    
    setNewTimeEntry(timerEntry);
    setActiveTimer(null);
    setIsAddingTimeEntry(true);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewTimeEntry({
      ...newTimeEntry,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleActivityTypeChange = (e) => {
    const activityTypeId = e.target.value;
    const activityType = activityTypes.find(at => at.id === activityTypeId);
    
    setNewTimeEntry({
      ...newTimeEntry,
      activityTypeId,
      rate: activityType ? activityType.defaultRate : '',
    });
  };

  const handleDurationChange = (e) => {
    const duration = parseInt(e.target.value);
    if (isNaN(duration)) return;
    
    setNewTimeEntry({
      ...newTimeEntry,
      duration,
      amount: calculateAmount(duration, newTimeEntry.rate),
    });
  };

  const handleRateChange = (e) => {
    const rate = parseFloat(e.target.value);
    if (isNaN(rate)) return;
    
    setNewTimeEntry({
      ...newTimeEntry,
      rate,
      amount: calculateAmount(newTimeEntry.duration, rate),
    });
  };

  // Handle Edit Button Click
  const handleEditClick = (entry) => {
    setSelectedTimeEntry(entry);
    showToast("Edit time entry feature coming soon!", "success");
    // Don't open the modal
  };

  // Handle Delete Button Click
  const handleDeleteClick = (entry) => {
    setSelectedTimeEntry(entry);
    showToast("Delete time entry feature coming soon!", "success");
    // Don't open the modal
  };

  // Handle client change in filters
  const handleClientChange = (e) => {
    const clientId = e.target.value;
    setSelectedClient(clientId);
    setSelectedCase('all'); // Reset case when client changes
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Time & Activities</h1>
            <p className="mt-1 text-sm text-gray-500">
              Track billable hours, manage activities, and monitor productivity
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            {!activeTimer ? (
              <button
                onClick={() => showToast("Add time entry feature coming soon!", "success")}
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#800000] hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
              >
                <HiOutlinePlusCircle className="-ml-1 mr-2 h-5 w-5" />
                Add Time Entry
              </button>
            ) : (
              <button
                onClick={stopTimer}
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <HiOutlineStop className="-ml-1 mr-2 h-5 w-5" />
                Stop Timer
              </button>
            )}
          </div>
        </div>

        {/* Active Timer Display */}
        {activeTimer && (
          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <HiOutlineClock className="h-6 w-6 text-yellow-500 animate-pulse" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">Timer Running</h3>
                  <div className="mt-1 text-sm text-yellow-700">
                    {activeTimer.description || 'Untitled activity'} 
                    {activeTimer.clientId && clients.find(c => c.id === activeTimer.clientId) && 
                      ` • ${clients.find(c => c.id === activeTimer.clientId).name}`}
                    {activeTimer.caseId && cases.find(c => c.id === activeTimer.caseId) && 
                      ` • ${cases.find(c => c.id === activeTimer.caseId).title}`}
                  </div>
                </div>
              </div>
              <div className="mt-4 md:mt-0 flex items-center">
                <span className="text-lg font-medium text-yellow-800">
                  {formatTimerDisplay()}
                </span>
                <button
                  onClick={stopTimer}
                  className="ml-4 inline-flex items-center px-3 py-1.5 border border-transparent text-sm leading-4 font-medium rounded-md text-yellow-700 bg-yellow-100 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                >
                  <HiOutlineStop className="-ml-0.5 mr-1 h-4 w-4" />
                  Stop
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-[#800000] rounded-md p-3">
                  <HiOutlineClock className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Time</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {formatTime(totalTime)}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                  <HiOutlineCurrencyDollar className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Billable Amount</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {formatCurrency(totalBillable)}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                  <HiOutlineClipboardCheck className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Billable Percentage</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {billablePercentage}%
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                  <HiOutlineDocumentText className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Time Entries</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {filteredEntries.length}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-8 bg-white shadow overflow-hidden rounded-lg">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex-1 min-w-0 mb-4 md:mb-0">
                <div className="relative rounded-md shadow-sm max-w-md">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <HiOutlineSearch className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="focus:ring-[#800000] focus:border-[#800000] block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                    placeholder="Search time entries..."
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <div className="inline-flex items-center">
                  <HiOutlineUserGroup className="mr-2 h-5 w-5 text-gray-400" />
                  <select
                    value={selectedClient}
                    onChange={handleClientChange}
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm rounded-md"
                  >
                    <option value="all">All Clients</option>
                    {clients.map(client => (
                      <option key={client.id} value={client.id}>{client.name}</option>
                    ))}
                  </select>
                </div>
                <div className="inline-flex items-center">
                  <HiOutlineDocumentText className="mr-2 h-5 w-5 text-gray-400" />
                  <select
                    value={selectedCase}
                    onChange={(e) => setSelectedCase(e.target.value)}
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm rounded-md"
                    disabled={selectedClient === 'all'}
                  >
                    <option value="all">All Cases</option>
                    {getClientCases(selectedClient).map(c => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                  </select>
                </div>
                <div className="inline-flex items-center">
                  <HiOutlineCalendar className="mr-2 h-5 w-5 text-gray-400" />
                  <select
                    value={selectedTimeframe}
                    onChange={(e) => setSelectedTimeframe(e.target.value)}
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm rounded-md"
                  >
                    <option value="today">Today</option>
                    <option value="yesterday">Yesterday</option>
                    <option value="thisWeek">This Week</option>
                    <option value="thisMonth">This Month</option>
                    <option value="all">All Time</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="mt-4 flex flex-wrap gap-3">
              <div className="inline-flex items-center">
                <HiOutlineFilter className="mr-2 h-5 w-5 text-gray-400" />
                <select
                  value={selectedStaffMember}
                  onChange={(e) => setSelectedStaffMember(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm rounded-md"
                >
                  <option value="all">All Staff</option>
                  {staffMembers.map(staff => (
                    <option key={staff.id} value={staff.id}>{staff.name}</option>
                  ))}
                </select>
              </div>
              <div className="inline-flex items-center">
                <HiOutlineTag className="mr-2 h-5 w-5 text-gray-400" />
                <select
                  value={selectedActivity}
                  onChange={(e) => setSelectedActivity(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm rounded-md"
                >
                  <option value="all">All Activities</option>
                  {activityTypes.map(type => (
                    <option key={type.id} value={type.id}>{type.name}</option>
                  ))}
                </select>
              </div>
              <div className="inline-flex items-center">
                <HiOutlineCurrencyDollar className="mr-2 h-5 w-5 text-gray-400" />
                <select
                  value={filterBillable}
                  onChange={(e) => setFilterBillable(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm rounded-md"
                >
                  <option value="all">All Time</option>
                  <option value="billable">Billable Only</option>
                  <option value="nonBillable">Non-Billable Only</option>
                </select>
              </div>
              <div className="inline-flex items-center">
                <HiOutlineCheckCircle className="mr-2 h-5 w-5 text-gray-400" />
                <select
                  value={filterApproval}
                  onChange={(e) => setFilterApproval(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm rounded-md"
                >
                  <option value="all">All Status</option>
                  <option value="approved">Approved Only</option>
                  <option value="unapproved">Unapproved Only</option>
                </select>
              </div>
            </div>
          </div>

          {/* Time Entries Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Staff
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client & Case
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Billable
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEntries.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-10 text-center text-sm text-gray-500">
                      <div className="flex flex-col items-center">
                        <HiOutlineClock className="h-12 w-12 text-gray-400 mb-3" />
                        <h3 className="text-sm font-medium text-gray-900">No time entries found</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {searchTerm ? `No results for "${searchTerm}"` : 'Get started by adding a time entry'}
                        </p>
                        {!searchTerm && (
                          <button
                            onClick={() => showToast("Add time entry feature coming soon!", "success")}
                            type="button"
                            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#800000] hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                          >
                            <HiOutlinePlusCircle className="-ml-1 mr-2 h-5 w-5" />
                            Add Time Entry
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredEntries.map(entry => (
                    <tr key={entry.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-[#800000] bg-opacity-10 flex items-center justify-center text-[#800000]">
                              <HiOutlineCalendar className="h-5 w-5" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {new Date(entry.date).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </div>
                            <div className="text-sm text-gray-500">
                              {entry.staffMember}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{entry.description}</div>
                        <div className="text-sm text-gray-500">{entry.activityType}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{entry.client}</div>
                        <div className="text-sm text-gray-500">{entry.case}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatTime(entry.duration)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {entry.startTime} - {entry.endTime}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          entry.billable ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {entry.billable ? 'Billable' : 'Non-billable'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {entry.billable ? formatCurrency(entry.amount) : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          entry.approved 
                            ? entry.invoiced
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {entry.approved 
                            ? entry.invoiced
                              ? 'Invoiced'
                              : 'Approved'
                            : 'Pending'
                          }
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-3">
                          <button
                            onClick={() => handleEditClick(entry)}
                            className="text-[#800000] hover:text-[#600000]"
                          >
                            <HiOutlinePencilAlt className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(entry)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <HiOutlineTrash className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-5 right-5 max-w-sm w-full bg-white shadow-lg rounded-lg p-4 z-50 ${
          toast.type === 'success' ? 'border-l-4 border-green-500' : 'border-l-4 border-red-500'
        }`}>
          <div className="flex items-start">
            <div className="flex-shrink-0">
              {toast.type === 'success' ? (
                <HiOutlineCheckCircle className="h-6 w-6 text-green-500" />
              ) : (
                <HiOutlineExclamation className="h-6 w-6 text-red-500" />
              )}
            </div>
            <div className="ml-3 w-0 flex-1">
              <p className="text-sm font-medium text-gray-900">{toast.message}</p>
            </div>
            <div className="ml-4 flex-shrink-0">
              <button
                onClick={() => setToast(null)}
                className="inline-flex text-gray-400 hover:text-gray-500"
              >
                <HiOutlineX className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Time Entry Modal */}
      <Transition.Root show={isAddingTimeEntry} as={Fragment}>
        <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto" onClose={setIsAddingTimeEntry}>
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-[#800000] bg-opacity-10 sm:mx-0 sm:h-10 sm:w-10">
                    <HiOutlineClock className="h-6 w-6 text-[#800000]" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                      Add Time Entry
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Record your time for a specific activity
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 sm:mt-4">
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Description
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="description"
                          id="description"
                          value={newTimeEntry.description}
                          onChange={handleInputChange}
                          className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                          placeholder="What did you work on?"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="clientId" className="block text-sm font-medium text-gray-700">
                          Client
                        </label>
                        <div className="mt-1">
                          <select
                            id="clientId"
                            name="clientId"
                            value={newTimeEntry.clientId}
                            onChange={handleInputChange}
                            className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                          >
                            <option value="">Select a client</option>
                            {clients.map(client => (
                              <option key={client.id} value={client.id}>{client.name}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label htmlFor="caseId" className="block text-sm font-medium text-gray-700">
                          Case
                        </label>
                        <div className="mt-1">
                          <select
                            id="caseId"
                            name="caseId"
                            value={newTimeEntry.caseId}
                            onChange={handleInputChange}
                            className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                            disabled={!newTimeEntry.clientId}
                          >
                            <option value="">Select a case</option>
                            {getClientCases(newTimeEntry.clientId).map(c => (
                              <option key={c.id} value={c.id}>{c.title}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="activityTypeId" className="block text-sm font-medium text-gray-700">
                        Activity Type
                      </label>
                      <div className="mt-1">
                        <select
                          id="activityTypeId"
                          name="activityTypeId"
                          value={newTimeEntry.activityTypeId}
                          onChange={handleActivityTypeChange}
                          className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                        >
                          <option value="">Select an activity type</option>
                          {activityTypes.map(type => (
                            <option key={type.id} value={type.id}>{type.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                        Date
                      </label>
                      <div className="mt-1">
                        <input
                          type="date"
                          name="date"
                          id="date"
                          value={newTimeEntry.date}
                          onChange={handleInputChange}
                          className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
                          Start Time
                        </label>
                        <div className="mt-1">
                          <input
                            type="time"
                            name="startTime"
                            id="startTime"
                            value={newTimeEntry.startTime}
                            onChange={handleInputChange}
                            className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">
                          End Time
                        </label>
                        <div className="mt-1">
                          <input
                            type="time"
                            name="endTime"
                            id="endTime"
                            value={newTimeEntry.endTime}
                            onChange={handleInputChange}
                            className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                          Duration (min)
                        </label>
                        <div className="mt-1">
                          <input
                            type="number"
                            name="duration"
                            id="duration"
                            value={newTimeEntry.duration}
                            onChange={handleDurationChange}
                            className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                            placeholder="0"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="billable"
                          name="billable"
                          type="checkbox"
                          checked={newTimeEntry.billable}
                          onChange={handleInputChange}
                          className="focus:ring-[#800000] h-4 w-4 text-[#800000] border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="billable" className="font-medium text-gray-700">Billable</label>
                        <p className="text-gray-500">Mark this time entry as billable to the client</p>
                      </div>
                    </div>

                    {newTimeEntry.billable && (
                      <div>
                        <label htmlFor="rate" className="block text-sm font-medium text-gray-700">
                          Rate (ZAR per hour)
                        </label>
                        <div className="mt-1">
                          <input
                            type="number"
                            name="rate"
                            id="rate"
                            value={newTimeEntry.rate}
                            onChange={handleRateChange}
                            className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                            placeholder="0"
                          />
                        </div>
                      </div>
                    )}

                    <div>
                      <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                        Notes
                      </label>
                      <div className="mt-1">
                        <textarea
                          id="notes"
                          name="notes"
                          rows={3}
                          value={newTimeEntry.notes}
                          onChange={handleInputChange}
                          className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                          placeholder="Additional details about this activity"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#800000] text-base font-medium text-white hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000] sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={handleAddTimeEntry}
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000] sm:mt-0 sm:w-auto sm:text-sm"
                    onClick={() => setIsAddingTimeEntry(false)}
                  >
                    Cancel
                  </button>
                  {!activeTimer && (
                    <button
                      type="button"
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-[#800000] shadow-sm px-4 py-2 bg-white text-base font-medium text-[#800000] hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000] sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={() => showToast("Timer feature coming soon!", "success")}
                    >
                      <HiOutlinePlay className="-ml-1 mr-2 h-5 w-5" />
                      Start Timer
                    </button>
                  )}
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Edit Time Entry Modal */}
      <Transition.Root show={isEditingTimeEntry} as={Fragment}>
        <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto" onClose={setIsEditingTimeEntry}>
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-[#800000] bg-opacity-10 sm:mx-0 sm:h-10 sm:w-10">
                    <HiOutlinePencilAlt className="h-6 w-6 text-[#800000]" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                      Edit Time Entry
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Update your time entry details
                      </p>
                    </div>
                  </div>
                </div>

                {selectedTimeEntry && (
                  <>
                    <div className="mt-5 sm:mt-4">
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700">
                            Description
                          </label>
                          <div className="mt-1">
                            <input
                              type="text"
                              id="edit-description"
                              defaultValue={selectedTimeEntry.description}
                              className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="edit-client" className="block text-sm font-medium text-gray-700">
                              Client
                            </label>
                            <div className="mt-1">
                              <select
                                id="edit-client"
                                defaultValue={selectedTimeEntry.clientId}
                                className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                              >
                                {clients.map(client => (
                                  <option key={client.id} value={client.id}>{client.name}</option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <div>
                            <label htmlFor="edit-case" className="block text-sm font-medium text-gray-700">
                              Case
                            </label>
                            <div className="mt-1">
                              <select
                                id="edit-case"
                                defaultValue={selectedTimeEntry.caseId}
                                className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                              >
                                {getClientCases(selectedTimeEntry.clientId).map(c => (
                                  <option key={c.id} value={c.id}>{c.title}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>

                        <div>
                          <label htmlFor="edit-activity" className="block text-sm font-medium text-gray-700">
                            Activity Type
                          </label>
                          <div className="mt-1">
                            <select
                              id="edit-activity"
                              defaultValue={selectedTimeEntry.activityTypeId}
                              className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                            >
                              {activityTypes.map(type => (
                                <option key={type.id} value={type.id}>{type.name}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div>
                          <label htmlFor="edit-date" className="block text-sm font-medium text-gray-700">
                            Date
                          </label>
                          <div className="mt-1">
                            <input
                              type="date"
                              id="edit-date"
                              defaultValue={selectedTimeEntry.date}
                              className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div>
                            <label htmlFor="edit-startTime" className="block text-sm font-medium text-gray-700">
                              Start Time
                            </label>
                            <div className="mt-1">
                              <input
                                type="time"
                                id="edit-startTime"
                                defaultValue={selectedTimeEntry.startTime}
                                className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                              />
                            </div>
                          </div>

                          <div>
                            <label htmlFor="edit-endTime" className="block text-sm font-medium text-gray-700">
                              End Time
                            </label>
                            <div className="mt-1">
                              <input
                                type="time"
                                id="edit-endTime"
                                defaultValue={selectedTimeEntry.endTime}
                                className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                              />
                            </div>
                          </div>

                          <div>
                            <label htmlFor="edit-duration" className="block text-sm font-medium text-gray-700">
                              Duration (min)
                            </label>
                            <div className="mt-1">
                              <input
                                type="number"
                                id="edit-duration"
                                defaultValue={selectedTimeEntry.duration}
                                className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                                placeholder="0"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id="edit-billable"
                              name="billable"
                              type="checkbox"
                              defaultChecked={selectedTimeEntry.billable}
                              className="focus:ring-[#800000] h-4 w-4 text-[#800000] border-gray-300 rounded"
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="edit-billable" className="font-medium text-gray-700">Billable</label>
                            <p className="text-gray-500">Mark this time entry as billable to the client</p>
                          </div>
                        </div>

                        <div>
                          <label htmlFor="edit-notes" className="block text-sm font-medium text-gray-700">
                            Notes
                          </label>
                          <div className="mt-1">
                            <textarea
                              id="edit-notes"
                              name="notes"
                              rows={3}
                              defaultValue={selectedTimeEntry.notes}
                              className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                              placeholder="Additional details about this activity"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                      <button
                        type="button"
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#800000] text-base font-medium text-white hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000] sm:ml-3 sm:w-auto sm:text-sm"
                        onClick={handleEditTimeEntry}
                      >
                        Save Changes
                      </button>
                      <button
                        type="button"
                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000] sm:mt-0 sm:w-auto sm:text-sm"
                        onClick={() => setIsEditingTimeEntry(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                )}
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Delete Confirmation Modal */}
      <Transition.Root show={showDeleteConfirmation} as={Fragment}>
        <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto" onClose={setShowDeleteConfirmation}>
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                <div>
                  <div className="mt-2 text-center">
                    <HiOutlineExclamation className="mx-auto h-12 w-12 text-red-600" />
                    <h3 className="mt-2 text-lg leading-6 font-medium text-gray-900">
                      Delete Time Entry
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete this time entry? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={handleDeleteTimeEntry}
                  >
                    Delete
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000] sm:mt-0 sm:w-auto sm:text-sm"
                    onClick={() => setShowDeleteConfirmation(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  )
}

export default AdminTimeActivitiesPage
