import { prisma } from "../../lib/prisma.js";

export const CallService = {

  async startCall(roomId, callerId) {

    const existingCall = await prisma.callSession.findFirst({
      where: {
        roomId,
        status: { in: ["RINGING", "ACTIVE"] }
      }
    });

    if (existingCall) {
      throw new Error("Call already active in this room");
    }

    const call = await prisma.callSession.create({
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

    return call;
  },


  async joinCall(callSessionId, userId) {

    await prisma.callParticipant.upsert({
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

    const count = await prisma.callParticipant.count({
      where: {
        callSessionId,
        leftAt: null
      }
    });

    if (count === 2) {
      await prisma.callSession.update({
        where: { id: callSessionId },
        data: {
          status: "ACTIVE",
          answeredAt: new Date()
        }
      });
    }
  },


  async leaveCall(callSessionId, userId) {

    await prisma.callParticipant.updateMany({
      where: {
        callSessionId,
        userId,
        leftAt: null
      },
      data: {
        leftAt: new Date()
      }
    });

    const active = await prisma.callParticipant.count({
      where: {
        callSessionId,
        leftAt: null
      }
    });

    if (active === 0) {
      await prisma.callSession.update({
        where: { 
            id: callSessionId,
            status:{ in: ['RINGING', 'ACTIVE'] }
        },
        data: {
          status: "ENDED",
          endedAt: new Date()
        }
      });
    }
  },


  async endCall(callSessionId) {

    await prisma.callSession.update({
      where: { id: callSessionId },
      data: {
        status: "ENDED",
        endedAt: new Date()
      }
    });

    await prisma.callParticipant.updateMany({
      where: {
        callSessionId,
        leftAt: null
      },
      data: {
        leftAt: new Date()
      }
    });
  }

};