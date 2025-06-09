import React, { useState, useEffect, Fragment, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { format, parseISO } from 'date-fns';
import { Dialog, Transition, Menu, Listbox } from '@headlessui/react';
import { 
  HiOutlineDocumentText,
  HiOutlineDocumentAdd, 
  HiOutlineDownload, 
  HiOutlineTrash, 
  HiOutlineShare,
  HiOutlineSearch,
  HiOutlineFilter,
  HiOutlineFolder,
  HiOutlineFolderAdd,
  HiOutlineChevronDown,
  HiOutlinePencilAlt,
  HiOutlineClipboardCheck,
  HiOutlineTag,
  HiOutlineX,
  HiOutlineExclamation,
  HiOutlineUpload,
  HiOutlineCheck,
  HiOutlineEye,
  HiOutlineRefresh,
  HiOutlineArrowLeft,
  HiOutlineArrowRight,
  HiOutlineDocumentDuplicate,
  HiOutlineViewList,
  HiOutlineViewGrid,
  HiOutlineDotsVertical,
  HiOutlineUsers,
  HiOutlineUserAdd,
  HiOutlineCloudUpload,
  HiOutlineLockClosed,
  HiOutlineBell,
  HiOutlineExternalLink,
  HiOutlineStar,
  HiOutlineCalendar,
  HiOutlineOfficeBuilding,
  HiOutlineMenuAlt2,
  HiChevronLeft,
  HiChevronRight,
  HiSelector,
  HiOutlineUser,
  HiOutlineCheckCircle,
  HiOutlineBriefcase,
  HiX,
  HiChevronUp,
  HiChevronDown
} from 'react-icons/hi';

const AttorneyDocumentsPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState([]);
  const [folders, setFolders] = useState([]);
  const [clients, setClients] = useState([]);
  const [cases, setCases] = useState([]);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedCase, setSelectedCase] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showCreateFolderModal, setShowCreateFolderModal] = useState(false);
  const [showMoveDocumentModal, setShowMoveDocumentModal] = useState(false);
  const [showShareDocumentModal, setShowShareDocumentModal] = useState(false);
  const [showDocumentDetailsModal, setShowDocumentDetailsModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [newFolder, setNewFolder] = useState({name: '', parentId: null});
  const [filesToUpload, setFilesToUpload] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadingStatus, setUploadingStatus] = useState('idle'); // 'idle', 'uploading', 'success', 'error'
  const [folderBreadcrumbs, setFolderBreadcrumbs] = useState([{id: null, name: 'Root'}]);
  const [showSidebar, setShowSidebar] = useState(true);
  const [filterOptions, setFilterOptions] = useState({
    documentType: [],
    dateRange: 'all',
    sharedStatus: 'all'
  });
  const [filters, setFilters] = useState({
    documentType: '',
    dateRange: 'all',
    sharedStatus: 'all'
  });
  
  const fileInputRef = useRef(null);
  
  // Add a success message state for toast notifications
  const [successMessage, setSuccessMessage] = useState('');
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Mock clients data
        const mockClients = [
          { id: 'client1', name: 'John Doe', email: 'john.doe@example.com' },
          { id: 'client2', name: 'Jane Smith', email: 'jane.smith@example.com' },
          { id: 'client3', name: 'Michael Johnson', email: 'michael.johnson@example.com' },
          { id: 'client4', name: 'Emily Williams', email: 'emily.williams@example.com' },
          { id: 'client5', name: 'Robert Brown', email: 'robert.brown@example.com' },
        ];
        
        // Mock cases data
        const mockCases = [
          { id: 'case1', number: 'PI-2025-1452', name: 'Smith v. Johnson', clientId: 'client2', type: 'Personal Injury', status: 'Active' },
          { id: 'case2', number: 'PR-2025-0783', name: 'Estate of Williams', clientId: 'client4', type: 'Probate', status: 'Active' },
          { id: 'case3', number: 'EP-2025-0342', name: 'Tucker Estate Planning', clientId: 'client1', type: 'Estate Planning', status: 'Active' },
          { id: 'case4', number: 'FL-2025-0592', name: 'Jones Divorce', clientId: 'client3', type: 'Family Law', status: 'Active' },
          { id: 'case5', number: 'RE-2025-0952', name: 'Brown Property Dispute', clientId: 'client5', type: 'Real Estate', status: 'Closed' },
        ];
        
        // Mock folders data
        const mockFolders = [
          { id: 'folder1', name: 'Client Documents', parentId: null, clientId: null, caseId: null, createdAt: '2025-01-10T14:30:00Z' },
          { id: 'folder2', name: 'Case Files', parentId: null, clientId: null, caseId: null, createdAt: '2025-01-10T14:35:00Z' },
          { id: 'folder3', name: 'Templates', parentId: null, clientId: null, caseId: null, createdAt: '2025-01-12T09:15:00Z' },
          { id: 'folder4', name: 'Shared with Clients', parentId: null, clientId: null, caseId: null, createdAt: '2025-01-15T11:20:00Z' },
          { id: 'folder5', name: 'Firm Documents', parentId: null, clientId: null, caseId: null, createdAt: '2025-01-18T16:45:00Z' },
          
          // Subfolders
          { id: 'folder6', name: 'Jane Smith', parentId: 'folder1', clientId: 'client2', caseId: null, createdAt: '2025-01-20T10:30:00Z' },
          { id: 'folder7', name: 'Smith v. Johnson', parentId: 'folder2', clientId: 'client2', caseId: 'case1', createdAt: '2025-01-22T14:20:00Z' },
          { id: 'folder8', name: 'Estate of Williams', parentId: 'folder2', clientId: 'client4', caseId: 'case2', createdAt: '2025-01-25T09:10:00Z' },
          { id: 'folder9', name: 'Legal Contracts', parentId: 'folder3', clientId: null, caseId: null, createdAt: '2025-02-01T11:30:00Z' },
          { id: 'folder10', name: 'Estate Planning', parentId: 'folder3', clientId: null, caseId: null, createdAt: '2025-02-05T15:45:00Z' },
          { id: 'folder11', name: 'Administrative', parentId: 'folder5', clientId: null, caseId: null, createdAt: '2025-02-10T13:25:00Z' },
          { id: 'folder12', name: 'HR Policies', parentId: 'folder5', clientId: null, caseId: null, createdAt: '2025-02-15T10:10:00Z' },
        ];
        
        // Mock documents data
        const mockDocuments = [
          // Client documents
          { 
            id: 'doc1', 
            name: 'Client Intake Form - Jane Smith.pdf', 
            folderId: 'folder6', 
            type: 'pdf', 
            size: '245 KB',
            createdAt: '2025-01-25T11:30:00Z',
            modifiedAt: '2025-01-25T11:30:00Z',
            createdBy: 'Sarah Nguyen',
            clientId: 'client2',
            caseId: null,
            isShared: false,
            sharedWith: [],
            status: 'final',
            starred: false,
            tags: ['intake', 'client']
          },
          { 
            id: 'doc2', 
            name: 'Client Contract - Jane Smith.docx', 
            folderId: 'folder6', 
            type: 'docx', 
            size: '185 KB',
            createdAt: '2025-01-26T14:15:00Z',
            modifiedAt: '2025-02-05T09:20:00Z',
            createdBy: 'Sarah Nguyen',
            clientId: 'client2',
            caseId: null,
            isShared: true,
            sharedWith: ['client2'],
            status: 'final',
            starred: true,
            tags: ['contract', 'signed']
          },
          
          // Case files
          { 
            id: 'doc3', 
            name: 'Complaint - Smith v. Johnson.pdf', 
            folderId: 'folder7', 
            type: 'pdf', 
            size: '1.2 MB',
            createdAt: '2025-02-01T10:45:00Z',
            modifiedAt: '2025-02-01T16:30:00Z',
            createdBy: 'Sarah Nguyen',
            clientId: 'client2',
            caseId: 'case1',
            isShared: true,
            sharedWith: ['client2'],
            status: 'final',
            starred: true,
            tags: ['court filing', 'pleading']
          },
          { 
            id: 'doc4', 
            name: 'Deposition Transcript - Johnson.pdf', 
            folderId: 'folder7', 
            type: 'pdf', 
            size: '3.5 MB',
            createdAt: '2025-02-15T15:20:00Z',
            modifiedAt: '2025-02-15T15:20:00Z',
            createdBy: 'Sarah Nguyen',
            clientId: 'client2',
            caseId: 'case1',
            isShared: true,
            sharedWith: ['client2'],
            status: 'final',
            starred: false,
            tags: ['deposition', 'discovery']
          },
          { 
            id: 'doc5', 
            name: 'Settlement Agreement - Draft.docx', 
            folderId: 'folder7', 
            type: 'docx', 
            size: '475 KB',
            createdAt: '2025-03-01T11:30:00Z',
            modifiedAt: '2025-03-10T16:45:00Z',
            createdBy: 'Sarah Nguyen',
            clientId: 'client2',
            caseId: 'case1',
            isShared: false,
            sharedWith: [],
            status: 'draft',
            starred: true,
            tags: ['settlement', 'draft']
          },
          
          // Estate of Williams
          { 
            id: 'doc6', 
            name: 'Probate Petition - Williams.pdf', 
            folderId: 'folder8', 
            type: 'pdf', 
            size: '950 KB',
            createdAt: '2025-02-05T09:15:00Z',
            modifiedAt: '2025-02-05T14:30:00Z',
            createdBy: 'Sarah Nguyen',
            clientId: 'client4',
            caseId: 'case2',
            isShared: true,
            sharedWith: ['client4'],
            status: 'final',
            starred: false,
            tags: ['probate', 'petition']
          },
          { 
            id: 'doc7', 
            name: 'Inventory and Appraisal.xlsx', 
            folderId: 'folder8', 
            type: 'xlsx', 
            size: '320 KB',
            createdAt: '2025-02-20T13:45:00Z',
            modifiedAt: '2025-03-05T10:20:00Z',
            createdBy: 'Robert Chen',
            clientId: 'client4',
            caseId: 'case2',
            isShared: false,
            sharedWith: [],
            status: 'draft',
            starred: false,
            tags: ['inventory', 'financials']
          },
          
          // Templates
          { 
            id: 'doc8', 
            name: 'Client Service Agreement.docx', 
            folderId: 'folder9', 
            type: 'docx', 
            size: '150 KB',
            createdAt: '2025-02-03T11:20:00Z',
            modifiedAt: '2025-02-03T11:20:00Z',
            createdBy: 'Sarah Nguyen',
            clientId: null,
            caseId: null,
            isShared: false,
            sharedWith: [],
            status: 'final',
            starred: true,
            tags: ['template', 'contract']
          },
          { 
            id: 'doc9', 
            name: 'NDA Template.docx', 
            folderId: 'folder9', 
            type: 'docx', 
            size: '125 KB',
            createdAt: '2025-02-10T14:15:00Z',
            modifiedAt: '2025-02-10T14:15:00Z',
            createdBy: 'Sarah Nguyen',
            clientId: null,
            caseId: null,
            isShared: false,
            sharedWith: [],
            status: 'final',
            starred: false,
            tags: ['template', 'nda']
          },
          { 
            id: 'doc10', 
            name: 'Simple Will Template.docx', 
            folderId: 'folder10', 
            type: 'docx', 
            size: '280 KB',
            createdAt: '2025-02-15T09:30:00Z',
            modifiedAt: '2025-03-01T11:45:00Z',
            createdBy: 'Sarah Nguyen',
            clientId: null,
            caseId: null,
            isShared: false,
            sharedWith: [],
            status: 'final',
            starred: true,
            tags: ['template', 'will', 'estate planning']
          },
          { 
            id: 'doc11', 
            name: 'Living Trust Template.docx', 
            folderId: 'folder10', 
            type: 'docx', 
            size: '350 KB',
            createdAt: '2025-02-20T10:45:00Z',
            modifiedAt: '2025-02-20T10:45:00Z',
            createdBy: 'Sarah Nguyen',
            clientId: null,
            caseId: null,
            isShared: false,
            sharedWith: [],
            status: 'final',
            starred: false,
            tags: ['template', 'trust', 'estate planning']
          },
          
          // Firm documents
          { 
            id: 'doc12', 
            name: 'Employee Handbook 2025.pdf', 
            folderId: 'folder12', 
            type: 'pdf', 
            size: '2.1 MB',
            createdAt: '2025-01-20T15:30:00Z',
            modifiedAt: '2025-01-20T15:30:00Z',
            createdBy: 'Jessica Taylor',
            clientId: null,
            caseId: null,
            isShared: false,
            sharedWith: [],
            status: 'final',
            starred: false,
            tags: ['hr', 'policy']
          },
          { 
            id: 'doc13', 
            name: 'Expense Reimbursement Policy.pdf', 
            folderId: 'folder12', 
            type: 'pdf', 
            size: '350 KB',
            createdAt: '2025-02-01T13:15:00Z',
            modifiedAt: '2025-02-01T13:15:00Z',
            createdBy: 'Jessica Taylor',
            clientId: null,
            caseId: null,
            isShared: false,
            sharedWith: [],
            status: 'final',
            starred: false,
            tags: ['hr', 'policy', 'finance']
          },
          { 
            id: 'doc14', 
            name: 'Client Conflict Check Process.docx', 
            folderId: 'folder11', 
            type: 'docx', 
            size: '175 KB',
            createdAt: '2025-02-05T11:10:00Z',
            modifiedAt: '2025-02-15T09:45:00Z',
            createdBy: 'Michael Brown',
            clientId: null,
            caseId: null,
            isShared: false,
            sharedWith: [],
            status: 'final',
            starred: true,
            tags: ['administrative', 'process']
          }
        ];
        
        // Get unique document types for filters
        const docTypes = [...new Set(mockDocuments.map(doc => doc.type))];
        
        setClients(mockClients);
        setCases(mockCases);
        setFolders(mockFolders);
        setDocuments(mockDocuments);
        setFilterOptions(prev => ({...prev, documentType: docTypes}));
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Handle folder navigation
  const navigateToFolder = (folder) => {
    setCurrentFolder(folder);
    
    // Update breadcrumbs
    if (!folder) {
      setFolderBreadcrumbs([{id: null, name: 'Root'}]);
    } else {
      const newBreadcrumbs = [{id: null, name: 'Root'}];
      let currentParent = folder;
      
      // Only add the folder itself if it's not null
      if (currentParent) {
        const folderPath = [];
        
        // Build the path from the current folder back to root
        while (currentParent) {
          folderPath.unshift(currentParent);
          currentParent = folders.find(f => f.id === currentParent.parentId);
        }
        
        // Add each folder in the path to breadcrumbs
        newBreadcrumbs.push(...folderPath.map(f => ({id: f.id, name: f.name})));
      }
      
      setFolderBreadcrumbs(newBreadcrumbs);
    }
  };
  
  // Get current folder's child folders
  const getCurrentFolderChildren = () => {
    return folders.filter(folder => folder.parentId === (currentFolder ? currentFolder.id : null));
  };
  
  // Get documents in current folder
  const getCurrentFolderDocuments = () => {
    const folderDocs = documents.filter(doc => doc.folderId === (currentFolder ? currentFolder.id : null));
    
    // Apply search term filter
    const searchFiltered = searchTerm 
      ? folderDocs.filter(doc => 
          doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (doc.tags && doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))))
      : folderDocs;
    
    // Apply additional filters
    const typeFiltered = filters.documentType 
      ? searchFiltered.filter(doc => doc.type === filters.documentType)
      : searchFiltered;
    
    const dateFiltered = filterByDate(typeFiltered, filters.dateRange);
    
    const sharedFiltered = filters.sharedStatus === 'all'
      ? dateFiltered
      : filters.sharedStatus === 'shared'
        ? dateFiltered.filter(doc => doc.isShared)
        : dateFiltered.filter(doc => !doc.isShared);
    
    // Apply sorting
    return sortDocuments(sharedFiltered, sortBy, sortDirection);
  };
  
  // Filter documents by date range
  const filterByDate = (docs, dateRange) => {
    if (dateRange === 'all') return docs;
    
    const now = new Date();
    const oneDay = 24 * 60 * 60 * 1000;
    const oneWeek = 7 * oneDay;
    const oneMonth = 30 * oneDay;
    
    return docs.filter(doc => {
      const docDate = new Date(doc.modifiedAt);
      const timeDiff = now - docDate;
      
      switch (dateRange) {
        case 'today':
          return timeDiff < oneDay;
        case 'week':
          return timeDiff < oneWeek;
        case 'month':
          return timeDiff < oneMonth;
        default:
          return true;
      }
    });
  };
  
  // Sort documents
  const sortDocuments = (docs, sortField, direction) => {
    return [...docs].sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'date':
          comparison = new Date(b.modifiedAt) - new Date(a.modifiedAt);
          break;
        case 'size':
          // Extract numeric size (strip "KB", "MB", etc.)
          const aSize = parseFloat(a.size.replace(/[^0-9.]/g, ''));
          const bSize = parseFloat(b.size.replace(/[^0-9.]/g, ''));
          
          // Adjust for units (KB vs MB)
          const aUnit = a.size.includes('MB') ? 1024 : 1;
          const bUnit = b.size.includes('MB') ? 1024 : 1;
          
          comparison = (aSize * aUnit) - (bSize * bUnit);
          break;
        case 'type':
          comparison = a.type.localeCompare(b.type);
          break;
        default:
          comparison = 0;
      }
      
      return direction === 'asc' ? comparison : -comparison;
    });
  };
  
  // Handle sort change
  const handleSortChange = (field) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('asc');
    }
  };
  
  // Handle document selection
  const toggleDocumentSelection = (docId) => {
    setSelectedDocuments(prev => {
      if (prev.includes(docId)) {
        return prev.filter(id => id !== docId);
      } else {
        return [...prev, docId];
      }
    });
  };
  
  // Select/deselect all documents
  const toggleSelectAll = () => {
    if (selectedDocuments.length === getCurrentFolderDocuments().length) {
      setSelectedDocuments([]);
    } else {
      setSelectedDocuments(getCurrentFolderDocuments().map(doc => doc.id));
    }
  };
  
  // Handle document delete
  const handleDeleteDocuments = () => {
    setDocuments(prev => prev.filter(doc => !selectedDocuments.includes(doc.id)));
    setSelectedDocuments([]);
    setShowDeleteModal(false);
  };
  
  // Handle folder creation
  const handleCreateFolder = () => {
    if (!newFolder.name.trim()) return;
    
    const folder = {
      id: `folder${folders.length + 1}`,
      name: newFolder.name,
      parentId: currentFolder ? currentFolder.id : null,
      clientId: selectedClient,
      caseId: selectedCase,
      createdAt: new Date().toISOString()
    };
    
    setFolders(prev => [...prev, folder]);
    setNewFolder({name: '', parentId: null});
    setShowCreateFolderModal(false);
  };
  
  // Handle file upload
  const handleFileUpload = () => {
    if (filesToUpload.length === 0) return;
    
    setUploadingStatus('uploading');
    
    // Simulate upload progress
    const uploadInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(uploadInterval);
          
          // Create new document objects
          const newDocs = Array.from(filesToUpload).map((file, index) => {
            const fileExt = file.name.split('.').pop().toLowerCase();
            let fileType = fileExt;
            
            // Normalize file types
            if (['doc', 'docx'].includes(fileExt)) fileType = 'docx';
            if (['xls', 'xlsx'].includes(fileExt)) fileType = 'xlsx';
            if (['ppt', 'pptx'].includes(fileExt)) fileType = 'pptx';
            
            return {
              id: `doc${documents.length + index + 1}`,
              name: file.name,
              folderId: currentFolder ? currentFolder.id : null,
              type: fileType,
              size: `${(file.size / 1024).toFixed(0)} KB`,
              createdAt: new Date().toISOString(),
              modifiedAt: new Date().toISOString(),
              createdBy: user?.displayName || 'Sarah Nguyen',
              clientId: selectedClient,
              caseId: selectedCase,
              isShared: false,
              sharedWith: [],
              status: 'draft',
              starred: false,
              tags: []
            };
          });
          
          // Add the new documents
          setDocuments(prev => [...prev, ...newDocs]);
          
          // Reset the upload state
          setFilesToUpload([]);
          setUploadProgress(0);
          setUploadingStatus('success');
          
          // Close modal after a delay
          setTimeout(() => {
            setUploadingStatus('idle');
            setShowUploadModal(false);
          }, 1500);
        }
        return prev + 10;
      });
    }, 300);
  };
  
  // Handle document star/unstar
  const toggleStarDocument = (e, docId) => {
    e.stopPropagation();
    
    setDocuments(prev => 
      prev.map(doc => 
        doc.id === docId
          ? { ...doc, starred: !doc.starred }
          : doc
      )
    );
  };
  
  // Get document icon based on type
  const getDocumentIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return <div className="text-red-600"><HiOutlineDocumentText className="w-8 h-8" /></div>;
      case 'docx':
        return <div className="text-blue-600"><HiOutlineDocumentText className="w-8 h-8" /></div>;
      case 'xlsx':
        return <div className="text-green-600"><HiOutlineDocumentText className="w-8 h-8" /></div>;
      case 'pptx':
        return <div className="text-orange-600"><HiOutlineDocumentText className="w-8 h-8" /></div>;
      default:
        return <div className="text-gray-600"><HiOutlineDocumentText className="w-8 h-8" /></div>;
    }
  };
  
  // Handle upload button click - simplified version without modal
  const handleUploadClick = () => {
    if (fileInputRef.current) {
      // Trigger the hidden file input
      fileInputRef.current.click();
    } else {
      // Fallback if ref is not available
      setSuccessMessage("Upload functionality is not available. Please try again.");
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  // Add this function to handle file selection
  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      setFilesToUpload(files);
      setSuccessMessage(`${files.length} file(s) selected for upload`);
      
      // Simulate upload progress
      setUploadProgress(0);
      setUploadingStatus('uploading');
      
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(progress);
        
        if (progress >= 100) {
          clearInterval(interval);
          
          // Create new document objects
          const newDocs = Array.from(files).map((file, index) => {
            const fileExt = file.name.split('.').pop().toLowerCase();
            let fileType = fileExt;
            
            // Normalize file types
            if (['doc', 'docx'].includes(fileExt)) fileType = 'docx';
            if (['xls', 'xlsx'].includes(fileExt)) fileType = 'xlsx';
            if (['ppt', 'pptx'].includes(fileExt)) fileType = 'pptx';
            
            return {
              id: `doc${Date.now()}-${index}`,
              name: file.name,
              folderId: currentFolder ? currentFolder.id : null,
              type: fileType,
              size: `${Math.round(file.size / 1024)} KB`,
              createdAt: new Date().toISOString(),
              modifiedAt: new Date().toISOString(),
              createdBy: user?.displayName || 'Current User',
              clientId: selectedClient,
              caseId: selectedCase,
              isShared: false,
              sharedWith: [],
              status: 'draft',
              starred: false,
              tags: []
            };
          });
          
          // Add the new documents
          setDocuments(prev => [...prev, ...newDocs]);
          setUploadingStatus('success');
          setSuccessMessage(`${files.length} file(s) uploaded successfully!`);
          
          // Reset the file input
          e.target.value = null;
          
          setTimeout(() => {
            setUploadingStatus('idle');
            setSuccessMessage('');
          }, 3000);
        }
      }, 300);
    }
  };
  
  // Replace the handleCreateFolderClick function with this simpler version
  const handleCreateFolderClick = () => {
    // Use the browser's built-in prompt for folder name
    const folderName = prompt("Enter a name for your new folder:", "");
    
    if (folderName && folderName.trim()) {
      // Create new folder object
      const folder = {
        id: `folder${Date.now()}`,
        name: folderName.trim(),
        parentId: currentFolder ? currentFolder.id : null,
        clientId: selectedClient,
        caseId: selectedCase,
        createdAt: new Date().toISOString()
      };
      
      // Add the new folder to the folders list
      setFolders(prev => [...prev, folder]);
      
      // Show success message
      setSuccessMessage(`Folder "${folderName.trim()}" created successfully!`);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    }
  };
  
  // Add hidden file input element to the return statement, just before the closing div
  // Add this right before the final closing </div> in the component return
  <input
    type="file"
    ref={fileInputRef}
    onChange={handleFileSelect}
    multiple
    className="hidden"
  />
  
  // Render loading state
  if (loading) {
    return (
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="flex justify-center items-center py-12">
            <div className="animate-pulse flex flex-col items-center">
              <div className="rounded-full bg-gray-200 h-12 w-12 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-48 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-64"></div>
              <div className="mt-4 text-sm text-gray-500">Loading documents...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="py-6">
      {successMessage && (
        <div className="fixed top-4 right-4 z-50 bg-green-50 border border-green-200 text-green-800 rounded-md shadow-md p-4 flex items-center transition-all duration-300 ease-in-out">
          <HiOutlineCheckCircle className="h-5 w-5 text-green-500 mr-2" />
          <span>{successMessage}</span>
          <button
            onClick={() => setSuccessMessage('')}
            className="ml-4 text-green-600 hover:text-green-800"
          >
            <HiOutlineX className="h-5 w-5" />
          </button>
        </div>
      )}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-semibold text-gray-900 flex items-center">
              <HiOutlineDocumentText className="h-6 w-6 text-[#800000] mr-2" />
              Documents
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage, share, and organize all your legal documents
            </p>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4 space-x-2">
            <button
              type="button"
              onClick={handleUploadClick}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#800000] hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
            >
              <HiOutlineUpload className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              Upload
            </button>
            <button
              type="button"
              onClick={handleCreateFolderClick}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
            >
              <HiOutlineFolderAdd className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              New Folder
            </button>
            <button
              type="button"
              onClick={() => setShowSidebar(!showSidebar)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000] md:hidden"
            >
              <HiOutlineMenuAlt2 className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              {showSidebar ? 'Hide Sidebar' : 'Show Sidebar'}
            </button>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6">
          {/* Sidebar */}
          {showSidebar && (
            <div className="w-full md:w-64 flex-shrink-0 bg-white rounded-lg shadow overflow-hidden">
              <nav className="flex-1 space-y-1 py-4">
                <div className="px-3 pb-2">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Quick Access
                  </h3>
                  <div className="mt-2 space-y-1">
                    <a
                      href="#"
                      className="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-900 hover:bg-gray-50"
                    >
                      <HiOutlineStar className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                      Starred
                    </a>
                    <a
                      href="#"
                      className="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-900 hover:bg-gray-50"
                    >
                      <HiOutlineUsers className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                      Shared with Me
                    </a>
                    <a
                      href="#"
                      className="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-900 hover:bg-gray-50"
                    >
                      <HiOutlineShare className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                      Shared by Me
                    </a>
                    <a
                      href="#"
                      className="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-900 hover:bg-gray-50"
                    >
                      <HiOutlineCalendar className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                      Recent
                    </a>
                  </div>
                </div>
                
                <div className="px-3 py-2 border-t border-gray-200">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Clients
                  </h3>
                  <div className="mt-2 space-y-1 max-h-60 overflow-y-auto">
                    {clients.map(client => (
                      <a
                        key={client.id}
                        href="#"
                        className="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-900 hover:bg-gray-50"
                      >
                        <HiOutlineUser className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                        {client.name}
                      </a>
                    ))}
                  </div>
                </div>
                
                <div className="px-3 py-2 border-t border-gray-200">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Cases
                  </h3>
                  <div className="mt-2 space-y-1 max-h-60 overflow-y-auto">
                    {cases.map(caseItem => (
                      <a
                        key={caseItem.id}
                        href="#"
                        className="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-900 hover:bg-gray-50"
                      >
                        <HiOutlineBriefcase className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                        {caseItem.name}
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                          {caseItem.status}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
                
                <div className="px-3 py-2 border-t border-gray-200">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Storage
                  </h3>
                  <div className="mt-2 px-3">
                    <div className="space-y-2">
                      <div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">65% used</span>
                          <span className="text-gray-900 font-medium">6.5 GB of 10 GB</span>
                        </div>
                        <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-[#800000] h-2 rounded-full" style={{ width: '65%' }}></div>
                        </div>
                      </div>
                      <a
                        href="#"
                        className="inline-flex items-center text-sm text-[#800000] hover:text-[#600000]"
                      >
                        <HiOutlineExternalLink className="mr-1 h-4 w-4" />
                        Upgrade Storage
                      </a>
                    </div>
                  </div>
                </div>
              </nav>
            </div>
          )}
          
          {/* Main content */}
          <div className="flex-1 bg-white rounded-lg shadow overflow-hidden">
            {/* Toolbar */}
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              {/* Breadcrumbs */}
              <div className="mb-4 flex items-center text-sm text-gray-500 flex-wrap">
                {folderBreadcrumbs.map((crumb, index) => (
                  <React.Fragment key={crumb.id || 'root'}>
                    {index > 0 && <HiChevronRight className="mx-2 h-4 w-4 text-gray-400" />}
                    <button
                      type="button"
                      onClick={() => navigateToFolder(crumb.id ? folders.find(f => f.id === crumb.id) : null)}
                      className={`hover:text-gray-700 ${index === folderBreadcrumbs.length - 1 ? 'font-medium text-gray-900' : ''}`}
                    >
                      {crumb.name}
                    </button>
                  </React.Fragment>
                ))}
              </div>
              
              {/* Controls and search */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
                <div className="w-full sm:w-auto flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                  <div className="relative rounded-md shadow-sm max-w-md">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <HiOutlineSearch className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      className="focus:ring-[#800000] focus:border-[#800000] block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                      placeholder="Search documents..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  <Menu as="div" className="relative inline-block text-left">
                    <Menu.Button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]">
                      <HiOutlineFilter className="-ml-1 mr-2 h-5 w-5 text-gray-400" />
                      Filters
                      {(filters.documentType || filters.dateRange !== 'all' || filters.sharedStatus !== 'all') && (
                        <span className="ml-1 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#800000] text-white">
                          {[
                            filters.documentType ? 1 : 0,
                            filters.dateRange !== 'all' ? 1 : 0,
                            filters.sharedStatus !== 'all' ? 1 : 0,
                          ].reduce((a, b) => a + b, 0)}
                        </span>
                      )}
                    </Menu.Button>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="origin-top-right absolute right-0 mt-2 w-64 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                        <div className="py-1">
                          <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-200 flex justify-between">
                            <span className="font-medium">Filters</span>
                            <button
                              type="button"
                              onClick={() => setFilters({
                                documentType: '',
                                dateRange: 'all',
                                sharedStatus: 'all'
                              })}
                              className="text-[#800000] hover:text-[#600000] text-xs font-medium"
                            >
                              Reset
                            </button>
                          </div>
                          
                          <div className="px-4 py-2">
                            <label htmlFor="document-type" className="block text-sm font-medium text-gray-700 mb-1">
                              Document Type
                            </label>
                            <select
                              id="document-type"
                              name="document-type"
                              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm rounded-md"
                              value={filters.documentType}
                              onChange={(e) => setFilters({...filters, documentType: e.target.value})}
                            >
                              <option value="">All Types</option>
                              {filterOptions.documentType.map(type => (
                                <option key={type} value={type}>{type.toUpperCase()}</option>
                              ))}
                            </select>
                          </div>
                          
                          <div className="px-4 py-2">
                            <label htmlFor="date-range" className="block text-sm font-medium text-gray-700 mb-1">
                              Date Modified
                            </label>
                            <select
                              id="date-range"
                              name="date-range"
                              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm rounded-md"
                              value={filters.dateRange}
                              onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
                            >
                              <option value="all">Any Time</option>
                              <option value="today">Today</option>
                              <option value="week">Last 7 Days</option>
                              <option value="month">Last 30 Days</option>
                            </select>
                          </div>
                          
                          <div className="px-4 py-2">
                            <label htmlFor="shared-status" className="block text-sm font-medium text-gray-700 mb-1">
                              Shared Status
                            </label>
                            <select
                              id="shared-status"
                              name="shared-status"
                              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm rounded-md"
                              value={filters.sharedStatus}
                              onChange={(e) => setFilters({...filters, sharedStatus: e.target.value})}
                            >
                              <option value="all">All Documents</option>
                              <option value="shared">Shared Only</option>
                              <option value="not-shared">Not Shared</option>
                            </select>
                          </div>
                        </div>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="flex border border-gray-300 rounded-md">
                    <button
                      type="button"
                      onClick={() => setViewMode('list')}
                      className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-l-md ${
                        viewMode === 'list'
                          ? 'bg-gray-100 text-gray-900'
                          : 'bg-white text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      <HiOutlineViewList className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode('grid')}
                      className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-r-md ${
                        viewMode === 'grid'
                          ? 'bg-gray-100 text-gray-900'
                          : 'bg-white text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      <HiOutlineViewGrid className="h-5 w-5" />
                    </button>
                  </div>
                  
                  {selectedDocuments.length > 0 && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">
                        {selectedDocuments.length} selected
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowDeleteModal(true)}
                        className="inline-flex items-center p-1.5 border border-transparent rounded-md text-gray-400 hover:bg-red-50 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        title="Delete selected"
                      >
                        <HiOutlineTrash className="h-5 w-5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowShareDocumentModal(true)}
                        className="inline-flex items-center p-1.5 border border-transparent rounded-md text-gray-400 hover:bg-blue-50 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        title="Share selected"
                      >
                        <HiOutlineShare className="h-5 w-5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowMoveDocumentModal(true)}
                        className="inline-flex items-center p-1.5 border border-transparent rounded-md text-gray-400 hover:bg-indigo-50 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        title="Move selected"
                      >
                        <HiOutlineFolder className="h-5 w-5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedDocuments([])}
                        className="inline-flex items-center p-1.5 border border-transparent rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none"
                        title="Clear selection"
                      >
                        <HiOutlineX className="h-5 w-5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Document List Content */}
            <div className="px-4 py-5 sm:px-6">
              {/* Current folder info */}
              {currentFolder && (
                <div className="mb-4 bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start sm:items-center flex-col sm:flex-row">
                    <div className="flex items-center">
                      <HiOutlineFolder className="h-8 w-8 text-yellow-500" />
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">{currentFolder.name}</h3>
                        <p className="text-sm text-gray-500">
                          {getCurrentFolderChildren().length} folders, {getCurrentFolderDocuments().length} documents
                        </p>
                      </div>
                    </div>
                    {(currentFolder.clientId || currentFolder.caseId) && (
                      <div className="mt-3 sm:mt-0 sm:ml-auto flex flex-col sm:items-end">
                        {currentFolder.clientId && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Client: {clients.find(c => c.id === currentFolder.clientId)?.name}
                          </span>
                        )}
                        {currentFolder.caseId && (
                          <span className="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            Case: {cases.find(c => c.id === currentFolder.caseId)?.name}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Subfolders */}
              {getCurrentFolderChildren().length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Folders</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {getCurrentFolderChildren().map(folder => (
                      <div
                        key={folder.id}
                        className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer group"
                        onClick={() => navigateToFolder(folder)}
                      >
                        <div className="p-4">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 text-yellow-500">
                              <HiOutlineFolder className="h-8 w-8" />
                            </div>
                            <div className="ml-3 flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate group-hover:text-[#800000]">
                                {folder.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {format(parseISO(folder.createdAt), 'MMM d, yyyy')}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Documents */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-medium text-gray-900">Documents</h3>
                  <div className="text-sm text-gray-500">
                    {getCurrentFolderDocuments().length} {getCurrentFolderDocuments().length === 1 ? 'document' : 'documents'}
                  </div>
                </div>
                
                {getCurrentFolderDocuments().length === 0 ? (
                  <div className="bg-gray-50 rounded-lg p-8 text-center">
                    <HiOutlineDocumentText className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No documents</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Get started by uploading a document or creating a new folder.
                    </p>
                    <div className="mt-6">
                      <button
                        type="button"
                        onClick={() => setShowUploadModal(true)}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#800000] hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                      >
                        <HiOutlineUpload className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                        Upload Document
                      </button>
                    </div>
                  </div>
                ) : viewMode === 'list' ? (
                  <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
                    <div className="min-w-full">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-8">
                              <input
                                type="checkbox"
                                className="focus:ring-[#800000] h-4 w-4 text-[#800000] border-gray-300 rounded"
                                checked={selectedDocuments.length === getCurrentFolderDocuments().length && getCurrentFolderDocuments().length > 0}
                                onChange={toggleSelectAll}
                              />
                            </th>
                            <th 
                              scope="col" 
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                              onClick={() => handleSortChange('name')}
                            >
                              <div className="flex items-center">
                                Name
                                {sortBy === 'name' && (
                                  <span className="ml-1">
                                    {sortDirection === 'asc' ? <HiChevronUp className="h-4 w-4" /> : <HiChevronDown className="h-4 w-4" />}
                                  </span>
                                )}
                              </div>
                            </th>
                            <th 
                              scope="col" 
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                              onClick={() => handleSortChange('type')}
                            >
                              <div className="flex items-center">
                                Type
                                {sortBy === 'type' && (
                                  <span className="ml-1">
                                    {sortDirection === 'asc' ? <HiChevronUp className="h-4 w-4" /> : <HiChevronDown className="h-4 w-4" />}
                                  </span>
                                )}
                              </div>
                            </th>
                            <th 
                              scope="col" 
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                              onClick={() => handleSortChange('date')}
                            >
                              <div className="flex items-center">
                                Modified
                                {sortBy === 'date' && (
                                  <span className="ml-1">
                                    {sortDirection === 'asc' ? <HiChevronUp className="h-4 w-4" /> : <HiChevronDown className="h-4 w-4" />}
                                  </span>
                                )}
                              </div>
                            </th>
                            <th 
                              scope="col" 
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                              onClick={() => handleSortChange('size')}
                            >
                              <div className="flex items-center">
                                Size
                                {sortBy === 'size' && (
                                  <span className="ml-1">
                                    {sortDirection === 'asc' ? <HiChevronUp className="h-4 w-4" /> : <HiChevronDown className="h-4 w-4" />}
                                  </span>
                                )}
                              </div>
                            </th>
                            <th scope="col" className="relative px-6 py-3">
                              <span className="sr-only">Actions</span>
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {getCurrentFolderDocuments().map(document => (
                            <tr 
                              key={document.id} 
                              className={`${selectedDocuments.includes(document.id) ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                              onClick={() => {
                                setSelectedDocument(document);
                                setShowDocumentDetailsModal(true);
                              }}
                            >
                              <td className="px-6 py-4 whitespace-nowrap" onClick={e => e.stopPropagation()}>
                                <input
                                  type="checkbox"
                                  className="focus:ring-[#800000] h-4 w-4 text-[#800000] border-gray-300 rounded"
                                  checked={selectedDocuments.includes(document.id)}
                                  onChange={() => toggleDocumentSelection(document.id)}
                                />
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleStarDocument(e, document.id);
                                    }}
                                    className="mr-2 text-gray-400 hover:text-yellow-500"
                                  >
                                    {document.starred ? (
                                      <HiOutlineStar className="h-5 w-5 text-yellow-500" />
                                    ) : (
                                      <HiOutlineStar className="h-5 w-5" />
                                    )}
                                  </button>
                                  {getDocumentIcon(document.type)}
                                  <div className="ml-3">
                                    <div className="text-sm font-medium text-gray-900">{document.name}</div>
                                    {document.status === 'draft' && (
                                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                                        Draft
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{document.type.toUpperCase()}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{format(parseISO(document.modifiedAt), 'MMM d, yyyy')}</div>
                                <div className="text-xs text-gray-500">{document.createdBy}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {document.size}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium" onClick={e => e.stopPropagation()}>
                                <div className="flex justify-end space-x-2">
                                  <button
                                    type="button"
                                    className="text-gray-400 hover:text-gray-500"
                                    title="Download"
                                  >
                                    <HiOutlineDownload className="h-5 w-5" />
                                  </button>
                                  <button
                                    type="button"
                                    className="text-gray-400 hover:text-gray-500"
                                    title="Share"
                                  >
                                    <HiOutlineShare className="h-5 w-5" />
                                  </button>
                                  <Menu as="div" className="relative inline-block text-left">
                                    <Menu.Button className="text-gray-400 hover:text-gray-500 focus:outline-none">
                                      <HiOutlineDotsVertical className="h-5 w-5" />
                                    </Menu.Button>
                                    <Transition
                                      as={Fragment}
                                      enter="transition ease-out duration-100"
                                      enterFrom="transform opacity-0 scale-95"
                                      enterTo="transform opacity-100 scale-100"
                                      leave="transition ease-in duration-75"
                                      leaveFrom="transform opacity-100 scale-100"
                                      leaveTo="transform opacity-0 scale-95"
                                    >
                                      <Menu.Items className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                                        <div className="py-1">
                                          <Menu.Item>
                                            {({ active }) => (
                                              <a
                                                href="#"
                                                className={`${
                                                  active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                                } flex px-4 py-2 text-sm`}
                                              >
                                                <HiOutlineEye className="mr-3 h-5 w-5 text-gray-400" />
                                                <span>Preview</span>
                                              </a>
                                            )}
                                          </Menu.Item>
                                          <Menu.Item>
                                            {({ active }) => (
                                              <a
                                                href="#"
                                                className={`${
                                                  active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                                } flex px-4 py-2 text-sm`}
                                              >
                                                <HiOutlinePencilAlt className="mr-3 h-5 w-5 text-gray-400" />
                                                <span>Edit</span>
                                              </a>
                                            )}
                                          </Menu.Item>
                                          <Menu.Item>
                                            {({ active }) => (
                                              <a
                                                href="#"
                                                className={`${
                                                  active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                                } flex px-4 py-2 text-sm`}
                                              >
                                                <HiOutlineDocumentDuplicate className="mr-3 h-5 w-5 text-gray-400" />
                                                <span>Duplicate</span>
                                              </a>
                                            )}
                                          </Menu.Item>
                                          <Menu.Item>
                                            {({ active }) => (
                                              <a
                                                href="#"
                                                className={`${
                                                  active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                                } flex px-4 py-2 text-sm`}
                                              >
                                                <HiOutlineTag className="mr-3 h-5 w-5 text-gray-400" />
                                                <span>Add Tags</span>
                                              </a>
                                            )}
                                          </Menu.Item>
                                          <div className="border-t border-gray-100"></div>
                                          <Menu.Item>
                                            {({ active }) => (
                                              <a
                                                href="#"
                                                className={`${
                                                  active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                                } flex px-4 py-2 text-sm`}
                                                onClick={() => {
                                                  toggleDocumentSelection(document.id);
                                                  setShowDeleteModal(true);
                                                }}
                                              >
                                                <HiOutlineTrash className="mr-3 h-5 w-5 text-gray-400" />
                                                <span>Delete</span>
                                              </a>
                                            )}
                                          </Menu.Item>
                                        </div>
                                      </Menu.Items>
                                    </Transition>
                                  </Menu>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  /* Grid View */
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {getCurrentFolderDocuments().map(document => (
                      <div
                        key={document.id}
                        className={`${
                          selectedDocuments.includes(document.id) ? 'ring-2 ring-blue-500' : 'hover:shadow-md'
                        } bg-white border border-gray-200 rounded-lg overflow-hidden transition-all cursor-pointer group`}
                        onClick={() => {
                          setSelectedDocument(document);
                          setShowDocumentDetailsModal(true);
                        }}
                      >
                        <div className="p-4">
                          <div className="flex justify-between items-start">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleStarDocument(e, document.id);
                              }}
                              className="text-gray-400 hover:text-yellow-500"
                            >
                              {document.starred ? (
                                <HiOutlineStar className="h-5 w-5 text-yellow-500" />
                              ) : (
                                <HiOutlineStar className="h-5 w-5" />
                              )}
                            </button>
                            <div onClick={e => e.stopPropagation()}>
                              <input
                                type="checkbox"
                                className="focus:ring-[#800000] h-4 w-4 text-[#800000] border-gray-300 rounded"
                                checked={selectedDocuments.includes(document.id)}
                                onChange={() => toggleDocumentSelection(document.id)}
                              />
                            </div>
                          </div>
                          <div className="flex flex-col items-center mt-2">
                            {getDocumentIcon(document.type)}
                            <div className="mt-3 text-center">
                              <div className="text-sm font-medium text-gray-900 group-hover:text-[#800000] truncate max-w-full">
                                {document.name}
                              </div>
                              <div className="mt-1 text-xs text-gray-500">
                                {document.size} • {format(parseISO(document.modifiedAt), 'MMM d, yyyy')}
                              </div>
                              {document.status === 'draft' && (
                                <span className="mt-1 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                                  Draft
                                </span>
                              )}
                              {document.isShared && (
                                <span className="mt-1 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                  Shared
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="mt-3 flex justify-center space-x-2" onClick={e => e.stopPropagation()}>
                            <button
                              type="button"
                              className="text-gray-400 hover:text-gray-500"
                              title="Download"
                            >
                              <HiOutlineDownload className="h-5 w-5" />
                            </button>
                            <button
                              type="button"
                              className="text-gray-400 hover:text-gray-500"
                              title="Share"
                            >
                              <HiOutlineShare className="h-5 w-5" />
                            </button>
                            <button
                              type="button"
                              className="text-gray-400 hover:text-gray-500"
                              title="More options"
                            >
                              <HiOutlineDotsVertical className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Create Folder Modal */}
      <Transition appear show={showCreateFolderModal} as={Fragment}>
        <Dialog 
          as="div" 
          className="fixed inset-0 z-10 overflow-y-auto" 
          onClose={() => setShowCreateFolderModal(false)}
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

            {/* This element is to trick the browser into centering the modal contents. */}
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
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Create New Folder
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Enter a name for your new folder in {currentFolder ? `"${currentFolder.name}"` : 'root directory'}.
                  </p>
                </div>

                <div className="mt-4">
                  <label htmlFor="folder-name" className="block text-sm font-medium text-gray-700">
                    Folder Name
                  </label>
                  <input
                    type="text"
                    id="folder-name"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#800000] focus:border-[#800000] sm:text-sm"
                    value={newFolder.name}
                    onChange={(e) => setNewFolder({...newFolder, name: e.target.value})}
                    autoFocus
                    placeholder="Enter folder name"
                  />
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                    onClick={() => setShowCreateFolderModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className={`inline-flex justify-center px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md ${newFolder.name.trim() ? 'bg-[#800000] hover:bg-[#600000]' : 'bg-gray-300 cursor-not-allowed'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]`}
                    onClick={handleCreateFolder}
                    disabled={!newFolder.name.trim()}
                  >
                    Create Folder
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

export default AttorneyDocumentsPage;