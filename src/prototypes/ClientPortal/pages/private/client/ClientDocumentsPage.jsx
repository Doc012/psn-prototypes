import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { 
  HiOutlineDocumentText, 
  HiOutlineDownload, 
  HiOutlineUpload, 
  HiOutlineFolder,
  HiOutlineFolderOpen,
  HiOutlineSearch,
  HiOutlineTag,
  HiOutlineEye,
  HiOutlineTrash,
  HiChevronDown,
  HiOutlineExclamation,
  HiOutlineCheck,
  HiOutlineX,
  HiOutlineFilter,
  HiOutlinePlus,
  HiOutlineClock,
  HiOutlineStar,
  HiOutlineClipboardCopy,
  HiOutlineShare,
  HiOutlinePencilAlt,
  HiOutlineAdjustments,
  HiOutlineDocumentDuplicate,
  HiOutlineSortAscending,
  HiOutlineSortDescending,
  HiOutlineCloudUpload,
  HiOutlineExternalLink,
  HiOutlineInformationCircle,
  HiOutlineLockClosed,
  HiOutlineDocumentAdd,
  HiOutlineOfficeBuilding,
  HiOutlineCollection,
  HiOutlineQuestionMarkCircle,
  HiOutlineUserCircle,
  HiOutlineCalendar
} from 'react-icons/hi';
import { useAuth } from '../../../context/AuthContext';

const ClientDocumentsPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('uploadDate');
  const [sortDirection, setSortDirection] = useState('desc');
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [dateFilter, setDateFilter] = useState('all');
  const [previewDocument, setPreviewDocument] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [newFolderName, setNewFolderName] = useState('');
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadFiles, setUploadFiles] = useState([]);
  const [showFileSizeWarning, setShowFileSizeWarning] = useState(false);
  const [documentCounts, setDocumentCounts] = useState({
    total: 0,
    needsAction: 0,
    shared: 0
  });
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [selectedCase, setSelectedCase] = useState('');
  const [showDetailSidebar, setShowDetailSidebar] = useState(false);
  const [activeMobileTab, setActiveMobileTab] = useState('documents'); // 'documents' or 'folders'
  
  const fileInputRef = useRef(null);
  const searchInputRef = useRef(null);
  
  // Get current date for realistic timestamps
  const currentYear = new Date().getFullYear();
  const today = new Date();
  const lastWeek = new Date(today);
  lastWeek.setDate(today.getDate() - 7);
  const lastMonth = new Date(today);
  lastMonth.setMonth(lastMonth.getMonth() - 1);
  const twoMonthsAgo = new Date(today);
  twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
  const threeMonthsAgo = new Date(today);
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
  
  // All available tags
  const [allTags, setAllTags] = useState([]);
  
  // Folders
  const [folders, setFolders] = useState([
    { id: 'all', name: 'All Documents', count: 0, icon: <HiOutlineCollection /> },
    { id: 'case-documents', name: 'Case Documents', count: 0, icon: <HiOutlineFolder /> },
    { id: 'contracts', name: 'Contracts', count: 0, icon: <HiOutlineDocumentText /> },
    { id: 'court-filings', name: 'Court Filings', count: 0, icon: <HiOutlineOfficeBuilding /> },
    { id: 'personal-documents', name: 'Personal Documents', count: 0, icon: <HiOutlineUserCircle /> },
    { id: 'needs-review', name: 'Needs Review', count: 0, icon: <HiOutlineEye /> },
    { id: 'needs-signature', name: 'Needs Signature', count: 0, icon: <HiOutlinePencilAlt /> },
    { id: 'shared-with-me', name: 'Shared With Me', count: 0, icon: <HiOutlineShare /> },
  ]);
  
  // Available cases
  const [cases, setCases] = useState([
    { id: 'smith-johnson', name: 'Smith v. Johnson', number: `PI-${currentYear}-1452` },
    { id: 'brown-contract', name: 'Brown LLC Contract', number: `CL-${currentYear}-0251` },
    { id: 'estate-planning', name: 'Estate Planning', number: `EP-${currentYear}-0342` },
    { id: 'jones-divorce', name: 'Jones Divorce', number: `FL-${currentYear}-0592` }
  ]);
  
  // Fetch documents
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        // Mock data - would be replaced with API call
        const mockDocuments = [
          {
            id: 1,
            name: 'Settlement Agreement.pdf',
            folder: 'case-documents',
            description: 'Final settlement agreement for Smith v. Johnson case',
            size: '1.2 MB',
            type: 'application/pdf',
            uploadDate: today.toISOString(),
            uploadedBy: { id: 456, name: 'Sarah Wilson', role: 'attorney', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
            status: 'Needs Review',
            caseRef: { id: 'smith-johnson', name: 'Smith v. Johnson', number: `PI-${currentYear}-1452` },
            tags: ['settlement', 'agreement', 'personal injury'],
            lastViewed: new Date(today.setHours(today.getHours() - 2)).toISOString(),
            starred: false,
            version: 1,
            versionHistory: [
              { version: 1, date: today.toISOString(), uploadedBy: { id: 456, name: 'Sarah Wilson', role: 'attorney' } }
            ],
            previewUrl: 'https://documentcloud.adobe.com/view-sdk-demo/PDFs/Bodea Brochure.pdf',
            sharedWith: [],
            comments: [
              { id: 1, author: { id: 456, name: 'Sarah Wilson', role: 'attorney', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' }, content: 'Please review this settlement agreement as soon as possible.', timestamp: new Date(today.setHours(today.getHours() - 1)).toISOString() }
            ],
            needsAction: true,
            actionType: 'review',
            actionDeadline: new Date(today.setDate(today.getDate() + 3)).toISOString()
          },
          {
            id: 2,
            name: 'Medical Records.pdf',
            folder: 'case-documents',
            description: 'Compiled medical records for personal injury claim',
            size: '5.4 MB',
            type: 'application/pdf',
            uploadDate: lastWeek.toISOString(),
            uploadedBy: { id: 123, name: user?.displayName || 'John Doe', role: 'client', avatar: null },
            status: 'Approved',
            caseRef: { id: 'smith-johnson', name: 'Smith v. Johnson', number: `PI-${currentYear}-1452` },
            tags: ['medical', 'records', 'personal injury'],
            lastViewed: new Date(today.setHours(today.getHours() - 5)).toISOString(),
            starred: true,
            version: 2,
            versionHistory: [
              { version: 1, date: new Date(lastWeek.setDate(lastWeek.getDate() - 2)).toISOString(), uploadedBy: { id: 123, name: user?.displayName || 'John Doe', role: 'client' } },
              { version: 2, date: lastWeek.toISOString(), uploadedBy: { id: 123, name: user?.displayName || 'John Doe', role: 'client' } }
            ],
            previewUrl: 'https://documentcloud.adobe.com/view-sdk-demo/PDFs/Bodea Brochure.pdf',
            sharedWith: [
              { id: 456, name: 'Sarah Wilson', role: 'attorney', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' }
            ],
            comments: [],
            needsAction: false
          },
          {
            id: 3,
            name: 'Power of Attorney.pdf',
            folder: 'personal-documents',
            description: 'Signed power of attorney document',
            size: '875 KB',
            type: 'application/pdf',
            uploadDate: lastMonth.toISOString(),
            uploadedBy: { id: 456, name: 'Sarah Wilson', role: 'attorney', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
            status: 'Approved',
            caseRef: null,
            tags: ['legal', 'power of attorney'],
            lastViewed: new Date(lastWeek.setDate(lastWeek.getDate() - 5)).toISOString(),
            starred: false,
            version: 1,
            versionHistory: [
              { version: 1, date: lastMonth.toISOString(), uploadedBy: { id: 456, name: 'Sarah Wilson', role: 'attorney' } }
            ],
            previewUrl: 'https://documentcloud.adobe.com/view-sdk-demo/PDFs/Bodea Brochure.pdf',
            sharedWith: [],
            comments: [],
            needsAction: false
          },
          {
            id: 4,
            name: 'Contract Draft.docx',
            folder: 'contracts',
            description: 'Draft contract for Brown LLC',
            size: '320 KB',
            type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            uploadDate: lastMonth.toISOString(),
            uploadedBy: { id: 789, name: 'Michael Brown', role: 'attorney', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
            status: 'Needs Signature',
            caseRef: { id: 'brown-contract', name: 'Brown LLC Contract', number: `CL-${currentYear}-0251` },
            tags: ['contract', 'draft', 'business'],
            lastViewed: new Date(today.setDate(today.getDate() - 10)).toISOString(),
            starred: false,
            version: 3,
            versionHistory: [
              { version: 1, date: new Date(lastMonth.setDate(lastMonth.getDate() - 10)).toISOString(), uploadedBy: { id: 789, name: 'Michael Brown', role: 'attorney' } },
              { version: 2, date: new Date(lastMonth.setDate(lastMonth.getDate() - 5)).toISOString(), uploadedBy: { id: 789, name: 'Michael Brown', role: 'attorney' } },
              { version: 3, date: lastMonth.toISOString(), uploadedBy: { id: 789, name: 'Michael Brown', role: 'attorney' } }
            ],
            previewUrl: null,
            sharedWith: [],
            comments: [
              { id: 2, author: { id: 789, name: 'Michael Brown', role: 'attorney', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' }, content: 'This contract requires your signature.', timestamp: new Date(lastMonth.setHours(lastMonth.getHours() + 2)).toISOString() }
            ],
            needsAction: true,
            actionType: 'signature',
            actionDeadline: new Date(today.setDate(today.getDate() + 5)).toISOString()
          },
          {
            id: 5,
            name: 'Witness Statement.docx',
            folder: 'case-documents',
            description: 'Witness statement for Smith v. Johnson case',
            size: '198 KB',
            type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            uploadDate: twoMonthsAgo.toISOString(),
            uploadedBy: { id: 456, name: 'Sarah Wilson', role: 'attorney', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
            status: 'Approved',
            caseRef: { id: 'smith-johnson', name: 'Smith v. Johnson', number: `PI-${currentYear}-1452` },
            tags: ['witness', 'statement', 'personal injury'],
            lastViewed: null,
            starred: false,
            version: 1,
            versionHistory: [
              { version: 1, date: twoMonthsAgo.toISOString(), uploadedBy: { id: 456, name: 'Sarah Wilson', role: 'attorney' } }
            ],
            previewUrl: null,
            sharedWith: [],
            comments: [],
            needsAction: false
          },
          {
            id: 6,
            name: 'Motion to Dismiss.pdf',
            folder: 'court-filings',
            description: 'Motion to dismiss filed with court',
            size: '1.8 MB',
            type: 'application/pdf',
            uploadDate: twoMonthsAgo.toISOString(),
            uploadedBy: { id: 456, name: 'Sarah Wilson', role: 'attorney', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
            status: 'Approved',
            caseRef: { id: 'smith-johnson', name: 'Smith v. Johnson', number: `PI-${currentYear}-1452` },
            tags: ['court', 'motion', 'filing'],
            lastViewed: new Date(lastWeek.setDate(lastWeek.getDate() - 2)).toISOString(),
            starred: true,
            version: 1,
            versionHistory: [
              { version: 1, date: twoMonthsAgo.toISOString(), uploadedBy: { id: 456, name: 'Sarah Wilson', role: 'attorney' } }
            ],
            previewUrl: 'https://documentcloud.adobe.com/view-sdk-demo/PDFs/Bodea Brochure.pdf',
            sharedWith: [],
            comments: [],
            needsAction: false
          },
          {
            id: 7,
            name: 'Estate Plan Draft.pdf',
            folder: 'personal-documents',
            description: 'Draft estate planning documents',
            size: '3.2 MB',
            type: 'application/pdf',
            uploadDate: threeMonthsAgo.toISOString(),
            uploadedBy: { id: 101, name: 'Jessica Taylor', role: 'attorney', avatar: 'https://randomuser.me/api/portraits/women/68.jpg' },
            status: 'Needs Review',
            caseRef: { id: 'estate-planning', name: 'Estate Planning', number: `EP-${currentYear}-0342` },
            tags: ['estate', 'planning', 'will', 'trust'],
            lastViewed: new Date(lastMonth.setDate(lastMonth.getDate() - 5)).toISOString(),
            starred: false,
            version: 2,
            versionHistory: [
              { version: 1, date: new Date(threeMonthsAgo.setDate(threeMonthsAgo.getDate() - 5)).toISOString(), uploadedBy: { id: 101, name: 'Jessica Taylor', role: 'attorney' } },
              { version: 2, date: threeMonthsAgo.toISOString(), uploadedBy: { id: 101, name: 'Jessica Taylor', role: 'attorney' } }
            ],
            previewUrl: 'https://documentcloud.adobe.com/view-sdk-demo/PDFs/Bodea Brochure.pdf',
            sharedWith: [],
            comments: [
              { id: 3, author: { id: 101, name: 'Jessica Taylor', role: 'attorney', avatar: 'https://randomuser.me/api/portraits/women/68.jpg' }, content: 'Please review the updates to your estate plan.', timestamp: threeMonthsAgo.toISOString() }
            ],
            needsAction: true,
            actionType: 'review',
            actionDeadline: new Date(today.setDate(today.getDate() + 7)).toISOString()
          },
          {
            id: 8,
            name: 'Financial Disclosure.pdf',
            folder: 'case-documents',
            description: 'Financial disclosure for Jones divorce proceedings',
            size: '2.7 MB',
            type: 'application/pdf',
            uploadDate: new Date(today.setDate(today.getDate() - 14)).toISOString(),
            uploadedBy: { id: 123, name: user?.displayName || 'John Doe', role: 'client', avatar: null },
            status: 'Approved',
            caseRef: { id: 'jones-divorce', name: 'Jones Divorce', number: `FL-${currentYear}-0592` },
            tags: ['financial', 'divorce', 'disclosure'],
            lastViewed: new Date(today.setHours(today.getHours() - 36)).toISOString(),
            starred: false,
            version: 1,
            versionHistory: [
              { version: 1, date: new Date(today.setDate(today.getDate() - 14)).toISOString(), uploadedBy: { id: 123, name: user?.displayName || 'John Doe', role: 'client' } }
            ],
            previewUrl: 'https://documentcloud.adobe.com/view-sdk-demo/PDFs/Bodea Brochure.pdf',
            sharedWith: [
              { id: 202, name: 'Michael Patel', role: 'attorney', avatar: 'https://randomuser.me/api/portraits/men/56.jpg' }
            ],
            comments: [],
            needsAction: false
          },
          {
            id: 9,
            name: 'Insurance Policy.pdf',
            folder: 'shared-with-me',
            description: 'Insurance policy documentation shared by insurance company',
            size: '4.1 MB',
            type: 'application/pdf',
            uploadDate: new Date(today.setDate(today.getDate() - 5)).toISOString(),
            uploadedBy: { id: 303, name: 'Insurance Co.', role: 'external', avatar: null },
            status: 'Approved',
            caseRef: { id: 'smith-johnson', name: 'Smith v. Johnson', number: `PI-${currentYear}-1452` },
            tags: ['insurance', 'policy', 'external'],
            lastViewed: null,
            starred: false,
            version: 1,
            versionHistory: [
              { version: 1, date: new Date(today.setDate(today.getDate() - 5)).toISOString(), uploadedBy: { id: 303, name: 'Insurance Co.', role: 'external' } }
            ],
            previewUrl: 'https://documentcloud.adobe.com/view-sdk-demo/PDFs/Bodea Brochure.pdf',
            sharedWith: [],
            comments: [],
            needsAction: true,
            actionType: 'review',
            actionDeadline: new Date(today.setDate(today.getDate() + 2)).toISOString()
          }
        ];
        
        // Extract all unique tags
        const tags = [...new Set(mockDocuments.flatMap(doc => doc.tags))];
        setAllTags(tags);
        
        // Get recently viewed documents
        const recentDocs = [...mockDocuments]
          .filter(doc => doc.lastViewed)
          .sort((a, b) => new Date(b.lastViewed) - new Date(a.lastViewed))
          .slice(0, 3);
        setRecentlyViewed(recentDocs);
        
        // Set document counts
        setDocumentCounts({
          total: mockDocuments.length,
          needsAction: mockDocuments.filter(doc => doc.needsAction).length,
          shared: mockDocuments.filter(doc => doc.sharedWith && doc.sharedWith.length > 0).length
        });
        
        // Add mock search suggestions
        setSearchSuggestions([
          { type: 'tag', value: 'settlement' },
          { type: 'tag', value: 'medical' },
          { type: 'document', value: 'Settlement Agreement.pdf' },
          { type: 'document', value: 'Medical Records.pdf' },
          { type: 'case', value: 'Smith v. Johnson' }
        ]);
        
        setDocuments(mockDocuments);
        setFilteredDocuments(mockDocuments);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching documents:', error);
        setLoading(false);
      }
    };
    
    fetchDocuments();
  }, [user]);
  
  // Update folder counts
  useEffect(() => {
    if (documents.length > 0) {
      const folderCounts = folders.map(folder => {
        if (folder.id === 'all') {
          return { ...folder, count: documents.length };
        } else if (folder.id === 'needs-review') {
          return { ...folder, count: documents.filter(doc => doc.status === 'Needs Review').length };
        } else if (folder.id === 'needs-signature') {
          return { ...folder, count: documents.filter(doc => doc.status === 'Needs Signature').length };
        } else if (folder.id === 'shared-with-me') {
          return { ...folder, count: documents.filter(doc => doc.uploadedBy.role === 'external').length };
        } else {
          return { ...folder, count: documents.filter(doc => doc.folder === folder.id).length };
        }
      });
      
      setFolders(folderCounts);
    }
  }, [documents]);
  
  // Filter and sort documents
  useEffect(() => {
    let filtered = [...documents];
    
    // Apply folder filter
    if (selectedFolder !== 'all') {
      if (selectedFolder === 'needs-review') {
        filtered = filtered.filter(doc => doc.status === 'Needs Review');
      } else if (selectedFolder === 'needs-signature') {
        filtered = filtered.filter(doc => doc.status === 'Needs Signature');
      } else if (selectedFolder === 'shared-with-me') {
        filtered = filtered.filter(doc => doc.uploadedBy.role === 'external');
      } else {
        filtered = filtered.filter(doc => doc.folder === selectedFolder);
      }
    }
    
    // Apply case filter
    if (selectedCase) {
      filtered = filtered.filter(doc => doc.caseRef && doc.caseRef.id === selectedCase);
    }
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(doc => 
        doc.name.toLowerCase().includes(term) ||
        (doc.description && doc.description.toLowerCase().includes(term)) ||
        (doc.caseRef && doc.caseRef.name.toLowerCase().includes(term)) ||
        doc.tags.some(tag => tag.toLowerCase().includes(term))
      );
    }
    
    // Apply tag filters
    if (selectedTags.length > 0) {
      filtered = filtered.filter(doc => 
        selectedTags.every(tag => doc.tags.includes(tag))
      );
    }
    
    // Apply date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const lastWeek = new Date(today);
      lastWeek.setDate(lastWeek.getDate() - 7);
      const lastMonth = new Date(today);
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      
      filtered = filtered.filter(doc => {
        const uploadDate = new Date(doc.uploadDate);
        switch (dateFilter) {
          case 'today':
            return uploadDate >= today;
          case 'yesterday':
            return uploadDate >= yesterday && uploadDate < today;
          case 'lastWeek':
            return uploadDate >= lastWeek;
          case 'lastMonth':
            return uploadDate >= lastMonth;
          default:
            return true;
        }
      });
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'uploadDate':
          comparison = new Date(a.uploadDate) - new Date(b.uploadDate);
          break;
        case 'size':
          // Convert size strings to numbers for comparison
          const getSize = (sizeStr) => {
            const num = parseFloat(sizeStr);
            if (sizeStr.includes('KB')) return num * 1024;
            if (sizeStr.includes('MB')) return num * 1024 * 1024;
            if (sizeStr.includes('GB')) return num * 1024 * 1024 * 1024;
            return num;
          };
          comparison = getSize(a.size) - getSize(b.size);
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        default:
          comparison = 0;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
    
    setFilteredDocuments(filtered);
  }, [documents, selectedFolder, searchTerm, sortField, sortDirection, selectedTags, dateFilter, selectedCase]);
  
  // Handle search input
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (value.length > 1) {
      setShowSearchSuggestions(true);
    } else {
      setShowSearchSuggestions(false);
    }
  };
  
  // Handle search suggestion click
  const handleSearchSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion.value);
    setShowSearchSuggestions(false);
    
    if (suggestion.type === 'tag') {
      if (!selectedTags.includes(suggestion.value)) {
        setSelectedTags([...selectedTags, suggestion.value]);
      }
    } else if (suggestion.type === 'case') {
      const caseItem = cases.find(c => c.name === suggestion.value);
      if (caseItem) {
        setSelectedCase(caseItem.id);
      }
    }
  };
  
  // Handle sort
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  // Get document icon based on file type
  const getDocumentIcon = (type) => {
    if (type.includes('pdf')) {
      return <HiOutlineDocumentText className="h-10 w-10 text-red-500" />;
    } else if (type.includes('word')) {
      return <HiOutlineDocumentText className="h-10 w-10 text-blue-500" />;
    } else if (type.includes('sheet') || type.includes('excel')) {
      return <HiOutlineDocumentText className="h-10 w-10 text-green-500" />;
    } else if (type.includes('image')) {
      return <HiOutlineDocumentText className="h-10 w-10 text-purple-500" />;
    } else {
      return <HiOutlineDocumentText className="h-10 w-10 text-gray-500" />;
    }
  };
  
  // Get status color based on status
  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Needs Review':
        return 'bg-yellow-100 text-yellow-800';
      case 'Needs Signature':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Format date to relative format
  const formatRelativeDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else if (diffDays < 30) {
      return `${Math.floor(diffDays / 7)} weeks ago`;
    } else if (diffDays < 365) {
      return `${Math.floor(diffDays / 30)} months ago`;
    } else {
      return `${Math.floor(diffDays / 365)} years ago`;
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
  
  // Toggle select all documents
  const toggleSelectAll = () => {
    if (selectedDocuments.length === filteredDocuments.length) {
      setSelectedDocuments([]);
    } else {
      setSelectedDocuments(filteredDocuments.map(doc => doc.id));
    }
  };
  
  // Handle bulk actions
  const handleBulkAction = (action) => {
    if (selectedDocuments.length === 0) return;
    
    // Mock handling different bulk actions
    switch (action) {
      case 'download':
        alert(`Downloading ${selectedDocuments.length} documents`);
        break;
      case 'move':
        alert(`Moving ${selectedDocuments.length} documents`);
        break;
      case 'delete':
        if (window.confirm(`Are you sure you want to delete ${selectedDocuments.length} documents?`)) {
          // Mock delete action
          setDocuments(prev => prev.filter(doc => !selectedDocuments.includes(doc.id)));
          setSelectedDocuments([]);
        }
        break;
      case 'tag':
        // Would open a modal to add tags
        alert(`Adding tags to ${selectedDocuments.length} documents`);
        break;
      default:
        break;
    }
  };
  
  // Handle document preview
  const handlePreview = (document) => {
    setPreviewDocument(document);
    setIsPreviewOpen(true);
    
    // Update lastViewed timestamp in the local state
    setDocuments(prev => 
      prev.map(doc => 
        doc.id === document.id 
          ? { ...doc, lastViewed: new Date().toISOString() } 
          : doc
      )
    );
    
    // Update recently viewed
    setRecentlyViewed(prev => {
      const filtered = prev.filter(doc => doc.id !== document.id);
      return [document, ...filtered].slice(0, 3);
    });
  };
  
  // Handle folder creation
  const handleCreateFolder = () => {
    if (newFolderName.trim() === '') return;
    
    const newFolder = {
      id: newFolderName.toLowerCase().replace(/\s+/g, '-'),
      name: newFolderName,
      count: 0,
      icon: <HiOutlineFolder />
    };
    
    setFolders(prev => [...prev, newFolder]);
    setNewFolderName('');
    setIsCreatingFolder(false);
  };
  
  // Handle file upload
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    // Check if any file is too large (>10MB for demo)
    const oversizedFile = files.find(file => file.size > 10 * 1024 * 1024);
    if (oversizedFile) {
      setShowFileSizeWarning(true);
      return;
    }
    
    setUploadFiles(files);
    setIsUploading(true);
    
    // Mock upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        
        // Mock adding uploaded files to documents
        const newDocs = files.map((file, index) => ({
          id: Date.now() + index,
          name: file.name,
          folder: selectedFolder === 'all' ? 'personal-documents' : selectedFolder,
          description: `Uploaded ${file.name}`,
          size: `${(file.size / 1024).toFixed(1)} KB`,
          type: file.type,
          uploadDate: new Date().toISOString(),
          uploadedBy: { 
            id: 123, 
            name: user?.displayName || 'John Doe', 
            role: 'client', 
            avatar: null 
          },
          status: 'Needs Review',
          caseRef: selectedCase ? cases.find(c => c.id === selectedCase) : null,
          tags: [],
          lastViewed: null,
          starred: false,
          version: 1,
          versionHistory: [
            { version: 1, date: new Date().toISOString(), uploadedBy: { id: 123, name: user?.displayName || 'John Doe', role: 'client' } }
          ],
          previewUrl: file.type.includes('pdf') ? 'https://documentcloud.adobe.com/view-sdk-demo/PDFs/Bodea Brochure.pdf' : null,
          sharedWith: [],
          comments: [],
          needsAction: false
        }));
        
        setDocuments(prev => [...prev, ...newDocs]);
        setIsUploading(false);
        setUploadFiles([]);
        setUploadProgress(0);
      }
    }, 300);
  };
  
  // Handle tag filtering
  const toggleTagFilter = (tag) => {
    setSelectedTags(prev => {
      if (prev.includes(tag)) {
        return prev.filter(t => t !== tag);
      } else {
        return [...prev, tag];
      }
    });
  };
  
  // Clear all filters
  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedTags([]);
    setDateFilter('all');
    setSelectedCase('');
    setSelectedFolder('all');
  };
  
  // Toggle document star status
  const toggleDocumentStar = (docId) => {
    setDocuments(prev => 
      prev.map(doc => 
        doc.id === docId 
          ? { ...doc, starred: !doc.starred } 
          : doc
      )
    );
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
            <h1 className="text-2xl font-semibold text-gray-900">Documents</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage and access all your legal documents in one place
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-2">
            <input
              type="file"
              multiple
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileUpload}
            />
            <button
              onClick={() => fileInputRef.current.click()}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#800000] hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
            >
              <HiOutlineUpload className="-ml-1 mr-2 h-5 w-5" />
              Upload Document
            </button>
            <button
              onClick={() => setIsSelectMode(!isSelectMode)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
            >
              {isSelectMode ? (
                <>
                  <HiOutlineX className="-ml-1 mr-2 h-5 w-5" />
                  Cancel
                </>
              ) : (
                <>
                  <HiOutlineCheck className="-ml-1 mr-2 h-5 w-5" />
                  Select
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Document statistics */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-6">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-5">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Document Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex items-center">
                  <div className="bg-[#800000] bg-opacity-20 p-3 rounded-full">
                    <HiOutlineDocumentText className="h-6 w-6 text-[#800000]" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-500">Total Documents</h3>
                    <p className="text-2xl font-semibold text-gray-900">{documentCounts.total}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex items-center">
                  <div className="bg-yellow-100 p-3 rounded-full">
                    <HiOutlineExclamation className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-500">Needs Action</h3>
                    <p className="text-2xl font-semibold text-gray-900">{documentCounts.needsAction}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <HiOutlineShare className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-500">Shared Documents</h3>
                    <p className="text-2xl font-semibold text-gray-900">{documentCounts.shared}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* File upload warning modal */}
      <Transition appear show={showFileSizeWarning} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={() => setShowFileSizeWarning(false)}
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
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="bg-yellow-100 rounded-full p-2">
                      <HiOutlineExclamation className="h-6 w-6 text-yellow-600" />
                    </div>
                  </div>
                  <Dialog.Title
                    as="h3"
                    className="ml-3 text-lg font-medium leading-6 text-gray-900"
                  >
                    File Size Limit Exceeded
                  </Dialog.Title>
                </div>
                
                <div className="mt-4">
                  <p className="text-sm text-gray-500">
                    One or more files exceed the maximum file size limit of 10MB. Please compress your files or upload them individually.
                  </p>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-[#800000] border border-transparent rounded-md hover:bg-[#600000] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#800000]"
                    onClick={() => setShowFileSizeWarning(false)}
                  >
                    Understood
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
      
      {/* Upload progress */}
      {isUploading && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-4">
          <div className="bg-white shadow rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <HiOutlineCloudUpload className="h-5 w-5 text-[#800000] mr-2" />
                <h3 className="text-sm font-medium text-gray-900">Uploading {uploadFiles.length} document(s)</h3>
              </div>
              <span className="text-sm text-gray-500">{uploadProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-[#800000] h-2.5 rounded-full" 
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <div className="mt-2 text-xs text-gray-500 max-h-20 overflow-y-auto">
              {uploadFiles.map((file, index) => (
                <div key={index} className="truncate py-1 flex items-center">
                  <span className="w-4 inline-block">{index + 1}.</span>
                  <span className="truncate">{file.name}</span>
                  <span className="ml-2 text-gray-400">({(file.size / 1024).toFixed(1)} KB)</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Recently viewed */}
      {recentlyViewed.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-6">
          <div className="bg-white shadow rounded-lg mb-6">
            <div className="px-4 py-5 border-b border-gray-200 sm:px-6 flex justify-between items-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                <HiOutlineClock className="mr-2 h-5 w-5 text-gray-400" />
                Recently Viewed
              </h3>
            </div>
            <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              {recentlyViewed.map(doc => (
                <div 
                  key={doc.id} 
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition duration-150 ease-in-out relative group"
                  onClick={() => handlePreview(doc)}
                >
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleDocumentStar(doc.id);
                      }}
                      className={`${doc.starred ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'}`}
                    >
                      <HiOutlineStar className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="flex items-center">
                    {getDocumentIcon(doc.type)}
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900 truncate">{doc.name}</p>
                      <div className="flex items-center mt-1">
                        <p className="text-xs text-gray-500 mr-2">{formatRelativeDate(doc.lastViewed)}</p>
                        {doc.needsAction && (
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            doc.actionType === 'review' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {doc.actionType === 'review' ? 'Review' : 'Sign'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Mobile Tab Navigation */}
      <div className="md:hidden max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-4">
        <div className="flex border-b border-gray-200">
          <button
            className={`flex-1 py-3 text-center ${
              activeMobileTab === 'documents'
                ? 'border-b-2 border-[#800000] text-[#800000] font-medium'
                : 'text-gray-500'
            }`}
            onClick={() => setActiveMobileTab('documents')}
          >
            Documents
          </button>
          <button
            className={`flex-1 py-3 text-center ${
              activeMobileTab === 'folders'
                ? 'border-b-2 border-[#800000] text-[#800000] font-medium'
                : 'text-gray-500'
            }`}
            onClick={() => setActiveMobileTab('folders')}
          >
            Folders
          </button>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-6">
        <div className="flex flex-col lg:flex-row">
          {/* Folders sidebar - hidden on mobile unless activated */}
          <div className={`w-full lg:w-64 lg:flex-shrink-0 mb-6 lg:mb-0 lg:mr-8 ${
            activeMobileTab === 'folders' || !('ontouchstart' in window) ? 'block' : 'hidden lg:block'
          }`}>
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900">Folders</h2>
                <button 
                  onClick={() => setIsCreatingFolder(true)}
                  className="text-[#800000] hover:text-[#600000]"
                  title="Create new folder"
                >
                  <HiOutlinePlus className="h-5 w-5" />
                </button>
              </div>
              
              {/* New folder form */}
              {isCreatingFolder && (
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center">
                    <input
                      type="text"
                      className="focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="New folder name"
                      value={newFolderName}
                      onChange={(e) => setNewFolderName(e.target.value)}
                    />
                    <button
                      onClick={handleCreateFolder}
                      className="ml-2 inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-[#800000] hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                    >
                      <HiOutlineCheck className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setIsCreatingFolder(false)}
                      className="ml-1 inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    >
                      <HiOutlineX className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              )}
              
              <nav className="p-4 space-y-1">
                {folders.map((folder) => (
                  <button
                    key={folder.id}
                    onClick={() => {
                      setSelectedFolder(folder.id);
                      setActiveMobileTab('documents');
                    }}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      selectedFolder === folder.id 
                        ? 'bg-[#800000] text-white'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span className="mr-3 h-5 w-5 flex-shrink-0">
                      {folder.icon}
                    </span>
                    
                    <span className="truncate">{folder.name}</span>
                    <span className={`ml-auto inline-block px-2 py-0.5 text-xs rounded-full ${
                      selectedFolder === folder.id 
                        ? 'bg-white text-[#800000]'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {folder.count}
                    </span>
                  </button>
                ))}
              </nav>
              
              {/* Case filter */}
              <div className="p-4 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Filter by Case</h3>
                <select
                  value={selectedCase}
                  onChange={(e) => setSelectedCase(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm rounded-md"
                >
                  <option value="">All Cases</option>
                  {cases.map((caseItem) => (
                    <option key={caseItem.id} value={caseItem.id}>
                      {caseItem.name} ({caseItem.number})
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Tag filters */}
              <div className="p-4 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Filter by Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {allTags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => toggleTagFilter(tag)}
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        selectedTags.includes(tag)
                          ? 'bg-[#800000] text-white'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      {tag}
                      {selectedTags.includes(tag) && (
                        <HiOutlineX className="ml-1 h-3 w-3" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Date filter */}
              <div className="p-4 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Filter by Date</h3>
                <div className="space-y-2">
                  {[
                    { id: 'all', label: 'All Time' },
                    { id: 'today', label: 'Today' },
                    { id: 'yesterday', label: 'Yesterday' },
                    { id: 'lastWeek', label: 'Last 7 Days' },
                    { id: 'lastMonth', label: 'Last 30 Days' }
                  ].map(option => (
                    <div key={option.id} className="flex items-center">
                      <input
                        id={`date-${option.id}`}
                        name="date-filter"
                        type="radio"
                        checked={dateFilter === option.id}
                        onChange={() => setDateFilter(option.id)}
                        className="focus:ring-[#800000] h-4 w-4 text-[#800000] border-gray-300"
                      />
                      <label htmlFor={`date-${option.id}`} className="ml-3 block text-sm text-gray-700">
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Clear filters button */}
              {(selectedTags.length > 0 || dateFilter !== 'all' || selectedCase || selectedFolder !== 'all') && (
                <div className="p-4 border-t border-gray-200">
                  <button
                    onClick={clearAllFilters}
                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                  >
                    <HiOutlineX className="mr-2 h-5 w-5 text-gray-400" />
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {/* Documents content - hidden on mobile when folders tab is active */}
          <div className={`flex-1 ${
            activeMobileTab === 'documents' || !('ontouchstart' in window) ? 'block' : 'hidden lg:block'
          }`}>
            <div className="bg-white shadow rounded-lg">
              {/* Search and filter */}
              <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                <div className="flex flex-col sm:flex-row justify-between">
                  <div className="w-full sm:w-64 sm:mr-4 relative">
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <HiOutlineSearch className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        className="focus:ring-[#800000] focus:border-[#800000] block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                        placeholder="Search documents"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        ref={searchInputRef}
                      />
                    </div>
                    
                    {/* Search suggestions */}
                    {showSearchSuggestions && searchSuggestions.length > 0 && (
                      <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 text-sm">
                        {searchSuggestions
                          .filter(suggestion => 
                            suggestion.value.toLowerCase().includes(searchTerm.toLowerCase())
                          )
                          .map((suggestion, index) => (
                            <button
                              key={index}
                              className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center"
                              onClick={() => handleSearchSuggestionClick(suggestion)}
                            >
                              {suggestion.type === 'tag' && (
                                <HiOutlineTag className="mr-3 h-5 w-5 text-gray-400" />
                              )}
                              {suggestion.type === 'document' && (
                                <HiOutlineDocumentText className="mr-3 h-5 w-5 text-gray-400" />
                              )}
                              {suggestion.type === 'case' && (
                                <HiOutlineFolder className="mr-3 h-5 w-5 text-gray-400" />
                              )}
                              
                              <span className="truncate">{suggestion.value}</span>
                            </button>
                          ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-3 sm:mt-0 flex items-center space-x-2">
                    <button
                      onClick={() => setShowFilterPanel(!showFilterPanel)}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                    >
                      <HiOutlineFilter className="-ml-0.5 mr-2 h-4 w-4" />
                      Filters
                    </button>
                    
                    <div className="relative inline-block text-left">
                      <select
                        className="mt-1 block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm rounded-md"
                        value={`${sortField}-${sortDirection}`}
                        onChange={(e) => {
                          const [field, direction] = e.target.value.split('-');
                          setSortField(field);
                          setSortDirection(direction);
                        }}
                      >
                        <option value="uploadDate-desc">Date (Newest)</option>
                        <option value="uploadDate-asc">Date (Oldest)</option>
                        <option value="name-asc">Name (A-Z)</option>
                        <option value="name-desc">Name (Z-A)</option>
                        <option value="status-asc">Status</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                {searchTerm && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Found {filteredDocuments.length} document(s) matching "{searchTerm}"
                      <button
                        className="ml-2 text-[#800000] hover:text-[#600000]"
                        onClick={() => setSearchTerm('')}
                      >
                        Clear
                      </button>
                    </p>
                  </div>
                )}
                
                {/* Advanced filters panel */}
                {showFilterPanel && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-md">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-sm font-medium text-gray-900">Advanced Filters</h3>
                      <button 
                        onClick={() => setShowFilterPanel(false)}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <HiOutlineX className="h-5 w-5" />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Status filter */}
                      <div>
                        <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700">Status</label>
                        <select
                          id="status-filter"
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm rounded-md"
                        >
                          <option value="">All Statuses</option>
                          <option value="Approved">Approved</option>
                          <option value="Needs Review">Needs Review</option>
                          <option value="Needs Signature">Needs Signature</option>
                        </select>
                      </div>
                      
                      {/* Document type filter */}
                      <div>
                        <label htmlFor="type-filter" className="block text-sm font-medium text-gray-700">Document Type</label>
                        <select
                          id="type-filter"
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm rounded-md"
                        >
                          <option value="">All Types</option>
                          <option value="pdf">PDF</option>
                          <option value="word">Word</option>
                          <option value="excel">Excel</option>
                          <option value="image">Images</option>
                        </select>
                      </div>
                      
                      {/* Case reference filter */}
                      <div>
                        <label htmlFor="case-filter" className="block text-sm font-medium text-gray-700">Case</label>
                        <select
                          id="case-filter"
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm rounded-md"
                        >
                          <option value="">All Cases</option>
                          <option value="Smith v. Johnson">Smith v. Johnson</option>
                          <option value="Brown LLC Contract">Brown LLC Contract</option>
                          <option value="Estate Planning">Estate Planning</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex justify-end space-x-2">
                      <button
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                      >
                        Reset
                      </button>
                      <button
                        className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-[#800000] hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                      >
                        Apply Filters
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Bulk actions */}
              {isSelectMode && selectedDocuments.length > 0 && (
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="focus:ring-[#800000] h-4 w-4 text-[#800000] border-gray-300 rounded"
                        checked={selectedDocuments.length === filteredDocuments.length}
                        onChange={toggleSelectAll}
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        {selectedDocuments.length} selected
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleBulkAction('download')}
                        className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                      >
                        <HiOutlineDownload className="-ml-0.5 mr-2 h-4 w-4" />
                        Download
                      </button>
                      <button
                        onClick={() => handleBulkAction('move')}
                        className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                      >
                        <HiOutlineFolder className="-ml-0.5 mr-2 h-4 w-4" />
                        Move
                      </button>
                      <button
                        onClick={() => handleBulkAction('tag')}
                        className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                      >
                        <HiOutlineTag className="-ml-0.5 mr-2 h-4 w-4" />
                        Tag
                      </button>
                      <button
                        onClick={() => handleBulkAction('delete')}
                        className="inline-flex items-center px-3 py-1 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        <HiOutlineTrash className="-ml-0.5 mr-2 h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Document list */}
              {filteredDocuments.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 table-fixed">
                    <thead className="bg-gray-50">
                      <tr>
                        {isSelectMode && (
                          <th scope="col" className="relative px-6 py-3 w-12">
                            <input
                              type="checkbox"
                              className="focus:ring-[#800000] h-4 w-4 text-[#800000] border-gray-300 rounded"
                              checked={selectedDocuments.length === filteredDocuments.length}
                              onChange={toggleSelectAll}
                            />
                          </th>
                        )}
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer w-1/2"
                          onClick={() => handleSort('name')}
                        >
                          <div className="flex items-center">
                            Document
                            {sortField === 'name' && (
                              sortDirection === 'asc' 
                                ? <HiOutlineSortAscending className="ml-1 h-4 w-4" />
                                : <HiOutlineSortDescending className="ml-1 h-4 w-4" />
                            )}
                          </div>
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer w-1/6"
                          onClick={() => handleSort('uploadDate')}
                        >
                          <div className="flex items-center">
                            Date
                            {sortField === 'uploadDate' && (
                              sortDirection === 'asc' 
                                ? <HiOutlineSortAscending className="ml-1 h-4 w-4" />
                                : <HiOutlineSortDescending className="ml-1 h-4 w-4" />
                            )}
                          </div>
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer w-1/6"
                          onClick={() => handleSort('status')}
                        >
                          <div className="flex items-center">
                            Status
                            {sortField === 'status' && (
                              sortDirection === 'asc' 
                                ? <HiOutlineSortAscending className="ml-1 h-4 w-4" />
                                : <HiOutlineSortDescending className="ml-1 h-4 w-4" />
                            )}
                          </div>
                        </th>
                        <th scope="col" className="relative px-6 py-3 w-24">
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredDocuments.map((document) => (
                        <tr key={document.id} className="hover:bg-gray-50">
                          {isSelectMode && (
                            <td className="px-6 py-4 whitespace-nowrap">
                              <input
                                type="checkbox"
                                className="focus:ring-[#800000] h-4 w-4 text-[#800000] border-gray-300 rounded"
                                checked={selectedDocuments.includes(document.id)}
                                onChange={() => toggleDocumentSelection(document.id)}
                              />
                            </td>
                          )}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 cursor-pointer" onClick={() => handlePreview(document)}>
                                {getDocumentIcon(document.type)}
                              </div>
                              <div className="ml-4 max-w-sm">
                                <div className="text-sm font-medium text-gray-900 flex items-center">
                                  <span className="cursor-pointer hover:underline truncate max-w-xs inline-block" onClick={() => handlePreview(document)}>
                                    {document.name}
                                  </span>
                                  {document.starred && (
                                    <HiOutlineStar className="ml-1 h-4 w-4 flex-shrink-0 text-yellow-500" />
                                  )}
                                  {document.version > 1 && (
                                    <span className="ml-2 px-1.5 py-0.5 text-xs rounded bg-gray-100 text-gray-600 flex-shrink-0">
                                      v{document.version}
                                    </span>
                                  )}
                                </div>
                                <div className="text-sm text-gray-500 truncate max-w-xs">
                                  {document.description}
                                </div>
                                <div className="text-xs text-gray-500 mt-1 truncate max-w-xs">
                                  {document.size} • Uploaded by {document.uploadedBy.name}
                                </div>
                                {document.tags.length > 0 && (
                                  <div className="mt-1 flex flex-wrap">
                                    {document.tags.slice(0, 3).map((tag, index) => (
                                      <button
                                        key={index}
                                        onClick={() => toggleTagFilter(tag)}
                                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                          selectedTags.includes(tag)
                                            ? 'bg-[#800000] text-white'
                                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                        } mr-1 mb-1`}
                                      >
                                        {tag}
                                      </button>
                                    ))}
                                    {document.tags.length > 3 && (
                                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600 mr-1 mb-1">
                                        +{document.tags.length - 3}
                                      </span>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(document.uploadDate).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(document.status)}`}>
                              {document.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              <button
                                className="text-[#800000] hover:text-[#600000]"
                                title="View"
                                onClick={() => handlePreview(document)}
                              >
                                <HiOutlineEye className="h-5 w-5" />
                              </button>
                              <button
                                className="text-[#800000] hover:text-[#600000]"
                                title="Download"
                                onClick={() => window.open(`/api/documents/${document.id}/download`, '_blank')}
                              >
                                <HiOutlineDownload className="h-5 w-5" />
                              </button>
                              <div className="relative inline-block text-left group">
                                <button
                                  className="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                                >
                                  <HiOutlineAdjustments className="h-5 w-5" />
                                </button>
                                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 hidden group-hover:block z-10">
                                  <div className="py-1" role="menu" aria-orientation="vertical">
                                    <button
                                      className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left"
                                      role="menuitem"
                                    >
                                      <HiOutlineStar className="inline-block mr-2 h-4 w-4" />
                                      {document.starred ? 'Remove Star' : 'Add Star'}
                                    </button>
                                    <button
                                      className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left"
                                      role="menuitem"
                                    >
                                      <HiOutlineShare className="inline-block mr-2 h-4 w-4" />
                                      Share
                                    </button>
                                    <button
                                      className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left"
                                      role="menuitem"
                                    >
                                      <HiOutlinePencilAlt className="inline-block mr-2 h-4 w-4" />
                                      Rename
                                    </button>
                                    <button
                                      className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left"
                                      role="menuitem"
                                    >
                                      <HiOutlineTag className="inline-block mr-2 h-4 w-4" />
                                      Edit Tags
                                    </button>
                                    <button
                                      className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left"
                                      role="menuitem"
                                    >
                                      <HiOutlineDocumentDuplicate className="inline-block mr-2 h-4 w-4" />
                                      Version History
                                    </button>
                                    <button
                                      className="text-red-600 block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left"
                                      role="menuitem"
                                    >
                                      <HiOutlineTrash className="inline-block mr-2 h-4 w-4" />
                                      Delete
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="px-4 py-5 text-center text-gray-500">
                  <HiOutlineDocumentText className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No documents found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {searchTerm || selectedTags.length > 0 || dateFilter !== 'all'
                      ? 'Try adjusting your search or filters'
                      : 'Get started by uploading a document'}
                  </p>
                  <div className="mt-6">
                    <button
                      onClick={() => fileInputRef.current.click()}
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#800000] hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                    >
                      <HiOutlineUpload className="-ml-1 mr-2 h-5 w-5" />
                      Upload Document
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Document Preview Modal */}
      <Transition appear show={isPreviewOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={() => setIsPreviewOpen(false)}
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
              <div className="inline-block w-full max-w-6xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 flex justify-between items-center"
                >
                  <div className="flex items-center">
                    {previewDocument && getDocumentIcon(previewDocument.type)}
                    <span className="ml-2">{previewDocument?.name}</span>
                  </div>
                  <button
                    onClick={() => setIsPreviewOpen(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <HiOutlineX className="h-6 w-6" />
                  </button>
                </Dialog.Title>
                
                <div className="mt-4">
                  {previewDocument?.previewUrl ? (
                    <div className="aspect-w-16 aspect-h-9">
                      <iframe
                        src={previewDocument.previewUrl}
                        className="w-full h-[70vh] border-0"
                        title={`Preview of ${previewDocument.name}`}
                        allowFullScreen
                      ></iframe>
                    </div>
                  ) : (
                    <div className="bg-gray-100 rounded-lg p-8 text-center h-[70vh] flex flex-col items-center justify-center">
                      <HiOutlineDocumentText className="h-16 w-16 text-gray-400 mb-4" />
                      <h4 className="text-lg font-medium text-gray-900 mb-2">
                        Preview not available
                      </h4>
                      <p className="text-gray-500 mb-4">
                        This document type cannot be previewed in the browser.
                      </p>
                      <button
                        onClick={() => window.open(`/api/documents/${previewDocument?.id}/download`, '_blank')}
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#800000] hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                      >
                        <HiOutlineDownload className="-ml-1 mr-2 h-5 w-5" />
                        Download
                      </button>
                    </div>
                  )}
                </div>
                
                <div className="mt-4 border-t border-gray-200 pt-4 flex justify-between">
                  <div>
                    <p className="text-sm text-gray-500">
                      {previewDocument?.size} • Uploaded on {previewDocument && new Date(previewDocument.uploadDate).toLocaleDateString()}
                      {previewDocument?.version > 1 && ` • Version ${previewDocument.version}`}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Uploaded by {previewDocument?.uploadedBy.name}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => window.open(`/api/documents/${previewDocument?.id}/download`, '_blank')}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                    >
                      <HiOutlineDownload className="-ml-1 mr-2 h-5 w-5" />
                      Download
                    </button>
                    <button
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#800000] hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                    >
                      <HiOutlineShare className="-ml-1 mr-2 h-5 w-5" />
                      Share
                    </button>
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default ClientDocumentsPage;