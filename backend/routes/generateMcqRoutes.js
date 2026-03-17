const express = require("express");
const multer = require("multer");
const pdf = require("pdf-parse");
const fs = require("fs");
const { generateMCQsForText } = require("../services/ai-service");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/generate-mcq", upload.single("pdf"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "PDF file required" });
    }

    // Read PDF
    const dataBuffer = fs.readFileSync(req.file.path);
    const parsed = await pdf(dataBuffer);
    const text = parsed.text;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: "No text found in PDF" });
    }

    // Generate MCQs using existing OpenRouter AI service
    const mcqs = await generateMCQsForText(text);

    // Delete uploaded file after processing
    fs.unlinkSync(req.file.path);

    res.json({ mcqs });
  } catch (error) {
    console.error("MCQ Generation Error:", error);

    // Clean up file if it still exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({ error: "Server error during MCQ generation" });
  }
});

module.exports = router;
