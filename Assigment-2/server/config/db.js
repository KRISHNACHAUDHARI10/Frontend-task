const mongoose = require('mongoose');

// Direct MongoDB Compass URI (No .env file used)
const MONGO_URI = 'mongodb://127.0.0.1:27017/invoices_db';

let isConnected = false;

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 2500,
    });
    isConnected = true;
    console.log(' Connected to MongoDB ');
  } catch (error) {
    isConnected = false;
    console.warn('MongoDB local daemon offline.');
  }
};

const getIsConnected = () => isConnected;

module.exports = {
  connectDB,
  getIsConnected,
  MONGO_URI,
};

