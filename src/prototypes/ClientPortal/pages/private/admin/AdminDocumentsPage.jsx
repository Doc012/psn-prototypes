import React, { useState } from 'react';
import { Dialog, Transition, Menu } from '@headlessui/react';
import { Fragment } from 'react';
import {
  HiOutlineDocumentText,
  HiOutlineDocumentAdd,
  HiOutlineFolder,
  HiOutlineSearch,
  HiOutlineFilter,
  HiOutlineSortAscending,
  HiOutlineFolderAdd,
  HiOutlineDownload,
  HiOutlineShare,
  HiOutlineTrash,
  HiOutlinePencil,
  HiOutlineChevronDown,
  HiOutlineX,
  HiOutlineUpload,
  HiOutlineArrowSmLeft,
  HiOutlineArrowSmRight,
  HiOutlineExclamation,
  HiOutlineCheck,
  HiOutlineUserGroup,
  HiOutlineLockClosed,
  HiOutlineCalendar,
} from 'react-icons/hi';

const AdminDocumentsPage = () => {
  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDocumentType, setSelectedDocumentType] = useState('all');
  const [sortBy, setSortBy] = useState('dateDesc');
  const [currentFolder, setCurrentFolder] = useState('root');
  const [breadcrumbs, setBreadcrumbs] = useState([{ id: 'root', name: 'All Documents' }]);
  const [isUploadingDocument, setIsUploadingDocument] = useState(false);
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [selectedClient, setSelectedClient] = useState('all');
  const [showMoveDialog, setShowMoveDialog] = useState(false);
  const [destinationFolder, setDestinationFolder] = useState('');

  // Mock data
  const clients = [
    { id: 'client1', name: 'Maropeng Holdings' },
    { id: 'client2', name: 'Thabo Mbekhi Foundation' },
    { id: 'client3', name: 'Ubuntu Technologies' },
    { id: 'client4', name: 'Ndlovu Family Trust' },
    { id: 'client5', name: 'Bongani Investments' },
  ];

  const documentTypes = [
    { id: 'all', name: 'All Types' },
    { id: 'contracts', name: 'Contracts' },
    { id: 'correspondence', name: 'Correspondence' },
    { id: 'courtFilings', name: 'Court Filings' },
    { id: 'financials', name: 'Financial Documents' },
    { id: 'agreements', name: 'Agreements' },
    { id: 'minutes', name: 'Meeting Minutes' },
    { id: 'identity', name: 'Identity Documents' },
  ];

  const folders = [
    { 
      id: 'client-documents', 
      name: 'Client Documents', 
      parentId: 'root',
      type: 'folder',
      dateModified: '2025-05-28T09:15:00',
      owner: 'Admin',
      size: null
    },
    { 
      id: 'templates', 
      name: 'Templates', 
      parentId: 'root',
      type: 'folder',
      dateModified: '2025-05-20T14:30:00',
      owner: 'Admin',
      size: null
    },
    { 
      id: 'corporate', 
      name: 'Corporate Documents', 
      parentId: 'root',
      type: 'folder',
      dateModified: '2025-05-15T11:45:00',
      owner: 'Admin',
      size: null
    },
    { 
      id: 'client1-folder', 
      name: 'Maropeng Holdings', 
      parentId: 'client-documents',
      type: 'folder',
      dateModified: '2025-06-01T10:00:00',
      owner: 'Admin',
      size: null,
      clientId: 'client1'
    },
    { 
      id: 'client2-folder', 
      name: 'Thabo Mbekhi Foundation', 
      parentId: 'client-documents',
      type: 'folder',
      dateModified: '2025-06-02T09:30:00',
      owner: 'Admin',
      size: null,
      clientId: 'client2'
    },
    { 
      id: 'contract-templates', 
      name: 'Contract Templates', 
      parentId: 'templates',
      type: 'folder',
      dateModified: '2025-05-12T13:20:00',
      owner: 'Admin',
      size: null
    },
  ];

  const documents = [
    {
      id: 'doc1',
      name: 'Shareholder Agreement.docx',
      parentId: 'client1-folder',
      type: 'document',
      documentType: 'agreements',
      dateModified: '2025-06-01T15:30:00',
      owner: 'Sipho Nkosi',
      size: 2500000, // 2.5MB
      clientId: 'client1'
    },
    {
      id: 'doc2',
      name: 'Lease Agreement.pdf',
      parentId: 'client1-folder',
      type: 'document',
      documentType: 'contracts',
      dateModified: '2025-05-28T11:45:00',
      owner: 'Sipho Nkosi',
      size: 3200000, // 3.2MB
      clientId: 'client1'
    },
    {
      id: 'doc3',
      name: 'Board Resolution.docx',
      parentId: 'client1-folder',
      type: 'document',
      documentType: 'minutes',
      dateModified: '2025-05-25T09:15:00',
      owner: 'Thandi Modise',
      size: 1800000, // 1.8MB
      clientId: 'client1'
    },
    {
      id: 'doc4',
      name: 'Donation Agreement.pdf',
      parentId: 'client2-folder',
      type: 'document',
      documentType: 'agreements',
      dateModified: '2025-06-02T14:20:00',
      owner: 'Nomsa Dlamini',
      size: 2900000, // 2.9MB
      clientId: 'client2'
    },
    {
      id: 'doc5',
      name: 'Foundation Constitution.pdf',
      parentId: 'client2-folder',
      type: 'document',
      documentType: 'courtFilings',
      dateModified: '2025-05-30T10:45:00',
      owner: 'Nomsa Dlamini',
      size: 4100000, // 4.1MB
      clientId: 'client2'
    },
    {
      id: 'doc6',
      name: 'Standard Employment Contract.docx',
      parentId: 'contract-templates',
      type: 'document',
      documentType: 'contracts',
      dateModified: '2025-05-12T14:00:00',
      owner: 'Admin',
      size: 1200000, // 1.2MB
    },
    {
      id: 'doc7',
      name: 'NDA Template.docx',
      parentId: 'contract-templates',
      type: 'document',
      documentType: 'contracts',
      dateModified: '2025-05-10T11:30:00',
      owner: 'Admin',
      size: 950000, // 950KB
    },
    {
      id: 'doc8',
      name: 'Company Registration.pdf',
      parentId: 'corporate',
      type: 'document',
      documentType: 'identity',
      dateModified: '2025-05-15T09:30:00',
      owner: 'Admin',
      size: 3500000, // 3.5MB
    },
    {
      id: 'doc9',
      name: 'Tax Clearance Certificate.pdf',
      parentId: 'corporate',
      type: 'document',
      documentType: 'financials',
      dateModified: '2025-05-14T16:15:00',
      owner: 'Admin',
      size: 1600000, // 1.6MB
    },
  ];

  // Handle folder navigation
  const navigateToFolder = (folderId, folderName) => {
    setCurrentFolder(folderId);
    
    if (folderId === 'root') {
      setBreadcrumbs([{ id: 'root', name: 'All Documents' }]);
    } else {
      // Find parent path
      const newBreadcrumbs = [];
      let current = folderId;
      
      while (current !== 'root') {
        const folder = folders.find(f => f.id === current);
        if (folder) {
          newBreadcrumbs.unshift({ id: folder.id, name: folder.name });
          current = folder.parentId;
        } else {
          break;
        }
      }
      
      newBreadcrumbs.unshift({ id: 'root', name: 'All Documents' });
      setBreadcrumbs(newBreadcrumbs);
    }
    
    setSelectedDocuments([]);
  };

  // Filter and sort current folder contents
  const getCurrentFolderContents = () => {
    let folderContents = [...folders, ...documents].filter(item => item.parentId === currentFolder);
    
    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      folderContents = folderContents.filter(item => 
        item.name.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply document type filter (only for documents)
    if (selectedDocumentType !== 'all') {
      folderContents = folderContents.filter(item => 
        item.type === 'folder' || item.documentType === selectedDocumentType
      );
    }
    
    // Apply client filter
    if (selectedClient !== 'all') {
      folderContents = folderContents.filter(item => 
        item.clientId === selectedClient || item.type === 'folder'
      );
    }
    
    // Sort
    return folderContents.sort((a, b) => {
      // Always show folders first
      if (a.type === 'folder' && b.type !== 'folder') return -1;
      if (a.type !== 'folder' && b.type === 'folder') return 1;
      
      // Then apply sort criteria
      switch (sortBy) {
        case 'nameAsc':
          return a.name.localeCompare(b.name);
        case 'nameDesc':
          return b.name.localeCompare(a.name);
        case 'dateAsc':
          return new Date(a.dateModified) - new Date(b.dateModified);
        case 'dateDesc':
        default:
          return new Date(b.dateModified) - new Date(a.dateModified);
      }
    });
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    
    const kb = bytes / 1024;
    if (kb < 1024) {
      return `${Math.round(kb)} KB`;
    } else {
      return `${(kb / 1024).toFixed(1)} MB`;
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-ZA', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Toggle document selection
  const toggleDocumentSelection = (documentId) => {
    if (selectedDocuments.includes(documentId)) {
      setSelectedDocuments(selectedDocuments.filter(id => id !== documentId));
    } else {
      setSelectedDocuments([...selectedDocuments, documentId]);
    }
  };

  // Select/deselect all documents
  const toggleSelectAll = () => {
    const currentDocuments = getCurrentFolderContents().filter(item => item.type === 'document').map(doc => doc.id);
    
    if (selectedDocuments.length === currentDocuments.length) {
      setSelectedDocuments([]);
    } else {
      setSelectedDocuments(currentDocuments);
    }
  };

  // Create new folder
  const handleCreateFolder = () => {
    alert(`New folder "${newFolderName}" would be created inside current folder`);
    setNewFolderName('');
    setIsCreatingFolder(false);
  };

  // Handle document upload
  const handleUploadDocument = () => {
    alert('Document upload functionality would be implemented here');
    setIsUploadingDocument(false);
  };

  // Handle document deletion
  const handleDeleteDocuments = () => {
    alert(`Deleting ${selectedDocuments.length} document(s)`);
    setSelectedDocuments([]);
    setShowDeleteConfirmation(false);
  };

  // Handle document move
  const handleMoveDocuments = () => {
    alert(`Moving ${selectedDocuments.length} document(s) to ${destinationFolder}`);
    setSelectedDocuments([]);
    setShowMoveDialog(false);
  };

  // Get destination folder options for move dialog
  const getDestinationFolderOptions = () => {
    return folders.map(folder => (
      <option key={folder.id} value={folder.id}>{folder.name}</option>
    ));
  };

  // Get icon for document type
  const getDocumentTypeIcon = (docType) => {
    switch (docType) {
      case 'contracts':
      case 'agreements':
        return <HiOutlineDocumentText className="text-blue-500" />;
      case 'correspondence':
        return <HiOutlineDocumentText className="text-purple-500" />;
      case 'courtFilings':
        return <HiOutlineDocumentText className="text-red-500" />;
      case 'financials':
        return <HiOutlineDocumentText className="text-green-500" />;
      case 'minutes':
        return <HiOutlineDocumentText className="text-orange-500" />;
      case 'identity':
        return <HiOutlineDocumentText className="text-gray-500" />;
      default:
        return <HiOutlineDocumentText className="text-gray-400" />;
    }
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Document Management</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage, organize, and share documents with clients and team members
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <button
              onClick={() => setIsUploadingDocument(true)}
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#800000] hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
            >
              <HiOutlineUpload className="-ml-1 mr-2 h-5 w-5" />
              Upload Document
            </button>
            <button
              onClick={() => setIsCreatingFolder(true)}
              type="button"
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
            >
              <HiOutlineFolderAdd className="-ml-1 mr-2 h-5 w-5" />
              New Folder
            </button>
          </div>
        </div>

        {/* Breadcrumbs */}
        <nav className="mt-4 flex" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            {breadcrumbs.map((crumb, index) => (
              <li key={crumb.id} className="flex items-center">
                {index > 0 && <HiOutlineArrowSmRight className="flex-shrink-0 h-4 w-4 text-gray-400 mx-1" />}
                <button
                  onClick={() => navigateToFolder(crumb.id, crumb.name)}
                  className={`text-sm font-medium ${
                    index === breadcrumbs.length - 1
                      ? 'text-gray-800'
                      : 'text-[#800000] hover:text-[#600000]'
                  }`}
                >
                  {crumb.name}
                </button>
              </li>
            ))}
          </ol>
        </nav>

        {/* Filters and search bar */}
        <div className="mt-4 bg-white shadow overflow-hidden rounded-lg">
          <div className="p-4 border-b border-gray-200">
            <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:items-center md:justify-between">
              <div className="flex-1 min-w-0 max-w-md">
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <HiOutlineSearch className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="focus:ring-[#800000] focus:border-[#800000] block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                    placeholder="Search documents..."
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <div className="inline-flex items-center">
                  <HiOutlineFilter className="mr-2 h-5 w-5 text-gray-400" />
                  <select
                    value={selectedDocumentType}
                    onChange={(e) => setSelectedDocumentType(e.target.value)}
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm rounded-md"
                  >
                    {documentTypes.map(type => (
                      <option key={type.id} value={type.id}>{type.name}</option>
                    ))}
                  </select>
                </div>
                <div className="inline-flex items-center">
                  <HiOutlineUserGroup className="mr-2 h-5 w-5 text-gray-400" />
                  <select
                    value={selectedClient}
                    onChange={(e) => setSelectedClient(e.target.value)}
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm rounded-md"
                  >
                    <option value="all">All Clients</option>
                    {clients.map(client => (
                      <option key={client.id} value={client.id}>{client.name}</option>
                    ))}
                  </select>
                </div>
                <div className="inline-flex items-center">
                  <HiOutlineSortAscending className="mr-2 h-5 w-5 text-gray-400" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm rounded-md"
                  >
                    <option value="dateDesc">Newest first</option>
                    <option value="dateAsc">Oldest first</option>
                    <option value="nameAsc">Name (A-Z)</option>
                    <option value="nameDesc">Name (Z-A)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Bulk actions */}
          {selectedDocuments.length > 0 && (
            <div className="bg-gray-50 p-3 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">
                  {selectedDocuments.length} selected
                </span>
                <button 
                  onClick={() => setSelectedDocuments([])}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Clear
                </button>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowMoveDialog(true)}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                >
                  <HiOutlineArrowSmRight className="-ml-1 mr-1 h-4 w-4" />
                  Move
                </button>
                <button
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                >
                  <HiOutlineDownload className="-ml-1 mr-1 h-4 w-4" />
                  Download
                </button>
                <button
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                >
                  <HiOutlineShare className="-ml-1 mr-1 h-4 w-4" />
                  Share
                </button>
                <button
                  onClick={() => setShowDeleteConfirmation(true)}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <HiOutlineTrash className="-ml-1 mr-1 h-4 w-4" />
                  Delete
                </button>
              </div>
            </div>
          )}

          {/* Document/folder list */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        onChange={toggleSelectAll}
                        checked={selectedDocuments.length > 0 && selectedDocuments.length === getCurrentFolderContents().filter(item => item.type === 'document').length}
                        className="h-4 w-4 text-[#800000] focus:ring-[#800000] border-gray-300 rounded"
                      />
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Owner
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Modified
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Size
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {getCurrentFolderContents().length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center">
                        {searchTerm ? (
                          <>
                            <HiOutlineSearch className="h-12 w-12 text-gray-400 mb-3" />
                            <h3 className="text-sm font-medium text-gray-900">No documents found</h3>
                            <p className="mt-1 text-sm text-gray-500">
                              No results for "{searchTerm}"
                            </p>
                          </>
                        ) : (
                          <>
                            <HiOutlineDocumentText className="h-12 w-12 text-gray-400 mb-3" />
                            <h3 className="text-sm font-medium text-gray-900">No documents in this folder</h3>
                            <p className="mt-1 text-sm text-gray-500">
                              Upload documents or create folders to get started
                            </p>
                            <div className="mt-6 flex space-x-3">
                              <button
                                onClick={() => setIsUploadingDocument(true)}
                                type="button"
                                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#800000] hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                              >
                                <HiOutlineUpload className="-ml-1 mr-2 h-5 w-5" />
                                Upload Document
                              </button>
                              <button
                                onClick={() => setIsCreatingFolder(true)}
                                type="button"
                                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                              >
                                <HiOutlineFolderAdd className="-ml-1 mr-2 h-5 w-5" />
                                New Folder
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  getCurrentFolderContents().map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.type === 'document' ? (
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={selectedDocuments.includes(item.id)}
                              onChange={() => toggleDocumentSelection(item.id)}
                              className="h-4 w-4 text-[#800000] focus:ring-[#800000] border-gray-300 rounded"
                            />
                          </div>
                        ) : (
                          <div className="w-4"></div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center">
                            {item.type === 'folder' ? (
                              <HiOutlineFolder className="h-6 w-6 text-yellow-500" />
                            ) : (
                              getDocumentTypeIcon(item.documentType)
                            )}
                          </div>
                          <div className="ml-4">
                            {item.type === 'folder' ? (
                              <button
                                onClick={() => navigateToFolder(item.id, item.name)}
                                className="text-sm font-medium text-[#800000] hover:text-[#600000]"
                              >
                                {item.name}
                              </button>
                            ) : (
                              <div className="text-sm font-medium text-gray-900">{item.name}</div>
                            )}
                            {item.type === 'document' && (
                              <div className="text-xs text-gray-500">
                                {documentTypes.find(t => t.id === item.documentType)?.name || 'Document'}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{item.owner}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <HiOutlineCalendar className="mr-1.5 h-4 w-4 text-gray-400" />
                          <div className="text-sm text-gray-500">{formatDate(item.dateModified)}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatFileSize(item.size)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          {item.type === 'document' && (
                            <>
                              <button
                                className="text-gray-500 hover:text-gray-700"
                                title="Download"
                              >
                                <HiOutlineDownload className="h-5 w-5" />
                              </button>
                              <button
                                className="text-gray-500 hover:text-gray-700"
                                title="Share"
                              >
                                <HiOutlineShare className="h-5 w-5" />
                              </button>
                            </>
                          )}
                          <Menu as="div" className="relative inline-block text-left">
                            <div>
                              <Menu.Button className="text-gray-500 hover:text-gray-700">
                                <HiOutlineChevronDown className="h-5 w-5" />
                              </Menu.Button>
                            </div>
                            <Transition
                              as={Fragment}
                              enter="transition ease-out duration-100"
                              enterFrom="transform opacity-0 scale-95"
                              enterTo="transform opacity-100 scale-100"
                              leave="transition ease-in duration-75"
                              leaveFrom="transform opacity-100 scale-100"
                              leaveTo="transform opacity-0 scale-95"
                            >
                              <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                                <div className="py-1">
                                  {item.type === 'folder' ? (
                                    <>
                                      <Menu.Item>
                                        {({ active }) => (
                                          <button
                                            className={`${
                                              active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                            } block w-full text-left px-4 py-2 text-sm`}
                                          >
                                            Rename folder
                                          </button>
                                        )}
                                      </Menu.Item>
                                      <Menu.Item>
                                        {({ active }) => (
                                          <button
                                            className={`${
                                              active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                            } block w-full text-left px-4 py-2 text-sm`}
                                          >
                                            Move folder
                                          </button>
                                        )}
                                      </Menu.Item>
                                      <Menu.Item>
                                        {({ active }) => (
                                          <button
                                            className={`${
                                              active ? 'bg-red-50 text-red-700' : 'text-red-600'
                                            } block w-full text-left px-4 py-2 text-sm`}
                                          >
                                            Delete folder
                                          </button>
                                        )}
                                      </Menu.Item>
                                    </>
                                  ) : (
                                    <>
                                      <Menu.Item>
                                        {({ active }) => (
                                          <button
                                            className={`${
                                              active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                            } block w-full text-left px-4 py-2 text-sm`}
                                          >
                                            View details
                                          </button>
                                        )}
                                      </Menu.Item>
                                      <Menu.Item>
                                        {({ active }) => (
                                          <button
                                            className={`${
                                              active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                            } block w-full text-left px-4 py-2 text-sm`}
                                          >
                                            Download
                                          </button>
                                        )}
                                      </Menu.Item>
                                      <Menu.Item>
                                        {({ active }) => (
                                          <button
                                            className={`${
                                              active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                            } block w-full text-left px-4 py-2 text-sm`}
                                          >
                                            Rename
                                          </button>
                                        )}
                                      </Menu.Item>
                                      <Menu.Item>
                                        {({ active }) => (
                                          <button
                                            className={`${
                                              active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                            } block w-full text-left px-4 py-2 text-sm`}
                                          >
                                            Move to folder
                                          </button>
                                        )}
                                      </Menu.Item>
                                      <Menu.Item>
                                        {({ active }) => (
                                          <button
                                            className={`${
                                              active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                            } block w-full text-left px-4 py-2 text-sm`}
                                          >
                                            Share
                                          </button>
                                        )}
                                      </Menu.Item>
                                      <Menu.Item>
                                        {({ active }) => (
                                          <button
                                            className={`${
                                              active ? 'bg-red-50 text-red-700' : 'text-red-600'
                                            } block w-full text-left px-4 py-2 text-sm`}
                                          >
                                            Delete
                                          </button>
                                        )}
                                      </Menu.Item>
                                    </>
                                  )}
                                </div>
                              </Menu.Items>
                            </Transition>
                          </Menu>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Upload Document Dialog */}
      <Transition.Root show={isUploadingDocument} as={Fragment}>
        <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto" onClose={setIsUploadingDocument}>
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-[#800000] bg-opacity-10 sm:mx-0 sm:h-10 sm:w-10">
                    <HiOutlineUpload className="h-6 w-6 text-[#800000]" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                      Upload Document
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Select a document to upload to the current folder
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 sm:mt-4">
                  <div className="space-y-4">
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                      <div className="space-y-1 text-center">
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
                          stroke="currentColor"
                          fill="none"
                          viewBox="0 0 48 48"
                          aria-hidden="true"
                        >
                          <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <div className="flex text-sm text-gray-600">
                          <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer bg-white rounded-md font-medium text-[#800000] hover:text-[#600000] focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-[#800000]"
                          >
                            <span>Upload a file</span>
                            <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">
                          PDF, DOCX, XLSX, PPTX, JPG up to 10MB
                        </p>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="document-type" className="block text-sm font-medium text-gray-700">
                        Document Type
                      </label>
                      <select
                        id="document-type"
                        name="document-type"
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm rounded-md"
                      >
                        {documentTypes.filter(type => type.id !== 'all').map(type => (
                          <option key={type.id} value={type.id}>
                            {type.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="client" className="block text-sm font-medium text-gray-700">
                        Client (if applicable)
                      </label>
                      <select
                        id="client"
                        name="client"
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm rounded-md"
                      >
                        <option value="">None</option>
                        {clients.map(client => (
                          <option key={client.id} value={client.id}>
                            {client.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#800000] text-base font-medium text-white hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000] sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={handleUploadDocument}
                  >
                    Upload
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000] sm:mt-0 sm:w-auto sm:text-sm"
                    onClick={() => setIsUploadingDocument(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Create Folder Dialog */}
      <Transition.Root show={isCreatingFolder} as={Fragment}>
        <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto" onClose={setIsCreatingFolder}>
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-[#800000] bg-opacity-10 sm:mx-0 sm:h-10 sm:w-10">
                    <HiOutlineFolderAdd className="h-6 w-6 text-[#800000]" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                      Create New Folder
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Create a new folder in the current directory
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 sm:mt-4">
                  <div>
                    <label htmlFor="folder-name" className="block text-sm font-medium text-gray-700">
                      Folder Name
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="folder-name"
                        id="folder-name"
                        value={newFolderName}
                        onChange={(e) => setNewFolderName(e.target.value)}
                        className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                        placeholder="Enter folder name"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#800000] text-base font-medium text-white hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000] sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={handleCreateFolder}
                    disabled={!newFolderName.trim()}
                  >
                    Create
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000] sm:mt-0 sm:w-auto sm:text-sm"
                    onClick={() => {
                      setNewFolderName('');
                      setIsCreatingFolder(false);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Delete Confirmation Dialog */}
      <Transition.Root show={showDeleteConfirmation} as={Fragment}>
        <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto" onClose={setShowDeleteConfirmation}>
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <HiOutlineExclamation className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                      Delete Documents
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete {selectedDocuments.length} documents? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={handleDeleteDocuments}
                  >
                    Delete
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000] sm:mt-0 sm:w-auto sm:text-sm"
                    onClick={() => setShowDeleteConfirmation(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Move Documents Dialog */}
      <Transition.Root show={showMoveDialog} as={Fragment}>
        <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto" onClose={setShowMoveDialog}>
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-[#800000] bg-opacity-10 sm:mx-0 sm:h-10 sm:w-10">
                    <HiOutlineArrowSmRight className="h-6 w-6 text-[#800000]" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                      Move Documents
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Select a destination folder for the {selectedDocuments.length} selected documents
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 sm:mt-4">
                  <div>
                    <label htmlFor="destination-folder" className="block text-sm font-medium text-gray-700">
                      Destination Folder
                    </label>
                    <select
                      id="destination-folder"
                      name="destination-folder"
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm rounded-md"
                      value={destinationFolder}
                      onChange={(e) => setDestinationFolder(e.target.value)}
                    >
                      <option value="">Select a folder</option>
                      {getDestinationFolderOptions()}
                    </select>
                  </div>
                </div>

                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#800000] text-base font-medium text-white hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000] sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={handleMoveDocuments}
                    disabled={!destinationFolder}
                  >
                    Move
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000] sm:mt-0 sm:w-auto sm:text-sm"
                    onClick={() => setShowMoveDialog(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
};

export default AdminDocumentsPage;
