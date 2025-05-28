import React, { useState, useEffect, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Dialog, Transition, Popover } from '@headlessui/react';
import { useAuth } from '../../../context/AuthContext';
import { 
  HiOutlineCalendar, 
  HiOutlineClock,
  HiOutlineLocationMarker,
  HiOutlineUserGroup,
  HiOutlineDocumentText,
  HiOutlinePlus,
  HiOutlineX,
  HiOutlineCheck,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlinePencilAlt,
  HiOutlineTrash,
  HiOutlineExclamation,
  HiOutlineVideoCamera,
  HiOutlinePhone,
  HiOutlineUser,
  HiOutlineDotsVertical,
  HiOutlineExclamationCircle,
  HiOutlineViewList,
  HiOutlineViewGrid
} from 'react-icons/hi';

const ClientCalendarPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEventDetailsOpen, setIsEventDetailsOpen] = useState(false);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month'); // 'month', 'week', 'day', 'list'
  const [newEvent, setNewEvent] = useState({
    title: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    location: '',
    description: '',
    attendees: [],
    type: 'meeting', // 'meeting', 'hearing', 'deadline', 'reminder'
    relatedCase: '',
    isAllDay: false,
    isVirtual: false,
    meetingLink: ''
  });
  const [cases, setCases] = useState([]);
  const [calendarFilters, setCalendarFilters] = useState({
    eventTypes: ['meeting', 'hearing', 'deadline', 'reminder'],
    cases: 'all'
  });

  // Fetch calendar data
  useEffect(() => {
    const fetchCalendarData = async () => {
      try {
        // Mock cases data
        const mockCases = [
          { id: 1, title: 'Smith v. Johnson', type: 'Personal Injury' },
          { id: 2, title: 'Estate of Williams', type: 'Probate' },
          { id: 3, title: 'Brown LLC Contract', type: 'Corporate' },
        ];

        // Mock events data with different types
        const mockEvents = [
          {
            id: 1,
            title: 'Initial Consultation',
            start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 5, 10, 0),
            end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 5, 11, 30),
            type: 'meeting',
            location: 'Law Office - Room 203',
            description: 'Initial meeting to discuss case details and strategy.',
            attendees: [
              { id: 456, name: 'Sarah Wilson', role: 'attorney' },
              { id: 123, name: 'John Doe', role: 'client' }
            ],
            relatedCase: 'Smith v. Johnson',
            isAllDay: false,
            isVirtual: false,
            documents: []
          },
          {
            id: 2,
            title: 'Document Submission Deadline',
            start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 12),
            end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 12),
            type: 'deadline',
            description: 'Last day to submit discovery documents.',
            relatedCase: 'Smith v. Johnson',
            isAllDay: true,
            documents: [
              { id: 101, name: 'Required Documents Checklist.pdf' }
            ]
          },
          {
            id: 3,
            title: 'Court Hearing',
            start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15, 9, 30),
            end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15, 11, 0),
            type: 'hearing',
            location: 'County Courthouse - Courtroom 5B',
            description: 'Preliminary hearing for motion to dismiss.',
            attendees: [
              { id: 456, name: 'Sarah Wilson', role: 'attorney' },
              { id: 789, name: 'Judge Roberts', role: 'judge' }
            ],
            relatedCase: 'Smith v. Johnson',
            isAllDay: false,
            isVirtual: false,
            documents: [
              { id: 102, name: 'Motion to Dismiss.pdf' },
              { id: 103, name: 'Supporting Evidence.pdf' }
            ]
          },
          {
            id: 4,
            title: 'Contract Review',
            start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 20, 14, 0),
            end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 20, 15, 0),
            type: 'meeting',
            description: 'Review updated contract terms.',
            attendees: [
              { id: 789, name: 'Michael Brown', role: 'attorney' },
              { id: 123, name: 'John Doe', role: 'client' }
            ],
            relatedCase: 'Brown LLC Contract',
            isAllDay: false,
            isVirtual: true,
            meetingLink: 'https://zoom.us/j/123456789',
            documents: [
              { id: 104, name: 'Contract Draft v2.docx' }
            ]
          },
          {
            id: 5,
            title: 'Payment Due',
            start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 25),
            end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 25),
            type: 'reminder',
            description: 'Monthly invoice payment due date.',
            isAllDay: true,
            documents: [
              { id: 105, name: 'Invoice-2023-001.pdf' }
            ]
          },
          {
            id: 6,
            title: 'Estate Planning Follow-up',
            start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 27, 11, 0),
            end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 27, 12, 0),
            type: 'meeting',
            location: 'Phone Call',
            description: 'Follow-up call to discuss estate planning documents.',
            attendees: [
              { id: 101, name: 'Jessica Taylor', role: 'attorney' },
              { id: 123, name: 'John Doe', role: 'client' }
            ],
            relatedCase: 'Estate of Williams',
            isAllDay: false,
            isVirtual: false,
            documents: [
              { id: 106, name: 'Estate Plan Draft.pdf' }
            ]
          }
        ];

        setCases(mockCases);
        setEvents(mockEvents);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching calendar data:', error);
        setLoading(false);
      }
    };

    fetchCalendarData();
  }, [currentDate]);

  // Generate the days for the current month view
  const generateMonthDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // First day of the month
    const firstDay = new Date(year, month, 1);
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);
    
    // Get the day of the week for the first day (0 is Sunday)
    const firstDayOfWeek = firstDay.getDay();
    
    // Calculate days from previous month to show
    const daysFromPrevMonth = firstDayOfWeek;
    
    // Calculate days from next month to show to complete the grid
    const totalDaysInGrid = 42; // 6 rows of 7 days
    const daysFromNextMonth = totalDaysInGrid - (daysFromPrevMonth + lastDay.getDate());
    
    // Generate days from previous month
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    const prevMonthDays = Array.from({ length: daysFromPrevMonth }, (_, i) => ({
      date: new Date(year, month - 1, prevMonthLastDay - daysFromPrevMonth + i + 1),
      isCurrentMonth: false,
      isPast: new Date(year, month - 1, prevMonthLastDay - daysFromPrevMonth + i + 1) < new Date(new Date().setHours(0, 0, 0, 0)),
      isToday: false
    }));
    
    // Generate days for current month
    const currentMonthDays = Array.from({ length: lastDay.getDate() }, (_, i) => {
      const date = new Date(year, month, i + 1);
      const today = new Date();
      const isToday = date.getDate() === today.getDate() && 
                      date.getMonth() === today.getMonth() && 
                      date.getFullYear() === today.getFullYear();
      
      return {
        date,
        isCurrentMonth: true,
        isPast: date < new Date(new Date().setHours(0, 0, 0, 0)),
        isToday
      };
    });
    
    // Generate days for next month
    const nextMonthDays = Array.from({ length: daysFromNextMonth }, (_, i) => ({
      date: new Date(year, month + 1, i + 1),
      isCurrentMonth: false,
      isPast: false,
      isToday: false
    }));
    
    // Combine all days
    return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
  };

  // Get events for a specific date
  const getEventsForDate = (date) => {
    return events.filter(event => {
      const eventDate = new Date(event.start);
      return eventDate.getDate() === date.getDate() &&
             eventDate.getMonth() === date.getMonth() &&
             eventDate.getFullYear() === date.getFullYear() &&
             // Apply filters
             calendarFilters.eventTypes.includes(event.type) &&
             (calendarFilters.cases === 'all' || event.relatedCase === calendarFilters.cases);
    });
  };

  // Navigate to previous month/week/day
  const navigatePrevious = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'month') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() - 7);
    } else if (viewMode === 'day') {
      newDate.setDate(newDate.getDate() - 1);
    }
    setCurrentDate(newDate);
  };

  // Navigate to next month/week/day
  const navigateNext = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'month') {
      newDate.setMonth(newDate.getMonth() + 1);
    } else if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() + 7);
    } else if (viewMode === 'day') {
      newDate.setDate(newDate.getDate() + 1);
    }
    setCurrentDate(newDate);
  };

  // Navigate to today
  const navigateToday = () => {
    setCurrentDate(new Date());
  };

  // Format date for display
  const formatDateHeader = () => {
    const options = { month: 'long', year: 'numeric' };
    return currentDate.toLocaleDateString('en-US', options);
  };

  // Handle event click
  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setIsEventDetailsOpen(true);
  };

  // Get color for event type
  const getEventTypeColor = (type) => {
    switch (type) {
      case 'meeting':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'hearing':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'deadline':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'reminder':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Get icon for event type
  const getEventTypeIcon = (type) => {
    switch (type) {
      case 'meeting':
        return <HiOutlineUserGroup className="h-4 w-4" />;
      case 'hearing':
        return <HiOutlineDocumentText className="h-4 w-4" />;
      case 'deadline':
        return <HiOutlineExclamationCircle className="h-4 w-4" />;
      case 'reminder':
        return <HiOutlineClock className="h-4 w-4" />;
      default:
        return <HiOutlineCalendar className="h-4 w-4" />;
    }
  };

  // Format event time for display
  const formatEventTime = (date) => {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  // Handle add new event
  const handleAddEvent = () => {
    // Format today's date for form defaults
    const today = new Date();
    const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    
    // Reset form and set default date to today
    setNewEvent({
      ...newEvent,
      startDate: formattedDate,
      endDate: formattedDate
    });
    
    setIsAddEventOpen(true);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewEvent({
      ...newEvent,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Handle form submission
  const handleSubmitEvent = (e) => {
    e.preventDefault();
    
    // Create start and end dates from form data
    const start = newEvent.isAllDay 
      ? new Date(newEvent.startDate)
      : new Date(`${newEvent.startDate}T${newEvent.startTime}`);
    
    const end = newEvent.isAllDay
      ? new Date(newEvent.endDate)
      : new Date(`${newEvent.endDate}T${newEvent.endTime}`);
    
    // Create new event object
    const eventToAdd = {
      id: Date.now(), // Use timestamp as temporary ID
      title: newEvent.title,
      start,
      end,
      type: newEvent.type,
      location: newEvent.location,
      description: newEvent.description,
      attendees: [], // Would be populated from form in a real app
      relatedCase: newEvent.relatedCase,
      isAllDay: newEvent.isAllDay,
      isVirtual: newEvent.isVirtual,
      meetingLink: newEvent.meetingLink,
      documents: []
    };
    
    // Add to events array
    setEvents([...events, eventToAdd]);
    
    // Close modal
    setIsAddEventOpen(false);
  };

  // Toggle event type filter
  const toggleEventTypeFilter = (type) => {
    setCalendarFilters(prev => {
      if (prev.eventTypes.includes(type)) {
        return {
          ...prev,
          eventTypes: prev.eventTypes.filter(t => t !== type)
        };
      } else {
        return {
          ...prev,
          eventTypes: [...prev.eventTypes, type]
        };
      }
    });
  };

  // Set case filter
  const handleCaseFilterChange = (caseTitle) => {
    setCalendarFilters(prev => ({
      ...prev,
      cases: caseTitle
    }));
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
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Calendar</h1>
          <div className="mt-4 md:mt-0 flex space-x-2">
            <button
              onClick={handleAddEvent}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#800000] hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
            >
              <HiOutlinePlus className="-ml-1 mr-2 h-5 w-5" />
              Add Event
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-6">
        <div className="bg-white shadow rounded-lg mb-6">
          {/* Calendar header with navigation */}
          <div className="px-4 py-5 border-b border-gray-200 sm:px-6 flex flex-col sm:flex-row sm:justify-between">
            <div className="flex items-center mb-4 sm:mb-0">
              <button
                onClick={navigatePrevious}
                className="p-1 rounded-full text-gray-500 hover:bg-gray-100"
              >
                <HiOutlineChevronLeft className="h-6 w-6" />
              </button>
              <h2 className="text-lg font-medium text-gray-900 mx-4">
                {formatDateHeader()}
              </h2>
              <button
                onClick={navigateNext}
                className="p-1 rounded-full text-gray-500 hover:bg-gray-100"
              >
                <HiOutlineChevronRight className="h-6 w-6" />
              </button>
              <button
                onClick={navigateToday}
                className="ml-4 px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
              >
                Today
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('month')}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  viewMode === 'month' 
                    ? 'bg-[#800000] text-white' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Month
              </button>
              <button
                onClick={() => setViewMode('week')}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  viewMode === 'week' 
                    ? 'bg-[#800000] text-white' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Week
              </button>
              <button
                onClick={() => setViewMode('day')}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  viewMode === 'day' 
                    ? 'bg-[#800000] text-white' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Day
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  viewMode === 'list' 
                    ? 'bg-[#800000] text-white' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                List
              </button>
            </div>
          </div>

          {/* Calendar filters */}
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 sm:px-6 flex flex-wrap items-center">
            <div className="mr-6 mb-2 sm:mb-0">
              <span className="text-sm font-medium text-gray-700 mr-2">Event Types:</span>
              <div className="mt-1 flex space-x-2">
                <button
                  onClick={() => toggleEventTypeFilter('meeting')}
                  className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                    calendarFilters.eventTypes.includes('meeting')
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {calendarFilters.eventTypes.includes('meeting') && (
                    <HiOutlineCheck className="mr-1 h-3 w-3" />
                  )}
                  Meetings
                </button>
                <button
                  onClick={() => toggleEventTypeFilter('hearing')}
                  className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                    calendarFilters.eventTypes.includes('hearing')
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {calendarFilters.eventTypes.includes('hearing') && (
                    <HiOutlineCheck className="mr-1 h-3 w-3" />
                  )}
                  Hearings
                </button>
                <button
                  onClick={() => toggleEventTypeFilter('deadline')}
                  className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                    calendarFilters.eventTypes.includes('deadline')
                      ? 'bg-red-100 text-red-800'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {calendarFilters.eventTypes.includes('deadline') && (
                    <HiOutlineCheck className="mr-1 h-3 w-3" />
                  )}
                  Deadlines
                </button>
                <button
                  onClick={() => toggleEventTypeFilter('reminder')}
                  className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                    calendarFilters.eventTypes.includes('reminder')
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {calendarFilters.eventTypes.includes('reminder') && (
                    <HiOutlineCheck className="mr-1 h-3 w-3" />
                  )}
                  Reminders
                </button>
              </div>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700 mr-2">Case:</span>
              <select
                className="mt-1 block pl-3 pr-10 py-1 text-base border-gray-300 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm rounded-md"
                value={calendarFilters.cases}
                onChange={(e) => handleCaseFilterChange(e.target.value)}
              >
                <option value="all">All Cases</option>
                {cases.map(caseItem => (
                  <option key={caseItem.id} value={caseItem.title}>
                    {caseItem.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Month view calendar */}
          {viewMode === 'month' && (
            <div className="p-4">
              {/* Days of week header */}
              <div className="grid grid-cols-7 gap-px border-b border-gray-200 pb-2 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                  <div key={index} className="text-center text-sm font-medium text-gray-500">
                    {day}
                  </div>
                ))}
              </div>
              
              {/* Calendar grid */}
              <div className="grid grid-cols-7 gap-px">
                {generateMonthDays().map((day, index) => {
                  const dayEvents = getEventsForDate(day.date);
                  return (
                    <div 
                      key={index} 
                      className={`min-h-[100px] p-2 border border-gray-100 ${
                        !day.isCurrentMonth ? 'bg-gray-50' : 
                        day.isToday ? 'bg-blue-50' : 
                        day.isPast ? 'bg-white' : 'bg-white'
                      }`}
                    >
                      <div className={`text-right text-sm font-medium ${
                        !day.isCurrentMonth ? 'text-gray-400' :
                        day.isToday ? 'text-blue-600' : 'text-gray-700'
                      }`}>
                        {day.date.getDate()}
                      </div>
                      <div className="mt-1 space-y-1 max-h-[80px] overflow-y-auto">
                        {dayEvents.map(event => (
                          <button
                            key={event.id}
                            onClick={() => handleEventClick(event)}
                            className={`w-full text-left px-2 py-1 rounded text-xs font-medium truncate border-l-2 ${getEventTypeColor(event.type)}`}
                          >
                            <div className="flex items-center">
                              {getEventTypeIcon(event.type)}
                              <span className="ml-1 truncate">
                                {event.isAllDay ? '(All day) ' : `${formatEventTime(event.start)} `}
                                {event.title}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* List view */}
          {viewMode === 'list' && (
            <div className="overflow-hidden">
              <ul className="divide-y divide-gray-200">
                {events
                  .filter(event => 
                    calendarFilters.eventTypes.includes(event.type) && 
                    (calendarFilters.cases === 'all' || event.relatedCase === calendarFilters.cases)
                  )
                  .sort((a, b) => a.start - b.start)
                  .map(event => (
                    <li key={event.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                      <button
                        onClick={() => handleEventClick(event)}
                        className="w-full text-left"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className={`p-2 rounded-md mr-4 ${getEventTypeColor(event.type)}`}>
                              {getEventTypeIcon(event.type)}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {event.title}
                              </p>
                              <div className="mt-1 flex flex-wrap items-center text-xs text-gray-500">
                                <div className="flex items-center mr-4">
                                  <HiOutlineCalendar className="mr-1 h-4 w-4 text-gray-400" />
                                  {event.start.toLocaleDateString()}
                                </div>
                                {!event.isAllDay && (
                                  <div className="flex items-center mr-4">
                                    <HiOutlineClock className="mr-1 h-4 w-4 text-gray-400" />
                                    {formatEventTime(event.start)} - {formatEventTime(event.end)}
                                  </div>
                                )}
                                {event.isAllDay && (
                                  <div className="flex items-center mr-4">
                                    <HiOutlineClock className="mr-1 h-4 w-4 text-gray-400" />
                                    All day
                                  </div>
                                )}
                                {event.location && (
                                  <div className="flex items-center mr-4">
                                    <HiOutlineLocationMarker className="mr-1 h-4 w-4 text-gray-400" />
                                    {event.location}
                                  </div>
                                )}
                                {event.relatedCase && (
                                  <div className="flex items-center">
                                    <HiOutlineDocumentText className="mr-1 h-4 w-4 text-gray-400" />
                                    {event.relatedCase}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="ml-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEventTypeColor(event.type)}`}>
                              {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                            </span>
                          </div>
                        </div>
                      </button>
                    </li>
                  ))}
                {events
                  .filter(event => 
                    calendarFilters.eventTypes.includes(event.type) && 
                    (calendarFilters.cases === 'all' || event.relatedCase === calendarFilters.cases)
                  ).length === 0 && (
                  <li className="px-4 py-12 sm:px-6 text-center">
                    <HiOutlineCalendar className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No events</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      No events match your current filters.
                    </p>
                    <div className="mt-6">
                      <button
                        onClick={handleAddEvent}
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#800000] hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                      >
                        <HiOutlinePlus className="-ml-1 mr-2 h-5 w-5" />
                        Add Event
                      </button>
                    </div>
                  </li>
                )}
              </ul>
            </div>
          )}

          {/* Week view would go here */}
          {viewMode === 'week' && (
            <div className="p-4 text-center">
              <p className="text-gray-500">Week view would be implemented here</p>
            </div>
          )}

          {/* Day view would go here */}
          {viewMode === 'day' && (
            <div className="p-4 text-center">
              <p className="text-gray-500">Day view would be implemented here</p>
            </div>
          )}
        </div>
      </div>

      {/* Event Details Modal */}
      <Transition appear show={isEventDetailsOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={() => setIsEventDetailsOpen(false)}
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
            <span className="inline-block h-screen align-middle" aria-hidden="true">
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
                {selectedEvent && (
                  <>
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900 flex justify-between items-center"
                    >
                      <div className="flex items-center">
                        <div className={`p-2 rounded-md mr-3 ${getEventTypeColor(selectedEvent.type)}`}>
                          {getEventTypeIcon(selectedEvent.type)}
                        </div>
                        <span>{selectedEvent.title}</span>
                      </div>
                      <button
                        onClick={() => setIsEventDetailsOpen(false)}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <HiOutlineX className="h-6 w-6" />
                      </button>
                    </Dialog.Title>
                    
                    <div className="mt-4">
                      <div className="space-y-3">
                        <div>
                          <div className="flex items-center text-sm text-gray-500">
                            <HiOutlineCalendar className="mr-2 h-5 w-5 text-gray-400" />
                            <span>
                              {selectedEvent.start.toLocaleDateString()}
                              {selectedEvent.isAllDay 
                                ? ' (All day)' 
                                : ` · ${formatEventTime(selectedEvent.start)} - ${formatEventTime(selectedEvent.end)}`
                              }
                            </span>
                          </div>
                        </div>
                        
                        {selectedEvent.location && (
                          <div className="flex items-center text-sm text-gray-500">
                            <HiOutlineLocationMarker className="mr-2 h-5 w-5 text-gray-400" />
                            <span>{selectedEvent.location}</span>
                          </div>
                        )}
                        
                        {selectedEvent.isVirtual && selectedEvent.meetingLink && (
                          <div className="flex items-start text-sm text-gray-500">
                            <HiOutlineVideoCamera className="mr-2 h-5 w-5 text-gray-400 mt-0.5" />
                            <div>
                              <div>Virtual Meeting</div>
                              <a 
                                href={selectedEvent.meetingLink} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-[#800000] hover:underline"
                              >
                                {selectedEvent.meetingLink}
                              </a>
                            </div>
                          </div>
                        )}
                        
                        {selectedEvent.relatedCase && (
                          <div className="flex items-center text-sm text-gray-500">
                            <HiOutlineDocumentText className="mr-2 h-5 w-5 text-gray-400" />
                            <span>Related Case: {selectedEvent.relatedCase}</span>
                          </div>
                        )}
                        
                        {selectedEvent.description && (
                          <div className="mt-4">
                            <h4 className="text-sm font-medium text-gray-900">Description</h4>
                            <p className="mt-1 text-sm text-gray-500">
                              {selectedEvent.description}
                            </p>
                          </div>
                        )}
                        
                        {selectedEvent.attendees && selectedEvent.attendees.length > 0 && (
                          <div className="mt-4">
                            <h4 className="text-sm font-medium text-gray-900">Attendees</h4>
                            <ul className="mt-2 space-y-2">
                              {selectedEvent.attendees.map(attendee => (
                                <li key={attendee.id} className="flex items-center text-sm">
                                  <HiOutlineUser className="mr-2 h-5 w-5 text-gray-400" />
                                  <span>
                                    {attendee.name}
                                    <span className="ml-1 text-xs text-gray-500">
                                      ({attendee.role})
                                    </span>
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {selectedEvent.documents && selectedEvent.documents.length > 0 && (
                          <div className="mt-4">
                            <h4 className="text-sm font-medium text-gray-900">Related Documents</h4>
                            <ul className="mt-2 space-y-2">
                              {selectedEvent.documents.map(doc => (
                                <li key={doc.id} className="flex items-center text-sm">
                                  <HiOutlineDocumentText className="mr-2 h-5 w-5 text-gray-400" />
                                  <a 
                                    href="#" 
                                    className="text-[#800000] hover:underline"
                                  >
                                    {doc.name}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-6 flex justify-end space-x-3">
                      <button
                        type="button"
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                        onClick={() => setIsEventDetailsOpen(false)}
                      >
                        Close
                      </button>
                    </div>
                  </>
                )}
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

      {/* Add Event Modal */}
      <Transition appear show={isAddEventOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={() => setIsAddEventOpen(false)}
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
            <span className="inline-block h-screen align-middle" aria-hidden="true">
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
                  className="text-lg font-medium leading-6 text-gray-900 flex justify-between items-center"
                >
                  <span>Add New Event</span>
                  <button
                    onClick={() => setIsAddEventOpen(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <HiOutlineX className="h-6 w-6" />
                  </button>
                </Dialog.Title>
                
                <form onSubmit={handleSubmitEvent} className="mt-4">
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                        Event Title *
                      </label>
                      <input
                        type="text"
                        name="title"
                        id="title"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm"
                        value={newEvent.title}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                        Event Type
                      </label>
                      <select
                        id="type"
                        name="type"
                        className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm"
                        value={newEvent.type}
                        onChange={handleInputChange}
                      >
                        <option value="meeting">Meeting</option>
                        <option value="hearing">Hearing</option>
                        <option value="deadline">Deadline</option>
                        <option value="reminder">Reminder</option>
                      </select>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        id="isAllDay"
                        name="isAllDay"
                        type="checkbox"
                        className="h-4 w-4 text-[#800000] focus:ring-[#800000] border-gray-300 rounded"
                        checked={newEvent.isAllDay}
                        onChange={handleInputChange}
                      />
                      <label htmlFor="isAllDay" className="ml-2 block text-sm text-gray-700">
                        All-day event
                      </label>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                          Start Date
                        </label>
                        <input
                          type="date"
                          name="startDate"
                          id="startDate"
                          required
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm"
                          value={newEvent.startDate}
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      {!newEvent.isAllDay && (
                        <div>
                          <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
                            Start Time
                          </label>
                          <input
                            type="time"
                            name="startTime"
                            id="startTime"
                            required={!newEvent.isAllDay}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm"
                            value={newEvent.startTime}
                            onChange={handleInputChange}
                          />
                        </div>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                          End Date
                        </label>
                        <input
                          type="date"
                          name="endDate"
                          id="endDate"
                          required
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm"
                          value={newEvent.endDate}
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      {!newEvent.isAllDay && (
                        <div>
                          <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">
                            End Time
                          </label>
                          <input
                            type="time"
                            name="endTime"
                            id="endTime"
                            required={!newEvent.isAllDay}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm"
                            value={newEvent.endTime}
                            onChange={handleInputChange}
                          />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        id="isVirtual"
                        name="isVirtual"
                        type="checkbox"
                        className="h-4 w-4 text-[#800000] focus:ring-[#800000] border-gray-300 rounded"
                        checked={newEvent.isVirtual}
                        onChange={handleInputChange}
                      />
                      <label htmlFor="isVirtual" className="ml-2 block text-sm text-gray-700">
                        Virtual meeting
                      </label>
                    </div>
                    
                    {newEvent.isVirtual ? (
                      <div>
                        <label htmlFor="meetingLink" className="block text-sm font-medium text-gray-700">
                          Meeting Link
                        </label>
                        <input
                          type="url"
                          name="meetingLink"
                          id="meetingLink"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm"
                          placeholder="https://zoom.us/j/..."
                          value={newEvent.meetingLink}
                          onChange={handleInputChange}
                        />
                      </div>
                    ) : (
                      <div>
                        <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                          Location
                        </label>
                        <input
                          type="text"
                          name="location"
                          id="location"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm"
                          placeholder="Office, Courthouse, etc."
                          value={newEvent.location}
                          onChange={handleInputChange}
                        />
                      </div>
                    )}
                    
                    <div>
                      <label htmlFor="relatedCase" className="block text-sm font-medium text-gray-700">
                        Related Case
                      </label>
                      <select
                        id="relatedCase"
                        name="relatedCase"
                        className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm"
                        value={newEvent.relatedCase}
                        onChange={handleInputChange}
                      >
                        <option value="">None</option>
                        {cases.map(caseItem => (
                          <option key={caseItem.id} value={caseItem.title}>
                            {caseItem.title}
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
                        rows={3}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm"
                        value={newEvent.description}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                      onClick={() => setIsAddEventOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#800000] hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                    >
                      Save Event
                    </button>
                  </div>
                </form>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default ClientCalendarPage;