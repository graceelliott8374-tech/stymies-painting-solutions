const express = require("express");
const leadRoutes = require("./routes/leadRoutes");
const authRoutes = require("./routes/authRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");

const app = express();

app.use(express.json());
app.use(cookieParser());

// IMPORTANT for cookie auth in dev:
// allow credentials + your frontend origin
const allowedOrigins = [
  "http://localhost:5173",
  process.env.CLIENT_URL, // e.g. https://your-vercel-app.vercel.app or https://stymiespaintingsolutions.com
].filter(Boolean);

app.use(
  cors({
    origin(origin, cb) {
      // allow non-browser requests (like Render health checks, curl, Postman)
      if (!origin) return cb(null, true);

      if (allowedOrigins.includes(origin)) return cb(null, true);

      return cb(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);

app.use("/api/auth", authRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/reviews", reviewRoutes);

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    db: mongoose.connection.readyState === 1 ? "connected" : "not_connected",
  });
});

app.get("/", (req, res) => {
  res.send("API is running");
});

// Global error handler (keep this AFTER all routes)
app.use((err, req, res, next) => {
  console.error(err);

  const status = err.statusCode || 500;

  res.status(status).json({
    success: false,
    message: err.message || "Server error",
  });
});

module.exports = app;
