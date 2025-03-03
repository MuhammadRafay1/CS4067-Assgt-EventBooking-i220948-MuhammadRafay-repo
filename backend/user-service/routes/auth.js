const express = require('express');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const db = require("../models");
const authenticateUser = require("../middleware/authMiddleware");
const router = express.Router();

const JWT_SECRET = "f4d16fd7"; // Change this to a strong secret in production

console.log("🔄 auth.js file loaded...");

// ✅ User Registration
router.post(
  "/register",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Invalid email"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters")
  ],
  async (req, res) => {
    console.log("📩 Received Register Request:", req.body);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("❌ Validation Errors:", errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      // Check if user already exists
      const existingUser = await db.User.findOne({ where: { email } });
      console.log("🔍 Checking if email exists:", existingUser);

      if (existingUser) {
        console.log("❌ Email already registered:", email);
        return res.status(400).json({ message: "Email already registered" });
      }

      // Create new user
      const newUser = await db.User.create({ name, email, password });
      console.log("✅ User created successfully:", newUser.dataValues);

      // Generate JWT token
      const token = jwt.sign({ id: newUser.id, email: newUser.email }, JWT_SECRET, { expiresIn: "1h" });

      console.log("🔑 Generated Token:", token);
      const userData = {
        id: user.id,
        email: user.email,
        name: user.name
      };
      res.status(201).json({ 
        message: "User registered successfully", 
        token,
        user: userData 
      });
    } catch (error) {
      console.error("❌ Registration Error:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

// ✅ User Login
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid email"),
    body("password").notEmpty().withMessage("Password is required")
  ],
  async (req, res) => {
    console.log("📩 Received Login Request:", req.body);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("❌ Validation Errors:", errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // Check if user exists
      const user = await db.User.findOne({ where: { email } });
      console.log("🔍 Checking if email exists:", user);

      if (!user) {
        console.log("❌ User not found:", email);
        return res.status(400).json({ message: "Invalid credentials" });
      }

      // Compare password
      const isMatch = await bcrypt.compare(password, user.password);
      console.log("🔑 Password Match:", isMatch);

      if (!isMatch) {
        console.log("❌ Invalid password for:", email);
        return res.status(400).json({ message: "Invalid credentials" });
      }

      // Generate JWT token
      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });
      console.log("🔑 Generated Token:", token);

      const userData = {
        id: user.id,
        email: user.email,
        name: user.name
      };

      res.status(200).json({ 
        message: "Login successful", 
        token,
        user: userData 
      });
    } catch (error) {
      console.error("❌ Login Error:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

// 

router.get("/profile", authenticateUser, async (req, res) => {
  try {
    const user = await db.User.findByPk(req.user.id, {
      attributes: ["id", "name", "email", "createdAt"]
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user });
  } catch (error) {
    console.error("❌ Profile Fetch Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});
router.delete("/profile", authenticateUser, async (req, res) => {
  try {
    const user = await db.User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.destroy();

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("❌ Account Deletion Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.patch("/profile", authenticateUser, async (req, res) => {
  console.log("🔄 Received Update Request:", req.body);
  console.log("🔑 Authenticated User ID:", req.user);

  try {
    const { name, email, password } = req.body;
    
    const user = await db.User.findByPk(req.user.id);
    console.log("👤 Found User:", user ? user.dataValues : "Not Found");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (password) {
      console.log("🔐 Hashing New Password...");
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();
    console.log("✅ Profile Updated Successfully");

    res.json({ message: "Profile updated successfully", user });
  } catch (error) {
    console.error("❌ Profile Update Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});



module.exports = router;
