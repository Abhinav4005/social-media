import { describe, it, expect, vi, beforeEach } from "vitest";
import { idempotencyGuard } from "../src/middleware/idempotency.middleware.js";

describe("Idempotency Middleware Unit Tests", () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            method: "POST",
            headers: {},
            body: { title: "Test Post" }
        };
        res = {
            statusCode: 200,
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        };
        next = vi.fn();
    });

    it("should pass through requests without idempotency key", () => {
        idempotencyGuard()(req, res, next);
        expect(next).toHaveBeenCalled();
    });

    it("should process new request with idempotency key and cache response", () => {
        req.headers["idempotency-key"] = "test-key-12345";
        const middleware = idempotencyGuard(300);

        middleware(req, res, next);
        expect(next).toHaveBeenCalled();

        // Simulate resolution
        res.json({ success: true, id: 99 });

        // Second identical request with same key
        const req2 = { method: "POST", headers: { "idempotency-key": "test-key-12345" } };
        const res2 = { status: vi.fn().mockReturnThis(), json: vi.fn() };
        const next2 = vi.fn();

        middleware(req2, res2, next2);
        expect(res2.status).toHaveBeenCalledWith(200);
        expect(res2.json).toHaveBeenCalledWith({ success: true, id: 99 });
        expect(next2).not.toHaveBeenCalled();
    });
});
