import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { HiLockClosed, HiMail, HiUserCircle, HiShieldCheck, HiArrowRight } from 'react-icons/hi';
import { motion } from 'framer-motion';

// Define the determineUserRole function
const determineUserRole = (email) => {
  // Simple logic to determine user role based on email
  if (email.includes('admin')) {
    return 'admin';
  } else if (email.includes('attorney')) {
    return 'attorney';
  } else {
    return 'client';
  }
};

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the redirect path from location state or default to dashboard
  const from = location.state?.from?.pathname || '/client-portal/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Authenticate user (this would typically call an API)
      
      // For demo purposes
      const userData = {
        id: 123,
        firstName: 'John',
        lastName: 'Doe',
        email: email,
        // other user data
      };
      
      // Set role based on login form or API response
      const role = determineUserRole(email); // Your function to get role
      
      // Call login function from AuthContext
      login(userData, role);
      
      // Redirect based on role
      let dashboardPath;
      switch(role) {
        case 'admin':
          dashboardPath = '/client-portal/admin/dashboard';
          break;
        case 'attorney':
          dashboardPath = '/client-portal/attorney/dashboard';
          break;
        default:
          dashboardPath = '/client-portal/dashboard';
      }
      
      // Redirect to appropriate dashboard
      navigate(dashboardPath, { replace: true });
      toast.success('Login successful!');
    } catch (error) {
      toast.error(error.message || 'Failed to login');
      setLoading(false);
    }
  };

  // Demo credentials for quick login
  const demoCredentials = [
    { 
      role: 'Client', 
      email: 'client@example.com', 
      password: 'password123',
      color: 'bg-blue-500 hover:bg-blue-600',
      icon: <HiUserCircle className="mr-2 h-5 w-5" />
    },
    { 
      role: 'Attorney', 
      email: 'attorney@example.com', 
      password: 'password123',
      color: 'bg-emerald-600 hover:bg-emerald-700',
      icon: <HiShieldCheck className="mr-2 h-5 w-5" />
    },
    { 
      role: 'Admin', 
      email: 'admin@example.com', 
      password: 'password123',
      color: 'bg-gray-700 hover:bg-gray-800',
      icon: <HiShieldCheck className="mr-2 h-5 w-5" />
    }
  ];

  const setDemoCredentials = (email, password) => {
    setEmail(email);
    setPassword(password);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.4 }
    }
  };

  return (
    <div className="min-h-[90vh] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-gray-100">
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="sm:mx-auto sm:w-full sm:max-w-md"
      >
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mx-auto w-12 h-12 rounded-full bg-[#800000] flex items-center justify-center shadow-lg mb-6"
        >
          <HiLockClosed className="h-6 w-6 text-white" />
        </motion.div>
        
        <motion.h2 
          variants={itemVariants}
          className="text-center text-3xl font-extrabold text-gray-900"
        >
          Sign in to your account
        </motion.h2>
        <motion.p 
          variants={itemVariants}
          className="mt-2 text-center text-sm text-gray-600"
        >
          Or{' '}
          <Link to="/client-portal/register" className="font-medium text-[#800000] hover:text-[#600000] underline transition-colors duration-300">
            register for a new account
          </Link>
        </motion.p>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
      >
        <motion.div 
          variants={itemVariants}
          className="bg-white py-8 px-4 shadow-2xl sm:rounded-xl sm:px-10 border border-gray-100"
        >
          <form className="space-y-6" onSubmit={handleSubmit}>
            <motion.div variants={itemVariants}>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1 relative rounded-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <HiMail className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-3 pl-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 
                  focus:outline-none focus:ring-[#800000] focus:border-[#800000] transition-all duration-300
                  sm:text-sm"
                  placeholder="you@example.com"
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative rounded-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <HiLockClosed className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-3 pl-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 
                  focus:outline-none focus:ring-[#800000] focus:border-[#800000] transition-all duration-300
                  sm:text-sm"
                  placeholder="••••••••"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    <span className="text-xs font-medium">
                      {showPassword ? 'HIDE' : 'SHOW'}
                    </span>
                  </button>
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-[#800000] focus:ring-[#800000] border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link to="/client-portal/forgot-password" className="font-medium text-[#800000] hover:text-[#600000] transition-colors duration-300">
                  Forgot your password?
                </Link>
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <motion.button
                type="submit"
                disabled={loading}
                whileTap={{ scale: 0.98 }}
                whileHover={{ 
                  scale: 1.01,
                  boxShadow: "0 10px 15px -3px rgba(128, 0, 0, 0.2)" 
                }}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-md text-sm font-medium 
                text-white bg-[#800000] hover:bg-[#700000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000] 
                disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in <HiArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </motion.button>
            </motion.div>
          </form>

          <motion.div variants={itemVariants} className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500 font-medium">Demo accounts</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3">
              {demoCredentials.map((cred, index) => (
                <motion.button
                  key={index}
                  variants={itemVariants}
                  whileHover={{ y: -2, transition: { duration: 0.2 } }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => setDemoCredentials(cred.email, cred.password)}
                  className={`inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium rounded-md text-white ${cred.color} shadow-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]`}
                >
                  {cred.icon}
                  Use {cred.role} Account
                </motion.button>
              ))}
            </div>

            <div className="mt-10 text-center">
              <motion.p 
                variants={itemVariants}
                className="text-xs text-gray-500"
              >
                By signing in, you agree to our 
                <Link to="/client-portal/terms" className="text-[#800000] hover:text-[#600000] ml-1">
                  Terms of Service
                </Link> and 
                <Link to="/client-portal/privacy" className="text-[#800000] hover:text-[#600000] ml-1">
                  Privacy Policy
                </Link>
              </motion.p>
            </div>
          </motion.div>
        </motion.div>
        
        <motion.div 
          variants={itemVariants}
          className="mt-6 text-center"
        >
          <p className="text-sm text-gray-500">
            Having trouble signing in? 
            <Link to="/client-portal/contact" className="text-[#800000] hover:text-[#600000] ml-1 font-medium">
              Contact Support
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginPage;