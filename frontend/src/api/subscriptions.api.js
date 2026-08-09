import apiClient from "./client";
import { API_ENDPOINTS } from "../constant/apiEndpoints";

export const createCheckoutSession = async () => {
    const response = await apiClient.post(API_ENDPOINTS.SUBSCRIPTIONS.CHECKOUT);
    if (response.status !== 200 && response.status !== 201) {
        throw new Error("Failed to create checkout session");
    }
    return response.data;
};
