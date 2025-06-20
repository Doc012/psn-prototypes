import React, { useState, useEffect, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Dialog, Transition } from '@headlessui/react';
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
  HiOutlineViewGrid,
  HiOutlineBell,
  HiOutlineOfficeBuilding,
  HiOutlineMailOpen,
  HiOutlineInformationCircle,
  HiOutlineStar,
  HiStar
} from 'react-icons/hi';
import { format, addDays, subDays, startOfWeek, endOfWeek, addMonths, subMonths, isSameDay, isSameMonth, parseISO } from 'date-fns';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Calendar component error:", error, errorInfo);
  }

  handleTryAgain = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-lg font-medium text-red-600">Something went wrong</h2>
          <p className="mt-2 text-sm text-gray-500">
            There was an error loading the calendar. Please try refreshing the page.
          </p>
          <button
            className="mt-4 px-4 py-2 bg-[#800000] text-white rounded hover:bg-[#600000]"
            onClick={this.handleTryAgain}
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

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
    meetingLink: '',
    isImportant: false,
    notifyBefore: '30',
    preferredAttorney: '', // New field
    contactMethod: 'email', // New field: 'email', 'phone'
    urgency: 'normal', // New field: 'urgent', 'normal', 'flexible'
    notes: '', // Client-specific notes for the request
    status: 'pending' // Initial status
  });
  const [cases, setCases] = useState([]);
  const [calendarFilters, setCalendarFilters] = useState({
    eventTypes: ['meeting', 'hearing', 'deadline', 'reminder'],
    cases: 'all',
    timeframe: 'upcoming'
  });
  const [showTooltipId, setShowTooltipId] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [selectedReminder, setSelectedReminder] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [confirmationData, setConfirmationData] = useState({
    show: false,
    eventId: null,
    title: '',
    date: '',
    time: ''
  });

  // Get current year and month for realistic data
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const today = new Date();
  
  // Fetch calendar data with current dates
  useEffect(() => {
    const fetchCalendarData = async () => {
      try {
        // Mock cases data
        const mockCases = [
          { id: 1, title: 'Smith v. Johnson', type: 'Personal Injury', number: `PI-${currentYear}-1452` },
          { id: 2, title: 'Estate of Williams', type: 'Probate', number: `PR-${currentYear}-0783` },
          { id: 3, title: 'Brown LLC Contract', type: 'Corporate', number: `CL-${currentYear}-0251` },
          { id: 4, title: 'Jones Divorce', type: 'Family Law', number: `FL-${currentYear}-0592` }
        ];

        // Calculate dates based on current date
        const nextWeek = addDays(today, 7);
        const twoWeeksFromNow = addDays(today, 14);
        const nextMonth = addMonths(today, 1);
        const yesterday = subDays(today, 1);
        const lastWeek = subDays(today, 5);
        const inTwoDays = addDays(today, 2);
        const inThreeDays = addDays(today, 3);

        // Mock events data with different types using current dates
        const mockEvents = [
          {
            id: 1,
            title: 'Settlement Discussion',
            start: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2, 10, 0),
            end: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2, 11, 30),
            type: 'meeting',
            location: 'Law Office - Conference Room A',
            description: 'Discussion of potential settlement options and negotiation strategy.',
            attendees: [
              { id: 456, name: 'Sarah Nguyen', role: 'attorney', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
              { id: 123, name: user?.firstName ? `${user.firstName} ${user.lastName}` : 'John Doe', role: 'client' }
            ],
            relatedCase: 'Smith v. Johnson',
            caseId: 1,
            isAllDay: false,
            isVirtual: false,
            isImportant: true,
            status: 'confirmed',
            documents: [
              { id: 101, name: 'Settlement_Proposal.pdf', size: '420 KB' }
            ]
          },
          {
            id: 2,
            title: 'Document Submission Deadline',
            start: new Date(nextWeek),
            end: new Date(nextWeek),
            type: 'deadline',
            description: 'Final deadline to submit all discovery documents to opposing counsel.',
            relatedCase: 'Smith v. Johnson',
            caseId: 1,
            isAllDay: true,
            isImportant: true,
            status: 'pending',
            documents: [
              { id: 102, name: 'Document_Checklist.pdf', size: '215 KB' }
            ]
          },
          {
            id: 3,
            title: 'Court Hearing - Motion to Dismiss',
            start: new Date(twoWeeksFromNow.getFullYear(), twoWeeksFromNow.getMonth(), twoWeeksFromNow.getDate(), 9, 30),
            end: new Date(twoWeeksFromNow.getFullYear(), twoWeeksFromNow.getMonth(), twoWeeksFromNow.getDate(), 11, 0),
            type: 'hearing',
            location: 'County Courthouse - Courtroom 5B',
            description: 'Preliminary hearing for motion to dismiss. Client attendance required.',
            attendees: [
              { id: 456, name: 'Sarah Nguyen', role: 'attorney', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
              { id: 123, name: user?.firstName ? `${user.firstName} ${user.lastName}` : 'John Doe', role: 'client' },
              { id: 789, name: 'Judge Roberts', role: 'judge' }
            ],
            relatedCase: 'Smith v. Johnson',
            caseId: 1,
            isAllDay: false,
            isVirtual: false,
            isImportant: true,
            status: 'confirmed',
            documents: [
              { id: 103, name: 'Motion_to_Dismiss.pdf', size: '1.2 MB' },
              { id: 104, name: 'Supporting_Evidence.pdf', size: '3.5 MB' }
            ]
          },
          {
            id: 4,
            title: 'Contract Review Call',
            start: new Date(inTwoDays.getFullYear(), inTwoDays.getMonth(), inTwoDays.getDate(), 14, 0),
            end: new Date(inTwoDays.getFullYear(), inTwoDays.getMonth(), inTwoDays.getDate(), 15, 0),
            type: 'meeting',
            description: 'Review updated contract terms and discuss next steps.',
            attendees: [
              { id: 457, name: 'Michael Patel', role: 'attorney', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
              { id: 123, name: user?.firstName ? `${user.firstName} ${user.lastName}` : 'John Doe', role: 'client' }
            ],
            relatedCase: 'Brown LLC Contract',
            caseId: 3,
            isAllDay: false,
            isVirtual: true,
            meetingLink: 'https://zoom.us/j/123456789',
            isImportant: false,
            status: 'confirmed',
            documents: [
              { id: 105, name: 'Contract_Draft_v2.docx', size: '850 KB' }
            ]
          },
          {
            id: 5,
            title: 'Invoice Payment Due',
            start: new Date(nextMonth.getFullYear(), nextMonth.getMonth(), 5),
            end: new Date(nextMonth.getFullYear(), nextMonth.getMonth(), 5),
            type: 'reminder',
            description: 'Monthly invoice payment due date. Payment can be made through the client portal.',
            isAllDay: true,
            isImportant: false,
            status: 'pending',
            documents: [
              { id: 106, name: `Invoice-${currentYear}-001.pdf`, size: '320 KB' }
            ]
          },
          {
            id: 6,
            title: 'Estate Planning Call',
            start: new Date(inThreeDays.getFullYear(), inThreeDays.getMonth(), inThreeDays.getDate(), 11, 0),
            end: new Date(inThreeDays.getFullYear(), inThreeDays.getMonth(), inThreeDays.getDate(), 12, 0),
            type: 'meeting',
            description: 'Follow-up call to discuss your estate planning documents and answer any questions.',
            attendees: [
              { id: 458, name: 'Jessica Taylor', role: 'attorney', avatar: 'https://randomuser.me/api/portraits/women/68.jpg' },
              { id: 123, name: user?.firstName ? `${user.firstName} ${user.lastName}` : 'John Doe', role: 'client' }
            ],
            relatedCase: 'Estate of Williams',
            caseId: 2,
            isAllDay: false,
            isVirtual: false,
            meetingMethod: 'phone',
            isImportant: false,
            status: 'confirmed',
            documents: [
              { id: 107, name: 'Estate_Plan_Draft.pdf', size: '1.5 MB' }
            ]
          },
          {
            id: 7,
            title: 'Property Settlement Discussion',
            start: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 10, 13, 30),
            end: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 10, 15, 0),
            type: 'meeting',
            location: 'Law Office - Conference Room B',
            description: 'Meeting to discuss division of property and settlement terms.',
            attendees: [
              { id: 459, name: 'Robert Johnson', role: 'attorney', avatar: 'https://randomuser.me/api/portraits/men/42.jpg' },
              { id: 123, name: user?.firstName ? `${user.firstName} ${user.lastName}` : 'John Doe', role: 'client' }
            ],
            relatedCase: 'Jones Divorce',
            caseId: 4,
            isAllDay: false,
            isVirtual: false,
            isImportant: true,
            status: 'tentative',
            documents: []
          },
          {
            id: 8,
            title: 'Deposition - Smith v. Johnson',
            start: new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 9, 0),
            end: new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 13, 0),
            type: 'hearing',
            location: 'Law Office - Deposition Room',
            description: 'Deposition of plaintiff. Be prepared to answer questions under oath.',
            attendees: [
              { id: 456, name: 'Sarah Nguyen', role: 'attorney', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
              { id: 123, name: user?.firstName ? `${user.firstName} ${user.lastName}` : 'John Doe', role: 'client' }
            ],
            relatedCase: 'Smith v. Johnson',
            caseId: 1,
            isAllDay: false,
            isVirtual: false,
            isImportant: true,
            status: 'completed',
            documents: [
              { id: 108, name: 'Deposition_Questions.pdf', size: '520 KB' }
            ]
          },
          {
            id: 9,
            title: 'Child Custody Meeting',
            start: new Date(lastWeek.getFullYear(), lastWeek.getMonth(), lastWeek.getDate(), 10, 0),
            end: new Date(lastWeek.getFullYear(), lastWeek.getMonth(), lastWeek.getDate(), 11, 30),
            type: 'meeting',
            location: 'Family Court Services',
            description: 'Discussion regarding child custody arrangements and visitation schedule.',
            attendees: [
              { id: 459, name: 'Robert Johnson', role: 'attorney', avatar: 'https://randomuser.me/api/portraits/men/42.jpg' },
              { id: 123, name: user?.firstName ? `${user.firstName} ${user.lastName}` : 'John Doe', role: 'client' },
              { id: 460, name: 'Mediator Williams', role: 'mediator' }
            ],
            relatedCase: 'Jones Divorce',
            caseId: 4,
            isAllDay: false,
            isVirtual: false,
            isImportant: false,
            status: 'completed',
            documents: [
              { id: 109, name: 'Custody_Proposal.pdf', size: '750 KB' }
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
  }, [user]);

  // Format today's date for form defaults when adding new event
  useEffect(() => {
    const formattedDate = format(new Date(), 'yyyy-MM-dd');
    setNewEvent(prev => ({
      ...prev,
      startDate: formattedDate,
      endDate: formattedDate,
      startTime: '09:00',
      endTime: '10:00'
    }));
  }, []);

  // Add this inside your useEffect for initial setup
  useEffect(() => {
    // Add event listener to handle closing tooltips when clicking elsewhere
    const handleClickOutside = () => {
      setShowTooltipId(null);
    };
    
    document.addEventListener('click', handleClickOutside);
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

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
  
  // Generate the days for week view
  const generateWeekDays = () => {
    const startDay = startOfWeek(currentDate, { weekStartsOn: 0 });
    return Array.from({ length: 7 }, (_, i) => {
      const date = addDays(startDay, i);
      return {
        date,
        isToday: isSameDay(date, new Date()),
        isPast: date < new Date(new Date().setHours(0, 0, 0, 0))
      };
    });
  };

  // Get events for a specific date
  const getEventsForDate = (date) => {
    return events.filter(event => {
      const eventDate = new Date(event.start);
      const isSameDate = isSameDay(eventDate, date);
      
      // Apply filters
      const typeMatches = calendarFilters.eventTypes.includes(event.type);
      const caseMatches = calendarFilters.cases === 'all' || event.relatedCase === calendarFilters.cases;
      
      // Apply timeframe filter
      let timeframeMatches = true;
      if (calendarFilters.timeframe === 'upcoming') {
        timeframeMatches = eventDate >= new Date(new Date().setHours(0, 0, 0, 0));
      } else if (calendarFilters.timeframe === 'past') {
        timeframeMatches = eventDate < new Date(new Date().setHours(0, 0, 0, 0));
      }
      
      return isSameDate && typeMatches && caseMatches && timeframeMatches;
    });
  };

  // Get events for a specific date and hour (for day view)
  const getEventsForHour = (date, hour) => {
    return events.filter(event => {
      const eventDate = new Date(event.start);
      const isSameDate = isSameDay(eventDate, date);
      const eventHour = eventDate.getHours();
      
      // For all-day events, show them in the all-day section
      if (event.isAllDay) return false;
      
      // Check if the event falls in this hour slot
      const eventStartsInThisHour = eventHour === hour;
      
      // Apply filters
      const typeMatches = calendarFilters.eventTypes.includes(event.type);
      const caseMatches = calendarFilters.cases === 'all' || event.relatedCase === calendarFilters.cases;
      
      return isSameDate && eventStartsInThisHour && typeMatches && caseMatches;
    });
  };
  
  // Get all-day events for a specific date
  const getAllDayEventsForDate = (date) => {
    return events.filter(event => {
      const eventDate = new Date(event.start);
      const isSameDate = isSameDay(eventDate, date);
      
      // Apply filters
      const typeMatches = calendarFilters.eventTypes.includes(event.type);
      const caseMatches = calendarFilters.cases === 'all' || event.relatedCase === calendarFilters.cases;
      
      return isSameDate && event.isAllDay && typeMatches && caseMatches;
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
    if (viewMode === 'month') {
      return format(currentDate, 'MMMM yyyy');
    } else if (viewMode === 'week') {
      const startOfWeekDay = startOfWeek(currentDate, { weekStartsOn: 0 });
      const endOfWeekDay = endOfWeek(currentDate, { weekStartsOn: 0 });
      const isSameMonthInWeek = isSameMonth(startOfWeekDay, endOfWeekDay);
      
      if (isSameMonthInWeek) {
        return `${format(startOfWeekDay, 'MMMM d')} - ${format(endOfWeekDay, 'd, yyyy')}`;
      } else {
        return `${format(startOfWeekDay, 'MMMM d')} - ${format(endOfWeekDay, 'MMMM d, yyyy')}`;
      }
    } else if (viewMode === 'day') {
      return format(currentDate, 'EEEE, MMMM d, yyyy');
    } else {
      return format(currentDate, 'MMMM yyyy');
    }
  };

  // Update your handleEventClick function with this improved version
  const handleEventClick = (event, e) => {
    // If event is not properly defined, return early
    if (!event || typeof event !== 'object') {
      console.error('Invalid event object:', event);
      return;
    }
    
    try {
      // Close any open tooltips
      setShowTooltipId(null);
      
      // Create a clean copy of the event with properly formatted dates
      const eventCopy = {
        ...event,
        // Ensure dates are proper Date objects by creating new instances
        start: new Date(event.start),
        end: new Date(event.end)
      };
      
      // Set the selected event with our clean copy
      setSelectedEvent(eventCopy);
      
      // Open the modal
      setIsEventDetailsOpen(true);
    } catch (error) {
      console.error('Error processing event click:', error);
      // Show error toast instead of crashing
      showToast('There was an error opening event details', 'error');
    }
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
  
  // Get border color for event type (for calendar display)
  const getEventBorderColor = (type) => {
    switch (type) {
      case 'meeting':
        return 'border-blue-400';
      case 'hearing':
        return 'border-purple-400';
      case 'deadline':
        return 'border-red-400';
      case 'reminder':
        return 'border-yellow-400';
      default:
        return 'border-gray-400';
    }
  };

  // Get background color for event type (for calendar display)
  const getEventBgColor = (type, isImportant) => {
    const baseColors = {
      meeting: 'bg-blue-50 hover:bg-blue-100',
      hearing: 'bg-purple-50 hover:bg-purple-100',
      deadline: 'bg-red-50 hover:bg-red-100',
      reminder: 'bg-yellow-50 hover:bg-yellow-100'
    };
    
    const importantColors = {
      meeting: 'bg-blue-100 hover:bg-blue-200',
      hearing: 'bg-purple-100 hover:bg-purple-200',
      deadline: 'bg-red-100 hover:bg-red-200',
      reminder: 'bg-yellow-100 hover:bg-yellow-200'
    };
    
    return isImportant ? importantColors[type] || 'bg-gray-100' : baseColors[type] || 'bg-gray-50';
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
    return format(date, 'h:mm a');
  };

  // Handle add new event
  const handleAddEvent = () => {
    // Format today's date for form defaults
    const today = new Date();
    const formattedDate = format(today, 'yyyy-MM-dd');
    
    // Reset form and set default date to today
    setNewEvent({
      ...newEvent,
      startDate: formattedDate,
      endDate: formattedDate,
      startTime: '09:00',
      endTime: '10:00'
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
    const start = new Date(`${newEvent.startDate}T${newEvent.startTime}`);
    
    // Set end time 1 hour after start time if not specified
    let end = new Date(start);
    end.setHours(end.getHours() + 1);
    
    // Generate a unique ID
    const eventId = Date.now();
    
    // Create new event object
    const eventToAdd = {
      id: eventId,
      title: newEvent.title,
      start,
      end,
      type: newEvent.type,
      location: newEvent.isVirtual ? 'Virtual Meeting' : 'Law Office - Main Conference Room',
      description: newEvent.description,
      attendees: [
        { id: 123, name: user?.firstName ? `${user.firstName} ${user.lastName}` : 'John Doe', role: 'client' },
        { id: 456, name: newEvent.preferredAttorney || 'To be assigned', role: 'attorney' }
      ],
      relatedCase: newEvent.relatedCase,
      caseId: cases.find(c => c.title === newEvent.relatedCase)?.id || null,
      isAllDay: false,
      isVirtual: newEvent.isVirtual,
      isImportant: newEvent.urgency === 'urgent',
      status: 'pending',
      requestDetails: {
        urgency: newEvent.urgency,
        alternateDate: newEvent.alternateDate,
        preferredAttorney: newEvent.preferredAttorney,
        requestedOn: new Date()
      }
    };
    
    // Add to events array
    setEvents([...events, eventToAdd]);
    
    // Close modal
    setIsAddEventOpen(false);
    
    // Show success notification
    showToast(
      "Appointment request submitted successfully",
      "success",
      5000
    );
    
    // Show a confirmation/next steps dialog
    setConfirmationData({
      show: true,
      eventId: eventId,
      title: newEvent.title,
      date: format(start, 'EEEE, MMMM d, yyyy'),
      time: format(start, 'h:mm a')
    });
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
  
  // Set timeframe filter
  const handleTimeframeFilterChange = (timeframe) => {
    setCalendarFilters(prev => ({
      ...prev,
      timeframe
    }));
  };
  
  // Get status badge style
  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'tentative':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Get upcoming deadlines and important events
  const getUpcomingReminders = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const nextTwoWeeks = new Date(today);
    nextTwoWeeks.setDate(today.getDate() + 14);
    
    return events.filter(event => {
      const eventDate = new Date(event.start);
      eventDate.setHours(0, 0, 0, 0);
      
      // Show events in the next two weeks
      const isUpcoming = eventDate >= today && eventDate <= nextTwoWeeks;
      
      // Show only important deadlines and hearings
      const isImportantEvent = 
        (event.type === 'deadline' || event.type === 'hearing') && 
        (event.isImportant || event.status !== 'completed');
      
      return isUpcoming && isImportantEvent;
    }).sort((a, b) => new Date(a.start) - new Date(b.start));
  };
  
  // Format date relative to today
  const formatRelativeDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    const dayAfterTomorrow = new Date(today);
    dayAfterTomorrow.setDate(today.getDate() + 2);
    
    if (isSameDay(date, today)) {
      return 'Today';
    } else if (isSameDay(date, tomorrow)) {
      return 'Tomorrow';
    } else if (date >= today && date <= dayAfterTomorrow) {
      return format(date, 'EEEE'); // Day name (e.g., "Monday")
    } else {
      return format(date, 'MMM d'); // Month + day (e.g., "Jun 15")
    }
  };
  
  // Handle reminder click
  const handleReminderClick = (reminder) => {
    setSelectedReminder(reminder);
    setIsReminderModalOpen(true);
  };

  // Add this function to your component above the return statement
  // This formats and filters events for the list view
  const getListViewEvents = () => {
    // Filter events based on current filters
    const filteredEvents = events.filter(event => {
      const typeMatches = calendarFilters.eventTypes.includes(event.type);
      const caseMatches = calendarFilters.cases === 'all' || event.relatedCase === calendarFilters.cases;
      
      // Apply timeframe filter
      let timeframeMatches = true;
      if (calendarFilters.timeframe === 'upcoming') {
        timeframeMatches = new Date(event.start) >= new Date(new Date().setHours(0, 0, 0, 0));
      } else if (calendarFilters.timeframe === 'past') {
        timeframeMatches = new Date(event.start) < new Date(new Date().setHours(0, 0, 0, 0));
      }
      
      return typeMatches && caseMatches && timeframeMatches;
    });
    
    // Sort events by date
    filteredEvents.sort((a, b) => new Date(a.start) - new Date(b.start));
    
    // Group events by date
    const groupedEvents = {};
    
    filteredEvents.forEach(event => {
      const dateKey = format(new Date(event.start), 'yyyy-MM-dd');
      if (!groupedEvents[dateKey]) {
        groupedEvents[dateKey] = [];
      }
      groupedEvents[dateKey].push(event);
    });
    
    return groupedEvents;
  };

  // Add this state for favoriting events
  const [favoritedEvents, setFavoritedEvents] = useState([]);

  // Add this function for toggling event favorites
  const toggleEventFavorite = (eventId, e) => {
    // Stop event propagation to prevent opening the event details when clicking the star
    if (e) e.stopPropagation();
    
    // Update events array to toggle the favorite status
    setEvents(prevEvents => 
      prevEvents.map(event => 
        event.id === eventId 
          ? { ...event, isFavorite: !event.isFavorite } 
          : event
      )
    );
    
    // Find the event to get its title
    const event = events.find(e => e.id === eventId);
    
    // Show feedback toast
    showToast(
      event?.isFavorite 
        ? `Removed "${event.title}" from favorites` 
        : `Added "${event.title}" to favorites`,
      'success'
    );
  };

  // Add toast helper function
  const showToast = (text, type = 'info', duration = 3000) => {
    setToastMessage({ text, type });
    
    // Automatically clear toast after duration
    setTimeout(() => {
      setToastMessage(null);
    }, duration);
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
              Request Appointment
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar with reminders and filters */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow rounded-lg mb-6">
              <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                <h2 className="text-lg font-medium text-gray-900">Upcoming Deadlines</h2>
              </div>
              <div className="p-4">
                {getUpcomingReminders().length > 0 ? (
                  <ul className="space-y-3">
                    {getUpcomingReminders().map(reminder => (
                      <li 
                        key={reminder.id} 
                        className="relative rounded-md border border-gray-200 p-3 hover:shadow-md cursor-pointer transition-shadow"
                        onClick={() => handleReminderClick(reminder)}
                      >
                        <div className="flex items-start">
                          <div className={`p-2 rounded-md mr-3 ${getEventTypeColor(reminder.type)}`}>
                            {getEventTypeIcon(reminder.type)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {reminder.title}
                            </p>
                            <div className="mt-1">
                              <div className="flex items-center text-xs text-gray-500">
                                <HiOutlineCalendar className="mr-1 h-3 w-3" />
                                <span className="mr-1 font-medium">{formatRelativeDate(reminder.start)}</span>
                                {!reminder.isAllDay && (
                                  <span>at {formatEventTime(reminder.start)}</span>
                                )}
                              </div>
                              <div className="mt-1 flex items-center text-xs text-gray-500">
                                <HiOutlineOfficeBuilding className="mr-1 h-3 w-3" />
                                <span className="truncate">{reminder.relatedCase}</span>
                              </div>
                            </div>
                          </div>
                          {reminder.isImportant && (
                            <span className="absolute top-3 right-3 text-red-500">
                              <HiOutlineExclamation className="h-4 w-4" />
                            </span>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-6">
                    <HiOutlineBell className="mx-auto h-10 w-10 text-gray-300" />
                    <p className="mt-2 text-sm text-gray-500">No upcoming deadlines</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Add this after the Upcoming Deadlines section in the sidebar */}
            <div className="bg-white shadow rounded-lg mb-6">
              <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                <h2 className="text-lg font-medium text-gray-900 flex items-center">
                  <HiStar className="mr-2 h-5 w-5 text-yellow-500" />
                  Favorite Events
                </h2>
              </div>
              <div className="p-4">
                {events.filter(event => event.isFavorite).length > 0 ? (
                  <ul className="space-y-3">
                    {events
                      .filter(event => event.isFavorite)
                      .sort((a, b) => new Date(a.start) - new Date(b.start))
                      .slice(0, 3) // Show only 3 most recent favorites
                      .map(event => (
                        <li 
                          key={event.id} 
                          className="relative rounded-md border border-gray-200 p-3 hover:shadow-md cursor-pointer transition-shadow"
                          onClick={() => handleEventClick(event)}
                        >
                          <div className="flex items-start">
                            <div className={`p-2 rounded-md mr-3 ${getEventTypeColor(event.type)}`}>
                              {getEventTypeIcon(event.type)}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {event.title}
                              </p>
                              <div className="mt-1">
                                <div className="flex items-center text-xs text-gray-500">
                                  <HiOutlineCalendar className="mr-1 h-3 w-3" />
                                  <span className="mr-1 font-medium">{formatRelativeDate(event.start)}</span>
                                  {!event.isAllDay && (
                                    <span>at {formatEventTime(event.start)}</span>
                                  )}
                                </div>
                                {event.relatedCase && (
                                  <div className="mt-1 flex items-center text-xs text-gray-500">
                                    <HiOutlineOfficeBuilding className="mr-1 h-3 w-3" />
                                    <span className="truncate">{event.relatedCase}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            <button
                              onClick={(e) => toggleEventFavorite(event.id, e)}
                              className="absolute top-2 right-2 text-yellow-500 hover:text-yellow-600"
                              aria-label="Remove from favorites"
                              title="Remove from favorites"
                            >
                              <HiStar className="h-4 w-4" />
                            </button>
                          </div>
                        </li>
                      ))}
                  </ul>
                ) : (
                  <div className="text-center py-6">
                    <HiOutlineStar className="mx-auto h-10 w-10 text-gray-300" />
                    <p className="mt-2 text-sm text-gray-500">No favorite events yet</p>
                    <p className="text-xs text-gray-400">Star an event to add it here</p>
                  </div>
                )}
                
                {events.filter(event => event.isFavorite).length > 3 && (
                  <div className="mt-3 text-center">
                    <button 
                      onClick={() => {
                        setCalendarFilters(prev => ({...prev}));
                        setViewMode('list');
                      }}
                      className="text-sm text-[#800000] hover:text-[#600000] hover:underline"
                    >
                      View all favorites
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            {/* Pending Requests section - add after Favorite Events */}
            <div className="bg-white shadow rounded-lg mb-6">
              <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                <h2 className="text-lg font-medium text-gray-900 flex items-center">
                  <HiOutlineClock className="mr-2 h-5 w-5 text-blue-500" />
                  Pending Requests
                </h2>
              </div>
              <div className="p-4">
                {events.filter(event => event.status === 'pending').length > 0 ? (
                  <ul className="space-y-3">
                    {events
                      .filter(event => event.status === 'pending')
                      .sort((a, b) => b.requestDetails?.requestedOn - a.requestDetails?.requestedOn)
                      .slice(0, 2)
                      .map(event => (
                        <li 
                          key={event.id} 
                          className="relative rounded-md border border-gray-200 p-3 hover:shadow-md cursor-pointer transition-shadow"
                          onClick={() => handleEventClick(event)}
                        >
                          <div className="flex items-start">
                            <div className={`p-2 rounded-md mr-3 ${getEventTypeColor(event.type)}`}>
                              {getEventTypeIcon(event.type)}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {event.title}
                              </p>
                              <div className="mt-1">
                                <div className="flex items-center text-xs text-gray-500">
                                  <HiOutlineCalendar className="mr-1 h-3 w-3" />
                                  <span className="mr-1 font-medium">{formatRelativeDate(event.start)}</span>
                                  <span>at {formatEventTime(event.start)}</span>
                                </div>
                                <div className="mt-1 flex items-center text-xs">
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                    Awaiting confirmation
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                  </ul>
                ) : (
                  <div className="text-center py-6">
                    <HiOutlineClock className="mx-auto h-10 w-10 text-gray-300" />
                    <p className="mt-2 text-sm text-gray-500">No pending requests</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                <h2 className="text-lg font-medium text-gray-900">Filters</h2>
              </div>
              <div className="p-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Types
                  </label>
                  <div className="space-y-2">
                    {[{
                      id: 'meeting',
                      label: 'Meetings',
                      color: 'bg-blue-100 text-blue-800'
                    },
                    {
                      id: 'hearing',
                      label: 'Hearings',
                      color: 'bg-purple-100 text-purple-800'
                    },
                    {
                      id: 'deadline',
                      label: 'Deadlines',
                      color: 'bg-red-100 text-red-800'
                    },
                    {
                      id: 'reminder',
                      label: 'Reminders',
                      color: 'bg-yellow-100 text-yellow-800'
                    }
                  ].map(type => (
                      <div key={type.id} className="flex items-center">
                        <input
                          id={`filter-${type.id}`}
                          name={`filter-${type.id}`}
                          type="checkbox"
                          className="h-4 w-4 text-[#800000] focus:ring-[#800000] border-gray-300 rounded"
                          checked={calendarFilters.eventTypes.includes(type.id)}
                          onChange={() => toggleEventTypeFilter(type.id)}
                        />
                        <label htmlFor={`filter-${type.id}`} className="ml-2 flex items-center">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${type.color}`}>
                            {getEventTypeIcon(type.id)}
                            <span className="ml-1">{type.label}</span>
                          </span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="case-filter" className="block text-sm font-medium text-gray-700 mb-2">
                    Case
                  </label>
                  <select
                    id="case-filter"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm rounded-md"
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
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Timeframe
                  </label>
                  <div className="space-y-2">
                    {[{
                      id: 'all',
                      label: 'All Events'
                    },
                    {
                      id: 'upcoming',
                      label: 'Upcoming Events'
                    },
                    {
                      id: 'past',
                      label: 'Past Events'
                    }
                  ].map(timeframe => (
                      <div key={timeframe.id} className="flex items-center">
                        <input
                          id={`timeframe-${timeframe.id}`}
                          name="timeframe"
                          type="radio"
                          className="h-4 w-4 text-[#800000] focus:ring-[#800000] border-gray-300"
                          checked={calendarFilters.timeframe === timeframe.id}
                          onChange={() => handleTimeframeFilterChange(timeframe.id)}
                        />
                        <label htmlFor={`timeframe-${timeframe.id}`} className="ml-2 block text-sm text-gray-700">
                          {timeframe.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Main calendar area */}
          <div className="lg:col-span-3">
            <div className="bg-white shadow rounded-lg">
              {/* Calendar header with navigation */}
              <div className="px-4 py-5 border-b border-gray-200 sm:px-6 flex flex-col sm:flex-row sm:justify-between">
                <div className="flex items-center mb-4 sm:mb-0">
                  <button
                    onClick={navigatePrevious}
                    className="p-1 rounded-full text-gray-500 hover:bg-gray-100"
                    aria-label="Previous"
                  >
                    <HiOutlineChevronLeft className="h-6 w-6" />
                  </button>
                  <h2 className="text-lg font-medium text-gray-900 mx-4">
                    {formatDateHeader()}
                  </h2>
                  <button
                    onClick={navigateNext}
                    className="p-1 rounded-full text-gray-500 hover:bg-gray-100"
                    aria-label="Next"
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
                          className={`min-h-[120px] p-2 border border-gray-100 ${
                            !day.isCurrentMonth ? 'bg-gray-50' : 
                            day.isToday ? 'bg-blue-50 ring-2 ring-blue-200' : 
                            day.isPast ? 'bg-white' : 'bg-white'
                          } relative group`}
                        >
                          <div className={`text-right text-sm font-medium ${
                            !day.isCurrentMonth ? 'text-gray-400' :
                            day.isToday ? 'text-blue-600' : 'text-gray-700'
                          }`}>
                            {day.date.getDate()}
                          </div>
                          <div className="mt-1 space-y-1 max-h-[96px] overflow-y-auto">
                            {dayEvents.map(event => (
                              <div
                                key={event.id}
                                className="relative"
                                onMouseEnter={(e) => {
                                  e.stopPropagation();
                                  setShowTooltipId(event.id);
                                  // Store the mouse position in state for positioning the tooltip
                                  setTooltipPosition({ x: e.clientX, y: e.clientY });
                                }}
                                onMouseLeave={(e) => {
                                  e.stopPropagation();
                                  setShowTooltipId(null);
                                }}
                              >
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEventClick(event, e);
                                  }}
                                  className={`w-full text-left px-2 py-1 rounded text-xs font-medium truncate border-l-2 
                                    ${getEventBorderColor(event.type)} ${getEventBgColor(event.type, event.isImportant)}
                                    transition-colors duration-150 ease-in-out`}
                                >
                                  <div className="flex items-center">
                                    {getEventTypeIcon(event.type)}
                                    <span className="ml-1 truncate">
                                      {event.isAllDay ? '' : `${formatEventTime(event.start)} `}
                                      {event.title}
                                    </span>
                                    {event.isImportant && (
                                      <HiOutlineExclamation className="ml-1 h-3 w-3 text-red-500 flex-shrink-0" />
                                    )}
                                  </div>
                                </button>
                                
                                {/* Event tooltip - positioned fixed relative to viewport */}
                                {showTooltipId === event.id && (
                                  <div 
                                    className="fixed z-50 w-64 px-3 py-2 bg-white rounded-md shadow-lg border border-gray-200 animate-fade-in event-tooltip"
                                    style={{
                                      // Use stored tooltip position instead of window.event
                                      left: `${Math.min(window.innerWidth - 280, Math.max(20, tooltipPosition?.x || 0))}px`,
                                      top: `${Math.min(window.innerHeight - 200, Math.max(20, tooltipPosition?.y || 0))}px`,
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <div className="flex justify-between items-start">
                                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getEventTypeColor(event.type)}`}>
                                        {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                                      </span>
                                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeStyle(event.status)}`}>
                                        {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                                      </span>
                                    </div>
                                    <p className="mt-1 text-sm font-medium text-gray-900">{event.title}</p>
                                    <div className="mt-1 text-xs text-gray-500">
                                      <div className="flex items-center">
                                        <HiOutlineCalendar className="mr-1 h-3 w-3" />
                                        {format(event.start, 'MMM d, yyyy')}
                                        {!event.isAllDay && (
                                          <span className="ml-1">
                                            {formatEventTime(event.start)} - {formatEventTime(event.end)}
                                          </span>
                                        )}
                                      </div>
                                      {event.location && (
                                        <div className="flex items-center mt-1">
                                          <HiOutlineLocationMarker className="mr-1 h-3 w-3" />
                                          {event.location}
                                        </div>
                                      )}
                                      {event.relatedCase && (
                                        <div className="flex items-center mt-1">
                                          <HiOutlineOfficeBuilding className="mr-1 h-3 w-3" />
                                          {event.relatedCase}
                                        </div>
                                      )}
                                    </div>
                                    <div className="mt-2 flex justify-end">
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleEventClick(event);
                                        }}
                                        className="text-xs text-[#800000] hover:underline"
                                      >
                                        View details
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                          
                          {/* Add event button that appears on hover */}
                          <div className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={handleAddEvent}
                              className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500"
                              title="Add event"
                            >
                              <HiOutlinePlus className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Week view calendar */}
              {viewMode === 'week' && (
                <div className="overflow-hidden">
                  {/* Days of week header */}
                  <div className="grid grid-cols-7 border-b border-gray-200">
                    {generateWeekDays().map((day, index) => (
                      <div 
                        key={index} 
                        className={`text-center py-2 px-1 ${
                          day.isToday ? 'bg-blue-50' : ''
                        }`}
                      >
                        <div className="text-sm font-medium text-gray-900">
                          {format(day.date, 'EEE')}
                        </div>
                        <div className={`text-2xl font-semibold ${
                          day.isToday ? 'text-blue-600' : 'text-gray-700'
                        }`}>
                          {format(day.date, 'd')}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* All-day events row */}
                  <div className="grid grid-cols-7 border-b border-gray-200">
                    {generateWeekDays().map((day, index) => {
                      const allDayEvents = getAllDayEventsForDate(day.date);
                      return (
                        <div key={index} className="p-1 min-h-[60px] border-r border-gray-100">
                          {allDayEvents.length > 0 ? (
                            <div className="space-y-1">
                              {allDayEvents.map(event => (
                                <button
                                  key={event.id}
                                  onClick={() => handleEventClick(event)}
                                  className={`w-full text-left px-2 py-1 rounded text-xs font-medium truncate border-l-2 
                                    ${getEventBorderColor(event.type)} ${getEventBgColor(event.type, event.isImportant)}`}
                                >
                                  <div className="flex items-center">
                                    {getEventTypeIcon(event.type)}
                                    <span className="ml-1 truncate">{event.title}</span>
                                  </div>
                                </button>
                              ))}
                            </div>
                          ) : (
                            <div className="h-full flex items-center justify-center">
                              {day.isToday && (
                                <button
                                  onClick={handleAddEvent}
                                  className="text-xs text-gray-400 hover:text-gray-600"
                                >
                                  <HiOutlinePlus className="h-4 w-4" />
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Time slots - simplified for this example */}
                  <div className="overflow-y-auto max-h-[600px]">
                    {Array.from({ length: 12 }, (_, i) => i + 8).map(hour => (
                      <div key={hour} className="grid grid-cols-7 border-b border-gray-100 min-h-[80px]">
                        {/* Time label */}
                        <div className="col-span-7 border-b border-gray-100 sticky top-0 bg-white z-10 text-xs text-gray-500 pl-2 py-1">
                          {hour === 12 ? '12:00 PM' : hour > 12 ? `${hour - 12}:00 PM` : `${hour}:00 AM`}
                        </div>
                        
                        {/* Events for each day at this hour */}
                        {generateWeekDays().map((day, dayIndex) => {
                          const hourEvents = getEventsForHour(day.date, hour);
                          return (
                            <div 
                              key={dayIndex} 
                              className={`p-1 border-r border-gray-100 ${
                                day.isToday ? 'bg-blue-50' : ''
                              }`}
                            >
                              {hourEvents.map(event => (
                                <button
                                  key={event.id}
                                  onClick={() => handleEventClick(event)}
                                  className={`w-full text-left px-2 py-1 rounded text-xs font-medium truncate border-l-2 
                                    ${getEventBorderColor(event.type)} ${getEventBgColor(event.type, event.isImportant)}`}
                                >
                                  <div className="flex items-center">
                                    {getEventTypeIcon(event.type)}
                                    <span className="ml-1 truncate">
                                      {formatEventTime(event.start)} - {event.title}
                                    </span>
                                  </div>
                                </button>
                              ))}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Day view calendar */}
              {viewMode === 'day' && (
                <div className="p-4">
                  {/* All-day events */}
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">All-day Events</h3>
                    <div className="bg-gray-50 rounded-md p-2 min-h-[60px]">
                      {getAllDayEventsForDate(currentDate).length > 0 ? (
                        <div className="space-y-1">
                          {getAllDayEventsForDate(currentDate).map(event => (
                            <button
                              key={event.id}
                              onClick={() => handleEventClick(event)}
                              className={`w-full text-left px-3 py-2 rounded text-sm font-medium border-l-2 
                                ${getEventBorderColor(event.type)} ${getEventBgColor(event.type, event.isImportant)}`}
                            >
                              <div className="flex items-center">
                                {getEventTypeIcon(event.type)}
                                <span className="ml-2">{event.title}</span>
                                {event.isImportant && (
                                  <HiOutlineExclamation className="ml-2 h-4 w-4 text-red-500" />
                                )}
                              </div>
                              {event.relatedCase && (
                                <div className="mt-1 text-xs text-gray-500 flex items-center">
                                  <HiOutlineOfficeBuilding className="mr-1 h-3 w-3" />
                                  {event.relatedCase}
                                </div>
                              )}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="h-full flex items-center justify-center">
                          <p className="text-sm text-gray-400">No all-day events</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Hourly schedule */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-gray-700">Schedule</h3>
                    <div className="space-y-1">
                      {Array.from({ length: 14 }, (_, i) => i + 8).map(hour => {
                        const hourEvents = getEventsForHour(currentDate, hour);
                        const isPastHour = new Date().getHours() > hour && isSameDay(currentDate, new Date());
                        
                        return (
                          <div key={hour} className="group">
                            {/* Hour label */}
                            <div className={`text-sm ${isPastHour ? 'text-gray-400' : 'text-gray-700'} mb-1 flex justify-between`}>
                              <span>
                                {hour === 12 ? '12:00 PM' : hour > 12 ? `${hour - 12}:00 PM` : `${hour}:00 AM`}
                              </span>
                              <button
                                onClick={handleAddEvent}
                                className="text-gray-300 group-hover:text-gray-500 p-1"
                                title="Add event at this time"
                              >
                                <HiOutlinePlus className="h-4 w-4" />
                              </button>
                            </div>
                            
                            {/* Events at this hour */}
                            <div className={`border-l-2 ${isPastHour ? 'border-gray-200' : 'border-gray-300'} pl-3 pb-4`}>
                              {hourEvents.length > 0 ? (
                                <div className="space-y-2">
                                  {hourEvents.map(event => (
                                    <button
                                      key={event.id}
                                      onClick={() => handleEventClick(event)}
                                      className={`w-full text-left px-3 py-2 rounded text-sm font-medium border-l-2 
                                        ${getEventBorderColor(event.type)} ${getEventBgColor(event.type, event.isImportant)}`}
                                    >
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                          {getEventTypeIcon(event.type)}
                                          <span className="ml-2">{event.title}</span>
                                          {event.isImportant && (
                                            <HiOutlineExclamation className="ml-2 h-4 w-4 text-red-500" />
                                          )}
                                        </div>
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeStyle(event.status)}`}>
                                          {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                                        </span>
                                      </div>
                                      <div className="mt-1 text-xs text-gray-500 flex flex-wrap gap-x-4">
                                        <div className="flex items-center">
                                          <HiOutlineClock className="mr-1 h-3 w-3" />
                                          {formatEventTime(event.start)} - {formatEventTime(event.end)}
                                        </div>
                                        {event.location && (
                                          <div className="flex items-center">
                                            <HiOutlineLocationMarker className="mr-1 h-3 w-3" />
                                            {event.location}
                                          </div>
                                        )}
                                        {event.relatedCase && (
                                          <div className="flex items-center">
                                            <HiOutlineOfficeBuilding className="mr-1 h-3 w-3" />
                                            {event.relatedCase}
                                          </div>
                                        )}
                                      </div>
                                    </button>
                                  ))}
                                </div>
                              ) : (
                                <div className="h-full flex items-center justify-center">
                                  <p className="text-sm text-gray-400">No events</p>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* List view calendar */}
              {viewMode === 'list' && (
                <div className="p-4 relative">
                  <div className="space-y-8">
                    {Object.keys(getListViewEvents()).length > 0 ? (
                      Object.entries(getListViewEvents()).map(([dateKey, dayEvents]) => (
                        <div key={dateKey} className="space-y-2">
                          <h3 className="text-sm font-medium text-gray-500 sticky top-0 bg-white py-2 z-20 border-b border-gray-100">
                            {format(parseISO(dateKey), 'EEEE, MMMM d, yyyy')}
                            {isSameDay(parseISO(dateKey), new Date()) && (
                              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                Today
                              </span>
                            )}
                          </h3>
                          
                          <div className="space-y-3 pl-4">
                            {dayEvents.map(event => (
                              <div 
                                key={event.id}
                                className="relative bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                              >
                                <div className={`w-1 absolute top-0 bottom-0 left-0 ${
                                  event.type === 'meeting' ? 'bg-blue-500' :
                                  event.type === 'hearing' ? 'bg-purple-500' :
                                  event.type === 'deadline' ? 'bg-red-500' :
                                  'bg-yellow-500'
                                }`}></div>
                                
                                <div className="p-4 pl-5">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                      <div className={`p-2 rounded-md mr-3 ${getEventTypeColor(event.type)}`}>
                                        {getEventTypeIcon(event.type)}
                                      </div>
                                      <div>
                                        <h4 className="text-sm font-medium text-gray-900 group flex items-center">
                                          <span 
                                            className="cursor-pointer hover:text-[#800000]"
                                            onClick={(e) => handleEventClick(event, e)}
                                          >
                                            {event.title}
                                          </span>
                                          {event.isImportant && (
                                            <HiOutlineExclamation className="ml-1 h-4 w-4 text-red-500" />
                                          )}
                                        </h4>
                                        <div className="mt-1 flex flex-wrap items-center gap-x-3 text-xs text-gray-500">
                                          <div className="flex items-center">
                                            <HiOutlineClock className="mr-1 h-3 w-3" />
                                            {event.isAllDay ? (
                                              <span>All day</span>
                                            ) : (
                                              <span>{formatEventTime(event.start)} - {formatEventTime(event.end)}</span>
                                            )}
                                          </div>
                                          {event.location && (
                                            <div className="flex items-center">
                                              <HiOutlineLocationMarker className="mr-1 h-3 w-3" />
                                              <span className="truncate max-w-[150px]">{event.location}</span>
                                            </div>
                                          )}
                                          {event.isVirtual && (
                                            <div className="flex items-center">
                                              <HiOutlineVideoCamera className="mr-1 h-3 w-3" />
                                              <span>Virtual Meeting</span>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                    
                                    <div className="flex items-center space-x-2">
                                      <button
                                        onClick={(e) => toggleEventFavorite(event.id, e)}
                                        className={`transition-colors p-1 rounded-full ${
                                          event.isFavorite 
                                            ? 'text-yellow-500 hover:text-yellow-600' 
                                            : 'text-gray-400 hover:text-yellow-500'
                                        }`}
                                        aria-label={event.isFavorite ? "Remove from favorites" : "Add to favorites"}
                                        title={event.isFavorite ? "Remove from favorites" : "Add to favorites"}
                                      >
                                        {event.isFavorite ? (
                                          <HiStar className="h-5 w-5" />
                                        ) : (
                                          <HiOutlineStar className="h-5 w-5" />
                                        )}
                                      </button>
                                      
                                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeStyle(event.status)}`}>
                                        {event.status}
                                      </span>
                                    </div>
                                  </div>
                                  
                                  {event.relatedCase && (
                                    <div className="mt-3 flex items-center text-xs text-gray-500">
                                      <HiOutlineOfficeBuilding className="mr-1 h-3 w-3" />
                                      <span>Related Case: {event.relatedCase}</span>
                                    </div>
                                  )}
                                  
                                  {event.description && (
                                    <div className="mt-2 text-sm text-gray-600 line-clamp-2">
                                      {event.description}
                                    </div>
                                  )}
                                  
                                  <div className="mt-3 flex justify-between items-center">
                                    <div className="flex -space-x-1">
                                      {event.attendees && event.attendees.length > 0 && event.attendees.slice(0, 3).map((attendee) => (
                                        <div key={attendee.id} className="h-6 w-6 rounded-full bg-gray-200 border border-white flex items-center justify-center text-xs font-medium overflow-hidden" title={attendee.name}>
                                          {attendee.avatar ? (
                                            <img src={attendee.avatar} alt={attendee.name} className="h-full w-full object-cover" />
                                          ) : (
                                            attendee.name.charAt(0)
                                          )}
                                        </div>
                                      ))}
                                      {event.attendees && event.attendees.length > 3 && (
                                     
                                      <button
                                        onClick={() => handleEventClick(event)}
                                        className="inline-flex items-center px-2 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                                      >
                                        View Details
                                      </button>
                                      )}
                                      </div>

                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12">
                        <HiOutlineCalendar className="mx-auto h-12 w-12 text-gray-300" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No events found</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Try adjusting your filters or create a new event.
                        </p>
                        <div className="mt-6">
                          <button
                            type="button"
                            onClick={handleAddEvent}
                            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#800000] hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                          >
                            <HiOutlinePlus className="-ml-1 mr-2 h-5 w-5" />
                            Request Appointment
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
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

                {/* This element is to trick the browser into centering the modal contents */}
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
                            <div className={`p-2 rounded-md mr-3 ${getEventTypeColor(selectedEvent.type || 'meeting')}`}>
                              {getEventTypeIcon(selectedEvent.type || 'meeting')}
                            </div>
                            <span>{selectedEvent.title || 'Event Details'}</span>
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
                                  {format(selectedEvent.start, 'MMMM d, yyyy')}
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
                            className={`inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md ${
                              selectedEvent?.isFavorite 
                                ? 'text-yellow-700 bg-yellow-50 hover:bg-yellow-100' 
                                : 'text-gray-700 bg-white hover:bg-gray-50'
                            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]`}
                            onClick={(e) => toggleEventFavorite(selectedEvent?.id, e)}
                          >
                            {selectedEvent?.isFavorite ? (
                              <>
                                <HiStar className="-ml-1 mr-2 h-5 w-5 text-yellow-500" />
                                Favorited
                              </>
                            ) : (
                              <>
                                <HiOutlineStar className="-ml-1 mr-2 h-5 w-5" />
                                Add to Favorites
                              </>
                            )}
                          </button>
                          
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
                      <span>Request an Appointment</span>
                      <button
                        onClick={() => setIsAddEventOpen(false)}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <HiOutlineX className="h-6 w-6" />
                      </button>
                    </Dialog.Title>

                    <div className="mt-2 mb-4 px-1 py-2 bg-blue-50 border-l-4 border-blue-400 text-sm text-blue-700">
                      <p>
                        <HiOutlineInformationCircle className="inline-block mr-1 h-4 w-4" />
                        Your request will be reviewed by our team. We'll confirm the appointment via email once scheduled.
                      </p>
                    </div>

                    <form onSubmit={handleSubmitEvent} className="mt-4">
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                            Appointment Purpose *
                          </label>
                          <input
                            type="text"
                            name="title"
                            id="title"
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm"
                            value={newEvent.title}
                            onChange={handleInputChange}
                            placeholder="Brief description of what you'd like to discuss"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                            Appointment Type
                          </label>
                          <select
                            id="type"
                            name="type"
                            className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm"
                            value={newEvent.type}
                            onChange={handleInputChange}
                          >
                            <option value="meeting">Consultation</option>
                            <option value="hearing">Pre-Hearing Meeting</option>
                            <option value="meeting">Document Review</option>
                            <option value="meeting">Status Update</option>
                          </select>
                        </div>
                        
                        <div>
                          <label htmlFor="urgency" className="block text-sm font-medium text-gray-700">
                            Urgency Level
                          </label>
                          <select
                            id="urgency"
                            name="urgency"
                            className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm"
                            value={newEvent.urgency}
                            onChange={handleInputChange}
                          >
                            <option value="urgent">Urgent (within 24-48 hours)</option>
                            <option value="normal">Normal (within the week)</option>
                            <option value="flexible">Flexible (whenever convenient)</option>
                          </select>
                        </div>
                        
                        {/* Date preferences section */}
                        <div className="border-t border-gray-200 pt-4 mt-4">
                          <h4 className="text-sm font-medium text-gray-900 mb-3">Date & Time Preferences</h4>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                                Preferred Date
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
                            
                            <div>
                              <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
                                Preferred Time
                              </label>
                              <input
                                type="time"
                                name="startTime"
                                id="startTime"
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm"
                                value={newEvent.startTime}
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>
                          
                          <div className="mt-3">
                            <label htmlFor="alternateDate" className="block text-sm font-medium text-gray-700">
                              Alternate Date/Time (optional)
                            </label>
                            <input
                              type="text"
                              name="alternateDate"
                              id="alternateDate"
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm"
                              placeholder="E.g., 'Any afternoon next week' or 'Tuesday/Thursday mornings'"
                              value={newEvent.alternateDate || ''}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                        
                        {/* Meeting details section */}
                        <div className="border-t border-gray-200 pt-4 mt-4">
                          <h4 className="text-sm font-medium text-gray-900 mb-3">Meeting Details</h4>
                          
                          <div className="flex items-center mb-3">
                            <input
                              id="isVirtual"
                              name="isVirtual"
                              type="checkbox"
                              className="h-4 w-4 text-[#800000] focus:ring-[#800000] border-gray-300 rounded"
                              checked={newEvent.isVirtual}
                              onChange={handleInputChange}
                            />
                            <label htmlFor="isVirtual" className="ml-2 block text-sm text-gray-700">
                              I prefer a virtual meeting
                            </label>
                          </div>
                          
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
                              <option value="">Select a case</option>
                              {cases.map(caseItem => (
                                <option key={caseItem.id} value={caseItem.title}>
                                  {caseItem.title}
                                </option>
                              ))}
                            </select>
                          </div>
                          
                          <div className="mt-3">
                            <label htmlFor="preferredAttorney" className="block text-sm font-medium text-gray-700">
                              Preferred Attorney (if any)
                            </label>
                            <select
                              id="preferredAttorney"
                              name="preferredAttorney"
                              className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm"
                              value={newEvent.preferredAttorney || ''}
                              onChange={handleInputChange}
                            >
                              <option value="">No preference</option>
                              <option value="Sarah Nguyen">Sarah Nguyen</option>
                              <option value="Michael Patel">Michael Patel</option>
                              <option value="Jessica Taylor">Jessica Taylor</option>
                              <option value="Robert Johnson">Robert Johnson</option>
                            </select>
                          </div>
                        </div>
                        
                        <div>
                          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                            Additional Details
                          </label>
                          <textarea
                            id="description"
                            name="description"
                            rows={3}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm"
                            placeholder="Please share any additional information that would help us prepare for this appointment"
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
                          Submit Request
                        </button>
                      </div>
                    </form>
                  </div>
                </Transition.Child>
              </div>
            </Dialog>
          </Transition>

          {/* Confirmation Dialog */}
          <Transition appear show={confirmationData.show} as={Fragment}>
            <Dialog
              as="div"
              className="fixed inset-0 z-10 overflow-y-auto"
              onClose={() => setConfirmationData({...confirmationData, show: false})}
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
                    <div className="text-center mb-5">
                      <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                        <HiOutlineCheck className="h-6 w-6 text-green-600" />
                      </div>
                      <h3 className="mt-3 text-lg font-medium text-gray-900">Request Submitted!</h3>
                      <p className="mt-2 text-sm text-gray-500">
                        Your appointment request has been received by our team.
                      </p>
                    </div>

                    <div className="mt-4 bg-gray-50 p-4 rounded-md">
                      <h4 className="text-sm font-medium text-gray-900">Request Details</h4>
                      <div className="mt-2 space-y-2 text-sm text-gray-700">
                        <p><span className="font-medium">Purpose:</span> {confirmationData.title}</p>
                        <p><span className="font-medium">Requested for:</span> {confirmationData.date} at {confirmationData.time}</p>
                        <p><span className="font-medium">Status:</span> <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Pending confirmation</span></p>
                      </div>
                    </div>

                    <div className="mt-5 border-t border-gray-200 pt-4">
                      <h4 className="text-sm font-medium text-gray-900">What happens next?</h4>
                      <ul className="mt-2 space-y-2 text-sm text-gray-500">
                        <li className="flex items-start">
                          <span className="flex-shrink-0 h-5 w-5 text-green-500 flex items-center justify-center mr-1.5">
                            <HiOutlineCheck className="h-4 w-4" />
                          </span>
                          <span>Our team will review your request</span>
                        </li>
                        <li className="flex items-start">
                          <span className="flex-shrink-0 h-5 w-5 text-green-500 flex items-center justify-center mr-1.5">
                            <HiOutlineCheck className="h-4 w-4" />
                          </span>
                          <span>You'll receive a confirmation email when approved</span>
                        </li>
                        <li className="flex items-start">
                          <span className="flex-shrink-0 h-5 w-5 text-green-500 flex items-center justify-center mr-1.5">
                            <HiOutlineCheck className="h-4 w-4" />
                          </span>
                          <span>The appointment will appear in your calendar once confirmed</span>
                        </li>
                      </ul>
                    </div>

                    <div className="mt-6 flex justify-end">
                      <button
                        type="button"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#800000] hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                        onClick={() => setConfirmationData({...confirmationData, show: false})}
                      >
                        Got it
                      </button>
                    </div>
                  </div>
                </Transition.Child>
              </div>
            </Dialog>
          </Transition>
        </div>
      </div>

      {/* Toast notification */}
      {toastMessage && (
        <div className={`fixed bottom-4 right-4 z-50 max-w-md bg-white rounded-lg shadow-lg border-l-4 ${
          toastMessage.type === 'success' ? 'border-green-500' : 
          toastMessage.type === 'error' ? 'border-red-500' : 
          toastMessage.type === 'info' ? 'border-blue-500' : 'border-yellow-500'
        } p-4 flex items-center animate-slide-up`}>
          <div className={`flex-shrink-0 ${
            toastMessage.type === 'success' ? 'text-green-500' : 
            toastMessage.type === 'error' ? 'text-red-500' : 
            toastMessage.type === 'info' ? 'text-blue-500' : 'text-yellow-500'
          }`}>
            {toastMessage.type === 'success' ? <HiOutlineCheck className="h-5 w-5" /> : 
             toastMessage.type === 'error' ? <HiOutlineX className="h-5 w-5" /> :
             toastMessage.type === 'info' ? <HiOutlineInformationCircle className="h-5 w-5" /> :
             <HiOutlineExclamation className="h-5 w-5" />}
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">{toastMessage.text}</p>
          </div>
          <button
            className="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-500 rounded-lg p-1.5"
            onClick={() => setToastMessage(null)}
          >
            <span className="sr-only">Dismiss</span>
            <HiOutlineX className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* CSS for animations */}
      <style>
        {`
          @keyframes slide-up {
            from {
              transform: translateY(1rem);
              opacity: 0;
            }
            to {
              transform: translateY(0);
              opacity: 1;
            }
          }
          .animate-slide-up {
            animation: slide-up 0.3s ease-out forwards;
          }
          
          @keyframes fade-in {
            from {
              opacity: 0;
              transform: translateY(-5px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fade-in {
            animation: fade-in 0.2s ease-out forwards;
          }
          
          /* For text truncation in list view */
          .line-clamp-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          .sticky {
            position: sticky;
            z-index: 20;
          }
        `}
      </style>
    </div>
  );
};

export default function CalendarPageWrapper() {
  return (
    <ErrorBoundary>
      <ClientCalendarPage />
    </ErrorBoundary>
  );
}