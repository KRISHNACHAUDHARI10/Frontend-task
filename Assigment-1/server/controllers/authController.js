const User = require('../models/userModel');
const { getIsConnected } = require('../config/db');

// Module permissions specification
const MODULES_CONFIG = {
  UserA: [
    { name: 'Orders', permission: ['VIEW', 'CREATE'] },
    { name: 'Billing', permission: ['VIEW'] },
  ],
  UserB: [
    { name: 'Orders', permission: ['VIEW', 'CREATE'] },
  ],
};

// Login Controller supporting GET /login and POST /login
const login = async (req, res) => {
  try {
    const rawUsername =
      req.query?.username ||
      req.query?.user ||
      req.body?.username ||
      '';

    const cleanUsername = String(rawUsername).trim();

    if (!cleanUsername) {
      return res.status(401).json({
        message: 'Invalid username or password',
      });
    }

    const lower = cleanUsername.toLowerCase();

    // STRICT VALIDATION: Only User A and User B are valid users
    // If any user types 'c', 'wekfjbfew', or any other word, return 401
    let role = null;
    let standardName = cleanUsername;

    if (lower === 'usera' || lower === 'user a' || lower === 'a') {
      role = 'UserA';
      standardName = 'User A';
    } else if (lower === 'userb' || lower === 'user b' || lower === 'b') {
      role = 'UserB';
      standardName = 'User B';
    } else {
      return res.status(401).json({
        message: 'Invalid username or password',
      });
    }

    const assignedModules = MODULES_CONFIG[role];

    let savedUser = null;

    // Store in MongoDB Database if connected
    if (getIsConnected()) {
      try {
        savedUser = await User.findOneAndUpdate(
          { username: standardName },
          { username: standardName, role, modules: assignedModules },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
        console.log(`💾 Stored user '${standardName}' (${role}) in MongoDB Database.`);
      } catch (dbErr) {
        console.warn('DB store notice:', dbErr.message);
      }
    }

    const token = 'mock_jwt_token_' + Date.now();

    return res.json({
      success: true,
      message: `Welcome ${standardName}! Role: ${role}`,
      token,
      user: {
        id: savedUser ? savedUser._id : `usr_${role.toLowerCase()}`,
        username: standardName,
        role,
      },
      modules: assignedModules,
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal server error during login' });
  }
};

module.exports = {
  login,
  MODULES_CONFIG,
};
