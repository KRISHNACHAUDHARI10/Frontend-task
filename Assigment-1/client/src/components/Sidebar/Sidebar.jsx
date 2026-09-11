import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './Sidebar.scss';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ReceiptIcon from '@mui/icons-material/Receipt';

const Sidebar = () => {
  const { user, currentRole, modules, isAuthenticated } = useContext(AuthContext);

  if (!isAuthenticated) {
    return null;
  }

  const getModuleIcon = (name = '') => {
    switch (name.toLowerCase()) {
      case 'orders':
        return <ShoppingCartIcon />;
      case 'billing':
        return <ReceiptIcon />;
      default:
        return <ShoppingCartIcon />;
    }
  };

  const role = currentRole || (typeof user === 'string' ? user : user?.role) || 'UserA';
  const isUserB = role.toLowerCase() === 'userb' || role.toLowerCase() === 'b' || role.toLowerCase().includes('user b');

  return (
    <aside className="sidebar">
      <h3>Navigation</h3>
      <ul>
        <li>
          <NavLink
            to="/dashboard"
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            <DashboardIcon /> Dashboard
          </NavLink>
        </li>

        {/* Generate sidebar dynamically based on allowed modules */}
        {modules
          .filter((item) => {
            const hasViewPermission = item.permission ? item.permission.includes('VIEW') : true;
            if (!hasViewPermission) return false;

            // User B does NOT see Billing in sidebar
            if (isUserB && item.name.toLowerCase() === 'billing') {
              return false;
            }
            return true;
          })
          .map((item) => (
            <li key={item.name}>
              <NavLink
                to={`/${item.name.toLowerCase()}`}
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                {getModuleIcon(item.name)} {item.name}
              </NavLink>
            </li>
          ))}
      </ul>
    </aside>
  );
};

export default Sidebar;