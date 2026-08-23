import { defaultMarketplaceRepository } from "../repositories/marketplace.repository.js";
import { ApiError } from "../utils/apiError.js";

export class MarketplaceService {
    constructor(repo = defaultMarketplaceRepository) {
        this.repo = repo;
    }

    async createListing(sellerId, { title, description, price, category, location, images, image }) {
        if (!title || title.trim().length < 2) {
            throw new ApiError(400, "Title must be at least 2 characters long");
        }

        const numericPrice = parseFloat(price);
        if (isNaN(numericPrice) || numericPrice < 0) {
            throw new ApiError(400, "Please enter a valid price");
        }

        const imageArray = Array.isArray(images) ? images : image ? [image] : [];

        const listingData = {
            title: title.trim(),
            description: description?.trim() || "",
            price: numericPrice,
            category: category ? category.toUpperCase() : "OTHER",
            location: location?.trim() || null,
            images: imageArray,
            sellerId,
        };

        return await this.repo.createListing(listingData);
    }

    async getListingById(id) {
        const listing = await this.repo.findListingById(id);
        if (!listing) {
            throw new ApiError(404, "Listing not found");
        }
        return listing;
    }

    async getListings({ category, search, location, limit = 20, offset = 0 }) {
        return await this.repo.findAllListings({ category, search, location, limit, offset });
    }

    async getUserListings(sellerId) {
        return await this.repo.findListingsBySeller(sellerId);
    }

    async deleteListing(userId, listingId) {
        const listing = await this.repo.findListingById(listingId);
        if (!listing) {
            throw new ApiError(404, "Listing not found");
        }

        if (listing.sellerId !== userId) {
            throw new ApiError(403, "You can only delete your own listings");
        }

        await this.repo.deleteListing(listingId);
        return { message: "Listing deleted successfully" };
    }
}

export const defaultMarketplaceService = new MarketplaceService();
