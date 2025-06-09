import React, { useState, useEffect, useRef, Fragment } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { format, formatDistanceToNow, isToday, isYesterday, parseISO } from 'date-fns';
import { Dialog, Transition, Menu, Popover } from '@headlessui/react';
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
  HiOutlineDownload,
  HiOutlineUserGroup,
  HiOutlineTemplate,
  HiOutlineClipboardCheck,
  HiOutlineTag,
  HiOutlineFlag,
  HiOutlineStar,
  HiOutlineMenuAlt2,
  HiOutlineFilter,
  HiOutlineClipboardList,
  HiOutlineRefresh,
  HiOutlineArrowRight,
  HiChevronDown,
  HiChevronUp,
  HiOutlinePlus,
  HiOutlineUserCircle,
  HiOutlineDocumentSearch,
  HiOutlineDocumentAdd,
  HiOutlineExternalLink,
  HiOutlineStatusOnline,
  HiOutlineThumbUp,
  HiOutlineClock,
  HiOutlineMail,
  HiOutlineUsers,
  HiOutlineCloudUpload,
  HiOutlineCheck,
  HiOutlineInboxIn
} from 'react-icons/hi';

const AttorneyMessagesPage = () => {
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
  const [conversationFilter, setConversationFilter] = useState('all'); // 'all', 'unread', 'priority', 'archived'
  const [isNewMessageModalOpen, setIsNewMessageModalOpen] = useState(false);
  const [newConversation, setNewConversation] = useState({
    clientId: '',
    caseId: '',
    subject: '',
    initialMessage: '',
    attachment: null
  });
  const [clients, setClients] = useState([]);
  const [cases, setCases] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [showTemplates, setShowTemplates] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    content: '',
    category: 'general'
  });
  const [showSidebar, setShowSidebar] = useState(false);
  const [isBulkMessageModalOpen, setIsBulkMessageModalOpen] = useState(false);
  const [selectedClients, setSelectedClients] = useState([]);
  const [bulkMessage, setBulkMessage] = useState({
    subject: '',
    message: '',
    caseId: '',
    attachment: null
  });
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'clients', 'team', 'other'
  const [isSending, setIsSending] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showAttachmentPreview, setShowAttachmentPreview] = useState(false);
  const [previewAttachment, setPreviewAttachment] = useState(null);
  
  // For responsive design
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const isMobile = windowWidth < 640;
  const isTablet = windowWidth >= 640 && windowWidth < 1024;
  const isDesktop = windowWidth >= 1024;
  
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const messageContainerRef = useRef(null);
  const bulkFileInputRef = useRef(null);
  const templateFileInputRef = useRef(null);
  const searchInputRef = useRef(null);
  
  // Get current date for realistic timestamps
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const lastWeek = new Date(today);
  lastWeek.setDate(lastWeek.getDate() - 7);

  // Window resize listener for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl/Cmd + K to focus search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }
      
      // Esc to clear search or close modals
      if (e.key === 'Escape') {
        if (isSearchFocused) {
          setSearchTerm('');
          if (searchInputRef.current) {
            searchInputRef.current.blur();
          }
          setIsSearchFocused(false);
        } else if (isNewMessageModalOpen) {
          setIsNewMessageModalOpen(false);
        } else if (isBulkMessageModalOpen) {
          setIsBulkMessageModalOpen(false);
        } else if (showTemplates) {
          setShowTemplates(false);
        }
      }
      
      // Ctrl/Cmd + N to create new message
      if ((e.ctrlKey || e.metaKey) && e.key === 'n' && !isNewMessageModalOpen) {
        e.preventDefault();
        setIsNewMessageModalOpen(true);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchFocused, isNewMessageModalOpen, isBulkMessageModalOpen, showTemplates]);

  // Fetch clients, cases, and templates for new conversation modal
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Mock clients data
        const mockClients = [
          { 
            id: 'client1', 
            name: 'John Doe', 
            email: 'john.doe@example.com', 
            phone: '(555) 123-4567', 
            avatar: null,
            status: 'Active',
            lastActive: new Date(today.setHours(today.getHours() - 2)).toISOString()
          },
          { 
            id: 'client2', 
            name: 'Jane Smith', 
            email: 'jane.smith@example.com', 
            phone: '(555) 234-5678', 
            avatar: 'https://randomuser.me/api/portraits/women/22.jpg',
            status: 'Active',
            lastActive: new Date(today.setMinutes(today.getMinutes() - 15)).toISOString()
          },
          { 
            id: 'client3', 
            name: 'Michael Johnson', 
            email: 'michael.johnson@example.com', 
            phone: '(555) 345-6789', 
            avatar: 'https://randomuser.me/api/portraits/men/23.jpg',
            status: 'Active',
            lastActive: new Date(today.setHours(today.getHours() - 1)).toISOString()
          },
          { 
            id: 'client4', 
            name: 'Emily Williams', 
            email: 'emily.williams@example.com', 
            phone: '(555) 456-7890', 
            avatar: 'https://randomuser.me/api/portraits/women/24.jpg',
            status: 'Active',
            lastActive: yesterday.toISOString()
          },
          { 
            id: 'client5', 
            name: 'Robert Brown', 
            email: 'robert.brown@example.com', 
            phone: '(555) 567-8901', 
            avatar: 'https://randomuser.me/api/portraits/men/25.jpg',
            status: 'Inactive',
            lastActive: lastWeek.toISOString()
          },
        ];
        
        // Mock cases data
        const mockCases = [
          { id: 'case1', number: 'PI-2025-1452', name: 'Smith v. Johnson', clientId: 'client2', type: 'Personal Injury', status: 'Active', dueDate: new Date(today.setDate(today.getDate() + 30)).toISOString() },
          { id: 'case2', number: 'PR-2025-0783', name: 'Estate of Williams', clientId: 'client4', type: 'Probate', status: 'Active', dueDate: new Date(today.setDate(today.getDate() + 45)).toISOString() },
          { id: 'case3', number: 'EP-2025-0342', name: 'Tucker Estate Planning', clientId: 'client1', type: 'Estate Planning', status: 'Active', dueDate: new Date(today.setDate(today.getDate() + 15)).toISOString() },
          { id: 'case4', number: 'FL-2025-0592', name: 'Jones Divorce', clientId: 'client3', type: 'Family Law', status: 'Active', dueDate: new Date(today.setDate(today.getDate() + 7)).toISOString() },
          { id: 'case5', number: 'RE-2025-0952', name: 'Brown Property Dispute', clientId: 'client5', type: 'Real Estate', status: 'Closed', dueDate: null },
        ];
        
        // Mock message templates
        const mockTemplates = [
          { 
            id: 'template1', 
            name: 'Initial Consultation Follow-up', 
            content: 'Thank you for meeting with me today to discuss your case. As we discussed, the next steps are:\n\n1. [First action item]\n2. [Second action item]\n3. [Third action item]\n\nPlease let me know if you have any questions or concerns. I look forward to working with you.',
            category: 'general'
          },
          { 
            id: 'template2', 
            name: 'Document Request', 
            content: 'To proceed with your case, I need the following documents:\n\n1. [Document 1]\n2. [Document 2]\n3. [Document 3]\n\nPlease upload these to the client portal or reply to this message with the documents attached at your earliest convenience.',
            category: 'requests'
          },
          { 
            id: 'template3', 
            name: 'Case Status Update', 
            content: 'I wanted to provide you with an update on your case. We have [recent development]. The next steps in your case will be:\n\n1. [Next step]\n2. [Following step]\n\nThe expected timeline for these steps is [timeframe]. Please let me know if you have any questions.',
            category: 'updates'
          },
          { 
            id: 'template4', 
            name: 'Court Date Reminder', 
            content: 'This is a reminder that we have a court appearance scheduled for [Date] at [Time] at [Court Location]. Please plan to arrive 30 minutes early so we can review any last-minute details. Let me know if you have any questions or concerns before the court date.',
            category: 'reminders'
          },
          { 
            id: 'template5', 
            name: 'Settlement Offer Discussion', 
            content: 'We have received a settlement offer of [Amount] from the opposing party. Based on my analysis, this offer [assessment of offer]. I would like to discuss this with you and review your options. Please let me know when you are available for a call to discuss this further.',
            category: 'settlement'
          }
        ];
        
        setClients(mockClients);
        setCases(mockCases);
        setTemplates(mockTemplates);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    
    fetchData();
  }, []);
  
  // Fetch conversations
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        // Mock data with realistic timestamps
        const mockConversations = [
          {
            id: 1,
            title: 'Case Update: Smith v. Johnson',
            caseId: 'case1',
            caseName: 'Smith v. Johnson',
            caseNumber: 'PI-2025-1452',
            participants: [
              { id: 'attorney1', name: user?.displayName || 'Sarah Nguyen', role: 'attorney', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
              { id: 'client2', name: 'Jane Smith', role: 'client', avatar: 'https://randomuser.me/api/portraits/women/22.jpg' }
            ],
            lastMessage: {
              content: 'Yes, I\'m available tomorrow at 10:00 AM or 2:00 PM. Which time works better for you?',
              timestamp: new Date(today.setMinutes(today.getMinutes() - 5)).toISOString(),
              sender: { id: 'attorney1', name: user?.displayName || 'Sarah Nguyen', role: 'attorney' }
            },
            unread: 0,
            isArchived: false,
            hasPriority: true,
            tags: ['urgent', 'deposition'],
            category: 'clients'
          },
          {
            id: 2,
            title: 'Document Review Request',
            caseId: 'case2',
            caseName: 'Estate of Williams',
            caseNumber: 'PR-2025-0783',
            participants: [
              { id: 'attorney1', name: user?.displayName || 'Sarah Nguyen', role: 'attorney', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
              { id: 'client4', name: 'Emily Williams', role: 'client', avatar: 'https://randomuser.me/api/portraits/women/24.jpg' }
            ],
            lastMessage: {
              content: 'Please review the attached contract and let me know your thoughts.',
              timestamp: yesterday.toISOString(),
              sender: { id: 'attorney1', name: user?.displayName || 'Sarah Nguyen', role: 'attorney' }
            },
            unread: 1,
            isArchived: false,
            hasPriority: false,
            tags: ['document review'],
            category: 'clients'
          },
          {
            id: 3,
            title: 'Estate Planning Consultation',
            caseId: 'case3',
            caseName: 'Tucker Estate Planning',
            caseNumber: 'EP-2025-0342',
            participants: [
              { id: 'attorney1', name: user?.displayName || 'Sarah Nguyen', role: 'attorney', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
              { id: 'client1', name: 'John Doe', role: 'client', avatar: null },
              { id: 'paralegal1', name: 'Robert Chen', role: 'paralegal', avatar: 'https://randomuser.me/api/portraits/men/75.jpg' }
            ],
            lastMessage: {
              content: 'Thank you for your time today. I\'ve attached the estate planning documents we discussed.',
              timestamp: lastWeek.toISOString(),
              sender: { id: 'attorney1', name: user?.displayName || 'Sarah Nguyen', role: 'attorney' }
            },
            unread: 0,
            isArchived: false,
            hasPriority: false,
            tags: ['estate planning', 'documents'],
            category: 'clients'
          },
          {
            id: 4,
            title: 'Firm Meeting Notes',
            caseId: null,
            caseName: null,
            caseNumber: null,
            participants: [
              { id: 'attorney1', name: user?.displayName || 'Sarah Nguyen', role: 'attorney', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
              { id: 'attorney2', name: 'Michael Brown', role: 'attorney', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
              { id: 'attorney3', name: 'Jessica Taylor', role: 'attorney', avatar: 'https://randomuser.me/api/portraits/women/68.jpg' }
            ],
            lastMessage: {
              content: 'Here are the meeting notes from yesterday\'s firm meeting. Please review the new case assignment section.',
              timestamp: new Date(today.setDate(today.getDate() - 2)).toISOString(),
              sender: { id: 'attorney3', name: 'Jessica Taylor', role: 'attorney' }
            },
            unread: 0,
            isArchived: false,
            hasPriority: false,
            tags: ['internal', 'firm meeting'],
            category: 'team'
          },
          {
            id: 5,
            title: 'Case Closed: Brown Property Dispute',
            caseId: 'case5',
            caseName: 'Brown Property Dispute',
            caseNumber: 'RE-2025-0952',
            participants: [
              { id: 'attorney1', name: user?.displayName || 'Sarah Nguyen', role: 'attorney', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
              { id: 'client5', name: 'Robert Brown', role: 'client', avatar: 'https://randomuser.me/api/portraits/men/25.jpg' }
            ],
            lastMessage: {
              content: 'We\'ve successfully closed your case. All documents have been finalized and filed with the court.',
              timestamp: new Date(today.setDate(today.getDate() - 30)).toISOString(),
              sender: { id: 'attorney1', name: user?.displayName || 'Sarah Nguyen', role: 'attorney' }
            },
            unread: 0,
            isArchived: true,
            hasPriority: false,
            tags: ['closed', 'real estate'],
            category: 'clients'
          },
          {
            id: 6,
            title: 'Divorce Proceedings: Jones',
            caseId: 'case4',
            caseName: 'Jones Divorce',
            caseNumber: 'FL-2025-0592',
            participants: [
              { id: 'attorney1', name: user?.displayName || 'Sarah Nguyen', role: 'attorney', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
              { id: 'client3', name: 'Michael Johnson', role: 'client', avatar: 'https://randomuser.me/api/portraits/men/23.jpg' }
            ],
            lastMessage: {
              content: 'I just received the financial disclosure from the opposing party. Let\'s schedule a call to discuss next steps.',
              timestamp: new Date(today.setHours(today.getHours() - 4)).toISOString(),
              sender: { id: 'attorney1', name: user?.displayName || 'Sarah Nguyen', role: 'attorney' }
            },
            unread: 0,
            isArchived: false,
            hasPriority: true,
            tags: ['divorce', 'urgent'],
            category: 'clients'
          },
          {
            id: 7,
            title: 'Expert Witness Coordination',
            caseId: 'case1',
            caseName: 'Smith v. Johnson',
            caseNumber: 'PI-2025-1452',
            participants: [
              { id: 'attorney1', name: user?.displayName || 'Sarah Nguyen', role: 'attorney', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
              { id: 'expert1', name: 'Dr. James Wilson', role: 'expert witness', avatar: null }
            ],
            lastMessage: {
              content: 'Thank you for sending over the case files. I\'ve reviewed them and can confirm I\'m available to testify on the proposed date.',
              timestamp: new Date(today.setDate(today.getDate() - 3)).toISOString(),
              sender: { id: 'expert1', name: 'Dr. James Wilson', role: 'expert witness' }
            },
            unread: 1,
            isArchived: false,
            hasPriority: false,
            tags: ['expert witness', 'testimony'],
            category: 'other'
          },
          {
            id: 8,
            title: 'Paralegal Updates',
            caseId: null,
            caseName: null,
            caseNumber: null,
            participants: [
              { id: 'attorney1', name: user?.displayName || 'Sarah Nguyen', role: 'attorney', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
              { id: 'paralegal1', name: 'Robert Chen', role: 'paralegal', avatar: 'https://randomuser.me/api/portraits/men/75.jpg' },
              { id: 'paralegal2', name: 'Lisa Martinez', role: 'paralegal', avatar: 'https://randomuser.me/api/portraits/women/45.jpg' }
            ],
            lastMessage: {
              content: 'I\'ve prepared the drafts for the Johnson, Williams, and Brown cases. They\'re ready for your review.',
              timestamp: new Date(today.setMinutes(today.getMinutes() - 45)).toISOString(),
              sender: { id: 'paralegal1', name: 'Robert Chen', role: 'paralegal' }
            },
            unread: 0,
            isArchived: false,
            hasPriority: false,
            tags: ['drafts', 'internal'],
            category: 'team'
          },
        ];
        
        setConversations(mockConversations);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching conversations:', error);
        setLoading(false);
      }
    };
    
    fetchConversations();
  }, [user]);
  
  // Fetch messages for selected conversation
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedConversation) return;
      
      try {
        // Simulate loading
        setLoading(true);
        
        // Mock messages for each conversation
        const mockMessages = {
          1: [
            {
              id: 1,
              conversationId: 1,
              content: 'Good morning Jane, I wanted to check in on your deposition preparation. Have you had a chance to review the documents I sent last week?',
              timestamp: new Date(today.setHours(today.getHours() - 26)).toISOString(),
              sender: { id: 'attorney1', name: user?.displayName || 'Sarah Nguyen', role: 'attorney', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
              attachments: [],
              isRead: true
            },
            {
              id: 2,
              conversationId: 1,
              content: 'Hello Sarah, yes I have reviewed them. I still have a few questions about what to expect during the deposition though.',
              timestamp: new Date(today.setHours(today.getHours() + 2)).toISOString(),
              sender: { id: 'client2', name: 'Jane Smith', role: 'client', avatar: 'https://randomuser.me/api/portraits/women/22.jpg' },
              attachments: [],
              isRead: true
            },
            {
              id: 3,
              conversationId: 1,
              content: 'That\'s perfectly normal. Would you like to schedule a call so we can discuss your questions in detail? I have availability tomorrow at 10:00 AM or 2:00 PM.',
              timestamp: new Date(today.setHours(today.getHours() + 1)).toISOString(),
              sender: { id: 'attorney1', name: user?.displayName || 'Sarah Nguyen', role: 'attorney', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
              attachments: [],
              isRead: true
            },
            {
              id: 4,
              conversationId: 1,
              content: 'Yes, I\'m available tomorrow at 10:00 AM or 2:00 PM. Which time works better for you?',
              timestamp: new Date(today.setMinutes(today.getMinutes() - 5)).toISOString(),
              sender: { id: 'attorney1', name: user?.displayName || 'Sarah Nguyen', role: 'attorney', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
              attachments: [],
              isRead: true
            }
          ],
          2: [
            {
              id: 5,
              conversationId: 2,
              content: 'Hello Emily, I hope you\'re well. I\'m sending over the estate planning documents for your review.',
              timestamp: new Date(yesterday.setHours(yesterday.getHours() - 24)).toISOString(),
              sender: { id: 'attorney1', name: user?.displayName || 'Sarah Nguyen', role: 'attorney', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
              attachments: [
                { id: 'doc1', name: 'Estate_Will_Draft.pdf', size: '1.2 MB', type: 'application/pdf' }
              ],
              isRead: true
            },
            {
              id: 6,
              conversationId: 2,
              content: 'Please review the attached contract and let me know your thoughts.',
              timestamp: yesterday.toISOString(),
              sender: { id: 'attorney1', name: user?.displayName || 'Sarah Nguyen', role: 'attorney', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
              attachments: [
                { id: 'doc2', name: 'Contract_Review.pdf', size: '2.4 MB', type: 'application/pdf' }
              ],
              isRead: false
            }
          ],
          3: [
            {
              id: 7,
              conversationId: 3,
              content: 'Hello John, it was great meeting with you today to discuss your estate planning needs. As discussed, I\'ve prepared a summary of our conversation and next steps.',
              timestamp: lastWeek.toISOString(),
              sender: { id: 'attorney1', name: user?.displayName || 'Sarah Nguyen', role: 'attorney', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
              attachments: [
                { id: 'doc3', name: 'Estate_Planning_Summary.pdf', size: '1.8 MB', type: 'application/pdf' }
              ],
              isRead: true
            },
            {
              id: 8,
              conversationId: 3,
              content: 'Thank you for your time today. I\'ve attached the estate planning documents we discussed.',
              timestamp: lastWeek.toISOString(),
              sender: { id: 'attorney1', name: user?.displayName || 'Sarah Nguyen', role: 'attorney', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
              attachments: [
                { id: 'doc4', name: 'Will_Template.pdf', size: '1.5 MB', type: 'application/pdf' },
                { id: 'doc5', name: 'Trust_Documents.pdf', size: '2.7 MB', type: 'application/pdf' }
              ],
              isRead: true
            }
          ],
          4: [
            {
              id: 9,
              conversationId: 4,
              content: 'Good afternoon team, I\'ve compiled the notes from today\'s firm meeting.',
              timestamp: new Date(today.setDate(today.getDate() - 2)).toISOString(),
              sender: { id: 'attorney3', name: 'Jessica Taylor', role: 'attorney', avatar: 'https://randomuser.me/api/portraits/women/68.jpg' },
              attachments: [
                { id: 'doc6', name: 'Firm_Meeting_Notes.pdf', size: '1.1 MB', type: 'application/pdf' }
              ],
              isRead: true
            },
            {
              id: 10,
              conversationId: 4,
              content: 'Here are the meeting notes from yesterday\'s firm meeting. Please review the new case assignment section.',
              timestamp: new Date(today.setDate(today.getDate() - 2)).toISOString(),
              sender: { id: 'attorney3', name: 'Jessica Taylor', role: 'attorney', avatar: 'https://randomuser.me/api/portraits/women/68.jpg' },
              attachments: [],
              isRead: true
            }
          ],
          5: [
            {
              id: 11,
              conversationId: 5,
              content: 'Mr. Brown, I\'m pleased to inform you that we\'ve reached a successful resolution in your property dispute case.',
              timestamp: new Date(today.setDate(today.getDate() - 35)).toISOString(),
              sender: { id: 'attorney1', name: user?.displayName || 'Sarah Nguyen', role: 'attorney', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
              attachments: [],
              isRead: true
            },
            {
              id: 12,
              conversationId: 5,
              content: 'We\'ve successfully closed your case. All documents have been finalized and filed with the court.',
              timestamp: new Date(today.setDate(today.getDate() - 30)).toISOString(),
              sender: { id: 'attorney1', name: user?.displayName || 'Sarah Nguyen', role: 'attorney', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
              attachments: [
                { id: 'doc7', name: 'Final_Court_Order.pdf', size: '3.2 MB', type: 'application/pdf' },
                { id: 'doc8', name: 'Case_Closure_Documents.pdf', size: '2.9 MB', type: 'application/pdf' }
              ],
              isRead: true
            }
          ],
          6: [
            {
              id: 13,
              conversationId: 6,
              content: 'Hello Michael, I hope you\'re doing well today. I wanted to provide an update on your divorce proceedings.',
              timestamp: new Date(today.setHours(today.getHours() - 8)).toISOString(),
              sender: { id: 'attorney1', name: user?.displayName || 'Sarah Nguyen', role: 'attorney', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
              attachments: [],
              isRead: true
            },
            {
              id: 14,
              conversationId: 6,
              content: 'I just received the financial disclosure from the opposing party. Let\'s schedule a call to discuss next steps.',
              timestamp: new Date(today.setHours(today.getHours() - 4)).toISOString(),
              sender: { id: 'attorney1', name: user?.displayName || 'Sarah Nguyen', role: 'attorney', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
              attachments: [
                { id: 'doc9', name: 'Financial_Disclosure.pdf', size: '4.5 MB', type: 'application/pdf' }
              ],
              isRead: true
            }
          ],
          7: [
            {
              id: 15,
              conversationId: 7,
              content: 'Dr. Wilson, I hope this message finds you well. I\'m reaching out regarding the Smith v. Johnson case. We believe your expertise would be valuable for the upcoming trial.',
              timestamp: new Date(today.setDate(today.getDate() - 5)).toISOString(),
              sender: { id: 'attorney1', name: user?.displayName || 'Sarah Nguyen', role: 'attorney', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
              attachments: [
                { id: 'doc10', name: 'Case_Summary.pdf', size: '2.2 MB', type: 'application/pdf' }
              ],
              isRead: true
            },
            {
              id: 16,
              conversationId: 7,
              content: 'Thank you for sending over the case files. I\'ve reviewed them and can confirm I\'m available to testify on the proposed date.',
              timestamp: new Date(today.setDate(today.getDate() - 3)).toISOString(),
              sender: { id: 'expert1', name: 'Dr. James Wilson', role: 'expert witness', avatar: null },
              attachments: [],
              isRead: false
            }
          ],
          8: [
            {
              id: 17,
              conversationId: 8,
              content: 'Hello Sarah, I wanted to update you on the progress of the case drafts you requested last week.',
              timestamp: new Date(today.setHours(today.getHours() - 5)).toISOString(),
              sender: { id: 'paralegal1', name: 'Robert Chen', role: 'paralegal', avatar: 'https://randomuser.me/api/portraits/men/75.jpg' },
              attachments: [],
              isRead: true
            },
            {
              id: 18,
              conversationId: 8,
              content: 'I\'ve prepared the drafts for the Johnson, Williams, and Brown cases. They\'re ready for your review.',
              timestamp: new Date(today.setMinutes(today.getMinutes() - 45)).toISOString(),
              sender: { id: 'paralegal1', name: 'Robert Chen', role: 'paralegal', avatar: 'https://randomuser.me/api/portraits/men/75.jpg' },
              attachments: [
                { id: 'doc11', name: 'Johnson_Draft.pdf', size: '1.7 MB', type: 'application/pdf' },
                { id: 'doc12', name: 'Williams_Draft.pdf', size: '2.1 MB', type: 'application/pdf' },
                { id: 'doc13', name: 'Brown_Draft.pdf', size: '1.9 MB', type: 'application/pdf' }
              ],
              isRead: true
            }
          ]
        };
        
        // Set messages for the selected conversation
        const conversationMessages = mockMessages[selectedConversation.id] || [];
        setMessages(conversationMessages);
        
        // If there are unread messages, mark them as read
        if (selectedConversation.unread > 0) {
          setConversations(prevConversations =>
            prevConversations.map(conv =>
              conv.id === selectedConversation.id ? { ...conv, unread: 0 } : conv
            )
          );
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching messages:', error);
        setLoading(false);
      }
    };
    
    fetchMessages();
  }, [selectedConversation, user]);
  
  // Scroll to bottom of messages when new message is added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, typingIndicator]);
  
  // Clear success message after timeout
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [successMessage]);
  
  // Filter conversations based on search term, active tab, and conversation filter
  const filteredConversations = conversations.filter(conversation => {
    // Filter by search term
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      conversation.title.toLowerCase().includes(searchLower) ||
      conversation.participants.some(p => p.name.toLowerCase().includes(searchLower)) ||
      (conversation.caseName && conversation.caseName.toLowerCase().includes(searchLower)) ||
      (conversation.caseNumber && conversation.caseNumber.toLowerCase().includes(searchLower)) ||
      conversation.lastMessage.content.toLowerCase().includes(searchLower);
    
    // Filter by active tab
    const matchesTab = 
      activeTab === 'all' || 
      (activeTab === 'clients' && conversation.category === 'clients') ||
      (activeTab === 'team' && conversation.category === 'team') ||
      (activeTab === 'other' && conversation.category === 'other');
    
    // Filter by conversation filter
    const matchesFilter = 
      (conversationFilter === 'all' && !conversation.isArchived) ||
      (conversationFilter === 'unread' && conversation.unread > 0 && !conversation.isArchived) ||
      (conversationFilter === 'priority' && conversation.hasPriority && !conversation.isArchived) ||
      (conversationFilter === 'archived' && conversation.isArchived);
    
    return matchesSearch && matchesTab && matchesFilter;
  });
  
  // Group messages by date for display
  const groupedMessages = messages.reduce((groups, message) => {
    const date = message.timestamp.split('T')[0];
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});
  
  // Format the date for each message group
  const formatGroupDate = (dateStr) => {
    const date = new Date(dateStr);
    if (isToday(date)) {
      return 'Today';
    } else if (isYesterday(date)) {
      return 'Yesterday';
    } else {
      return format(date, 'MMMM d, yyyy');
    }
  };
  
  // Format timestamp for display in message bubbles
  const formatMessageTime = (timestamp) => {
    const date = parseISO(timestamp);
    return format(date, 'h:mm a');
  };
  
  // Format timestamp for display in conversation list
  const formatConversationTime = (timestamp) => {
    const date = parseISO(timestamp);
    if (isToday(date)) {
      return format(date, 'h:mm a');
    } else if (isYesterday(date)) {
      return 'Yesterday';
    } else if (new Date().getFullYear() === date.getFullYear()) {
      return format(date, 'MMM d');
    } else {
      return format(date, 'MM/dd/yyyy');
    }
  };
  
  // Format date for active status
  const formatLastActive = (timestamp) => {
    const date = parseISO(timestamp);
    if (isToday(date)) {
      return `Last active ${formatDistanceToNow(date, { addSuffix: true })}`;
    } else if (isYesterday(date)) {
      return 'Last active yesterday';
    } else {
      return `Last active on ${format(date, 'MMM d')}`;
    }
  };
  
  // Get cases for a specific client (for new conversation modal)
  const getClientCases = (clientId) => {
    if (!clientId) return [];
    return cases.filter(c => c.clientId === clientId);
  };
  
  // Handle sending a new message
  const handleSendMessage = (e) => {
    e.preventDefault();
    
    // If this is a new conversation creation (from the modal)
    if (isNewMessageModalOpen) {
      if (!newConversation.clientId || !newConversation.subject || !newConversation.initialMessage) {
        // Add validation message
        setSuccessMessage({ type: 'error', text: "Please fill in all required fields" });
        return;
      }

      const client = clients.find(c => c.id === newConversation.clientId);
      const caseDetails = newConversation.caseId ? cases.find(c => c.id === newConversation.caseId) : null;
      
      // Create new conversation
      const newConversationObj = {
        id: Math.max(...conversations.map(c => c.id)) + 1,
        title: newConversation.subject,
        caseId: newConversation.caseId || null,
        caseName: caseDetails?.name || null,
        caseNumber: caseDetails?.number || null,
        participants: [
          { 
            id: 'attorney1', 
            name: user?.displayName || 'Sarah Nguyen', 
            role: 'attorney', 
            avatar: 'https://randomuser.me/api/portraits/women/44.jpg' 
          },
          { 
            id: client.id, 
            name: client.name, 
            role: 'client', 
            avatar: client.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(client.name)}&background=random`
          }
        ],
        lastMessage: {
          content: newConversation.initialMessage,
          timestamp: new Date().toISOString(),
          sender: { 
            id: 'attorney1', 
            name: user?.displayName || 'Sarah Nguyen', 
            role: 'attorney' 
          }
        },
        unread: 0,
        isArchived: false,
        hasPriority: false,
        tags: [],
        category: 'clients'
      };
      
      // Add conversation to list
      setConversations(prev => [newConversationObj, ...prev]);
      
      // Create initial message
      const initialMessage = {
        id: messages.length ? Math.max(...messages.map(m => m.id)) + 1 : 1,
        conversationId: newConversationObj.id,
        content: newConversation.initialMessage,
        timestamp: new Date().toISOString(),
        sender: { 
          id: 'attorney1', 
          name: user?.displayName || 'Sarah Nguyen', 
          role: 'attorney', 
          avatar: 'https://randomuser.me/api/portraits/women/44.jpg' 
        },
        attachments: newConversation.attachment ? [
          { 
            id: Math.random().toString(36).substring(7), 
            name: newConversation.attachment.name,
            size: `${(newConversation.attachment.size / 1024).toFixed(1)} KB`,
            type: newConversation.attachment.type
          }
        ] : [],
        isRead: true
      };
      
      // Set selected conversation to new conversation
      setSelectedConversation(newConversationObj);
      setMessages([initialMessage]);
      setShowMobileConversations(false);
      
      // Reset form
      setNewConversation({
        clientId: '',
        caseId: '',
        subject: '',
        initialMessage: '',
        attachment: null
      });
      
      // Close modal
      setIsNewMessageModalOpen(false);
      
      // Show success message
      setSuccessMessage({ type: 'success', text: "Message sent successfully" });
      return;
    }
    
    // Regular message sending in an existing conversation
    if ((!newMessage.trim() && !fileToUpload) || !selectedConversation) return;
    
    // Set sending state
    setIsSending(true);
    
    // Create message
    const newMessageObj = {
      id: messages.length ? Math.max(...messages.map(m => m.id)) + 1 : 1,
      conversationId: selectedConversation.id,
      content: newMessage,
      timestamp: new Date().toISOString(),
      sender: { 
        id: 'attorney1', 
        name: user?.displayName || 'Sarah Nguyen', 
        role: 'attorney', 
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg' 
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
    
    // Add timeout to simulate sending
    setTimeout(() => {
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
                    id: 'attorney1', 
                    name: user?.displayName || 'Sarah Nguyen',
                    role: 'attorney' 
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
      
      // Simulate reply for demonstration purposes
      if (selectedConversation.id === 1) {
        simulateReplyFromClient();
      }
      
      setIsSending(false);
    }, 500);
  };
  
  // Simulate a reply from the client (for demo purposes)
  const simulateReplyFromClient = () => {
    setTimeout(() => {
      setTypingIndicator(true);
      
      setTimeout(() => {
        setTypingIndicator(false);
        
        const replyMessage = {
          id: Math.max(...messages.map(m => m.id)) + 1,
          conversationId: selectedConversation.id,
          content: "10:00 AM works perfectly for me. I'll be ready for your call then. Thank you!",
          timestamp: new Date().toISOString(),
          sender: { id: 'client2', name: 'Jane Smith', role: 'client', avatar: 'https://randomuser.me/api/portraits/women/22.jpg' },
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
  };
  
  // Handle file input change
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFileToUpload(e.target.files[0]);
      setShowAttachmentOptions(false);
    }
  };
  
  // Handle attachment button click
  const handleAttachmentClick = (type) => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
    setShowAttachmentOptions(false);
  };
  
  // Toggle archive status of a conversation
  const toggleArchiveConversation = (e, conversationId) => {
    e.stopPropagation();
    
    setConversations(prevConversations => 
      prevConversations.map(conv => 
        conv.id === conversationId
          ? { ...conv, isArchived: !conv.isArchived }
          : conv
      )
    );
    
    // Show success message
    const conversation = conversations.find(c => c.id === conversationId);
    if (conversation) {
      setSuccessMessage({ 
        type: 'success', 
        text: conversation.isArchived ? "Conversation unarchived" : "Conversation archived" 
      });
    }
  };
  
  // Toggle priority status of a conversation
  const togglePriorityConversation = (e, conversationId) => {
    e.stopPropagation();
    
    setConversations(prevConversations => 
      prevConversations.map(conv => 
        conv.id === conversationId
          ? { ...conv, hasPriority: !conv.hasPriority }
          : conv
      )
    );
    
    // Show success message
    const conversation = conversations.find(c => c.id === conversationId);
    if (conversation) {
      setSuccessMessage({ 
        type: 'success', 
        text: conversation.hasPriority ? "Priority removed" : "Marked as priority" 
      });
    }
  };
  
  // Handle bulk message sending
  const handleSendBulkMessage = (e) => {
    e.preventDefault();
    
    if (!bulkMessage.subject || !bulkMessage.message || selectedClients.length === 0) {
      setSuccessMessage({ type: 'error', text: "Please fill in all required fields and select at least one client" });
      return;
    }
    
    // Set a loading state
    setIsSending(true);
    
    // Create new conversations for each selected client
    const newConversationsArray = [];
    
    selectedClients.forEach(clientId => {
      const client = clients.find(c => c.id === clientId);
      
      const newConversationId = Math.max(...conversations.map(c => c.id)) + 1 + Math.floor(Math.random() * 1000);
      
      const newConversation = {
        id: newConversationId,
        title: bulkMessage.subject,
        caseId: bulkMessage.caseId || null,
        caseName: bulkMessage.caseId ? cases.find(c => c.id === bulkMessage.caseId)?.name : null,
        caseNumber: bulkMessage.caseId ? cases.find(c => c.id === bulkMessage.caseId)?.number : null,
        participants: [
          { 
            id: 'attorney1', 
            name: user?.displayName || 'Sarah Nguyen', 
            role: 'attorney', 
            avatar: 'https://randomuser.me/api/portraits/women/44.jpg' 
          },
          { 
            id: client.id, 
            name: client.name, 
            role: 'client', 
            avatar: client.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(client.name)}&background=random`
          }
        ],
        lastMessage: {
          content: bulkMessage.message,
          timestamp: new Date().toISOString(),
          sender: { 
            id: 'attorney1', 
            name: user?.displayName || 'Sarah Nguyen', 
            role: 'attorney' 
          }
        },
        unread: 0,
        isArchived: false,
        hasPriority: false,
        tags: ['bulk message'],
        category: 'clients'
      };
      
      newConversationsArray.push(newConversation);
    });
    
    // Simulate network delay
    setTimeout(() => {
      // Add conversations to list
      setConversations(prev => [...newConversationsArray, ...prev]);
      
      // Select the first new conversation
      if (newConversationsArray.length > 0) {
        setSelectedConversation(newConversationsArray[0]);
        
        // Create a message for the first conversation
        const initialMessage = {
          id: 1,
          conversationId: newConversationsArray[0].id,
          content: bulkMessage.message,
          timestamp: new Date().toISOString(),
          sender: { 
            id: 'attorney1', 
            name: user?.displayName || 'Sarah Nguyen', 
            role: 'attorney', 
            avatar: 'https://randomuser.me/api/portraits/women/44.jpg' 
          },
          attachments: bulkMessage.attachment ? [
            { 
              id: Math.random().toString(36).substring(7), 
              name: bulkMessage.attachment.name,
              size: `${(bulkMessage.attachment.size / 1024).toFixed(1)} KB`,
              type: bulkMessage.attachment.type
            }
          ] : [],
          isRead: true
        };
        
        setMessages([initialMessage]);
        setShowMobileConversations(false);
      }
      
      // Reset form
      setBulkMessage({
        subject: '',
        message: '',
        caseId: '',
        attachment: null
      });
      setSelectedClients([]);
      
      // Close modal
      setIsBulkMessageModalOpen(false);
      setIsSending(false);
      
      // Show success message
      setSuccessMessage({ 
        type: 'success', 
        text: `Bulk message sent to ${selectedClients.length} clients` 
      });
    }, 1500);
  };
  
  // Toggle selection of a client for bulk messaging
  const toggleClientSelection = (clientId) => {
    setSelectedClients(prev => {
      if (prev.includes(clientId)) {
        return prev.filter(id => id !== clientId);
      } else {
        return [...prev, clientId];
      }
    });
  };
  
  // Select or deselect all clients
  const selectAllClients = () => {
    if (selectedClients.length === clients.length) {
      // If all are selected, deselect all
      setSelectedClients([]);
    } else {
      // Otherwise, select all
      setSelectedClients(clients.map(client => client.id));
    }
  };
  
  // Function to create a new message template
  const handleCreateTemplate = (e) => {
    e.preventDefault();
    
    if (!newTemplate.name || !newTemplate.content) {
      setSuccessMessage({ type: 'error', text: "Please fill in all required fields" });
      return;
    }
    
    const templateId = `template${templates.length + 1}`;
    
    const newTemplateObj = {
      id: templateId,
      name: newTemplate.name,
      content: newTemplate.content,
      category: newTemplate.category
    };
    
    setTemplates(prev => [...prev, newTemplateObj]);
    
    // Reset form and close modal
    setNewTemplate({
      name: '',
      content: '',
      category: 'general'
    });
    
    setIsTemplateModalOpen(false);
    
    // Show success message
    setSuccessMessage({ type: 'success', text: "Template created successfully" });
  };
  
  // Function to use a template in a message
  const useTemplate = (template) => {
    setNewMessage(template.content);
    setShowTemplates(false);
    
    // Focus on the message input
    if (messageContainerRef.current) {
      messageContainerRef.current.focus();
    }
  };
  
  // Function to preview an attachment
  const handlePreviewAttachment = (attachment) => {
    setPreviewAttachment(attachment);
    setShowAttachmentPreview(true);
  };
  
  // Function to handle emoji selection
  const handleEmojiSelect = (emoji) => {
    setNewMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
  };
  
  return (
    <div className="py-3 sm:py-6 bg-gray-50 min-h-screen">
      {/* Success/error message toast */}
      {successMessage && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-md shadow-lg ${
          successMessage.type === 'success' ? 'bg-green-50 border border-green-100' : 'bg-red-50 border border-red-100'
        } transition-all duration-300 ease-in-out transform translate-y-0 opacity-100`}>
          <div className="flex items-center">
            {successMessage.type === 'success' ? (
              <HiOutlineCheckCircle className="h-5 w-5 text-green-500 mr-3" />
            ) : (
              <HiOutlineExclamation className="h-5 w-5 text-red-500 mr-3" />
            )}
            <p className={`text-sm font-medium ${
              successMessage.type === 'success' ? 'text-green-800' : 'text-red-800'
            }`}>
              {successMessage.text}
            </p>
            <button 
              onClick={() => setSuccessMessage(null)}
              className="ml-4 text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <HiOutlineX className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
      
      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
        {/* Header section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0 mb-4 sm:mb-6">
          <div className="flex items-center">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900">Messages</h1>
            <div className="ml-3 bg-[#800000] text-white rounded-full px-2 py-0.5 text-xs font-medium">
              {conversations.filter(c => c.unread > 0).length > 0 && conversations.filter(c => c.unread > 0).length}
            </div>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <button
              onClick={() => setSuccessMessage({ type: 'info', text: "New message feature coming soon!" })}
              className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#800000] hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000] transition-colors duration-200"
            >
              <HiOutlinePlusCircle className="-ml-1 mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden xs:inline">New Message</span>
              <span className="xs:hidden">New</span>
            </button>
            <button
              onClick={() => setSuccessMessage({ type: 'info', text: "Bulk message feature coming soon!" })}
              className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000] transition-colors duration-200"
            >
              <HiOutlineUsers className="-ml-1 mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden sm:inline">Bulk Message</span>
              <span className="sm:hidden">Bulk</span>
            </button>
            <button
              onClick={() => setSuccessMessage({ type: 'info', text: "Details view coming soon!" })}
              className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000] transition-colors duration-200"
            >
              <HiOutlineMenuAlt2 className="-ml-1 mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden sm:inline">Show Details</span>
              <span className="sm:hidden">Details</span>
            </button>
            
            {/* Keyboard shortcuts hint */}
            <div className="hidden md:flex items-center ml-2 text-xs text-gray-500">
              <div className="flex items-center mr-3">
                <span className="px-1.5 py-0.5 bg-gray-100 rounded border border-gray-300 font-mono mr-1">Ctrl</span>
                <span className="px-1.5 py-0.5 bg-gray-100 rounded border border-gray-300 font-mono mr-1">K</span>
                <span className="text-gray-400">or</span>
                <span className="px-1.5 py-0.5 bg-gray-100 rounded border border-gray-300 font-mono ml-1">Cmd</span>
                <span className="px-1.5 py-0.5 bg-gray-100 rounded border border-gray-300 font-mono ml-1">K</span>
              </div>
              <span className="text-gray-400">to focus search</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 mt-3 sm:mt-6">
        <div className="flex flex-col lg:flex-row h-[calc(100vh-9rem)] sm:h-[calc(100vh-12rem)] bg-white rounded-lg shadow overflow-hidden">
          {/* Conversations sidebar */}
          <div className={`${
            !showMobileConversations ? 'hidden lg:flex' : 'flex'
          } w-full lg:w-96 xl:w-[350px] border-r border-gray-200 flex-col`}>
            <div className="p-2 sm:p-4 border-b border-gray-200 space-y-2 sm:space-y-3">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <HiOutlineSearch className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="focus:ring-[#800000] focus:border-[#800000] block w-full pl-9 sm:pl-10 text-sm border-gray-300 rounded-md"
                  placeholder={isMobile ? "Search" : "Search messages or clients"}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  ref={searchInputRef}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                />
              </div>
              
              {/* Category tabs */}
              <div className="border-b border-gray-200 overflow-x-auto">
                <nav className="-mb-px flex space-x-4" aria-label="Tabs">
                  <button
                    onClick={() => setActiveTab('all')}
                    className={`${
                      activeTab === 'all'
                        ? 'border-[#800000] text-[#800000]'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-2 sm:py-3 px-1 border-b-2 font-medium text-xs sm:text-sm`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setActiveTab('clients')}
                    className={`${
                      activeTab === 'clients'
                        ? 'border-[#800000] text-[#800000]'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-2 sm:py-3 px-1 border-b-2 font-medium text-xs sm:text-sm`}
                  >
                    Clients
                  </button>
                  <button
                    onClick={() => setActiveTab('team')}
                    className={`${
                      activeTab === 'team'
                        ? 'border-[#800000] text-[#800000]'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-2 sm:py-3 px-1 border-b-2 font-medium text-xs sm:text-sm`}
                  >
                    Team
                  </button>
                  <button
                    onClick={() => setActiveTab('other')}
                    className={`${
                      activeTab === 'other'
                        ? 'border-[#800000] text-[#800000]'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-2 sm:py-3 px-1 border-b-2 font-medium text-xs sm:text-sm`}
                  >
                    Other
                  </button>
                </nav>
              </div>
              
              {/* Conversation filters */}
              <div className="flex space-x-1 sm:space-x-2 overflow-x-auto pb-1 sm:pb-2">
                <button
                  onClick={() => setConversationFilter('all')}
                  className={`${
                    conversationFilter === 'all'
                      ? 'bg-[#800000] text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  } px-2 sm:px-3 py-1 sm:py-1.5 rounded-md font-medium text-xs sm:text-sm transition-all whitespace-nowrap border border-gray-200`}
                >
                  All
                </button>
                <button
                  onClick={() => setConversationFilter('unread')}
                  className={`${
                    conversationFilter === 'unread'
                      ? 'bg-[#800000] text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  } px-2 sm:px-3 py-1 sm:py-1.5 rounded-md font-medium text-xs sm:text-sm transition-all whitespace-nowrap border border-gray-200 flex items-center`}
                >
                  Unread
                  {conversations.filter(c => c.unread > 0).length > 0 && (
                    <span className="ml-1 sm:ml-1.5 flex-shrink-0 h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center rounded-full bg-white text-[#800000] text-xs">
                      {conversations.filter(c => c.unread > 0).length}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setConversationFilter('priority')}
                  className={`${
                    conversationFilter === 'priority'
                      ? 'bg-[#800000] text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  } px-2 sm:px-3 py-1 sm:py-1.5 rounded-md font-medium text-xs sm:text-sm transition-all whitespace-nowrap border border-gray-200`}
                >
                  Priority
                </button>
                <button
                  onClick={() => setConversationFilter('archived')}
                  className={`${
                    conversationFilter === 'archived'
                      ? 'bg-[#800000] text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  } px-2 sm:px-3 py-1 sm:py-1.5 rounded-md font-medium text-xs sm:text-sm transition-all whitespace-nowrap border border-gray-200`}
                >
                  Archived
                </button>
              </div>
            </div>
            
            {/* Conversation List */}
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.length > 0 ? (
                <>
                  <div className="px-3 sm:px-4 py-1 sm:py-2 bg-gray-50 sticky top-0 z-10">
                    <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {conversationFilter === 'all' ? 'All Conversations' : 
                      conversationFilter === 'unread' ? 'Unread Messages' :
                      conversationFilter === 'priority' ? 'Priority Conversations' : 'Archived Conversations'}
                      <span className="ml-1 text-gray-400">({filteredConversations.length})</span>
                    </h3>
                  </div>
                  <ul className="divide-y divide-gray-200">
                    {filteredConversations.map(conversation => (
                      <li key={conversation.id}>
                        <Link
                          to="#"
                          onClick={() => {
                            setSelectedConversation(conversation);
                            setShowMobileConversations(false);
                          }}
                          className={`block hover:bg-gray-50 transition-all p-3 sm:p-4 group ${
                            selectedConversation?.id === conversation.id ? 'bg-gray-100' : ''
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="flex-shrink-0">
                                {conversation.participants[1]?.avatar ? (
                                  <img
                                    src={conversation.participants[1].avatar}
                                    alt={conversation.participants[1].name}
                                    className="h-10 w-10 rounded-full object-cover"
                                  />
                                ) : (
                                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                    <span className="text-gray-500 text-xs font-medium">
                                      {conversation.participants[1]?.name?.charAt(0)}
                                    </span>
                                  </div>
                                )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {conversation.title}
                                </p>
                                <p className="text-xs sm:text-sm text-gray-500 truncate">
                                  {conversation.lastMessage.content}
                                </p>
                              </div>
                            </div>
                            <div className="ml-3 hidden sm:block">
                              <p className="text-xs text-gray-500">
                                {formatConversationTime(conversation.lastMessage.timestamp)}
                              </p>
                            </div>
                          </div>
                          <div className="mt-2 sm:hidden">
                            <p className="text-xs text-gray-500 truncate">
                              {conversation.lastMessage.content}
                            </p>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <div className="p-4 text-center text-gray-500 text-sm">
                  No conversations found. Start a new message or adjust your filters.
                </div>
              )}
            </div>
          </div>
          
          {/* Message details section */}
          <div className="flex-1 flex flex-col">
            {/* Message header */}
            <div className="bg-white shadow-sm px-4 py-3 sm:px-6 sm:py-4 flex items-center justify-between border-b">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowMobileConversations(true)}
                  className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                  aria-label="Back to conversations"
                >
                  <HiOutlineChevronLeft className="h-5 w-5" />
                </button>
                <div className="min-w-0 flex-1">
                  {selectedConversation ? (
                    <>
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {selectedConversation.title}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {selectedConversation.participants
                          ?.filter(p => p.id !== 'attorney1')
                          .map(p => p.name)
                          .join(', ')}
                      </p>
                    </>
                  ) : (
                    <p className="text-sm font-medium text-gray-900">New Message</p>
                  )}
                </div>
              </div>
              
              {selectedConversation && (
                <div className="flex-shrink-0">
                  <button
                    onClick={(e) => toggleArchiveConversation(e, selectedConversation.id)}
                    className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                    aria-label={selectedConversation.isArchived ? "Unarchive conversation" : "Archive conversation"}
                  >
                    {selectedConversation.isArchived ? (
                      <HiOutlineInboxIn className="h-5 w-5" />
                    ) : (
                      <HiOutlineArchive className="h-5 w-5" />
                    )}
                  </button>
                </div>
              )}
            </div>
            
            {/* Message content area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              {selectedConversation ? (
                <>
                  {/* Message groups - Enhanced WhatsApp-style UI */}
                  {Object.keys(groupedMessages).length > 0 ? (
                    Object.keys(groupedMessages).map(date => (
                      <div key={date} className="mb-4">
                        <div className="flex justify-center mb-4">
                          <span className="px-3 py-1 bg-gray-100 text-xs font-medium text-gray-500 rounded-full shadow-sm">
                            {formatGroupDate(date)}
                          </span>
                        </div>
                        <div className="space-y-3">
                          {groupedMessages[date].map(message => {
                            const isMyMessage = message.sender.id === 'attorney1';
                            return (
                              <div key={message.id} 
                                className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}
                              >
                                <div className={`flex max-w-[75%] ${isMyMessage ? 'flex-row-reverse' : 'flex-row'}`}>
                                  {!isMyMessage && (
                                    <div className="flex-shrink-0 mr-2">
                                      {message.sender.avatar ? (
                                        <img
                                          src={message.sender.avatar}
                                          alt={message.sender.name}
                                          className="h-8 w-8 rounded-full object-cover border border-gray-200"
                                        />
                                      ) : (
                                        <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                                          <span className="text-white font-medium text-sm">
                                            {message.sender.name.charAt(0)}
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                  
                                  <div className={`
                                    flex-1 px-4 py-2 rounded-lg ${isMyMessage ? 'mr-2' : 'ml-2'}
                                    ${isMyMessage 
                                      ? 'bg-[#800000] bg-opacity-15 text-gray-800 rounded-tr-none' 
                                      : 'bg-gray-100 text-gray-800 rounded-tl-none'}
                                  `}>
                                    <div className="flex justify-between items-center">
                                      <span className={`text-xs font-medium ${isMyMessage ? 'text-[#800000]' : 'text-gray-600'}`}>
                                        {message.sender.name}
                                      </span>
                                      <span className="text-xs text-gray-500 ml-2">
                                        {formatMessageTime(message.timestamp)}
                                      </span>
                                    </div>
                                    <div className="mt-1 text-sm">
                                      {message.content}
                                    </div>
                                    
                                    {message.attachments.length > 0 && (
                                      <div className="mt-2 flex flex-wrap gap-2 border-t border-gray-200 pt-2">
                                        {message.attachments.map(attachment => (
                                          <a
                                            key={attachment.id}
                                            href="#"
                                            onClick={(e) => {
                                              e.preventDefault();
                                              handlePreviewAttachment(attachment);
                                            }}
                                            className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full 
                                              ${isMyMessage 
                                                ? 'bg-[#800000] bg-opacity-10 text-[#800000]' 
                                                : 'bg-gray-200 text-gray-700'}
                                            `}"
                                          >
                                            <HiOutlinePaperClip className="h-3 w-3" />
                                            <span className="truncate max-w-[120px]">{attachment.name}</span>
                                          </a>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                  
                                  {isMyMessage && (
                                    <div className="flex-shrink-0 ml-2">
                                      {message.sender.avatar ? (
                                        <img
                                          src={message.sender.avatar}
                                          alt={message.sender.name}
                                          className="h-8 w-8 rounded-full object-cover border border-gray-200"
                                        />
                                      ) : (
                                        <div className="h-8 w-8 rounded-full bg-[#800000] flex items-center justify-center">
                                          <span className="text-white font-medium text-sm">
                                            {message.sender.name.charAt(0)}
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center justify-center h-64">
                      <div className="text-center">
                        <div className="mx-auto h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                          <HiOutlineChat className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="text-gray-500 text-sm font-medium">No messages yet</h3>
                        <p className="text-gray-400 text-xs mt-1">Start the conversation by sending the first message</p>
                      </div>
                    </div>
                  )}
                  

                  {/* Typing indicator - WhatsApp style */}
                  {typingIndicator && (
                    <div className="flex items-start space-x-2 mt-4">
                      <div className="flex-shrink-0">
                        <img
                          src="https://randomuser.me/api/portraits/women/22.jpg"
                          alt="Jane Smith"
                          className="h-8 w-8 rounded-full object-cover border border-gray-200"
                        />
                      </div>
                      <div className="bg-gray-100 px-4 py-2 rounded-lg rounded-tl-none max-w-[75%]">
                        <div className="flex space-x-1">
                          <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" 
                            style={{ animationDelay: "0ms" }}></div>
                          <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" 
                            style={{ animationDelay: "300ms" }}></div>
                          <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" 
                            style={{ animationDelay: "600ms" }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  

                  {/* Enhanced message input area with fixed spacing */}
                  <div className="mt-4 sm:mt-6 border-t border-gray-200 pt-4">
                    <form onSubmit={handleSendMessage} className="relative">
                      {/* File attachment and tools */}
                      <div className="absolute left-2 bottom-3 flex items-center space-x-2">
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => setShowAttachmentOptions(!showAttachmentOptions)}
                            className="text-gray-500 hover:text-[#800000] p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                          >
                            <HiOutlinePaperClip className="h-5 w-5" />
                          </button>
                          
                          {showAttachmentOptions && (
                            <div className="absolute bottom-full left-0 mb-2 bg-white rounded-lg shadow-lg border border-gray-200 p-2 w-48">
                              <div className="space-y-1">
                                <button
                                  type="button"
                                  onClick={() => handleAttachmentClick('document')}
                                  className="flex items-center w-full px-3 py-2 text-sm text-left text-gray-700 hover:bg-gray-50 rounded-md"
                                >
                                  <HiOutlineDocumentText className="mr-2 h-5 w-5 text-[#800000]" />
                                  Document
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleAttachmentClick('image')}
                                  className="flex items-center w-full px-3 py-2 text-sm text-left text-gray-700 hover:bg-gray-50 rounded-md"
                                >
                                  <HiOutlinePhotograph className="mr-2 h-5 w-5 text-[#800000]" />
                                  Image
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setShowTemplates(true)}
                                  className="flex items-center w-full px-3 py-2 text-sm text-left text-gray-700 hover:bg-gray-50 rounded-md"
                                >
                                  <HiOutlineTemplate className="mr-2 h-5 w-5 text-[#800000]" />
                                  Template
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <button
                          type="button"
                          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                          className="text-gray-500 hover:text-[#800000] p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                        >
                          <HiOutlineEmojiHappy className="h-5 w-5" />
                        </button>
                      </div>
                      
                      {fileToUpload && (
                        <div className="absolute top-0 left-0 right-0 -mt-12 p-2 bg-gray-50 border border-gray-200 rounded-md flex items-center justify-between">
                          <div className="flex items-center">
                            <HiOutlineDocumentText className="h-4 w-4 text-[#800000] mr-2" />
                            <span className="text-xs text-gray-600 truncate max-w-[150px]">{fileToUpload.name}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setFileToUpload(null);
                              if (fileInputRef.current) {
                                fileInputRef.current.value = '';
                              }
                            }}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <HiOutlineX className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                      
                      <textarea
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="block w-full p-3 pl-20 pr-16 text-sm border border-gray-300 rounded-full focus:ring-[#800000] focus:border-[#800000] resize-none"
                        placeholder="Type a message..."
                        rows={1}
                        style={{ minHeight: '48px', maxHeight: '120px' }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage(e);
                          }
                        }}
                      />
                      
                      <div className="absolute right-2 bottom-2">
                        <button
                          type="submit"
                          disabled={isSending || (!newMessage.trim() && !fileToUpload)}
                          className={`inline-flex items-center justify-center p-2 rounded-full text-white ${
                            isSending || (!newMessage.trim() && !fileToUpload) 
                              ? 'bg-gray-300 cursor-not-allowed' 
                              : 'bg-[#800000] hover:bg-[#600000]'
                          } focus:outline-none transition-colors`}
                        >
                          {isSending ? (
                            <svg
                              className="animate-spin h-5 w-5"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                              ></path>
                            </svg>
                          ) : (
                            <HiOutlinePaperAirplane className="h-5 w-5 transform rotate-90" />
                          )}
                        </button>
                      </div>
                      
                      {/* Hidden file input */}
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </form>
                  </div>
                </>
              ) : (
                <div className="text-center text-gray-500 text-sm">
                  Select a conversation to view messages.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* New message modal */}
      <Transition.Root show={isNewMessageModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-50 overflow-y-auto"
          onClose={() => setIsNewMessageModalOpen(false)}
        >
          <div className="flex items-center justify-center min-h-screen px-4 py-6">
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
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <div className="bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-2xl">
                <div className="px-4 py-5 sm:px-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">
                      New Message
                    </h3>
                    <div className="ml-3 flex-shrink-0">
                      <button
                        onClick={() => setIsNewMessageModalOpen(false)}
                        className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                        aria-label="Close"
                      >
                        <HiOutlineX className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-gray-200">
                  <div className="px-4 py-5 sm:px-6">
                    <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(e); }} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Subject
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            value={newConversation.subject}
                            onChange={(e) => setNewConversation({ ...newConversation, subject: e.target.value })}
                            className="block w-full p-3 text-sm border border-gray-300 rounded-md focus:ring-[#800000] focus:border-[#800000]"
                            placeholder="Enter subject"
                            required
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Client
                        </label>
                        <div className="mt-1">
                          <select
                            value={newConversation.clientId}
                            onChange={(e) => setNewConversation({ ...newConversation, clientId: e.target.value })}
                            className="block w-full p-3 text-sm border border-gray-300 rounded-md focus:ring-[#800000] focus:border-[#800000]"
                            required
                          >
                            <option value="">Select a client</option>
                            {clients.map(client => (
                              <option key={client.id} value={client.id}>
                                {client.name} ({client.email})
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Case
                        </label>
                        <div className="mt-1">
                          <select
                            value={newConversation.caseId}
                            onChange={(e) => setNewConversation({ ...newConversation, caseId: e.target.value })}
                            className="block w-full p-3 text-sm border border-gray-300 rounded-md focus:ring-[#800000] focus:border-[#800000]"
                          >
                            <option value="">Select a case</option>
                            {cases.map(caseItem => (
                              <option key={caseItem.id} value={caseItem.id}>
                                {caseItem.name} ({caseItem.number})
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Initial Message
                        </label>
                        <div className="mt-1">
                          <textarea
                            value={newConversation.initialMessage}
                            onChange={(e) => setNewConversation({ ...newConversation, initialMessage: e.target.value })}
                            className="block w-full p-3 text-sm border border-gray-300 rounded-md focus:ring-[#800000] focus:border-[#800000] resize-none h-20"
                            placeholder="Type your message here..."
                            required
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Attachment
                        </label>
                        <div className="mt-1">
                          <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                          />
                          <button
                            type="button"
                            onClick={() => handleAttachmentClick()}
                            className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                          >
                            <HiOutlinePhotograph className="-ml-1 mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                            Upload Attachment
                          </button>
                          
                          {newConversation.attachment && (
                            <div className="mt-2 text-sm text-gray-500">
                              <span className="font-medium">{newConversation.attachment.name}</span> ({(newConversation.attachment.size / 1024).toFixed(1)} KB)
                              <button
                                type="button"
                                onClick={() => setNewConversation({ ...newConversation, attachment: null })}
                                className="ml-2 text-red-600 hover:underline"
                                aria-label="Remove attachment"
                              >
                                Remove
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          type="submit"
                          className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-[#800000] rounded-md shadow-sm hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000] flex-1"
                        >
                          {isSending ? (
                            <svg
                              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                              ></path>
                            </svg>
                          ) : (
                            <HiOutlinePaperAirplane className="-ml-1 mr-2 h-5 w-5" />
                          )}
                          Send Message
                        </button>
                        
                        <button
                          onClick={() => setIsNewMessageModalOpen(false)}
                          className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000] flex-1"
                        >
                          <HiOutlineX className="-ml-1 mr-2 h-5 w-5" />
                          Cancel
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
      
      {/* Bulk message modal */}
      <Transition.Root show={isBulkMessageModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-50 overflow-y-auto"
          onClose={() => setIsBulkMessageModalOpen(false)}
        >
          <div className="flex items-center justify-center min-h-screen px-4 py-6">
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
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <div className="bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-2xl">
                <div className="px-4 py-5 sm:px-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">
                      Send Bulk Message
                    </h3>
                    <div className="ml-3 flex-shrink-0">
                      <button
                        onClick={() => setIsBulkMessageModalOpen(false)}
                        className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                        aria-label="Close"
                      >
                        <HiOutlineX className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-gray-200">
                  <div className="px-4 py-5 sm:px-6">
                    <form onSubmit={handleSendBulkMessage} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Subject
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            value={bulkMessage.subject}
                            onChange={(e) => setBulkMessage({ ...bulkMessage, subject: e.target.value })}
                            className="block w-full p-3 text-sm border border-gray-300 rounded-md focus:ring-[#800000] focus:border-[#800000]"
                            placeholder="Enter subject"
                            required
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Message
                        </label>
                        <div className="mt-1">
                          <textarea
                            value={bulkMessage.message}
                            onChange={(e) => setBulkMessage({ ...bulkMessage, message: e.target.value })}
                            className="block w-full p-3 text-sm border border-gray-300 rounded-md focus:ring-[#800000] focus:border-[#800000] resize-none h-20"
                            placeholder="Type your message here..."
                            required
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Case
                        </label>
                        <div className="mt-1">
                          <select
                            value={bulkMessage.caseId}
                            onChange={(e) => setBulkMessage({ ...bulkMessage, caseId: e.target.value })}
                            className="block w-full p-3 text-sm border border-gray-300 rounded-md focus:ring-[#800000] focus:border-[#800000]"
                          >
                            <option value="">Select a case</option>
                            {cases.map(caseItem => (
                              <option key={caseItem.id} value={caseItem.id}>
                                {caseItem.name} ({caseItem.number})
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Attachment
                        </label>
                        <div className="mt-1">
                          <input
                            type="file"
                            ref={bulkFileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                          />
                          <button
                            type="button"
                            onClick={() => handleAttachmentClick()}
                            className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                          >
                            <HiOutlinePhotograph className="-ml-1 mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                            Upload Attachment
                          </button>
                          
                          {bulkMessage.attachment && (
                            <div className="mt-2 text-sm text-gray-500">
                              <span className="font-medium">{bulkMessage.attachment.name}</span> ({(bulkMessage.attachment.size / 1024).toFixed(1)} KB)
                              <button
                                type="button"
                                onClick={() => setBulkMessage({ ...bulkMessage, attachment: null })}
                                className="ml-2 text-red-600 hover:underline"
                                aria-label="Remove attachment"
                              >
                                Remove
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          type="submit"
                          className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-[#800000] rounded-md shadow-sm hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000] flex-1"
                        >
                          {isSending ? (
                            <svg
                              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                              ></path>
                            </svg>
                          ) : (
                            <HiOutlinePaperAirplane className="-ml-1 mr-2 h-5 w-5" />
                          )}
                          Send Message
                        </button>
                        
                        <button
                          onClick={() => setIsBulkMessageModalOpen(false)}
                          className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000] flex-1"
                        >
                          <HiOutlineX className="-ml-1 mr-2 h-5 w-5" />
                          Cancel
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
      
      {/* Template selection modal */}
      <Transition.Root show={showTemplates} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-50 overflow-y-auto"
          onClose={() => setShowTemplates(false)}
        >
          <div className="flex items-center justify-center min-h-screen px-4 py-6">
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
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <div className="bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-md">
                <div className="px-4 py-5 sm:px-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">
                      Message Templates
                    </h3>
                    <div className="ml-3 flex-shrink-0">
                      <button
                        onClick={() => setShowTemplates(false)}
                        className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                        aria-label="Close"
                      >
                        <HiOutlineX className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-gray-200">
                  <div className="px-4 py-5 sm:px-6">
                    <div className="space-y-4">
                      {templates.map(template => (
                        <div key={template.id} className="p-4 bg-gray-50 rounded-md shadow-sm">
                          <div className="flex justify-between items-center">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {template.name}
                            </p>
                            <button
                              onClick={() => useTemplate(template)}
                              className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-[#800000] rounded-md shadow-sm hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                            >
                              Use Template
                            </button>
                          </div>
                          <p className="mt-1 text-sm text-gray-700 truncate">
                            {template.content.split('\n')[0]}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
      
      {/* Attachment preview modal */}
      <Transition.Root show={showAttachmentPreview} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-50 overflow-y-auto"
          onClose={() => setShowAttachmentPreview(false)}
        >
          <div className="flex items-center justify-center min-h-screen px-4 py-6">
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
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <div className="bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-lg">
                <div className="px-4 py-5 sm:px-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">
                      Attachment Preview
                    </h3>
                    <div className="ml-3 flex-shrink-0">
                      <button
                        onClick={() => setShowAttachmentPreview(false)}
                        className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                        aria-label="Close"
                      >
                        <HiOutlineX className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-gray-200">
                  <div className="px-4 py-5 sm:px-6">
                    {previewAttachment && (
                      <div className="flex flex-col items-center">
                        {previewAttachment.type.startsWith('image/') ? (
                          <img
                            src={URL.createObjectURL(previewAttachment)}
                            alt="Attachment preview"
                            className="max-w-full h-auto rounded-md shadow-sm"
                          />
                        ) : (
                          <div className="flex flex-col items-center">
                            <HiOutlineDocumentText className="h-16 w-16 text-gray-400" />
                            <p className="mt-2 text-sm text-gray-500 truncate">
                              {previewAttachment.name}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
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

export default AttorneyMessagesPage;
