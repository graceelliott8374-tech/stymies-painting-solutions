const express = require("express");
const router = express.Router();

// @desc    Create a new lead
// @route   POST /api/leads
// @access  Public
router.post("/", (req, res) => {
    res.status(501).json({ message: "Create lead not implemented yet" });
});

// @desc    Get all leads (admin)
// @route   GET /api/leads
// @access  Private (later)
router.get("/", (req, res) => {
    res.status(501).json({ message: "Get leads not implemented yet" });
});

module.exports = router;
