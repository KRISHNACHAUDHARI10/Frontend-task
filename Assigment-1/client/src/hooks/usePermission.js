import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { hasPermission } from '../utils/hasPermission';

export const usePermission = (moduleName, permission = 'VIEW') => {
  const { modules } = useContext(AuthContext);

  // If no specific moduleName is required, access is allowed by default
  if (!moduleName) return true;

  return hasPermission(modules, moduleName, permission);
};

export default usePermission;
