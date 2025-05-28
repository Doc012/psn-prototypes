import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { 
  HiOutlinePaperAirplane, 
  HiOutlineSearch, 
  HiOutlinePlusCircle, 
  HiOutlineTrash, 
  HiOutlineFolder,
  HiOutlinePencil
} from 'react-icons/hi';

const ClientMessagesPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef(null);
  
  // Fetch conversations
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        // Mock data - would be replaced with API call
        const mockConversations = [
          {
            id: 1,
            title: 'Case Update: Smith v. Johnson',
            participants: [
              { id: 123, name: 'John Doe', role: 'client', avatar: null },
              { id: 456, name: 'Sarah Wilson', role: 'attorney', avatar: null }
            ],
            lastMessage: {
              content: 'I\'ve reviewed the settlement offer and would like to discuss it with you.',
              timestamp: '2023-05-20T14:30:00',
              sender: { id: 123, name: 'John Doe', role: 'client' }
            },
            unread: 2
          },
          {
            id: 2,
            title: 'Document Review Request',
            participants: [
              { id: 123, name: 'John Doe', role: 'client', avatar: null },
              { id: 789, name: 'Michael Brown', role: 'attorney', avatar: null }
            ],
            lastMessage: {
              content: 'Please review the attached contract and let me know your thoughts.',
              timestamp: '2023-05-18T09:15:00',
              sender: { id: 789, name: 'Michael Brown', role: 'attorney' }
            },
            unread: 0
          },
          {
            id: 3,
            title: 'Estate Planning Consultation',
            participants: [
              { id: 123, name: 'John Doe', role: 'client', avatar: null },
              { id: 101, name: 'Jessica Taylor', role: 'attorney', avatar: null }
            ],
            lastMessage: {
              content: 'Thank you for your time today. I\'ve attached the estate planning documents we discussed.',
              timestamp: '2023-05-15T16:45:00',
              sender: { id: 101, name: 'Jessica Taylor', role: 'attorney' }
            },
            unread: 0
          }
        ];
        
        setConversations(mockConversations);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching conversations:', error);
        setLoading(false);
      }
    };
    
    fetchConversations();
  }, []);
  
  // Fetch messages for selected conversation
  useEffect(() => {
    if (selectedConversation) {
      const fetchMessages = async () => {
        try {
          // Mock data - would be replaced with API call
          const mockMessages = [
            {
              id: 1,
              conversationId: 1,
              content: 'Good morning, I hope you\'re doing well. I wanted to update you on your case.',
              timestamp: '2023-05-19T09:00:00',
              sender: { id: 456, name: 'Sarah Wilson', role: 'attorney', avatar: null },
              attachments: []
            },
            {
              id: 2,
              conversationId: 1,
              content: 'We\'ve received a settlement offer from the opposing party. I\'ve attached it for your review.',
              timestamp: '2023-05-19T09:02:00',
              sender: { id: 456, name: 'Sarah Wilson', role: 'attorney', avatar: null },
              attachments: [
                { id: 1, name: 'Settlement_Offer.pdf', size: '1.2 MB', type: 'application/pdf' }
              ]
            },
            {
              id: 3,
              conversationId: 1,
              content: 'Thank you for sending this. I\'ll take a look and get back to you.',
              timestamp: '2023-05-19T10:15:00',
              sender: { id: 123, name: 'John Doe', role: 'client', avatar: null },
              attachments: []
            },
            {
              id: 4,
              conversationId: 1,
              content: 'I\'ve reviewed the settlement offer and would like to discuss it with you. Do you have time for a call tomorrow?',
              timestamp: '2023-05-20T14:30:00',
              sender: { id: 123, name: 'John Doe', role: 'client', avatar: null },
              attachments: []
            },
            {
              id: 5,
              conversationId: 1,
              content: 'Yes, I\'m available tomorrow at 10:00 AM or 2:00 PM. Which time works better for you?',
              timestamp: '2023-05-20T15:45:00',
              sender: { id: 456, name: 'Sarah Wilson', role: 'attorney', avatar: null },
              attachments: []
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
        } catch (error) {
          console.error('Error fetching messages:', error);
        }
      };
      
      fetchMessages();
    }
  }, [selectedConversation]);
  
  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current && messages.length > 0) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  // Filter conversations based on search term
  const filteredConversations = conversations.filter(
    conversation => 
      conversation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conversation.participants.some(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );
  
  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !selectedConversation) return;
    
    // In a real app, this would send to an API
    const newMessageObj = {
      id: messages.length + 1,
      conversationId: selectedConversation.id,
      content: newMessage,
      timestamp: new Date().toISOString(),
      sender: { id: user.id, name: `${user.firstName} ${user.lastName}`, role: 'client', avatar: null },
      attachments: []
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
                content: newMessage,
                timestamp: new Date().toISOString(),
                sender: { id: user.id, name: `${user.firstName} ${user.lastName}`, role: 'client' }
              }
            }
          : conv
      )
    );
    
    // Clear input
    setNewMessage('');
  };
  
  // Format timestamp
  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const formatConversationTime = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
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
        <div className="flex flex-col md:flex-row h-[calc(100vh-12rem)] bg-white rounded-lg shadow overflow-hidden">
          {/* Conversations sidebar */}
          <div className="w-full md:w-80 border-r border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <HiOutlineSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="focus:ring-[#800000] focus:border-[#800000] block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  placeholder="Search messages"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
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
                        className={`relative ${selectedConversation?.id === conversation.id ? 'bg-gray-50' : 'hover:bg-gray-50'} cursor-pointer`}
                        onClick={() => setSelectedConversation(conversation)}
                      >
                        <div className="px-4 py-4">
                          <div className="flex justify-between">
                            <div className="text-sm font-medium text-gray-900 truncate">
                              {conversation.title}
                            </div>
                            <div className="text-xs text-gray-500">
                              {formatConversationTime(conversation.lastMessage.timestamp)}
                            </div>
                          </div>
                          
                          <div className="mt-1">
                            <p className="text-xs text-gray-500 truncate">
                              With: {otherParticipants.map(p => p.name).join(', ')}
                            </p>
                          </div>
                          
                          <div className="mt-1 flex justify-between">
                            <p className={`text-sm truncate ${conversation.unread > 0 ? 'font-medium text-gray-900' : 'text-gray-500'}`}>
                              {conversation.lastMessage.sender.id === user.id ? 'You: ' : `${conversation.lastMessage.sender.name}: `}
                              {conversation.lastMessage.content}
                            </p>
                            
                            {conversation.unread > 0 && (
                              <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-[#800000] text-xs font-medium text-white">
                                {conversation.unread}
                              </span>
                            )}
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center p-4">
                  <HiOutlineFolder className="h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No messages found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {searchTerm 
                      ? "No messages matching your search."
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
          <div className="flex-1 flex flex-col bg-gray-50">
            {selectedConversation ? (
              <>
                {/* Conversation header */}
                <div className="flex justify-between items-center px-6 py-3 border-b border-gray-200 bg-white">
                  <div>
                    <h2 className="text-lg font-medium text-gray-900">{selectedConversation.title}</h2>
                    <p className="text-sm text-gray-500">
                      With: {selectedConversation.participants.filter(p => p.role !== 'client').map(p => p.name).join(', ')}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      className="inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-[#800000] bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                      title="Edit Conversation"
                    >
                      <HiOutlinePencil className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-[#800000] bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                      title="Delete Conversation"
                    >
                      <HiOutlineTrash className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                
                {/* Messages */}
                <div className="flex-1 p-4 overflow-y-auto">
                  <div className="space-y-4">
                    {messages.map((message) => {
                      const isCurrentUser = message.sender.id === user.id;
                      
                      return (
                        <div 
                          key={message.id} 
                          className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-[75%] ${isCurrentUser ? 'bg-[#800000] text-white' : 'bg-white'} rounded-lg shadow px-4 py-3`}>
                            <div className="flex justify-between items-baseline mb-1">
                              <p className={`text-xs ${isCurrentUser ? 'text-gray-200' : 'text-gray-500'}`}>
                                {message.sender.name}
                              </p>
                              <p className={`text-xs ml-2 ${isCurrentUser ? 'text-gray-200' : 'text-gray-500'}`}>
                                {formatMessageTime(message.timestamp)}
                              </p>
                            </div>
                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                            
                            {message.attachments && message.attachments.length > 0 && (
                              <div className="mt-2 pt-2 border-t border-gray-200">
                                <p className={`text-xs mb-1 ${isCurrentUser ? 'text-gray-200' : 'text-gray-500'}`}>
                                  Attachments:
                                </p>
                                <ul className="space-y-1">
                                  {message.attachments.map((attachment) => (
                                    <li key={attachment.id}>
                                      <a
                                        href={`/api/attachments/${attachment.id}`}
                                        className={`text-xs flex items-center ${isCurrentUser ? 'text-gray-100 hover:text-white' : 'text-[#800000] hover:text-[#600000]'}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                      >
                                        <HiOutlineDocumentText className="h-4 w-4 mr-1" />
                                        {attachment.name} ({attachment.size})
                                      </a>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                </div>
                
                {/* Message input */}
                <div className="px-4 py-3 bg-white border-t border-gray-200">
                  <form onSubmit={handleSendMessage}>
                    <div className="flex space-x-3">
                      <div className="flex-1">
                        <textarea
                          rows="2"
                          className="shadow-sm block w-full focus:ring-[#800000] focus:border-[#800000] sm:text-sm border border-gray-300 rounded-md"
                          placeholder="Type a message..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                        ></textarea>
                      </div>
                      <div className="flex-shrink-0 self-end">
                        <button
                          type="submit"
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#800000] hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                          disabled={!newMessage.trim()}
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
                <HiOutlineFolder className="h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No conversation selected</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Select a conversation from the list or create a new message.
                </p>
                <Link
                  to="/client-portal/messages/new"
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#800000] hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                >
                  <HiOutlinePlusCircle className="-ml-1 mr-2 h-5 w-5" />
                  New Message
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientMessagesPage;