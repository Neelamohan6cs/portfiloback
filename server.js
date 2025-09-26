// server.js
const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");

// Load environment variables from .env
dotenv.config();

// Import MongoDB connection
const connectDB = require("./connections/mangoconect");

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());

app.use(cors({
  origin: "https://neelamohan-profile.vercel.app", // your frontend URL
  credentials: true
}));

// Parse JSON for API requests (non-file uploads)
app.use(express.json());

// Serve uploads folder statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use((err, req, res, next) => {
  console.error("🔥 Express error:", err.message);
  res.status(400).json({ error: "Invalid request body" });
});

const profileRoute = require("./routes/profileRoute");
app.use("/api/profiles", profileRoute);

// Health check route
app.get("/", (req, res) => res.send("✅ Server is running"));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
