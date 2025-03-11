const express = require("express");
const Salon = require("../models/salon");
const router = express.Router();

// 🔹 Route pour ajouter un salon
router.post("/", async (req, res) => {
    try {
        const { name, address, phone, services } = req.body;
        const salon = new Salon({ name, address, phone, services });
        await salon.save();
        res.status(201).json({ message: "Salon ajouté avec succès", salon });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 🔹 Route pour récupérer tous les salons
router.get("/", async (req, res) => {
    try {
        const salons = await Salon.find();
        res.json(salons);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router; 