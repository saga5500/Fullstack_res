/**
 * Basic Authentication Server using Express.js
 * 
 * This file sets up a simple Express server with basic authentication
 * functionality using sessions, cookies, and bcrypt for password hashing.
 */

// Import required packages
const express = require('express');
// The express sessions is used to managesessions in the applications 
const session = require('express-session');
//The bcrypt is used to hash and compare passwords securly
const bcrypt = require('bcryptjs');
//The cookies parser is used to parse the cookies that are sent with the requests
const cookieParser = require('cookie-parser');
//The cors is used to enable Cross-Origin Resource Sharing (CORS) for the server
const cors = require('cors');
//Loads the environment files
require('dotenv').config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware for parsing request body and cookies
//This line tells your server to accept and parse JSON data sent in requests 
app.use(express.json());
// This allows Express to parse form data sent via application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
// This middleware reads cookies sent by the client and makes them available in req.cookies
app.use(cookieParser());

// Configure CORS to allow requests from our frontend
app.use(cors({
  origin: 'http://localhost:3000', // Allow requests from Next.js app
  credentials: true // Allow cookies to be sent with requests
}));

// Serve static files from the public directory
app.use(express.static('public'));

// Configure session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key', // In production, use environment variable
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

/**
 * Simple in-memory user database
 * In a real application, you would use a database like MongoDB or MySQL
 */
const users = [
  {
    id: 1,
    username: 'admin',
    // Password: 'admin123'
    // Never store plain text passwords in real applications
    password: '$2a$10$OmkbyhFzIGA6sh/UrHJfB.UbCkzUVBU.RFAOoEN250Q1TCqGSLCnK'
  }
];

/**
 * Authentication middleware to protect routes
 * Checks if a user is logged in before allowing access to protected routes
 */
const isAuthenticated = (req, res, next) => {
  if (req.session.isAuthenticated) {
    return next(); // User is authenticated, proceed to the route
  }
  res.status(401).json({ message: 'Unauthorized: Please log in to access this resource' });
};

/**
 * Login route
 * Authenticates a user based on username and password
 */
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;

  // Input validation
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  // Find the user by username
  const user = users.find(u => u.username === username);
  if (!user) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  // Compare the provided password with the stored hash
  try {
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Set session data
    req.session.isAuthenticated = true;
    req.session.userId = user.id;
    req.session.username = user.username;

    res.status(200).json({ 
      message: 'Authentication successful',
      user: {
        id: user.id,
        username: user.username
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * Logout route
 * Destroys the user session
 */
app.post('/api/auth/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ message: 'Failed to logout' });
    }
    res.clearCookie('connect.sid');
    res.status(200).json({ message: 'Logged out successfully' });
  });
});

/**
 * Register route
 * Creates a new user account
 */
app.post('/api/auth/register', async (req, res) => {
  const { username, password } = req.body;

  // Input validation
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  // Check if username already exists
  if (users.some(user => user.username === username)) {
    return res.status(409).json({ message: 'Username already exists' });
  }

  try {
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = {
      id: users.length + 1,
      username,
      password: hashedPassword
    };

    // Add to users array (in a real app, save to database)
    users.push(newUser);

    res.status(201).json({ 
      message: 'User registered successfully',
      user: {
        id: newUser.id,
        username: newUser.username
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * Protected route example
 * Only accessible to authenticated users
 */
app.get('/api/profile', isAuthenticated, (req, res) => {
  res.json({
    message: 'You have access to this protected route',
    user: {
      id: req.session.userId,
      username: req.session.username
    }
  });
});

/**
 * Public route example
 * Accessible to all users
 */
app.get('/api/public', (req, res) => {
  res.json({ message: 'This is a public route, accessible to everyone' });
});

/**
 * Root route to serve the authentication demo page
 */
app.get('/', (req, res) => {
  res.sendFile('auth-demo.html', { root: './public' });
});

/**
 * Helper utility to generate a password hash
 * Useful for creating test users
 */
app.post('/api/generate-hash', async (req, res) => {
  const { password } = req.body;
  if (!password) {
    return res.status(400).json({ message: 'Password is required' });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    res.json({ hash });
  } catch (error) {
    res.status(500).json({ message: 'Failed to generate hash' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Test user: { username: 'admin', password: 'admin123' }`);
});

// Export the Express API
module.exports = app;
