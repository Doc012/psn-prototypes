import React, { createContext, useState, useEffect, useContext } from 'react';
import { loginUser, logoutUser, getCurrentUser } from '../data/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check for existing session on initial load
    const initAuth = async () => {
      try {
        const user = await getCurrentUser();
        setCurrentUser(user);
      } catch (err) {
        console.error('Auth initialization error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    setError(null);
    setLoading(true);
    try {
      // Mock authentication for demo purposes
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Determine user role based on email (for demo)
      let role = 'client';
      if (email.includes('admin')) {
        role = 'admin';
      } else if (email.includes('attorney')) {
        role = 'attorney';
      }
      
      const userData = {
        id: '123',
        email,
        firstName: email.split('@')[0],
        lastName: 'User',
        role: role // Important: make sure role is set correctly
      };
      
      setCurrentUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      
      return userData;
    } catch (error) {
      setError('Authentication failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await logoutUser();
      setCurrentUser(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user: currentUser, // Add this alias for compatibility
    currentUser,
    userRole: currentUser?.role || 'guest',
    isAuthenticated: !!currentUser,
    loading,
    error,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};