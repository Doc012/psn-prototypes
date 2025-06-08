import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { 
  HiOutlineArrowLeft,
  HiOutlineUser, 
  HiOutlineUsers,
  HiOutlinePaperAirplane,
  HiOutlineBriefcase,
  HiOutlineSearch,
  HiOutlinePaperClip,
  HiOutlinePhotograph,
  HiOutlineDocumentText,
  HiOutlineX,
  HiOutlineEmojiHappy
} from 'react-icons/hi';

const NewMessagePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [attorneys, setAttorneys] = useState([]);
  const [cases, setCases] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecipients, setSelectedRecipients] = useState([]);
  const [selectedCase, setSelectedCase] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [fileToUpload, setFileToUpload] = useState(null);
  const [showAttachmentOptions, setShowAttachmentOptions] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef(null);

  // Common emojis array
  const commonEmojis = ['👍', '👌', '👏', '🙏', '😊', '🤔', '👨‍⚖️', '⚖️', '📄', '✅'];

  // Get URL params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const attorneyId = params.get('attorney');
    const caseId = params.get('case');
    
    if (attorneyId) {
      // Find attorney by ID and add to recipients
      const attorney = attorneys.find(a => a.id === parseInt(attorneyId));
      if (attorney) {
        setSelectedRecipients([attorney]);
      }
    }
    
    if (caseId) {
      // Set selected case
      setSelectedCase(caseId);
    }
  }, [location.search, attorneys]);

  // Fetch attorneys and cases
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Mock attorneys data
        const mockAttorneys = [
          { 
            id: 456, 
            name: 'Sarah Nguyen', 
            role: 'attorney', 
            avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
            email: 'sarah.nguyen@lawfirm.com',
            cases: [123, 126]
          },
          { 
            id: 789, 
            name: 'Michael Brown', 
            role: 'attorney', 
            avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
            email: 'michael.brown@lawfirm.com',
            cases: [124]
          },
          { 
            id: 101, 
            name: 'Jessica Taylor', 
            role: 'attorney', 
            avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
            email: 'jessica.taylor@lawfirm.com',
            cases: [125]
          },
          { 
            id: 102, 
            name: 'Robert Chen', 
            role: 'paralegal', 
            avatar: 'https://randomuser.me/api/portraits/men/75.jpg',
            email: 'robert.chen@lawfirm.com',
            cases: [125]
          },
          { 
            id: 103, 
            name: 'Amanda Rodriguez', 
            role: 'billing', 
            avatar: 'https://randomuser.me/api/portraits/women/90.jpg',
            email: 'amanda.rodriguez@lawfirm.com',
            cases: [123]
          },
          { 
            id: 104, 
            name: 'David Washington', 
            role: 'attorney', 
            avatar: 'https://randomuser.me/api/portraits/men/42.jpg',
            email: 'david.washington@lawfirm.com',
            cases: [126]
          }
        ];
        
        // Mock cases data
        const mockCases = [
          {
            id: 123,
            title: 'Smith v. Johnson',
            caseNumber: 'PI-2025-1452',
            type: 'Personal Injury'
          },
          {
            id: 124,
            title: 'Estate of Williams',
            caseNumber: 'PR-2025-0783',
            type: 'Probate'
          },
          {
            id: 125,
            title: 'Tucker Estate Planning',
            caseNumber: 'EP-2025-0342',
            type: 'Estate Planning'
          },
          {
            id: 126,
            title: 'Jones Property Dispute',
            caseNumber: 'RE-2024-0952',
            type: 'Real Estate'
          }
        ];
        
        setAttorneys(mockAttorneys);
        setCases(mockCases);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Filter attorneys based on search term
  const filteredAttorneys = attorneys.filter(attorney => {
    if (!searchTerm) return true;
    
    const term = searchTerm.toLowerCase();
    return (
      attorney.name.toLowerCase().includes(term) ||
      attorney.email.toLowerCase().includes(term) ||
      attorney.role.toLowerCase().includes(term)
    );
  });

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

  // Toggle recipient selection
  const toggleRecipient = (attorney) => {
    if (selectedRecipients.find(r => r.id === attorney.id)) {
      setSelectedRecipients(selectedRecipients.filter(r => r.id !== attorney.id));
    } else {
      setSelectedRecipients([...selectedRecipients, attorney]);
    }
  };

  // Remove recipient
  const removeRecipient = (id) => {
    setSelectedRecipients(selectedRecipients.filter(r => r.id !== id));
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

  // Send message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (selectedRecipients.length === 0) {
      alert('Please select at least one recipient');
      return;
    }
    
    if (!subject.trim()) {
      alert('Please enter a subject');
      return;
    }
    
    if (!message.trim() && !fileToUpload) {
      alert('Please enter a message or attach a file');
      return;
    }
    
    setSending(true);
    
    // Simulate API call
    setTimeout(() => {
      setSending(false);
      
      // In a real app, you would create a new conversation and redirect to it
      // For now, just navigate back to messages with a success parameter
      navigate('/client-portal/messages?success=true');
    }, 1500);
  };

  // Add emoji to message
  const insertEmoji = (emoji) => {
    setMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex items-center mb-6">
          <Link
            to="/client-portal/messages"
            className="mr-4 text-gray-500 hover:text-gray-700"
          >
            <HiOutlineArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900">New Message</h1>
        </div>
        
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <form onSubmit={handleSendMessage}>
            <div className="p-6 space-y-6">
              {/* Recipients */}
              <div>
                <label htmlFor="recipients" className="block text-sm font-medium text-gray-700 mb-1">
                  Recipients
                </label>
                <div className="relative">
                  <div className="flex flex-wrap items-center gap-2 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus-within:ring-1 focus-within:ring-[#800000] focus-within:border-[#800000]">
                    {selectedRecipients.map(recipient => (
                      <div 
                        key={recipient.id}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm bg-gray-100 text-gray-800"
                      >
                        <span className="max-w-xs truncate">{recipient.name}</span>
                        <button
                          type="button"
                          onClick={() => removeRecipient(recipient.id)}
                          className="ml-1.5 h-4 w-4 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-500"
                        >
                          <span className="sr-only">Remove {recipient.name}</span>
                          <HiOutlineX className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                    <input
                      type="text"
                      id="recipients"
                      placeholder={selectedRecipients.length === 0 ? "Search for attorneys or staff..." : ""}
                      className="flex-1 border-none focus:ring-0 min-w-[8rem] text-sm placeholder-gray-400"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  {searchTerm && (
                    <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 text-base overflow-auto max-h-60">
                      {filteredAttorneys.length === 0 ? (
                        <div className="px-4 py-2 text-sm text-gray-500">
                          No results found
                        </div>
                      ) : (
                        <ul className="divide-y divide-gray-200">
                          {filteredAttorneys.map(attorney => (
                            <li
                              key={attorney.id}
                              className={`cursor-pointer select-none relative py-2 px-3 ${
                                selectedRecipients.find(r => r.id === attorney.id)
                                  ? 'bg-gray-100'
                                  : 'hover:bg-gray-50'
                              }`}
                              onClick={() => toggleRecipient(attorney)}
                            >
                              <div className="flex items-center">
                                <div className="flex-shrink-0">
                                  {attorney.avatar ? (
                                    <img 
                                      src={attorney.avatar} 
                                      alt={attorney.name}
                                      className="h-8 w-8 rounded-full"
                                    />
                                  ) : (
                                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                                      <HiOutlineUser className="h-5 w-5 text-gray-500" />
                                    </div>
                                  )}
                                </div>
                                <div className="ml-3 flex-1">
                                  <div className="flex items-center">
                                    <p className="text-sm font-medium text-gray-900">{attorney.name}</p>
                                    <span className={`ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getRoleBadgeColor(attorney.role)}`}>
                                      {attorney.role}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-500">{attorney.email}</p>
                                </div>
                                <div className="flex-shrink-0 ml-2">
                                  <input
                                    type="checkbox"
                                    checked={!!selectedRecipients.find(r => r.id === attorney.id)}
                                    onChange={() => {}}
                                    className="h-4 w-4 text-[#800000] focus:ring-[#800000] border-gray-300 rounded"
                                  />
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Related Case */}
              <div>
                <label htmlFor="case" className="block text-sm font-medium text-gray-700 mb-1">
                  Related Case
                </label>
                <select
                  id="case"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#800000] focus:border-[#800000] sm:text-sm rounded-md"
                  value={selectedCase}
                  onChange={(e) => setSelectedCase(e.target.value)}
                >
                  <option value="">Select a case (optional)</option>
                  {cases.map(caseItem => (
                    <option key={caseItem.id} value={caseItem.id}>
                      {caseItem.title} - {caseItem.caseNumber}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Subject */}
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Enter message subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>
              
              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
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
                <div className="relative">
                  <textarea
                    id="message"
                    rows={6}
                    className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="Type your message here..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
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
                      
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </div>
                    
                    <div className="relative">
                      <button
                        type="button"
                        className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      >
                        <HiOutlineEmojiHappy className="h-5 w-5" />
                      </button>
                      
                      {showEmojiPicker && (
                        <div className="absolute bottom-full right-0 mb-2 bg-white rounded-md shadow-lg p-2 z-10 border border-gray-200">
                          <div className="grid grid-cols-5 gap-1">
                            {commonEmojis.map((emoji, idx) => (
                              <button
                                key={idx}
                                type="button"
                                className="w-8 h-8 text-xl hover:bg-gray-100 rounded flex items-center justify-center"
                                onClick={() => insertEmoji(emoji)}
                              >
                                {emoji}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="px-6 py-3 bg-gray-50 text-right flex justify-end space-x-3">
              <Link
                to="/client-portal/messages"
                className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="inline-flex items-center justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#800000] hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                disabled={sending}
              >
                {sending ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
                    <HiOutlinePaperAirplane className="mr-2 h-5 w-5 transform rotate-90" />
                    Send Message
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewMessagePage;