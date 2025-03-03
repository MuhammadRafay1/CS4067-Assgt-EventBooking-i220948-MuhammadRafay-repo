require("dotenv").config();
const express = require("express");
const cors = require("cors");
const sequelize = require("./config/database");
const eventRoutes = require("./routes/eventRoutes");

const app = express();
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000", // Allow frontend URL
  credentials: true, // Allow cookies and auth headers
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: "Content-Type,Authorization"
}));
app.use(express.json());
app.use(cors());

// Load event routes
app.use("/events", eventRoutes);

// Sync database
sequelize.sync()
  .then(() => console.log("✅ Event database synced"))
  .catch((err) => console.error("❌ Database error:", err));

const PORT = process.env.PORT || 4002;
app.listen(PORT, () => console.log(`🚀 Event Service running on port ${PORT}`));
