import { useState, useEffect, Fragment } from 'react';
import { 
  HiOutlineShieldCheck, 
  HiOutlineLockClosed, 
  HiOutlineUserGroup, 
  HiOutlineDocumentReport,
  HiOutlineFingerPrint,
  HiOutlineKey,
  HiOutlineExclamation,
  HiOutlineRefresh,
  HiOutlineCheck,
  HiOutlineX,
  HiOutlineExclamationCircle,
  HiOutlineCog,
  HiOutlineGlobe,
  HiOutlineServer,
  HiOutlineDatabase,
  HiOutlineSearch,
  HiOutlineDownload,
  HiOutlineEye
} from 'react-icons/hi';
import { Dialog, Transition, Switch, RadioGroup } from '@headlessui/react';

const AdminSecurityPage = () => {
  // Security settings
  const [passwordPolicy, setPasswordPolicy] = useState({
    minLength: 10,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    expiryDays: 90,
    preventReuse: 5
  });

  const [accessControls, setAccessControls] = useState({
    mfaRequired: 'staff-only', // 'all', 'staff-only', 'none'
    ipRestriction: false,
    allowedIpAddresses: [],
    sessionTimeout: 30, // minutes
    maxLoginAttempts: 5,
    lockoutDuration: 15, // minutes
  });

  const [dataSecurity, setDataSecurity] = useState({
    dataEncryption: true,
    documentEncryption: true,
    automaticLogout: true,
    clientDataRetention: 7, // years
    auditLogRetention: 2, // years
    anonymizeDeletedData: true,
  });

  // State for modals
  const [showAddIPModal, setShowAddIPModal] = useState(false);
  const [newIpAddress, setNewIpAddress] = useState('');
  const [ipAddressError, setIpAddressError] = useState('');
  const [showResetConfirmation, setShowResetConfirmation] = useState(false);
  
  // Audit logs state
  const [auditLogs, setAuditLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [timeFilter, setTimeFilter] = useState('all');

  // Toast notification state
  const [toast, setToast] = useState(null);

  // Generate sample audit logs
  useEffect(() => {
    const mockLogs = [
      {
        id: 1,
        timestamp: '2025-06-06T09:23:12',
        user: 'admin@example.com',
        action: 'login',
        description: 'Successful login',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/114.0.0.0',
        status: 'success',
      },
      {
        id: 2,
        timestamp: '2025-06-06T09:15:45',
        user: 'jsmith@example.com',
        action: 'login',
        description: 'Failed login attempt (Invalid password)',
        ipAddress: '192.168.1.105',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1.15',
        status: 'failed',
      },
      {
        id: 3,
        timestamp: '2025-06-05T16:42:31',
        user: 'admin@example.com',
        action: 'settings_change',
        description: 'Modified password policy settings',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/114.0.0.0',
        status: 'success',
      },
      {
        id: 4,
        timestamp: '2025-06-05T14:12:05',
        user: 'admin@example.com',
        action: 'user_create',
        description: 'Created new user account: client5@example.com',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/114.0.0.0',
        status: 'success',
      },
      {
        id: 5,
        timestamp: '2025-06-04T11:30:22',
        user: 'jsmith@example.com',
        action: 'document_access',
        description: 'Accessed confidential document: Case #1234 - Settlement Agreement',
        ipAddress: '192.168.1.105',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1.15',
        status: 'success',
      },
      {
        id: 6,
        timestamp: '2025-06-04T10:45:13',
        user: 'client3@example.com',
        action: 'password_change',
        description: 'Changed account password',
        ipAddress: '203.0.113.45',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_5 like Mac OS X) AppleWebKit/605.1.15',
        status: 'success',
      },
      {
        id: 7,
        timestamp: '2025-06-03T15:22:56',
        user: 'unknown',
        action: 'login',
        description: 'Failed login attempt (User not found)',
        ipAddress: '198.51.100.23',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/113.0.0.0',
        status: 'failed',
      },
      {
        id: 8,
        timestamp: '2025-06-03T09:10:33',
        user: 'admin@example.com',
        action: 'permissions_change',
        description: 'Modified permissions for role: Staff',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/114.0.0.0',
        status: 'success',
      },
      {
        id: 9,
        timestamp: '2025-06-02T16:05:41',
        user: 'jsmith@example.com',
        action: 'file_upload',
        description: 'Uploaded document: Client Financial Records.pdf',
        ipAddress: '192.168.1.105',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1.15',
        status: 'success',
      },
      {
        id: 10,
        timestamp: '2025-06-02T14:17:23',
        user: 'client3@example.com',
        action: 'login',
        description: 'Successful login',
        ipAddress: '203.0.113.45',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_5 like Mac OS X) AppleWebKit/605.1.15',
        status: 'success',
      },
      {
        id: 11,
        timestamp: '2025-06-01T12:30:59',
        user: 'admin@example.com',
        action: 'system_backup',
        description: 'Initiated system backup',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/114.0.0.0',
        status: 'success',
      },
      {
        id: 12,
        timestamp: '2025-06-01T10:05:12',
        user: 'jsmith@example.com',
        action: 'mfa_setup',
        description: 'Configured multi-factor authentication',
        ipAddress: '192.168.1.105',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1.15',
        status: 'success',
      },
    ];
    
    setAuditLogs(mockLogs);
    setFilteredLogs(mockLogs);
  }, []);

  // Filter audit logs
  useEffect(() => {
    let filtered = auditLogs;
    
    // Apply time filter
    if (timeFilter !== 'all') {
      const now = new Date();
      const cutoff = new Date();
      
      switch (timeFilter) {
        case 'today':
          cutoff.setHours(0, 0, 0, 0);
          break;
        case 'week':
          cutoff.setDate(now.getDate() - 7);
          break;
        case 'month':
          cutoff.setMonth(now.getMonth() - 1);
          break;
        default:
          break;
      }
      
      filtered = filtered.filter(log => new Date(log.timestamp) >= cutoff);
    }
    
    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(log => 
        log.user.toLowerCase().includes(term) ||
        log.action.toLowerCase().includes(term) ||
        log.description.toLowerCase().includes(term) ||
        log.ipAddress.toLowerCase().includes(term)
      );
    }
    
    setFilteredLogs(filtered);
  }, [auditLogs, searchTerm, timeFilter]);

  // Handler functions
  const handlePasswordPolicyChange = (field, value) => {
    setPasswordPolicy(prev => ({ ...prev, [field]: value }));
  };

  const handleAccessControlChange = (field, value) => {
    setAccessControls(prev => ({ ...prev, [field]: value }));
  };

  const handleDataSecurityChange = (field, value) => {
    setDataSecurity(prev => ({ ...prev, [field]: value }));
  };

  const handleAddIP = () => {
    // Validate IP address
    const ipRegex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    
    if (!ipRegex.test(newIpAddress)) {
      setIpAddressError('Please enter a valid IP address');
      return;
    }
    
    if (accessControls.allowedIpAddresses.includes(newIpAddress)) {
      setIpAddressError('This IP address is already in the list');
      return;
    }
    
    setAccessControls(prev => ({
      ...prev,
      allowedIpAddresses: [...prev.allowedIpAddresses, newIpAddress]
    }));
    
    setNewIpAddress('');
    setIpAddressError('');
    setShowAddIPModal(false);
  };

  const handleRemoveIP = (ip) => {
    setAccessControls(prev => ({
      ...prev,
      allowedIpAddresses: prev.allowedIpAddresses.filter(address => address !== ip)
    }));
  };

  const handleResetToDefaults = () => {
    setPasswordPolicy({
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
      expiryDays: 90,
      preventReuse: 5
    });
    
    setAccessControls({
      mfaRequired: 'staff-only',
      ipRestriction: false,
      allowedIpAddresses: [],
      sessionTimeout: 30,
      maxLoginAttempts: 5,
      lockoutDuration: 15,
    });
    
    setDataSecurity({
      dataEncryption: true,
      documentEncryption: true,
      automaticLogout: true,
      clientDataRetention: 7,
      auditLogRetention: 2,
      anonymizeDeletedData: true,
    });
    
    setShowResetConfirmation(false);
  };

  const exportAuditLogs = () => {
    // In a real application, this would generate and download a CSV or PDF file
    console.log('Exporting audit logs:', filteredLogs);
    alert('Audit logs export started. The file will be downloaded shortly.');
  };

  // Show toast message
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000); // Automatically dismiss after 3 seconds
  };

  // UI helper functions
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Security Settings</h1>
            <p className="mt-1 text-sm text-gray-500">
              Configure security policies and review system access logs
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <button
              onClick={() => showToast("Reset functionality coming soon!", "success")}
              type="button"
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
            >
              <HiOutlineRefresh className="-ml-1 mr-2 h-5 w-5" />
              Reset to Defaults
            </button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Password Policy */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6 flex items-center">
              <HiOutlineKey className="h-6 w-6 text-[#800000] mr-3" />
              <h3 className="text-lg leading-6 font-medium text-gray-900">Password Policy</h3>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-6 space-y-6">
              <div>
                <label htmlFor="min-length" className="block text-sm font-medium text-gray-700">
                  Minimum Password Length
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    min="6"
                    max="24"
                    id="min-length"
                    value={passwordPolicy.minLength}
                    onChange={(e) => handlePasswordPolicyChange('minLength', parseInt(e.target.value, 10))}
                    className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Password must be at least {passwordPolicy.minLength} characters long
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="require-uppercase"
                      type="checkbox"
                      checked={passwordPolicy.requireUppercase}
                      onChange={(e) => handlePasswordPolicyChange('requireUppercase', e.target.checked)}
                      className="focus:ring-[#800000] h-4 w-4 text-[#800000] border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="require-uppercase" className="font-medium text-gray-700">Require uppercase letters</label>
                    <p className="text-gray-500">Password must contain at least one uppercase letter</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="require-lowercase"
                      type="checkbox"
                      checked={passwordPolicy.requireLowercase}
                      onChange={(e) => handlePasswordPolicyChange('requireLowercase', e.target.checked)}
                      className="focus:ring-[#800000] h-4 w-4 text-[#800000] border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="require-lowercase" className="font-medium text-gray-700">Require lowercase letters</label>
                    <p className="text-gray-500">Password must contain at least one lowercase letter</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="require-numbers"
                      type="checkbox"
                      checked={passwordPolicy.requireNumbers}
                      onChange={(e) => handlePasswordPolicyChange('requireNumbers', e.target.checked)}
                      className="focus:ring-[#800000] h-4 w-4 text-[#800000] border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="require-numbers" className="font-medium text-gray-700">Require numbers</label>
                    <p className="text-gray-500">Password must contain at least one number</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="require-special-chars"
                      type="checkbox"
                      checked={passwordPolicy.requireSpecialChars}
                      onChange={(e) => handlePasswordPolicyChange('requireSpecialChars', e.target.checked)}
                      className="focus:ring-[#800000] h-4 w-4 text-[#800000] border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="require-special-chars" className="font-medium text-gray-700">Require special characters</label>
                    <p className="text-gray-500">Password must contain at least one special character (e.g., @, #, $, %)</p>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="expiry-days" className="block text-sm font-medium text-gray-700">
                  Password Expiry
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    min="0"
                    max="365"
                    id="expiry-days"
                    value={passwordPolicy.expiryDays}
                    onChange={(e) => handlePasswordPolicyChange('expiryDays', parseInt(e.target.value, 10))}
                    className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  {passwordPolicy.expiryDays > 0 
                    ? `Passwords will expire after ${passwordPolicy.expiryDays} days` 
                    : 'Passwords will never expire'}
                </p>
              </div>

              <div>
                <label htmlFor="prevent-reuse" className="block text-sm font-medium text-gray-700">
                  Password History
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    min="0"
                    max="24"
                    id="prevent-reuse"
                    value={passwordPolicy.preventReuse}
                    onChange={(e) => handlePasswordPolicyChange('preventReuse', parseInt(e.target.value, 10))}
                    className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  {passwordPolicy.preventReuse > 0 
                    ? `Cannot reuse any of the last ${passwordPolicy.preventReuse} passwords` 
                    : 'No restriction on password reuse'}
                </p>
              </div>
            </div>
          </div>

          {/* Access Controls */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6 flex items-center">
              <HiOutlineLockClosed className="h-6 w-6 text-[#800000] mr-3" />
              <h3 className="text-lg leading-6 font-medium text-gray-900">Access Controls</h3>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-6 space-y-6">
              <div>
                <label className="text-sm font-medium text-gray-700">Multi-Factor Authentication</label>
                <RadioGroup 
                  value={accessControls.mfaRequired} 
                  onChange={(value) => handleAccessControlChange('mfaRequired', value)}
                  className="mt-2"
                >
                  <div className="space-y-2">
                    <RadioGroup.Option
                      value="all"
                      className={({ active, checked }) =>
                        classNames(
                          active ? 'ring-2 ring-offset-2 ring-[#800000]' : '',
                          checked ? 'bg-[#800000] border-transparent text-white' : 'bg-white border-gray-200 text-gray-900',
                          'relative border rounded-md shadow-sm px-4 py-3 cursor-pointer flex focus:outline-none'
                        )
                      }
                    >
                      {({ active, checked }) => (
                        <>
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center">
                              <div className="text-sm">
                                <RadioGroup.Label
                                  as="p"
                                  className={`font-medium ${checked ? 'text-white' : 'text-gray-900'}`}
                                >
                                  Required for all users
                                </RadioGroup.Label>
                                <RadioGroup.Description
                                  as="span"
                                  className={`inline ${checked ? 'text-white' : 'text-gray-500'}`}
                                >
                                  All staff and clients must use MFA
                                </RadioGroup.Description>
                              </div>
                            </div>
                            {checked && (
                              <div className="flex-shrink-0 text-white">
                                <HiOutlineCheck className="h-5 w-5" />
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </RadioGroup.Option>

                    <RadioGroup.Option
                      value="staff-only"
                      className={({ active, checked }) =>
                        classNames(
                          active ? 'ring-2 ring-offset-2 ring-[#800000]' : '',
                          checked ? 'bg-[#800000] border-transparent text-white' : 'bg-white border-gray-200 text-gray-900',
                          'relative border rounded-md shadow-sm px-4 py-3 cursor-pointer flex focus:outline-none'
                        )
                      }
                    >
                      {({ active, checked }) => (
                        <>
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center">
                              <div className="text-sm">
                                <RadioGroup.Label
                                  as="p"
                                  className={`font-medium ${checked ? 'text-white' : 'text-gray-900'}`}
                                >
                                  Required for staff only
                                </RadioGroup.Label>
                                <RadioGroup.Description
                                  as="span"
                                  className={`inline ${checked ? 'text-white' : 'text-gray-500'}`}
                                >
                                  Staff must use MFA, optional for clients
                                </RadioGroup.Description>
                              </div>
                            </div>
                            {checked && (
                              <div className="flex-shrink-0 text-white">
                                <HiOutlineCheck className="h-5 w-5" />
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </RadioGroup.Option>

                    <RadioGroup.Option
                      value="none"
                      className={({ active, checked }) =>
                        classNames(
                          active ? 'ring-2 ring-offset-2 ring-[#800000]' : '',
                          checked ? 'bg-[#800000] border-transparent text-white' : 'bg-white border-gray-200 text-gray-900',
                          'relative border rounded-md shadow-sm px-4 py-3 cursor-pointer flex focus:outline-none'
                        )
                      }
                    >
                      {({ active, checked }) => (
                        <>
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center">
                              <div className="text-sm">
                                <RadioGroup.Label
                                  as="p"
                                  className={`font-medium ${checked ? 'text-white' : 'text-gray-900'}`}
                                >
                                  Optional for all users
                                </RadioGroup.Label>
                                <RadioGroup.Description
                                  as="span"
                                  className={`inline ${checked ? 'text-white' : 'text-gray-500'}`}
                                >
                                  MFA is available but not required
                                </RadioGroup.Description>
                              </div>
                            </div>
                            {checked && (
                              <div className="flex-shrink-0 text-white">
                                <HiOutlineCheck className="h-5 w-5" />
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </RadioGroup.Option>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="ip-restriction" className="block text-sm font-medium text-gray-700">
                    IP Address Restriction
                  </label>
                  <Switch
                    checked={accessControls.ipRestriction}
                    onChange={(checked) => handleAccessControlChange('ipRestriction', checked)}
                    className={classNames(
                      accessControls.ipRestriction ? 'bg-[#800000]' : 'bg-gray-200',
                      'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]'
                    )}
                  >
                    <span className="sr-only">Use IP restriction</span>
                    <span
                      aria-hidden="true"
                      className={classNames(
                        accessControls.ipRestriction ? 'translate-x-5' : 'translate-x-0',
                        'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200'
                      )}
                    />
                  </Switch>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  {accessControls.ipRestriction 
                    ? 'Access is restricted to allowed IP addresses' 
                    : 'No IP address restrictions'}
                </p>

                {accessControls.ipRestriction && (
                  <div className="mt-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-sm font-medium text-gray-700">Allowed IP Addresses</h4>
                      <button
                        type="button"
                        onClick={() => showToast("IP restriction feature coming soon!", "success")}
                        className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-[#800000] bg-[#800000] bg-opacity-10 hover:bg-opacity-20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                      >
                        Add IP
                      </button>
                    </div>

                    {accessControls.allowedIpAddresses.length > 0 ? (
                      <ul className="divide-y divide-gray-200 border border-gray-200 rounded-md">
                        {accessControls.allowedIpAddresses.map((ip) => (
                          <li key={ip} className="px-3 py-2 flex items-center justify-between text-sm">
                            <div className="w-0 flex-1 flex items-center">
                              <HiOutlineGlobe className="flex-shrink-0 h-5 w-5 text-gray-400" />
                              <span className="ml-2 flex-1 w-0 truncate">{ip}</span>
                            </div>
                            <div className="ml-4 flex-shrink-0">
                              <button
                                type="button"
                                onClick={() => handleRemoveIP(ip)}
                                className="font-medium text-red-600 hover:text-red-500"
                              >
                                Remove
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-sm text-gray-500 italic">No IP addresses added</div>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="session-timeout" className="block text-sm font-medium text-gray-700">
                  Session Timeout (minutes)
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    min="1"
                    max="1440"
                    id="session-timeout"
                    value={accessControls.sessionTimeout}
                    onChange={(e) => handleAccessControlChange('sessionTimeout', parseInt(e.target.value, 10))}
                    className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Inactive sessions will be terminated after {accessControls.sessionTimeout} minutes
                </p>
              </div>

              <div>
                <label htmlFor="max-login-attempts" className="block text-sm font-medium text-gray-700">
                  Maximum Login Attempts
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    min="1"
                    max="10"
                    id="max-login-attempts"
                    value={accessControls.maxLoginAttempts}
                    onChange={(e) => handleAccessControlChange('maxLoginAttempts', parseInt(e.target.value, 10))}
                    className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Account will be locked after {accessControls.maxLoginAttempts} failed login attempts
                </p>
              </div>

              <div>
                <label htmlFor="lockout-duration" className="block text-sm font-medium text-gray-700">
                  Account Lockout Duration (minutes)
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    min="1"
                    max="1440"
                    id="lockout-duration"
                    value={accessControls.lockoutDuration}
                    onChange={(e) => handleAccessControlChange('lockoutDuration', parseInt(e.target.value, 10))}
                    className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Locked accounts will be automatically unlocked after {accessControls.lockoutDuration} minutes
                </p>
              </div>
            </div>
          </div>

          {/* Data Security */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6 flex items-center">
              <HiOutlineShieldCheck className="h-6 w-6 text-[#800000] mr-3" />
              <h3 className="text-lg leading-6 font-medium text-gray-900">Data Security</h3>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-6 space-y-6">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="data-encryption"
                    type="checkbox"
                    checked={dataSecurity.dataEncryption}
                    onChange={(e) => handleDataSecurityChange('dataEncryption', e.target.checked)}
                    className="focus:ring-[#800000] h-4 w-4 text-[#800000] border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="data-encryption" className="font-medium text-gray-700">Enable data encryption</label>
                  <p className="text-gray-500">All sensitive data will be encrypted at rest</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="document-encryption"
                    type="checkbox"
                    checked={dataSecurity.documentEncryption}
                    onChange={(e) => handleDataSecurityChange('documentEncryption', e.target.checked)}
                    className="focus:ring-[#800000] h-4 w-4 text-[#800000] border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="document-encryption" className="font-medium text-gray-700">Enable document encryption</label>
                  <p className="text-gray-500">Documents and attachments will be encrypted</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="automatic-logout"
                    type="checkbox"
                    checked={dataSecurity.automaticLogout}
                    onChange={(e) => handleDataSecurityChange('automaticLogout', e.target.checked)}
                    className="focus:ring-[#800000] h-4 w-4 text-[#800000] border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="automatic-logout" className="font-medium text-gray-700">Enable automatic logout</label>
                  <p className="text-gray-500">Users will be automatically logged out after the session timeout period</p>
                </div>
              </div>

              <div>
                <label htmlFor="client-data-retention" className="block text-sm font-medium text-gray-700">
                  Client Data Retention (years)
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    min="1"
                    max="20"
                    id="client-data-retention"
                    value={dataSecurity.clientDataRetention}
                    onChange={(e) => handleDataSecurityChange('clientDataRetention', parseInt(e.target.value, 10))}
                    className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Client data will be retained for {dataSecurity.clientDataRetention} years
                </p>
              </div>

              <div>
                <label htmlFor="audit-log-retention" className="block text-sm font-medium text-gray-700">
                  Audit Log Retention (years)
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    min="1"
                    max="10"
                    id="audit-log-retention"
                    value={dataSecurity.auditLogRetention}
                    onChange={(e) => handleDataSecurityChange('auditLogRetention', parseInt(e.target.value, 10))}
                    className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Audit logs will be retained for {dataSecurity.auditLogRetention} years
                </p>
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="anonymize-data"
                    type="checkbox"
                    checked={dataSecurity.anonymizeDeletedData}
                    onChange={(e) => handleDataSecurityChange('anonymizeDeletedData', e.target.checked)}
                    className="focus:ring-[#800000] h-4 w-4 text-[#800000] border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="anonymize-data" className="font-medium text-gray-700">Anonymize deleted data</label>
                  <p className="text-gray-500">Deleted data will be anonymized rather than completely removed</p>
                </div>
              </div>
            </div>
          </div>

          {/* Security Audit Logs */}
          <div className="bg-white shadow rounded-lg overflow-hidden lg:col-span-2">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <div className="flex items-center">
                <HiOutlineDocumentReport className="h-6 w-6 text-[#800000] mr-3" />
                <h3 className="text-lg leading-6 font-medium text-gray-900">Security Audit Logs</h3>
              </div>
              <div className="flex space-x-3">
                <div>
                  <label htmlFor="time-filter" className="sr-only">Filter by time</label>
                  <select
                    id="time-filter"
                    value={timeFilter}
                    onChange={(e) => setTimeFilter(e.target.value)}
                    className="mt-1 block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm rounded-md"
                  >
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="week">Last 7 Days</option>
                    <option value="month">Last 30 Days</option>
                  </select>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <HiOutlineSearch className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="focus:ring-[#800000] focus:border-[#800000] block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                    placeholder="Search logs..."
                  />
                </div>
                <button
                  type="button"
                  onClick={exportAuditLogs}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                >
                  <HiOutlineDownload className="-ml-1 mr-2 h-5 w-5" />
                  Export
                </button>
              </div>
            </div>
            <div className="border-t border-gray-200">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Timestamp
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Action
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        IP Address
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <span className="sr-only">View</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredLogs.length > 0 ? (
                      filteredLogs.map((log) => (
                        <tr key={log.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(log.timestamp)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {log.user}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {log.action.replace('_', ' ')}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {log.description}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {log.ipAddress}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(log.status)}`}>
                              {log.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              type="button"
                              className="text-[#800000] hover:text-[#600000]"
                              title="View details"
                            >
                              <HiOutlineEye className="h-5 w-5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                          No log entries found matching your criteria
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-5 right-5 max-w-sm w-full bg-white shadow-lg rounded-lg p-4 z-50 ${
          toast.type === 'success' ? 'border-l-4 border-green-500' : 'border-l-4 border-red-500'
        }`}>
          <div className="flex items-start">
            <div className="flex-shrink-0">
              {toast.type === 'success' ? (
                <HiOutlineCheck className="h-6 w-6 text-green-500" />
              ) : (
                <HiOutlineExclamation className="h-6 w-6 text-red-500" />
              )}
            </div>
            <div className="ml-3 w-0 flex-1">
              <p className="text-sm font-medium text-gray-900">{toast.message}</p>
            </div>
            <div className="ml-4 flex-shrink-0">
              <button
                onClick={() => setToast(null)}
                className="inline-flex text-gray-400 hover:text-gray-500"
              >
                <HiOutlineX className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add IP Address Modal */}
      <Transition.Root show={showAddIPModal} as={Fragment}>
        <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto" onClose={setShowAddIPModal}>
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
                    <HiOutlineGlobe className="h-6 w-6 text-[#800000]" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                      Add Allowed IP Address
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Add an IP address to the list of allowed addresses for access restriction
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-4">
                  <div>
                    <label htmlFor="ip-address" className="block text-sm font-medium text-gray-700">
                      IP Address
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="ip-address"
                        value={newIpAddress}
                        onChange={(e) => setNewIpAddress(e.target.value)}
                        className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                        placeholder="e.g., 192.168.1.1"
                      />
                    </div>
                    {ipAddressError && (
                      <p className="mt-2 text-sm text-red-600">
                        {ipAddressError}
                      </p>
                    )}
                  </div>
                </div>
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#800000] text-base font-medium text-white hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000] sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={handleAddIP}
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000] sm:mt-0 sm:w-auto sm:text-sm"
                    onClick={() => {
                      setShowAddIPModal(false);
                      setNewIpAddress('');
                      setIpAddressError('');
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

      {/* Reset Confirmation Modal */}
      <Transition.Root show={showResetConfirmation} as={Fragment}>
        <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto" onClose={setShowResetConfirmation}>
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
                    <HiOutlineExclamationCircle className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                      Reset Security Settings
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to reset all security settings to their default values? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={handleResetToDefaults}
                  >
                    Reset
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000] sm:mt-0 sm:w-auto sm:text-sm"
                    onClick={() => setShowResetConfirmation(false)}
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

export default AdminSecurityPage;
