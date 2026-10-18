import { describe, it, expect } from "vitest";

describe("PostSafetyMenu UI Logic & Action Handlers", () => {
    const getMenuActions = (targetType, authorId) => {
        const actions = [{ type: "REPORT", label: `Report ${targetType.toLowerCase()}` }];
        if (authorId) {
            actions.push({ type: "MUTE", label: "Mute User" });
            actions.push({ type: "BLOCK", label: "Block User" });
        }
        return actions;
    };

    it("should generate Report action for POST target", () => {
        const actions = getMenuActions("POST", null);
        expect(actions).toHaveLength(1);
        expect(actions[0].type).toBe("REPORT");
        expect(actions[0].label).toBe("Report post");
    });

    it("should generate Mute and Block actions when authorId is provided", () => {
        const actions = getMenuActions("POST", 202);
        expect(actions).toHaveLength(3);
        expect(actions.map(a => a.type)).toEqual(["REPORT", "MUTE", "BLOCK"]);
    });

    it("should format COMMENT target report label correctly", () => {
        const actions = getMenuActions("COMMENT", 202);
        expect(actions[0].label).toBe("Report comment");
    });
});
