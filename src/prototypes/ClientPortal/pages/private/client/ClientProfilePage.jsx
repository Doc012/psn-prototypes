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
  HiOutlineUserCircle,
  HiOutlineClipboardCopy
} from 'react-icons/hi';

const ClientProfilePage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('personal');
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState('https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740');
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
                        accept="image/*"
                        onChange={handleProfileImageUpload}
                        className="hidden"
                      />
                    </div>
                    <h2 className="mt-4 text-lg font-semibold text-gray-900">
                      {formData.firstName} {formData.lastName}
                    </h2>
                    <p className="text-sm text-gray-500">{formData.occupation}</p>
                    <div className="mt-4 flex space-x-3">
                      <button 
                        className="text-[#800000] hover:text-[#600000]"
                        title="Copy to clipboard"
                      >
                        <HiOutlineClipboardCopy className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="md:flex-1">
                  <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          First Name
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Last Name
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Phone
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Address
                        </label>
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          City
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          State
                        </label>
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          ZIP Code
                        </label>
                        <input
                          type="text"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Occupation
                        </label>
                        <input
                          type="text"
                          name="occupation"
                          value={formData.occupation}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Employer
                        </label>
                        <input
                          type="text"
                          name="employer"
                          value={formData.employer}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Birth Date
                        </label>
                        <input
                          type="date"
                          name="birthDate"
                          value={formData.birthDate}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                        />
                      </div>
                    </div>
                    <div className="mt-6 flex justify-end space-x-4">
                      {isEditing ? (
                        <button
                          type="submit"
                          className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#800000] hover:bg-[#600000] transition-colors"
                        >
                          {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                      ) : (
                        <button
                          onClick={() => setIsEditing(true)}
                          className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#800000] hover:bg-[#600000] transition-colors"
                        >
                          Edit Profile
                        </button>
                      )}
                      <button
                        onClick={() => setActiveTab('security')}
                        className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-[#800000] hover:text-[#600000] transition-colors"
                      >
                        Skip to Security
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* Account & Security Tab */}
          {activeTab === 'security' && (
            <div className="p-6">
              <form onSubmit={handlePasswordChange}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Current Password
                    </label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(prev => !prev)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm"
                    >
                      {showPassword ? (
                        <HiOutlineEyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <HiOutlineEye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      New Password
                    </label>
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(prev => !prev)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm"
                    >
                      {showNewPassword ? (
                        <HiOutlineEyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <HiOutlineEye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Confirm Password
                    </label>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(prev => !prev)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm"
                    >
                      {showConfirmPassword ? (
                        <HiOutlineEyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <HiOutlineEye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  {isEditing && (
                    <button
                      type="submit"
                      className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#800000] hover:bg-[#600000] transition-colors"
                    >
                      {loading ? 'Changing...' : 'Change Password'}
                    </button>
                  )}
                </div>
              </form>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="p-6">
              <form>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      id="emailNotifications"
                      name="emailNotifications"
                      type="checkbox"
                      checked={formData.emailNotifications}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 text-[#800000] border-gray-300 rounded focus:ring-[#800000]"
                    />
                    <label
                      htmlFor="emailNotifications"
                      className="ml-3 block text-sm font-medium text-gray-700"
                    >
                      Email Notifications
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="smsNotifications"
                      name="smsNotifications"
                      type="checkbox"
                      checked={formData.smsNotifications}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 text-[#800000] border-gray-300 rounded focus:ring-[#800000]"
                    />
                    <label
                      htmlFor="smsNotifications"
                      className="ml-3 block text-sm font-medium text-gray-700"
                    >
                      SMS Notifications
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="documentAlerts"
                      name="documentAlerts"
                      type="checkbox"
                      checked={formData.documentAlerts}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 text-[#800000] border-gray-300 rounded focus:ring-[#800000]"
                    />
                    <label
                      htmlFor="documentAlerts"
                      className="ml-3 block text-sm font-medium text-gray-700"
                    >
                      Document Alerts
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="caseUpdates"
                      name="caseUpdates"
                      type="checkbox"
                      checked={formData.caseUpdates}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 text-[#800000] border-gray-300 rounded focus:ring-[#800000]"
                    />
                    <label
                      htmlFor="caseUpdates"
                      className="ml-3 block text-sm font-medium text-gray-700"
                    >
                      Case Updates
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="billingAlerts"
                      name="billingAlerts"
                      type="checkbox"
                      checked={formData.billingAlerts}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 text-[#800000] border-gray-300 rounded focus:ring-[#800000]"
                    />
                    <label
                      htmlFor="billingAlerts"
                      className="ml-3 block text-sm font-medium text-gray-700"
                    >
                      Billing Alerts
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="appointmentReminders"
                      name="appointmentReminders"
                      type="checkbox"
                      checked={formData.appointmentReminders}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 text-[#800000] border-gray-300 rounded focus:ring-[#800000]"
                    />
                    <label
                      htmlFor="appointmentReminders"
                      className="ml-3 block text-sm font-medium text-gray-700"
                    >
                      Appointment Reminders
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="marketingCommunications"
                      name="marketingCommunications"
                      type="checkbox"
                      checked={formData.marketingCommunications}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 text-[#800000] border-gray-300 rounded focus:ring-[#800000]"
                    />
                    <label
                      htmlFor="marketingCommunications"
                      className="ml-3 block text-sm font-medium text-gray-700"
                    >
                      Marketing Communications
                    </label>
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#800000] hover:bg-[#600000] transition-colors"
                  >
                    Save Notification Preferences
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Account Activity Tab */}
          {activeTab === 'activity' && (
            <div className="p-6">
              <div className="space-y-4">
                {userActivity.map(activity => (
                  <div key={activity.id} className="flex items-center p-4 bg-gray-50 rounded-lg shadow-sm">
                    <div className="flex-shrink-0">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.description}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(activity.date).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientProfilePage;
