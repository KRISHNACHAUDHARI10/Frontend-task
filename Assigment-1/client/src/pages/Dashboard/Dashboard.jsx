import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import './Dashboard.scss';

const Dashboard = () => {
  const { user, modules } = useContext(AuthContext);

  const displayName =
    typeof user === 'string'
      ? user
      : user?.username || user?.name || user?.role || 'User';

  return (
    <div className="page">
      <div className="dashboard-header">
        <div>
          <p className="dashboard-label">ROLE BASED ACCESS</p>
          <h1>Welcome to your Dashboard</h1>
          <p className="dashboard-description">
            Manage your modules and access permissions from one place.
            Your navigation and available actions are based on your assigned permissions.
          </p>
        </div>

        <div className="access-card">
          <span className="access-icon">🔐</span>
          <div>
            <span className="access-title">Access Control</span>
            <span className="access-text">Permission-based navigation</span>
          </div>
        </div>
      </div>

      <div className="box">
        <h3>Allowed Modules</h3>
        <p className="box-description">
          Modules and permissions available for <strong>{displayName}</strong>:
        </p>
        <ul className="module-list">
          {modules && modules.map((m) => (
            <li key={m.name}>
              <strong>{m.name}</strong>
              <span>
                Permissions: {m.permission ? m.permission.join(', ') : 'VIEW'}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;