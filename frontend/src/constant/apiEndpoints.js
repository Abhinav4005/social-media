export const API_ENDPOINTS = {
  AUTH: {
    SIGN_UP: "/auth/signup",
    SIGN_IN: "/auth/login",
    LOGOUT: "/auth/logout",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
    REFRESH_TOKEN: "/auth/refresh-token",
  },
  USER: {
    PROFILE: "/user/profile",
    PROFILE_BY_ID: (userId) => `/user/profile/${userId}`,
    UPDATE: "/user/profile/update",
    FOLLOW: "/user/follow",
    FOLLOWERS: "/user/followers",
    FOLLOWING: "/user/following",
    PHOTOS: "/user/photos",
  },
  POSTS: {
    FEED: "/post/feed",
    CREATE: "/post/create",
    BY_ID: "/post/postById",
    BY_USER: "/post/postByUser",
    UPDATE: "/post/update",
    DELETE: "/post/delete",
    LIKE: "/post/like",
    SAVE: "/post/save",
    SAVED: "/post/saved",
    COMMENT: "/post/comment",
    COMMENT_LIKE: "/post/comment/like",
  },
  CHAT: {
    ROOMS: "/chat/rooms",
    CREATE_ROOM: "/chat/create/room",
    MESSAGES: (roomId) => `/chat/room/${roomId}/messages`,
    DELETE_MESSAGE: (messageId) => `/chat/message/${messageId}/delete`,
  },
  FRIENDS: {
    REQUESTS: "/friend",
    SEND_REQUEST: "/friend/request",
    CANCEL_REQUEST: "/friend/cancel",
    RESPOND: "/friend/respond",
  },
  NOTIFICATIONS: {
    GET_ALL: "/notification",
  },
  STORIES: {
    BASE: "/story",
    MARK_SEEN: (storyId) => `/story/${storyId}/views`,
  },
  SEARCH: {
    GLOBAL: "/global/search",
  },
  SUBSCRIPTIONS: {
    CHECKOUT: "/subscriptions/create-checkout-session",
  },
};
