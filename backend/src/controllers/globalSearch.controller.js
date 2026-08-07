import { globalPostSearch, globalUserSearch } from "../services/globalSearch.service.js";
import { ApiResponse } from "../utils/apiResponse.js";

export const globalSearch = async (req, res, next) => {
    const { search, type = "all", page, limit = 10 } = req.query;
    const userId = req.user.id;

    const limitValue = parseInt(limit, 10) || 10;

    const pageValue = parseInt(page, 10) || 1;
    const offset = (pageValue - 1) * limitValue;

    const searchTrim = search ? search.trim() : "";

    if (!searchTrim || searchTrim.length < 3) {
        return ApiResponse.error(res, "Search query must be at least 3 characters long", 400);
    }

    try {
        const [users, posts] = await Promise.all([
            globalUserSearch(searchTrim, type, limitValue, offset, userId),
            globalPostSearch(searchTrim, type, limitValue, offset)
        ]);

        return ApiResponse.success(res, {
            users,
            posts,
            totalResults: (users?.length || 0) + (posts?.length || 0)
        }, "Search results fetched successfully", 200);
    } catch (error) {
        console.error("Error performing global search:", error);
        return next(error);
    }
};

