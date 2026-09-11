const modules = require('../models/moduleModel');

const getModules = (req, res) => {
  const user = req.query.user || req.query.role || '';

  
  if (user.toLowerCase() === 'userb' || user.toLowerCase() === 'b' || user.toLowerCase().includes('user b')) {
    const userBModules = modules.filter(
      (mod) => mod.name.toLowerCase() !== 'billing'
    );
    return res.json({ modules: userBModules });
  }

  res.json({ modules: modules });
};

module.exports = {
  getModules,
};