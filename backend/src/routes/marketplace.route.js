import { Router } from "express";
import authenticateToken from "../middleware/authenticateToken.js";
import {
    createListing,
    getListings,
    getListingById,
    getUserListings,
    deleteListing,
    updateListingStatus
} from "../controllers/marketplace.controller.js";

const router = Router();

router.use(authenticateToken);

router.get("/", getListings);
router.post("/", createListing);
router.get("/user", getUserListings);
router.get("/:id", getListingById);
router.patch("/:id/status", updateListingStatus);
router.delete("/:id", deleteListing);

export default router;
