const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        console.log("Attempting to connect with URI:", process.env.MONGO_URI ? process.env.MONGO_URI.substring(0, 15) + "..." : "UNDEFINED");
        await mongoose.connect(process.env.MONGO_URI, {});
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        process.exit(1);
    }
};

module.exports = connectDB;