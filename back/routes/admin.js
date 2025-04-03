const express = require('express');
const router = express.Router();
const { loginAdmin, verifyAdmin } = require('../controllers/adminController');
const adminAuth = require('../middleware/adminAuth');

// Route de connexion admin
router.post('/login', loginAdmin);

// Route pour vérifier le token admin
router.get('/verify', adminAuth, verifyAdmin);

module.exports = router; 