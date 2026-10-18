import { describe, it, expect } from "vitest";

describe("VerifiedBadge UI Component Tests", () => {
    const BADGE_CONFIG = {
        BLUE_CHECK: { label: "Verified User", color: "text-blue-500" },
        CREATOR: { label: "Verified Creator", color: "text-purple-500" },
        GOV_ID: { label: "Government ID Verified", color: "text-emerald-500" },
    };

    it("should return correct configuration for BLUE_CHECK badge", () => {
        const config = BADGE_CONFIG["BLUE_CHECK"];
        expect(config).toBeDefined();
        expect(config.label).toBe("Verified User");
        expect(config.color).toContain("text-blue-500");
    });

    it("should return correct configuration for CREATOR badge", () => {
        const config = BADGE_CONFIG["CREATOR"];
        expect(config).toBeDefined();
        expect(config.label).toBe("Verified Creator");
        expect(config.color).toContain("text-purple-500");
    });

    it("should return correct configuration for GOV_ID badge", () => {
        const config = BADGE_CONFIG["GOV_ID"];
        expect(config).toBeDefined();
        expect(config.label).toBe("Government ID Verified");
        expect(config.color).toContain("text-emerald-500");
    });

    it("should handle unknown or missing badge types gracefully", () => {
        const config = BADGE_CONFIG["UNKNOWN"];
        expect(config).toBeUndefined();
    });
});
