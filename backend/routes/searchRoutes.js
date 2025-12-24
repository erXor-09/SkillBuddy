const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
// const Topic = require('../models/Topic'); // If you have a separate Topic model, otherwise searching courses is usually enough

// Global Search API
router.get('/', async (req, res) => {
    const query = req.query.q;
    if (!query) return res.json({ courses: [] });

    try {
        // Case-insensitive regex search
        const regex = new RegExp(query, 'i');

        // Search Courses
        const courses = await Course.find({
            $or: [
                { title: regex },
                { description: regex },
                { 'modules.title': regex } // Assuming courses have modules embedded or related
            ]
        }).select('title description level _id').limit(5);

        res.json({ courses });
    } catch (error) {
        console.error("Search error:", error);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;
