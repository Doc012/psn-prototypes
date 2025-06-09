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
  HiChevronLeft,
  HiChevronRight,
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
  HiOutlineUserCircle,
  HiOutlineSearch,
  HiOutlineShare,
  HiOutlineClipboardCheck,
  HiOutlineRefresh,
  HiOutlineChatAlt2,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlinePaperClip
} from 'react-icons/hi';
import { format, addDays, subDays, startOfWeek, endOfWeek, addMonths, subMonths, isSameDay, isSameMonth, parseISO } from 'date-fns';

const AttorneyCalendarPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEventDetailsOpen, setIsEventDetailsOpen] = useState(false);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('week'); // 'month', 'week', 'day', 'list'
  const [newEvent, setNewEvent] = useState({
    title: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    location: '',
    description: '',
    attendees: [],
    clientId: '',
    type: 'meeting', // 'meeting', 'hearing', 'deadline', 'reminder', 'internal'
    relatedCase: '',
    isAllDay: false,
    isVirtual: false,
    meetingLink: '',
    isImportant: false,
    notifyBefore: '30',
    billable: false,
    billableHours: 1,
    rateType: 'standard'
  });
  const [cases, setCases] = useState([]);
  const [clients, setClients] = useState([]);
  const [calendarFilters, setCalendarFilters] = useState({
    eventTypes: ['meeting', 'hearing', 'deadline', 'reminder', 'internal'],
    cases: 'all',
    clients: 'all',
    timeframe: 'upcoming'
  });
  const [showTooltipId, setShowTooltipId] = useState(null);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [selectedReminder, setSelectedReminder] = useState(null);
  const [isEventMenuOpen, setIsEventMenuOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [workSchedule, setWorkSchedule] = useState([
    { day: 'Monday', start: '09:00', end: '17:00', isWorkDay: true },
    { day: 'Tuesday', start: '09:00', end: '17:00', isWorkDay: true },
    { day: 'Wednesday', start: '09:00', end: '17:00', isWorkDay: true },
    { day: 'Thursday', start: '09:00', end: '17:00', isWorkDay: true },
    { day: 'Friday', start: '09:00', end: '17:00', isWorkDay: true },
    { day: 'Saturday', start: '09:00', end: '13:00', isWorkDay: false },
    { day: 'Sunday', start: '09:00', end: '17:00', isWorkDay: false }
  ]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [showTeamEvents, setShowTeamEvents] = useState(false);
  const [selectedTeamMembers, setSelectedTeamMembers] = useState([]);
  const [showToast, setShowToast] = useState({ show: false, message: '', type: 'success' });
  const [tooltipPinned, setTooltipPinned] = useState(false); // New state for tooltip pinning

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
          { id: 1, title: 'Smith v. Johnson', type: 'Personal Injury', number: `PI-${currentYear}-1452`, clientId: 101 },
          { id: 2, title: 'Estate of Williams', type: 'Probate', number: `PR-${currentYear}-0783`, clientId: 102 },
          { id: 3, title: 'Brown LLC Contract', type: 'Corporate', number: `CL-${currentYear}-0251`, clientId: 104 },
          { id: 4, title: 'Jones Divorce', type: 'Family Law', number: `FL-${currentYear}-0592`, clientId: 103 }
        ];

        // Mock clients data
        const mockClients = [
          { id: 101, name: 'Sarah Smith', email: 'sarah.smith@example.com', phone: '555-123-4567', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
          { id: 102, name: 'Robert Williams Jr.', email: 'robert.williams@example.com', phone: '555-234-5678', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
          { id: 103, name: 'Amanda Jones', email: 'amanda.jones@example.com', phone: '555-345-6789', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
          { id: 104, name: 'Thomas Brown', email: 'thomas.brown@brownllc.com', phone: '555-456-7890', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' }
        ];

        // Mock team members data
        const mockTeamMembers = [
          { id: 201, name: 'Sarah Nguyen', role: 'Attorney', email: 'sarah.nguyen@firm.com', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
          { id: 202, name: 'Michael Patel', role: 'Attorney', email: 'michael.patel@firm.com', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
          { id: 203, name: 'Jessica Taylor', role: 'Paralegal', email: 'jessica.taylor@firm.com', avatar: 'https://randomuser.me/api/portraits/women/68.jpg' },
          { id: 204, name: 'David Rodriguez', role: 'Legal Assistant', email: 'david.rodriguez@firm.com', avatar: 'https://randomuser.me/api/portraits/men/68.jpg' }
        ];

        // Calculate dates based on current date
        const nextWeek = addDays(today, 7);
        const twoWeeksFromNow = addDays(today, 14);
        const nextMonth = addMonths(today, 1);
        const yesterday = subDays(today, 1);
        const lastWeek = subDays(today, 5);
        const inTwoDays = addDays(today, 2);
        const inThreeDays = addDays(today, 3);

        // Mock events data
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
              { id: 201, name: 'Sarah Nguyen', role: 'attorney', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
              { id: 101, name: 'Sarah Smith', role: 'client', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' }
            ],
            relatedCase: 'Smith v. Johnson',
            clientId: 101,
            caseId: 1,
            isAllDay: false,
            isVirtual: false,
            isImportant: true,
            status: 'confirmed',
            documents: [
              { id: 101, name: 'Settlement_Proposal.pdf', size: '420 KB' }
            ],
            billable: true,
            billableHours: 1.5,
            rateType: 'standard',
            createdBy: 201
          },
          {
            id: 2,
            title: 'Document Submission Deadline',
            start: new Date(nextWeek),
            end: new Date(nextWeek),
            type: 'deadline',
            description: 'Final deadline to submit all discovery documents to opposing counsel.',
            relatedCase: 'Smith v. Johnson',
            clientId: 101,
            caseId: 1,
            isAllDay: true,
            isImportant: true,
            status: 'pending',
            documents: [
              { id: 102, name: 'Document_Checklist.pdf', size: '215 KB' }
            ],
            billable: false,
            createdBy: 201
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
              { id: 201, name: 'Sarah Nguyen', role: 'attorney', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
              { id: 101, name: 'Sarah Smith', role: 'client', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
              { id: 789, name: 'Judge Roberts', role: 'judge' }
            ],
            relatedCase: 'Smith v. Johnson',
            clientId: 101,
            caseId: 1,
            isAllDay: false,
            isVirtual: false,
            isImportant: true,
            status: 'confirmed',
            documents: [
              { id: 103, name: 'Motion_to_Dismiss.pdf', size: '1.2 MB' },
              { id: 104, name: 'Supporting_Evidence.pdf', size: '3.5 MB' }
            ],
            billable: true,
            billableHours: 3,
            rateType: 'standard',
            createdBy: 201
          },
          {
            id: 4,
            title: 'Contract Review Call',
            start: new Date(inTwoDays.getFullYear(), inTwoDays.getMonth(), inTwoDays.getDate(), 14, 0),
            end: new Date(inTwoDays.getFullYear(), inTwoDays.getMonth(), inTwoDays.getDate(), 15, 0),
            type: 'meeting',
            description: 'Review updated contract terms and discuss next steps.',
            attendees: [
              { id: 202, name: 'Michael Patel', role: 'attorney', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
              { id: 104, name: 'Thomas Brown', role: 'client', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' }
            ],
            relatedCase: 'Brown LLC Contract',
            clientId: 104,
            caseId: 3,
            isAllDay: false,
            isVirtual: true,
            meetingLink: 'https://zoom.us/j/123456789',
            isImportant: false,
            status: 'confirmed',
            documents: [
              { id: 105, name: 'Contract_Draft_v2.docx', size: '850 KB' }
            ],
            billable: true,
            billableHours: 1,
            rateType: 'standard',
            createdBy: 202
          },
          {
            id: 5,
            title: 'Client Invoice Reminders',
            start: new Date(nextMonth.getFullYear(), nextMonth.getMonth(), 5),
            end: new Date(nextMonth.getFullYear(), nextMonth.getMonth(), 5),
            type: 'reminder',
            description: 'Send monthly invoice reminders to all clients with outstanding balances.',
            isAllDay: true,
            isImportant: true,
            status: 'pending',
            documents: [],
            billable: false,
            createdBy: 201
          },
          {
            id: 6,
            title: 'Estate Planning Call',
            start: new Date(inThreeDays.getFullYear(), inThreeDays.getMonth(), inThreeDays.getDate(), 11, 0),
            end: new Date(inThreeDays.getFullYear(), inThreeDays.getMonth(), inThreeDays.getDate(), 12, 0),
            type: 'meeting',
            description: 'Follow-up call to discuss estate planning documents and answer any questions.',
            attendees: [
              { id: 201, name: 'Sarah Nguyen', role: 'attorney', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
              { id: 102, name: 'Robert Williams Jr.', role: 'client', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' }
            ],
            relatedCase: 'Estate of Williams',
            clientId: 102,
            caseId: 2,
            isAllDay: false,
            isVirtual: false,
            meetingMethod: 'phone',
            isImportant: false,
            status: 'confirmed',
            documents: [
              { id: 107, name: 'Estate_Plan_Draft.pdf', size: '1.5 MB' }
            ],
            billable: true,
            billableHours: 1,
            rateType: 'standard',
            createdBy: 201
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
              { id: 202, name: 'Michael Patel', role: 'attorney', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
              { id: 103, name: 'Amanda Jones', role: 'client', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' }
            ],
            relatedCase: 'Jones Divorce',
            clientId: 103,
            caseId: 4,
            isAllDay: false,
            isVirtual: false,
            isImportant: true,
            status: 'tentative',
            documents: [],
            billable: true,
            billableHours: 1.5,
            rateType: 'standard',
            createdBy: 202
          },
          {
            id: 8,
            title: 'Deposition - Smith v. Johnson',
            start: new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 9, 0),
            end: new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 13, 0),
            type: 'hearing',
            location: 'Law Office - Deposition Room',
            description: 'Deposition of plaintiff.',
            attendees: [
              { id: 201, name: 'Sarah Nguyen', role: 'attorney', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
              { id: 101, name: 'Sarah Smith', role: 'client', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' }
            ],
            relatedCase: 'Smith v. Johnson',
            clientId: 101,
            caseId: 1,
            isAllDay: false,
            isVirtual: false,
            isImportant: true,
            status: 'completed',
            documents: [
              { id: 108, name: 'Deposition_Questions.pdf', size: '520 KB' }
            ],
            billable: true,
            billableHours: 4,
            rateType: 'standard',
            createdBy: 201
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
              { id: 202, name: 'Michael Patel', role: 'attorney', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
              { id: 103, name: 'Amanda Jones', role: 'client', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
              { id: 460, name: 'Mediator Williams', role: 'mediator' }
            ],
            relatedCase: 'Jones Divorce',
            clientId: 103,
            caseId: 4,
            isAllDay: false,
            isVirtual: false,
            isImportant: false,
            status: 'completed',
            documents: [
              { id: 109, name: 'Custody_Proposal.pdf', size: '750 KB' }
            ],
            billable: true,
            billableHours: 1.5,
            rateType: 'standard',
            createdBy: 202
          },
          {
            id: 10,
            title: 'Team Meeting',
            start: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 0),
            end: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 10, 0),
            type: 'internal',
            location: 'Conference Room A',
            description: 'Weekly team meeting to discuss ongoing cases and priorities.',
            attendees: [
              { id: 201, name: 'Sarah Nguyen', role: 'attorney', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
              { id: 202, name: 'Michael Patel', role: 'attorney', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
              { id: 203, name: 'Jessica Taylor', role: 'paralegal', avatar: 'https://randomuser.me/api/portraits/women/68.jpg' },
              { id: 204, name: 'David Rodriguez', role: 'legal assistant', avatar: 'https://randomuser.me/api/portraits/men/68.jpg' }
            ],
            isAllDay: false,
            isVirtual: false,
            isImportant: false,
            status: 'confirmed',
            documents: [],
            billable: false,
            createdBy: 201
          },
          {
            id: 11,
            title: 'Case Strategy Planning',
            start: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 15, 0),
            end: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 16, 30),
            type: 'internal',
            location: 'Conference Room B',
            description: 'Strategy planning session for Smith v. Johnson case.',
            attendees: [
              { id: 201, name: 'Sarah Nguyen', role: 'attorney', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
              { id: 203, name: 'Jessica Taylor', role: 'paralegal', avatar: 'https://randomuser.me/api/portraits/women/68.jpg' }
            ],
            relatedCase: 'Smith v. Johnson',
            caseId: 1,
            isAllDay: false,
            isVirtual: false,
            isImportant: true,
            status: 'confirmed',
            documents: [],
            billable: true,
            billableHours: 1.5,
            rateType: 'standard',
            createdBy: 201
          },
          {
            id: 12,
            title: 'Research Time',
            start: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3, 13, 0),
            end: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3, 17, 0),
            type: 'internal',
            description: 'Dedicated time for legal research on estate tax implications.',
            relatedCase: 'Estate of Williams',
            caseId: 2,
            isAllDay: false,
            isVirtual: false,
            isImportant: false,
            status: 'confirmed',
            documents: [],
            billable: true,
            billableHours: 4,
            rateType: 'standard',
            createdBy: 201
          }
        ];

        setCases(mockCases);
        setClients(mockClients);
        setTeamMembers(mockTeamMembers);
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
        isPast: date < new Date(new Date().setHours(0, 0, 0, 0)),
        isWorkDay: isWorkDay(date)
      };
    });
  };

  // Check if a day is a work day based on work schedule
  const isWorkDay = (date) => {
    const dayOfWeek = format(date, 'EEEE');
    const scheduleDay = workSchedule.find(day => day.day === dayOfWeek);
    return scheduleDay ? scheduleDay.isWorkDay : false;
  };

  // Get events for a specific date
  const getEventsForDate = (date) => {
    return filterEvents(events.filter(event => {
      const eventDate = new Date(event.start);
      return isSameDay(eventDate, date);
    }));
  };

  // Get events for a specific date and hour (for day view)
  const getEventsForHour = (date, hour) => {
    return filterEvents(events.filter(event => {
      const eventDate = new Date(event.start);
      const isSameDate = isSameDay(eventDate, date);
      const eventHour = eventDate.getHours();
      
      // For all-day events, show them in the all-day section
      if (event.isAllDay) return false;
      
      // Check if the event falls in this hour slot
      const eventStartsInThisHour = eventHour === hour;
      
      return isSameDate && eventStartsInThisHour;
    }));
  };
  
  // Get all-day events for a specific date
  const getAllDayEventsForDate = (date) => {
    return filterEvents(events.filter(event => {
      const eventDate = new Date(event.start);
      const isSameDate = isSameDay(eventDate, date);
      
      return isSameDate && event.isAllDay;
    }));
  };

  // Filter events based on selected filters
  const filterEvents = (eventsToFilter) => {
    return eventsToFilter.filter(event => {
      // Apply type filter
      const typeMatches = calendarFilters.eventTypes.includes(event.type);
      
      // Apply case filter
      const caseMatches = calendarFilters.cases === 'all' || 
                         (event.relatedCase && event.relatedCase === calendarFilters.cases);
      
      // Apply client filter
      const clientMatches = calendarFilters.clients === 'all' || 
                           (event.clientId && event.clientId === parseInt(calendarFilters.clients));
      
      // Apply team member filter
      const teamMemberMatches = !showTeamEvents || 
                               selectedTeamMembers.length === 0 || 
                               (event.attendees && event.attendees.some(a => 
                                 selectedTeamMembers.includes(a.id.toString())));
      
      // Apply timeframe filter
      const eventDate = new Date(event.start);
      let timeframeMatches = true;
      if (calendarFilters.timeframe === 'upcoming') {
        timeframeMatches = eventDate >= new Date(new Date().setHours(0, 0, 0, 0));
      } else if (calendarFilters.timeframe === 'past') {
        timeframeMatches = eventDate < new Date(new Date().setHours(0, 0, 0, 0));
      }
      
      return typeMatches && caseMatches && clientMatches && timeframeMatches && teamMemberMatches;
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

  // Updated event handlers to show tooltips on click rather than opening modal
  const handleEventClick = (event, e) => {
    // Prevent event propagation
    if (e) e.stopPropagation();
    
    // Toggle tooltip visibility and pin it
    if (showTooltipId === event.id) {
      setShowTooltipId(null);
      setTooltipPinned(false);
    } else {
      setShowTooltipId(event.id);
      setTooltipPinned(true); // Mark the tooltip as pinned when clicked
    }
  };

  // For right-click or menu option to show full details
  const handleEventDetailsClick = (event) => {
    setSelectedEvent(event);
    setIsEventDetailsOpen(true);
    setShowTooltipId(null); // Hide any visible tooltip
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
      case 'internal':
        return 'bg-green-100 text-green-800 border-green-200';
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
      case 'internal':
        return 'border-green-400';
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
      reminder: 'bg-yellow-50 hover:bg-yellow-100',
      internal: 'bg-green-50 hover:bg-green-100'
    };
    
    const importantColors = {
      meeting: 'bg-blue-100 hover:bg-blue-200',
      hearing: 'bg-purple-100 hover:bg-purple-200',
      deadline: 'bg-red-100 hover:bg-red-200',
      reminder: 'bg-yellow-100 hover:bg-yellow-200',
      internal: 'bg-green-100 hover:bg-green-200'
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
        return <HiOutlineBell className="h-4 w-4" />;
      case 'internal':
        return <HiOutlineUserCircle className="h-4 w-4" />;
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
      title: '',
      startDate: formattedDate,
      endDate: formattedDate,
      startTime: '09:00',
      endTime: '10:00',
      location: '',
      description: '',
      attendees: [],
      clientId: '',
      type: 'meeting',
      relatedCase: '',
      isAllDay: false,
      isVirtual: false,
      meetingLink: '',
      isImportant: false,
      notifyBefore: '30',
      billable: false,
      billableHours: 1,
      rateType: 'standard'
    });
    
    setIsEditMode(false);
    setIsAddEventOpen(true);
  };

  // Handle editing an event
  const handleEditEvent = (event) => {
    // Convert event data to form format
    const startDate = format(new Date(event.start), 'yyyy-MM-dd');
    const startTime = format(new Date(event.start), 'HH:mm');
    const endDate = format(new Date(event.end), 'yyyy-MM-dd');
    const endTime = format(new Date(event.end), 'HH:mm');
    
    setNewEvent({
      id: event.id,
      title: event.title,
      startDate,
      endDate,
      startTime,
      endTime,
      location: event.location || '',
      description: event.description || '',
      attendees: event.attendees || [],
      clientId: event.clientId ? event.clientId.toString() : '',
      type: event.type,
      relatedCase: event.relatedCase || '',
      isAllDay: event.isAllDay || false,
      isVirtual: event.isVirtual || false,
      meetingLink: event.meetingLink || '',
      isImportant: event.isImportant || false,
      notifyBefore: '30',
      billable: event.billable || false,
      billableHours: event.billableHours || 1,
      rateType: event.rateType || 'standard'
    });
    
    setIsEditMode(true);
    setIsAddEventOpen(true);
    setIsEventDetailsOpen(false);
  };

  // Handle deleting an event
  const handleDeleteEvent = (eventId) => {
    setEvents(prevEvents => prevEvents.filter (event => event.id !== eventId));
    setIsDeleteConfirmOpen(false);
    setIsEventDetailsOpen(false);
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
    
    // Get client data if selected
    const selectedClient = newEvent.clientId 
      ? clients.find(c => c.id === parseInt(newEvent.clientId))
      : null;
    
    // Get case data if selected
    const selectedCase = newEvent.relatedCase
      ? cases.find(c => c.title === newEvent.relatedCase)
      : null;
    
    // Create event object
    const eventData = {
      title: newEvent.title,
      start,
      end,
      type: newEvent.type,
      location: newEvent.location,
      description: newEvent.description,
      attendees: [
        { id: 201, name: 'Sarah Nguyen', role: 'attorney', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' }
      ],
      relatedCase: newEvent.relatedCase,
      caseId: selectedCase?.id || null,
      clientId: selectedClient?.id || null,
      isAllDay: newEvent.isAllDay,
      isVirtual: newEvent.isVirtual,
      meetingLink: newEvent.meetingLink,
      isImportant: newEvent.isImportant,
      status: 'confirmed',
      documents: [],
      billable: newEvent.billable,
      billableHours: parseFloat(newEvent.billableHours),
      rateType: newEvent.rateType,
      createdBy: 201
    };
    
    // If client is selected, add to attendees
    if (selectedClient) {
      eventData.attendees.push({
        id: selectedClient.id,
        name: selectedClient.name,
        role: 'client',
        avatar: selectedClient.avatar
      });
    }
    
    if (isEditMode) {
      // Update existing event
      setEvents(prevEvents => 
        prevEvents.map(event => 
          event.id === newEvent.id ? { ...event, ...eventData } : event
        )
      );
    } else {
      // Add new event
      setEvents(prevEvents => [...prevEvents, { id: Date.now(), ...eventData }]);
    }
    
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
  
  // Set client filter
  const handleClientFilterChange = (clientId) => {
    setCalendarFilters(prev => ({
      ...prev,
      clients: clientId
    }));
  };
  
  // Set timeframe filter
  const handleTimeframeFilterChange = (timeframe) => {
    setCalendarFilters(prev => ({
      ...prev,
      timeframe
    }));
  };
  
  // Toggle team member selection
  const toggleTeamMemberSelection = (memberId) => {
    setSelectedTeamMembers(prev => {
      if (prev.includes(memberId)) {
        return prev.filter(id => id !== memberId);
      } else {
        return [...prev, memberId];
      }
    });
  };
  
  // Get status badge style
  const getStatusBadgeStyle = (status) => {
    if (!status) return 'bg-gray-100 text-gray-800';
    
    // Force lowercase for case-insensitive comparison and trim any whitespace
    const normalizedStatus = status.toString().toLowerCase().trim();
    
    switch (normalizedStatus) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'tentative':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
      case 'canceled': // Handle alternative spelling
        return 'bg-red-100 text-red-800';
      case 'completed':
      case 'done':     // Handle alternative wording
        return 'bg-purple-100 text-purple-800';
      // Additional statuses that might appear in your data
      case 'rescheduled':
        return 'bg-orange-100 text-orange-800';
      case 'in progress':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Get upcoming deadlines and important events
  const getUpcomingDeadlines = () => {
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
  
  // Get billable hours for the current week
  const getWeeklyBillableHours = () => {
    const startOfWeekDate = startOfWeek(new Date(), { weekStartsOn: 0 });
    const endOfWeekDate = endOfWeek(new Date(), { weekStartsOn: 0 });
    
    return events
      .filter(event => {
        const eventDate = new Date(event.start);
        return event.billable && 
               eventDate >= startOfWeekDate && 
               eventDate <= endOfWeekDate;
      })
      .reduce((total, event) => total + (event.billableHours || 0), 0);
  };

  // Get upcoming events for today
  const getTodayEvents = () => {
    const today = new Date();
    
    return events
      .filter(event => {
        const eventDate = new Date(event.start);
        return isSameDay(eventDate, today) && 
               (eventDate > new Date() || event.isAllDay);
      })
      .sort((a, b) => new Date(a.start) - new Date(b.start))
      .slice(0, 3); // Show top 3 events
  };

  // Add this helper function near the top of your component
  const safeFormatDate = (dateValue, formatString) => {
    if (!dateValue) return '—';
    try {
      const date = new Date(dateValue);
      // Check if date is valid
      if (isNaN(date.getTime())) return '—';
      return format(date, formatString);
    } catch (error) {
      console.error('Error formatting date:', error);
      return '—';
    }
  };

  // Show toast messages
  const displayToast = (message, type = 'success') => {
    setShowToast({ show: true, message, type });
    setTimeout(() => {
      setShowToast({ show: false, message: '', type: 'success' });
    }, 3000);
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
              onClick={() => displayToast("Event creation coming soon!", "success")}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#800000] hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
            >
              <HiOutlinePlus className="-ml-1 mr-2 h-5 w-5" />
              New Event
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar with quick stats, upcoming deadlines and filters */}
          <div className="lg:col-span-1">
            {/* Stats Cards */}
            <div className="bg-white shadow rounded-lg mb-6">
              <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                <h2 className="text-lg font-medium text-gray-900">Stats</h2>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">Weekly Billable Hours</div>
                    <div className="text-lg font-semibold text-[#800000]">{getWeeklyBillableHours()}h</div>
                  </div>
                  <div className="mt-1 w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-[#800000] h-2.5 rounded-full" 
                      style={{ width: `${Math.min(getWeeklyBillableHours() / 40 * 100, 100)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-end mt-1">
                    <span className="text-xs text-gray-500">Target: 40h</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">Today's Events</div>
                  <div className="text-lg font-semibold text-gray-900">{getEventsForDate(new Date()).length}</div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">Upcoming Deadlines</div>
                  <div className="text-lg font-semibold text-gray-900">{getUpcomingDeadlines().length}</div>
                </div>
              </div>
            </div>

            {/* Today's Schedule */}
            <div className="bg-white shadow rounded-lg mb-6">
              <div className="px-4 py-5 border-b border-gray-200 sm:px-6 flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900">Today's Schedule</h2>
                <span className="text-sm text-gray-500">{format(new Date(), 'EEEE, MMM d')}</span>
              </div>
              <div className="p-4">
                {getTodayEvents().length > 0 ? (
                  <ul className="space-y-3">
                    {getTodayEvents().map(event => (
                      <li 
                        key={event.id} 
                        className="relative rounded-md border border-gray-200 p-3 hover:shadow-md cursor-pointer transition-shadow"
                        onClick={(e) => handleEventClick(event, e)}
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
                                <HiOutlineClock className="mr-1 h-3 w-3" />
                                <span className="mr-1">
                                  {event.isAllDay ? 'All day' : formatEventTime(event.start)}
                                </span>
                              </div>
                              {event.location && (
                                <div className="mt-1 flex items-center text-xs text-gray-500">
                                  <HiOutlineLocationMarker className="mr-1 h-3 w-3" />
                                  <span className="truncate">{event.location}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-6">
                    <HiOutlineCalendar className="mx-auto h-10 w-10 text-gray-300" />
                    <p className="mt-2 text-sm text-gray-500">No events scheduled for today</p>
                  </div>
                )}
                <div className="mt-4">
                  <Link to="/client-portal/attorney/calendar" className="text-[#800000] text-sm font-medium hover:underline flex items-center">
                    View full day
                    <HiChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Deadlines */}
            <div className="bg-white shadow rounded-lg mb-6">
              <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                <h2 className="text-lg font-medium text-gray-900">Upcoming Deadlines</h2>
              </div>
              <div className="p-4">
                {getUpcomingDeadlines().length > 0 ? (
                  <ul className="space-y-3">
                    {getUpcomingDeadlines().map(reminder => (
                      <li 
                        key={reminder.id} 
                        className="relative rounded-md border border-gray-200 p-3 hover:shadow-md cursor-pointer transition-shadow"
                        onClick={(e) => handleEventClick(reminder, e)}
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
                              {reminder.relatedCase && (
                                <div className="mt-1 flex items-center text-xs text-gray-500">
                                  <HiOutlineOfficeBuilding className="mr-1 h-3 w-3" />
                                  <span className="truncate">{reminder.relatedCase}</span>
                                </div>
                              )}
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
            
            {/* Filters */}
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
                    },
                    {
                      id: 'internal',
                      label: 'Internal',
                      color: 'bg-green-100 text-green-800'
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
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 rounded-md focus:outline-none focus:ring-[#800000] focus:border-[#800000]"
                    value={calendarFilters.cases}
                    onChange={e => handleCaseFilterChange(e.target.value)}
                  >
                    <option value="all">All Cases</option>
                    {cases.map(caseItem => (
                      <option key={caseItem.id} value={caseItem.title}>
                        {caseItem.title} - {caseItem.number}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="client-filter" className="block text-sm font-medium text-gray-700 mb-2">
                    Client
                  </label>
                  <select
                    id="client-filter"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 rounded-md focus:outline-none focus:ring-[#800000] focus:border-[#800000]"
                    value={calendarFilters.clients}
                    onChange={e => handleClientFilterChange(e.target.value)}
                  >
                    <option value="all">All Clients</option>
                    {clients.map(client => (
                      <option key={client.id} value={client.id}>
                        {client.name} - {client.email}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="timeframe-filter" className="block text-sm font-medium text-gray-700 mb-2">
                    Timeframe
                  </label>
                  <select
                    id="timeframe-filter"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 rounded-md focus:outline-none focus:ring-[#800000] focus:border-[#800000]"
                    value={calendarFilters.timeframe}
                    onChange={e => handleTimeframeFilterChange(e.target.value)}
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="past">Past</option>
                  </select>
                </div>
                
                {/* Team Members Filter - Only show if there are team members available */}
                {teamMembers.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Team Members
                      </label>
                      <button
                        onClick={() => setShowTeamEvents(!showTeamEvents)}
                        className="text-xs font-medium text-[#800000] hover:underline"
                      >
                        {showTeamEvents ? 'Hide' : 'Show'} Team Events
                      </button>
                    </div>
                    <div className="space-y-2">
                      {teamMembers.map(member => (
                        <div key={member.id} className="flex items-center">
                          <input
                            id={`team-member-${member.id}`}
                            name={`team-member-${member.id}`}
                            type="checkbox"
                            className="h-4 w-4 text-[#800000] focus:ring-[#800000] border-gray-300 rounded"
                            checked={selectedTeamMembers.includes(member.id.toString())}
                            onChange={() => toggleTeamMemberSelection(member.id)}
                          />
                          <label htmlFor={`team-member-${member.id}`} className="ml-2 text-sm text-gray-700">
                            {member.name} ({member.role})
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main calendar view */}
          <div className="lg:col-span-3">
            {/* Calendar header - month/week/day navigation */}
            <div className="bg-white shadow rounded-lg mb-6">
              <div className="px-4 py-5 border-b border-gray-200 sm:px-6 flex justify-between items-center">
                <div className="flex space-x-2">
                  <button
                    onClick={() => setViewMode('month')}
                    className={`px-3 py-1 text-sm font-medium rounded-md focus:outline-none transition-all ${
                      viewMode === 'month'
                        ? 'bg-[#800000] text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Month
                  </button>
                  <button
                    onClick={() => setViewMode('week')}
                    className={`px-3 py-1 text-sm font-medium rounded-md focus:outline-none transition-all ${
                      viewMode === 'week'
                        ? 'bg-[#800000] text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Week
                  </button>
                  <button
                    onClick={() => setViewMode('day')}
                    className={`px-3 py-1 text-sm font-medium rounded-md focus:outline-none transition-all ${
                      viewMode === 'day'
                        ? 'bg-[#800000] text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Day
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`px-3 py-1 text-sm font-medium rounded-md focus:outline-none transition-all ${
                      viewMode === 'list'
                        ? 'bg-[#800000] text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    List
                  </button>
                </div>
                <div className="flex items-center">
                  <button
                    onClick={navigateToday}
                    className="text-sm font-medium text-[#800000] hover:underline"
                  >
                    Today
                  </button>
                  <button
                    onClick={navigatePrevious}
                    className="ml-3 p-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 focus:outline-none"
                    title="Previous"
                  >
                    <HiOutlineChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={navigateNext}
                    className="ml-2 p-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 focus:outline-none"
                    title="Next"
                  >
                    <HiOutlineChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Calendar body - render based on view mode */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              {viewMode === 'month' && (
                <div>
                  {/* Days of week header */}
                  <div className="grid grid-cols-7 gap-px border-b border-gray-200 bg-gray-50">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => (
                      <div key={i} className="py-2 text-center text-sm font-medium text-gray-500">
                        {day}
                      </div>
                    ))}
                  </div>
                  
                  {/* Calendar grid */}
                  <div className="grid grid-cols-7 gap-px bg-gray-200">
                    {generateMonthDays().map((day, index) => (
                      <div
                        key={index}
                        className={`min-h-[100px] bg-white p-2 transition-colors ${
                          day.isToday ? 'bg-blue-50' : ''
                        } ${!day.isCurrentMonth ? 'bg-gray-50 text-gray-400' : ''}`}
                      >
                        <div className="flex justify-between items-center">
                          <span className={`text-sm font-medium ${
                            day.isToday ? 'h-6 w-6 rounded-full bg-[#800000] text-white flex items-center justify-center' : 
                            day.isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                          }`}>
                            {format(day.date, 'd')}
                          </span>
                          {day.isCurrentMonth && (
                            <span className="text-xs text-gray-400">{format(day.date, 'E')}</span>
                          )}
                        </div>
                        <div className="mt-1 space-y-1 max-h-[80px] overflow-y-auto">
                          {getEventsForDate(day.date).slice(0, 3).map(event => (
                            <div
                              key={event.id}
                              onClick={(e) => handleEventClick(event, e)}
                              onMouseEnter={() => setShowTooltipId(event.id)}
                              onMouseLeave={() => {
                                // Only hide the tooltip on mouse leave if it's not pinned
                                if (!tooltipPinned) {
                                  setShowTooltipId(null);
                                }
                              }}
                              onContextMenu={(e) => {
                                e.preventDefault();
                                handleEventDetailsClick(event);
                              }}
                              className={`text-xs rounded-md px-2 py-1 cursor-pointer border-l-2 relative ${getEventBorderColor(event.type)} ${getEventBgColor(event.type, event.isImportant)}`}
                            >
                              <div className="flex items-center">
                                {getEventTypeIcon(event.type)}
                                <span className="ml-1 truncate">{event.title}</span>
                              </div>
                              
                              {/* Enhanced tooltip on hover or click - positioned fixed for better visibility */}
                              {showTooltipId === event.id && (
                                <div className="fixed z-50 w-72 p-4 bg-white rounded-lg shadow-xl border border-gray-200 text-left"
                                     style={{ 
                                       top: `${window.scrollY + 100}px`, 
                                       left: `50%`, 
                                       transform: 'translateX(-50%)'
                                     }}>
                                  <div className="flex justify-between items-start">
                                    <h4 className="font-medium text-gray-900 text-base">{event.title}</h4>
                                    <div className="flex items-center space-x-2">
                                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeStyle(event.status)}`}>
                                        {event.status}
                                      </span>
                                      <button 
                                        onClick={(e) => {
                                          e.stopPropagation(); 
                                          setShowTooltipId(null);
                                          setTooltipPinned(false); // Make sure to unpin when explicitly closed
                                        }}
                                        className="text-gray-400 hover:text-gray-600 focus:outline-none"
                                      >
                                        <HiOutlineX className="h-4 w-4" />
                                      </button>
                                    </div>
                                  </div>
                                  <div className="mt-2 space-y-2">
                                    <div className="flex items-center text-gray-600">
                                      <HiOutlineClock className="h-4 w-4 mr-2" />
                                      <span>
                                        {safeFormatDate(event.start, 'EEEE, MMMM d, yyyy')}
                                        {event.isAllDay ? ' (All day)' : `: ${formatEventTime(event.start)} - ${formatEventTime(event.end)}`}
                                      </span>
                                    </div>
                                    {event.location && (
                                      <div className="flex items-center text-gray-600">
                                        <HiOutlineLocationMarker className="h-4 w-4 mr-2" />
                                        <span>{event.location}</span>
                                      </div>
                                    )}
                                    {event.relatedCase && (
                                      <div className="flex items-center text-gray-600">
                                        <HiOutlineOfficeBuilding className="h-4 w-4 mr-2" />
                                        <span>{event.relatedCase}</span>
                                      </div>
                                    )}
                                    {event.description && (
                                      <div className="text-gray-600 text-sm">
                                        <p>{event.description}</p>
                                      </div>
                                    )}
                                    {event.attendees?.length > 0 && (
                                      <div className="pt-2">
                                        <div className="text-xs text-gray-500 mb-1">Attendees:</div>
                                        <div className="flex flex-wrap gap-2">
                                          {event.attendees.map((attendee) => (
                                            <div key={attendee.id} className="flex items-center">
                                              <img 
                                                src={attendee.avatar} 
                                                alt={attendee.name}
                                                className="h-6 w-6 rounded-full"
                                              />
                                              <span className="ml-1 text-xs text-gray-700">{attendee.name}</span>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                          {getEventsForDate(day.date).length > 3 && (
                            <div className="text-xs text-center text-[#800000] font-medium">
                              +{getEventsForDate(day.date).length - 3} more
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {viewMode === 'week' && (
                <div>
                  {/* Days of week header */}
                  <div className="grid grid-cols-7 border-b border-gray-200">
                    {generateWeekDays().map((day, index) => (
                      <div 
                        key={index} 
                        className={`py-2 text-center ${day.isToday ? 'bg-blue-50' : ''}`}
                      >
                        <div className="text-sm font-medium text-gray-900">
                          {format(day.date, 'EEEE')}
                        </div>
                        <div className={`text-2xl font-bold mt-1 ${day.isToday ? 'text-[#800000]' : 'text-gray-700'}`}>
                          {format(day.date, 'd')}
                        </div>
                        <div className="text-xs text-gray-500">
                          {format(day.date, 'MMM yyyy')}
                          </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Time slots and events */}
                  <div className="grid grid-cols-7 divide-x divide-gray-200">
                    {generateWeekDays().map((day, dayIndex) => (
                      <div key={dayIndex} className="relative ${day.isWorkDay ? '' : 'bg-gray-50'">
                        <div className="min-h-60px p-1 border-b border-gray-200">
                          {getAllDayEventsForDate(day.date).map(event => (
                            <div
                              key={event.id}
                              onClick={(e) => handleEventClick(event, e)}
                              className={`text-xs rounded-md px-2 py-1 mb-1 cursor-pointer border-l-2 ${getEventBorderColor(event.type)} ${getEventBgColor(event.type, event.isImportant)}`}
                            >
                              <div className="flex items-center">
                                {getEventTypeIcon(event.type)}
                                <span className="ml-1 truncate">{event.title}</span>
                              </div>
                              
                              {/* Enhanced tooltip on hover - positioned fixed for better visibility */}
                              {showTooltipId === event.id && (
                                <div className="fixed z-50 w-72 p-4 bg-white rounded-lg shadow-xl border border-gray-200 text-left"
                                     style={{ 
                                       top: `${window.scrollY + 100}px`, 
                                       left: `50%`, 
                                       transform: 'translateX(-50%)'
                                     }}>
                                  <div className="flex justify-between items-start">
                                    <h4 className="font-medium text-gray-900 text-base">{event.title}</h4>
                                    <div className="flex items-center space-x-2">
                                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeStyle(event.status)}`}>
                                        {event.status}
                                      </span>
                                      <button 
                                        onClick={(e) => {
                                          e.stopPropagation(); 
                                          setShowTooltipId(null);
                                          setTooltipPinned(false); // Make sure to unpin when explicitly closed
                                        }}
                                        className="text-gray-400 hover:text-gray-600 focus:outline-none"
                                      >
                                        <HiOutlineX className="h-4 w-4" />
                                      </button>
                                    </div>
                                  </div>
                                  <div className="mt-2 space-y-2">
                                    <div className="flex items-center text-gray-600">
                                      <HiOutlineClock className="h-4 w-4 mr-2" />
                                      <span>
                                        {safeFormatDate(event.start, 'EEEE, MMMM d, yyyy')}
                                        {event.isAllDay ? ' (All day)' : `: ${formatEventTime(event.start)} - ${formatEventTime(event.end)}`}
                                      </span>
                                    </div>
                                    {event.location && (
                                      <div className="flex items-center text-gray-600">
                                        <HiOutlineLocationMarker className="h-4 w-4 mr-2" />
                                        <span>{event.location}</span>
                                      </div>
                                    )}
                                    {event.relatedCase && (
                                      <div className="flex items-center text-gray-600">
                                        <HiOutlineOfficeBuilding className="h-4 w-4 mr-2" />
                                        <span>{event.relatedCase}</span>
                                      </div>
                                    )}
                                    {event.description && (
                                      <div className="text-gray-600 text-sm">
                                        <p>{event.description}</p>
                                      </div>
                                    )}
                                    {event.attendees?.length > 0 && (
                                      <div className="pt-2">
                                        <div className="text-xs text-gray-500 mb-1">Attendees:</div>
                                        <div className="flex flex-wrap gap-2">
                                          {event.attendees.map((attendee) => (
                                            <div key={attendee.id} className="flex items-center">
                                              <img 
                                                src={attendee.avatar} 
                                                alt={attendee.name}
                                                className="h-6 w-6 rounded-full"
                                              />
                                              <span className="ml-1 text-xs text-gray-700">{attendee.name}</span>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                        
                        {/* Time slots */}
                        <div className="relative">
                          {Array.from({ length: 12 }, (_, i) => i + 8).map(hour => (
                            <div key={hour} className="relative h-12 border-b border-gray-100">
                              <div className="absolute -left-8 -mt-2 w-8 text-xs text-right text-gray-400 select-none">
                                {hour % 12 === 0 ? '12' : hour % 12}:00 {hour >= 12 ? 'PM' : 'AM'}
                              </div>
                              
                              {/* Events during this hour */}
                              {getEventsForHour(day.date, hour).map(event => (
                                <div
                                  key={event.id}
                                  onClick={(e) => handleEventClick(event, e)}
                                  onMouseEnter={() => setShowTooltipId(event.id)}
                                  onMouseLeave={() => {
                                    // Only hide the tooltip on mouse leave if it's not pinned
                                    if (!tooltipPinned) {
                                      setShowTooltipId(null);
                                    }
                                  }}
                                  className={`rounded-md px-2 py-1 mb-1 cursor-pointer text-sm border-l-2 shadow-sm ${getEventBorderColor(event.type)} ${getEventBgColor(event.type, event.isImportant)}`}
                                  style={{
                                    top: '2px',
                                    height: 'calc(100% - 4px)',
                                    zIndex: event.isImportant ? 20 : 10
                                  }}
                                >
                                  <div className="flex items-center h-full">
                                    {getEventTypeIcon(event.type)}
                                    <span className="ml-1 truncate font-medium">{event.title}</span>
                                  </div>
                                  
                                  {/* Enhanced tooltip on hover - positioned fixed for better visibility */}
                                  {showTooltipId === event.id && (
                                    <div className="fixed z-50 w-72 p-4 bg-white rounded-lg shadow-xl border border-gray-200 text-left"
                                         style={{ 
                                           top: `${window.scrollY + 100}px`, 
                                           left: `50%`, 
                                           transform: 'translateX(-50%)'
                                         }}>
                                      <div className="flex justify-between items-start">
                                        <h4 className="font-medium text-gray-900 text-base">{event.title}</h4>
                                        <div className="flex items-center space-x-2">
                                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeStyle(event.status)}`}>
                                            {event.status}
                                          </span>
                                          <button 
                                            onClick={(e) => {
                                              e.stopPropagation(); 
                                              setShowTooltipId(null);
                                              setTooltipPinned(false); // Make sure to unpin when explicitly closed
                                            }}
                                            className="text-gray-400 hover:text-gray-600 focus:outline-none"
                                          >
                                            <HiOutlineX className="h-4 w-4" />
                                          </button>
                                        </div>
                                      </div>
                                      <div className="mt-2 space-y-2">
                                        <div className="flex items-center text-gray-600">
                                          <HiOutlineClock className="h-4 w-4 mr-2" />
                                          <span>
                                            {safeFormatDate(event.start, 'EEEE, MMMM d, yyyy')}
                                            {event.isAllDay ? ' (All day)' : `: ${formatEventTime(event.start)} - ${formatEventTime(event.end)}`}
                                          </span>
                                        </div>
                                        {event.location && (
                                          <div className="flex items-center text-gray-600">
                                            <HiOutlineLocationMarker className="h-4 w-4 mr-2" />
                                            <span>{event.location}</span>
                                          </div>
                                        )}
                                        {event.relatedCase && (
                                          <div className="flex items-center text-gray-600">
                                            <HiOutlineOfficeBuilding className="h-4 w-4 mr-2" />
                                            <span>{event.relatedCase}</span>
                                          </div>
                                        )}
                                        {event.description && (
                                          <div className="text-gray-600 text-sm">
                                            <p>{event.description}</p>
                                          </div>
                                        )}
                                        {event.attendees?.length > 0 && (
                                          <div className="pt-2">
                                            <div className="text-xs text-gray-500 mb-1">Attendees:</div>
                                            <div className="flex flex-wrap gap-2">
                                              {event.attendees.map((attendee) => (
                                                <div key={attendee.id} className="flex items-center">
                                                  <img 
                                                    src={attendee.avatar} 
                                                    alt={attendee.name}
                                                    className="h-6 w-6 rounded-full"
                                                  />
                                                  <span className="ml-1 text-xs text-gray-700">{attendee.name}</span>
                                                </div>
                                              ))}
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {viewMode === 'day' && (
                <div className="divide-y divide-gray-200">
                  <div className="p-4 bg-gray-50">
                    <div className="text-xl font-semibold text-gray-900 text-center">
                      {format(currentDate, 'EEEE, MMMM d, yyyy')}
                    </div>
                  </div>
                  
                  {/* All-day events */}
                  <div className="p-2 border-b border-gray-200">
                    <div className="flex items-center mb-2">
                      <div className="w-20 text-xs font-medium text-gray-500">ALL DAY</div>
                      <div className="flex-1">
                        {getAllDayEventsForDate(currentDate).map(event => (
                          <div
                            key={event.id}
                            onClick={(e) => handleEventClick(event, e)}
                            onMouseEnter={() => setShowTooltipId(event.id)}
                            onMouseLeave={() => {
                              // Only hide the tooltip on mouse leave if it's not pinned
                              if (!tooltipPinned) {
                                setShowTooltipId(null);
                              }
                            }}
                            className={`text-xs rounded-md px-2 py-1 mb-1 cursor-pointer border-l-2 ${getEventBorderColor(event.type)} ${getEventBgColor(event.type, event.isImportant)}`}
                          >
                            <div className="flex items-center">
                              {getEventTypeIcon(event.type)}
                              <span className="ml-1 truncate">{event.title}</span>
                            </div>
                            
                            {/* Enhanced tooltip on hover */}
                            {showTooltipId === event.id && (
                              <div className="fixed z-50 w-72 p-4 bg-white rounded-lg shadow-xl border border-gray-200 text-left"
                                   style={{ 
                                     top: `${window.scrollY + 100}px`, 
                                     left: `50%`, 
                                     transform: 'translateX(-50%)'
                                   }}>
                                <div className="flex justify-between items-start">
                                  <h4 className="font-medium text-gray-900 text-base">{event.title}</h4>
                                  <div className="flex items-center space-x-2">
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeStyle(event.status)}`}>
                                      {event.status}
                                    </span>
                                    <button 
                                      onClick={(e) => {
                                        e.stopPropagation(); 
                                        setShowTooltipId(null);
                                        setTooltipPinned(false); // Make sure to unpin when explicitly closed
                                      }}
                                      className="text-gray-400 hover:text-gray-600 focus:outline-none"
                                    >
                                      <HiOutlineX className="h-4 w-4" />
                                    </button>
                                  </div>
                                </div>
                                <div className="mt-2 space-y-2">
                                  <div className="flex items-center text-gray-600">
                                    <HiOutlineClock className="h-4 w-4 mr-2" />
                                    <span>All day</span>
                                  </div>
                                  {event.location && (
                                    <div className="flex items-center text-gray-600">
                                      <HiOutlineLocationMarker className="h-4 w-4 mr-2" />
                                      <span>{event.location}</span>
                                    </div>
                                  )}
                                  {event.relatedCase && (
                                    <div className="flex items-center text-gray-600">
                                      <HiOutlineOfficeBuilding className="h-4 w-4 mr-2" />
                                      <span>{event.relatedCase}</span>
                                    </div>
                                  )}
                                  {event.description && (
                                    <div className="text-gray-600 text-sm">
                                      <p>{event.description}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                        {getAllDayEventsForDate(currentDate).length === 0 && (
                          <div className="text-xs text-gray-400 italic">No all-day events</div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Hourly slots */}
                  {Array.from({ length: 14 }, (_, i) => i + 8).map(hour => (
                    <div key={hour} className="flex border-b border-gray-100">
                      <div className="w-20 py-2 px-2 text-xs font-medium text-gray-500 border-r border-gray-100">
                        {hour % 12 === 0 ? '12' : hour % 12}:00 {hour >= 12 ? 'PM' : 'AM'}
                      </div>
                      <div className="flex-1 min-h-[60px] p-1 relative">
                        {getEventsForHour(currentDate, hour).map(event => (
                          <div
                            key={event.id}
                            onClick={(e) => handleEventClick(event, e)}
                            className={`rounded-md px-2 py-1 mb-1 cursor-pointer text-sm border-l-2 shadow-sm ${getEventBorderColor(event.type)} ${getEventBgColor(event.type, event.isImportant)}`}
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex items-center">
                                {getEventTypeIcon(event.type)}
                                <span className="ml-1 font-medium">{event.title}</span>
                              </div>
                              <span className="text-xs text-gray-500">
                                {formatEventTime(event.start)} - {formatEventTime(event.end)}
                              </span>
                            </div>
                            {event.location && (
                              <div className="mt-1 flex items-center text-xs text-gray-500">
                                <HiOutlineLocationMarker className="mr-1 h-3 w-3" />
                                <span className="truncate">{event.location}</span>
                              </div>
                            )}
                            
                            {/* Enhanced tooltip on hover */}
                            {showTooltipId === event.id && (
                              <div className="fixed z-50 w-72 p-4 bg-white rounded-lg shadow-xl border border-gray-200 text-left"
                                   style={{ 
                                     top: `${window.scrollY + 100}px`, 
                                     left: `50%`, 
                                     transform: 'translateX(-50%)'
                                   }}>
                                <div className="flex justify-between items-start">
                                  <h4 className="font-medium text-gray-900 text-base">{event.title}</h4>
                                  <div className="flex items-center space-x-2">
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeStyle(event.status)}`}>
                                      {event.status}
                                    </span>
                                    <button 
                                      onClick={(e) => {
                                        e.stopPropagation(); 
                                        setShowTooltipId(null);
                                        setTooltipPinned(false); // Make sure to unpin when explicitly closed
                                      }}
                                      className="text-gray-400 hover:text-gray-600 focus:outline-none"
                                    >
                                      <HiOutlineX className="h-4 w-4" />
                                    </button>
                                  </div>
                                </div>
                                <div className="mt-2 space-y-2">
                                  <div className="flex items-center text-gray-600">
                                    <HiOutlineClock className="h-4 w-4 mr-2" />
                                    <span>
                                      {safeFormatDate(event.start, 'EEEE, MMMM d, yyyy')}
                                      {event.isAllDay ? ' (All day)' : `: ${formatEventTime(event.start)} - ${formatEventTime(event.end)}`}
                                    </span>
                                  </div>
                                  {event.location && (
                                    <div className="flex items-center text-gray-600">
                                      <HiOutlineLocationMarker className="h-4 w-4 mr-2" />
                                      <span>{event.location}</span>
                                    </div>
                                  )}
                                  {event.relatedCase && (
                                    <div className="flex items-center text-gray-600">
                                      <HiOutlineOfficeBuilding className="h-4 w-4 mr-2" />
                                      <span>{event.relatedCase}</span>
                                    </div>
                                  )}
                                  {event.description && (
                                    <div className="text-gray-600 text-sm mt-2">
                                      <p>{event.description}</p>
                                    </div>
                                  )}
                                  {event.attendees?.length > 0 && (
                                    <div className="pt-2">
                                      <div className="text-xs text-gray-500 mb-1">Attendees:</div>
                                      <div className="flex flex-wrap gap-2">
                                        {event.attendees.map((attendee) => (
                                          <div key={attendee.id} className="flex items-center">
                                            <img 
                                              src={attendee.avatar} 
                                              alt={attendee.name}
                                              className="h-6 w-6 rounded-full"
                                            />
                                            <span className="ml-1 text-xs text-gray-700">{attendee.name}</span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                        {getEventsForHour(currentDate, hour).length === 0 && (
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="text-xs text-gray-300 italic">No events</div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {viewMode === 'list' && (
                <div className="divide-y divide-gray-200">
                  <div className="p-4 bg-gray-50">
                    <div className="text-xl font-semibold text-gray-900">
                      Upcoming Events
                    </div>
                    <div className="text-sm text-gray-500">
                      {format(new Date(), 'MMMM yyyy')}
                    </div>
                  </div>
                  
                  {filterEvents(events).length > 0 ? (
                    filterEvents(events).map(event => (
                      <div
                        key={event.id}
                        onClick={() => handleEventClick(event)}
                        onMouseEnter={() => setShowTooltipId(event.id)}
                        onMouseLeave={() => {
                          // Only hide the tooltip on mouse leave if it's not pinned
                          if (!tooltipPinned) {
                            setShowTooltipId(null);
                          }
                        }}
                        className="p-4 hover:bg-gray-50 cursor-pointer transition-colors relative"
                      >
                        <div className="flex items-start">
                          <div className={`p-2 rounded-md mr-3 ${getEventTypeColor(event.type)}`}>
                            {getEventTypeIcon(event.type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div className="text-base font-medium text-gray-900">{event.title}</div>
                              <div className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeStyle(event.status)}`}>
                                {event.status}
                              </div>
                            </div>
                            
                            <div className="mt-1 flex items-center text-sm text-gray-500">
                              <HiOutlineCalendar className="mr-1 h-4 w-4" />
                              <span>
                                {safeFormatDate(event.start, 'EEE, MMM d, yyyy')}
                                {event.isAllDay ? ' (All day)' : ` • ${safeFormatDate(event.start, 'h:mm a')} - ${safeFormatDate(event.end, 'h:mm a')}`}
                              </span>
                            </div>
                            
                            {event.location && (
                              <div className="mt-1 flex items-center text-sm text-gray-500">
                                <HiOutlineLocationMarker className="mr-1 h-4 w-4" />
                                <span>{event.location}</span>
                              </div>
                            )}
                            
                            {event.relatedCase && (
                              <div className="mt-1 flex items-center text-sm text-gray-500">
                                <HiOutlineOfficeBuilding className="mr-1 h-4 w-4" />
                                <span>{event.relatedCase}</span>
                              </div>
                            )}
                            
                            {event.attendees?.length > 0 && (
                              <div className="mt-2 flex">
                                {event.attendees.slice(0, 3).map((attendee, idx) => (
                                  <img 
                                    key={attendee.id}
                                    src={attendee.avatar} 
                                    alt={attendee.name}
                                    className={`h-6 w-6 rounded-full border border-white ${idx > 0 ? '-ml-2' : ''}`}
                                    title={attendee.name}
                                  />
                                ))}
                                {event.attendees.length > 3 && (
                                  <div className="h-6 w-6 rounded-full bg-gray-200 -ml-2 flex items-center justify-center text-xs text-gray-600 font-medium">
                                    +{event.attendees.length - 3}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Enhanced tooltip on hover */}
                        {showTooltipId === event.id && (
                          <div className="fixed z-50 w-72 p-4 bg-white rounded-lg shadow-xl border border-gray-200 text-left"
                               style={{ 
                                 top: `${window.scrollY + 100}px`, 
                                 left: `50%`, 
                                 transform: 'translateX(-50%)'
                               }}>
                            <div className="flex justify-between items-start">
                              <h4 className="font-medium text-gray-900 text-base">{event.title}</h4>
                              <div className="flex items-center space-x-2">
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeStyle(event.status)}`}>
                                  {event.status}
                                </span>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation(); 
                                    setShowTooltipId(null);
                                    setTooltipPinned(false); // Make sure to unpin when explicitly closed
                                  }}
                                  className="text-gray-400 hover:text-gray-600 focus:outline-none"
                                >
                                  <HiOutlineX className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                            <div className="mt-2 space-y-2">
                              <div className="flex items-center text-gray-600">
                                <HiOutlineClock className="h-4 w-4 mr-2" />
                                <span>
                                  {safeFormatDate(event.start, 'EEEE, MMMM d, yyyy')}
                                  {event.isAllDay ? ' (All day)' : `: ${formatEventTime(event.start)} - ${formatEventTime(event.end)}`}
                                </span>
                              </div>
                              {event.location && (
                                <div className="flex items-center text-gray-600">
                                  <HiOutlineLocationMarker className="h-4 w-4 mr-2" />
                                  <span>{event.location}</span>
                                </div>
                              )}
                              {event.relatedCase && (
                                <div className="flex items-center text-gray-600">
                                  <HiOutlineOfficeBuilding className="h-4 w-4 mr-2" />
                                  <span>{event.relatedCase}</span>
                                </div>
                              )}
                              {event.description && (
                                <div className="text-gray-600 text-sm mt-2">
                                  <p>{event.description}</p>
                                </div>
                              )}
                              {event.attendees?.length > 0 && (
                                <div className="pt-2">
                                  <div className="text-xs text-gray-500 mb-1">Attendees:</div>
                                  <div className="flex flex-wrap gap-2">
                                    {event.attendees.map((attendee) => (
                                      <div key={attendee.id} className="flex items-center">
                                        <img 
                                          src={attendee.avatar} 
                                          alt={attendee.name}
                                          className="h-6 w-6 rounded-full"
                                        />
                                        <span className="ml-1 text-xs text-gray-700">{attendee.name}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center">
                      <HiOutlineCalendar className="mx-auto h-12 w-12 text-gray-300" />
                      <h3 className="mt-2 text-base font-medium text-gray-900">No events found</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Try changing your filters or create a new event.
                      </p>
                      <div className="mt-4">
                        <button
                          onClick={handleAddEvent}
                          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#800000] hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                        >
                          <HiOutlinePlus className="-ml-1 mr-2 h-5 w-5" />
                          New Event
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Toast notification */}
      {showToast.show && (
        <div className={`fixed bottom-4 right-4 px-4 py-3 rounded-md shadow-lg ${
          showToast.type === 'success' ? 'bg-green-50 text-green-800' : 
          showToast.type === 'error' ? 'bg-red-50 text-red-800' : 
          'bg-blue-50 text-blue-800'
        } transition-opacity z-50`}>
          <p className="flex items-center text-sm font-medium">
            {showToast.type === 'success' && <HiOutlineCheck className="mr-2 h-5 w-5" />}
            {showToast.type === 'error' && <HiOutlineExclamation className="mr-2 h-5 w-5" />}
            {showToast.type === 'info' && <HiOutlineInformationCircle className="mr-2 h-5 w-5" />}
            {showToast.message}
          </p>
        </div>
      )}

      {/* Event Details Modal */}
      <Transition.Root show={isEventDetailsOpen} as={Fragment}>
        <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto" onClose={() => setIsEventDetailsOpen(false)}>
          <div className="flex items-center justify-center min-h-screen">
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
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-3xl">
                <div className="px-4 py-5 sm:px-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-medium text-gray-900">{selectedEvent?.title}</h2>
                    <button
                      onClick={() => setIsEventDetailsOpen(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <HiOutlineX className="h-6 w-6" />
                    </button>
                  </div>
                </div>
                
                <div className="border-t border-gray-200">
                  <div className="px-4 py-5 sm:px-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm font-medium text-gray-500">Date & Time</span>
                        <div className="mt-1 text-sm text-gray-900">
                          {safeFormatDate(selectedEvent?.start, 'MMMM d, yyyy h:mm a')} - 
                          {selectedEvent?.end ? format(new Date(selectedEvent.end), 'h:mm a') : '—'}
                        </div>
                      </div>
                      
                      <div>
                        <span className="text-sm font-medium text-gray-500">Location</span>
                        <div className="mt-1 text-sm text-gray-900">
                          {selectedEvent?.location || 'N/A'}
                        </div>
                      </div>
                      
                      <div>
                        <span className="text-sm font-medium text-gray-500">Type</span>
                        <div className="mt-1 text-sm text-gray-900">
                          {selectedEvent?.type.charAt(0).toUpperCase() + selectedEvent?.type.slice(1)}
                        </div>
                      </div>
                      
                      <div>
                        <span className="text-sm font-medium text-gray-500">Status</span>
                        <div className="mt-1 text-sm text-gray-900">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeStyle(selectedEvent?.status)}`}>
                            {selectedEvent?.status.charAt(0).toUpperCase() + selectedEvent?.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200">
                    <div className="px-4 py-5 sm:px-6">
                      <span className="text-sm font-medium text-gray-500">Description</span>
                      <div className="mt-1 text-sm text-gray-900">
                        {selectedEvent?.description || 'No description provided.'}
                      </div>
                    </div>
                    
                    <div className="px-4 py-5 sm:px-6">
                      <span className="text-sm font-medium text-gray-500">Attendees</span>
                      <div className="mt-1">
                        {selectedEvent?.attendees.length > 0 ? (
                          <ul className="space-y-2">
                            {selectedEvent.attendees.map(attendee => (
                              <li key={attendee.id} className="flex items-center">
                                <img src={attendee.avatar} alt={attendee.name} className="h-8 w-8 rounded-full mr-2" />
                                <div className="text-sm text-gray-900">
                                  {attendee.name} ({attendee.role})
                                </div>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <div className="text-sm text-gray-500">
                            No attendees added.
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="px-4 py-5 sm:px-6">
                      <span className="text-sm font-medium text-gray-500">Documents</span>
                      <div className="mt-1">
                        {selectedEvent?.documents.length > 0 ? (
                          <ul className="space-y-2">
                            {selectedEvent.documents.map(doc => (
                              <li key={doc.id} className="flex items-center">
                                <HiOutlinePaperClip className="h-5 w-5 text-gray-400 mr-2" />
                                <div className="text-sm text-gray-900">
                                  {doc.name} ({doc.size})
                                </div>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <div className="text-sm text-gray-500">
                            No documents attached.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="px-4 py-4 sm:px-6 flex justify-end space-x-2">
                  <button
                    onClick={() => {
                      handleEditEvent(selectedEvent);
                      setIsEventDetailsOpen(false);
                    }}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#800000] hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                  >
                    <HiOutlinePencilAlt className="-ml-1 mr-2 h-5 w-5" />
                    Edit Event
                  </button>
                  <button
                    onClick={() => {
                      setIsDeleteConfirmOpen(true);
                      setIsEventDetailsOpen(false);
                    }}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600"
                  >
                    <HiOutlineTrash className="-ml-1 mr-2 h-5 w-5" />
                    Delete Event
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Add/Edit Event Modal */}
      <Transition.Root show={isAddEventOpen} as={Fragment}>
        <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto" onClose={() => setIsAddEventOpen(false)}>
          <div className="flex items-center justify-center min-h-screen">
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
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-2xl">
                <div className="px-4 py-5 sm:px-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-medium text-gray-900">
                      {isEditMode ? 'Edit Event' : 'New Event'}
                    </h2>
                    <button
                      onClick={() => setIsAddEventOpen(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <HiOutlineX className="h-6 w-6" />
                    </button>
                  </div>
                </div>
                
                <div className="border-t border-gray-200">
                  <div className="px-4 py-5 sm:px-6">
                    <form onSubmit={handleSubmitEvent}>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                            Event Title
                          </label>
                          <input
                            type="text"
                            name="title"
                            id="title"
                            required
                            value={newEvent.title}
                            onChange={handleInputChange}
                            className="mt-1 block w-full px-3 py-2 text-base border-gray-300 rounded-md focus:outline-none focus:ring-[#800000] focus:border-[#800000]"
                            placeholder="Enter event title"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                            Event Type
                          </label>
                          <select
                            id="type"
                            name="type"
                            value={newEvent.type}
                            onChange={handleInputChange}
                            className="mt-1 block w-full px-3 py-2 text-base border-gray-300 rounded-md focus:outline-none focus:ring-[#800000] focus:border-[#800000]"
                          >
                            <option value="meeting">Meeting</option>
                            <option value="hearing">Hearing</option>
                            <option value="deadline">Deadline</option>
                            <option value="reminder">Reminder</option>
                            <option value="internal">Internal</option>
                          </select>
                        </div>
                        
                        <div>
                          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                            Start Date
                          </label>
                          <input
                            type="date"
                            name="startDate"
                            id="startDate"
                            required
                            value={newEvent.startDate}
                            onChange={handleInputChange}
                            className="mt-1 block w-full px-3 py-2 text-base border-gray-300 rounded-md focus:outline-none focus:ring-[#800000] focus:border-[#800000]"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">
                            Start Time
                          </label>
                          <input
                            type="time"
                            name="startTime"
                            id="startTime"
                            required
                            value={newEvent.startTime}
                            onChange={handleInputChange}
                            className="mt-1 block w-full px-3 py-2 text-base border-gray-300 rounded-md focus:outline-none focus:ring-[#800000] focus:border-[#800000]"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                            End Date
                          </label>
                          <input
                            type="date"
                            name="endDate"
                            id="endDate"
                            required
                            value={newEvent.endDate}
                            onChange={handleInputChange}
                            className="mt-1 block w-full px-3 py-2 text-base border-gray-300 rounded-md focus:outline-none focus:ring-[#800000] focus:border-[#800000]"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">
                            End Time
                          </label>
                          <input
                            type="time"
                            name="endTime"
                            id="endTime"
                            required
                            value={newEvent.endTime}
                            onChange={handleInputChange}
                            className="mt-1 block w-full px-3 py-2 text-base border-gray-300 rounded-md focus:outline-none focus:ring-[#800000] focus:border-[#800000]"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                            Location
                          </label>
                          <input
                            type="text"
                            name="location"
                            id="location"
                            value={newEvent.location}
                            onChange={handleInputChange}
                            className="mt-1 block w-full px-3 py-2 text-base border-gray-300 rounded-md focus:outline-none focus:ring-[#800000] focus:border-[#800000]"
                            placeholder="Enter event location"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                          </label>
                          <textarea
                            name="description"
                            id="description"
                            rows="3"
                            value={newEvent.description}
                            onChange={handleInputChange}
                            className="mt-1 block w-full px-3 py-2 text-base border-gray-300 rounded-md focus:outline-none focus:ring-[#800000] focus:border-[#800000]"
                            placeholder="Enter event description"
                          ></textarea>
                        </div>
                        
                        <div className="col-span-1 sm:col-span-2">
                          <div className="flex items-center mb-2">
                            <input
                              id="isAllDay"
                              name="isAllDay"
                              type="checkbox"
                              checked={newEvent.isAllDay}
                              onChange={handleInputChange}
                              className="h-4 w-4 text-[#800000] focus:ring-[#800000] border-gray-300 rounded"
                            />
                            <label htmlFor="isAllDay" className="ml-2 block text-sm font-medium text-gray-700">
                              All Day Event
                            </label>
                          </div>
                        </div>
                        
                        <div className="col-span-1 sm:col-span-2">
                          <div className="flex items-center mb-2">
                            <input
                              id="isVirtual"
                              name="isVirtual"
                              type="checkbox"
                              checked={newEvent.isVirtual}
                              onChange={handleInputChange}
                              className="h-4 w-4 text-[#800000] focus:ring-[#800000] border-gray-300 rounded"
                            />
                            <label htmlFor="isVirtual" className="ml-2 block text-sm font-medium text-gray-700">
                              Virtual Event
                            </label>
                          </div>
                          
                          {newEvent.isVirtual && (
                            <div className="mt-2">
                              <label htmlFor="meetingLink" className="block text-sm font-medium text-gray-700 mb-1">
                                Meeting Link
                              </label>
                              <input
                                type="text"
                                name="meetingLink"
                                id="meetingLink"
                                value={newEvent.meetingLink}
                                onChange={handleInputChange}
                                className="mt-1 block w-full px-3 py-2 text-base border-gray-300 rounded-md focus:outline-none focus:ring-[#800000] focus:border-[#800000]"
                                placeholder="Enter virtual meeting link"
                              />
                            </div>
                          )}
                        </div>
                        
                        <div className="col-span-1 sm:col-span-2">
                          <div className="flex items-center mb-2">
                            <input
                              id="isImportant"
                              name="isImportant"
                              type="checkbox"
                              checked={newEvent.isImportant}
                              onChange={handleInputChange}
                              className="h-4 w-4 text-[#800000] focus:ring-[#800000] border-gray-300 rounded"
                            />
                            <label htmlFor="isImportant" className="ml-2 block text-sm font-medium text-gray-700">
                              Mark as Important
                            </label>
                          </div>
                        </div>
                        
                        <div className="col-span-1 sm:col-span-2">
                          <label htmlFor="attendees" className="block text-sm font-medium text-gray-700 mb-1">
                            Attendees
                          </label>
                          <select
                            id="attendees"
                            name="attendees"
                            multiple
                            value={newEvent.attendees.map(a => a.id)}
                            onChange={e => {
                              const selectedOptions = Array.from(e.target.selectedOptions);
                              const attendees = selectedOptions.map(option => {
                                const attendeeId = parseInt(option.value);
                                return teamMembers.find(member => member.id === attendeeId);
                              }).filter(Boolean);
                              
                              setNewEvent(prev => ({
                                ...prev,
                                attendees
                              }));
                            }}
                            className="mt-1 block w-full px-3 py-2 text-base border-gray-300 rounded-md focus:outline-none focus:ring-[#800000] focus:border-[#800000]"
                          >
                            {teamMembers.map(member => (
                              <option key={member.id} value={member.id}>
                                {member.name} ({member.role})
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <button
                          type="submit"
                          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#800000] hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                        >
                          <HiOutlineCheck className="-ml-1 mr-2 h-5 w-5" />
                          {isEditMode ? 'Update Event' : 'Create Event'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
};

export default AttorneyCalendarPage;