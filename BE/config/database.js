const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/CuaHangTienLoi';

const connectDB = async () => {
  try {
    // For Atlas connections, URI already includes database name
    // For local connections, we append the database name if not already included
    let connectionString = MONGODB_URI;
    
    // If using local MongoDB and no database in URI, append it
    if (MONGODB_URI.includes('localhost') && !MONGODB_URI.includes('/CuaHangTienLoi')) {
      connectionString = `${MONGODB_URI}/CuaHangTienLoi`;
    }
    
    const conn = await mongoose.connect(connectionString);
    
    console.log(`✅ MongoDB Connected: ${conn.connection.name}`);
    
    return conn;
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;