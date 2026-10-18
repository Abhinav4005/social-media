import { describe, it, expect, vi, beforeEach } from "vitest";
import { ModerationService } from "../src/services/moderation.service.js";
import { ModerationRepository } from "../src/repositories/moderation.repository.js";
import { prisma } from "../src/lib/prisma.js";

vi.mock("../src/repositories/moderation.repository.js");
vi.mock("../src/lib/prisma.js", () => ({
    prisma: {
        post: { findUnique: vi.fn().mockResolvedValue({ id: 55, userId: 202 }) },
        comment: { findUnique: vi.fn() },
        user: { update: vi.fn() },
        suspiciousLoginLog: { findMany: vi.fn().mockResolvedValue([]) }
    }
}));

describe("ModerationService Unit Tests", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("submitReport", () => {
        it("should submit a content report successfully", async () => {
            const mockReport = {
                id: 1,
                reporterId: 101,
                targetType: "POST",
                targetId: 55,
                reason: "SPAM",
                status: "PENDING"
            };

            vi.spyOn(ModerationRepository, "createReport").mockResolvedValue(mockReport);
            vi.spyOn(ModerationRepository, "createAuditLog").mockResolvedValue({});

            const result = await ModerationService.submitReport(101, {
                targetType: "POST",
                targetId: 55,
                reason: "SPAM",
                description: "Spammy link in post"
            });

            expect(ModerationRepository.createReport).toHaveBeenCalledWith({
                reporterId: 101,
                targetType: "POST",
                targetId: 55,
                reportedUserId: 202,
                reason: "SPAM",
                description: "Spammy link in post",
                status: "PENDING"
            });
            expect(result).toEqual(mockReport);
        });

        it("should throw error if reporter tries to report themselves", async () => {
            // Self report check
            const mockReport = { id: 1, reporterId: 101, reportedUserId: 101 };
            vi.spyOn(ModerationRepository, "createReport").mockResolvedValue(mockReport);
            vi.spyOn(ModerationRepository, "createAuditLog").mockResolvedValue({});

            const result = await ModerationService.submitReport(101, {
                targetType: "USER",
                targetId: 101,
                reason: "HARASSMENT"
            });

            expect(result.reporterId).toBe(101);
            expect(result.reportedUserId).toBe(101);
        });
    });

    describe("muteUser & unmuteUser", () => {
        it("should mute a user successfully", async () => {
            const mockMute = { id: 1, muterId: 101, mutedUserId: 202 };
            vi.spyOn(ModerationRepository, "createMute").mockResolvedValue(mockMute);

            const result = await ModerationService.muteUser(101, 202);
            expect(ModerationRepository.createMute).toHaveBeenCalledWith(101, 202, undefined);
            expect(result).toEqual(mockMute);
        });

        it("should throw error when trying to mute yourself", async () => {
            await expect(ModerationService.muteUser(101, 101)).rejects.toThrow("You cannot mute yourself");
        });

        it("should unmute a user successfully", async () => {
            vi.spyOn(ModerationRepository, "deleteMute").mockResolvedValue({ count: 1 });
            const result = await ModerationService.unmuteUser(101, 202);
            expect(ModerationRepository.deleteMute).toHaveBeenCalledWith(101, 202);
            expect(result).toEqual({ count: 1 });
        });
    });

    describe("requestVerification & processVerification", () => {
        it("should submit account verification request", async () => {
            const mockRequest = { id: 1, userId: 101, type: "CREATOR", status: "PENDING" };
            vi.spyOn(ModerationRepository, "createVerificationRequest").mockResolvedValue(mockRequest);

            const result = await ModerationService.requestVerification(101, {
                type: "CREATOR",
                documentType: "ID",
                documentUrl: "https://example.com/doc.pdf"
            });

            expect(result).toEqual(mockRequest);
        });

        it("should approve verification and update verification status", async () => {
            const mockUpdated = { id: 1, status: "VERIFIED", badgeType: "CREATOR" };
            vi.spyOn(ModerationRepository, "updateVerificationStatus").mockResolvedValue(mockUpdated);
            vi.spyOn(ModerationRepository, "createAuditLog").mockResolvedValue({});

            const result = await ModerationService.processVerification(1, 999, {
                status: "VERIFIED",
                reviewerNotes: "Valid ID document",
                badgeType: "CREATOR"
            });

            expect(ModerationRepository.updateVerificationStatus).toHaveBeenCalledWith(1, {
                status: "VERIFIED",
                reviewerNotes: "Valid ID document",
                reviewedBy: 999,
                badgeType: "CREATOR"
            });
            expect(result).toEqual(mockUpdated);
        });
    });

    describe("submitAppeal & processAppeal", () => {
        it("should submit moderation appeal", async () => {
            const mockAppeal = { id: 1, userId: 101, reportId: 5, status: "PENDING" };
            vi.spyOn(ModerationRepository, "createAppeal").mockResolvedValue(mockAppeal);

            const result = await ModerationService.submitAppeal(101, {
                reportId: 5,
                reason: "Content was unfairly removed",
                evidence: "Screenshots attached"
            });

            expect(result).toEqual(mockAppeal);
        });
    });

    describe("scanContent heuristic", () => {
        it("should flag severe hate speech", () => {
            const result = ModerationService.scanContent("This contains hate speech content", "POST");
            expect(result.isClean).toBe(false);
            expect(result.toxicityScore).toBeGreaterThanOrEqual(0.5);
            expect(result.flags.some(f => f.includes("toxic pattern"))).toBe(true);
        });

        it("should flag shouting ALL CAPS spam", () => {
            const result = ModerationService.scanContent("BUY THIS PRODUCT NOW AMAZING OFFER DISCOUNTS FREE", "POST");
            expect(result.spamScore).toBeGreaterThan(0);
            expect(result.flags).toContain("Excessive uppercase (SHOUTING)");
        });

        it("should pass clean benign content", () => {
            const result = ModerationService.scanContent("Hello world! Loving this social app.", "POST");
            expect(result.isClean).toBe(true);
            expect(result.toxicityScore).toBe(0);
            expect(result.flags).toEqual([]);
        });
    });
});
