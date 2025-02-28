const express = require("express");
const router = express.Router();
const Event = require("../models/event");
const authenticateUser = require("../middleware/authMiddleware");

// ✅ Create an Event
router.post("/", authenticateUser, async (req, res) => {
  try {
    const { title, description, date, location } = req.body;
    const newEvent = await Event.create({
      title,
      description,
      date,
      location,
      createdBy: req.user.id
    });
    res.status(201).json(newEvent);
  } catch (error) {
    console.error("❌ Event Creation Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Fetch All Events
router.get("/", async (req, res) => {
  try {
    const events = await Event.findAll();
    res.json(events);
  } catch (error) {
    console.error("❌ Fetch Events Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Fetch a Single Event by ID
router.get("/:id", async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
  } catch (error) {
    console.error("❌ Fetch Event Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Update an Event (Only Creator Can Update)
router.patch("/:id", authenticateUser, async (req, res) => {
  try {
    const { title, description, date, location } = req.body;
    const event = await Event.findByPk(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    // Only allow the event creator to update
    if (event.createdBy !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    event.title = title || event.title;
    event.description = description || event.description;
    event.date = date || event.date;
    event.location = location || event.location;

    await event.save();
    res.json({ message: "Event updated successfully", event });
  } catch (error) {
    console.error("❌ Update Event Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Delete an Event (Only Creator Can Delete)
router.delete("/:id", authenticateUser, async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.createdBy !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await event.destroy();
    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("❌ Delete Event Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
