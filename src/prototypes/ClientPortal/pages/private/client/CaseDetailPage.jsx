import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  HiOutlineDocumentText, 
  HiOutlineCalendar, 
  HiOutlineUser, 
  HiOutlineOfficeBuilding,
  HiOutlineClock,
  HiOutlineChatAlt,
  HiOutlineExclamationCircle,
  HiOutlineChevronLeft,
  HiOutlineDownload,
  HiOutlineUpload,
  HiOutlinePaperClip,
  HiOutlineLink,
  HiOutlineChartBar,
  HiOutlinePhone,
  HiOutlineMail,
  HiOutlineCash,
  HiCheck,
  HiX
} from 'react-icons/hi';

const CaseDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [caseData, setCaseData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [uploadingFile, setUploadingFile] = useState(false);
  const [newMessageText, setNewMessageText] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [fileToUpload, setFileToUpload] = useState(null);
  
  // Mock data - in a real app, this would be fetched from an API
  useEffect(() => {
    const fetchCaseData = async () => {
      setLoading(true);
      
      try {
        // Simulating an API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock case data
        const mockCaseData = {
          id: parseInt(id),
          title: "Smith v. Johnson",
          caseNumber: "PI-2023-1452",
          type: "Personal Injury",
          status: "Active",
          description: "Auto accident personal injury claim from May 2023 incident on Highway 101. The client was rear-ended while stopped in traffic and sustained neck and back injuries requiring ongoing physical therapy.",
          startDate: "2023-05-12",
          attorney: {
            id: 3,
            name: "Sarah Nguyen",
            email: "sarah.nguyen@psnattorneys.com",
            phone: "(555) 123-4567",
            avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
          },
          paralegal: {
            id: 5,
            name: "Michael Rodriguez",
            email: "michael.rodriguez@psnattorneys.com",
            phone: "(555) 987-6543",
            avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
          },
          client: {
            id: 101,
            name: "Sarah Smith",
            email: "sarah.smith@example.com",
            phone: "(555) 555-1212"
          },
          opponent: {
            name: "Jason Johnson",
            attorney: "Davis & Partners LLC",
            insuranceCompany: "Global Insurance Co."
          },
          timeline: [
            {
              id: 1,
              date: "2023-05-12",
              title: "Case Opened",
              description: "Initial consultation and case information gathering",
              completed: true
            },
            {
              id: 2,
              date: "2023-05-15",
              title: "Medical Records Requested",
              description: "Request sent to Memorial Hospital and Valley Medical Center",
              completed: true
            },
            {
              id: 3,
              date: "2023-05-25",
              title: "Insurance Claim Filed",
              description: "Claim #INS-2023-78542 filed with Global Insurance",
              completed: true
            },
            {
              id: 4,
              date: "2023-06-10",
              title: "Medical Records Received",
              description: "Records received from Memorial Hospital, awaiting Valley Medical",
              completed: true
            },
            {
              id: 5,
              date: "2023-06-20",
              title: "Demand Letter",
              description: "Demand letter sent to Global Insurance for $75,000",
              completed: false
            },
            {
              id: 6,
              date: "2023-07-15",
              title: "Settlement Negotiation",
              description: "Expected response from insurance company",
              completed: false
            }
          ],
          upcomingEvents: [
            {
              id: 1,
              title: "Follow-up Medical Evaluation",
              date: "2023-06-05",
              time: "10:00 AM",
              location: "Valley Medical Center, Room 305",
              description: "Dr. Williams will perform follow-up evaluation"
            },
            {
              id: 2,
              title: "Meeting with Attorney",
              date: "2023-06-12",
              time: "2:00 PM",
              location: "PSN Law Offices, Conference Room C",
              description: "Review medical documentation and discuss demand strategy"
            },
            {
              id: 3,
              title: "Deposition Preparation",
              date: "2023-06-25",
              time: "11:00 AM",
              location: "Virtual Meeting",
              description: "Preparation session for upcoming deposition"
            }
          ],
          documents: [
            {
              id: 1,
              title: "Accident Report",
              type: "PDF",
              size: "1.2 MB",
              uploadDate: "2023-05-13",
              uploadedBy: "Sarah Smith",
              needsReview: false,
              signatureRequired: false
            },
            {
              id: 2,
              title: "Medical Records - Memorial Hospital",
              type: "PDF",
              size: "3.5 MB",
              uploadDate: "2023-05-18",
              uploadedBy: "Sarah Nguyen",
              needsReview: false,
              signatureRequired: false
            },
            {
              id: 3,
              title: "Medical Bills",
              type: "PDF",
              size: "0.8 MB",
              uploadDate: "2023-05-20",
              uploadedBy: "Sarah Smith",
              needsReview: false,
              signatureRequired: false
            },
            {
              id: 4,
              title: "Insurance Policy",
              type: "PDF",
              size: "1.5 MB",
              uploadDate: "2023-05-22",
              uploadedBy: "Michael Rodriguez",
              needsReview: false,
              signatureRequired: false
            },
            {
              id: 5,
              title: "Client Representation Agreement",
              type: "DOCX",
              size: "0.3 MB",
              uploadDate: "2023-05-12",
              uploadedBy: "Sarah Nguyen",
              needsReview: false,
              signatureRequired: true
            },
            {
              id: 6,
              title: "Medical Records Release Form",
              type: "PDF",
              size: "0.2 MB",
              uploadDate: "2023-05-13",
              uploadedBy: "Sarah Nguyen",
              needsReview: false,
              signatureRequired: true
            }
          ],
          messages: [
            {
              id: 1,
              sender: {
                name: "Sarah Nguyen",
                role: "Attorney",
                avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              },
              date: "2023-05-15T10:30:00Z",
              content: "Hello Sarah, I wanted to let you know that we've requested your medical records from both hospitals. Please let me know if you have any questions.",
              attachments: []
            },
            {
              id: 2,
              sender: {
                name: "Sarah Smith",
                role: "Client",
                avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              },
              date: "2023-05-15T14:45:00Z",
              content: "Thank you for the update. I have a follow-up appointment with Dr. Williams next week. Should I share those records with you as well?",
              attachments: []
            },
            {
              id: 3,
              sender: {
                name: "Sarah Nguyen",
                role: "Attorney",
                avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              },
              date: "2023-05-16T09:15:00Z",
              content: "Yes, please do share those records. You can upload them directly through the portal using the Documents tab, or email them to me. The more documentation we have about your injuries and treatment, the stronger our case will be.",
              attachments: []
            },
            {
              id: 4,
              sender: {
                name: "Michael Rodriguez",
                role: "Paralegal",
                avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              },
              date: "2023-05-22T11:30:00Z",
              content: "Hi Sarah, I've uploaded the insurance policy document to your case file. Please review it when you have a chance to familiarize yourself with the coverage details.",
              attachments: [
                {
                  name: "Insurance_Policy.pdf",
                  size: "1.5 MB"
                }
              ]
            },
            {
              id: 5,
              sender: {
                name: "Sarah Smith",
                role: "Client",
                avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              },
              date: "2023-05-23T15:20:00Z",
              content: "I've reviewed the policy. Thank you for providing it. I'm starting to receive bills from the hospital. Should I forward those to you as well?",
              attachments: []
            }
          ],
          financials: {
            medicalExpenses: 12500,
            lostWages: 5000,
            otherExpenses: 1800,
            totalDamagesEstimate: 45000,
            attorneyFees: "33% of settlement",
            costs: 1200
          }
        };
        
        setCaseData(mockCaseData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching case details:", err);
        setError("Failed to load case details. Please try again later.");
        setLoading(false);
        toast.error("Error loading case details");
      }
    };
    
    fetchCaseData();
  }, [id]);
  
  // Handle file selection
  const handleFileSelect = (e) => {
    if (e.target.files.length > 0) {
      setFileToUpload(e.target.files[0]);
    }
  };
  
  // Handle file upload
  const handleFileUpload = async (e) => {
    e.preventDefault();
    
    if (!fileToUpload) {
      toast.error("Please select a file to upload");
      return;
    }
    
    setUploadingFile(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update documents list with new file
      const newDocument = {
        id: caseData.documents.length + 1,
        title: fileToUpload.name,
        type: fileToUpload.name.split('.').pop().toUpperCase(),
        size: `${(fileToUpload.size / (1024 * 1024)).toFixed(1)} MB`,
        uploadDate: new Date().toISOString().split('T')[0],
        uploadedBy: "Sarah Smith", // Would come from authenticated user
        needsReview: true,
        signatureRequired: false
      };
      
      setCaseData({
        ...caseData,
        documents: [...caseData.documents, newDocument]
      });
      
      setFileToUpload(null);
      toast.success("File uploaded successfully");
    } catch (err) {
      console.error("Error uploading file:", err);
      toast.error("Failed to upload file");
    } finally {
      setUploadingFile(false);
    }
  };
  
  // Handle sending a message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessageText.trim()) {
      toast.error("Please enter a message");
      return;
    }
    
    setSendingMessage(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Add new message to messages list
      const newMessage = {
        id: caseData.messages.length + 1,
        sender: {
          name: "Sarah Smith", // Would come from authenticated user
          role: "Client",
          avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
        },
        date: new Date().toISOString(),
        content: newMessageText,
        attachments: []
      };
      
      setCaseData({
        ...caseData,
        messages: [...caseData.messages, newMessage]
      });
      
      setNewMessageText('');
      toast.success("Message sent");
    } catch (err) {
      console.error("Error sending message:", err);
      toast.error("Failed to send message");
    } finally {
      setSendingMessage(false);
    }
  };
  
  // Format date helper
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };
  
  // Format date and time helper
  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return `${date.toLocaleDateString()} at ${date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
  };
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  if (loading) {
    return (
      <div className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <div className="text-center">
              <svg className="animate-spin h-10 w-10 text-[#800000] mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="mt-4 text-gray-600">Loading case details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !caseData) {
    return (
      <div className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <div className="text-center">
              <HiOutlineExclamationCircle className="h-16 w-16 text-red-500 mx-auto" />
              <h2 className="mt-2 text-lg font-medium text-gray-900">Error Loading Case</h2>
              <p className="mt-1 text-gray-500">{error || "Case not found"}</p>
              <div className="mt-6">
                <button
                  onClick={() => navigate('/client-portal/cases')}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#800000] hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                >
                  <HiOutlineChevronLeft className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                  Back to Cases
                </button>
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
        {/* Back button and case header */}
        <div className="mb-5">
          <Link
            to="/client-portal/cases"
            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
          >
            <HiOutlineChevronLeft className="-ml-1 mr-1 h-5 w-5" aria-hidden="true" />
            Back to Cases
          </Link>
        </div>
        
        <div className="mb-6">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-semibold text-gray-900">{caseData.title}</h1>
              <div className="mt-1 flex flex-wrap items-center">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mr-2">
                  {caseData.status}
                </span>
                <span className="text-sm text-gray-500 mr-2">
                  Case #{caseData.caseNumber}
                </span>
                <span className="text-sm text-gray-500 mr-2">
                  {caseData.type}
                </span>
                <span className="text-sm text-gray-500">
                  Opened on {formatDate(caseData.startDate)}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="sm:hidden">
            <label htmlFor="tabs" className="sr-only">Select a tab</label>
            <select
              id="tabs"
              name="tabs"
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm rounded-md"
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
            >
              <option value="overview">Overview</option>
              <option value="documents">Documents</option>
              <option value="timeline">Timeline</option>
              <option value="messages">Messages</option>
              <option value="calendar">Calendar</option>
              <option value="financials">Financials</option>
            </select>
          </div>
          <div className="hidden sm:block">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('overview')}
                className={`
                  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                  ${activeTab === 'overview'
                    ? 'border-[#800000] text-[#800000]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                `}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('documents')}
                className={`
                  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                  ${activeTab === 'documents'
                    ? 'border-[#800000] text-[#800000]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                `}
              >
                Documents
              </button>
              <button
                onClick={() => setActiveTab('timeline')}
                className={`
                  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                  ${activeTab === 'timeline'
                    ? 'border-[#800000] text-[#800000]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                `}
              >
                Timeline
              </button>
              <button
                onClick={() => setActiveTab('messages')}
                className={`
                  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                  ${activeTab === 'messages'
                    ? 'border-[#800000] text-[#800000]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                `}
              >
                Messages
              </button>
              <button
                onClick={() => setActiveTab('calendar')}
                className={`
                  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                  ${activeTab === 'calendar'
                    ? 'border-[#800000] text-[#800000]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                `}
              >
                Calendar
              </button>
              <button
                onClick={() => setActiveTab('financials')}
                className={`
                  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                  ${activeTab === 'financials'
                    ? 'border-[#800000] text-[#800000]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                `}
              >
                Financials
              </button>
            </nav>
          </div>
        </div>
        
        {/* Tab Content */}
        <div className="py-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Case Description */}
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Case Details</h3>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                  <p className="text-sm text-gray-500">{caseData.description}</p>
                </div>
              </div>
              
              {/* Case Team */}
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Your Legal Team</h3>
                </div>
                <div className="border-t border-gray-200">
                  <dl>
                    {/* Attorney */}
                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Attorney</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        <div className="flex items-center">
                          <img className="h-10 w-10 rounded-full mr-4" src={caseData.attorney.avatarUrl} alt="" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{caseData.attorney.name}</div>
                            <div className="flex items-center mt-1">
                              <HiOutlineMail className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-500">{caseData.attorney.email}</span>
                            </div>
                            <div className="flex items-center mt-1">
                              <HiOutlinePhone className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-500">{caseData.attorney.phone}</span>
                            </div>
                          </div>
                        </div>
                      </dd>
                    </div>
                    
                    {/* Paralegal */}
                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Paralegal</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        <div className="flex items-center">
                          <img className="h-10 w-10 rounded-full mr-4" src={caseData.paralegal.avatarUrl} alt="" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{caseData.paralegal.name}</div>
                            <div className="flex items-center mt-1">
                              <HiOutlineMail className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-500">{caseData.paralegal.email}</span>
                            </div>
                            <div className="flex items-center mt-1">
                              <HiOutlinePhone className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-500">{caseData.paralegal.phone}</span>
                            </div>
                          </div>
                        </div>
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
              
              {/* Case Parties */}
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Case Parties</h3>
                </div>
                <div className="border-t border-gray-200">
                  <dl>
                    {/* Client */}
                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Client</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{caseData.client.name}</div>
                          <div className="flex items-center mt-1">
                            <HiOutlineMail className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-500">{caseData.client.email}</span>
                          </div>
                          <div className="flex items-center mt-1">
                            <HiOutlinePhone className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-500">{caseData.client.phone}</span>
                          </div>
                        </div>
                      </dd>
                    </div>
                    
                    {/* Opposing Party */}
                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Opposing Party</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        <div className="text-sm font-medium text-gray-900">{caseData.opponent.name}</div>
                        <div className="flex items-center mt-1">
                          <HiOutlineOfficeBuilding className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-500">Represented by: {caseData.opponent.attorney}</span>
                        </div>
                        <div className="flex items-center mt-1">
                          <HiOutlineOfficeBuilding className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-500">Insurance: {caseData.opponent.insuranceCompany}</span>
                        </div>
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
              
              {/* Recent Activity */}
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Activity</h3>
                  <button
                    onClick={() => setActiveTab('timeline')}
                    className="inline-flex items-center text-sm font-medium text-[#800000] hover:text-[#600000]"
                  >
                    View all activity
                  </button>
                </div>
                <div className="border-t border-gray-200">
                  <ul className="divide-y divide-gray-200">
                    {caseData.timeline.slice(0, 3).map((event) => (
                      <li key={event.id} className="px-4 py-4">
                        <div className="flex items-center">
                          <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${event.completed ? 'bg-green-100' : 'bg-gray-100'}`}>
                            {event.completed ? (
                              <HiCheck className="h-5 w-5 text-green-600" />
                            ) : (
                              <HiOutlineClock className="h-5 w-5 text-gray-600" />
                            )}
                          </div>
                          <div className="ml-4">
                            <p className="text-sm font-medium text-gray-900">{event.title}</p>
                            <p className="text-sm text-gray-500">{event.description}</p>
                            <p className="text-xs text-gray-500 mt-1">{formatDate(event.date)}</p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              {/* Upcoming Events */}
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Upcoming Events</h3>
                  <button
                    onClick={() => setActiveTab('calendar')}
                    className="inline-flex items-center text-sm font-medium text-[#800000] hover:text-[#600000]"
                  >
                    View all events
                  </button>
                </div>
                <div className="border-t border-gray-200">
                  <ul className="divide-y divide-gray-200">
                    {caseData.upcomingEvents.slice(0, 2).map((event) => (
                      <li key={event.id} className="px-4 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12 bg-blue-100 text-blue-600 rounded-lg flex flex-col items-center justify-center">
                            <span className="text-xs font-semibold">{new Date(event.date).toLocaleDateString('en-US', {month: 'short'})}</span>
                            <span className="text-lg font-bold">{new Date(event.date).getDate()}</span>
                          </div>
                          <div className="ml-4">
                            <p className="text-sm font-medium text-gray-900">{event.title}</p>
                            <p className="text-sm text-gray-500">{event.time} • {event.location}</p>
                            <p className="text-xs text-gray-500 mt-1">{event.description}</p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
          
          {/* Documents Tab */}
          {activeTab === 'documents' && (
            <div className="space-y-6">
              {/* Upload Document Section */}
              <div className="bg-white shadow sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Upload Document</h3>
                  <div className="mt-2 max-w-xl text-sm text-gray-500">
                    <p>Upload any relevant documents for your case. Our team will review them promptly.</p>
                  </div>
                  <form onSubmit={handleFileUpload} className="mt-5 sm:flex sm:items-center">
                    <div className="w-full sm:max-w-xs">
                      <label htmlFor="file-upload" className="sr-only">
                        File
                      </label>
                      <div className="flex items-center">
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
                          onChange={handleFileSelect}
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={uploadingFile || !fileToUpload}
                      className={`mt-3 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm font-medium rounded-md text-white bg-[#800000] hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000] sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm ${
                        (uploadingFile || !fileToUpload) ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      {uploadingFile ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Uploading...
                        </>
                      ) : (
                        <>
                          <HiOutlineUpload className="-ml-1 mr-2 h-5 w-5" />
                          Upload
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
              
              {/* Documents List */}
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Case Documents</h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    All documents related to your case
                  </p>
                </div>
                <div className="border-t border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Document
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Size
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="relative px-6 py-3">
                          <span className="sr-only">Download</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {caseData.documents.map((document) => (
                        <tr key={document.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-gray-100 rounded-md">
                                <HiOutlineDocumentText className="h-6 w-6 text-gray-600" />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{document.title}</div>
                                <div className="text-sm text-gray-500">Uploaded by: {document.uploadedBy}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {document.type}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(document.uploadDate)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {document.size}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {document.signatureRequired ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                Signature Required
                              </span>
                            ) : document.needsReview ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                Under Review
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Available
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button 
                              className="text-[#800000] hover:text-[#600000]"
                              onClick={() => toast.info("Download functionality would be implemented here")}
                            >
                              <HiOutlineDownload className="h-5 w-5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          
          {/* Timeline Tab */}
          {activeTab === 'timeline' && (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Case Timeline</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  The progress of your case from start to present
                </p>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                <div className="py-5">
                  <div className="flow-root">
                    <ul className="-mb-8">
                      {caseData.timeline.map((event, eventIdx) => (
                        <li key={event.id}>
                          <div className="relative pb-8">
                            {eventIdx !== caseData.timeline.length - 1 ? (
                              <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                            ) : null}
                            <div className="relative flex space-x-3">
                              <div>
                                <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${event.completed ? 'bg-green-500' : 'bg-gray-400'}`}>
                                  {event.completed ? (
                                    <HiCheck className="h-5 w-5 text-white" />
                                  ) : (
                                    <HiOutlineClock className="h-5 w-5 text-white" />
                                  )}
                                </span>
                              </div>
                              <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                <div>
                                  <p className="text-sm text-gray-500">
                                    <span className="font-medium text-gray-900 mr-1">{event.title}</span>
                                    {event.description}
                                  </p>
                                </div>
                                <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                  {formatDate(event.date)}
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Messages Tab */}
          {activeTab === 'messages' && (
            <div className="space-y-6">
              {/* Message List */}
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Case Communications</h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    Messages between you and your legal team
                  </p>
                </div>
                <div className="border-t border-gray-200">
                  <ul className="divide-y divide-gray-200">
                    {caseData.messages.map((message) => (
                      <li key={message.id} className="px-4 py-4">
                        <div className="flex space-x-3">
                          <div className="flex-shrink-0">
                            <img className="h-10 w-10 rounded-full" src={message.sender.avatarUrl} alt="" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-gray-900">
                                {message.sender.name} <span className="text-xs text-gray-500 ml-1">({message.sender.role})</span>
                              </p>
                              <p className="text-sm text-gray-500">
                                {formatDateTime(message.date)}
                              </p>
                            </div>
                            <div className="mt-1 text-sm text-gray-700">
                              <p>{message.content}</p>
                            </div>
                            {message.attachments.length > 0 && (
                              <div className="mt-2">
                                <div className="flex items-center text-sm text-gray-500">
                                  <HiOutlinePaperClip className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                                  <span>Attachments:</span>
                                </div>
                                <ul className="mt-1">
                                  {message.attachments.map((attachment, idx) => (
                                    <li key={idx} className="pl-5 py-1">
                                      <div className="flex items-center">
                                        <HiOutlineDocumentText className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                        <button 
                                          className="text-[#800000] hover:text-[#600000] text-sm font-medium"
                                          onClick={() => toast.info("Download functionality would be implemented here")}
                                        >
                                          {attachment.name} ({attachment.size})
                                        </button>
                                      </div>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              {/* Send New Message */}
              <div className="bg-white shadow sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Send a Message</h3>
                  <div className="mt-2 max-w-xl text-sm text-gray-500">
                    <p>Send a message to your legal team about this case.</p>
                  </div>
                  <form onSubmit={handleSendMessage} className="mt-5">
                    <div>
                      <label htmlFor="message" className="sr-only">Message</label>
                      <textarea
                        id="message"
                        name="message"
                        rows={4}
                        className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border border-gray-300 rounded-md"
                        placeholder="Your message..."
                        value={newMessageText}
                        onChange={(e) => setNewMessageText(e.target.value)}
                      />
                    </div>
                    <div className="mt-3 flex justify-end">
                      <button
                        type="submit"
                        disabled={sendingMessage || !newMessageText.trim()}
                        className={`inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#800000] hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000] ${
                          (sendingMessage || !newMessageText.trim()) ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        {sendingMessage ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Sending...
                          </>
                        ) : (
                          <>
                            <HiOutlineChatAlt className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                            Send Message
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
          
          {/* Calendar Tab */}
          {activeTab === 'calendar' && (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Upcoming Events</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Important dates related to your case
                </p>
              </div>
              <div className="border-t border-gray-200 px-4 py-5">
                {caseData.upcomingEvents.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">No upcoming events scheduled</p>
                ) : (
                  <ul className="divide-y divide-gray-200">
                    {caseData.upcomingEvents.map((event) => (
                      <li key={event.id} className="py-4">
                        <div className="flex items-start">
                          <div className="flex-shrink-0">
                            <div className="flex flex-col items-center">
                              <div className="h-12 w-12 bg-blue-100 text-blue-600 rounded-lg flex flex-col items-center justify-center">
                                <span className="text-xs font-semibold">{new Date(event.date).toLocaleDateString('en-US', {month: 'short'})}</span>
                                <span className="text-lg font-bold">{new Date(event.date).getDate()}</span>
                              </div>
                              <div className="mt-1 text-xs text-gray-500">
                                {event.time}
                              </div>
                            </div>
                          </div>
                          
                          <div className="ml-4 flex-1">
                            <div>
                              <p className="text-sm font-medium text-gray-900">{event.title}</p>
                              <p className="mt-1 text-sm text-gray-500">{event.description}</p>
                            </div>
                            <div className="mt-2 flex items-center text-sm text-gray-500">
                              <HiOutlineOfficeBuilding className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                              {event.location}
                            </div>
                            <div className="mt-2">
                              <button
                                type="button"
                                className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                                onClick={() => toast.info("Calendar functionality would be implemented here")}
                              >
                                <HiOutlineCalendar className="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true" />
                                Add to Calendar
                              </button>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
          
          {/* Financials Tab */}
          {activeTab === 'financials' && (
            <div className="space-y-6">
              {/* Financial Summary */}
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Financial Summary</h3>
                </div>
                <div className="border-t border-gray-200">
                  <dl>
                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Medical Expenses</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{formatCurrency(caseData.financials.medicalExpenses)}</dd>
                    </div>
                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Lost Wages</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{formatCurrency(caseData.financials.lostWages)}</dd>
                    </div>
                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Other Expenses</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{formatCurrency(caseData.financials.otherExpenses)}</dd>
                    </div>
                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Total Damages Estimate</dt>
                      <dd className="mt-1 text-sm font-semibold text-gray-900 sm:mt-0 sm:col-span-2">{formatCurrency(caseData.financials.totalDamagesEstimate)}</dd>
                    </div>
                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Attorney Fees</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{caseData.financials.attorneyFees}</dd>
                    </div>
                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Case Costs to Date</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{formatCurrency(caseData.financials.costs)}</dd>
                    </div>
                  </dl>
                </div>
              </div>
              
              {/* Financial Chart Placeholder */}
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Damages Breakdown</h3>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                  <div className="flex justify-center items-center h-64 bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <HiOutlineChartBar className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">Chart would be displayed here</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Visual breakdown of damages and expenses
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CaseDetailPage;