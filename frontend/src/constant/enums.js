export const POST_VISIBILITY = {
  PUBLIC: { value: "PUBLIC", label: "Public (Anyone can see)" },
  FOLLOWERS: { value: "FOLLOWERS", label: "Followers Only" },
  FRIENDS: { value: "FRIENDS", label: "Friends Only" },
  PRIVATE: { value: "PRIVATE", label: "Only Me (Private)" },
};

export const DM_PERMISSION = {
  PUBLIC: { value: "PUBLIC", label: "Anyone" },
  FOLLOWERS: { value: "FOLLOWERS", label: "Followers Only" },
  FRIENDS: { value: "FRIENDS", label: "Friends Only" },
  PRIVATE: { value: "PRIVATE", label: "Nobody" },
};

export const FRIEND_REQUEST_ACTION = {
  ACCEPT: "ACCEPTED",
  DECLINE: "DECLINED",
};
