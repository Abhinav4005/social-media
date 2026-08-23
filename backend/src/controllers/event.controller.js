import { defaultEventService } from "../services/event.service.js";
import { ApiResponse } from "../utils/apiResponse.js";

export const createEvent = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        const event = await defaultEventService.createEvent(userId, req.body);
        return ApiResponse.success(res, event, "Event created successfully", 201);
    } catch (error) {
        if (error.status) return ApiResponse.error(res, error.message, error.status);
        console.error("Error creating event:", error);
        return next(error);
    }
};

export const getEventById = async (req, res, next) => {
    try {
        const eventId = parseInt(req.params.id);
        const event = await defaultEventService.getEventById(eventId);
        return ApiResponse.success(res, event, "Event fetched successfully");
    } catch (error) {
        if (error.status) return ApiResponse.error(res, error.message, error.status);
        console.error("Error fetching event:", error);
        return next(error);
    }
};

export const getUpcomingEvents = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 20;
        const offset = parseInt(req.query.offset) || 0;
        const events = await defaultEventService.getUpcomingEvents({ limit, offset });
        return ApiResponse.success(res, events, "Upcoming events fetched successfully");
    } catch (error) {
        if (error.status) return ApiResponse.error(res, error.message, error.status);
        console.error("Error fetching upcoming events:", error);
        return next(error);
    }
};

export const getUserEvents = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        const events = await defaultEventService.getUserEvents(userId);
        return ApiResponse.success(res, events, "User events fetched successfully");
    } catch (error) {
        if (error.status) return ApiResponse.error(res, error.message, error.status);
        console.error("Error fetching user events:", error);
        return next(error);
    }
};

export const rsvpEvent = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        const eventId = parseInt(req.params.id);
        const { status } = req.body;
        const result = await defaultEventService.rsvpEvent(userId, eventId, status);
        return ApiResponse.success(res, result, "RSVP updated successfully");
    } catch (error) {
        if (error.status) return ApiResponse.error(res, error.message, error.status);
        console.error("Error updating RSVP:", error);
        return next(error);
    }
};

export const updateEvent = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        const eventId = parseInt(req.params.id);
        const event = await defaultEventService.updateEvent(userId, eventId, req.body);
        return ApiResponse.success(res, event, "Event updated successfully");
    } catch (error) {
        if (error.status) return ApiResponse.error(res, error.message, error.status);
        console.error("Error updating event:", error);
        return next(error);
    }
};

export const deleteEvent = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        const eventId = parseInt(req.params.id);
        const result = await defaultEventService.deleteEvent(userId, eventId);
        return ApiResponse.success(res, result, "Event deleted successfully");
    } catch (error) {
        if (error.status) return ApiResponse.error(res, error.message, error.status);
        console.error("Error deleting event:", error);
        return next(error);
    }
};
