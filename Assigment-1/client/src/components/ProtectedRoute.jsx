import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { usePermission } from '../hooks/usePermission';

const ProtectedRoute = ({ moduleName, children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  const location = useLocation();
  const canView = usePermission(moduleName, 'VIEW');

  // 1. If not authenticated, redirect to /login preserving attempted location
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // 2. If authenticated but lacks module permission, redirect to unauthorized
  if (moduleName && !canView) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;