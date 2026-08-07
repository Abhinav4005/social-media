import { defaultStripeService } from "../services/stripe.service.js";
import { ApiResponse } from "../utils/apiResponse.js";

export const createCheckoutSession = async (req, res, next) => {
    try {
        const result = await defaultStripeService.createCheckoutSession(req.user?.id);
        return ApiResponse.success(res, result, "Checkout session created successfully", 201);
    } catch (error) {
        if (error.status) return ApiResponse.error(res, error.message, error.status);
        console.error("Error while creating checkout session", error.message);
        return next(error);
    }
};

export const stripeWebhook = async (req, res, next) => {
    try {
        return ApiResponse.success(res, { received: true }, "Webhook processed", 200);
    } catch (error) {
        console.error("Error in stripe webhook", error);
        return next(error);
    }
};