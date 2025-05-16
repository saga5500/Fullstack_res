require('dotenv').config(); const jwt = require('jsonwebtoken'); const token = jwt.sign({ id: 1, role: 'admin' }, process.env.JWT_SECRET || 'fallback_secret'); console.log('Token:', token);
