const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const {
    reserve,
    getReservedTimes,
    getAllReservations
} = require("../controllers/reservationController");
const Reservation = require('../models/Reservation');

// Route pour obtenir les horaires réservés
router.get('/reserved-times', protect, getReservedTimes);

// Route pour créer une réservation
router.post('/', protect, reserve);

// Route pour obtenir toutes les réservations
router.get('/', protect, getAllReservations);

// Route pour mettre à jour une réservation
router.put('/:id', protect, async (req, res) => {
    try {
        const { selectedDate, selectedTime } = req.body;

        if (!selectedDate || !selectedTime) {
            return res.status(400).json({
                message: 'La date et l\'heure sont requises'
            });
        }

        // Vérifier si le créneau est disponible
        const startDate = new Date(selectedDate);
        startDate.setHours(0, 0, 0, 0);

        const endDate = new Date(selectedDate);
        endDate.setHours(23, 59, 59, 999);

        const existingReservation = await Reservation.findOne({
            _id: { $ne: req.params.id },
            selectedDate: {
                $gte: startDate,
                $lte: endDate
            },
            selectedTime
        });

        if (existingReservation) {
            return res.status(400).json({
                message: 'Ce créneau est déjà réservé'
            });
        }

        const reservation = await Reservation.findByIdAndUpdate(
            req.params.id,
            {
                selectedDate: new Date(selectedDate),
                selectedTime
            },
            { new: true }
        ).populate('selectedHairdresser', 'name');

        if (!reservation) {
            return res.status(404).json({
                message: 'Réservation non trouvée'
            });
        }

        res.json(reservation);
    } catch (error) {
        console.error('Erreur mise à jour réservation:', error);
        res.status(400).json({
            message: error.message || 'Erreur lors de la mise à jour de la réservation'
        });
    }
});

// Route pour supprimer une réservation
router.delete('/:id', protect, async (req, res) => {
    try {
        const reservation = await Reservation.findByIdAndDelete(req.params.id);

        if (!reservation) {
            return res.status(404).json({
                message: 'Réservation non trouvée'
            });
        }

        res.json({ message: 'Réservation supprimée avec succès' });
    } catch (error) {
        console.error('Erreur suppression réservation:', error);
        res.status(400).json({
            message: error.message || 'Erreur lors de la suppression de la réservation'
        });
    }
});

module.exports = router;