import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Use localStorage to persist authentication state
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  const [userRole, setUserRole] = useState(() => {
    return localStorage.getItem('userRole') || null;
  });

  const [isLoading, setIsLoading] = useState(true);

  // Persist authentication state to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  useEffect(() => {
    if (userRole) {
      localStorage.setItem('userRole', userRole);
    } else {
      localStorage.removeItem('userRole');
    }
  }, [userRole]);

  // Check for existing auth tokens/session
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Check localStorage
        const savedUser = localStorage.getItem('user');
        const savedRole = localStorage.getItem('userRole');
        
        if (savedUser && savedRole) {
          setUser(JSON.parse(savedUser));
          setUserRole(savedRole);
        }
      } catch (error) {
        console.error('Authentication verification failed:', error);
        // Clear potentially corrupted auth data
        localStorage.removeItem('user');
        localStorage.removeItem('userRole');
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuthStatus();
  }, []);

  // Login function
  const login = (userData, role) => {
    setUser(userData);
    setUserRole(role);
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setUserRole(null);
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    // Clear any other auth-related items from localStorage
  };

  // Include isLoading in the context value
  return (
    <AuthContext.Provider value={{ user, userRole, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);