import { Router } from "express";
import authenticateToken from "../middleware/authenticateToken.js";
import {
    createListing,
    getListings,
    getListingById,
    getUserListings,
    deleteListing
} from "../controllers/marketplace.controller.js";

const router = Router();

router.use(authenticateToken);

router.get("/", getListings);
router.post("/", createListing);
router.get("/user", getUserListings);
router.get("/:id", getListingById);
router.delete("/:id", deleteListing);

export default router;
