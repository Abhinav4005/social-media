import { defaultAIService } from "../services/ai.service.js";
import { defaultAIQuotaService } from "../services/aiQuota.service.js";
import { ApiResponse } from "../utils/apiResponse.js";

const checkQuota = (req) => {
    const isSubscribed = req.user?.isSubscribed || req.user?.subscriptionStatus === "active" || false;
    return defaultAIQuotaService.checkAndConsumeQuota({ userId: req.user.id, isSubscribed });
};

export const generatePostAI = async (req, res, next) => {
    try {
        const quota = checkQuota(req);
        const { topic, tone } = req.body;
        if (!topic || !topic.trim()) {
            return ApiResponse.error(res, "Topic is required for AI generation", 400);
        }
        const result = await defaultAIService.generatePostContent({ topic, tone });
        return ApiResponse.success(res, { ...result, quota }, "AI post content generated successfully");
    } catch (error) {
        if (error.upgradeRequired) {
            return ApiResponse.error(res, error.message, 403, { upgradeRequired: true });
        }
        console.error("Error generating AI post content:", error);
        return next(error);
    }
};

export const generateListingAI = async (req, res, next) => {
    try {
        const quota = checkQuota(req);
        const { item, category, condition } = req.body;
        if (!item || !item.trim()) {
            return ApiResponse.error(res, "Item name is required for AI generation", 400);
        }
        const result = await defaultAIService.generateListingContent({ item, category, condition });
        return ApiResponse.success(res, { ...result, quota }, "AI marketplace listing content generated successfully");
    } catch (error) {
        if (error.upgradeRequired) {
            return ApiResponse.error(res, error.message, 403, { upgradeRequired: true });
        }
        console.error("Error generating AI listing content:", error);
        return next(error);
    }
};

export const chatWithAIController = async (req, res, next) => {
    try {
        const quota = checkQuota(req);
        const { message, history } = req.body;
        if (!message || !message.trim()) {
            return ApiResponse.error(res, "Message is required", 400);
        }
        const result = await defaultAIService.chatWithAI({ message: message.trim(), history });
        return ApiResponse.success(res, { ...result, quota }, "AI chat response generated");
    } catch (error) {
        if (error.upgradeRequired) {
            return ApiResponse.error(res, error.message, 403, { upgradeRequired: true });
        }
        console.error("Error chatting with AI:", error);
        return next(error);
    }
};

export const summarizePostAI = async (req, res, next) => {
    try {
        const quota = checkQuota(req);
        const { title, description, comments } = req.body;
        const result = await defaultAIService.summarizePost({ title, description, comments });
        return ApiResponse.success(res, { ...result, quota }, "Post summarized successfully");
    } catch (error) {
        if (error.upgradeRequired) {
            return ApiResponse.error(res, error.message, 403, { upgradeRequired: true });
        }
        console.error("Error summarizing post with AI:", error);
        return next(error);
    }
};

export const generateSmartReplyAI = async (req, res, next) => {
    try {
        const quota = checkQuota(req);
        const { context, tone } = req.body;
        const result = await defaultAIService.generateSmartReply({ context, tone });
        return ApiResponse.success(res, { ...result, quota }, "Smart replies generated successfully");
    } catch (error) {
        if (error.upgradeRequired) {
            return ApiResponse.error(res, error.message, 403, { upgradeRequired: true });
        }
        console.error("Error generating smart replies:", error);
        return next(error);
    }
};

export const generateBioAI = async (req, res, next) => {
    try {
        const quota = checkQuota(req);
        const { role, interests } = req.body;
        const result = await defaultAIService.generateBio({ role, interests });
        return ApiResponse.success(res, { ...result, quota }, "Bio generated successfully");
    } catch (error) {
        if (error.upgradeRequired) {
            return ApiResponse.error(res, error.message, 403, { upgradeRequired: true });
        }
        console.error("Error generating bio:", error);
        return next(error);
    }
};

export const generateEventAI = async (req, res, next) => {
    try {
        const quota = checkQuota(req);
        const { title, category } = req.body;
        const result = await defaultAIService.generateEvent({ title, category });
        return ApiResponse.success(res, { ...result, quota }, "Event generated successfully");
    } catch (error) {
        if (error.upgradeRequired) {
            return ApiResponse.error(res, error.message, 403, { upgradeRequired: true });
        }
        console.error("Error generating event:", error);
        return next(error);
    }
};

export const generateGroupAI = async (req, res, next) => {
    try {
        const quota = checkQuota(req);
        const { name, category } = req.body;
        const result = await defaultAIService.generateGroup({ name, category });
        return ApiResponse.success(res, { ...result, quota }, "Group content generated successfully");
    } catch (error) {
        if (error.upgradeRequired) {
            return ApiResponse.error(res, error.message, 403, { upgradeRequired: true });
        }
        console.error("Error generating group content:", error);
        return next(error);
    }
};
