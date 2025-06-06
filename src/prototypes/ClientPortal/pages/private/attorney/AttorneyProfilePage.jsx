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
  HiOutlineClipboardCopy,
  HiOutlineOfficeBuilding,
  HiOutlineAcademicCap,
  HiOutlineLibrary,
  HiOutlineBadgeCheck,
  HiOutlineScale,
  HiOutlineGlobe,
  HiOutlineClock,
  HiOutlinePlus // Adding the missing icon
} from 'react-icons/hi';

const AttorneyProfilePage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('personal');
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState('https://randomuser.me/api/portraits/men/32.jpg');
  const fileInputRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userActivity, setUserActivity] = useState([]);
  const [licenses, setLicenses] = useState([]);
  const [education, setEducation] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [newLicense, setNewLicense] = useState({ state: '', number: '', year: '', status: 'Active' });
  const [newEducation, setNewEducation] = useState({ institution: '', degree: '', year: '' });
  const [newSpecialty, setNewSpecialty] = useState('');
  const [newLanguage, setNewLanguage] = useState('');
  const [showLicenseForm, setShowLicenseForm] = useState(false);
  const [showEducationForm, setShowEducationForm] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    firstName: user?.firstName || 'Michael',
    lastName: user?.lastName || 'Patel',
    email: user?.email || 'michael.patel@lawfirm.com',
    phone: user?.phone || '(555) 987-6543',
    officePhone: user?.officePhone || '(555) 123-4567 ext. 101',
    address: user?.address || '123 Legal Avenue, Suite 500',
    city: user?.city || 'San Francisco',
    state: user?.state || 'CA',
    zipCode: user?.zipCode || '94105',
    title: user?.title || 'Senior Attorney',
    barNumber: user?.barNumber || 'CA123456',
    practiceAreas: user?.practiceAreas || 'Personal Injury, Corporate Law',
    firmName: user?.firmName || 'Smith & Associates',
    bio: user?.bio || 'Attorney with over 15 years of experience specializing in personal injury and corporate law cases. Dedicated to providing exceptional representation for clients in complex legal matters.',
    yearsOfExperience: user?.yearsOfExperience || '15',
    ratePerHour: user?.ratePerHour || '1500', // Changed from 350 to 1500 for a reasonable Rand rate
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    emailNotifications: true,
    smsNotifications: true,
    documentAlerts: true,
    caseUpdates: true,
    billingAlerts: true,
    appointmentReminders: true,
    marketingCommunications: false,
    availability: user?.availability || {
      monday: { start: '09:00', end: '17:00', available: true },
      tuesday: { start: '09:00', end: '17:00', available: true },
      wednesday: { start: '09:00', end: '17:00', available: true },
      thursday: { start: '09:00', end: '17:00', available: true },
      friday: { start: '09:00', end: '17:00', available: true },
      saturday: { start: '10:00', end: '14:00', available: false },
      sunday: { start: '10:00', end: '14:00', available: false }
    }
  });

  // Fetch user activity and professional data
  useEffect(() => {
    // In a real app, this would be an API call
    const mockActivity = [
      { id: 1, type: 'login', description: 'Logged in from Chrome on Windows', date: '2023-05-20T14:30:00' },
      { id: 2, type: 'document', description: 'Uploaded document "Settlement Agreement.pdf"', date: '2023-05-19T10:15:00' },
      { id: 3, type: 'password', description: 'Changed account password', date: '2023-05-15T09:22:00' },
      { id: 4, type: 'profile', description: 'Updated professional credentials', date: '2023-05-10T16:45:00' },
      { id: 5, type: 'login', description: 'Logged in from Safari on MacOS', date: '2023-05-08T08:30:00' },
      { id: 6, type: 'billing', description: 'Updated billing rate information', date: '2023-05-05T11:10:00' },
      { id: 7, type: 'login', description: 'Logged in from Firefox on Windows', date: '2023-05-01T13:25:00' },
    ];
    
    const mockLicenses = [
      { id: 1, state: 'California', number: 'CA123456', year: '2008', status: 'Active' },
      { id: 2, state: 'New York', number: 'NY987654', year: '2010', status: 'Active' }
    ];
    
    const mockEducation = [
      { id: 1, institution: 'Harvard Law School', degree: 'J.D.', year: '2007' },
      { id: 2, institution: 'Stanford University', degree: 'B.A. Political Science', year: '2004' }
    ];
    
    const mockSpecialties = [
      'Personal Injury', 'Corporate Law', 'Contract Negotiation', 'Litigation'
    ];
    
    const mockLanguages = [
      'English', 'Spanish', 'Hindi'
    ];
    
    setUserActivity(mockActivity);
    setLicenses(mockLicenses);
    setEducation(mockEducation);
    setSpecialties(mockSpecialties);
    setLanguages(mockLanguages);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvailabilityChange = (day, field, value) => {
    setFormData(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: {
          ...prev.availability[day],
          [field]: field === 'available' ? !prev.availability[day].available : value
        }
      }
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

  const handleAddLicense = (e) => {
    e.preventDefault();
    const id = licenses.length + 1;
    setLicenses([...licenses, { id, ...newLicense }]);
    setNewLicense({ state: '', number: '', year: '', status: 'Active' });
    setShowLicenseForm(false);
  };

  const handleAddEducation = (e) => {
    e.preventDefault();
    const id = education.length + 1;
    setEducation([...education, { id, ...newEducation }]);
    setNewEducation({ institution: '', degree: '', year: '' });
    setShowEducationForm(false);
  };

  const handleAddSpecialty = () => {
    if (newSpecialty && !specialties.includes(newSpecialty)) {
      setSpecialties([...specialties, newSpecialty]);
      setNewSpecialty('');
    }
  };

  const handleAddLanguage = () => {
    if (newLanguage && !languages.includes(newLanguage)) {
      setLanguages([...languages, newLanguage]);
      setNewLanguage('');
    }
  };

  const handleRemoveLicense = (id) => {
    setLicenses(licenses.filter(license => license.id !== id));
  };

  const handleRemoveEducation = (id) => {
    setEducation(education.filter(edu => edu.id !== id));
  };

  const handleRemoveSpecialty = (specialty) => {
    setSpecialties(specialties.filter(s => s !== specialty));
  };

  const handleRemoveLanguage = (language) => {
    setLanguages(languages.filter(l => l !== language));
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
        <h1 className="text-2xl font-semibold text-gray-900">Attorney Profile</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your professional information and account settings
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-6">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex flex-wrap">
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
                  activeTab === 'professional'
                    ? 'border-[#800000] text-[#800000]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm`}
                onClick={() => setActiveTab('professional')}
              >
                <HiOutlineBadgeCheck className="inline-block mr-2 h-5 w-5" />
                Professional Information
              </button>
              <button
                className={`${
                  activeTab === 'availability'
                    ? 'border-[#800000] text-[#800000]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm`}
                onClick={() => setActiveTab('availability')}
              >
                <HiOutlineClock className="inline-block mr-2 h-5 w-5" />
                Availability
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
                    <div className="mt-4 text-center">
                      <h2 className="text-lg font-semibold text-gray-900">
                        {formData.firstName} {formData.lastName}
                      </h2>
                      <p className="text-sm text-gray-500">{formData.title}</p>
                    </div>
                  </div>
                </div>
                <div className="md:flex-1">
                  <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          First Name
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Last Name
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Email
                        </label>
                        <div className="mt-1">
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Phone
                        </label>
                        <div className="mt-1">
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Office Phone
                        </label>
                        <div className="mt-1">
                          <input
                            type="tel"
                            name="officePhone"
                            value={formData.officePhone}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Address
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          City
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          State
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            name="state"
                            value={formData.state}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          ZIP Code
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            name="zipCode"
                            value={formData.zipCode}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Title
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Bar Number
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            name="barNumber"
                            value={formData.barNumber}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Practice Areas
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            name="practiceAreas"
                            value={formData.practiceAreas}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Firm Name
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            name="firmName"
                            value={formData.firmName}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Bio
                        </label>
                        <div className="mt-1">
                          <textarea
                            name="bio"
                            value={formData.bio}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                            rows="3"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Years of Experience
                        </label>
                        <div className="mt-1">
                          <input
                            type="number"
                            name="yearsOfExperience"
                            value={formData.yearsOfExperience}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Hourly Rate (ZAR)
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 sm:text-sm">R</span>
                          </div>
                          <input
                            type="number"
                            name="ratePerHour"
                            value={formData.ratePerHour}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="block w-full pl-7 pr-12 rounded-md border-gray-300 shadow-sm sm:text-sm"
                            placeholder="0.00"
                          />
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 sm:text-sm">/hr</span>
                          </div>
                        </div>
                      </div>
                      {isEditing && (
                        <div className="flex justify-end space-x-4">
                          <button
                            type="button"
                            onClick={() => setIsEditing(false)}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#800000] hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                          >
                            Save
                          </button>
                        </div>
                      )}
                      {!isEditing && (
                        <div className="flex justify-end">
                          <button
                            onClick={() => setIsEditing(true)}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#800000] hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                          >
                            Edit Profile
                          </button>
                        </div>
                      )}
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* Professional Information Tab */}
          {activeTab === 'professional' && (
            <div className="p-6">
              <div className="grid grid-cols-1 gap-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    License Information
                  </label>
                  <div className="mt-1">
                    {licenses.length === 0 && (
                      <p className="text-gray-500 text-sm">
                        No license information available. Add your first license.
                      </p>
                    )}
                    {licenses.map(license => (
                      <div
                        key={license.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-sm mb-4"
                      >
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {license.state} - {license.number}
                          </p>
                          <p className="text-xs text-gray-500">
                            {license.year} - {license.status}
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          <button
                            onClick={() => handleRemoveLicense(license.id)}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-600 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            title="Remove License"
                          >
                            <HiOutlineX className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                    {showLicenseForm && (
                      <div className="mt-4 p-4 bg-white rounded-lg shadow-sm">
                        <h3 className="text-sm font-medium text-gray-900 mb-2">
                          Add New License
                        </h3>
                        <form onSubmit={handleAddLicense}>
                          <div className="grid grid-cols-1 gap-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700">
                                State
                              </label>
                              <div className="mt-1">
                                <input
                                  type="text"
                                  name="state"
                                  value={newLicense.state}
                                  onChange={e => setNewLicense({ ...newLicense, state: e.target.value })}
                                  className="block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                                  required
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">
                                License Number
                              </label>
                              <div className="mt-1">
                                <input
                                  type="text"
                                  name="number"
                                  value={newLicense.number}
                                  onChange={e => setNewLicense({ ...newLicense, number: e.target.value })}
                                  className="block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                                  required
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">
                                Year Issued
                              </label>
                              <div className="mt-1">
                                <input
                                  type="number"
                                  name="year"
                                  value={newLicense.year}
                                  onChange={e => setNewLicense({ ...newLicense, year: e.target.value })}
                                  className="block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                                  required
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">
                                Status
                              </label>
                              <div className="mt-1">
                                <select
                                  name="status"
                                  value={newLicense.status}
                                  onChange={e => setNewLicense({ ...newLicense, status: e.target.value })}
                                  className="block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                                  required
                                >
                                  <option value="Active">Active</option>
                                  <option value="Inactive">Inactive</option>
                                  <option value="Suspended">Suspended</option>
                                </select>
                              </div>
                            </div>
                            <div className="flex justify-end">
                              <button
                                type="button"
                                onClick={() => setShowLicenseForm(false)}
                                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 mr-2"
                              >
                                Cancel
                              </button>
                              <button
                                type="submit"
                                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#800000] hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                              >
                                Add License
                              </button>
                            </div>
                          </div>
                        </form>
                      </div>
                    )}
                    {!showLicenseForm && (
                      <div className="mt-4">
                        <button
                          onClick={() => setShowLicenseForm(true)}
                          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#800000] hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                        >
                          <HiOutlinePlus className="h-5 w-5 mr-2" />
                          Add License
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Education Information
                  </label>
                  <div className="mt-1">
                    {education.length === 0 && (
                      <p className="text-gray-500 text-sm">
                        No education information available. Add your first degree.
                      </p>
                    )}
                    {education.map(edu => (
                      <div
                        key={edu.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-sm mb-4"
                      >
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {edu.degree} in {edu.fieldOfStudy}
                          </p>
                          <p className="text-xs text-gray-500">
                            {edu.institution} - {edu.year}
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          <button
                            onClick={() => handleRemoveEducation(edu.id)}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-600 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            title="Remove Education"
                          >
                            <HiOutlineX className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                    {showEducationForm && (
                      <div className="mt-4 p-4 bg-white rounded-lg shadow-sm">
                        <h3 className="text-sm font-medium text-gray-900 mb-2">
                          Add New Education
                        </h3>
                        <form onSubmit={handleAddEducation}>
                          <div className="grid grid-cols-1 gap-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700">
                                Institution
                              </label>
                              <div className="mt-1">
                                <input
                                  type="text"
                                  name="institution"
                                  value={newEducation.institution}
                                  onChange={e => setNewEducation({ ...newEducation, institution: e.target.value })}
                                  className="block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                                  required
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">
                                Degree
                              </label>
                              <div className="mt-1">
                                <input
                                  type="text"
                                  name="degree"
                                  value={newEducation.degree}
                                  onChange={e => setNewEducation({ ...newEducation, degree: e.target.value })}
                                  className="block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                                  required
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">
                                Year
                              </label>
                              <div className="mt-1">
                                <input
                                  type="number"
                                  name="year"
                                  value={newEducation.year}
                                  onChange={e => setNewEducation({ ...newEducation, year: e.target.value })}
                                  className="block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                                  required
                                />
                              </div>
                            </div>
                            <div className="flex justify-end">
                              <button
                                type="button"
                                onClick={() => setShowEducationForm(false)}
                                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 mr-2"
                              >
                                Cancel
                              </button>
                              <button
                                type="submit"
                                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#800000] hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                              >
                                Add Education
                              </button>
                            </div>
                          </div>
                        </form>
                      </div>
                    )}
                    {!showEducationForm && (
                      <div className="mt-4">
                        <button
                          onClick={() => setShowEducationForm(true)}
                          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#800000] hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                        >
                          <HiOutlinePlus className="h-5 w-5 mr-2" />
                          Add Education
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Specialty Information
                  </label>
                  <div className="mt-1">
                    {specialties.length === 0 && (
                      <p className="text-gray-500 text-sm">
                        No specialty information available. Add your first specialty.
                      </p>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {specialties.map(specialty => (
                        <span
                          key={specialty}
                          className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-gray-50 text-gray-700 border"
                        >
                          {specialty}
                          <button
                            onClick={() => handleRemoveSpecialty(specialty)}
                            className="ml-2 text-gray-400 hover:text-gray-500"
                            title="Remove Specialty"
                          >
                            <HiOutlineX className="w-4 h-4" />
                          </button>
                        </span>
                      ))}
                    </div>
                    {newSpecialty && !specialties.includes(newSpecialty) && (
                      <div className="mt-2">
                        <span className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-green-100 text-green-800">
                          {newSpecialty}
                        </span>
                      </div>
                    )}
                    <div className="mt-4">
                      <input
                        type="text"
                        value={newSpecialty}
                        onChange={e => setNewSpecialty(e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                        placeholder="Add new specialty"
                      />
                    </div>
                    <div className="mt-2 flex justify-end">
                      <button
                        onClick={handleAddSpecialty}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#800000] hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                      >
                        Add Specialty
                      </button>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Language Information
                  </label>
                  <div className="mt-1">
                    {languages.length === 0 && (
                      <p className="text-gray-500 text-sm">
                        No language information available. Add your first language.
                      </p>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {languages.map(language => (
                        <span
                          key={language}
                          className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-gray-50 text-gray-700 border"
                        >
                          {language}
                          <button
                            onClick={() => handleRemoveLanguage(language)}
                            className="ml-2 text-gray-400 hover:text-gray-500"
                            title="Remove Language"
                          >
                            <HiOutlineX className="w-4 h-4" />
                          </button>
                        </span>
                      ))}
                    </div>
                    {newLanguage && !languages.includes(newLanguage) && (
                      <div className="mt-2">
                        <span className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-green-100 text-green-800">
                          {newLanguage}
                        </span>
                      </div>
                    )}
                    <div className="mt-4">
                      <input
                        type="text"
                        value={newLanguage}
                        onChange={e => setNewLanguage(e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                        placeholder="Add new language"
                      />
                    </div>
                    <div className="mt-2 flex justify-end">
                      <button
                        onClick={handleAddLanguage}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#800000] hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                      >
                        Add Language
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Availability Tab */}
          {activeTab === 'availability' && (
            <div className="p-6">
              <div className="grid grid-cols-1 gap-y-6">
                {Object.entries(formData.availability).map(([day, { start, end, available }]) => (
                  <div key={day} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-sm">
                    <div>
                      <p className="text-sm font-medium text-gray-900 capitalize">
                        {day}
                      </p>
                      <p className="text-xs text-gray-500">
                        {start} - {end}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <button
                        onClick={() => handleAvailabilityChange(day, 'available')}
                        className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${available ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'} hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 ${available ? 'focus:ring-green-500' : 'focus:ring-red-500'}`}
                        title={available ? 'Mark as Unavailable' : 'Mark as Available'}
                      >
                        {available ? <HiOutlineCheck className="w-5 h-5" /> : <HiOutlineX className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Account & Security Tab */}
          {activeTab === 'security' && (
            <div className="p-6">
              <form onSubmit={handlePasswordChange}>
                <div className="grid grid-cols-1 gap-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Current Password
                    </label>
                    <div className="mt-1">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                        placeholder="Enter your current password"
                        required
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
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      New Password
                    </label>
                    <div className="mt-1">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                        placeholder="Enter a new password"
                        required
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
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Confirm New Password
                    </label>
                    <div className="mt-1">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                        placeholder="Confirm your new password"
                        required
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
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#800000] hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                    >
                      Change Password
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="p-6">
              <div className="grid grid-cols-1 gap-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">
                    Email Notifications
                  </h3>
                  <div className="flex flex-col space-y-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="emailNotifications"
                        checked={formData.emailNotifications}
                        onChange={handleCheckboxChange}
                        className="h-4 w-4 text-[#800000] border-gray-300 rounded focus:ring-[#800000]"
                      />
                      <label className="ml-3 block text-sm font-medium text-gray-700">
                        Receive email notifications for new messages and updates
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="smsNotifications"
                        checked={formData.smsNotifications}
                        onChange={handleCheckboxChange}
                        className="h-4 w-4 text-[#800000] border-gray-300 rounded focus:ring-[#800000]"
                      />
                      <label className="ml-3 block text-sm font-medium text-gray-700">
                        Receive SMS notifications for important alerts
                      </label>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">
                    Document Alerts
                  </h3>
                  <div className="flex flex-col space-y-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="documentAlerts"
                        checked={formData.documentAlerts}
                        onChange={handleCheckboxChange}
                        className="h-4 w-4 text-[#800000] border-gray-300 rounded focus:ring-[#800000]"
                      />
                      <label className="ml-3 block text-sm font-medium text-gray-700">
                        Receive alerts when documents are uploaded or updated
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="caseUpdates"
                        checked={formData.caseUpdates}
                        onChange={handleCheckboxChange}
                        className="h-4 w-4 text-[#800000] border-gray-300 rounded focus:ring-[#800000]"
                      />
                      <label className="ml-3 block text-sm font-medium text-gray-700">
                        Receive updates on case progress and milestones
                      </label>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">
                    Billing Alerts
                  </h3>
                  <div className="flex flex-col space-y-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="billingAlerts"
                        checked={formData.billingAlerts}
                        onChange={handleCheckboxChange}
                        className="h-4 w-4 text-[#800000] border-gray-300 rounded focus:ring-[#800000]"
                      />
                      <label className="ml-3 block text-sm font-medium text-gray-700">
                        Receive alerts for new invoices and payment confirmations
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="appointmentReminders"
                        checked={formData.appointmentReminders}
                        onChange={handleCheckboxChange}
                        className="h-4 w-4 text-[#800000] border-gray-300 rounded focus:ring-[#800000]"
                      />
                      <label className="ml-3 block text-sm font-medium text-gray-700">
                        Receive reminders for upcoming appointments and deadlines
                      </label>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">
                    Marketing Communications
                  </h3>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="marketingCommunications"
                      checked={formData.marketingCommunications}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 text-[#800000] border-gray-300 rounded focus:ring-[#800000]"
                    />
                    <label className="ml-3 block text-sm font-medium text-gray-700">
                      Receive updates and offers from our marketing team
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Account Activity Tab */}
          {activeTab === 'activity' && (
            <div className="p-6">
              <div className="grid grid-cols-1 gap-y-6">
                {userActivity.length === 0 && (
                  <p className="text-gray-500 text-sm">
                    No recent activity found for your account.
                  </p>
                )}
                {userActivity.map(activity => (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-sm"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {activity.description}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(activity.date).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      {getActivityIcon(activity.type)}
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

export default AttorneyProfilePage;
