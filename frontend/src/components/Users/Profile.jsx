import Button from "../UI/Button";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useQuery, useMutation, QueryClient } from "@tanstack/react-query";
import { getUserProfile } from "../../api";
import FriendsTab from "../Friends/FriendsTab";
import PostTab from "../Posts/PostTab";
import Navbar from "../../pages/Navbar";
import { useNavigate } from "react-router-dom";
import { clearCredentials, setCredentials } from "../../store/slices/authSlice.js";
import { Plus, Camera, Edit2, MapPin, Calendar, Link as LinkIcon, Heart, Users, Image as ImageIcon } from "lucide-react";
import CoverModal from "../../Modal/CoverModal";
import { updateUserProfile } from "../../api";
import Photos from "../Photos/Photos";

export default function Profile({ user }) {
  const { user: currentUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (!user) user = currentUser;

  const [activeTab, setActiveTab] = useState("posts");
  const [coverData, setCoverData] = useState(null);
  const [openCoverModal, setOpenCoverModal] = useState(false);
  const [coverPreview, setCoverPreview] = useState(null);
  const queryClient = new QueryClient();

  const { data: userProfile, isLoading, isError } = useQuery({
    queryKey: ["userProfile", user?.id],
    queryFn: getUserProfile,
    enabled: !!user
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

  const handleViewCover = (coverImage) => {
    if (!coverImage) return;
    window.open(coverImage, "_blank");
  }

  const handleCoverUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverData(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  }

  const handleRemoveCover = () => {
    setCoverData(null);
    setCoverPreview(null);
  }

  const mutation = useMutation({
    mutationFn: (coverImageData) => updateUserProfile(coverImageData),
    onSuccess: (data) => {
      queryClient.invalidateQueries(["userProfile", user?.id]);
      dispatch(setCredentials(data));
      navigate("/profile");
      setCoverData(null);
    },
    onError: (error) => console.error(error),
  })

  const handleUpload = () => {
    const formData = new FormData();
    if (coverData) {
      formData.append("coverImage", coverData);
      mutation.mutate(formData);
    }
  }

  const tabs = [
    { id: "posts", label: "Posts", icon: <ImageIcon className="w-4 h-4" /> },
    { id: "about", label: "About", icon: <Heart className="w-4 h-4" /> },
    { id: "friends", label: "Friends", icon: <Users className="w-4 h-4" /> },
    { id: "photos", label: "Photos", icon: <Camera className="w-4 h-4" /> }
  ];

  return (
    <>
      <Navbar />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto mt-6 mb-10"
      >
        {/* Main Profile Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">

          {/* Cover Photo Section */}
          <div className="relative h-64 md:h-80 overflow-hidden group">
            {/* Cover Image or Gradient */}
            {userProfile?.coverImage ? (
              <motion.img
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.6 }}
                src={userProfile.coverImage}
                alt="Cover"
                className="w-full h-full object-cover"
              />
            ) : (
              <div
                className="w-full h-full"
                style={{ background: 'var(--gradient-hero)' }}
              />
            )}

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />

            {/* Action Buttons */}
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleViewCover(userProfile?.coverImage)}
                className="px-4 py-2 bg-white/90 backdrop-blur-md hover:bg-white text-gray-800 text-sm font-medium rounded-xl shadow-lg flex items-center gap-2 transition-all cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                View
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setOpenCoverModal(true)}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-xl shadow-lg flex items-center gap-2 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                {userProfile?.coverImage ? "Update" : "Add"}
              </motion.button>
            </div>

            {openCoverModal && (
              <CoverModal
                isOpen={openCoverModal}
                onClose={() => setOpenCoverModal(false)}
                coverPreview={coverPreview}
                handleCoverChange={handleCoverUpload}
                handleRemoveCover={handleRemoveCover}
                handleUpload={handleUpload}
                userProfile={userProfile}
              />
            )}
          </div>

          {/* Profile Info Section */}
          <div className="relative px-6 md:px-10 pb-8">

            {/* Avatar */}
            <div className="absolute -top-20 left-1/2 transform -translate-x-1/2">
              <div className="relative group">
                {user?.profileImage ? (
                  <motion.img
                    whileHover={{ scale: 1.05 }}
                    src={user?.profileImage}
                    alt="Profile"
                    className="w-40 h-40 rounded-full border-6 border-white shadow-2xl object-cover ring-4 ring-primary-100"
                  />
                ) : (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="w-40 h-40 rounded-full text-white text-4xl font-bold flex items-center justify-center shadow-2xl border-6 border-white ring-4 ring-primary-100"
                    style={{ background: 'var(--gradient-vibrant)' }}
                  >
                    {user?.name ? getInitials(user.name) : "?"}
                  </motion.div>
                )}

                {/* Online Indicator */}
                <span className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full ring-4 ring-white shadow-lg" />

                {/* Edit Avatar Button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute bottom-0 right-0 p-3 bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                  onClick={() => navigate("/update-profile")}
                >
                  <Edit2 className="w-4 h-4" />
                </motion.button>
              </div>
            </div>

            {/* User Info */}
            <div className="pt-24 text-center">
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl font-bold text-gray-900 capitalize mb-2"
              >
                {user?.name || "Guest User"}
              </motion.h1>

              {/* Bio */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-gray-600 text-lg max-w-2xl mx-auto mb-6"
              >
                {user?.bio}
              </motion.p>

              {/* User Details */}
              <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500 mb-8">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{user?.location || "Unknown"}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {user?.createdAt || "Unknown"}</span>
                </div>
                <div className="flex items-center gap-1">
                  <LinkIcon className="w-4 h-4" />
                  <a href="#" className="text-primary-600 hover:underline">website.com</a>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mb-8">
                <motion.div
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-6 cursor-pointer border border-primary-200 shadow-sm hover:shadow-lg transition-all"
                >
                  <div className="flex items-center justify-center mb-2">
                    <div className="p-3 bg-primary-600 rounded-xl">
                      <ImageIcon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-primary-900">{userProfile?.posts?.length || 0}</p>
                  <p className="text-sm text-primary-700 font-medium mt-1">Posts</p>
                </motion.div>

                <motion.div
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="bg-gradient-to-br from-secondary-50 to-secondary-100 rounded-2xl p-6 cursor-pointer border border-secondary-200 shadow-sm hover:shadow-lg transition-all"
                >
                  <div className="flex items-center justify-center mb-2">
                    <div className="p-3 bg-secondary-600 rounded-xl">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-secondary-900">{userProfile?.followers?.length || 0}</p>
                  <p className="text-sm text-secondary-700 font-medium mt-1">Followers</p>
                </motion.div>

                <motion.div
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="bg-gradient-to-br from-accent-50 to-accent-100 rounded-2xl p-6 cursor-pointer border border-accent-200 shadow-sm hover:shadow-lg transition-all"
                >
                  <div className="flex items-center justify-center mb-2">
                    <div className="p-3 bg-accent-600 rounded-xl">
                      <Heart className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-accent-900">{userProfile?.following?.length || 0}</p>
                  <p className="text-sm text-accent-700 font-medium mt-1">Following</p>
                </motion.div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center gap-4 flex-wrap">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/update-profile")}
                  className="px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all text-white cursor-pointer"
                  style={{ background: 'var(--gradient-vibrant)' }}
                >
                  <div className="flex items-center gap-2">
                    <Edit2 className="w-4 h-4" />
                    Edit Profile
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all bg-gray-600 hover:bg-gray-700 text-white cursor-pointer"
                >
                  Logout
                </motion.button>
              </div>
            </div>
          </div>

          {/* Tabs Section */}
          <div className="border-t border-gray-200">
            {/* Tab Headers */}
            <div className="flex justify-around bg-gray-50/50 relative">
              {tabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex-1 py-4 px-6 text-sm font-semibold cursor-pointer transition-all duration-300 flex items-center justify-center gap-2 ${activeTab === tab.id
                    ? "text-primary-600 bg-white"
                    : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                    }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                  {activeTab === tab.id && userProfile?.posts?.length > 0 && tab.id === "posts" && (
                    <span className="ml-1 px-2 py-0.5 bg-primary-100 text-primary-700 text-xs rounded-full font-bold cursor-pointer">
                      {userProfile.posts.length}
                    </span>
                  )}
                </motion.button>
              ))}

              {/* Animated Indicator */}
              <motion.div
                layoutId="activeTabIndicator"
                className="absolute bottom-0 h-1 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-t-full"
                style={{
                  width: `${100 / tabs.length}%`,
                  left: `${(tabs.findIndex(t => t.id === activeTab) * 100) / tabs.length}%`
                }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </div>

            {/* Tab Content */}
            <div className="p-6 min-h-[400px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  {activeTab === "posts" && <PostTab posts={userProfile?.posts} isLoading={isLoading} isError={isError} />}
                  {activeTab === "about" && (
                    <div className="text-center text-gray-600 max-w-2xl mx-auto">
                      <p className="text-lg">{user?.about || "No additional information available."}</p>
                    </div>
                  )}
                  {activeTab === "friends" && (
                    <FriendsTab
                      activeTab={activeTab}
                      followers={userProfile?.followers}
                      following={userProfile?.following}
                      isLoading={isLoading}
                      isError={isError}
                    />
                  )}
                  {activeTab === "photos" && <Photos />}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
