import apiClient from "./client";

export const signUp = async (userData) => {
    const response = await apiClient.post("/auth/signup", userData);
    
    if (!response.data.user) {
        throw new Error(response.data.message || "Sign Up failed");
    }
    return response.data;
}

export const signIn = async (data) => {
    const response = await apiClient.post("/auth/login", data);
    if (response.data.token) {
        localStorage.setItem('token', response.data.token);
    }
    if (!response.data.user) {
        throw new Error(response.data.message || "Sign In failed");
    }
    return response.data;
}

export const logout = async () => {
    const response = await apiClient.post("/auth/logout", {})
    if (response.status !== 200) {
        throw new Error("Logout failed");
    }
    localStorage.removeItem('token');
    console.log("Logout successful");
    return response.data;
}

export const forgotPassword = async (email) => {
    const response = await apiClient.post("/auth/forgot-password", {
        email
    })

    if(response.status !==200){
        throw new Error("failed to forgot password");
    }
    return response.data;
}

export const resetPassword = async (token, newPassword, confirmPassword) => {
    const response = await apiClient.post("/auth/reset-password", {
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
    const response = await apiClient.put("/user/profile/update", userData, {
        headers: {
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
    const response = await apiClient.get("/user/profile");
    if (response.status !== 200) {
        throw new Error("Failed to fetch user profile");
    }
    return response.data.user;
}

export const getUserById = async ({ userId }) => {
    const response = await apiClient.get(`/user/profile/${userId}`);
    if (response.status !== 200) {
        throw new Error("Failed to fetch user profile by ID");
    }
    return response.data.user;
}

export const getUserPosts = async () => {
    const response = await apiClient.get("/post/postByUser");
    if (response.status !== 200) {
        throw new Error("Failed to fetch user posts");
    }
    return response.data.posts || [];
}

export const createPost = async (postData) => {
    console.log("Creating Post with Data:", postData);
    const response = await apiClient.post("/post/create", postData, {
        headers: {
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
    const response = await apiClient.put("/post/update", postData, {
        headers: {
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
    const response = await apiClient.delete("/post/delete", {
        params: { postId }
    });
    if (response.status !== 200) {
        throw new Error("Failed to delete post");
    }
    return response.data;
}

export const followUser = async (followingId) => {
    const response = await apiClient.post("/user/follow", { followingId });
    if (response.status !== 200) {
        throw new Error("Failed to follow/unfollow user");
    }
    return response.data;
}

export const getUserFollowers = async () => {
    const response = await apiClient.get("/user/followers");
    if (response.status !== 200) {
        throw new Error("Failed to fetch user followers");
    }
    return response.data.followers || [];
}

export const getUserFollowing = async () => {
    const response = await apiClient.get("/user/following");
    if (response.status !== 200) {
        throw new Error("Failed to fetch user following");
    }
    return response.data.following || [];
}

export const getPostById = async (postId) => {
    // console.log("Fetching Post by ID:", postId);
    const response = await apiClient.get("/post/postById", {
        params: { postId: postId }
    });
    if (response.status !== 200) {
        throw new Error("Failed to fetch post by ID");
    }
    return response.data.post || {};
}

export const likePost = async (postId) => {
    console.log("Liking Post with ID:", postId);
    const response = await apiClient.post("/post/like", { status: "LIKE" }, {
        params: { postId: postId }
    });
    if (response.status !== 200) {
        throw new Error("Failed to like post");
    }
    return response.data;
}

export const commentOnPost = async (postId, commentData) => {
    console.log("Commenting on Post with ID:", postId, "Comment Data:", commentData);
    const response = await apiClient.post("/post/comment", {
        content: commentData.content,
    }, {
        params: { postId: postId }
    });
    if (response.status !== 201) {
        throw new Error("Failed to comment on post");
    }
    return response.data;
}

export const commentLike = async (postId, commentId) => {
    const response = await apiClient.post("/post/comment/like", {
        status: "LIKE",
    }, {
        params: { postId, commentId }
    });
    if (response.status !== 200) {
        throw new Error("Failed to like comment");
    }
    return response.data;
}

export const getCommentLikes = async (postId, commentId) => {
    const response = await apiClient.get("/post/comment/like", {
        params: { postId, commentId }
    });
    if (response.status !== 200) {
        throw new Error("Failed to fetch comment likes");
    }
    return response.data.likes || [];
}

export const getNotifications = async () => {
    const response = await apiClient.get("/notification");
    if (response.status !== 200) {
        throw new Error("Failed to fetch notifications");
    }
    return response.data.notifications || [];
}

export const getPostFeed = async (page) => {
    const response = await apiClient.get("/post/feed", {
        params: { page }
    });
    // console.log("Post Feed Response:", response);
    if (response.status !== 200) {
        throw new Error("Failed to fetch post feed");
    }
    return response.data || [];
}

export const getRooms = async () => {
    const response = await apiClient.get("/chat/rooms");
    if (response.status !== 200) {
        throw new Error("Failed to fetch chat rooms");
    }
    return response.data.rooms || [];
}

export const createOrGetRoom = async (name = null, type, memberIds = []) => {
    const response = await apiClient.post("/chat/create/room", {
        name,
        type,
        memberIds
    });
    if (![200, 201].includes(response.status)) {
        throw new Error("Failed to create or get chat room");
    }
    return response.data.room || [];
}

export const getMessages = async (roomId) => {
    const response = await apiClient.get(`/chat/room/${roomId}/messages`);
    if (response.status !== 200) {
        throw new Error("Failed to fetch messages");
    }
    return response.data.messages || [];
}

export const globalSearch = async (search, type = 'all', limit = 10, page = 1) => {
    const response = await apiClient.get("/global/search", {
        params: { search, type, limit, page }
    });
    if (response.status !== 200) {
        throw new Error("Failed to perform global search");
    }
    return response.data.data || { users: [], posts: [] };
}

export const sendFriendRequest = async (addresseeId) => {
    const response = await apiClient.post("/friend/request", {}, {
        params: { addresseeId: addresseeId }
    });
    if (response.status !== 201) {
        throw new Error("Failed to send friend request");
    }
}

export const cancelFriendRequest = async (requestId) => {
    const response = await apiClient.post("/friend/cancel", {}, {
        params: { requestId }
    });
    if (response.status !== 200) {
        throw new Error("Failed to cancel friend request");
    }
    return response.data;
}

export const getFriendRequests = async () => {
    const response = await apiClient.get("/friend");
    if (response.status !== 200) {
        throw new Error("Failed to fetch friend requests");
    }
    return response.data || [];
}

export const respondToFriendRequest = async (requestId, action) => {
    console.log("Responding to Friend Request ID:", requestId, "with Action:", action);
    const response = await apiClient.post("/friend/respond", {},{
        params: { requestId, action }
    });
    if (response.status !== 200) {
        throw new Error("Failed to respond to friend request");
    }
    return response.data;
}

export const getAllPhotosOfUser = async () => {
    const response = await apiClient.get("/user/photos");
    if (response.status !== 200) {
        throw new Error("Failed to fetch user photos");
    }
    return response.data || { userImage: [], postImages: [] };
}

export const deleteMessage = async (messageId) => {
    const response = await apiClient.delete(`/chat/message/${messageId}/delete`);

    if (response.status !== 200) {
        throw new Error("Failed to delete message");
    }
    return response.data;
}

export const savePost = async (postId) => {
    const response = await apiClient.post('/post/save', {postId});

    if(response.status !== 200){
        throw new Error("Failed to save post");
    }

    return response.data;
}
