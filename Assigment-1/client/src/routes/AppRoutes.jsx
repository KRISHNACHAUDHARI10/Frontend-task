import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Login from '../pages/Login/Login';
import Dashboard from '../pages/Dashboard/Dashboard';
import Orders from '../pages/Orders/Orders';
import Billing from '../pages/Billing/Billing';
import Unauthorized from '../pages/Unauthorized/Unauthorized';
import ProtectedRoute from '../components/ProtectedRoute';

const AppRoutes = () => {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <Routes>
      {/* Public Login Route (redirects to dashboard if already authenticated) */}
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />}
      />

      {/* Root redirects to dashboard */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* Protected Dashboard Route */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Protected Orders Route (User A & User B) */}
      <Route
        path="/orders"
        element={
          <ProtectedRoute moduleName="Orders">
            <Orders />
          </ProtectedRoute>
        }
      />

      {/* Protected Billing Route (User A only - User B gets Unauthorized) */}
      <Route
        path="/billing"
        element={
          <ProtectedRoute moduleName="Billing">
            <Billing />
          </ProtectedRoute>
        }
      />

      {/* Unauthorized 403 Page */}
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* 404 Not Found */}
      <Route path="*" element={<h2 style={{ padding: '2rem' }}>404 - Page Not Found</h2>} />
    </Routes>
  );
};

export default AppRoutes;