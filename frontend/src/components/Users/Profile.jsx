import Button from "../UI/Button";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { useState } from "react";
import { useQuery, useMutation, QueryClient } from "@tanstack/react-query";
import { getUserProfile } from "../../api";
import FriendsTab from "../Friends/FriendsTab";
import PostTab from "../Posts/PostTab";
import Navbar from "../../pages/Navbar";
import { useNavigate } from "react-router-dom";
import { clearCredentials, setCredentials } from "../../store/slices/authSlice.js";
import { Plus } from "lucide-react";
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

  // console.log("userProfile: ", userProfile);

  const handleViewCover = (coverImage) => {
    if (!coverImage) return;

    window.open(coverImage, "_blank");
  }

  const handleCoverUpload = (e) => {
    const file = e.target.files?.[0];
    console.log("Selected cover file:", file);
    if (file) {
      setCoverData(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  }

  const handleRemoveCover = () =>{
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
    console.log("Uploading cover image:", coverData);
    const formData = new FormData();
    if (coverData) {
      formData.append("coverImage", coverData);
      mutation.mutate(formData);
    }
  }

  return (
    <>
      <Navbar />
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl mx-auto bg-white mt-6 rounded-2xl shadow-xl border border-gray-200 overflow-hidden"
      >

        {/* Cover Photo Section */}
        <div className="relative h-48 md:h-64 overflow-hidden rounded-b-2xl shadow-lg group">
          {/* Cover Image or Gradient Fallback */}
          {userProfile?.coverImage ? (
            <img
              src={userProfile.coverImage}
              alt="Cover"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 animate-gradient-x"></div>
          )}

          {/* Overlay for readability */}
          <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]"></div>

          {/* Bottom Fade */}
          <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-black/50 to-transparent"></div>

          {/* Action Buttons */}
          <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {/* View Button */}
            <button
              onClick={() => handleViewCover(userProfile?.coverImage)}
              className="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white text-sm cursor-pointer rounded-lg backdrop-blur-md flex items-center gap-1 transition-all"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 12s3.75-7.5 9.75-7.5S21.75 12 21.75 12s-3.75 7.5-9.75 7.5S2.25 12 2.25 12z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z"
                />
              </svg>
              View
            </button>

            {/* Upload Button */}
            <button
              onClick={() => setOpenCoverModal(true)}
              className="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white cursor-pointer text-sm rounded-lg backdrop-blur-md flex items-center gap-1 transition-all"
            >
              <Plus />
              {userProfile?.coverImage ? "Update" : "Add"}
            </button>
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


        {/* Profile Avatar */}
        <div className="relative px-6">
          <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
            {user?.profileImage ? (
              <img
                src={user?.profileImage}
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
              />
            ) : (
              <motion.div
                whileHover={{ scale: 1.08 }}
                className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-3xl font-bold flex items-center justify-center shadow-2xl border-4 border-white cursor-pointer transition-all"
              >
                {user?.name ? getInitials(user.name) : "?"}
              </motion.div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="pt-20 text-center px-6">
          <h2 className="text-3xl font-extrabold text-gray-800 capitalize">{user?.name || "Guest User"}</h2>
          {/* <p className="text-gray-500 text-sm mt-1">{user?.email || "No email available"}</p> */}

          {/* Bio / tagline */}
          <p className="mt-4 text-gray-600 italic">{user?.bio || "This is your space — express yourself!"}</p>

          {/* Stats Section */}
          <div className="mt-6 flex justify-center gap-10 text-center">
            <motion.div whileHover={{ scale: 1.05 }} className="cursor-pointer">
              <p className="text-xl font-bold text-gray-800">{userProfile?.posts?.length || 0}</p>
              <p className="text-sm text-gray-500">Posts</p>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} className="cursor-pointer">
              <p className="text-xl font-bold text-gray-800">{userProfile?.followers?.length}</p>
              <p className="text-sm text-gray-500">Followers</p>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} className="cursor-pointer">
              <p className="text-xl font-bold text-gray-800">{userProfile?.following?.length || 0}</p>
              <p className="text-sm text-gray-500">Following</p>
            </motion.div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex justify-center gap-4 flex-wrap">
            <Button className="px-6 py-2 rounded-xl cursor-pointer bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold shadow-md hover:shadow-xl transition transform hover:scale-105"
              onClick={() => navigate("/update-profile")}
            >
              Edit Profile
            </Button>
            <Button
              className="px-6 py-2 rounded-xl cursor-pointer bg-gray-500 text-white font-semibold shadow-md hover:bg-gray-600 transition transform hover:scale-105"
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
                className={`flex-1 py-3 text-sm font-semibold transition-colors duration-300 ${activeTab === tab
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
            {activeTab === "posts" && <PostTab posts={userProfile?.posts} isLoading={isLoading} isError={isError} />}
            {activeTab === "about" && <p>{user?.about}</p>}
            {activeTab === "friends" && (
              <FriendsTab
                activeTab={activeTab}
                followers={userProfile?.followers}
                following={userProfile?.following}
                isLoading={isLoading}
                isError={isError}
              />
            )}
            {activeTab === "photos" && <Photos/>}
          </div>
        </div>
      </motion.div>
    </>
  );
}