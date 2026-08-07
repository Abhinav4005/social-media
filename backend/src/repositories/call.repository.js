import { prisma } from "../lib/prisma.js";

/**
 * Call Repository encapsulating queries for CallSession and CallParticipant models.
 * Handles database operations for WebRTC video & audio call sessions.
 */
export class CallRepository {
    constructor(db = prisma) {
        this.db = db;
    }

    async findActiveCallByRoom(roomId) {
        return await this.db.callSession.findFirst({
            where: {
                roomId,
                status: { in: ["RINGING", "ACTIVE"] }
            }
        });
    }

    async createCallSession(roomId, callerId) {
        return await this.db.callSession.create({
            data: {
                roomId,
                status: "RINGING",
                participants: {
                    create: {
                        userId: callerId
                    }
                }
            }
        });
    }

    async upsertParticipant(callSessionId, userId) {
        return await this.db.callParticipant.upsert({
            where: {
                callSessionId_userId: {
                    callSessionId,
                    userId
                }
            },
            update: {},
            create: {
                callSessionId,
                userId
            }
        });
    }

    async countActiveParticipants(callSessionId) {
        return await this.db.callParticipant.count({
            where: {
                callSessionId,
                leftAt: null
            }
        });
    }

    async updateCallStatus(callSessionId, status, extraData = {}) {
        return await this.db.callSession.update({
            where: { id: callSessionId },
            data: {
                status,
                ...extraData
            }
        });
    }

    async updateActiveCallStatus(callSessionId, status, extraData = {}) {
        return await this.db.callSession.update({
            where: {
                id: callSessionId,
                status: { in: ["RINGING", "ACTIVE"] }
            },
            data: {
                status,
                ...extraData
            }
        });
    }

    async markParticipantLeft(callSessionId, userId) {
        return await this.db.callParticipant.updateMany({
            where: {
                callSessionId,
                userId,
                leftAt: null
            },
            data: {
                leftAt: new Date()
            }
        });
    }

    async markAllParticipantsLeft(callSessionId) {
        return await this.db.callParticipant.updateMany({
            where: {
                callSessionId,
                leftAt: null
            },
            data: {
                leftAt: new Date()
            }
        });
    }
}

export const defaultCallRepository = new CallRepository();
