import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUserFollowers, getUserFollowing } from "../../api";
import Button from "../UI/Button";

const FriendsTab = ({ activeTab }) => {
  const [tab, setTab] = useState("followers");

  const { data: followers, isLoading: loadingFollowers, isError: errorFollowers } = useQuery({
    queryKey: ["userFollowers"],
    queryFn: getUserFollowers,
    enabled: tab === "followers",
  });

  const { data: following, isLoading: loadingFollowing, isError: errorFollowing } = useQuery({
    queryKey: ["userFollowing"],
    queryFn: getUserFollowing,
    enabled: tab === "following",
  });

  const renderList = (list, loading, error, label) => {
    if (loading) return <p className="text-gray-500 text-center py-4">⏳ Loading {label}...</p>;
    if (error) return <p className="text-red-500 text-center py-4">⚠️ Failed to load {label}</p>;
    if (!list || list.length === 0) return <p className="text-gray-500 text-center py-4">🙅 No {label} found</p>;

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {list.map((user) => (
          <div
            key={user.id}
            className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow hover:shadow-lg transition-all duration-300"
          >
            <div className="w-14 h-14 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white text-lg font-bold">
              {user.name
                ?.split(" ")
                .map((n) => n[0]?.toUpperCase())
                .slice(0, 2)
                .join("")}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 truncate">{user.name}</p>
              <p className="text-sm text-gray-500 truncate">{user.email || "No email"}</p>
            </div>
            <Button
              className={`px-4 py-2 text-sm rounded-xl font-medium transition ${
                tab === "followers"
                  ? "bg-indigo-500 text-white hover:bg-indigo-600"
                  : "bg-gray-400 text-gray-700 hover:bg-gray-500"
              }`}
            >
              {tab === "followers" ? "Follow back" : "Unfollow"}
            </Button>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="p-4 bg-gray-50 rounded-2xl">
      {/* Sub-tabs */}
      <div className="flex justify-center gap-4 mb-6 border-b border-gray-200">
        <Button
          onClick={() => setTab("followers")}
          className={`pb-2 ${
            tab === "followers" ? "text-indigo-600 font-semibold border-b-2 border-indigo-600" : "text-gray-400"
          }`}
        >
          Followers
        </Button>
        <Button
          onClick={() => setTab("following")}
          className={`pb-2 ${
            tab === "following" ? "text-indigo-600 font-semibold border-b-2 border-indigo-600" : "text-gray-400"
          }`}
        >
          Following
        </Button>
      </div>

      {tab === "followers" && renderList(followers, loadingFollowers, errorFollowers, "followers")}
      {tab === "following" && renderList(following, loadingFollowing, errorFollowing, "following")}
    </div>
  );
};

export default FriendsTab;