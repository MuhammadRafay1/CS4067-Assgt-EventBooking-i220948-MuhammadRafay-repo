require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Configure email transport
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ✅ API to send notifications directly
app.post("/notify", async (req, res) => {
  const { user_id, event_id, message, email } = req.body;

  if (!user_id || !event_id || !message || !email) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Send email notification
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Booking Confirmation",
      text: `Hello! Your booking for Event ${event_id} is confirmed! Message: ${message}`,
    });

    console.log(`📩 Notification sent to ${email}`);
    res.json({ message: "Notification sent successfully" });
  } catch (error) {
    console.error("❌ Failed to send notification:", error);
    res.status(500).json({ error: "Failed to send notification" });
  }
});

const PORT = process.env.PORT || 4004;
app.listen(PORT, () => {
  console.log(`🚀 Notification Service running on port ${PORT}`);
});
