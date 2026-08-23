import apiClient from "./client";
import { API_ENDPOINTS } from "../constant/apiEndpoints";

export const getMarketplaceListings = async (category = "all", search = "") => {
    const params = {};
    if (category && category !== "all") params.category = category;
    if (search) params.search = search;
    const res = await apiClient.get(API_ENDPOINTS.MARKETPLACE.LISTINGS, { params });
    return res.data?.data || res.data || [];
};

export const getMyMarketplaceListings = async () => {
    const res = await apiClient.get(API_ENDPOINTS.MARKETPLACE.MY_LISTINGS);
    return res.data?.data || res.data || [];
};

export const getMarketplaceListingById = async (id) => {
    const res = await apiClient.get(API_ENDPOINTS.MARKETPLACE.BY_ID(id));
    return res.data?.data || res.data;
};

export const createMarketplaceListing = async (data) => {
    const res = await apiClient.post(API_ENDPOINTS.MARKETPLACE.CREATE, data);
    return res.data?.data || res.data;
};

export const deleteMarketplaceListing = async (id) => {
    const res = await apiClient.delete(API_ENDPOINTS.MARKETPLACE.DELETE(id));
    return res.data?.data || res.data;
};
