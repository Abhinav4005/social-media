import { defaultAIService } from "../services/ai.service.js";
import { ApiResponse } from "../utils/apiResponse.js";

export const generatePostAI = async (req, res, next) => {
    try {
        const { topic, tone } = req.body;
        if (!topic || !topic.trim()) {
            return ApiResponse.error(res, "Topic is required for AI generation", 400);
        }
        const result = await defaultAIService.generatePostContent({ topic, tone });
        return ApiResponse.success(res, result, "AI post content generated successfully");
    } catch (error) {
        console.error("Error generating AI post content:", error);
        return next(error);
    }
};

export const generateListingAI = async (req, res, next) => {
    try {
        const { item, category, condition } = req.body;
        if (!item || !item.trim()) {
            return ApiResponse.error(res, "Item name is required for AI generation", 400);
        }
        const result = await defaultAIService.generateListingContent({ item, category, condition });
        return ApiResponse.success(res, result, "AI marketplace listing content generated successfully");
    } catch (error) {
        console.error("Error generating AI listing content:", error);
        return next(error);
    }
};

export const chatWithAIController = async (req, res, next) => {
    try {
        const { message, history } = req.body;
        if (!message || !message.trim()) {
            return ApiResponse.error(res, "Message is required", 400);
        }
        const result = await defaultAIService.chatWithAI({ message: message.trim(), history });
        return ApiResponse.success(res, result, "AI chat response generated");
    } catch (error) {
        console.error("Error chatting with AI:", error);
        return next(error);
    }
};
