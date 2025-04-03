const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth");
const {
  reserve,
  getReservedTimes
} = require("../controllers/reservationController");
const Reservation = require('../models/Reservation');

// Route pour obtenir les horaires réservés
router.get('/reserved-times', protect, async (req, res) => {
    try {
        const { hairdresserId, date } = req.query;
        
        if (!hairdresserId || !date) {
            return res.status(400).json({ 
                message: 'hairdresserId et date sont requis' 
            });
        }

        const startDate = new Date(date);
        startDate.setHours(0, 0, 0, 0);
        
        const endDate = new Date(date);
        endDate.setHours(23, 59, 59, 999);

        const reservations = await Reservation.find({
            hairdresserId,
            date: {
                $gte: startDate,
                $lte: endDate
            }
        });
        
        const reservedTimes = reservations.map(reservation => reservation.time);
        res.json(reservedTimes);
    } catch (error) {
        console.error('Erreur serveur:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// Route pour créer une réservation
router.post('/', protect, async (req, res) => {
    try {
        const { selectedService, selectedDate, selectedTime, selectedSalon, selectedHairdresser, userInfo } = req.body;
        
        // Vérification des champs requis
        if (!selectedService || !selectedDate || !selectedTime || !selectedSalon || !selectedHairdresser || !userInfo?.name) {
            return res.status(400).json({
                message: 'Tous les champs sont obligatoires'
            });
        }

        // Création de la réservation avec l'ID de l'utilisateur du token
        const reservation = await Reservation.create({
            selectedService,
            selectedDate: new Date(selectedDate),
            selectedTime,
            selectedSalon,
            selectedHairdresser,
            userId: req.user._id,
            userInfo: {
                name: userInfo.name
            }
        });

        res.status(201).json(reservation);
    } catch (error) {
        console.error('Erreur création réservation:', error);
        res.status(400).json({ 
            message: error.message || 'Erreur lors de la création de la réservation'
        });
    }
});

module.exports = router;