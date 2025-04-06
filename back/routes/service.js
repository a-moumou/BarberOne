const express = require("express");
const Service = require("../models/Service");
const router = express.Router();
const { protect, admin } = require("../middleware/auth");
const {
    getAllServices,
    createService,
    deleteService
} = require('../controllers/serviceController');

// Route pour créer un service (admin uniquement)
router.post("/", protect, admin, createService);

// Route pour récupérer tous les services (accessible à tous les utilisateurs authentifiés)
router.get("/", protect, getAllServices);

// Route pour récupérer tous les services (accessible à tous, même non authentifiés)
router.get("/public", async (req, res) => {
    try {
        const services = await Service.find().sort({ name: 1 });
        res.json(services);
    } catch (error) {
        console.error('Erreur récupération services:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// Route pour mettre à jour un service (admin uniquement)
router.put("/:id", protect, admin, async (req, res) => {
    try {
        const { name, description, price, duration, salonId } = req.body;
        const service = await Service.findByIdAndUpdate(
            req.params.id,
            { name, description, price, duration, salonId },
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

// Route pour supprimer un service (admin uniquement)
router.delete("/:id", protect, admin, deleteService);

module.exports = router; 