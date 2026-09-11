const express = require('express');
const router = express.Router();
const { login } = require('../controllers/authController');

// GET /api/auth/login (as requested) and POST /api/auth/login
router.get('/login', login);
router.post('/login', login);

module.exports = router;
