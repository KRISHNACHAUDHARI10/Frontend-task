const modules = require('../models/moduleModel');

const getModules = (req, res) => {
  const user = req.query.user || req.query.role || '';

  // User B sees Orders only (Billing is hidden)
  if (user.toLowerCase() === 'userb' || user.toLowerCase() === 'b' || user.toLowerCase().includes('user b')) {
    const userBModules = modules.filter(
      (mod) => mod.name.toLowerCase() !== 'billing'
    );
    return res.json({ modules: userBModules });
  }

  // Default / User A sees both Orders and Billing
  res.json({ modules: modules });
};

module.exports = {
  getModules,
};