const express = require('express');

const router = express.Router();

const { getModules } = require('../controllers/moduleController');

router.get('/modules', getModules);

module.exports = router;