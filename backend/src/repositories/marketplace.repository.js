import { prisma } from "../lib/prisma.js";

export class MarketplaceRepository {
    constructor(db = prisma) {
        this.db = db;
    }

    async createListing(data) {
        return await this.db.marketplaceListing.create({
            data,
            include: {
                seller: {
                    select: { id: true, name: true, profileImage: true, email: true, location: true }
                }
            }
        });
    }

    async findListingById(id) {
        return await this.db.marketplaceListing.findUnique({
            where: { id },
            include: {
                seller: {
                    select: { id: true, name: true, profileImage: true, email: true, location: true }
                }
            }
        });
    }

    async findAllListings({ category, search, location, isSold = false, limit = 20, offset = 0 } = {}) {
        const where = { isSold };

        if (category && category !== "ALL" && category !== "all") {
            where.category = category.toUpperCase();
        }

        if (search) {
            where.OR = [
                { title: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
            ];
        }

        if (location) {
            where.location = { contains: location, mode: "insensitive" };
        }

        return await this.db.marketplaceListing.findMany({
            where,
            include: {
                seller: {
                    select: { id: true, name: true, profileImage: true, email: true, location: true }
                }
            },
            orderBy: { createdAt: "desc" },
            take: limit,
            skip: offset
        });
    }

    async findListingsBySeller(sellerId) {
        return await this.db.marketplaceListing.findMany({
            where: { sellerId },
            include: {
                seller: {
                    select: { id: true, name: true, profileImage: true, email: true }
                }
            },
            orderBy: { createdAt: "desc" }
        });
    }

    async updateListing(id, data) {
        return await this.db.marketplaceListing.update({
            where: { id },
            data,
            include: {
                seller: {
                    select: { id: true, name: true, profileImage: true, email: true }
                }
            }
        });
    }

    async deleteListing(id) {
        return await this.db.marketplaceListing.delete({
            where: { id }
        });
    }
}

export const defaultMarketplaceRepository = new MarketplaceRepository();
