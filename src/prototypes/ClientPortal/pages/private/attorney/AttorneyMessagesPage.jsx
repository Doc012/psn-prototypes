import React, { useState, useEffect, useRef, Fragment } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { format, formatDistanceToNow, isToday, isYesterday, parseISO } from 'date-fns';
import { Dialog, Transition, Menu } from '@headlessui/react';
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
  
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const messageContainerRef = useRef(null);
  const bulkFileInputRef = useRef(null);
  const templateFileInputRef = useRef(null);
  
  // Get current date for realistic timestamps
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const lastWeek = new Date(today);
  lastWeek.setDate(lastWeek.getDate() - 7);

  // Fetch clients, cases, and templates for new conversation modal
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Mock clients data
        const mockClients = [
          { id: 'client1', name: 'John Doe', email: 'john.doe@example.com', phone: '(555) 123-4567', avatar: null },
          { id: 'client2', name: 'Jane Smith', email: 'jane.smith@example.com', phone: '(555) 234-5678', avatar: 'https://randomuser.me/api/portraits/women/22.jpg' },
          { id: 'client3', name: 'Michael Johnson', email: 'michael.johnson@example.com', phone: '(555) 345-6789', avatar: 'https://randomuser.me/api/portraits/men/23.jpg' },
          { id: 'client4', name: 'Emily Williams', email: 'emily.williams@example.com', phone: '(555) 456-7890', avatar: 'https://randomuser.me/api/portraits/women/24.jpg' },
          { id: 'client5', name: 'Robert Brown', email: 'robert.brown@example.com', phone: '(555) 567-8901', avatar: 'https://randomuser.me/api/portraits/men/25.jpg' },
        ];
        
        // Mock cases data
        const mockCases = [
          { id: 'case1', number: 'PI-2025-1452', name: 'Smith v. Johnson', clientId: 'client2', type: 'Personal Injury', status: 'Active' },
          { id: 'case2', number: 'PR-2025-0783', name: 'Estate of Williams', clientId: 'client4', type: 'Probate', status: 'Active' },
          { id: 'case3', number: 'EP-2025-0342', name: 'Tucker Estate Planning', clientId: 'client1', type: 'Estate Planning', status: 'Active' },
          { id: 'case4', number: 'FL-2025-0592', name: 'Jones Divorce', clientId: 'client3', type: 'Family Law', status: 'Active' },
          { id: 'case5', number: 'RE-2025-0952', name: 'Brown Property Dispute', clientId: 'client5', type: 'Real Estate', status: 'Closed' },
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
        // Mock data with more realistic and current timestamps
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
              timestamp: new Date(today.setHours(today.getHours() - 2)).toISOString(),
              sender: { id: 'paralegal2', name: 'Lisa Martinez', role: 'paralegal' }
            },
            unread: 0,
            isArchived: false,
            hasPriority: false,
            tags: ['internal', 'document prep'],
            category: 'team'
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
            // Smith v. Johnson conversation
            {
              id: 1,
              conversationId: 1,
              content: 'Good morning, I hope you\'re doing well. I wanted to update you on your case.',
              timestamp: new Date(today.setHours(today.getHours() - 3)).toISOString(),
              sender: { id: 'attorney1', name: user?.displayName || 'Sarah Nguyen', role: 'attorney', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
              attachments: [],
              isRead: true
            },
            {
              id: 2,
              conversationId: 1,
              content: 'We\'ve received a settlement offer from the opposing party. I\'ve attached it for your review.',
              timestamp: new Date(today.setHours(today.getHours() - 2, today.getMinutes() - 55)).toISOString(),
              sender: { id: 'attorney1', name: user?.displayName || 'Sarah Nguyen', role: 'attorney', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
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
              sender: { id: 'client2', name: 'Jane Smith', role: 'client', avatar: 'https://randomuser.me/api/portraits/women/22.jpg' },
              attachments: [],
              isRead: true
            },
            {
              id: 4,
              conversationId: 1,
              content: 'I\'ve reviewed the settlement offer and would like to discuss it with you. Do you have time for a call tomorrow?',
              timestamp: new Date(today.setHours(today.getHours(), today.getMinutes() - 10)).toISOString(),
              sender: { id: 'client2', name: 'Jane Smith', role: 'client', avatar: 'https://randomuser.me/api/portraits/women/22.jpg' },
              attachments: [],
              isRead: true
            },
            {
              id: 5,
              conversationId: 1,
              content: 'Yes, I\'m available tomorrow at 10:00 AM or 2:00 PM. Which time works better for you?',
              timestamp: new Date(today.setMinutes(today.getMinutes() - 5)).toISOString(),
              sender: { id: 'attorney1', name: user?.displayName || 'Sarah Nguyen', role: 'attorney', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
              attachments: [],
              isRead: false
            },
            
            // Estate of Williams conversation
            {
              id: 6,
              conversationId: 2,
              content: 'Hello Emily, I\'ve prepared the probate documents for your mother\'s estate. Please review them when you have a chance.',
              timestamp: new Date(yesterday.setHours(10, 30)).toISOString(),
              sender: { id: 'attorney1', name: user?.displayName || 'Sarah Nguyen', role: 'attorney', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
              attachments: [
                { id: 2, name: 'Probate_Documents.pdf', size: '3.4 MB', type: 'application/pdf' }
              ],
              isRead: true
            },
            {
              id: 7,
              conversationId: 2,
              content: 'I particularly need you to review sections 3.2 and 5.1 regarding the distribution of assets and executor responsibilities.',
              timestamp: new Date(yesterday.setHours(10, 32)).toISOString(),
              sender: { id: 'attorney1', name: user?.displayName || 'Sarah Nguyen', role: 'attorney', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
              attachments: [],
              isRead: true
            },
            {
              id: 8,
              conversationId: 2,
              content: 'Please review the attached documents and let me know if you have any questions or concerns.',
              timestamp: new Date(yesterday.setHours(15, 15)).toISOString(),
              sender: { id: 'attorney1', name: user?.displayName || 'Sarah Nguyen', role: 'attorney', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
              attachments: [],
              isRead: true
            },
            {
              id: 9,
              conversationId: 2,
              content: 'Thank you for sending these documents. I have a few questions about the executor responsibilities. When would be a good time to discuss?',
              timestamp: new Date(today.setHours(9, 30)).toISOString(),
              sender: { id: 'client4', name: 'Emily Williams', role: 'client', avatar: 'https://randomuser.me/api/portraits/women/24.jpg' },
              attachments: [],
              isRead: false
            },
            
            // Estate Planning conversation
            {
              id: 10,
              conversationId: 3,
              content: 'Thank you for meeting with us yesterday to discuss your estate planning needs.',
              timestamp: new Date(lastWeek.setHours(9, 0)).toISOString(),
              sender: { id: 'attorney1', name: user?.displayName || 'Sarah Nguyen', role: 'attorney', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
              attachments: [],
              isRead: true
            },
            {
              id: 11,
              conversationId: 3,
              content: 'I\'ve prepared a draft of your will and trust documents based on our discussion.',
              timestamp: new Date(lastWeek.setHours(9, 5)).toISOString(),
              sender: { id: 'attorney1', name: user?.displayName || 'Sarah Nguyen', role: 'attorney', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
              attachments: [
                { id: 3, name: 'Will_Draft.pdf', size: '1.5 MB', type: 'application/pdf' },
                { id: 4, name: 'Trust_Documents.pdf', size: '2.3 MB', type: 'application/pdf' }
              ],
              isRead: true
            },
            {
              id: 12,
              conversationId: 3,
              content: 'Robert will be following up with you to schedule a time to sign these documents.',
              timestamp: new Date(lastWeek.setHours(9, 10)).toISOString(),
              sender: { id: 'attorney1', name: user?.displayName || 'Sarah Nguyen', role: 'attorney', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
              attachments: [],
              isRead: true
            },
            {
              id: 13,
              conversationId: 3,
              content: 'Hello Mr. Doe, I\'d like to schedule a time for you to come in and sign your estate planning documents. Are you available next Tuesday at 10:00 AM?',
              timestamp: new Date(lastWeek.setHours(14, 30)).toISOString(),
              sender: { id: 'paralegal1', name: 'Robert Chen', role: 'paralegal', avatar: 'https://randomuser.me/api/portraits/men/75.jpg' },
              attachments: [],
              isRead: true
            },
            {
              id: 14,
              conversationId: 3,
              content: 'Tuesday at 10:00 AM works for me. I\'ll see you then.',
              timestamp: new Date(lastWeek.setHours(16, 45)).toISOString(),
              sender: { id: 'client1', name: 'John Doe', role: 'client', avatar: null },
              attachments: [],
              isRead: true
            },
            {
              id: 15,
              conversationId: 3,
              content: 'Thank you for your time today. I\'ve attached the estate planning documents for your records.',
              timestamp: new Date(lastWeek.setHours(11, 15)).toISOString(),
              sender: { id: 'attorney1', name: user?.displayName || 'Sarah Nguyen', role: 'attorney', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
              attachments: [
                { id: 5, name: 'Signed_Estate_Documents.pdf', size: '3.1 MB', type: 'application/pdf' }
              ],
              isRead: true
            },
            
            // Firm Meeting Notes
            {
              id: 16,
              conversationId: 4,
              content: 'Here are the meeting notes from yesterday\'s firm meeting. Please review the new case assignment section.',
              timestamp: new Date(today.setDate(today.getDate() - 2)).toISOString(),
              sender: { id: 'attorney3', name: 'Jessica Taylor', role: 'attorney', avatar: 'https://randomuser.me/api/portraits/women/68.jpg' },
              attachments: [
                { id: 6, name: 'Firm_Meeting_Notes.docx', size: '245 KB', type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }
              ],
              isRead: true
            },
            {
              id: 17,
              conversationId: 4,
              content: 'Thanks Jessica. I see I\'ve been assigned the new Thompson case. I\'ll review the files today.',
              timestamp: new Date(today.setHours(today.getHours() - 30)).toISOString(),
              sender: { id: 'attorney1', name: user?.displayName || 'Sarah Nguyen', role: 'attorney', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
              attachments: [],
              isRead: true
            },
            {
              id: 18,
              conversationId: 4,
              content: 'I\'ve also been assigned to work with Sarah on the Thompson case. Let\'s schedule a time to discuss strategy.',
              timestamp: new Date(today.setHours(today.getHours() - 28)).toISOString(),
              sender: { id: 'attorney2', name: 'Michael Brown', role: 'attorney', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
              attachments: [],
              isRead: true
            },
            
            // Jones Divorce
            {
              id: 19,
              conversationId: 6,
              content: 'Michael, I\'ve prepared a draft of the divorce petition. Please review it and let me know if you have any changes.',
              timestamp: new Date(today.setDate(today.getDate() - 5)).toISOString(),
              sender: { id: 'attorney1', name: user?.displayName || 'Sarah Nguyen', role: 'attorney', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
              attachments: [
                { id: 7, name: 'Divorce_Petition_Draft.pdf', size: '875 KB', type: 'application/pdf' }
              ],
              isRead: true
            },
            {
              id: 20,
              conversationId: 6,
              content: 'The draft looks good. I\'d like to discuss the child custody arrangements in more detail before we file.',
              timestamp: new Date(today.setDate(today.getDate() - 4)).toISOString(),
              sender: { id: 'client3', name: 'Michael Johnson', role: 'client', avatar: 'https://randomuser.me/api/portraits/men/23.jpg' },
              attachments: [],
              isRead: true
            },
            {
              id: 21,
              conversationId: 6,
              content: 'I just received the financial disclosure from the opposing party. Let\'s schedule a call to discuss next steps.',
              timestamp: new Date(today.setHours(today.getHours() - 4)).toISOString(),
              sender: { id: 'attorney1', name: user?.displayName || 'Sarah Nguyen', role: 'attorney', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
              attachments: [
                { id: 8, name: 'Financial_Disclosure.pdf', size: '1.3 MB', type: 'application/pdf' }
              ],
              isRead: true
            },
            
            // Expert Witness
            {
              id: 22,
              conversationId: 7,
              content: 'Dr. Wilson, thank you for agreeing to serve as an expert witness in the Smith v. Johnson case. I\'ve attached the case files for your review.',
              timestamp: new Date(today.setDate(today.getDate() - 5)).toISOString(),
              sender: { id: 'attorney1', name: user?.displayName || 'Sarah Nguyen', role: 'attorney', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
              attachments: [
                { id: 9, name: 'Smith_v_Johnson_Case_Files.pdf', size: '8.7 MB', type: 'application/pdf' },
                { id: 10, name: 'Medical_Records.pdf', size: '5.2 MB', type: 'application/pdf' }
              ],
              isRead: true
            },
            {
              id: 23,
              conversationId: 7,
              content: 'Thank you for sending over the case files. I\'ve reviewed them and can confirm I\'m available to testify on the proposed date.',
              timestamp: new Date(today.setDate(today.getDate() - 3)).toISOString(),
              sender: { id: 'expert1', name: 'Dr. James Wilson', role: 'expert witness', avatar: null },
              attachments: [],
              isRead: false
            },
            
            // Paralegal Updates
            {
              id: 24,
              conversationId: 8,
              content: 'Team, I need drafts of the following documents by the end of the week: 1) Jones divorce petition, 2) Williams probate filing, 3) Brown property settlement',
              timestamp: new Date(today.setDate(today.getDate() - 3)).toISOString(),
              sender: { id: 'attorney1', name: user?.displayName || 'Sarah Nguyen', role: 'attorney', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
              attachments: [],
              isRead: true
            },
            {
              id: 25,
              conversationId: 8,
              content: 'I\'ll handle the Jones divorce petition and the Brown property settlement.',
              timestamp: new Date(today.setDate(today.getDate() - 3, today.getHours() + 1)).toISOString(),
              sender: { id: 'paralegal1', name: 'Robert Chen', role: 'paralegal', avatar: 'https://randomuser.me/api/portraits/men/75.jpg' },
              attachments: [],
              isRead: true
            },
            {
              id: 26,
              conversationId: 8,
              content: 'I\'ll take care of the Williams probate filing.',
              timestamp: new Date(today.setDate(today.getDate() - 3, today.getHours() + 1, today.getMinutes() + 15)).toISOString(),
              sender: { id: 'paralegal2', name: 'Lisa Martinez', role: 'paralegal', avatar: 'https://randomuser.me/api/portraits/women/45.jpg' },
              attachments: [],
              isRead: true
            },
            {
              id: 27,
              conversationId: 8,
              content: 'I\'ve prepared the drafts for the Johnson, Williams, and Brown cases. They\'re ready for your review.',
              timestamp: new Date(today.setHours(today.getHours() - 2)).toISOString(),
              sender: { id: 'paralegal2', name: 'Lisa Martinez', role: 'paralegal', avatar: 'https://randomuser.me/api/portraits/women/45.jpg' },
              attachments: [
                { id: 11, name: 'Jones_Divorce_Petition.docx', size: '420 KB', type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
                { id: 12, name: 'Williams_Probate_Filing.docx', size: '385 KB', type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
                { id: 13, name: 'Brown_Property_Settlement.docx', size: '510 KB', type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }
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
  
  // Filter conversations based on search term, filter selection, and active tab
  const filteredConversations = conversations.filter(conversation => {
    // First filter by tab
    if (activeTab !== 'all' && conversation.category !== activeTab) return false;
    
    // Then filter by conversation filter (all, unread, priority, archived)
    if (conversationFilter === 'unread' && conversation.unread === 0) return false;
    if (conversationFilter === 'priority' && !conversation.hasPriority) return false;
    if (conversationFilter === 'archived' && !conversation.isArchived) return false;
    if (conversationFilter === 'all' && conversation.isArchived) return false;
    
    // Then filter by search term
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      return (
        conversation.title.toLowerCase().includes(lowerSearchTerm) ||
        (conversation.caseName && conversation.caseName.toLowerCase().includes(lowerSearchTerm)) ||
        (conversation.caseNumber && conversation.caseNumber.toLowerCase().includes(lowerSearchTerm)) ||
        conversation.participants.some(p => 
          p.name.toLowerCase().includes(lowerSearchTerm) ||
          p.role.toLowerCase().includes(lowerSearchTerm)
        ) ||
        (conversation.tags && conversation.tags.some(tag => 
          tag.toLowerCase().includes(lowerSearchTerm)
        ))
      );
    }
    
    return true;
  });
  
  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if ((!newMessage.trim() && !fileToUpload) || !selectedConversation) return;
    
    // Set sending state
    setIsSending(true);
    
    // Create message
    const newMessageObj = {
      id: Math.max(...messages.map(m => m.id)) + 1,
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
      
      // Simulate reply for conversation 1
      if (selectedConversation.id === 1) {
        setTimeout(() => {
          setTypingIndicator(true);
          
          setTimeout(() => {
            setTypingIndicator(false);
            
            const replyMessage = {
              id: Math.max(...messages.map(m => m.id), newMessageObj.id) + 1,
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
      }
      
      setIsSending(false);
    }, 500);
  };
  
  // Handle creating a new conversation
  const handleCreateNewConversation = (e) => {
    e.preventDefault();
    
    if (!newConversation.clientId || !newConversation.subject || !newConversation.initialMessage) return;
    
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
          avatar: client.avatar 
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
      id: Math.max(...messages.map(m => m.id)) + 1,
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
  
  // Handle sending bulk messages
  const handleSendBulkMessage = (e) => {
    e.preventDefault();
    
    if (!bulkMessage.subject || !bulkMessage.message || selectedClients.length === 0) {
      // Add validation if needed
      return;
    }
    
    // In a real app, this would send to an API
    console.log('Sending bulk message:', {
      subject: bulkMessage.subject,
      message: bulkMessage.message,
      recipients: selectedClients.map(id => clients.find(client => client.id === id)),
      attachment: bulkMessage.attachment
    });
    
    // Create new conversations for each selected client
    const newConversations = selectedClients.map(clientId => {
      const client = clients.find(c => c.id === clientId);
      
      return {
        id: Math.max(...conversations.map(c => c.id)) + 1 + Math.random(),
        title: bulkMessage.subject,
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
            avatar: client.avatar 
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
        tags: ['bulk'],
        category: 'clients'
      };
    });
    
    // Add conversations to list
    setConversations(prev => [...newConversations, ...prev]);
    
    // Reset form
    setBulkMessage({
      subject: '',
      message: '',
      attachment: null
    });
    setSelectedClients([]);
    
    // Close modal
    setIsBulkMessageModalOpen(false);
  };
  
  // Toggle client selection
  const toggleClientSelection = (clientId) => {
    setSelectedClients(prev => 
      prev.includes(clientId)
        ? prev.filter(id => id !== clientId)
        : [...prev, clientId]
    );
  };
  
  // Select/Deselect all clients
  const selectAllClients = () => {
    if (selectedClients.length === clients.length) {
      setSelectedClients([]);
    } else {
      setSelectedClients(clients.map(client => client.id));
    }
  };
  
  // Format message timestamp
  const formatMessageTime = (timestamp) => {
    try {
      const date = parseISO(timestamp);
      
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
      const date = parseISO(timestamp);
      
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
  
  // Get role badge color
  const getRoleBadgeColor = (role) => {
    switch (role.toLowerCase()) {
      case 'attorney':
        return 'bg-blue-100 text-blue-800';
      case 'paralegal':
        return 'bg-purple-100 text-purple-800';
      case 'client':
        return 'bg-green-100 text-green-800';
      case 'expert witness':
        return 'bg-yellow-100 text-yellow-800';
      case 'judge':
        return 'bg-red-100 text-red-800';
      case 'billing':
        return 'bg-indigo-100 text-indigo-800';
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
  
  // Get available cases for selected client
  const getClientCases = (clientId) => {
    if (!clientId) return [];
    return cases.filter(c => c.clientId === clientId);
  };
  
  // Toggle priority flag
  const togglePriority = (e, conversationId) => {
    e.stopPropagation();
    
    setConversations(prevConversations => 
      prevConversations.map(conv => 
        conv.id === conversationId
          ? { ...conv, hasPriority: !conv.hasPriority }
          : conv
      )
    );
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
          <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
            <button
              onClick={() => setIsNewMessageModalOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#800000] hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
            >
              <HiOutlinePlusCircle className="-ml-1 mr-2 h-5 w-5" />
              New Message
            </button>
            <button
              onClick={() => setIsBulkMessageModalOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
            >
              <HiOutlineUsers className="-ml-1 mr-2 h-5 w-5" />
              Bulk Message
            </button>
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
            >
              <HiOutlineMenuAlt2 className="-ml-1 mr-2 h-5 w-5" />
              {showSidebar ? 'Hide Details' : 'Show Details'}
            </button>
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
                  placeholder="Search messages or clients"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
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
                    } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setActiveTab('clients')}
                    className={`${
                      activeTab === 'clients'
                        ? 'border-[#800000] text-[#800000]'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm`}
                  >
                    Clients
                  </button>
                  <button
                    onClick={() => setActiveTab('team')}
                    className={`${
                      activeTab === 'team'
                        ? 'border-[#800000] text-[#800000]'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm`}
                  >
                    Team
                  </button>
                  <button
                    onClick={() => setActiveTab('other')}
                    className={`${
                      activeTab === 'other'
                        ? 'border-[#800000] text-[#800000]'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm`}
                  >
                    Other
                  </button>
                </nav>
              </div>
              
              {/* Conversation filters */}
              <div className="flex space-x-2 overflow-x-auto pb-2">
                <button
                  onClick={() => setConversationFilter('all')}
                  className={`${
                    conversationFilter === 'all'
                      ? 'bg-[#800000] text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  } px-3 py-1.5 rounded-md font-medium text-sm transition-all whitespace-nowrap border border-gray-200`}
                >
                  All
                </button>
                <button
                  onClick={() => setConversationFilter('unread')}
                  className={`${
                    conversationFilter === 'unread'
                      ? 'bg-[#800000] text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  } px-3 py-1.5 rounded-md font-medium text-sm transition-all whitespace-nowrap border border-gray-200 flex items-center`}
                >
                  Unread
                  {conversations.filter(c => c.unread > 0).length > 0 && (
                    <span className="ml-1.5 flex-shrink-0 h-5 w-5 flex items-center justify-center rounded-full bg-white text-[#800000] text-xs">
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
                  } px-3 py-1.5 rounded-md font-medium text-sm transition-all whitespace-nowrap border border-gray-200`}
                >
                  Priority
                </button>
                <button
                  onClick={() => setConversationFilter('archived')}
                  className={`${
                    conversationFilter === 'archived'
                      ? 'bg-[#800000] text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  } px-3 py-1.5 rounded-md font-medium text-sm transition-all whitespace-nowrap border border-gray-200`}
                >
                  Archived
                </button>
              </div>
            </div>
            
            {/* Conversation List */}
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.length > 0 ? (
                <>
                  <div className="px-4 py-2 bg-gray-50 sticky top-0 z-10">
                    <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {conversationFilter === 'all' ? 'All Conversations' : 
                       conversationFilter === 'unread' ? 'Unread Messages' :
                       conversationFilter === 'priority' ? 'Priority Conversations' : 'Archived Conversations'}
                      <span className="ml-1 text-gray-400">({filteredConversations.length})</span>
                    </h3>
                  </div>
                  <ul className="divide-y divide-gray-200">
                    {filteredConversations.map((conversation) => {
                      // Find the client or primary non-attorney participant
                      const otherParticipant = conversation.participants.find(p => p.role === 'client') || 
                                              conversation.participants.find(p => p.id !== 'attorney1');
                      
                      return (
                        <li 
                          key={conversation.id}
                          className={`relative hover:bg-gray-50 cursor-pointer transition-colors duration-150 ${
                            selectedConversation?.id === conversation.id ? 'bg-gray-50 border-l-4 border-[#800000]' : ''
                          }`}
                          onClick={() => {
                            setSelectedConversation(conversation);
                            setShowMobileConversations(false);
                          }}
                        >
                          <div className="px-4 py-4">
                            <div className="flex justify-between items-start">
                              <div className="flex items-center space-x-3">
                                {/* Avatar with online status indicator */}
                                <div className="relative">
                                  <div className="w-10 h-10 rounded-full overflow-hidden">
                                    <img 
                                      src={otherParticipant.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(otherParticipant.name)}&background=random`} 
                                      alt={otherParticipant.name} 
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  {/* Active status indicator */}
                                  <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full ring-2 ring-white bg-green-400" />
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-sm font-medium text-gray-900 flex items-center">
                                    {conversation.title}
                                    {conversation.hasPriority && (
                                      <span className="ml-2 text-xs px-1.5 py-0.5 bg-red-100 text-red-800 rounded-full">Priority</span>
                                    )}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {otherParticipant.name} • {otherParticipant.role}
                                  </span>
                                </div>
                              </div>
                              <div className="text-xs text-gray-500">
                                {formatConversationTime(conversation.lastMessage.timestamp)}
                              </div>
                            </div>
                            <div className="flex items-center mt-1">
                              <p className="text-sm text-gray-600 line-clamp-1 flex-1">
                                {conversation.lastMessage.sender.id === 'attorney1' ? 'You: ' : `${conversation.lastMessage.sender.name}: `}
                                {conversation.lastMessage.content}
                              </p>
                              <div className="flex items-center ml-2">
                                {conversation.unread > 0 && (
                                  <span className="bg-[#800000] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-semibold">
                                    {conversation.unread}
                                  </span>
                                )}
                                {conversation.isArchived && (
                                  <span className="ml-1">
                                    <HiOutlineArchive className="h-4 w-4 text-gray-400" />
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </>
              ) : (
                <div className="p-8 text-center text-gray-500 flex flex-col items-center justify-center h-full">
                  <HiOutlineInboxIn className="w-12 h-12 text-gray-300 mb-3" />
                  <p className="text-gray-600 font-medium">No conversations found</p>
                  <p className="text-sm">Click "New Message" to start a conversation</p>
                </div>
              )}
            </div>
          </div>
          
                    {/* Mobile conversation view - hidden on larger screens */}
          <div className={`flex-1 ${showMobileConversations ? 'block' : 'hidden lg:block'}`}>
            {selectedConversation ? (
              <div className="flex flex-col h-full">
                {/* Conversation header */}
                <div className="bg-white shadow-md px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button 
                      className="lg:hidden mr-1 text-gray-500"
                      onClick={() => setShowMobileConversations(true)}
                      aria-label="Back to conversation list"
                    >
                      <HiOutlineChevronLeft className="w-6 h-6" />
                    </button>
                    <div className="w-10 h-10 rounded-full overflow-hidden">
                      <img 
                        src={selectedConversation.participants[1]?.avatar || ''} 
                        alt={selectedConversation.participants[1]?.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-lg font-semibold text-gray-900">
                        {selectedConversation.title}
                      </span>
                      <span className="text-sm text-gray-500">
                        {selectedConversation.participants[1]?.name}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => toggleArchiveConversation(e, selectedConversation.id)}
                      className="text-gray-500 hover:text-gray-700"
                      title={selectedConversation.isArchived ? 'Unarchive conversation' : 'Archive conversation'}
                    >
                      {selectedConversation.isArchived ? (
                        <HiOutlineFolder className="w-6 h-6" />
                      ) : (
                        <HiOutlineArchive className="w-6 h-6" />
                      )}
                    </button>
                    <button
                      onClick={() => setShowSidebar(true)}
                      className="text-gray-500 hover:text-gray-700"
                      title="View details"
                    >
                      <HiOutlineInformationCircle className="w-6 h-6" />
                    </button>
                  </div>
                </div>
                
                {/* Messages container */}
                <div ref={messageContainerRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
                  {/* Grouped messages by date */}
                  {Object.entries(groupedMessages).map(([date, msgs]) => (
                    <div key={date} className="space-y-2">
                      <div className="text-xs text-gray-500 text-center">
                        {formatGroupDate(date)}
                      </div>
                      {msgs.map((message) => (
                        <div key={message.id} className={`flex gap-3 ${message.sender.id === 'attorney1' ? 'justify-end' : ''}`}>
                          {message.sender.id !== 'attorney1' && (
                            <div className="flex-shrink-0">
                              <div className="w-8 h-8 rounded-full overflow-hidden">
                                <img 
                                  src={message.sender.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(message.sender.name)}&background=random`} 
                                  alt={message.sender.name} 
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </div>
                          )}
                          <div className={`max-w-[75%] rounded-lg p-3 ${
                            message.sender.id === 'attorney1' 
                              ? 'bg-[#8000001a] text-gray-800 rounded-tr-none' 
                              : 'bg-gray-100 text-gray-800 rounded-tl-none'
                          }`}>
                            <div className="flex justify-between items-center">
                              <div className="text-sm font-medium text-gray-900">
                                {message.sender.name}
                              </div>
                              <div className="text-xs text-gray-500">
                                {formatMessageTime(message.timestamp)}
                              </div>
                            </div>
                            <div className="mt-1 text-sm text-gray-700">
                              {message.content}
                            </div>
                            {/* Attachments section remains the same */}
                          </div>
                          {message.sender.id === 'attorney1' && (
                            <div className="flex-shrink-0">
                              <div className="w-8 h-8 rounded-full overflow-hidden">
                                <img 
                                  src={message.sender.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(message.sender.name)}&background=random`}
                                  alt={message.sender.name} 
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                  
                  {/* Typing indicator */}
                  {typingIndicator && (
                    <div className="flex gap-3 animate-pulse">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                      </div>
                      <div className="flex-1 bg-gray-100 rounded-lg p-3">
                        <div className="flex justify-between items-center">
                          <div className="text-sm font-medium text-gray-900">
                            Jane Smith
                          </div>
                          <div className="text-xs text-gray-500">
                            Just now
                          </div>
                        </div>
                        <div className="mt-1 text-sm text-gray-700">
                          Typing...
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
                
                {/* Conversation footer */}
                <div className="bg-white border-t border-gray-200 px-4 py-3">
                  <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                    {/* Attachment button - hidden on mobile */}
                    <div className="hidden sm:block">
                      <button
                        type="button"
                        onClick={() => setShowAttachmentOptions(!showAttachmentOptions)}
                        className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200"
                        title="Add attachment"
                      >
                        <HiOutlinePaperClip className="w-5 h-5" />
                      </button>
                    </div>
                    
                    {/* Message input */}
                    <div className="flex-1">
                      <input
                        type="text"
                        className="focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                        placeholder="Type your message here..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                      />
                    </div>
                    
                    {/* Send button */}
                    <div>
                      <button
                        type="submit"
                        disabled={isSending}
                        className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                          isSending ? 'bg-gray-400' : 'bg-[#800000] hover:bg-[#600000]'
                        } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]`}
                      >
                        {isSending ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Sending...
                          </>
                        ) : (
                          <>
                            <HiOutlinePaperAirplane className="-ml-1 mr-2 h-5 w-5" />
                            Send
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                  
                  {/* Attachment options - hidden on mobile */}
                  {showAttachmentOptions && (
                    <div className="mt-2 flex gap-2">
                      <button
                        onClick={() => handleAttachmentClick('document')}
                        className="inline-flex items-center justify-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#800000] hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                      >
                        <HiOutlineDocumentAdd className="-ml-1 mr-2 h-5 w-5" />
                        Document
                      </button>
                      <button
                        onClick={() => handleAttachmentClick('image')}
                        className="inline-flex items-center justify-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#800000] hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                      >
                        <HiOutlinePhotograph className="-ml-1 mr-2 h-5 w-5" />
                        Image
                      </button>
                      <button
                        onClick={() => handleAttachmentClick('template')}
                        className="inline-flex items-center justify-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#800000] hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                      >
                        <HiOutlineTemplate className="-ml-1 mr-2 h-5 w-5" />
                        Template
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col h-full justify-center items-center text-center p-8 bg-gray-50">
                <div className="bg-white p-8 rounded-lg shadow-sm max-w-md">
                  <HiOutlineChat className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Welcome to your Message Center
                  </h2>
                  <p className="text-sm text-gray-600 mb-6">
                    Select a conversation from the list to view messages or start a new conversation with a client.
                  </p>
                  <button
                    onClick={() => setIsNewMessageModalOpen(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#800000] hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                  >
                    <HiOutlinePlusCircle className="-ml-1 mr-2 h-5 w-5" />
                    New Message
                  </button>
                </div>
              </div>
            )}
          </div>      
          
          {/* Conversation details sidebar - hidden on mobile */}
          <div className={`${
            showSidebar ? 'block' : 'hidden'
          } lg:flex lg:flex-col w-full lg:w-80 xl:w-96 border-l border-gray-200`}>
            {/* Sidebar header */}
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Conversation Details
              </h2>
            </div>
            
            {/* Sidebar content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Participants */}
              <div>
                <h3 className="text-sm font-medium text-gray-900">
                  Participants
                </h3>
                <div className="mt-2 flex flex-col gap-2">
                  {selectedConversation?.participants.map(participant => (
                    <div key={participant.id} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden">
                        <img 
                          src={participant.avatar} 
                          alt={participant.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900">
                          {participant.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          {participant.role}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              
              {/* Case details */}
              {selectedConversation.caseId && (
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    Case Details
                  </h3>
                  <div className="mt-2 bg-gray-100 rounded-lg p-3">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm text-gray-700">
                        <span className="font-medium text-gray-900">Case Name:</span> {selectedConversation.caseName}
                      </span>
                      <span className="text-sm text-gray-700">
                        <span className="font-medium text-gray-900">Case Number:</span> {selectedConversation.caseNumber}
                      </span>
                      <span className="text-sm text-gray-700">
                        <span className="font-medium text-gray-900">Status:</span> {cases.find(c => c.id === selectedConversation.caseId)?.status}
                      </span>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Last message details */}
              <div>
                <h3 className="text-sm font-medium text-gray-900">
                  Last Message
                </h3>
                <div className="mt-2 bg-gray-100 rounded-lg p-3">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm text-gray-700">
                      <span className="font-medium text-gray-900">From:</span> {selectedConversation.lastMessage.sender.name}
                    </span>
                    <span className="text-sm text-gray-700">
                      <span className="font-medium text-gray-900">Sent:</span> {format(new Date(selectedConversation.lastMessage.timestamp), 'MMM d, h:mm a')}
                    </span>
                    <span className="text-sm text-gray-700">
                      <span className="font-medium text-gray-900">Message:</span> {selectedConversation.lastMessage.content}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Actions - Archive, Mark as Unread, Delete */}
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => toggleArchiveConversation(event, selectedConversation.id)}
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#800000] hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                >
                  <HiOutlineArchive className="w-5 h-5 mr-2" />
                  {selectedConversation.isArchived ? 'Unarchive' : 'Archive'} Conversation
                </button>
                <button
                  onClick={() => {
                    // Mark as unread logic here
                  }}
                  className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                >
                  <HiOutlineMail className="w-5 h-5 mr-2" />
                  Mark as Unread
                </button>
                <button
                  onClick={() => {
                    // Delete conversation logic here
                  }}
                  className="inline-flex items-center justify-center px-4 py-2 border border-red-600 rounded-md shadow-sm text-sm font-medium text-red-600 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600"
                >
                  <HiOutlineTrash className="w-5 h-5 mr-2" />
                  Delete Conversation
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
        {/* New message modal */}
        <Transition.Root show={isNewMessageModalOpen} as={Fragment}>
            <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto" onClose={setIsNewMessageModalOpen}>
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
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
                >
                <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full">
                    <div className="px-4 py-5 sm:px-6">
                    <div>
                        <h3 className="text-lg font-medium leading-6 text-gray-900">
                        New Message
                        </h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">
                        Send a message to your client or team member.
                        </p>
                    </div>
                    </div>
                    
                    <div className="border-t border-gray-200">
                    <div className="px-4 py-5 sm:px-6">
                        <form onSubmit={handleSendMessage}>
                        <div className="grid grid-cols-1 gap-y-4">
                            <div>
                            <label htmlFor="recipient" className="block text-sm font-medium text-gray-700">
                                Recipient
                            </label>
                            <div className="mt-1">
                                <select
                                id="recipient"
                                name="recipient"
                                className="focus:ring-[#800000] focus:border-[#800000] block w-full pl-3 pr-10 py-2 text-base border-gray-300 rounded-md"
                                value={newConversation.clientId}
                                onChange={(e) => setNewConversation({ ...newConversation, clientId: e.target.value })}
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
                            <label htmlFor="case" className="block text-sm font-medium text-gray-700">
                                Case
                            </label>
                            <div className="mt-1">
                                <select
                                id="case"
                                name="case"
                                className="focus:ring-[#800000] focus:border-[#800000] block w-full pl-3 pr-10 py-2 text-base border-gray-300 rounded-md"
                                value={newConversation.caseId}
                                onChange={(e) => setNewConversation({ ...newConversation, caseId: e.target.value })}
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
                            <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                                Subject
                            </label>
                            <div className="mt-1">
                                <input
                                type="text"
                                id="subject"
                                name="subject"
                                className="focus:ring-[#800000] focus:border-[#800000] block w-full pl-3 pr-10 py-2 text-base border-gray-300 rounded-md"
                                placeholder="Enter message subject"
                                value={newConversation.subject}
                                onChange={(e) => setNewConversation({ ...newConversation, subject: e.target.value })}
                                />
                            </div>
                            </div>
                            
                            <div>
                            <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                                Message
                            </label>
                            <div className="mt-1">
                                <textarea
                                id="message"
                                name="message"
                                rows="3"
                                className="focus:ring-[#800000] focus:border-[#800000] block w-full pl-3 pr-10 py-2 text-base border-gray-300 rounded-md"
                                placeholder="Type your message here..."
                                value={newConversation.initialMessage}
                                onChange={(e) => setNewConversation({ ...newConversation, initialMessage: e.target.value })}
                                />
                            </div>
                            </div>
                            
                            {/* Attachment section - show on larger screens */}
                            <div className="hidden sm:block">
                            <div className="flex items-center gap-2">
                                <button
                                type="button"
                                onClick={() => setShowAttachmentOptions(!showAttachmentOptions)}
                                className="inline-flex items-center justify-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#800000] hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                                >
                                <HiOutlinePaperClip className="w-5 h-5 mr-2" />
                                Add Attachment
                                </button>
                            </div>
                            
                            {showAttachmentOptions && (
                                <div className="mt-2 flex gap-2">
                                <button
                                    onClick={() => handleAttachmentClick('document')}
                                    className="inline-flex items-center justify-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#800000] hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                                >
                                    <HiOutlineDocumentAdd className="-ml-1 mr-2 h-5 w-5" />
                                    Document
                                </button>
                                <button
                                    onClick={() => handleAttachmentClick('image')}
                                    className="inline-flex items-center justify-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#800000] hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                                >
                                    <HiOutlinePhotograph className="-ml-1 mr-2 h-5 w-5" />
                                    Image
                                </button>
                                <button
                                    onClick={() => handleAttachmentClick('template')}
                                    className="inline-flex items-center justify-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#800000] hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                                >
                                    <HiOutlineTemplate className="-ml-1 mr-2 h-5 w-5" />
                                    Template
                                  </button>
                                </div>
                            )}
                            </div>
                            
                            {/* File input - hidden */}
                            <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                            />
                        </div>
                        
                        <div className="flex gap-2">
                            <button
                            type="submit"
                            className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#800000] hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                            >
                            <HiOutlinePaperAirplane className="-ml-1 mr-2 h-5 w-5" />
                            Send
                            </button>
                            <button
                            onClick={() => setIsNewMessageModalOpen(false)}
                            className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
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
            <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto" onClose={setIsBulkMessageModalOpen}>
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
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                >
                    <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full">
                    <div className="px-4 py-5 sm:px-6">
                        <div>
                        <h3 className="text-lg font-medium leading-6 text-gray-900">
                            Send Bulk Message
                        </h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">
                            Select clients and compose a message to send to multiple clients at once.
                        </p>
                        </div>
                    </div>
                    
                    <div className="border-t border-gray-200">
                        <div className="px-4 py-5 sm:px-6">
                        <form onSubmit={handleSendBulkMessage}>
                            <div className="grid grid-cols-1 gap-y-4">
                            <div>
                                <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                                Subject
                                </label>
                                <div className="mt-1">
                                <input
                                    type="text"
                                    id="subject"
                                    name="subject"
                                    className="focus:ring-[#800000] focus:border-[#800000] block w-full pl-3 pr-10 py-2 text-base border-gray-300 rounded-md"
                                    placeholder="Enter message subject"
                                    value={bulkMessage.subject}
                                    onChange={(e) => setBulkMessage({ ...bulkMessage, subject: e.target.value })}
                                />
                                </div>
                            </div>
                            
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                                Message
                                </label>
                                <div className="mt-1">
                                <textarea
                                    id="message"
                                    name="message"
                                    rows="3"
                                    className="focus:ring-[#800000] focus:border-[#800000] block w-full pl-3 pr-10 py-2 text-base border-gray-300 rounded-md"
                                    placeholder="Type your message here..."
                                    value={bulkMessage.message}
                                    onChange={(e) => setBulkMessage({ ...bulkMessage, message: e.target.value })}
                                />
                                </div>
                            </div>
                            
                            {/* Client selection for bulk message */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                Select Clients
                                </label>
                                <div className="mt-1">
                                <div className="flex flex-col gap-2">
                                    <button
                                    onClick={selectAllClients}
                                    className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                                    >
                                    {selectedClients.length === clients.length ? 'Deselect All' : 'Select All'}
                                    </button>
                                    
                                    {clients.map(client => (
                                    <div key={client.id} className="flex items-center gap-3">
                                        <div className="flex-shrink-0">
                                        <div className="w-10 h-10 rounded-full overflow-hidden">
                                            <img 
                                            src={client.avatar} 
                                            alt={client.name} 
                                            className="w-full h-full object-cover"
                                            />
                                        </div>
                                        </div>
                                        <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <div className="text-sm font-medium text-gray-900">
                                            {client.name}
                                            </div>
                                            <div className="flex items-center gap-2">
                                            <span className="text-xs rounded-full" style={{ 
                                                paddingLeft: '0.5rem', 
                                                paddingRight: '0.5rem', 
                                                paddingTop: '0.125rem', 
                                                paddingBottom: '0.125rem',
                                                backgroundColor: client.status === 'Active' ? '#d1fae5' : '#fee2e2',
                                                color: client.status === 'Active' ? '#065f46' : '#b91c1c'
                                            }}>
                                                {client.status}
                                            </span>
                                            <button
                                                onClick={(e) => {
                                                e.stopPropagation();
                                                toggleClientSelection(client.id);
                                                }}
                                                className={`${
                                                selectedClients.includes(client.id)
                                                    ? 'bg-[#800000] text-white'
                                                    : 'bg-white text-gray-700 hover:bg-gray-50'
                                                } flex items-center justify-center px-3 py-2 rounded-md font-medium text-sm transition-all`}
                                            >
                                                {selectedClients.includes(client.id) ? (
                                                <HiOutlineCheck className="w-5 h-5" />
                                                ) : (
                                                <HiOutlinePlus className="w-5 h-5" />
                                                )}
                                            </button>
                                            </div>
                                        </div>
                                        </div>
                                    </div>
                                    ))}
                                </div>
                                </div>
                            </div>
                            
                            <div className="flex gap-2">
                                <button
                                type="submit"
                                className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#800000] hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                                >
                                <HiOutlinePaperAirplane className="-ml-1 mr-2 h-5 w-5" />
                                Send
                                </button>
                                <button
                                onClick={() => setIsBulkMessageModalOpen(false)}
                                className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                                >
                                <HiOutlineX className="-ml-1 mr-2 h-5 w-5" />
                                Cancel
                                </button>
                            </div>
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

export default AttorneyMessagesPage;
