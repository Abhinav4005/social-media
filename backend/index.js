import express from 'express';
import indexRoutes from "./src/routes/index.route.js";
import dotenv from 'dotenv';
import cors from 'cors';
import path from "path";

dotenv.config();

const app = express();

app.use(express.json());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], 
    allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use("/api/v1", indexRoutes);

app.listen(3000, ()=>{
    console.log('Server is running on port 3000');
})