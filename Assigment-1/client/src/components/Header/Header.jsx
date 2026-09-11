import React, { useState, useContext, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import invoiceLogo from '../../assets/invoice-logo.jpg';
import LogoutIcon from '@mui/icons-material/Logout';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import './Header.scss';

const Header = () => {
  const { user, currentRole, logout, isAuthenticated } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const role = currentRole || (typeof user === 'string' ? user : user?.role) || 'UserA';
  const username = typeof user === 'string' ? user : (user?.username || role);

  // Character to show inside circle: "A" or "B"
  const avatarChar = role === 'UserB' || role?.toLowerCase().includes('b') ? 'B' : 'A';

  // Handle outside click to close dropdown
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [dropdownOpen]);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/login', { replace: true });
  };

  return (
    <header className="header">
      {/* Top Left Logo */}
      <div
        className="logo-container"
        style={{ cursor: 'pointer' }}
        onClick={() => navigate(isAuthenticated ? '/dashboard' : '/login')}
      >
        <img
          src={invoiceLogo}
          alt="System Logo"
          className="app-logo"
        />
        <span className="brand-title">Role Based Navigation System</span>
      </div>

      {/* Header Right Actions */}
      <div className="header-actions" ref={dropdownRef}>
        {isAuthenticated ? (
          <>
            {/* ONLY the circle avatar with A or B and down-arrow icon */}
            <button
              type="button"
              className="avatar-trigger"
              onClick={() => setDropdownOpen((prev) => !prev)}
              title={`User ${avatarChar} - Click for Logout`}
            >
              <div className={`user-avatar-circle ${avatarChar === 'A' ? 'avatar-a' : 'avatar-b'}`}>
                {avatarChar}
              </div>
              <KeyboardArrowDownIcon
                className="arrow-icon"
                sx={{
                  color: '#ffffff',
                  fontSize: 20,
                  transform: dropdownOpen ? 'rotate(180deg)' : 'none',
                  transition: 'transform 0.2s ease',
                }}
              /> 
            </button>

            {/* Dropdown Menu showing Logout Button on Click */}
            {dropdownOpen && (
              <div className="user-dropdown-menu">
                <div className="dropdown-header">
                  <div className={`dropdown-avatar-circle ${avatarChar === 'A' ? 'avatar-a' : 'avatar-b'}`}>
                    {avatarChar}
                  </div>
                  <div className="user-info">
                    <strong>{username}</strong>
                    <small>{avatarChar === 'A' ? 'User A (Orders + Billing)' : 'User B (Orders Only)'}</small>
                  </div>
                </div>

                {/* Logout Button */}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="dropdown-logout-btn"
                >
                  <LogoutIcon sx={{ fontSize: 18 }} /> Logout
                </button>
              </div>
            )}
          </>
        ) : null}
      </div>
    </header>
  );
};

export default Header;