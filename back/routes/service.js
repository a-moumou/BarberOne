const express = require("express");
const Service = require("../models/Service");
const router = express.Router();
const { protect, admin } = require("../middleware/auth");
const {
    getAllServices,
    createService,
    deleteService
} = require('../controllers/serviceController');

// Route pour créer un service
router.post("/", protect, admin, async (req, res) => {
    try {
        const { name, description, price, duration, salonId } = req.body;
        const service = new Service({
            name,
            description,
            price,
            duration,
            salonId
        });
        await service.save();
        res.status(201).json({ message: "Service créé avec succès", service });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Route pour récupérer tous les services
router.get("/", protect, admin, getAllServices);

// Route pour mettre à jour un service
router.put("/:id", protect, async (req, res) => {
    try {
        const { name, description, price, duration } = req.body;
        const service = await Service.findByIdAndUpdate(
            req.params.id,
            { name, description, price, duration },
            { new: true }
        ).populate('salonId', 'name address');

        if (!service) {
            return res.status(404).json({ message: 'Service non trouvé' });
        }

        res.json(service);
    } catch (error) {
        console.error('Erreur mise à jour service:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// Route pour supprimer un service
router.delete("/:id", protect, admin, deleteService);

module.exports = router; 