import { defaultStoryService } from "../services/story.service.js";
import { ApiResponse } from "../utils/apiResponse.js";

export const createStory = async (req, res, next) => {
    try {
        const storyId = await defaultStoryService.createStory(req.user?.id, {
            ...req.body,
            files: req.files,
        });
        return ApiResponse.success(res, { storyId }, "Story created, processing in background", 201);
    } catch (error) {
        if (error.status) return ApiResponse.error(res, error.message, error.status);
        console.error("[create story] Error:", error);
        return next(error);
    }
};

export const getStories = async (req, res, next) => {
    try {
        const result = await defaultStoryService.getStories(
            req.user?.id,
            req.query.limit,
            req.query.cursor
        );
        return ApiResponse.success(res, result, "Stories fetched successfully", 200);
    } catch (error) {
        if (error.status) return ApiResponse.error(res, error.message, error.status);
        console.error("[get stories] Error:", error);
        return next(error);
    }
};

export const markStorySeen = async (req, res, next) => {
    try {
        const storyId = req.params.id || req.body.storyId || req.query.storyId;
        const view = await defaultStoryService.markStorySeen(req.user?.id, storyId);
        return ApiResponse.success(res, { view }, "Story marked as seen", 200);
    } catch (error) {
        if (error.status) return ApiResponse.error(res, error.message, error.status);
        console.error("[mark story seen] Error:", error);
        return next(error);
    }
};