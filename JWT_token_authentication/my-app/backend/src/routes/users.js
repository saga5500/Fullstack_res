// User routes
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

// Get all users (admin only)
router.get('/', auth, isAdmin, userController.getAllUsers);

// Get user by ID
router.get('/:id', auth, userController.getUserById);

// Update user
router.put('/:id', auth, userController.updateUser);

// Delete user
router.delete('/:id', auth, userController.deleteUser);

module.exports = router;
