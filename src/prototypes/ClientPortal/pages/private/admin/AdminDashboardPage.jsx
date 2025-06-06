import React, { useState, useEffect } from 'react';
import { 
  HiOutlineUsers, 
  HiOutlineDocumentText, 
  HiOutlineCash, 
  HiOutlineScale,
  HiOutlineChartBar,
  HiOutlineClock,
  HiOutlineCalendar,
  HiOutlineDocumentDuplicate,
  HiOutlineExclamation,
  HiOutlineOfficeBuilding,
  HiOutlineBriefcase,
  HiOutlineArrowUp,
  HiOutlineArrowDown
} from 'react-icons/hi';

const AdminDashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    attorneys: 0,
    clients: 0,
    cases: 0,
    revenue: 0,
    pendingInvoices: 0,
    documents: 0,
    upcomingEvents: 0
  });

  // Simulate data fetching
  useEffect(() => {
    const timer = setTimeout(() => {
      setStats({
        attorneys: 24,
        clients: 153,
        cases: 87,
        activeCases: 62,
        revenue: 1487500,
        pendingInvoices: 385000,
        documents: 1243,
        upcomingEvents: 18
      });
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Format currency (ZAR)
  // Update the formatCurrency function to abbreviate large numbers
  const formatCurrency = (amount) => {
    // For large numbers (millions or more), use abbreviated format
    if (amount >= 1000000) {
      return new Intl.NumberFormat('en-ZA', {
        style: 'currency',
        currency: 'ZAR',
        notation: 'compact',
        maximumFractionDigits: 1
      }).format(amount);
    }
    
    // For smaller numbers, use standard format with no decimal places for whole numbers
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Admin Dashboard</h1>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="py-4">
          {loading ? (
            <div className="animate-pulse">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="bg-gray-200 rounded-md p-3 h-12 w-12"></div>
                        <div className="ml-5 w-full">
                          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                          <div className="h-8 bg-gray-200 rounded w-3/4 mt-2"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-[#800000] bg-opacity-10 rounded-md p-3">
                        <HiOutlineBriefcase className="h-6 w-6 text-[#800000]" />
                      </div>
                      <div className="ml-5">
                        <p className="text-sm font-medium text-gray-500 truncate">Attorneys</p>
                        <p className="mt-1 text-3xl font-semibold text-gray-900">{stats.attorneys}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                        <HiOutlineUsers className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="ml-5">
                        <p className="text-sm font-medium text-gray-500 truncate">Clients</p>
                        <p className="mt-1 text-3xl font-semibold text-gray-900">{stats.clients}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                        <HiOutlineDocumentText className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="ml-5">
                        <p className="text-sm font-medium text-gray-500 truncate">Active Cases</p>
                        <p className="mt-1 text-3xl font-semibold text-gray-900">{stats.activeCases}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
                        <HiOutlineCash className="h-6 w-6 text-purple-600" />
                      </div>
                      <div className="ml-5">
                        <p className="text-sm font-medium text-gray-500 truncate">Revenue (MTD)</p>
                        <p className="mt-1 text-2xl md:text-3xl font-semibold text-gray-900 truncate">
                          {formatCurrency(stats.revenue)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Activity and Performance Section */}
              <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-5 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Firm Performance</h3>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center py-2">
                      <div className="w-36 text-sm font-medium text-gray-500">Case Resolution</div>
                      <div className="flex-1 flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '78%' }}></div>
                        </div>
                        <span className="ml-3 text-sm font-medium text-gray-700">78%</span>
                      </div>
                    </div>
                    <div className="flex items-center py-2">
                      <div className="w-36 text-sm font-medium text-gray-500">Client Satisfaction</div>
                      <div className="flex-1 flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '92%' }}></div>
                        </div>
                        <span className="ml-3 text-sm font-medium text-gray-700">92%</span>
                      </div>
                    </div>
                    <div className="flex items-center py-2">
                      <div className="w-36 text-sm font-medium text-gray-500">Billable Hours</div>
                      <div className="flex-1 flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-[#800000] h-2.5 rounded-full" style={{ width: '84%' }}></div>
                        </div>
                        <span className="ml-3 text-sm font-medium text-gray-700">84%</span>
                      </div>
                    </div>
                    <div className="flex items-center py-2">
                      <div className="w-36 text-sm font-medium text-gray-500">Collection Rate</div>
                      <div className="flex-1 flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: '76%' }}></div>
                        </div>
                        <span className="ml-3 text-sm font-medium text-gray-700">76%</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-5 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Financial Overview</h3>
                  </div>
                  <div className="p-5">
                    <div className="grid grid-cols-2 gap-5">
                      <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 bg-green-100 rounded-full p-2">
                            <HiOutlineArrowUp className="h-5 w-5 text-green-600" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                            <p className="text-xl font-semibold text-gray-900">{formatCurrency(stats.revenue)}</p>
                          </div>
                        </div>
                        <p className="mt-2 text-sm text-green-600">+8.2% from last month</p>
                      </div>
                      
                      <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 bg-yellow-100 rounded-full p-2">
                            <HiOutlineExclamation className="h-5 w-5 text-yellow-600" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-500">Pending Invoices</p>
                            <p className="text-xl font-semibold text-gray-900">{formatCurrency(stats.pendingInvoices)}</p>
                          </div>
                        </div>
                        <p className="mt-2 text-sm text-yellow-600">25 invoices pending</p>
                      </div>
                      
                      <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 bg-[#800000] bg-opacity-10 rounded-full p-2">
                            <HiOutlineClock className="h-5 w-5 text-[#800000]" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-500">Billable Hours</p>
                            <p className="text-xl font-semibold text-gray-900">1,846 hrs</p>
                          </div>
                        </div>
                        <p className="mt-2 text-sm text-[#800000]">This month</p>
                      </div>
                      
                      <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 bg-blue-100 rounded-full p-2">
                            <HiOutlineScale className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-500">Avg. Hourly Rate</p>
                            <p className="text-xl font-semibold text-gray-900">{formatCurrency(1250)}</p>
                          </div>
                        </div>
                        <p className="mt-2 text-sm text-blue-600">+R150 from last quarter</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity Section */}
              <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-3">
                <div className="col-span-2 bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-5 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Recent Activity</h3>
                    <button className="text-sm font-medium text-[#800000] hover:text-[#600000]">View all</button>
                  </div>
                  <div className="p-5">
                    <ul className="divide-y divide-gray-200">
                      <li className="py-3">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 bg-blue-100 rounded-full p-1">
                            <HiOutlineDocumentText className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="ml-4">
                            <p className="text-sm font-medium text-gray-900">New case opened: Smith v. Johnson & Co.</p>
                            <p className="text-sm text-gray-500">Assigned to: John Doe</p>
                            <p className="text-xs text-gray-400 mt-1">Today at 09:32</p>
                          </div>
                        </div>
                      </li>
                      <li className="py-3">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 bg-green-100 rounded-full p-1">
                            <HiOutlineCash className="h-5 w-5 text-green-600" />
                          </div>
                          <div className="ml-4">
                            <p className="text-sm font-medium text-gray-900">Invoice #INV-2023-045 paid</p>
                            <p className="text-sm text-gray-500">Amount: {formatCurrency(28500)}</p>
                            <p className="text-xs text-gray-400 mt-1">Yesterday at 15:47</p>
                          </div>
                        </div>
                      </li>
                      <li className="py-3">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 bg-[#800000] bg-opacity-10 rounded-full p-1">
                            <HiOutlineUsers className="h-5 w-5 text-[#800000]" />
                          </div>
                          <div className="ml-4">
                            <p className="text-sm font-medium text-gray-900">New client onboarded: Cape Tech Ventures</p>
                            <p className="text-sm text-gray-500">Client ID: CT-2023-042</p>
                            <p className="text-xs text-gray-400 mt-1">2 days ago</p>
                          </div>
                        </div>
                      </li>
                      <li className="py-3">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 bg-purple-100 rounded-full p-1">
                            <HiOutlineDocumentDuplicate className="h-5 w-5 text-purple-600" />
                          </div>
                          <div className="ml-4">
                            <p className="text-sm font-medium text-gray-900">Document template updated: Fee Agreement</p>
                            <p className="text-sm text-gray-500">Updated by: Sarah Adams</p>
                            <p className="text-xs text-gray-400 mt-1">3 days ago</p>
                          </div>
                        </div>
                      </li>
                      <li className="py-3">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 bg-yellow-100 rounded-full p-1">
                            <HiOutlineCalendar className="h-5 w-5 text-yellow-600" />
                          </div>
                          <div className="ml-4">
                            <p className="text-sm font-medium text-gray-900">Staff meeting scheduled</p>
                            <p className="text-sm text-gray-500">Date: June 10, 2023 at 14:00</p>
                            <p className="text-xs text-gray-400 mt-1">3 days ago</p>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-5 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Upcoming Events</h3>
                  </div>
                  <div className="p-5">
                    <ul className="divide-y divide-gray-200">
                      <li className="py-3">
                        <div className="flex items-center">
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-gray-900 truncate">Board Meeting</p>
                            <p className="text-sm text-gray-500">Tomorrow, 10:00 - 12:00</p>
                          </div>
                          <div>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              Management
                            </span>
                          </div>
                        </div>
                      </li>
                      <li className="py-3">
                        <div className="flex items-center">
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-gray-900 truncate">Smith v. Johnson Court Hearing</p>
                            <p className="text-sm text-gray-500">Jun 8, 14:30 - 16:30</p>
                          </div>
                          <div>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#800000] bg-opacity-10 text-[#800000]">
                              Court
                            </span>
                          </div>
                        </div>
                      </li>
                      <li className="py-3">
                        <div className="flex items-center">
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-gray-900 truncate">Staff Training: New Case Management System</p>
                            <p className="text-sm text-gray-500">Jun 12, 09:00 - 13:00</p>
                          </div>
                          <div>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Training
                            </span>
                          </div>
                        </div>
                      </li>
                      <li className="py-3">
                        <div className="flex items-center">
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-gray-900 truncate">Client Meeting: Stellenbosch Winery</p>
                            <p className="text-sm text-gray-500">Jun 15, 11:00 - 12:30</p>
                          </div>
                          <div>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              Client
                            </span>
                          </div>
                        </div>
                      </li>
                    </ul>
                    <div className="mt-5">
                      <button className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                        View All Events
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;