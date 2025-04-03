const Reservation = require("../models/Reservation");
const mongoose = require("mongoose");

exports.getReservedTimes = async (req, res) => {
  try {
    const { selectedHairdresser, selectedDate } = req.query;

    if (!mongoose.Types.ObjectId.isValid(selectedHairdresser)) {
      return res.status(400).json({ error: "ID coiffeur invalide" });
    }

    const reservations = await Reservation.find({
      selectedHairdresser,
      selectedDate: new Date(selectedDate)
    });

    res.status(200).json(reservations.map(r => r.selectedTime));

  } catch (error) {
    console.error(`[${new Date().toISOString()}] Erreur réservations: ${error.message}`);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

exports.reserve = async (req, res) => {
  try {
    const requiredFields = [
      "selectedService", 
      "selectedDate", 
      "selectedTime", 
      "selectedSalon", 
      "selectedHairdresser"
    ];

    const missingFields = requiredFields.filter(field => !req.body[field]);
    if (missingFields.length > 0) {
      return res.status(400).json({
        error: `Champs manquants: ${missingFields.join(", ")}`
      });
    }

    const reservation = new Reservation({
      ...req.body,
      userId: req.user._id,
      selectedDate: new Date(req.body.selectedDate)
    });

    await reservation.save();
    res.status(201).json(reservation);

  } catch (error) {
    console.error(`[${new Date().toISOString()}] Erreur création réservation: ${error.message}`);
    res.status(400).json({ 
      error: error.message.includes("validation failed")
        ? "Données invalides"
        : "Erreur de réservation" 
    });
  }
};