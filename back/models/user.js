const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  first_name: { 
    type: String, 
    required: [true, "Le prénom est obligatoire"] 
  },
  last_name: { 
    type: String, 
    required: [true, "Le nom est obligatoire"] 
  },
  email: { 
    type: String, 
    required: [true, "L'email est obligatoire"],
    unique: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Email invalide"]
  },
  phone: { 
    type: String,
    match: [/^[0-9]{10}$/, "Numéro de téléphone invalide"] 
  },
  password_hash: { 
    type: String, 
    required: [true, "Le mot de passe est obligatoire"] 
  }
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);