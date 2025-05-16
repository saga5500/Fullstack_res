// Frontend API debugging
import axios from 'axios';
import Cookies from 'js-cookie';

// API URL
const API_URL = 'http://localhost:5000/api';

// Set auth token for all requests
const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    console.log('Set Authorization header:', `Bearer ${token}`);
  } else {
    delete axios.defaults.headers.common['Authorization'];
    console.log('Removed Authorization header');
  }
};

// Debug API call to get all users
export async function debugGetAllUsers() {
  try {
    // Get token
    const token = Cookies.get('token');
    console.log('Token from cookie:', token ? 'Found' : 'Not found');
    
    if (token) {
      setAuthToken(token);
    } else {
      console.error('No token available');
      return {error: 'No token available'};
    }
    
    // Log request details
    console.log('Making request to:', `${API_URL}/users`);
    console.log('Headers:', axios.defaults.headers.common);
    
    // Make request
    const response = await axios.get(`${API_URL}/users`);
    
    // Log response
    console.log('Response status:', response.status);
    console.log('Response data:', response.data);
    
    return {success: true, data: response.data};
  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    return {error: error.message || 'Unknown error'};
  }
}
