import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { 
  HiOutlineDocumentText, 
  HiOutlineFolder, 
  HiOutlineSearch, 
  HiOutlineUpload,
  HiOutlineDownload,
  HiOutlinePencilAlt,
  HiOutlineTrash,
  HiOutlineExclamationCircle,
  HiOutlineClipboardCheck,
  HiOutlineChevronDown,
  HiOutlineFilter,
  HiOutlineCheck,
  HiOutlinePaperClip,
  HiX,
  HiPlus
} from 'react-icons/hi';
import { format } from 'date-fns';

const DocumentsPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [folders, setFolders] = useState([]);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [fileToUpload, setFileToUpload] = useState(null);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    type: 'all',
    status: 'all',
    sortBy: 'newest'
  });
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadDetails, setUploadDetails] = useState({
    title: '',
    description: '',
    folder: '',
    category: '',
    tags: [],
    currentTag: ''
  });
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  
  // Mock data
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setLoading(true);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock folders
        const mockFolders = [
          { id: 1, name: 'Personal Injury Case', documentCount: 8 },
          { id: 2, name: 'Estate Planning', documentCount: 4 },
          { id: 3, name: 'Insurance Documents', documentCount: 3 },
          { id: 4, name: 'Medical Records', documentCount: 6 },
          { id: 5, name: 'Contracts', documentCount: 5 },
        ];
        
        // Mock documents
        const mockDocuments = [
          {
            id: 1,
            title: 'Accident Report',
            description: 'Police report from the accident scene',
            type: 'PDF',
            size: '1.2 MB',
            uploadDate: '2023-02-15',
            lastModified: '2023-02-15',
            uploadedBy: 'Sarah Smith',
            status: 'final',
            folder: 1,
            needsSignature: false,
            signed: false,
            category: 'Legal',
            tags: ['accident', 'police report'],
            shared: false,
            thumbnail: null
          },
          {
            id: 2,
            title: 'Medical Records - Memorial Hospital',
            description: 'Initial examination and treatment records',
            type: 'PDF',
            size: '3.5 MB',
            uploadDate: '2023-02-20',
            lastModified: '2023-02-20',
            uploadedBy: 'Dr. Johnson',
            status: 'final',
            folder: 4,
            needsSignature: false,
            signed: false,
            category: 'Medical',
            tags: ['medical', 'hospital'],
            shared: false,
            thumbnail: null
          },
          {
            id: 3,
            title: 'Client Representation Agreement',
            description: 'Legal agreement for case representation',
            type: 'PDF',
            size: '0.5 MB',
            uploadDate: '2023-02-10',
            lastModified: '2023-02-11',
            uploadedBy: 'Legal Team',
            status: 'final',
            folder: 5,
            needsSignature: true,
            signed: true,
            category: 'Legal',
            tags: ['agreement', 'contract', 'representation'],
            shared: false,
            thumbnail: null
          },
          {
            id: 4,
            title: 'Insurance Policy',
            description: 'Your auto insurance policy',
            type: 'PDF',
            size: '1.7 MB',
            uploadDate: '2023-01-05',
            lastModified: '2023-01-05',
            uploadedBy: 'Sarah Smith',
            status: 'final',
            folder: 3,
            needsSignature: false,
            signed: false,
            category: 'Insurance',
            tags: ['insurance', 'policy', 'auto'],
            shared: false,
            thumbnail: null
          },
          {
            id: 5,
            title: 'Medical Bills',
            description: 'Bills from hospital and physical therapy',
            type: 'PDF',
            size: '0.8 MB',
            uploadDate: '2023-03-01',
            lastModified: '2023-03-01',
            uploadedBy: 'Sarah Smith',
            status: 'final',
            folder: 4,
            needsSignature: false,
            signed: false,
            category: 'Financial',
            tags: ['medical', 'bills', 'expenses'],
            shared: false,
            thumbnail: null
          },
          {
            id: 6,
            title: 'Witness Statement',
            description: 'Statement from accident witness',
            type: 'DOCX',
            size: '0.3 MB',
            uploadDate: '2023-02-17',
            lastModified: '2023-02-18',
            uploadedBy: 'Legal Team',
            status: 'draft',
            folder: 1,
            needsSignature: false,
            signed: false,
            category: 'Legal',
            tags: ['witness', 'statement', 'accident'],
            shared: false,
            thumbnail: null
          },
          {
            id: 7,
            title: 'Settlement Demand',
            description: 'Initial settlement demand letter',
            type: 'PDF',
            size: '0.4 MB',
            uploadDate: '2023-03-10',
            lastModified: '2023-03-12',
            uploadedBy: 'Legal Team',
            status: 'draft',
            folder: 1,
            needsSignature: false,
            signed: false,
            category: 'Legal',
            tags: ['settlement', 'demand', 'letter'],
            shared: true,
            thumbnail: null
          },
          {
            id: 8,
            title: 'Medical Release Form',
            description: 'Authorization to release medical records',
            type: 'PDF',
            size: '0.2 MB',
            uploadDate: '2023-02-11',
            lastModified: '2023-02-11',
            uploadedBy: 'Legal Team',
            status: 'final',
            folder: 4,
            needsSignature: true,
            signed: true,
            category: 'Medical',
            tags: ['medical', 'release', 'authorization'],
            shared: false,
            thumbnail: null
          },
          {
            id: 9,
            title: 'Employment Verification',
            description: 'Documentation of employment and wages',
            type: 'XLSX',
            size: '0.3 MB',
            uploadDate: '2023-02-25',
            lastModified: '2023-02-25',
            uploadedBy: 'Sarah Smith',
            status: 'final',
            folder: 1,
            needsSignature: false,
            signed: false,
            category: 'Financial',
            tags: ['employment', 'wages', 'financial'],
            shared: false,
            thumbnail: null
          },
          {
            id: 10,
            title: 'Will and Testament',
            description: 'Last will and testament',
            type: 'PDF',
            size: '0.6 MB',
            uploadDate: '2023-01-15',
            lastModified: '2023-01-15',
            uploadedBy: 'Legal Team',
            status: 'final',
            folder: 2,
            needsSignature: true,
            signed: true,
            category: 'Estate Planning',
            tags: ['will', 'testament', 'estate'],
            shared: false,
            thumbnail: null
          },
          {
            id: 11,
            title: 'Power of Attorney',
            description: 'Durable power of attorney document',
            type: 'PDF',
            size: '0.4 MB',
            uploadDate: '2023-01-15',
            lastModified: '2023-01-15',
            uploadedBy: 'Legal Team',
            status: 'final',
            folder: 2,
            needsSignature: true,
            signed: true,
            category: 'Estate Planning',
            tags: ['power of attorney', 'estate'],
            shared: false,
            thumbnail: null
          },
          {
            id: 12,
            title: 'Healthcare Directive',
            description: 'Advance healthcare directive',
            type: 'PDF',
            size: '0.3 MB',
            uploadDate: '2023-01-15',
            lastModified: '2023-01-15',
            uploadedBy: 'Legal Team',
            status: 'final',
            folder: 2,
            needsSignature: true,
            signed: false,
            category: 'Estate Planning',
            tags: ['healthcare', 'directive', 'estate'],
            shared: false,
            thumbnail: null
          },
        ];
        
        setFolders(mockFolders);
        setDocuments(mockDocuments);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching documents:', err);
        setError('Failed to load documents. Please try again later.');
        setLoading(false);
        toast.error('Error loading documents');
      }
    };
    
    fetchDocuments();
  }, []);
  
  // Filter documents based on current folder, search query, and filters
  const filteredDocuments = documents.filter(doc => {
    // Filter by folder
    if (currentFolder && doc.folder !== currentFolder.id) return false;
    
    // Filter by search query
    if (searchQuery && !doc.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    
    // Filter by type
    if (filters.type !== 'all' && doc.type.toLowerCase() !== filters.type.toLowerCase()) return false;
    
    // Filter by status
    if (filters.status !== 'all') {
      if (filters.status === 'signed' && (!doc.needsSignature || !doc.signed)) return false;
      if (filters.status === 'needs-signature' && (!doc.needsSignature || doc.signed)) return false;
      if (filters.status === 'draft' && doc.status !== 'draft') return false;
      if (filters.status === 'final' && doc.status !== 'final') return false;
    }
    
    return true;
  });
  
  // Sort documents
  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    if (filters.sortBy === 'newest') {
      return new Date(b.uploadDate) - new Date(a.uploadDate);
    } else if (filters.sortBy === 'oldest') {
      return new Date(a.uploadDate) - new Date(b.uploadDate);
    } else if (filters.sortBy === 'name-asc') {
      return a.title.localeCompare(b.title);
    } else if (filters.sortBy === 'name-desc') {
      return b.title.localeCompare(a.title);
    }
    return 0;
  });
  
  // Handle file selection
  const handleFileSelect = (e) => {
    if (e.target.files.length > 0) {
      setFileToUpload(e.target.files[0]);
      setUploadDetails({
        ...uploadDetails,
        title: e.target.files[0].name
      });
    }
  };
  
  // Handle upload modal show/hide
  const handleShowUploadModal = () => {
    setShowUploadModal(true);
  };
  
  const handleCloseUploadModal = () => {
    setShowUploadModal(false);
    setFileToUpload(null);
    setUploadDetails({
      title: '',
      description: '',
      folder: '',
      category: '',
      tags: [],
      currentTag: ''
    });
  };
  
  // Handle file upload
  const handleFileUpload = async (e) => {
    e.preventDefault();
    
    if (!fileToUpload) {
      toast.error("Please select a file to upload");
      return;
    }
    
    if (!uploadDetails.title.trim()) {
      toast.error("Please enter a document title");
      return;
    }
    
    setUploadingFile(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create new document object
      const newDocument = {
        id: documents.length + 1,
        title: uploadDetails.title,
        description: uploadDetails.description,
        type: fileToUpload.name.split('.').pop().toUpperCase(),
        size: `${(fileToUpload.size / (1024 * 1024)).toFixed(1)} MB`,
        uploadDate: new Date().toISOString().split('T')[0],
        lastModified: new Date().toISOString().split('T')[0],
        uploadedBy: `${user.firstName} ${user.lastName}`,
        status: 'draft',
        folder: uploadDetails.folder ? parseInt(uploadDetails.folder) : null,
        needsSignature: false,
        signed: false,
        category: uploadDetails.category,
        tags: uploadDetails.tags,
        shared: false,
        thumbnail: null
      };
      
      // Add to documents list
      setDocuments([...documents, newDocument]);
      
      // Reset state and close modal
      setFileToUpload(null);
      setUploadingFile(false);
      handleCloseUploadModal();
      
      toast.success("Document uploaded successfully");
    } catch (err) {
      console.error("Error uploading file:", err);
      toast.error("Failed to upload document");
      setUploadingFile(false);
    }
  };
  
  // Handle adding a tag
  const handleAddTag = (e) => {
    e.preventDefault();
    if (uploadDetails.currentTag.trim() !== '' && !uploadDetails.tags.includes(uploadDetails.currentTag.trim())) {
      setUploadDetails({
        ...uploadDetails,
        tags: [...uploadDetails.tags, uploadDetails.currentTag.trim()],
        currentTag: ''
      });
    }
  };
  
  // Handle removing a tag
  const handleRemoveTag = (tagToRemove) => {
    setUploadDetails({
      ...uploadDetails,
      tags: uploadDetails.tags.filter(tag => tag !== tagToRemove)
    });
  };
  
  // Handle folder selection
  const handleFolderClick = (folder) => {
    setCurrentFolder(folder);
    setSelectedDocuments([]);
  };
  
  // Handle going back to all folders
  const handleBackToFolders = () => {
    setCurrentFolder(null);
    setSelectedDocuments([]);
  };
  
  // Handle creating a new folder
  const handleCreateFolder = async (e) => {
    e.preventDefault();
    
    if (!newFolderName.trim()) {
      toast.error("Please enter a folder name");
      return;
    }
    
    setIsCreatingFolder(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create new folder
      const newFolder = {
        id: folders.length + 1,
        name: newFolderName.trim(),
        documentCount: 0
      };
      
      // Add to folders list
      setFolders([...folders, newFolder]);
      
      // Reset state
      setNewFolderName('');
      setIsCreatingFolder(false);
      
      toast.success("Folder created successfully");
    } catch (err) {
      console.error("Error creating folder:", err);
      toast.error("Failed to create folder");
      setIsCreatingFolder(false);
    }
  };
  
  // Toggle document selection
  const toggleDocumentSelection = (docId) => {
    if (selectedDocuments.includes(docId)) {
      setSelectedDocuments(selectedDocuments.filter(id => id !== docId));
    } else {
      setSelectedDocuments([...selectedDocuments, docId]);
    }
  };
  
  // Handle bulk actions
  const handleBulkDownload = () => {
    if (selectedDocuments.length === 0) {
      toast.info("No documents selected");
      return;
    }
    
    toast.info(`Downloading ${selectedDocuments.length} document(s)`);
  };
  
  const handleBulkShare = () => {
    if (selectedDocuments.length === 0) {
      toast.info("No documents selected");
      return;
    }
    
    toast.info(`Share link generated for ${selectedDocuments.length} document(s)`);
  };
  
  const handleBulkDelete = async () => {
    if (selectedDocuments.length === 0) {
      toast.info("No documents selected");
      return;
    }
    
    if (window.confirm(`Are you sure you want to delete ${selectedDocuments.length} document(s)?`)) {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Remove documents
        setDocuments(documents.filter(doc => !selectedDocuments.includes(doc.id)));
        
        // Reset selection
        setSelectedDocuments([]);
        
        toast.success(`${selectedDocuments.length} document(s) deleted`);
      } catch (err) {
        console.error("Error deleting documents:", err);
        toast.error("Failed to delete documents");
      }
    }
  };
  
  // Render loading state
  if (loading) {
    return (
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <div className="text-center">
              <svg className="animate-spin h-10 w-10 text-[#800000] mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="mt-4 text-gray-600">Loading documents...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Render error state
  if (error) {
    return (
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <HiOutlineExclamationCircle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
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
        {/* Page header */}
        <div className="mb-6">
          <div className="sm:flex sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                {currentFolder ? currentFolder.name : 'Document Library'}
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                {currentFolder ? (
                  <button 
                    onClick={handleBackToFolders}
                    className="inline-flex items-center text-[#800000] hover:text-[#600000]"
                  >
                    <HiOutlineChevronDown className="mr-1 h-4 w-4 rotate-90" /> Back to all folders
                  </button>
                ) : (
                  'All your documents in one secure place'
                )}
              </p>
            </div>
            <div className="mt-4 flex gap-2 sm:mt-0">
              {!currentFolder && (
                <div className="relative inline-block text-left">
                  <button
                    onClick={() => document.getElementById('new-folder-dialog').showModal()}
                    className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#800000] focus:ring-offset-2"
                  >
                    <HiOutlineFolder className="-ml-1 mr-2 h-5 w-5 text-gray-500" />
                    New Folder
                  </button>

                  {/* New Folder Dialog */}
                  <dialog id="new-folder-dialog" className="rounded-lg shadow-xl p-0 w-full max-w-md">
                    <form onSubmit={handleCreateFolder}>
                      <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
                        <div className="sm:flex sm:items-start">
                          <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#800000] bg-opacity-10 sm:mx-0 sm:h-10 sm:w-10">
                            <HiOutlineFolder className="h-6 w-6 text-[#800000]" />
                          </div>
                          <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                            <h3 className="text-lg font-medium leading-6 text-gray-900">Create New Folder</h3>
                            <div className="mt-4">
                              <label htmlFor="folder-name" className="block text-sm font-medium text-gray-700">
                                Folder Name
                              </label>
                              <input
                                type="text"
                                id="folder-name"
                                value={newFolderName}
                                onChange={(e) => setNewFolderName(e.target.value)}
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#800000] focus:ring-[#800000] sm:text-sm"
                                placeholder="Enter folder name"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                        <button
                          type="submit"
                          disabled={isCreatingFolder || !newFolderName.trim()}
                          className={`inline-flex w-full justify-center rounded-md border border-transparent bg-[#800000] px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-[#800000] focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm ${
                            isCreatingFolder || !newFolderName.trim() ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                        >
                          {isCreatingFolder ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Creating...
                            </>
                          ) : (
                            'Create'
                          )}
                        </button>
                        <button
                          type="button"
                          className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#800000] focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
                          onClick={() => document.getElementById('new-folder-dialog').close()}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </dialog>
                </div>
              )}
              
              <button
                onClick={handleShowUploadModal}
                className="inline-flex items-center rounded-md border border-transparent bg-[#800000] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-[#800000] focus:ring-offset-2"
              >
                <HiOutlineUpload className="-ml-1 mr-2 h-5 w-5" />
                Upload
              </button>
            </div>
          </div>
        </div>
        
        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="px-4 py-5 sm:px-6 flex justify-between items-center border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Upload Document</h3>
                <button
                  onClick={handleCloseUploadModal}
                  className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                >
                  <span className="sr-only">Close</span>
                  <HiX className="h-6 w-6" />
                </button>
              </div>
              <form onSubmit={handleFileUpload}>
                <div className="px-4 py-5 sm:p-6 space-y-6">
                  {/* File upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">File</label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                      <div className="space-y-1 text-center">
                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4h-8m-12 0H8m12 0a4 4 0 01-4-4v-4m0 0h12M24 12v.01M6 12v.01" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <div className="flex text-sm text-gray-600">
                          <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer bg-white rounded-md font-medium text-[#800000] hover:text-[#600000] focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-[#800000]"
                          >
                            <span>Upload a file</span>
                            <input
                              id="file-upload"
                              name="file-upload"
                              type="file"
                              className="sr-only"
                              onChange={handleFileSelect}
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">
                          PDF, DOCX, XLSX, JPG, PNG up to 10MB
                        </p>
                        {fileToUpload && (
                          <p className="text-sm text-[#800000] font-medium mt-2">
                            Selected: {fileToUpload.name} ({(fileToUpload.size / (1024 * 1024)).toFixed(2)} MB)
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Document details */}
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                      Document Title
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="title"
                        className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                        value={uploadDetails.title}
                        onChange={(e) => setUploadDetails({...uploadDetails, title: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="description"
                        rows={3}
                        className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                        value={uploadDetails.description}
                        onChange={(e) => setUploadDetails({...uploadDetails, description: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="folder" className="block text-sm font-medium text-gray-700">
                        Folder (Optional)
                      </label>
                      <div className="mt-1">
                        <select
                          id="folder"
                          className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                          value={uploadDetails.folder}
                          onChange={(e) => setUploadDetails({...uploadDetails, folder: e.target.value})}
                        >
                          <option value="">-- No Folder --</option>
                          {folders.map(folder => (
                            <option key={folder.id} value={folder.id}>
                              {folder.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                        Category (Optional)
                      </label>
                      <div className="mt-1">
                        <select
                          id="category"
                          className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                          value={uploadDetails.category}
                          onChange={(e) => setUploadDetails({...uploadDetails, category: e.target.value})}
                        >
                          <option value="">-- Select Category --</option>
                          <option value="Legal">Legal</option>
                          <option value="Medical">Medical</option>
                          <option value="Financial">Financial</option>
                          <option value="Insurance">Insurance</option>
                          <option value="Estate Planning">Estate Planning</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
                      Tags (Optional)
                    </label>
                    <div className="mt-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        {uploadDetails.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-[#800000] bg-opacity-10 text-[#800000]"
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={() => handleRemoveTag(tag)}
                              className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full text-[#800000] hover:bg-[#800000] hover:text-white focus:outline-none"
                            >
                              <span className="sr-only">Remove tag</span>
                              <HiX className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                      <div className="flex">
                        <input
                          type="text"
                          id="current-tag"
                          className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-l-md"
                          value={uploadDetails.currentTag}
                          onChange={(e) => setUploadDetails({...uploadDetails, currentTag: e.target.value})}
                          placeholder="Add a tag"
                        />
                        <button
                          type="button"
                          onClick={handleAddTag}
                          className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 shadow-sm text-sm font-medium rounded-r-md text-white bg-[#800000] hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                        >
                          <HiPlus className="-ml-1 mr-1 h-4 w-4" />
                          Add
                        </button>
                      </div>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Press "Add" after typing each tag. Tags help with document organization and search.
                    </p>
                  </div>
                </div>
                
                <div className="px-4 py-3 bg-gray-50 text-right sm:px-6 flex justify-end">
                  <button
                    type="button"
                    onClick={handleCloseUploadModal}
                    className="mr-3 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={uploadingFile || !fileToUpload || !uploadDetails.title.trim()}
                    className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#800000] hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000] ${
                      uploadingFile || !fileToUpload || !uploadDetails.title.trim() ? 'opacity-50 cursor-not-allowed' : ''
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
                      'Upload Document'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        
        {/* Main content */}
        <div className="mt-8">
          {/* Show folders grid if no folder is selected */}
          {!currentFolder ? (
            <div className="space-y-6">
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                  <h2 className="text-lg leading-6 font-medium text-gray-900">Folders</h2>
                </div>
                <div className="border-t border-gray-200">
                  <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                    {folders.map((folder) => (
                      <li key={folder.id}>
                        <button
                          onClick={() => handleFolderClick(folder)}
                          className="w-full h-full block bg-white border border-gray-200 rounded-lg overflow-hidden shadow hover:shadow-md transition-shadow duration-200"
                        >
                          <div className="p-5">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 rounded-md bg-[#800000] bg-opacity-10 flex items-center justify-center">
                                <HiOutlineFolder className="h-6 w-6 text-[#800000]" />
                              </div>
                              <div className="ml-4 text-left">
                                <h3 className="text-lg font-medium text-gray-900 truncate">{folder.name}</h3>
                                <p className="text-sm text-gray-500">{folder.documentCount} document{folder.documentCount !== 1 ? 's' : ''}</p>
                              </div>
                            </div>
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              {/* Recent documents section */}
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                  <h2 className="text-lg leading-6 font-medium text-gray-900">Recent Documents</h2>
                </div>
                <div className="border-t border-gray-200">
                  {documents.length > 0 ? (
                    <ul className="divide-y divide-gray-200">
                      {documents.slice(0, 5).map((document) => (
                        <li key={document.id} className="px-4 py-4 flex items-center hover:bg-gray-50">
                          <div className="flex-shrink-0 h-10 w-10 rounded-md bg-blue-100 flex items-center justify-center">
                            <HiOutlineDocumentText className="h-6 w-6 text-blue-600" />
                          </div>
                          <div className="ml-4 flex-1">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="text-sm font-medium text-[#800000] truncate">{document.title}</h3>
                                <p className="text-xs text-gray-500">
                                  {document.type} • {document.size} • Uploaded on {format(new Date(document.uploadDate), 'MMM d, yyyy')}
                                </p>
                              </div>
                              <div className="flex space-x-2">
                                <button
                                  className="text-gray-400 hover:text-gray-500"
                                  title="Download"
                                  onClick={() => toast.info("Download functionality would be implemented here")}
                                >
                                  <HiOutlineDownload className="h-5 w-5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-center py-6">
                      <HiOutlineDocumentText className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No documents</h3>
                      <p className="mt-1 text-sm text-gray-500">Get started by uploading your first document</p>
                      <div className="mt-6">
                        <button
                          type="button"
                          onClick={handleShowUploadModal}
                          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#800000] hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                        >
                          <HiOutlineUpload className="-ml-1 mr-2 h-5 w-5" />
                          Upload a document
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Folder view with search, filters, and document list */}
              <div className="bg-white shadow sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  {/* Search and filter bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 sm:space-x-4">
                    <div className="relative flex-1">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <HiOutlineSearch className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        className="focus:ring-[#800000] focus:border-[#800000] block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                        placeholder="Search documents"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <div className="flex space-x-2">
                      <select
                        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm rounded-md"
                        value={filters.type}
                        onChange={(e) => setFilters({...filters, type: e.target.value})}
                      >
                        <option value="all">All Types</option>
                        <option value="pdf">PDF</option>
                        <option value="docx">DOCX</option>
                        <option value="xlsx">XLSX</option>
                      </select>
                      
                      <select
                        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm rounded-md"
                        value={filters.status}
                        onChange={(e) => setFilters({...filters, status: e.target.value})}
                      >
                        <option value="all">All Status</option>
                        <option value="draft">Draft</option>
                        <option value="final">Final</option>
                        <option value="needs-signature">Needs Signature</option>
                        <option value="signed">Signed</option>
                      </select>
                      
                      <select
                        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm rounded-md"
                        value={filters.sortBy}
                        onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
                      >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="name-asc">Name (A-Z)</option>
                        <option value="name-desc">Name (Z-A)</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                {/* Bulk actions */}
                {selectedDocuments.length > 0 && (
                  <div className="px-4 py-3 bg-gray-50 border-t border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-700">
                        {selectedDocuments.length} document{selectedDocuments.length !== 1 ? 's' : ''} selected
                      </p>
                      <div className="flex space-x-2">
                        <button
                          type="button"
                          onClick={handleBulkDownload}
                          className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                        >
                          <HiOutlineDownload className="mr-1 h-4 w-4" />
                          Download
                        </button>
                        <button
                          type="button"
                          onClick={handleBulkShare}
                          className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                        >
                          <HiOutlineLink className="mr-1 h-4 w-4" />
                          Share
                        </button>
                        <button
                          type="button"
                          onClick={handleBulkDelete}
                          className="inline-flex items-center px-2.5 py-1.5 border border-transparent shadow-sm text-xs font-medium rounded bg-red-100 text-red-700 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          <HiOutlineTrash className="mr-1 h-4 w-4" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Document list */}
                {sortedDocuments.length > 0 ? (
                  <div className="overflow-hidden overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="relative w-12 px-6 sm:w-16 sm:px-8">
                            <input
                              type="checkbox"
                              className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-[#800000] focus:ring-[#800000]"
                              checked={selectedDocuments.length > 0 && selectedDocuments.length === sortedDocuments.length}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedDocuments(sortedDocuments.map(doc => doc.id));
                                } else {
                                  setSelectedDocuments([]);
                                }
                              }}
                            />
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Document
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Category
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Size / Type
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th scope="col" className="relative px-6 py-3">
                            <span className="sr-only">Actions</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {sortedDocuments.map((document) => (
                          <tr key={document.id} className={selectedDocuments.includes(document.id) ? 'bg-[#800000] bg-opacity-5' : undefined}>
                            <td className="relative w-12 px-6 sm:w-16 sm:px-8">
                              <input
                                type="checkbox"
                                className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-[#800000] focus:ring-[#800000]"
                                checked={selectedDocuments.includes(document.id)}
                                onChange={() => toggleDocumentSelection(document.id)}
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-md bg-blue-100">
                                  <HiOutlineDocumentText className="h-6 w-6 text-blue-600" />
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{document.title}</div>
                                  <div className="text-sm text-gray-500 truncate max-w-xs">
                                    {document.description || 'No description'}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{document.category || 'Uncategorized'}</div>
                              {document.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-1 max-w-xs">
                                  {document.tags.slice(0, 2).map((tag, idx) => (
                                    <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                      {tag}
                                    </span>
                                  ))}
                                  {document.tags.length > 2 && (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                      +{document.tags.length - 2}
                                    </span>
                                  )}
                                </div>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {format(new Date(document.uploadDate), 'MMM d, yyyy')}
                              </div>
                              <div className="text-xs text-gray-500">
                                By {document.uploadedBy}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{document.size}</div>
                              <div className="text-xs text-gray-500">{document.type}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {document.needsSignature ? (
                                document.signed ? (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    <HiOutlineClipboardCheck className="mr-1 h-4 w-4" />
                                    Signed
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                    <HiOutlinePencilAlt className="mr-1 h-4 w-4" />
                                    Needs Signature
                                  </span>
                                )
                              ) : (
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  document.status === 'draft' ? 'bg-gray-100 text-gray-800' : 'bg-blue-100 text-blue-800'
                                }`}>
                                  {document.status === 'draft' ? 'Draft' : 'Final'}
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex space-x-2 justify-end">
                                <button
                                  className="text-gray-400 hover:text-gray-500"
                                  title="Download"
                                  onClick={() => toast.info("Download functionality would be implemented here")}
                                >
                                  <HiOutlineDownload className="h-5 w-5" />
                                </button>
                                <button
                                  className="text-gray-400 hover:text-gray-500"
                                  title="Share"
                                  onClick={() => toast.info("Share functionality would be implemented here")}
                                >
                                  <HiOutlineLink className="h-5 w-5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12 px-4">
                    <HiOutlineDocumentText className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No documents found</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {searchQuery ? 'Try adjusting your search or filters' : 'Get started by adding a document to this folder'}
                    </p>
                    {!searchQuery && (
                      <div className="mt-6">
                        <button
                          type="button"
                          onClick={handleShowUploadModal}
                          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#800000] hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                        >
                          <HiOutlineUpload className="-ml-1 mr-2 h-5 w-5" />
                          Upload a document
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentsPage;