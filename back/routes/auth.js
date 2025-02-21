const express = require("express");
const bcrypt = require("bcryptjs"); // Assurez-vous que cette ligne est présente
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Reservation = require("../models/reservation");
const auth = require("../middleware/auth"); // Importer le middleware d'authentification

const router = express.Router();

// 🔹 Route d'inscription
router.post("/register", async (req, res) => {
    console.log("Données reçues :", req.body);
    try {
        const { first_name, last_name, email, phone, password } = req.body;

        // Vérifier si l'utilisateur existe déjà
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "Email déjà utilisé" });

        // Hacher le mot de passe
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Créer un nouvel utilisateur
        user = new User({
            first_name,
            last_name,
            email,
            phone,
            password_hash: hashedPassword
        });

        await user.save();
        res.json({ message: "Utilisateur enregistré !" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 🔹 Route de connexion
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(400).json({ message: "Utilisateur non trouvé" });

        // Vérifier le mot de passe
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) return res.status(400).json({ message: "Mot de passe incorrect" });

        // Générer un token JWT
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.json({ token, user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 🔹 Route pour créer une réservation
router.post("/reserve", auth, async (req, res) => {
    console.log(req.body);
    try {
        const { selectedService, selectedDate, selectedTime, selectedSalon, selectedHairdresser, userInfo } = req.body;

        const reservation = new Reservation({
            userId: req.user.id, // Utiliser l'ID de l'utilisateur connecté
            selectedService,
            selectedDate,
            selectedTime,
            selectedSalon,
            selectedHairdresser,
            userInfo,
        });

        await reservation.save();
        res.status(201).json({ message: "Réservation créée avec succès", reservation });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;