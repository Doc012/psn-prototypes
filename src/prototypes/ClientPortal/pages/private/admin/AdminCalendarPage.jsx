import React, { useState, useEffect, Fragment } from 'react'
import { 
  HiOutlineCalendar, 
  HiOutlineClock, 
  HiOutlineUserGroup, 
  HiOutlineOfficeBuilding,
  HiOutlineLocationMarker,
  HiOutlineDocumentText,
  HiOutlinePlusCircle,
  HiOutlinePencilAlt,
  HiOutlineTrash,
  HiOutlineX,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineFilter,
  HiOutlineExclamation,
  HiOutlineCheck,
  HiOutlineRefresh,
  HiOutlineViewGrid,
  HiOutlineViewList
} from 'react-icons/hi';
import { Dialog, Menu, Transition } from '@headlessui/react';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, addDays, isToday, isSameMonth, isSameDay, addMonths, subMonths, parseISO } from 'date-fns';

const AdminCalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('month'); // 'month', 'week', 'day', 'list'
  const [events, setEvents] = useState([]);
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [newEvent, setNewEvent] = useState({
    id: '',
    title: '',
    description: '',
    start: '',
    end: '',
    allDay: false,
    type: 'appointment',
    clientId: '',
    caseId: '',
    staffMembers: [],
    location: '',
    status: 'scheduled',
    reminders: [],
  });
  const [selectedStaff, setSelectedStaff] = useState('all');
  const [selectedClient, setSelectedClient] = useState('all');
  const [selectedEventType, setSelectedEventType] = useState('all');
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [toast, setToast] = useState(null);
  
  // Add new state for the info dialog
  const [showEventInfo, setShowEventInfo] = useState(false);
  const [eventInfoPosition, setEventInfoPosition] = useState({ x: 0, y: 0 });
  
  // Mock data - in a real app, fetch from API
  const clients = [
    { id: 'client1', name: 'Johnson Family' },
    { id: 'client2', name: 'Smith Corporation' },
    { id: 'client3', name: 'Rebecca Lee' },
    { id: 'client4', name: 'Greenway Holdings' },
  ];
  
  const cases = [
    { id: 'case1', title: 'Custody Arrangement', clientId: 'client1' },
    { id: 'case2', title: 'Corporate Restructuring', clientId: 'client2' },
    { id: 'case3', title: 'Property Dispute', clientId: 'client3' },
    { id: 'case4', title: 'Contract Negotiation', clientId: 'client2' },
    { id: 'case5', title: 'Will Execution', clientId: 'client4' },
  ];
  
  const staffMembers = [
    { id: 'staff1', name: 'James Wilson', role: 'Attorney' },
    { id: 'staff2', name: 'Sarah Parker', role: 'Attorney' },
    { id: 'staff3', name: 'Michael Rodriguez', role: 'Paralegal' },
    { id: 'staff4', name: 'Emily Chen', role: 'Legal Assistant' },
  ];
  
  const eventTypes = [
    { id: 'appointment', name: 'Appointment', color: 'bg-blue-500' },
    { id: 'court', name: 'Court Appearance', color: 'bg-red-500' },
    { id: 'meeting', name: 'Internal Meeting', color: 'bg-green-500' },
    { id: 'deadline', name: 'Deadline', color: 'bg-yellow-500' },
    { id: 'consultation', name: 'Consultation', color: 'bg-purple-500' },
  ];
  
  const locations = [
    { id: 'office', name: 'Main Office' },
    { id: 'court', name: 'County Courthouse' },
    { id: 'client', name: 'Client Location' },
    { id: 'virtual', name: 'Virtual Meeting' },
  ];

  // Mock event data
  useEffect(() => {
    const mockEvents = [
      {
        id: '1',
        title: 'Initial Consultation',
        description: 'First meeting to discuss case details',
        start: '2025-06-07T10:00:00',
        end: '2025-06-07T11:00:00',
        allDay: false,
        type: 'consultation',
        clientId: 'client1',
        caseId: 'case1',
        staffMembers: ['staff1'],
        location: 'office',
        status: 'scheduled',
        reminders: ['1hour'],
      },
      {
        id: '2',
        title: 'Court Hearing',
        description: 'Motion hearing for custody case',
        start: '2025-06-10T09:00:00',
        end: '2025-06-10T12:00:00',
        allDay: false,
        type: 'court',
        clientId: 'client1',
        caseId: 'case1',
        staffMembers: ['staff1', 'staff3'],
        location: 'court',
        status: 'scheduled',
        reminders: ['1day', '1hour'],
      },
      {
        id: '3',
        title: 'Contract Review Meeting',
        description: 'Review final terms of acquisition contract',
        start: '2025-06-08T14:00:00',
        end: '2025-06-08T15:30:00',
        allDay: false,
        type: 'meeting',
        clientId: 'client2',
        caseId: 'case4',
        staffMembers: ['staff2'],
        location: 'virtual',
        status: 'scheduled',
        reminders: ['1hour'],
      },
      {
        id: '4',
        title: 'Filing Deadline',
        description: 'Submit response to complaint',
        start: '2025-06-15T17:00:00',
        end: '2025-06-15T17:00:00',
        allDay: true,
        type: 'deadline',
        clientId: 'client3',
        caseId: 'case3',
        staffMembers: ['staff1', 'staff3'],
        location: '',
        status: 'pending',
        reminders: ['1day', '1week'],
      },
      {
        id: '5',
        title: 'Estate Planning Session',
        description: 'Will and trust preparation',
        start: '2025-06-12T11:00:00',
        end: '2025-06-12T12:30:00',
        allDay: false,
        type: 'appointment',
        clientId: 'client4',
        caseId: 'case5',
        staffMembers: ['staff2', 'staff4'],
        location: 'office',
        status: 'scheduled',
        reminders: ['1day'],
      },
    ];
    
    setEvents(mockEvents);
  }, []);

  // Filter events based on selected filters
  const filteredEvents = events.filter(event => {
    if (selectedStaff !== 'all' && !event.staffMembers.includes(selectedStaff)) {
      return false;
    }
    if (selectedClient !== 'all' && event.clientId !== selectedClient) {
      return false;
    }
    if (selectedEventType !== 'all' && event.type !== selectedEventType) {
      return false;
    }
    return true;
  });

  // Helper functions for calendar views
  const getMonthDays = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    
    return eachDayOfInterval({ start: startDate, end: endDate });
  };

  const getWeekDays = () => {
    const weekStart = startOfWeek(currentDate);
    const weekEnd = endOfWeek(currentDate);
    
    return eachDayOfInterval({ start: weekStart, end: weekEnd });
  };

  const getEventType = (type) => {
    return eventTypes.find(t => t.id === type) || eventTypes[0];
  };

  const getClientName = (clientId) => {
    const client = clients.find(c => c.id === clientId);
    return client ? client.name : 'No Client';
  };

  const getCaseName = (caseId) => {
    const caseItem = cases.find(c => c.id === caseId);
    return caseItem ? caseItem.title : 'No Case';
  };

  const getStaffName = (staffId) => {
    const staff = staffMembers.find(s => s.id === staffId);
    return staff ? staff.name : 'Unknown';
  };

  const getLocationName = (locationId) => {
    const location = locations.find(l => l.id === locationId);
    return location ? location.name : 'No Location';
  };

  // Event handlers
  const handleDateClick = (date) => {
    const formattedDate = format(date, "yyyy-MM-dd'T'HH:mm:ss");
    setNewEvent({
      ...newEvent,
      id: Date.now().toString(),
      start: formattedDate,
      end: formattedDate,
    });
    setSelectedEvent(null);
    setShowEventModal(true);
  };

  // Update the handleEventClick function to track the relative position of the event
  const handleEventClick = (event, e) => {
    e.stopPropagation();
    
    // Get relative position to the document instead of viewport
    const rect = e.currentTarget.getBoundingClientRect();
    setEventInfoPosition({
      x: rect.left + (rect.width / 2) + window.scrollX,
      y: rect.bottom + window.scrollY
    });
    
    setSelectedEvent(event);
    setShowEventInfo(true);
  };

  // Update or add a handleEventHover function for hover effects if you want to keep that
  const handleEventHover = (event, e) => {
    // Do nothing - we'll only show info on click now
    // Or you could implement a preview behavior here if desired
  };

  const handlePrevious = () => {
    if (view === 'month') {
      setCurrentDate(subMonths(currentDate, 1));
    } else if (view === 'week') {
      setCurrentDate(addDays(currentDate, -7));
    } else if (view === 'day') {
      setCurrentDate(addDays(currentDate, -1));
    }
  };

  const handleNext = () => {
    if (view === 'month') {
      setCurrentDate(addMonths(currentDate, 1));
    } else if (view === 'week') {
      setCurrentDate(addDays(currentDate, 7));
    } else if (view === 'day') {
      setCurrentDate(addDays(currentDate, 1));
    }
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewEvent({
      ...newEvent,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleStaffSelection = (staffId) => {
    const isSelected = newEvent.staffMembers.includes(staffId);
    let updatedStaff;
    
    if (isSelected) {
      updatedStaff = newEvent.staffMembers.filter(id => id !== staffId);
    } else {
      updatedStaff = [...newEvent.staffMembers, staffId];
    }
    
    setNewEvent({
      ...newEvent,
      staffMembers: updatedStaff,
    });
  };

  const handleReminderSelection = (reminder) => {
    const isSelected = newEvent.reminders.includes(reminder);
    let updatedReminders;
    
    if (isSelected) {
      updatedReminders = newEvent.reminders.filter(r => r !== reminder);
    } else {
      updatedReminders = [...newEvent.reminders, reminder];
    }
    
    setNewEvent({
      ...newEvent,
      reminders: updatedReminders,
    });
  };

  const handleSaveEvent = () => {
    if (selectedEvent) {
      // Update existing event
      const updatedEvents = events.map(event => 
        event.id === selectedEvent.id ? newEvent : event
      );
      setEvents(updatedEvents);
    } else {
      // Add new event
      setEvents([...events, newEvent]);
    }
    
    setShowEventModal(false);
    setSelectedEvent(null);
    setNewEvent({
      id: '',
      title: '',
      description: '',
      start: '',
      end: '',
      allDay: false,
      type: 'appointment',
      clientId: '',
      caseId: '',
      staffMembers: [],
      location: '',
      status: 'scheduled',
      reminders: [],
    });
  };

  const handleDeleteEvent = () => {
    if (selectedEvent) {
      const updatedEvents = events.filter(event => event.id !== selectedEvent.id);
      setEvents(updatedEvents);
      setShowDeleteConfirmation(false);
      setShowEventModal(false);
      setSelectedEvent(null);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirmation(true);
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000); // Auto-dismiss after 3 seconds
  };

  // Event colors and classes
  const getEventColorClass = (type) => {
    const eventType = getEventType(type);
    return eventType.color;
  };

  const getDayEvents = (day) => {
    return filteredEvents.filter(event => {
      const eventDate = parseISO(event.start);
      return isSameDay(eventDate, day);
    });
  };

  const getFilteredCases = () => {
    if (selectedClient === 'all') {
      return cases;
    }
    return cases.filter(c => c.clientId === selectedClient);
  };

  // Render calendar views
  const renderMonthView = () => {
    const days = getMonthDays();
    
    return (
      <div className="grid grid-cols-7 gap-px bg-gray-200 border border-gray-200 rounded-lg">
        {/* Day headers */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, idx) => (
          <div key={idx} className="h-12 bg-gray-50 flex items-center justify-center">
            <span className="text-sm font-medium text-gray-500">{day}</span>
          </div>
        ))}
        
        {/* Calendar days */}
        {days.map((day, idx) => {
          const dayEvents = getDayEvents(day);
          
          return (
            <div 
              key={idx} 
              className={`min-h-[120px] p-2 bg-white ${
                !isSameMonth(day, currentDate) 
                  ? 'bg-gray-50 text-gray-400' 
                  : 'text-gray-900'
              } ${
                isToday(day) ? 'bg-blue-50' : ''
              }`}
              onClick={() => showToast("New event feature coming soon!", "success")}
            >
              <div className="flex items-center justify-between">
                <span className={`text-sm ${isToday(day) ? 'font-bold bg-blue-500 text-white rounded-full w-7 h-7 flex items-center justify-center' : ''}`}>
                  {format(day, 'd')}
                </span>
                {dayEvents.length > 0 && (
                  <span className="text-xs bg-gray-100 rounded-full px-2 py-0.5">
                    {dayEvents.length}
                  </span>
                )}
              </div>
              
              <div className="mt-1 space-y-1 max-h-[80px] overflow-y-auto">
                {dayEvents.slice(0, 3).map(event => (
                  <div 
                    key={event.id} 
                    className={`text-xs px-2 py-1 rounded truncate ${getEventColorClass(event.type)} text-white cursor-pointer`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEventClick(event, e);
                    }}
                    // Keep or remove onMouseEnter based on whether you want hover effects
                    // onMouseEnter={(e) => handleEventHover(event, e)}
                    // Remove this: onMouseLeave={handleEventLeave}
                  >
                    {!event.allDay && format(parseISO(event.start), 'h:mm a')} {event.title}
                  </div>
                ))}
                {dayEvents.length > 3 && (
                  <div className="text-xs text-gray-500 px-2">
                    +{dayEvents.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderWeekView = () => {
    const days = getWeekDays();
    const hours = Array.from({ length: 24 }, (_, i) => i);
    
    return (
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          <div className="grid grid-cols-8 border-b">
            <div className="w-20"></div>
            {days.map((day, idx) => (
              <div 
                key={idx} 
                className={`py-2 text-center border-l ${
                  isToday(day) ? 'bg-blue-50' : ''
                }`}
              >
                <p className="text-xs text-gray-500">{format(day, 'EEE')}</p>
                <p className={`text-sm ${isToday(day) ? 'font-bold text-blue-600' : ''}`}>
                  {format(day, 'MMM d')}
                </p>
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-8">
            <div className="w-20 border-r">
              {hours.map(hour => (
                <div key={hour} className="h-16 border-b text-xs text-gray-500 text-right pr-2">
                  {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
                </div>
              ))}
            </div>
            
            {days.map((day, dayIdx) => (
              <div key={dayIdx} className="relative border-r">
                {hours.map(hour => (
                  <div 
                    key={hour} 
                    className="h-16 border-b hover:bg-gray-50 cursor-pointer"
                    onClick={() => {
                      const eventDate = new Date(day);
                      eventDate.setHours(hour);
                      handleDateClick(eventDate);
                    }}
                  ></div>
                ))}
                
                {/* Render events */}
                {filteredEvents.map(event => {
                  const eventStart = parseISO(event.start);
                  const eventEnd = parseISO(event.end);
                  
                  if (!isSameDay(eventStart, day)) return null;
                  
                  const startHour = eventStart.getHours() + (eventStart.getMinutes() / 60);
                  const endHour = eventEnd.getHours() + (eventEnd.getMinutes() / 60);
                  const duration = endHour - startHour;
                  
                  return (
                    <div 
                      key={event.id}
                      className={`absolute rounded-sm px-2 py-1 left-0 right-0 mx-1 text-white text-xs overflow-hidden ${getEventColorClass(event.type)}`}
                      style={{
                        top: `${startHour * 4}rem`,
                        height: `${duration * 4}rem`,
                        minHeight: '1.5rem',
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEventClick(event, e);
                      }}
                    >
                      <div className="font-semibold">{event.title}</div>
                      <div>{format(eventStart, 'h:mm a')} - {format(eventEnd, 'h:mm a')}</div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderDayView = () => {
    const hours = Array.from({ length: 24 }, (_, i) => i);
    
    return (
      <div className="grid grid-cols-1 border rounded-lg overflow-hidden">
        <div className="py-4 text-center bg-white">
          <h3 className="text-lg font-medium text-gray-900">
            {format(currentDate, 'EEEE, MMMM d, yyyy')}
          </h3>
        </div>
        
        <div className="grid grid-cols-[80px_1fr]">
          <div className="border-r">
            {hours.map(hour => (
              <div key={hour} className="h-20 border-b text-xs text-gray-500 text-right pr-2 pt-2">
                {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
              </div>
            ))}
          </div>
          
          <div className="relative">
            {hours.map(hour => (
              <div 
                key={hour} 
                className="h-20 border-b hover:bg-gray-50 cursor-pointer"
                onClick={() => {
                  const eventDate = new Date(currentDate);
                  eventDate.setHours(hour);
                  handleDateClick(eventDate);
                }}
              ></div>
            ))}
            
            {/* Render events */}
            {filteredEvents.map(event => {
              const eventStart = parseISO(event.start);
              const eventEnd = parseISO(event.end);
              
              if (!isSameDay(eventStart, currentDate)) return null;
              
              const startHour = eventStart.getHours() + (eventStart.getMinutes() / 60);
              const endHour = eventEnd.getHours() + (eventEnd.getMinutes() / 60);
              const duration = endHour - startHour;
              
              return (
                <div 
                  key={event.id}
                  className={`absolute rounded-sm px-4 py-2 left-0 right-0 mx-4 text-white ${getEventColorClass(event.type)}`}
                  style={{
                    top: `${startHour * 5}rem`,
                    height: `${duration * 5}rem`,
                    minHeight: '2rem',
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEventClick(event);
                  }}
                >
                  <div className="font-semibold">{event.title}</div>
                  <div className="text-sm">
                    {format(eventStart, 'h:mm a')} - {format(eventEnd, 'h:mm a')}
                  </div>
                  <div className="text-sm truncate">{event.description}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderListView = () => {
    const groupedEvents = filteredEvents.reduce((acc, event) => {
      const date = format(parseISO(event.start), 'yyyy-MM-dd');
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(event);
      return acc;
    }, {});
    
    const sortedDates = Object.keys(groupedEvents).sort();
    
    return (
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {sortedDates.length > 0 ? (
            sortedDates.map(date => (
              <li key={date}>
                <div className="px-4 py-4 sm:px-6 bg-gray-50">
                  <h3 className="text-sm font-medium text-gray-900">
                    {format(parseISO(date), 'EEEE, MMMM d, yyyy')}
                  </h3>
                </div>
                <ul className="divide-y divide-gray-200">
                  {groupedEvents[date].sort((a, b) => {
                    return new Date(a.start) - new Date(b.start);
                  }).map(event => (
                    <li key={event.id} className="block hover:bg-gray-50">
                      <div className="px-4 py-4 sm:px-6 cursor-pointer" onClick={() => handleEventClick(event)}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className={`w-3 h-3 rounded-full ${getEventColorClass(event.type)} mr-3`}></div>
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {event.title}
                            </p>
                          </div>
                          <div className="ml-2 flex-shrink-0 flex">
                            <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              {event.status === 'scheduled' ? 'Scheduled' : 'Pending'}
                            </p>
                          </div>
                        </div>
                        <div className="mt-2 sm:flex sm:justify-between">
                          <div className="sm:flex">
                            <p className="flex items-center text-sm text-gray-500">
                              <HiOutlineClock className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                              {event.allDay ? 'All day' : `${format(parseISO(event.start), 'h:mm a')} - ${format(parseISO(event.end), 'h:mm a')}`}
                            </p>
                            {event.location && (
                              <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                                <HiOutlineLocationMarker className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                                {getLocationName(event.location)}
                              </p>
                            )}
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                            <HiOutlineUserGroup className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                            <p>
                              {event.clientId ? getClientName(event.clientId) : 'No Client'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </li>
            ))
          ) : (
            <li className="px-4 py-12 text-center">
              <HiOutlineCalendar className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No events</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by creating a new event.</p>
              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => showToast("New event feature coming soon!", "success")}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#800000] hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                >
                  <HiOutlinePlusCircle className="-ml-1 mr-2 h-5 w-5" />
                  New Event
                </button>
              </div>
            </li>
          )}
        </ul>
      </div>
    );
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Calendar</h1>
            <p className="mt-1 text-sm text-gray-500">
              Schedule and manage appointments, court dates, and deadlines
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <button
              onClick={() => showToast("New event feature coming soon!", "success")}
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#800000] hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
            >
              <HiOutlinePlusCircle className="-ml-1 mr-2 h-5 w-5" />
              New Event
            </button>
          </div>
        </div>

        <div className="mt-6 bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:p-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex items-center space-x-2">
                <button
                  onClick={handlePrevious}
                  className="p-1 rounded-full hover:bg-gray-100"
                >
                  <HiOutlineChevronLeft className="h-5 w-5 text-gray-600" />
                </button>
                <button
                  onClick={handleNext}
                  className="p-1 rounded-full hover:bg-gray-100"
                >
                  <HiOutlineChevronRight className="h-5 w-5 text-gray-600" />
                </button>
                <h2 className="text-lg font-medium text-gray-900">
                  {view === 'month' && format(currentDate, 'MMMM yyyy')}
                  {view === 'week' && `${format(startOfWeek(currentDate), 'MMM d')} - ${format(endOfWeek(currentDate), 'MMM d, yyyy')}`}
                  {view === 'day' && format(currentDate, 'MMMM d, yyyy')}
                  {view === 'list' && 'Upcoming Events'}
                </h2>
                <button
                  onClick={handleToday}
                  className="ml-4 px-3 py-1 text-xs font-medium rounded-md text-[#800000] border border-[#800000] hover:bg-red-50"
                >
                  Today
                </button>
              </div>
              
              <div className="mt-4 md:mt-0 flex items-center space-x-2">
                <div className="flex items-center rounded-md shadow-sm">
                  <button
                    className={`px-4 py-2 text-sm font-medium ${view === 'month' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-700'} rounded-l-md border border-gray-300`}
                    onClick={() => setView('month')}
                  >
                    Month
                  </button>
                  <button
                    className={`px-4 py-2 text-sm font-medium ${view === 'week' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-700'} border-t border-b border-gray-300`}
                    onClick={() => setView('week')}
                  >
                    Week
                  </button>
                  <button
                    className={`px-4 py-2 text-sm font-medium ${view === 'day' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-700'} border-t border-b border-gray-300`}
                    onClick={() => setView('day')}
                  >
                    Day
                  </button>
                  <button
                    className={`px-4 py-2 text-sm font-medium ${view === 'list' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-700'} rounded-r-md border border-gray-300`}
                    onClick={() => setView('list')}
                  >
                    List
                  </button>
                </div>
                
                <Menu as="div" className="relative inline-block text-left">
                  <Menu.Button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]">
                    <HiOutlineFilter className="-ml-0.5 mr-2 h-4 w-4" />
                    Filter
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
                        <div className="px-4 py-2">
                          <label htmlFor="staffFilter" className="block text-sm font-medium text-gray-700">Staff Member</label>
                          <select
                            id="staffFilter"
                            value={selectedStaff}
                            onChange={(e) => setSelectedStaff(e.target.value)}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm rounded-md"
                          >
                            <option value="all">All Staff</option>
                            {staffMembers.map(staff => (
                              <option key={staff.id} value={staff.id}>{staff.name}</option>
                            ))}
                          </select>
                        </div>
                        <div className="px-4 py-2">
                          <label htmlFor="clientFilter" className="block text-sm font-medium text-gray-700">Client</label>
                          <select
                            id="clientFilter"
                            value={selectedClient}
                            onChange={(e) => setSelectedClient(e.target.value)}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm rounded-md"
                          >
                            <option value="all">All Clients</option>
                            {clients.map(client => (
                              <option key={client.id} value={client.id}>{client.name}</option>
                            ))}
                          </select>
                        </div>
                        <div className="px-4 py-2">
                          <label htmlFor="eventTypeFilter" className="block text-sm font-medium text-gray-700">Event Type</label>
                          <select
                            id="eventTypeFilter"
                            value={selectedEventType}
                            onChange={(e) => setSelectedEventType(e.target.value)}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm rounded-md"
                          >
                            <option value="all">All Types</option>
                            {eventTypes.map(type => (
                              <option key={type.id} value={type.id}>{type.name}</option>
                            ))}
                          </select>
                        </div>
                        <div className="px-4 py-2 flex justify-end">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedStaff('all');
                              setSelectedClient('all');
                              setSelectedEventType('all');
                            }}
                            className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                          >
                            <HiOutlineRefresh className="-ml-0.5 mr-1 h-4 w-4" />
                            Reset
                          </button>
                        </div>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
            
            <div className="mt-4 flex flex-wrap gap-3">
              <div className="flex items-center">
                {eventTypes.map(type => (
                  <div key={type.id} className="flex items-center mr-4">
                    <span className={`w-3 h-3 rounded-full ${type.color} mr-1`}></span>
                    <span className="text-xs text-gray-600">{type.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="px-4 py-5 sm:p-6">
            {view === 'month' && renderMonthView()}
            {view === 'week' && renderWeekView()}
            {view === 'day' && renderDayView()}
            {view === 'list' && renderListView()}
          </div>
        </div>
      </div>

      {/* Event Modal */}
      <Transition.Root show={showEventModal} as={Fragment}>
        <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto" onClose={setShowEventModal}>
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
              <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-6">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-[#800000] bg-opacity-10 sm:mx-0 sm:h-10 sm:w-10">
                    <HiOutlineCalendar className="h-6 w-6 text-[#800000]" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                      {selectedEvent ? 'Edit Event' : 'Add New Event'}
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        {selectedEvent 
                          ? 'Edit the details for this calendar event' 
                          : 'Fill in the details to add a new event to your calendar'}
                      </p>
                    </div>
                  </div>
                  <div className="ml-auto sm:pl-4">
                    <button
                      type="button"
                      className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                      onClick={() => setShowEventModal(false)}
                    >
                      <span className="sr-only">Close</span>
                      <HiOutlineX className="h-6 w-6" />
                    </button>
                  </div>
                </div>

                <div className="mt-5 sm:mt-4">
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-6">
                      <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                        Title *
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="title"
                          id="title"
                          value={newEvent.title}
                          onChange={handleInputChange}
                          className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                          placeholder="Event title"
                          required
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-6">
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Description
                      </label>
                      <div className="mt-1">
                        <textarea
                          id="description"
                          name="description"
                          rows={3}
                          value={newEvent.description}
                          onChange={handleInputChange}
                          className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                          placeholder="Add details about this event"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="start" className="block text-sm font-medium text-gray-700">
                        Start Time *
                      </label>
                      <div className="mt-1">
                        <input
                          type="datetime-local"
                          name="start"
                          id="start"
                          value={newEvent.start}
                          onChange={handleInputChange}
                          className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                          required
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="end" className="block text-sm font-medium text-gray-700">
                        End Time *
                      </label>
                      <div className="mt-1">
                        <input
                          type="datetime-local"
                          name="end"
                          id="end"
                          value={newEvent.end}
                          onChange={handleInputChange}
                          className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                          required
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-6">
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="allDay"
                            name="allDay"
                            type="checkbox"
                            checked={newEvent.allDay}
                            onChange={handleInputChange}
                            className="focus:ring-[#800000] h-4 w-4 text-[#800000] border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="allDay" className="font-medium text-gray-700">All-day event</label>
                          <p className="text-gray-500">This event lasts all day</p>
                        </div>
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                        Event Type *
                      </label>
                      <div className="mt-1">
                        <select
                          id="type"
                          name="type"
                          value={newEvent.type}
                          onChange={handleInputChange}
                          className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                        >
                          {eventTypes.map(type => (
                            <option key={type.id} value={type.id}>{type.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                        Status
                      </label>
                      <div className="mt-1">
                        <select
                          id="status"
                          name="status"
                          value={newEvent.status}
                          onChange={handleInputChange}
                          className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                        >
                          <option value="scheduled">Scheduled</option>
                          <option value="pending">Pending</option>
                          <option value="cancelled">Cancelled</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="clientId" className="block text-sm font-medium text-gray-700">
                        Client
                      </label>
                      <div className="mt-1">
                        <select
                          id="clientId"
                          name="clientId"
                          value={newEvent.clientId}
                          onChange={handleInputChange}
                          className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                        >
                          <option value="">No Client</option>
                          {clients.map(client => (
                            <option key={client.id} value={client.id}>{client.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="caseId" className="block text-sm font-medium text-gray-700">
                        Case
                      </label>
                      <div className="mt-1">
                        <select
                          id="caseId"
                          name="caseId"
                          value={newEvent.caseId}
                          onChange={handleInputChange}
                          className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                          disabled={!newEvent.clientId}
                        >
                          <option value="">No Case</option>
                          {getFilteredCases().map(c => (
                            <option key={c.id} value={c.id}>{c.title}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                        Location
                      </label>
                      <div className="mt-1">
                        <select
                          id="location"
                          name="location"
                          value={newEvent.location}
                          onChange={handleInputChange}
                          className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                        >
                          <option value="">No Location</option>
                          {locations.map(location => (
                            <option key={location.id} value={location.id}>{location.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="sm:col-span-6">
                      <fieldset>
                        <legend className="text-sm font-medium text-gray-700">Staff Members</legend>
                        <div className="mt-2 space-y-2">
                          {staffMembers.map((staff) => (
                            <div key={staff.id} className="relative flex items-start">
                              <div className="flex items-center h-5">
                                <input
                                  id={`staff-${staff.id}`}
                                  type="checkbox"
                                  checked={newEvent.staffMembers.includes(staff.id)}
                                  onChange={() => handleStaffSelection(staff.id)}
                                  className="focus:ring-[#800000] h-4 w-4 text-[#800000] border-gray-300 rounded"
                                />
                              </div>
                              <div className="ml-3 text-sm">
                                <label htmlFor={`staff-${staff.id}`} className="font-medium text-gray-700">
                                  {staff.name}
                                </label>
                                <p className="text-gray-500">{staff.role}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </fieldset>
                    </div>

                    <div className="sm:col-span-6">
                      <fieldset>
                        <legend className="text-sm font-medium text-gray-700">Reminders</legend>
                        <div className="mt-2 space-y-2 flex flex-wrap gap-3">
                          <div className="relative flex items-start">
                            <div className="flex items-center h-5">
                              <input
                                id="reminder-1hour"
                                type="checkbox"
                                checked={newEvent.reminders.includes('1hour')}
                                onChange={() => handleReminderSelection('1hour')}
                                className="focus:ring-[#800000] h-4 w-4 text-[#800000] border-gray-300 rounded"
                              />
                            </div>
                            <div className="ml-3 text-sm">
                              <label htmlFor="reminder-1hour" className="font-medium text-gray-700">
                                1 hour before
                              </label>
                            </div>
                          </div>
                          
                          <div className="relative flex items-start">
                            <div className="flex items-center h-5">
                              <input
                                id="reminder-1day"
                                type="checkbox"
                                checked={newEvent.reminders.includes('1day')}
                                onChange={() => handleReminderSelection('1day')}
                                className="focus:ring-[#800000] h-4 w-4 text-[#800000] border-gray-300 rounded"
                              />
                            </div>
                            <div className="ml-3 text-sm">
                              <label htmlFor="reminder-1day" className="font-medium text-gray-700">
                                1 day before
                              </label>
                            </div>
                          </div>
                          
                          <div className="relative flex items-start">
                            <div className="flex items-center h-5">
                              <input
                                id="reminder-1week"
                                type="checkbox"
                                checked={newEvent.reminders.includes('1week')}
                                onChange={() => handleReminderSelection('1week')}
                                className="focus:ring-[#800000] h-4 w-4 text-[#800000] border-gray-300 rounded"
                              />
                            </div>
                            <div className="ml-3 text-sm">
                              <label htmlFor="reminder-1week" className="font-medium text-gray-700">
                                1 week before
                              </label>
                            </div>
                          </div>
                        </div>
                      </fieldset>
                    </div>
                  </div>
                </div>

                <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#800000] text-base font-medium text-white hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000] sm:col-start-2 sm:text-sm"
                    onClick={handleSaveEvent}
                  >
                    {selectedEvent ? 'Save Changes' : 'Create Event'}
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000] sm:mt-0 sm:col-start-1 sm:text-sm"
                    onClick={() => setShowEventModal(false)}
                  >
                    Cancel
                  </button>
                  {selectedEvent && (
                    <button
                      type="button"
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-red-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-red-700 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:mt-3 sm:col-span-2 sm:text-sm"
                      onClick={handleDeleteClick}
                    >
                      <HiOutlineTrash className="-ml-1 mr-2 h-5 w-5" />
                      Delete Event
                    </button>
                  )}
                </div>
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
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <HiOutlineExclamation className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                      Delete Event
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete this event? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={handleDeleteEvent}
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

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-5 right-5 max-w-sm w-full bg-white shadow-lg rounded-lg p-4 z-50 ${
          toast.type === 'success' ? 'border-l-4 border-green-500' : 'border-l-4 border-red-500'
        }`}>
          <div className="flex items-start">
            <div className="flex-shrink-0">
              {toast.type === 'success' ? (
                <HiOutlineCheck className="h-6 w-6 text-green-500" />
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

      {/* Event Info Dialog */}
      {showEventInfo && selectedEvent && (
        <div 
          className="absolute bg-white rounded-lg shadow-lg p-4 z-50 w-80 event-info-dialog"
          style={{
            position: 'absolute', // Changed from fixed to absolute
            left: `${eventInfoPosition.x}px`,
            top: `${eventInfoPosition.y}px`,
            transform: 'translate(-50%, 10px)',
            maxWidth: '90vw',
            maxHeight: '80vh',
            overflow: 'auto'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-2 sticky top-0 bg-white pt-1 pb-2">
            <h3 className="text-lg font-semibold truncate">{selectedEvent.title}</h3>
            <div className="flex items-center space-x-2 flex-shrink-0">
              <div className={`w-3 h-3 rounded-full ${getEventColorClass(selectedEvent.type)}`}></div>
              <button 
                onClick={() => setShowEventInfo(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <HiOutlineX className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          <div className="space-y-3 text-sm overflow-y-auto">
            <div className="flex items-start">
              <HiOutlineClock className="flex-shrink-0 mr-2 h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <div>{format(parseISO(selectedEvent.start), 'EEEE, MMMM d, yyyy')}</div>
                <div>
                  {selectedEvent.allDay 
                    ? 'All day' 
                    : `${format(parseISO(selectedEvent.start), 'h:mm a')} - ${format(parseISO(selectedEvent.end), 'h:mm a')}`}
                </div>
              </div>
            </div>
            
            {selectedEvent.description && (
              <div className="flex items-start">
                <HiOutlineDocumentText className="flex-shrink-0 mr-2 h-5 w-5 text-gray-400 mt-0.5" />
                <div className="break-words">{selectedEvent.description}</div>
              </div>
            )}
            
            {selectedEvent.location && (
              <div className="flex items-start">
                <HiOutlineLocationMarker className="flex-shrink-0 mr-2 h-5 w-5 text-gray-400 mt-0.5" />
                <div>{getLocationName(selectedEvent.location)}</div>
              </div>
            )}
            
            {selectedEvent.clientId && (
              <div className="flex items-start">
                <HiOutlineUserGroup className="flex-shrink-0 mr-2 h-5 w-5 text-gray-400 mt-0.5" />
                <div>{getClientName(selectedEvent.clientId)}</div>
              </div>
            )}
            
            {selectedEvent.staffMembers && selectedEvent.staffMembers.length > 0 && (
              <div className="flex items-start">
                <HiOutlineOfficeBuilding className="flex-shrink-0 mr-2 h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  {selectedEvent.staffMembers.map(staffId => getStaffName(staffId)).join(', ')}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Click outside and escape key handling */}
      {useEffect(() => {
        const handleClickOutside = (e) => {
          if (showEventInfo && !e.target.closest('.event-info-dialog')) {
            setShowEventInfo(false);
          }
        };
        
        const handleEscapeKey = (e) => {
          if (e.key === 'Escape' && showEventInfo) {
            setShowEventInfo(false);
          }
        };
        
        const handleScroll = () => {
          if (showEventInfo && selectedEvent) {
            // Close the tooltip when scrolling to avoid positioning issues
            setShowEventInfo(false);
          }
        };
        
        if (showEventInfo) {
          document.addEventListener('mousedown', handleClickOutside);
          document.addEventListener('keydown', handleEscapeKey);
          window.addEventListener('scroll', handleScroll);
        }
        
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
          document.removeEventListener('keydown', handleEscapeKey);
          window.removeEventListener('scroll', handleScroll);
        };
      }, [showEventInfo, selectedEvent])}
    </div>
  )
}

export default AdminCalendarPage
