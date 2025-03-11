const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer"); // Ajouter Nodemailer
const User = require("../models/user");
const Reservation = require("../models/reservation");
const Salon = require("../models/salon"); // Importer le modèle Salon
const auth = require("../middleware/auth");
const transporter = require("../config/email"); // Remplacer l'import Nodemailer

const router = express.Router();

// Route pour créer une réservation
router.post("/reserve", auth, async (req, res) => {
    try {
        const { selectedService, selectedDate, selectedTime, selectedSalon, selectedHairdresser, userInfo } = req.body;

        // Récupérer l'utilisateur connecté
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

        // Vérifier si le créneau est déjà réservé
        const existingReservation = await Reservation.findOne({
            selectedHairdresser,
            selectedDate,
            selectedTime,
        });

        if (existingReservation) {
            return res.status(400).json({ message: "Ce créneau est déjà réservé." });
        }

        // Créer la réservation
        const reservation = new Reservation({
            userId: req.user.id,
            selectedService,
            selectedDate,
            selectedTime,
            selectedSalon,
            selectedHairdresser,
            userInfo: {
                name: userInfo.name || `${user.first_name} ${user.last_name}`,
            },
        });

        await reservation.save();

        res.status(201).json({
            message: "Réservation créée avec succès",
            reservation
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;