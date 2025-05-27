import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Public pages
import HomePage from './pages/public/HomePage';  // Add this import
import AboutPage from './pages/public/AboutPage';
import ContactPage from './pages/public/ContactPage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';
import ForgotPasswordPage from './pages/public/ForgotPasswordPage';
import ResetPasswordPage from './pages/public/ResetPasswordPage';
import NotFoundPage from './pages/NotFoundPage';
import FAQPage from './pages/public/FAQPage'; // New import
import ServicesPage from './pages/public/ServicesPage';

// Private pages - Client
import DashboardPage from './pages/private/DashboardPage';
import ProfilePage from './pages/private/ProfilePage';
import ClientCasesPage from './pages/private/client/ClientCasesPage';
import CaseDetailPage from './pages/private/client/CaseDetailPage';
import DocumentsPage from './pages/private/DocumentsPage';
import MessagesPage from './pages/private/MessagesPage';
import CalendarPage from './pages/private/CalendarPage';
import InvoicesPage from './pages/private/InvoicesPage';
import NotificationsPage from './pages/private/NotificationsPage';
import SupportPage from './pages/private/SupportPage';

// Private pages - Attorney
import AttorneyDashboardPage from './pages/private/attorney/AttorneyDashboardPage';
import AttorneyCasesPage from './pages/private/attorney/AttorneyCasesPage';
import AttorneyClientsPage from './pages/private/attorney/AttorneyClientsPage';
import AttorneyTimeTrackingPage from './pages/private/attorney/AttorneyTimeTrackingPage';
import AttorneyBillingPage from './pages/private/attorney/AttorneyBillingPage';

// Private pages - Admin
import AdminDashboardPage from './pages/private/admin/AdminDashboardPage';
import UsersManagementPage from './pages/private/admin/UsersManagementPage';
import SystemSettingsPage from './pages/private/admin/SystemSettingsPage';
import ReportsPage from './pages/private/admin/ReportsPage';
import AuditLogsPage from './pages/private/admin/AuditLogsPage';

// Layout components
import PublicLayout from './components/layouts/PublicLayout'; // Corrected import
import PrivateLayout from './components/layouts/PrivateLayout';

// Protected route component
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/client-portal/login" />;
  }
  
  // Safely check the user role
  const userRole = user?.role || 'client';
  
  if (requiredRole && userRole !== requiredRole) {
    // Redirect to appropriate dashboard based on role
    if (userRole === 'admin') {
      return <Navigate to="/client-portal/admin/dashboard" />;
    } else if (userRole === 'attorney') {
      return <Navigate to="/client-portal/attorney/dashboard" />;
    } else {
      return <Navigate to="/client-portal/dashboard" />;
    }
  }
  
  return children;
};

const ClientPortalRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="home" element={<HomePage />} />  {/* Add this route */}
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
    
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="reset-password" element={<ResetPasswordPage />} />
        <Route path="faq" element={<FAQPage />} /> {/* New route */}
        <Route path="services" element={<ServicesPage />} /> {/* New route */}
      </Route>

      {/* Private Routes */}
      <Route element={<PrivateLayout />}>
        {/* Client Routes */}
        <Route path="dashboard" element={
          <ProtectedRoute requiredRole="client">
            <DashboardPage />
          </ProtectedRoute>
        } />
        <Route path="profile" element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } />
        <Route path="cases" element={
          <ProtectedRoute requiredRole="client">
            <ClientCasesPage />
          </ProtectedRoute>
        } />
        <Route path="cases/:id" element={
          <ProtectedRoute>
            <CaseDetailPage />
          </ProtectedRoute>
        } />
        <Route path="documents" element={
          <ProtectedRoute>
            <DocumentsPage />
          </ProtectedRoute>
        } />
        <Route path="messages" element={
          <ProtectedRoute>
            <MessagesPage />
          </ProtectedRoute>
        } />
        <Route path="messages/:id" element={
          <ProtectedRoute>
            <MessagesPage />
          </ProtectedRoute>
        } />
        <Route path="calendar" element={
          <ProtectedRoute>
            <CalendarPage />
          </ProtectedRoute>
        } />
        <Route path="invoices" element={
          <ProtectedRoute>
            <InvoicesPage />
          </ProtectedRoute>
        } />
        <Route path="notifications" element={
          <ProtectedRoute>
            <NotificationsPage />
          </ProtectedRoute>
        } />
        <Route path="support" element={
          <ProtectedRoute>
            <SupportPage />
          </ProtectedRoute>
        } />

        {/* Attorney Routes */}
        <Route path="attorney/dashboard" element={
          <ProtectedRoute requiredRole="attorney">
            <AttorneyDashboardPage />
          </ProtectedRoute>
        } />
        <Route path="attorney/cases" element={
          <ProtectedRoute requiredRole="attorney">
            <AttorneyCasesPage />
          </ProtectedRoute>
        } />
        <Route path="attorney/clients" element={
          <ProtectedRoute requiredRole="attorney">
            <AttorneyClientsPage />
          </ProtectedRoute>
        } />
        <Route path="attorney/time-tracking" element={
          <ProtectedRoute requiredRole="attorney">
            <AttorneyTimeTrackingPage />
          </ProtectedRoute>
        } />
        <Route path="attorney/billing" element={
          <ProtectedRoute requiredRole="attorney">
            <AttorneyBillingPage />
          </ProtectedRoute>
        } />

        {/* Admin Routes */}
        <Route path="admin/dashboard" element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboardPage />
          </ProtectedRoute>
        } />
        <Route path="admin/users" element={
          <ProtectedRoute requiredRole="admin">
            <UsersManagementPage />
          </ProtectedRoute>
        } />
        <Route path="admin/settings" element={
          <ProtectedRoute requiredRole="admin">
            <SystemSettingsPage />
          </ProtectedRoute>
        } />
        <Route path="admin/reports" element={
          <ProtectedRoute requiredRole="admin">
            <ReportsPage />
          </ProtectedRoute>
        } />
        <Route path="admin/audit-logs" element={
          <ProtectedRoute requiredRole="admin">
            <AuditLogsPage />
          </ProtectedRoute>
        } />
      </Route>

      {/* Default redirect to dashboard if authenticated, login if not */}
      <Route path="" element={<Navigate to="home" />} />
      
      {/* Catch-all route for 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default ClientPortalRoutes;