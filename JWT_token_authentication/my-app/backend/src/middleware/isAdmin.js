// Admin authorization middleware
const isAdmin = (req, res, next) => {
  try {
    console.log('isAdmin middleware: Checking user role', req.user);
    
    // Check if user exists and has role property
    if (!req.user) {
      console.error('isAdmin middleware: User object missing');
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    if (!req.user.role) {
      console.error('isAdmin middleware: Role not found in user object');
      return res.status(403).json({ message: 'Role information missing' });
    }
    
    // Check if user is admin
    if (req.user.role !== 'admin') {
      console.error(`isAdmin middleware: Access denied for role ${req.user.role}`);
      return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }
    
    console.log('isAdmin middleware: Admin access granted');
    next();
  } catch (error) {
    console.error('Admin middleware error:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = isAdmin;
