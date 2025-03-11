const mongoose = require("mongoose");

const HairdresserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    salonId: { type: mongoose.Schema.Types.ObjectId, ref: "Salon", required: true }, // Référence au salon
    services: [{ type: String }], // Liste des services offerts
}, { timestamps: true });

module.exports = mongoose.model("Hairdresser", HairdresserSchema); 