const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        console.log("DB connection not configured yet");
    } catch (error) {
        console.error("Database connection error:", error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
