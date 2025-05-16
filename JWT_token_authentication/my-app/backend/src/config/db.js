// Database configuration
const mysql = require('mysql2');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Log database connection params (without password) for debugging
console.log('Database connection params:', {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME
});

// Create a connection to MySQL without specifying a database
const initConnection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
});

// Initialize the database
const initDatabase = () => {
  return new Promise((resolve, reject) => {
    initConnection.query(
      `CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`,
      (err) => {
        if (err) {
          console.error('Error creating database:', err);
          reject(err);
          return;
        }
        
        console.log(`Database ${process.env.DB_NAME} created or already exists`);
        resolve();
      }
    );
  });
};

// Create pool after ensuring database exists
const createPool = () => {
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

  // Convert pool queries to use promises
  return pool.promise();
};

module.exports = { initDatabase, createPool };
