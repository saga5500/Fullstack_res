// Test API access with JWT token
require('dotenv').config();
const jwt = require('jsonwebtoken');
const axios = require('axios');

async function testUsersAPI() {
  try {
    // Create a token for testing (simulating admin)
    const testToken = jwt.sign(
      { id: 1, email: 'admin@example.com', role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    console.log('Created test token for admin user');
    
    // Test users endpoint
    try {
      console.log('Testing /api/users endpoint...');
      
      const response = await axios.get('http://localhost:5000/api/users', {
        headers: {
          Authorization: `Bearer ${testToken}`
        }
      });
      
      console.log('Response status:', response.status);
      console.log('Users count:', response.data.length);
      console.log('Users:', response.data);
    } catch (apiError) {
      console.error('API request failed:', apiError.message);
      if (apiError.response) {
        console.error('Response status:', apiError.response.status);
        console.error('Response data:', apiError.response.data);
      }
    }
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testUsersAPI();
