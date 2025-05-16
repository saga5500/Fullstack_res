// Auth controller
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generateToken } = require('../config/jwt');

const authController = {
  // Register new user
  register: async (req, res) => {
    try {
      const { name, email, password } = req.body;
      
      // Check if all required fields are provided
      if (!name || !email || !password) {
        return res.status(400).json({ message: 'Please provide name, email, and password' });
      }
      
      // Check if user already exists
      const existingUser = await User.findByEmail(email);
      
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists with this email' });
      }
      
      // Create new user
      const newUser = await User.create({
        name,
        email,
        password,
      });
      
      // Generate token
      const token = generateToken(newUser);
      
      // Return user and token
      res.status(201).json({
        user: newUser,
        token
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ message: 'Server Error' });
    }
  },
  
  // User login
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      
      // Check if all required fields are provided
      if (!email || !password) {
        return res.status(400).json({ message: 'Please provide email and password' });
      }
      
      // Find user by email
      const user = await User.findByEmail(email);
      
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      // Compare passwords
      const isMatch = await bcrypt.compare(password, user.password);
      
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      // Generate token
      const token = generateToken(user);
      
      // Return user and token
      res.status(200).json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        token
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Server Error' });
    }
  },
  
  // Get current user
  getCurrentUser: async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Return user data
      res.status(200).json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      });
    } catch (error) {
      console.error('Get current user error:', error);
      res.status(500).json({ message: 'Server Error' });
    }
  }
};

module.exports = authController;
