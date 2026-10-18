import { describe, it, expect, vi, beforeEach } from "vitest";
import { contentModerator } from "../src/middleware/contentModerator.middleware.js";
import { ipBlacklistGuard, blockIp } from "../src/middleware/ipBlacklist.middleware.js";

describe("Security & Moderation Middleware Tests", () => {
    describe("contentModerator Middleware", () => {
        let req, res, next;

        beforeEach(() => {
            req = { body: {}, user: { id: 101 } };
            res = {
                status: vi.fn().mockReturnThis(),
                json: vi.fn()
            };
            next = vi.fn();
        });

        it("should allow clean content to pass to next()", async () => {
            req.body = { description: "Great post about web development!" };
            contentModerator("POST")(req, res, next);
            expect(next).toHaveBeenCalled();
            expect(res.status).not.toHaveBeenCalled();
        });

        it("should reject severe toxicity content with 422 Unprocessable Entity", async () => {
            req.body = { description: "This is hate speech and kill yourself" };
            contentModerator("POST")(req, res, next);
            expect(res.status).toHaveBeenCalledWith(422);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: false,
                    message: expect.stringContaining("Community Guidelines")
                })
            );
            expect(next).not.toHaveBeenCalled();
        });

        it("should attach moderationResult and call next() for non-blocking content", async () => {
            req.body = { text: "Nice post!" };
            contentModerator("POST")(req, res, next);
            expect(req.moderationResult).toBeDefined();
            expect(req.moderationResult.isClean).toBe(true);
            expect(next).toHaveBeenCalled();
        });
    });

    describe("ipBlacklistGuard Middleware", () => {
        let req, res, next;

        beforeEach(() => {
            req = { ip: "192.168.1.50" };
            res = {
                status: vi.fn().mockReturnThis(),
                json: vi.fn()
            };
            next = vi.fn();
        });

        it("should allow non-blacklisted IP to pass", () => {
            ipBlacklistGuard(req, res, next);
            expect(next).toHaveBeenCalled();
        });

        it("should block blacklisted IP with 403 Forbidden", () => {
            blockIp("192.168.1.50");
            ipBlacklistGuard(req, res, next);
            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: false,
                    message: "Access forbidden: Your IP address has been temporarily blocked due to security violations."
                })
            );
            expect(next).not.toHaveBeenCalled();
        });
    });
});
