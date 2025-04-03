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
        const { salonId } = req.query;
        let query = {};
        
        if (salonId) {
            query.salonId = salonId;
        }

        const hairdressers = await Hairdresser.find(query)
            .populate('salonId', 'name address');

        console.log('Coiffeurs trouvés:', hairdressers); // Pour déboguer
            
        res.json(hairdressers);
    } catch (error) {
        console.error('Erreur lors de la récupération des coiffeurs:', error);
        res.status(500).json({ 
            message: 'Erreur lors de la récupération des coiffeurs',
            error: error.message 
        });
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

module.exports = router; 