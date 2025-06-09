import React, { useState, useEffect, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import {
  HiOutlineBriefcase,
  HiOutlineUserGroup,
  HiOutlineUserCircle,
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineDocumentText,
  HiOutlineClipboardList,
  HiOutlineSearch,
  HiOutlineFilter,
  HiOutlinePlus,
  HiOutlinePencilAlt,
  HiOutlineTrash,
  HiOutlineX,
  HiOutlineCheck,
  HiOutlineExclamation,
  HiOutlineTag,
  HiOutlineOfficeBuilding,
  HiOutlineCash,
  HiOutlineChevronDown,
  HiOutlineChevronRight,
  HiOutlineScale,
  HiOutlineFolderOpen,
  HiOutlineDocumentDuplicate,
  HiOutlineStatusOnline,
  HiOutlineChatAlt,
  HiOutlineBell
} from 'react-icons/hi';

const AdminCasesPage = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPracticeArea, setFilterPracticeArea] = useState('all');
  const [isAddingCase, setIsAddingCase] = useState(false);
  const [isEditingCase, setIsEditingCase] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);
  const [isViewingCase, setIsViewingCase] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [caseToDelete, setCaseToDelete] = useState(null);
  const [activeTab, setActiveTab] = useState('details');
  
  // Add toast state
  const [toast, setToast] = useState(null);
  
  const [newCase, setNewCase] = useState({
    caseNumber: '',
    title: '',
    description: '',
    clientId: '',
    clientName: '',
    practiceArea: '',
    assignedAttorneys: [],
    status: 'active',
    priority: 'medium',
    courtDetails: {
      court: '',
      judge: '',
      caseNumber: '',
      nextHearing: ''
    },
    openDate: new Date().toISOString().split('T')[0],
    estimatedCloseDate: '',
    billingType: 'hourly',
    billingRate: ''
  });

  // Mock data for dropdowns
  const clients = [
    { id: '1', name: 'Thabo Mbeki' },
    { id: '2', name: 'Nelson Mandela Foundation' },
    { id: '3', name: 'MTN Group Limited' },
    { id: '4', name: 'Cyril Ramaphosa' },
    { id: '5', name: 'Standard Bank of South Africa' }
  ];
  
  const attorneys = [
    { id: '1', name: 'Thabo Mbeki', position: 'Senior Partner' },
    { id: '2', name: 'Naledi Pandor', position: 'Associate' },
    { id: '3', name: 'Sipho Nkosi', position: 'Partner' },
    { id: '4', name: 'Lerato Moloi', position: 'Senior Associate' },
    { id: '5', name: 'Mandla Zulu', position: 'Junior Associate' }
  ];
  
  const practiceAreas = [
    'Family Law',
    'Corporate Law',
    'Criminal Law',
    'Property Law',
    'Litigation',
    'Conveyancing',
    'Estates & Trusts'
  ];
  
  const courts = [
    'Constitutional Court',
    'Supreme Court of Appeal',
    'High Court - Johannesburg',
    'High Court - Cape Town',
    'High Court - Durban',
    'Magistrate Court - Johannesburg',
    'Magistrate Court - Cape Town',
    'Magistrate Court - Durban'
  ];
  
  useEffect(() => {
    // Simulating API call to fetch cases
    setTimeout(() => {
      const mockCases = [
        {
          id: '1',
          caseNumber: 'C-2025-001',
          title: 'Mbeki v. Department of Home Affairs',
          description: 'Dispute regarding citizenship documentation and rights.',
          clientId: '1',
          clientName: 'Thabo Mbeki',
          clientType: 'individual',
          practiceArea: 'Administrative Law',
          assignedAttorneys: [
            { id: '1', name: 'Thabo Mbeki', position: 'Senior Partner' },
            { id: '2', name: 'Naledi Pandor', position: 'Associate' }
          ],
          status: 'active',
          priority: 'high',
          courtDetails: {
            court: 'High Court - Johannesburg',
            judge: 'Judge Moseneke',
            caseNumber: 'HC/JHB/2025/1245',
            nextHearing: '2025-07-15'
          },
          openDate: '2025-01-15',
          estimatedCloseDate: '2025-12-30',
          billingType: 'hourly',
          billingRate: 2500,
          totalBilled: 87500,
          totalPaid: 65000,
          documents: 24,
          activities: 47,
          notes: [
            { date: '2025-01-15', author: 'Thabo Mbeki', content: 'Initial consultation with client. Discussed case details and strategy.' },
            { date: '2025-02-03', author: 'Naledi Pandor', content: 'Filed initial documents with the court. Waiting for response from Department of Home Affairs.' },
            { date: '2025-05-21', author: 'Thabo Mbeki', content: 'Court granted extension for document submission. Next hearing scheduled for July 15, 2025.' }
          ]
        },
        {
          id: '2',
          caseNumber: 'C-2025-002',
          title: 'Nelson Mandela Foundation v. Publisher X',
          description: 'Copyright infringement case regarding unauthorized use of Nelson Mandela\'s image and quotes.',
          clientId: '2',
          clientName: 'Nelson Mandela Foundation',
          clientType: 'organization',
          practiceArea: 'Intellectual Property',
          assignedAttorneys: [
            { id: '3', name: 'Sipho Nkosi', position: 'Partner' }
          ],
          status: 'active',
          priority: 'medium',
          courtDetails: {
            court: 'High Court - Johannesburg',
            judge: 'Judge Zondo',
            caseNumber: 'HC/JHB/2025/1678',
            nextHearing: '2025-08-22'
          },
          openDate: '2025-02-10',
          estimatedCloseDate: '2025-11-15',
          billingType: 'fixed',
          billingRate: 150000,
          totalBilled: 75000,
          totalPaid: 75000,
          documents: 18,
          activities: 31,
          notes: [
            { date: '2025-02-10', author: 'Sipho Nkosi', content: 'Met with foundation representatives to discuss unauthorized use of Mandela\'s image.' },
            { date: '2025-03-05', author: 'Sipho Nkosi', content: 'Sent cease and desist letter to Publisher X.' },
            { date: '2025-05-30', author: 'Sipho Nkosi', content: 'Received response from Publisher X. They are disputing claims. Preparing for court hearing.' }
          ]
        },
        {
          id: '3',
          caseNumber: 'C-2025-003',
          title: 'MTN Group v. Communications Regulatory Authority',
          description: 'Challenge to new telecommunications regulations and licensing fees.',
          clientId: '3',
          clientName: 'MTN Group Limited',
          clientType: 'organization',
          practiceArea: 'Corporate Law',
          assignedAttorneys: [
            { id: '1', name: 'Thabo Mbeki', position: 'Senior Partner' },
            { id: '5', name: 'Mandla Zulu', position: 'Junior Associate' }
          ],
          status: 'on hold',
          priority: 'high',
          courtDetails: {
            court: 'High Court - Johannesburg',
            judge: 'Judge Mogoeng',
            caseNumber: 'HC/JHB/2025/2134',
            nextHearing: '2025-10-07'
          },
          openDate: '2025-03-05',
          estimatedCloseDate: '2026-02-28',
          billingType: 'hourly',
          billingRate: 3500,
          totalBilled: 210000,
          totalPaid: 175000,
          documents: 36,
          activities: 52,
          notes: [
            { date: '2025-03-05', author: 'Thabo Mbeki', content: 'Initial strategy meeting with MTN executives.' },
            { date: '2025-04-12', author: 'Mandla Zulu', content: 'Prepared regulatory analysis report and potential challenges to new fees.' },
            { date: '2025-06-01', author: 'Thabo Mbeki', content: 'Case placed on hold pending regulatory authority review of fee structure.' }
          ]
        },
        {
          id: '4',
          caseNumber: 'C-2024-004',
          title: 'Ramaphosa Property Dispute',
          description: 'Boundary dispute with neighboring property owner.',
          clientId: '4',
          clientName: 'Cyril Ramaphosa',
          clientType: 'individual',
          practiceArea: 'Property Law',
          assignedAttorneys: [
            { id: '4', name: 'Lerato Moloi', position: 'Senior Associate' }
          ],
          status: 'closed',
          priority: 'medium',
          courtDetails: {
            court: 'Magistrate Court - Johannesburg',
            judge: 'Magistrate Pillay',
            caseNumber: 'MC/JHB/2024/0789',
            nextHearing: ''
          },
          openDate: '2024-11-20',
          closedDate: '2025-04-30',
          billingType: 'hourly',
          billingRate: 2000,
          totalBilled: 48000,
          totalPaid: 48000,
          documents: 15,
          activities: 23,
          notes: [
            { date: '2024-11-20', author: 'Lerato Moloi', content: 'Initial consultation regarding property boundary dispute.' },
            { date: '2025-01-15', author: 'Lerato Moloi', content: 'Mediation session with neighbor. Progress made toward resolution.' },
            { date: '2025-04-15', author: 'Lerato Moloi', content: 'Settlement reached with neighbor. Preparing final documents.' }
          ],
          outcome: 'Settled out of court. New boundary agreement signed by both parties.'
        },
        {
          id: '5',
          caseNumber: 'C-2025-005',
          title: 'Standard Bank v. Defaulting Business',
          description: 'Loan recovery case against defaulting business customer.',
          clientId: '5',
          clientName: 'Standard Bank of South Africa',
          clientType: 'organization',
          practiceArea: 'Litigation',
          assignedAttorneys: [
            { id: '3', name: 'Sipho Nkosi', position: 'Partner' },
            { id: '5', name: 'Mandla Zulu', position: 'Junior Associate' }
          ],
          status: 'active',
          priority: 'medium',
          courtDetails: {
            court: 'High Court - Johannesburg',
            judge: 'Judge Mojapelo',
            caseNumber: 'HC/JHB/2025/1890',
            nextHearing: '2025-09-25'
          },
          openDate: '2025-04-10',
          estimatedCloseDate: '2025-12-15',
          billingType: 'contingency',
          contingencyRate: '15%',
          totalAmount: 2500000,
          totalBilled: 0,
          totalPaid: 0,
          documents: 29,
          activities: 38,
          notes: [
            { date: '2025-04-10', author: 'Sipho Nkosi', content: 'Reviewed loan documentation and default notices sent to client.' },
            { date: '2025-05-22', author: 'Mandla Zulu', content: 'Filed court papers for loan recovery. Amount claimed: R2.5 million plus interest.' },
            { date: '2025-06-04', author: 'Sipho Nkosi', content: 'Received response from defendant. They are requesting an extension to file their defense.' }
          ]
        }
      ];
      
      setCases(mockCases);
      setLoading(false);
    }, 1000);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested fields like courtDetails
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setNewCase({
        ...newCase,
        [parent]: {
          ...newCase[parent],
          [child]: value
        }
      });
    } else {
      setNewCase({
        ...newCase,
        [name]: value
      });
    }
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested fields like courtDetails
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setSelectedCase({
        ...selectedCase,
        [parent]: {
          ...selectedCase[parent],
          [child]: value
        }
      });
    } else {
      setSelectedCase({
        ...selectedCase,
        [name]: value
      });
    }
  };

  const handleClientSelect = (e) => {
    const clientId = e.target.value;
    const selectedClient = clients.find(client => client.id === clientId);
    
    setNewCase({
      ...newCase,
      clientId: clientId,
      clientName: selectedClient ? selectedClient.name : ''
    });
  };

  const handleAttorneySelect = (e) => {
    const attorneyId = e.target.value;
    if (!attorneyId) return;
    
    const selectedAttorney = attorneys.find(attorney => attorney.id === attorneyId);
    
    if (selectedAttorney && !newCase.assignedAttorneys.some(atty => atty.id === attorneyId)) {
      setNewCase({
        ...newCase,
        assignedAttorneys: [...newCase.assignedAttorneys, selectedAttorney]
      });
    }
  };

  const removeAttorney = (attorneyId) => {
    setNewCase({
      ...newCase,
      assignedAttorneys: newCase.assignedAttorneys.filter(attorney => attorney.id !== attorneyId)
    });
  };

  const handleEditAttorneySelect = (e) => {
    const attorneyId = e.target.value;
    if (!attorneyId) return;
    
    const selectedAttorney = attorneys.find(attorney => attorney.id === attorneyId);
    
    if (selectedAttorney && !selectedCase.assignedAttorneys.some(atty => atty.id === attorneyId)) {
      setSelectedCase({
        ...selectedCase,
        assignedAttorneys: [...selectedCase.assignedAttorneys, selectedAttorney]
      });
    }
  };

  const removeEditAttorney = (attorneyId) => {
    setSelectedCase({
      ...selectedCase,
      assignedAttorneys: selectedCase.assignedAttorneys.filter(attorney => attorney.id !== attorneyId)
    });
  };

  const handleAddCase = () => {
    const caseItem = {
      ...newCase,
      id: (cases.length + 1).toString(),
      caseNumber: `C-2025-${String(cases.length + 1).padStart(3, '0')}`,
      documents: 0,
      activities: 0,
      notes: [],
      totalBilled: 0,
      totalPaid: 0
    };
    
    setCases([...cases, caseItem]);
    setNewCase({
      caseNumber: '',
      title: '',
      description: '',
      clientId: '',
      clientName: '',
      practiceArea: '',
      assignedAttorneys: [],
      status: 'active',
      priority: 'medium',
      courtDetails: {
        court: '',
        judge: '',
        caseNumber: '',
        nextHearing: ''
      },
      openDate: new Date().toISOString().split('T')[0],
      estimatedCloseDate: '',
      billingType: 'hourly',
      billingRate: ''
    });
    
    setIsAddingCase(false);
    showToast('Case added successfully');
  };

  const handleUpdateCase = () => {
    const updatedCases = cases.map(caseItem => 
      caseItem.id === selectedCase.id ? selectedCase : caseItem
    );
    
    setCases(updatedCases);
    setSelectedCase(null);
    setIsEditingCase(false);
    showToast('Case updated successfully');
  };

  const handleDeleteCase = () => {
    const updatedCases = cases.filter(
      caseItem => caseItem.id !== caseToDelete.id
    );
    
    setCases(updatedCases);
    setCaseToDelete(null);
    setIsConfirmingDelete(false);
    showToast('Case deleted successfully');
  };

  const initiateEdit = (caseItem) => {
    setSelectedCase(caseItem);
    setIsEditingCase(true);
  };

  const initiateDelete = (caseItem) => {
    setCaseToDelete(caseItem);
    setIsConfirmingDelete(true);
  };

  const viewCase = (caseItem) => {
    setSelectedCase(caseItem);
    setIsViewingCase(true);
  };

  const addNote = (e) => {
    e.preventDefault();
    const noteContent = e.target.elements.note.value;
    if (!noteContent.trim()) return;

    const newNote = {
      date: '2025-06-06', // Current date in 2025
      author: 'Current User', // In a real app, would come from auth context
      content: noteContent
    };

    setSelectedCase({
      ...selectedCase,
      notes: [...selectedCase.notes, newNote]
    });

    e.target.elements.note.value = '';
  };

  const filteredCases = cases
    .filter(caseItem => 
      (filterStatus === 'all' || caseItem.status === filterStatus) &&
      (filterPracticeArea === 'all' || caseItem.practiceArea === filterPracticeArea) &&
      (
        caseItem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        caseItem.caseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        caseItem.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        caseItem.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

  // Get status badge color
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'on hold':
        return 'bg-yellow-100 text-yellow-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get priority badge color
  const getPriorityBadgeColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-blue-100 text-blue-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Show toast notification
  const showToast = (message, type = 'success') => {
    console.log("Showing toast:", message); // Debugging line
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="py-6">
      {/* Toast notification - make sure it's more visible */}
      {toast && (
        <div className={`fixed bottom-4 right-4 z-50 p-4 rounded-md shadow-lg ${
          toast.type === 'success' ? 'bg-green-100 border border-green-400' : 'bg-red-100 border border-red-400'
        } transition-all duration-300 ease-in-out transform translate-y-0 opacity-100`}>
          <div className="flex items-center">
            {toast.type === 'success' ? (
              <HiOutlineCheck className="h-5 w-5 text-green-500 mr-3" />
            ) : (
              <HiOutlineExclamation className="h-5 w-5 text-red-500 mr-3" />
            )}
            <p className={`text-sm font-medium ${
              toast.type === 'success' ? 'text-green-800' : 'text-red-800'
            }`}>
              {toast.message}
            </p>
            <button 
              onClick={() => setToast(null)}
              className="ml-4 text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <HiOutlineX className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Cases Management</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage client cases, court information, and case documents
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <button
              onClick={() => showToast("Add Case feature coming soon!", "success")}
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#800000] hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
            >
              <HiOutlinePlus className="-ml-1 mr-2 h-5 w-5" />
              Add Case
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-6">
        <div className="bg-white shadow overflow-hidden rounded-lg">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex-1 min-w-0 mb-4 md:mb-0">
                <div className="relative rounded-md shadow-sm max-w-md">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <HiOutlineSearch className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="focus:ring-[#800000] focus:border-[#800000] block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                    placeholder="Search cases by title, number, or client..."
                  />
                </div>
              </div>
              <div className="mt-2 md:mt-0 flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                <div className="flex items-center">
                  <HiOutlineFilter className="mr-2 h-5 w-5 text-gray-400" />
                  <span className="mr-2 text-sm text-gray-500">Status:</span>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm rounded-md"
                  >
                    <option value="all">All</option>
                    <option value="active">Active</option>
                    <option value="on hold">On Hold</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
                <div className="flex items-center">
                  <HiOutlineTag className="mr-2 h-5 w-5 text-gray-400" />
                  <span className="mr-2 text-sm text-gray-500">Practice Area:</span>
                  <select
                    value={filterPracticeArea}
                    onChange={(e) => setFilterPracticeArea(e.target.value)}
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm rounded-md"
                  >
                    <option value="all">All</option>
                    {practiceAreas.map((area) => (
                      <option key={area} value={area}>{area}</option>
                    ))}
                    <option value="Administrative Law">Administrative Law</option>
                    <option value="Intellectual Property">Intellectual Property</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-solid border-[#800000] border-r-transparent"></div>
              <p className="mt-4 text-gray-500">Loading cases...</p>
            </div>
          ) : (
            <>
              {filteredCases.length === 0 ? (
                <div className="text-center py-12">
                  <HiOutlineBriefcase className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No cases found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {searchTerm ? `No results for "${searchTerm}"` : 'Start by adding a new case'}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Case Info
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Client
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Attorneys
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status & Priority
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Court Details
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredCases.map((caseItem) => (
                        <tr key={caseItem.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="flex-shrink-0">
                                <HiOutlineBriefcase className="h-6 w-6 text-gray-400" />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{caseItem.title}</div>
                                <div className="text-xs text-gray-500">{caseItem.caseNumber}</div>
                                <div className="text-xs text-gray-500 mt-1">{caseItem.practiceArea}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">{caseItem.clientName}</div>
                            <div className="text-xs text-gray-500">
                              {caseItem.clientType === 'individual' ? 'Individual' : 'Organization'}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col space-y-1">
                              {caseItem.assignedAttorneys.map((attorney) => (
                                <div key={attorney.id} className="flex items-center">
                                  <HiOutlineUserCircle className="mr-1 h-4 w-4 text-gray-400" />
                                  <span className="text-sm text-gray-900">{attorney.name}</span>
                                </div>
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(caseItem.status)}`}>
                              {caseItem.status.charAt(0).toUpperCase() + caseItem.status.slice(1)}
                            </span>
                            <span className={`mt-1 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityBadgeColor(caseItem.priority)}`}>
                              {caseItem.priority.charAt(0).toUpperCase() + caseItem.priority.slice(1)} Priority
                            </span>
                            <div className="text-xs text-gray-500 mt-1">
                              <div className="flex items-center">
                                <HiOutlineCalendar className="mr-1 h-4 w-4" />
                                Opened: {caseItem.openDate}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">{caseItem.courtDetails.court}</div>
                            <div className="text-xs text-gray-500">Case #: {caseItem.courtDetails.caseNumber}</div>
                            {caseItem.courtDetails.nextHearing && (
                              <div className="text-xs text-gray-500 mt-1">
                                <div className="flex items-center">
                                  <HiOutlineClock className="mr-1 h-4 w-4" />
                                  Next Hearing: {caseItem.courtDetails.nextHearing}
                                </div>
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => {
                                console.log("Button clicked"); // Add this for debugging
                                showToast("View case details coming soon!", "success");
                              }}
                              className="text-gray-600 hover:text-gray-900 mr-3"
                            >
                              View
                            </button>
                            <button
                              onClick={() => showToast("Edit case feature coming soon!", "success")}
                              className="text-[#800000] hover:text-[#600000] mr-3"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => showToast("Delete case feature coming soon!", "success")}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Add Case Modal */}
      <Transition appear show={isAddingCase} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={() => setIsAddingCase(false)}
        >
          <div className="min-h-screen px-4 text-center">
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

            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-full max-w-3xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Add New Case
                </Dialog.Title>
                
                <div className="mt-4 space-y-6">
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-6">
                      <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                        Case Title
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="title"
                          id="title"
                          value={newCase.title}
                          onChange={handleInputChange}
                          className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                          placeholder="e.g., Smith v. Department of Health"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-6">
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Case Description
                      </label>
                      <div className="mt-1">
                        <textarea
                          id="description"
                          name="description"
                          rows={3}
                          value={newCase.description}
                          onChange={handleInputChange}
                          className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                          placeholder="Brief description of the case"
                        />
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
                          value={newCase.clientId}
                          onChange={handleClientSelect}
                          className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                        >
                          <option value="">Select a client</option>
                          {clients.map((client) => (
                            <option key={client.id} value={client.id}>{client.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="practiceArea" className="block text-sm font-medium text-gray-700">
                        Practice Area
                      </label>
                      <div className="mt-1">
                        <select
                          id="practiceArea"
                          name="practiceArea"
                          value={newCase.practiceArea}
                          onChange={handleInputChange}
                          className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                        >
                          <option value="">Select a practice area</option>
                          {practiceAreas.map((area) => (
                            <option key={area} value={area}>{area}</option>
                          ))}
                          <option value="Administrative Law">Administrative Law</option>
                          <option value="Intellectual Property">Intellectual Property</option>
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
                          value={newCase.status}
                          onChange={handleInputChange}
                          className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                        >
                          <option value="active">Active</option>
                          <option value="on hold">On Hold</option>
                          <option value="closed">Closed</option>
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
                          value={newCase.priority}
                          onChange={handleInputChange}
                          className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </select>
                      </div>
                    </div>

                    <div className="sm:col-span-6">
                      <label htmlFor="assignedAttorneys" className="block text-sm font-medium text-gray-700">
                        Assigned Attorneys
                      </label>
                      <div className="mt-1">
                        <select
                          id="assignedAttorneys"
                          name="assignedAttorneys"
                          onChange={handleAttorneySelect}
                          defaultValue=""
                          className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                        >
                          <option value="">Add an attorney</option>
                          {attorneys.map((attorney) => (
                            <option key={attorney.id} value={attorney.id}>
                              {attorney.name} ({attorney.position})
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {newCase.assignedAttorneys.map((attorney) => (
                          <div key={attorney.id} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {attorney.name}
                            <button
                              type="button"
                              onClick={() => removeAttorney(attorney.id)}
                              className="ml-1.5 flex-shrink-0 inline-flex text-gray-400 hover:text-gray-500"
                            >
                              <HiOutlineX className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="openDate" className="block text-sm font-medium text-gray-700">
                        Open Date
                      </label>
                      <div className="mt-1">
                        <input
                          type="date"
                          name="openDate"
                          id="openDate"
                          value={newCase.openDate}
                          onChange={handleInputChange}
                          className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                          min="2025-01-01"
                          max="2025-12-31"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="estimatedCloseDate" className="block text-sm font-medium text-gray-700">
                        Estimated Close Date
                      </label>
                      <div className="mt-1">
                        <input
                          type="date"
                          name="estimatedCloseDate"
                          id="estimatedCloseDate"
                          value={newCase.estimatedCloseDate}
                          onChange={handleInputChange}
                          className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                          min="2025-06-06"
                          max="2026-12-31"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-6 border-t border-gray-200 pt-4">
                      <h4 className="text-sm font-medium text-gray-700">Court Information</h4>
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="courtDetails.court" className="block text-sm font-medium text-gray-700">
                        Court
                      </label>
                      <div className="mt-1">
                        <select
                          id="courtDetails.court"
                          name="courtDetails.court"
                          value={newCase.courtDetails.court}
                          onChange={handleInputChange}
                          className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                        >
                          <option value="">Select a court</option>
                          {courts.map((court) => (
                            <option key={court} value={court}>{court}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="courtDetails.judge" className="block text-sm font-medium text-gray-700">
                        Judge
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="courtDetails.judge"
                          id="courtDetails.judge"
                          value={newCase.courtDetails.judge}
                          onChange={handleInputChange}
                          className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                          placeholder="e.g., Judge Moseneke"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="courtDetails.caseNumber" className="block text-sm font-medium text-gray-700">
                        Court Case Number
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="courtDetails.caseNumber"
                          id="courtDetails.caseNumber"
                          value={newCase.courtDetails.caseNumber}
                          onChange={handleInputChange}
                          className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                          placeholder="e.g., HC/JHB/2025/1234"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="courtDetails.nextHearing" className="block text-sm font-medium text-gray-700">
                        Next Hearing Date
                      </label>
                      <div className="mt-1">
                        <input
                          type="date"
                          name="courtDetails.nextHearing"
                          id="courtDetails.nextHearing"
                          value={newCase.courtDetails.nextHearing}
                          onChange={handleInputChange}
                          className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                          min="2025-06-06"
                          max="2026-12-31"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-6 border-t border-gray-200 pt-4">
                      <h4 className="text-sm font-medium text-gray-700">Billing Information</h4>
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="billingType" className="block text-sm font-medium text-gray-700">
                        Billing Type
                      </label>
                      <div className="mt-1">
                        <select
                          id="billingType"
                          name="billingType"
                          value={newCase.billingType}
                          onChange={handleInputChange}
                          className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                        >
                          <option value="hourly">Hourly Rate</option>
                          <option value="fixed">Fixed Fee</option>
                          <option value="contingency">Contingency</option>
                        </select>
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="billingRate" className="block text-sm font-medium text-gray-700">
                        {newCase.billingType === 'hourly' ? 'Hourly Rate (ZAR)' : 
                         newCase.billingType === 'fixed' ? 'Fixed Fee (ZAR)' : 
                         'Contingency Percentage'}
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="billingRate"
                          id="billingRate"
                          value={newCase.billingRate}
                          onChange={handleInputChange}
                          className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                          placeholder={newCase.billingType === 'contingency' ? 'e.g., 25%' : 'e.g., 2500'}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                    onClick={() => setIsAddingCase(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-[#800000] border border-transparent rounded-md hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                    onClick={() => {
                      showToast("Add case feature coming soon!", "success");
                      setIsAddingCase(false);
                    }}
                    disabled={!newCase.title || !newCase.clientId || !newCase.practiceArea}
                  >
                    Add Case
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

      {/* Edit Case Modal */}
      <Transition appear show={isEditingCase} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={() => setIsEditingCase(false)}
        >
          <div className="min-h-screen px-4 text-center">
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

            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-full max-w-3xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Edit Case
                </Dialog.Title>
                
                {selectedCase && (
                  <div className="mt-4 space-y-6">
                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                      <div className="sm:col-span-6">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                          Case Title
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            name="title"
                            id="title"
                            value={selectedCase.title}
                            onChange={handleEditInputChange}
                            className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-6">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                          Case Description
                        </label>
                        <div className="mt-1">
                          <textarea
                            id="description"
                            name="description"
                            rows={3}
                            value={selectedCase.description}
                            onChange={handleEditInputChange}
                            className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label htmlFor="practiceArea" className="block text-sm font-medium text-gray-700">
                          Practice Area
                        </label>
                        <div className="mt-1">
                          <select
                            id="practiceArea"
                            name="practiceArea"
                            value={selectedCase.practiceArea}
                            onChange={handleEditInputChange}
                            className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                          >
                            {practiceAreas.map((area) => (
                              <option key={area} value={area}>{area}</option>
                            ))}
                            <option value="Administrative Law">Administrative Law</option>
                            <option value="Intellectual Property">Intellectual Property</option>
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
                            value={selectedCase.status}
                            onChange={handleEditInputChange}
                            className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                          >
                            <option value="active">Active</option>
                            <option value="on hold">On Hold</option>
                            <option value="closed">Closed</option>
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
                            value={selectedCase.priority}
                            onChange={handleEditInputChange}
                            className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                          >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                          </select>
                        </div>
                      </div>

                      <div className="sm:col-span-6">
                        <label htmlFor="assignedAttorneys" className="block text-sm font-medium text-gray-700">
                          Assigned Attorneys
                        </label>
                        <div className="mt-1">
                          <select
                            id="assignedAttorneys"
                            name="assignedAttorneys"
                            onChange={handleEditAttorneySelect}
                            defaultValue=""
                            className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                          >
                            <option value="">Add an attorney</option>
                            {attorneys.map((attorney) => (
                              <option key={attorney.id} value={attorney.id}>
                                {attorney.name} ({attorney.position})
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {selectedCase.assignedAttorneys.map((attorney) => (
                            <div key={attorney.id} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              {attorney.name}
                              <button
                                type="button"
                                onClick={() => removeEditAttorney(attorney.id)}
                                className="ml-1.5 flex-shrink-0 inline-flex text-gray-400 hover:text-gray-500"
                              >
                                <HiOutlineX className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label htmlFor="estimatedCloseDate" className="block text-sm font-medium text-gray-700">
                          Estimated Close Date
                        </label>
                        <div className="mt-1">
                          <input
                            type="date"
                            name="estimatedCloseDate"
                            id="estimatedCloseDate"
                            value={selectedCase.estimatedCloseDate}
                            onChange={handleEditInputChange}
                            className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                            min="2025-06-06"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-6 border-t border-gray-200 pt-4">
                        <h4 className="text-sm font-medium text-gray-700">Court Information</h4>
                      </div>

                      <div className="sm:col-span-3">
                        <label htmlFor="courtDetails.court" className="block text-sm font-medium text-gray-700">
                          Court
                        </label>
                        <div className="mt-1">
                          <select
                            id="courtDetails.court"
                            name="courtDetails.court"
                            value={selectedCase.courtDetails.court}
                            onChange={handleEditInputChange}
                            className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                          >
                            <option value="">Select a court</option>
                            {courts.map((court) => (
                              <option key={court} value={court}>{court}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label htmlFor="courtDetails.judge" className="block text-sm font-medium text-gray-700">
                          Judge
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            name="courtDetails.judge"
                            id="courtDetails.judge"
                            value={selectedCase.courtDetails.judge}
                            onChange={handleEditInputChange}
                            className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label htmlFor="courtDetails.caseNumber" className="block text-sm font-medium text-gray-700">
                          Court Case Number
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            name="courtDetails.caseNumber"
                            id="courtDetails.caseNumber"
                            value={selectedCase.courtDetails.caseNumber}
                            onChange={handleEditInputChange}
                            className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label htmlFor="courtDetails.nextHearing" className="block text-sm font-medium text-gray-700">
                          Next Hearing Date
                        </label>
                        <div className="mt-1">
                          <input
                            type="date"
                            name="courtDetails.nextHearing"
                            id="courtDetails.nextHearing"
                            value={selectedCase.courtDetails.nextHearing}
                            onChange={handleEditInputChange}
                            className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                            min="2025-06-06"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                    onClick={() => setIsEditingCase(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-[#800000] border border-transparent rounded-md hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                    onClick={() => {
                      showToast("Save changes feature coming soon!", "success");
                      setIsEditingCase(false);
                    }}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

      {/* View Case Modal */}
      <Transition appear show={isViewingCase} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={() => setIsViewingCase(false)}
        >
          <div className="min-h-screen px-4 text-center">
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

            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-full max-w-4xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                {selectedCase && (
                  <>
                    <div className="flex justify-between items-start">
                      <div>
                        <Dialog.Title
                          as="h3"
                          className="text-lg font-medium leading-6 text-gray-900"
                        >
                          {selectedCase.title}
                        </Dialog.Title>
                        <p className="mt-1 text-sm text-gray-500">
                          Case Number: {selectedCase.caseNumber}
                        </p>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <button
                          type="button"
                          className="inline-flex items-center justify-center w-8 h-8 rounded-full text-gray-400 hover:text-gray-500"
                          onClick={() => setIsViewingCase(false)}
                        >
                          <span className="sr-only">Close</span>
                          <HiOutlineX className="w-6 h-6" aria-hidden="true" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                        <div className="sm:col-span-6">
                          <h4 className="text-sm font-medium text-gray-700">Case Details</h4>
                        </div>

                        <div className="sm:col-span-3">
                          <p className="text-sm text-gray-900">
                            <span className="font-semibold">Client:</span> {selectedCase.clientName}
                          </p>
                          <p className="text-sm text-gray-900">
                            <span className="font-semibold">Practice Area:</span> {selectedCase.practiceArea}
                          </p>
                          <p className="text-sm text-gray-900">
                            <span className="font-semibold">Status:</span> {selectedCase.status}
                          </p>
                          <p className="text-sm text-gray-900">
                            <span className="font-semibold">Priority:</span> {selectedCase.priority}
                          </p>
                        </div>

                        <div className="sm:col-span-3">
                          <h4 className="text-sm font-medium text-gray-700">Court Details</h4>
                          <p className="text-sm text-gray-900">
                            <span className="font-semibold">Court:</span> {selectedCase.courtDetails.court}
                          </p>
                          <p className="text-sm text-gray-900">
                            <span className="font-semibold">Judge:</span> {selectedCase.courtDetails.judge}
                          </p>
                          <p className="text-sm text-gray-900">
                            <span className="font-semibold">Case Number:</span> {selectedCase.courtDetails.caseNumber}
                          </p>
                          <p className="text-sm text-gray-900">
                            <span className="font-semibold">Next Hearing:</span> {selectedCase.courtDetails.nextHearing}
                          </p>
                        </div>

                        <div className="sm:col-span-6">
                          <h4 className="text-sm font-medium text-gray-700">Assigned Attorneys</h4>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {selectedCase.assignedAttorneys.map((attorney) => (
                              <div key={attorney.id} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                {attorney.name}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="sm:col-span-6">
                          <h4 className="text-sm font-medium text-gray-700">Billing Information</h4>
                          <p className="text-sm text-gray-900">
                            <span className="font-semibold">Billing Type:</span> {selectedCase.billingType}
                          </p>
                          <p className="text-sm text-gray-900">
                            <span className="font-semibold">Billing Rate:</span> {selectedCase.billingRate}
                          </p>
                        </div>

                        <div className="sm:col-span-6">
                          <h4 className="text-sm font-medium text-gray-700">Notes</h4>
                          <div className="mt-2 space-y-2">
                            {selectedCase.notes.length === 0 ? (
                              <p className="text-sm text-gray-500">No notes available for this case.</p>
                            ) : (
                              selectedCase.notes.map((note, index) => (
                                <div key={index} className="p-4 bg-gray-50 rounded-md">
                                  <p className="text-xs text-gray-500">
                                    {note.date} by {note.author}
                                  </p>
                                  <p className="text-sm text-gray-900">{note.content}</p>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>

  );
};

export default AdminCasesPage;
