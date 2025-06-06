// Alternative approach - import specific components
import React, { useState, useEffect, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Disclosure } from '@headlessui/react';
import { Tab } from '@headlessui/react';
import {
  HiOutlineOfficeBuilding,
  HiOutlineLocationMarker,
  HiOutlinePhone,
  HiOutlineMail,
  HiOutlineGlobe,
  HiOutlineUserGroup,
  HiOutlineAcademicCap,
  HiOutlineDocumentDuplicate,
  HiOutlineCog,
  HiOutlinePlusCircle,
  HiOutlineTrash,
  HiOutlinePencilAlt,
  HiOutlineX,
  HiOutlineCheck,
  HiOutlineExclamation,
  HiOutlinePhotograph,
  HiOutlineBriefcase,
  HiOutlineChevronDown,
  HiOutlineUserCircle,
  HiOutlineShieldCheck,
  HiOutlineChartBar,
  HiOutlineClipboardCheck,
  HiOutlineLibrary,
  HiOutlineFingerPrint,
  HiOutlineCash
} from 'react-icons/hi';

const AdminFirmManagementPage = () => {
  const [loading, setLoading] = useState(true);
  const [firmData, setFirmData] = useState(null);
  const [isEditingFirm, setIsEditingFirm] = useState(false);
  const [editedFirmData, setEditedFirmData] = useState({});
  
  const [offices, setOffices] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [isAddingOffice, setIsAddingOffice] = useState(false);
  const [isAddingDepartment, setIsAddingDepartment] = useState(false);
  const [newOffice, setNewOffice] = useState({
    name: '',
    address: '',
    city: '',
    phone: '',
    email: '',
    isMainOffice: false
  });
  const [newDepartment, setNewDepartment] = useState({
    name: '',
    head: '',
    description: '',
    headCount: 0
  });
  
  const [isLogoDialogOpen, setIsLogoDialogOpen] = useState(false);
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteType, setDeleteType] = useState('');

  // Load firm data
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockFirmData = {
        id: '1',
        name: 'Nkosi, Dlamini & Partners',
        logo: 'https://placehold.co/400x200?text=NDP',
        registrationNumber: '2005/012345/21',
        vatNumber: '4230142398',
        phone: '011 234 5678',
        email: 'info@ndplaw.co.za',
        website: 'www.ndplaw.co.za',
        address: {
          street: '123 Main Street',
          city: 'Sandton',
          province: 'Gauteng',
          postalCode: '2196',
          country: 'South Africa'
        },
        established: 2005,
        practiceAreas: [
          'Corporate Law',
          'Commercial Litigation',
          'Property Law',
          'Intellectual Property',
          'Labour Law',
          'Family Law'
        ],
        description: 'Nkosi, Dlamini & Partners is a full-service law firm based in Johannesburg with offices across South Africa. With over 15 years of experience, our team of expert attorneys provide comprehensive legal services to businesses and individuals.',
        settings: {
          billingCycle: 'Monthly',
          defaultHourlyRate: 1500,
          currency: 'ZAR',
          taxRate: 15,
          clientPortalEnabled: true,
          twoFactorAuthRequired: true,
          documentRetentionPeriod: 7 // years
        }
      };
      
      const mockOffices = [
        {
          id: '1',
          name: 'Sandton (Head Office)',
          address: '123 Main Street, Sandton',
          city: 'Johannesburg',
          province: 'Gauteng',
          postalCode: '2196',
          phone: '011 234 5678',
          email: 'sandton@ndplaw.co.za',
          isMainOffice: true,
          staff: 45
        },
        {
          id: '2',
          name: 'Cape Town Office',
          address: '78 Long Street',
          city: 'Cape Town',
          province: 'Western Cape',
          postalCode: '8001',
          phone: '021 987 6543',
          email: 'capetown@ndplaw.co.za',
          isMainOffice: false,
          staff: 18
        },
        {
          id: '3',
          name: 'Durban Office',
          address: '15 Marine Parade',
          city: 'Durban',
          province: 'KwaZulu-Natal',
          postalCode: '4001',
          phone: '031 765 4321',
          email: 'durban@ndplaw.co.za',
          isMainOffice: false,
          staff: 12
        }
      ];
      
      const mockDepartments = [
        {
          id: '1',
          name: 'Corporate Law',
          head: 'Sipho Nkosi',
          headTitle: 'Managing Partner',
          description: 'Specializing in mergers and acquisitions, corporate restructuring, and commercial contracts.',
          headCount: 8
        },
        {
          id: '2',
          name: 'Litigation',
          head: 'Thandi Dlamini',
          headTitle: 'Senior Partner',
          description: 'Handling all aspects of commercial litigation, dispute resolution and arbitration.',
          headCount: 12
        },
        {
          id: '3',
          name: 'Property & Conveyancing',
          head: 'James Molefe',
          headTitle: 'Partner',
          description: 'Specializing in property transactions, conveyancing, and real estate development.',
          headCount: 6
        },
        {
          id: '4',
          name: 'Labour & Employment',
          head: 'Sarah Naidoo',
          headTitle: 'Partner',
          description: 'Advising on employment contracts, labour disputes, and workplace compliance.',
          headCount: 5
        },
        {
          id: '5',
          name: 'Intellectual Property',
          head: 'Michael van der Merwe',
          headTitle: 'Partner',
          description: 'Managing trademarks, patents, copyright matters, and IP litigation.',
          headCount: 4
        }
      ];
      
      setFirmData(mockFirmData);
      setEditedFirmData(mockFirmData);
      setOffices(mockOffices);
      setDepartments(mockDepartments);
      setLoading(false);
    }, 1000);
  }, []);

  const handleFirmDataChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setEditedFirmData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setEditedFirmData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSaveFirmData = () => {
    setFirmData(editedFirmData);
    setIsEditingFirm(false);
    // Show success toast or notification here
  };

  const handleAddOffice = () => {
    const officeToAdd = {
      id: `${Date.now()}`,
      ...newOffice
    };
    setOffices(prev => [...prev, officeToAdd]);
    setNewOffice({
      name: '',
      address: '',
      city: '',
      phone: '',
      email: '',
      isMainOffice: false
    });
    setIsAddingOffice(false);
    // Show success toast
  };

  const handleAddDepartment = () => {
    const departmentToAdd = {
      id: `${Date.now()}`,
      ...newDepartment
    };
    setDepartments(prev => [...prev, departmentToAdd]);
    setNewDepartment({
      name: '',
      head: '',
      description: '',
      headCount: 0
    });
    setIsAddingDepartment(false);
    // Show success toast
  };

  const handleConfirmDelete = () => {
    if (deleteType === 'office') {
      setOffices(prev => prev.filter(office => office.id !== itemToDelete));
    } else if (deleteType === 'department') {
      setDepartments(prev => prev.filter(dept => dept.id !== itemToDelete));
    }
    setIsConfirmDeleteOpen(false);
    setItemToDelete(null);
  };

  const initiateDelete = (id, type) => {
    setItemToDelete(id);
    setDeleteType(type);
    setIsConfirmDeleteOpen(true);
  };

  // Tab definitions
  const tabs = [
    { name: 'Firm Profile', icon: HiOutlineOfficeBuilding },
    { name: 'Offices & Locations', icon: HiOutlineLocationMarker },
    { name: 'Departments', icon: HiOutlineUserGroup },
    { name: 'Settings', icon: HiOutlineCog }
  ];

  if (loading) {
    return (
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex justify-center items-center">
            <div className="animate-pulse flex flex-col items-center">
              <HiOutlineOfficeBuilding className="h-10 w-10 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-500">Loading firm data...</h3>
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
            <h1 className="text-2xl font-semibold text-gray-900">Firm Management</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your firm's details, offices, departments, and settings
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-5">
        <Tab.Group onChange={setSelectedTabIndex}>
          <Tab.List className="flex p-1 space-x-1 bg-white rounded-xl shadow">
            {tabs.map((tab) => (
              <Tab
                key={tab.name}
                className={({ selected }) =>
                  `w-full py-2.5 text-sm leading-5 font-medium rounded-lg
                  ${
                    selected
                      ? 'bg-[#800000] text-white'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }
                  flex items-center justify-center`
                }
              >
                <tab.icon className="w-5 h-5 mr-2" />
                {tab.name}
              </Tab>
            ))}
          </Tab.List>
          <Tab.Panels className="mt-2">
            {/* Firm Profile Panel */}
            <Tab.Panel className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-4 py-5 sm:px-6 flex justify-between items-center border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Firm Information</h3>
                <button
                  type="button"
                  onClick={() => setIsEditingFirm(!isEditingFirm)}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                >
                  {isEditingFirm ? (
                    <>
                      <HiOutlineX className="-ml-1 mr-2 h-5 w-5 text-gray-500" />
                      Cancel
                    </>
                  ) : (
                    <>
                      <HiOutlinePencilAlt className="-ml-1 mr-2 h-5 w-5 text-gray-500" />
                      Edit
                    </>
                  )}
                </button>
              </div>

              <div className="flex flex-col md:flex-row border-b border-gray-200">
                <div className="px-4 py-5 sm:px-6 md:w-1/3 border-b md:border-b-0 md:border-r border-gray-200">
                  <div className="flex flex-col items-center">
                    <div className="w-40 h-40 bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center relative">
                      {firmData.logo ? (
                        <img 
                          src={firmData.logo} 
                          alt={`${firmData.name} logo`} 
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <HiOutlineOfficeBuilding className="h-20 w-20 text-gray-400" />
                      )}
                      <button
                        onClick={() => setIsLogoDialogOpen(true)}
                        className="absolute bottom-0 right-0 bg-white rounded-tl-md p-1 shadow-md border border-gray-200"
                      >
                        <HiOutlinePencilAlt className="h-5 w-5 text-gray-500" />
                      </button>
                    </div>
                    <h3 className="mt-3 text-lg font-medium text-gray-900 text-center">{firmData.name}</h3>
                    <p className="text-sm text-gray-500 text-center">Est. {firmData.established}</p>
                  </div>
                </div>

                <div className="px-4 py-5 sm:px-6 md:w-2/3">
                  {isEditingFirm ? (
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Firm Name</label>
                        <input
                          type="text"
                          name="name"
                          id="name"
                          value={editedFirmData.name}
                          onChange={handleFirmDataChange}
                          className="mt-1 focus:ring-[#800000] focus:border-[#800000] block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="registrationNumber" className="block text-sm font-medium text-gray-700">Registration Number</label>
                          <input
                            type="text"
                            name="registrationNumber"
                            id="registrationNumber"
                            value={editedFirmData.registrationNumber}
                            onChange={handleFirmDataChange}
                            className="mt-1 focus:ring-[#800000] focus:border-[#800000] block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                        <div>
                          <label htmlFor="vatNumber" className="block text-sm font-medium text-gray-700">VAT Number</label>
                          <input
                            type="text"
                            name="vatNumber"
                            id="vatNumber"
                            value={editedFirmData.vatNumber}
                            onChange={handleFirmDataChange}
                            className="mt-1 focus:ring-[#800000] focus:border-[#800000] block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
                          <input
                            type="text"
                            name="phone"
                            id="phone"
                            value={editedFirmData.phone}
                            onChange={handleFirmDataChange}
                            className="mt-1 focus:ring-[#800000] focus:border-[#800000] block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                          <input
                            type="email"
                            name="email"
                            id="email"
                            value={editedFirmData.email}
                            onChange={handleFirmDataChange}
                            className="mt-1 focus:ring-[#800000] focus:border-[#800000] block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="website" className="block text-sm font-medium text-gray-700">Website</label>
                        <input
                          type="text"
                          name="website"
                          id="website"
                          value={editedFirmData.website}
                          onChange={handleFirmDataChange}
                          className="mt-1 focus:ring-[#800000] focus:border-[#800000] block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>

                      <div>
                        <label htmlFor="address.street" className="block text-sm font-medium text-gray-700">Street Address</label>
                        <input
                          type="text"
                          name="address.street"
                          id="address.street"
                          value={editedFirmData.address.street}
                          onChange={handleFirmDataChange}
                          className="mt-1 focus:ring-[#800000] focus:border-[#800000] block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="address.city" className="block text-sm font-medium text-gray-700">City</label>
                          <input
                            type="text"
                            name="address.city"
                            id="address.city"
                            value={editedFirmData.address.city}
                            onChange={handleFirmDataChange}
                            className="mt-1 focus:ring-[#800000] focus:border-[#800000] block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                        <div>
                          <label htmlFor="address.province" className="block text-sm font-medium text-gray-700">Province</label>
                          <input
                            type="text"
                            name="address.province"
                            id="address.province"
                            value={editedFirmData.address.province}
                            onChange={handleFirmDataChange}
                            className="mt-1 focus:ring-[#800000] focus:border-[#800000] block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="address.postalCode" className="block text-sm font-medium text-gray-700">Postal Code</label>
                          <input
                            type="text"
                            name="address.postalCode"
                            id="address.postalCode"
                            value={editedFirmData.address.postalCode}
                            onChange={handleFirmDataChange}
                            className="mt-1 focus:ring-[#800000] focus:border-[#800000] block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                        <div>
                          <label htmlFor="address.country" className="block text-sm font-medium text-gray-700">Country</label>
                          <input
                            type="text"
                            name="address.country"
                            id="address.country"
                            value={editedFirmData.address.country}
                            onChange={handleFirmDataChange}
                            className="mt-1 focus:ring-[#800000] focus:border-[#800000] block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Firm Description</label>
                        <textarea
                          id="description"
                          name="description"
                          rows={3}
                          value={editedFirmData.description}
                          onChange={handleFirmDataChange}
                          className="mt-1 focus:ring-[#800000] focus:border-[#800000] block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>

                      <div className="flex justify-end pt-4">
                        <button
                          type="button"
                          onClick={() => {
                            setEditedFirmData(firmData);
                            setIsEditingFirm(false);
                          }}
                          className="mr-3 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={handleSaveFirmData}
                          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#800000] hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Registration Number</h4>
                        <p className="mt-1 text-sm text-gray-900">{firmData.registrationNumber}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">VAT Number</h4>
                        <p className="mt-1 text-sm text-gray-900">{firmData.vatNumber}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Phone</h4>
                        <p className="mt-1 text-sm text-gray-900 flex items-center">
                          <HiOutlinePhone className="mr-1 h-4 w-4 text-gray-400" />
                          {firmData.phone}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Email</h4>
                        <p className="mt-1 text-sm text-gray-900 flex items-center">
                          <HiOutlineMail className="mr-1 h-4 w-4 text-gray-400" />
                          {firmData.email}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Website</h4>
                        <p className="mt-1 text-sm text-gray-900 flex items-center">
                          <HiOutlineGlobe className="mr-1 h-4 w-4 text-gray-400" />
                          {firmData.website}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Address</h4>
                        <p className="mt-1 text-sm text-gray-900 flex items-start">
                          <HiOutlineLocationMarker className="mr-1 h-4 w-4 text-gray-400 mt-0.5" />
                          <span>
                            {firmData.address.street}, {firmData.address.city}<br />
                            {firmData.address.province}, {firmData.address.postalCode}<br />
                            {firmData.address.country}
                          </span>
                        </p>
                      </div>
                      <div className="md:col-span-2 mt-2">
                        <h4 className="text-sm font-medium text-gray-500">Description</h4>
                        <p className="mt-1 text-sm text-gray-900">{firmData.description}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Practice Areas</h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {firmData.practiceAreas.map((area, index) => (
                    <span 
                      key={index}
                      className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-[#800000] bg-opacity-10 text-[#800000]"
                    >
                      {area}
                    </span>
                  ))}
                  {isEditingFirm && (
                    <button
                      type="button"
                      className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-gray-100 text-gray-800 hover:bg-gray-200"
                    >
                      <HiOutlinePlusCircle className="-ml-1 mr-1 h-4 w-4" />
                      Add Area
                    </button>
                  )}
                </div>
              </div>
            </Tab.Panel>

            {/* Offices & Locations Panel */}
            <Tab.Panel className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Offices & Locations</h3>
                <button
                  type="button"
                  onClick={() => setIsAddingOffice(true)}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#800000] hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                >
                  <HiOutlinePlusCircle className="-ml-1 mr-2 h-5 w-5" />
                  Add Office
                </button>
              </div>

              <div className="px-4 py-5 sm:px-6">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {offices.map((office) => (
                    <div key={office.id} className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
                      <div className="px-4 py-4 border-b border-gray-200 flex justify-between">
                        <h3 className="text-lg font-medium text-gray-900 truncate">{office.name}</h3>
                        <div className="flex">
                          <button
                            type="button"
                            className="text-gray-400 hover:text-gray-500"
                          >
                            <HiOutlinePencilAlt className="h-5 w-5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => initiateDelete(office.id, 'office')}
                            className="ml-2 text-gray-400 hover:text-red-500"
                          >
                            <HiOutlineTrash className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                      <div className="px-4 py-4 space-y-2">
                        <p className="text-sm text-gray-500 flex items-start">
                          <HiOutlineLocationMarker className="mr-1 h-4 w-4 text-gray-400 mt-0.5" />
                          <span>{office.address}, {office.city}</span>
                        </p>
                        <p className="text-sm text-gray-500 flex items-center">
                          <HiOutlinePhone className="mr-1 h-4 w-4 text-gray-400" />
                          {office.phone}
                        </p>
                        <p className="text-sm text-gray-500 flex items-center">
                          <HiOutlineMail className="mr-1 h-4 w-4 text-gray-400" />
                          {office.email}
                        </p>
                        <div className="flex justify-between items-center pt-2">
                          <div className="flex items-center">
                            <HiOutlineUserGroup className="mr-1 h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-900">{office.staff} staff members</span>
                          </div>
                          {office.isMainOffice && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Main Office
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Tab.Panel>

            {/* Departments Panel */}
            <Tab.Panel className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Departments</h3>
                <button
                  type="button"
                  onClick={() => setIsAddingDepartment(true)}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#800000] hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                >
                  <HiOutlinePlusCircle className="-ml-1 mr-2 h-5 w-5" />
                  Add Department
                </button>
              </div>

              <div className="px-4 py-5 sm:px-6">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {departments.map((department) => (
                    <div key={department.id} className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
                      <div className="px-4 py-4 border-b border-gray-200 flex justify-between">
                        <h3 className="text-lg font-medium text-gray-900">{department.name}</h3>
                        <div className="flex">
                          <button
                            type="button"
                            className="text-gray-400 hover:text-gray-500"
                          >
                            <HiOutlinePencilAlt className="h-5 w-5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => initiateDelete(department.id, 'department')}
                            className="ml-2 text-gray-400 hover:text-red-500"
                          >
                            <HiOutlineTrash className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                      <div className="px-4 py-4">
                        <div className="flex items-start">
                          <div className="flex-shrink-0">
                            <HiOutlineUserCircle className="h-10 w-10 text-gray-400" />
                          </div>
                          <div className="ml-3">
                            <h4 className="text-sm font-medium text-gray-900">{department.head}</h4>
                            <p className="text-sm text-gray-500">{department.headTitle}</p>
                          </div>
                        </div>
                        <p className="mt-3 text-sm text-gray-500">{department.description}</p>
                        <div className="mt-3 flex justify-between items-center">
                          <div className="flex items-center">
                            <HiOutlineUserGroup className="mr-1 h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-500">{department.headCount} staff members</span>
                          </div>
                          <button
                            type="button"
                            className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                          >
                            View Staff
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Tab.Panel>

            {/* Settings Panel */}
            <Tab.Panel className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Firm Settings</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Configure global settings for your firm
                </p>
              </div>

              <div className="px-4 py-5 sm:px-6 space-y-6">
                <Disclosure as="div" defaultOpen={false}>
                  {({ open }) => (
                    <div className="mt-2">
                      <Disclosure.Button className="flex justify-between w-full px-4 py-3 text-sm font-medium text-left text-gray-900 bg-gray-50 rounded-lg hover:bg-gray-100 focus:outline-none focus-visible:ring focus-visible:ring-[#800000] focus-visible:ring-opacity-75">
                        <div className="flex items-center">
                          <HiOutlineCash className="mr-3 h-5 w-5 text-gray-500" />
                          <span>Billing & Finance</span>
                        </div>
                        <HiOutlineChevronDown
                          className={`${
                            open ? 'transform rotate-180' : ''
                          } w-5 h-5 text-gray-500`}
                        />
                      </Disclosure.Button>
                      <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label htmlFor="billingCycle" className="block text-sm font-medium text-gray-700">Billing Cycle</label>
                              <select
                                id="billingCycle"
                                name="billingCycle"
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm rounded-md"
                                defaultValue={firmData.settings.billingCycle}
                              >
                                <option>Weekly</option>
                                <option>Bi-weekly</option>
                                <option>Monthly</option>
                                <option>Quarterly</option>
                              </select>
                            </div>
                            <div>
                              <label htmlFor="defaultRate" className="block text-sm font-medium text-gray-700">Default Hourly Rate (ZAR)</label>
                              <input
                                type="number"
                                name="defaultRate"
                                id="defaultRate"
                                defaultValue={firmData.settings.defaultHourlyRate}
                                className="mt-1 focus:ring-[#800000] focus:border-[#800000] block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label htmlFor="currency" className="block text-sm font-medium text-gray-700">Currency</label>
                              <select
                                id="currency"
                                name="currency"
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm rounded-md"
                                defaultValue={firmData.settings.currency}
                              >
                                <option value="ZAR">South African Rand (ZAR)</option>
                                <option value="USD">US Dollar (USD)</option>
                                <option value="EUR">Euro (EUR)</option>
                                <option value="GBP">British Pound (GBP)</option>
                              </select>
                            </div>
                            <div>
                              <label htmlFor="taxRate" className="block text-sm font-medium text-gray-700">Default Tax Rate (%)</label>
                              <input
                                type="number"
                                name="taxRate"
                                id="taxRate"
                                defaultValue={firmData.settings.taxRate}
                                className="mt-1 focus:ring-[#800000] focus:border-[#800000] block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                              />
                            </div>
                          </div>
                        </div>
                      </Disclosure.Panel>
                    </div>
                  )}
                </Disclosure>

                <Disclosure as="div" defaultOpen={false}>
                  {({ open }) => (
                    <div className="mt-2">
                      <Disclosure.Button className="flex justify-between w-full px-4 py-3 text-sm font-medium text-left text-gray-900 bg-gray-50 rounded-lg hover:bg-gray-100 focus:outline-none focus-visible:ring focus-visible:ring-[#800000] focus-visible:ring-opacity-75">
                        <div className="flex items-center">
                          <HiOutlineShieldCheck className="mr-3 h-5 w-5 text-gray-500" />
                          <span>Security & Access</span>
                        </div>
                        <HiOutlineChevronDown
                          className={`${
                            open ? 'transform rotate-180' : ''
                          } w-5 h-5 text-gray-500`}
                        />
                      </Disclosure.Button>
                      <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-start">
                              <div className="flex items-center h-5">
                                <input
                                  id="twoFactor"
                                  name="twoFactor"
                                  type="checkbox"
                                  defaultChecked={firmData.settings.twoFactorAuthRequired}
                                  className="focus:ring-[#800000] h-4 w-4 text-[#800000] border-gray-300 rounded"
                                />
                              </div>
                              <div className="ml-3 text-sm">
                                <label htmlFor="twoFactor" className="font-medium text-gray-700">Require Two-Factor Authentication</label>
                                <p className="text-gray-500">All users will be required to set up 2FA for their accounts</p>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-start">
                              <div className="flex items-center h-5">
                                <input
                                  id="clientPortal"
                                  name="clientPortal"
                                  type="checkbox"
                                  defaultChecked={firmData.settings.clientPortalEnabled}
                                  className="focus:ring-[#800000] h-4 w-4 text-[#800000] border-gray-300 rounded"
                                />
                              </div>
                              <div className="ml-3 text-sm">
                                <label htmlFor="clientPortal" className="font-medium text-gray-700">Enable Client Portal</label>
                                <p className="text-gray-500">Allow clients to access their documents and case information</p>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-start">
                              <div className="flex items-center h-5">
                                <input
                                  id="auditLog"
                                  name="auditLog"
                                  type="checkbox"
                                  defaultChecked={true}
                                  className="focus:ring-[#800000] h-4 w-4 text-[#800000] border-gray-300 rounded"
                                />
                              </div>
                              <div className="ml-3 text-sm">
                                <label htmlFor="auditLog" className="font-medium text-gray-700">Enable Comprehensive Audit Logging</label>
                                <p className="text-gray-500">Track all user actions in the system for compliance purposes</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Disclosure.Panel>
                    </div>
                  )}
                </Disclosure>

                <Disclosure as="div" defaultOpen={false}>
                  {({ open }) => (
                    <div className="mt-2">
                      <Disclosure.Button className="flex justify-between w-full px-4 py-3 text-sm font-medium text-left text-gray-900 bg-gray-50 rounded-lg hover:bg-gray-100 focus:outline-none focus-visible:ring focus-visible:ring-[#800000] focus-visible:ring-opacity-75">
                        <div className="flex items-center">
                          <HiOutlineDocumentDuplicate className="mr-3 h-5 w-5 text-gray-500" />
                          <span>Document Management</span>
                        </div>
                        <HiOutlineChevronDown
                          className={`${
                            open ? 'transform rotate-180' : ''
                          } w-5 h-5 text-gray-500`}
                        />
                      </Disclosure.Button>
                      <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                        <div className="space-y-4">
                          <div>
                            <label htmlFor="documentRetention" className="block text-sm font-medium text-gray-700">Document Retention Period (years)</label>
                            <input
                              type="number"
                              name="documentRetention"
                              id="documentRetention"
                              defaultValue={firmData.settings.documentRetentionPeriod}
                              className="mt-1 focus:ring-[#800000] focus:border-[#800000] block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-start">
                              <div className="flex items-center h-5">
                                <input
                                  id="autoArchive"
                                  name="autoArchive"
                                  type="checkbox"
                                  defaultChecked={true}
                                  className="focus:ring-[#800000] h-4 w-4 text-[#800000] border-gray-300 rounded"
                                />
                              </div>
                              <div className="ml-3 text-sm">
                                <label htmlFor="autoArchive" className="font-medium text-gray-700">Auto-archive closed matters</label>
                                <p className="text-gray-500">Automatically archive documents when a case is closed</p>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-start">
                              <div className="flex items-center h-5">
                                <input
                                  id="versionHistory"
                                  name="versionHistory"
                                  type="checkbox"
                                  defaultChecked={true}
                                  className="focus:ring-[#800000] h-4 w-4 text-[#800000] border-gray-300 rounded"
                                />
                              </div>
                              <div className="ml-3 text-sm">
                                <label htmlFor="versionHistory" className="font-medium text-gray-700">Track document version history</label>
                                <p className="text-gray-500">Keep record of all document changes and revisions</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Disclosure.Panel>
                    </div>
                  )}
                </Disclosure>

                <div className="flex justify-end pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#800000] hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                  >
                    Save Settings
                  </button>
                </div>
              </div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>

      {/* Logo Upload Dialog */}
      <Transition appear show={isLogoDialogOpen} as={Fragment}>
        <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto" onClose={() => setIsLogoDialogOpen(false)}>
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

            <span className="inline-block h-screen align-middle" aria-hidden="true">&#8203;</span>
            
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
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Update Firm Logo
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Upload a new logo for your firm. Recommended size is 400x200 pixels.
                  </p>
                </div>

                <div className="mt-4">
                  <div className="flex justify-center p-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <HiOutlinePhotograph className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="logo-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-[#800000] hover:text-[#600000] focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-[#800000]"
                        >
                          <span>Upload a file</span>
                          <input id="logo-upload" name="logo-upload" type="file" className="sr-only" />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 2MB</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                    onClick={() => setIsLogoDialogOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-[#800000] border border-transparent rounded-md hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                    onClick={() => setIsLogoDialogOpen(false)}
                  >
                    Upload
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

      {/* Add Office Dialog */}
      <Transition appear show={isAddingOffice} as={Fragment}>
        <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto" onClose={() => setIsAddingOffice(false)}>
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

            <span className="inline-block h-screen align-middle" aria-hidden="true">&#8203;</span>
            
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
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Add New Office
                </Dialog.Title>
                
                <div className="mt-4 space-y-4">
                  <div>
                    <label htmlFor="office-name" className="block text-sm font-medium text-gray-700">Office Name</label>
                    <input
                      type="text"
                      name="name"
                      id="office-name"
                      value={newOffice.name}
                      onChange={(e) => setNewOffice({...newOffice, name: e.target.value})}
                      className="mt-1 focus:ring-[#800000] focus:border-[#800000] block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      placeholder="e.g., Cape Town Office"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="office-address" className="block text-sm font-medium text-gray-700">Address</label>
                    <input
                      type="text"
                      name="address"
                      id="office-address"
                      value={newOffice.address}
                      onChange={(e) => setNewOffice({...newOffice, address: e.target.value})}
                      className="mt-1 focus:ring-[#800000] focus:border-[#800000] block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      placeholder="Street Address"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="office-city" className="block text-sm font-medium text-gray-700">City</label>
                    <input
                      type="text"
                      name="city"
                      id="office-city"
                      value={newOffice.city}
                      onChange={(e) => setNewOffice({...newOffice, city: e.target.value})}
                      className="mt-1 focus:ring-[#800000] focus:border-[#800000] block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      placeholder="e.g., Cape Town"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="office-phone" className="block text-sm font-medium text-gray-700">Phone</label>
                      <input
                        type="text"
                        name="phone"
                        id="office-phone"
                        value={newOffice.phone}
                        onChange={(e) => setNewOffice({...newOffice, phone: e.target.value})}
                        className="mt-1 focus:ring-[#800000] focus:border-[#800000] block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        placeholder="e.g., 021 123 4567"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="office-email" className="block text-sm font-medium text-gray-700">Email</label>
                      <input
                        type="email"
                        name="email"
                        id="office-email"
                        value={newOffice.email}
                        onChange={(e) => setNewOffice({...newOffice, email: e.target.value})}
                        className="mt-1 focus:ring-[#800000] focus:border-[#800000] block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        placeholder="e.g., office@example.com"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      id="is-main-office"
                      name="is-main-office"
                      type="checkbox"
                      checked={newOffice.isMainOffice}
                      onChange={(e) => setNewOffice({...newOffice, isMainOffice: e.target.checked})}
                      className="focus:ring-[#800000] h-4 w-4 text-[#800000] border-gray-300 rounded"
                    />
                    <label htmlFor="is-main-office" className="ml-2 block text-sm text-gray-900">
                      This is the main office
                    </label>
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                    onClick={() => setIsAddingOffice(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-[#800000] border border-transparent rounded-md hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                    onClick={handleAddOffice}
                    disabled={!newOffice.name || !newOffice.address || !newOffice.city}
                  >
                    Add Office
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

      {/* Add Department Dialog */}
      <Transition appear show={isAddingDepartment} as={Fragment}>
        <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto" onClose={() => setIsAddingDepartment(false)}>
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

            <span className="inline-block h-screen align-middle" aria-hidden="true">&#8203;</span>
            
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
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Add New Department
                </Dialog.Title>
                
                <div className="mt-4 space-y-4">
                  <div>
                    <label htmlFor="dept-name" className="block text-sm font-medium text-gray-700">Department Name</label>
                    <input
                      type="text"
                      name="name"
                      id="dept-name"
                      value={newDepartment.name}
                      onChange={(e) => setNewDepartment({...newDepartment, name: e.target.value})}
                      className="mt-1 focus:ring-[#800000] focus:border-[#800000] block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      placeholder="e.g., Family Law"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="dept-head" className="block text-sm font-medium text-gray-700">Department Head</label>
                    <input
                      type="text"
                      name="head"
                      id="dept-head"
                      value={newDepartment.head}
                      onChange={(e) => setNewDepartment({...newDepartment, head: e.target.value})}
                      className="mt-1 focus:ring-[#800000] focus:border-[#800000] block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      placeholder="e.g., Sipho Nkosi"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="dept-description" className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      id="dept-description"
                      name="description"
                      rows={3}
                      value={newDepartment.description}
                      onChange={(e) => setNewDepartment({...newDepartment, description: e.target.value})}
                      className="mt-1 focus:ring-[#800000] focus:border-[#800000] block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      placeholder="Brief description of the department"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="dept-headCount" className="block text-sm font-medium text-gray-700">Head Count</label>
                    <input
                      type="number"
                      name="headCount"
                      id="dept-headCount"
                      value={newDepartment.headCount}
                      onChange={(e) => setNewDepartment({...newDepartment, headCount: e.target.value})}
                      className="mt-1 focus:ring-[#800000] focus:border-[#800000] block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      placeholder="e.g., 10"
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                    onClick={() => setIsAddingDepartment(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-[#800000] border border-transparent rounded-md hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                    onClick={handleAddDepartment}
                    disabled={!newDepartment.name || !newDepartment.head}
                  >
                    Add Department
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

export default AdminFirmManagementPage;
