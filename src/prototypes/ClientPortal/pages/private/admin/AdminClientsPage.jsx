import React, { useState, useEffect, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import {
  HiOutlineUserCircle,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineOfficeBuilding,
  HiOutlineIdentification,
  HiOutlineCalendar,
  HiOutlineSearch,
  HiOutlineFilter,
  HiOutlinePlus,
  HiOutlinePencilAlt,
  HiOutlineTrash,
  HiOutlineX,
  HiOutlineCheck,
  HiOutlineExclamation,
  HiOutlineDocumentText,
  HiOutlineChevronDown,
  HiOutlineCash,
  HiOutlineLocationMarker,
  HiOutlineBriefcase,
  HiOutlineGlobe,
  HiOutlineClock,
  HiOutlineTag
} from 'react-icons/hi';

const AdminClientsPage = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [isAddingClient, setIsAddingClient] = useState(false);
  const [isEditingClient, setIsEditingClient] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [isViewingClient, setIsViewingClient] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [clientToDelete, setClientToDelete] = useState(null);
  const [showExport, setShowExport] = useState(false);
  
  const [newClient, setNewClient] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    type: 'individual',
    company: '',
    idNumber: '',
    address: {
      street: '',
      city: '',
      province: '',
      postalCode: '',
      country: 'South Africa'
    },
    onboardingDate: '',
    notes: '',
    status: 'active'
  });

  // Client types for dropdown selection
  const clientTypes = [
    { id: 'individual', name: 'Individual' },
    { id: 'corporate', name: 'Corporate' },
    { id: 'government', name: 'Government' },
    { id: 'non-profit', name: 'Non-Profit' }
  ];
  
  // Status options
  const statusOptions = [
    { id: 'active', name: 'Active', color: 'bg-green-100 text-green-800' },
    { id: 'inactive', name: 'Inactive', color: 'bg-gray-100 text-gray-800' },
    { id: 'pending', name: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
    { id: 'archived', name: 'Archived', color: 'bg-red-100 text-red-800' }
  ];
  
  useEffect(() => {
    // Simulating API call to fetch clients
    setTimeout(() => {
      const mockClients = [
        {
          id: '1',
          firstName: 'Jacob',
          lastName: 'Zuma',
          email: 'jacob.zuma@example.co.za',
          phone: '071 123 4567',
          type: 'individual',
          company: '',
          idNumber: '6003155089087',
          address: {
            street: '123 Main Street',
            city: 'Nkandla',
            province: 'KwaZulu-Natal',
            postalCode: '3855',
            country: 'South Africa'
          },
          onboardingDate: '2021-03-15',
          notes: 'Referred by Thabo Mbeki',
          status: 'active',
          cases: 3,
          billingTotal: 57500,
          outstandingBalance: 15000,
          assignedAttorney: 'Thabo Mbeki'
        },
        {
          id: '2',
          firstName: '',
          lastName: '',
          email: 'info@sasol.co.za',
          phone: '011 441 3111',
          type: 'corporate',
          company: 'Sasol Limited',
          idNumber: '1968/013914/06',
          address: {
            street: '50 Katherine Street',
            city: 'Sandton',
            province: 'Gauteng',
            postalCode: '2196',
            country: 'South Africa'
          },
          onboardingDate: '2020-06-22',
          notes: 'Large corporate client with multiple matters',
          status: 'active',
          cases: 8,
          billingTotal: 1250000,
          outstandingBalance: 0,
          assignedAttorney: 'Naledi Pandor'
        },
        {
          id: '3',
          firstName: 'Cyril',
          lastName: 'Ramaphosa',
          email: 'cyril.ramaphosa@example.co.za',
          phone: '082 789 0123',
          type: 'individual',
          company: '',
          idNumber: '5211125605088',
          address: {
            street: '456 Union Buildings',
            city: 'Pretoria',
            province: 'Gauteng',
            postalCode: '0001',
            country: 'South Africa'
          },
          onboardingDate: '2019-11-10',
          notes: 'VIP client, requires special attention',
          status: 'active',
          cases: 2,
          billingTotal: 185000,
          outstandingBalance: 0,
          assignedAttorney: 'Sipho Nkosi'
        },
        {
          id: '4',
          firstName: '',
          lastName: '',
          email: 'legal@eskom.co.za',
          phone: '011 800 8111',
          type: 'government',
          company: 'Eskom Holdings SOC Ltd',
          idNumber: '2002/015527/06',
          address: {
            street: 'Megawatt Park, Maxwell Drive',
            city: 'Sandton',
            province: 'Gauteng',
            postalCode: '2157',
            country: 'South Africa'
          },
          onboardingDate: '2022-01-05',
          notes: 'Government-owned entity, special billing arrangements',
          status: 'active',
          cases: 12,
          billingTotal: 2250000,
          outstandingBalance: 750000,
          assignedAttorney: 'Mandla Zulu'
        },
        {
          id: '5',
          firstName: 'Patrice',
          lastName: 'Motsepe',
          email: 'patrice.motsepe@example.co.za',
          phone: '083 456 7890',
          type: 'individual',
          company: 'African Rainbow Minerals',
          idNumber: '6201015774086',
          address: {
            street: '29 Impala Road',
            city: 'Johannesburg',
            province: 'Gauteng',
            postalCode: '2001',
            country: 'South Africa'
          },
          onboardingDate: '2021-07-18',
          notes: 'High-profile business leader, also handles corporate matters',
          status: 'pending',
          cases: 1,
          billingTotal: 45000,
          outstandingBalance: 45000,
          assignedAttorney: 'Lerato Moloi'
        },
        {
          id: '6',
          firstName: '',
          lastName: '',
          email: 'admin@nelsonmandela.org',
          phone: '011 547 5600',
          type: 'non-profit',
          company: 'Nelson Mandela Foundation',
          idNumber: 'NPO-057-323',
          address: {
            street: '107 Central Street',
            city: 'Houghton',
            province: 'Gauteng',
            postalCode: '2198',
            country: 'South Africa'
          },
          onboardingDate: '2022-02-28',
          notes: 'Pro bono client, no billing',
          status: 'active',
          cases: 4,
          billingTotal: 0,
          outstandingBalance: 0,
          assignedAttorney: 'Thabo Mbeki'
        },
        {
          id: '7',
          firstName: 'Grace',
          lastName: 'Machel',
          email: 'grace.machel@example.co.za',
          phone: '084 789 0123',
          type: 'individual',
          company: '',
          idNumber: '4508225771089',
          address: {
            street: '78 Houghton Drive',
            city: 'Johannesburg',
            province: 'Gauteng',
            postalCode: '2198',
            country: 'South Africa'
          },
          onboardingDate: '2020-10-03',
          notes: 'VIP client, philanthropic work',
          status: 'inactive',
          cases: 0,
          billingTotal: 125000,
          outstandingBalance: 0,
          assignedAttorney: 'Naledi Pandor'
        }
      ];
      
      setClients(mockClients);
      setLoading(false);
    }, 1000);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setNewClient({
        ...newClient,
        [parent]: {
          ...newClient[parent],
          [child]: value
        }
      });
    } else {
      setNewClient({
        ...newClient,
        [name]: value
      });
    }
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setSelectedClient({
        ...selectedClient,
        [parent]: {
          ...selectedClient[parent],
          [child]: value
        }
      });
    } else {
      setSelectedClient({
        ...selectedClient,
        [name]: value
      });
    }
  };

  const handleAddClient = () => {
    const client = {
      ...newClient,
      id: (clients.length + 1).toString(),
      cases: 0,
      billingTotal: 0,
      outstandingBalance: 0,
      assignedAttorney: ''
    };
    
    setClients([...clients, client]);
    setNewClient({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      type: 'individual',
      company: '',
      idNumber: '',
      address: {
        street: '',
        city: '',
        province: '',
        postalCode: '',
        country: 'South Africa'
      },
      onboardingDate: '',
      notes: '',
      status: 'active'
    });
    
    setIsAddingClient(false);
  };

  const handleUpdateClient = () => {
    const updatedClients = clients.map(client => 
      client.id === selectedClient.id ? selectedClient : client
    );
    
    setClients(updatedClients);
    setSelectedClient(null);
    setIsEditingClient(false);
  };

  const handleDeleteClient = () => {
    const updatedClients = clients.filter(
      client => client.id !== clientToDelete.id
    );
    
    setClients(updatedClients);
    setClientToDelete(null);
    setIsConfirmingDelete(false);
  };

  const initiateEdit = (client) => {
    setSelectedClient(client);
    setIsEditingClient(true);
  };

  const initiateDelete = (client) => {
    setClientToDelete(client);
    setIsConfirmingDelete(true);
  };

  const viewClient = (client) => {
    setSelectedClient(client);
    setIsViewingClient(true);
  };

  const filteredClients = clients
    .filter(client => 
      (filterType === 'all' || client.type === filterType) &&
      (
        (client.firstName + ' ' + client.lastName).toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.phone.includes(searchTerm)
      )
    );

  // Get client display name
  const getClientName = (client) => {
    if (client.type === 'individual') {
      return `${client.firstName} ${client.lastName}`;
    } else {
      return client.company;
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Get status badge color
  const getStatusBadgeColor = (status) => {
    const statusOption = statusOptions.find(option => option.id === status);
    return statusOption ? statusOption.color : 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Client Management</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your firm's clients and their information
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <div className="relative">
              <button
                onClick={() => setShowExport(!showExport)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
              >
                <HiOutlineDocumentText className="-ml-1 mr-2 h-5 w-5 text-gray-500" />
                Export
                <HiOutlineChevronDown className="ml-2 -mr-1 h-5 w-5 text-gray-500" />
              </button>
              
              {showExport && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                  <div className="py-1" role="menu" aria-orientation="vertical">
                    <button
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                      role="menuitem"
                      onClick={() => setShowExport(false)}
                    >
                      Export as CSV
                    </button>
                    <button
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                      role="menuitem"
                      onClick={() => setShowExport(false)}
                    >
                      Export as PDF
                    </button>
                    <button
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                      role="menuitem"
                      onClick={() => setShowExport(false)}
                    >
                      Print Client List
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <button
              onClick={() => setIsAddingClient(true)}
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#800000] hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
            >
              <HiOutlinePlus className="-ml-1 mr-2 h-5 w-5" />
              Add Client
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
                    placeholder="Search clients..."
                  />
                </div>
              </div>
              <div className="mt-2 md:mt-0 flex items-center">
                <HiOutlineFilter className="mr-2 h-5 w-5 text-gray-400" />
                <span className="mr-2 text-sm text-gray-500">Client Type:</span>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm rounded-md"
                >
                  <option value="all">All Types</option>
                  {clientTypes.map((type) => (
                    <option key={type.id} value={type.id}>{type.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-solid border-[#800000] border-r-transparent"></div>
              <p className="mt-4 text-gray-500">Loading clients...</p>
            </div>
          ) : (
            <>
              {filteredClients.length === 0 ? (
                <div className="text-center py-12">
                  <HiOutlineUserCircle className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No clients found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {searchTerm ? `No results for "${searchTerm}"` : 'Get started by adding a new client'}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Client
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Contact
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Cases
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Billing
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
                      {filteredClients.map((client) => (
                        <tr key={client.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <div className="h-10 w-10 rounded-full bg-[#800000] bg-opacity-10 flex items-center justify-center">
                                  <HiOutlineUserCircle className="h-6 w-6 text-[#800000]" />
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{getClientName(client)}</div>
                                <div className="text-sm text-gray-500">Client #{client.id}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 flex items-center">
                              <HiOutlineMail className="mr-1 h-4 w-4 text-gray-400" /> {client.email}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <HiOutlinePhone className="mr-1 h-4 w-4 text-gray-400" /> {client.phone}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-[#800000] bg-opacity-10 text-[#800000]">
                              {clientTypes.find(type => type.id === client.type)?.name || client.type}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 flex items-center">
                              <HiOutlineBriefcase className="mr-1 h-4 w-4 text-gray-400" /> {client.cases} {client.cases === 1 ? 'case' : 'cases'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {client.assignedAttorney && (
                                <span className="flex items-center">
                                  <HiOutlineUserCircle className="mr-1 h-4 w-4 text-gray-400" /> {client.assignedAttorney}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{formatCurrency(client.billingTotal)}</div>
                            {client.outstandingBalance > 0 && (
                              <div className="text-sm text-red-600 flex items-center">
                                <HiOutlineCash className="mr-1 h-4 w-4" /> {formatCurrency(client.outstandingBalance)} outstanding
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(client.status)}`}>
                              {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => viewClient(client)}
                              className="text-gray-600 hover:text-gray-900 mr-3"
                            >
                              View
                            </button>
                            <button
                              onClick={() => initiateEdit(client)}
                              className="text-[#800000] hover:text-[#600000] mr-3"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => initiateDelete(client)}
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

      {/* Add Client Modal */}
      <Transition appear show={isAddingClient} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={() => setIsAddingClient(false)}
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
              <div className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Add New Client
                </Dialog.Title>
                
                <div className="mt-4 space-y-6">
                  <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                      Client Type
                    </label>
                    <select
                      id="type"
                      name="type"
                      value={newClient.type}
                      onChange={handleInputChange}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm rounded-md"
                    >
                      {clientTypes.map((type) => (
                        <option key={type.id} value={type.id}>{type.name}</option>
                      ))}
                    </select>
                  </div>

                  {newClient.type === 'individual' ? (
                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                      <div className="sm:col-span-3">
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                          First name
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            name="firstName"
                            id="firstName"
                            value={newClient.firstName}
                            onChange={handleInputChange}
                            className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                          Last name
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            name="lastName"
                            id="lastName"
                            value={newClient.lastName}
                            onChange={handleInputChange}
                            className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                        Company/Organization Name
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="company"
                          id="company"
                          value={newClient.company}
                          onChange={handleInputChange}
                          className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-3">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email address
                      </label>
                      <div className="mt-1">
                        <input
                          type="email"
                          name="email"
                          id="email"
                          value={newClient.email}
                          onChange={handleInputChange}
                          className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                        Phone number
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="phone"
                          id="phone"
                          value={newClient.phone}
                          onChange={handleInputChange}
                          className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-6">
                      <label htmlFor="idNumber" className="block text-sm font-medium text-gray-700">
                        {newClient.type === 'individual' ? 'ID Number' : 'Registration Number'}
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="idNumber"
                          id="idNumber"
                          value={newClient.idNumber}
                          onChange={handleInputChange}
                          className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-6">
                      <label htmlFor="address.street" className="block text-sm font-medium text-gray-700">
                        Street address
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="address.street"
                          id="address.street"
                          value={newClient.address.street}
                          onChange={handleInputChange}
                          className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="address.city" className="block text-sm font-medium text-gray-700">
                        City
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="address.city"
                          id="address.city"
                          value={newClient.address.city}
                          onChange={handleInputChange}
                          className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="address.province" className="block text-sm font-medium text-gray-700">
                        Province
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="address.province"
                          id="address.province"
                          value={newClient.address.province}
                          onChange={handleInputChange}
                          className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="address.postalCode" className="block text-sm font-medium text-gray-700">
                        Postal code
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="address.postalCode"
                          id="address.postalCode"
                          value={newClient.address.postalCode}
                          onChange={handleInputChange}
                          className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="onboardingDate" className="block text-sm font-medium text-gray-700">
                        Onboarding Date
                      </label>
                      <div className="mt-1">
                        <input
                          type="date"
                          name="onboardingDate"
                          id="onboardingDate"
                          value={newClient.onboardingDate}
                          onChange={handleInputChange}
                          className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                        />
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
                          value={newClient.status}
                          onChange={handleInputChange}
                          className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                        >
                          {statusOptions.map((option) => (
                            <option key={option.id} value={option.id}>{option.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="sm:col-span-6">
                      <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                        Notes
                      </label>
                      <div className="mt-1">
                        <textarea
                          id="notes"
                          name="notes"
                          rows={3}
                          value={newClient.notes}
                          onChange={handleInputChange}
                          className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                      <p className="mt-2 text-sm text-gray-500">Additional information about this client.</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                    onClick={() => setIsAddingClient(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-[#800000] border border-transparent rounded-md hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                    onClick={handleAddClient}
                    disabled={!newClient.email || (newClient.type === 'individual' ? (!newClient.firstName || !newClient.lastName) : !newClient.company)}
                  >
                    Add Client
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

      {/* Edit Client Modal */}
      <Transition appear show={isEditingClient} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={() => setIsEditingClient(false)}
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
              <div className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Edit Client
                </Dialog.Title>
                
                {selectedClient && (
                  <div className="mt-4 space-y-6">
                    <div>
                      <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                        Client Type
                      </label>
                      <select
                        id="type"
                        name="type"
                        value={selectedClient.type}
                        onChange={handleEditInputChange}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm rounded-md"
                      >
                        {clientTypes.map((type) => (
                          <option key={type.id} value={type.id}>{type.name}</option>
                        ))}
                      </select>
                    </div>

                    {selectedClient.type === 'individual' ? (
                      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                        <div className="sm:col-span-3">
                          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                            First name
                          </label>
                          <div className="mt-1">
                            <input
                              type="text"
                              name="firstName"
                              id="firstName"
                              value={selectedClient.firstName}
                              onChange={handleEditInputChange}
                              className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                            />
                          </div>
                        </div>

                        <div className="sm:col-span-3">
                          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                            Last name
                          </label>
                          <div className="mt-1">
                            <input
                              type="text"
                              name="lastName"
                              id="lastName"
                              value={selectedClient.lastName}
                              onChange={handleEditInputChange}
                              className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                          Company/Organization Name
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            name="company"
                            id="company"
                            value={selectedClient.company}
                            onChange={handleEditInputChange}
                            className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                      <div className="sm:col-span-3">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                          Email address
                        </label>
                        <div className="mt-1">
                          <input
                            type="email"
                            name="email"
                            id="email"
                            value={selectedClient.email}
                            onChange={handleEditInputChange}
                            className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                          Phone number
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            name="phone"
                            id="phone"
                            value={selectedClient.phone}
                            onChange={handleEditInputChange}
                            className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-6">
                        <label htmlFor="idNumber" className="block text-sm font-medium text-gray-700">
                          {selectedClient.type === 'individual' ? 'ID Number' : 'Registration Number'}
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            name="idNumber"
                            id="idNumber"
                            value={selectedClient.idNumber}
                            onChange={handleEditInputChange}
                            className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-6">
                        <label htmlFor="address.street" className="block text-sm font-medium text-gray-700">
                          Street address
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            name="address.street"
                            id="address.street"
                            value={selectedClient.address.street}
                            onChange={handleEditInputChange}
                            className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <label htmlFor="address.city" className="block text-sm font-medium text-gray-700">
                          City
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            name="address.city"
                            id="address.city"
                            value={selectedClient.address.city}
                            onChange={handleEditInputChange}
                            className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <label htmlFor="address.province" className="block text-sm font-medium text-gray-700">
                          Province
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            name="address.province"
                            id="address.province"
                            value={selectedClient.address.province}
                            onChange={handleEditInputChange}
                            className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <label htmlFor="address.postalCode" className="block text-sm font-medium text-gray-700">
                          Postal code
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            name="address.postalCode"
                            id="address.postalCode"
                            value={selectedClient.address.postalCode}
                            onChange={handleEditInputChange}
                            className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label htmlFor="onboardingDate" className="block text-sm font-medium text-gray-700">
                          Onboarding Date
                        </label>
                        <div className="mt-1">
                          <input
                            type="date"
                            name="onboardingDate"
                            id="onboardingDate"
                            value={selectedClient.onboardingDate}
                            onChange={handleEditInputChange}
                            className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                          />
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
                            value={selectedClient.status}
                            onChange={handleEditInputChange}
                            className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                          >
                            {statusOptions.map((option) => (
                              <option key={option.id} value={option.id}>{option.name}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="sm:col-span-6">
                        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                          Notes
                        </label>
                        <div className="mt-1">
                          <textarea
                            id="notes"
                            name="notes"
                            rows={3}
                            value={selectedClient.notes}
                            onChange={handleEditInputChange}
                            className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
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
                    onClick={() => setIsEditingClient(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-[#800000] border border-transparent rounded-md hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                    onClick={handleUpdateClient}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

      {/* View Client Modal */}
      <Transition appear show={isViewingClient} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={() => setIsViewingClient(false)}
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
                {selectedClient && (
                  <>
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <div className="mr-4">
                          <div className="h-16 w-16 rounded-full bg-[#800000] bg-opacity-10 flex items-center justify-center">
                            <HiOutlineUserCircle className="h-10 w-10 text-[#800000]" />
                          </div>
                        </div>
                        <div>
                          <h3 className="text-lg font-medium leading-6 text-gray-900">
                            {getClientName(selectedClient)}
                          </h3>
                          <p className="text-sm text-gray-500">
                            <span className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full bg-[#800000] bg-opacity-10 text-[#800000] mr-2`}>
                              {clientTypes.find(type => type.id === selectedClient.type)?.name}
                            </span>
                            <span className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(selectedClient.status)}`}>
                              {selectedClient.status.charAt(0).toUpperCase() + selectedClient.status.slice(1)}
                            </span>
                          </p>
                        </div>
                      </div>
                      <div>
                        <button
                          type="button"
                          onClick={() => initiateEdit(selectedClient)}
                          className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                        >
                          <HiOutlinePencilAlt className="-ml-1 mr-2 h-5 w-5 text-gray-500" />
                          Edit
                        </button>
                      </div>
                    </div>
                    
                    <div className="mt-6 border-t border-gray-200 pt-4">
                      <h4 className="text-base font-medium text-gray-900">Contact Information</h4>
                      <dl className="mt-2 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                        <div className="sm:col-span-1">
                          <dt className="text-sm font-medium text-gray-500">
                            <div className="flex items-center">
                              <HiOutlineMail className="mr-1 h-4 w-4" />
                              Email
                            </div>
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900">{selectedClient.email}</dd>
                        </div>
                        <div className="sm:col-span-1">
                          <dt className="text-sm font-medium text-gray-500">
                            <div className="flex items-center">
                              <HiOutlinePhone className="mr-1 h-4 w-4" />
                              Phone
                            </div>
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900">{selectedClient.phone}</dd>
                        </div>
                        <div className="sm:col-span-1">
                          <dt className="text-sm font-medium text-gray-500">
                            <div className="flex items-center">
                              <HiOutlineIdentification className="mr-1 h-4 w-4" />
                              {selectedClient.type === 'individual' ? 'ID Number' : 'Registration Number'}
                            </div>
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900">{selectedClient.idNumber}</dd>
                        </div>
                        <div className="sm:col-span-1">
                          <dt className="text-sm font-medium text-gray-500">
                            <div className="flex items-center">
                              <HiOutlineCalendar className="mr-1 h-4 w-4" />
                              Client Since
                            </div>
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {new Date(selectedClient.onboardingDate).toLocaleDateString('en-ZA', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </dd>
                        </div>
                        <div className="sm:col-span-2">
                          <dt className="text-sm font-medium text-gray-500">
                            <div className="flex items-center">
                              <HiOutlineLocationMarker className="mr-1 h-4 w-4" />
                              Address
                            </div>
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {selectedClient.address.street}<br />
                            {selectedClient.address.city}, {selectedClient.address.province} {selectedClient.address.postalCode}<br />
                            {selectedClient.address.country}
                          </dd>
                        </div>
                      </dl>
                    </div>
                    
                    <div className="mt-6 border-t border-gray-200 pt-4">
                      <h4 className="text-base font-medium text-gray-900">Cases & Billing</h4>
                      <div className="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-3">
                        <div className="bg-white overflow-hidden rounded-lg border border-gray-200">
                          <div className="px-4 py-5 sm:p-6">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 bg-[#800000] rounded-md p-3">
                                <HiOutlineBriefcase className="h-6 w-6 text-white" />
                              </div>
                              <div className="ml-5">
                                <dt className="text-sm font-medium text-gray-500 truncate">Active Cases</dt>
                                <dd className="mt-1 text-3xl font-semibold text-gray-900">{selectedClient.cases}</dd>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="bg-white overflow-hidden rounded-lg border border-gray-200">
                          <div className="px-4 py-5 sm:p-6">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                                <HiOutlineCash className="h-6 w-6 text-white" />
                              </div>
                              <div className="ml-5">
                                <dt className="text-sm font-medium text-gray-500 truncate">Total Billing</dt>
                                <dd className="mt-1 text-3xl font-semibold text-gray-900">{formatCurrency(selectedClient.billingTotal)}</dd>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="bg-white overflow-hidden rounded-lg border border-gray-200">
                          <div className="px-4 py-5 sm:p-6">
                            <div className="flex items-center">
                              <div className={`flex-shrink-0 ${selectedClient.outstandingBalance > 0 ? 'bg-red-500' : 'bg-gray-400'} rounded-md p-3`}>
                                <HiOutlineCash className="h-6 w-6 text-white" />
                              </div>
                              <div className="ml-5">
                                <dt className="text-sm font-medium text-gray-500 truncate">Outstanding</dt>
                                <dd className="mt-1 text-3xl font-semibold text-gray-900">{formatCurrency(selectedClient.outstandingBalance)}</dd>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {selectedClient.notes && (
                      <div className="mt-6 border-t border-gray-200 pt-4">
                        <h4 className="text-base font-medium text-gray-900">Notes</h4>
                        <p className="mt-2 text-sm text-gray-600">{selectedClient.notes}</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

      {/* Delete Confirmation Modal */}
      <Transition appear show={isConfirmingDelete} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={() => setIsConfirmingDelete(false)}
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
              <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <HiOutlineExclamation className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="ml-3">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      Delete Client
                    </Dialog.Title>
                  </div>
                </div>
                
                {clientToDelete && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to delete the client "{clientToDelete.type === 'individual' ? 
                        `${clientToDelete.firstName} ${clientToDelete.lastName}` : 
                        clientToDelete.companyName}"? 
                      This action cannot be undone.
                    </p>
                    {clientToDelete.activeCases > 0 && (
                      <div className="mt-2 p-2 bg-yellow-50 rounded-md">
                        <p className="text-sm text-yellow-700 flex items-center">
                          <HiOutlineExclamation className="h-5 w-5 mr-1 text-yellow-500" />
                          Warning: This client has {clientToDelete.activeCases} active cases. Deleting this client may affect those cases.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                    onClick={() => setIsConfirmingDelete(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600"
                    onClick={handleDeleteClient}
                  >
                    Delete Client
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  )
}

export default AdminClientsPage
