import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
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
import DashboardPage from './pages/private/client/ClientDashboardPage';
import ProfilePage from './pages/private/client/ClientProfilePage';
import ClientCasesPage from './pages/private/client/ClientCasesPage';
import CaseDetailPage from './pages/private/client/CaseDetailPage';
import DocumentsPage from './pages/private/client/ClientDocumentsPage';
import MessagesPage from './pages/private/client/ClientMessagesPage';
import CalendarPage from './pages/private/client/ClientCalendarPage';
import InvoicesPage from './pages/private/client/ClientInvoicesPage';
import NotificationsPage from './pages/private/client/ClientNotificationsPage';
import SupportPage from './pages/private/client/ClientSupportPage';
import NewMessagePage from './pages/private/client/NewMessagePage'; // New import

// Private pages - Attorney
import AttorneyDashboardPage from './pages/private/attorney/AttorneyDashboardPage';
import AttorneyCalendarPage from './pages/private/attorney/AttorneyCalendarPage';
import AttorneyCasesPage from './pages/private/attorney/AttorneyCasesPage';
import AttorneyClientsPage from './pages/private/attorney/AttorneyClientsPage';
import AttorneyTimeTrackingPage from './pages/private/attorney/AttorneyTimeTrackingPage';
import AttorneyBillingPage from './pages/private/attorney/AttorneyBillingPage';
import AttorneyDocumentsPage from './pages/private/attorney/AttorneyDocumentsPage';
import AttorneyMessagesPage from './pages/private/attorney/AttorneyMessagesPage';
import AttorneyProfilePage from './pages/private/attorney/AttorneyProfilePage'; // New import

// Private pages - Admin
import AdminDashboardPage from './pages/private/admin/AdminDashboardPage';
import UsersManagementPage from './pages/private/admin/UsersManagementPage';
import SystemSettingsPage from './pages/private/admin/SystemSettingsPage';
import ReportsPage from './pages/private/admin/ReportsPage';
import AuditLogsPage from './pages/private/admin/AuditLogsPage';

// Admin page imports
import AdminFirmManagementPage from './pages/private/admin/AdminFirmManagementPage';
import AdminAttorneysPage from './pages/private/admin/AdminAttorneysPage';
import AdminClientsPage from './pages/private/admin/AdminClientsPage';
import AdminCasesPage from './pages/private/admin/AdminCasesPage';
import AdminBillingPage from './pages/private/admin/AdminBillingPage';
import AdminDocumentsPage from './pages/private/admin/AdminDocumentsPage';
import AdminTimeActivitiesPage from './pages/private/admin/AdminTimeActivitiesPage';
import AdminCalendarPage from './pages/private/admin/AdminCalendarPage';
import AdminSecurityPage from './pages/private/admin/AdminSecurityPage';
import AdminProfilePage from './pages/private/admin/AdminProfilePage'; // New import

// Layout components
import PublicLayout from './components/layouts/PublicLayout'; // Corrected import
import PrivateLayout from './components/layouts/PrivateLayout';

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!user) {
      navigate('/client-portal/login', { replace: true });
    }
  }, [user, navigate]);
  
  return user ? children : null;
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
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } />
        <Route path="profile" element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } />
        <Route path="cases" element={
          <ProtectedRoute>
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
        <Route path="messages/new" element={
          <ProtectedRoute>
            <NewMessagePage />
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
          <ProtectedRoute>
            <AttorneyDashboardPage />
          </ProtectedRoute>
        } />
        <Route path="attorney/cases" element={
          <ProtectedRoute>
            <AttorneyCasesPage />
          </ProtectedRoute>
        } />
        <Route path="attorney/clients" element={
          <ProtectedRoute>
            <AttorneyClientsPage />
          </ProtectedRoute>
        } />
        <Route path="attorney/time-tracking" element={
          <ProtectedRoute>
            <AttorneyTimeTrackingPage />
          </ProtectedRoute>
        } />
        <Route path="attorney/billing" element={
          <ProtectedRoute>
            <AttorneyBillingPage />
          </ProtectedRoute>
        } />
        <Route path="attorney/documents" element={
          <ProtectedRoute>
            <AttorneyDocumentsPage />
          </ProtectedRoute>
        } />
        <Route path="attorney/messages" element={
          <ProtectedRoute>
            <AttorneyMessagesPage />
          </ProtectedRoute>
        } />
        <Route path="attorney/profile" element={
          <ProtectedRoute>
            <AttorneyProfilePage />
          </ProtectedRoute>
        } />
        

        <Route path="attorney/calendar" element={
          <ProtectedRoute>
            <AttorneyCalendarPage />
          </ProtectedRoute>
        } />

        {/* Admin Routes */}
        <Route path="admin/dashboard" element={
          <ProtectedRoute>
            <AdminDashboardPage />
          </ProtectedRoute>
        } />
        <Route path="admin/firm" element={
          <ProtectedRoute>
            <AdminFirmManagementPage />
          </ProtectedRoute>
        } />
        <Route path="admin/attorneys" element={
          <ProtectedRoute>
            <AdminAttorneysPage />
          </ProtectedRoute>
        } />
        <Route path="admin/clients" element={
          <ProtectedRoute>
            <AdminClientsPage />
          </ProtectedRoute>
        } />
        <Route path="admin/cases" element={
          <ProtectedRoute>
            <AdminCasesPage />
          </ProtectedRoute>
        } />
        <Route path="admin/billing" element={
          <ProtectedRoute>
            <AdminBillingPage />
          </ProtectedRoute>
        } />
        <Route path="admin/documents" element={
          <ProtectedRoute>
            <AdminDocumentsPage />
          </ProtectedRoute>
        } />
        <Route path="admin/time" element={
          <ProtectedRoute>
            <AdminTimeActivitiesPage />
          </ProtectedRoute>
        } />
        <Route path="admin/reports" element={
          <ProtectedRoute>
            <ReportsPage />
          </ProtectedRoute>
        } />
        <Route path="admin/calendar" element={
          <ProtectedRoute>
            <AdminCalendarPage />
          </ProtectedRoute>
        } />
        <Route path="admin/security" element={
          <ProtectedRoute>
            <AdminSecurityPage />
          </ProtectedRoute>
        } />
        <Route path="admin/settings" element={
          <ProtectedRoute>
            <SystemSettingsPage />
          </ProtectedRoute>
        } />
        <Route path="admin/users" element={
          <ProtectedRoute>
            <UsersManagementPage />
          </ProtectedRoute>
        } />
        <Route path="admin/audit-logs" element={
          <ProtectedRoute>
            <AuditLogsPage />
          </ProtectedRoute>
        } />
        <Route path="admin/profile" element={
          <ProtectedRoute>
            <AdminProfilePage />
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