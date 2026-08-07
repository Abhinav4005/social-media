import { stripe } from "../config/stripe.js";
import { defaultStripeRepository } from "../repositories/stripe.repository.js";

/**
 * Stripe Payment Service managing checkout session creation and customer synchronization.
 * Fulfills SRP & DIP.
 */
export class StripeService {
    constructor(repo = defaultStripeRepository, stripeClient = stripe) {
        this.repo = repo;
        this.stripe = stripeClient;
    }

    async createCheckoutSession(userId) {
        const user = await this.repo.findUserById(userId);
        if (!user) throw { status: 400, message: "User not found" };

        let customerId = user.stripeCustomerId;
        if (!customerId) {
            const customer = await this.stripe.customers.create({
                email: user.email,
                name: user.name,
            });
            customerId = customer.id;
            await this.repo.updateUserStripeCustomerId(userId, customerId);
        }

        const session = await this.stripe.checkout.sessions.create({
            customer: customerId,
            mode: "subscription",
            line_items: [
                {
                    price: process.env.STRIPE_PRICE_ID,
                    quantity: 1,
                }
            ],
            success_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment-success`,
            cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment-cancel`,
            metadata: {
                userId: String(userId)
            }
        });

        return { customerId, checkoutUrl: session.url };
    }
}

export const defaultStripeService = new StripeService();

