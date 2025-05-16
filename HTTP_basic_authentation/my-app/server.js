/**
 * HTTP Basic Authentication Example with Express.js
 * 
 * This file demonstrates how to implement HTTP Basic Authentication,
 * which uses the Authorization header with credentials encoded in base64.
 */

// Import required modules
const express = require('express');
const crypto = require('crypto'); // For password hashing
const fs = require('fs').promises;
const path = require('path');

// Create an Express application
const app = express();
const PORT = process.env.PORT || 3002;

// In-memory user storage (for demonstration purposes)
// In a real application, you would use a database
const users = [
  { 
    username: 'admin',
    // This is a simple hash of 'secret' - in production use a proper hashing algorithm
    passwordHash: crypto.createHash('sha256').update('secret').digest('hex')
  }
];

// Middleware to parse JSON request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For parsing form data

// Middleware to serve static files from the 'public' directory
app.use(express.static('public'));

/**
 * HTTP Basic Authentication Middleware
 * 
 * This middleware extracts credentials from the Authorization header
 * and validates them. If valid, the request proceeds, otherwise
 * a 401 Unauthorized response is sent.
 */
function basicAuth(req, res, next) {
  // Get the Authorization header from the request
  const authHeader = req.headers.authorization;
  
  // If Authorization header is missing, request authentication
  if (!authHeader) {
    // WWW-Authenticate header prompts the browser to show a login dialog
    res.setHeader('WWW-Authenticate', 'Basic realm="Authentication Required"');
    return res.status(401).send('Authentication required');
  }
  
  // The Authorization header format is: "Basic base64encodedstring"
  // where base64encodedstring is username:password encoded in base64
  const auth = authHeader.split(' ')[1]; // Get the base64 encoded part
  
  // Decode from base64 to get username:password string
  const decoded = Buffer.from(auth, 'base64').toString();
  
  // Split on colon to get username and password
  const [username, password] = decoded.split(':');
  
  // Hash the provided password for comparison
  const passwordHash = crypto.createHash('sha256').update(password).digest('hex');
  
  // Find the user in our users array
  const user = users.find(u => u.username === username);
  
  // Check if user exists and password matches
  if (user && user.passwordHash === passwordHash) {
    // Valid credentials - attach user info to request for later use
    req.user = { username: user.username };
    // Call next middleware
    next();
  } else {
    // Invalid credentials - request authentication again
    res.setHeader('WWW-Authenticate', 'Basic realm="Authentication Required"');
    res.status(401).send('Invalid credentials');
  }
}

/**
 * Public route - accessible without authentication
 */
app.get('/public', (req, res) => {
  res.json({
    message: 'This is a public endpoint, accessible without authentication'
  });
});

/**
 * Protected route - requires authentication
 * The basicAuth middleware is applied specifically to this route
 */
app.get('/protected', basicAuth, (req, res) => {
  res.json({
    message: 'You have accessed a protected endpoint',
    user: req.user.username
  });
});

/**
 * Protected API route - requires authentication
 */
app.get('/api/data', basicAuth, (req, res) => {
  // Example of protected data
  const data = {
    items: [
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' },
      { id: 3, name: 'Item 3' }
    ]
  };
  
  res.json(data);
});

/**
 * Login page route - serves the login page
 */
app.get('/login', (req, res) => {
  res.sendFile('login.html', { root: './public' });
});

/**
 * Root route - redirects to the login page
 */
app.get('/', (req, res) => {
  res.redirect('/login');
});

/**
 * Dashboard route - only accessible after authentication
 * This would be where users go after logging in successfully
 */
app.get('/dashboard', basicAuth, (req, res) => {
  res.sendFile('index.html', { root: './public' });
});

/**
 * Users page route - displays registered users
 * Only accessible after authentication
 */
app.get('/users', basicAuth, (req, res) => {
  res.sendFile('users.html', { root: './public' });
});

/**
 * Registration endpoint - allows creating a new user account
 */
app.post('/api/register', (req, res) => {
  try {
    console.log('Register request received:', req.body);
    const { username, password } = req.body;
    
    // Basic validation
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password are required' });
    }
    
    // Check if username already exists
    if (users.some(user => user.username === username)) {
      return res.status(409).json({ success: false, message: 'Username already exists' });
    }
    
    // Hash the password
    const passwordHash = crypto.createHash('sha256').update(password).digest('hex');
    
    // Create new user
    const newUser = {
      username,
      passwordHash
    };
    
    // Add to users array
    users.push(newUser);
    console.log(`User ${username} registered successfully`);
    
    // Return success response (but don't include password hash)
    res.status(201).json({
      success: true,
      message: 'Registration successful',
      user: { username: newUser.username }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'Registration failed due to server error' });
  }
});

/**
 * Users list endpoint - requires authentication
 * Lists all registered users
 */
app.get('/api/users', basicAuth, (req, res) => {
  // Return only usernames, not password hashes
  const safeUsers = users.map(user => ({ username: user.username }));
  res.json(safeUsers);
});

// Start the server
app.listen(PORT, () => {
  console.log(`HTTP Basic Auth Server running on port ${PORT}`);
  console.log(`Test user: { username: 'admin', password: 'secret' }`);
  console.log(`Login page: http://localhost:${PORT}/login`);
  console.log(`Try accessing:`);
  console.log(`- Public route: http://localhost:${PORT}/public`);
  console.log(`- Protected route: http://localhost:${PORT}/protected`);
});
