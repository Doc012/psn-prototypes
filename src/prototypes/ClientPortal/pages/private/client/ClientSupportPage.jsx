import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { 
  HiOutlineQuestionMarkCircle, 
  HiOutlineMail, 
  HiOutlinePhone, 
  HiOutlineChat, 
  HiOutlineDocumentText,
  HiOutlineExclamation,
  HiOutlineLightBulb,
  HiOutlineBookOpen,
  HiOutlineTicket,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineExclamationCircle,
  HiOutlinePaperClip,
  HiOutlinePencilAlt,
  HiOutlineSearch,
  HiOutlineX,
  HiOutlinePlus,
  HiOutlineShieldCheck,
  HiOutlineInformationCircle // Added the missing icon
} from 'react-icons/hi';

const ClientSupportPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('help');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketDescription, setTicketDescription] = useState('');
  const [ticketCategory, setTicketCategory] = useState('');
  const [ticketPriority, setTicketPriority] = useState('medium');
  const [tickets, setTickets] = useState([]);
  const [faqCategories, setFaqCategories] = useState([]);
  const [expandedFaqs, setExpandedFaqs] = useState({});
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const fileInputRef = useRef(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [replyText, setReplyText] = useState('');

  // Helper function to create recent dates
  const getRecentDate = (daysAgo) => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date.toISOString();
  };

  // Fetch support tickets
  useEffect(() => {
    // In a real app, this would be an API call
    const mockTickets = [
      { 
        id: 'T-10021', 
        subject: 'Question about document requirements', 
        description: 'I need clarification on what documents are required for my case filing.',
        status: 'open', 
        category: 'Documents',
        priority: 'medium',
        created: getRecentDate(2), // 2 days ago
        updated: getRecentDate(1), // 1 day ago
        messages: [
          { 
            id: 1, 
            from: 'client', 
            message: 'I need clarification on what documents are required for my case filing.', 
            timestamp: getRecentDate(2) // 2 days ago
          },
          { 
            id: 2, 
            from: 'support', 
            message: 'Thank you for your inquiry. For your specific case type, you will need to provide the following documents: 1) Proof of identity, 2) Relevant contracts, 3) Financial statements from the past 3 months. Let me know if you have any questions about these requirements.', 
            timestamp: getRecentDate(1), // 1 day ago
            author: 'Sarah Johnson, Support Specialist'
          }
        ]
      },
      { 
        id: 'T-10015', 
        subject: 'Login issues after password reset', 
        description: 'I changed my password but now I can\'t log in to my account.',
        status: 'resolved', 
        category: 'Account Access',
        priority: 'high',
        created: getRecentDate(4), // 4 days ago
        updated: getRecentDate(3), // 3 days ago
        messages: [
          { 
            id: 1, 
            from: 'client', 
            message: 'I changed my password but now I can\'t log in to my account.', 
            timestamp: getRecentDate(4) // 4 days ago
          },
          { 
            id: 2, 
            from: 'support', 
            message: 'I\'m sorry to hear you\'re having trouble. Let\'s reset your password again. I\'ve sent a password reset link to your email address. Please check your inbox and follow the instructions.', 
            timestamp: getRecentDate(4), // 4 days ago, 30 minutes later
            author: 'Michael Lee, Technical Support'
          },
          { 
            id: 3, 
            from: 'client', 
            message: 'Thank you, I received the email and was able to reset my password. I can log in now.', 
            timestamp: getRecentDate(3.5) // 3.5 days ago
          },
          { 
            id: 4, 
            from: 'support', 
            message: 'Great! I\'m glad to hear you can access your account now. If you have any other issues, please don\'t hesitate to reach out.', 
            timestamp: getRecentDate(3), // 3 days ago
            author: 'Michael Lee, Technical Support'
          }
        ]
      },
      { 
        id: 'T-10008', 
        subject: 'Need to reschedule consultation', 
        description: 'I need to reschedule my upcoming consultation appointment.',
        status: 'in-progress', 
        category: 'Appointments',
        priority: 'medium',
        created: getRecentDate(7), // 7 days ago
        updated: getRecentDate(5), // 5 days ago
        messages: [
          { 
            id: 1, 
            from: 'client', 
            message: 'I need to reschedule my upcoming consultation appointment scheduled for June 15th at 2:00 PM.', 
            timestamp: getRecentDate(7) // 7 days ago
          },
          { 
            id: 2, 
            from: 'support', 
            message: 'I\'d be happy to help you reschedule. I\'ve notified your attorney about your request. Could you please let us know some alternative dates and times that would work for you in the next two weeks?', 
            timestamp: getRecentDate(6), // 6 days ago
            author: 'Emma Clark, Client Coordinator'
          },
          { 
            id: 3, 
            from: 'client', 
            message: 'Thank you. I am available on June 18th anytime between 1:00 PM and 5:00 PM, or June 20th in the morning.', 
            timestamp: getRecentDate(5.5) // 5.5 days ago
          },
          { 
            id: 4, 
            from: 'support', 
            message: 'I\'ve checked with your attorney, and they are available on June 18th at 3:00 PM. Would that work for you?', 
            timestamp: getRecentDate(5), // 5 days ago
            author: 'Emma Clark, Client Coordinator'
          }
        ]
      }
    ];
    
    setTickets(mockTickets);
    setLoading(false);
  }, []);
  
  // Fetch FAQ categories and questions
  useEffect(() => {
    // In a real app, this would be an API call
    const mockFaqCategories = [
      {
        id: 'general',
        name: 'General Questions',
        icon: <HiOutlineQuestionMarkCircle className="h-6 w-6 text-[#800000]" />,
        faqs: [
          {
            id: 'faq-1',
            question: 'How do I update my contact information?',
            answer: 'You can update your contact information by navigating to the Profile section of your client portal. Click on the "Edit Information" button to make changes to your address, phone number, or email address.'
          },
          {
            id: 'faq-2',
            question: 'What should I do if I forgot my password?',
            answer: 'If you forgot your password, click on the "Forgot Password" link on the login page. You will receive an email with instructions to reset your password. If you don\'t receive the email, check your spam folder or contact our support team.'
          },
          {
            id: 'faq-3',
            question: 'How can I see my billing history?',
            answer: 'Your billing history can be found in the Invoices section of your client portal. There, you can view and download all your invoices and payment receipts.'
          }
        ]
      },
      {
        id: 'documents',
        name: 'Documents & Files',
        icon: <HiOutlineDocumentText className="h-6 w-6 text-[#800000]" />,
        faqs: [
          {
            id: 'faq-4',
            question: 'How do I upload documents to my case?',
            answer: 'To upload documents, go to the Documents section of your portal and click the "Upload Document" button. You can select files from your device to upload. Make sure to properly categorize them for easier organization.'
          },
          {
            id: 'faq-5',
            question: 'What file formats are supported for document uploads?',
            answer: 'Our system supports various file formats including PDF, DOC, DOCX, JPG, PNG, and TIFF. For best results, we recommend using PDF format for most documents. The maximum file size is 25MB per file.'
          },
          {
            id: 'faq-6',
            question: 'How long are my documents stored in the portal?',
            answer: 'Your documents will be stored in the portal for the duration of your case, plus a retention period of 7 years after case closure, in accordance with our data retention policy.'
          }
        ]
      },
      {
        id: 'cases',
        name: 'Case Management',
        icon: <HiOutlineBookOpen className="h-6 w-6 text-[#800000]" />,
        faqs: [
          {
            id: 'faq-7',
            question: 'How can I check the status of my case?',
            answer: 'You can check your case status by going to the Dashboard or Cases section of your portal. Each case will display a status indicator showing whether it\'s active, pending, or closed. You can click on a specific case to see more detailed status information.'
          },
          {
            id: 'faq-8',
            question: 'Can I communicate with my attorney through the portal?',
            answer: 'Yes, you can communicate with your attorney through the Messages section of the portal. This provides a secure way to ask questions, provide information, and receive updates about your case.'
          },
          {
            id: 'faq-9',
            question: 'How are case deadlines and important dates tracked?',
            answer: 'Important dates and deadlines related to your case are displayed in your Calendar. You can also see upcoming events on your Dashboard. The system will send you reminders about important dates based on your notification preferences.'
          }
        ]
      },
      {
        id: 'billing',
        name: 'Billing & Payments',
        icon: <HiOutlineMail className="h-6 w-6 text-[#800000]" />,
        faqs: [
          {
            id: 'faq-10',
            question: 'What payment methods are accepted?',
            answer: 'We accept credit cards (Visa, Mastercard, American Express, Discover), debit cards, and ACH bank transfers. You can set up your preferred payment method in the Billing section of your profile.'
          },
          {
            id: 'faq-11',
            question: 'How do I view and pay invoices?',
            answer: 'Invoices can be viewed and paid through the Invoices section of your portal. You\'ll receive an email notification when a new invoice is available. Click on the invoice to view details and select "Pay Now" to complete payment.'
          },
          {
            id: 'faq-12',
            question: 'Can I set up automatic payments?',
            answer: 'Yes, you can set up automatic payments for your invoices. Go to the Billing section in your profile and select "Enable Automatic Payments". You will need to have a payment method saved to use this feature.'
          }
        ]
      },
      {
        id: 'security',
        name: 'Security & Privacy',
        icon: <HiOutlineShieldCheck className="h-6 w-6 text-[#800000]" />,
        faqs: [
          {
            id: 'faq-13',
            question: 'How is my personal information protected?',
            answer: 'We employ industry-standard encryption and security measures to protect your data. All communications and documents in the portal are encrypted, and we maintain strict access controls. Our system complies with legal industry security standards and regulations.'
          },
          {
            id: 'faq-14',
            question: 'Who can access the information in my portal?',
            answer: 'Access to your portal information is strictly limited to you, your assigned attorney, and authorized staff members working on your case. All access is logged and monitored for security purposes.'
          },
          {
            id: 'faq-15',
            question: 'What should I do if I suspect unauthorized access to my account?',
            answer: 'If you suspect unauthorized access, change your password immediately and contact our support team right away. We recommend enabling two-factor authentication for an additional layer of security.'
          }
        ]
      }
    ];
    
    setFaqCategories(mockFaqCategories);
  }, []);

  const toggleFaqExpansion = (faqId) => {
    setExpandedFaqs(prev => ({
      ...prev,
      [faqId]: !prev[faqId]
    }));
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const newFiles = files.map(file => ({
        name: file.name,
        size: (file.size / 1024).toFixed(2) + ' KB',
        type: file.type
      }));
      
      setUploadedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const showToast = (message, type = "info") => {
    setToastMessage({ text: message, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleTicketSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call to create ticket
    setTimeout(() => {
      const newTicket = {
        id: `T-${10000 + tickets.length + 1}`,
        subject: ticketSubject,
        description: ticketDescription,
        status: 'open',
        category: ticketCategory,
        priority: ticketPriority,
        created: new Date().toISOString(),
        updated: new Date().toISOString(),
        messages: [
          {
            id: 1,
            from: 'client',
            message: ticketDescription,
            timestamp: new Date().toISOString()
          }
        ]
      };
      
      setTickets(prev => [newTicket, ...prev]);
      setTicketSubject('');
      setTicketDescription('');
      setTicketCategory('');
      setTicketPriority('medium');
      setUploadedFiles([]);
      setShowTicketForm(false);
      setLoading(false);
      
      // Show success message using toast instead of alert
      showToast('Support ticket created successfully!', 'success');
    }, 1000);
  };

  const handleSendReply = (ticketId) => {
    if (!replyText.trim()) return;
    
    setTickets(prev => 
      prev.map(ticket => {
        if (ticket.id === ticketId) {
          const newMessage = {
            id: ticket.messages.length + 1,
            from: 'client',
            message: replyText,
            timestamp: new Date().toISOString()
          };
          
          return {
            ...ticket,
            messages: [...ticket.messages, newMessage],
            updated: new Date().toISOString()
          };
        }
        return ticket;
      })
    );
    
    setReplyText('');
    showToast('Reply sent successfully', 'success');
    
    // Simulate support reply after a delay
    setTimeout(() => {
      setTickets(prev => 
        prev.map(ticket => {
          if (ticket.id === ticketId) {
            const supportMessage = {
              id: ticket.messages.length + 2,
              from: 'support',
              message: "Thank you for your message. We'll look into this and get back to you as soon as possible.",
              timestamp: new Date().toISOString(),
              author: "Support Team"
            };
            
            return {
              ...ticket,
              messages: [...ticket.messages, supportMessage],
              updated: new Date().toISOString()
            };
          }
          return ticket;
        })
      );
    }, 5000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open':
        return 'bg-blue-100 text-blue-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high':
        return <HiOutlineExclamationCircle className="h-5 w-5 text-red-500" />;
      case 'medium':
        return <HiOutlineClock className="h-5 w-5 text-yellow-500" />;
      case 'low':
        return <HiOutlineCheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <HiOutlineClock className="h-5 w-5 text-gray-500" />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      const hours = date.getHours();
      const minutes = date.getMinutes();
      return `Today at ${hours}:${minutes < 10 ? '0' + minutes : minutes}`;
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      ticket.id.toLowerCase().includes(searchLower) ||
      ticket.subject.toLowerCase().includes(searchLower) ||
      ticket.description.toLowerCase().includes(searchLower) ||
      ticket.category.toLowerCase().includes(searchLower)
    );
  });

  const filteredFaqs = searchTerm 
    ? faqCategories.reduce((acc, category) => {
        const matchingFaqs = category.faqs.filter(faq => 
          faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
          faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        if (matchingFaqs.length > 0) {
          acc.push({
            ...category,
            faqs: matchingFaqs
          });
        }
        
        return acc;
      }, [])
    : faqCategories;

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Support & Help</h1>
        <p className="mt-1 text-sm text-gray-500">
          Get help with your account, cases, and technical questions
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-6">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              <button
                className={`${
                  activeTab === 'help'
                    ? 'border-[#800000] text-[#800000]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm`}
                onClick={() => setActiveTab('help')}
              >
                <HiOutlineLightBulb className="inline-block mr-2 h-5 w-5" />
                Help Center
              </button>
              <button
                className={`${
                  activeTab === 'tickets'
                    ? 'border-[#800000] text-[#800000]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm`}
                onClick={() => setActiveTab('tickets')}
              >
                <HiOutlineTicket className="inline-block mr-2 h-5 w-5" />
                My Support Tickets
              </button>
              <button
                className={`${
                  activeTab === 'contact'
                    ? 'border-[#800000] text-[#800000]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm`}
                onClick={() => setActiveTab('contact')}
              >
                <HiOutlinePhone className="inline-block mr-2 h-5 w-5" />
                Contact Us
              </button>
            </nav>
          </div>

          {/* Search Bar */}
          <div className="p-6 border-b border-gray-200">
            <div className="max-w-3xl mx-auto">
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <HiOutlineSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="focus:ring-[#800000] focus:border-[#800000] block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  placeholder={activeTab === 'help' ? "Search frequently asked questions..." : "Search your support tickets..."}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      type="button"
                      onClick={() => setSearchTerm('')}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <HiOutlineX className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Help Center Tab */}
          {activeTab === 'help' && (
            <div className="p-6">
              {searchTerm && filteredFaqs.length === 0 ? (
                <div className="text-center py-12">
                  <HiOutlineExclamation className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No results found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    We couldn't find any FAQs matching "{searchTerm}".
                  </p>
                  <div className="mt-6">
                    <button
                      type="button"
                      onClick={() => {
                        setSearchTerm('');
                        setActiveTab('tickets');
                        setShowTicketForm(true);
                      }}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#800000] hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                    >
                      <HiOutlinePlus className="-ml-1 mr-2 h-5 w-5" />
                      Create Support Ticket
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-10">
                  {filteredFaqs.map((category) => (
                    <div key={category.id}>
                      <h3 className="text-lg font-medium text-gray-900 flex items-center">
                        {category.icon}
                        <span className="ml-2">{category.name}</span>
                      </h3>
                      <dl className="mt-4 space-y-6 divide-y divide-gray-200">
                        {category.faqs.map((faq) => (
                          <div 
                            key={faq.id} 
                            className={`pt-6 ${expandedFaqs[faq.id] ? '' : 'pb-6'}`}
                          >
                            <dt className="text-base">
                              <button
                                onClick={() => toggleFaqExpansion(faq.id)}
                                className="text-left w-full flex justify-between items-start text-gray-900"
                              >
                                <span className="font-medium">{faq.question}</span>
                                <span className="ml-6 h-7 flex items-center">
                                  {expandedFaqs[faq.id] ? (
                                    <HiOutlineX className="h-5 w-5 text-[#800000]" />
                                  ) : (
                                    <HiOutlinePlus className="h-5 w-5 text-[#800000]" />
                                  )}
                                </span>
                              </button>
                            </dt>
                            {expandedFaqs[faq.id] && (
                              <dd className="mt-4 pr-12">
                                <p className="text-base text-gray-600">
                                  {faq.answer}
                                </p>
                              </dd>
                            )}
                          </div>
                        ))}
                      </dl>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Support Tickets Tab */}
          {activeTab === 'tickets' && (
            <div className="p-6">
              <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center">
                <h3 className="text-lg font-medium text-gray-900">Your Support Tickets</h3>
                {!showTicketForm && (
                  <button
                    onClick={() => setShowTicketForm(true)}
                    className="mt-3 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#800000] hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                  >
                    <HiOutlinePlus className="-ml-1 mr-2 h-5 w-5" />
                    New Support Ticket
                  </button>
                )}
              </div>

              {showTicketForm && (
                <div className="bg-gray-50 p-6 rounded-lg mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Create New Support Ticket</h3>
                    <button
                      onClick={() => setShowTicketForm(false)}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <HiOutlineX className="h-5 w-5" />
                    </button>
                  </div>

                  <form onSubmit={handleTicketSubmit}>
                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                      <div className="sm:col-span-6">
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                          Subject
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            name="subject"
                            id="subject"
                            required
                            value={ticketSubject}
                            onChange={(e) => setTicketSubject(e.target.value)}
                            className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                            placeholder="Brief description of your issue"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                          Category
                        </label>
                        <div className="mt-1">
                          <select
                            id="category"
                            name="category"
                            required
                            value={ticketCategory}
                            onChange={(e) => setTicketCategory(e.target.value)}
                            className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                          >
                            <option value="">Select a category</option>
                            <option value="Account Access">Account Access</option>
                            <option value="Documents">Documents</option>
                            <option value="Billing">Billing</option>
                            <option value="Case Information">Case Information</option>
                            <option value="Appointments">Appointments</option>
                            <option value="Technical Issue">Technical Issue</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                          Priority
                        </label>
                        <div className="mt-1">
                          <select
                            id="priority"
                            name="priority"
                            value={ticketPriority}
                            onChange={(e) => setTicketPriority(e.target.value)}
                            className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                          >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                          </select>
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
                            rows={4}
                            required
                            value={ticketDescription}
                            onChange={(e) => setTicketDescription(e.target.value)}
                            className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                            placeholder="Please provide details about your issue or question"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-6">
                        <label className="block text-sm font-medium text-gray-700">
                          Attachments (Optional)
                        </label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                          <div className="space-y-1 text-center">
                            <HiOutlinePaperClip className="mx-auto h-12 w-12 text-gray-400" />
                            <div className="flex text-sm text-gray-600">
                              <label
                                htmlFor="file-upload"
                                className="relative cursor-pointer bg-white rounded-md font-medium text-[#800000] hover:text-[#600000] focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-[#800000]"
                              >
                                <span>Upload files</span>
                                <input
                                  id="file-upload"
                                  name="file-upload"
                                  type="file"
                                  className="sr-only"
                                  ref={fileInputRef}
                                  onChange={handleFileUpload}
                                  multiple
                                />
                              </label>
                              <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-gray-500">
                              PDF, Word, Excel, or image files up to 10MB each
                            </p>
                          </div>
                        </div>

                        {uploadedFiles.length > 0 && (
                          <div className="mt-4">
                            <h4 className="text-sm font-medium text-gray-700">Uploaded Files:</h4>
                            <ul className="mt-2 divide-y divide-gray-200">
                              {uploadedFiles.map((file, index) => (
                                <li key={index} className="py-2 flex justify-between items-center">
                                  <div className="flex items-center">
                                    <HiOutlineDocumentText className="h-5 w-5 text-gray-400" />
                                    <span className="ml-2 text-sm text-gray-900">{file.name}</span>
                                    <span className="ml-2 text-xs text-gray-500">{file.size}</span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => removeFile(index)}
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    <HiOutlineX className="h-5 w-5" />
                                  </button>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                      <button
                        type="button"
                        onClick={() => setShowTicketForm(false)}
                        className="mr-3 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#800000] hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                        disabled={loading}
                      >
                        {loading ? 'Submitting...' : 'Submit Ticket'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {filteredTickets.length > 0 ? (
                <div className="overflow-hidden sm:rounded-md">
                  <ul role="list" className="divide-y divide-gray-200">
                    {filteredTickets.map((ticket) => (
                      <li key={ticket.id} className="block hover:bg-gray-50">
                        <div className="px-4 py-4 sm:px-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              {getPriorityIcon(ticket.priority)}
                              <p className="ml-2 text-sm font-medium text-gray-900 truncate">
                                {ticket.subject}
                              </p>
                            </div>
                            <div className="ml-2 flex-shrink-0 flex">
                              <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(ticket.status)}`}>
                                {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                              </p>
                              <p className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityColor(ticket.priority)}`}>
                                {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                              </p>
                            </div>
                          </div>
                          <div className="mt-2 sm:flex sm:justify-between">
                            <div className="sm:flex">
                              <p className="flex items-center text-sm text-gray-500">
                                <span className="truncate">{ticket.id}</span>
                              </p>
                              <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                                <span className="truncate">{ticket.category}</span>
                              </p>
                            </div>
                            <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                              <p>
                                Created {formatDate(ticket.created)}
                              </p>
                            </div>
                          </div>
                          
                          <div className="mt-4 border-t border-gray-200 pt-4">
                            <div className="space-y-4">
                              {ticket.messages.map((message) => (
                                <div 
                                  key={message.id} 
                                  className={`flex ${message.from === 'client' ? 'justify-end' : 'justify-start'}`}
                                >
                                  <div 
                                    className={`max-w-[75%] rounded-lg px-4 py-2 ${
                                      message.from === 'client' 
                                        ? 'bg-[#f0e6e6] text-gray-900' 
                                        : 'bg-gray-100 text-gray-900'
                                    }`}
                                  >
                                    <p className="text-sm">{message.message}</p>
                                    <div className="mt-1 flex justify-between items-center">
                                      <p className="text-xs text-gray-500">
                                        {formatDate(message.timestamp)}
                                      </p>
                                      {message.from === 'support' && message.author && (
                                        <p className="text-xs text-gray-500 ml-4">
                                          {message.author}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                            
                            {ticket.status !== 'resolved' && ticket.status !== 'closed' && (
                              <div className="mt-4 flex">
                                <input
                                  type="text"
                                  value={replyText}
                                  onChange={(e) => setReplyText(e.target.value)}
                                  className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                                  placeholder="Reply to this ticket..."
                                />
                                <button
                                  type="button"
                                  onClick={() => handleSendReply(ticket.id)}
                                  disabled={!replyText.trim()}
                                  className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#800000] hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000] disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  Send
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="text-center py-12">
                  <HiOutlineTicket className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No support tickets</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {searchTerm 
                      ? `No tickets found matching "${searchTerm}"`
                      : "You don't have any support tickets yet."}
                  </p>
                  <div className="mt-6">
                    <button
                      type="button"
                      onClick={() => setShowTicketForm(true)}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#800000] hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                    >
                      <HiOutlinePlus className="-ml-1 mr-2 h-5 w-5" />
                      Create Support Ticket
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Contact Us Tab */}
          {activeTab === 'contact' && (
            <div className="p-6">
              <div className="max-w-3xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 flex items-center">
                      <HiOutlinePhone className="h-6 w-6 text-[#800000] mr-2" />
                      Phone Support
                    </h3>
                    <div className="mt-4 text-sm text-gray-500">
                      <p className="mb-2">Call us during business hours:</p>
                      <p className="text-lg font-medium text-gray-900 mb-1">(800) 555-1234</p>
                      <p className="mb-4">Monday - Friday: 8:00 AM - 6:00 PM EST</p>
                      <div className="bg-gray-50 p-4 rounded-md">
                        <p className="text-sm text-gray-500 font-medium">For urgent matters outside business hours:</p>
                        <p className="text-gray-900 mt-1">(800) 555-9876</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 flex items-center">
                      <HiOutlineMail className="h-6 w-6 text-[#800000] mr-2" />
                      Email Support
                    </h3>
                    <div className="mt-4 text-sm text-gray-500">
                      <p className="mb-2">Send us an email for non-urgent matters:</p>
                      <p className="text-lg font-medium text-gray-900 mb-1">support@psnattorneys.co.za</p>
                      <p className="mb-4">We typically respond within 24 business hours.</p>
                      <div className="bg-gray-50 p-4 rounded-md">
                        <p className="text-sm text-gray-500 font-medium">For billing inquiries:</p>
                        <p className="text-gray-900 mt-1">billing@psnattorneys.co.za</p>
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-2 border-t border-gray-200 pt-6 mt-4">
                    <h3 className="text-lg font-medium text-gray-900 flex items-center">
                      <HiOutlineChat className="h-6 w-6 text-[#800000] mr-2" />
                      Live Chat
                    </h3>
                    <div className="mt-4 text-sm text-gray-500">
                      <p>Chat with our support team in real-time during business hours:</p>
                      <button
                        type="button"
                        onClick={() => showToast("Live chat service will be available soon!", "info")}
                        className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#800000] hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                      >
                        <HiOutlineChat className="-ml-1 mr-2 h-5 w-5" />
                        Start Live Chat
                      </button>
                    </div>
                  </div>

                  <div className="md:col-span-2 border-t border-gray-200 pt-6 mt-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Office Locations</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gray-50 p-4 rounded-md">
                        <h4 className="font-medium text-gray-900">Cape Town Office</h4>
                        <address className="mt-2 not-italic text-sm text-gray-500">
                          123 Legal Avenue<br />
                          Suite 500<br />
                          Cape Town, 8001
                        </address>
                        <p className="mt-2 text-sm text-gray-500">
                          <span className="font-medium">Hours:</span> Monday-Friday, 9:00 AM - 5:00 PM
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-md">
                        <h4 className="font-medium text-gray-900">Johannesburg Office</h4>
                        <address className="mt-2 not-italic text-sm text-gray-500">
                          456 Justice Boulevard<br />
                          Floor 12<br />
                          Johannesburg, 2000
                        </address>
                        <p className="mt-2 text-sm text-gray-500">
                          <span className="font-medium">Hours:</span> Monday-Friday, 9:00 AM - 5:00 PM
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 animate-fade-in-up">
          <div className={`rounded-md p-4 shadow-lg ${
            toastMessage.type === 'success' ? 'bg-green-50 text-green-800' : 
            toastMessage.type === 'error' ? 'bg-red-50 text-red-800' : 
            'bg-blue-50 text-blue-800'
          }`}>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                {toastMessage.type === 'success' ? (
                  <HiOutlineCheckCircle className="h-5 w-5 text-green-400" />
                ) : toastMessage.type === 'error' ? (
                  <HiOutlineExclamation className="h-5 w-5 text-red-400" />
                ) : (
                  <HiOutlineInformationCircle className="h-5 w-5 text-blue-400" />
                )}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{toastMessage.text}</p>
              </div>
              <div className="ml-auto pl-3">
                <div className="-mx-1.5 -my-1.5">
                  <button
                    onClick={() => setToastMessage(null)}
                    className={`inline-flex rounded-md p-1.5 ${
                      toastMessage.type === 'success' ? 'text-green-500 hover:bg-green-100' : 
                      toastMessage.type === 'error' ? 'text-red-500 hover:bg-red-100' : 
                      'text-blue-500 hover:bg-blue-100'
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                      toastMessage.type === 'success' ? 'focus:ring-green-600' : 
                      toastMessage.type === 'error' ? 'focus:ring-red-600' : 
                      'focus:ring-blue-600'
                    }`}
                  >
                    <span className="sr-only">Dismiss</span>
                    <HiOutlineX className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientSupportPage;