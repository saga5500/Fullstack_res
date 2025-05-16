// User controller
const User = require('../models/User');

const userController = {  // Get all users
  getAllUsers: async (req, res) => {
    try {
      console.log('userController.getAllUsers: Request received from user:', req.user);
      console.log('userController.getAllUsers: User role:', req.user.role);
      
      const users = await User.getAll();
      console.log(`userController.getAllUsers: Sending ${users.length} users in response`);
      
      res.status(200).json(users);
    } catch (error) {
      console.error('Get all users error:', error);
      res.status(500).json({ message: 'Server Error' });
    }
  },
  
  // Get user by ID
  getUserById: async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.findById(id);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Check if user has permission to view this user
      if (req.user.role !== 'admin' && req.user.id !== parseInt(id)) {
        return res.status(403).json({ message: 'Access denied' });
      }
      
      res.status(200).json(user);
    } catch (error) {
      console.error('Get user by ID error:', error);
      res.status(500).json({ message: 'Server Error' });
    }
  },
  
  // Update user
  updateUser: async (req, res) => {
    try {
      const { id } = req.params;
      
      // Check if user exists
      const existingUser = await User.findById(id);
      
      if (!existingUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Update user
      const updatedUser = await User.update(id, req.body, req.user);
      
      res.status(200).json(updatedUser);
    } catch (error) {
      if (error.message === 'You do not have permission to update this user') {
        return res.status(403).json({ message: error.message });
      }
      
      console.error('Update user error:', error);
      res.status(500).json({ message: 'Server Error' });
    }
  },
  
  // Delete user
  deleteUser: async (req, res) => {
    try {
      const { id } = req.params;
      
      // Check if user exists
      const existingUser = await User.findById(id);
      
      if (!existingUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Delete user
      const success = await User.delete(id, req.user);
      
      if (!success) {
        return res.status(404).json({ message: 'User not found or already deleted' });
      }
      
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      if (error.message === 'You do not have permission to delete this user') {
        return res.status(403).json({ message: error.message });
      }
      
      console.error('Delete user error:', error);
      res.status(500).json({ message: 'Server Error' });
    }
  }
};

module.exports = userController;
