import { defaultCallRepository } from "../../repositories/call.repository.js";

/**
 * Socket Call Service handling WebRTC call session lifecycle.
 * Fulfills SRP & DIP by delegating DB logic to CallRepository.
 */
export class CallServiceClass {
  constructor(repo = defaultCallRepository) {
    this.repo = repo;
  }

  async startCall(roomId, callerId) {
    const existingCall = await this.repo.findActiveCallByRoom(roomId);
    if (existingCall) {
      throw new Error("Call already active in this room");
    }

    return await this.repo.createCallSession(roomId, callerId);
  }

  async joinCall(callSessionId, userId) {
    await this.repo.upsertParticipant(callSessionId, userId);

    const count = await this.repo.countActiveParticipants(callSessionId);
    if (count === 2) {
      await this.repo.updateCallStatus(callSessionId, "ACTIVE", { answeredAt: new Date() });
    }
  }

  async leaveCall(callSessionId, userId) {
    await this.repo.markParticipantLeft(callSessionId, userId);

    const active = await this.repo.countActiveParticipants(callSessionId);
    if (active === 0) {
      await this.repo.updateActiveCallStatus(callSessionId, "ENDED", { endedAt: new Date() });
    }
  }

  async endCall(callSessionId) {
    await this.repo.updateCallStatus(callSessionId, "ENDED", { endedAt: new Date() });
    await this.repo.markAllParticipantsLeft(callSessionId);
  }
}

export const defaultCallService = new CallServiceClass();

// Export object matching existing handler usage
export const CallService = {
  startCall: (roomId, callerId) => defaultCallService.startCall(roomId, callerId),
  joinCall: (callSessionId, userId) => defaultCallService.joinCall(callSessionId, userId),
  leaveCall: (callSessionId, userId) => defaultCallService.leaveCall(callSessionId, userId),
  endCall: (callSessionId) => defaultCallService.endCall(callSessionId)
};