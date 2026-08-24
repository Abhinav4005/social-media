import { ApiError } from "../utils/apiError.js";

/**
 * Isolated AI Quota Service.
 * Separates AI usage quota tracking and tier enforcement from core business logic.
 * Single Responsibility: Manage daily AI call limits per user tier.
 */
class AIQuotaService {
    constructor() {
        // In-memory daily quota map: key = `${userId}:${YYYY-MM-DD}` -> count
        this.dailyUsageMap = new Map();
        this.FREE_DAILY_LIMIT = 3;
    }

    _getTodayKey(userId) {
        const today = new Date().toISOString().split("T")[0];
        return `${userId}:${today}`;
    }

    getQuotaStatus({ userId, isSubscribed = false }) {
        if (isSubscribed) {
            return { isSubscribed: true, remaining: Infinity, limit: Infinity, used: 0 };
        }
        const key = this._getTodayKey(userId);
        const used = this.dailyUsageMap.get(key) || 0;
        const remaining = Math.max(0, this.FREE_DAILY_LIMIT - used);
        return { isSubscribed: false, remaining, limit: this.FREE_DAILY_LIMIT, used };
    }

    checkAndConsumeQuota({ userId, isSubscribed = false }) {
        if (isSubscribed) {
            return { isSubscribed: true, remaining: Infinity };
        }

        const key = this._getTodayKey(userId);
        const currentUsed = this.dailyUsageMap.get(key) || 0;

        if (currentUsed >= this.FREE_DAILY_LIMIT) {
            const error = new ApiError(
                403,
                `Free AI daily limit reached (${this.FREE_DAILY_LIMIT}/${this.FREE_DAILY_LIMIT} calls used today). Upgrade to Premium for unlimited AI access!`
            );
            error.upgradeRequired = true;
            error.quotaLimit = this.FREE_DAILY_LIMIT;
            throw error;
        }

        const newCount = currentUsed + 1;
        this.dailyUsageMap.set(key, newCount);

        return {
            isSubscribed: false,
            used: newCount,
            remaining: this.FREE_DAILY_LIMIT - newCount,
            limit: this.FREE_DAILY_LIMIT,
        };
    }
}

export const defaultAIQuotaService = new AIQuotaService();
