const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      throw new Error("❌ MONGO_URI is not defined in environment variables");
    }

    await mongoose.connect(uri); // No deprecated options

    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);

    if (err.name === "MongoServerSelectionError") {
      console.error("⚠️ Possible cause: IP not whitelisted in MongoDB Atlas.");
    }

    process.exit(1);
  }
};

module.exports = connectDB;
