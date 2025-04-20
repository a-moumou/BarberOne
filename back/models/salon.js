const mongoose = require("mongoose");

const SalonSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String },
    rating: { type: Number, default: 0 },
    image: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("Salon", SalonSchema); 