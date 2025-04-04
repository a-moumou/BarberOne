const express = require("express");
const Salon = require("../models/salon");
const router = express.Router();
const { protect, admin } = require("../middleware/auth");

// 🔹 Route pour ajouter un salon
router.post("/", protect, admin, async (req, res) => {
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
router.get("/", protect, async (req, res) => {
    try {
        const salons = await Salon.find();
        res.json(salons);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 🔹 Route pour supprimer un salon
router.delete("/:id", protect, admin, async (req, res) => {
    try {
        const salon = await Salon.findByIdAndDelete(req.params.id);
        if (!salon) {
            return res.status(404).json({ message: "Salon non trouvé" });
        }
        res.json({ message: "Salon supprimé avec succès" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router; 