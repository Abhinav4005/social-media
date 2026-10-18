import express from "express";
import authenticateToken from "../middleware/authenticateToken.js";
import {
    getPymk,
    searchWithFilters,
    recordPostView,
    getRecentlyViewed,
    clearViewHistory,
    getNearbyContent,
    getPersonalizedFeed,
    getSerendipityFeed,
    getDaily5Feed,
    updateUserInterests,
} from "../controllers/discovery.controller.js";

const router = express.Router();

router.use(authenticateToken);

// PYMK
router.get("/pymk", getPymk);

// Multi-Filter Search
router.get("/search", searchWithFilters);

// Recently Viewed History
router.post("/view-history", recordPostView);
router.get("/recently-viewed", getRecentlyViewed);
router.delete("/recently-viewed", clearViewHistory);

// Location-Based Discovery
router.get("/nearby", getNearbyContent);

// Personalization & Intentional Feeds
router.get("/personalized", getPersonalizedFeed);
router.get("/serendipity", getSerendipityFeed);
router.get("/daily-5", getDaily5Feed);
router.post("/interests", updateUserInterests);

export default router;
