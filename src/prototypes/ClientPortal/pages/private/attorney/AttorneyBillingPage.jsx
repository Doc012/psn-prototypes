import React, { useState, useEffect, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import {
  HiOutlineCash,
  HiOutlineClipboardCheck,
  HiOutlineDocumentText,
  HiOutlinePlus,
  HiOutlineSearch,
  HiOutlineFilter,
  HiOutlineRefresh,
  HiOutlineExclamation,
  HiOutlineDownload,
  HiOutlinePencilAlt,
  HiOutlineTrash,
  HiOutlineX,
  HiOutlineCheck,
  HiOutlineCreditCard,
  HiOutlineDocumentAdd,
  HiOutlineChartBar,
  HiOutlineMailOpen,
  HiOutlineUser,
  HiOutlineClock,
  HiOutlineArrowUp,
  HiOutlineArrowDown,
  HiOutlineCalendar,
  HiOutlineInformationCircle,
  HiOutlineSave,
  HiOutlineEye,
  HiOutlinePrinter,
} from 'react-icons/hi';
import { format, parseISO, startOfMonth, endOfMonth, addMonths, subMonths, addDays, subDays } from 'date-fns';

const AttorneyBillingPage = () => {
  // Add toast notification state
  const [toast, setToast] = useState(null);

  // State
  const [activeTab, setActiveTab] = useState('invoices');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [payments, setPayments] = useState([]);
  const [statements, setStatements] = useState([]);
  const [clients, setClients] = useState([]);
  const [matters, setMatters] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClient, setFilterClient] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDateRange, setFilterDateRange] = useState('month');
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [activeReport, setActiveReport] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isCustomReportModalOpen, setIsCustomReportModalOpen] = useState(false);
  const [customReportOptions, setCustomReportOptions] = useState({
    startDate: format(new Date(), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd'),
    clientIds: [],
    reportType: 'billing',
    includeDetails: true,
    includeSummary: true,
    format: 'pdf'
  });
  
  // New invoice state
  const [newInvoice, setNewInvoice] = useState({
    clientId: '',
    matterId: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    dueDate: format(addMonths(new Date(), 1), 'yyyy-MM-dd'),
    items: [{ description: '', hours: '', rate: '', amount: '' }],
    notes: '',
    status: 'draft'
  });

  // New payment state
  const [newPayment, setNewPayment] = useState({
    clientId: '',
    invoiceId: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    amount: '',
    method: 'bank_transfer',
    reference: '',
    notes: ''
  });

  // Mock data loading - this loads the data correctly
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock clients data
        const mockClients = [
          { id: 'client1', name: 'John Smith', email: 'john.smith@example.com' },
          { id: 'client2', name: 'Jane Wilson', email: 'jane.wilson@example.com' },
          { id: 'client3', name: 'Robert Johnson', email: 'robert.johnson@example.com' },
          { id: 'client4', name: 'Maria Garcia', email: 'maria.garcia@example.com' },
          { id: 'client5', name: 'William Brown', email: 'william.brown@example.com' },
        ];
        
        // Mock matters data
        const mockMatters = [
          { id: 'matter1', clientId: 'client1', name: 'Estate Planning', number: 'EP-2025-001' },
          { id: 'matter2', clientId: 'client1', name: 'Real Estate Purchase', number: 'RE-2025-042' },
          { id: 'matter3', clientId: 'client2', name: 'Contract Dispute', number: 'CD-2025-018' },
          { id: 'matter4', clientId: 'client3', name: 'Divorce Proceedings', number: 'DP-2025-007' },
          { id: 'matter5', clientId: 'client4', name: 'Personal Injury Claim', number: 'PI-2025-023' },
          { id: 'matter6', clientId: 'client5', name: 'Business Formation', number: 'BF-2025-015' },
          { id: 'matter7', clientId: 'client2', name: 'Intellectual Property', number: 'IP-2025-031' },
          { id: 'matter8', clientId: 'client3', name: 'Property Settlement', number: 'PS-2025-012' },
          { id: 'matter9', clientId: 'client4', name: 'Insurance Claim', number: 'IC-2025-054' },
          { id: 'matter10', clientId: 'client5', name: 'Trademark Registration', number: 'TR-2025-027' },
        ];
        
        // Mock invoices data with 2025 dates
        const mockInvoices = [
          {
            id: 'inv1',
            number: 'INV-2025-001',
            clientId: 'client1',
            matterId: 'matter1',
            date: '2025-05-10',
            dueDate: '2025-06-10',
            amount: 25000,
            status: 'paid',
            items: [
              { description: 'Initial consultation', hours: 1.5, rate: 3000, amount: 4500 },
              { description: 'Document preparation', hours: 4, rate: 3000, amount: 12000 },
              { description: 'Client meeting', hours: 2, rate: 3000, amount: 6000 },
              { description: 'Filing fees', hours: null, rate: null, amount: 2500 }
            ]
          },
          {
            id: 'inv2',
            number: 'INV-2025-002',
            clientId: 'client2',
            matterId: 'matter3',
            date: '2025-05-15',
            dueDate: '2025-06-15',
            amount: 38000,
            status: 'unpaid',
            items: [
              { description: 'Review of contract documents', hours: 3.5, rate: 3000, amount: 10500 },
              { description: 'Legal research', hours: 5, rate: 2500, amount: 12500 },
              { description: 'Draft demand letter', hours: 4, rate: 3000, amount: 12000 },
              { description: 'Filing fees', hours: null, rate: null, amount: 3000 }
            ]
          },
          {
            id: 'inv3',
            number: 'INV-2025-003',
            clientId: 'client3',
            matterId: 'matter4',
            date: '2025-05-20',
            dueDate: '2025-06-20',
            amount: 42000,
            status: 'partial',
            items: [
              { description: 'Initial case assessment', hours: 2, rate: 3500, amount: 7000 },
              { description: 'Preparation of pleadings', hours: 6, rate: 3500, amount: 21000 },
              { description: 'Court appearance', hours: 3, rate: 4000, amount: 12000 },
              { description: 'Court filing fees', hours: null, rate: null, amount: 2000 }
            ],
            payments: [
              { date: '2025-05-25', amount: 15000, method: 'Bank Transfer' }
            ]
          },
          {
            id: 'inv4',
            number: 'INV-2025-004',
            clientId: 'client4',
            matterId: 'matter5',
            date: '2025-05-25',
            dueDate: '2025-06-25',
            amount: 18000,
            status: 'draft',
            items: [
              { description: 'Client interview', hours: 1.5, rate: 3000, amount: 4500 },
              { description: 'Evidence review', hours: 3, rate: 3000, amount: 9000 },
              { description: 'Draft initial claim', hours: 1.5, rate: 3000, amount: 4500 }
            ]
          },
          {
            id: 'inv5',
            number: 'INV-2025-005',
            clientId: 'client5',
            matterId: 'matter6',
            date: '2025-05-28',
            dueDate: '2025-06-28',
            amount: 35000,
            status: 'sent',
            items: [
              { description: 'Business entity consultation', hours: 2, rate: 3500, amount: 7000 },
              { description: 'Preparation of formation documents', hours: 4, rate: 3500, amount: 14000 },
              { description: 'Regulatory compliance review', hours: 3, rate: 3500, amount: 10500 },
              { description: 'Filing fees', hours: null, rate: null, amount: 3500 }
            ]
          },
          {
            id: 'inv6',
            number: 'INV-2025-006',
            clientId: 'client1',
            matterId: 'matter2',
            date: '2025-05-02',
            dueDate: '2025-06-02',
            amount: 32500,
            status: 'paid',
            items: [
              { description: 'Property title search', hours: 2.5, rate: 3000, amount: 7500 },
              { description: 'Document preparation', hours: 5, rate: 3000, amount: 15000 },
              { description: 'Contract review', hours: 3, rate: 3000, amount: 9000 },
              { description: 'Filing fees', hours: null, rate: null, amount: 1000 }
            ]
          },
          {
            id: 'inv7',
            number: 'INV-2025-007',
            clientId: 'client2',
            matterId: 'matter7',
            date: '2025-04-18',
            dueDate: '2025-05-18',
            amount: 47500,
            status: 'unpaid',
            items: [
              { description: 'Patent search', hours: 4, rate: 3500, amount: 14000 },
              { description: 'Application preparation', hours: 6, rate: 3500, amount: 21000 },
              { description: 'Client consultation', hours: 2.5, rate: 3000, amount: 7500 },
              { description: 'Filing fees', hours: null, rate: null, amount: 5000 }
            ]
          },
          {
            id: 'inv8',
            number: 'INV-2025-008',
            clientId: 'client3',
            matterId: 'matter8',
            date: '2025-04-25',
            dueDate: '2025-05-25',
            amount: 28500,
            status: 'partial',
            items: [
              { description: 'Property valuation review', hours: 2, rate: 3000, amount: 6000 },
              { description: 'Settlement agreement drafting', hours: 5.5, rate: 3500, amount: 19250 },
              { description: 'Client meeting', hours: 1, rate: 3000, amount: 3000 },
              { description: 'Administrative costs', hours: null, rate: null, amount: 250 }
            ],
            payments: [
              { date: '2025-05-10', amount: 10000, method: 'Credit Card' }
            ]
          },
          {
            id: 'inv9',
            number: 'INV-2025-009',
            clientId: 'client4',
            matterId: 'matter9',
            date: '2025-05-05',
            dueDate: '2025-06-05',
            amount: 22500,
            status: 'sent',
            items: [
              { description: 'Insurance policy review', hours: 3, rate: 3000, amount: 9000 },
              { description: 'Claim documentation', hours: 4, rate: 3000, amount: 12000 },
              { description: 'Correspondence with insurer', hours: 0.5, rate: 3000, amount: 1500 }
            ]
          },
          {
            id: 'inv10',
            number: 'INV-2025-010',
            clientId: 'client5',
            matterId: 'matter10',
            date: '2025-04-30',
            dueDate: '2025-05-30',
            amount: 29000,
            status: 'paid',
            items: [
              { description: 'Trademark search', hours: 3, rate: 3500, amount: 10500 },
              { description: 'Application preparation', hours: 4, rate: 3500, amount: 14000 },
              { description: 'Client consultation', hours: 1, rate: 3000, amount: 3000 },
              { description: 'Filing fees', hours: null, rate: null, amount: 1500 }
            ]
          }
        ];
        
        // Mock payments data
        const mockPayments = [
          {
            id: 'pay1',
            invoiceId: 'inv1',
            clientId: 'client1',
            date: '2025-06-05',
            amount: 25000,
            method: 'Bank Transfer',
            reference: 'BT-2025-062',
            notes: 'Payment received in full'
          },
          {
            id: 'pay2',
            invoiceId: 'inv3',
            clientId: 'client3',
            date: '2025-05-25',
            amount: 15000,
            method: 'Bank Transfer',
            reference: 'BT-2025-055',
            notes: 'Partial payment received'
          },
          {
            id: 'pay3',
            invoiceId: 'inv6',
            clientId: 'client1',
            date: '2025-05-28',
            amount: 32500,
            method: 'Credit Card',
            reference: 'CC-2025-058',
            notes: 'Payment received in full'
          },
          {
            id: 'pay4',
            invoiceId: 'inv8',
            clientId: 'client3',
            date: '2025-05-10',
            amount: 10000,
            method: 'Credit Card',
            reference: 'CC-2025-051',
            notes: 'Partial payment received'
          },
          {
            id: 'pay5',
            invoiceId: 'inv10',
            clientId: 'client5',
            date: '2025-05-25',
            amount: 29000,
            method: 'EFT',
            reference: 'EFT-2025-057',
            notes: 'Payment received in full'
          }
        ];
        
        // Mock statements data
        const mockStatements = [
          {
            id: 'stmt1',
            clientId: 'client1',
            number: 'ST-2025-001',
            date: '2025-05-31',
            period: 'May 2025',
            openingBalance: 32500,
            charges: 25000,
            payments: 57500,
            closingBalance: 0,
            items: [
              { date: '2025-05-02', description: 'Invoice #INV-2025-006', amount: 32500, type: 'invoice' },
              { date: '2025-05-10', description: 'Invoice #INV-2025-001', amount: 25000, type: 'invoice' },
              { date: '2025-05-28', description: 'Payment - Credit Card', amount: -32500, type: 'payment' },
              { date: '2025-06-05', description: 'Payment - Bank Transfer', amount: -25000, type: 'payment' }
            ]
          },
          {
            id: 'stmt2',
            clientId: 'client2',
            number: 'ST-2025-002',
            date: '2025-05-31',
            period: 'May 2025',
            openingBalance: 47500,
            charges: 38000,
            payments: 0,
            closingBalance: 85500,
            items: [
              { date: '2025-04-18', description: 'Invoice #INV-2025-007', amount: 47500, type: 'invoice' },
              { date: '2025-05-15', description: 'Invoice #INV-2025-002', amount: 38000, type: 'invoice' }
            ]
          },
          {
            id: 'stmt3',
            clientId: 'client3',
            number: 'ST-2025-003',
            date: '2025-05-31',
            period: 'May 2025',
            openingBalance: 28500,
            charges: 42000,
            payments: 25000,
            closingBalance: 45500,
            items: [
              { date: '2025-04-25', description: 'Invoice #INV-2025-008', amount: 28500, type: 'invoice' },
              { date: '2025-05-10', description: 'Payment - Credit Card', amount: -10000, type: 'payment' },
              { date: '2025-05-20', description: 'Invoice #INV-2025-003', amount: 42000, type: 'invoice' },
              { date: '2025-05-25', description: 'Payment - Bank Transfer', amount: -15000, type: 'payment' }
            ]
          }
        ];
        
        // Set state with mock data
        setClients(mockClients);
        setMatters(mockMatters);
        setInvoices(mockInvoices);
        setPayments(mockPayments);
        setStatements(mockStatements);
        setLoading(false);
      } catch (err) {
        setError('Failed to load billing data. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Add this at the beginning of your return statement
  useEffect(() => {
    // Set loading to false after a short delay to ensure data renders
    const timer = setTimeout(() => {
      if (invoices.length > 0) {
        setLoading(false);
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [invoices]);

  // Helper functions
  const getClientName = (clientId) => {
    const client = clients.find(c => c.id === clientId);
    return client ? client.name : 'Unknown Client';
  };
  
  const getMatterName = (matterId) => {
    const matter = matters.find(m => m.id === matterId);
    return matter ? matter.name : 'Unknown Matter';
  };
  
  const getMatterNumber = (matterId) => {
    const matter = matters.find(m => m.id === matterId);
    return matter ? matter.number : '';
  };
  
  const getInvoiceNumber = (invoiceId) => {
    const invoice = invoices.find(inv => inv.id === invoiceId);
    return invoice ? invoice.number : 'Unknown Invoice';
  };
  
  const getInvoiceAmount = (invoiceId) => {
    const invoice = invoices.find(inv => inv.id === invoiceId);
    return invoice ? invoice.amount : 0;
  };
  
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'unpaid':
        return 'bg-red-100 text-red-800';
      case 'partial':
        return 'bg-yellow-100 text-yellow-800';
      case 'sent':
        return 'bg-blue-100 text-blue-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid':
        return <HiOutlineCheck className="-ml-0.5 mr-1.5 h-4 w-4" />;
      case 'unpaid':
        return <HiOutlineClock className="-ml-0.5 mr-1.5 h-4 w-4" />;
      case 'partial':
        return <HiOutlineCreditCard className="-ml-0.5 mr-1.5 h-4 w-4" />;
      case 'sent':
        return <HiOutlineMailOpen className="-ml-0.5 mr-1.5 h-4 w-4" />;
      case 'draft':
        return <HiOutlineDocumentText className="-ml-0.5 mr-1.5 h-4 w-4" />;
      default:
        return null;
    }
  };
  
  const formatMoney = (amount) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
    }).format(amount);
  };
  
  // Filter and sort invoices
  const filteredInvoices = invoices.filter(invoice => {
    // Filter by client
    if (filterClient !== 'all' && invoice.clientId !== filterClient) {
      return false;
    }
    
    // Filter by status
    if (filterStatus !== 'all' && invoice.status !== filterStatus) {
      return false;
    }
    
    // Filter by date range
    const invoiceDate = parseISO(invoice.date);
    if (filterDateRange === 'month') {
      // Current month (May 2025 in your mock data)
      const monthStart = new Date(2025, 4, 1); // May 1, 2025
      const monthEnd = new Date(2025, 4, 31);  // May 31, 2025
      if (invoiceDate < monthStart || invoiceDate > monthEnd) {
        return false;
      }
    } else if (filterDateRange === 'lastMonth') {
      // Last month (April 2025 in your mock data)
      const lastMonthStart = new Date(2025, 3, 1); // April 1, 2025
      const lastMonthEnd = new Date(2025, 3, 30);  // April 30, 2025
      if (invoiceDate < lastMonthStart || invoiceDate > lastMonthEnd) {
        return false;
      }
    }
    
    // Filter by search term
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      return (
        invoice.number.toLowerCase().includes(lowerSearchTerm) ||
        getClientName(invoice.clientId).toLowerCase().includes(lowerSearchTerm) ||
        getMatterName(invoice.matterId).toLowerCase().includes(lowerSearchTerm)
      );
    }
    
    return true;
  }).sort((a, b) => {
    if (sortField === 'date') {
      return sortDirection === 'asc'
        ? new Date(a.date) - new Date(b.date)
        : new Date(b.date) - new Date(a.date);
    } else if (sortField === 'client') {
      const clientA = getClientName(a.clientId);
      const clientB = getClientName(b.clientId);
      return sortDirection === 'asc'
        ? clientA.localeCompare(clientB)
        : clientB.localeCompare(clientA);
    } else if (sortField === 'amount') {
      return sortDirection === 'asc'
        ? a.amount - b.amount
        : b.amount - a.amount;
    } else if (sortField === 'status') {
      return sortDirection === 'asc'
        ? a.status.localeCompare(b.status)
        : b.status.localeCompare(a.status);
    }
    return 0;
  });
  
  // Calculate totals
  const totalAmount = filteredInvoices.reduce((sum, invoice) => sum + invoice.amount, 0);
  const totalPaid = filteredInvoices.filter(inv => inv.status === 'paid').reduce((sum, invoice) => sum + invoice.amount, 0);
  const totalUnpaid = filteredInvoices.filter(inv => inv.status === 'unpaid' || inv.status === 'partial').reduce((sum, invoice) => sum + invoice.amount, 0);
  
  // Handler functions
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  const handleFilterChange = (filterType, value) => {
    switch (filterType) {
      case 'client':
        setFilterClient(value);
        break;
      case 'status':
        setFilterStatus(value);
        break;
      case 'dateRange':
        setFilterDateRange(value);
        break;
      default:
        break;
    }
  };
  
  const resetFilters = () => {
    setFilterClient('all');
    setFilterStatus('all');
    setFilterDateRange('month');
    setSearchTerm('');
    setIsFilterOpen(false);
  };
  
  const handleNewInvoiceChange = (e) => {
    const { name, value } = e.target;
    setNewInvoice(prev => ({ ...prev, [name]: value }));
  };
  
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...newInvoice.items];
    updatedItems[index][field] = value;
    
    // Calculate amount if hours and rate are present
    if (field === 'hours' || field === 'rate') {
      const hours = parseFloat(updatedItems[index].hours) || 0;
      const rate = parseFloat(updatedItems[index].rate) || 0;
      if (hours && rate) {
        updatedItems[index].amount = (hours * rate).toFixed(2);
      }
    }
    
    setNewInvoice(prev => ({ ...prev, items: updatedItems }));
  };
  
  const addInvoiceItem = () => {
    setNewInvoice(prev => ({
      ...prev,
      items: [...prev.items, { description: '', hours: '', rate: '', amount: '' }]
    }));
  };
  
  const removeInvoiceItem = (index) => {
    const updatedItems = [...newInvoice.items];
    updatedItems.splice(index, 1);
    setNewInvoice(prev => ({ ...prev, items: updatedItems }));
  };
  
  const handleSubmitNewInvoice = (e) => {
    e.preventDefault();
    
    // Generate a unique ID and invoice number
    const newId = `inv${invoices.length + 1}`;
    const newNumber = `INV-2025-${String(invoices.length + 1).padStart(3, '0')}`;
    
    // Calculate total amount
    const totalAmount = newInvoice.items.reduce((sum, item) => {
      return sum + (parseFloat(item.amount) || 0);
    }, 0);
    
    // Create new invoice object
    const invoiceToAdd = {
      id: newId,
      number: newNumber,
      clientId: newInvoice.clientId,
      matterId: newInvoice.matterId,
      date: newInvoice.date,
      dueDate: newInvoice.dueDate,
      amount: totalAmount,
      status: newInvoice.status,
      items: newInvoice.items.map(item => ({
        description: item.description,
        hours: item.hours ? parseFloat(item.hours) : null,
        rate: item.rate ? parseFloat(item.rate) : null,
        amount: parseFloat(item.amount) || 0
      })),
      notes: newInvoice.notes
    };
    
    // Add to invoices state
    setInvoices([...invoices, invoiceToAdd]);
    
    // Reset form and close modal
    setNewInvoice({
      clientId: '',
      matterId: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      dueDate: format(addMonths(new Date(), 1), 'yyyy-MM-dd'),
      items: [{ description: '', hours: '', rate: '', amount: '' }],
      notes: '',
      status: 'draft'
    });
    setIsInvoiceModalOpen(false);
  };
  
  const handleDeleteInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setIsDeleteModalOpen(true);
  };
  
  const confirmDeleteInvoice = () => {
    if (selectedInvoice) {
      setInvoices(invoices.filter(inv => inv.id !== selectedInvoice.id));
      setIsDeleteModalOpen(false);
      setSelectedInvoice(null);
    }
  };
  
  // Payment handling
  const handleNewPaymentChange = (e) => {
    const { name, value } = e.target;
    setNewPayment(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmitNewPayment = (e) => {
    e.preventDefault();
    
    // Generate a unique ID
    const newId = `pay${payments.length + 1}`;
    
    // Create new payment object
    const paymentToAdd = {
      id: newId,
      invoiceId: newPayment.invoiceId,
      clientId: newPayment.clientId,
      date: newPayment.date,
      amount: parseFloat(newPayment.amount),
      method: newPayment.method,
      reference: newPayment.reference,
      notes: newPayment.notes
    };
    
    // Add to payments state
    setPayments([...payments, paymentToAdd]);
    
    // Update invoice status if applicable
    const invoice = invoices.find(inv => inv.id === newPayment.invoiceId);
    if (invoice) {
      const updatedInvoices = [...invoices];
      const index = updatedInvoices.findIndex(inv => inv.id === newPayment.invoiceId);
      
      if (parseFloat(newPayment.amount) >= invoice.amount) {
        updatedInvoices[index] = { ...invoice, status: 'paid' };
      } else {
        updatedInvoices[index] = { ...invoice, status: 'partial' };
      }
      
      setInvoices(updatedInvoices);
    }
    
    // Reset form and close modal
    setNewPayment({
      clientId: '',
      invoiceId: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      amount: '',
      method: 'bank_transfer',
      reference: '',
      notes: ''
    });
    setIsPaymentModalOpen(false);
  };

  // Generate report data for different report types
  const generateReport = (reportType) => {
    setActiveReport(reportType);
    
    // Generate mock report data based on the type
    if (reportType === 'aging') {
      setReportData({
        title: 'Client A/R Aging Report',
        date: format(new Date(), 'MMMM d, yyyy'),
        summary: {
          total: 157350,
          current: 45250,
          days30: 42300,
          days60: 35800,
          days90: 21500,
          days90plus: 12500
        },
        clients: [
          {
            id: 'c1',
            name: 'Nkosi Family Trust',
            total: 42500,
            collected: 28000,
            outstanding: 14500,
            current: 8500,
            days30: 6000,
            days60: 0,
            days90: 0,
            days90plus: 0
          },
          {
            id: 'c2',
            name: 'Patel & Associates',
            total: 56750,
            collected: 31250,
            outstanding: 25500,
            current: 10000,
            days30: 8500,
            days60: 7000,
            days90: 0,
            days90plus: 0
          },
          {
            id: 'c3',
            name: 'Stellenbosch Winery Ltd',
            total: 68300,
            collected: 32000,
            outstanding: 36300,
            current: 12500,
            days30: 9800,
            days60: 8500,
            days90: 5500,
            days90plus: 0
          },
          {
            id: 'c4',
            name: 'Johannesburg Metro Council',
            total: 83700,
            collected: 38150,
            outstanding: 45550,
            current: 10250,
            days30: 11000,
            days60: 9300,
            days90: 8500,
            days90plus: 6500
          },
          {
            id: 'c5',
            name: 'Cape Tech Ventures',
            total: 67500,
            collected: 32000,
            outstanding: 35500,
            current: 4000,
            days30: 7000,
            days60: 11000,
            days90: 7500,
            days90plus: 6000
          }
        ]
      });
    } else if (reportType === 'revenue') {
      setReportData({
        title: 'Revenue Summary Report',
        date: format(new Date(), 'MMMM d, yyyy'),
        summary: {
          totalBilled: 318750,
          totalPaid: 161400,
          totalOutstanding: 157350,
          averageInvoice: 13898
        },
        monthly: [
          { month: 'January 2025', billed: 42500, collected: 28000, outstanding: 14500 },
          { month: 'February 2025', billed: 56750, collected: 31250, outstanding: 25500 },
          { month: 'March 2025', billed: 68300, collected: 32000, outstanding: 36300 },
          { month: 'April 2025', billed: 83700, collected: 38150, outstanding: 45550 },
          { month: 'May 2025', billed: 67500, collected: 32000, outstanding: 35500 }
        ],
        topClients: [
          { id: 'c4', name: 'Johannesburg Metro Council', billed: 83700, collected: 38150, outstanding: 45550 },
          { id: 'c3', name: 'Stellenbosch Winery Ltd', billed: 68300, collected: 32000, outstanding: 36300 },
          { id: 'c5', name: 'Cape Tech Ventures', billed: 67500, collected: 32000, outstanding: 35500 },
          { id: 'c2', name: 'Patel & Associates', billed: 56750, collected: 31250, outstanding: 25500 },
          { id: 'c1', name: 'Nkosi Family Trust', billed: 42500, collected: 28000, outstanding: 14500 }
        ]
      });
    }
  };

  // Function to generate Time Utilization report
  const generateTimeUtilizationReport = () => {
    // Open the time tracking report in a new window/tab
    const win = window.open('/attorney/time-tracking?tab=reports', '_blank');
    win.focus();
    
    // Or alternatively, show a toast that redirects the user
    showToast("Opening Time Utilization Report in Time Tracking section", "success");
    setTimeout(() => {
      window.location.href = '/attorney/time-tracking?tab=reports';
    }, 2000);
  };

  // Function to generate Payment Analytics report
  const generatePaymentAnalyticsReport = () => {
    // This is a placeholder for the payment analytics report
    // In a real implementation, this would generate a report
    setActiveReport('payments');
    
    // Generate mock payment analytics data
    setReportData({
      title: 'Payment Analytics Report',
      date: format(new Date(), 'MMMM d, yyyy'),
      summary: {
        totalCollected: 161400,
        averagePaymentAmount: 8968,
        averagePaymentTime: 32, // days
        onTimePaymentRate: 68 // percentage
      },
      paymentMethods: [
        { method: 'EFT', count: 8, amount: 87600, percentage: 54.3 },
        { method: 'Credit Card', count: 6, amount: 42300, percentage: 26.2 },
        { method: 'Cash', count: 2, amount: 5500, percentage: 3.4 },
        { method: 'Check', count: 4, amount: 26000, percentage: 16.1 }
      ],
      clientPerformance: [
        { id: 'c1', name: 'Nkosi Family Trust', invoiced: 42500, paid: 28000, rate: 65.9, avgDays: 18 },
        { id: 'c2', name: 'Patel & Associates', invoiced: 56750, paid: 31250, rate: 55.1, avgDays: 22 },
        { id: 'c3', name: 'Stellenbosch Winery Ltd', invoiced: 68300, paid: 32000, rate: 46.9, avgDays: 36 },
        { id: 'c4', name: 'Johannesburg Metro Council', invoiced: 83700, paid: 38150, rate: 45.6, avgDays: 48 },
        { id: 'c5', name: 'Cape Tech Ventures', invoiced: 67500, paid: 32000, rate: 47.4, avgDays: 30 }
      ],
      monthlyTrends: [
        { month: 'January', amount: 28000, count: 3 },
        { month: 'February', amount: 31250, count: 4 },
        { month: 'March', amount: 32000, count: 3 },
        { month: 'April', amount: 38150, count: 5 },
        { month: 'May', amount: 32000, count: 3 }
      ]
    });
    
    showToast("Payment Analytics Report generated successfully", "success");
  };
  
  // Function to open the custom report builder
  const openCustomReportBuilder = () => {
    // Set up state for custom report builder
    setIsCustomReportModalOpen(true);
    setCustomReportOptions({
      startDate: format(new Date(), 'yyyy-MM-dd'),
      endDate: format(new Date(), 'yyyy-MM-dd'),
      clientIds: [],
      reportType: 'billing',
      includeDetails: true,
      includeSummary: true,
      format: 'pdf'
    });
    
    showToast("Custom Report Builder is now available!", "success");
  };
  
  // Needed to handle the custom report closing
  const closeCustomReportBuilder = () => {
    setIsCustomReportModalOpen(false);
  };
  
  // Function to generate a custom report
  const generateCustomReport = (e) => {
    e.preventDefault();
    
    // Here you would normally process the custom report options
    // and generate the appropriate report
    
    setIsCustomReportModalOpen(false);
    showToast("Custom report generated and sent to your email", "success");
  };
  
  // Clear active report and data
  const closeReport = () => {
    setActiveReport(null);
    setReportData(null);
  };

  // Add this function to show toast notifications
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    
    // Automatically dismiss toast after 3 seconds
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Toast notification */}
        {toast && (
          <div className={`fixed top-4 right-4 z-50 p-4 rounded-md shadow-lg ${
            toast.type === 'success' ? 'bg-green-50 border border-green-100' : 'bg-red-50 border border-red-100'
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
        
        <div className="md:flex md:items-center md:justify-between mb-6">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-semibold text-gray-900 flex items-center">
              <HiOutlineCash className="h-6 w-6 text-[#800000] mr-2" />
              Billing
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage invoices and track client payments
            </p>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <button
              type="button"
              onClick={() => {
                // Show toast notification instead of opening modal
                showToast("New invoice feature coming soon!", "success");
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#800000] hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
            >
              <HiOutlinePlus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              New Invoice
            </button>
          </div>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <HiOutlineExclamation className="h-5 w-5 text-red-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">{error}</h3>
              </div>
            </div>
          </div>
        )}

        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              className={`${
                activeTab === 'invoices'
                  ? 'border-[#800000] text-[#800000]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              onClick={() => {
                setActiveTab('invoices');
                closeReport();
              }}
            >
              <HiOutlineDocumentText className="h-5 w-5 inline-block mr-2 -mt-1" />
              Invoices
            </button>
            <button
              className={`${
                activeTab === 'payments'
                  ? 'border-[#800000] text-[#800000]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              onClick={() => {
                setActiveTab('payments');
                closeReport();
              }}
            >
              <HiOutlineCreditCard className="h-5 w-5 inline-block mr-2 -mt-1" />
              Payments
            </button>
            <button
              className={`${
                activeTab === 'statements'
                  ? 'border-[#800000] text-[#800000]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              onClick={() => {
                setActiveTab('statements');
                closeReport();
              }}
            >
              <HiOutlineClipboardCheck className="h-5 w-5 inline-block mr-2 -mt-1" />
              Statements
            </button>
            <button
              className={`${
                activeTab === 'reports'
                  ? 'border-[#800000] text-[#800000]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              onClick={() => {
                setActiveTab('reports');
                closeReport();
              }}
            >
              <HiOutlineChartBar className="h-5 w-5 inline-block mr-2 -mt-1" />
              Reports
            </button>
          </nav>
        </div>

        {activeTab === 'invoices' && (
          <>
            <div className="bg-white shadow-sm rounded-lg p-4 mb-6">
              <div className="md:flex md:items-center md:justify-between">
                <div className="relative rounded-md shadow-sm md:w-96">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <HiOutlineSearch className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <input
                    type="text"
                    name="search"
                    id="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="focus:ring-[#800000] focus:border-[#800000] block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                    placeholder="Search invoices..."
                  />
                </div>
                <div className="mt-4 md:mt-0 flex items-center space-x-2">
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsFilterOpen(!isFilterOpen)}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                    >
                      <HiOutlineFilter className="-ml-1 mr-2 h-5 w-5 text-gray-400" aria-hidden="true" />
                      Filters
                      {(filterClient !== 'all' || filterStatus !== 'all' || filterDateRange !== 'month') && (
                        <span className="ml-1 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#800000] text-white">
                          {[
                            filterClient !== 'all' ? 1 : 0,
                            filterStatus !== 'all' ? 1 : 0,
                            filterDateRange !== 'month' ? 1 : 0
                          ].reduce((a, b) => a + b, 0)}
                        </span>
                      )}
                    </button>
                    {isFilterOpen && (
                      <div className="origin-top-right absolute right-0 mt-2 w-72 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                        <div className="py-1 border-b border-gray-200">
                          <div className="px-4 py-2 text-sm font-medium text-gray-700 flex justify-between items-center">
                            <span>Filters</span>
                            <button
                              type="button"
                              onClick={resetFilters}
                              className="text-sm text-[#800000] hover:text-[#600000]"
                            >
                              Reset all
                            </button>
                          </div>
                        </div>
                        <div className="py-2 px-4">
                          <div className="mb-4">
                            <label htmlFor="client-filter" className="block text-sm font-medium text-gray-700">
                              Client
                            </label>
                            <select
                              id="client-filter"
                              name="client-filter"
                              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm rounded-md"
                              value={filterClient}
                              onChange={(e) => handleFilterChange('client', e.target.value)}
                            >
                              <option value="all">All Clients</option>
                              {clients.map((client) => (
                                <option key={client.id} value={client.id}>
                                  {client.name}
                                </option>
                              ))}
                            </select>
                          </div>
                          
                          <div className="mb-4">
                            <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700">
                              Status
                            </label>
                            <select
                              id="status-filter"
                              name="status-filter"
                              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm rounded-md"
                              value={filterStatus}
                              onChange={(e) => handleFilterChange('status', e.target.value)}
                            >
                              <option value="all">All Statuses</option>
                              <option value="draft">Draft</option>
                              <option value="sent">Sent</option>
                              <option value="partial">Partially Paid</option>
                              <option value="paid">Paid</option>
                              <option value="unpaid">Unpaid</option>
                            </select>
                          </div>
                          
                          <div className="mb-4">
                            <label htmlFor="date-range-filter" className="block text-sm font-medium text-gray-700">
                              Date Range
                            </label>
                            <select
                              id="date-range-filter"
                              name="date-range-filter"
                              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm rounded-md"
                              value={filterDateRange}
                              onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                            >
                              <option value="month">This Month</option>
                              <option value="lastMonth">Last Month</option>
                              <option value="all">All Time</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={() => resetFilters()}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                    >
                      <HiOutlineRefresh className="-ml-1 mr-2 h-5 w-5 text-gray-400" aria-hidden="true" />
                      Reset
                    </button>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {filterClient !== 'all' && (
                  <div className="inline-flex rounded-full items-center py-1 pl-3 pr-1 text-sm font-medium bg-gray-100 text-gray-800">
                    Client: {getClientName(filterClient)}
                    <button
                      type="button"
                      onClick={() => setFilterClient('all')}
                      className="flex-shrink-0 ml-1 h-5 w-5 rounded-full inline-flex items-center justify-center text-gray-400 hover:bg-gray-200 hover:text-gray-500 focus:outline-none"
                    >
                      <span className="sr-only">Remove filter</span>
                      <HiOutlineX className="h-3 w-3" aria-hidden="true" />
                    </button>
                  </div>
                )}
                {filterStatus !== 'all' && (
                  <div className="inline-flex rounded-full items-center py-1 pl-3 pr-1 text-sm font-medium bg-gray-100 text-gray-800">
                    Status: {filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)}
                    <button
                      type="button"
                      onClick={() => setFilterStatus('all')}
                      className="flex-shrink-0 ml-1 h-5 w-5 rounded-full inline-flex items-center justify-center text-gray-400 hover:bg-gray-200 hover:text-gray-500 focus:outline-none"
                    >
                      <span className="sr-only">Remove filter</span>
                      <HiOutlineX className="h-3 w-3" aria-hidden="true" />
                    </button>
                  </div>
                )}
                {filterDateRange !== 'month' && (
                  <div className="inline-flex rounded-full items-center py-1 pl-3 pr-1 text-sm font-medium bg-gray-100 text-gray-800">
                    Date: {filterDateRange === 'lastMonth' ? 'Last Month' : 'All Time'}
                    <button
                      type="button"
                      onClick={() => setFilterDateRange('month')}
                      className="flex-shrink-0 ml-1 h-5 w-5 rounded-full inline-flex items-center justify-center text-gray-400 hover:bg-gray-200 hover:text-gray-500 focus:outline-none"
                    >
                      <span className="sr-only">Remove filter</span>
                      <HiOutlineX className="h-3 w-3" aria-hidden="true" />
                    </button>
                  </div>
                )}
                {searchTerm && (
                  <div className="inline-flex rounded-full items-center py-1 pl-3 pr-1 text-sm font-medium bg-gray-100 text-gray-800">
                    Search: {searchTerm}
                    <button
                      type="button"
                      onClick={() => setSearchTerm('')}
                      className="flex-shrink-0 ml-1 h-5 w-5 rounded-full inline-flex items-center justify-center text-gray-400 hover:bg-gray-200 hover:text-gray-500 focus:outline-none"
                    >
                      <span className="sr-only">Remove filter</span>
                      <HiOutlineX className="h-3 w-3" aria-hidden="true" />
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white shadow-sm rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-500">Total Billed</h3>
                <p className="mt-2 text-2xl font-semibold text-gray-900">{formatMoney(totalAmount)}</p>
                <div className="mt-1 text-xs text-gray-500">
                  {filteredInvoices.length} invoice{filteredInvoices.length !== 1 ? 's' : ''}
                </div>
              </div>
              
              <div className="bg-white shadow-sm rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-500">Total Paid</h3>
                <p className="mt-2 text-2xl font-semibold text-green-600">{formatMoney(totalPaid)}</p>
                <div className="mt-1 text-xs text-gray-500">
                  {filteredInvoices.filter(inv => inv.status === 'paid').length} paid invoice{filteredInvoices.filter(inv => inv.status === 'paid').length !== 1 ? 's' : ''}
                </div>
              </div>
              
              <div className="bg-white shadow-sm rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-500">Outstanding</h3>
                <p className="mt-2 text-2xl font-semibold text-red-600">{formatMoney(totalUnpaid)}</p>
                <div className="mt-1 text-xs text-gray-500">
                  {filteredInvoices.filter(inv => inv.status === 'unpaid' || inv.status === 'partial').length} unpaid invoice{filteredInvoices.filter(inv => inv.status === 'unpaid' || inv.status === 'partial').length !== 1 ? 's' : ''}
                </div>
              </div>
            </div>
            
            {loading ? (
              <div className="bg-white shadow rounded-lg p-8 flex justify-center">
                <div className="animate-pulse flex flex-col items-center">
                  <div className="rounded-full bg-gray-200 h-12 w-12 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-48 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-64"></div>
                  <div className="mt-4 text-sm text-gray-500">Loading invoices...</div>
                </div>
              </div>
            ) : (
              <div className="bg-white shadow-sm overflow-hidden rounded-lg">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                          onClick={() => handleSort('date')}
                        >
                          <div className="flex items-center">
                            <span>Invoice Number</span>
                            {sortField === 'date' && (
                              <span className="ml-2">
                                {sortDirection === 'asc' ? (
                                  <HiOutlineArrowUp className="h-4 w-4" />
                                ) : (
                                  <HiOutlineArrowDown className="h-4 w-4" />
                                )}
                              </span>
                            )}
                          </div>
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                          onClick={() => handleSort('client')}
                        >
                          <div className="flex items-center">
                            <span>Client</span>
                            {sortField === 'client' && (
                              <span className="ml-2">
                                {sortDirection === 'asc' ? (
                                  <HiOutlineArrowUp className="h-4 w-4" />
                                ) : (
                                  <HiOutlineArrowDown className="h-4 w-4" />
                                )}
                              </span>
                            )}
                          </div>
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Matter
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Due Date
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                          onClick={() => handleSort('amount')}
                        >
                          <div className="flex items-center">
                            <span>Amount</span>
                            {sortField === 'amount' && (
                              <span className="ml-2">
                                {sortDirection === 'asc' ? (
                                  <HiOutlineArrowUp className="h-4 w-4" />
                                ) : (
                                  <HiOutlineArrowDown className="h-4 w-4" />
                                )}
                              </span>
                            )}
                          </div>
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                          onClick={() => handleSort('status')}
                        >
                          <div className="flex items-center">
                            <span>Status</span>
                            {sortField === 'status' && (
                              <span className="ml-2">
                                {sortDirection === 'asc' ? (
                                  <HiOutlineArrowUp className="h-4 w-4" />
                                ) : (
                                  <HiOutlineArrowDown className="h-4 w-4" />
                                )}
                              </span>
                            )}
                          </div>
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredInvoices.length === 0 ? (
                        <tr>
                          <td colSpan="8" className="px-6 py-10 text-center text-gray-500">
                            <div className="flex flex-col items-center">
                              <HiOutlineDocumentText className="h-10 w-10 text-gray-300" />
                              <p className="mt-2 text-sm font-medium">No invoices found</p>
                              <p className="mt-1 text-sm">Try adjusting your search or filters</p>
                              <button
                                type="button"
                                onClick={resetFilters}
                                className="mt-4 inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                              >
                                <HiOutlineRefresh className="-ml-1 mr-1 h-4 w-4" aria-hidden="true" />
                                Reset filters
                              </button>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        filteredInvoices.map((invoice) => (
                          <tr key={invoice.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {invoice.number}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {getClientName(invoice.clientId)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {getMatterName(invoice.matterId)}
                              <div className="text-xs text-gray-400">{getMatterNumber(invoice.matterId)}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {format(parseISO(invoice.date), 'MMM d, yyyy')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {format(parseISO(invoice.dueDate), 'MMM d, yyyy')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {formatMoney(invoice.amount)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(invoice.status)}`}>
                                {getStatusIcon(invoice.status)}
                                {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex justify-end space-x-2">
                                <button
                                  className="text-[#800000] hover:text-[#600000]"
                                  title="View Invoice"
                                  onClick={() => showToast("View invoice feature coming soon!", "success")}
                                >
                                  <HiOutlineEye className="h-5 w-5" />
                                </button>
                                <button
                                  className="text-gray-400 hover:text-gray-500"
                                  title="Edit Invoice"
                                  onClick={() => showToast("Edit invoice feature coming soon!", "success")}
                                >
                                  <HiOutlinePencilAlt className="h-5 w-5" />
                                </button>
                                <button
                                  className="text-gray-400 hover:text-gray-500"
                                  title="Download PDF"
                                  onClick={() => showToast("Download PDF feature coming soon!", "success")}
                                >
                                  <HiOutlineDownload className="h-5 w-5" />
                                </button>
                                <button
                                  className="text-gray-400 hover:text-red-500"
                                  title="Delete Invoice"
                                  onClick={() => showToast("Delete invoice feature coming soon!", "info")}
                                >
                                  <HiOutlineTrash className="h-5 w-5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'payments' && (
          <>
            <div className="bg-white shadow-sm rounded-lg p-4 mb-6">
              <div className="md:flex md:items-center md:justify-between">
                <div className="relative rounded-md shadow-sm md:w-96">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <HiOutlineSearch className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <input
                    type="text"
                    name="search-payments"
                    id="search-payments"
                    className="focus:ring-[#800000] focus:border-[#800000] block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                    placeholder="Search payments..."
                  />
                </div>
                <div className="mt-4 md:mt-0">
                  <button
                    type="button"
                    onClick={() => setIsPaymentModalOpen(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#800000] hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                  >
                    <HiOutlinePlus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                    Record Payment
                  </button>
                </div>
              </div>
            </div>
            
            <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white shadow-sm rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-500">Total Received</h3>
                <p className="mt-2 text-2xl font-semibold text-gray-900">
                  {formatMoney(payments.reduce((sum, payment) => sum + payment.amount, 0))}
                </p>
                <div className="mt-1 text-xs text-gray-500">
                  {payments.length} payment{payments.length !== 1 ? 's' : ''}
                </div>
              </div>
              
              <div className="bg-white shadow-sm rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-500">This Month</h3>
                <p className="mt-2 text-2xl font-semibold text-green-600">
                  {formatMoney(payments
                    .filter(payment => {
                      const paymentDate = parseISO(payment.date);
                      const monthStart = startOfMonth(new Date());
                      const monthEnd = endOfMonth(new Date());
                      return paymentDate >= monthStart && paymentDate <= monthEnd;
                    })
                    .reduce((sum, payment) => sum + payment.amount, 0)
                  )}
                </p>
              </div>
              
              <div className="bg-white shadow-sm rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-500">Last Month</h3>
                <p className="mt-2 text-2xl font-semibold text-gray-600">
                  {formatMoney(payments
                    .filter(payment => {
                      const paymentDate = parseISO(payment.date);
                      const lastMonthStart = startOfMonth(subMonths(new Date(), 1));
                      const lastMonthEnd = endOfMonth(subMonths(new Date(), 1));
                      return paymentDate >= lastMonthStart && paymentDate <= lastMonthEnd;
                    })
                    .reduce((sum, payment) => sum + payment.amount, 0)
                  )}
                </p>
              </div>
            </div>
            
            {loading ? (
              <div className="bg-white shadow rounded-lg p-8 flex justify-center">
                <div className="animate-pulse flex flex-col items-center">
                  <div className="rounded-full bg-gray-200 h-12 w-12 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-48 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-64"></div>
                  <div className="mt-4 text-sm text-gray-500">Loading payments...</div>
                </div>
              </div>
            ) : (
              <div className="bg-white shadow-sm overflow-hidden rounded-lg">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Client
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Invoice
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Method
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Reference
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {payments.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="px-6 py-10 text-center text-gray-500">
                            <div className="flex flex-col items-center">
                              <HiOutlineCreditCard className="h-10 w-10 text-gray-300" />
                              <p className="mt-2 text-sm font-medium">No payments found</p>
                              <p className="mt-1 text-sm">Record a payment to get started</p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        payments.map((payment) => (
                          <tr key={payment.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {format(parseISO(payment.date), 'MMM d, yyyy')}
                            </td>
                                                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {getClientName(payment.clientId)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {getInvoiceNumber(payment.invoiceId)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {formatMoney(payment.amount)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {payment.method}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {payment.reference}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex justify-end space-x-2">
                                <button
                                  className="text-gray-400 hover:text-gray-500"
                                  title="Edit Payment"
                                >
                                  <HiOutlinePencilAlt className="h-5 w-5" />
                                </button>
                                <button
                                  className="text-gray-400 hover:text-red-500"
                                  title="Delete Payment"
                                >
                                  <HiOutlineTrash className="h-5 w-5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'statements' && (
          <>
            <div className="bg-white shadow-sm rounded-lg p-4 mb-6">
              <div className="md:flex md:items-center md:justify-between">
                <div className="relative rounded-md shadow-sm md:w-96">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <HiOutlineSearch className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <input
                    type="text"
                    name="search-statements"
                    id="search-statements"
                    className="focus:ring-[#800000] focus:border-[#800000] block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                    placeholder="Search statements..."
                  />
                </div>
                <div className="mt-4 md:mt-0">
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#800000] hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                  >
                    <HiOutlineDocumentAdd className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                    Generate Statement
                  </button>
                </div>
              </div>
            </div>
            
            {loading ? (
              <div className="bg-white shadow rounded-lg p-8 flex justify-center">
                <div className="animate-pulse flex flex-col items-center">
                  <div className="rounded-full bg-gray-200 h-12 w-12 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-48 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-64"></div>
                  <div className="mt-4 text-sm text-gray-500">Loading statements...</div>
                </div>
              </div>
            ) : (
              <div className="bg-white shadow-sm overflow-hidden rounded-lg">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Statement #
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Client
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Period
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Opening Balance
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Charges
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Payments
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Closing Balance
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {statements.length === 0 ? (
                        <tr>
                          <td colSpan="9" className="px-6 py-10 text-center text-gray-500">
                            <div className="flex flex-col items-center">
                              <HiOutlineDocumentText className="h-10 w-10 text-gray-300" />
                              <p className="mt-2 text-sm font-medium">No statements found</p>
                              <p className="mt-1 text-sm">Generate a statement to get started</p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        statements.map((statement) => (
                          <tr key={statement.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {statement.number}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {getClientName(statement.clientId)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {statement.period}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {format(parseISO(statement.date), 'MMM d, yyyy')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatMoney(statement.openingBalance)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatMoney(statement.charges)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatMoney(statement.payments)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {formatMoney(statement.closingBalance)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex justify-end space-x-2">
                                <button
                                  className="text-[#800000] hover:text-[#600000]"
                                  title="View Statement"
                                >
                                  <HiOutlineEye className="h-5 w-5" />
                                </button>
                                <button
                                  className="text-gray-400 hover:text-gray-500"
                                  title="Download PDF"
                                >
                                  <HiOutlineDownload className="h-5 w-5" />
                                </button>
                                <button
                                  className="text-gray-400 hover:text-gray-500"
                                  title="Print Statement"
                                >
                                  <HiOutlinePrinter className="h-5 w-5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'reports' && !activeReport && (
          <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Billing Reports</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-gray-50 p-4 border-b border-gray-200">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[#800000]/10 flex items-center justify-center">
                      <HiOutlineUser className="h-6 w-6 text-[#800000]" />
                    </div>
                    <h3 className="ml-3 text-lg font-medium text-gray-900">Client A/R Aging</h3>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-sm text-gray-500 mb-5">
                    View outstanding invoices by client and aging period. Identify past due amounts and track receivables by age.
                  </p>
                  <div className="mt-3 flex justify-between items-center">
                    <div className="text-xs text-gray-500">
                      <span className="inline-flex items-center">
                        <HiOutlineInformationCircle className="mr-1 h-3 w-3" />
                        Updated daily
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => generateReport('aging')}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-[#800000] bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                    >
                      <HiOutlineEye className="mr-1.5 h-4 w-4" />
                      View Report
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-gray-50 p-4 border-b border-gray-200">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[#800000]/10 flex items-center justify-center">
                      <HiOutlineCash className="h-6 w-6 text-[#800000]" />
                    </div>
                    <h3 className="ml-3 text-lg font-medium text-gray-900">Revenue Summary</h3>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-sm text-gray-500 mb-5">
                    Review billing and payment totals by period. Track monthly revenue trends and identify top-performing clients.
                  </p>
                  <div className="mt-3 flex justify-between items-center">
                    <div className="text-xs text-gray-500">
                      <span className="inline-flex items-center">
                        <HiOutlineCalendar className="mr-1 h-3 w-3" />
                        Monthly analysis
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => generateReport('revenue')}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-[#800000] bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                    >
                      <HiOutlineEye className="mr-1.5 h-4 w-4" />
                      View Report
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-gray-50 p-4 border-b border-gray-200">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[#800000]/10 flex items-center justify-center">
                      <HiOutlineChartBar className="h-6 w-6 text-[#800000]" />
                    </div>
                    <h3 className="ml-3 text-lg font-medium text-gray-900">Matter Profitability</h3>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-sm text-gray-500 mb-5">
                    Analyze billing and profitability by matter. Identify most profitable cases and optimize resource allocation.
                  </p>
                  <div className="mt-3 flex justify-between items-center">
                    <div className="text-xs text-gray-500">
                      <span className="inline-flex items-center">
                        <HiOutlineDocumentText className="mr-1 h-3 w-3" />
                        All matters
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => showToast("Matter Profitability report coming soon!", "success")}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-[#800000] bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                    >
                      <HiOutlineEye className="mr-1.5 h-4 w-4" />
                      View Report
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-gray-50 p-4 border-b border-gray-200">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[#800000]/10 flex items-center justify-center">
                      <HiOutlineClock className="h-6 w-6 text-[#800000]" />
                    </div>
                    <h3 className="ml-3 text-lg font-medium text-gray-900">Time Utilization</h3>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-sm text-gray-500 mb-5">
                    Track billable hours and productivity metrics across matters and time periods.
                  </p>
                  <div className="mt-3 flex justify-between items-center">
                    <div className="text-xs text-gray-500">
                      <span className="inline-flex items-center">
                        <HiOutlineRefresh className="mr-1 h-3 w-3" />
                        Weekly updates
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => showToast("Time Utilization report coming soon!", "success")}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-[#800000] bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                    >
                      <HiOutlineEye className="mr-1.5 h-4 w-4" />
                      View Report
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-gray-50 p-4 border-b border-gray-200">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[#800000]/10 flex items-center justify-center">
                      <HiOutlineCreditCard className="h-6 w-6 text-[#800000]" />
                    </div>
                    <h3 className="ml-3 text-lg font-medium text-gray-900">Payment Analytics</h3>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-sm text-gray-500 mb-5">
                    Analyze payment patterns, methods, and client payment behavior over time.
                  </p>
                  <div className="mt-3 flex justify-between items-center">
                    <div className="text-xs text-gray-500">
                      <span className="inline-flex items-center">
                        <HiOutlineRefresh className="mr-1 h-3 w-3" />
                        Real-time data
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => showToast("Payment Analytics report coming soon!", "success")}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-[#800000] bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                    >
                      <HiOutlineEye className="mr-1.5 h-4 w-4" />
                      View Report
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-gray-50 p-4 border-b border-gray-200">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[#800000]/10 flex items-center justify-center">
                      <HiOutlineDocumentAdd className="h-6 w-6 text-[#800000]" />
                    </div>
                    <h3 className="ml-3 text-lg font-medium text-gray-900">Custom Report</h3>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-sm text-gray-500 mb-5">
                    Create customized reports with specific parameters, data ranges, and client selections.
                  </p>
                  <div className="mt-3 flex justify-between items-center">
                    <div className="text-xs text-gray-500">
                      <span className="inline-flex items-center">
                        <HiOutlineFilter className="mr-1 h-3 w-3" />
                        Fully customizable
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => showToast("Custom Report Builder coming soon!", "success")}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-[#800000] bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                    >
                      <HiOutlinePlus className="mr-1.5 h-4 w-4" />
                      Create Report
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeReport === 'aging' && reportData && (
          <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900">{reportData.title}</h2>
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => showToast("Report downloaded successfully!", "success")}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                >
                  <HiOutlineDownload className="mr-2 h-5 w-5 text-gray-500" aria-hidden="true" />
                  Export
                </button>
                <button
                  type="button"
                  onClick={() => showToast("Report printed successfully!", "success")}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                >
                  <HiOutlinePrinter className="mr-2 h-5 w-5 text-gray-500" aria-hidden="true" />
                  Print
                </button>
                <button
                  type="button"
                  onClick={closeReport}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600"
                >
                  <HiOutlineX className="mr-2 h-5 w-5" aria-hidden="true" />
                  Close
                </button>
              </div>
            </div>
            
            <div className="mb-6">
              <div className="text-sm text-gray-500 mb-4 flex items-center">
                <HiOutlineCalendar className="mr-2 h-4 w-4" />
                Report Date: {reportData.date}
              </div>
              
              <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
                  <HiOutlineInformationCircle className="mr-2 h-5 w-5 text-[#800000]" />
                  Accounts Receivable Summary
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                  <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                    <div className="text-xs font-medium text-gray-500 uppercase mb-1">
                      Total Outstanding
                    </div>
                    <div className="text-xl font-semibold text-gray-900">
                      {formatMoney(reportData.summary.total)}
                    </div>
                  </div>
                  
                  <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                    <div className="text-xs font-medium text-gray-500 uppercase mb-1">
                      Current
                    </div>
                    <div className="text-xl font-semibold text-green-600">
                      {formatMoney(reportData.summary.current)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Not yet due
                    </div>
                  </div>
                  
                  <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                    <div className="text-xs font-medium text-gray-500 uppercase mb-1">
                      0-30 Days
                    </div>
                    <div className="text-xl font-semibold text-yellow-600">
                      {formatMoney(reportData.summary.days30)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {Math.round((reportData.summary.days30/reportData.summary.total)*100)}% of total
                    </div>
                  </div>
                  
                  <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                    <div className="text-xs font-medium text-gray-500 uppercase mb-1">
                      31-60 Days
                    </div>
                    <div className="text-xl font-semibold text-orange-600">
                      {formatMoney(reportData.summary.days60)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {Math.round((reportData.summary.days60/reportData.summary.total)*100)}% of total
                    </div>
                  </div>
                  
                  <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                    <div className="text-xs font-medium text-gray-500 uppercase mb-1">
                      61-90 Days
                    </div>
                    <div className="text-xl font-semibold text-red-500">
                      {formatMoney(reportData.summary.days90)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {Math.round((reportData.summary.days90/reportData.summary.total)*100)}% of total
                    </div>
                  </div>
                  
                  <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                    <div className="text-xs font-medium text-gray-500 uppercase mb-1">
                      90+ Days
                    </div>
                    <div className="text-xl font-semibold text-red-600">
                      {formatMoney(reportData.summary.days90plus)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {Math.round((reportData.summary.days90plus/reportData.summary.total)*100)}% of total
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="flex items-center text-sm text-gray-500">
                    <HiOutlineExclamation className="mr-2 h-5 w-5 text-yellow-500" />
                    <span>Amounts past 60 days require immediate collection attention. {formatMoney(reportData.summary.days90 + reportData.summary.days90plus)} ({Math.round(((reportData.summary.days90 + reportData.summary.days90plus)/reportData.summary.total)*100)}% of receivables) is more than 60 days overdue.</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-md font-medium text-gray-900 flex items-center">
                <HiOutlineUser className="mr-2 h-5 w-5 text-[#800000]" />
                Client Details
              </h3>
              <div className="relative rounded-md shadow-sm w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <HiOutlineSearch className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type="text"
                  className="focus:ring-[#800000] focus:border-[#800000] block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  placeholder="Filter clients..."
                />
              </div>
            </div>
            
            {reportData.clients.length === 0 ? (
              <div className="text-center text-gray-500 py-6">
                No outstanding invoices found for any clients.
              </div>
            ) : (
            reportData.clients.length > 0 && (
              <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Client
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Billed
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Paid
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Outstanding
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Current
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        0-30 Days
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        31-60 Days
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        61-90 Days
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        90+ Days
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {reportData.clients.map(client => (
                      <tr key={client.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {client.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatMoney(client.total)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatMoney(client.collected)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {formatMoney(client.outstanding)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                          {formatMoney(client.current)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-600">
                          {formatMoney(client.days30)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-orange-600">
                          {formatMoney(client.days60)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-red-500">
                          {formatMoney(client.days90)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                          {formatMoney(client.days90plus)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td className="px-6 py-3 whitespace-nowrap text-sm font-bold text-gray-900">
                        Totals
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap text-sm font-bold text-gray-900">
                        {formatMoney(reportData.clients.reduce((sum, client) => sum + client.total, 0))}
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap text-sm font-bold text-gray-900">
                        {formatMoney(reportData.clients.reduce((sum, client) => sum + client.collected, 0))}
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap text-sm font-bold text-gray-900">
                        {formatMoney(reportData.clients.reduce((sum, client) => sum + client.outstanding, 0))}
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap text-sm font-bold text-green-600">
                        {formatMoney(reportData.clients.reduce((sum, client) => sum + client.current, 0))}
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap text-sm font-bold text-yellow-600">
                        {formatMoney(reportData.clients.reduce((sum, client) => sum + client.days30, 0))}
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap text-sm font-bold text-orange-600">
                        {formatMoney(reportData.clients.reduce((sum, client) => sum + client.days60, 0))}
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap text-sm font-bold text-red-500">
                        {formatMoney(reportData.clients.reduce((sum, client) => sum + client.days90, 0))}
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap text-sm font-bold text-red-600">
                        {formatMoney(reportData.clients.reduce((sum, client) => sum + client.days90plus, 0))}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            ))}
          </div>
        )}

        {activeReport === 'revenue' && reportData && (
          <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900">{reportData.title}</h2>
              <button
                type="button"
                onClick={closeReport}
                className="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600"
              >
                <HiOutlineX className="mr-2 h-5 w-5" aria-hidden="true" />
                Close Report
              </button>
            </div>
            
            <div className="mb-6">
              <div className="text-sm text-gray-500 mb-2">
                Report Date: {reportData.date}
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gray-100 p-4 rounded-lg">
                  <h4 className="text-md font-medium text-gray-900 mb-2">Summary</h4>
                  <div className="flex flex-col sm:flex-row sm:space-x-4">
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-gray-500 uppercase mb-1">
                        Total Billed
                      </div>
                      <div className="text-lg font-semibold text-gray-900">
                        {formatMoney(reportData.summary.totalBilled)}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-gray-500 uppercase mb-1">
                        Total Paid
                      </div>
                      <div className="text-lg font-semibold text-gray-900">
                        {formatMoney(reportData.summary.totalPaid)}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-gray-500 uppercase mb-1">
                        Total Outstanding
                      </div>
                      <div className="text-lg font-semibold text-gray-900">
                        {formatMoney(reportData.summary.totalOutstanding)}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-gray-500 uppercase mb-1">
                        Average Invoice
                      </div>
                      <div className="text-lg font-semibold text-gray-900">
                        {formatMoney(reportData.summary.averageInvoice)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <h3 className="text-md font-medium text-gray-900 mb-4">Monthly Breakdown</h3>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Month
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Billed
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Collected
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Outstanding
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reportData.monthly.map((item, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.month}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatMoney(item.billed)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatMoney(item.collected)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatMoney(item.outstanding)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <h3 className="text-md font-medium text-gray-900 mb-4 mt-6">Top Clients</h3>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Client
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Billed
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Collected
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Outstanding
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reportData.topClients.map((client) => (
                    <tr key={client.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {client.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatMoney(client.billed)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatMoney(client.collected)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatMoney(client.outstanding)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      {/* New Invoice Modal */}
      <Transition.Root show={isInvoiceModalOpen} as={Fragment}>
        <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto" onClose={setIsInvoiceModalOpen}>
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
              enterFrom="translate-y-4 opacity-0"
              enterTo="translate-y-0 opacity-100"
              leave="ease-in duration-200"
              leaveFrom="translate-y-0 opacity-100"
              leaveTo="translate-y-4 opacity-0"
            >
              <div className="bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-5xl">
                <div className="px-6 py-4 border-b">
                  <h3 className="text-lg font-medium text-gray-900">Create New Invoice</h3>
                </div>
                
                <div className="p-6 max-h-[70vh] overflow-y-auto">
                  <form onSubmit={handleSubmitNewInvoice}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="clientId" className="block text-sm font-medium text-gray-700">
                          Client *
                        </label>
                        <select
                          id="clientId"
                          name="clientId"
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm rounded-md"
                          value={newInvoice.clientId}
                          onChange={handleNewInvoiceChange}
                          required
                        >
                          <option value="">Select a client</option>
                          {clients.map((client) => (
                            <option key={client.id} value={client.id}>
                              {client.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label htmlFor="matterId" className="block text-sm font-medium text-gray-700">
                          Matter *
                        </label>
                        <select
                          id="matterId"
                          name="matterId"
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm rounded-md"
                          value={newInvoice.matterId}
                          onChange={handleNewInvoiceChange}
                          required
                        >
                          <option value="">Select a matter</option>
                          {matters
                            .filter(m => !newInvoice.clientId || m.clientId === newInvoice.clientId)
                            .map((matter) => (
                              <option key={matter.id} value={matter.id}>
                                {matter.name} ({matter.number})
                              </option>
                            ))
                          }
                        </select>
                      </div>

                      <div>
                        <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                          Invoice Date *
                        </label>
                        <input
                          type="date"
                          id="date"
                          name="date"
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm rounded-md"
                          value={newInvoice.date}
                          onChange={handleNewInvoiceChange}
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
                          Due Date *
                        </label>
                        <input
                          type="date"
                          id="dueDate"
                          name="dueDate"
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm rounded-md"
                          value={newInvoice.dueDate}
                          onChange={handleNewInvoiceChange}
                          required
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                          Status
                        </label>
                        <select
                          id="status"
                          name="status"
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm rounded-md"
                          value={newInvoice.status}
                          onChange={handleNewInvoiceChange}
                        >
                          <option value="draft">Draft</option>
                          <option value="sent">Sent</option>
                          <option value="paid">Paid</option>
                          <option value="unpaid">Unpaid</option>
                          <option value="partial">Partially Paid</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="mt-8">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-md font-medium text-gray-900 mb-2">Invoice Items</h4>
                        <button
                          type="button"
                          onClick={addInvoiceItem}
                          className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                        >
                          <HiOutlinePlus className="h-4 w-4 mr-1" />
                          Add Item
                        </button>
                      </div>
                      
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Description
                              </th>
                              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Hours
                              </th>
                              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Rate
                              </th>
                              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Amount
                              </th>
                              <th scope="col" className="relative px-3 py-3">
                                <span className="sr-only">Actions</span>
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {newInvoice.items.map((item, index) => (
                              <tr key={index}>
                                <td className="px-3 py-3 whitespace-nowrap">
                                  <input
                                    type="text"
                                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#800000] focus:border-[#800000] sm:text-sm"
                                    placeholder="Description"
                                    value={item.description}
                                    onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                                    required
                                  />
                                </td>
                                <td className="px-3 py-3 whitespace-nowrap">
                                  <input
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    className="block w-20 border-gray-300 rounded-md shadow-sm focus:ring-[#800000] focus:border-[#800000] sm:text-sm"
                                    placeholder="Hours"
                                    value={item.hours}
                                    onChange={(e) => handleItemChange(index, 'hours', e.target.value)}
                                  />
                                </td>
                                <td className="px-3 py-3 whitespace-nowrap">
                                  <div className="relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                      <span className="text-gray-500 sm:text-sm">R</span>
                                    </div>
                                    <input
                                      type="number"
                                      step="0.01"
                                      min="0"
                                      className="pl-7 block w-24 border-gray-300 rounded-md shadow-sm focus:ring-[#800000] focus:border-[#800000] sm:text-sm"
                                      placeholder="Rate"
                                      value={item.rate}
                                      onChange={(e) => handleItemChange(index, 'rate', e.target.value)}
                                    />
                                  </div>
                                </td>
                                <td className="px-3 py-3 whitespace-nowrap">
                                  <div className="relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                      <span className="text-gray-500 sm:text-sm">R</span>
                                    </div>
                                    <input
                                      type="number"
                                      step="0.01"
                                      min="0"
                                      className="pl-7 block w-24 border-gray-300 rounded-md shadow-sm focus:ring-[#800000] focus:border-[#800000] sm:text-sm"
                                      placeholder="Amount"
                                      value={item.amount}
                                      onChange={(e) => handleItemChange(index, 'amount', e.target.value)}
                                      readOnly
                                    />
                                  </div>
                                </td>
                                <td className="px-3 py-3 whitespace-nowrap">
                                  <div className="flex justify-end">
                                    <button
                                      type="button"
                                      onClick={() => removeInvoiceItem(index)}
                                      className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-500 hover:bg-red-200 focus:outline-none"
                                    >
                                      <span className="sr-only">Remove item</span>
                                      <HiOutlineTrash className="w-5 h-5" aria-hidden="true" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <button
                        type="submit"
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#800000] hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                      >
                        <HiOutlineSave className="mr-2 h-5 w-5" aria-hidden="true" />
                        Save Invoice
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Delete Invoice Confirmation Modal */}
      <Transition.Root show={isDeleteModalOpen} as={Fragment}>
        <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto" onClose={setIsDeleteModalOpen}>
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
              enterFrom="translate-y-4 opacity-0"
              enterTo="translate-y-0 opacity-100"
              leave="ease-in duration-200"
              leaveFrom="translate-y-0 opacity-100"
              leaveTo="translate-y-4 opacity-0"
            >
              <div className="bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-md">
                <div className="px-6 py-4 border-b">
                  <h3 className="text-lg font-medium text-gray-900">Delete Invoice</h3>
                </div>
                
                <div className="p-6">
                  <p className="text-sm text-gray-500 mb-4">
                    Are you sure you want to delete this invoice? This action cannot be undone.
                  </p>
                  
                  <div className="flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => setIsDeleteModalOpen(false)}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={confirmDeleteInvoice}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600"
                    >
                      <HiOutlineTrash className="mr-2 h-5 w-5" aria-hidden="true" />
                      Delete Invoice
                    </button>
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Payment Modal would go here */}

      {/* Custom Report Modal would go here */}
      
    </div>
    </div>
  );
};

export default AttorneyBillingPage;