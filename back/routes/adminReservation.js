const express = require("express");
const router = express.Router();
const adminAuth = require("../middleware/adminAuth");
const { getAllReservations, updateReservation } = require("../controllers/adminController");

// Route pour obtenir toutes les réservations
router.get('/reservations', adminAuth, getAllReservations);

// Route pour mettre à jour une réservation
router.put('/reservations/:id', adminAuth, updateReservation);

module.exports = router; 