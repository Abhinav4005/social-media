import apiClient from "./client";
import { API_ENDPOINTS } from "../constant/apiEndpoints";

export const createPost = async (postData) => {
    const response = await apiClient.post(API_ENDPOINTS.POSTS.CREATE, postData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    });
    if (response.status !== 201) {
        throw new Error("Failed to create post");
    }
    return response.data;
};

export const updatePost = async (postId, postData) => {
    const response = await apiClient.put(API_ENDPOINTS.POSTS.UPDATE, postData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        params: { postId }
    });
    if (response.status !== 200) {
        throw new Error("Failed to update post");
    }
    return response.data;
};

export const deletePost = async (postId) => {
    const response = await apiClient.delete(API_ENDPOINTS.POSTS.DELETE, {
        params: { postId }
    });
    if (response.status !== 200) {
        throw new Error("Failed to delete post");
    }
    return response.data;
};

export const getPostById = async (postId) => {
    const response = await apiClient.get(API_ENDPOINTS.POSTS.BY_ID, {
        params: { postId }
    });
    if (response.status !== 200) {
        throw new Error("Failed to fetch post by ID");
    }
    return response.data.post || {};
};

export const likePost = async (postId) => {
    const response = await apiClient.post(API_ENDPOINTS.POSTS.LIKE, { status: "LIKE" }, {
        params: { postId }
    });
    if (response.status !== 200) {
        throw new Error("Failed to like post");
    }
    return response.data;
};

export const commentOnPost = async (postId, commentData) => {
    const response = await apiClient.post(API_ENDPOINTS.POSTS.COMMENT, {
        content: commentData.content,
        parentId: commentData?.parentId || null,
    }, {
        params: { postId }
    });
    if (response.status !== 201) {
        throw new Error("Failed to comment on post");
    }
    return response.data;
};

export const commentLike = async (postId, commentId) => {
    const response = await apiClient.post(API_ENDPOINTS.POSTS.COMMENT_LIKE, {
        status: "LIKE",
    }, {
        params: { postId, commentId }
    });
    if (response.status !== 200) {
        throw new Error("Failed to like comment");
    }
    return response.data;
};

export const getCommentLikes = async (postId, commentId) => {
    const response = await apiClient.get(API_ENDPOINTS.POSTS.COMMENT_LIKE, {
        params: { postId, commentId }
    });
    if (response.status !== 200) {
        throw new Error("Failed to fetch comment likes");
    }
    return response.data.likes || [];
};

export const getPostFeed = async (page) => {
    const response = await apiClient.get(API_ENDPOINTS.POSTS.FEED, {
        params: { page }
    });
    if (response.status !== 200) {
        throw new Error("Failed to fetch post feed");
    }
    return response.data || [];
};

export const savePost = async (postId) => {
    const response = await apiClient.post(API_ENDPOINTS.POSTS.SAVE, { postId });
    if (response.status !== 200) {
        throw new Error("Failed to save post");
    }
    return response.data;
};

export const getSavedPosts = async () => {
    const response = await apiClient.get(API_ENDPOINTS.POSTS.SAVED);
    if (response.status !== 200) {
        throw new Error("Failed to fetch saved posts");
    }
    return response.data?.posts || response.data?.data?.posts || [];
};
