import express from 'express';
import indexRoutes from "./src/routes/index.route.js";
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import hpp from 'hpp';
import path from "path";
import http from "http";
import { initSocket } from './src/socket/index.js';
import dns from "dns";
import queueMonitor from "./src/monitor/queueMonitor.js";
import { cleanupQueue } from './src/queues/cleanupQueue.js';
import { errorHandler } from './src/middleware/error.middleware.js';
import { responseMiddleware } from './src/middleware/response.middleware.js';
import globalLimit from './src/middleware/globalLimit.js';
import adminAuth from './src/middleware/adminAuth.middleware.js';

dns.setDefaultResultOrder("ipv4first");

dotenv.config();

// Process-level unhandled rejection & uncaught exception safety handlers
process.on("unhandledRejection", (reason, promise) => {
  console.error("[Fatal] Unhandled Rejection at:", promise, "reason:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("[Fatal] Uncaught Exception thrown:", error);
});

const app = express();
const server = http.createServer(app);

// Generic API Response Middleware
app.use(responseMiddleware);

// Security HTTP Headers & HPP Protection
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
}));
app.use(hpp());

const allowedOrigins = [
  "http://localhost:5173",
  "https://social-media-frontend-sable-three.vercel.app",
  process.env.FRONTEND_URL,
  process.env.FRONTEND_BASE_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "x-admin-key"],
}));

// Payload Size Caps
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ limit: "2mb", extended: true }));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Production Health Check Probe for Docker / AWS / Vercel
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString(), env: process.env.NODE_ENV || "development" });
});

// Protected API v1 Endpoints with Global Rate Limiting
app.use("/api/v1", globalLimit, indexRoutes);

// Admin Queue Dashboard Protected with Admin Authorization
app.use("/admin/queues", adminAuth, queueMonitor.getRouter());

// Global Centralized Production Error Handler
app.use(errorHandler);

initSocket(server);

try {
  await cleanupQueue.add(
    "cleanup-expired-stories",
    {},
    {
      repeat: {
        cron: "0 * * * *",
      },
    }
  );
} catch (error) {
  console.error("Failed to add cleanup queue job:", error);
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});