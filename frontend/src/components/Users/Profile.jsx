import Button from "../UI/Button";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUserPosts } from "../../api";
import FriendsTab from "../Friends/FriendsTab";
import PostTab from "../Posts/PostTab";
import Navbar from "../../pages/Navbar";
import { useNavigate } from "react-router-dom";
import { clearCredentials } from "../../store/slices/authSlice.js";

export default function Profile({ user }) {
  const { user: currentUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [currentFollowers, setCurrentFollowers] = useState(0);
  const [currentFollowing, setCurrentFollowing] = useState(0);
  const navigate = useNavigate();

  if (!user) user = currentUser;

  const [activeTab, setActiveTab] = useState("posts");

  const { data: posts, isLoading, isError } = useQuery({
    queryKey: ["postByUser", user?.id],
    queryFn: getUserPosts,
    enabled: !!user,
  });

  const getInitials = (name = "") =>
    name
      .split(" ")
      .map((n) => n[0]?.toUpperCase())
      .join("")
      .slice(0, 2);

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(clearCredentials());
    navigate("/signin");
  };

  return (
    <>
      <Navbar />
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl mx-auto bg-white mt-6 rounded-2xl shadow-xl border border-gray-200 overflow-hidden"
      >
        {/* Cover photo */}
        <div className="h-36 bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 relative">
          <div className="absolute inset-0 bg-black/20"></div>
        </div>

        {/* Profile Avatar */}
        <div className="relative px-6">
          <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
            <motion.div
              whileHover={{ scale: 1.08 }}
              className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-3xl font-bold flex items-center justify-center shadow-2xl border-4 border-white cursor-pointer transition-all"
            >
              {user?.name ? getInitials(user.name) : "?"}
            </motion.div>
          </div>
        </div>

        {/* Content */}
        <div className="pt-20 text-center px-6">
          <h2 className="text-3xl font-extrabold text-gray-800">{user?.name || "Guest User"}</h2>
          <p className="text-gray-500 text-sm mt-1">{user?.email || "No email available"}</p>

          {/* Bio / tagline */}
          <p className="mt-4 text-gray-600 italic">{user?.bio || "This is your space — express yourself!"}</p>

          {/* Stats Section */}
          <div className="mt-6 flex justify-center gap-10 text-center">
            <motion.div whileHover={{ scale: 1.05 }} className="cursor-pointer">
              <p className="text-xl font-bold text-gray-800">{posts?.length || 0}</p>
              <p className="text-sm text-gray-500">Posts</p>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} className="cursor-pointer">
              <p className="text-xl font-bold text-gray-800">{currentFollowers}</p>
              <p className="text-sm text-gray-500">Followers</p>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} className="cursor-pointer">
              <p className="text-xl font-bold text-gray-800">{currentFollowing}</p>
              <p className="text-sm text-gray-500">Following</p>
            </motion.div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex justify-center gap-4 flex-wrap">
            <Button className="px-6 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold shadow-md hover:shadow-xl transition transform hover:scale-105"
            onClick={() => navigate("/update-profile")}
            >
              Edit Profile
            </Button>
            <Button
              className="px-6 py-2 rounded-xl bg-gray-500 text-white font-semibold shadow-md hover:bg-gray-600 transition transform hover:scale-105"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="border-t border-gray-200 mt-8">
          <div className="flex justify-around relative">
            {["posts", "about", "friends", "photos"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 text-sm font-semibold transition-colors duration-300 ${
                  activeTab === tab
                    ? "text-indigo-600 border-b-2 border-indigo-600"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
            <motion.div
              layout
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="absolute bottom-0 h-0.5 bg-indigo-600 w-1/4"
              style={{
                left:
                  activeTab === "posts"
                    ? "0%"
                    : activeTab === "about"
                    ? "25%"
                    : activeTab === "friends"
                    ? "50%"
                    : "75%",
              }}
            />
          </div>

          <div className="p-6 text-center text-gray-600">
            {activeTab === "posts" && <PostTab posts={posts} isLoading={isLoading} isError={isError} />}
            {activeTab === "about" && <p>ℹ️ User details and bio info...</p>}
            {activeTab === "friends" && (
              <FriendsTab
                activeTab={activeTab}
                setCurrentFollowers={setCurrentFollowers}
                setCurrentFollowing={setCurrentFollowing}
              />
            )}
            {activeTab === "photos" && <p>🖼️ User photo gallery...</p>}
          </div>
        </div>
      </motion.div>
    </>
  );
}