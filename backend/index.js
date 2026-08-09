import express from 'express';
import indexRoutes from "./src/routes/index.route.js";
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import hpp from 'hpp';
import cookieParser from 'cookie-parser';
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
import { csrfGuard } from './src/middleware/csrfGuard.js';
import compression from 'compression';

dns.setDefaultResultOrder("ipv4first");

dotenv.config();

process.on("unhandledRejection", (reason, promise) => {
  console.error("[Fatal] Unhandled Rejection at:", promise, "reason:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("[Fatal] Uncaught Exception thrown:", error);
});

const app = express();
const server = http.createServer(app);

app.use(compression());

app.use(responseMiddleware);

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  frameguard: { action: "deny" },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "blob:", "https://images.unsplash.com", "https://ik.imagekit.io"],
      connectSrc: ["'self'", "ws:", "wss:", "http://localhost:3000", "http://localhost:5173"],
      frameAncestors: ["'none'"],
    },
  },
}));
app.use((req, res, next) => {
  res.setHeader("X-Frame-Options", "DENY");
  next();
});
app.use(hpp());

const allowedOrigins = [
  "http://localhost:5173",
  "https://social-media-frontend-sable-three.vercel.app",
  process.env.FRONTEND_URL,
  process.env.FRONTEND_BASE_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.some(allowed => origin.startsWith(allowed))) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "x-admin-key", "X-Requested-With", "x-requested-with", "Accept"],
}));

app.use(csrfGuard);

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ limit: "2mb", extended: true }));

app.use(cookieParser());

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString(), env: process.env.NODE_ENV || "development" });
});

app.use("/api/v1", globalLimit, indexRoutes);

app.use("/admin/queues", adminAuth, queueMonitor.getRouter());

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