import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import {
  HiOutlinePaperAirplane,
  HiOutlinePaperClip,
  HiOutlineUserCircle,
  HiOutlineDotsVertical,
  HiOutlineTrash,
  HiOutlineSearch,
  HiOutlineDocumentDuplicate,
  HiOutlineChatAlt,
  HiOutlineExclamationCircle,
  HiOutlineX,
  HiOutlineChevronDown,
  HiOutlineArrowLeft,
  HiOutlineArrowRight,
  HiOutlineEmojiHappy,
  HiOutlinePhotograph,
  HiOutlineRefresh,
  HiOutlineCheckCircle,
  HiOutlineDocument,
  HiOutlineDownload
} from 'react-icons/hi';

const MessagesPage = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sending, setSending] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [fileToUpload, setFileToUpload] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [showMobileConversation, setShowMobileConversation] = useState(false);
  const messagesEndRef = useRef(null);

  // Mock data
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock conversations and messages
        const mockConversations = [
          {
            id: 1,
            title: "Personal Injury Case",
            participants: [
              {
                id: 101,
                name: "Sarah Nguyen",
                role: "Attorney",
                avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              },
              {
                id: 102,
                name: "Michael Rodriguez",
                role: "Paralegal",
                avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              }
            ],
            lastMessage: {
              id: 12,
              senderId: 101,
              content: "We've received your medical records. Can we schedule a call to discuss next steps?",
              timestamp: "2023-05-18T14:30:00Z",
              read: true
            },
            unreadCount: 0,
            messages: [
              {
                id: 1,
                senderId: 101,
                content: "Hello! I've been assigned as your attorney for your personal injury case. How are you feeling?",
                timestamp: "2023-05-15T09:00:00Z",
                read: true
              },
              {
                id: 2,
                senderId: 999, // Client (current user)
                content: "Hi Sarah, thanks for reaching out. I'm still in some pain but getting better each day.",
                timestamp: "2023-05-15T09:10:00Z",
                read: true
              },
              {
                id: 3,
                senderId: 101,
                content: "I'm glad to hear you're improving. Have you received treatment since the accident?",
                timestamp: "2023-05-15T09:15:00Z",
                read: true
              },
              {
                id: 4,
                senderId: 999, // Client (current user)
                content: "Yes, I've been seeing a physical therapist twice a week. I also had X-rays taken last week.",
                timestamp: "2023-05-15T09:20:00Z",
                read: true
              },
              {
                id: 5,
                senderId: 101,
                content: "That's good. Could you please upload those medical records to your document portal when you have them? They'll be crucial for your case.",
                timestamp: "2023-05-15T09:25:00Z",
                read: true
              },
              {
                id: 6,
                senderId: 999, // Client (current user)
                content: "Sure, I'll request copies from my doctor and upload them as soon as I receive them.",
                timestamp: "2023-05-15T09:30:00Z",
                read: true
              },
              {
                id: 7,
                senderId: 102,
                content: "Hello, I'm Michael, the paralegal assigned to your case. I'll be helping Sarah with document management and case preparation.",
                timestamp: "2023-05-16T10:00:00Z",
                read: true
              },
              {
                id: 8,
                senderId: 999, // Client (current user)
                content: "Nice to meet you, Michael. Do you need anything else from me at this point?",
                timestamp: "2023-05-16T10:15:00Z",
                read: true
              },
              {
                id: 9,
                senderId: 102,
                content: "Could you please provide the contact information for your employer? We'll need to document any lost wages due to the accident.",
                timestamp: "2023-05-16T10:20:00Z",
                read: true,
                attachments: [
                  {
                    id: 1,
                    name: "Employment_Verification_Form.pdf",
                    size: "245 KB",
                    type: "application/pdf"
                  }
                ]
              },
              {
                id: 10,
                senderId: 999, // Client (current user)
                content: "I've completed the form and will upload it to the documents section.",
                timestamp: "2023-05-17T11:30:00Z",
                read: true
              },
              {
                id: 11,
                senderId: 999, // Client (current user)
                content: "I just received my medical records from Memorial Hospital. I'll upload them now.",
                timestamp: "2023-05-18T13:45:00Z",
                read: true
              },
              {
                id: 12,
                senderId: 101,
                content: "We've received your medical records. Can we schedule a call to discuss next steps?",
                timestamp: "2023-05-18T14:30:00Z",
                read: true
              }
            ]
          },
          {
            id: 2,
            title: "Estate Planning",
            participants: [
              {
                id: 103,
                name: "James Wilson",
                role: "Estate Planning Attorney",
                avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              }
            ],
            lastMessage: {
              id: 5,
              senderId: 103,
              content: "Your estate planning documents have been completed. Please review and let me know if you have any questions.",
              timestamp: "2023-05-10T16:15:00Z",
              read: false
            },
            unreadCount: 1,
            messages: [
              {
                id: 1,
                senderId: 103,
                content: "Hello, I understand you're interested in creating an estate plan. What specific documents are you looking to establish?",
                timestamp: "2023-05-08T10:00:00Z",
                read: true
              },
              {
                id: 2,
                senderId: 999, // Client (current user)
                content: "Hi James, I'd like to create a will, power of attorney, and an advance healthcare directive.",
                timestamp: "2023-05-08T10:30:00Z",
                read: true
              },
              {
                id: 3,
                senderId: 103,
                content: "Great. I've attached our estate planning questionnaire. Once you complete it, we can begin drafting your documents.",
                timestamp: "2023-05-08T10:45:00Z",
                read: true,
                attachments: [
                  {
                    id: 2,
                    name: "Estate_Planning_Questionnaire.pdf",
                    size: "350 KB",
                    type: "application/pdf"
                  }
                ]
              },
              {
                id: 4,
                senderId: 999, // Client (current user)
                content: "I've completed the questionnaire and uploaded it to the documents section.",
                timestamp: "2023-05-09T14:20:00Z",
                read: true
              },
              {
                id: 5,
                senderId: 103,
                content: "Your estate planning documents have been completed. Please review and let me know if you have any questions.",
                timestamp: "2023-05-10T16:15:00Z",
                read: false,
                attachments: [
                  {
                    id: 3,
                    name: "Will_Draft.pdf",
                    size: "320 KB",
                    type: "application/pdf"
                  },
                  {
                    id: 4,
                    name: "Power_of_Attorney_Draft.pdf",
                    size: "285 KB",
                    type: "application/pdf"
                  },
                  {
                    id: 5,
                    name: "Healthcare_Directive_Draft.pdf",
                    size: "210 KB",
                    type: "application/pdf"
                  }
                ]
              }
            ]
          },
          {
            id: 3,
            title: "Insurance Claim",
            participants: [
              {
                id: 104,
                name: "David Johnson",
                role: "Legal Assistant",
                avatarUrl: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              }
            ],
            lastMessage: {
              id: 3,
              senderId: 999, // Client (current user)
              content: "I've received a settlement offer from the insurance company. It's much lower than we discussed.",
              timestamp: "2023-05-05T15:30:00Z",
              read: true
            },
            unreadCount: 0,
            messages: [
              {
                id: 1,
                senderId: 104,
                content: "Hello, I'll be assisting with your insurance claim. Have you received any correspondence from the insurance company?",
                timestamp: "2023-05-03T11:00:00Z",
                read: true
              },
              {
                id: 2,
                senderId: 999, // Client (current user)
                content: "Yes, I received a letter from them yesterday requesting more information about the incident.",
                timestamp: "2023-05-03T11:15:00Z",
                read: true
              },
              {
                id: 3,
                senderId: 999, // Client (current user)
                content: "I've received a settlement offer from the insurance company. It's much lower than we discussed.",
                timestamp: "2023-05-05T15:30:00Z",
                read: true,
                attachments: [
                  {
                    id: 6,
                    name: "Settlement_Offer.pdf",
                    size: "180 KB",
                    type: "application/pdf"
                  }
                ]
              }
            ]
          }
        ];
        
        setConversations(mockConversations);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching conversations:', err);
        setError('Failed to load messages. Please try again later.');
        setLoading(false);
        toast.error('Error loading messages');
      }
    };
    
    fetchConversations();
    
    // Set up responsive view handler
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // Scroll to bottom of message list when messages change or conversation changes
  useEffect(() => {
    if (messagesEndRef.current && activeConversation) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeConversation]);
  
  // Handle conversation selection
  const handleSelectConversation = (conversation) => {
    // Mark conversation as read
    const updatedConversations = conversations.map(c => {
      if (c.id === conversation.id) {
        // Mark all messages as read
        const updatedMessages = c.messages.map(m => ({ ...m, read: true }));
        return { 
          ...c, 
          messages: updatedMessages,
          unreadCount: 0,
          lastMessage: { 
            ...c.lastMessage, 
            read: true 
          }
        };
      }
      return c;
    });
    
    setConversations(updatedConversations);
    setActiveConversation(conversation);
    
    if (isMobileView) {
      setShowMobileConversation(true);
    }
  };
  
  // Handle back button in mobile view
  const handleBackToList = () => {
    setShowMobileConversation(false);
  };
  
  // Handle sending a message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (message.trim() === '' && !fileToUpload) {
      return;
    }
    
    setSending(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Create a new message object
      const newMessage = {
        id: Math.floor(Math.random() * 10000), // Generate random ID for demo
        senderId: 999, // Client (current user)
        content: message.trim(),
        timestamp: new Date().toISOString(),
        read: true
      };
      
      // Add attachment if there is one
      if (fileToUpload) {
        newMessage.attachments = [
          {
            id: Math.floor(Math.random() * 10000),
            name: fileToUpload.name,
            size: `${Math.round(fileToUpload.size / 1024)} KB`,
            type: fileToUpload.type
          }
        ];
      }
      
      // Update conversations with new message
      const updatedConversations = conversations.map(c => {
        if (c.id === activeConversation.id) {
          const updatedMessages = [...c.messages, newMessage];
          return {
            ...c,
            messages: updatedMessages,
            lastMessage: newMessage
          };
        }
        return c;
      });
      
      setConversations(updatedConversations);
      setActiveConversation(prev => ({
        ...prev,
        messages: [...prev.messages, newMessage],
        lastMessage: newMessage
      }));
      
      // Reset message and file
      setMessage('');
      setFileToUpload(null);
      
      // Scroll to bottom after sending
      if (messagesEndRef.current) {
        setTimeout(() => {
          messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } catch (err) {
      console.error('Error sending message:', err);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };
  
  // Handle file selection
  const handleFileSelect = (e) => {
    if (e.target.files.length > 0) {
      setFileToUpload(e.target.files[0]);
    }
  };
  
  // Remove selected file
  const handleRemoveFile = () => {
    setFileToUpload(null);
  };
  
  // Format timestamp
  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    return format(date, 'MMM d, h:mm a');
  };
  
  // Get sender information
  const getSender = (senderId, conversation) => {
    if (senderId === 999) {
      // Current user
      return {
        name: `${user?.firstName || 'You'} ${user?.lastName || ''}`,
        role: 'You',
        avatarUrl: null
      };
    }
    
    // Find participant
    const participant = conversation?.participants.find(p => p.id === senderId);
    return participant || { name: 'Unknown User', role: 'Unknown', avatarUrl: null };
  };
  
  // Filter conversations by search term
  const filteredConversations = conversations.filter(conversation => 
    conversation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conversation.participants.some(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  // Format attachment type icon
  const getAttachmentIcon = (type) => {
    if (type?.includes('pdf')) {
      return <HiOutlineDocument className="h-5 w-5 text-red-500" />;
    } else if (type?.includes('word') || type?.includes('doc')) {
      return <HiOutlineDocument className="h-5 w-5 text-blue-500" />;
    } else if (type?.includes('image')) {
      return <HiOutlinePhotograph className="h-5 w-5 text-green-500" />;
    } else {
      return <HiOutlinePaperClip className="h-5 w-5 text-gray-500" />;
    }
  };
  
  // Render loading state
  if (loading) {
    return (
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <div className="text-center">
              <svg className="animate-spin h-10 w-10 text-[#800000] mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="mt-4 text-gray-600">Loading messages...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Render error state
  if (error) {
    return (
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <HiOutlineExclamationCircle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Messages</h1>
          <p className="mt-1 text-sm text-gray-500">
            Communicate securely with your legal team
          </p>
        </div>
        
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="flex h-[calc(80vh-100px)] min-h-[500px]">
            {/* Conversation list - hide on mobile when conversation is active */}
            <div className={`${(isMobileView && showMobileConversation) ? 'hidden' : 'flex'} flex-col w-full md:w-1/3 border-r border-gray-200`}>
              <div className="p-4 border-b border-gray-200">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search messages..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-[#800000] focus:border-[#800000]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <HiOutlineSearch className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto">
                {filteredConversations.length > 0 ? (
                  <ul className="divide-y divide-gray-200">
                    {filteredConversations.map((conversation) => (
                      <li
                        key={conversation.id}
                        className={`hover:bg-gray-50 cursor-pointer ${activeConversation?.id === conversation.id ? 'bg-gray-50' : ''}`}
                        onClick={() => handleSelectConversation(conversation)}
                      >
                        <div className="px-4 py-4 flex justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center">
                              <div className="flex-shrink-0">
                                {conversation.participants.length > 0 && conversation.participants[0].avatarUrl ? (
                                  <img
                                    className="h-10 w-10 rounded-full"
                                    src={conversation.participants[0].avatarUrl}
                                    alt={conversation.participants[0].name}
                                  />
                                ) : (
                                  <div className="h-10 w-10 rounded-full bg-[#800000] bg-opacity-10 flex items-center justify-center">
                                    <HiOutlineUserCircle className="h-6 w-6 text-[#800000]" />
                                  </div>
                                )}
                              </div>
                              <div className="ml-4 flex-1">
                                <div className="flex items-center justify-between">
                                  <h3 className="text-sm font-medium text-gray-900 truncate">{conversation.title}</h3>
                                  <p className="text-xs text-gray-500">
                                    {conversation.lastMessage && formatMessageTime(conversation.lastMessage.timestamp)}
                                  </p>
                                </div>
                                <div className="mt-1 flex justify-between">
                                  <p className={`text-sm truncate ${conversation.unreadCount > 0 ? 'font-semibold text-gray-900' : 'text-gray-500'}`}>
                                    {conversation.lastMessage?.content || "No messages yet"}
                                  </p>
                                  {conversation.unreadCount > 0 && (
                                    <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-[#800000] text-xs font-medium text-white">
                                      {conversation.unreadCount}
                                    </span>
                                  )}
                                </div>
                                <div className="mt-1">
                                  <p className="text-xs text-gray-500">
                                    {conversation.participants.map(p => p.name).join(', ')}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full p-4">
                    <HiOutlineChatAlt className="h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">
                      {searchTerm ? "No matching conversations found" : "No conversations yet"}
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Conversation detail - show on mobile only when conversation is active */}
            <div className={`${(isMobileView && !showMobileConversation) ? 'hidden' : 'flex'} flex-col w-full md:w-2/3`}>
              {activeConversation ? (
                <>
                  {/* Conversation header */}
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {isMobileView && (
                          <button
                            onClick={handleBackToList}
                            className="mr-3 text-gray-400 hover:text-gray-500"
                          >
                            <HiOutlineArrowLeft className="h-5 w-5" />
                          </button>
                        )}
                        {activeConversation.participants.length > 0 && activeConversation.participants[0].avatarUrl ? (
                          <img
                            className="h-10 w-10 rounded-full"
                            src={activeConversation.participants[0].avatarUrl}
                            alt={activeConversation.participants[0].name}
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-[#800000] bg-opacity-10 flex items-center justify-center">
                            <HiOutlineUserCircle className="h-6 w-6 text-[#800000]" />
                          </div>
                        )}
                        <div className="ml-3">
                          <h2 className="text-lg font-medium text-gray-900">{activeConversation.title}</h2>
                          <p className="text-sm text-gray-500">
                            {activeConversation.participants.map(p => `${p.name} (${p.role})`).join(', ')}
                          </p>
                        </div>
                      </div>
                      <button className="text-gray-400 hover:text-gray-500">
                        <HiOutlineRefresh className="h-5 w-5" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Messages */}
                  <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                    {activeConversation.messages.length > 0 ? (
                      <ul className="space-y-4">
                        {activeConversation.messages.map((msg) => {
                          const sender = getSender(msg.senderId, activeConversation);
                          const isCurrentUser = msg.senderId === 999;
                          
                          return (
                            <li key={msg.id} className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                              <div className={`flex max-w-[80%] ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}>
                                <div className="flex-shrink-0">
                                  {sender.avatarUrl ? (
                                    <img
                                      className="h-10 w-10 rounded-full"
                                      src={sender.avatarUrl}
                                      alt={sender.name}
                                    />
                                  ) : (
                                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${isCurrentUser ? 'bg-[#800000]' : 'bg-gray-300'}`}>
                                      <span className="text-sm font-medium text-white">
                                        {sender.name.charAt(0).toUpperCase()}
                                      </span>
                                    </div>
                                  )}
                                </div>
                                <div className={`${isCurrentUser ? 'mr-3' : 'ml-3'} bg-white rounded-lg shadow p-3 max-w-full overflow-hidden`}>
                                  <div className="flex justify-between">
                                    <p className="text-sm font-medium text-gray-900">
                                      {sender.name}
                                      <span className="ml-1 font-normal text-xs text-gray-500">
                                        {sender.role !== 'You' && `(${sender.role})`}
                                      </span>
                                    </p>
                                    <p className="text-xs text-gray-500 ml-2">
                                      {formatMessageTime(msg.timestamp)}
                                    </p>
                                  </div>
                                  <div className="mt-1">
                                    <p className="text-sm text-gray-900 whitespace-pre-wrap">{msg.content}</p>
                                    
                                    {/* Attachments */}
                                    {msg.attachments && msg.attachments.length > 0 && (
                                      <div className="mt-2 space-y-2">
                                        {msg.attachments.map((attachment) => (
                                          <div key={attachment.id} className="flex items-center p-2 rounded-md bg-gray-50 border border-gray-200">
                                            {getAttachmentIcon(attachment.type)}
                                            <div className="ml-2 flex-1 min-w-0">
                                              <p className="text-sm font-medium text-gray-900 truncate">{attachment.name}</p>
                                              <p className="text-xs text-gray-500">{attachment.size}</p>
                                            </div>
                                            <button className="text-[#800000] hover:text-[#600000] ml-2">
                                              <HiOutlineDownload className="h-5 w-5" />
                                            </button>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                  {isCurrentUser && (
                                    <div className="mt-1 flex justify-end">
                                      <HiOutlineCheckCircle className={`h-4 w-4 ${msg.read ? 'text-blue-500' : 'text-gray-400'}`} />
                                    </div>
                                  )}
                                </div>
                              </div>
                            </li>
                          );
                        })}
                        <div ref={messagesEndRef} />
                      </ul>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full">
                        <HiOutlineChatAlt className="h-12 w-12 text-gray-400" />
                        <p className="mt-2 text-sm text-center text-gray-500">
                          No messages yet. Start the conversation by sending a message below.
                        </p>
                      </div>
                    )}
                  </div>
                  
                  {/* Message input */}
                  <div className="border-t border-gray-200 p-4">
                    <form onSubmit={handleSendMessage}>
                      {/* Attachment preview */}
                      {fileToUpload && (
                        <div className="mb-3 flex items-center p-2 rounded-md bg-gray-50 border border-gray-200">
                          {getAttachmentIcon(fileToUpload.type)}
                          <div className="ml-2 flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{fileToUpload.name}</p>
                            <p className="text-xs text-gray-500">{Math.round(fileToUpload.size / 1024)} KB</p>
                          </div>
                          <button
                            type="button"
                            onClick={handleRemoveFile}
                            className="text-gray-400 hover:text-gray-500"
                          >
                            <HiOutlineX className="h-5 w-5" />
                          </button>
                        </div>
                      )}
                      
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <label htmlFor="file-upload" className="cursor-pointer text-gray-400 hover:text-gray-500">
                            <HiOutlinePaperClip className="h-5 w-5" />
                            <input
                              id="file-upload"
                              name="file-upload"
                              type="file"
                              className="sr-only"
                              onChange={handleFileSelect}
                            />
                          </label>
                        </div>
                        <button
                          type="button"
                          className="ml-2 text-gray-400 hover:text-gray-500"
                          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        >
                          <HiOutlineEmojiHappy className="h-5 w-5" />
                        </button>
                        <div className="ml-3 flex-1">
                          <textarea
                            rows={1}
                            name="message"
                            id="message"
                            className="shadow-sm block w-full focus:ring-[#800000] focus:border-[#800000] sm:text-sm border border-gray-300 rounded-md"
                            placeholder="Type your message..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                if (message.trim() !== '' || fileToUpload) {
                                  handleSendMessage(e);
                                }
                              }
                            }}
                          />
                        </div>
                        <div className="ml-3">
                          <button
                            type="submit"
                            disabled={sending || (message.trim() === '' && !fileToUpload)}
                            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#800000] hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000] ${
                              (sending || (message.trim() === '' && !fileToUpload)) ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                          >
                            {sending ? (
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                            ) : (
                              <HiOutlinePaperAirplane className="h-4 w-4 -rotate-45 mr-1" />
                            )}
                            Send
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full p-6 bg-gray-50">
                  <HiOutlineChatAlt className="h-16 w-16 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900">No conversation selected</h3>
                  <p className="mt-1 text-sm text-center text-gray-500">
                    Choose a conversation from the list to view messages
                  </p>
                  {isMobileView && (
                    <button
                      onClick={handleBackToList}
                      className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                    >
                      <HiOutlineArrowLeft className="mr-2 h-4 w-4" />
                      Back to conversations
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;