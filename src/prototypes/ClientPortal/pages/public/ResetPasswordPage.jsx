import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { HiOutlineLockClosed, HiOutlineCheck, HiOutlineEye, HiOutlineEyeOff, HiArrowLeft } from 'react-icons/hi';
import psnLogo from '../../../../assets/PSN.png';

const ResetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [token, setToken] = useState('');
  const [tokenValid, setTokenValid] = useState(true);
  const [tokenChecked, setTokenChecked] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract token from URL query parameters
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const resetToken = queryParams.get('token');
    
    if (!resetToken) {
      setTokenValid(false);
      setTokenChecked(true);
      toast.error('Invalid or missing reset token');
      return;
    }
    
    // Validate token (simulated)
    const validateToken = async () => {
      try {
        setToken(resetToken);
        // In a real implementation, you would verify the token with your API
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
        
        // For demonstration, let's say tokens starting with 'valid' are valid
        if (resetToken.startsWith('valid')) {
          setTokenValid(true);
        } else {
          setTokenValid(false);
          toast.error('Your password reset link has expired or is invalid');
        }
      } catch (err) {
        console.error('Error validating token:', err);
        setTokenValid(false);
        toast.error('Failed to validate reset token');
      } finally {
        setTokenChecked(true);
      }
    };
    
    validateToken();
  }, [location]);
  
  // Password validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real application, this would call your API
      // to reset the user's password using the token and new password
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      
      // Show success message
      setSubmitted(true);
      toast.success('Your password has been successfully reset');
      
      // Redirect to login after a delay
      setTimeout(() => {
        navigate('/client-portal/login');
      }, 3000);
    } catch (err) {
      console.error('Error resetting password:', err);
      setErrors({ submit: 'Failed to reset password. Please try again later.' });
      toast.error('Failed to reset your password');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Password strength indicator
  const getPasswordStrength = (password) => {
    if (!password) return { text: '', color: '' };
    if (password.length < 8) return { text: 'Weak', color: 'text-red-600' };
    
    let strength = 0;
    if (password.length >= 12) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    if (strength === 0) return { text: 'Weak', color: 'text-red-600' };
    if (strength === 1) return { text: 'Fair', color: 'text-yellow-600' };
    if (strength === 2) return { text: 'Good', color: 'text-blue-600' };
    if (strength >= 3) return { text: 'Strong', color: 'text-green-600' };
  };
  
  const passwordStrength = getPasswordStrength(password);
  
  if (!tokenChecked) {
    return (
      <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <img
            className="mx-auto h-16 w-auto"
            src={psnLogo}
            alt="PSN Attorneys"
          />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Verifying reset link...
          </h2>
          <div className="mt-8 flex justify-center">
            <svg className="animate-spin h-8 w-8 text-[#800000]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        </div>
      </div>
    );
  }
  
  if (!tokenValid) {
    return (
      <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <img
            className="mx-auto h-16 w-auto"
            src={psnLogo}
            alt="PSN Attorneys"
          />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Invalid Reset Link
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            This password reset link is invalid or has expired.
          </p>
          <div className="mt-8 text-center">
            <Link
              to="/client-portal/forgot-password"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#800000] hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
            >
              Request a new reset link
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <img
          className="mx-auto h-16 w-auto"
          src={psnLogo}
          alt="PSN Attorneys"
        />
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create new password
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Please enter a new password for your account
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {!submitted ? (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  New password
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <HiOutlineLockClosed className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                    className="focus:ring-[#800000] focus:border-[#800000] block w-full pl-10 pr-10 sm:text-sm border-gray-300 rounded-md"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-gray-500 focus:outline-none"
                    >
                      {showPassword ? (
                        <HiOutlineEyeOff className="h-5 w-5" />
                      ) : (
                        <HiOutlineEye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
                {password && (
                  <div className="mt-1 flex items-center">
                    <span className="text-xs mr-2">Strength:</span>
                    <span className={`text-xs font-medium ${passwordStrength.color}`}>
                      {passwordStrength.text}
                    </span>
                  </div>
                )}
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Password should be at least 8 characters and include uppercase letters, numbers, and symbols for better security.
                </p>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm password
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <HiOutlineLockClosed className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                    className="focus:ring-[#800000] focus:border-[#800000] block w-full pl-10 pr-10 sm:text-sm border-gray-300 rounded-md"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="text-gray-400 hover:text-gray-500 focus:outline-none"
                    >
                      {showConfirmPassword ? (
                        <HiOutlineEyeOff className="h-5 w-5" />
                      ) : (
                        <HiOutlineEye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                )}
              </div>

              {errors.submit && (
                <div className="text-sm text-red-600">
                  {errors.submit}
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#800000] hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000] ${
                    isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? 'Resetting...' : 'Reset password'}
                </button>
              </div>
              
              <div className="text-center">
                <Link
                  to="/client-portal/login"
                  className="flex items-center justify-center text-sm text-gray-600 hover:text-gray-900"
                >
                  <HiArrowLeft className="mr-1 h-4 w-4" />
                  Back to login
                </Link>
              </div>
            </form>
          ) : (
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <HiOutlineCheck className="h-6 w-6 text-green-600" aria-hidden="true" />
              </div>
              <h3 className="mt-2 text-lg font-medium text-gray-900">Password reset successful</h3>
              <p className="mt-1 text-sm text-gray-500">
                Your password has been successfully reset.
              </p>
              <p className="mt-1 text-sm text-gray-500">
                You will be redirected to the login page shortly.
              </p>
              <div className="mt-6">
                <Link
                  to="/client-portal/login"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#800000] hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
                >
                  Go to login
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;