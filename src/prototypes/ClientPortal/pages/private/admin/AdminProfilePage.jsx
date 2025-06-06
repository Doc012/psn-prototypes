import { useState, useRef, Fragment } from 'react';
import { Dialog, Transition, Switch } from '@headlessui/react';
import { 
  HiOutlineUser, 
  HiOutlineMail, 
  HiOutlinePhone, 
  HiOutlineOfficeBuilding,
  HiOutlineLocationMarker,
  HiOutlineCamera,
  HiOutlineKey,
  HiOutlineBell,
  HiOutlineLockClosed,
  HiOutlineDocumentText,
  HiOutlineShieldCheck,
  HiOutlineExclamationCircle,
  HiOutlineCheck,
  HiOutlineX
} from 'react-icons/hi';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const AdminProfilePage = () => {
  const fileInputRef = useRef(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Mock user data
  const [profileData, setProfileData] = useState({
    profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    firstName: 'Michael',
    lastName: 'Peterson',
    email: 'michael.peterson@psnattorneys.co.za',
    phone: '+27 82 123 4567',
    position: 'Managing Partner',
    department: 'Administration',
    officeLocation: 'Cape Town',
    address: {
      street: '100 Long Street',
      city: 'Cape Town',
      state: 'Western Cape',
      postalCode: '8001',
      country: 'South Africa'
    }
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: true,
    systemUpdates: true,
    securityAlerts: true,
    userActivityAlerts: false,
    marketingEmails: false
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: true,
    rememberDevices: true,
    loginNotifications: true,
    autoLogout: 30 // minutes
  });

  const handleProfileChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddressChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value
      }
    }));
  };

  const handleNotificationChange = (field, value) => {
    setNotificationSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSecurityChange = (field, value) => {
    setSecuritySettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileData(prev => ({
          ...prev,
          profileImage: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const validatePassword = () => {
    if (passwordData.newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
      return false;
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('Passwords do not match');
      return false;
    }
    
    return true;
  };

  const saveProfile = () => {
    // In a real app, this would send the data to your backend
    console.log('Saving profile:', profileData);
    console.log('Notification settings:', notificationSettings);
    console.log('Security settings:', securitySettings);
    
    // Show success message
    setShowSuccessMessage(true);
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000);
  };

  const savePassword = () => {
    if (validatePassword()) {
      // In a real app, this would send the password change request to your backend
      console.log('Changing password:', passwordData);
      
      // Reset form and close modal
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        setShowPasswordModal(false);
      }, 1500);
    }
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">My Profile</h1>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="py-4">
          {/* Success message */}
          {showSuccessMessage && (
            <div className="mb-4 rounded-md bg-green-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <HiOutlineCheck className="h-5 w-5 text-green-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">
                    Your profile has been updated successfully.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Profile Photo and Basic Info Card */}
            <div className="bg-white shadow rounded-lg overflow-hidden lg:col-span-1">
              <div className="px-4 py-5 sm:px-6 flex flex-col items-center">
                <div className="relative">
                  <img 
                    src={profileData.profileImage} 
                    alt="Profile" 
                    className="h-32 w-32 rounded-full object-cover border-4 border-white shadow-md"
                  />
                  <button 
                    type="button"
                    onClick={triggerFileInput}
                    className="absolute bottom-0 right-0 bg-[#800000] rounded-full p-2 text-white shadow-sm hover:bg-[#600000]"
                  >
                    <HiOutlineCamera className="h-5 w-5" />
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
                <h3 className="mt-4 text-xl font-medium text-gray-900">
                  {profileData.firstName} {profileData.lastName}
                </h3>
                <p className="text-sm text-gray-500">{profileData.position}</p>
                <p className="text-sm text-gray-500">{profileData.department}</p>
                
                <div className="mt-4 flex flex-col w-full space-y-3">
                  <div className="flex items-center text-sm text-gray-500">
                    <HiOutlineMail className="mr-2 h-5 w-5 text-gray-400" />
                    {profileData.email}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <HiOutlinePhone className="mr-2 h-5 w-5 text-gray-400" />
                    {profileData.phone}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <HiOutlineOfficeBuilding className="mr-2 h-5 w-5 text-gray-400" />
                    {profileData.officeLocation}
                  </div>
                </div>
                
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(true)}
                  className="mt-6 w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <HiOutlineKey className="mr-2 -ml-1 h-5 w-5 text-gray-500" />
                  Change Password
                </button>
              </div>
            </div>

            {/* Profile Details Card */}
            <div className="bg-white shadow rounded-lg overflow-hidden lg:col-span-2">
              <div className="px-4 py-5 sm:px-6 flex items-center justify-between">
                <div className="flex items-center">
                  <HiOutlineUser className="h-6 w-6 text-[#800000] mr-3" />
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Personal Information</h3>
                </div>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:p-6 space-y-6">
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
                      First name
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="first-name"
                        value={profileData.firstName}
                        onChange={(e) => handleProfileChange('firstName', e.target.value)}
                        className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="last-name" className="block text-sm font-medium text-gray-700">
                      Last name
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="last-name"
                        value={profileData.lastName}
                        onChange={(e) => handleProfileChange('lastName', e.target.value)}
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
                        id="email"
                        value={profileData.email}
                        onChange={(e) => handleProfileChange('email', e.target.value)}
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
                        id="phone"
                        value={profileData.phone}
                        onChange={(e) => handleProfileChange('phone', e.target.value)}
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
                        id="position"
                        value={profileData.position}
                        onChange={(e) => handleProfileChange('position', e.target.value)}
                        className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                      Department
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="department"
                        value={profileData.department}
                        onChange={(e) => handleProfileChange('department', e.target.value)}
                        className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-6">
                    <label htmlFor="office-location" className="block text-sm font-medium text-gray-700">
                      Office Location
                    </label>
                    <div className="mt-1">
                      <select
                        id="office-location"
                        value={profileData.officeLocation}
                        onChange={(e) => handleProfileChange('officeLocation', e.target.value)}
                        className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                      >
                        <option>Cape Town</option>
                        <option>Johannesburg</option>
                        <option>Durban</option>
                        <option>Pretoria</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Address</h3>
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-6">
                      <label htmlFor="street-address" className="block text-sm font-medium text-gray-700">
                        Street address
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          id="street-address"
                          value={profileData.address.street}
                          onChange={(e) => handleAddressChange('street', e.target.value)}
                          className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
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
                          id="city"
                          value={profileData.address.city}
                          onChange={(e) => handleAddressChange('city', e.target.value)}
                          className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
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
                          id="state"
                          value={profileData.address.state}
                          onChange={(e) => handleAddressChange('state', e.target.value)}
                          className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="postal-code" className="block text-sm font-medium text-gray-700">
                        ZIP / Postal code
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          id="postal-code"
                          value={profileData.address.postalCode}
                          onChange={(e) => handleAddressChange('postalCode', e.target.value)}
                          className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                        Country
                      </label>
                      <div className="mt-1">
                        <select
                          id="country"
                          value={profileData.address.country}
                          onChange={(e) => handleAddressChange('country', e.target.value)}
                          className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                        >
                          <option>South Africa</option>
                          <option>United States</option>
                          <option>United Kingdom</option>
                          <option>Canada</option>
                          <option>Australia</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                <button
                  type="button"
                  onClick={saveProfile}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#800000] hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                >
                  Save Changes
                </button>
              </div>
            </div>

            {/* Notification Settings Card */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-4 py-5 sm:px-6 flex items-center">
                <HiOutlineBell className="h-6 w-6 text-[#800000] mr-3" />
                <h3 className="text-lg leading-6 font-medium text-gray-900">Notification Preferences</h3>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:p-6 space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="email-notifications"
                        type="checkbox"
                        checked={notificationSettings.emailNotifications}
                        onChange={(e) => handleNotificationChange('emailNotifications', e.target.checked)}
                        className="focus:ring-[#800000] h-4 w-4 text-[#800000] border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="email-notifications" className="font-medium text-gray-700">Email Notifications</label>
                      <p className="text-gray-500">Receive notifications via email</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="sms-notifications"
                        type="checkbox"
                        checked={notificationSettings.smsNotifications}
                        onChange={(e) => handleNotificationChange('smsNotifications', e.target.checked)}
                        className="focus:ring-[#800000] h-4 w-4 text-[#800000] border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="sms-notifications" className="font-medium text-gray-700">SMS Notifications</label>
                      <p className="text-gray-500">Receive notifications via text message</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="system-updates"
                        type="checkbox"
                        checked={notificationSettings.systemUpdates}
                        onChange={(e) => handleNotificationChange('systemUpdates', e.target.checked)}
                        className="focus:ring-[#800000] h-4 w-4 text-[#800000] border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="system-updates" className="font-medium text-gray-700">System Updates</label>
                      <p className="text-gray-500">Receive notifications about system updates</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="security-alerts"
                        type="checkbox"
                        checked={notificationSettings.securityAlerts}
                        onChange={(e) => handleNotificationChange('securityAlerts', e.target.checked)}
                        className="focus:ring-[#800000] h-4 w-4 text-[#800000] border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="security-alerts" className="font-medium text-gray-700">Security Alerts</label>
                      <p className="text-gray-500">Receive alerts about security-related events</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="user-activity"
                        type="checkbox"
                        checked={notificationSettings.userActivityAlerts}
                        onChange={(e) => handleNotificationChange('userActivityAlerts', e.target.checked)}
                        className="focus:ring-[#800000] h-4 w-4 text-[#800000] border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="user-activity" className="font-medium text-gray-700">User Activity Alerts</label>
                      <p className="text-gray-500">Receive alerts about other users' activities</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="marketing-emails"
                        type="checkbox"
                        checked={notificationSettings.marketingEmails}
                        onChange={(e) => handleNotificationChange('marketingEmails', e.target.checked)}
                        className="focus:ring-[#800000] h-4 w-4 text-[#800000] border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="marketing-emails" className="font-medium text-gray-700">Marketing Emails</label>
                      <p className="text-gray-500">Receive promotional emails and newsletters</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                <button
                  type="button"
                  onClick={saveProfile}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#800000] hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                >
                  Save Changes
                </button>
              </div>
            </div>

            {/* Security Settings Card */}
            <div className="bg-white shadow rounded-lg overflow-hidden lg:col-span-2">
              <div className="px-4 py-5 sm:px-6 flex items-center">
                <HiOutlineShieldCheck className="h-6 w-6 text-[#800000] mr-3" />
                <h3 className="text-lg leading-6 font-medium text-gray-900">Security Settings</h3>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <h4 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h4>
                    <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                  </div>
                  <Switch
                    checked={securitySettings.twoFactorAuth}
                    onChange={(checked) => handleSecurityChange('twoFactorAuth', checked)}
                    className={classNames(
                      securitySettings.twoFactorAuth ? 'bg-[#800000]' : 'bg-gray-200',
                      'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]'
                    )}
                  >
                    <span className="sr-only">Use two-factor authentication</span>
                    <span
                      aria-hidden="true"
                      className={classNames(
                        securitySettings.twoFactorAuth ? 'translate-x-5' : 'translate-x-0',
                        'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200'
                      )}
                    />
                  </Switch>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <h4 className="text-sm font-medium text-gray-900">Remember Devices</h4>
                    <p className="text-sm text-gray-500">Stay logged in on trusted devices</p>
                  </div>
                  <Switch
                    checked={securitySettings.rememberDevices}
                    onChange={(checked) => handleSecurityChange('rememberDevices', checked)}
                    className={classNames(
                      securitySettings.rememberDevices ? 'bg-[#800000]' : 'bg-gray-200',
                      'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]'
                    )}
                  >
                    <span className="sr-only">Remember devices</span>
                    <span
                      aria-hidden="true"
                      className={classNames(
                        securitySettings.rememberDevices ? 'translate-x-5' : 'translate-x-0',
                        'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200'
                      )}
                    />
                  </Switch>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <h4 className="text-sm font-medium text-gray-900">Login Notifications</h4>
                    <p className="text-sm text-gray-500">Receive alerts when someone logs into your account</p>
                  </div>
                  <Switch
                    checked={securitySettings.loginNotifications}
                    onChange={(checked) => handleSecurityChange('loginNotifications', checked)}
                    className={classNames(
                      securitySettings.loginNotifications ? 'bg-[#800000]' : 'bg-gray-200',
                      'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]'
                    )}
                  >
                    <span className="sr-only">Enable login notifications</span>
                    <span
                      aria-hidden="true"
                      className={classNames(
                        securitySettings.loginNotifications ? 'translate-x-5' : 'translate-x-0',
                        'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200'
                      )}
                    />
                  </Switch>
                </div>

                <div>
                  <label htmlFor="auto-logout" className="block text-sm font-medium text-gray-700">
                    Auto Logout (minutes)
                  </label>
                  <div className="mt-1">
                    <select
                      id="auto-logout"
                      value={securitySettings.autoLogout}
                      onChange={(e) => handleSecurityChange('autoLogout', parseInt(e.target.value))}
                      className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                    >
                      <option value="15">15 minutes</option>
                      <option value="30">30 minutes</option>
                      <option value="60">1 hour</option>
                      <option value="120">2 hours</option>
                      <option value="240">4 hours</option>
                      <option value="480">8 hours</option>
                    </select>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    Automatically log out after a period of inactivity
                  </p>
                </div>

                <div className="pt-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-yellow-100 rounded-full p-1">
                      <HiOutlineExclamationCircle className="h-5 w-5 text-yellow-600" />
                    </div>
                    <h4 className="ml-3 text-sm font-medium text-gray-900">Connected Devices</h4>
                  </div>
                  <div className="mt-4 border border-gray-200 rounded-md">
                    <div className="divide-y divide-gray-200">
                      <div className="p-4 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">Windows PC - Chrome</p>
                          <p className="text-xs text-gray-500">Cape Town, South Africa • Current device</p>
                          <p className="text-xs text-gray-400">Last active: Just now</p>
                        </div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Current
                        </span>
                      </div>
                      <div className="p-4 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">iPhone 13 - Safari</p>
                          <p className="text-xs text-gray-500">Cape Town, South Africa</p>
                          <p className="text-xs text-gray-400">Last active: 2 hours ago</p>
                        </div>
                        <button
                          type="button"
                          className="text-sm text-red-600 hover:text-red-500"
                        >
                          Revoke
                        </button>
                      </div>
                      <div className="p-4 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">MacBook Pro - Firefox</p>
                          <p className="text-xs text-gray-500">Cape Town, South Africa</p>
                          <p className="text-xs text-gray-400">Last active: Yesterday</p>
                        </div>
                        <button
                          type="button"
                          className="text-sm text-red-600 hover:text-red-500"
                        >
                          Revoke
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <HiOutlineX className="-ml-0.5 mr-2 h-4 w-4" />
                      Revoke All Other Sessions
                    </button>
                  </div>
                </div>

                <div className="pt-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-gray-100 rounded-full p-1">
                      <HiOutlineDocumentText className="h-5 w-5 text-gray-600" />
                    </div>
                    <h4 className="ml-3 text-sm font-medium text-gray-900">Account Activity Log</h4>
                  </div>
                  <div className="mt-4 border border-gray-200 rounded-md">
                    <div className="divide-y divide-gray-200">
                      <div className="p-4">
                        <p className="text-sm font-medium text-gray-900">Password changed</p>
                        <p className="text-xs text-gray-500">From 192.168.1.1 • Chrome on Windows</p>
                        <p className="text-xs text-gray-400">2 weeks ago</p>
                      </div>
                      <div className="p-4">
                        <p className="text-sm font-medium text-gray-900">Login successful</p>
                        <p className="text-xs text-gray-500">From 192.168.1.1 • Chrome on Windows</p>
                        <p className="text-xs text-gray-400">2 weeks ago</p>
                      </div>
                      <div className="p-4">
                        <p className="text-sm font-medium text-gray-900">Two-factor authentication enabled</p>
                        <p className="text-xs text-gray-500">From 192.168.1.1 • Chrome on Windows</p>
                        <p className="text-xs text-gray-400">3 weeks ago</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <button
                      type="button"
                      className="text-sm font-medium text-[#800000] hover:text-[#600000]"
                    >
                      View full activity log
                    </button>
                  </div>
                </div>
              </div>
              <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                <button
                  type="button"
                  onClick={saveProfile}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#800000] hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      <Transition.Root show={showPasswordModal} as={Fragment}>
        <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto" onClose={setShowPasswordModal}>
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
                <div>
                  {saveSuccess ? (
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                      <HiOutlineCheck className="h-6 w-6 text-green-600" aria-hidden="true" />
                    </div>
                  ) : (
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-[#800000] bg-opacity-10">
                      <HiOutlineLockClosed className="h-6 w-6 text-[#800000]" aria-hidden="true" />
                    </div>
                  )}
                  <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                      {saveSuccess ? 'Password Updated!' : 'Change Your Password'}
                    </Dialog.Title>
                    {!saveSuccess && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Please enter your current password and then choose a new secure password.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {!saveSuccess && (
                  <div className="mt-5 sm:mt-6 space-y-4">
                    <div>
                      <label htmlFor="current-password" className="block text-sm font-medium text-gray-700">
                        Current Password
                      </label>
                      <div className="mt-1">
                        <input
                          type="password"
                          id="current-password"
                          value={passwordData.currentPassword}
                          onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                          className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
                        New Password
                      </label>
                      <div className="mt-1">
                        <input
                          type="password"
                          id="new-password"
                          value={passwordData.newPassword}
                          onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                          className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                          required
                        />
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        Password must be at least 8 characters and include uppercase, lowercase, number, and special characters.
                      </p>
                    </div>
                    
                    <div>
                      <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                        Confirm New Password
                      </label>
                      <div className="mt-1">
                        <input
                          type="password"
                          id="confirm-password"
                          value={passwordData.confirmPassword}
                          onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                          className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                          required
                        />
                      </div>
                    </div>

                    {passwordError && (
                      <div className="rounded-md bg-red-50 p-4">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <HiOutlineX className="h-5 w-5 text-red-400" aria-hidden="true" />
                          </div>
                          <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800">{passwordError}</h3>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                  {saveSuccess ? (
                    <button
                      type="button"
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#800000] text-base font-medium text-white hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000] sm:col-start-2 sm:text-sm"
                      onClick={() => setShowPasswordModal(false)}
                    >
                      Close
                    </button>
                  ) : (
                    <>
                      <button
                        type="button"
                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000] sm:mt-0 sm:col-start-1 sm:text-sm"
                        onClick={() => setShowPasswordModal(false)}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#800000] text-base font-medium text-white hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000] sm:col-start-2 sm:text-sm"
                        onClick={savePassword}
                      >
                        Change Password
                      </button>
                    </>
                  )}
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
};

export default AdminProfilePage;