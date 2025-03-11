const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");

require("dotenv").config();

const app = express();

// Connexion à MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/hairdressers", require("./routes/hairdresser"));
app.use("/api/salons", require("./routes/salon"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur lancé sur le port ${PORT}`));
