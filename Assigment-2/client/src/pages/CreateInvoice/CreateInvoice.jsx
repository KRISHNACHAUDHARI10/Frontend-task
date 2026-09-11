import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { createInvoice } from '../../services/api';
import './CreateInvoice.scss';

const CreateInvoice = ({ onAddInvoice }) => {
  const navigate = useNavigate();
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(
    new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]
  );
  const [status, setStatus] = useState('Pending');
  const [items, setItems] = useState([
    { name: '', qty: 1, price: '' },
  ]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ clientName: '', items: [] });

  // Auto-calculated total price
  const totalAmount = items.reduce((sum, item) => {
    const qty = Number(item.qty) || 0;
    const price = Number(item.price) || 0;
    return sum + qty * price;
  }, 0);

  const validateForm = () => {
    const nextErrors = { clientName: '', items: [] };
    let isValid = true;

    if (!clientName.trim()) {
      nextErrors.clientName = 'Client name is required';
      isValid = false;
    }

    items.forEach((item) => {
      const itemErrors = { name: '', qty: '', price: '' };
      if (!String(item.name || '').trim()) {
        itemErrors.name = 'Item name is required';
        isValid = false;
      }
      if (item.qty === '' || item.qty === null || Number(item.qty) < 1) {
        itemErrors.qty = 'Qty is required';
        isValid = false;
      }
      if (item.price === '' || item.price === null || Number(item.price) <= 0) {
        itemErrors.price = 'Price is required';
        isValid = false;
      }
      nextErrors.items.push(itemErrors);
    });

    setErrors(nextErrors);
    return isValid;
  };

  const handleItemChange = (index, field, value) => {
    setItems((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
    setErrors((prev) => {
      const nextItems = [...(prev.items || [])];
      if (nextItems[index]) {
        nextItems[index] = { ...nextItems[index], [field]: '' };
      }
      return { ...prev, items: nextItems };
    });
  };

  const handleAddItem = () => {
    setItems((prev) => [...prev, { name: '', qty: 1, price: '' }]);
    setErrors((prev) => ({
      ...prev,
      items: [...(prev.items || []), { name: '', qty: '', price: '' }],
    }));
  };

  const handleRemoveItem = (index) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((_, i) => i !== index));
    setErrors((prev) => ({
      ...prev,
      items: (prev.items || []).filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    const sanitizedItems = items.map((item) => ({
      name: item.name.trim() || 'Service / Product',
      qty: Math.max(1, Number(item.qty) || 1),
      price: Math.max(0, Number(item.price) || 0),
    }));

    const newInvoice = {
      clientName: clientName.trim(),
      clientEmail: clientEmail.trim(),
      date,
      dueDate,
      status,
      amount: totalAmount,
      items: sanitizedItems,
    };

    try {
      // POST /api/invoices via centralized api service
      const data = await createInvoice(newInvoice);
      if (onAddInvoice) {
        onAddInvoice(data.invoice || newInvoice);
      }
      toast.success('Invoice generated successfully', {
        style: {
          background: '#059669',
          color: '#ffffff',
          fontWeight: '500',
          padding: '12px 20px',
        },
        iconTheme: {
          primary: '#ffffff',
          secondary: '#059669',
        },
      });
      navigate('/invoices');
    } catch (err) {
      // Fallback if backend server is offline
      const fallbackInvoice = { id: `INV-${Date.now().toString().slice(-3)}`, ...newInvoice };
      if (onAddInvoice) onAddInvoice(fallbackInvoice);
      toast.success('Invoice generated successfully (local mode)', {
        style: {
          background: '#059669',
          color: '#ffffff',
          fontWeight: '500',
          padding: '12px 20px',
        },
        iconTheme: {
          primary: '#ffffff',
          secondary: '#059669',
        },
      });
      navigate('/invoices');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Create New Invoice</h1>
          <p>Add a new invoice record with dynamic line items</p>
        </div>
        <Link to="/invoices" className="btn-back">
          <ArrowBackIcon sx={{ fontSize: 18 }} /> Back to Invoices
        </Link>
      </div>

      <div className="card" style={{ maxWidth: '820px', marginTop: '20px' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Client Info */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="filter-group">
              <label>Client Name *</label>
              <input
                type="text"
                placeholder="e.g. Ramesh Patel"
                value={clientName}
                className={errors.clientName ? 'input-error' : ''}
                onChange={(e) => {
                  setClientName(e.target.value);
                  if (errors.clientName) {
                    setErrors((prev) => ({ ...prev, clientName: '' }));
                  }
                }}
              />
              {errors.clientName && <span className="field-error">{errors.clientName}</span>}
            </div>

            <div className="filter-group">
              <label>Client Email</label>
              <input
                type="email"
                placeholder="e.g. ramesh@example.com"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Dates & Status */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
            <div className="filter-group">
              <label>Invoice Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div className="filter-group">
              <label>Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>

            <div className="filter-group">
              <label>Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
                <option value="Overdue">Overdue</option>
              </select>
            </div>
          </div>

          <hr style={{ borderColor: '#e2e8f0', margin: '4px 0' }} />

          {/* Dynamic Items*/}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div>
                <h3 style={{ fontSize: '1.05rem', color: '#0f172a', fontWeight: '600' }}>Line Items</h3>
                <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Add item description, quantity, and unit price</p>
              </div>
              <button
                type="button"
                onClick={handleAddItem}
                className="btn btn-secondary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', padding: '6px 12px' }}
              >
                <AddIcon sx={{ fontSize: 16 }} /> Add Item
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {items.map((item, idx) => {
                const rowTotal = (Number(item.qty) || 0) * (Number(item.price) || 0);
                const itemErrors = errors.items[idx] || {};
                return (
                  <div
                    key={idx}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '2.5fr 1fr 1.3fr 1fr 40px',
                      gap: '10px',
                      alignItems: 'start',
                      background: '#f8fafc',
                      padding: '12px',
                      borderRadius: '6px',
                      border: '1px solid #e2e8f0',
                    }}
                  >
                    <div className="filter-group">
                      <label style={{ fontSize: '0.78rem' }}>Item Description / Name *</label>
                      <input
                        type="text"
                        placeholder="e.g. wafar or Website Design"
                        value={item.name}
                        className={itemErrors.name ? 'input-error' : ''}
                        onChange={(e) => handleItemChange(idx, 'name', e.target.value)}
                      />
                      {itemErrors.name && <span className="field-error">{itemErrors.name}</span>}
                    </div>

                    <div className="filter-group">
                      <label style={{ fontSize: '0.78rem' }}>Qty *</label>
                      <input
                        type="number"
                        min="1"
                        placeholder="1"
                        value={item.qty}
                        className={itemErrors.qty ? 'input-error' : ''}
                        onChange={(e) => handleItemChange(idx, 'qty', e.target.value)}
                      />
                      {itemErrors.qty && <span className="field-error">{itemErrors.qty}</span>}
                    </div>

                    <div className="filter-group">
                      <label style={{ fontSize: '0.78rem' }}>Price (₹) *</label>
                      <input
                        type="number"
                        min="0"
                        placeholder="e.g. 50000"
                        value={item.price}
                        className={itemErrors.price ? 'input-error' : ''}
                        onChange={(e) => handleItemChange(idx, 'price', e.target.value)}
                      />
                      {itemErrors.price && <span className="field-error">{itemErrors.price}</span>}
                    </div>

                    <div className="filter-group">
                      <label style={{ fontSize: '0.78rem' }}>Row Total</label>
                      <div
                        style={{
                          padding: '6px 10px',
                          background: '#ffffff',
                          border: '1px solid #cbd5e1',
                          borderRadius: '4px',
                          fontSize: '0.85rem',
                          fontWeight: '600',
                          color: '#334155',
                          height: '32px',
                          boxSizing: 'border-box',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        ₹{rowTotal.toLocaleString()}
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '22px' }}>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        disabled={items.length <= 1}
                        title={items.length <= 1 ? 'At least one item required' : 'Remove item'}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: items.length <= 1 ? '#cbd5e1' : '#ef4444',
                          cursor: items.length <= 1 ? 'not-allowed' : 'pointer',
                          padding: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <DeleteIcon sx={{ fontSize: 20 }} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Total Price Auto-Generated Banner */}
          <div
            style={{
              background: '#eef2ff',
              border: '1px solid #c7d2fe',
              borderRadius: '8px',
              padding: '16px 20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <span style={{ fontSize: '0.85rem', color: '#4338ca', fontWeight: '700', textTransform: 'uppercase' }}>
                Total Amount 
              </span>
          
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: '700', color: '#3730a3' }}>
              ₹{totalAmount.toLocaleString()}
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ minWidth: '170px' }}
            >
              {loading ? 'Creating...' : 'Save & Create Invoice'}
            </button>
            <Link to="/invoices" className="btn btn-secondary" style={{ padding: '8px 16px' }}>
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateInvoice;

