import express from "express";
import { uploadImage } from "../controllers/image.controller.js";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

router.post("/upload", upload.single("file"), uploadImage);

export default router;