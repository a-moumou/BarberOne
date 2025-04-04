require('dotenv').config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const userRoutes = require('./routes/user');
const salonRoutes = require("./routes/salon");
const hairdresserRoutes = require("./routes/hairdresser");
const serviceRoutes = require("./routes/service");
const { errorHandler } = require('./middleware/errorMiddleware');

const app = express();

// Connexion à MongoDB
connectDB();

// Middleware CORS - doit être avant toute autre configuration
app.use(cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:5174"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Authorization"]
}));

// Autres middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/reservations", require("./routes/reservation"));
app.use("/api/salons", salonRoutes);
app.use("/api/hairdressers", hairdresserRoutes);
app.use("/api/services", serviceRoutes);
app.use('/api/users', userRoutes);

// Error handling
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur lancé sur le port ${PORT}`));