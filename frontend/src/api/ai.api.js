import apiClient from "./client";
import { API_ENDPOINTS } from "../constant/apiEndpoints";

export const generateAIPost = async ({ topic, tone = "engaging" }) => {
    const res = await apiClient.post(API_ENDPOINTS.AI.GENERATE_POST, { topic, tone });
    return res.data?.data || res.data;
};

export const generateAIListing = async ({ item, category, condition }) => {
    const res = await apiClient.post(API_ENDPOINTS.AI.GENERATE_LISTING, { item, category, condition });
    return res.data?.data || res.data;
};

export const sendAIChatMessage = async ({ message, history = [] }) => {
    const res = await apiClient.post(API_ENDPOINTS.AI.CHAT, { message, history });
    return res.data?.data || res.data;
};

export const summarizeAIPost = async ({ title, description, comments = [] }) => {
    const res = await apiClient.post("/ai/summarize", { title, description, comments });
    return res.data?.data || res.data;
};

export const generateAISmartReply = async ({ context = "", tone = "supportive" }) => {
    const res = await apiClient.post("/ai/smart-reply", { context, tone });
    return res.data?.data || res.data;
};

export const generateAIBio = async ({ role, interests }) => {
    const res = await apiClient.post("/ai/generate-bio", { role, interests });
    return res.data?.data || res.data;
};

export const generateAIEvent = async ({ title, category }) => {
    const res = await apiClient.post("/ai/generate-event", { title, category });
    return res.data?.data || res.data;
};

export const generateAIGroup = async ({ name, category }) => {
    const res = await apiClient.post("/ai/generate-group", { name, category });
    return res.data?.data || res.data;
};
