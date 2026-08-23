import { prisma } from "../lib/prisma.js";

export class EventRepository {
    constructor(db = prisma) {
        this.db = db;
    }

    async createEvent(data) {
        return await this.db.event.create({ data });
    }

    async findEventById(id) {
        return await this.db.event.findUnique({
            where: { id },
            include: {
                creator: { select: { id: true, name: true, profileImage: true } },
                _count: { select: { attendees: true } },
                attendees: {
                    include: { user: { select: { id: true, name: true, profileImage: true } } },
                    take: 10
                }
            }
        });
    }

    async findUpcomingEvents({ limit = 20, offset = 0 }) {
        return await this.db.event.findMany({
            where: { startDate: { gte: new Date() } },
            include: {
                creator: { select: { id: true, name: true, profileImage: true } },
                _count: { select: { attendees: true } }
            },
            orderBy: { startDate: "asc" },
            take: limit,
            skip: offset
        });
    }

    async findEventsByCreator(creatorId) {
        return await this.db.event.findMany({
            where: { creatorId },
            include: { _count: { select: { attendees: true } } },
            orderBy: { startDate: "asc" }
        });
    }

    async findUserEvents(userId) {
        return await this.db.event.findMany({
            where: { attendees: { some: { userId } } },
            include: {
                creator: { select: { id: true, name: true, profileImage: true } },
                _count: { select: { attendees: true } },
                attendees: { where: { userId }, select: { status: true } }
            },
            orderBy: { startDate: "asc" }
        });
    }

    async upsertAttendee(eventId, userId, status) {
        return await this.db.eventAttendee.upsert({
            where: { eventId_userId: { eventId, userId } },
            create: { eventId, userId, status },
            update: { status }
        });
    }

    async removeAttendee(eventId, userId) {
        return await this.db.eventAttendee.delete({
            where: { eventId_userId: { eventId, userId } }
        });
    }

    async findAttendance(eventId, userId) {
        return await this.db.eventAttendee.findUnique({
            where: { eventId_userId: { eventId, userId } }
        });
    }

    async updateEvent(id, data) {
        return await this.db.event.update({ where: { id }, data });
    }

    async deleteEvent(id) {
        return await this.db.event.delete({ where: { id } });
    }

    async getAttendeeCountsByStatus(eventId) {
        const [interested, going] = await Promise.all([
            this.db.eventAttendee.count({ where: { eventId, status: "INTERESTED" } }),
            this.db.eventAttendee.count({ where: { eventId, status: "GOING" } })
        ]);
        return { interested, going };
    }
}

export const defaultEventRepository = new EventRepository();
