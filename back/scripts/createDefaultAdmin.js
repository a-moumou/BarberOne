require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('../models/Admin');

const createDefaultAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    // Vérifier si un admin existe déjà
    const adminExists = await Admin.findOne({ email: 'admin@barberone.com' });
    
    if (!adminExists) {
      const admin = new Admin({
        email: 'admin@barberone.com',
        password: 'admin123', // Sera hashé automatiquement
        role: 'admin'
      });
      
      await admin.save();
      console.log('Administrateur par défaut créé avec succès');
    } else {
      console.log('Un administrateur existe déjà');
    }
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('Erreur lors de la création de l\'administrateur:', error);
    process.exit(1);
  }
};

createDefaultAdmin(); 