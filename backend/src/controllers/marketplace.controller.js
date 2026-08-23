import { defaultMarketplaceService } from "../services/marketplace.service.js";
import { ApiResponse } from "../utils/apiResponse.js";

export const createListing = async (req, res, next) => {
    try {
        const sellerId = req.user.id;
        const listing = await defaultMarketplaceService.createListing(sellerId, req.body);
        return ApiResponse.success(res, listing, "Marketplace listing created successfully", 201);
    } catch (error) {
        if (error.status) return ApiResponse.error(res, error.message, error.status);
        console.error("Error creating listing:", error);
        return next(error);
    }
};

export const getListings = async (req, res, next) => {
    try {
        const { category, search, location, limit = 20, offset = 0 } = req.query;
        const limitValue = parseInt(limit, 10) || 20;
        const offsetValue = parseInt(offset, 10) || 0;

        const listings = await defaultMarketplaceService.getListings({
            category,
            search,
            location,
            limit: limitValue,
            offset: offsetValue
        });

        return ApiResponse.success(res, listings, "Marketplace listings fetched successfully");
    } catch (error) {
        if (error.status) return ApiResponse.error(res, error.message, error.status);
        console.error("Error fetching listings:", error);
        return next(error);
    }
};

export const getListingById = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id, 10);
        const listing = await defaultMarketplaceService.getListingById(id);
        return ApiResponse.success(res, listing, "Listing fetched successfully");
    } catch (error) {
        if (error.status) return ApiResponse.error(res, error.message, error.status);
        console.error("Error fetching listing:", error);
        return next(error);
    }
};

export const getUserListings = async (req, res, next) => {
    try {
        const sellerId = req.user.id;
        const listings = await defaultMarketplaceService.getUserListings(sellerId);
        return ApiResponse.success(res, listings, "User listings fetched successfully");
    } catch (error) {
        if (error.status) return ApiResponse.error(res, error.message, error.status);
        console.error("Error fetching user listings:", error);
        return next(error);
    }
};

export const deleteListing = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const listingId = parseInt(req.params.id, 10);
        const result = await defaultMarketplaceService.deleteListing(userId, listingId);
        return ApiResponse.success(res, result, "Listing deleted successfully");
    } catch (error) {
        if (error.status) return ApiResponse.error(res, error.message, error.status);
        console.error("Error deleting listing:", error);
        return next(error);
    }
};
