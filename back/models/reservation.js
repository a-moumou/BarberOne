const mongoose = require("mongoose");

const ReservationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    selectedService: { type: String, required: true },
    selectedDate: { type: Date, required: true },
    selectedTime: { type: String, required: true },
    selectedSalon: { type: String, required: true },
    selectedHairdresser: { type: String, required: true },
    userInfo: {
        name: { type: String, required: true },
        // Supprimez ou commentez la ligne suivante si vous ne voulez pas l'email
        // email: { type: String, required: true },
    },
}, { timestamps: true });

module.exports = mongoose.model("Reservation", ReservationSchema);

