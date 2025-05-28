import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { 
  HiOutlineUser, 
  HiOutlineMail, 
  HiOutlinePhone, 
  HiOutlineLockClosed, 
  HiOutlineBell,
  HiOutlineCreditCard,
  HiOutlineDocumentText,
  HiOutlinePhotograph,
  HiOutlineCog,
  HiOutlineExclamation,
  HiOutlineShieldCheck,
  HiOutlineCheck,
  HiOutlinePencil,
  HiOutlineX,
  HiOutlineExclamationCircle,
  HiOutlineEye,
  HiOutlineEyeOff,
  HiOutlineRefresh,
  HiOutlineClipboardList,
  HiOutlineUserCircle
} from 'react-icons/hi';

const ClientProfilePage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('personal');
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState('/placeholder-avatar.jpg');
  const fileInputRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userActivity, setUserActivity] = useState([]);

  // Form states
  const [formData, setFormData] = useState({
    firstName: user?.firstName || 'John',
    lastName: user?.lastName || 'Doe',
    email: user?.email || 'john.doe@example.com',
    phone: user?.phone || '(555) 123-4567',
    address: user?.address || '123 Main Street',
    city: user?.city || 'Anytown',
    state: user?.state || 'CA',
    zipCode: user?.zipCode || '12345',
    occupation: user?.occupation || 'Software Developer',
    employer: user?.employer || 'Tech Company Inc.',
    birthDate: user?.birthDate || '1980-01-01',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    emailNotifications: true,
    smsNotifications: true,
    documentAlerts: true,
    caseUpdates: true,
    billingAlerts: true,
    appointmentReminders: true,
    marketingCommunications: false
  });

  // Fetch user activity
  useEffect(() => {
    // In a real app, this would be an API call
    const mockActivity = [
      { id: 1, type: 'login', description: 'Logged in from Chrome on Windows', date: '2023-05-20T14:30:00' },
      { id: 2, type: 'document', description: 'Uploaded document "Settlement Agreement.pdf"', date: '2023-05-19T10:15:00' },
      { id: 3, type: 'password', description: 'Changed account password', date: '2023-05-15T09:22:00' },
      { id: 4, type: 'profile', description: 'Updated contact information', date: '2023-05-10T16:45:00' },
      { id: 5, type: 'login', description: 'Logged in from Safari on MacOS', date: '2023-05-08T08:30:00' },
      { id: 6, type: 'billing', description: 'Updated payment information', date: '2023-05-05T11:10:00' },
      { id: 7, type: 'login', description: 'Logged in from Firefox on Windows', date: '2023-05-01T13:25:00' },
    ];
    
    setUserActivity(mockActivity);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleProfileImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setIsEditing(false);
      // Show success message or notification
      alert('Profile updated successfully!');
    }, 1000);
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Validate passwords
    if (formData.newPassword !== formData.confirmPassword) {
      alert('New passwords do not match');
      setLoading(false);
      return;
    }
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
      // Show success message or notification
      alert('Password changed successfully!');
    }, 1000);
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'login':
        return <HiOutlineShieldCheck className="h-5 w-5 text-blue-500" />;
      case 'document':
        return <HiOutlineDocumentText className="h-5 w-5 text-green-500" />;
      case 'password':
        return <HiOutlineLockClosed className="h-5 w-5 text-yellow-500" />;
      case 'profile':
        return <HiOutlineUser className="h-5 w-5 text-purple-500" />;
      case 'billing':
        return <HiOutlineCreditCard className="h-5 w-5 text-red-500" />;
      default:
        return <HiOutlineCog className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">My Profile</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your account information and settings
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-6">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              <button
                className={`${
                  activeTab === 'personal'
                    ? 'border-[#800000] text-[#800000]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm`}
                onClick={() => setActiveTab('personal')}
              >
                <HiOutlineUser className="inline-block mr-2 h-5 w-5" />
                Personal Information
              </button>
              <button
                className={`${
                  activeTab === 'security'
                    ? 'border-[#800000] text-[#800000]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm`}
                onClick={() => setActiveTab('security')}
              >
                <HiOutlineLockClosed className="inline-block mr-2 h-5 w-5" />
                Account & Security
              </button>
              <button
                className={`${
                  activeTab === 'notifications'
                    ? 'border-[#800000] text-[#800000]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm`}
                onClick={() => setActiveTab('notifications')}
              >
                <HiOutlineBell className="inline-block mr-2 h-5 w-5" />
                Notifications
              </button>
              <button
                className={`${
                  activeTab === 'activity'
                    ? 'border-[#800000] text-[#800000]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm`}
                onClick={() => setActiveTab('activity')}
              >
                <HiOutlineClipboardList className="inline-block mr-2 h-5 w-5" />
                Account Activity
              </button>
            </nav>
          </div>

          {/* Personal Information Tab */}
          {activeTab === 'personal' && (
            <div className="p-6">
              <div className="flex flex-col md:flex-row md:space-x-8">
                <div className="md:w-1/3 mb-6 md:mb-0">
                  <div className="flex flex-col items-center p-6 bg-gray-50 rounded-lg">
                    <div className="relative">
                      {profileImage ? (
                        <img
                          src={profileImage}
                          alt="Profile"
                          className="h-32 w-32 rounded-full object-cover border-4 border-white shadow"
                        />
                      ) : (
                        <div className="h-32 w-32 rounded-full bg-gray-200 flex items-center justify-center border-4 border-white shadow">
                          <HiOutlineUserCircle className="h-16 w-16 text-gray-400" />
                        </div>
                      )}
                      <button
                        onClick={() => fileInputRef.current.click()}
                        className="absolute bottom-0 right-0 bg-[#800000] text-white p-2 rounded-full shadow-sm hover:bg-[#600000] transition-colors"
                      >
                        <HiOutlinePencil className="h-4 w-4" />
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleProfileImageUpload}
                      />
                    </div>
                    <h3 className="mt-4 text-lg font-medium text-gray-900">
                      {formData.firstName} {formData.lastName}
                    </h3>
                    <p className="text-gray-500">{formData.email}</p>
                    <div className="mt-4 w-full">
                      <div className="text-sm font-medium text-gray-500 mb-2">Client ID</div>
                      <div className="text-sm text-gray-900 p-2 bg-gray-100 rounded flex items-center justify-between">
                        <span>CL-{user?.id || '10087'}</span>
                        <button 
                          className="text-[#800000] hover:text-[#600000]"
                          title="Copy to clipboard"
                        >
                          <HiOutlineClipboardCopy className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-4 w-full">
                      <div className="text-sm font-medium text-gray-500 mb-2">Member Since</div>
                      <div className="text-sm text-gray-900 p-2 bg-gray-100 rounded">
                        January 15, 2023
                      </div>
                    </div>
                  </div>
                </div>

                <div className="md:w-2/3">
                  <div className="bg-white">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
                      {!isEditing ? (
                        <button
                          onClick={() => setIsEditing(true)}
                          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                        >
                          <HiOutlinePencil className="-ml-0.5 mr-2 h-4 w-4" />
                          Edit Information
                        </button>
                      ) : (
                        <button
                          onClick={() => setIsEditing(false)}
                          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                        >
                          <HiOutlineX className="-ml-0.5 mr-2 h-4 w-4" />
                          Cancel
                        </button>
                      )}
                    </div>

                    <form onSubmit={handleSubmit}>
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
                              value={formData.firstName}
                              onChange={handleInputChange}
                              disabled={!isEditing}
                              className={`shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md ${!isEditing ? 'bg-gray-50' : ''}`}
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
                              value={formData.lastName}
                              onChange={handleInputChange}
                              disabled={!isEditing}
                              className={`shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md ${!isEditing ? 'bg-gray-50' : ''}`}
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
                              value={formData.email}
                              onChange={handleInputChange}
                              disabled={!isEditing}
                              className={`shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md ${!isEditing ? 'bg-gray-50' : ''}`}
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
                              value={formData.phone}
                              onChange={handleInputChange}
                              disabled={!isEditing}
                              className={`shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md ${!isEditing ? 'bg-gray-50' : ''}`}
                            />
                          </div>
                        </div>

                        <div className="sm:col-span-6">
                          <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                            Street address
                          </label>
                          <div className="mt-1">
                            <input
                              type="text"
                              name="address"
                              id="address"
                              value={formData.address}
                              onChange={handleInputChange}
                              disabled={!isEditing}
                              className={`shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md ${!isEditing ? 'bg-gray-50' : ''}`}
                            />
                          </div>
                        </div>

                        <div className="sm:col-span-2">
                          <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                            City
                          </label>
                          <div className="mt-1">
                            <input
                              type="text"
                              name="city"
                              id="city"
                              value={formData.city}
                              onChange={handleInputChange}
                              disabled={!isEditing}
                              className={`shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md ${!isEditing ? 'bg-gray-50' : ''}`}
                            />
                          </div>
                        </div>

                        <div className="sm:col-span-2">
                          <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                            State / Province
                          </label>
                          <div className="mt-1">
                            <input
                              type="text"
                              name="state"
                              id="state"
                              value={formData.state}
                              onChange={handleInputChange}
                              disabled={!isEditing}
                              className={`shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md ${!isEditing ? 'bg-gray-50' : ''}`}
                            />
                          </div>
                        </div>

                        <div className="sm:col-span-2">
                          <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
                            ZIP / Postal code
                          </label>
                          <div className="mt-1">
                            <input
                              type="text"
                              name="zipCode"
                              id="zipCode"
                              value={formData.zipCode}
                              onChange={handleInputChange}
                              disabled={!isEditing}
                              className={`shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md ${!isEditing ? 'bg-gray-50' : ''}`}
                            />
                          </div>
                        </div>

                        <div className="sm:col-span-3">
                          <label htmlFor="occupation" className="block text-sm font-medium text-gray-700">
                            Occupation
                          </label>
                          <div className="mt-1">
                            <input
                              type="text"
                              name="occupation"
                              id="occupation"
                              value={formData.occupation}
                              onChange={handleInputChange}
                              disabled={!isEditing}
                              className={`shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md ${!isEditing ? 'bg-gray-50' : ''}`}
                            />
                          </div>
                        </div>

                        <div className="sm:col-span-3">
                          <label htmlFor="employer" className="block text-sm font-medium text-gray-700">
                            Employer
                          </label>
                          <div className="mt-1">
                            <input
                              type="text"
                              name="employer"
                              id="employer"
                              value={formData.employer}
                              onChange={handleInputChange}
                              disabled={!isEditing}
                              className={`shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md ${!isEditing ? 'bg-gray-50' : ''}`}
                            />
                          </div>
                        </div>

                        <div className="sm:col-span-3">
                          <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700">
                            Date of Birth
                          </label>
                          <div className="mt-1">
                            <input
                              type="date"
                              name="birthDate"
                              id="birthDate"
                              value={formData.birthDate}
                              onChange={handleInputChange}
                              disabled={!isEditing}
                              className={`shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md ${!isEditing ? 'bg-gray-50' : ''}`}
                            />
                          </div>
                        </div>
                      </div>

                      {isEditing && (
                        <div className="mt-6 flex justify-end">
                          <button
                            type="button"
                            onClick={() => setIsEditing(false)}
                            className="mr-3 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#800000] hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                            disabled={loading}
                          >
                            {loading ? 'Saving...' : 'Save Changes'}
                          </button>
                        </div>
                      )}
                    </form>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
                  <form onSubmit={handlePasswordChange}>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                          Current Password
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <input
                            type={showPassword ? "text" : "password"}
                            name="currentPassword"
                            id="currentPassword"
                            value={formData.currentPassword}
                            onChange={handleInputChange}
                            className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md pr-10"
                            required
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <HiOutlineEyeOff className="h-5 w-5 text-gray-400" />
                            ) : (
                              <HiOutlineEye className="h-5 w-5 text-gray-400" />
                            )}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                          New Password
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <input
                            type={showNewPassword ? "text" : "password"}
                            name="newPassword"
                            id="newPassword"
                            value={formData.newPassword}
                            onChange={handleInputChange}
                            className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md pr-10"
                            required
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                          >
                            {showNewPassword ? (
                              <HiOutlineEyeOff className="h-5 w-5 text-gray-400" />
                            ) : (
                              <HiOutlineEye className="h-5 w-5 text-gray-400" />
                            )}
                          </button>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                          Password must be at least 8 characters and include a number and a special character
                        </p>
                      </div>
                      <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                          Confirm New Password
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            id="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md pr-10"
                            required
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? (
                              <HiOutlineEyeOff className="h-5 w-5 text-gray-400" />
                            ) : (
                              <HiOutlineEye className="h-5 w-5 text-gray-400" />
                            )}
                          </button>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#800000] hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                          disabled={loading}
                        >
                          {loading ? 'Changing Password...' : 'Change Password'}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Security Settings</h3>
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <HiOutlineShieldCheck className="h-6 w-6 text-green-500" />
                      </div>
                      <div className="ml-3">
                        <h4 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h4>
                        <p className="mt-1 text-sm text-gray-500">
                          Add an extra layer of security to your account by requiring a verification code in addition to your password.
                        </p>
                        <div className="mt-3">
                          <button
                            type="button"
                            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                          >
                            Enable Two-Factor
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <HiOutlineExclamationCircle className="h-6 w-6 text-yellow-500" />
                      </div>
                      <div className="ml-3">
                        <h4 className="text-sm font-medium text-gray-900">Active Sessions</h4>
                        <p className="mt-1 text-sm text-gray-500">
                          You're currently logged in on 2 devices
                        </p>
                        <div className="mt-3">
                          <button
                            type="button"
                            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                          >
                            <HiOutlineRefresh className="mr-2 h-4 w-4" />
                            Manage Sessions
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <HiOutlineMail className="h-6 w-6 text-blue-500" />
                      </div>
                      <div className="ml-3">
                        <h4 className="text-sm font-medium text-gray-900">Login Email Notifications</h4>
                        <p className="mt-1 text-sm text-gray-500">
                          Receive email notifications when your account is accessed from a new device or location.
                        </p>
                        <div className="mt-3">
                          <label className="inline-flex items-center">
                            <input
                              type="checkbox"
                              className="focus:ring-[#800000] h-4 w-4 text-[#800000] border-gray-300 rounded"
                              checked={true}
                              onChange={() => {}}
                            />
                            <span className="ml-2 text-sm text-gray-700">Enable login alerts</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Preferences</h3>
              <div className="mt-6 space-y-6">
                <div className="relative flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="emailNotifications"
                      name="emailNotifications"
                      type="checkbox"
                      className="focus:ring-[#800000] h-4 w-4 text-[#800000] border-gray-300 rounded"
                      checked={formData.emailNotifications}
                      onChange={handleCheckboxChange}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="emailNotifications" className="font-medium text-gray-700">
                      Email Notifications
                    </label>
                    <p className="text-gray-500">Receive general notifications via email</p>
                  </div>
                </div>

                <div className="relative flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="smsNotifications"
                      name="smsNotifications"
                      type="checkbox"
                      className="focus:ring-[#800000] h-4 w-4 text-[#800000] border-gray-300 rounded"
                      checked={formData.smsNotifications}
                      onChange={handleCheckboxChange}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="smsNotifications" className="font-medium text-gray-700">
                      SMS Notifications
                    </label>
                    <p className="text-gray-500">Receive text message notifications for important updates</p>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h4 className="text-base font-medium text-gray-900">Specific Notifications</h4>
                  <div className="mt-4 space-y-4">
                    <div className="relative flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="documentAlerts"
                          name="documentAlerts"
                          type="checkbox"
                          className="focus:ring-[#800000] h-4 w-4 text-[#800000] border-gray-300 rounded"
                          checked={formData.documentAlerts}
                          onChange={handleCheckboxChange}
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="documentAlerts" className="font-medium text-gray-700">
                          Document Alerts
                        </label>
                        <p className="text-gray-500">Notification when new documents are uploaded or require your review</p>
                      </div>
                    </div>

                    <div className="relative flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="caseUpdates"
                          name="caseUpdates"
                          type="checkbox"
                          className="focus:ring-[#800000] h-4 w-4 text-[#800000] border-gray-300 rounded"
                          checked={formData.caseUpdates}
                          onChange={handleCheckboxChange}
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="caseUpdates" className="font-medium text-gray-700">
                          Case Updates
                        </label>
                        <p className="text-gray-500">Receive notifications about changes to your case status</p>
                      </div>
                    </div>

                    <div className="relative flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="billingAlerts"
                          name="billingAlerts"
                          type="checkbox"
                          className="focus:ring-[#800000] h-4 w-4 text-[#800000] border-gray-300 rounded"
                          checked={formData.billingAlerts}
                          onChange={handleCheckboxChange}
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="billingAlerts" className="font-medium text-gray-700">
                          Billing & Payment Alerts
                        </label>
                        <p className="text-gray-500">Notifications about invoices, payments due, and receipt confirmations</p>
                      </div>
                    </div>

                    <div className="relative flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="appointmentReminders"
                          name="appointmentReminders"
                          type="checkbox"
                          className="focus:ring-[#800000] h-4 w-4 text-[#800000] border-gray-300 rounded"
                          checked={formData.appointmentReminders}
                          onChange={handleCheckboxChange}
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="appointmentReminders" className="font-medium text-gray-700">
                          Appointment Reminders
                        </label>
                        <p className="text-gray-500">Receive reminders about upcoming meetings and court dates</p>
                      </div>
                    </div>

                    <div className="relative flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="marketingCommunications"
                          name="marketingCommunications"
                          type="checkbox"
                          className="focus:ring-[#800000] h-4 w-4 text-[#800000] border-gray-300 rounded"
                          checked={formData.marketingCommunications}
                          onChange={handleCheckboxChange}
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="marketingCommunications" className="font-medium text-gray-700">
                          Marketing Communications
                        </label>
                        <p className="text-gray-500">Receive newsletters, offers, and legal updates</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#800000] hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                >
                  Save Preferences
                </button>
              </div>
            </div>
          )}

          {/* Activity Tab */}
          {activeTab === 'activity' && (
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Account Activity</h3>
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul role="list" className="divide-y divide-gray-200">
                  {userActivity.map((activity) => (
                    <li key={activity.id}>
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            {getActivityIcon(activity.type)}
                          </div>
                          <div className="ml-4 flex-1">
                            <div className="text-sm font-medium text-gray-900">
                              {activity.description}
                            </div>
                            <div className="text-sm text-gray-500">
                              {new Date(activity.date).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 sm:px-6">
                  <div className="flex justify-between">
                    <button
                      type="button"
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                    >
                      View All Activity
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#800000] hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                    >
                      Download Activity Log
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientProfilePage;