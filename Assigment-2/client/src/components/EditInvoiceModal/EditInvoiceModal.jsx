import React, { useState, useEffect } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import './EditInvoiceModal.scss';

const EditInvoiceModal = ({ invoice, isOpen, onClose, onSave }) => {
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState('Pending');
  const [items, setItems] = useState([]);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({ clientName: '', items: [] });

  useEffect(() => {
    if (invoice) {
      setClientName(invoice.clientName || '');
      setClientEmail(invoice.clientEmail || '');
      setDueDate(invoice.dueDate || '');
      setStatus(invoice.status || 'Pending');
      setItems(
        invoice.items && invoice.items.length > 0
          ? invoice.items.map((it) => ({
              name: it.name,
              qty: it.qty || 1,
              price: it.price || 0,
            }))
          : [{ name: 'Service', qty: 1, price: invoice.amount || 0 }]
      );
      setErrors({ clientName: '', items: [] });
    }
  }, [invoice]);

  if (!isOpen || !invoice) return null;

  const totalAmount = items.reduce((sum, item) => {
    const qty = Number(item.qty) || 0;
    const price = Number(item.price) || 0;
    return sum + qty * price;
  }, 0);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSaving(true);
    const sanitizedItems = items.map((item) => ({
      name: item.name.trim() || 'Service',
      qty: Math.max(1, Number(item.qty) || 1),
      price: Math.max(0, Number(item.price) || 0),
    }));

    const updatedData = {
      clientName: clientName.trim(),
      clientEmail: clientEmail.trim(),
      dueDate,
      status,
      amount: totalAmount,
      items: sanitizedItems,
    };

    try {
      await onSave(invoice.id, updatedData);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2>Update Invoice</h2>
            <p className="modal-subtitle">Edit details for invoice #{invoice.id}</p>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <CloseIcon sx={{ fontSize: 20 }} />
          </button> 
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="filter-group">
              <label>Client Name *</label>
              <input
                type="text"
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
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
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

          {/* Line items section */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label style={{ fontWeight: 600, fontSize: '0.85rem' }}>Line Items</label>
              <button
                type="button"
                onClick={handleAddItem}
                className="btn-small"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
              >
                <AddIcon sx={{ fontSize: 14 }} /> Add Row
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '220px', overflowY: 'auto' }}>
              {items.map((item, idx) => {
                const itemErrors = errors.items[idx] || {};
                return (
                <div
                  key={idx}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 70px 100px 80px 30px',
                    gap: '8px',
                    alignItems: 'start',
                    background: '#f8fafc',
                    padding: '8px',
                    borderRadius: '6px',
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <div className="filter-group">
                    <input
                      type="text"
                      placeholder="Description"
                      value={item.name}
                      className={itemErrors.name ? 'input-error' : ''}
                      onChange={(e) => handleItemChange(idx, 'name', e.target.value)}
                      style={{ padding: '6px 8px', fontSize: '0.82rem', borderRadius: '4px' }}
                    />
                    {itemErrors.name && <span className="field-error">{itemErrors.name}</span>}
                  </div>
                  <div className="filter-group">
                    <input
                      type="number"
                      min="1"
                      placeholder="Qty"
                      value={item.qty}
                      className={itemErrors.qty ? 'input-error' : ''}
                      onChange={(e) => handleItemChange(idx, 'qty', e.target.value)}
                      style={{ padding: '6px 8px', fontSize: '0.82rem', borderRadius: '4px' }}
                    />
                    {itemErrors.qty && <span className="field-error">{itemErrors.qty}</span>}
                  </div>
                  <div className="filter-group">
                    <input
                      type="number"
                      min="0"
                      placeholder="Price"
                      value={item.price}
                      className={itemErrors.price ? 'input-error' : ''}
                      onChange={(e) => handleItemChange(idx, 'price', e.target.value)}
                      style={{ padding: '6px 8px', fontSize: '0.82rem', borderRadius: '4px' }}
                    />
                    {itemErrors.price && <span className="field-error">{itemErrors.price}</span>}
                  </div>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155', textAlign: 'right', paddingTop: '8px' }}>
                    ₹{((Number(item.qty) || 0) * (Number(item.price) || 0)).toLocaleString()}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(idx)}
                    disabled={items.length <= 1}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: items.length <= 1 ? '#cbd5e1' : '#ef4444',
                      cursor: items.length <= 1 ? 'not-allowed' : 'pointer',
                      padding: '2px',
                      display: 'flex',
                      alignItems: 'center',
                      marginTop: '6px',
                    }}
                  >
                    <DeleteIcon sx={{ fontSize: 18 }} />
                  </button>
                </div>
                );
              })}
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: '#eef2ff',
              padding: '10px 14px',
              borderRadius: '6px',
            }}
          >
            <span style={{ fontWeight: 600, fontSize: '0.85rem', color: '#4338ca' }}>
              Calculated Total:
            </span>
            <span style={{ fontWeight: 700, fontSize: '1.1rem', color: '#3730a3' }}>
              ₹{totalAmount.toLocaleString()}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn btn-primary">
              {saving ? 'Updating...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditInvoiceModal;

