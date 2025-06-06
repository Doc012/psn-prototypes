import React, { useState, useEffect, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import {
  HiOutlineUserCircle,
  HiOutlineAcademicCap,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineOfficeBuilding,
  HiOutlineBriefcase,
  HiOutlineCalendar,
  HiOutlineSearch,
  HiOutlineFilter,
  HiOutlinePlus,
  HiOutlinePencilAlt,
  HiOutlineTrash,
  HiOutlineX,
  HiOutlineCheck,
  HiOutlineExclamation,
  HiOutlineClipboardList,
  HiOutlineChevronDown,
  HiOutlineUserGroup,
  HiOutlineLocationMarker
} from 'react-icons/hi';

const AdminAttorneysPage = () => {
  const [attorneys, setAttorneys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isAddingAttorney, setIsAddingAttorney] = useState(false);
  const [isEditingAttorney, setIsEditingAttorney] = useState(false);
  const [selectedAttorney, setSelectedAttorney] = useState(null);
  const [isViewingAttorney, setIsViewingAttorney] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [attorneyToDelete, setAttorneyToDelete] = useState(null);
  
  const [newAttorney, setNewAttorney] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    position: '',
    department: '',
    office: '',
    specialization: '',
    barAdmission: '',
    status: 'active',
    photo: null,
    bio: ''
  });

  // Departments and offices for dropdown selection
  const departments = [
    'Family Law',
    'Corporate Law',
    'Criminal Law',
    'Property Law',
    'Litigation',
    'Conveyancing',
    'Estates & Trusts'
  ];
  
  const offices = [
    'Johannesburg Office',
    'Cape Town Office',
    'Durban Office',
    'Pretoria Office'
  ];
  
  useEffect(() => {
    // Simulating API call to fetch attorneys
    setTimeout(() => {
      const mockAttorneys = [
        {
          id: '1',
          firstName: 'Thabo',
          lastName: 'Mbeki',
          email: 'thabo.mbeki@lawfirm.co.za',
          phone: '011 123 4567',
          position: 'Senior Partner',
          department: 'Corporate Law',
          office: 'Johannesburg Office',
          specialization: 'Mergers & Acquisitions',
          barAdmission: '2001',
          status: 'active',
          photo: 'https://randomuser.me/api/portraits/men/32.jpg',
          bio: 'Thabo is a seasoned corporate lawyer with over 20 years of experience in mergers and acquisitions.',
          cases: 24,
          clientRating: 4.8
        },
        {
          id: '2',
          firstName: 'Naledi',
          lastName: 'Pandor',
          email: 'naledi.pandor@lawfirm.co.za',
          phone: '011 234 5678',
          position: 'Associate',
          department: 'Family Law',
          office: 'Johannesburg Office',
          specialization: 'Divorce Law',
          barAdmission: '2015',
          status: 'active',
          photo: 'https://randomuser.me/api/portraits/women/42.jpg',
          bio: 'Naledi specializes in family law matters, particularly divorce and child custody cases.',
          cases: 18,
          clientRating: 4.5
        },
        {
          id: '3',
          firstName: 'Sipho',
          lastName: 'Nkosi',
          email: 'sipho.nkosi@lawfirm.co.za',
          phone: '021 345 6789',
          position: 'Partner',
          department: 'Litigation',
          office: 'Cape Town Office',
          specialization: 'Commercial Litigation',
          barAdmission: '2008',
          status: 'active',
          photo: 'https://randomuser.me/api/portraits/men/22.jpg',
          bio: 'Sipho has successfully represented clients in complex commercial litigation matters.',
          cases: 32,
          clientRating: 4.7
        },
        {
          id: '4',
          firstName: 'Lerato',
          lastName: 'Moloi',
          email: 'lerato.moloi@lawfirm.co.za',
          phone: '031 456 7890',
          position: 'Senior Associate',
          department: 'Property Law',
          office: 'Durban Office',
          specialization: 'Property Transactions',
          barAdmission: '2012',
          status: 'on leave',
          photo: 'https://randomuser.me/api/portraits/women/29.jpg',
          bio: 'Lerato has extensive experience in property law and real estate transactions.',
          cases: 27,
          clientRating: 4.6
        },
        {
          id: '5',
          firstName: 'Mandla',
          lastName: 'Zulu',
          email: 'mandla.zulu@lawfirm.co.za',
          phone: '012 567 8901',
          position: 'Junior Associate',
          department: 'Criminal Law',
          office: 'Pretoria Office',
          specialization: 'Criminal Defense',
          barAdmission: '2018',
          status: 'active',
          photo: 'https://randomuser.me/api/portraits/men/45.jpg',
          bio: 'Mandla is passionate about criminal defense and protecting the rights of the accused.',
          cases: 15,
          clientRating: 4.4
        }
      ];
      
      setAttorneys(mockAttorneys);
      setLoading(false);
    }, 1000);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAttorney({
      ...newAttorney,
      [name]: value
    });
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedAttorney({
      ...selectedAttorney,
      [name]: value
    });
  };

  const handleAddAttorney = () => {
    const attorney = {
      ...newAttorney,
      id: (attorneys.length + 1).toString(),
      cases: 0,
      clientRating: 0
    };
    
    setAttorneys([...attorneys, attorney]);
    setNewAttorney({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      position: '',
      department: '',
      office: '',
      specialization: '',
      barAdmission: '',
      status: 'active',
      photo: null,
      bio: ''
    });
    
    setIsAddingAttorney(false);
  };

  const handleUpdateAttorney = () => {
    const updatedAttorneys = attorneys.map(attorney => 
      attorney.id === selectedAttorney.id ? selectedAttorney : attorney
    );
    
    setAttorneys(updatedAttorneys);
    setSelectedAttorney(null);
    setIsEditingAttorney(false);
  };

  const handleDeleteAttorney = () => {
    const updatedAttorneys = attorneys.filter(
      attorney => attorney.id !== attorneyToDelete.id
    );
    
    setAttorneys(updatedAttorneys);
    setAttorneyToDelete(null);
    setIsConfirmingDelete(false);
  };

  const initiateEdit = (attorney) => {
    setSelectedAttorney(attorney);
    setIsEditingAttorney(true);
  };

  const initiateDelete = (attorney) => {
    setAttorneyToDelete(attorney);
    setIsConfirmingDelete(true);
  };

  const viewAttorney = (attorney) => {
    setSelectedAttorney(attorney);
    setIsViewingAttorney(true);
  };

  const filteredAttorneys = attorneys
    .filter(attorney => 
      (filterStatus === 'all' || attorney.status === filterStatus) &&
      (
        attorney.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        attorney.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        attorney.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        attorney.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        attorney.position.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

  // Get status badge color
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'on leave':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Attorneys Management</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage attorneys, partners, and legal staff in your firm
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <button
              onClick={() => setIsAddingAttorney(true)}
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#800000] hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
            >
              <HiOutlinePlus className="-ml-1 mr-2 h-5 w-5" />
              Add Attorney
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
                    placeholder="Search attorneys..."
                  />
                </div>
              </div>
              <div className="mt-2 md:mt-0 flex items-center">
                <HiOutlineFilter className="mr-2 h-5 w-5 text-gray-400" />
                <span className="mr-2 text-sm text-gray-500">Filter:</span>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm rounded-md"
                >
                  <option value="all">All</option>
                  <option value="active">Active</option>
                  <option value="on leave">On Leave</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-solid border-[#800000] border-r-transparent"></div>
              <p className="mt-4 text-gray-500">Loading attorneys...</p>
            </div>
          ) : (
            <>
              {filteredAttorneys.length === 0 ? (
                <div className="text-center py-12">
                  <HiOutlineUserCircle className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No attorneys found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {searchTerm ? `No results for "${searchTerm}"` : 'Add attorneys to your firm'}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Attorney
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Department & Office
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Contact
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Cases
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredAttorneys.map((attorney) => (
                        <tr key={attorney.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                {attorney.photo ? (
                                  <img className="h-10 w-10 rounded-full" src={attorney.photo} alt="" />
                                ) : (
                                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                    <HiOutlineUserCircle className="h-6 w-6 text-gray-400" />
                                  </div>
                                )}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{attorney.firstName} {attorney.lastName}</div>
                                <div className="text-sm text-gray-500">{attorney.position}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{attorney.department}</div>
                            <div className="text-sm text-gray-500">{attorney.office}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{attorney.email}</div>
                            <div className="text-sm text-gray-500">{attorney.phone}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(attorney.status)}`}>
                              {attorney.status.charAt(0).toUpperCase() + attorney.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex items-center">
                              <HiOutlineBriefcase className="mr-1 h-4 w-4 text-gray-400" />
                              {attorney.cases} active
                            </div>
                            <div className="flex items-center mt-1">
                              <div className="flex text-yellow-400">
                                {[...Array(5)].map((_, i) => (
                                  <svg key={i} className={`h-4 w-4 ${i < Math.floor(attorney.clientRating) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                ))}
                                <span className="ml-1 text-xs text-gray-500">{attorney.clientRating}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => viewAttorney(attorney)}
                              className="text-gray-600 hover:text-gray-900 mr-3"
                            >
                              View
                            </button>
                            <button
                              onClick={() => initiateEdit(attorney)}
                              className="text-[#800000] hover:text-[#600000] mr-3"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => initiateDelete(attorney)}
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

      {/* Add Attorney Modal */}
      <Transition appear show={isAddingAttorney} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={() => setIsAddingAttorney(false)}
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
                  Add New Attorney
                </Dialog.Title>
                
                <div className="mt-4 space-y-6">
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
                          value={newAttorney.firstName}
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
                          value={newAttorney.lastName}
                          onChange={handleInputChange}
                          className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email address
                      </label>
                      <div className="mt-1">
                        <input
                          type="email"
                          name="email"
                          id="email"
                          value={newAttorney.email}
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
                          value={newAttorney.phone}
                          onChange={handleInputChange}
                          className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="position" className="block text-sm font-medium text-gray-700">
                        Position
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="position"
                          id="position"
                          value={newAttorney.position}
                          onChange={handleInputChange}
                          className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                          placeholder="e.g., Associate, Partner"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                        Department
                      </label>
                      <div className="mt-1">
                        <select
                          id="department"
                          name="department"
                          value={newAttorney.department}
                          onChange={handleInputChange}
                          className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                        >
                          <option value="">Select a department</option>
                          {departments.map((dept) => (
                            <option key={dept} value={dept}>{dept}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="office" className="block text-sm font-medium text-gray-700">
                        Office
                      </label>
                      <div className="mt-1">
                        <select
                          id="office"
                          name="office"
                          value={newAttorney.office}
                          onChange={handleInputChange}
                          className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                        >
                          <option value="">Select an office</option>
                          {offices.map((office) => (
                            <option key={office} value={office}>{office}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="specialization" className="block text-sm font-medium text-gray-700">
                        Specialization
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="specialization"
                          id="specialization"
                          value={newAttorney.specialization}
                          onChange={handleInputChange}
                          className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="barAdmission" className="block text-sm font-medium text-gray-700">
                        Bar Admission Year
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="barAdmission"
                          id="barAdmission"
                          value={newAttorney.barAdmission}
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
                          value={newAttorney.status}
                          onChange={handleInputChange}
                          className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                        >
                          <option value="active">Active</option>
                          <option value="on leave">On Leave</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </div>
                    </div>

                    <div className="sm:col-span-6">
                      <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                        Bio
                      </label>
                      <div className="mt-1">
                        <textarea
                          id="bio"
                          name="bio"
                          rows={4}
                          value={newAttorney.bio}
                          onChange={handleInputChange}
                          className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                      <p className="mt-2 text-sm text-gray-500">Brief description of the attorney's background and expertise.</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                    onClick={() => setIsAddingAttorney(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-[#800000] border border-transparent rounded-md hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                    onClick={handleAddAttorney}
                    disabled={!newAttorney.firstName || !newAttorney.lastName || !newAttorney.email}
                  >
                    Add Attorney
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

      {/* Edit Attorney Modal */}
      <Transition appear show={isEditingAttorney} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={() => setIsEditingAttorney(false)}
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
                  Edit Attorney
                </Dialog.Title>
                
                {selectedAttorney && (
                  <div className="mt-4 space-y-6">
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
                            value={selectedAttorney.firstName}
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
                            value={selectedAttorney.lastName}
                            onChange={handleEditInputChange}
                            className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                          Email address
                        </label>
                        <div className="mt-1">
                          <input
                            type="email"
                            name="email"
                            id="email"
                            value={selectedAttorney.email}
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
                            value={selectedAttorney.phone}
                            onChange={handleEditInputChange}
                            className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label htmlFor="position" className="block text-sm font-medium text-gray-700">
                          Position
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            name="position"
                            id="position"
                            value={selectedAttorney.position}
                            onChange={handleEditInputChange}
                            className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                          Department
                        </label>
                        <div className="mt-1">
                          <select
                            id="department"
                            name="department"
                            value={selectedAttorney.department}
                            onChange={handleEditInputChange}
                            className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                          >
                            {departments.map((dept) => (
                              <option key={dept} value={dept}>{dept}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label htmlFor="office" className="block text-sm font-medium text-gray-700">
                          Office
                        </label>
                        <div className="mt-1">
                          <select
                            id="office"
                            name="office"
                            value={selectedAttorney.office}
                            onChange={handleEditInputChange}
                            className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                          >
                            {offices.map((office) => (
                              <option key={office} value={office}>{office}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label htmlFor="specialization" className="block text-sm font-medium text-gray-700">
                          Specialization
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            name="specialization"
                            id="specialization"
                            value={selectedAttorney.specialization}
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
                            value={selectedAttorney.status}
                            onChange={handleEditInputChange}
                            className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                          >
                            <option value="active">Active</option>
                            <option value="on leave">On Leave</option>
                            <option value="inactive">Inactive</option>
                          </select>
                        </div>
                      </div>

                      <div className="sm:col-span-6">
                        <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                          Bio
                        </label>
                        <div className="mt-1">
                          <textarea
                            id="bio"
                            name="bio"
                            rows={4}
                            value={selectedAttorney.bio}
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
                    onClick={() => setIsEditingAttorney(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-[#800000] border border-transparent rounded-md hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                    onClick={handleUpdateAttorney}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

      {/* View Attorney Modal */}
      <Transition appear show={isViewingAttorney} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={() => setIsViewingAttorney(false)}
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
                {selectedAttorney && (
                  <>
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <div className="mr-4">
                          {selectedAttorney.photo ? (
                            <img 
                              src={selectedAttorney.photo} 
                              alt={`${selectedAttorney.firstName} ${selectedAttorney.lastName}`}
                              className="h-16 w-16 rounded-full object-cover"
                            />
                          ) : (
                            <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
                              <HiOutlineUserCircle className="h-8 w-8 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="text-lg font-medium leading-6 text-gray-900">
                            {selectedAttorney.firstName} {selectedAttorney.lastName}
                          </h3>
                          <p className="text-sm text-gray-500">{selectedAttorney.position}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(selectedAttorney.status)}`}>
                        {selectedAttorney.status.charAt(0).toUpperCase() + selectedAttorney.status.slice(1)}
                      </span>
                    </div>
                    
                    <div className="mt-6 border-t border-gray-200 pt-4">
                      <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                        <div className="sm:col-span-1">
                          <dt className="text-sm font-medium text-gray-500">
                            <div className="flex items-center">
                              <HiOutlineMail className="mr-1 h-4 w-4" />
                              Email
                            </div>
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900">{selectedAttorney.email}</dd>
                        </div>
                        <div className="sm:col-span-1">
                          <dt className="text-sm font-medium text-gray-500">
                            <div className="flex items-center">
                              <HiOutlinePhone className="mr-1 h-4 w-4" />
                              Phone
                            </div>
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900">{selectedAttorney.phone}</dd>
                        </div>
                        <div className="sm:col-span-1">
                          <dt className="text-sm font-medium text-gray-500">
                            <div className="flex items-center">
                              <HiOutlineBriefcase className="mr-1 h-4 w-4" />
                              Department
                            </div>
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900">{selectedAttorney.department}</dd>
                        </div>
                        <div className="sm:col-span-1">
                          <dt className="text-sm font-medium text-gray-500">
                            <div className="flex items-center">
                              <HiOutlineOfficeBuilding className="mr-1 h-4 w-4" />
                              Office
                            </div>
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900">{selectedAttorney.office}</dd>
                        </div>
                        <div className="sm:col-span-1">
                          <dt className="text-sm font-medium text-gray-500">
                            <div className="flex items-center">
                              <HiOutlineAcademicCap className="mr-1 h-4 w-4" />
                              Specialization
                            </div>
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900">{selectedAttorney.specialization}</dd>
                        </div>
                        <div className="sm:col-span-1">
                          <dt className="text-sm font-medium text-gray-500">
                            <div className="flex items-center">
                              <HiOutlineCalendar className="mr-1 h-4 w-4" />
                              Bar Admission
                            </div>
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900">{selectedAttorney.barAdmission}</dd>
                        </div>
                        <div className="sm:col-span-2">
                          <dt className="text-sm font-medium text-gray-500">Bio</dt>
                          <dd className="mt-1 text-sm text-gray-900">{selectedAttorney.bio}</dd>
                        </div>
                      </dl>
                    </div>
                    
                    <div className="mt-6 border-t border-gray-200 pt-4">
                      <h4 className="text-sm font-medium text-gray-500">Performance</h4>
                      <div className="mt-2 grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <div className="bg-white overflow-hidden rounded-lg border border-gray-200">
                          <div className="px-4 py-5 sm:p-6">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 bg-[#800000] rounded-md p-3">
                                <HiOutlineClipboardList className="h-6 w-6 text-white" />
                              </div>
                              <div className="ml-5">
                                <dt className="text-sm font-medium text-gray-500 truncate">Active Cases</dt>
                                <dd className="mt-1 text-3xl font-semibold text-gray-900">{selectedAttorney.cases}</dd>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="bg-white overflow-hidden rounded-lg border border-gray-200">
                          <div className="px-4 py-5 sm:p-6">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                                <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              </div>
                              <div className="ml-5">
                                <dt className="text-sm font-medium text-gray-500 truncate">Client Rating</dt>
                                <dd className="mt-1 text-3xl font-semibold text-gray-900">{selectedAttorney.clientRating}</dd>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 flex justify-end">
                      <button
                        type="button"
                        className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                        onClick={() => setIsViewingAttorney(false)}
                      >
                        Close
                      </button>
                    </div>
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
                      Delete Attorney
                    </Dialog.Title>
                  </div>
                </div>
                
                {attorneyToDelete && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to delete {attorneyToDelete.firstName} {attorneyToDelete.lastName}? This action cannot be undone.
                    </p>
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
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    onClick={handleDeleteAttorney}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default AdminAttorneysPage;
