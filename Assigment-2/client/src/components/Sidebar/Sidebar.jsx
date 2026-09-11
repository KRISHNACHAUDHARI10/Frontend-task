import React from 'react';
import { NavLink } from 'react-router-dom';
import GridViewIcon from '@mui/icons-material/GridView';
import ReceiptIcon from '@mui/icons-material/Receipt';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <h3>Menu</h3>
      <ul>
        <li>
          <NavLink
            to="/dashboard"
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            <GridViewIcon /> Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/invoices"
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            <ReceiptIcon /> Invoices
          </NavLink>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
