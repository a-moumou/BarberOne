const mongoose = require("mongoose");

const hairdresserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    salonId: { type: mongoose.Schema.Types.ObjectId, ref: "Salon", required: true }, // Référence au salon
    isAvailable: { type: Boolean, default: true }, // Statut de disponibilité
}, { timestamps: true });

module.exports = mongoose.model("Hairdresser", hairdresserSchema); 