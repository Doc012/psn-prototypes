import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { HiOutlineMail, HiArrowLeft, HiOutlineShieldCheck, HiLockClosed, HiX, HiArrowRight } from 'react-icons/hi';
import { motion } from 'framer-motion';
import psnLogo from '../../../../assets/PSN.png';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.6,
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
      transition: { duration: 0.5 }
    }
  };

  const successVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { 
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate email
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    
    setError('');
    setIsSubmitting(true);
    
    try {
      // In a real application, this would call your API
      // to send a password reset link to the user's email
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      
      // Show success message
      setSubmitted(true);
      toast.success('Password reset link has been sent to your email');
    } catch (err) {
      console.error('Error sending reset email:', err);
      setError('Failed to send reset link. Please try again later.');
      toast.error('Failed to send reset link');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-gray-100">
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="sm:mx-auto sm:w-full sm:max-w-md"
      >
        {/* <motion.div
          initial={{ rotate: -5, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center"
        >
          <img
            className="h-20 w-auto"
            src={psnLogo}
            alt="PSN Attorneys"
          />
        </motion.div> */}

        <motion.div variants={itemVariants}>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Reset your password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </motion.div>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
      >
        <motion.div 
          variants={itemVariants}
          className="bg-white py-8 px-4 shadow-2xl sm:rounded-xl sm:px-10 border border-gray-100"
        >
          {!submitted ? (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <motion.div variants={itemVariants}>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <HiOutlineMail className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="focus:ring-[#800000] focus:border-[#800000] block w-full pl-10 py-3 sm:text-sm border-gray-300 rounded-md
                    placeholder-gray-400 transition-all duration-300"
                    placeholder="you@example.com"
                  />
                </div>
              </motion.div>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-md bg-red-50 p-4 border-l-4 border-red-400"
                >
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <HiX className="h-5 w-5 text-red-400" aria-hidden="true" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                    <div className="ml-auto pl-3">
                      <div className="-mx-1.5 -my-1.5">
                        <button
                          type="button"
                          onClick={() => setError('')}
                          className="inline-flex rounded-md p-1.5 text-red-500 hover:bg-red-100 focus:outline-none"
                        >
                          <span className="sr-only">Dismiss</span>
                          <HiX className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              <motion.div variants={itemVariants}>
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileTap={{ scale: 0.98 }}
                  whileHover={{ 
                    scale: 1.01,
                    boxShadow: "0 10px 15px -3px rgba(128, 0, 0, 0.2)" 
                  }}
                  className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-md text-sm font-medium text-white bg-[#800000] hover:bg-[#700000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000] transition-all duration-300 ${
                    isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      Send reset link <HiArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </motion.button>
              </motion.div>
              
              <motion.div variants={itemVariants} className="text-center">
                <Link
                  to="/client-portal/login"
                  className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors duration-300"
                >
                  <HiArrowLeft className="mr-2 h-4 w-4" />
                  Back to login
                </Link>
              </motion.div>

              <motion.div variants={itemVariants} className="pt-4 mt-4 border-t border-gray-200">
                <div className="flex items-center justify-center space-x-2">
                  <HiLockClosed className="h-4 w-4 text-gray-400" />
                  <p className="text-xs text-gray-500">
                    We'll send a secure link to reset your password
                  </p>
                </div>
              </motion.div>
            </form>
          ) : (
            <motion.div 
              className="text-center"
              initial="hidden"
              animate="visible"
              variants={successVariants}
            >
              <motion.div 
                variants={itemVariants}
                className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100"
              >
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ 
                    duration: 0.5,
                    type: "spring",
                    stiffness: 150
                  }}
                >
                  <HiOutlineShieldCheck className="h-8 w-8 text-green-600" aria-hidden="true" />
                </motion.div>
              </motion.div>
              
              <motion.h3 variants={itemVariants} className="mt-4 text-lg font-medium text-gray-900">
                Check your email
              </motion.h3>
              
              <motion.p variants={itemVariants} className="mt-3 text-sm text-gray-500">
                We've sent a password reset link to <br />
                <span className="font-medium text-gray-800">{email}</span>
              </motion.p>
              
              <motion.div variants={itemVariants} className="mt-8">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    to="/client-portal/login"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#800000] hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000] transition-all duration-300"
                  >
                    Return to login
                  </Link>
                </motion.div>
              </motion.div>
              
              <motion.div 
                variants={itemVariants}
                className="mt-8 p-4 bg-blue-50 rounded-md"
              >
                <h4 className="text-sm font-medium text-blue-800">Didn't receive the email?</h4>
                <p className="mt-1 text-xs text-blue-600">
                  Check your spam folder or{' '}
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="text-[#800000] hover:text-[#600000] font-medium transition-colors duration-300"
                  >
                    try again with a different email
                  </button>
                </p>
              </motion.div>
            </motion.div>
          )}
        </motion.div>

        <motion.div variants={itemVariants} className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Need help? <Link to="/client-portal/contact" className="text-[#800000] hover:text-[#600000] font-medium transition-colors duration-300">Contact our support team</Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;