import React from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.scss';
import VisibilityIcon from '@mui/icons-material/Visibility';

const Dashboard = ({ invoices }) => {
  // 1. Total invoices count
  const totalInvoices = invoices.length;
  
  // 2. Paid invoices count
  const paidInvoices = invoices.filter((inv) => inv.status === 'Paid').length;
  // 3. Overdue invoices count
  const overdueInvoices = invoices.filter((inv) => inv.status === 'Overdue').length;
  // 4. Pending amount total 
  let pendingAmount = 0;
  invoices.forEach((inv) => {
    if (inv.status === 'Pending') {
      pendingAmount += inv.amount;
    }
  });

  return (
    <div className="page">
      <div className="page-header">
        <h1>Dashboard</h1>
        <Link to="/invoices" className="btn btn-primary">
          View All Invoices
        </Link>
      </div>

      {/* 4 Summary Cards */}
      <div className="stats-grid">
        <div className="stat-card total-card">
          <h4>Total Invoices</h4>
          <h2>{totalInvoices}</h2>
        </div>
        <div className="stat-card paid-card">
          <h4>Paid Invoices</h4>
          <h2>{paidInvoices}</h2>
        </div>
        <div className="stat-card pending-card">
          <h4>Pending Amount</h4>
          <h2>₹{pendingAmount}</h2>
        </div>
        <div className="stat-card overdue-card">
          <h4>Overdue Invoices</h4>
          <h2>{overdueInvoices}</h2>
        </div>
      </div>

      {/* Recent Invoices Table */}
      <div className="card" style={{ marginTop: '20px' }}>
        <h3>Recent Invoices</h3>
        <table className="custom-table" style={{ marginTop: '12px' }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Client</th>
              <th>Date</th>
              <th>Amount (₹)</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {invoices.slice(0, 4).map((inv) => (
              <tr key={inv.id}>
                <td><strong>{inv.id}</strong></td>
                <td>{inv.clientName}</td>
                <td>{inv.date}</td>
                <td>₹{inv.amount}</td>
                <td>
                  <span className={`badge badge-${inv.status.toLowerCase()}`}>
                    {inv.status}
                  </span>
                </td>
                <td>
                  <Link
                    to={`/invoices/${inv.id}`}
                    className="action-btn action-btn-view"
                    title="View Invoice Details"
                  >
                    <VisibilityIcon sx={{ fontSize: 18 }} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
