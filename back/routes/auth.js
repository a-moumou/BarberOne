const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();

// Connexion
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "Email non trouvé" });

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(400).json({ message: "Mot de passe incorrect" });

    const token = jwt.sign(
      { 
        id: user._id,
        email: user.email
      }, 
      process.env.JWT_SECRET, 
      { expiresIn: "1h" }
    );
    
    // Envoyer les informations de l'utilisateur avec le token
    res.json({ 
      token,
      user: {
        _id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email
      }
    });
  } catch (err) {
    console.error("Erreur de connexion:", err);
    res.status(500).json({ error: err.message });
  }
});

// Connexion Admin
router.post("/admin/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, role: 'admin' });

    if (!user) return res.status(400).json({ success: false, message: "Email non trouvé ou non autorisé" });

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(400).json({ success: false, message: "Mot de passe incorrect" });

    const token = jwt.sign(
      { 
        id: user._id,
        email: user.email,
        role: 'admin'
      }, 
      process.env.JWT_SECRET, 
      { expiresIn: "1h" }
    );
    
    res.json({ 
      success: true,
      token,
      user: {
        _id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: 'admin'
      }
    });
  } catch (err) {
    console.error("Erreur de connexion admin:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Inscription
router.post("/register", async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) return res.status(400).json({ message: "Email déjà utilisé" });

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      first_name,
      last_name,
      email,
      password_hash: passwordHash,
    });

    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;