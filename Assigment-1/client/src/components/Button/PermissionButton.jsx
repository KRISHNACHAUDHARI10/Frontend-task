import React from 'react';
import { usePermission } from '../../hooks/usePermission';
const PermissionButton = ({ moduleName, permission, children, onClick }) => {
  const isAllowed = usePermission(moduleName, permission);
  
  // If user does not have permission, don't show the button
  
  
  if (!isAllowed) {
    return null;
  }
  return (
    <button onClick={onClick} className="btn">
      {children}
    </button>
   );
};
export default PermissionButton;
