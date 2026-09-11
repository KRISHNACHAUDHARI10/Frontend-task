// Fetch modules and permissions from Node.js API
export const fetchUserPermissions = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/modules');

    if (!response.ok) {
      throw new Error('Failed to fetch permissions');
    }

    const data = await response.json();

    return data.modules;
  } catch (error) {
    console.error('Error fetching permissions:', error);
    return [];
  }
};

export default {
  fetchUserPermissions,
};