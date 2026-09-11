// Check if a module has a specific permission
export const hasPermission = (modules = [], moduleName, permissionName = 'VIEW') => {
  if (!moduleName) return true;
  if (!Array.isArray(modules)) return false;

  const targetName = String(moduleName).toLowerCase();

  const module = modules.find(
    (m) => m && m.name && String(m.name).toLowerCase() === targetName
  );

  return module && Array.isArray(module.permission)
    ? module.permission.includes(permissionName)
    : false;
};