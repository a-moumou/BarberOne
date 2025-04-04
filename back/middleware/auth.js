const jwt = require("jsonwebtoken");
const User = require('../models/User');
const Admin = require('../models/Admin');

// Middleware de protection des routes
exports.protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ error: 'Non autorisé - Token manquant' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Essayer de trouver l'utilisateur dans le modèle User
      let user = await User.findById(decoded.id).select('-password_hash');

      // Si l'utilisateur n'est pas trouvé, essayer de trouver l'admin
      if (!user) {
        const admin = await Admin.findById(decoded.id).select('-password');
        if (admin) {
          // Si c'est un admin, ajouter le rôle admin
          user = {
            _id: admin._id,
            email: admin.email,
            role: 'admin'
          };
        }
      }

      if (!user) {
        return res.status(401).json({ error: 'Non autorisé - Utilisateur non trouvé' });
      }

      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({ error: 'Non autorisé - Token invalide' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Middleware pour vérifier le rôle admin
exports.admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ error: 'Accès refusé - Droits administrateur requis' });
  }
};