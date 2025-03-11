const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === "true", // true pour le port 465, false pour les autres
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

// Vérification de la connexion SMTP
transporter.verify((error) => {
    if (error) {
        console.error("Erreur de configuration SMTP:", error);
    } else {
        console.log("Serveur SMTP prêt pour l'envoi");
    }
});

module.exports = transporter; 