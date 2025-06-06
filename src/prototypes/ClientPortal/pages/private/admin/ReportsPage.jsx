import { useState, useEffect } from 'react';
import {
  HiOutlineDocumentReport,
  HiOutlineChartBar,
  HiOutlineChartPie,
  HiOutlineClock,
  HiOutlineCurrencyDollar,
  HiOutlineCalendar,
  HiOutlineUserGroup,
  HiOutlineOfficeBuilding,
  HiOutlineDocumentText,
  HiOutlineDownload,
  HiOutlineFilter,
  HiOutlineSearch,
  HiOutlineExclamationCircle,
  HiOutlineCheckCircle,
  HiOutlineCog,
  HiOutlineTag,
} from 'react-icons/hi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const ReportsPage = () => {
  // State
  const [selectedReportType, setSelectedReportType] = useState('timeTracking');
  const [selectedTimeframe, setSelectedTimeframe] = useState('thisMonth');
  const [selectedClient, setSelectedClient] = useState('all');
  const [selectedStaffMember, setSelectedStaffMember] = useState('all');
  const [selectedActivity, setSelectedActivity] = useState('all');
  const [selectedFormat, setSelectedFormat] = useState('chart');
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data
  const clients = [
    { id: 'client1', name: 'Maropeng Holdings' },
    { id: 'client2', name: 'Thabo Mbekhi Foundation' },
    { id: 'client3', name: 'Ubuntu Technologies' },
    { id: 'client4', name: 'Ndlovu Family Trust' },
    { id: 'client5', name: 'Bongani Investments' },
  ];

  const staffMembers = [
    { id: 'staff1', name: 'Sipho Nkosi', role: 'Senior Partner', rate: 3500 },
    { id: 'staff2', name: 'Thandi Modise', role: 'Partner', rate: 2800 },
    { id: 'staff3', name: 'Nomsa Dlamini', role: 'Senior Associate', rate: 2200 },
    { id: 'staff4', name: 'Blessing Moyo', role: 'Associate', rate: 1800 },
    { id: 'staff5', name: 'Kagiso Tau', role: 'Junior Associate', rate: 1400 },
    { id: 'staff6', name: 'Zanele Mbeki', role: 'Paralegal', rate: 950 },
  ];

  const activityTypes = [
    { id: 'research', name: 'Legal Research', defaultRate: 1800 },
    { id: 'drafting', name: 'Document Drafting', defaultRate: 2200 },
    { id: 'clientMeeting', name: 'Client Meeting', defaultRate: 2500 },
    { id: 'courtAppearance', name: 'Court Appearance', defaultRate: 3000 },
    { id: 'phoneCall', name: 'Phone Consultation', defaultRate: 1500 },
    { id: 'negotiation', name: 'Negotiation', defaultRate: 2800 },
    { id: 'review', name: 'Document Review', defaultRate: 2000 },
    { id: 'travel', name: 'Travel Time', defaultRate: 1200 },
    { id: 'admin', name: 'Administrative Work', defaultRate: 900 },
  ];

  // Mock report generation
  useEffect(() => {
    if (isGeneratingReport) {
      setTimeout(() => {
        setReportData(generateMockData());
        setIsGeneratingReport(false);
      }, 1000);
    }
  }, [isGeneratingReport]);

  // Generate mock data based on report type
  const generateMockData = () => {
    switch (selectedReportType) {
      case 'timeTracking':
        return {
          title: 'Time Tracking Report',
          description: 'Overview of time spent on different activities',
          summary: {
            totalHours: 428,
            billableHours: 362,
            billablePercentage: 85,
            totalBilled: 837600,
          },
          chartData: [
            { name: 'Legal Research', hours: 85, amount: 153000 },
            { name: 'Document Drafting', hours: 120, amount: 264000 },
            { name: 'Client Meeting', hours: 62, amount: 155000 },
            { name: 'Court Appearance', hours: 36, amount: 108000 },
            { name: 'Phone Consultation', hours: 28, amount: 42000 },
            { name: 'Negotiation', hours: 45, amount: 126000 },
            { name: 'Document Review', hours: 32, amount: 64000 },
            { name: 'Travel Time', hours: 12, amount: 14400 },
            { name: 'Administrative Work', hours: 8, amount: 7200 },
          ],
          tableData: [
            { date: '2025-06-01', staff: 'Sipho Nkosi', client: 'Maropeng Holdings', activity: 'Legal Research', hours: 4, amount: 14000 },
            { date: '2025-06-01', staff: 'Thandi Modise', client: 'Ubuntu Technologies', activity: 'Client Meeting', hours: 2, amount: 5600 },
            { date: '2025-06-02', staff: 'Nomsa Dlamini', client: 'Thabo Mbekhi Foundation', activity: 'Document Drafting', hours: 5, amount: 11000 },
            { date: '2025-06-02', staff: 'Blessing Moyo', client: 'Ndlovu Family Trust', activity: 'Document Review', hours: 3, amount: 5400 },
            { date: '2025-06-03', staff: 'Kagiso Tau', client: 'Bongani Investments', activity: 'Negotiation', hours: 4, amount: 5600 },
            { date: '2025-06-03', staff: 'Zanele Mbeki', client: 'Maropeng Holdings', activity: 'Administrative Work', hours: 2, amount: 1900 },
            { date: '2025-06-04', staff: 'Sipho Nkosi', client: 'Ubuntu Technologies', activity: 'Court Appearance', hours: 6, amount: 21000 },
            { date: '2025-06-04', staff: 'Thandi Modise', client: 'Ndlovu Family Trust', activity: 'Phone Consultation', hours: 1, amount: 2800 },
            { date: '2025-06-05', staff: 'Nomsa Dlamini', client: 'Bongani Investments', activity: 'Document Drafting', hours: 4, amount: 8800 },
            { date: '2025-06-05', staff: 'Blessing Moyo', client: 'Thabo Mbekhi Foundation', activity: 'Legal Research', hours: 3, amount: 5400 },
          ],
        };
      case 'clientBilling':
        return {
          title: 'Client Billing Report',
          description: 'Overview of billing by client',
          summary: {
            totalClients: 5,
            totalHours: 428,
            averageHoursPerClient: 85.6,
            totalBilled: 837600,
          },
          chartData: [
            { name: 'Maropeng Holdings', hours: 120, amount: 264000 },
            { name: 'Thabo Mbekhi Foundation', hours: 85, amount: 153000 },
            { name: 'Ubuntu Technologies', hours: 98, amount: 186200 },
            { name: 'Ndlovu Family Trust', hours: 65, amount: 130000 },
            { name: 'Bongani Investments', hours: 60, amount: 104400 },
          ],
          tableData: [
            { client: 'Maropeng Holdings', caseCount: 4, totalHours: 120, billableHours: 110, billableAmount: 264000, avgHourlyRate: 2400 },
            { client: 'Thabo Mbekhi Foundation', caseCount: 2, totalHours: 85, billableHours: 78, billableAmount: 153000, avgHourlyRate: 1960 },
            { client: 'Ubuntu Technologies', caseCount: 3, totalHours: 98, billableHours: 86, billableAmount: 186200, avgHourlyRate: 2165 },
            { client: 'Ndlovu Family Trust', caseCount: 2, totalHours: 65, billableHours: 52, billableAmount: 130000, avgHourlyRate: 2500 },
            { client: 'Bongani Investments', caseCount: 3, totalHours: 60, billableHours: 36, billableAmount: 104400, avgHourlyRate: 2900 },
          ],
        };
      case 'staffPerformance':
        return {
          title: 'Staff Performance Report',
          description: 'Overview of staff billable hours and productivity',
          summary: {
            totalStaff: 6,
            totalHours: 428,
            averageUtilization: 72,
            totalBilled: 837600,
          },
          chartData: [
            { name: 'Sipho Nkosi', hours: 85, utilization: 83, amount: 297500 },
            { name: 'Thandi Modise', hours: 78, utilization: 76, amount: 218400 },
            { name: 'Nomsa Dlamini', hours: 82, utilization: 78, amount: 180400 },
            { name: 'Blessing Moyo', hours: 68, utilization: 64, amount: 122400 },
            { name: 'Kagiso Tau', hours: 65, utilization: 62, amount: 91000 },
            { name: 'Zanele Mbeki', hours: 50, utilization: 48, amount: 47500 },
          ],
          tableData: [
            { staff: 'Sipho Nkosi', role: 'Senior Partner', billableHours: 85, nonBillableHours: 15, utilizationRate: 83, totalAmount: 297500, realization: 96 },
            { staff: 'Thandi Modise', role: 'Partner', billableHours: 78, nonBillableHours: 22, utilizationRate: 76, totalAmount: 218400, realization: 92 },
            { staff: 'Nomsa Dlamini', role: 'Senior Associate', billableHours: 82, nonBillableHours: 18, utilizationRate: 78, totalAmount: 180400, realization: 94 },
            { staff: 'Blessing Moyo', role: 'Associate', billableHours: 68, nonBillableHours: 32, utilizationRate: 64, totalAmount: 122400, realization: 88 },
            { staff: 'Kagiso Tau', role: 'Junior Associate', billableHours: 65, nonBillableHours: 35, utilizationRate: 62, totalAmount: 91000, realization: 85 },
            { staff: 'Zanele Mbeki', role: 'Paralegal', billableHours: 50, nonBillableHours: 50, utilizationRate: 48, totalAmount: 47500, realization: 82 },
          ],
        };
      case 'activityAnalysis':
        return {
          title: 'Activity Analysis Report',
          description: 'Breakdown of time spent by activity type',
          summary: {
            totalActivities: 9,
            totalHours: 428,
            mostCommonActivity: 'Document Drafting',
            highestBillingActivity: 'Court Appearance',
          },
          chartData: [
            { name: 'Legal Research', hours: 85, amount: 153000, rate: 1800 },
            { name: 'Document Drafting', hours: 120, amount: 264000, rate: 2200 },
            { name: 'Client Meeting', hours: 62, amount: 155000, rate: 2500 },
            { name: 'Court Appearance', hours: 36, amount: 108000, rate: 3000 },
            { name: 'Phone Consultation', hours: 28, amount: 42000, rate: 1500 },
            { name: 'Negotiation', hours: 45, amount: 126000, rate: 2800 },
            { name: 'Document Review', hours: 32, amount: 64000, rate: 2000 },
            { name: 'Travel Time', hours: 12, amount: 14400, rate: 1200 },
            { name: 'Administrative Work', hours: 8, amount: 7200, rate: 900 },
          ],
          tableData: [
            { activity: 'Legal Research', count: 28, totalHours: 85, avgDuration: 3.0, totalAmount: 153000, avgRate: 1800 },
            { activity: 'Document Drafting', count: 42, totalHours: 120, avgDuration: 2.9, totalAmount: 264000, avgRate: 2200 },
            { activity: 'Client Meeting', count: 36, totalHours: 62, avgDuration: 1.7, totalAmount: 155000, avgRate: 2500 },
            { activity: 'Court Appearance', count: 12, totalHours: 36, avgDuration: 3.0, totalAmount: 108000, avgRate: 3000 },
            { activity: 'Phone Consultation', count: 32, totalHours: 28, avgDuration: 0.9, totalAmount: 42000, avgRate: 1500 },
            { activity: 'Negotiation', count: 18, totalHours: 45, avgDuration: 2.5, totalAmount: 126000, avgRate: 2800 },
            { activity: 'Document Review', count: 24, totalHours: 32, avgDuration: 1.3, totalAmount: 64000, avgRate: 2000 },
            { activity: 'Travel Time', count: 8, totalHours: 12, avgDuration: 1.5, totalAmount: 14400, avgRate: 1200 },
            { activity: 'Administrative Work', count: 10, totalHours: 8, avgDuration: 0.8, totalAmount: 7200, avgRate: 900 },
          ],
        };
      case 'revenueAnalysis':
        return {
          title: 'Revenue Analysis Report',
          description: 'Financial performance analysis by month',
          summary: {
            totalRevenue: 4825000,
            totalExpenses: 2985000,
            profitMargin: 38.1,
            revenueGrowth: 12.5,
          },
          chartData: [
            { name: 'January', revenue: 350000, expenses: 210000, profit: 140000 },
            { name: 'February', revenue: 385000, expenses: 225000, profit: 160000 },
            { name: 'March', revenue: 420000, expenses: 245000, profit: 175000 },
            { name: 'April', revenue: 395000, expenses: 240000, profit: 155000 },
            { name: 'May', revenue: 450000, expenses: 275000, profit: 175000 },
            { name: 'June', revenue: 475000, expenses: 290000, profit: 185000 },
            { name: 'July', revenue: 425000, expenses: 260000, profit: 165000 },
            { name: 'August', revenue: 410000, expenses: 250000, profit: 160000 },
            { name: 'September', revenue: 460000, expenses: 285000, profit: 175000 },
            { name: 'October', revenue: 490000, expenses: 300000, profit: 190000 },
            { name: 'November', revenue: 510000, expenses: 315000, profit: 195000 },
            { name: 'December', revenue: 425000, expenses: 255000, profit: 170000 },
          ],
          tableData: [
            { month: 'January', billableHours: 180, revenue: 350000, expenses: 210000, profit: 140000, margin: 40.0 },
            { month: 'February', billableHours: 195, revenue: 385000, expenses: 225000, profit: 160000, margin: 41.6 },
            { month: 'March', billableHours: 210, revenue: 420000, expenses: 245000, profit: 175000, margin: 41.7 },
            { month: 'April', billableHours: 200, revenue: 395000, expenses: 240000, profit: 155000, margin: 39.2 },
            { month: 'May', billableHours: 230, revenue: 450000, expenses: 275000, profit: 175000, margin: 38.9 },
            { month: 'June', billableHours: 240, revenue: 475000, expenses: 290000, profit: 185000, margin: 38.9 },
            { month: 'July', billableHours: 215, revenue: 425000, expenses: 260000, profit: 165000, margin: 38.8 },
            { month: 'August', billableHours: 205, revenue: 410000, expenses: 250000, profit: 160000, margin: 39.0 },
            { month: 'September', billableHours: 235, revenue: 460000, expenses: 285000, profit: 175000, margin: 38.0 },
            { month: 'October', billableHours: 245, revenue: 490000, expenses: 300000, profit: 190000, margin: 38.8 },
            { month: 'November', billableHours: 255, revenue: 510000, expenses: 315000, profit: 195000, margin: 38.2 },
            { month: 'December', billableHours: 215, revenue: 425000, expenses: 255000, profit: 170000, margin: 40.0 },
          ],
        };
      default:
        return null;
    }
  };

  // Helper functions
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatHours = (hours) => {
    return `${hours} hrs`;
  };

  const formatPercent = (value) => {
    return `${value}%`;
  };

  const getReportIcon = () => {
    switch (selectedReportType) {
      case 'timeTracking':
        return <HiOutlineClock className="h-8 w-8 text-[#800000]" />;
      case 'clientBilling':
        return <HiOutlineUserGroup className="h-8 w-8 text-[#800000]" />;
      case 'staffPerformance':
        return <HiOutlineOfficeBuilding className="h-8 w-8 text-[#800000]" />;
      case 'activityAnalysis':
        return <HiOutlineTag className="h-8 w-8 text-[#800000]" />;
      case 'revenueAnalysis':
        return <HiOutlineCurrencyDollar className="h-8 w-8 text-[#800000]" />;
      default:
        return <HiOutlineDocumentReport className="h-8 w-8 text-[#800000]" />;
    }
  };

  // Generate report
  const handleGenerateReport = () => {
    setIsGeneratingReport(true);
  };

  // Export report
  const handleExportReport = (format) => {
    alert(`Report would be exported as ${format.toUpperCase()} in a real application`);
  };

  // Filter table data based on search term
  const getFilteredTableData = () => {
    if (!reportData || !reportData.tableData || !searchTerm) {
      return reportData?.tableData || [];
    }

    const searchLower = searchTerm.toLowerCase();
    return reportData.tableData.filter(row => {
      return Object.values(row).some(value => {
        if (value === null || value === undefined) return false;
        return value.toString().toLowerCase().includes(searchLower);
      });
    });
  };

  // Get COLORS for charts
  const COLORS = ['#800000', '#9c2929', '#b85151', '#d47a7a', '#eaa3a3', '#8c6bb1', '#6baed6', '#74c476', '#fd8d3c', '#525252'];

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Reports</h1>
            <p className="mt-1 text-sm text-gray-500">
              Generate insights and analytics about your practice
            </p>
          </div>
        </div>

        {/* Report Configuration */}
        <div className="mt-6 bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Configure Report</h3>
            <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <label htmlFor="reportType" className="block text-sm font-medium text-gray-700">
                  Report Type
                </label>
                <select
                  id="reportType"
                  value={selectedReportType}
                  onChange={(e) => setSelectedReportType(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm rounded-md"
                >
                  <option value="timeTracking">Time Tracking</option>
                  <option value="clientBilling">Client Billing</option>
                  <option value="staffPerformance">Staff Performance</option>
                  <option value="activityAnalysis">Activity Analysis</option>
                  <option value="revenueAnalysis">Revenue Analysis</option>
                </select>
              </div>

              <div>
                <label htmlFor="timeframe" className="block text-sm font-medium text-gray-700">
                  Timeframe
                </label>
                <select
                  id="timeframe"
                  value={selectedTimeframe}
                  onChange={(e) => setSelectedTimeframe(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm rounded-md"
                >
                  <option value="thisWeek">This Week</option>
                  <option value="thisMonth">This Month</option>
                  <option value="lastMonth">Last Month</option>
                  <option value="thisQuarter">This Quarter</option>
                  <option value="thisYear">This Year</option>
                  <option value="lastYear">Last Year</option>
                  <option value="custom">Custom Range</option>
                </select>
              </div>

              <div>
                <label htmlFor="client" className="block text-sm font-medium text-gray-700">
                  Client
                </label>
                <select
                  id="client"
                  value={selectedClient}
                  onChange={(e) => setSelectedClient(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm rounded-md"
                >
                  <option value="all">All Clients</option>
                  {clients.map(client => (
                    <option key={client.id} value={client.id}>{client.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="staffMember" className="block text-sm font-medium text-gray-700">
                  Staff Member
                </label>
                <select
                  id="staffMember"
                  value={selectedStaffMember}
                  onChange={(e) => setSelectedStaffMember(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm rounded-md"
                >
                  <option value="all">All Staff</option>
                  {staffMembers.map(staff => (
                    <option key={staff.id} value={staff.id}>{staff.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="activity" className="block text-sm font-medium text-gray-700">
                  Activity Type
                </label>
                <select
                  id="activity"
                  value={selectedActivity}
                  onChange={(e) => setSelectedActivity(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm rounded-md"
                >
                  <option value="all">All Activities</option>
                  {activityTypes.map(type => (
                    <option key={type.id} value={type.id}>{type.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="format" className="block text-sm font-medium text-gray-700">
                  Display Format
                </label>
                <select
                  id="format"
                  value={selectedFormat}
                  onChange={(e) => setSelectedFormat(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm rounded-md"
                >
                  <option value="chart">Chart</option>
                  <option value="table">Table</option>
                  <option value="both">Both</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={handleGenerateReport}
                disabled={isGeneratingReport}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#800000] hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
              >
                {isGeneratingReport ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating Report...
                  </>
                ) : (
                  <>
                    <HiOutlineDocumentReport className="-ml-1 mr-2 h-5 w-5" />
                    Generate Report
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Report Results */}
        {reportData && (
          <div className="mt-8">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                <div className="flex items-center">
                  {getReportIcon()}
                  <div className="ml-3">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">{reportData.title}</h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">{reportData.description}</p>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => handleExportReport('pdf')}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                  >
                    <HiOutlineDownload className="-ml-0.5 mr-2 h-4 w-4" />
                    PDF
                  </button>
                  <button
                    type="button"
                    onClick={() => handleExportReport('excel')}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                  >
                    <HiOutlineDownload className="-ml-0.5 mr-2 h-4 w-4" />
                    Excel
                  </button>
                  <button
                    type="button"
                    onClick={() => handleExportReport('csv')}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                  >
                    <HiOutlineDownload className="-ml-0.5 mr-2 h-4 w-4" />
                    CSV
                  </button>
                </div>
              </div>

              {/* Report Summary Cards */}
              <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  {selectedReportType === 'timeTracking' && (
                    <>
                      <div className="bg-white overflow-hidden shadow rounded-lg border">
                        <div className="px-4 py-5 sm:p-6">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 bg-[#800000] rounded-md p-3">
                              <HiOutlineClock className="h-6 w-6 text-white" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                              <dl>
                                <dt className="text-sm font-medium text-gray-500 truncate">Total Hours</dt>
                                <dd className="flex items-baseline">
                                  <div className="text-2xl font-semibold text-gray-900">
                                    {formatHours(reportData.summary.totalHours)}
                                  </div>
                                </dd>
                              </dl>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white overflow-hidden shadow rounded-lg border">
                        <div className="px-4 py-5 sm:p-6">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                              <HiOutlineCheckCircle className="h-6 w-6 text-white" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                              <dl>
                                <dt className="text-sm font-medium text-gray-500 truncate">Billable Hours</dt>
                                <dd className="flex items-baseline">
                                  <div className="text-2xl font-semibold text-gray-900">
                                    {formatHours(reportData.summary.billableHours)}
                                  </div>
                                </dd>
                              </dl>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white overflow-hidden shadow rounded-lg border">
                        <div className="px-4 py-5 sm:p-6">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                              <HiOutlineChartPie className="h-6 w-6 text-white" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                              <dl>
                                <dt className="text-sm font-medium text-gray-500 truncate">Billable Percentage</dt>
                                <dd className="flex items-baseline">
                                  <div className="text-2xl font-semibold text-gray-900">
                                    {formatPercent(reportData.summary.billablePercentage)}
                                  </div>
                                </dd>
                              </dl>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white overflow-hidden shadow rounded-lg border">
                        <div className="px-4 py-5 sm:p-6">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                              <HiOutlineCurrencyDollar className="h-6 w-6 text-white" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                              <dl>
                                <dt className="text-sm font-medium text-gray-500 truncate">Total Billed</dt>
                                <dd className="flex items-baseline">
                                  <div className="text-2xl font-semibold text-gray-900">
                                    {formatCurrency(reportData.summary.totalBilled)}
                                  </div>
                                </dd>
                              </dl>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {selectedReportType === 'clientBilling' && (
                    <>
                      <div className="bg-white overflow-hidden shadow rounded-lg border">
                        <div className="px-4 py-5 sm:p-6">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 bg-[#800000] rounded-md p-3">
                              <HiOutlineUserGroup className="h-6 w-6 text-white" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                              <dl>
                                <dt className="text-sm font-medium text-gray-500 truncate">Total Clients</dt>
                                <dd className="flex items-baseline">
                                  <div className="text-2xl font-semibold text-gray-900">
                                    {reportData.summary.totalClients}
                                  </div>
                                </dd>
                              </dl>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white overflow-hidden shadow rounded-lg border">
                        <div className="px-4 py-5 sm:p-6">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                              <HiOutlineClock className="h-6 w-6 text-white" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                              <dl>
                                <dt className="text-sm font-medium text-gray-500 truncate">Total Hours</dt>
                                <dd className="flex items-baseline">
                                  <div className="text-2xl font-semibold text-gray-900">
                                    {formatHours(reportData.summary.totalHours)}
                                  </div>
                                </dd>
                              </dl>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white overflow-hidden shadow rounded-lg border">
                        <div className="px-4 py-5 sm:p-6">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                              <HiOutlineChartBar className="h-6 w-6 text-white" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                              <dl>
                                <dt className="text-sm font-medium text-gray-500 truncate">Avg Hours/Client</dt>
                                <dd className="flex items-baseline">
                                  <div className="text-2xl font-semibold text-gray-900">
                                    {reportData.summary.averageHoursPerClient.toFixed(1)}
                                  </div>
                                </dd>
                              </dl>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white overflow-hidden shadow rounded-lg border">
                        <div className="px-4 py-5 sm:p-6">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                              <HiOutlineCurrencyDollar className="h-6 w-6 text-white" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                              <dl>
                                <dt className="text-sm font-medium text-gray-500 truncate">Total Billed</dt>
                                <dd className="flex items-baseline">
                                  <div className="text-2xl font-semibold text-gray-900">
                                    {formatCurrency(reportData.summary.totalBilled)}
                                  </div>
                                </dd>
                              </dl>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {selectedReportType === 'staffPerformance' && (
                    <>
                      <div className="bg-white overflow-hidden shadow rounded-lg border">
                        <div className="px-4 py-5 sm:p-6">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 bg-[#800000] rounded-md p-3">
                              <HiOutlineOfficeBuilding className="h-6 w-6 text-white" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                              <dl>
                                <dt className="text-sm font-medium text-gray-500 truncate">Total Staff</dt>
                                <dd className="flex items-baseline">
                                  <div className="text-2xl font-semibold text-gray-900">
                                    {reportData.summary.totalStaff}
                                  </div>
                                </dd>
                              </dl>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white overflow-hidden shadow rounded-lg border">
                        <div className="px-4 py-5 sm:p-6">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                              <HiOutlineClock className="h-6 w-6 text-white" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                              <dl>
                                <dt className="text-sm font-medium text-gray-500 truncate">Total Hours</dt>
                                <dd className="flex items-baseline">
                                  <div className="text-2xl font-semibold text-gray-900">
                                    {formatHours(reportData.summary.totalHours)}
                                  </div>
                                </dd>
                              </dl>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white overflow-hidden shadow rounded-lg border">
                        <div className="px-4 py-5 sm:p-6">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                              <HiOutlineChartBar className="h-6 w-6 text-white" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                              <dl>
                                <dt className="text-sm font-medium text-gray-500 truncate">Avg Utilization</dt>
                                <dd className="flex items-baseline">
                                  <div className="text-2xl font-semibold text-gray-900">
                                    {formatPercent(reportData.summary.averageUtilization)}
                                  </div>
                                </dd>
                              </dl>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white overflow-hidden shadow rounded-lg border">
                        <div className="px-4 py-5 sm:p-6">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                              <HiOutlineCurrencyDollar className="h-6 w-6 text-white" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                              <dl>
                                <dt className="text-sm font-medium text-gray-500 truncate">Total Billed</dt>
                                <dd className="flex items-baseline">
                                  <div className="text-2xl font-semibold text-gray-900">
                                    {formatCurrency(reportData.summary.totalBilled)}
                                  </div>
                                </dd>
                              </dl>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {selectedReportType === 'activityAnalysis' && (
                    <>
                      <div className="bg-white overflow-hidden shadow rounded-lg border">
                        <div className="px-4 py-5 sm:p-6">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 bg-[#800000] rounded-md p-3">
                              <HiOutlineTag className="h-6 w-6 text-white" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                              <dl>
                                <dt className="text-sm font-medium text-gray-500 truncate">Activity Types</dt>
                                <dd className="flex items-baseline">
                                  <div className="text-2xl font-semibold text-gray-900">
                                    {reportData.summary.totalActivities}
                                  </div>
                                </dd>
                              </dl>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white overflow-hidden shadow rounded-lg border">
                        <div className="px-4 py-5 sm:p-6">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                              <HiOutlineClock className="h-6 w-6 text-white" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                              <dl>
                                <dt className="text-sm font-medium text-gray-500 truncate">Total Hours</dt>
                                <dd className="flex items-baseline">
                                  <div className="text-2xl font-semibold text-gray-900">
                                    {formatHours(reportData.summary.totalHours)}
                                  </div>
                                </dd>
                              </dl>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white overflow-hidden shadow rounded-lg border">
                        <div className="px-4 py-5 sm:p-6">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                              <HiOutlineDocumentText className="h-6 w-6 text-white" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                              <dl>
                                <dt className="text-sm font-medium text-gray-500 truncate">Most Common</dt>
                                <dd className="flex items-baseline">
                                  <div className="text-xl font-semibold text-gray-900 truncate">
                                    {reportData.summary.mostCommonActivity}
                                  </div>
                                </dd>
                              </dl>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white overflow-hidden shadow rounded-lg border">
                        <div className="px-4 py-5 sm:p-6">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                              <HiOutlineCurrencyDollar className="h-6 w-6 text-white" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                              <dl>
                                <dt className="text-sm font-medium text-gray-500 truncate">Highest Billing</dt>
                                <dd className="flex items-baseline">
                                  <div className="text-xl font-semibold text-gray-900 truncate">
                                    {reportData.summary.highestBillingActivity}
                                  </div>
                                </dd>
                              </dl>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {selectedReportType === 'revenueAnalysis' && (
                    <>
                      <div className="bg-white overflow-hidden shadow rounded-lg border">
                        <div className="px-4 py-5 sm:p-6">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 bg-[#800000] rounded-md p-3">
                              <HiOutlineCurrencyDollar className="h-6 w-6 text-white" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                              <dl>
                                <dt className="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
                                <dd className="flex items-baseline">
                                  <div className="text-2xl font-semibold text-gray-900">
                                    {formatCurrency(reportData.summary.totalRevenue)}
                                  </div>
                                </dd>
                              </dl>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white overflow-hidden shadow rounded-lg border">
                        <div className="px-4 py-5 sm:p-6">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 bg-red-500 rounded-md p-3">
                              <HiOutlineExclamationCircle className="h-6 w-6 text-white" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                              <dl>
                                <dt className="text-sm font-medium text-gray-500 truncate">Total Expenses</dt>
                                <dd className="flex items-baseline">
                                  <div className="text-2xl font-semibold text-gray-900">
                                    {formatCurrency(reportData.summary.totalExpenses)}
                                  </div>
                                </dd>
                              </dl>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white overflow-hidden shadow rounded-lg border">
                        <div className="px-4 py-5 sm:p-6">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                              <HiOutlineChartPie className="h-6 w-6 text-white" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                              <dl>
                                <dt className="text-sm font-medium text-gray-500 truncate">Profit Margin</dt>
                                <dd className="flex items-baseline">
                                  <div className="text-2xl font-semibold text-gray-900">
                                    {formatPercent(reportData.summary.profitMargin)}
                                  </div>
                                </dd>
                              </dl>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white overflow-hidden shadow rounded-lg border">
                        <div className="px-4 py-5 sm:p-6">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                              <HiOutlineChartBar className="h-6 w-6 text-white" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                              <dl>
                                <dt className="text-sm font-medium text-gray-500 truncate">YoY Growth</dt>
                                <dd className="flex items-baseline">
                                  <div className="text-2xl font-semibold text-gray-900">
                                    {formatPercent(reportData.summary.revenueGrowth)}
                                  </div>
                                </dd>
                              </dl>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Chart or Table based on selectedFormat */}
              {(selectedFormat === 'chart' || selectedFormat === 'both') && (
                <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    {selectedReportType === 'timeTracking' && 'Time Tracking by Activity'}
                    {selectedReportType === 'clientBilling' && 'Client Billing Analysis'}
                    {selectedReportType === 'staffPerformance' && 'Staff Performance Metrics'}
                    {selectedReportType === 'activityAnalysis' && 'Activity Distribution'}
                    {selectedReportType === 'revenueAnalysis' && 'Revenue and Profit Trends'}
                  </h3>

                  <div className="mt-4" style={{ height: 400 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      {selectedReportType === 'timeTracking' && (
                        <BarChart
                          data={reportData.chartData}
                          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                          <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                          <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                          <Tooltip formatter={(value, name) => {
                            if (name === 'hours') return [`${value} hrs`, 'Hours'];
                            if (name === 'amount') return [formatCurrency(value), 'Amount'];
                            return [value, name];
                          }} />
                          <Legend />
                          <Bar yAxisId="left" dataKey="hours" name="Hours" fill="#8884d8" />
                          <Bar yAxisId="right" dataKey="amount" name="Amount" fill="#82ca9d" />
                        </BarChart>
                      )}

                      {selectedReportType === 'clientBilling' && (
                        <BarChart
                          data={reportData.chartData}
                          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                          <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                          <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                          <Tooltip formatter={(value, name) => {
                            if (name === 'hours') return [`${value} hrs`, 'Hours'];
                            if (name === 'amount') return [formatCurrency(value), 'Amount'];
                            return [value, name];
                          }} />
                          <Legend />
                          <Bar yAxisId="left" dataKey="hours" name="Hours" fill="#8884d8" />
                          <Bar yAxisId="right" dataKey="amount" name="Amount" fill="#82ca9d" />
                        </BarChart>
                      )}

                      {selectedReportType === 'staffPerformance' && (
                        <BarChart
                          data={reportData.chartData}
                          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                          <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                          <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                          <Tooltip formatter={(value, name) => {
                            if (name === 'hours') return [`${value} hrs`, 'Hours'];
                            if (name === 'utilization') return [`${value}%`, 'Utilization'];
                            if (name === 'amount') return [formatCurrency(value), 'Amount'];
                            return [value, name];
                          }} />
                          <Legend />
                          <Bar yAxisId="left" dataKey="hours" name="Hours" fill="#8884d8" />
                          <Bar yAxisId="left" dataKey="utilization" name="Utilization (%)" fill="#82ca9d" />
                        </BarChart>
                      )}

                      {selectedReportType === 'activityAnalysis' && (
                        <PieChart>
                          <Pie
                            data={reportData.chartData}
                            cx="50%"
                            cy="50%"
                            labelLine={true}
                            outerRadius={150}
                            fill="#8884d8"
                            dataKey="hours"
                            nameKey="name"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {reportData.chartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value, name, props) => {
                            if (name === 'hours') return [`${value} hrs`, 'Hours'];
                            return [value, name];
                          }} />
                        </PieChart>
                      )}

                      {selectedReportType === 'revenueAnalysis' && (
                        <BarChart
                          data={reportData.chartData}
                          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                          <YAxis />
                          <Tooltip formatter={(value) => [formatCurrency(value), '']} />
                          <Legend />
                          <Bar dataKey="revenue" name="Revenue" fill="#8884d8" />
                          <Bar dataKey="expenses" name="Expenses" fill="#82ca9d" />
                          <Bar dataKey="profit" name="Profit" fill="#ffc658" />
                        </BarChart>
                      )}
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* Table data */}
              {(selectedFormat === 'table' || selectedFormat === 'both') && (
                <div className="border-t border-gray-200">
                  <div className="px-4 py-3 sm:px-6 flex items-center justify-between">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Detailed Data
                    </h3>
                    <div className="relative max-w-xs">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <HiOutlineSearch className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-[#800000] focus:border-[#800000] sm:text-sm"
                        placeholder="Search..."
                      />
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          {selectedReportType === 'timeTracking' && (
                            <>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activity</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hours</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                            </>
                          )}
                          
                          {selectedReportType === 'clientBilling' && (
                            <>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cases</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Hours</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Billable Hours</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Billed</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg. Hourly Rate</th>
                            </>
                          )}

                          {selectedReportType === 'staffPerformance' && (
                            <>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Billable Hours</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Non-Billable Hours</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utilization Rate</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Realization Rate</th>
                            </>
                          )}

                          {selectedReportType === 'activityAnalysis' && (
                            <>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activity</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Count</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Hours</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg. Duration</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Billed</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg. Hourly Rate</th>
                            </>
                          )}

                          {selectedReportType === 'revenueAnalysis' && (
                            <>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Billable Hours</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expenses</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profit</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Margin</th>
                            </>
                          )}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {getFilteredTableData().map((row, idx) => (
                          <tr key={idx}>
                            {selectedReportType === 'timeTracking' && (
                              <>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.date}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.staff}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.client}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.activity}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatHours(row.hours)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(row.amount)}</td>
                              </>
                            )}

                            {selectedReportType === 'clientBilling' && (
                              <>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.client}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.caseCount}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatHours(row.totalHours)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatHours(row.billableHours)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(row.billableAmount)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(row.avgHourlyRate)}</td>
                              </>
                            )}

                            {selectedReportType === 'staffPerformance' && (
                              <>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.staff}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.role}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatHours(row.billableHours)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatHours(row.nonBillableHours)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatPercent(row.utilizationRate)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(row.totalAmount)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatPercent(row.realization)}</td>
                              </>
                            )}

                            {selectedReportType === 'activityAnalysis' && (
                              <>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.activity}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.count}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatHours(row.totalHours)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.avgDuration} hrs</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(row.totalAmount)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(row.avgRate)}</td>
                              </>
                            )}

                            {selectedReportType === 'revenueAnalysis' && (
                              <>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.month}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatHours(row.billableHours)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(row.revenue)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(row.expenses)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(row.profit)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.margin}%</td>
                              </>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ReportsPage
