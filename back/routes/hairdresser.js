const express = require("express");
const Hairdresser = require("../models/hairdresser");
const router = express.Router();
const { protect, admin } = require("../middleware/auth");

// 🔹 Route pour ajouter un coiffeur
router.post("/", protect, admin, async (req, res) => {
    try {
        const { name, salonId } = req.body;
        const hairdresser = new Hairdresser({ name, salonId });
        await hairdresser.save();
        res.status(201).json({ message: "Coiffeur ajouté avec succès", hairdresser });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 🔹 Route pour récupérer tous les coiffeurs (accessible sans authentification)
router.get("/", async (req, res) => {
    try {
        const { salonId } = req.query;
        let query = {};

        if (salonId) {
            query.salonId = salonId;
        }

        const hairdressers = await Hairdresser.find(query)
            .populate('salonId', 'name address')
            .sort({ name: 1 });

        res.json(hairdressers);
    } catch (error) {
        console.error('Erreur récupération coiffeurs:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// Récupérer les coiffeurs d'un salon spécifique (route alternative)
router.get('/salon/:salonId', async (req, res) => {
    try {
        const hairdressers = await Hairdresser.find({ salonId: req.params.salonId })
            .populate('salonId', 'name address');

        res.json(hairdressers);
    } catch (error) {
        console.error('Erreur lors de la récupération des coiffeurs:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// Route pour mettre à jour la disponibilité d'un coiffeur
router.put('/:id/availability', protect, admin, async (req, res) => {
    try {
        const { isAvailable } = req.body;

        if (typeof isAvailable !== 'boolean') {
            return res.status(400).json({
                message: 'Le statut de disponibilité doit être un booléen'
            });
        }

        const hairdresser = await Hairdresser.findByIdAndUpdate(
            req.params.id,
            { isAvailable },
            { new: true }
        ).populate('salonId', 'name address');

        if (!hairdresser) {
            return res.status(404).json({
                message: 'Coiffeur non trouvé'
            });
        }

        res.json(hairdresser);
    } catch (error) {
        console.error('Erreur mise à jour disponibilité:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// Route pour supprimer un coiffeur
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const hairdresser = await Hairdresser.findByIdAndDelete(req.params.id);
        if (!hairdresser) {
            return res.status(404).json({ message: 'Coiffeur non trouvé' });
        }
        res.json({ message: 'Coiffeur supprimé avec succès' });
    } catch (error) {
        console.error('Erreur suppression coiffeur:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

module.exports = router; 