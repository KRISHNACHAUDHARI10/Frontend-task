const mongoose = require('mongoose');

const invoiceItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  qty: { type: Number, required: true, default: 1 },
  price: { type: Number, required: true, default: 0 },
});

const invoiceSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    clientName: { type: String, required: true },
    clientEmail: { type: String, default: '' },
    date: { type: String, required: true },
    dueDate: { type: String, required: true },
    status: {
      type: String,
      enum: ['Paid', 'Pending', 'Overdue'],
      default: 'Pending',
    },
    amount: { type: Number, required: true },
    items: [invoiceItemSchema],
  },
  { timestamps: true }
);

const Invoice = mongoose.models.Invoice || mongoose.model('Invoice', invoiceSchema);

module.exports = Invoice;

