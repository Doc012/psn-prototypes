import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineDocumentText, HiOutlineDownload, HiOutlineCash, HiOutlineExclamation } from 'react-icons/hi';

const ClientInvoicesPage = () => {
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        // Mock data - would be replaced with API call
        const mockInvoices = [
          { 
            id: 1, 
            number: 'INV-2023-001', 
            amount: 1250.00, 
            dueDate: '2023-06-15', 
            issueDate: '2023-05-15',
            status: 'Unpaid', 
            caseRef: 'Smith v. Johnson',
            description: 'Legal services for personal injury case - May 2023',
            items: [
              { description: 'Initial consultation', hours: 2, rate: 250, amount: 500 },
              { description: 'Document preparation', hours: 3, rate: 250, amount: 750 }
            ]
          },
          { 
            id: 2, 
            number: 'INV-2023-002', 
            amount: 750.00, 
            dueDate: '2023-05-15', 
            issueDate: '2023-04-15',
            status: 'Paid', 
            paymentDate: '2023-05-10',
            caseRef: 'Smith v. Johnson',
            description: 'Legal services for personal injury case - April 2023',
            items: [
              { description: 'Phone consultations', hours: 1, rate: 250, amount: 250 },
              { description: 'Court filing preparation', hours: 2, rate: 250, amount: 500 }
            ]
          },
          { 
            id: 3, 
            number: 'INV-2023-003', 
            amount: 2000.00, 
            dueDate: '2023-07-01', 
            issueDate: '2023-06-01',
            status: 'Unpaid', 
            caseRef: 'Estate of Williams',
            description: 'Legal services for probate case - June 2023',
            items: [
              { description: 'Estate document review', hours: 4, rate: 250, amount: 1000 },
              { description: 'Court appearance', hours: 4, rate: 250, amount: 1000 }
            ]
          },
          { 
            id: 4, 
            number: 'INV-2023-004', 
            amount: 500.00, 
            dueDate: '2023-04-15', 
            issueDate: '2023-03-15',
            status: 'Overdue', 
            caseRef: 'Brown LLC Contract',
            description: 'Legal services for contract review - March 2023',
            items: [
              { description: 'Contract review and amendments', hours: 2, rate: 250, amount: 500 }
            ]
          }
        ];
        
        setInvoices(mockInvoices);
        setFilteredInvoices(mockInvoices);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching invoices:', error);
        setLoading(false);
      }
    };
    
    fetchInvoices();
  }, []);
  
  // Filter invoices when status filter changes
  useEffect(() => {
    if (filterStatus === 'all') {
      setFilteredInvoices(invoices);
    } else {
      setFilteredInvoices(invoices.filter(invoice => 
        invoice.status.toLowerCase() === filterStatus.toLowerCase()
      ));
    }
  }, [filterStatus, invoices]);
  
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'unpaid':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
          <h1 className="text-2xl font-semibold text-gray-900">Invoices</h1>
          <div className="mt-4 md:mt-0">
            <Link
              to="/client-portal/payments/make-payment"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#800000] hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
            >
              <HiOutlineCash className="-ml-1 mr-2 h-5 w-5" />
              Make a Payment
            </Link>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="py-4">
          {/* Filters */}
          <div className="bg-white shadow rounded-lg mb-8 p-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div>
                <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700">Filter by Status</label>
                <select
                  id="status-filter"
                  name="status-filter"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm rounded-md"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Invoices</option>
                  <option value="paid">Paid</option>
                  <option value="unpaid">Unpaid</option>
                  <option value="overdue">Overdue</option>
                </select>
              </div>
              
              <div className="text-right">
                <p className="text-sm text-gray-500">Total Invoices: {filteredInvoices.length}</p>
                <p className="text-sm text-gray-500">
                  Total Amount Due: ${invoices
                    .filter(invoice => invoice.status.toLowerCase() !== 'paid')
                    .reduce((sum, invoice) => sum + invoice.amount, 0)
                    .toFixed(2)}
                </p>
              </div>
            </div>
          </div>
          
          {/* Invoices List */}
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            {filteredInvoices.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {filteredInvoices.map((invoice) => (
                  <li key={invoice.id}>
                    <div className="block hover:bg-gray-50">
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <HiOutlineDocumentText className="flex-shrink-0 h-5 w-5 text-gray-400" />
                            <p className="ml-2 text-sm font-medium text-[#800000] truncate">{invoice.number}</p>
                          </div>
                          <div className="ml-2 flex-shrink-0 flex">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(invoice.status)}`}>
                              {invoice.status}
                            </span>
                          </div>
                        </div>
                        <div className="mt-2 sm:flex sm:justify-between">
                          <div className="sm:flex">
                            <p className="flex items-center text-sm text-gray-500">
                              Case: {invoice.caseRef}
                            </p>
                            <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                              Amount: ${invoice.amount.toFixed(2)}
                            </p>
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                            <p>
                              Due: {new Date(invoice.dueDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="mt-2 flex justify-between">
                          <div className="text-sm">
                            <Link
                              to={`/client-portal/invoices/${invoice.id}`}
                              className="font-medium text-[#800000] hover:text-[#600000]"
                            >
                              View Details
                            </Link>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              className="inline-flex items-center px-3 py-1 border border-transparent rounded-md shadow-sm text-sm font-medium text-[#800000] bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                              onClick={() => window.open(`/api/invoices/${invoice.id}/pdf`, '_blank')}
                            >
                              <HiOutlineDownload className="-ml-1 mr-1 h-4 w-4" />
                              Download
                            </button>
                            
                            {invoice.status.toLowerCase() !== 'paid' && (
                              <Link
                                to={`/client-portal/payments/pay/${invoice.id}`}
                                className="inline-flex items-center px-3 py-1 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#800000] hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                              >
                                <HiOutlineCash className="-ml-1 mr-1 h-4 w-4" />
                                Pay Now
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-6">
                <HiOutlineExclamation className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No invoices found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {filterStatus === 'all' 
                    ? "You don't have any invoices yet." 
                    : `You don't have any ${filterStatus.toLowerCase()} invoices.`}
                </p>
              </div>
            )}
          </div>
          
          {/* Payment Options */}
          <div className="bg-white shadow rounded-lg mt-8">
            <div className="px-6 py-5 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Payment Options</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-md font-medium text-gray-900">Online Payment</h4>
                  <p className="mt-2 text-sm text-gray-500">
                    Pay securely online using credit card, debit card, or bank transfer.
                  </p>
                  <Link
                    to="/client-portal/payments/make-payment"
                    className="mt-4 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 rounded-md text-[#800000] bg-white hover:bg-gray-100"
                  >
                    Pay Online
                  </Link>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-md font-medium text-gray-900">Bank Transfer</h4>
                  <p className="mt-2 text-sm text-gray-500">
                    Make a direct bank transfer using our banking details.
                  </p>
                  <button
                    className="mt-4 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 rounded-md text-[#800000] bg-white hover:bg-gray-100"
                    onClick={() => {/* Show bank details modal */}}
                  >
                    View Bank Details
                  </button>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-md font-medium text-gray-900">Need Help?</h4>
                  <p className="mt-2 text-sm text-gray-500">
                    Contact our billing department for payment arrangements or questions.
                  </p>
                  <Link
                    to="/client-portal/support"
                    className="mt-4 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 rounded-md text-[#800000] bg-white hover:bg-gray-100"
                  >
                    Contact Billing
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientInvoicesPage;