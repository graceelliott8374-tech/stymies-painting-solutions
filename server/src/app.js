const express = require("express");
const leadRoutes = require("./routes/leadRoutes");
const authRoutes = require("./routes/authRoutes");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

app.use(express.json());
app.use(cookieParser());

// IMPORTANT for cookie auth in dev:
// allow credentials + your frontend origin
app.use(
  cors({
    origin: "http://localhost:5173", // change if your React dev server uses a different port
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/leads", leadRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

module.exports = app;
