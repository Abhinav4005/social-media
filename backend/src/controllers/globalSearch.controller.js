import { globalPostSearch, globalUserSearch } from "../services/globalSearch.service.js";

export const globalSearch = async (req, res) => {
    const { search, type, page, limit = 10 } = req.query;
    const userId = req.user.id;

    const limitValue = parseInt(limit, 10) || 10;
    const offset = (parseInt(page, 10) - 1) * limitValue || 0;

    const searchTrim = search ? search.trim() : "";

    if (!searchTrim || searchTrim.length < 3) {
        return res.status(400).json({ message: "Search query must be at least 3 characters long" });
    }

    try {
        const users = await globalUserSearch(searchTrim, type, limit, offset, userId);
        const posts = await globalPostSearch(searchTrim, type, limit, offset);

        console.log("Global Search Results:", { users, posts });

        return res.status(200).json({
            message: "Search results fetched successfully",
            data: {
                users: users,
                posts: posts,
                totalResults: users?.length + posts?.length
            }
        });
    } catch (error) {
        console.error("Error performing global search:", error);
        return res.status(500).json({ message: "An error occurred", error: error.message });
    }
}