const express = require("express");
const leadRoutes = require("./routes/leadRoutes");

const app = express();

app.use(express.json());

app.use("/api/leads", leadRoutes);

app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
});

module.exports = app;

