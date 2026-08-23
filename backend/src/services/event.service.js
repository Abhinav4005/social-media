import { defaultEventRepository } from "../repositories/event.repository.js";
import { ApiError } from "../utils/apiError.js";

export class EventService {
    constructor(eventRepository = defaultEventRepository) {
        this.eventRepository = eventRepository;
    }

    async createEvent(userId, { title, description, location, startDate, endDate, coverImage, coverImageId }) {
        if (!title || title.trim().length < 2) {
            throw new ApiError(400, "Event title must be at least 2 characters");
        }
        if (!startDate) {
            throw new ApiError(400, "Start date is required");
        }

        const parsedStart = new Date(startDate);
        if (isNaN(parsedStart.getTime())) {
            throw new ApiError(400, "Invalid start date");
        }

        const event = await this.eventRepository.createEvent({
            title: title.trim(),
            description: description?.trim() || null,
            location: location?.trim() || null,
            startDate: parsedStart,
            endDate: endDate ? new Date(endDate) : null,
            coverImage: coverImage || null,
            coverImageId: coverImageId || null,
            creatorId: userId,
        });

        // Creator is automatically GOING
        await this.eventRepository.upsertAttendee(event.id, userId, "GOING");

        return await this.eventRepository.findEventById(event.id);
    }

    async getEventById(eventId) {
        const event = await this.eventRepository.findEventById(eventId);
        if (!event) throw new ApiError(404, "Event not found");

        const counts = await this.eventRepository.getAttendeeCountsByStatus(eventId);
        return { ...event, interestedCount: counts.interested, goingCount: counts.going };
    }

    async getUpcomingEvents({ limit, offset }) {
        return await this.eventRepository.findUpcomingEvents({ limit, offset });
    }

    async getUserEvents(userId) {
        return await this.eventRepository.findUserEvents(userId);
    }

    async rsvpEvent(userId, eventId, status) {
        const event = await this.eventRepository.findEventById(eventId);
        if (!event) throw new ApiError(404, "Event not found");

        const validStatuses = ["INTERESTED", "GOING", "NOT_GOING"];
        if (!validStatuses.includes(status)) {
            throw new ApiError(400, "Invalid RSVP status. Must be INTERESTED, GOING, or NOT_GOING");
        }

        if (status === "NOT_GOING") {
            const existing = await this.eventRepository.findAttendance(eventId, userId);
            if (existing) {
                await this.eventRepository.removeAttendee(eventId, userId);
            }
            return { message: "RSVP removed" };
        }

        await this.eventRepository.upsertAttendee(eventId, userId, status);
        return await this.eventRepository.findEventById(eventId);
    }

    async updateEvent(userId, eventId, data) {
        const event = await this.eventRepository.findEventById(eventId);
        if (!event) throw new ApiError(404, "Event not found");
        if (event.creatorId !== userId) {
            throw new ApiError(403, "Only the event creator can update this event");
        }

        const updateData = {};
        if (data.title) updateData.title = data.title.trim();
        if (data.description !== undefined) updateData.description = data.description?.trim() || null;
        if (data.location !== undefined) updateData.location = data.location?.trim() || null;
        if (data.startDate) updateData.startDate = new Date(data.startDate);
        if (data.endDate !== undefined) updateData.endDate = data.endDate ? new Date(data.endDate) : null;
        if (data.coverImage) updateData.coverImage = data.coverImage;
        if (data.coverImageId) updateData.coverImageId = data.coverImageId;

        await this.eventRepository.updateEvent(eventId, updateData);
        return await this.eventRepository.findEventById(eventId);
    }

    async deleteEvent(userId, eventId) {
        const event = await this.eventRepository.findEventById(eventId);
        if (!event) throw new ApiError(404, "Event not found");
        if (event.creatorId !== userId) {
            throw new ApiError(403, "Only the event creator can delete this event");
        }

        await this.eventRepository.deleteEvent(eventId);
        return { message: "Event deleted successfully" };
    }
}

export const defaultEventService = new EventService();
