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
import { formatJoinDate } from "../../utils/formatTime.js";

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

  console.log("userprofile: ", userProfile)

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
    <div className="min-h-screen bg-[#f8fafc]">
      <Navbar />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto pt-8 pb-20 px-4"
      >
        {/* Main Profile Card with Glassmorphism */}
        <div className="bg-white/80 backdrop-blur-2xl rounded-[40px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] overflow-hidden border border-white/40">

          {/* Cover Photo Section */}
          <div className="relative h-72 md:h-96 overflow-hidden group">
            {userProfile?.coverImage ? (
              <motion.img
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                src={userProfile.coverImage}
                alt="Cover"
                className="w-full h-full object-cover"
              />
            ) : (
              <div
                className="w-full h-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 animate-gradient-x"
              />
            )}

            {/* Premium Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />

            {/* Glass Action Buttons */}
            <div className="absolute top-6 right-6 flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,1)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleViewCover(userProfile?.coverImage)}
                className="px-5 py-2.5 bg-white/90 backdrop-blur-md text-gray-900 text-sm font-bold rounded-2xl shadow-xl flex items-center gap-2 transition-all cursor-pointer border border-white/50"
              >
                <Camera className="w-4 h-4" />
                View Cover
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setOpenCoverModal(true)}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-2xl shadow-xl flex items-center gap-2 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                {userProfile?.coverImage ? "Change" : "Add Cover"}
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
          <div className="relative px-6 md:px-12 pb-10">

            {/* Avatar - Elevated Architecture */}
            <div className="absolute -top-24 left-1/2 md:left-12 transform -translate-x-1/2 md:translate-x-0">
              <div className="relative">
                <div className="p-1.5 bg-white rounded-[32px] shadow-2xl backdrop-blur-xl border border-white/50">
                  {user?.profileImage ? (
                    <motion.img
                      whileHover={{ scale: 1.02 }}
                      src={user?.profileImage}
                      alt="Profile"
                      className="w-44 h-44 rounded-[28px] object-cover"
                    />
                  ) : (
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="w-44 h-44 rounded-[28px] text-white text-5xl font-black flex items-center justify-center shadow-inner"
                      style={{ background: 'var(--gradient-vibrant)' }}
                    >
                      {user?.name ? getInitials(user.name) : "?"}
                    </motion.div>
                  )}
                </div>

                {/* Online Indicator */}
                <div className="absolute bottom-2 right-2 w-8 h-8 bg-green-500 rounded-2xl border-4 border-white shadow-lg" />

                {/* Edit Avatar Overlay */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute -top-2 -right-2 p-3 bg-white hover:bg-gray-50 text-indigo-600 rounded-2xl shadow-xl border border-gray-100 transition-all cursor-pointer opacity-0 group-hover:opacity-100 md:opacity-100"
                  onClick={() => navigate("/update-profile")}
                >
                  <Edit2 className="w-5 h-5" />
                </motion.button>
              </div>
            </div>

            {/* User Content Layout */}
            <div className="pt-28 md:pt-6 md:pl-56 flex flex-col md:flex-row md:items-end md:justify-between gap-8">
              <div className="text-center md:text-left">
                <motion.h1
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-5xl font-black text-gray-900 tracking-tight mb-3"
                >
                  {user?.name || "Guest User"}
                </motion.h1>

                {/* Bio with subtle styling */}
                <p className="text-gray-500 text-lg font-medium max-w-xl leading-relaxed mb-6">
                  {user?.bio || "No bio yet. Add one to tell your story!"}
                </p>

                {/* Meta details */}
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-sm font-bold text-gray-400">
                  <div className="flex items-center gap-2 bg-gray-100/50 px-3 py-1.5 rounded-full">
                    <MapPin className="w-4 h-4 text-indigo-500" />
                    <span>{user?.location || "Everywhere"}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-100/50 px-3 py-1.5 rounded-full">
                    <Calendar className="w-4 h-4 text-purple-500" />
                    <span>{formatJoinDate(user?.createdAt)}</span>
                  </div>
                </div>
              </div>

              {/* Primary Actions */}
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate("/update-profile")}
                  className="px-10 py-4 bg-gray-900 text-white font-black rounded-2xl shadow-[0_20px_40px_-12px_rgba(0,0,0,0.3)] hover:bg-black transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Edit2 className="w-5 h-5" />
                  Edit Profile
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02, backgroundColor: "rgba(239, 68, 68, 0.1)" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleLogout}
                  className="px-10 py-4 bg-white text-red-500 font-black rounded-2xl border-2 border-red-500/20 hover:border-red-500 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  Logout
                </motion.button>
              </div>
            </div>

            {/* Stats Cards - Sophisticated Glass Rendering */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              {[
                { label: 'Posts', value: userProfile?.posts?.length || 0, color: 'indigo', icon: ImageIcon },
                { label: 'Followers', value: userProfile?.followers?.length || 0, color: 'purple', icon: Users },
                { label: 'Following', value: userProfile?.following?.length || 0, color: 'blue', icon: Heart }
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -6, shadow: '0 25px 50px -12px rgba(0,0,0,0.15)' }}
                  className="bg-white/40 backdrop-blur-md border border-white/60 p-8 rounded-[32px] flex flex-col items-center group cursor-pointer transition-all"
                >
                  <div className={`p-4 rounded-2xl bg-${stat.color}-500/10 text-${stat.color}-600 mb-4 group-hover:scale-110 transition-transform`}>
                    <stat.icon className="w-8 h-8" />
                  </div>
                  <span className="text-4xl font-black text-gray-900 mb-1">{stat.value}</span>
                  <span className="text-sm font-black text-gray-400 uppercase tracking-widest">{stat.label}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Refined Tabs Section */}
          <div className="mt-4 border-t border-gray-100 bg-gray-50/30 backdrop-blur-sm">
            <div className="flex max-w-2xl mx-auto px-4">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex flex-col items-center gap-3 py-6 px-4 transition-all relative ${activeTab === tab.id ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <div className={`p-2 rounded-xl transition-all ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-transparent'}`}>
                    {tab.icon}
                  </div>
                  <span className="text-xs font-black uppercase tracking-tighter">{tab.label}</span>
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="tabActiveIndicator"
                      className="absolute bottom-0 w-12 h-1.5 bg-indigo-600 rounded-t-full"
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Content Area */}
            <div className="p-8 md:p-12 min-h-[500px] bg-white rounded-t-[40px] shadow-[0_-20px_40px_-20px_rgba(0,0,0,0.05)] border-t border-white">
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
                    <div className="max-w-3xl mx-auto py-10">
                      <div className="bg-gray-50 rounded-[32px] p-10 border border-gray-100">
                        <h3 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                          <Heart className="w-6 h-6 text-pink-500" />
                          About {user?.name?.split(' ')[0]}
                        </h3>
                        <p className="text-gray-600 text-xl leading-relaxed italic">
                          "{user?.about || "This user prefers to keep their life a mystery... for now."}"
                        </p>
                      </div>
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
    </div>
  );
}
