import pymkService from "../services/discovery/pymk.service.js";
import searchService from "../services/discovery/search.service.js";
import viewHistoryService from "../services/discovery/viewHistory.service.js";
import locationDiscoveryService from "../services/discovery/locationDiscovery.service.js";
import personalizationService from "../services/discovery/personalization.service.js";

export const getPymk = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const limit = parseInt(req.query.limit) || 10;
        const result = await pymkService.getPeopleYouMayKnow(userId, limit);
        return res.status(200).json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
};

export const searchWithFilters = async (req, res, next) => {
    try {
        const { query, entity, category, location, dateRange, sortBy, page, limit } = req.query;
        const result = await searchService.searchWithFilters({
            query: query || "",
            entity: entity || "all",
            category: category || "all",
            location: location || "",
            dateRange: dateRange || "all",
            sortBy: sortBy || "relevance",
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 20,
        });
        return res.status(200).json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
};

export const recordPostView = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { postId } = req.body;
        const result = await viewHistoryService.recordView(userId, parseInt(postId));
        return res.status(200).json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
};

export const getRecentlyViewed = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const limit = parseInt(req.query.limit) || 20;
        const result = await viewHistoryService.getRecentlyViewed(userId, limit);
        return res.status(200).json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
};

export const clearViewHistory = async (req, res, next) => {
    try {
        const userId = req.user.id;
        await viewHistoryService.clearHistory(userId);
        return res.status(200).json({ success: true, message: "View history cleared successfully" });
    } catch (error) {
        next(error);
    }
};

export const getNearbyContent = async (req, res, next) => {
    try {
        const { city, lat, lng, radiusKm, limit } = req.query;
        const result = await locationDiscoveryService.getNearbyContent({
            city: city || "",
            lat: lat ? parseFloat(lat) : null,
            lng: lng ? parseFloat(lng) : null,
            radiusKm: parseInt(radiusKm) || 50,
            limit: parseInt(limit) || 20,
        });
        return res.status(200).json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
};

export const getPersonalizedFeed = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const limit = parseInt(req.query.limit) || 20;
        const result = await personalizationService.getPersonalizedFeed(userId, limit);
        return res.status(200).json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
};

export const getSerendipityFeed = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const result = await personalizationService.getSerendipityFeed(userId);
        return res.status(200).json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
};

export const getDaily5Feed = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const result = await personalizationService.getDaily5Feed(userId);
        return res.status(200).json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
};

export const updateUserInterests = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { interests } = req.body;
        const result = await personalizationService.updateUserInterests(userId, interests);
        return res.status(200).json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
};
