import React, { useState, useEffect, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import {
  HiOutlineCash,
  HiOutlineDocumentText,
  HiOutlineUserCircle,
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineSearch,
  HiOutlineFilter,
  HiOutlinePlus,
  HiOutlinePencilAlt,
  HiOutlineTrash,
  HiOutlineX,
  HiOutlineCheck,
  HiOutlineExclamation,
  HiOutlineDownload,
  HiOutlineMail,
  HiOutlineChevronDown,
  HiOutlineDocumentDuplicate,
  HiOutlineChartBar,
  HiOutlineCurrencyDollar,
  HiOutlineClipboardCheck,
  HiOutlineCreditCard,
  HiOutlineReceiptTax,
  HiOutlineArrowSmUp,
  HiOutlineArrowSmDown,
  HiOutlineExclamationCircle
} from 'react-icons/hi';

const AdminBillingPage = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterMonth, setFilterMonth] = useState('all');
  const [isAddingInvoice, setIsAddingInvoice] = useState(false);
  const [isEditingInvoice, setIsEditingInvoice] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isViewingInvoice, setIsViewingInvoice] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState(null);
  const [activeTab, setActiveTab] = useState('invoices'); // 'invoices', 'reports', 'settings'
  const [clients, setClients] = useState([]);
  const [cases, setCases] = useState([]);
  const [reportPeriod, setReportPeriod] = useState('thisMonth');
  
  const [newInvoice, setNewInvoice] = useState({
    clientId: '',
    caseId: '',
    invoiceNumber: '',
    issueDate: new Date().toISOString().slice(0, 10),
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    status: 'draft',
    items: [
      { description: '', hours: 0, rate: 0, amount: 0 }
    ],
    subtotal: 0,
    tax: 0,
    total: 0,
    notes: ''
  });

  // Financial summary data
  const financialSummary = {
    thisMonth: {
      totalBilled: 157845,
      totalPaid: 0,
      totalOutstanding: 157845,
      overdueAmount: 0
    },
    ytd: {
      totalBilled: 450970,
      totalPaid: 200100,
      totalOutstanding: 250870,
      overdueAmount: 91310
    }
  };

  // Dummy data for reports
  const monthlyRevenueData = [
    { month: 'Jan 2025', billed: 385000, collected: 372000 },
    { month: 'Feb 2025', billed: 412000, collected: 405000 },
    { month: 'Mar 2025', billed: 468000, collected: 390000 },
    { month: 'Apr 2025', billed: 505000, collected: 475000 },
    { month: 'May 2025', billed: 520000, collected: 432000 },
    { month: 'Jun 2025', billed: 287000, collected: 115000 } // Current month (partial)
  ];

  const practiceAreaRevenue = [
    { area: 'Family Law', revenue: 145000 },
    { area: 'Corporate Law', revenue: 220000 },
    { area: 'Criminal Law', revenue: 98000 },
    { area: 'Property Law', revenue: 175000 },
    { area: 'Litigation', revenue: 185000 }
  ];

  const topClients = [
    { name: 'Johnson & Associates', spending: 120000 },
    { name: 'Cape Town Holdings', spending: 85000 },
    { name: 'Mandela Family Trust', spending: 65000 },
    { name: 'Pretoria Medical Group', spending: 55000 },
    { name: 'Gauteng Mining Corp.', spending: 45000 }
  ];

  useEffect(() => {
    // Simulating API call to fetch invoices
    setTimeout(() => {
      const mockInvoices = [
        {
          id: 'INV-2025-001',
          clientId: '1',
          clientName: 'Johnson & Associates',
          caseId: 'CASE-2025-12',
          caseTitle: 'Corporate Restructuring',
          invoiceNumber: 'INV-2025-001',
          issueDate: '2025-01-15',
          dueDate: '2025-02-15',
          status: 'paid',
          items: [
            { description: 'Legal consultation (10 hours)', hours: 10, rate: 2500, amount: 25000 },
            { description: 'Document preparation', hours: 5, rate: 2500, amount: 12500 },
            { description: 'Court filing fees', hours: 0, rate: 0, amount: 3500 }
          ],
          subtotal: 41000,
          tax: 6150,
          total: 47150,
          notes: 'Payment received on February 10, 2025.',
          paymentDate: '2025-02-10'
        },
        {
          id: 'INV-2025-002',
          clientId: '2',
          clientName: 'Cape Town Holdings',
          caseId: 'CASE-2025-18',
          caseTitle: 'Property Acquisition',
          invoiceNumber: 'INV-2025-002',
          issueDate: '2025-02-22',
          dueDate: '2025-03-22',
          status: 'paid',
          items: [
            { description: 'Property legal review (8 hours)', hours: 8, rate: 2800, amount: 22400 },
            { description: 'Contract negotiations (6 hours)', hours: 6, rate: 2800, amount: 16800 },
            { description: 'Administrative expenses', hours: 0, rate: 0, amount: 2500 }
          ],
          subtotal: 41700,
          tax: 6255,
          total: 47955,
          notes: 'Payment received on March 15, 2025.',
          paymentDate: '2025-03-15'
        },
        {
          id: 'INV-2025-003',
          clientId: '3',
          clientName: 'Mandela Family Trust',
          caseId: 'CASE-2025-23',
          caseTitle: 'Estate Planning',
          invoiceNumber: 'INV-2025-003',
          issueDate: '2025-03-10',
          dueDate: '2025-04-10',
          status: 'paid',
          items: [
            { description: 'Trust review and updates (12 hours)', hours: 12, rate: 2200, amount: 26400 },
            { description: 'Family consultation (4 hours)', hours: 4, rate: 2200, amount: 8800 },
            { description: 'Document filing', hours: 0, rate: 0, amount: 1500 }
          ],
          subtotal: 36700,
          tax: 5505,
          total: 42205,
          notes: 'Payment received on April 5, 2025.',
          paymentDate: '2025-04-05'
        },
        {
          id: 'INV-2025-004',
          clientId: '4',
          clientName: 'Pretoria Medical Group',
          caseId: 'CASE-2025-29',
          caseTitle: 'Medical License Dispute',
          invoiceNumber: 'INV-2025-004',
          issueDate: '2025-04-18',
          dueDate: '2025-05-18',
          status: 'paid',
          items: [
            { description: 'Administrative appeal preparation (15 hours)', hours: 15, rate: 2400, amount: 36000 },
            { description: 'Regulatory consultation (6 hours)', hours: 6, rate: 2400, amount: 14400 },
            { description: 'Filing fees', hours: 0, rate: 0, amount: 4200 }
          ],
          subtotal: 54600,
          tax: 8190,
          total: 62790,
          notes: 'Payment received on May 12, 2025.',
          paymentDate: '2025-05-12'
        },
        {
          id: 'INV-2025-005',
          clientId: '5',
          clientName: 'Gauteng Mining Corp.',
          caseId: 'CASE-2025-34',
          caseTitle: 'Environmental Compliance',
          invoiceNumber: 'INV-2025-005',
          issueDate: '2025-05-08',
          dueDate: '2025-06-08',
          status: 'outstanding',
          items: [
            { description: 'Environmental audit review (20 hours)', hours: 20, rate: 2300, amount: 46000 },
            { description: 'Compliance documentation (8 hours)', hours: 8, rate: 2300, amount: 18400 },
            { description: 'Expert consultation fees', hours: 0, rate: 0, amount: 15000 }
          ],
          subtotal: 79400,
          tax: 11910,
          total: 91310,
          notes: 'Client requested payment extension until June 15, 2025.'
        },
        {
          id: 'INV-2025-006',
          clientId: '1',
          clientName: 'Johnson & Associates',
          caseId: 'CASE-2025-38',
          caseTitle: 'Merger Agreement',
          invoiceNumber: 'INV-2025-006',
          issueDate: '2025-05-25',
          dueDate: '2025-06-25',
          status: 'outstanding',
          items: [
            { description: 'Contract drafting (18 hours)', hours: 18, rate: 2500, amount: 45000 },
            { description: 'Negotiation meetings (12 hours)', hours: 12, rate: 2500, amount: 30000 },
            { description: 'Legal research (5 hours)', hours: 5, rate: 2500, amount: 12500 }
          ],
          subtotal: 87500,
          tax: 13125,
          total: 100625,
          notes: ''
        },
        {
          id: 'INV-2025-007',
          clientId: '6',
          clientName: 'Durban Shipping Ltd.',
          caseId: 'CASE-2025-41',
          caseTitle: 'Maritime Dispute',
          invoiceNumber: 'INV-2025-007',
          issueDate: '2025-06-02',
          dueDate: '2025-07-02',
          status: 'draft',
          items: [
            { description: 'Initial case assessment (8 hours)', hours: 8, rate: 2600, amount: 20800 },
            { description: 'Document review (10 hours)', hours: 10, rate: 2600, amount: 26000 },
            { description: 'Court filing preparation', hours: 0, rate: 0, amount: 3500 }
          ],
          subtotal: 50300,
          tax: 7545,
          total: 57845,
          notes: 'Draft invoice pending final review before sending to client.'
        }
      ];

      const mockClients = [
        { id: '1', name: 'Johnson & Associates' },
        { id: '2', name: 'Cape Town Holdings' },
        { id: '3', name: 'Mandela Family Trust' },
        { id: '4', name: 'Pretoria Medical Group' },
        { id: '5', name: 'Gauteng Mining Corp.' },
        { id: '6', name: 'Durban Shipping Ltd.' },
        { id: '7', name: 'Port Elizabeth Construction' },
        { id: '8', name: 'Soweto Community Trust' }
      ];

      const mockCases = [
        { id: 'CASE-2025-12', title: 'Corporate Restructuring', clientId: '1' },
        { id: 'CASE-2025-18', title: 'Property Acquisition', clientId: '2' },
        { id: 'CASE-2025-23', title: 'Estate Planning', clientId: '3' },
        { id: 'CASE-2025-29', title: 'Medical License Dispute', clientId: '4' },
        { id: 'CASE-2025-34', title: 'Environmental Compliance', clientId: '5' },
        { id: 'CASE-2025-38', title: 'Merger Agreement', clientId: '1' },
        { id: 'CASE-2025-41', title: 'Maritime Dispute', clientId: '6' },
        { id: 'CASE-2025-45', title: 'Construction Permit Appeal', clientId: '7' },
        { id: 'CASE-2025-48', title: 'Community Land Rights', clientId: '8' }
      ];
      
      // Calculate financial summary
      const summary = {
        thisMonth: {
          totalBilled: 0,
          totalPaid: 0,
          totalOutstanding: 0,
          overdueAmount: 0
        },
        ytd: {
          totalBilled: 0,
          totalPaid: 0,
          totalOutstanding: 0,
          overdueAmount: 0
        }
      };
      
      const currentDate = new Date('2025-06-06');
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();
      
      mockInvoices.forEach(invoice => {
        const invoiceDate = new Date(invoice.issueDate);
        const invoiceMonth = invoiceDate.getMonth();
        const invoiceYear = invoiceDate.getFullYear();
        
        // YTD calculations
        if (invoiceYear === currentYear) {
          summary.ytd.totalBilled += invoice.total;
          
          if (invoice.status === 'paid') {
            summary.ytd.totalPaid += invoice.total;
          } else if (invoice.status === 'outstanding') {
            summary.ytd.totalOutstanding += invoice.total;
            
            // Check if overdue
            if (new Date(invoice.dueDate) < currentDate) {
              summary.ytd.overdueAmount += invoice.total;
            }
          }
        }
        
        // This month calculations
        if (invoiceYear === currentYear && invoiceMonth === currentMonth) {
          summary.thisMonth.totalBilled += invoice.total;
          
          if (invoice.status === 'paid') {
            summary.thisMonth.totalPaid += invoice.total;
          } else if (invoice.status === 'outstanding') {
            summary.thisMonth.totalOutstanding += invoice.total;
            
            // Check if overdue
            if (new Date(invoice.dueDate) < currentDate) {
              summary.thisMonth.overdueAmount += invoice.total;
            }
          }
        }
      });
      
      financialSummary.thisMonth = summary.thisMonth;
      financialSummary.ytd = summary.ytd;
      
      setInvoices(mockInvoices);
      setClients(mockClients);
      setCases(mockCases);
      setLoading(false);
    }, 1000);
  }, []);

  const generateInvoiceNumber = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const sequenceNumber = (invoices.length + 1).toString().padStart(3, '0');
    return `INV-${year}-${sequenceNumber}`;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewInvoice({
      ...newInvoice,
      [name]: value
    });
    
    // If client changes, reset case selection
    if (name === 'clientId') {
      setNewInvoice({
        ...newInvoice,
        clientId: value,
        caseId: ''
      });
    }
  };

  const handleEditInputChange = (e) => {
    if (!selectedInvoice) return;
    
    const { name, value } = e.target;
    setSelectedInvoice({
      ...selectedInvoice,
      [name]: value
    });
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...newInvoice.items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value
    };
    
    // If hours or rate changes, update amount
    if (field === 'hours' || field === 'rate') {
      updatedItems[index].amount = updatedItems[index].hours * updatedItems[index].rate;
    }
    
    // Calculate subtotal, tax, and total
    const subtotal = updatedItems.reduce((sum, item) => sum + item.amount, 0);
    const tax = subtotal * 0.15; // 15% VAT
    const total = subtotal + tax;
    
    setNewInvoice({
      ...newInvoice,
      items: updatedItems,
      subtotal,
      tax,
      total
    });
  };

  const handleEditItemChange = (index, field, value) => {
    const updatedItems = [...selectedInvoice.items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: field === 'hours' || field === 'rate' || field === 'amount' ? parseFloat(value) : value
    };
    
    // If hours or rate changes, update amount
    if (field === 'hours' || field === 'rate') {
      updatedItems[index].amount = updatedItems[index].hours * updatedItems[index].rate;
    }
    
    // Calculate subtotal, tax, and total
    const subtotal = updatedItems.reduce((sum, item) => sum + item.amount, 0);
    const tax = subtotal * 0.15; // 15% VAT
    const total = subtotal + tax;
    
    setSelectedInvoice({
      ...selectedInvoice,
      items: updatedItems,
      subtotal,
      tax,
      total
    });
  };

  const addItem = () => {
    setNewInvoice({
      ...newInvoice,
      items: [
        ...newInvoice.items,
        { description: '', hours: 0, rate: 0, amount: 0 }
      ]
    });
  };

  const removeItem = (index) => {
    const updatedItems = newInvoice.items.filter((_, i) => i !== index);
    
    // Recalculate totals
    const subtotal = updatedItems.reduce((sum, item) => sum + item.amount, 0);
    const tax = subtotal * 0.15;
    const total = subtotal + tax;
    
    setNewInvoice({
      ...newInvoice,
      items: updatedItems,
      subtotal,
      tax,
      total
    });
  };

  const addEditItem = () => {
    setSelectedInvoice({
      ...selectedInvoice,
      items: [
        ...selectedInvoice.items,
        { description: '', hours: 0, rate: 0, amount: 0 }
      ]
    });
  };

  const removeEditItem = (index) => {
    const updatedItems = selectedInvoice.items.filter((_, i) => i !== index);
    
    // Recalculate totals
    const subtotal = updatedItems.reduce((sum, item) => sum + item.amount, 0);
    const tax = subtotal * 0.15;
    const total = subtotal + tax;
    
    setSelectedInvoice({
      ...selectedInvoice,
      items: updatedItems,
      subtotal,
      tax,
      total
    });
  };

  const handleAddInvoice = () => {
    const clientName = clients.find(client => client.id === newInvoice.clientId)?.name || '';
    const caseTitle = cases.find(caseItem => caseItem.id === newInvoice.caseId)?.title || '';
    
    const invoiceNumber = newInvoice.invoiceNumber || generateInvoiceNumber();
    
    const invoice = {
      ...newInvoice,
      id: invoiceNumber,
      invoiceNumber,
      clientName,
      caseTitle,
      createdAt: new Date().toISOString()
    };
    
    setInvoices([...invoices, invoice]);
    
    // Reset form
    setNewInvoice({
      clientId: '',
      caseId: '',
      invoiceNumber: '',
      issueDate: new Date().toISOString().slice(0, 10),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      status: 'draft',
      items: [
        { description: '', hours: 0, rate: 0, amount: 0 }
      ],
      subtotal: 0,
      tax: 0,
      total: 0,
      notes: ''
    });
    
    setIsAddingInvoice(false);
  };

  const handleUpdateInvoice = () => {
    const updatedInvoices = invoices.map(invoice => 
      invoice.id === selectedInvoice.id ? selectedInvoice : invoice
    );
    
    setInvoices(updatedInvoices);
    setSelectedInvoice(null);
    setIsEditingInvoice(false);
  };

  const handleDeleteInvoice = () => {
    const updatedInvoices = invoices.filter(
      invoice => invoice.id !== invoiceToDelete.id
    );
    
    setInvoices(updatedInvoices);
    setInvoiceToDelete(null);
    setIsConfirmingDelete(false);
  };

  const initiateEdit = (invoice) => {
    setSelectedInvoice(invoice);
    setIsEditingInvoice(true);
  };

  const initiateDelete = (invoice) => {
    setInvoiceToDelete(invoice);
    setIsConfirmingDelete(true);
  };

  const viewInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setIsViewingInvoice(true);
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'outstanding':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR'
    }).format(amount);
  };

  const getFilteredInvoices = () => {
    const currentDate = new Date('2025-06-06');
    
    return invoices.filter(invoice => {
      // Check if invoice matches search term
      const matchesSearch = 
        invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.caseTitle.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Check if invoice matches status filter
      let matchesStatus = true;
      if (filterStatus !== 'all') {
        if (filterStatus === 'overdue') {
          matchesStatus = invoice.status === 'outstanding' && new Date(invoice.dueDate) < currentDate;
        } else {
          matchesStatus = invoice.status === filterStatus;
        }
      }
      
      // Check if invoice matches month filter
      let matchesMonth = true;
      if (filterMonth !== 'all') {
        const invoiceDate = new Date(invoice.issueDate);
        const invoiceMonth = invoiceDate.getMonth();
        
        matchesMonth = parseInt(filterMonth) === invoiceMonth;
      }
      
      return matchesSearch && matchesStatus && matchesMonth;
    });
  };

  const filteredInvoices = getFilteredInvoices();

  // Get client cases for the selected client
  const getClientCases = (clientId) => {
    if (!clientId) return [];
    return cases.filter(caseItem => caseItem.clientId === clientId);
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Billing & Finance</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage invoices, payments, and financial reports
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            {activeTab === 'invoices' && (
              <button
                onClick={() => setIsAddingInvoice(true)}
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#800000] hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
              >
                <HiOutlinePlus className="-ml-1 mr-2 h-5 w-5" />
                Create Invoice
              </button>
            )}
            {activeTab === 'reports' && (
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#800000] hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
              >
                <HiOutlineDownload className="-ml-1 mr-2 h-5 w-5" />
                Export Reports
              </button>
            )}
          </div>
        </div>

        <div className="mt-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('invoices')}
                className={`${
                  activeTab === 'invoices'
                    ? 'border-[#800000] text-[#800000]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
              >
                <HiOutlineDocumentText className="mr-2 h-5 w-5" />
                Invoices & Payments
              </button>
              <button
                onClick={() => setActiveTab('reports')}
                className={`${
                  activeTab === 'reports'
                    ? 'border-[#800000] text-[#800000]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
              >
                <HiOutlineChartBar className="mr-2 h-5 w-5" />
                Financial Reports
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`${
                  activeTab === 'settings'
                    ? 'border-[#800000] text-[#800000]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
              >
                <HiOutlineCurrencyDollar className="mr-2 h-5 w-5" />
                Billing Settings
              </button>
            </nav>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-6">
        {activeTab === 'invoices' && (
          <>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-[#800000] rounded-md p-3">
                      <HiOutlineCash className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Billed (YTD)</dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-gray-900">
                            {formatCurrency(financialSummary.ytd.totalBilled)}
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                      <HiOutlineClipboardCheck className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Payments Received (YTD)</dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-gray-900">
                            {formatCurrency(financialSummary.ytd.totalPaid)}
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                      <HiOutlineCreditCard className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Outstanding Invoices</dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-gray-900">
                            {formatCurrency(financialSummary.ytd.totalOutstanding)}
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-red-500 rounded-md p-3">
                      <HiOutlineExclamationCircle className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Overdue Amount</dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-gray-900">
                            {formatCurrency(financialSummary.ytd.overdueAmount)}
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 bg-white shadow overflow-hidden rounded-lg">
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
                        placeholder="Search invoices by number, client, or case..."
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
                        <option value="draft">Draft</option>
                        <option value="outstanding">Outstanding</option>
                        <option value="overdue">Overdue</option>
                        <option value="paid">Paid</option>
                      </select>
                    </div>
                    <div className="flex items-center">
                      <HiOutlineCalendar className="mr-2 h-5 w-5 text-gray-400" />
                      <span className="mr-2 text-sm text-gray-500">Month:</span>
                      <select
                        value={filterMonth}
                        onChange={(e) => setFilterMonth(e.target.value)}
                        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm rounded-md"
                      >
                        <option value="all">All</option>
                        <option value="0">January 2025</option>
                        <option value="1">February 2025</option>
                        <option value="2">March 2025</option>
                        <option value="3">April 2025</option>
                        <option value="4">May 2025</option>
                        <option value="5">June 2025</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-solid border-[#800000] border-r-transparent"></div>
                  <p className="mt-4 text-gray-500">Loading invoices...</p>
                </div>
              ) : (
                <>
                  {filteredInvoices.length === 0 ? (
                    <div className="text-center py-12">
                      <HiOutlineDocumentText className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No invoices found</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {searchTerm ? `No results for "${searchTerm}"` : 'Get started by creating a new invoice'}
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Invoice Number
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Client & Case
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Dates
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Amount
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {filteredInvoices.map((invoice) => {
                            const isOverdue = invoice.status === 'outstanding' && new Date(invoice.dueDate) < new Date('2025-06-06');
                            const displayStatus = isOverdue ? 'overdue' : invoice.status;
                            
                            return (
                              <tr key={invoice.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm font-medium text-gray-900">{invoice.invoiceNumber}</div>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="text-sm font-medium text-gray-900">{invoice.clientName}</div>
                                  <div className="text-sm text-gray-500">{invoice.caseTitle}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">
                                    <div className="flex items-center">
                                      <HiOutlineCalendar className="mr-1 h-4 w-4 text-gray-400" />
                                      Issued: {invoice.issueDate}
                                    </div>
                                    <div className="flex items-center mt-1">
                                      <HiOutlineClock className="mr-1 h-4 w-4 text-gray-400" />
                                      Due: {invoice.dueDate}
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm font-medium text-gray-900">{formatCurrency(invoice.total)}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(displayStatus)}`}>
                                    {displayStatus.charAt(0).toUpperCase() + displayStatus.slice(1)}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                  <button
                                    onClick={() => viewInvoice(invoice)}
                                    className="text-gray-600 hover:text-gray-900 mr-3"
                                  >
                                    View
                                  </button>
                                  {invoice.status !== 'paid' && (
                                    <>
                                      <button
                                        onClick={() => initiateEdit(invoice)}
                                        className="text-[#800000] hover:text-[#600000] mr-3"
                                      >
                                        Edit
                                      </button>
                                      <button
                                        onClick={() => initiateDelete(invoice)}
                                        className="text-red-600 hover:text-red-900"
                                      >
                                        Delete
                                      </button>
                                    </>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              )}
            </div>
          </>
        )}

        {activeTab === 'reports' && (
          <>
            <div className="bg-white shadow overflow-hidden rounded-lg">
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <h2 className="text-lg font-medium text-gray-900">Financial Reports</h2>
                  <div className="mt-2 md:mt-0">
                    <select
                      value={reportPeriod}
                      onChange={(e) => setReportPeriod(e.target.value)}
                      className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm rounded-md"
                    >
                      <option value="thisMonth">This Month (June 2025)</option>
                      <option value="lastMonth">Last Month (May 2025)</option>
                      <option value="q2_2025">Q2 2025</option>
                      <option value="q1_2025">Q1 2025</option>
                      <option value="ytd">Year to Date 2025</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
                    <div className="p-6">
                      <h3 className="text-lg font-medium text-gray-900">Monthly Revenue (2025)</h3>
                      <div className="mt-4 h-64 bg-gray-50 rounded-lg p-4">
                        <div className="h-full flex flex-col">
                          <div className="flex-1 flex items-end">
                            {monthlyRevenueData.map((month) => {
                              const maxHeight = Math.max(...monthlyRevenueData.map(m => m.billed));
                              const billedHeight = `${(month.billed / maxHeight) * 100}%`;
                              const collectedPercent = Math.round((month.collected / month.billed) * 100);
                              
                              return (
                                <div key={month.month} className="flex-1 flex flex-col items-center justify-end h-full px-1">
                                  <div className="text-xs text-gray-500 mb-1">
                                    {formatCurrency(month.collected).split('.')[0]}
                                  </div>
                                  <div className="w-full relative" style={{ height: billedHeight }}>
                                    <div className="absolute inset-0 bg-blue-100 rounded-t"></div>
                                    <div 
                                      className="absolute bottom-0 left-0 right-0 bg-blue-500 rounded-t"
                                      style={{ height: `${collectedPercent}%` }}
                                    ></div>
                                  </div>
                                  <div className="mt-2 text-xs text-gray-500 truncate w-full text-center">
                                    {month.month.split(' ')[0]}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                      <div className="mt-6 flex justify-center space-x-6">
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-blue-100 rounded-sm mr-1"></div>
                          <span className="text-xs text-gray-500">Billed</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-blue-500 rounded-sm mr-1"></div>
                          <span className="text-xs text-gray-500">Collected</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
                    <div className="p-6">
                      <h3 className="text-lg font-medium text-gray-900">Revenue by Practice Area (YTD)</h3>
                      <div className="mt-4 h-64 bg-gray-50 rounded-lg p-4">
                        <div className="h-full flex items-center justify-center">
                          <div className="w-full max-w-md">
                            {practiceAreaRevenue.map((area) => (
                              <div key={area.area} className="mb-4">
                                <div className="flex justify-between mb-1">
                                  <span className="text-sm font-medium text-gray-700">{area.area}</span>
                                  <span className="text-sm font-medium text-gray-700">{formatCurrency(area.revenue).split('.')[0]}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-[#800000] h-2 rounded-full" 
                                    style={{ width: `${(area.revenue / 220000) * 100}%` }}
                                  ></div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
                    <div className="p-6">
                      <h3 className="text-lg font-medium text-gray-900">Top Clients by Revenue (YTD)</h3>
                      <div className="mt-4">
                        <ul className="divide-y divide-gray-200">
                          {topClients.map((client, index) => (
                            <li key={client.name} className="py-3 flex justify-between items-center">
                              <div className="flex items-center">
                                <span className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded-full text-xs font-medium text-gray-800 mr-3">
                                  {index + 1}
                                </span>
                                <span className="text-sm font-medium text-gray-900">{client.name}</span>
                              </div>
                              <span className="text-sm font-medium text-gray-900">{formatCurrency(client.spending)}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
                    <div className="p-6">
                      <h3 className="text-lg font-medium text-gray-900">Financial Metrics</h3>
                      <div className="mt-4 space-y-4">
                        <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                          <span className="text-sm text-gray-500">Average Invoice Value:</span>
                          <span className="text-sm font-medium text-gray-900">R68,250</span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                          <span className="text-sm text-gray-500">Average Payment Time:</span>
                          <span className="text-sm font-medium text-gray-900">21 days</span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                          <span className="text-sm text-gray-500">Collection Rate:</span>
                          <span className="text-sm font-medium text-gray-900">94%</span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                          <span className="text-sm text-gray-500">Outstanding Invoice Age:</span>
                          <span className="text-sm font-medium text-gray-900">12 days</span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                          <span className="text-sm text-gray-500">YoY Revenue Growth:</span>
                          <span className="text-sm font-medium text-green-600 flex items-center">
                            <HiOutlineArrowSmUp className="mr-1 h-4 w-4" />
                            12.4%
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">Revenue Forecast (Q3 2025):</span>
                          <span className="text-sm font-medium text-gray-900">R1,450,000</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white shadow overflow-hidden rounded-lg">
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-6">Billing Settings</h2>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-md font-medium text-gray-900">Default Billing Rates</h3>
                  <div className="mt-3 border rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Position
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Hourly Rate (ZAR)
                          </th>
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Senior Partner</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">R3,500</td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button className="text-[#800000] hover:text-[#600000]">Edit</button>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Partner</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">R2,800</td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button className="text-[#800000] hover:text-[#600000]">Edit</button>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Senior Associate</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">R2,200</td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button className="text-[#800000] hover:text-[#600000]">Edit</button>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Associate</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">R1,800</td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button className="text-[#800000] hover:text-[#600000]">Edit</button>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Junior Associate</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">R1,400</td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button className="text-[#800000] hover:text-[#600000]">Edit</button>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Paralegal</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">R950</td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button className="text-[#800000] hover:text-[#600000]">Edit</button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label htmlFor="tax-rate" className="block text-sm font-medium text-gray-700">
                      Default Tax Rate (%)
                    </label>
                    <div className="mt-1">
                      <input
                        type="number"
                        name="tax-rate"
                        id="tax-rate"
                        className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                        defaultValue="15"
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-500">Standard VAT rate applied to invoices</p>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="payment-terms" className="block text-sm font-medium text-gray-700">
                      Default Payment Terms (days)
                    </label>
                    <div className="mt-1">
                      <input
                        type="number"
                        name="payment-terms"
                        id="payment-terms"
                        className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                        defaultValue="30"
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-500">Days until payment is due</p>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="invoice-prefix" className="block text-sm font-medium text-gray-700">
                      Invoice Number Prefix
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="invoice-prefix"
                        id="invoice-prefix"
                        className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                        defaultValue="INV-2025-"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="next-invoice-number" className="block text-sm font-medium text-gray-700">
                      Next Invoice Number
                    </label>
                    <div className="mt-1">
                      <input
                        type="number"
                        name="next-invoice-number"
                        id="next-invoice-number"
                        className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                        defaultValue="008"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-6 pt-5 border-t border-gray-200">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="send-email"
                          name="send-email"
                          type="checkbox"
                          className="focus:ring-[#800000] h-4 w-4 text-[#800000] border-gray-300 rounded"
                          defaultChecked={true}
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="send-email" className="font-medium text-gray-700">Send email with invoice</label>
                        <p className="text-gray-500">Automatically email invoices to clients when they are created</p>
                      </div>
                    </div>
                  </div>

                  <div className="sm:col-span-6">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="payment-reminders"
                          name="payment-reminders"
                          type="checkbox"
                          className="focus:ring-[#800000] h-4 w-4 text-[#800000] border-gray-300 rounded"
                          defaultChecked={true}
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="payment-reminders" className="font-medium text-gray-700">Send payment reminders</label>
                        <p className="text-gray-500">Automatically remind clients about upcoming and overdue payments</p>
                      </div>
                    </div>
                  </div>

                  <div className="sm:col-span-6 pt-5 border-t border-gray-200">
                    <label htmlFor="invoice-notes" className="block text-sm font-medium text-gray-700">
                      Default Invoice Notes
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="invoice-notes"
                        name="invoice-notes"
                        rows={3}
                        className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                        defaultValue="Payment is due within 30 days. Please include the invoice number with your payment. Thank you for your business."
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-[#800000] border border-transparent rounded-md hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                  >
                    Save Settings
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Invoice Drawer */}
      <Transition.Root show={isAddingInvoice} as={Fragment}>
        <Dialog
          as="div"
          className="fixed z-10 inset-0 overflow-y-auto"
          onClose={setIsAddingInvoice}
        >
          <div className="flex items-center justify-center min-h-screen px-4 py-12">
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
              <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all max-w-lg w-full">
                <div className="p-6">
                  <Dialog.Title className="text-lg font-medium text-gray-900">
                    Create New Invoice
                  </Dialog.Title>
                  <div className="mt-4">
                    <div className="grid grid-cols-1 gap-y-4">
                      <div>
                        <label htmlFor="clientId" className="block text-sm font-medium text-gray-700">
                          Client
                        </label>
                        <div className="mt-1">
                          <select
                            id="clientId"
                            name="clientId"
                            value={newInvoice.clientId}
                            onChange={handleInputChange}
                            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm rounded-md"
                          >
                            <option value="">Select a client</option>
                            {clients.map((client) => (
                              <option key={client.id} value={client.id}>
                                {client.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label htmlFor="caseId" className="block text-sm font-medium text-gray-700">
                          Case
                        </label>
                        <div className="mt-1">
                          <select
                            id="caseId"
                            name="caseId"
                            value={newInvoice.caseId}
                            onChange={handleInputChange}
                            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm rounded-md"
                            disabled={!newInvoice.clientId}
                          >
                            <option value="">Select a case</option>
                            {getClientCases(newInvoice.clientId).map((caseItem) => (
                              <option key={caseItem.id} value={caseItem.id}>
                                {caseItem.title}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label htmlFor="invoiceNumber" className="block text-sm font-medium text-gray-700">
                          Invoice Number
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            name="invoiceNumber"
                            id="invoiceNumber"
                            value={newInvoice.invoiceNumber}
                            onChange={handleInputChange}
                            className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                            placeholder="INV-2025-001"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="issueDate" className="block text-sm font-medium text-gray-700">
                            Issue Date
                          </label>
                          <div className="mt-1">
                            <input
                              type="date"
                              name="issueDate"
                              id="issueDate"
                              value={newInvoice.issueDate}
                              onChange={handleInputChange}
                              className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                            />
                          </div>
                        </div>

                        <div>
                          <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
                            Due Date
                          </label>
                          <div className="mt-1">
                            <input
                              type="date"
                              name="dueDate"
                              id="dueDate"
                              value={newInvoice.dueDate}
                              onChange={handleInputChange}
                              className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                          Notes
                        </label>
                        <div className="mt-1">
                          <textarea
                            id="notes"
                            name="notes"
                            rows={3}
                            value={newInvoice.notes}
                            onChange={handleInputChange}
                            className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                            placeholder="Enter any additional notes for the invoice"
                          />
                        </div>
                      </div>

                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700">
                          Invoice Items
                        </label>
                        <div className="mt-2">
                          {newInvoice.items.map((item, index) => (
                            <div key={index} className="bg-gray-50 p-4 rounded-lg mb-4">
                              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                                <div>
                                  <label htmlFor={`description-${index}`} className="block text-sm font-medium text-gray-700">
                                    Description
                                  </label>
                                  <div className="mt-1">
                                    <input
                                      type="text"
                                      name={`description-${index}`}
                                      id={`description-${index}`}
                                      value={item.description}
                                      onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                                      className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                                      placeholder="Item description"
                                    />
                                  </div>
                                </div>

                                <div>
                                  <label htmlFor={`hours-${index}`} className="block text-sm font-medium text-gray-700">
                                    Hours
                                  </label>
                                  <div className="mt-1">
                                    <input
                                      type="number"
                                      name={`hours-${index}`}
                                      id={`hours-${index}`}
                                      value={item.hours}
                                      onChange={(e) => handleItemChange(index, 'hours', e.target.value)}
                                      className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                                      placeholder="0"
                                    />
                                  </div>
                                </div>

                                <div>
                                  <label htmlFor={`rate-${index}`} className="block text-sm font-medium text-gray-700">
                                    Rate (ZAR)
                                  </label>
                                  <div className="mt-1">
                                    <input
                                      type="number"
                                      name={`rate-${index}`}
                                      id={`rate-${index}`}
                                      value={item.rate}
                                      onChange={(e) => handleItemChange(index, 'rate', e.target.value)}
                                      className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                                      placeholder="0"
                                    />
                                  </div>
                                </div>

                                <div>
                                  <label htmlFor={`amount-${index}`} className="block text-sm font-medium text-gray-700">
                                    Amount (ZAR)
                                  </label>
                                  <div className="mt-1">
                                    <input
                                      type="number"
                                      name={`amount-${index}`}
                                      id={`amount-${index}`}
                                      value={item.amount}
                                      onChange={(e) => handleItemChange(index, 'amount', e.target.value)}
                                      className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                                      placeholder="0"
                                      readOnly
                                    />
                                  </div>
                                </div>
                              </div>

                              <div className="mt-4 flex justify-end">
                                <button
                                  onClick={() => removeItem(index)}
                                  className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600"
                                >
                                  <HiOutlineTrash className="-ml-1 mr-2 h-5 w-5" />
                                  Remove Item
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="mt-4">
                          <button
                            onClick={addItem}
                            className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-[#800000] hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                          >
                            <HiOutlinePlus className="-ml-1 mr-2 h-5 w-5" />
                            Add Item
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end mt-6">
                  <button
                    onClick={() => setIsAddingInvoice(false)}
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-gray-300 border border-transparent rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 mr-3"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddInvoice}
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-[#800000] border border-transparent rounded-md hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                  >
                    <HiOutlineCheck className="-ml-1 mr-2 h-5 w-5" />
                    Save Invoice
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Edit Invoice Drawer */}
      <Transition.Root show={isEditingInvoice} as={Fragment}>
        <Dialog
          as="div"
          className="fixed z-10 inset-0 overflow-y-auto"
          onClose={setIsEditingInvoice}
        >
          <div className="flex items-center justify-center min-h-screen px-4 py-12">
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
              <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all max-w-lg w-full">
                <div className="p-6">
                  <Dialog.Title className="text-lg font-medium text-gray-900">
                    Edit Invoice
                  </Dialog.Title>
                  {selectedInvoice && (
                    <>
                      <div className="mt-4">
                        <div className="grid grid-cols-1 gap-y-4">
                          <div>
                            <label htmlFor="clientId" className="block text-sm font-medium text-gray-700">
                              Client
                            </label>
                            <div className="mt-1">
                              <select
                                id="clientId"
                                name="clientId"
                                value={selectedInvoice.clientId || ''}
                                onChange={handleEditInputChange}
                                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm rounded-md"
                              >
                                <option value="">Select a client</option>
                                {clients.map((client) => (
                                  <option key={client.id} value={client.id}>
                                    {client.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <div>
                            <label htmlFor="caseId" className="block text-sm font-medium text-gray-700">
                              Case
                            </label>
                            <div className="mt-1">
                              <select
                                id="caseId"
                                name="caseId"
                                value={selectedInvoice.caseId || ''}
                                onChange={handleEditInputChange}
                                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm rounded-md"
                                disabled={!selectedInvoice.clientId}
                              >
                                <option value="">Select a case</option>
                                {getClientCases(selectedInvoice.clientId || '').map((caseItem) => (
                                  <option key={caseItem.id} value={caseItem.id}>
                                    {caseItem.title}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <div>
                            <label htmlFor="invoiceNumber" className="block text-sm font-medium text-gray-700">
                              Invoice Number
                            </label>
                            <div className="mt-1">
                              <input
                                type="text"
                                name="invoiceNumber"
                                id="invoiceNumber"
                                value={selectedInvoice.invoiceNumber || ''}
                                onChange={handleEditInputChange}
                                className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                                placeholder="INV-2025-001"
                                readOnly
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label htmlFor="issueDate" className="block text-sm font-medium text-gray-700">
                                Issue Date
                              </label>
                              <div className="mt-1">
                                <input
                                  type="date"
                                  name="issueDate"
                                  id="issueDate"
                                  value={selectedInvoice.issueDate || ''}
                                  onChange={handleEditInputChange}
                                  className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                                />
                              </div>
                            </div>

                            <div>
                              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
                                Due Date
                              </label>
                              <div className="mt-1">
                                <input
                                  type="date"
                                  name="dueDate"
                                  id="dueDate"
                                  value={selectedInvoice.dueDate || ''}
                                  onChange={handleEditInputChange}
                                  className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                                />
                              </div>
                            </div>
                          </div>

                          <div>
                            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                              Notes
                            </label>
                            <div className="mt-1">
                              <textarea
                                id="notes"
                                name="notes"
                                rows={3}
                                value={selectedInvoice.notes || ''}
                                onChange={handleEditInputChange}
                                className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                                placeholder="Enter any additional notes for the invoice"
                              />
                            </div>
                          </div>

                          <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700">
                              Invoice Items
                            </label>
                            <div className="mt-2">
                              {selectedInvoice.items && selectedInvoice.items.map((item, index) => (
                                <div key={index} className="bg-gray-50 p-4 rounded-lg mb-4">
                                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                                    <div>
                                      <label htmlFor={`description-${index}`} className="block text-sm font-medium text-gray-700">
                                        Description
                                      </label>
                                      <div className="mt-1">
                                        <input
                                          type="text"
                                          name={`description-${index}`}
                                          id={`description-${index}`}
                                          value={item.description}
                                          onChange={(e) => handleEditItemChange(index, 'description', e.target.value)}
                                          className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                                          placeholder="Item description"
                                          readOnly
                                        />
                                      </div>
                                    </div>

                                    <div>
                                      <label htmlFor={`hours-${index}`} className="block text-sm font-medium text-gray-700">
                                        Hours
                                      </label>
                                      <div className="mt-1">
                                        <input
                                          type="number"
                                          name={`hours-${index}`}
                                          id={`hours-${index}`}
                                          value={item.hours}
                                          onChange={(e) => handleEditItemChange(index, 'hours', e.target.value)}
                                          className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                                          placeholder="0"
                                          readOnly
                                        />
                                      </div>
                                    </div>

                                    <div>
                                      <label htmlFor={`rate-${index}`} className="block text-sm font-medium text-gray-700">
                                        Rate (ZAR)
                                      </label>
                                      <div className="mt-1">
                                        <input
                                          type="number"
                                          name={`rate-${index}`}
                                          id={`rate-${index}`}
                                          value={item.rate}
                                          onChange={(e) => handleEditItemChange(index, 'rate', e.target.value)}
                                          className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                                          placeholder="0"
                                          readOnly
                                        />
                                      </div>
                                    </div>

                                    <div>
                                      <label htmlFor={`amount-${index}`} className="block text-sm font-medium text-gray-700">
                                        Amount (ZAR)
                                      </label>
                                      <div className="mt-1">
                                        <input
                                          type="number"
                                          name={`amount-${index}`}
                                          id={`amount-${index}`}
                                          value={item.amount}
                                          onChange={(e) => handleEditItemChange(index, 'amount', e.target.value)}
                                          className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                                          placeholder="0"
                                          readOnly
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end mt-6">
                        <button
                          onClick={() => setIsEditingInvoice(false)}
                          className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-gray-300 border border-transparent rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 mr-3"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleUpdateInvoice}
                          className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-[#800000] border border-transparent rounded-md hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                        >
                          <HiOutlineCheck className="-ml-1 mr-2 h-5 w-5" />
                          Update Invoice
                        </button>
                      </div>
                    </>
                  )}
                </div>
                </div>
                
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* View Invoice Drawer */}
      <Transition.Root show={isViewingInvoice} as={Fragment}>
        <Dialog
          as="div"
          className="fixed z-10 inset-0 overflow-y-auto"
          onClose={setIsViewingInvoice}
        >
          <div className="flex items-center justify-center min-h-screen px-4 py-12">
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
              <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all max-w-lg w-full">
                <div className="p-6">
                  <Dialog.Title className="text-lg font-medium text-gray-900">
                    Invoice Details
                  </Dialog.Title>
                  {selectedInvoice && (
                    <>
                      <div className="mt-4">
                        <div className="grid grid-cols-1 gap-y-4">
                          <div>
                            <label htmlFor="clientName" className="block text-sm font-medium text-gray-700">
                              Client
                            </label>
                            <div className="mt-1">
                              <input
                                type="text"
                                name="clientName"
                                id="clientName"
                                value={selectedInvoice.clientName || ''}
                                onChange={handleEditInputChange}
                                className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                                placeholder="Client name"
                                readOnly
                              />
                            </div>
                          </div>

                          <div>
                            <label htmlFor="caseTitle" className="block text-sm font-medium text-gray-700">
                              Case
                            </label>
                            <div className="mt-1">
                              <input
                                type="text"
                                name="caseTitle"
                                id="caseTitle"
                                value={selectedInvoice.caseTitle || ''}
                                onChange={handleEditInputChange}
                                className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                                placeholder="Case title"
                                readOnly
                              />
                            </div>
                          </div>

                          <div>
                            <label htmlFor="invoiceNumber" className="block text-sm font-medium text-gray-700">
                              Invoice Number
                            </label>
                            <div className="mt-1">
                              <input
                                type="text"
                                name="invoiceNumber"
                                id="invoiceNumber"
                                value={selectedInvoice.invoiceNumber || ''}
                                onChange={handleEditInputChange}
                                className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                                placeholder="INV-2025-001"
                                readOnly
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label htmlFor="issueDate" className="block text-sm font-medium text-gray-700">
                                Issue Date
                              </label>
                              <div className="mt-1">
                                <input
                                  type="date"
                                  name="issueDate"
                                  id="issueDate"
                                  value={selectedInvoice.issueDate || ''}
                                  onChange={handleEditInputChange}
                                  className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                                  readOnly
                                />
                              </div>
                            </div>

                            <div>
                              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
                                Due Date
                              </label>
                              <div className="mt-1">
                                <input
                                  type="date"
                                  name="dueDate"
                                  id="dueDate"
                                  value={selectedInvoice.dueDate || ''}
                                  onChange={handleEditInputChange}
                                  className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                                  readOnly
                                />
                              </div>
                            </div>
                          </div>

                          <div>
                            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                              Notes
                            </label>
                            <div className="mt-1">
                              <textarea
                                id="notes"
                                name="notes"
                                rows={3}
                                value={selectedInvoice.notes || ''}
                                onChange={handleEditInputChange}
                                className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                                placeholder="Enter any additional notes for the invoice"
                                readOnly
                              />
                            </div>
                          </div>

                          <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700">
                              Invoice Items
                            </label>
                            <div className="mt-2">
                              {selectedInvoice.items && selectedInvoice.items.map((item, index) => (
                                <div key={index} className="bg-gray-50 p-4 rounded-lg mb-4">
                                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                                    <div>
                                      <label htmlFor={`description-${index}`} className="block text-sm font-medium text-gray-700">
                                        Description
                                      </label>
                                      <div className="mt-1">
                                        <input
                                          type="text"
                                          name={`description-${index}`}
                                          id={`description-${index}`}
                                          value={item.description}
                                          onChange={(e) => handleEditItemChange(index, 'description', e.target.value)}
                                          className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                                          placeholder="Item description"
                                          readOnly
                                        />
                                      </div>
                                    </div>

                                    <div>
                                      <label htmlFor={`hours-${index}`} className="block text-sm font-medium text-gray-700">
                                        Hours
                                      </label>
                                      <div className="mt-1">
                                        <input
                                          type="number"
                                          name={`hours-${index}`}
                                          id={`hours-${index}`}
                                          value={item.hours}
                                          onChange={(e) => handleEditItemChange(index, 'hours', e.target.value)}
                                          className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                                          placeholder="0"
                                          readOnly
                                        />
                                      </div>
                                    </div>

                                    <div>
                                      <label htmlFor={`rate-${index}`} className="block text-sm font-medium text-gray-700">
                                        Rate (ZAR)
                                      </label>
                                      <div className="mt-1">
                                        <input
                                          type="number"
                                          name={`rate-${index}`}
                                          id={`rate-${index}`}
                                          value={item.rate}
                                          onChange={(e) => handleEditItemChange(index, 'rate', e.target.value)}
                                          className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                                          placeholder="0"
                                          readOnly
                                        />
                                      </div>
                                    </div>

                                    <div>
                                      <label htmlFor={`amount-${index}`} className="block text-sm font-medium text-gray-700">
                                        Amount (ZAR)
                                      </label>
                                      <div className="mt-1">
                                        <input
                                          type="number"
                                          name={`amount-${index}`}
                                          id={`amount-${index}`}
                                          value={item.amount}
                                          onChange={(e) => handleEditItemChange(index, 'amount', e.target.value)}
                                          className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                                          placeholder="0"
                                          readOnly
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end mt-6">
                        <button
                          onClick={() => setIsViewingInvoice(false)}
                          className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-gray-300 border border-transparent rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 mr-3"
                        >
                          Close
                        </button>
                      </div>
                    </>
                  )}
                </div>
                </div>
            </Transition.Child>
            </div>
        </Dialog>
      </Transition.Root>
    </div>
  )
}

export default AdminBillingPage
