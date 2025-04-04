const Reservation = require("../models/Reservation");
const mongoose = require("mongoose");

exports.getReservedTimes = async (req, res) => {
  try {
    const { hairdresserId, date } = req.query;

    if (!hairdresserId || !date) {
      return res.status(400).json({
        message: 'hairdresserId et date sont requis'
      });
    }

    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    const reservations = await Reservation.find({
      selectedHairdresser: hairdresserId,
      selectedDate: {
        $gte: startDate,
        $lte: endDate
      }
    });

    const reservedTimes = reservations.map(reservation => reservation.selectedTime);
    res.json(reservedTimes);
  } catch (error) {
    console.error('Erreur serveur:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.reserve = async (req, res) => {
  try {
    const { selectedService, selectedDate, selectedTime, selectedSalon, selectedHairdresser, userInfo } = req.body;

    if (!selectedService || !selectedDate || !selectedTime || !selectedSalon || !selectedHairdresser || !userInfo?.name) {
      return res.status(400).json({
        message: 'Tous les champs sont obligatoires'
      });
    }

    const reservation = await Reservation.create({
      selectedService,
      selectedDate: new Date(selectedDate),
      selectedTime,
      selectedSalon,
      selectedHairdresser,
      userId: req.user._id,
      userInfo: {
        name: userInfo.name
      }
    });

    res.status(201).json(reservation);
  } catch (error) {
    console.error('Erreur création réservation:', error);
    res.status(400).json({
      message: error.message || 'Erreur lors de la création de la réservation'
    });
  }
};

exports.getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find()
      .populate('selectedHairdresser', 'name')
      .populate('selectedSalon', 'name address')
      .sort({ selectedDate: -1, selectedTime: -1 });
    res.json(reservations);
  } catch (error) {
    console.error('Erreur serveur:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};