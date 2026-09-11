const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/db');
const invoiceRoutes = require('./routes/invoiceRoutes');

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/invoices', invoiceRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(` Invoice Server running on http://localhost:${PORT}`);
});

