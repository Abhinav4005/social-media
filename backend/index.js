import express from 'express';
import indexRoutes from "./src/routes/index.route.js";
import dotenv from 'dotenv';
import cors from 'cors';
import path from "path";
import http from "http";
import { initSocket } from './src/socket/index.js';
import dns from "dns";

dns.setDefaultResultOrder("ipv4first");

dotenv.config();

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use(cors({
    origin: ["http://localhost:5173", "https://social-media-frontend-sable-three.vercel.app"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], 
    allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use("/api/v1", indexRoutes);

initSocket(server);

server.listen(3000, () => {
    console.log('Server is running on port 3000');
})