import express from "express";
import authenticateToken from "../middleware/authenticateToken.js";
import {
    createEvent,
    getEventById,
    getUpcomingEvents,
    getUserEvents,
    rsvpEvent,
    updateEvent,
    deleteEvent
} from "../controllers/event.controller.js";
import { validatePayload } from "../middleware/validate.middleware.js";

const router = express.Router();

router.post(
    "/create",
    authenticateToken,
    validatePayload({
        title: { required: true, minLength: 2 },
        startDate: { required: true }
    }),
    createEvent
);

router.get("/upcoming", authenticateToken, getUpcomingEvents);
router.get("/my-events", authenticateToken, getUserEvents);
router.get("/:id", authenticateToken, getEventById);
router.post("/:id/rsvp", authenticateToken, rsvpEvent);
router.put("/:id", authenticateToken, updateEvent);
router.delete("/:id", authenticateToken, deleteEvent);

export default router;
