
import React, { useState } from 'react';
import PermissionButton from '../../components/Button/PermissionButton';
import './Orders.scss';
const Orders = () => {
  const [orders, setOrders] = useState([
    { id: 101, item: 'Laptop', price: '₹55,000' },
    { id: 102, item: 'Wireless Mouse', price: '₹650' },
    { id: 103, item: 'Keyboard', price: '₹1,500' },
  ]);
  const addOrder = () => {
    const newId = orders.length + 101;
    setOrders([
      ...orders,
      {
        id: newId,
        item: `New Item ${newId}`,
        price: '₹159',
      },
    ]);
  };
  return (
    <div className="page">
      <div className="page-header">
        <h1>Orders</h1>
        <PermissionButton
          moduleName="Orders"
          permission="CREATE"
          onClick={addOrder}
        >
          + Create New Order
        </PermissionButton>
      </div>
      <div className="box">
        <p className="permission-note">
          Note: &quot;+ Create New Order&quot; button appears only for User A
          because User A has <strong>CREATE</strong> permission.
        </p>
        <div className="table-container">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Item Name</th>
                <th>Price (₹)</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="order-id">#{order.id}</td>
                  <td>{order.item}</td>
                  <td className="price">{order.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default Orders;

