const express = require('express');
const router = express.Router();
const { login } = require('../controllers/authController');

// Route de connexion admin
router.post('/login', login);

module.exports = router; 