const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();
const connectDB = require("./connections/mangoconect");
connectDB();

const app = express();

// ✅ CORS for Vercel frontend
app.use(cors({
  origin: "https://neelamohan-profile.vercel.app",
  credentials: true
}));

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const profileRoute = require("./routes/profileRoute");
app.use("/api/profiles", profileRoute);

app.get("/", (req, res) => res.send("✅ Server is running"));

// ✅ Error handler AFTER routes
app.use((err, req, res, next) => {
  console.error("🔥 Express error:", err.message);
  res.status(400).json({ error: "Invalid request body" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
