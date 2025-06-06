import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { format, formatDistanceToNow, isToday, isYesterday } from 'date-fns';
import { 
  HiOutlinePaperAirplane, 
  HiOutlineSearch, 
  HiOutlinePlusCircle, 
  HiOutlineTrash, 
  HiOutlineFolder,
  HiOutlinePencil,
  HiOutlineDocumentText,
  HiOutlinePhotograph,
  HiOutlinePaperClip,
  HiOutlineEmojiHappy,
  HiOutlineX,
  HiOutlineChevronLeft,
  HiOutlineDotsVertical,
  HiOutlineExclamation,
  HiOutlinePhone,
  HiOutlineVideoCamera,
  HiOutlineCalendar,
  HiOutlineInformationCircle,
  HiOutlineArchive,
  HiOutlineBell,
  HiOutlineUser,
  HiOutlineOfficeBuilding,
  HiOutlineChat,
  HiOutlineCheckCircle,
  HiOutlineDownload
} from 'react-icons/hi';

const ClientMessagesPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [fileToUpload, setFileToUpload] = useState(null);
  const [showAttachmentOptions, setShowAttachmentOptions] = useState(false);
  const [showMobileConversations, setShowMobileConversations] = useState(true);
  const [typingIndicator, setTypingIndicator] = useState(false);
  const [conversationFilter, setConversationFilter] = useState('all'); // 'all', 'unread', 'archived'
  
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const messageContainerRef = useRef(null);
  
  // Get current date for realistic timestamps
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const lastWeek = new Date(today);
  lastWeek.setDate(lastWeek.getDate() - 7);
  
  // Fetch conversations
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        // Mock data with more realistic and current timestamps
        const mockConversations = [
          {
            id: 1,
            title: 'Case Update: Smith v. Johnson',
            caseId: 123,
            caseName: 'Smith v. Johnson',
            caseNumber: 'PI-2025-1452',
            participants: [
              { id: user?.id || 123, name: user?.firstName ? `${user.firstName} ${user.lastName}` : 'John Doe', role: 'client', avatar: null },
              { id: 456, name: 'Sarah Nguyen', role: 'attorney', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' }
            ],
            lastMessage: {
              content: 'I\'ve reviewed the settlement offer and would like to discuss it with you.',
              timestamp: today.toISOString(),
              sender: { id: user?.id || 123, name: user?.firstName ? `${user.firstName} ${user.lastName}` : 'John Doe', role: 'client' }
            },
            unread: 2,
            isArchived: false,
            hasPriority: true
          },
          {
            id: 2,
            title: 'Document Review Request',
            caseId: 124,
            caseName: 'Estate of Williams',
            caseNumber: 'PR-2025-0783',
            participants: [
              { id: user?.id || 123, name: user?.firstName ? `${user.firstName} ${user.lastName}` : 'John Doe', role: 'client', avatar: null },
              { id: 789, name: 'Michael Brown', role: 'attorney', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' }
            ],
            lastMessage: {
              content: 'Please review the attached contract and let me know your thoughts.',
              timestamp: yesterday.toISOString(),
              sender: { id: 789, name: 'Michael Brown', role: 'attorney' }
            },
            unread: 0,
            isArchived: false,
            hasPriority: false
          },
          {
            id: 3,
            title: 'Estate Planning Consultation',
            caseId: 125,
            caseName: 'Tucker Estate Planning',
            caseNumber: 'EP-2025-0342',
            participants: [
              { id: user?.id || 123, name: user?.firstName ? `${user.firstName} ${user.lastName}` : 'John Doe', role: 'client', avatar: null },
              { id: 101, name: 'Jessica Taylor', role: 'attorney', avatar: 'https://randomuser.me/api/portraits/women/68.jpg' },
              { id: 102, name: 'Robert Chen', role: 'paralegal', avatar: 'https://randomuser.me/api/portraits/men/75.jpg' }
            ],
            lastMessage: {
              content: 'Thank you for your time today. I\'ve attached the estate planning documents we discussed.',
              timestamp: lastWeek.toISOString(),
              sender: { id: 101, name: 'Jessica Taylor', role: 'attorney' }
            },
            unread: 0,
            isArchived: false,
            hasPriority: false
          },
          {
            id: 4,
            title: 'Case Billing Discussion',
            caseId: 123,
            caseName: 'Smith v. Johnson',
            caseNumber: 'PI-2025-1452',
            participants: [
              { id: user?.id || 123, name: user?.firstName ? `${user.firstName} ${user.lastName}` : 'John Doe', role: 'client', avatar: null },
              { id: 103, name: 'Amanda Rodriguez', role: 'billing', avatar: 'https://randomuser.me/api/portraits/women/90.jpg' }
            ],
            lastMessage: {
              content: 'I\'ve updated your invoice with the adjustments we discussed. You can view it in your client portal.',
              timestamp: new Date(today.setDate(today.getDate() - 2)).toISOString(),
              sender: { id: 103, name: 'Amanda Rodriguez', role: 'billing' }
            },
            unread: 1,
            isArchived: false,
            hasPriority: false
          },
          {
            id: 5,
            title: 'Case Closed: Jones Property Dispute',
            caseId: 126,
            caseName: 'Jones Property Dispute',
            caseNumber: 'RE-2024-0952',
            participants: [
              { id: user?.id || 123, name: user?.firstName ? `${user.firstName} ${user.lastName}` : 'John Doe', role: 'client', avatar: null },
              { id: 104, name: 'David Washington', role: 'attorney', avatar: 'https://randomuser.me/api/portraits/men/42.jpg' }
            ],
            lastMessage: {
              content: 'We\'ve successfully closed your case. All documents have been finalized and filed with the court.',
              timestamp: new Date(today.setDate(today.getDate() - 30)).toISOString(),
              sender: { id: 104, name: 'David Washington', role: 'attorney' }
            },
            unread: 0,
            isArchived: true,
            hasPriority: false
          }
        ];
        
        setConversations(mockConversations);
        
        // Check if there's a conversation ID in the URL
        const params = new URLSearchParams(location.search);
        const conversationId = params.get('conversation');
        if (conversationId) {
          const conversation = mockConversations.find(c => c.id === parseInt(conversationId));
          if (conversation) {
            setSelectedConversation(conversation);
            setShowMobileConversations(false);
          }
        } else if (mockConversations.length > 0) {
          // Select the first conversation by default
          setSelectedConversation(mockConversations[0]);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching conversations:', error);
        setLoading(false);
      }
    };
    
    fetchConversations();
  }, [location.search, user]);
  
  // Fetch messages for selected conversation
  useEffect(() => {
    if (selectedConversation) {
      const fetchMessages = async () => {
        try {
          // Mock data with more variety and realistic timestamps
          const mockMessages = [
            {
              id: 1,
              conversationId: 1,
              content: 'Good morning, I hope you\'re doing well. I wanted to update you on your case.',
              timestamp: new Date(today.setHours(today.getHours() - 3)).toISOString(),
              sender: { id: 456, name: 'Sarah Nguyen', role: 'attorney', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
              attachments: [],
              isRead: true
            },
            {
              id: 2,
              conversationId: 1,
              content: 'We\'ve received a settlement offer from the opposing party. I\'ve attached it for your review.',
              timestamp: new Date(today.setHours(today.getHours() - 2, today.getMinutes() - 55)).toISOString(),
              sender: { id: 456, name: 'Sarah Nguyen', role: 'attorney', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
              attachments: [
                { id: 1, name: 'Settlement_Offer.pdf', size: '1.2 MB', type: 'application/pdf' }
              ],
              isRead: true
            },
            {
              id: 3,
              conversationId: 1,
              content: 'Thank you for sending this. I\'ll take a look and get back to you.',
              timestamp: new Date(today.setHours(today.getHours(), today.getMinutes() - 40)).toISOString(),
              sender: { id: user?.id || 123, name: user?.firstName ? `${user.firstName} ${user.lastName}` : 'John Doe', role: 'client', avatar: null },
              attachments: [],
              isRead: true
            },
            {
              id: 4,
              conversationId: 1,
              content: 'I\'ve reviewed the settlement offer and would like to discuss it with you. Do you have time for a call tomorrow?',
              timestamp: new Date(today.setHours(today.getHours(), today.getMinutes() - 10)).toISOString(),
              sender: { id: user?.id || 123, name: user?.firstName ? `${user.firstName} ${user.lastName}` : 'John Doe', role: 'client', avatar: null },
              attachments: [],
              isRead: true
            },
            {
              id: 5,
              conversationId: 1,
              content: 'Yes, I\'m available tomorrow at 10:00 AM or 2:00 PM. Which time works better for you?',
              timestamp: new Date(today.setMinutes(today.getMinutes() - 5)).toISOString(),
              sender: { id: 456, name: 'Sarah Nguyen', role: 'attorney', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
              attachments: [],
              isRead: false
            },
            // Document Review conversation
            {
              id: 6,
              conversationId: 2,
              content: 'Hello, I\'ve prepared the contract for the Brown LLC matter. Please review it when you have a chance.',
              timestamp: new Date(yesterday.setHours(10, 30)).toISOString(),
              sender: { id: 789, name: 'Michael Brown', role: 'attorney', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
              attachments: [
                { id: 2, name: 'Brown_LLC_Contract_Draft.docx', size: '850 KB', type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }
              ],
              isRead: true
            },
            {
              id: 7,
              conversationId: 2,
              content: 'I particularly need you to review sections 4.2 and 7.1 regarding the intellectual property rights and liability limitations.',
              timestamp: new Date(yesterday.setHours(10, 32)).toISOString(),
              sender: { id: 789, name: 'Michael Brown', role: 'attorney', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
              attachments: [],
              isRead: true
            },
            {
              id: 8,
              conversationId: 2,
              content: 'Please review the attached contract and let me know your thoughts.',
              timestamp: new Date(yesterday.setHours(15, 15)).toISOString(),
              sender: { id: 789, name: 'Michael Brown', role: 'attorney', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
              attachments: [],
              isRead: true
            },
            // Estate Planning conversation
            {
              id: 9,
              conversationId: 3,
              content: 'Thank you for meeting with us yesterday to discuss your estate planning needs.',
              timestamp: new Date(lastWeek.setHours(9, 0)).toISOString(),
              sender: { id: 101, name: 'Jessica Taylor', role: 'attorney', avatar: 'https://randomuser.me/api/portraits/women/68.jpg' },
              attachments: [],
              isRead: true
            },
            {
              id: 10,
              conversationId: 3,
              content: 'I\'ve prepared a draft of your will and trust documents based on our discussion.',
              timestamp: new Date(lastWeek.setHours(9, 5)).toISOString(),
              sender: { id: 101, name: 'Jessica Taylor', role: 'attorney', avatar: 'https://randomuser.me/api/portraits/women/68.jpg' },
              attachments: [
                { id: 3, name: 'Will_Draft.pdf', size: '1.5 MB', type: 'application/pdf' },
                { id: 4, name: 'Trust_Documents.pdf', size: '2.3 MB', type: 'application/pdf' }
              ],
              isRead: true
            },
            {
              id: 11,
              conversationId: 3,
              content: 'Robert will be following up with you to schedule a time to sign these documents.',
              timestamp: new Date(lastWeek.setHours(9, 10)).toISOString(),
              sender: { id: 101, name: 'Jessica Taylor', role: 'attorney', avatar: 'https://randomuser.me/api/portraits/women/68.jpg' },
              attachments: [],
              isRead: true
            },
            {
              id: 12,
              conversationId: 3,
              content: 'Hello, I\'d like to schedule a time for you to come in and sign your estate planning documents. Are you available next Tuesday at 10:00 AM?',
              timestamp: new Date(lastWeek.setHours(14, 30)).toISOString(),
              sender: { id: 102, name: 'Robert Chen', role: 'paralegal', avatar: 'https://randomuser.me/api/portraits/men/75.jpg' },
              attachments: [],
              isRead: true
            },
            {
              id: 13,
              conversationId: 3,
              content: 'Tuesday at 10:00 AM works for me. I\'ll see you then.',
              timestamp: new Date(lastWeek.setHours(16, 45)).toISOString(),
              sender: { id: user?.id || 123, name: user?.firstName ? `${user.firstName} ${user.lastName}` : 'John Doe', role: 'client', avatar: null },
              attachments: [],
              isRead: true
            },
            {
              id: 14,
              conversationId: 3,
              content: 'Thank you for your time today. I\'ve attached the estate planning documents we discussed.',
              timestamp: new Date(lastWeek.setHours(11, 15)).toISOString(),
              sender: { id: 101, name: 'Jessica Taylor', role: 'attorney', avatar: 'https://randomuser.me/api/portraits/women/68.jpg' },
              attachments: [
                { id: 5, name: 'Signed_Estate_Documents.pdf', size: '3.1 MB', type: 'application/pdf' }
              ],
              isRead: true
            }
          ];
          
          // Filter messages for selected conversation
          const filteredMessages = mockMessages.filter(
            message => message.conversationId === selectedConversation.id
          );
          
          setMessages(filteredMessages);
          
          // Mark conversation as read
          setConversations(prevConversations => 
            prevConversations.map(conv => 
              conv.id === selectedConversation.id
                ? { ...conv, unread: 0 }
                : conv
            )
          );
          
          // Simulate typing indicator for a moment
          if (selectedConversation.id === 1) {
            setTypingIndicator(true);
            setTimeout(() => setTypingIndicator(false), 8000);
          }
        } catch (error) {
          console.error('Error fetching messages:', error);
        }
      };
      
      fetchMessages();
    }
  }, [selectedConversation, user]);
  
  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current && messages.length > 0) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  // Handle attachment click
  const handleAttachmentClick = (type) => {
    setShowAttachmentOptions(false);
    
    if (type === 'document' || type === 'image') {
      fileInputRef.current.click();
    }
  };
  
  // Handle file selection
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFileToUpload(e.target.files[0]);
    }
  };
  
  // Remove selected file
  const removeSelectedFile = () => {
    setFileToUpload(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // Filter conversations based on search term and filter selection
  const filteredConversations = conversations.filter(conversation => {
    // First filter by conversation filter (all, unread, archived)
    if (conversationFilter === 'unread' && conversation.unread === 0) return false;
    if (conversationFilter === 'archived' && !conversation.isArchived) return false;
    if (conversationFilter === 'all' && conversation.isArchived) return false;
    
    // Then filter by search term
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      return (
        conversation.title.toLowerCase().includes(lowerSearchTerm) ||
        conversation.caseName.toLowerCase().includes(lowerSearchTerm) ||
        conversation.caseNumber.toLowerCase().includes(lowerSearchTerm) ||
        conversation.participants.some(p => 
          p.name.toLowerCase().includes(lowerSearchTerm) ||
          p.role.toLowerCase().includes(lowerSearchTerm)
        )
      );
    }
    
    return true;
  });
  
  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if ((!newMessage.trim() && !fileToUpload) || !selectedConversation) return;
    
    // In a real app, this would send to an API
    const newMessageObj = {
      id: Math.max(...messages.map(m => m.id)) + 1,
      conversationId: selectedConversation.id,
      content: newMessage,
      timestamp: new Date().toISOString(),
      sender: { 
        id: user?.id || 123, 
        name: user?.firstName ? `${user.firstName} ${user.lastName}` : 'John Doe', 
        role: 'client', 
        avatar: null 
      },
      attachments: fileToUpload ? [
        { 
          id: Math.random().toString(36).substring(7), 
          name: fileToUpload.name,
          size: `${(fileToUpload.size / 1024).toFixed(1)} KB`,
          type: fileToUpload.type
        }
      ] : [],
      isRead: true
    };
    
    // Add message to current conversation
    setMessages(prev => [...prev, newMessageObj]);
    
    // Update last message in conversation list
    setConversations(prevConversations => 
      prevConversations.map(conv => 
        conv.id === selectedConversation.id
          ? { 
              ...conv, 
              lastMessage: {
                content: newMessage || 'Sent an attachment',
                timestamp: new Date().toISOString(),
                sender: { 
                  id: user?.id || 123, 
                  name: user?.firstName ? `${user.firstName} ${user.lastName}` : 'John Doe', 
                  role: 'client' 
                }
              }
            }
          : conv
      )
    );
    
    // Clear input and file
    setNewMessage('');
    setFileToUpload(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    // Simulate reply for conversation 1
    if (selectedConversation.id === 1) {
      setTimeout(() => {
        setTypingIndicator(true);
        
        setTimeout(() => {
          setTypingIndicator(false);
          
          const replyMessage = {
            id: Math.max(...messages.map(m => m.id), newMessageObj.id) + 1,
            conversationId: selectedConversation.id,
            content: "Perfect, I'll set up the call for tomorrow at 10:00 AM. You'll receive a calendar invitation shortly with the details.",
            timestamp: new Date().toISOString(),
            sender: { id: 456, name: 'Sarah Nguyen', role: 'attorney', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
            attachments: [],
            isRead: false
          };
          
          setMessages(prev => [...prev, replyMessage]);
          
          setConversations(prevConversations => 
            prevConversations.map(conv => 
              conv.id === selectedConversation.id
                ? { 
                    ...conv, 
                    lastMessage: {
                      content: replyMessage.content,
                      timestamp: new Date().toISOString(),
                      sender: replyMessage.sender
                    },
                    unread: 1
                  }
                : conv
            )
          );
        }, 3000);
      }, 2000);
    }
  };
  
  // Archive/Unarchive conversation
  const toggleArchiveConversation = (e, conversationId) => {
    e.stopPropagation();
    
    setConversations(prevConversations => 
      prevConversations.map(conv => 
        conv.id === conversationId
          ? { ...conv, isArchived: !conv.isArchived }
          : conv
      )
    );
  };
  
  // Format message timestamp
  const formatMessageTime = (timestamp) => {
    try {
      const date = new Date(timestamp);
      
      if (isToday(date)) {
        return format(date, 'h:mm a');
      } else if (isYesterday(date)) {
        return `Yesterday, ${format(date, 'h:mm a')}`;
      } else {
        return format(date, 'MMM d, h:mm a');
      }
    } catch (error) {
      console.error('Error formatting message time:', error);
      return '';
    }
  };
  
  // Format conversation timestamp
  const formatConversationTime = (timestamp) => {
    try {
      const date = new Date(timestamp);
      
      if (isToday(date)) {
        return format(date, 'h:mm a');
      } else if (isYesterday(date)) {
        return 'Yesterday';
      } else {
        return format(date, 'MMM d');
      }
    } catch (error) {
      console.error('Error formatting conversation time:', error);
      return '';
    }
  };
  
  // Get time ago for conversations
  const getTimeAgo = (timestamp) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch (error) {
      console.error('Error calculating time ago:', error);
      return '';
    }
  };
  
  // Get role badge color
  const getRoleBadgeColor = (role) => {
    switch (role.toLowerCase()) {
      case 'attorney':
        return 'bg-blue-100 text-blue-800';
      case 'paralegal':
        return 'bg-purple-100 text-purple-800';
      case 'billing':
        return 'bg-green-100 text-green-800';
      case 'admin':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Group messages by date
  const groupedMessages = messages.reduce((groups, message) => {
    const date = new Date(message.timestamp).toLocaleDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});
  
  // Format date for message groups
  const formatGroupDate = (dateString) => {
    const date = new Date(dateString);
    if (isToday(date)) {
      return 'Today';
    } else if (isYesterday(date)) {
      return 'Yesterday';
    } else {
      return format(date, 'EEEE, MMMM d, yyyy');
    }
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
          <h1 className="text-2xl font-semibold text-gray-900">Messages</h1>
          <div className="mt-4 md:mt-0">
            <Link
              to="/client-portal/messages/new"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#800000] hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
            >
              <HiOutlinePlusCircle className="-ml-1 mr-2 h-5 w-5" />
              New Message
            </Link>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-6">
        <div className="flex flex-col lg:flex-row h-[calc(100vh-12rem)] bg-white rounded-lg shadow overflow-hidden">
          {/* Conversations sidebar - hidden on mobile when viewing a conversation */}
          <div className={`${
            !showMobileConversations ? 'hidden lg:flex' : 'flex'
          } w-full lg:w-80 xl:w-96 border-r border-gray-200 flex-col`}>
            <div className="p-4 border-b border-gray-200 space-y-3">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <HiOutlineSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="focus:ring-[#800000] focus:border-[#800000] block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  placeholder="Search messages or attorneys"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              {/* Filter tabs */}
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-4" aria-label="Tabs">
                  <button
                    onClick={() => setConversationFilter('all')}
                    className={`${
                      conversationFilter === 'all'
                        ? 'border-[#800000] text-[#800000]'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setConversationFilter('unread')}
                    className={`${
                      conversationFilter === 'unread'
                        ? 'border-[#800000] text-[#800000]'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm flex items-center`}
                  >
                    Unread
                    {conversations.filter(c => c.unread > 0).length > 0 && (
                      <span className="ml-1.5 flex-shrink-0 h-5 w-5 flex items-center justify-center rounded-full bg-[#800000] text-white text-xs">
                        {conversations.filter(c => c.unread > 0).length}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => setConversationFilter('archived')}
                    className={`${
                      conversationFilter === 'archived'
                        ? 'border-[#800000] text-[#800000]'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm`}
                  >
                    Archived
                  </button>
                </nav>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {filteredConversations.map((conversation) => {
                    const otherParticipants = conversation.participants.filter(
                      p => p.role !== 'client'
                    );
                    
                    return (
                      <li 
                        key={conversation.id}
                        className={`relative ${
                          selectedConversation?.id === conversation.id ? 'bg-gray-50' : ''
                        } hover:bg-gray-50 cursor-pointer`}
                        onClick={() => {
                          setSelectedConversation(conversation);
                          setShowMobileConversations(false);
                        }}
                      >
                        <div className="px-4 py-4">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center space-x-3 max-w-[70%]">
                              {/* Avatar - first non-client participant */}
                              <div className="flex-shrink-0">
                                {otherParticipants[0]?.avatar ? (
                                  <img 
                                    src={otherParticipants[0].avatar} 
                                    alt={otherParticipants[0].name}
                                    className="h-10 w-10 rounded-full"
                                  />
                                ) : (
                                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                    <HiOutlineUser className="h-6 w-6 text-gray-500" />
                                  </div>
                                )}
                              </div>
                              
                              <div className="min-w-0">
                                <div className="flex items-center">
                                  <p className="text-sm font-medium text-gray-900 truncate">
                                    {conversation.title}
                                  </p>
                                  {conversation.hasPriority && (
                                    <span className="ml-2">
                                      <HiOutlineExclamation className="h-4 w-4 text-red-500" />
                                    </span>
                                  )}
                                </div>
                                
                                <div className="mt-1">
                                  <p className="text-xs text-gray-500 truncate flex items-center">
                                    <HiOutlineOfficeBuilding className="mr-1 h-3 w-3" />
                                    {conversation.caseName} ({conversation.caseNumber})
                                  </p>
                                </div>
                              </div>
                            </div>
                            
                            <div className="text-xs text-gray-500 text-right">
                              <div>{formatConversationTime(conversation.lastMessage.timestamp)}</div>
                              {conversation.unread > 0 && (
                                <span className="inline-flex items-center justify-center mt-1 h-5 w-5 rounded-full bg-[#800000] text-xs font-medium text-white">
                                  {conversation.unread}
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div className="mt-2">
                            <div className="flex items-start">
                              <p className={`text-sm truncate ${conversation.unread > 0 ? 'font-medium text-gray-900' : 'text-gray-500'}`}>
                                {conversation.lastMessage.sender.id === user?.id ? 'You: ' : `${conversation.lastMessage.sender.name.split(' ')[0]}: `}
                                {conversation.lastMessage.content}
                              </p>
                            </div>
                          </div>
                          
                          <div className="mt-2 flex justify-between items-center">
                            <div className="flex space-x-1">
                              {otherParticipants.map((participant, index) => (
                                index < 2 && (
                                  <span 
                                    key={participant.id}
                                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getRoleBadgeColor(participant.role)}`}
                                  >
                                    {participant.name.split(' ')[0]}
                                  </span>
                                )
                              ))}
                              {otherParticipants.length > 2 && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                  +{otherParticipants.length - 2} more
                                </span>
                              )}
                            </div>
                            
                            <div>
                              <button
                                onClick={(e) => toggleArchiveConversation(e, conversation.id)}
                                className="text-gray-400 hover:text-gray-500"
                                title={conversation.isArchived ? "Unarchive" : "Archive"}
                              >
                                <HiOutlineArchive className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center p-4">
                  <div className="bg-gray-100 rounded-full p-3">
                    <HiOutlineFolder className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No messages found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {searchTerm 
                      ? "No messages matching your search."
                      : conversationFilter === 'unread'
                        ? "You have no unread messages."
                        : conversationFilter === 'archived'
                          ? "You have no archived conversations."
                          : "Get started by creating a new message."}
                  </p>
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="mt-4 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 rounded-md text-[#800000] bg-white hover:bg-gray-100"
                    >
                      Clear search
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* Message content */}
          <div className={`${
            showMobileConversations ? 'hidden lg:flex' : 'flex'
          } flex-1 flex-col bg-gray-50`}>
            {selectedConversation ? (
              <>
                {/* Conversation header */}
                <div className="flex justify-between items-center px-4 sm:px-6 py-3 border-b border-gray-200 bg-white shadow-sm">
                  <div className="flex items-center">
                    <button
                      className="lg:hidden mr-2 text-gray-500 hover:text-gray-700"
                      onClick={() => setShowMobileConversations(true)}
                    >
                      <HiOutlineChevronLeft className="h-6 w-6" />
                    </button>
                    
                    <div className="flex items-center">
                      {/* Avatar of primary attorney */}
                      <div className="flex-shrink-0 mr-3">
                        {selectedConversation.participants.find(p => p.role === 'attorney')?.avatar ? (
                          <img 
                            src={selectedConversation.participants.find(p => p.role === 'attorney')?.avatar} 
                            alt="Attorney"
                            className="h-10 w-10 rounded-full"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <HiOutlineUser className="h-6 w-6 text-gray-500" />
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <h2 className="text-lg font-medium text-gray-900">{selectedConversation.title}</h2>
                        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
                          <div className="flex items-center">
                            <HiOutlineOfficeBuilding className="mr-1 h-4 w-4" />
                            <span>{selectedConversation.caseName}</span>
                          </div>
                          <span>•</span>
                          <div>
                            {selectedConversation.participants
                              .filter(p => p.role !== 'client')
                              .map(p => p.name)
                              .join(', ')}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100"
                      title="Schedule a call"
                    >
                      <HiOutlinePhone className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100"
                      title="Schedule a video conference"
                    >
                      <HiOutlineVideoCamera className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100"
                      title="Schedule a meeting"
                    >
                      <HiOutlineCalendar className="h-5 w-5" />
                    </button>
                    <div className="relative">
                      <button
                        type="button"
                        className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100"
                        title="More options"
                      >
                        <HiOutlineDotsVertical className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Messages */}
                <div 
                  className="flex-1 p-4 overflow-y-auto"
                  ref={messageContainerRef}
                >
                  {Object.keys(groupedMessages).length > 0 ? (
                    <div className="space-y-6">
                      {Object.entries(groupedMessages).map(([date, msgs]) => (
                        <div key={date}>
                          {/* Date separator */}
                          <div className="relative py-3">
                            <div className="absolute inset-0 flex items-center">
                              <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center">
                              <span className="px-3 bg-gray-50 text-sm text-gray-500">
                                {formatGroupDate(date)}
                              </span>
                            </div>
                          </div>
                          
                          {/* Messages for this date */}
                          <div className="space-y-4">
                            {msgs.map((message, index) => {
                              const isCurrentUser = message.sender.id === user?.id;
                              const showSender = index === 0 || msgs[index - 1].sender.id !== message.sender.id;
                              
                              return (
                                <div 
                                  key={message.id} 
                                  className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                                >
                                  <div className={`max-w-[80%] sm:max-w-[70%] rounded-lg shadow-sm ${
                                    isCurrentUser 
                                      ? 'bg-[#800000] text-white rounded-br-none' 
                                      : 'bg-white text-gray-900 rounded-bl-none'
                                  }`}>
                                    {/* Sender info - only show when sender changes */}
                                    {showSender && !isCurrentUser && (
                                      <div className="flex items-center px-4 pt-3 pb-1">
                                        <div className="flex-shrink-0 mr-2">
                                          {message.sender.avatar ? (
                                            <img 
                                              src={message.sender.avatar} 
                                              alt={message.sender.name}
                                              className="h-6 w-6 rounded-full"
                                            />
                                          ) : (
                                            <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center">
                                              <HiOutlineUser className="h-4 w-4 text-gray-500" />
                                            </div>
                                          )}
                                        </div>
                                        <div className="flex items-center">
                                          <span className={`text-sm font-medium ${isCurrentUser ? 'text-gray-200' : 'text-gray-900'}`}>
                                            {message.sender.name}
                                          </span>
                                          <span className={`ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getRoleBadgeColor(message.sender.role)}`}>
                                            {message.sender.role}
                                          </span>
                                        </div>
                                      </div>
                                    )}
                                    
                                    <div className="px-4 py-3">
                                      {/* Message content */}
                                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                      
                                      {/* Attachments */}
                                      {message.attachments && message.attachments.length > 0 && (
                                        <div className={`mt-2 pt-2 ${isCurrentUser ? 'border-t border-[#9a3232]' : 'border-t border-gray-200'}`}>
                                          <div className="flex items-center">
                                            <p className={`text-xs ${isCurrentUser ? 'text-gray-200' : 'text-gray-500'}`}>
                                              Attachments:
                                            </p>
                                          </div>
                                          <ul className="mt-1 space-y-1">
                                            {message.attachments.map((attachment) => (
                                              <li key={attachment.id} className="group">
                                                <a
                                                  href={`#attachment-${attachment.id}`}
                                                  className={`text-xs flex items-center p-1 rounded ${
                                                    isCurrentUser 
                                                      ? 'text-gray-100 hover:text-white hover:bg-[#9a3232]' 
                                                      : 'text-[#800000] hover:text-[#600000] hover:bg-gray-100'
                                                  }`}
                                                  target="_blank"
                                                  rel="noopener noreferrer"
                                                >
                                                  {attachment.type.includes('image') ? (
                                                    <HiOutlinePhotograph className="h-4 w-4 mr-1" />
                                                  ) : (
                                                    <HiOutlineDocumentText className="h-4 w-4 mr-1" />
                                                  )}
                                                  <span className="truncate max-w-[200px]">{attachment.name}</span>
                                                  <span className="ml-1">({attachment.size})</span>
                                                  <HiOutlineDownload className={`ml-1 h-4 w-4 opacity-0 group-hover:opacity-100 ${
                                                    isCurrentUser ? 'text-gray-200' : 'text-gray-500'
                                                  }`} />
                                                </a>
                                              </li>
                                            ))}
                                          </ul>
                                        </div>
                                      )}
                                      
                                      {/* Message timestamp */}
                                      <div className={`mt-1 flex justify-end items-center text-xs ${
                                        isCurrentUser ? 'text-gray-200' : 'text-gray-500'
                                      }`}>
                                        <span>{formatMessageTime(message.timestamp)}</span>
                                        {isCurrentUser && (
                                          <span className="ml-1">
                                            {!message.isRead ? (
                                              <HiOutlineCheckCircle className="h-3 w-3 text-gray-300" />
                                            ) : (
                                              <HiOutlineCheckCircle className="h-3 w-3 text-green-500" />
                                            )}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center p-4">
                      <div className="bg-gray-100 rounded-full p-3">
                        <HiOutlineInformationCircle className="h-8 w-8 text-gray-400" />
                      </div>
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No messages yet</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Start the conversation by sending a message.
                      </p>
                    </div>
                  )}
                  
                  {/* Typing indicator */}
                  {typingIndicator && (
                    <div className="flex justify-start mt-4">
                      <div className="bg-white rounded-lg shadow-sm p-3 rounded-bl-none">
                        <div className="flex items-center space-x-2">
                          <div className="flex-shrink-0">
                            <img 
                              src={selectedConversation.participants.find(p => p.role === 'attorney')?.avatar} 
                              alt="Attorney"
                              className="h-6 w-6 rounded-full"
                            />
                          </div>
                          <div className="typing-indicator">
                            <span></span>
                            <span></span>
                            <span></span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
                
                {/* Message input */}
                <div className="px-4 py-3 bg-white border-t border-gray-200">
                  {fileToUpload && (
                    <div className="mb-2 p-2 bg-gray-50 rounded-md border border-gray-200 flex justify-between items-center">
                      <div className="flex items-center">
                        {fileToUpload.type.includes('image') ? (
                          <HiOutlinePhotograph className="h-5 w-5 text-gray-500 mr-2" />
                        ) : (
                          <HiOutlineDocumentText className="h-5 w-5 text-gray-500 mr-2" />
                        )}
                        <span className="text-sm text-gray-700 truncate max-w-[200px]">{fileToUpload.name}</span>
                        <span className="ml-2 text-xs text-gray-500">
                          ({(fileToUpload.size / 1024).toFixed(1)} KB)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={removeSelectedFile}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <HiOutlineX className="h-5 w-5" />
                      </button>
                    </div>
                  )}
                  
                  <form onSubmit={handleSendMessage} className="relative">
                    <div className="flex space-x-3">
                      <div className="flex-1 relative">
                        <textarea
                          rows="2"
                          className="shadow-sm block w-full focus:ring-[#800000] focus:border-[#800000] sm:text-sm border border-gray-300 rounded-md pl-3 pr-10 py-2"
                          placeholder="Type a message..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                        ></textarea>
                        
                        <div className="absolute right-2 bottom-2 flex space-x-1">
                          <div className="relative">
                            <button
                              type="button"
                              className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                              onClick={() => setShowAttachmentOptions(!showAttachmentOptions)}
                            >
                              <HiOutlinePaperClip className="h-5 w-5" />
                            </button>
                            
                            {/* Attachment options popup */}
                            {showAttachmentOptions && (
                              <div className="absolute bottom-full right-0 mb-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                                <button
                                  type="button"
                                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                  onClick={() => handleAttachmentClick('document')}
                                >
                                  <HiOutlineDocumentText className="mr-2 h-5 w-5 text-gray-500" />
                                  Attach Document
                                </button>
                                <button
                                  type="button"
                                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                  onClick={() => handleAttachmentClick('image')}
                                >
                                  <HiOutlinePhotograph className="mr-2 h-5 w-5 text-gray-500" />
                                  Attach Image
                                </button>
                              </div>
                            )}
                            
                            {/* Hidden file input */}
                            <input
                              type="file"
                              ref={fileInputRef}
                              className="hidden"
                              onChange={handleFileChange}
                            />
                          </div>
                          
                          <button
                            type="button"
                            className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                          >
                            <HiOutlineEmojiHappy className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex-shrink-0 self-end">
                        <button
                          type="submit"
                          className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                            !newMessage.trim() && !fileToUpload
                              ? 'bg-gray-400 cursor-not-allowed'
                              : 'bg-[#800000] hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]'
                          }`}
                          disabled={!newMessage.trim() && !fileToUpload}
                        >
                          <HiOutlinePaperAirplane className="h-5 w-5 mr-1 transform rotate-90" />
                          Send
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <div className="bg-gray-100 p-6 rounded-full mb-4">
                  <HiOutlineChat className="h-16 w-16 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">No conversation selected</h3>
                <p className="mt-1 text-base text-gray-500 max-w-md">
                  Select a conversation from the list or start a new message to communicate with your legal team.
                </p>
                <Link
                  to="/client-portal/messages/new"
                  className="mt-6 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#800000] hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                >
                  <HiOutlinePlusCircle className="-ml-1 mr-2 h-5 w-5" />
                  New Message
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* CSS for typing indicator */}
      <style jsx="true">{`
        .typing-indicator {
          display: inline-flex;
          align-items: center;
        }
        
        .typing-indicator span {
          height: 8px;
          width: 8px;
          background-color: #9CA3AF;
          border-radius: 50%;
          display: inline-block;
          margin: 0 1px;
          opacity: 0.6;
          animation: typing 1s infinite ease-in-out;
        }
        
        .typing-indicator span:nth-child(1) {
          animation-delay: 0s;
        }
        
        .typing-indicator span:nth-child(2) {
          animation-delay: 0.2s;
        }
        
        .typing-indicator span:nth-child(3) {
          animation-delay: 0.4s;
        }
        
        @keyframes typing {
          0%, 60%, 100% {
            transform: translateY(0);
          }
          30% {
            transform: translateY(-5px);
          }
        }
      `}</style>
    </div>
  );
};
 
export default ClientMessagesPage;