const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    console.log('Headers reçus:', req.headers);
    console.log('Auth header:', authHeader);
    
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authentification requise" });
    }

    const token = authHeader.split(' ')[1];
    console.log('Token reçu:', token);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token décodé:', decoded);
    
    // Accepter soit id soit userId
    const userId = decoded.id || decoded.userId;
    
    if (!userId) {
      console.log('Pas d\'id trouvé dans le token');
      throw new Error("Token invalide - id manquant");
    }

    req.user = { _id: userId };
    console.log('User set in request:', req.user);
    next();
  } catch (error) {
    console.error(`Erreur d'authentification:`, error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: "Token invalide" });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: "Session expirée" });
    }
    res.status(401).json({ 
      message: "Authentification échouée",
      details: error.message
    });
  }
};