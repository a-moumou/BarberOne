const express = require("express");
const auth = require("../middleware/auth");
const Reservation = require("../models/Reservation");
const router = express.Router();

// Créer une réservation
router.post("/reserve", auth, async (req, res) => {
  try {
    const { selectedService, selectedDate, selectedTime, selectedSalon, selectedHairdresser } = req.body;

    const existingReservation = await Reservation.findOne({
      selectedHairdresser,
      selectedDate,
      selectedTime,
    });

    if (existingReservation) {
      return res.status(400).json({ message: "Créneau déjà réservé" });
    }

    const reservation = new Reservation({
      userId: req.user.id,
      selectedService,
      selectedDate,
      selectedTime,
      selectedSalon,
      selectedHairdresser,
    });

    await reservation.save();
    res.status(201).json(reservation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;