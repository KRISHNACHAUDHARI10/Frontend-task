import React from 'react';
import './Billing.scss';

const Billing = () => {

  const invoices = [

    { id: 'order -1', item: 'Milk', amount: '₹4,500', status: 'Paid' },
    { id: 'order -2', item: 'Domain', amount: '₹1,200', status: 'Paid' },
    { id: 'order -3', item: 'Storage', amount: '₹2,500', status: 'Pending' },
    { id: 'order -4', item: 'Certificate', amount: '₹899', status: 'Paid' },


  ];

  return (
    <div className="page">
      <div className="billing-header">
        <h1>Billing</h1>
        <p>
          This module is accessible only to users with
          <strong> Billing </strong> permission.
        </p>
      </div>
      <div className="box">
        <h3>Invoice Details (in Rupees)</h3>
        <div className="table-container">
          <table className="billing-table">
            <thead>
               <tr>
                <th>Invoice ID</th>
                <th>Description</th>
                <th>Amount (₹)</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id}>
                  <td className="invoice-id">
                    {inv.id}
                  </td>
                  <td>
                    {inv.item}
                  </td>
                  <td className="amount">
                    {inv.amount}
                  </td>
                  <td>
                    <span
                      className={
                        inv.status === 'Paid'
                          ? 'status paid'
                          : 'status pending'
                      }
                    >
                      {inv.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Billing;

