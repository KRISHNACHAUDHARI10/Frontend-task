const express = require('express');
const router = express.Router();
const {
  getInvoices,
  getInvoiceById,
  createInvoice,
  updateInvoice,
  deleteInvoice,
} = require('../controllers/invoiceController');

router.get('/', getInvoices);

router.get('/:id', getInvoiceById);

router.post('/', createInvoice);

router.put('/:id', updateInvoice);

router.delete('/:id', deleteInvoice);

module.exports = router;

