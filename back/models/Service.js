const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    duration: {
        type: Number,
        required: true,
        min: 15,
        default: 30
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Service", serviceSchema); 