const express = require("express");
const Hairdresser = require("../models/hairdresser");
const router = express.Router();

// 🔹 Route pour ajouter un coiffeur
router.post("/", async (req, res) => {
    try {
        const { name, salonId, services } = req.body;
        const hairdresser = new Hairdresser({ name, salonId, services });
        await hairdresser.save();
        res.status(201).json({ message: "Coiffeur ajouté avec succès", hairdresser });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 🔹 Route pour récupérer tous les coiffeurs
router.get("/", async (req, res) => {
    try {
        const hairdressers = await Hairdresser.find().populate("salonId");
        res.json(hairdressers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router; 