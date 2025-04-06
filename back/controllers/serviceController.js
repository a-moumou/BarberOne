const Service = require('../models/Service');
const asyncHandler = require('express-async-handler');

// @desc    Get all services
// @route   GET /api/services
// @access  Private/Admin
const getAllServices = asyncHandler(async (req, res) => {
    const services = await Service.find().sort({ name: 1 });
    res.json(services);
});

// @desc    Create a service
// @route   POST /api/services
// @access  Private/Admin
const createService = asyncHandler(async (req, res) => {
    const { name, description, price, duration, salonId } = req.body;

    if (!name || !price || !duration) {
        res.status(400);
        throw new Error('Veuillez fournir tous les champs requis');
    }

    const service = await Service.create({
        name,
        description,
        price: parseFloat(price),
        duration: parseInt(duration),
        salonId
    });

    res.status(201).json(service);
});

// @desc    Delete a service
// @route   DELETE /api/services/:id
// @access  Private/Admin
const deleteService = asyncHandler(async (req, res) => {
    const service = await Service.findByIdAndDelete(req.params.id);

    if (!service) {
        res.status(404);
        throw new Error('Service non trouvé');
    }

    res.json({ message: 'Service supprimé' });
});

module.exports = {
    getAllServices,
    createService,
    deleteService
}; 