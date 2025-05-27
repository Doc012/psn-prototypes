import React from 'react';
import { AuthProvider } from './context/AuthContext';
import ClientPortalRoutes from './routes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ClientPortal = () => {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-100 font-sans">
        <ClientPortalRoutes />
        <ToastContainer 
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </AuthProvider>
  );
};

export default ClientPortal;