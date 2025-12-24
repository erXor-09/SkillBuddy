const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const auth = require('../middleware/auth'); // Assuming you have an auth middleware

// Get all notifications for the logged-in user
router.get('/', auth, async (req, res) => {
    try {
        const notifications = await Notification.find({ recipient: req.user.id })
            .sort({ createdAt: -1 })
            .limit(20); // Limit to last 20 notifications
        res.json(notifications);
    } catch (error) {
        console.error("Error fetching notifications:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// Mark a notification as read
router.put('/:id/read', auth, async (req, res) => {
    try {
        const notification = await Notification.findOneAndUpdate(
            { _id: req.params.id, recipient: req.user.id },
            { read: true },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({ error: "Notification not found" });
        }

        res.json(notification);
    } catch (error) {
        console.error("Error updating notification:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// Mark all as read
router.put('/mark-all-read', auth, async (req, res) => {
    try {
        await Notification.updateMany(
            { recipient: req.user.id, read: false },
            { read: true }
        );
        res.json({ message: "All notifications marked as read" });
    } catch (error) {
        console.error("Error marking all read:", error);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;
