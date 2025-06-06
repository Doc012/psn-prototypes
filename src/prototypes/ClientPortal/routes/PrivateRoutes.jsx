import React from 'react';
import { Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Import role-specific layouts
import ClientLayout from '../components/layouts/client/ClientLayout';
// Other layouts will be added as they're created
// import AttorneyLayout from '../components/layouts/attorney/AttorneyLayout';
// import AdminLayout from '../components/layouts/admin/AdminLayout';

// Import client pages
import ClientDashboardPage from '../pages/private/client/ClientDashboardPage';
import ClientCasesPage from '../pages/private/client/ClientCasesPage';
import ClientDocumentsPage from '../pages/private/client/ClientDocumentsPage';
import ClientProfilePage from '../pages/private/client/ClientProfilePage';
import ClientSupportPage from '../pages/private/client/ClientSupportPage';
import InvoicesPage from '../pages/private/client/InvoicesPage';
// ... other client pages

// Import attorney pages 
import AttorneyDashboardPage from '../pages/private/attorney/AttorneyDashboardPage';
import AttorneyDocumentsPage from '../pages/private/attorney/AttorneyDocumentsPage';
import AttorneyMessagesPage from '../pages/private/attorney/AttorneyMessagesPage';
import AttorneyCalendarPage from '../pages/private/attorney/AttorneyCalendarPage';
// ... other attorney pages

// Import admin pages (to be implemented)
// import AdminDashboardPage from '../pages/private/admin/AdminDashboardPage';
// ... other admin pages

// Protected route wrapper component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, userRole, isLoading } = useAuth();
  const location = useLocation();

  // Show loading state if auth is still being checked
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  // Check if user is authenticated and has an allowed role
  if (!user || (allowedRoles.length > 0 && !allowedRoles.includes(userRole))) {
    // Redirect to login with a return path
    return <Navigate to="/client-portal/login" state={{ from: location }} replace />;
  }

  return children;
};

// Layout wrapper for attorney routes
const AttorneyLayout = () => {
  return (
    <div className="attorney-layout">
      {/* Here you would include your actual attorney layout components */}
      <div className="min-h-screen bg-gray-100">
        {/* Navigation would go here */}
        <main className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

const PrivateRoutes = () => {
  const { userRole } = useAuth();

  console.log("Current user role in PrivateRoutes:", userRole); // Debugging

  return (
    <Routes>
      {/* Client Routes */}
      {userRole === 'client' && (
        <Route 
          path="/" 
          element={
            <ProtectedRoute allowedRoles={['client']}>
              <ClientLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<ClientDashboardPage />} />
          <Route path="cases" element={<ClientCasesPage />} />
          <Route path="documents" element={<ClientDocumentsPage />} />
          <Route path="profile" element={<ClientProfilePage />} />
          <Route path="support" element={<ClientSupportPage />} />
          <Route path="invoices" element={<InvoicesPage />} />
          {/* Add other client routes as needed */}
        </Route>
      )}

      {/* Attorney Routes - Updated to use correct path structure */}
      {userRole === 'attorney' && (
        <>
          {/* Route for root path - redirect to attorney dashboard */}
          <Route 
            path="/"
            element={<Navigate to="/client-portal/attorney/dashboard" replace />}
          />
          
          {/* Routes for attorney paths - use the shared PrivateLayout from layouts */}
          <Route 
            path="/attorney/*"
            element={
              <ProtectedRoute allowedRoles={['attorney']}>
                <AttorneyLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AttorneyDashboardPage />} />
            <Route path="dashboard" element={<AttorneyDashboardPage />} />
            <Route path="documents" element={<AttorneyDocumentsPage />} />
            <Route path="messages" element={<AttorneyMessagesPage />} />
            <Route path="calendar" element={<AttorneyCalendarPage />} />
            {/* Add other attorney routes as needed */}
          </Route>
        </>
      )}

      {/* Admin Routes (to be implemented) */}
      {userRole === 'admin' && (
        <Route
          path="/"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              {/* <AdminLayout /> - Replace with your actual component when implemented */}
              <div>Admin Layout - To be implemented</div>
            </ProtectedRoute>
          }
        >
          {/* Admin routes will go here */}
        </Route>
      )}

      {/* Fallback for unknown role or route */}
      <Route path="*" element={<Navigate to="/client-portal/login" replace />} />
    </Routes>
  );
};

export default PrivateRoutes;