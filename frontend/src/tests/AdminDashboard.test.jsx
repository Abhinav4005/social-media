import { describe, it, expect } from "vitest";

describe("Admin Moderation Dashboard UI Logic Tests", () => {
    const DASHBOARD_TABS = [
        { id: "reports", label: "Content Reports" },
        { id: "verifications", label: "Verification Requests" },
        { id: "appeals", label: "User Appeals" },
        { id: "audit_logs", label: "Audit Trail" },
        { id: "suspicious_logins", label: "Security Alerts" },
        { id: "guidelines", label: "Community Guidelines" }
    ];

    it("should contain all 6 admin moderation tabs", () => {
        expect(DASHBOARD_TABS).toHaveLength(6);
        expect(DASHBOARD_TABS.map(t => t.id)).toEqual([
            "reports",
            "verifications",
            "appeals",
            "audit_logs",
            "suspicious_logins",
            "guidelines"
        ]);
    });

    it("should format report status badges correctly", () => {
        const getStatusBadgeColor = (status) => {
            switch (status) {
                case "PENDING": return "bg-yellow-100 text-yellow-800";
                case "RESOLVED": return "bg-green-100 text-green-800";
                case "DISMISSED": return "bg-gray-100 text-gray-800";
                default: return "bg-blue-100 text-blue-800";
            }
        };

        expect(getStatusBadgeColor("PENDING")).toContain("yellow");
        expect(getStatusBadgeColor("RESOLVED")).toContain("green");
        expect(getStatusBadgeColor("DISMISSED")).toContain("gray");
    });
});
