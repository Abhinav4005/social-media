import { describe, it, expect, vi } from "vitest";

describe("Discovery & Search Service Tests", () => {
    describe("People You May Know (PYMK) Algorithm", () => {
        const calculateMutualScore = (userA, userB) => {
            const mutualFriends = userA.friendIds.filter(id => userB.friendIds.includes(id)).length;
            const sharedInterests = userA.interests.filter(i => userB.interests.includes(i)).length;
            return (mutualFriends * 3) + (sharedInterests * 1);
        };

        it("should calculate recommendation score based on mutual friends and interests", () => {
            const current = { friendIds: [2, 3, 4], interests: ["coding", "gaming"] };
            const candidate1 = { id: 10, friendIds: [2, 3, 5], interests: ["coding", "music"] };
            const candidate2 = { id: 11, friendIds: [99], interests: ["cooking"] };

            const score1 = calculateMutualScore(current, candidate1); // (2 * 3) + (1 * 1) = 7
            const score2 = calculateMutualScore(current, candidate2); // (0 * 3) + (0 * 1) = 0

            expect(score1).toBe(7);
            expect(score2).toBe(0);
            expect(score1).toBeGreaterThan(score2);
        });
    });

    describe("Multi-parametric Search Filter", () => {
        const posts = [
            { id: 1, title: "React 19 release", tags: ["tech", "react"], location: "New York" },
            { id: 2, title: "Best pizza in town", tags: ["food"], location: "Chicago" },
            { id: 3, title: "Advanced React Patterns", tags: ["tech", "javascript"], location: "New York" }
        ];

        const filterPosts = (list, query, tag, location) => {
            return list.filter(p => {
                if (query && !p.title.toLowerCase().includes(query.toLowerCase())) return false;
                if (tag && !p.tags.includes(tag)) return false;
                if (location && p.location !== location) return false;
                return true;
            });
        };

        it("should filter posts by tag and location", () => {
            const results = filterPosts(posts, "", "tech", "New York");
            expect(results).toHaveLength(2);
            expect(results.map(r => r.id)).toEqual([1, 3]);
        });

        it("should filter posts by search query keyword", () => {
            const results = filterPosts(posts, "pizza", null, null);
            expect(results).toHaveLength(1);
            expect(results[0].id).toBe(2);
        });
    });
});
