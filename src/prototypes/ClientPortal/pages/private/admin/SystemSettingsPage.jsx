import { useState, Fragment } from 'react';
import { 
  HiOutlineCog, 
  HiOutlineBell, 
  HiOutlineGlobe, 
  HiOutlineServer,
  HiOutlineDatabase,
  HiOutlineMail,
  HiOutlineDeviceMobile,
  HiOutlineCloudUpload,
  HiOutlineExclamation,
  HiOutlineRefresh,
  HiOutlineCheck,
  HiOutlineX,
  HiOutlineExclamationCircle,
  HiOutlineClipboardList,
  HiOutlineDocument,
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineLink,
  HiOutlineDocumentDownload,
  HiOutlineTrash
} from 'react-icons/hi';
import { Dialog, Transition, Switch, Tab } from '@headlessui/react';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const SystemSettingsPage = () => {
  // General Settings
  const [generalSettings, setGeneralSettings] = useState({
    firmName: 'Peterson & Smith Law Firm',
    businessHours: {
      monday: { start: '09:00', end: '17:00', closed: false },
      tuesday: { start: '09:00', end: '17:00', closed: false },
      wednesday: { start: '09:00', end: '17:00', closed: false },
      thursday: { start: '09:00', end: '17:00', closed: false },
      friday: { start: '09:00', end: '17:00', closed: false },
      saturday: { start: '09:00', end: '13:00', closed: true },
      sunday: { start: '09:00', end: '17:00', closed: true }
    },
    timezone: 'America/New_York',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h',
    language: 'en-US',
    currencyFormat: 'ZAR',
    fiscalYearStart: '01-01'
  });

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    appointmentReminders: true,
    reminderTiming: [24, 1], // hours before appointment
    documentNotifications: true,
    systemNotifications: true,
    billPaymentNotifications: true,
    marketingEmails: false
  });

  // Integration Settings
  const [integrationSettings, setIntegrationSettings] = useState({
    calendarIntegration: {
      enabled: true,
      provider: 'google',
      syncFrequency: 'hourly'
    },
    emailIntegration: {
      enabled: true,
      provider: 'microsoft365',
      syncFrequency: 'realtime'
    },
    documentStorage: {
      enabled: true,
      provider: 'onedrive',
      autosync: true
    },
    paymentProcessing: {
      enabled: true,
      provider: 'stripe',
      testMode: false
    },
    smsProvider: {
      enabled: false,
      provider: 'twilio',
      testMode: true
    }
  });

  // System Maintenance
  const [maintenanceSettings, setMaintenanceSettings] = useState({
    autoBackup: true,
    backupFrequency: 'daily',
    backupRetention: 30, // days
    backupLocation: 'cloud',
    autoUpdate: true,
    maintenanceWindow: {
      day: 'sunday',
      start: '01:00',
      end: '03:00'
    },
    logRetention: 90, // days
    autoCleanup: true
  });

  // Modal states
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [backupInProgress, setBackupInProgress] = useState(false);
  const [backupProgress, setBackupProgress] = useState(0);

  // Toast notification state
  const [toast, setToast] = useState(null);

  // Tabs
  const tabs = [
    { name: 'General', icon: HiOutlineCog },
    { name: 'Notifications', icon: HiOutlineBell },
    { name: 'Integrations', icon: HiOutlineLink },
    { name: 'Maintenance', icon: HiOutlineServer }
  ];

  // Recent backups (mock data)
  const recentBackups = [
    { id: 1, date: '2025-06-06 01:00:00', size: '1.2 GB', status: 'completed', location: 'Cloud Storage' },
    { id: 2, date: '2025-06-05 01:00:00', size: '1.1 GB', status: 'completed', location: 'Cloud Storage' },
    { id: 3, date: '2025-06-04 01:00:00', size: '1.1 GB', status: 'completed', location: 'Cloud Storage' },
    { id: 4, date: '2025-06-03 01:00:00', size: '1.0 GB', status: 'completed', location: 'Cloud Storage' },
    { id: 5, date: '2025-06-02 01:00:00', size: '1.0 GB', status: 'failed', location: 'Cloud Storage' }
  ];

  // Timezones
  const timezones = [
    { value: 'America/New_York', label: 'Eastern Time (ET)' },
    { value: 'America/Chicago', label: 'Central Time (CT)' },
    { value: 'America/Denver', label: 'Mountain Time (MT)' },
    { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
    { value: 'America/Anchorage', label: 'Alaska Time (AKT)' },
    { value: 'Pacific/Honolulu', label: 'Hawaii Time (HT)' }
  ];

  // Handler functions
  const handleGeneralSettingsChange = (field, value) => {
    setGeneralSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBusinessHoursChange = (day, field, value) => {
    setGeneralSettings(prev => ({
      ...prev,
      businessHours: {
        ...prev.businessHours,
        [day]: {
          ...prev.businessHours[day],
          [field]: value
        }
      }
    }));
  };

  const handleNotificationSettingsChange = (field, value) => {
    setNotificationSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleReminderTimingChange = (index, value) => {
    const newTimings = [...notificationSettings.reminderTiming];
    newTimings[index] = parseInt(value, 10);
    handleNotificationSettingsChange('reminderTiming', newTimings);
  };

  const handleIntegrationSettingChange = (category, field, value) => {
    setIntegrationSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
  };

  const handleMaintenanceSettingChange = (field, value) => {
    setMaintenanceSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleMaintenanceWindowChange = (field, value) => {
    setMaintenanceSettings(prev => ({
      ...prev,
      maintenanceWindow: {
        ...prev.maintenanceWindow,
        [field]: value
      }
    }));
  };

  const showConfirmation = (action) => {
    setConfirmAction(action);
    setShowConfirmModal(true);
  };

  const executeConfirmedAction = () => {
    switch (confirmAction) {
      case 'clearCache':
        console.log('Clearing system cache');
        // Simulate success
        alert('System cache cleared successfully');
        break;
      case 'resetSettings':
        console.log('Resetting to default settings');
        // Reset all settings
        // This is a simplified example - in a real app, you'd reset to default values
        alert('Settings reset to defaults');
        break;
      case 'purgeData':
        console.log('Purging temporary data');
        alert('Temporary data purged successfully');
        break;
      default:
        break;
    }
    setShowConfirmModal(false);
  };

  const startManualBackup = () => {
    setShowBackupModal(true);
    setBackupInProgress(true);
    setBackupProgress(0);

    // Simulate backup process
    const interval = setInterval(() => {
      setBackupProgress(prevProgress => {
        const newProgress = prevProgress + 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setBackupInProgress(false);
          }, 500);
          return 100;
        }
        return newProgress;
      });
    }, 500);
  };

  const cancelBackup = () => {
    // In a real app, you would need to cancel the actual backup process
    setBackupInProgress(false);
    setShowBackupModal(false);
    setBackupProgress(0);
  };

  const downloadBackup = (backupId) => {
    console.log(`Downloading backup with ID: ${backupId}`);
    alert(`Backup download started for backup #${backupId}`);
  };

  const deleteBackup = (backupId) => {
    console.log(`Deleting backup with ID: ${backupId}`);
    alert(`Backup #${backupId} deleted successfully`);
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">System Settings</h1>
            <p className="mt-1 text-sm text-gray-500">
              Configure general system settings, notifications, and integrations
            </p>
          </div>
        </div>

        <div className="mt-6">
          <Tab.Group>
            <Tab.List className="flex space-x-1 rounded-xl bg-blue-50 p-1">
              {tabs.map((tab) => (
                <Tab
                  key={tab.name}
                  className={({ selected }) =>
                    classNames(
                      'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                      'ring-white ring-opacity-60 ring-offset-2 ring-offset-[#800000] focus:outline-none focus:ring-2',
                      selected
                        ? 'bg-white shadow text-[#800000]'
                        : 'text-gray-600 hover:bg-white/[0.12] hover:text-[#800000]'
                    )
                  }
                >
                  <div className="flex items-center justify-center">
                    <tab.icon className="h-5 w-5 mr-2" />
                    {tab.name}
                  </div>
                </Tab>
              ))}
            </Tab.List>
            <Tab.Panels className="mt-6">
              {/* General Settings Tab */}
              <Tab.Panel>
                <div className="bg-white shadow rounded-lg overflow-hidden">
                  <div className="px-4 py-5 sm:px-6 flex items-center">
                    <HiOutlineCog className="h-6 w-6 text-[#800000] mr-3" />
                    <h3 className="text-lg leading-6 font-medium text-gray-900">General Settings</h3>
                  </div>
                  <div className="border-t border-gray-200 px-4 py-5 sm:p-6 space-y-6">
                    {/* Firm Name */}
                    <div>
                      <label htmlFor="firm-name" className="block text-sm font-medium text-gray-700">
                        Firm Name
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          id="firm-name"
                          value={generalSettings.firmName}
                          onChange={(e) => handleGeneralSettingsChange('firmName', e.target.value)}
                          className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>

                    {/* Business Hours */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Business Hours</h4>
                      <div className="space-y-3">
                        {Object.entries(generalSettings.businessHours).map(([day, hours]) => (
                          <div key={day} className="grid grid-cols-[120px_1fr_1fr_80px] gap-4 items-center">
                            <div className="text-sm capitalize">{day}</div>
                            <div>
                              <input
                                type="time"
                                value={hours.start}
                                onChange={(e) => handleBusinessHoursChange(day, 'start', e.target.value)}
                                disabled={hours.closed}
                                className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                              />
                            </div>
                            <div>
                              <input
                                type="time"
                                value={hours.end}
                                onChange={(e) => handleBusinessHoursChange(day, 'end', e.target.value)}
                                disabled={hours.closed}
                                className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                              />
                            </div>
                            <div className="flex items-center">
                              <input
                                id={`closed-${day}`}
                                type="checkbox"
                                checked={hours.closed}
                                onChange={(e) => handleBusinessHoursChange(day, 'closed', e.target.checked)}
                                className="focus:ring-[#800000] h-4 w-4 text-[#800000] border-gray-300 rounded"
                              />
                              <label htmlFor={`closed-${day}`} className="ml-2 text-sm text-gray-700">
                                Closed
                              </label>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Timezone */}
                    <div>
                      <label htmlFor="timezone" className="block text-sm font-medium text-gray-700">
                        Timezone
                      </label>
                      <div className="mt-1">
                        <select
                          id="timezone"
                          value={generalSettings.timezone}
                          onChange={(e) => handleGeneralSettingsChange('timezone', e.target.value)}
                          className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                        >
                          {timezones.map((tz) => (
                            <option key={tz.value} value={tz.value}>
                              {tz.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Date Format */}
                      <div>
                        <label htmlFor="date-format" className="block text-sm font-medium text-gray-700">
                          Date Format
                        </label>
                        <div className="mt-1">
                          <select
                            id="date-format"
                            value={generalSettings.dateFormat}
                            onChange={(e) => handleGeneralSettingsChange('dateFormat', e.target.value)}
                            className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                          >
                            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                          </select>
                        </div>
                      </div>

                      {/* Time Format */}
                      <div>
                        <label htmlFor="time-format" className="block text-sm font-medium text-gray-700">
                          Time Format
                        </label>
                        <div className="mt-1">
                          <select
                            id="time-format"
                            value={generalSettings.timeFormat}
                            onChange={(e) => handleGeneralSettingsChange('timeFormat', e.target.value)}
                            className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                          >
                            <option value="12h">12-hour (AM/PM)</option>
                            <option value="24h">24-hour</option>
                          </select>
                        </div>
                      </div>

                      {/* Language */}
                      <div>
                        <label htmlFor="language" className="block text-sm font-medium text-gray-700">
                          Language
                        </label>
                        <div className="mt-1">
                          <select
                            id="language"
                            value={generalSettings.language}
                            onChange={(e) => handleGeneralSettingsChange('language', e.target.value)}
                            className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                          >
                            <option value="en-US">English (US)</option>
                            <option value="en-GB">English (UK)</option>
                            <option value="es-ES">Spanish</option>
                            <option value="fr-FR">French</option>
                          </select>
                        </div>
                      </div>

                      {/* Currency Format */}
                      <div>
                        <label htmlFor="currency-format" className="block text-sm font-medium text-gray-700">
                          Currency Format
                        </label>
                        <div className="mt-1">
                          <select
                            id="currency-format"
                            value={generalSettings.currencyFormat}
                            onChange={(e) => handleGeneralSettingsChange('currencyFormat', e.target.value)}
                            className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                          >
                            <option value="ZAR">ZAR (R)</option>
                            <option value="USD">USD ($)</option>
                            <option value="EUR">EUR (€)</option>
                            <option value="GBP">GBP (£)</option>
                            <option value="CAD">CAD (C$)</option>
                          </select>
                        </div>
                      </div>

                      {/* Fiscal Year Start */}
                      <div>
                        <label htmlFor="fiscal-year-start" className="block text-sm font-medium text-gray-700">
                          Fiscal Year Start
                        </label>
                        <div className="mt-1">
                          <select
                            id="fiscal-year-start"
                            value={generalSettings.fiscalYearStart}
                            onChange={(e) => handleGeneralSettingsChange('fiscalYearStart', e.target.value)}
                            className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                          >
                            <option value="01-01">January 1</option>
                            <option value="04-01">April 1</option>
                            <option value="07-01">July 1</option>
                            <option value="10-01">October 1</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                    <button
                      type="button"
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#800000] hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </Tab.Panel>

              {/* Notifications Tab */}
              <Tab.Panel>
                <div className="bg-white shadow rounded-lg overflow-hidden">
                  <div className="px-4 py-5 sm:px-6 flex items-center">
                    <HiOutlineBell className="h-6 w-6 text-[#800000] mr-3" />
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Notification Settings</h3>
                  </div>
                  <div className="border-t border-gray-200 px-4 py-5 sm:p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Email Notifications */}
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="email-notifications"
                            type="checkbox"
                            checked={notificationSettings.emailNotifications}
                            onChange={(e) => handleNotificationSettingsChange('emailNotifications', e.target.checked)}
                            className="focus:ring-[#800000] h-4 w-4 text-[#800000] border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="email-notifications" className="font-medium text-gray-700">Email Notifications</label>
                          <p className="text-gray-500">Receive system notifications via email</p>
                        </div>
                      </div>

                      {/* SMS Notifications */}
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="sms-notifications"
                            type="checkbox"
                            checked={notificationSettings.smsNotifications}
                            onChange={(e) => handleNotificationSettingsChange('smsNotifications', e.target.checked)}
                            className="focus:ring-[#800000] h-4 w-4 text-[#800000] border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="sms-notifications" className="font-medium text-gray-700">SMS Notifications</label>
                          <p className="text-gray-500">Receive system notifications via text message</p>
                        </div>
                      </div>

                      {/* Appointment Reminders */}
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="appointment-reminders"
                            type="checkbox"
                            checked={notificationSettings.appointmentReminders}
                            onChange={(e) => handleNotificationSettingsChange('appointmentReminders', e.target.checked)}
                            className="focus:ring-[#800000] h-4 w-4 text-[#800000] border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="appointment-reminders" className="font-medium text-gray-700">Appointment Reminders</label>
                          <p className="text-gray-500">Send reminders for upcoming appointments</p>
                        </div>
                      </div>

                      {/* Document Notifications */}
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="document-notifications"
                            type="checkbox"
                            checked={notificationSettings.documentNotifications}
                            onChange={(e) => handleNotificationSettingsChange('documentNotifications', e.target.checked)}
                            className="focus:ring-[#800000] h-4 w-4 text-[#800000] border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="document-notifications" className="font-medium text-gray-700">Document Notifications</label>
                          <p className="text-gray-500">Notify when documents are uploaded or shared</p>
                        </div>
                      </div>

                      {/* System Notifications */}
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="system-notifications"
                            type="checkbox"
                            checked={notificationSettings.systemNotifications}
                            onChange={(e) => handleNotificationSettingsChange('systemNotifications', e.target.checked)}
                            className="focus:ring-[#800000] h-4 w-4 text-[#800000] border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="system-notifications" className="font-medium text-gray-700">System Notifications</label>
                          <p className="text-gray-500">Notifications about system updates and maintenance</p>
                        </div>
                      </div>

                      {/* Bill Payment Notifications */}
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="payment-notifications"
                            type="checkbox"
                            checked={notificationSettings.billPaymentNotifications}
                            onChange={(e) => handleNotificationSettingsChange('billPaymentNotifications', e.target.checked)}
                            className="focus:ring-[#800000] h-4 w-4 text-[#800000] border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="payment-notifications" className="font-medium text-gray-700">Bill Payment Notifications</label>
                          <p className="text-gray-500">Notifications about invoices and payments</p>
                        </div>
                      </div>

                      {/* Marketing Emails */}
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="marketing-emails"
                            type="checkbox"
                            checked={notificationSettings.marketingEmails}
                            onChange={(e) => handleNotificationSettingsChange('marketingEmails', e.target.checked)}
                            className="focus:ring-[#800000] h-4 w-4 text-[#800000] border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="marketing-emails" className="font-medium text-gray-700">Marketing Emails</label>
                          <p className="text-gray-500">Receive promotional emails and newsletters</p>
                        </div>
                      </div>
                    </div>

                    {/* Reminder Timing */}
                    <div className="mt-6">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Appointment Reminder Timing</h4>
                      <p className="text-sm text-gray-500 mb-4">When to send reminders before appointments</p>
                      
                      <div className="flex flex-wrap gap-4">
                        <div className="w-full sm:w-64">
                          <label htmlFor="reminder-timing-1" className="block text-sm font-medium text-gray-700">
                            First Reminder (hours before)
                          </label>
                          <select
                            id="reminder-timing-1"
                            value={notificationSettings.reminderTiming[0]}
                            onChange={(e) => handleReminderTimingChange(0, e.target.value)}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm rounded-md"
                            disabled={!notificationSettings.appointmentReminders}
                          >
                            <option value="1">1 hour</option>
                            <option value="2">2 hours</option>
                            <option value="4">4 hours</option>
                            <option value="12">12 hours</option>
                            <option value="24">24 hours</option>
                            <option value="48">48 hours</option>
                          </select>
                        </div>

                        <div className="w-full sm:w-64">
                          <label htmlFor="reminder-timing-2" className="block text-sm font-medium text-gray-700">
                            Second Reminder (hours before)
                          </label>
                          <select
                            id="reminder-timing-2"
                            value={notificationSettings.reminderTiming[1]}
                            onChange={(e) => handleReminderTimingChange(1, e.target.value)}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm rounded-md"
                            disabled={!notificationSettings.appointmentReminders}
                          >
                            <option value="0">No second reminder</option>
                            <option value="1">1 hour</option>
                            <option value="2">2 hours</option>
                            <option value="4">4 hours</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                    <button
                      type="button"
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#800000] hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </Tab.Panel>

              {/* Integrations Tab */}
              <Tab.Panel>
                <div className="bg-white shadow rounded-lg overflow-hidden">
                  <div className="px-4 py-5 sm:px-6 flex items-center">
                    <HiOutlineLink className="h-6 w-6 text-[#800000] mr-3" />
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Integrations</h3>
                  </div>
                  <div className="border-t border-gray-200 px-4 py-5 sm:p-6 space-y-10">
                    {/* Calendar Integration */}
                    <div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <HiOutlineCalendar className="h-8 w-8 text-gray-400 mr-3" />
                          <div>
                            <h4 className="text-lg font-medium text-gray-900">Calendar Integration</h4>
                            <p className="text-sm text-gray-500">Sync appointments with external calendar services</p>
                          </div>
                        </div>
                        <Switch
                          checked={integrationSettings.calendarIntegration.enabled}
                          onChange={(checked) => handleIntegrationSettingChange('calendarIntegration', 'enabled', checked)}
                          className={classNames(
                            integrationSettings.calendarIntegration.enabled ? 'bg-[#800000]' : 'bg-gray-200',
                            'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]'
                          )}
                        >
                          <span className="sr-only">Use calendar integration</span>
                          <span
                            aria-hidden="true"
                            className={classNames(
                              integrationSettings.calendarIntegration.enabled ? 'translate-x-5' : 'translate-x-0',
                              'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200'
                            )}
                          />
                        </Switch>
                      </div>

                      {integrationSettings.calendarIntegration.enabled && (
                        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label htmlFor="calendar-provider" className="block text-sm font-medium text-gray-700">
                              Calendar Provider
                            </label>
                            <select
                              id="calendar-provider"
                              value={integrationSettings.calendarIntegration.provider}
                              onChange={(e) => handleIntegrationSettingChange('calendarIntegration', 'provider', e.target.value)}
                              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm rounded-md"
                            >
                              <option value="google">Google Calendar</option>
                              <option value="outlook">Microsoft Outlook</option>
                              <option value="apple">Apple Calendar</option>
                            </select>
                          </div>

                          <div>
                            <label htmlFor="calendar-sync" className="block text-sm font-medium text-gray-700">
                              Sync Frequency
                            </label>
                            <select
                              id="calendar-sync"
                              value={integrationSettings.calendarIntegration.syncFrequency}
                              onChange={(e) => handleIntegrationSettingChange('calendarIntegration', 'syncFrequency', e.target.value)}
                              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm rounded-md"
                            >
                              <option value="realtime">Real-time</option>
                              <option value="hourly">Hourly</option>
                              <option value="daily">Daily</option>
                              <option value="manual">Manual only</option>
                            </select>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Email Integration */}
                    <div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <HiOutlineMail className="h-8 w-8 text-gray-400 mr-3" />
                          <div>
                            <h4 className="text-lg font-medium text-gray-900">Email Integration</h4>
                            <p className="text-sm text-gray-500">Connect with external email services</p>
                          </div>
                        </div>
                        <Switch
                          checked={integrationSettings.emailIntegration.enabled}
                          onChange={(checked) => handleIntegrationSettingChange('emailIntegration', 'enabled', checked)}
                          className={classNames(
                            integrationSettings.emailIntegration.enabled ? 'bg-[#800000]' : 'bg-gray-200',
                            'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]'
                          )}
                        >
                          <span className="sr-only">Use email integration</span>
                          <span
                            aria-hidden="true"
                            className={classNames(
                              integrationSettings.emailIntegration.enabled ? 'translate-x-5' : 'translate-x-0',
                              'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200'
                            )}
                          />
                        </Switch>
                      </div>

                      {integrationSettings.emailIntegration.enabled && (
                        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label htmlFor="email-provider" className="block text-sm font-medium text-gray-700">
                              Email Provider
                            </label>
                            <select
                              id="email-provider"
                              value={integrationSettings.emailIntegration.provider}
                              onChange={(e) => handleIntegrationSettingChange('emailIntegration', 'provider', e.target.value)}
                              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm rounded-md"
                            >
                              <option value="gmail">Gmail</option>
                              <option value="microsoft365">Microsoft 365</option>
                              <option value="exchange">Exchange Server</option>
                              <option value="smtp">Custom SMTP</option>
                            </select>
                          </div>

                          <div>
                            <label htmlFor="email-sync" className="block text-sm font-medium text-gray-700">
                              Sync Frequency
                            </label>
                            <select
                              id="email-sync"
                              value={integrationSettings.emailIntegration.syncFrequency}
                              onChange={(e) => handleIntegrationSettingChange('emailIntegration', 'syncFrequency', e.target.value)}
                              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm rounded-md"
                            >
                              <option value="realtime">Real-time</option>
                              <option value="hourly">Hourly</option>
                              <option value="daily">Daily</option>
                              <option value="manual">Manual only</option>
                            </select>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Document Storage Integration */}
                    <div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <HiOutlineDocument className="h-8 w-8 text-gray-400 mr-3" />
                          <div>
                            <h4 className="text-lg font-medium text-gray-900">Document Storage</h4>
                            <p className="text-sm text-gray-500">Connect with external document storage services</p>
                          </div>
                        </div>
                        <Switch
                          checked={integrationSettings.documentStorage.enabled}
                          onChange={(checked) => handleIntegrationSettingChange('documentStorage', 'enabled', checked)}
                          className={classNames(
                            integrationSettings.documentStorage.enabled ? 'bg-[#800000]' : 'bg-gray-200',
                            'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]'
                          )}
                        >
                          <span className="sr-only">Use document storage integration</span>
                          <span
                            aria-hidden="true"
                            className={classNames(
                              integrationSettings.documentStorage.enabled ? 'translate-x-5' : 'translate-x-0',
                              'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200'
                            )}
                          />
                        </Switch>
                      </div>

                      {integrationSettings.documentStorage.enabled && (
                        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label htmlFor="storage-provider" className="block text-sm font-medium text-gray-700">
                              Storage Provider
                            </label>
                            <select
                              id="storage-provider"
                              value={integrationSettings.documentStorage.provider}
                              onChange={(e) => handleIntegrationSettingChange('documentStorage', 'provider', e.target.value)}
                              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm rounded-md"
                            >
                              <option value="onedrive">Microsoft OneDrive</option>
                              <option value="gdrive">Google Drive</option>
                              <option value="dropbox">Dropbox</option>
                              <option value="s3">Amazon S3</option>
                            </select>
                          </div>

                          <div className="flex items-start pt-6">
                            <div className="flex items-center h-5">
                              <input
                                id="autosync-docs"
                                type="checkbox"
                                checked={integrationSettings.documentStorage.autosync}
                                onChange={(e) => handleIntegrationSettingChange('documentStorage', 'autosync', e.target.checked)}
                                className="focus:ring-[#800000] h-4 w-4 text-[#800000] border-gray-300 rounded"
                              />
                            </div>
                            <div className="ml-3 text-sm">
                              <label htmlFor="autosync-docs" className="font-medium text-gray-700">Auto-sync documents</label>
                              <p className="text-gray-500">Automatically sync documents with storage provider</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Payment Processing Integration */}
                    <div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <HiOutlineClipboardList className="h-8 w-8 text-gray-400 mr-3" />
                          <div>
                            <h4 className="text-lg font-medium text-gray-900">Payment Processing</h4>
                            <p className="text-sm text-gray-500">Connect with payment processing services</p>
                          </div>
                        </div>
                        <Switch
                          checked={integrationSettings.paymentProcessing.enabled}
                          onChange={(checked) => handleIntegrationSettingChange('paymentProcessing', 'enabled', checked)}
                          className={classNames(
                            integrationSettings.paymentProcessing.enabled ? 'bg-[#800000]' : 'bg-gray-200',
                            'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]'
                          )}
                        >
                          <span className="sr-only">Use payment processing integration</span>
                          <span
                            aria-hidden="true"
                            className={classNames(
                              integrationSettings.paymentProcessing.enabled ? 'translate-x-5' : 'translate-x-0',
                              'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200'
                            )}
                          />
                        </Switch>
                      </div>

                      {integrationSettings.paymentProcessing.enabled && (
                        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label htmlFor="payment-provider" className="block text-sm font-medium text-gray-700">
                              Payment Provider
                            </label>
                            <select
                              id="payment-provider"
                              value={integrationSettings.paymentProcessing.provider}
                              onChange={(e) => handleIntegrationSettingChange('paymentProcessing', 'provider', e.target.value)}
                              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm rounded-md"
                            >
                              <option value="stripe">Stripe</option>
                              <option value="paypal">PayPal</option>
                              <option value="square">Square</option>
                              <option value="authorize">Authorize.net</option>
                            </select>
                          </div>

                          <div className="flex items-start pt-6">
                            <div className="flex items-center h-5">
                              <input
                                id="test-mode"
                                type="checkbox"
                                checked={integrationSettings.paymentProcessing.testMode}
                                onChange={(e) => handleIntegrationSettingChange('paymentProcessing', 'testMode', e.target.checked)}
                                className="focus:ring-[#800000] h-4 w-4 text-[#800000] border-gray-300 rounded"
                              />
                            </div>
                            <div className="ml-3 text-sm">
                              <label htmlFor="test-mode" className="font-medium text-gray-700">Test Mode</label>
                              <p className="text-gray-500">Use test environment (no real transactions)</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* SMS Provider Integration */}
                    <div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <HiOutlineDeviceMobile className="h-8 w-8 text-gray-400 mr-3" />
                          <div>
                            <h4 className="text-lg font-medium text-gray-900">SMS Provider</h4>
                            <p className="text-sm text-gray-500">Connect with SMS messaging services</p>
                          </div>
                        </div>
                        <Switch
                          checked={integrationSettings.smsProvider.enabled}
                          onChange={(checked) => handleIntegrationSettingChange('smsProvider', 'enabled', checked)}
                          className={classNames(
                            integrationSettings.smsProvider.enabled ? 'bg-[#800000]' : 'bg-gray-200',
                            'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]'
                          )}
                        >
                          <span className="sr-only">Use SMS provider integration</span>
                          <span
                            aria-hidden="true"
                            className={classNames(
                              integrationSettings.smsProvider.enabled ? 'translate-x-5' : 'translate-x-0',
                              'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200'
                            )}
                          />
                        </Switch>
                      </div>

                      {integrationSettings.smsProvider.enabled && (
                        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label htmlFor="sms-provider" className="block text-sm font-medium text-gray-700">
                              SMS Provider
                            </label>
                            <select
                              id="sms-provider"
                              value={integrationSettings.smsProvider.provider}
                              onChange={(e) => handleIntegrationSettingChange('smsProvider', 'provider', e.target.value)}
                              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm rounded-md"
                            >
                              <option value="twilio">Twilio</option>
                              <option value="messagebird">MessageBird</option>
                              <option value="nexmo">Nexmo</option>
                            </select>
                          </div>

                          <div className="flex items-start pt-6">
                            <div className="flex items-center h-5">
                              <input
                                id="sms-test-mode"
                                type="checkbox"
                                checked={integrationSettings.smsProvider.testMode}
                                onChange={(e) => handleIntegrationSettingChange('smsProvider', 'testMode', e.target.checked)}
                                className="focus:ring-[#800000] h-4 w-4 text-[#800000] border-gray-300 rounded"
                              />
                            </div>
                            <div className="ml-3 text-sm">
                              <label htmlFor="sms-test-mode" className="font-medium text-gray-700">Test Mode</label>
                              <p className="text-gray-500">Use test environment (no real messages sent)</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                    <button
                      type="button"
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#800000] hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </Tab.Panel>

              {/* Maintenance Tab */}
              <Tab.Panel>
                <div className="bg-white shadow rounded-lg overflow-hidden">
                  <div className="px-4 py-5 sm:px-6 flex items-center">
                    <HiOutlineServer className="h-6 w-6 text-[#800000] mr-3" />
                    <h3 className="text-lg leading-6 font-medium text-gray-900">System Maintenance</h3>
                  </div>
                  <div className="border-t border-gray-200 px-4 py-5 sm:p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Auto Backup */}
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="auto-backup"
                            type="checkbox"
                            checked={maintenanceSettings.autoBackup}
                            onChange={(e) => handleMaintenanceSettingChange('autoBackup', e.target.checked)}
                            className="focus:ring-[#800000] h-4 w-4 text-[#800000] border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="auto-backup" className="font-medium text-gray-700">Automatic Backups</label>
                          <p className="text-gray-500">Automatically backup system data</p>
                        </div>
                      </div>

                      {/* Auto Update */}
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="auto-update"
                            type="checkbox"
                            checked={maintenanceSettings.autoUpdate}
                            onChange={(e) => handleMaintenanceSettingChange('autoUpdate', e.target.checked)}
                            className="focus:ring-[#800000] h-4 w-4 text-[#800000] border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="auto-update" className="font-medium text-gray-700">Automatic Updates</label>
                          <p className="text-gray-500">Automatically install system updates</p>
                        </div>
                      </div>

                      {/* Auto Cleanup */}
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="auto-cleanup"
                            type="checkbox"
                            checked={maintenanceSettings.autoCleanup}
                            onChange={(e) => handleMaintenanceSettingChange('autoCleanup', e.target.checked)}
                            className="focus:ring-[#800000] h-4 w-4 text-[#800000] border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="auto-cleanup" className="font-medium text-gray-700">Automatic Data Cleanup</label>
                          <p className="text-gray-500">Automatically remove temporary files and old logs</p>
                        </div>
                      </div>
                    </div>

                    {maintenanceSettings.autoBackup && (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label htmlFor="backup-frequency" className="block text-sm font-medium text-gray-700">
                              Backup Frequency
                            </label>
                            <select
                              id="backup-frequency"
                              value={maintenanceSettings.backupFrequency}
                              onChange={(e) => handleMaintenanceSettingChange('backupFrequency', e.target.value)}
                              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm rounded-md"
                            >
                              <option value="hourly">Hourly</option>
                              <option value="daily">Daily</option>
                              <option value="weekly">Weekly</option>
                              <option value="monthly">Monthly</option>
                            </select>
                          </div>

                          <div>
                            <label htmlFor="backup-retention" className="block text-sm font-medium text-gray-700">
                              Backup Retention (days)
                            </label>
                            <input
                              type="number"
                              min="1"
                              max="365"
                              id="backup-retention"
                              value={maintenanceSettings.backupRetention}
                              onChange={(e) => handleMaintenanceSettingChange('backupRetention', parseInt(e.target.value, 10))}
                              className="mt-1 shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                            />
                          </div>

                          <div>
                            <label htmlFor="backup-location" className="block text-sm font-medium text-gray-700">
                              Backup Location
                            </label>
                            <select
                              id="backup-location"
                              value={maintenanceSettings.backupLocation}
                              onChange={(e) => handleMaintenanceSettingChange('backupLocation', e.target.value)}
                              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm rounded-md"
                            >
                              <option value="local">Local Storage</option>
                              <option value="cloud">Cloud Storage</option>
                              <option value="both">Both Local and Cloud</option>
                            </select>
                          </div>
                        </div>
                      </>
                    )}

                    {maintenanceSettings.autoUpdate && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Maintenance Window</h4>
                        <p className="text-sm text-gray-500 mb-4">Schedule when updates and maintenance tasks can occur</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div>
                            <label htmlFor="maintenance-day" className="block text-sm font-medium text-gray-700">
                              Day
                            </label>
                            <select
                              id="maintenance-day"
                              value={maintenanceSettings.maintenanceWindow.day}
                              onChange={(e) => handleMaintenanceWindowChange('day', e.target.value)}
                              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm rounded-md"
                            >
                              <option value="monday">Monday</option>
                              <option value="tuesday">Tuesday</option>
                              <option value="wednesday">Wednesday</option>
                              <option value="thursday">Thursday</option>
                              <option value="friday">Friday</option>
                              <option value="saturday">Saturday</option>
                              <option value="sunday">Sunday</option>
                            </select>
                          </div>

                          <div>
                            <label htmlFor="maintenance-start" className="block text-sm font-medium text-gray-700">
                              Start Time
                            </label>
                            <input
                              type="time"
                              id="maintenance-start"
                              value={maintenanceSettings.maintenanceWindow.start}
                              onChange={(e) => handleMaintenanceWindowChange('start', e.target.value)}
                              className="mt-1 shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                            />
                          </div>

                          <div>
                            <label htmlFor="maintenance-end" className="block text-sm font-medium text-gray-700">
                              End Time
                            </label>
                            <input
                              type="time"
                              id="maintenance-end"
                              value={maintenanceSettings.maintenanceWindow.end}
                              onChange={(e) => handleMaintenanceWindowChange('end', e.target.value)}
                              className="mt-1 shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    <div>
                      <label htmlFor="log-retention" className="block text-sm font-medium text-gray-700">
                        System Log Retention (days)
                      </label>
                      <div className="mt-1">
                        <input
                          type="number"
                          min="1"
                          max="365"
                          id="log-retention"
                          value={maintenanceSettings.logRetention}
                          onChange={(e) => handleMaintenanceSettingChange('logRetention', parseInt(e.target.value, 10))}
                          className="shadow-sm focus:ring-[#800000] focus:border-[#800000] block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                      <p className="mt-2 text-sm text-gray-500">
                        System logs will be retained for {maintenanceSettings.logRetention} days
                      </p>
                    </div>

                    <div className="border-t border-gray-200 pt-6">
                      <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Maintenance Actions</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button
                          type="button"
                          onClick={() => showToast("Manual backup feature coming soon!", "success")}
                          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#800000] hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                        >
                          <HiOutlineCloudUpload className="-ml-1 mr-2 h-5 w-5" />
                          Start Manual Backup
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => showToast("Cache clearing feature coming soon!", "success")}
                          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                        >
                          <HiOutlineExclamation className="-ml-1 mr-2 h-5 w-5 text-gray-400" />
                          Clear System Cache
                        </button>

                        <button
                          type="button"
                          onClick={() => showToast("Reset settings feature coming soon!", "success")}
                          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                        >
                          <HiOutlineRefresh className="-ml-1 mr-2 h-5 w-5 text-gray-400" />
                          Reset to Default Settings
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                    <button
                      type="button"
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#800000] hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      </div>

      {/* Confirmation Modal */}
      <Transition.Root show={showConfirmModal} as={Fragment}>
        <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto" onClose={() => setShowConfirmModal(false)}>
          <div className="flex items-center justify-center min-h-screen px-4 py-12">
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

            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full">
                <div className="px-4 py-5 sm:px-6">
                  <div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Confirm Action</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Are you sure you want to proceed with this action? This cannot be undone.
                    </p>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#800000] text-base font-medium text-white hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000] sm:w-auto sm:text-sm"
                    onClick={executeConfirmedAction}
                  >
                    Confirm
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000] sm:mt-0 sm:w-auto sm:text-sm"
                    onClick={() => setShowConfirmModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Backup Progress Modal */}
      <Transition.Root show={showBackupModal} as={Fragment}>
        <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto" onClose={cancelBackup}>
          <div className="flex items-center justify-center min-h-screen px-4 py-12">
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

            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full">
                <div className="px-4 py-5 sm:px-6">
                  <div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Backup in Progress</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Your data is being backed up. This may take a few minutes.
                    </p>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#800000] text-base font-medium text-white hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                    onClick={cancelBackup}
                  >
                    Cancel Backup
                  </button>
                </div>

                {/* Backup progress indicator */}
                <div className="px-4 py-3">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-[#800000] h-2.5 rounded-full"
                      style={{ width: `${backupProgress}%` }}
                    />
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

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
    </div>
  );
};

export default SystemSettingsPage;
