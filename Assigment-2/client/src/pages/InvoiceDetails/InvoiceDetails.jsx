import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PrintIcon from '@mui/icons-material/Print';
import { fetchInvoiceById } from '../../services/api';
import './InvoiceDetails.scss';

const InvoiceDetails = ({ invoices = [] }) => {
  
  const { id } = useParams();
  const [invoice, setInvoice] = useState(() => invoices.find((item) => item.id === id));
  const [loading, setLoading] = useState(!invoice);

  useEffect(() => {
    const existing = invoices.find((item) => item.id === id);
    if (existing) {
    
      setInvoice(existing);
      setLoading(false);
    
    } else {
      // READ ONE via centralized api service
      fetchInvoiceById(id)
       
      .then((data) => {
          if (data) setInvoice(data);
        })
        .catch((err) => {
          console.warn('Could not fetch single invoice:', err.message);
        })
        .finally(() => setLoading(false));
    }
  }, [id, invoices]);

  if (loading) {
    return (
      <div className="page">
        <p>Loading invoice details...</p>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="page">
  
        <h2>Invoice not found!</h2>
  
        <Link to="/invoices" className="btn-back" style={{ marginTop: '14px' }}>
          <ArrowBackIcon sx={{ fontSize: 18 }} /> Back to Invoices
        </Link>
  
      </div>
    );
  }

  // Calculate Subtotal & Total
  let subtotal = 0;
  invoice.items.forEach((item) => {
    subtotal += item.qty * item.price;
  });

  const tax = Math.round(subtotal * 0.18);
  const grandTotal = subtotal + tax;

  // Print/Download invoice
  const handleDownload = () => {
    window.print();
  };

  return (
    <div className="page">
      <div className="page-header no-print">
        
        <Link to="/invoices" className="btn-back">

          <ArrowBackIcon sx={{ fontSize: 18 }} /> Back to Invoices

        </Link>
        
        <button
          onClick={handleDownload}
          className="btn-print"
        >
        
          <PrintIcon sx={{ fontSize: 18 }} /> Download / Print Invoice
        
        </button>
      </div>

      <div className="card invoice-card">
        
        {/* Invoice Summary */}
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
        
            <h1>INVOICE</h1>
            <p><strong>Invoice ID:</strong> {invoice.id}</p>
            <p><strong>Date:</strong> {invoice.date}</p>
            <p><strong>Due Date:</strong> {invoice.dueDate}</p>
        
          </div>
          <div>
        
            <span className={`badge badge-${invoice.status.toLowerCase()}`}>

              {invoice.status}

            </span>
        
          </div>
        </div>

        <hr style={{ margin: '20px 0', borderColor: '#e2e8f0' }} />

        {/* Client details */}
        <div>

          <h4>Billed To:</h4>
          <p><strong>{invoice.clientName}</strong></p>
          <p>{invoice.clientEmail}</p>

        </div>

        {/* Line Items Table */}
        <h4 style={{ marginTop: '20px', marginBottom: '8px' }}>Line Items:</h4>
        
        <table className="custom-table">
          <thead>
            <tr>

              <th>Item</th>
              <th>Qty</th>
              <th>Price (₹)</th>
              <th>Total (₹)</th>

            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, index) => (
              <tr key={index}>
                <td>{item.name}</td>
                <td>{item.qty}</td>
                <td>₹{item.price}</td>
                <td>₹{item.qty * item.price}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div style={{ textAlign: 'right', marginTop: '20px', fontSize: '1rem' }}>
          
          <p>Subtotal: <strong>₹{subtotal}</strong></p>
          <p>GST (18%): <strong>₹{tax}</strong></p>
          <h3 style={{ marginTop: '10px' }}>
            Grand Total: ₹{grandTotal}
          </h3>
        </div>
      </div>
    </div>

);

};

export default InvoiceDetails;
