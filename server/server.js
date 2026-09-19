const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const ttsRoutes = require("./routes/ttsRoutes");

const app = express();

// CORS Protection
app.use(
    cors({
        origin: process.env.CLIENT_URL || "http://localhost:5173",
    })
);

// Request Size Limit
app.use(express.json({ limit: "20kb" }));

// Rate Limiting for TTS API
const ttsLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 30,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many requests. Please try again after 15 minutes.",
    },
});

// Apply rate limit to TTS endpoint
app.use("/api/tts", ttsLimiter);

// API Routes
app.use("/api", ttsRoutes);

// Health Check
app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "Text-to-Speech Server is running",
    });
});

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});