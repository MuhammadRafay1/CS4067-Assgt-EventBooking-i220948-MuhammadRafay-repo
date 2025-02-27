const jwt = require("jsonwebtoken");

const JWT_SECRET = "f4d16fd7"; // Use the same secret as in auth.js

const authenticateUser = (req, res, next) => {
  console.log("🔄 Authenticating request...");

  const token = req.header("Authorization");

  if (!token) {
    console.log("❌ No token provided!");
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), JWT_SECRET);
    console.log("✅ Decoded Token:", decoded);

    req.user = decoded;
    next();
  } catch (error) {
    console.log("❌ Invalid Token:", error.message);
    res.status(400).json({ message: "Invalid token" });
  }
};


module.exports = authenticateUser;
