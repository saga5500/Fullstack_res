// User model
const { createPool } = require('../config/db');
const bcrypt = require('bcryptjs');

// Get database connection pool
const db = createPool();

const User = {
  // Create database tables if they don't exist
  initDB: async () => {
    try {
      // Create users table if it doesn't exist
      await db.query(`
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          email VARCHAR(100) NOT NULL UNIQUE,
          password VARCHAR(255) NOT NULL,
          role ENUM('user', 'admin') DEFAULT 'user',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `);
      
      // Check if admin user exists, if not create one
      const [admins] = await db.query(`
        SELECT * FROM users WHERE role = 'admin' LIMIT 1
      `);
      
      if (admins.length === 0) {
        // Create default admin user
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);
        
        await db.query(`
          INSERT INTO users (name, email, password, role)
          VALUES ('Admin User', 'admin@example.com', ?, 'admin')
        `, [hashedPassword]);
        
        console.log('Default admin user created');
      }
      
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Database initialization error:', error);
      throw error; // Let the server.js handle the error
    }
  },
  
  // Find user by email
  findByEmail: async (email) => {
    try {
      const [rows] = await db.query('SELECT * FROM users WHERE email = ? LIMIT 1', [email]);
      return rows[0];
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw error;
    }
  },
  
  // Find user by ID
  findById: async (id) => {
    try {
      const [rows] = await db.query('SELECT id, name, email, role, created_at FROM users WHERE id = ? LIMIT 1', [id]);
      return rows[0];
    } catch (error) {
      console.error('Error finding user by ID:', error);
      throw error;
    }
  },
  
  // Create a new user
  create: async (userData) => {
    try {
      const { name, email, password, role = 'user' } = userData;
      
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      // Insert user into database
      const [result] = await db.query(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        [name, email, hashedPassword, role]
      );
      
      // Return the newly created user without password
      return {
        id: result.insertId,
        name,
        email,
        role
      };
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },
    // Get all users
  getAll: async () => {
    try {
      console.log('User.getAll: Fetching all users from database');
      const [rows] = await db.query('SELECT id, name, email, role, created_at FROM users');
      console.log(`User.getAll: Found ${rows.length} users`);
      return rows;
    } catch (error) {
      console.error('Error getting all users:', error);
      throw error;
    }
  },
  
  // Update a user
  update: async (id, userData, currentUser) => {
    try {
      const { name, email, role } = userData;
      
      // Check if user has permission to update this record
      if (currentUser.role !== 'admin' && currentUser.id !== parseInt(id)) {
        throw new Error('You do not have permission to update this user');
      }
      
      // Prepare update query and values
      let query = 'UPDATE users SET ';
      const values = [];
      
      if (name) {
        query += 'name = ?, ';
        values.push(name);
      }
      
      if (email) {
        query += 'email = ?, ';
        values.push(email);
      }
      
      // Only admin can update role
      if (role && currentUser.role === 'admin') {
        query += 'role = ?, ';
        values.push(role);
      }
      
      // Remove the trailing comma and space
      query = query.slice(0, -2);
      
      // Add the WHERE clause
      query += ' WHERE id = ?';
      values.push(id);
      
      // Execute the update
      await db.query(query, values);
      
      // Return the updated user
      return await User.findById(id);
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },
  
  // Delete a user
  delete: async (id, currentUser) => {
    try {
      // Check if user has permission to delete this record
      if (currentUser.role !== 'admin' && currentUser.id !== parseInt(id)) {
        throw new Error('You do not have permission to delete this user');
      }
      
      // Delete the user
      const [result] = await db.query('DELETE FROM users WHERE id = ?', [id]);
      
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }
};

module.exports = User;
