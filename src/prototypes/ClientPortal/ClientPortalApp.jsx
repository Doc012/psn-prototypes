import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Layout components
import PublicLayout from './components/layouts/PublicLayout';
import PrivateLayout from './components/layouts/PrivateLayout';

// Public pages
import HomePage from './pages/public/HomePage';
import AboutPage from './pages/public/AboutPage';
import ContactPage from './pages/public/ContactPage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';

// Private (authenticated) pages
import DashboardPage from './pages/private/DashboardPage';
import ProfilePage from './pages/private/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';

// Role-specific pages
import ClientCasesPage from './pages/private/client/ClientCasesPage';
import AttorneyDashboardPage from './pages/private/attorney/AttorneyDashboardPage';
import AdminDashboardPage from './pages/private/admin/AdminDashboardPage';

// Protected route wrapper
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, userRole, loading } = useAuth();
  
  // Show loading state while checking authentication
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  // Check if user is authenticated and has required role
  if (!isAuthenticated || (allowedRoles.length > 0 && !allowedRoles.includes(userRole))) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

const ClientPortalApp = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
      </Route>
      
      {/* Protected Routes */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <PrivateLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="profile" element={<ProfilePage />} />
        
        {/* Client-specific routes */}
        <Route 
          path="cases" 
          element={
            <ProtectedRoute allowedRoles={['client', 'attorney', 'admin']}>
              <ClientCasesPage />
            </ProtectedRoute>
          } 
        />
        
        {/* Attorney-specific routes */}
        <Route 
          path="attorney" 
          element={
            <ProtectedRoute allowedRoles={['attorney', 'admin']}>
              <AttorneyDashboardPage />
            </ProtectedRoute>
          } 
        />
        
        {/* Admin-specific routes */}
        <Route 
          path="admin" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboardPage />
            </ProtectedRoute>
          } 
        />
      </Route>
      
      {/* Catch-all route for 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default ClientPortalApp;