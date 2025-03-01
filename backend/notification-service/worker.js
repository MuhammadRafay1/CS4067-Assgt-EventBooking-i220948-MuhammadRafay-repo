require("dotenv").config();
const { Worker } = require("bullmq");
const Redis = require("ioredis");
const nodemailer = require("nodemailer");

// Redis connection
const redisConnection = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
});

// Configure email transport
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Worker to process notifications
const worker = new Worker(
  "notificationQueue",
  async (job) => {
    const { user_id, event_id, message } = job.data;

    console.log(`📩 Sending Notification to User ${user_id}: ${message}`);

    // Simulate sending an email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: "user@example.com", // Replace with actual user email
      subject: "Booking Confirmation",
      text: `Your booking for Event ${event_id} is confirmed!`,
    });

    console.log("✅ Email sent successfully!");
  },
  { connection: redisConnection }
);

console.log("📨 Notification Worker is running...");
