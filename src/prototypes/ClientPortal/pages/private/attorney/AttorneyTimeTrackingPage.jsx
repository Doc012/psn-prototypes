import React, { useState, useEffect, Fragment, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import {
  HiOutlineClock,
  HiOutlinePlay,
  HiOutlinePause,
  HiOutlineStop,
  HiOutlinePlus,
  HiOutlineTrash,
  HiOutlinePencilAlt,
  HiOutlineDocumentText,
  HiOutlineCalendar,
  HiOutlineOfficeBuilding,
  HiOutlineUser,
  HiOutlineBriefcase,
  HiOutlineExclamation,
  HiOutlineChartBar,
  HiOutlineDotsVertical,
  HiOutlineFilter,
  HiOutlineSearch,
  HiOutlineX,
  HiOutlineRefresh,
  HiOutlineEye,
  HiOutlineDownload,
  HiOutlineArrowUp,
  HiOutlineArrowDown,
  HiOutlineCheck,
  HiOutlineCash,
  HiOutlineCollection,
  HiOutlineClipboardCheck,
  HiOutlineClipboard,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
} from 'react-icons/hi';
import { format, parse, startOfWeek, endOfWeek, startOfMonth, endOfMonth, 
  addDays, isSameDay, isSameMonth, parseISO, differenceInSeconds, 
  formatDistanceStrict, addMonths, subMonths } from 'date-fns';

const AttorneyTimeTrackingPage = () => {
  const [activeTab, setActiveTab] = useState('timer');
  const [timerRunning, setTimerRunning] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timerDescription, setTimerDescription] = useState('');
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedCase, setSelectedCase] = useState('');
  const [selectedActivity, setSelectedActivity] = useState('');
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [timeEntries, setTimeEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [clients, setClients] = useState([]);
  const [cases, setCases] = useState([]);
  const [activityTypes, setActivityTypes] = useState([]);
  const [filteredTimeEntries, setFilteredTimeEntries] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClient, setFilterClient] = useState('all');
  const [filterCase, setFilterCase] = useState('all');
  const [filterDateRange, setFilterDateRange] = useState('week');
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [totalBillableAmount, setTotalBillableAmount] = useState(0);
  const [newEntry, setNewEntry] = useState({
    clientId: '',
    caseId: '',
    activityType: '',
    description: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    startTime: format(new Date(), 'HH:mm'),
    duration: '',
    billable: true
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const filterRef = useRef(null);

  // Mock data initialization
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockClients = [
        { id: '1', name: 'Nkosi Family Trust' },
        { id: '2', name: 'Patel & Associates' },
        { id: '3', name: 'Stellenbosch Winery Ltd' },
        { id: '4', name: 'Johannesburg Metro Council' },
        { id: '5', name: 'Cape Tech Ventures' }
      ];
      
      const mockCases = [
        { id: '1', clientId: '1', name: 'Estate Planning', number: 'EST-2023-001' },
        { id: '2', clientId: '1', name: 'Succession Dispute', number: 'FAM-2023-042' },
        { id: '3', clientId: '2', name: 'Contract Review: Shopping Mall', number: 'COM-2023-101' },
        { id: '4', clientId: '2', name: 'Lease Agreement Dispute', number: 'COM-2023-102' },
        { id: '5', clientId: '3', name: 'Trademark Registration', number: 'IP-2023-057' },
        { id: '6', clientId: '3', name: 'Liquor License Application', number: 'ADM-2023-029' },
        { id: '7', clientId: '4', name: 'Municipal Land Dispute', number: 'ADM-2023-076' },
        { id: '8', clientId: '5', name: 'Venture Capital Investment', number: 'COM-2023-115' }
      ];
      
      const mockActivityTypes = [
        { id: '1', name: 'Research' },
        { id: '2', name: 'Client Meeting' },
        { id: '3', name: 'Court Appearance' },
        { id: '4', name: 'Document Preparation' },
        { id: '5', name: 'Phone Call' },
        { id: '6', name: 'Email Correspondence' },
        { id: '7', name: 'Travel Time' },
        { id: '8', name: 'Mediation Session' },
        { id: '9', name: 'Contract Drafting' }
      ];
      
      const mockTimeEntries = [
        {
          id: '1',
          clientId: '1',
          caseId: '1',
          activityType: '2',
          description: 'Initial consultation to discuss estate planning options and tax implications',
          date: '2023-06-01',
          startTime: '09:00',
          duration: 3600, // in seconds
          billable: true,
          billed: true,
          rate: 1500
        },
        {
          id: '2',
          clientId: '1',
          caseId: '2',
          activityType: '4',
          description: 'Prepared succession planning documents and reviewed with legal team',
          date: '2023-06-02',
          startTime: '14:30',
          duration: 5400, // in seconds
          billable: true,
          billed: false,
          rate: 1500
        },
        {
          id: '3',
          clientId: '2',
          caseId: '3',
          activityType: '1',
          description: 'Researched precedent cases for commercial contract dispute in Gauteng High Court',
          date: '2023-06-03',
          startTime: '10:15',
          duration: 7200, // in seconds
          billable: true,
          billed: false,
          rate: 1750
        },
        {
          id: '4',
          clientId: '3',
          caseId: '5',
          activityType: '3',
          description: 'Court hearing for trademark opposition at Cape Town High Court',
          date: '2023-06-04',
          startTime: '13:00',
          duration: 10800, // in seconds
          billable: true,
          billed: false,
          rate: 2000
        },
        {
          id: '5',
          clientId: '3',
          caseId: '6',
          activityType: '5',
          description: 'Call with Western Cape Liquor Board regarding license application status',
          date: '2023-06-05',
          startTime: '11:30',
          duration: 1800, // in seconds
          billable: true,
          billed: false,
          rate: 1500
        },
        {
          id: '6',
          clientId: '2',
          caseId: '4',
          activityType: '6',
          description: 'Email correspondence with opposing counsel regarding settlement terms',
          date: '2023-06-05',
          startTime: '15:45',
          duration: 900, // in seconds
          billable: true,
          billed: false,
          rate: 1500
        },
        {
          id: '7',
          clientId: '1',
          caseId: '1',
          activityType: '4',
          description: 'Drafting trust deed and supporting documentation',
          date: '2023-06-06',
          startTime: '09:30',
          duration: 9000, // in seconds
          billable: true,
          billed: false,
          rate: 1500
        },
        {
          id: '8',
          clientId: '4',
          caseId: '7',
          activityType: '8',
          description: 'Mediation session with provincial officials regarding land rezoning',
          date: '2023-06-07',
          startTime: '13:00',
          duration: 7200, // in seconds
          billable: true,
          billed: false,
          rate: 1800
        },
        {
          id: '9',
          clientId: '5',
          caseId: '8',
          activityType: '9',
          description: 'Drafting investment agreement and term sheet for Series A funding',
          date: '2023-06-08',
          startTime: '10:00',
          duration: 12600, // in seconds (3.5 hours)
          billable: true,
          billed: false,
          rate: 1900
        },
        {
          id: '10',
          clientId: '3',
          caseId: '5',
          activityType: '7',
          description: 'Travel to CIPC offices in Pretoria for trademark filing',
          date: '2023-06-09',
          startTime: '08:30',
          duration: 10800, // in seconds
          billable: true,
          billed: false,
          rate: 950
        },
        {
          id: '11',
          clientId: '2',
          caseId: '3',
          activityType: '2',
          description: 'Client meeting to review contract terms and negotiate revisions',
          date: '2023-06-10',
          startTime: '14:00',
          duration: 5400, // in seconds
          billable: true,
          billed: false,
          rate: 1750
        },
        {
          id: '12',
          clientId: '4',
          caseId: '7',
          activityType: '4',
          description: 'Preparing affidavits and supporting documents for municipal case',
          date: '2023-06-12',
          startTime: '09:15',
          duration: 8100, // in seconds
          billable: true,
          billed: false,
          rate: 1800
        }
      ];
      
      setClients(mockClients);
      setCases(mockCases);
      setActivityTypes(mockActivityTypes);
      setTimeEntries(mockTimeEntries);
      setFilteredTimeEntries(mockTimeEntries);
      setLoading(false);
    }, 1000);
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...timeEntries];
    
    // Apply client filter
    if (filterClient !== 'all') {
      filtered = filtered.filter(entry => entry.clientId === filterClient);
    }
    
    // Apply case filter
    if (filterCase !== 'all') {
      filtered = filtered.filter(entry => entry.caseId === filterCase);
    }
    
    // Apply date range filter
    const today = new Date();
    if (filterDateRange === 'today') {
      filtered = filtered.filter(entry => {
        const entryDate = parseISO(entry.date);
        return isSameDay(entryDate, today);
      });
    } else if (filterDateRange === 'week') {
      const weekStart = startOfWeek(today, { weekStartsOn: 1 });
      const weekEnd = endOfWeek(today, { weekStartsOn: 1 });
      filtered = filtered.filter(entry => {
        const entryDate = parseISO(entry.date);
        return entryDate >= weekStart && entryDate <= weekEnd;
      });
    } else if (filterDateRange === 'month') {
      const monthStart = startOfMonth(today);
      const monthEnd = endOfMonth(today);
      filtered = filtered.filter(entry => {
        const entryDate = parseISO(entry.date);
        return entryDate >= monthStart && entryDate <= monthEnd;
      });
    }
    
    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(entry => {
        const clientName = getClientName(entry.clientId).toLowerCase();
        const caseName = getCaseName(entry.caseId).toLowerCase();
        const activityName = getActivityName(entry.activityType).toLowerCase();
        const description = entry.description.toLowerCase();
        
        return clientName.includes(term) || 
               caseName.includes(term) || 
               activityName.includes(term) || 
               description.includes(term);
      });
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      
      if (sortField === 'date') {
        const dateA = parseISO(a.date);
        const dateB = parseISO(b.date);
        if (dateA < dateB) comparison = -1;
        if (dateA > dateB) comparison = 1;
        
        // If dates are the same, sort by time
        if (comparison === 0) {
          if (a.startTime < b.startTime) comparison = -1;
          if (a.startTime > b.startTime) comparison = 1;
        }
      } else if (sortField === 'client') {
        const clientA = getClientName(a.clientId).toLowerCase();
        const clientB = getClientName(b.clientId).toLowerCase();
        if (clientA < clientB) comparison = -1;
        if (clientA > clientB) comparison = 1;
      } else if (sortField === 'case') {
        const caseA = getCaseName(a.caseId).toLowerCase();
        const caseB = getCaseName(b.caseId).toLowerCase();
        if (caseA < caseB) comparison = -1;
        if (caseA > caseB) comparison = 1;
      } else if (sortField === 'duration') {
        comparison = a.duration - b.duration;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
    
    setFilteredTimeEntries(filtered);
    
    // Calculate totals
    const totalSecs = filtered.reduce((sum, entry) => sum + entry.duration, 0);
    setTotalSeconds(totalSecs);
    
    const billableAmount = filtered.reduce((sum, entry) => {
      if (entry.billable) {
        return sum + ((entry.duration / 3600) * entry.rate);
      }
      return sum;
    }, 0);
    setTotalBillableAmount(billableAmount);
  }, [timeEntries, filterClient, filterCase, filterDateRange, searchTerm, sortField, sortDirection]);

  // Calculate filtered cases based on selected client
  const filteredCases = cases.filter(c => !selectedClient || c.clientId === selectedClient);

  // Helper functions
  const getClientName = (clientId) => {
    const client = clients.find(c => c.id === clientId);
    return client ? client.name : 'Unknown Client';
  };
  
  const getCaseName = (caseId) => {
    const caseItem = cases.find(c => c.id === caseId);
    return caseItem ? caseItem.name : 'Unknown Case';
  };
  
  const getActivityName = (activityId) => {
    const activity = activityTypes.find(a => a.id === activityId);
    return activity ? activity.name : 'Unknown Activity';
  };
  
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Modify the formatMoney function to use ZAR
  const formatMoney = (amount) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR'
    }).format(amount);
  };
  
  // Timer functions
  const startTimer = () => {
    if (!selectedClient || !selectedCase || !selectedActivity) {
      setError('Please select a client, case, and activity before starting the timer.');
      return;
    }
    
    setError(null);
    setStartTime(Date.now());
    setTimerRunning(true);
    
    // Start interval to update elapsed time
    const interval = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);
    
    // Store interval ID to clear it later
    window.timerInterval = interval;
  };
  
  const pauseTimer = () => {
    setTimerRunning(false);
    clearInterval(window.timerInterval);
  };
  
  const stopTimer = () => {
    if (elapsedTime === 0) return;
    
    pauseTimer();
    
    // Create a new time entry
    const newTimeEntry = {
      id: `${Date.now()}`,
      clientId: selectedClient,
      caseId: selectedCase,
      activityType: selectedActivity,
      description: timerDescription,
      date: format(new Date(), 'yyyy-MM-dd'),
      startTime: startTime ? format(new Date(startTime), 'HH:mm') : '00:00',
      duration: elapsedTime,
      billable: true,
      billed: false,
      rate: 1500 // Updated default rate for ZAR
    };
    
    // Add to time entries
    setTimeEntries(prev => [newTimeEntry, ...prev]);
    
    // Reset timer
    resetTimer();
    
    // Show confirmation
    alert('Time entry saved successfully!');
  };
  
  const resetTimer = () => {
    setTimerRunning(false);
    clearInterval(window.timerInterval);
    setElapsedTime(0);
    setStartTime(null);
  };
  
  // Handle form changes
  const handleNewEntryChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewEntry(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  // Handle form submission
  const handleSubmitNewEntry = (e) => {
    e.preventDefault();
    
    // Create a new time entry
    const timeEntry = {
      id: `${Date.now()}`,
      ...newEntry,
      duration: parseFloat(newEntry.duration) * 3600, // Convert hours to seconds
      rate: 1500 // Updated default rate for ZAR
    };
    
    // Add to time entries
    setTimeEntries(prev => [timeEntry, ...prev]);
    
    // Reset form and close modal
    setNewEntry({
      clientId: '',
      caseId: '',
      activityType: '',
      description: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      startTime: format(new Date(), 'HH:mm'),
      duration: '',
      billable: true
    });
    setIsEntryModalOpen(false);
    
    // Show confirmation
    alert('Time entry added successfully!');
  };
  
  // Delete entry
  const handleDeleteEntry = (entry) => {
    setSelectedEntry(entry);
    setIsDeleteModalOpen(true);
  };
  
  const confirmDeleteEntry = () => {
    if (!selectedEntry) return;
    
    // Remove entry from array
    setTimeEntries(prev => prev.filter(entry => entry.id !== selectedEntry.id));
    
    // Close modal and reset selection
    setIsDeleteModalOpen(false);
    setSelectedEntry(null);
    
    // Show confirmation
    alert('Time entry deleted successfully!');
  };
  
  // Edit entry
  const handleEditEntry = (entry) => {
    setSelectedEntry(entry);
    
    setNewEntry({
      clientId: entry.clientId,
      caseId: entry.caseId,
      activityType: entry.activityType,
      description: entry.description,
      date: entry.date,
      startTime: entry.startTime,
      duration: (entry.duration / 3600).toString(), // Convert seconds to hours
      billable: entry.billable
    });
    
    setIsEntryModalOpen(true);
  };
  
  // Handle filters
  const handleFilterChange = (filterType, value) => {
    if (filterType === 'client') {
      setFilterClient(value);
      if (value !== 'all') {
        // Reset case filter if it's not for the selected client
        const caseExists = cases.some(c => c.id === filterCase && c.clientId === value);
        if (!caseExists) {
          setFilterCase('all');
        }
      }
    } else if (filterType === 'case') {
      setFilterCase(value);
    } else if (filterType === 'dateRange') {
      setFilterDateRange(value);
    }
  };
  
  const resetFilters = () => {
    setSearchTerm('');
    setFilterClient('all');
    setFilterCase('all');
    setFilterDateRange('week');
  };
  
  // Handle sorting
  const handleSort = (field) => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new field and default to ascending
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  // Calendar functions
  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };
  
  const previousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };
  
  const getCalendarHeaderDays = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map(day => (
      <div key={day} className="text-center font-medium text-gray-700 text-sm py-2">
        {day}
      </div>
    ));
  };
  
  const getCalendarDays = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
    
    const rows = [];
    let days = [];
    let day = startDate;
    
    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const formattedDate = format(cloneDay, 'yyyy-MM-dd');
        const entriesOnDay = timeEntries.filter(entry => entry.date === formattedDate);
        const totalHoursOnDay = entriesOnDay.reduce((total, entry) => total + (entry.duration / 3600), 0);
        
        days.push(
          <div
            key={day}
            className={`min-h-[100px] border p-2 ${
              !isSameMonth(day, monthStart)
                ? 'bg-gray-50 text-gray-400'
                : isSameDay(day, new Date())
                ? 'bg-blue-50 border-blue-200'
                : 'bg-white'
            }`}
          >
            <div className="flex justify-between">
              <span className="text-sm font-medium">{format(day, 'd')}</span>
              {entriesOnDay.length > 0 && (
                <span className="text-xs px-2 py-1 rounded-full bg-[#800000] text-white font-medium">
                  {entriesOnDay.length}
                </span>
              )}
            </div>
            
            {entriesOnDay.length > 0 && (
              <div className="mt-1">
                <div className="text-xs text-gray-600 font-medium">
                  {totalHoursOnDay.toFixed(1)} hrs
                </div>
                
                {entriesOnDay.slice(0, 2).map(entry => (
                  <div key={entry.id} className="mt-1 text-xs truncate border-l-2 border-[#800000] pl-1">
                    {getClientName(entry.clientId).split(' ')[0]} - {getActivityName(entry.activityType)}
                  </div>
                ))}
                
                {entriesOnDay.length > 2 && (
                  <div className="mt-1 text-xs text-gray-500">
                    + {entriesOnDay.length - 2} more
                  </div>
                )}
              </div>
            )}
          </div>
        );
        
        day = addDays(day, 1);
      }
      
      rows.push(
        <div key={`row-${day}`} className="grid grid-cols-7 gap-px">
          {days}
        </div>
      );
      days = [];
    }
    
    return rows;
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    }

    // Add event listener when the dropdown is open
    if (isFilterOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    // Clean up the event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isFilterOpen]);

  // Generate report mock data
  const generateReportData = () => {
    return {
      clientSummary: [
        { clientId: '1', clientName: 'Nkosi Family Trust', hours: 17.5, amount: 26250 },
        { clientId: '2', clientName: 'Patel & Associates', hours: 13.5, amount: 23625 },
        { clientId: '3', clientName: 'Stellenbosch Winery Ltd', hours: 14.5, amount: 27450 },
        { clientId: '4', clientName: 'Johannesburg Metro Council', hours: 15.25, amount: 27450 },
        { clientId: '5', clientName: 'Cape Tech Ventures', hours: 3.5, amount: 6650 },
      ],
      activitySummary: [
        { id: '1', name: 'Research', hours: 13.4, percentage: 20.9 },
        { id: '2', name: 'Client Meeting', hours: 12.0, percentage: 18.7 },
        { id: '3', name: 'Court Appearance', hours: 7.5, percentage: 11.7 },
        { id: '4', name: 'Document Preparation', hours: 14.8, percentage: 23.1 },
        { id: '5', name: 'Phone Call', hours: 2.1, percentage: 3.3 },
        { id: '6', name: 'Email Correspondence', hours: 1.5, percentage: 2.3 },
        { id: '7', name: 'Travel Time', hours: 5.0, percentage: 7.8 },
        { id: '8', name: 'Mediation Session', hours: 3.0, percentage: 4.7 },
        { id: '9', name: 'Contract Drafting', hours: 4.8, percentage: 7.5 },
      ],
      billingStatus: {
        billable: { hours: 58.2, amount: 102375 },
        nonBillable: { hours: 6.0, amount: 0 },
        billed: { hours: 12.5, amount: 18750 },
        unbilled: { hours: 45.7, amount: 83625 }
      },
      monthlyTrend: [
        { month: 'Jan', hours: 60.5, amount: 105875 },
        { month: 'Feb', hours: 71.2, amount: 124600 },
        { month: 'Mar', hours: 58.7, amount: 102725 },
        { month: 'Apr', hours: 63.4, amount: 110950 },
        { month: 'May', hours: 67.8, amount: 118650 },
        { month: 'Jun', hours: 64.2, amount: 112350 }
      ]
    };
  };

  // Add this function to handle viewing reports
  const handleViewReport = (reportType) => {
    setSelectedReport(reportType);
    setReportData(generateReportData());
    setIsReportModalOpen(true);
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="md:flex md:items-center md:justify-between mb-6">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-semibold text-gray-900 flex items-center">
              <HiOutlineClock className="h-6 w-6 text-[#800000] mr-2" />
              Time Tracking
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Track billable hours and manage time entries
            </p>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <button
              type="button"
              onClick={() => showToast("New Time Entry functionality coming soon!", "success")}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#800000] hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
            >
              <HiOutlinePlus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              New Time Entry
            </button>
          </div>
        </div>

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

        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              className={`${
                activeTab === 'timer'
                  ? 'border-[#800000] text-[#800000]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              onClick={() => setActiveTab('timer')}
            >
              <HiOutlineClock className="h-5 w-5 inline-block mr-2 -mt-1" />
              Timer
            </button>
            <button
              className={`${
                activeTab === 'entries'
                  ? 'border-[#800000] text-[#800000]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              onClick={() => setActiveTab('entries')}
            >
              <HiOutlineClipboard className="h-5 w-5 inline-block mr-2 -mt-1" />
              Time Entries
            </button>
            <button
              className={`${
                activeTab === 'calendar'
                  ? 'border-[#800000] text-[#800000]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              onClick={() => setActiveTab('calendar')}
            >
              <HiOutlineCalendar className="h-5 w-5 inline-block mr-2 -mt-1" />
              Calendar
            </button>
            <button
              className={`${
                activeTab === 'reports'
                  ? 'border-[#800000] text-[#800000]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              onClick={() => setActiveTab('reports')}
            >
              <HiOutlineChartBar className="h-5 w-5 inline-block mr-2 -mt-1" />
              Reports
            </button>
          </nav>
        </div>

        {activeTab === 'timer' && (
          <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Time Tracker</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-4">
                <div>
                  <label htmlFor="client" className="block text-sm font-medium text-gray-700">
                    Client *
                  </label>
                  <select
                    id="client"
                    name="client"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm rounded-md"
                    value={selectedClient}
                    onChange={(e) => setSelectedClient(e.target.value)}
                    disabled={timerRunning}
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
                  <label htmlFor="case" className="block text-sm font-medium text-gray-700">
                    Case *
                  </label>
                  <select
                    id="case"
                    name="case"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm rounded-md"
                    value={selectedCase}
                    onChange={(e) => setSelectedCase(e.target.value)}
                    disabled={timerRunning || !selectedClient}
                  >
                    <option value="">Select a case</option>
                    {cases
                      .filter(c => !selectedClient || c.clientId === selectedClient)
                      .map((caseItem) => (
                        <option key={caseItem.id} value={caseItem.id}>
                          {caseItem.name} ({caseItem.number})
                        </option>
                      ))
                    }
                  </select>
                </div>
                
                <div>
                  <label htmlFor="activity" className="block text-sm font-medium text-gray-700">
                    Activity Type *
                  </label>
                  <select
                    id="activity"
                    name="activity"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm rounded-md"
                    value={selectedActivity}
                    onChange={(e) => setSelectedActivity(e.target.value)}
                    disabled={timerRunning}
                  >
                    <option value="">Select an activity</option>
                    {activityTypes.map((activity) => (
                      <option key={activity.id} value={activity.id}>
                        {activity.name}
                      </option>
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
                    rows="3"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm"
                    placeholder="Describe the work you're doing..."
                    value={timerDescription}
                    onChange={(e) => setTimerDescription(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg flex flex-col items-center justify-center">
                <div className="text-4xl font-mono font-bold text-gray-800 mb-6">
                  {formatTime(elapsedTime)}
                </div>
                
                <div className="flex space-x-2">
                  {!timerRunning ? (
                    <button
                      type="button"
                      onClick={startTimer}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      <HiOutlinePlay className="h-5 w-5 mr-1" />
                      Start
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={pauseTimer}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                    >
                      <HiOutlinePause className="h-5 w-5 mr-1" />
                      Pause
                    </button>
                  )}
                  
                  <button
                    type="button"
                    onClick={stopTimer}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    disabled={!timerRunning && elapsedTime === 0}
                  >
                    <HiOutlineStop className="h-5 w-5 mr-1" />
                    Stop & Save
                  </button>
                  
                  {(timerRunning || elapsedTime > 0) && (
                    <button
                      type="button"
                      onClick={resetTimer}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    >
                      <HiOutlineX className="h-5 w-5 mr-1" />
                      Reset
                    </button>
                  )}
                </div>
                
                {elapsedTime > 0 && (
                  <div className="mt-4 text-sm text-gray-500">
                    {elapsedTime >= 3600 && (
                      <p>Billable amount: {formatMoney((elapsedTime / 3600) * 1500)}</p>
                    )}
                    <p>Started at: {startTime ? format(new Date(startTime), 'h:mm a') : 'Not started'}</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-8">
              <h3 className="text-md font-medium text-gray-900 mb-2">Recent Time Entries</h3>
              {timeEntries.length === 0 ? (
                <p className="text-gray-500 text-sm italic">No time entries recorded yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date & Time
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Client/Case
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Activity
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Duration
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Description
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {timeEntries.slice(0, 5).map((entry) => (
                        <tr key={entry.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {format(parseISO(entry.date), 'MMM d, yyyy')} at {entry.startTime}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{getClientName(entry.clientId)}</div>
                            <div className="text-sm text-gray-500">{getCaseName(entry.caseId)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {getActivityName(entry.activityType)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatTime(entry.duration)}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                            {entry.description}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              
              {timeEntries.length > 5 && (
                <div className="mt-2 text-right">
                  <button
                    type="button"
                    onClick={() => setActiveTab('entries')}
                    className="text-sm text-[#800000] hover:text-[#600000] font-medium"
                  >
                    View all entries →
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'entries' && (
          <>
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
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="focus:ring-[#800000] focus:border-[#800000] block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                    placeholder="Search time entries..."
                  />
                </div>
                <div className="mt-4 md:mt-0 flex items-center space-x-2">
                  <div className="relative" ref={filterRef}>
                    <button
                      type="button"
                      onClick={() => setIsFilterOpen(!isFilterOpen)}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                    >
                      <HiOutlineFilter className="-ml-1 mr-2 h-5 w-5 text-gray-400" aria-hidden="true" />
                      Filters
                      {(filterClient !== 'all' || filterCase !== 'all' || filterDateRange !== 'week') && (
                        <span className="ml-1 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#800000] text-white">
                          {[
                            filterClient !== 'all' ? 1 : 0,
                            filterCase !== 'all' ? 1 : 0,
                            filterDateRange !== 'week' ? 1 : 0
                          ].reduce((a, b) => a + b, 0)}
                        </span>
                      )}
                    </button>
                    {isFilterOpen && (
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
                            <label htmlFor="client-filter" className="block text-sm font-medium text-gray-700">
                              Client
                            </label>
                            <select
                              id="client-filter"
                              name="client-filter"
                              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm rounded-md"
                              value={filterClient}
                              onChange={(e) => handleFilterChange('client', e.target.value)}
                            >
                              <option value="all">All Clients</option>
                              {clients.map((client) => (
                                <option key={client.id} value={client.id}>
                                  {client.name}
                                </option>
                              ))}
                            </select>
                          </div>
                          
                          <div className="mb-4">
                            <label htmlFor="case-filter" className="block text-sm font-medium text-gray-700">
                              Case
                            </label>
                            <select
                              id="case-filter"
                              name="case-filter"
                              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm rounded-md"
                              value={filterCase}
                              onChange={(e) => handleFilterChange('case', e.target.value)}
                            >
                              <option value="all">All Cases</option>
                              {filteredCases.map((caseItem) => (
                                <option key={caseItem.id} value={caseItem.id}>
                                  {caseItem.name}
                                </option>
                              ))}
                            </select>
                          </div>
                          
                          <div className="mb-4">
                            <label htmlFor="date-range-filter" className="block text-sm font-medium text-gray-700">
                              Date Range
                            </label>
                            <select
                              id="date-range-filter"
                              name="date-range-filter"
                              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm rounded-md"
                              value={filterDateRange}
                              onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                            >
                              <option value="today">Today</option>
                              <option value="week">This Week</option>
                              <option value="month">This Month</option>
                              <option value="all">All Time</option>
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
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {filterClient !== 'all' && (
                  <div className="inline-flex rounded-full items-center py-1 pl-3 pr-1 text-sm font-medium bg-gray-100 text-gray-800">
                    Client: {getClientName(filterClient)}
                    <button
                      type="button"
                      onClick={() => setFilterClient('all')}
                      className="flex-shrink-0 ml-1 h-5 w-5 rounded-full inline-flex items-center justify-center text-gray-400 hover:bg-gray-200 hover:text-gray-500 focus:outline-none"
                    >
                      <span className="sr-only">Remove filter</span>
                      <HiOutlineX className="h-3 w-3" aria-hidden="true" />
                    </button>
                  </div>
                )}
                {filterCase !== 'all' && (
                  <div className="inline-flex rounded-full items-center py-1 pl-3 pr-1 text-sm font-medium bg-gray-100 text-gray-800">
                    Case: {getCaseName(filterCase)}
                    <button
                      type="button"
                      onClick={() => setFilterCase('all')}
                      className="flex-shrink-0 ml-1 h-5 w-5 rounded-full inline-flex items-center justify-center text-gray-400 hover:bg-gray-200 hover:text-gray-500 focus:outline-none"
                    >
                      <span className="sr-only">Remove filter</span>
                      <HiOutlineX className="h-3 w-3" aria-hidden="true" />
                    </button>
                  </div>
                )}
                {filterDateRange !== 'week' && (
                  <div className="inline-flex rounded-full items-center py-1 pl-3 pr-1 text-sm font-medium bg-gray-100 text-gray-800">
                    Date: {filterDateRange === 'today' ? 'Today' : filterDateRange === 'month' ? 'This Month' : 'All Time'}
                    <button
                      type="button"
                      onClick={() => setFilterDateRange('week')}
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
            
            <div className="mb-4 flex justify-between items-center">
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{filteredTimeEntries.length}</span> entries
                {filteredTimeEntries.length !== timeEntries.length && (
                  <>
                    {' '}
                    (filtered from <span className="font-medium">{timeEntries.length}</span> total)
                  </>
                )}
              </p>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Total: </span>
                <span className="text-sm font-medium text-gray-900">{formatTime(totalSeconds)}</span>
                <span className="text-sm text-gray-900">|</span>
                <span className="text-sm font-medium text-gray-900">{formatMoney(totalBillableAmount)}</span>
              </div>
            </div>
            
            {loading ? (
              <div className="bg-white shadow rounded-lg p-8 flex justify-center">
                <div className="animate-pulse flex flex-col items-center">
                  <div className="rounded-full bg-gray-200 h-12 w-12 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-48 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-64"></div>
                  <div className="mt-4 text-sm text-gray-500">Loading time entries...</div>
                </div>
              </div>
            ) : (
              <div className="bg-white shadow-sm overflow-hidden rounded-lg">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                          onClick={() => handleSort('date')}
                        >
                          <div className="flex items-center">
                            <span>Date & Time</span>
                            {sortField === 'date' && (
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
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                          onClick={() => handleSort('case')}
                        >
                          <div className="flex items-center">
                            <span>Case</span>
                            {sortField === 'case' && (
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
                          Activity
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                          onClick={() => handleSort('duration')}
                        >
                          <div className="flex items-center">
                            <span>Duration</span>
                            {sortField === 'duration' && (
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
                          Billable
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Description
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredTimeEntries.length === 0 ? (
                        <tr>
                          <td colSpan="8" className="px-6 py-10 text-center text-gray-500">
                            <div className="flex flex-col items-center">
                              <HiOutlineClock className="h-10 w-10 text-gray-300" />
                              <p className="mt-2 text-sm font-medium">No time entries found</p>
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
                        filteredTimeEntries.map((entry) => (
                          <tr key={entry.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {format(parseISO(entry.date), 'MMM d, yyyy')}<br />
                              <span className="text-gray-500">{entry.startTime}</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {getClientName(entry.clientId)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {getCaseName(entry.caseId)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {getActivityName(entry.activityType)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatTime(entry.duration)}
                              <div className="text-xs text-gray-400">
                                {formatMoney((entry.duration / 3600) * entry.rate)}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {entry.billable ? (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  <HiOutlineCheck className="-ml-0.5 mr-1.5 h-4 w-4" />
                                  Billable
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                  Non-billable
                                </span>
                              )}
                              {entry.billed && (
                                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  <HiOutlineClipboardCheck className="-ml-0.5 mr-1.5 h-4 w-4" />
                                  Billed
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                              {entry.description}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex justify-end space-x-2">
                                <button
                                  className="text-gray-400 hover:text-gray-500"
                                  onClick={() => handleEditEntry(entry)}
                                  title="Edit Entry"
                                >
                                  <HiOutlinePencilAlt className="h-5 w-5" />
                                </button>
                                <button
                                  className="text-gray-400 hover:text-red-500"
                                  onClick={() => handleDeleteEntry(entry)}
                                  title="Delete Entry"
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
            )}
          </>
        )}

        {activeTab === 'calendar' && (
          <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={previousMonth}
                  className="mr-2 p-1.5 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                >
                  <HiOutlineChevronLeft className="h-5 w-5" />
                </button>
                <h2 className="text-lg font-medium text-gray-900">
                  {format(currentMonth, 'MMMM yyyy')}
                </h2>
                <button
                  type="button"
                  onClick={nextMonth}
                  className="ml-2 p-1.5 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                >
                  <HiOutlineChevronRight className="h-5 w-5" />
                </button>
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => setCurrentMonth(new Date())}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                >
                  <HiOutlineRefresh className="-ml-1 mr-1 h-4 w-4" aria-hidden="true" />
                  Today
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-7 gap-4">
              {getCalendarHeaderDays()}
            </div>
            
            <div className="mt-2">
              {getCalendarDays()}
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Time & Billing Reports</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="text-[#800000] mb-3">
                    <HiOutlineClock className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Time Summary</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    View hours worked by client, case, or activity type
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-900 font-medium">
                      64.2 hrs <span className="text-xs text-gray-500 font-normal">this month</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => showToast("Time Summary report coming soon!", "success")}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-[#800000] bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                    >
                      <HiOutlineEye className="mr-1.5 h-4 w-4" />
                      View Report
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="text-[#800000] mb-3">
                    <HiOutlineCash className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Billing Summary</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Review billable hours and amounts by client or case
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-900 font-medium">
                      {formatMoney(112350)} <span className="text-xs text-gray-500 font-normal">this month</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => showToast("Billing Summary report coming soon!", "success")}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-[#800000] bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                    >
                      <HiOutlineEye className="mr-1.5 h-4 w-4" />
                      View Report
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="text-[#800000] mb-3">
                    <HiOutlineDocumentText className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Detailed Report</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Generate a comprehensive report of all time entries
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-900 font-medium">
                      {timeEntries.length} <span className="text-xs text-gray-500 font-normal">entries</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => showToast("Detailed Time report coming soon!", "success")}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-[#800000] bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                    >
                      <HiOutlineEye className="mr-1.5 h-4 w-4" />
                      View Report
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-md font-medium text-gray-900 mb-3">Hours by Client (Current Month)</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Nkosi Family Trust</span>
                    <span className="text-sm text-gray-900">17.5 hrs</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-[#800000] h-2.5 rounded-full" style={{ width: '27%' }}></div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Patel & Associates</span>
                    <span className="text-sm text-gray-900">13.5 hrs</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-[#800000] h-2.5 rounded-full" style={{ width: '21%' }}></div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Stellenbosch Winery Ltd</span>
                    <span className="text-sm text-gray-900">14.5 hrs</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-[#800000] h-2.5 rounded-full" style={{ width: '23%' }}></div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Johannesburg Metro Council</span>
                    <span className="text-sm text-gray-900">15.25 hrs</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-[#800000] h-2.5 rounded-full" style={{ width: '24%' }}></div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Cape Tech Ventures</span>
                    <span className="text-sm text-gray-900">3.5 hrs</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-[#800000] h-2.5 rounded-full" style={{ width: '5%' }}></div>
                  </div>
                </div>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-md font-medium text-gray-900 mb-3">Billing Status</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="text-sm text-green-800 font-medium">Billable</div>
                    <div className="text-xl text-green-900 font-bold mt-1">58.2 hrs</div>
                    <div className="text-sm text-green-800 mt-1">{formatMoney(102375)}</div>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm text-gray-700 font-medium">Non-Billable</div>
                    <div className="text-xl text-gray-800 font-bold mt-1">6.0 hrs</div>
                    <div className="text-sm text-gray-700 mt-1">{formatMoney(0)}</div>
                  </div>
                  
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="text-sm text-blue-800 font-medium">Billed</div>
                    <div className="text-xl text-blue-900 font-bold mt-1">12.5 hrs</div>
                    <div className="text-sm text-blue-800 mt-1">{formatMoney(18750)}</div>
                  </div>
                  
                  <div className="bg-yellow-50 p-3 rounded-lg">
                    <div className="text-sm text-yellow-800 font-medium">Unbilled</div>
                    <div className="text-xl text-yellow-900 font-bold mt-1">45.7 hrs</div>
                    <div className="text-sm text-yellow-800 mt-1">{formatMoney(83625)}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      
      
      {/* New Entry Modal */}
      <Transition.Root show={isEntryModalOpen} as={Fragment}>
        <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto" onClose={setIsEntryModalOpen}>
          <div className="flex items-center justify-center min-h-screen px-4 py-12">
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

            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="translate-y-4 opacity-0"
              enterTo="translate-y-0 opacity-100"
              leave="ease-in duration-200"
              leaveFrom="translate-y-0 opacity-100"
              leaveTo="translate-y-4 opacity-0"
            >
              <div className="bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-md">
                <div className="px-6 py-4 border-b">
                  <h3 className="text-lg font-medium text-gray-900">New Time Entry</h3>
                </div>
                
                <div className="px-6 py-4">
                  <form onSubmit={handleSubmitNewEntry}>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="clientId" className="block text-sm font-medium text-gray-700">
                          Client *
                        </label>
                        <select
                          id="clientId"
                          name="clientId"
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm rounded-md"
                          value={newEntry.clientId}
                          onChange={handleNewEntryChange}
                          required
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
                        <label htmlFor="caseId" className="block text-sm font-medium text-gray-700">
                          Case *
                        </label>
                        <select
                          id="caseId"
                          name="caseId"
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm rounded-md"
                          value={newEntry.caseId}
                          onChange={handleNewEntryChange}
                          required
                        >
                          <option value="">Select a case</option>
                          {cases
                            .filter(c => !newEntry.clientId || c.clientId === newEntry.clientId)
                            .map((caseItem) => (
                              <option key={caseItem.id} value={caseItem.id}>
                                {caseItem.name} ({caseItem.number})
                              </option>
                            ))
                          }
                        </select>
                      </div>
                      
                      <div>
                        <label htmlFor="activityType" className="block text-sm font-medium text-gray-700">
                          Activity Type *
                        </label>
                        <select
                          id="activityType"
                          name="activityType"
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm rounded-md"
                          value={newEntry.activityType}
                          onChange={handleNewEntryChange}
                          required
                        >
                          <option value="">Select an activity</option>
                          {activityTypes.map((activity) => (
                            <option key={activity.id} value={activity.id}>
                              {activity.name}
                            </option>
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
                          rows="3"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm"
                          placeholder="Describe the work you're doing..."
                          value={newEntry.description}
                          onChange={handleNewEntryChange}
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                          Date *
                        </label>
                        <input
                          type="date"
                          id="date"
                          name="date"
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm rounded-md"
                          value={newEntry.date}
                          onChange={handleNewEntryChange}
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
                          Start Time *
                        </label>
                        <input
                          type="time"
                          id="startTime"
                          name="startTime"
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm rounded-md"
                          value={newEntry.startTime}
                          onChange={handleNewEntryChange}
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                          Duration (hours) *
                        </label>
                        <input
                          type="text"
                          id="duration"
                          name="duration"
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm rounded-md"
                          placeholder="Enter duration in hours (e.g., 1.5)"
                          value={newEntry.duration}
                          onChange={handleNewEntryChange}
                          required
                        />
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          id="billable"
                          name="billable"
                          type="checkbox"
                          className="h-4 w-4 text-[#800000] focus:ring-[#800000] border-gray-300 rounded"
                          checked={newEntry.billable}
                          onChange={handleNewEntryChange}
                        />
                        <label htmlFor="billable" className="ml-2 block text-sm text-gray-900">
                          Billable
                        </label>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex justify-end">
                      <button
                        type="button"
                        onClick={() => setIsEntryModalOpen(false)}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000] mr-2"
                      >
                        <HiOutlineX className="h-5 w-5 mr-1" />
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#800000] hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                      >
                        <HiOutlineCheck className="h-5 w-5 mr-1" />
                        Save Entry
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Delete Confirmation Modal */}
      <Transition.Root show={isDeleteModalOpen} as={Fragment}>
        <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto" onClose={setIsDeleteModalOpen}>
          <div className="flex items-center justify-center min-h-screen px-4 py-12">
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

            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="translate-y-4 opacity-0"
              enterTo="translate-y-0 opacity-100"
              leave="ease-in duration-200"
              leaveFrom="translate-y-0 opacity-100"
              leaveTo="translate-y-4 opacity-0"
            >
              <div className="bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-md">
                <div className="px-6 py-4 border-b">
                  <h3 className="text-lg font-medium text-gray-900">Confirm Deletion</h3>
                </div>
                
                <div className="px-6 py-4">
                  <p className="text-sm text-gray-500 mb-4">
                    Are you sure you want to delete this time entry? This action cannot be undone.
                  </p>
                  
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setIsDeleteModalOpen(false)}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000] mr-2"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={confirmDeleteEntry}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Report Modal */}
      <Transition.Root show={isReportModalOpen} as={Fragment}>
        <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto" onClose={setIsReportModalOpen}>
          <div className="flex items-center justify-center min-h-screen px-4 py-12">
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

            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="translate-y-4 opacity-0"
              enterTo="translate-y-0 opacity-100"
              leave="ease-in duration-200"
              leaveFrom="translate-y-0 opacity-100"
              leaveTo="translate-y-4 opacity-0"
            >
              <div className="bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-4xl">
                <div className="px-6 py-4 border-b flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">
                    {selectedReport === 'time' && 'Time Summary Report'}
                    {selectedReport === 'billing' && 'Billing Summary Report'}
                    {selectedReport === 'detailed' && 'Detailed Time Report'}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsReportModalOpen(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <HiOutlineX className="h-5 w-5" />
                  </button>
                </div>
                
                <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
                  {reportData && (
                    <>
                      {selectedReport === 'time' && (
                        <div className="space-y-6">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-3">Activity Breakdown</h4>
                            <div className="overflow-x-auto">
                              <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                  <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activity</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hours</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Percentage</th>
                                  </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                  {reportData.activitySummary.map(activity => (
                                    <tr key={activity.id}>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{activity.name}</td>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{activity.hours.toFixed(1)}</td>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <div className="flex items-center">
                                          <span className="mr-2">{activity.percentage.toFixed(1)}%</span>
                                          <div className="w-32 bg-gray-200 rounded-full h-2.5">
                                            <div className="bg-[#800000] h-2.5 rounded-full" style={{ width: `${activity.percentage}%` }}></div>
                                          </div>
                                        </div>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-3">Monthly Trend</h4>
                            <div className="h-64 bg-gray-50 p-4 rounded-lg">
                              {/* Placeholder for chart - in a real app, you would use a charting library */}
                              <div className="h-full flex items-end justify-between space-x-2">
                                {reportData.monthlyTrend.map(item => (
                                  <div key={item.month} className="flex flex-col items-center">
                                    <div className="bg-[#800000] w-12 rounded-t-md" style={{ height: `${(item.hours / 80) * 100}%` }}></div>
                                    <div className="mt-2 text-xs font-medium text-gray-700">{item.month}</div>
                                    <div className="text-xs text-gray-500">{item.hours}h</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {selectedReport === 'billing' && (
                        <div className="space-y-6">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-3">Client Billing Summary</h4>
                            <div className="overflow-x-auto">
                              <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                  <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hours</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                  </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                  {reportData.clientSummary.map(client => (
                                    <tr key={client.clientId}>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{client.clientName}</td>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{client.hours.toFixed(1)}</td>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatMoney(client.amount)}</td>
                                    </tr>
                                  ))}
                                  <tr className="bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Total</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                      {reportData.clientSummary.reduce((sum, client) => sum + client.hours, 0).toFixed(1)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                      {formatMoney(reportData.clientSummary.reduce((sum, client) => sum + client.amount, 0))}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-3">Billing Status Overview</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="bg-gray-50 p-4 rounded-lg">
                                <h5 className="text-sm font-medium text-gray-700 mb-3">Hours</h5>
                                <div className="relative pt-1">
                                  <div className="flex mb-2 items-center justify-between">
                                    <div>
                                      <span className="text-xs font-medium inline-block py-1 px-2 uppercase rounded-full text-green-600 bg-green-200">
                                        Billable
                                      </span>
                                    </div>
                                    <div className="text-right">
                                      <span className="text-xs font-medium inline-block text-green-600">
                                        {reportData.billingStatus.billable.hours.toFixed(1)}h
                                      </span>
                                    </div>
                                  </div>
                                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-green-200">
                                    <div style={{ width: "90%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-600"></div>
                                  </div>
                                  
                                  <div className="flex mb-2 items-center justify-between">
                                    <div>
                                      <span className="text-xs font-medium inline-block py-1 px-2 uppercase rounded-full text-gray-600 bg-gray-200">
                                        Non-Billable
                                      </span>
                                    </div>
                                    <div className="text-right">
                                      <span className="text-xs font-medium inline-block text-gray-600">
                                        {reportData.billingStatus.nonBillable.hours.toFixed(1)}h
                                      </span>
                                    </div>
                                  </div>
                                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                                    <div style={{ width: "10%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gray-600"></div>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="bg-gray-50 p-4 rounded-lg">
                                <h5 className="text-sm font-medium text-gray-700 mb-3">Billing Status</h5>
                                <div className="relative pt-1">
                                  <div className="flex mb-2 items-center justify-between">
                                    <div>
                                      <span className="text-xs font-medium inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                                        Billed
                                      </span>
                                    </div>
                                    <div className="text-right">
                                      <span className="text-xs font-medium inline-block text-blue-600">
                                        {formatMoney(reportData.billingStatus.billed.amount)}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                                    <div style={{ width: "20%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600"></div>
                                  </div>
                                  
                                  <div className="flex mb-2 items-center justify-between">
                                    <div>
                                      <span className="text-xs font-medium inline-block py-1 px-2 uppercase rounded-full text-yellow-600 bg-yellow-200">
                                        Unbilled
                                      </span>
                                    </div>
                                    <div className="text-right">
                                      <span className="text-xs font-medium inline-block text-yellow-600">
                                        {formatMoney(reportData.billingStatus.unbilled.amount)}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-yellow-200">
                                    <div style={{ width: "80%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-yellow-600"></div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {selectedReport === 'detailed' && (
                        <div className="space-y-6">
                          <div className="flex justify-between mb-4">
                            <h4 className="text-sm font-medium text-gray-900">Detailed Time Report</h4>
                            <button
                              type="button"
                              className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                            >
                              <HiOutlineDownload className="mr-1.5 h-4 w-4" />
                              Export to CSV
                            </button>
                          </div>
                          
                          <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Case</th>
                                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activity</th>
                                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                {timeEntries.slice(0, 10).map((entry) => (
                                  <tr key={entry.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                      {format(parseISO(entry.date), 'MMM d, yyyy')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                      {getClientName(entry.clientId)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                      {getCaseName(entry.caseId)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                      {getActivityName(entry.activityType)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                      {formatTime(entry.duration)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                      {formatMoney((entry.duration / 3600) * entry.rate)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                      {entry.billable ? (
                                        entry.billed ? (
                                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            Billed
                                          </span>
                                        ) : (
                                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            Billable
                                          </span>
                                        )
                                      ) : (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                          Non-billable
                                        </span>
                                      )}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                          
                          <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                            <div className="text-sm text-gray-700">
                              Showing <span className="font-medium">10</span> of <span className="font-medium">{timeEntries.length}</span> entries
                            </div>
                            <div className="flex items-center space-x-2">
                              <button
                                type="button"
                                className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                              >
                                Previous
                              </button>
                              <button
                                type="button"
                                className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                              >
                                Next
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
                
                <div className="px-6 py-4 border-t bg-gray-50 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setIsReportModalOpen(false)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                  >
                    Close
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {toast.show && (
        <div className={`fixed bottom-4 right-4 px-4 py-3 rounded-md shadow-md ${
          toast.type === 'success' ? 'bg-green-50 text-green-800' : 
          toast.type === 'error' ? 'bg-red-50 text-red-800' : 
          'bg-blue-50 text-blue-800'
        }`}>
          <p className="flex items-center text-sm font-medium">
            {toast.type === 'success' && <HiOutlineCheck className="mr-2 h-5 w-5" />}
            {toast.type === 'error' && <HiOutlineExclamation className="mr-2 h-5 w-5" />}
            {toast.type === 'info' && <HiOutlineInformationCircle className="mr-2 h-5 w-5" />}
            {toast.message}
          </p>
        </div>
      )}
    </div>
  )
}

export default AttorneyTimeTrackingPage
