import { globalPostSearch, globalUserSearch } from "../services/globalSearch.service.js";

export const globalSearch = async (req, res) => {
    const { search, type = "all", page, limit = 10 } = req.query;
    const userId = req.user.id;

    const limitValue = parseInt(limit, 10) || 10;

    const pageValue = parseInt(page, 10) || 1;
    const offset = (pageValue - 1) * limitValue;

    const searchTrim = search ? search.trim() : "";

    if (!searchTrim || searchTrim.length < 3) {
        return res.status(400).json({ message: "Search query must be at least 3 characters long" });
    }

    try {
        const [users, posts] = await Promise.all([
            globalUserSearch(searchTrim, type, limitValue, offset, userId),
            globalPostSearch(searchTrim, type, limitValue, offset)
        ]);

        return res.status(200).json({
            message: "Search results fetched successfully",
            data: {
                users: users,
                posts: posts,
                totalResults: (users?.length || 0) + (posts?.length || 0)
            }
        });
    } catch (error) {
        console.error("Error performing global search:", error);
        return res.status(500).json({ message: "An error occurred", error: error.message });
    }
}
