const express = require("express");
const router = express.Router();
const User = require("../models/User");
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");

// 🔹 GET MY PROFILE
router.get("/me", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// 🔹 UPDATE PROFILE
router.put("/update", auth, async (req, res) => {
    const { name, bio, title, phone } = req.body;

    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.name = name || user.name;
        user.bio = bio || user.bio;
        user.title = title || user.title;
        user.phone = phone || user.phone;

        await user.save();
        res.json({ message: "Profile updated" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Update failed" });
    }
});

// 🔹 UPLOAD AVATAR
router.post(
    "/upload-avatar",
    auth,
    upload.single("avatar"),
    async (req, res) => {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        try {
            const user = await User.findById(req.user.id);

            // Save image data to database
            user.avatarData = req.file.buffer;
            user.avatarContentType = req.file.mimetype;

            // Set avatar URL to API endpoint
            user.avatar = `/api/profile/${user._id}/avatar`;

            await user.save();

            res.json({
                message: "Avatar uploaded successfully",
                avatar: user.avatar,
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Upload failed" });
        }
    }
);

// 🔹 GET AVATAR IMAGE
router.get("/:id/avatar", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user || !user.avatarData) {
            // Return default or 404
            return res.status(404).send("Image not found");
        }
        res.set('Content-Type', user.avatarContentType);
        res.send(user.avatarData);
    } catch (err) {
        res.status(500).send("Server Error");
    }
});

module.exports = router;
