const mongoose = require("mongoose");

const ReservationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "L'utilisateur est obligatoire"]
  },
  selectedService: {
    type: String,
    required: [true, "Le service est obligatoire"]
  },
  selectedDate: {
    type: Date,
    required: [true, "La date est obligatoire"]
  },
  selectedTime: {
    type: String,
    required: [true, "L'heure est obligatoire"]
  },
  selectedSalon: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Salon",
    required: [true, "Le salon est obligatoire"]
  },
  selectedHairdresser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hairdresser",
    required: [true, "Le coiffeur est obligatoire"]
  },
  userInfo: {
    name: {
      type: String,
      required: [true, "Le nom du client est obligatoire"]
    }
  }
}, { timestamps: true });

module.exports = mongoose.model("Reservation", ReservationSchema);