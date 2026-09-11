const mongoose = require('mongoose');

// Direct MongoDB Compass Connection URI
const MONGO_URI = 'mongodb://127.0.0.1:27017/role_based_nav_db';

let isConnected = false;

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 2500,
    });
    isConnected = true;
    console.log('Connected to MongoDB Compass (role_based_nav_db)');
  } catch (error) {
    isConnected = false;
    console.warn(' MongoDB local daemon offline. Resilient in-memory database active for demo.');
  }
};

const getIsConnected = () => isConnected;

module.exports = {
  connectDB,
  getIsConnected,
  MONGO_URI,
};
