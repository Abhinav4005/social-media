export const SOCKET_EVENTS = {
  // Presence Events
  USER_ONLINE: "userOnline",
  USER_OFFLINE: "userOffline",
  ONLINE_USERS: "onlineUsers",
  LAST_SEEN_UPDATE: "lastSeenUpdate",

  // Chat Room & Messaging Events
  JOIN_ROOM: "joinRoom",
  LEAVE_ROOM: "leaveRoom",
  SEND_MESSAGE: "sendMessage",
  NEW_MESSAGE: "newMessage",
  MESSAGE_READ_BY_USER: "messageReadByUser",
  MESSAGE_READ: "messageRead",

  // Typing Events
  IS_TYPING: "isTyping",
  STOP_TYPING: "stopTyping",
  USER_TYPING: "userTyping",
  USER_STOPPED_TYPING: "userStoppedTyping",

  // WebRTC Signaling & Video Call Events
  CALL_USER: "call-user",
  INCOMING_CALL: "incoming-call",
  ACCEPT_CALL: "accept-call",
  CALL_ACCEPTED: "call-accepted",
  END_CALL: "end-call",
  CALL_ENDED: "call-ended",
};
