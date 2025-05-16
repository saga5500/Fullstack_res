// Auth utility functions
import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = 'http://localhost:5000/api';

// Set auth token for all requests
const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    Cookies.set('token', token, { expires: 1 }); // Expires in 1 day
  } else {
    delete axios.defaults.headers.common['Authorization'];
    Cookies.remove('token');
  }
};

// Register user
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, userData);
    if (response.data.token) {
      setAuthToken(response.data.token);
    }
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Server error' };
  }
};

// Login user
export const loginUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, userData);
    if (response.data.token) {
      setAuthToken(response.data.token);
    }
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Server error' };
  }
};

// Logout user
export const logoutUser = () => {
  // Remove token from storage
  setAuthToken(null);
  // Clear any user data in storage
  if (typeof window !== 'undefined') {
    localStorage.removeItem('user');
  }
};

// Get current user
export const getCurrentUser = async () => {
  try {
    const token = Cookies.get('token');
    if (!token) {
      return null;
    }
    setAuthToken(token);
    const response = await axios.get(`${API_URL}/auth/me`);
    return response.data;
  } catch (error) {
    logoutUser();
    return null;
  }
};

// Get all users (admin only)
export const getAllUsers = async () => {
  try {
    // Make sure token is set in headers before request
    const token = Cookies.get('token');
    console.log('Token from cookie:', token ? 'Found' : 'Not found');
    
    if (token) {
      setAuthToken(token);
      console.log('Authorization header set for request');
    } else {
      console.error('No token available for API call');
      return [];
    }
    
    // Try to get the current user as a fallback
    let currentUser = null;
    try {
      currentUser = await getCurrentUser();
      console.log('Current user retrieved as fallback:', currentUser);
    } catch (err) {
      console.error('Failed to get current user as fallback:', err);
    }
    
    console.log('Making request to:', `${API_URL}/users`);
    try {
      const response = await axios.get(`${API_URL}/users`);
      console.log('Got users response:', response.data);
      
      if (!Array.isArray(response.data)) {
        console.error('Response is not an array:', response.data);
        // If not an array but we have current user, return array with just current user
        if (currentUser) {
          console.log('Returning array with just current user as fallback');
          return [currentUser];
        }
      } else if (response.data.length === 0 && currentUser) {
        // If empty array but we have current user, include current user
        console.log('API returned empty array, adding current user');
        return [currentUser];
      }
      
      return response.data;
    } catch (apiError) {
      console.error('API error:', apiError);
      
      // Fallback to showing at least the current user if API fails
      if (currentUser) {
        console.log('API failed, using current user as fallback');
        return [currentUser];
      }
      throw apiError;
    }
  } catch (error) {
    console.error('Error getting all users:', error);
    console.error('Error details:', error.response?.data || error.message);
    throw error.response ? error.response.data : { message: 'Server error' };
  }
};

// Get user by id
export const getUserById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/users/${id}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Server error' };
  }
};

// Update user
export const updateUser = async (id, userData) => {
  try {
    const response = await axios.put(`${API_URL}/users/${id}`, userData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Server error' };
  }
};

// Delete user
export const deleteUser = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/users/${id}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Server error' };
  }
};

// Initialize from cookies
export const initAuth = () => {
  const token = Cookies.get('token');
  if (token) {
    setAuthToken(token);
  }
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!Cookies.get('token');
};

// Check if user is admin
export const isAdmin = (user) => {
  return user && user.role === 'admin';
};
