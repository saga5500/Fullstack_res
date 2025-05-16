/**
 * Basic HTTP Authentication Server using Express.js
 * 
 * This version implements HTTP Basic Authentication using the Authorization header
 * instead of session-based authentication.
 */

// Import required packages
const express = require('express');
const bcrypt = require('bcryptjs');
const cors = require('cors');

// Create Express app
const app = express();
const PORT = process.env.PORT || 3002; // Using a different port to avoid conflict

// Middleware for parsing request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure CORS
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// Serve static files
app.use(express.static('public'));

/**
 * Simple in-memory user database
 */
const users = [
  {
    id: 1,
    username: 'admin',
    // Password: 'admin123'
    password: '$2a$10$OmkbyhFzIGA6sh/UrHJfB.UbCkzUVBU.RFAOoEN250Q1TCqGSLCnK'
  }
];

/**
 * HTTP Basic Authentication middleware
 * This extracts and validates credentials from the Authorization header
 */
const basicAuth = async (req, res, next) => {
  // Check if Authorization header exists
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    // No valid Authorization header, request authentication
    res.set('WWW-Authenticate', 'Basic realm="Authentication Required"');
    return res.status(401).json({ message: 'Authentication required' });
  }
  
  // Extract and decode credentials
  try {
    // Format is "Basic base64encoded(username:password)"
    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('utf8');
    const [username, password] = credentials.split(':');
    
    // Find user
    const user = users.find(u => u.username === username);
    if (!user) {
      res.set('WWW-Authenticate', 'Basic realm="Authentication Required"');
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Validate password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      res.set('WWW-Authenticate', 'Basic realm="Authentication Required"');
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Store user info in request object for later use
    req.user = {
      id: user.id,
      username: user.username
    };
    
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.set('WWW-Authenticate', 'Basic realm="Authentication Required"');
    return res.status(401).json({ message: 'Authentication failed' });
  }
};

/**
 * Protected route using HTTP Basic Authentication
 */
app.get('/api/basic-protected', basicAuth, (req, res) => {
  res.json({
    message: 'You have access to this protected route via HTTP Basic Authentication',
    user: req.user
  });
});

/**
 * Public route (no authentication required)
 */
app.get('/api/public', (req, res) => {
  res.json({ message: 'This is a public route, accessible to everyone' });
});

/**
 * Root route to serve a demo page
 */
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>HTTP Basic Auth Demo</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                max-width: 800px;
                margin: 0 auto;
                padding: 20px;
            }
            pre {
                background: #f4f4f4;
                padding: 10px;
                border-radius: 5px;
            }
            button {
                padding: 10px;
                background-color: #4CAF50;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                margin: 5px;
            }
            #response {
                white-space: pre-wrap;
                background-color: #f5f5f5;
                padding: 10px;
                border: 1px solid #ddd;
                border-radius: 4px;
                min-height: 100px;
                margin-top: 20px;
            }
        </style>
    </head>
    <body>
        <h1>HTTP Basic Authentication Demo</h1>
        <p>This demonstrates true HTTP Basic Authentication using the Authorization header.</p>
        
        <div>
            <h3>Test the API:</h3>
            <button id="publicBtn">Access Public Route</button>
            <button id="protectedBtn">Access Protected Route</button>
            <button id="protectedWithAuthBtn">Access Protected Route With Auth</button>
        </div>
        
        <h3>Response:</h3>
        <div id="response">Results will appear here...</div>
        
        <h3>HTTP Basic Auth Explained:</h3>
        <pre>
// How to create an HTTP Basic Auth header:
const credentials = btoa('username:password');
const headers = { 'Authorization': 'Basic ' + credentials };
        </pre>
        
        <script>
            const responseDiv = document.getElementById('response');
            
            // Display response function
            function displayResponse(data) {
                if (typeof data === 'object') {
                    responseDiv.textContent = JSON.stringify(data, null, 2);
                } else {
                    responseDiv.textContent = data;
                }
            }
            
            // Public route
            document.getElementById('publicBtn').addEventListener('click', async () => {
                try {
                    const response = await fetch('http://localhost:3002/api/public');
                    const data = await response.json();
                    displayResponse(data);
                } catch (error) {
                    displayResponse({ error: error.message });
                }
            });
            
            // Protected route without auth (will fail)
            document.getElementById('protectedBtn').addEventListener('click', async () => {
                try {
                    const response = await fetch('http://localhost:3002/api/basic-protected');
                    
                    if (response.status === 401) {
                        displayResponse({
                            status: 401,
                            message: 'Authentication required',
                            headers: {
                                'WWW-Authenticate': response.headers.get('WWW-Authenticate')
                            }
                        });
                        return;
                    }
                    
                    const data = await response.json();
                    displayResponse(data);
                } catch (error) {
                    displayResponse({ error: error.message });
                }
            });
            
            // Protected route with auth
            document.getElementById('protectedWithAuthBtn').addEventListener('click', async () => {
                try {
                    // Create Basic Auth header
                    const credentials = btoa('admin:admin123');
                    
                    const response = await fetch('http://localhost:3002/api/basic-protected', {
                        headers: {
                            'Authorization': 'Basic ' + credentials
                        }
                    });
                    
                    const data = await response.json();
                    displayResponse(data);
                } catch (error) {
                    displayResponse({ error: error.message });
                }
            });
        </script>
    </body>
    </html>
  `);
});

// Helper utility to generate password hash
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
  console.log(`HTTP Basic Auth server running on port ${PORT}`);
  console.log(`Test user: { username: 'admin', password: 'admin123' }`);
  console.log(`Open http://localhost:${PORT} in your browser to test`);
});

module.exports = app;
