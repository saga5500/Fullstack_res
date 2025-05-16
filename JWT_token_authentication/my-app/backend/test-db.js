// Test database connection and user retrieval
require('dotenv').config();
const mysql = require('mysql2/promise');

async function main() {
  console.log('Testing database connection...');
  console.log('Database params:', {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME
  });
  
  try {
    // Create connection
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });
    
    console.log('Connected to database successfully');
    
    // Query users
    const [rows] = await connection.execute('SELECT id, name, email, role, created_at FROM users');
    console.log(`Found ${rows.length} users in database:`);
    console.log(rows);
    
    // Close connection
    await connection.end();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Database test failed:', error);
  }
}

main();
