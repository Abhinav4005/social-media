import apiClient from "./client";
import { API_ENDPOINTS } from "../constant/apiEndpoints";

export const createEvent = async (data) => {
    const response = await apiClient.post(API_ENDPOINTS.EVENTS.CREATE, data);
    return response.data;
};

export const getUpcomingEvents = async (limit = 20, offset = 0) => {
    const response = await apiClient.get(API_ENDPOINTS.EVENTS.UPCOMING, {
        params: { limit, offset }
    });
    return response.data?.data || [];
};

export const getMyEvents = async () => {
    const response = await apiClient.get(API_ENDPOINTS.EVENTS.MY_EVENTS);
    return response.data?.data || [];
};

export const getEventById = async (id) => {
    const response = await apiClient.get(API_ENDPOINTS.EVENTS.BY_ID(id));
    return response.data?.data;
};

export const rsvpEvent = async (id, status) => {
    const response = await apiClient.post(API_ENDPOINTS.EVENTS.RSVP(id), { status });
    return response.data;
};

export const updateEvent = async (id, data) => {
    const response = await apiClient.put(API_ENDPOINTS.EVENTS.UPDATE(id), data);
    return response.data;
};

export const deleteEvent = async (id) => {
    const response = await apiClient.delete(API_ENDPOINTS.EVENTS.DELETE(id));
    return response.data;
};
