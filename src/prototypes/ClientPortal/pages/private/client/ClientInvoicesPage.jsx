import React, { useState, useEffect, useMemo, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { format, parseISO, isPast, isThisMonth, isThisYear, addDays } from 'date-fns';
import { 
  HiOutlineDocumentText, 
  HiOutlineDownload,
  HiOutlineCash, 
  HiOutlineExclamation,
  HiOutlineExclamationCircle,
  HiOutlineCalendar,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineSearch,
  HiOutlineFilter,
  HiOutlineRefresh,
  HiOutlineCreditCard,
  HiOutlineCurrencyDollar,
  HiOutlineMailOpen,
  HiOutlineQuestionMarkCircle,
  HiOutlineReceiptTax,
  HiOutlineArrowSmRight,
  HiChevronDown,
  HiOutlineChartBar,
  HiOutlineBriefcase,
  HiChevronRight,
  HiOutlineX,
  HiOutlineInformationCircle,
  HiOutlineClipboardCopy
} from 'react-icons/hi';
import { Dialog, Transition } from '@headlessui/react';

const ClientInvoicesPage = () => {
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState([]);
  const [expandedInvoice, setExpandedInvoice] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDate, setFilterDate] = useState('all');
  const [filterCase, setFilterCase] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('dueDate');
  const [sortDirection, setSortDirection] = useState('desc');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedInvoiceForPayment, setSelectedInvoiceForPayment] = useState(null);
  
  // Add these near your other state variables
  const [showPaymentHistoryModal, setShowPaymentHistoryModal] = useState(false);
  const [showMakePaymentModal, setShowMakePaymentModal] = useState(false);
  const [paymentHistory, setPaymentHistory] = useState([]);
  
  // Add with your other state variables
  const [showPdfPreviewModal, setShowPdfPreviewModal] = useState(false);
  const [selectedInvoiceForPreview, setSelectedInvoiceForPreview] = useState(null);
  
  // Add these at the top with your other state variables
  const [showBankDetailsModal, setShowBankDetailsModal] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  
  // Get current year for mock data
  const currentYear = new Date().getFullYear();
  
  // Create more realistic dates based on current date
  const today = new Date();
  const twoWeeksAgo = new Date(today);
  twoWeeksAgo.setDate(today.getDate() - 14);
  
  const oneMonthAgo = new Date(today);
  oneMonthAgo.setDate(today.getDate() - 30);
  
  const twoMonthsAgo = new Date(today);
  twoMonthsAgo.setDate(today.getDate() - 60);
  
  const inTwoWeeks = new Date(today);
  inTwoWeeks.setDate(today.getDate() + 14);
  
  const inOneWeek = new Date(today);
  inOneWeek.setDate(today.getDate() + 7);
  
  const threeDaysAgo = new Date(today);
  threeDaysAgo.setDate(today.getDate() - 3);
  
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        // Mock data - would be replaced with API call
        const mockInvoices = [
          { 
            id: 1, 
            number: `INV-${currentYear}-001`, 
            amount: 18500.00, 
            dueDate: format(inOneWeek, 'yyyy-MM-dd'), 
            issueDate: format(twoWeeksAgo, 'yyyy-MM-dd'),
            status: 'Unpaid', 
            caseRef: 'Smith v. Johnson',
            caseId: 1,
            caseType: 'Personal Injury',
            attorney: 'Sarah Nguyen',
            description: `Legal services for personal injury case - ${format(twoWeeksAgo, 'MMMM yyyy')}`,
            notes: 'Net 30 payment terms',
            items: [
              { description: 'Initial consultation', hours: 2, rate: 3750, amount: 7500 },
              { description: 'Document preparation', hours: 3, rate: 3750, amount: 11250 }
            ],
            paymentMethods: ['credit_card', 'bank_transfer', 'check'],
            timeline: [
              { date: format(twoWeeksAgo, 'yyyy-MM-dd'), event: 'Invoice created' },
              { date: format(threeDaysAgo, 'yyyy-MM-dd'), event: 'Invoice sent to client' }
            ]
          },
          { 
            id: 2, 
            number: `INV-${currentYear}-002`, 
            amount: 11250.00, 
            dueDate: format(oneMonthAgo, 'yyyy-MM-dd'), 
            issueDate: format(twoMonthsAgo, 'yyyy-MM-dd'),
            status: 'Paid', 
            paymentDate: format(oneMonthAgo, 'yyyy-MM-dd'),
            paymentMethod: 'Credit Card',
            paymentRef: 'TXN123456789',
            caseRef: 'Smith v. Johnson',
            caseId: 1,
            caseType: 'Personal Injury',
            attorney: 'Sarah Nguyen',
            description: `Legal services for personal injury case - ${format(twoMonthsAgo, 'MMMM yyyy')}`,
            items: [
              { description: 'Phone consultations', hours: 1, rate: 3750, amount: 3750 },
              { description: 'Court filing preparation', hours: 2, rate: 3750, amount: 7500 }
            ],
            paymentMethods: ['credit_card', 'bank_transfer', 'check'],
            timeline: [
              { date: format(twoMonthsAgo, 'yyyy-MM-dd'), event: 'Invoice created' },
              { date: format(addDays(twoMonthsAgo, 2), 'yyyy-MM-dd'), event: 'Invoice sent to client' },
              { date: format(oneMonthAgo, 'yyyy-MM-dd'), event: 'Payment received' },
              { date: format(oneMonthAgo, 'yyyy-MM-dd'), event: 'Receipt sent to client' }
            ]
          },
          { 
            id: 3, 
            number: `INV-${currentYear}-003`, 
            amount: 30000.00, 
            dueDate: format(inTwoWeeks, 'yyyy-MM-dd'), 
            issueDate: format(today, 'yyyy-MM-dd'),
            status: 'Unpaid', 
            caseRef: 'Estate of Williams',
            caseId: 2,
            caseType: 'Estate Planning',
            attorney: 'John Peterson',
            description: `Legal services for probate case - ${format(today, 'MMMM yyyy')}`,
            notes: 'Please contact us for payment plans if needed',
            items: [
              { description: 'Estate document review', hours: 4, rate: 3750, amount: 15000 },
              { description: 'Court appearance', hours: 4, rate: 3750, amount: 15000 }
            ],
            paymentMethods: ['credit_card', 'bank_transfer', 'check'],
            timeline: [
              { date: format(today, 'yyyy-MM-dd'), event: 'Invoice created' },
              { date: format(today, 'yyyy-MM-dd'), event: 'Invoice sent to client' }
            ]
          },
          { 
            id: 4, 
            number: `INV-${currentYear}-004`, 
            amount: 7500.00, 
            dueDate: format(threeDaysAgo, 'yyyy-MM-dd'), 
            issueDate: format(oneMonthAgo, 'yyyy-MM-dd'),
            status: 'Overdue', 
            caseRef: 'Brown LLC Contract',
            caseId: 3,
            caseType: 'Corporate',
            attorney: 'John Peterson',
            description: `Legal services for contract review - ${format(oneMonthAgo, 'MMMM yyyy')}`,
            items: [
              { description: 'Contract review and amendments', hours: 2, rate: 3750, amount: 7500 }
            ],
            paymentMethods: ['credit_card', 'bank_transfer', 'check'],
            timeline: [
              { date: format(oneMonthAgo, 'yyyy-MM-dd'), event: 'Invoice created' },
              { date: format(addDays(oneMonthAgo, 2), 'yyyy-MM-dd'), event: 'Invoice sent to client' },
              { date: format(threeDaysAgo, 'yyyy-MM-dd'), event: 'Payment reminder sent' }
            ]
          },
          { 
            id: 5, 
            number: `INV-${currentYear}-005`, 
            amount: 22500.00, 
            dueDate: format(addDays(today, 25), 'yyyy-MM-dd'), 
            issueDate: format(addDays(today, -5), 'yyyy-MM-dd'),
            status: 'Unpaid', 
            caseRef: 'Jones Divorce',
            caseId: 4,
            caseType: 'Family Law',
            attorney: 'Michael Patel',
            description: `Legal services for divorce proceedings - ${format(addDays(today, -5), 'MMMM yyyy')}`,
            items: [
              { description: 'Settlement negotiation', hours: 3, rate: 3750, amount: 11250 },
              { description: 'Document drafting', hours: 3, rate: 3750, amount: 11250 }
            ],
            paymentMethods: ['credit_card', 'bank_transfer', 'check', 'payment_plan'],
            timeline: [
              { date: format(addDays(today, -5), 'yyyy-MM-dd'), event: 'Invoice created' },
              { date: format(addDays(today, -4), 'yyyy-MM-dd'), event: 'Invoice sent to client' }
            ]
          }
        ];
        
        // Generate some mock payment history data
        const mockPaymentHistory = [
          {
            id: 'pay-001',
            invoiceNumber: 'INV-2023-001',
            amount: 5000,
            date: format(oneMonthAgo, 'yyyy-MM-dd'),
            paymentMethod: 'Credit Card',
            reference: 'TXN123456',
            status: 'Completed'
          },
          {
            id: 'pay-002',
            invoiceNumber: 'INV-2023-003',
            amount: 2500,
            date: format(twoWeeksAgo, 'yyyy-MM-dd'),
            paymentMethod: 'Bank Transfer',
            reference: 'EFT789012',
            status: 'Completed'
          },
          {
            id: 'pay-003',
            invoiceNumber: 'INV-2023-004',
            amount: 7500,
            date: format(threeDaysAgo, 'yyyy-MM-dd'),
            paymentMethod: 'Credit Card',
            reference: 'TXN789123',
            status: 'Completed'
          }
        ];
        
        setInvoices(mockInvoices);
        setPaymentHistory(mockPaymentHistory);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching invoices:', error);
        setLoading(false);
      }
    };
    
    fetchInvoices();
  }, []);
  
  // Toggle expanded view for an invoice
  const toggleInvoiceExpanded = (invoiceId) => {
    if (expandedInvoice === invoiceId) {
      setExpandedInvoice(null);
    } else {
      setExpandedInvoice(invoiceId);
    }
  };
  
  // Handle sort change
  const handleSortChange = (field) => {
    if (sortBy === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new field and default to descending
      setSortBy(field);
      setSortDirection('desc');
    }
  };
  
  // Initialize payment for an invoice
  const initiatePayment = (invoice) => {
    setSelectedInvoiceForPayment(invoice);
    setPaymentModalOpen(true);
  };
  
  // Reset all filters
  const resetFilters = () => {
    setFilterStatus('all');
    setFilterDate('all');
    setFilterCase('all');
    setSearchQuery('');
  };
  
  // Filter and sort invoices
  const filteredInvoices = useMemo(() => {
    // First filter the invoices
    let result = invoices.filter(invoice => {
      // Filter by status
      if (filterStatus !== 'all' && invoice.status.toLowerCase() !== filterStatus.toLowerCase()) {
        return false;
      }
      
      // Filter by date
      if (filterDate !== 'all') {
        const dueDate = parseISO(invoice.dueDate);
        switch (filterDate) {
          case 'overdue':
            if (!isPast(dueDate) || invoice.status.toLowerCase() === 'paid') return false;
            break;
          case 'thisMonth':
            if (!isThisMonth(dueDate)) return false;
            break;
          case 'thisYear':
            if (!isThisYear(dueDate)) return false;
            break;
          case 'upcoming':
            if (isPast(dueDate) || invoice.status.toLowerCase() === 'paid') return false;
            break;
          default:
            break;
        }
      }
      
      // Filter by case reference
      if (filterCase !== 'all' && invoice.caseRef !== filterCase) {
        return false;
      }
      
      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          invoice.number.toLowerCase().includes(query) ||
          invoice.description.toLowerCase().includes(query) ||
          invoice.caseRef.toLowerCase().includes(query)
        );
      }
      
      return true;
    });
    
    // Then sort the filtered invoices
    return result.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'number':
          comparison = a.number.localeCompare(b.number);
          break;
        case 'amount':
          comparison = a.amount - b.amount;
          break;
        case 'dueDate':
          comparison = new Date(a.dueDate) - new Date(b.dueDate);
          break;
        case 'issueDate':
          comparison = new Date(a.issueDate) - new Date(b.issueDate);
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        default:
          comparison = 0;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [invoices, filterStatus, filterDate, filterCase, searchQuery, sortBy, sortDirection]);
  
  // Get unique case references for filter dropdown
  const caseReferences = useMemo(() => {
    const uniqueCases = [...new Set(invoices.map(invoice => invoice.caseRef))];
    return uniqueCases;
  }, [invoices]);
  
  // Helper functions
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    try {
      const date = parseISO(dateString);
      return format(date, 'dd MMM yyyy');
    } catch (error) {
      console.error("Date formatting error:", error);
      return dateString;
    }
  };
  
  // Format currency in South African Rand
  const formatCurrency = (amount) => {
    return `R ${amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ")}`;
  };
  
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'unpaid':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'payment plan':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return <HiOutlineCheckCircle className="h-5 w-5 text-green-500" />;
      case 'unpaid':
        return <HiOutlineClock className="h-5 w-5 text-yellow-500" />;
      case 'overdue':
        return <HiOutlineExclamationCircle className="h-5 w-5 text-red-500" />;
      case 'payment plan':
        return <HiOutlineCalendar className="h-5 w-5 text-blue-500" />;
      default:
        return <HiOutlineDocumentText className="h-5 w-5 text-gray-500" />;
    }
  };
  
  const isDueSoon = (dateString) => {
    if (!dateString) return false;
    
    const dueDate = parseISO(dateString);
    const today = new Date();
    const sevenDaysLater = addDays(today, 7);
    
    return dueDate > today && dueDate <= sevenDaysLater;
  };
  
  const getRelativeTimeLabel = (dateString) => {
    if (!dateString) return '';
    
    const date = parseISO(dateString);
    const today = new Date();
    const difference = Math.ceil((date - today) / (1000 * 60 * 60 * 24));
    
    if (difference === 0) return 'Today';
    if (difference === 1) return 'Tomorrow';
    if (difference > 1 && difference <= 7) return `In ${difference} days`;
    if (difference === -1) return 'Yesterday';
    if (difference < -1 && difference >= -7) return `${Math.abs(difference)} days ago`;
    
    return '';
  };
  
  // Calculate summary data
  const summaryData = useMemo(() => {
    const total = invoices.reduce((sum, invoice) => sum + invoice.amount, 0);
    const paid = invoices
      .filter(invoice => invoice.status.toLowerCase() === 'paid')
      .reduce((sum, invoice) => sum + invoice.amount, 0);
    const unpaid = invoices
      .filter(invoice => invoice.status.toLowerCase() === 'unpaid')
      .reduce((sum, invoice) => sum + invoice.amount, 0);
    const overdue = invoices
      .filter(invoice => invoice.status.toLowerCase() === 'overdue')
      .reduce((sum, invoice) => sum + invoice.amount, 0);
      
    return { total, paid, unpaid, overdue };
  }, [invoices]);
  
  const handleMockDownload = (documentType, reference = '') => {
    setToastMessage({
      text: `Preparing ${documentType} for download...`,
      type: "info"
    });
    
    setTimeout(() => {
      let content = '';
      
      if (documentType.includes('Invoice')) {
        // Create a text-based representation of an invoice
        const invoice = invoices.find(inv => inv.number === reference) || {
          number: reference,
          issueDate: format(new Date(), 'yyyy-MM-dd'),
          dueDate: format(addDays(new Date(), 30), 'yyyy-MM-dd'),
          amount: 15000.00,
          items: [
            { description: 'Legal Services', hours: 4, rate: 3750, amount: 15000 }
          ]
        };
        
        content = `
=================================================
                  INVOICE ${invoice.number}
=================================================

PSN ATTORNEYS
123 Legal Street
Cape Town, 8001
South Africa
billing@psnattorneys.co.za

-------------------------------------------------
BILLED TO:
Client Name
123 Client Address
Johannesburg, 2000
South Africa

-------------------------------------------------
INVOICE DATE: ${formatDate(invoice.issueDate)}
DUE DATE: ${formatDate(invoice.dueDate)}
INVOICE TOTAL: ${formatCurrency(invoice.amount)}

-------------------------------------------------
INVOICE SUMMARY:
-------------------------------------------------
Description                    Hours    Rate     Amount
${invoice.items.map(item => 
  `${item.description.padEnd(30)} ${String(item.hours).padEnd(8)} ${formatCurrency(item.rate).padEnd(8)} ${formatCurrency(item.amount)}`
).join('\n')}
-------------------------------------------------
TOTAL:                                   ${formatCurrency(invoice.amount)}

-------------------------------------------------
PAYMENT DETAILS:
Bank: First National Bank
Account Name: PSN Attorneys Trust Account
Account Number: 62345678910
Branch Code: 250655
Reference: ${invoice.number}

-------------------------------------------------
Thank you for your business
This is an automatically generated invoice and requires no signature
Document generated on: ${format(new Date(), 'dd MMM yyyy HH:mm:ss')}
`;
      } else if (documentType.includes('Bank')) {
        // Create a text-based representation of bank details
        content = `
=================================================
                BANK ACCOUNT DETAILS
=================================================

PSN ATTORNEYS
123 Legal Street
Cape Town, 8001
South Africa

-------------------------------------------------
BANK NAME: First National Bank
ACCOUNT HOLDER: PSN Attorneys Trust Account
ACCOUNT NUMBER: 62345678910
BRANCH CODE: 250655
SWIFT CODE (INTERNATIONAL): FIRNZAJJ
REFERENCE FORMAT: Invoice # + Your Name

-------------------------------------------------
IMPORTANT INFORMATION:
Please include your invoice number as reference when making a payment. 
Once payment is made, please email proof of payment to billing@psnattorneys.co.za

-------------------------------------------------
Document generated on: ${format(new Date(), 'dd MMM yyyy HH:mm:ss')}
`;
      } else {
        // Generic document
        content = `
=================================================
                  ${documentType.toUpperCase()}
=================================================

Reference: ${reference}
Generated on: ${format(new Date(), 'dd MMM yyyy HH:mm:ss')}

This is a simulation for demonstration purposes only.
`;
      }
      
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `${documentType.toLowerCase().replace(/\s+/g, '-')}-${reference || 'document'}.txt`;
      document.body.appendChild(link);
      link.click();
      
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      setToastMessage({
        text: `${documentType} downloaded successfully`,
        type: "success"
      });
      setTimeout(() => setToastMessage(null), 3000);
    }, 1500);
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
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Invoices</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage and pay your legal invoices
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <button
              onClick={() => setShowPaymentHistoryModal(true)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
            >
              <HiOutlineDocumentText className="-ml-1 mr-2 h-5 w-5 text-gray-500" />
              Payment History
            </button>
            <button
              onClick={() => setShowMakePaymentModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#800000] hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
            >
              <HiOutlineCash className="-ml-1 mr-2 h-5 w-5" />
              Make a Payment
            </button>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="py-4">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                    <HiOutlineReceiptTax className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Invoices</dt>
                      <dd>
                        <div className="text-lg font-semibold text-gray-900">{formatCurrency(summaryData.total)}</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                    <HiOutlineCheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Paid</dt>
                      <dd>
                        <div className="text-lg font-semibold text-gray-900">{formatCurrency(summaryData.paid)}</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
                    <HiOutlineClock className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Unpaid</dt>
                      <dd>
                        <div className="text-lg font-semibold text-gray-900">{formatCurrency(summaryData.unpaid)}</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-red-100 rounded-md p-3">
                    <HiOutlineExclamationCircle className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Overdue</dt>
                      <dd>
                        <div className="text-lg font-semibold text-gray-900">{formatCurrency(summaryData.overdue)}</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Filters */}
          <div className="bg-white shadow rounded-lg mb-6">
            <div className="px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label htmlFor="search" className="block text-sm font-medium text-gray-700">
                    Search Invoices
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <HiOutlineSearch className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <input
                      type="text"
                      name="search"
                      id="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="focus:ring-[#800000] focus:border-[#800000] block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                      placeholder="Search by invoice #, case or description"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm rounded-md"
                  >
                    <option value="all">All Statuses</option>
                    <option value="paid">Paid</option>
                    <option value="unpaid">Unpaid</option>
                    <option value="overdue">Overdue</option>
                  </select>
                </div>
                
                <div>
                  <div className="flex justify-between">
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                      Date Range
                    </label>
                    <button 
                      type="button" 
                      onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                      className="text-sm text-[#800000] hover:text-[#600000] font-medium flex items-center"
                    >
                      {showAdvancedFilters ? 'Hide' : 'Show'} advanced filters
                      <HiChevronDown 
                        className={`ml-1 h-4 w-4 transition-transform ${showAdvancedFilters ? 'transform rotate-180' : ''}`}
                      />
                    </button>
                  </div>
                  <select
                    id="date"
                    name="date"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm rounded-md"
                  >
                    <option value="all">All Dates</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="overdue">Overdue</option>
                    <option value="thisMonth">This Month</option>
                    <option value="thisYear">This Year</option>
                  </select>
                </div>
              </div>
              
              {/* Advanced filters */}
              {showAdvancedFilters && (
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-4 border-t border-gray-200 pt-4">
                  <div>
                    <label htmlFor="case" className="block text-sm font-medium text-gray-700">
                      Case
                    </label>
                    <select
                      id="case"
                      name="case"
                      value={filterCase}
                      onChange={(e) => setFilterCase(e.target.value)}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm rounded-md"
                    >
                      <option value="all">All Cases</option>
                      {caseReferences.map((caseRef, index) => (
                        <option key={index} value={caseRef}>{caseRef}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Sort By
                    </label>
                    <select
                      value={sortBy}
                      onChange={(e) => handleSortChange(e.target.value)}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm rounded-md"
                    >
                      <option value="dueDate">Due Date</option>
                      <option value="issueDate">Issue Date</option>
                      <option value="amount">Amount</option>
                      <option value="number">Invoice Number</option>
                      <option value="status">Status</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Sort Direction
                    </label>
                    <select
                      value={sortDirection}
                      onChange={(e) => setSortDirection(e.target.value)}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm rounded-md"
                    >
                      <option value="desc">Newest First</option>
                      <option value="asc">Oldest First</option>
                    </select>
                  </div>
                  
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={resetFilters}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                    >
                      <HiOutlineRefresh className="-ml-1 mr-2 h-5 w-5 text-gray-500" />
                      Reset All Filters
                    </button>
                  </div>
                </div>
              )}
              
              {/* Summary of filtered results */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center text-sm text-gray-500">
                  <div>
                    Showing {filteredInvoices.length} of {invoices.length} invoices
                  </div>
                  <div className="mt-2 md:mt-0">
                    {filterStatus !== 'all' || filterDate !== 'all' || filterCase !== 'all' || searchQuery ? (
                      <button
                        type="button"
                        onClick={resetFilters}
                        className="text-[#800000] hover:text-[#600000] font-medium inline-flex items-center"
                      >
                        <HiOutlineRefresh className="mr-1 h-4 w-4" />
                        Clear Filters
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Invoices List */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            {filteredInvoices.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {filteredInvoices.map((invoice) => (
                  <li key={invoice.id} className="relative">
                    <div 
                      onClick={() => toggleInvoiceExpanded(invoice.id)}
                      className={`block transition duration-150 ease-in-out cursor-pointer ${expandedInvoice === invoice.id ? 'bg-gray-50' : 'hover:bg-gray-50'}`}
                    >
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            {getStatusIcon(invoice.status)}
                            <p className="ml-2 text-sm font-medium text-[#800000] truncate">{invoice.number}</p>
                            {isDueSoon(invoice.dueDate) && invoice.status.toLowerCase() !== 'paid' && (
                              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                                Due Soon
                              </span>
                            )}
                            {invoice.status.toLowerCase() === 'overdue' && (
                              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                                Overdue
                              </span>
                            )}
                          </div>
                          <div className="ml-2 flex-shrink-0 flex items-center">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(invoice.status)}`}>
                              {invoice.status}
                            </span>
                            <p className="ml-4 text-sm font-semibold text-gray-900">{formatCurrency(invoice.amount)}</p>
                          </div>
                        </div>
                        
                        <div className="mt-2 sm:flex sm:justify-between">
                          <div className="sm:flex">
                            <p className="flex items-center text-sm text-gray-500">
                              <HiOutlineBriefcase className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                              {invoice.caseRef}
                            </p>
                            <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                              <HiOutlineDocumentText className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                              {invoice.description}
                            </p>
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                            <div className="flex flex-col items-end">
                              <p className="flex items-center">
                                <HiOutlineCalendar className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                                Due: {formatDate(invoice.dueDate)}
                                {getRelativeTimeLabel(invoice.dueDate) && (
                                  <span className={`ml-1 text-xs ${
                                    isDueSoon(invoice.dueDate) && invoice.status.toLowerCase() !== 'paid' 
                                      ? 'text-yellow-600 font-medium' 
                                      : 'text-gray-500'
                                  }`}>
                                    ({getRelativeTimeLabel(invoice.dueDate)})
                                  </span>
                                )}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                Issued: {formatDate(invoice.issueDate)}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Quick Actions */}
                        <div className="mt-4 flex justify-between items-center">
                          <div>
                            <span className="text-xs text-gray-500">
                              {invoice.status.toLowerCase() === 'paid' 
                                ? `Paid on ${formatDate(invoice.paymentDate)}` 
                                : `Payment Terms: Net ${
                                  Math.round((new Date(invoice.dueDate) - new Date(invoice.issueDate)) / (1000 * 60 * 60 * 24)
                                )} days`
                              }
                            </span>
                          </div>
                          <div className="flex space-x-2">
                            <a 
                              onClick={(e) => {
                                e.preventDefault();
                                handleMockDownload('Invoice PDF', invoice.number);
                              }}
                              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                              style={{ cursor: 'pointer' }}
                            >
                              <HiOutlineDownload className="-ml-0.5 mr-2 h-4 w-4" />
                              Download PDF
                            </a>
                            
                            {invoice.status.toLowerCase() !== 'paid' && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  initiatePayment(invoice);
                                }}
                                className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-[#800000] hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                              >
                                <HiOutlineCash className="-ml-0.5 mr-2 h-4 w-4" />
                                Pay Now
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Expanded View */}
                      {expandedInvoice === invoice.id && (
                        <div className="px-4 py-5 sm:px-6 border-t border-gray-200 bg-gray-50">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Invoice Details */}
                            <div>
                              <h3 className="text-lg font-medium text-gray-900 mb-3">Invoice Details</h3>
                              <div className="bg-white p-4 rounded-lg shadow-sm overflow-hidden">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <p className="text-gray-500">Invoice Number</p>
                                    <p className="font-medium text-gray-900">{invoice.number}</p>
                                  </div>
                                  <div>
                                    <p className="text-gray-500">Status</p>
                                    <p className="font-medium">
                                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(invoice.status)}`}>
                                        {invoice.status}
                                      </span>
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-gray-500">Issue Date</p>
                                    <p className="font-medium text-gray-900">{formatDate(invoice.issueDate)}</p>
                                  </div>
                                  <div>
                                    <p className="text-gray-500">Due Date</p>
                                    <p className="font-medium text-gray-900">{formatDate(invoice.dueDate)}</p>
                                  </div>
                                  <div>
                                    <p className="text-gray-500">Case Reference</p>
                                    <p className="font-medium text-gray-900">{invoice.caseRef}</p>
                                  </div>
                                  <div>
                                    <p className="text-gray-500">Case Type</p>
                                    <p className="font-medium text-gray-900">{invoice.caseType}</p>
                                  </div>
                                  <div>
                                    <p className="text-gray-500">Attorney</p>
                                    <p className="font-medium text-gray-900">{invoice.attorney}</p>
                                  </div>
                                  <div>
                                    <p className="text-gray-500">Total Amount</p>
                                    <p className="font-medium text-gray-900">{formatCurrency(invoice.amount)}</p>
                                  </div>
                                  {invoice.status.toLowerCase() === 'paid' && (
                                    <>
                                      <div>
                                        <p className="text-gray-500">Payment Date</p>
                                        <p className="font-medium text-gray-900">{formatDate(invoice.paymentDate)}</p>
                                      </div>
                                      <div>
                                        <p className="text-gray-500">Payment Method</p>
                                        <p className="font-medium text-gray-900">{invoice.paymentMethod}</p>
                                      </div>
                                      {invoice.paymentRef && (
                                        <div>
                                          <p className="text-gray-500">Payment Reference</p>
                                          <p className="font-medium text-gray-900">{invoice.paymentRef}</p>
                                        </div>
                                      )}
                                    </>
                                  )}
                                </div>
                                
                                {invoice.notes && (
                                  <div className="mt-4 pt-4 border-t border-gray-200">
                                    <p className="text-gray-500 text-sm">Notes</p>
                                    <p className="text-gray-900 text-sm mt-1">{invoice.notes}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            {/* Invoice Items */}
                            <div>
                              <h3 className="text-lg font-medium text-gray-900 mb-3">Invoice Items</h3>
                              <div className="bg-white p-4 rounded-lg shadow-sm">
                                <table className="min-w-full divide-y divide-gray-200">
                                  <thead>
                                    <tr>
                                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Description
                                      </th>
                                      <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Hours
                                      </th>
                                      <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Rate
                                      </th>
                                      <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Amount
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody className="bg-white divide-y divide-gray-200">
                                    {invoice.items.map((item, index) => (
                                      <tr key={index} className="text-sm">
                                        <td className="px-4 py-3 text-gray-900">{item.description}</td>
                                        <td className="px-4 py-3 text-gray-900 text-right">{item.hours}</td>
                                        <td className="px-4 py-3 text-gray-900 text-right">{formatCurrency(item.rate)}</td>
                                        <td className="px-4 py-3 text-gray-900 text-right">{formatCurrency(item.amount)}</td>
                                      </tr>
                                    ))}
                                    <tr className="bg-gray-50">
                                      <td colSpan="3" className="px-4 py-3 text-sm font-medium text-gray-900 text-right">
                                        Total
                                      </td>
                                      <td className="px-4 py-3 text-sm font-medium text-gray-900 text-right">
                                        {formatCurrency(invoice.amount)}
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                              
                              {/* Timeline */}
                              {invoice.timeline && invoice.timeline.length > 0 && (
                                <div className="mt-6">
                                  <h3 className="text-sm font-medium text-gray-900 mb-2">Timeline</h3>
                                  <div className="bg-white p-4 rounded-lg shadow-sm">
                                    <div className="flow-root">
                                      <ul className="-mb-8">
                                        {invoice.timeline.map((event, eventIdx) => (
                                          <li key={eventIdx}>
                                            <div className="relative pb-8">
                                              {eventIdx !== invoice.timeline.length - 1 ? (
                                                <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                                              ) : null}
                                              <div className="relative flex space-x-3">
                                                <div>
                                                  <span className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center ring-8 ring-white">
                                                    {event.event.toLowerCase().includes('payment') ? (
                                                      <HiOutlineCash className="h-4 w-4 text-gray-500" />
                                                    ) : event.event.toLowerCase().includes('sent') ? (
                                                      <HiOutlineMailOpen className="h-4 w-4 text-gray-500" />
                                                    ) : (
                                                      <HiOutlineDocumentText className="h-4 w-4 text-gray-500" />
                                                    )}
                                                  </span>
                                                </div>
                                                <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                                  <div>
                                                    <p className="text-sm text-gray-500">{event.event}</p>
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
                              )}
                            </div>
                          </div>
                          
                          {/* Action Buttons */}
                          <div className="mt-6 flex flex-wrap gap-3 border-t border-gray-200 pt-4">
                            <button 
                              onClick={(e) => {
                                e.preventDefault();
                                handleMockDownload('Invoice PDF', invoice.number);
                              }}
                              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                            >
                              <HiOutlineDownload className="-ml-0.5 mr-2 h-4 w-4" />
                              Download PDF
                            </button>
                            
                            {invoice.status.toLowerCase() !== 'paid' && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  initiatePayment(invoice);
                                }}
                                className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-[#800000] hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                              >
                                <HiOutlineCash className="-ml-0.5 mr-2 h-4 w-4" />
                                Pay Now
                              </button>
                            )}
                            
                            <Link 
                              to={`/client-portal/cases/${invoice.caseId}`}
                              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                            >
                              <HiOutlineBriefcase className="-ml-0.5 mr-2 h-4 w-4" />
                              View Case
                            </Link>
                            
                            <Link 
                              to="/client-portal/support"
                              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                            >
                              <HiOutlineQuestionMarkCircle className="-ml-0.5 mr-2 h-4 w-4" />
                              Payment Help
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-12">
                <HiOutlineExclamation className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No invoices found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {filterStatus !== 'all' || filterDate !== 'all' || filterCase !== 'all' || searchQuery
                    ? "No invoices match your current filters."
                    : "You don't have any invoices yet."}
                </p>
                {(filterStatus !== 'all' || filterDate !== 'all' || filterCase !== 'all' || searchQuery) && (
                  <div className="mt-6">
                    <button
                      type="button"
                      onClick={resetFilters}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#800000] hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                    >
                      Clear Filters
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Payment Options */}
          <div className="bg-white shadow rounded-lg mt-8">
            <div className="px-6 py-5 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Payment Options</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="flex flex-col items-center text-center">
                    <div className="flex-shrink-0 p-3 rounded-full bg-[#800000] bg-opacity-10 mb-4">
                      <HiOutlineCreditCard className="h-6 w-6 text-[#800000]" />
                    </div>
                    <h4 className="text-md font-medium text-gray-900">Credit Card</h4>
                    <p className="mt-2 text-sm text-gray-500">
                      Pay securely using your credit or debit card.
                    </p>
                    <button
                      onClick={() => {
                        setShowMakePaymentModal(true);
                        // Pre-select credit card in the payment modal
                        // This is just a simulation - in a real app you would set the default value
                        setToastMessage({
                          text: "Credit card payment selected",
                          type: "info"
                        });
                        setTimeout(() => setToastMessage(null), 3000);
                      }}
                      className="mt-4 inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#800000] hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                    >
                      Pay with Card
                    </button>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="flex flex-col items-center text-center">
                    <div className="flex-shrink-0 p-3 rounded-full bg-[#800000] bg-opacity-10 mb-4">
                      <HiOutlineCurrencyDollar className="h-6 w-6 text-[#800000]" />
                    </div>
                    <h4 className="text-md font-medium text-gray-900">EFT Transfer</h4>
                    <p className="mt-2 text-sm text-gray-500">
                      Make a direct bank transfer to our account.
                    </p>
                    <button
                      className="mt-4 inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#800000] hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                      onClick={() => setShowBankDetailsModal(true)}
                    >
                      View Bank Details
                    </button>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="flex flex-col items-center text-center">
                    <div className="flex-shrink-0 p-3 rounded-full bg-[#800000] bg-opacity-10 mb-4">
                      <HiOutlineCalendar className="h-6 w-6 text-[#800000]" />
                    </div>
                    <h4 className="text-md font-medium text-gray-900">Payment Plan</h4>
                    <p className="mt-2 text-sm text-gray-500">
                      Set up a flexible payment plan for large invoices.
                    </p>
                    <button
                      onClick={() => {
                        // Request a payment plan (simulated)
                        setToastMessage({
                          text: "Payment plan request submitted. Our billing team will contact you shortly.",
                          type: "success"
                        });
                        setTimeout(() => setToastMessage(null), 4000);
                      }}
                      className="mt-4 inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#800000] hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                    >
                      Request Plan
                    </button>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="flex flex-col items-center text-center">
                    <div className="flex-shrink-0 p-3 rounded-full bg-[#800000] bg-opacity-10 mb-4">
                      <HiOutlineQuestionMarkCircle className="h-6 w-6 text-[#800000]" />
                    </div>
                    <h4 className="text-md font-medium text-gray-900">Need Assistance?</h4>
                    <p className="mt-2 text-sm text-gray-500">
                      Contact our billing department for help with payments.
                    </p>
                    <button
                      onClick={() => {
                        // Show email contact info (simulated)
                        setToastMessage({
                          text: "Contact our billing team at billing@psnattorneys.co.za or call +27 21 555 1234",
                          type: "info"
                        });
                        setTimeout(() => setToastMessage(null), 5000);
                      }}
                      className="mt-4 inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#800000] hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                    >
                      Contact Billing
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* FAQ Section */}
          <div className="bg-white shadow rounded-lg mt-6">
            <div className="px-6 py-5 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Frequently Asked Questions</h3>
            </div>
            <div className="p-6">
              <dl className="space-y-6 divide-y divide-gray-200">
                <div className="pt-6 md:grid md:grid-cols-12 md:gap-8">
                  <dt className="text-sm font-medium text-gray-900 md:col-span-5">What payment methods do you accept?</dt>
                  <dd className="mt-2 md:mt-0 md:col-span-7">
                    <p className="text-sm text-gray-500">
                      We accept all major credit cards, EFT bank transfers, and cheques. For larger invoices, payment plans may be available.
                    </p>
                  </dd>
                </div>
                <div className="pt-6 md:grid md:grid-cols-12 md:gap-8">
                  <dt className="text-sm font-medium text-gray-900 md:col-span-5">When is payment due?</dt>
                  <dd className="mt-2 md:mt-0 md:col-span-7">
                    <p className="text-sm text-gray-500">
                      Payment is due by the due date specified on each invoice, typically 30 days from the invoice issue date.
                    </p>
                  </dd>
                </div>
                <div className="pt-6 md:grid md:grid-cols-12 md:gap-8">
                  <dt className="text-sm font-medium text-gray-900 md:col-span-5">What if I can't pay my invoice on time?</dt>
                  <dd className="mt-2 md:mt-0 md:col-span-7">
                    <p className="text-sm text-gray-500">
                      Please contact our billing department as soon as possible to discuss payment arrangements. We're happy to work with you to find a suitable solution.
                    </p>
                  </dd>
                </div>
                <div className="pt-6 md:grid md:grid-cols-12 md:gap-8">
                  <dt className="text-sm font-medium text-gray-900 md:col-span-5">Are online payments secure?</dt>
                  <dd className="mt-2 md:mt-0 md:col-span-7">
                    <p className="text-sm text-gray-500">
                      Yes, all online payments are processed through a secure, encrypted payment gateway that complies with industry security standards.
                    </p>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
          
          {/* Payment History Modal */}
          {showPaymentHistoryModal && (
  <div className="fixed inset-0 z-10 overflow-y-auto">
    <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
      <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">&#8203;</span>
      
      <div className="inline-block w-full max-w-4xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Payment History</h3>
          <button
            onClick={() => setShowPaymentHistoryModal(false)}
            className="text-gray-400 hover:text-gray-500"
          >
            <HiOutlineX className="h-6 w-6" />
          </button>
        </div>
        
        <div className="mt-4">
          {paymentHistory.length > 0 ? (
            <div className="mt-4 flex flex-col">
              <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                  <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
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
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {paymentHistory.map((payment) => (
                          <tr key={payment.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatDate(payment.date)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {payment.invoiceNumber}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatCurrency(payment.amount)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {payment.paymentMethod}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {payment.reference}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                {payment.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <HiOutlineExclamation className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No payment history</h3>
              <p className="mt-1 text-sm text-gray-500">
                You haven't made any payments yet.
              </p>
            </div>
          )}
        </div>
        
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
            onClick={() => setShowPaymentHistoryModal(false)}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
)}

{/* Make Payment Modal */}
{showMakePaymentModal && (
  <div className="fixed inset-0 z-10 overflow-y-auto">
    <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
      <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">&#8203;</span>
      
      <div className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Make a Payment</h3>
          <button
            onClick={() => setShowMakePaymentModal(false)}
            className="text-gray-400 hover:text-gray-500"
          >
            <HiOutlineX className="h-6 w-6" />
          </button>
        </div>
        
        <div className="mt-4">
          <div className="space-y-6">
            <div>
              <label htmlFor="invoice" className="block text-sm font-medium text-gray-700">
                Select Invoice
              </label>
              <select
                id="invoice"
                name="invoice"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm rounded-md"
                defaultValue=""
              >
                <option value="" disabled>Select an invoice to pay</option>
                {invoices
                  .filter(invoice => invoice.status.toLowerCase() !== 'paid')
                  .map(invoice => (
                    <option key={invoice.id} value={invoice.id}>
                      {invoice.number} - {formatCurrency(invoice.amount)} ({invoice.status})
                    </option>
                  ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="payment-method" className="block text-sm font-medium text-gray-700">
                Payment Method
              </label>
              <select
                id="payment-method"
                name="payment-method"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm rounded-md"
                defaultValue="credit-card"
              >
                <option value="credit-card">Credit Card</option>
                <option value="bank-transfer">Bank Transfer</option>
                <option value="payment-plan">Payment Plan</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                Payment Amount
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">R</span>
                </div>
                <input
                  type="text"
                  name="amount"
                  id="amount"
                  className="focus:ring-[#800000] focus:border-[#800000] block w-full pl-7 sm:text-sm border-gray-300 rounded-md"
                  placeholder="0.00"
                />
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <HiOutlineInformationCircle className="h-5 w-5 text-gray-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-500">
                    This is a demo. In a real application, this would connect to a secure payment gateway.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
            onClick={() => setShowMakePaymentModal(false)}
          >
            Cancel
          </button>
          <button
            type="button"
            className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-[#800000] border border-transparent rounded-md hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
            onClick={() => {
              // Simulate successful payment
              alert('Payment successful!');
              setShowMakePaymentModal(false);
            }}
          >
            Process Payment
          </button>
        </div>
      </div>
    </div>
  </div>
)}

{/* PDF Preview Modal */}
{showPdfPreviewModal && selectedInvoiceForPreview && (
  <div className="fixed inset-0 z-10 overflow-y-auto">
    <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
      <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">&#8203;</span>
      
      <div className="inline-block w-full max-w-4xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Invoice {selectedInvoiceForPreview.number} - PDF Preview
          </h3>
          <button
            onClick={() => setShowPdfPreviewModal(false)}
            className="text-gray-400 hover:text-gray-500"
          >
            <HiOutlineX className="h-6 w-6" />
          </button>
        </div>
        
        <div className="bg-gray-100 p-4 border border-gray-300 rounded-md">
          <div className="min-h-[600px] bg-white shadow-md p-8 mx-auto max-w-3xl">
            {/* Mock PDF Invoice */}
            <div className="flex justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">INVOICE</h2>
                <p className="text-gray-600">{selectedInvoiceForPreview.number}</p>
              </div>
              <div className="text-right">
                <h3 className="text-xl font-semibold text-[#800000]">PSN Attorneys</h3>
                <p className="text-gray-600">123 Legal Street</p>
                <p className="text-gray-600">Cape Town, 8001</p>
                <p className="text-gray-600">South Africa</p>
                <p className="text-gray-600">billing@psnattorneys.co.za</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <h4 className="text-gray-500 text-sm font-medium mb-2">BILLED TO</h4>
                <p className="font-medium">Client Name</p>
                <p className="text-gray-600">123 Client Address</p>
                <p className="text-gray-600">Johannesburg, 2000</p>
                <p className="text-gray-600">South Africa</p>
              </div>
              <div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-gray-500 text-sm font-medium mb-2">INVOICE DATE</h4>
                    <p>{formatDate(selectedInvoiceForPreview.issueDate)}</p>
                  </div>
                  <div>
                    <h4 className="text-gray-500 text-sm font-medium mb-2">DUE DATE</h4>
                    <p>{formatDate(selectedInvoiceForPreview.dueDate)}</p>
                  </div>
                  <div>
                    <h4 className="text-gray-500 text-sm font-medium mb-2">INVOICE TOTAL</h4>
                    <p className="text-xl font-bold">{formatCurrency(selectedInvoiceForPreview.amount)}</p>
                  </div>
                  <div>
                    <h4 className="text-gray-500 text-sm font-medium mb-2">REFERENCE</h4>
                    <p>{selectedInvoiceForPreview.caseRef}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mb-8">
              <h4 className="text-gray-500 text-sm font-medium mb-2">INVOICE SUMMARY</h4>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-300">
                    <th className="py-2 text-left">Description</th>
                    <th className="py-2 text-right">Hours</th>
                    <th className="py-2 text-right">Rate</th>
                    <th className="py-2 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedInvoiceForPreview.items.map((item, index) => (
                    <tr key={index} className="border-b border-gray-200">
                      <td className="py-3">{item.description}</td>
                      <td className="py-3 text-right">{item.hours}</td>
                      <td className="py-3 text-right">{formatCurrency(item.rate)}</td>
                      <td className="py-3 text-right">{formatCurrency(item.amount)}</td>
                    </tr>
                  ))}
                  <tr className="font-bold">
                    <td colSpan="3" className="py-3 text-right">Total</td>
                    <td className="py-3 text-right">{formatCurrency(selectedInvoiceForPreview.amount)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="mb-8">
              <h4 className="text-gray-500 text-sm font-medium mb-2">PAYMENT DETAILS</h4>
              <div className="bg-gray-50 p-4 rounded border border-gray-200">
                <p><span className="font-medium">Bank:</span> First National Bank</p>
                <p><span className="font-medium">Account Name:</span> PSN Attorneys Trust Account</p>
                <p><span className="font-medium">Account Number:</span> 62345678910</p>
                <p><span className="font-medium">Branch Code:</span> 250655</p>
                <p><span className="font-medium">Reference:</span> {selectedInvoiceForPreview.number}</p>
              </div>
            </div>
            
            <div className="text-center text-gray-500 text-sm mt-12">
              <p>Thank you for your business</p>
              <p>This is an automatically generated invoice and requires no signature</p>
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
            onClick={() => setShowPdfPreviewModal(false)}
          >
            Close
          </button>
          <button
            type="button"

            className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-[#800000] border border-transparent rounded-md hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
            onClick={() => {
              handleMockDownload('Invoice PDF', selectedInvoiceForPreview.number);
              setShowPdfPreviewModal(false);
            }}
          >
            Download PDF
          </button>
        </div>
      </div>
    </div>
  </div>
)}

{/* Bank Details Modal */}
{showBankDetailsModal && (
  <div className="fixed inset-0 z-10 overflow-y-auto">
    <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
      <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">&#8203;</span>
      
      <div className="inline-block w-full max-w-lg p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Bank Account Details
          </h3>
          <button
            onClick={() => setShowBankDetailsModal(false)}
            className="text-gray-400 hover:text-gray-500"
          >
            <HiOutlineX className="h-6 w-6" />
          </button>
        </div>
        
        <div className="bg-gray-50 p-5 rounded-md">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium text-gray-700">Bank Name</p>
              <p className="text-sm text-gray-900">First National Bank</p>
            </div>
            
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium text-gray-700">Account Holder</p>
              <p className="text-sm text-gray-900">PSN Attorneys Trust Account</p>
            </div>
            
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium text-gray-700">Account Number</p>
              <div className="flex items-center">
                <p className="text-sm text-gray-900 mr-2">62345678910</p>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText("62345678910");
                    setToastMessage({
                      text: "Account number copied to clipboard",
                      type: "success"
                    });
                    setTimeout(() => setToastMessage(null), 3000);
                  }}
                  className="text-[#800000] hover:text-[#600000]"
                >
                  <HiOutlineClipboardCopy className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium text-gray-700">Branch Code</p>
              <div className="flex items-center">
                <p className="text-sm text-gray-900 mr-2">250655</p>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText("250655");
                    setToastMessage({
                      text: "Branch code copied to clipboard",
                      type: "success"
                    });
                    setTimeout(() => setToastMessage(null), 3000);
                  }}
                  className="text-[#800000] hover:text-[#600000]"
                >
                  <HiOutlineClipboardCopy className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium text-gray-700">Reference Format</p>
              <p className="text-sm text-gray-900">Invoice # + Your Name</p>
            </div>
            
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium text-gray-700">Swift Code (International)</p>
              <div className="flex items-center">
                <p className="text-sm text-gray-900 mr-2">FIRNZAJJ</p>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText("FIRNZAJJ");
                    setToastMessage({
                      text: "Swift code copied to clipboard",
                      type: "success"
                    });
                    setTimeout(() => setToastMessage(null), 3000);
                  }}
                  className="text-[#800000] hover:text-[#600000]"
                >
                  <HiOutlineClipboardCopy className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
          
          <div className="mt-6 bg-blue-50 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <HiOutlineInformationCircle className="h-5 w-5 text-blue-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  Please include your invoice number as reference when making a payment. Once payment is made, please email proof of payment to <span className="font-medium">billing@psnattorneys.co.za</span>
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex justify-between space-x-3">
          <button
            type="button"
            className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
            onClick={() => {
              // Download a bank details PDF (simulated)
              setToastMessage({
                text: "Bank details PDF downloading...",
                type: "info"
              });
              setTimeout(() => {
                setToastMessage({
                  text: "Bank details PDF downloaded successfully",
                  type: "success"
                });
                setTimeout(() => setToastMessage(null), 3000);
              }, 1500);
            }}
          >
            <HiOutlineDownload className="-ml-1 mr-2 h-5 w-5" />
            Download PDF
          </button>
          <button
            type="button"
            className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-[#800000] border border-transparent rounded-md hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
            onClick={() => setShowBankDetailsModal(false)}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
)}

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

{/* Quick action floating button - only on mobile */}
<div className="fixed bottom-6 right-6 sm:hidden">
  <Link 
    to="/client-portal/payments/make-payment"
    className="h-14 w-14 rounded-full bg-[#800000] shadow-lg flex items-center justify-center text-white"
    aria-label="Make a payment"
  >
    <HiOutlineCash className="h-6 w-6" />
  </Link>
</div>
        </div>
      </div>
    </div>
  );
};

export default ClientInvoicesPage;