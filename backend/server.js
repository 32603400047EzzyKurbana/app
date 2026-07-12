import "dotenv/config";
import express from "express";
import cors from "cors";
import instancesRouter from "./routes/instances.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Route utama
app.get("/", (req, res) => {
  res.json({
    status: "OK",
    message: "InstanceWatch Backend is Running",
    api: {
      health: "/api/health",
      instances: "/api/instances"
    }
  });
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    region: process.env.AWS_REGION || "ap-southeast-1"
  });
});

// API EC2
app.use("/api/instances", instancesRouter);

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Terjadi kesalahan pada server" });
});

// Jalankan server
app.listen(PORT, () => {
  console.log(`InstanceWatch backend berjalan di http://localhost:${PORT}`);
});