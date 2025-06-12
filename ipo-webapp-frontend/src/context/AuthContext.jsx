import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import apiClient from '../services/api'; // Axios instance or your API client

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(localStorage.getItem('authToken'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Loading while checking auth

  // Fetch logged-in user info with token
  const fetchUser = useCallback(async (token) => {
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response = await apiClient.get('/auth/me');
      if (response.data && response.data.success) {
        setUser(response.data.data);
      } else {
        logout(); // invalid token or failed to get user
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      logout();
    } finally {
      setLoading(false);
    }
  }, []);

  // On mount or when authToken changes, fetch user data
  useEffect(() => {
    setLoading(true);
    fetchUser(authToken);
  }, [authToken, fetchUser]);

  // Login method
  const login = async (email, password) => {
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      if (response.data && response.data.success) {
        const token = response.data.token;
        localStorage.setItem('authToken', token);
        setAuthToken(token);
        await fetchUser(token);
        return { success: true };
      } else {
        return { success: false, error: response.data?.errors?.[0]?.msg || response.data?.error || 'Login failed' };
      }
    } catch (err) {
      console.error("Login error:", err);
      const backendError = err.response?.data?.errors?.[0]?.msg || err.response?.data?.error;
      return { success: false, error: backendError || 'An error occurred during login.' };
    }
  };

  // Signup method
  const signup = async (name, email, password) => {
    try {
      const response = await apiClient.post('/auth/register', { name, email, password });
      if (response.data && response.data.success) {
        const token = response.data.token;
        localStorage.setItem('authToken', token);
        setAuthToken(token);
        await fetchUser(token);
        return { success: true };
      } else {
        return { success: false, error: response.data?.errors?.[0]?.msg || response.data?.error || 'Signup failed' };
      }
    } catch (err) {
      console.error("Signup error:", err);
      const backendError = err.response?.data?.errors?.[0]?.msg || err.response?.data?.error;
      return { success: false, error: backendError || 'An error occurred during signup.' };
    }
  };

  // Logout method
  const logout = () => {
    localStorage.removeItem('authToken');
    setAuthToken(null);
    setUser(null);
    delete apiClient.defaults.headers.common['Authorization'];
  };

  // Context value to provide
  const value = {
    authToken,
    user,
    isAuthenticated: !!authToken && !!user,
    isAdmin: user?.role === 'admin',
    loadingAuth: loading,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
