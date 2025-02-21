require("dotenv").config();
const express = require("express");
const db = require("./models");
const authRoutes = require("./routes/auth");  // ✅ Make sure this line exists

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 4001;

// ✅ Log to confirm routes are loading
console.log("✅ Loading authentication routes...");

// Ensure database is connected
db.sequelize.sync()
  .then(() => console.log("✅ Database connected & synced"))
  .catch((err) => console.log("❌ DB Error:", err));

// ✅ Register authentication routes
app.use("/auth", authRoutes);

app.get("/", (req, res) => res.send("User Service Running..."));

// Start the server
app.listen(PORT, () => console.log(`🚀 User Service running on port ${PORT}`));
