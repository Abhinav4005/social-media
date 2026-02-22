import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1'

const getAuthToken = () => {
    const token = localStorage.getItem('token');
    return token ? `Bearer ${token}` : '';
}

export const signUp = async (userData) => {
    const response = await axios.post(`${API_BASE_URL}/auth/signup`, userData);
    
    if (!response.data.user) {
        throw new Error(response.data.message || "Sign Up failed");
    }
    return response.data;
}

export const signIn = async (data) => {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, data);
    if (response.data.token) {
        localStorage.setItem('token', response.data.token);
    }
    if (!response.data.user) {
        throw new Error(response.data.message || "Sign In failed");
    }
    return response.data;
}

export const logout = async () => {
    const response = await axios.post(`${API_BASE_URL}/auth/logout`, {},)
    if (response.status !== 200) {
        throw new Error("Logout failed");
    }
    localStorage.removeItem('token');
    console.log("Logout successful");
    return response.data;
}

export const forgotPassword = async (email) => {
    const response = await axios.post(`${API_BASE_URL}/auth/forgot-password`, {
        email
    })

    if(response.status !==200){
        throw new Error("failed to forgot password");
    }
    return response.data;
}

export const resetPassword = async (token, newPassword, confirmPassword) => {
    const response = await axios.post(`${API_BASE_URL}/auth/reset-password`, {
        token,
        newPassword,
        confirmPassword
    });
    if(response.status !== 200){
        throw new Error("Failed to reset password");
    }
    return response.data;
}

export const updateUserProfile = async (userData) => {
    const response = await axios.put(`${API_BASE_URL}/user/profile/update`, userData, {
        headers: {
            Authorization: getAuthToken(),
            'Content-Type': 'multipart/form-data',
        }
    });
    if (response.status !== 200) {
        throw new Error("Failed to update user profile");
    }
    console.log("User Profile Response:", response.data);
    return response.data;
}

export const getUserProfile = async () => {
    const response = await axios.get(`${API_BASE_URL}/user/profile`, {
        headers: {
            Authorization: getAuthToken(),
        },
    });
    if (response.status !== 200) {
        throw new Error("Failed to fetch user profile");
    }
    return response.data.user;
}

export const getUserById = async ({ userId }) => {
    const response = await axios.get(`${API_BASE_URL}/user/profile/${userId}`, {
        headers: {
            Authorization: getAuthToken(),
        },
    });
    if (response.status !== 200) {
        throw new Error("Failed to fetch user profile by ID");
    }
    return response.data.user;
}

export const getUserPosts = async () => {
    const response = await axios.get(`${API_BASE_URL}/post/postByUser`, {
        headers: {
            Authorization: getAuthToken(),
        },
    });
    if (response.status !== 200) {
        throw new Error("Failed to fetch user posts");
    }
    return response.data.posts || [];
}

export const createPost = async (postData) => {
    console.log("Creating Post with Data:", postData);
    const response = await axios.post(`${API_BASE_URL}/post/create`, postData, {
        headers: {
            Authorization: getAuthToken(),
            'Content-Type': 'multipart/form-data',
        }
    });
    if (response.status !== 201) {
        throw new Error("Failed to create post");
    }
    console.log("Create Post Response:", response.data);
    return response.data;
}

export const updatePost = async (postId, postData) => {
    const response = await axios.put(`${API_BASE_URL}/post/update`, postData, {
        headers: {
            Authorization: getAuthToken(),
            'Content-Type': 'multipart/form-data',
        },
        params: { postId }
    });
    if (response.status !== 200) {
        throw new Error("Failed to update post");
    }
    return response.data;
}

export const deletePost = async (postId) => {
    const response = await axios.delete(`${API_BASE_URL}/post/delete`, {
        headers: {
            Authorization: getAuthToken(),
        },
        params: { postId }
    });
    if (response.status !== 200) {
        throw new Error("Failed to delete post");
    }
    return response.data;
}

export const followUser = async (followingId) => {
    const response = await axios.post(`${API_BASE_URL}/user/follow`, { followingId }, {
        headers: {
            Authorization: getAuthToken(),
        },
    });
    if (response.status !== 200) {
        throw new Error("Failed to follow/unfollow user");
    }
    return response.data;
}

export const getUserFollowers = async () => {
    const response = await axios.get(`${API_BASE_URL}/user/followers`, {
        headers: {
            Authorization: getAuthToken(),
        },
    });
    if (response.status !== 200) {
        throw new Error("Failed to fetch user followers");
    }
    return response.data.followers || [];
}

export const getUserFollowing = async () => {
    const response = await axios.get(`${API_BASE_URL}/user/following`, {
        headers: {
            Authorization: getAuthToken(),
        },
    });
    if (response.status !== 200) {
        throw new Error("Failed to fetch user following");
    }
    return response.data.following || [];
}

export const getPostById = async (postId) => {
    // console.log("Fetching Post by ID:", postId);
    const response = await axios.get(`${API_BASE_URL}/post/postById`, {
        headers: {
            Authorization: getAuthToken(),
        },
        params: { postId: postId }
    });
    if (response.status !== 200) {
        throw new Error("Failed to fetch post by ID");
    }
    return response.data.post || {};
}

export const likePost = async (postId) => {
    console.log("Liking Post with ID:", postId);
    const response = await axios.post(`${API_BASE_URL}/post/like`, { status: "LIKE" }, {
        headers: {
            Authorization: getAuthToken(),
        },
        params: { postId: postId }
    });
    if (response.status !== 200) {
        throw new Error("Failed to like post");
    }
    return response.data;
}

export const commentOnPost = async (postId, commentData) => {
    console.log("Commenting on Post with ID:", postId, "Comment Data:", commentData);
    const response = await axios.post(`${API_BASE_URL}/post/comment`, {
        content: commentData.content,
    }, {
        headers: {
            Authorization: getAuthToken(),
        },
        params: { postId: postId }
    });
    if (response.status !== 201) {
        throw new Error("Failed to comment on post");
    }
    return response.data;
}

export const commentLike = async (postId, commentId) => {
    const response = await axios.post(`${API_BASE_URL}/post/comment/like`, {
        status: "LIKE",
    }, {
        headers: {
            Authorization: getAuthToken(),
        },
        params: { postId, commentId }
    });
    if (response.status !== 200) {
        throw new Error("Failed to like comment");
    }
    return response.data;
}

export const getCommentLikes = async (postId, commentId) => {
    const response = await axios.get(`${API_BASE_URL}/post/comment/like`, {
        headers: {
            Authorization: getAuthToken(),
        },
        params: { postId, commentId }
    });
    if (response.status !== 200) {
        throw new Error("Failed to fetch comment likes");
    }
    return response.data.likes || [];
}

export const getNotifications = async () => {
    const response = await axios.get(`${API_BASE_URL}/notification`, {
        headers: {
            Authorization: getAuthToken(),
        },
    });
    if (response.status !== 200) {
        throw new Error("Failed to fetch notifications");
    }
    return response.data.notifications || [];
}

export const getPostFeed = async (page) => {
    const response = await axios.get(`${API_BASE_URL}/post/feed`, {
        headers: {
            Authorization: getAuthToken(),
            'Content-Type': 'application/json'
        },
        params: { page }
    });
    // console.log("Post Feed Response:", response);
    if (response.status !== 200) {
        throw new Error("Failed to fetch post feed");
    }
    return response.data || [];
}

export const getRooms = async () => {
    const response = await axios.get(`${API_BASE_URL}/chat/rooms`, {
        headers: {
            Authorization: getAuthToken(),
        }
    });
    if (response.status !== 200) {
        throw new Error("Failed to fetch chat rooms");
    }
    return response.data.rooms || [];
}

export const createOrGetRoom = async (name = null, type, memberIds = []) => {
    const response = await axios.post(`${API_BASE_URL}/chat/create/room`, {
        name,
        type,
        memberIds
    }, {
        headers: {
            Authorization: getAuthToken(),
        }
    });
    if (![200, 201].includes(response.status)) {
        throw new Error("Failed to create or get chat room");
    }
    return response.data.room || [];
}

export const getMessages = async (roomId) => {
    const response = await axios.get(`${API_BASE_URL}/chat/room/${roomId}/messages`, {
        headers: {
            Authorization: getAuthToken(),
        },
    });
    if (response.status !== 200) {
        throw new Error("Failed to fetch messages");
    }
    return response.data.messages || [];
}

export const globalSearch = async (search, type = 'all', limit = 10, offset = 1) => {
    const response = await axios.get(`${API_BASE_URL}/global/search`, {
        headers: {
            Authorization: getAuthToken(),
        },
        params: { search, type, limit, offset }
    });
    if (response.status !== 200) {
        throw new Error("Failed to perform global search");
    }
    return response.data.data || { users: [], posts: [] };
}

export const sendFriendRequest = async (addresseeId) => {
    const response = await axios.post(`${API_BASE_URL}/friend/request`, {}, {
        headers: {
            Authorization: getAuthToken(),
        },
        params: { addresseeId: addresseeId }
    });
    if (response.status !== 201) {
        throw new Error("Failed to send friend request");
    }
}

export const cancelFriendRequest = async (requestId) => {
    const response = await axios.post(`${API_BASE_URL}/friend/cancel`, {}, {
        headers: {
            Authorization: getAuthToken(),
        },
        params: { requestId }
    });
    if (response.status !== 200) {
        throw new Error("Failed to cancel friend request");
    }
    return response.data;
}

export const getFriendRequests = async () => {
    const response = await axios.get(`${API_BASE_URL}/friend`, {
        headers: {
            Authorization: getAuthToken(),
        },
    });
    if (response.status !== 200) {
        throw new Error("Failed to fetch friend requests");
    }
    return response.data || [];
}

export const respondToFriendRequest = async (requestId, action) => {
    console.log("Responding to Friend Request ID:", requestId, "with Action:", action);
    const response = await axios.post(`${API_BASE_URL}/friend/respond`, {},{
        headers: {
            Authorization: getAuthToken(),
        },
        params: { requestId, action }
    });
    if (response.status !== 200) {
        throw new Error("Failed to respond to friend request");
    }
    return response.data;
}

export const getAllPhotosOfUser = async () => {
    const response = await axios.get(`${API_BASE_URL}/user/photos`, {
        headers: {
            Authorization: getAuthToken(),
        },
    });
    if (response.status !== 200) {
        throw new Error("Failed to fetch user photos");
    }
    return response.data || { userImage: [], postImages: [] };
}

export const deleteMessage = async (messageId) => {
    const response = await axios.delete(`${API_BASE_URL}/chat/message/delete`, {},{
        headers: {
            Authorization: getAuthToken(),
        },
        params: { messageId },
    });

    if (response.status !== 200) {
        throw new Error("Failed to delete message");
    }
    return response.data;
}