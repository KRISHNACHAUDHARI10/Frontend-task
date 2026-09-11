const Invoice = require('../models/invoiceModel');
const { getIsConnected } = require('../config/db');

// Initial seed data
const initialInvoices = [
  {
    id: 'INV-101',
    clientName: 'Rahul Sharma',
    clientEmail: 'rahul@gmail.com',
    date: '2026-09-01',
    dueDate: '2026-09-15',
    status: 'Paid',
    amount: 15000,
    items: [
      { name: 'Website Design', qty: 1, price: 10000 },
      { name: 'Hosting Setup', qty: 1, price: 5000 },
    ],
  },
  {
    id: 'INV-102',
    clientName: 'Pooja Verma',
    clientEmail: 'pooja@gmail.com',
    date: '2026-09-02',
    dueDate: '2026-09-16',
    status: 'Pending',
    amount: 25000,
    items: [
      { name: 'E-commerce App', qty: 1, price: 25000 },
    ],
  },
  {
    id: 'INV-103',
    clientName: 'Amit Patel',
    clientEmail: 'amit@gmail.com',
    date: '2026-08-20',
    dueDate: '2026-09-05',
    status: 'Overdue',
    amount: 12000,
    items: [
      { name: 'Logo & Branding', qty: 1, price: 12000 },
    ],
  },
  {
    id: 'INV-104',
    clientName: 'Neha Gupta',
    clientEmail: 'neha@gmail.com',
    date: '2026-09-03',
    dueDate: '2026-09-17',
    status: 'Paid',
    amount: 8000,
    items: [
      { name: 'Bug Fixes', qty: 2, price: 4000 },
    ],
  },
  {
    id: 'INV-105',
    clientName: 'Vikas Kumar',
    clientEmail: 'vikas@gmail.com',
    date: '2026-09-04',
    dueDate: '2026-09-18',
    status: 'Pending',
    amount: 30000,
    items: [
      { name: 'Mobile App API', qty: 1, price: 30000 },
    ],
  },
  {
    id: 'INV-106',
    clientName: 'Suresh Reddy',
    clientEmail: 'suresh@gmail.com',
    date: '2026-08-15',
    dueDate: '2026-08-30',
    status: 'Overdue',
    amount: 18000,
    items: [
      { name: 'SEO Optimization', qty: 1, price: 18000 },
    ],
  },
];

// In-memory cache for resilient fallback
let invoicesCache = [...initialInvoices];

// Auto-seed MongoDB on startup
const seedInvoicesIfEmpty = async () => {
  if (!getIsConnected()) return;
  try {
    const count = await Invoice.countDocuments();
    if (count === 0) {
      await Invoice.insertMany(initialInvoices);
      console.log('Seeded initial invoices into MongoDB (invoices_db)');
    }
  } catch (err) {
    console.warn('Seed notice:', err.message);
  }
};

// Helper to get next guaranteed unique invoice ID across DB and cache
const getNextInvoiceId = async () => {
  let maxNum = 100;

  if (getIsConnected()) {
    try {
      const dbInvs = await Invoice.find({}, { id: 1 }).lean();
      dbInvs.forEach((inv) => {
        if (inv.id && typeof inv.id === 'string') {
          const num = parseInt(inv.id.replace(/^INV-/, ''), 10);
          if (!isNaN(num) && num > maxNum) maxNum = num;
        }
      });
    } catch (err) {
      console.warn('Error fetching max ID from MongoDB:', err.message);
    }
  }

  invoicesCache.forEach((inv) => {
    if (inv.id && typeof inv.id === 'string') {
      const num = parseInt(inv.id.replace(/^INV-/, ''), 10);
      if (!isNaN(num) && num > maxNum) maxNum = num;
    }
  });
  let candidateNum = maxNum + 1;
  let candidateId = `INV-${candidateNum}`;
  if (getIsConnected()) {
    try {
      while (await Invoice.exists({ id: candidateId })) {
        candidateNum++;
        candidateId = `INV-${candidateNum}`;
      }
    } catch (err) {
      console.warn('Error checking candidate ID existence:', err.message);
    }
  }
  return candidateId;
};
// 1. READ
const getInvoices = async (req, res) => {
  try {
    await seedInvoicesIfEmpty();
    if (getIsConnected()) {
      const dbInvoices = await Invoice.find().sort({ createdAt: -1 });
      if (dbInvoices && dbInvoices.length > 0) {
        const parsed = dbInvoices.map((doc) => (doc.toObject ? doc.toObject() : doc));
        invoicesCache = parsed;
        return res.json(parsed);
      }
    }
    return res.json(invoicesCache);
  } catch (error) {
    return res.json(invoicesCache);
  }
};
// 2. READ ONE:
const getInvoiceById = async (req, res) => {
  try {
    const { id } = req.params;
    if (getIsConnected()) {
      const invoice = await Invoice.findOne({ id });
      if (invoice) return res.json(invoice);
    }
    const found = invoicesCache.find((inv) => inv.id === id);
    if (!found) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    return res.json(found);
  } catch (error) {
    return res.status(500).json({ message: 'Error retrieving invoice', error: error.message });
  }
};
// 3. CREATE
const createInvoice = async (req, res) => {
  try {
    const { clientName, clientEmail, date, dueDate, status, amount, items } = req.body;
    // this is validation for the client 
   if (!clientName || amount === undefined || amount === null) {
      return res.status(400).json({ message: 'Client name and amount are required' });
    }  
    let newId = req.body.id;
    if (!newId || (getIsConnected() && (await Invoice.exists({ id: newId })))) {
      newId = await getNextInvoiceId();
    }

    const newInvoice = {
      id: newId,
      clientName,
      clientEmail: clientEmail || '',
      date: date || new Date().toISOString().split('T')[0],
      dueDate: dueDate || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      status: status || 'Pending',
      amount: Number(amount) || 0,
      items: items && items.length > 0 ? items : [{ name: 'Service', qty: 1, price: Number(amount) || 0 }],
    };
  
    if (getIsConnected()) {
      try {
        const createdDoc = await Invoice.create(newInvoice);
        const docObj = createdDoc.toObject ? createdDoc.toObject() : createdDoc;
        invoicesCache.unshift(docObj);
        return res.status(201).json({
          success: true,
          message: 'Invoice created successfully',
          invoice: docObj,
        });
      } catch (dbErr) {
        console.warn('Mongo create notice:', dbErr.message);
       
        const retryId = await getNextInvoiceId();
        newInvoice.id = retryId;
        const retryDoc = await Invoice.create(newInvoice);
        const docObj = retryDoc.toObject ? retryDoc.toObject() : retryDoc;
        invoicesCache.unshift(docObj);
        return res.status(201).json({
          success: true,
          message: 'Invoice created successfully',
          invoice: docObj,
        });
      }
    } else {
      invoicesCache.unshift(newInvoice);
      return res.status(201).json({
        success: true,
        message: 'Invoice created successfully',
        invoice: newInvoice,
      });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Failed to create invoice', error: error.message });
  }
};

// 4. UPDATE
const updateInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    let updatedInvoice = null;
  
    if (getIsConnected()) {
      updatedInvoice = await Invoice.findOneAndUpdate({ id }, updates, { new: true });
    }
    const index = invoicesCache.findIndex((inv) => inv.id === id);
    if (index !== -1) {
      invoicesCache[index] = { ...invoicesCache[index], ...updates };
      updatedInvoice = invoicesCache[index];
    }

    if (!updatedInvoice) {
      return res.status(404).json({ message: 'Invoice not found to update' });
    }
    return res.json({
      success: true,
      message: 'Invoice updated successfully',
      invoice: updatedInvoice,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update invoice', error: error.message });
  }
};

//  DELETE
const deleteInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    if (getIsConnected()) {
      await Invoice.findOneAndDelete({ id });
    }
    const exists = invoicesCache.some((inv) => inv.id === id);
    invoicesCache = invoicesCache.filter((inv) => inv.id !== id);

    if (!exists) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    return res.json({
      success: true,
      message: `Invoice ${id} deleted successfully`,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete invoice', error: error.message });
  }
};

module.exports = {
  getInvoices,
  getInvoiceById,
  createInvoice,
  updateInvoice,
  deleteInvoice,
};

