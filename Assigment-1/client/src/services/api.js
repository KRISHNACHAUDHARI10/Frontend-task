const defaultModules = [
  {
    name: 'Orders',
    permission: ['VIEW', 'CREATE']
  },
  {
    name: 'Billing',
    permission: ['VIEW']
  }
];

export const fetchUserPermissions = async (user) => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1000); // 1s fast timeout

    const response = await fetch(
      `http://localhost:5000/api/modules?user=${user}`,
      { signal: controller.signal }
    );
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error('Failed to fetch permissions');
    }
    const data = await response.json();
    return data.modules || defaultModules;
  } catch (error) {
    return defaultModules;
  }
};

export default {
  fetchUserPermissions,
};