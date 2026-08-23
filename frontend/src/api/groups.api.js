import apiClient from "./client";
import { API_ENDPOINTS } from "../constant/apiEndpoints";

export const createGroup = async (data) => {
    const response = await apiClient.post(API_ENDPOINTS.GROUPS.CREATE, data);
    return response.data;
};

export const getMyGroups = async () => {
    const response = await apiClient.get(API_ENDPOINTS.GROUPS.MY_GROUPS);
    return response.data?.data || [];
};

export const discoverGroups = async (limit = 20, offset = 0) => {
    const response = await apiClient.get(API_ENDPOINTS.GROUPS.DISCOVER, {
        params: { limit, offset }
    });
    return response.data?.data || [];
};

export const getGroupById = async (id) => {
    const response = await apiClient.get(API_ENDPOINTS.GROUPS.BY_ID(id));
    return response.data?.data;
};

export const joinGroup = async (id) => {
    const response = await apiClient.post(API_ENDPOINTS.GROUPS.JOIN(id));
    return response.data;
};

export const leaveGroup = async (id) => {
    const response = await apiClient.post(API_ENDPOINTS.GROUPS.LEAVE(id));
    return response.data;
};

export const updateGroup = async (id, data) => {
    const response = await apiClient.put(API_ENDPOINTS.GROUPS.UPDATE(id), data);
    return response.data;
};

export const deleteGroup = async (id) => {
    const response = await apiClient.delete(API_ENDPOINTS.GROUPS.DELETE(id));
    return response.data;
};

export const createGroupPost = async (id, data) => {
    const response = await apiClient.post(API_ENDPOINTS.GROUPS.POSTS(id), data);
    return response.data;
};

export const getGroupPosts = async (id, limit = 20, offset = 0) => {
    const response = await apiClient.get(API_ENDPOINTS.GROUPS.POSTS(id), {
        params: { limit, offset }
    });
    return response.data?.data || [];
};

export const getGroupMembers = async (id) => {
    const response = await apiClient.get(API_ENDPOINTS.GROUPS.MEMBERS(id));
    return response.data?.data || [];
};

export const removeGroupMember = async (groupId, userId) => {
    const response = await apiClient.delete(API_ENDPOINTS.GROUPS.REMOVE_MEMBER(groupId, userId));
    return response.data;
};

export const updateMemberRole = async (groupId, userId, role) => {
    const response = await apiClient.patch(API_ENDPOINTS.GROUPS.UPDATE_MEMBER_ROLE(groupId, userId), { role });
    return response.data;
};

