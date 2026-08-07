import { prisma } from "../lib/prisma.js";

/**
 * Stripe Repository handling persistence for Stripe customer IDs and subscription data.
 * Fulfills SRP by decoupling database queries from Stripe SDK logic.
 */
export class StripeRepository {
    constructor(db = prisma) {
        this.db = db;
    }

    async findUserById(userId) {
        return await this.db.user.findUnique({
            where: { id: userId }
        });
    }

    async updateUserStripeCustomerId(userId, stripeCustomerId) {
        return await this.db.user.update({
            where: { id: userId },
            data: { stripeCustomerId }
        });
    }
}

export const defaultStripeRepository = new StripeRepository();
