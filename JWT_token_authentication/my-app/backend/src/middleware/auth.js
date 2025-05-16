// Authentication middleware
const { verifyToken } = require('../config/jwt');

const auth = (req, res, next) => {
  try {
    console.log('Auth middleware: Checking authorization header');
    
    // Get token from the Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      console.error('Auth middleware: No authorization header provided');
      return res.status(401).json({ message: 'No token provided, authorization denied' });
    }
    
    if (!authHeader.startsWith('Bearer ')) {
      console.error('Auth middleware: Invalid authorization format:', authHeader);
      return res.status(401).json({ message: 'Invalid authorization format, must start with Bearer' });
    }
    
    // Extract token from header
    const token = authHeader.split(' ')[1];
    console.log('Auth middleware: Token extracted from header');
    
    // Verify token
    const decoded = verifyToken(token);
    
    if (!decoded) {
      console.error('Auth middleware: Token verification failed');
      return res.status(401).json({ message: 'Invalid token, authorization denied' });
    }
    
    console.log('Auth middleware: Token verified successfully, user:', decoded);
    
    // Add user from payload to request object
    req.user = decoded;
    
    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = auth;
