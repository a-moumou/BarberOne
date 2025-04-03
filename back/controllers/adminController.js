const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');


// Connexion admin
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérifier si l'admin existe
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    // Vérifier le mot de passe
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    // Créer le token
    const token = jwt.sign(
      { id: admin._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      admin: {
        id: admin._id,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Erreur de connexion:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Vérifier le token admin
const verifyAdmin = async (req, res) => {
  try {
    res.json({
      admin: {
        id: req.admin._id,
        email: req.admin.email,
        role: req.admin.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Récupérer toutes les réservations
exports.getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find()
      .populate('userId', 'name email')
      .populate('selectedHairdresser', 'name')
      .populate('selectedService', 'name price')
      .populate('selectedSalon', 'name')
      .sort({ selectedDate: -1 });

    res.status(200).json(reservations);
  } catch (error) {
    console.error('Erreur récupération réservations:', error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// Mettre à jour une réservation

module.exports = {
  loginAdmin,
  verifyAdmin,
}; 