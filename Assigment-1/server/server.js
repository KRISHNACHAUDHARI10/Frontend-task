const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/db');
const moduleRoutes = require('./routes/moduleRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Direct MongoDB Connection (No .env file)
connectDB();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api', moduleRoutes);
app.use('/api/auth', authRoutes);

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});