const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

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
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Email invalide"],
    lowercase: true
  },
  phone: {
    type: String,
    match: [/^[0-9]{10}$/, "Numéro de téléphone invalide"]
  },
  password_hash: {
    type: String,
    required: [true, "Le mot de passe est obligatoire"]
  },
  salonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Salon'
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }
}, { timestamps: true });

// Hash du mot de passe avant sauvegarde
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password_hash')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password_hash = await bcrypt.hash(this.password_hash, salt);
});

// Méthode pour comparer les mots de passe
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password_hash);
};

module.exports = mongoose.model("User", UserSchema);