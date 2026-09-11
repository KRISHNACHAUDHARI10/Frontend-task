import React from 'react';
import logo from '../../assets/invoice-logo.jpg';
import './Navbar.scss';

const Navbar = ({ role, setRole }) => {
  return (
    <header className="navbar">
      <div className="navbar-brand">
        <img src={logo} alt="Invoice Logo" className="navbar-logo" />
        <h2>Invoice Management System</h2>
      </div>
      <div className="navbar-user">
        <span>Current Role: <strong>{role}</strong></span>
        
        <button
          className="role-toggle-btn"
          onClick={() => setRole(role === 'Admin' ? 'Viewer' : 'Admin')}   
        >
          Switch to {role === 'Admin' ? 'Viewer' : 'Admin'}
        </button>
      </div>
    </header>
  );
};

export default Navbar;
