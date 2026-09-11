import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { initialInvoices } from './services/invoiceApi';
import { fetchInvoices, updateInvoice } from './services/api';
import Navbar from './components/Navbar/Navbar';
import Sidebar from './components/Sidebar/Sidebar';
import Dashboard from './pages/Dashboard/Dashboard';
import Invoices from './pages/Invoices/Invoices';
import InvoiceDetails from './pages/InvoiceDetails/InvoiceDetails';
import CreateInvoice from './pages/CreateInvoice/CreateInvoice';
import './App.scss';
 
function App() {
  const [invoices, setInvoices] = useState(initialInvoices);
  const [role, setRole] = useState('Admin'); // 'Admin' or 'Viewer'

  // READ ALL via centralized api service
  useEffect(() => {
    fetchInvoices()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setInvoices(data);
        }
      })
      .catch((err) => {
        console.log('Using local invoice data (fallback):', err.message);
      });
  }, []);

  // CREATE: Append newly created invoice
  const handleAddInvoice = (newInvoice) => {
    setInvoices((prev) => [newInvoice, ...prev]);
  };

  // UPDATE: Mark as paid via api service
  const handleMarkPaid = async (id) => {
    try {
      await updateInvoice(id, { status: 'Paid' });
    } catch (err) {
      console.warn('API error:', err.message);
    }

    setInvoices((prev) =>
      prev.map((inv) => (inv.id === id ? { ...inv, status: 'Paid' } : inv))
    );
  };

  return (
    <BrowserRouter>
      <div className="app-container">
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              fontSize: '0.9rem',
              borderRadius: '8px',
              padding: '12px 18px',
            },
          }}
        />
        <Navbar role={role} setRole={setRole} />
        <div className="app-body">
          <Sidebar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard invoices={invoices} />} />
              
              <Route
                path="/invoices"
                element={
                  <Invoices
                    invoices={invoices}
                    setInvoices={setInvoices}
                    role={role}
                  />
                }
              />

              <Route
                path="/invoices/create"
                element={<CreateInvoice onAddInvoice={handleAddInvoice} />}
              />
              
              <Route
                path="/invoices/:id"
                element={
                  <InvoiceDetails
                    invoices={invoices}
                    role={role}
                    onMarkPaid={handleMarkPaid}
                  />
                }
              />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
