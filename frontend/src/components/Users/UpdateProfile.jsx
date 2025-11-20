"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { QueryClient, useMutation } from "@tanstack/react-query";
import { updateUserProfile } from "../../api";
import Navbar from "../../pages/Navbar";
import { setCredentials } from "../../store/slices/authSlice";
import { useNavigate } from "react-router-dom";

export default function UpdateProfile() {
  const queryClient = new QueryClient();
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [avatarPreview, setAvatarPreview] = useState(
    user?.profileImage || "/default-avatar.png"
  );
  const [avatarFile, setAvatar] = useState(null);

  console.log("User from Redux:", user);

  const initialData = {
    name: user?.name || "",
    email: user?.email || "",
    bio: user?.bio || "",
    location: user?.location || "",
    profileImage: user?.profileImage || null,
    about: user?.about || "",
    password: "",
  }

  const [formData, setFormData] = useState(initialData);

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
      setAvatar(file);
    }
  };

  const handleRemoveAvatar = () => {
    setAvatarPreview("/default-avatar.png");
    setAvatar(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log("Name value",name, value);
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  console.log("Form Data:", formData);

  const mutation = useMutation({
    mutationFn: (userData) => updateUserProfile(userData),
    onSuccess: (data) => {
      queryClient.invalidateQueries(["userProfile"]);
      dispatch(setCredentials({ user: data?.user }))
      navigate("/profile");
      console.log("Profile updated successfully!");
    },
    onError: (error) => {
      console.error("Error updating profile:", error);
    }
  })

  const handleUpdateProfile = () => {
    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("bio", formData.bio);
    data.append("location", formData.location);
    data.append("about", formData.about);
    data.append("password", formData.password);
    if(avatarFile){
      data.append("profileImage", avatarFile);
    }
    mutation.mutate(data);
  }

  const handleCancel = () => {
    navigate("/profile")
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-pink-100 flex flex-col items-center py-10 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-3xl backdrop-blur-xl bg-white/70 rounded-3xl shadow-2xl p-10 border border-gray-200"
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            ✨ Update Your Profile
          </h1>

          {/* Avatar Section */}
          <div className="flex flex-col items-center gap-4 mb-10">
            <div className="relative group">
              <img
                src={avatarPreview}
                alt="Avatar"
                className="w-32 h-32 rounded-full border-4 border-indigo-500 shadow-lg object-cover"
              />
              {avatarPreview !== "/default-avatar.png" && (
                <button
                  onClick={handleRemoveAvatar}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center hover:bg-red-600 transition"
                >
                  ×
                </button>
              )}
            </div>
            <label className="cursor-pointer text-indigo-600 hover:underline text-sm font-medium">
              Change Avatar
              <input
                type="file"
                accept="image/*"
                className="hidden"
                name="profileImage"
                value={formData.profileImage ? undefined : ""}
                onChange={handleAvatarChange}
              />
            </label>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="text"
              placeholder="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm transition"
            />
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm transition"
            />
          </div>

          <textarea
            placeholder="Bio"
            rows="4"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            className="w-full mt-6 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none shadow-sm transition"
          ></textarea>

          <textarea
            name="about"
            placeholder="About"
            rows="2"
            value={formData.about}
            onChange={handleChange}
            className="w-full mt-6 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none shadow-sm transition"
          ></textarea>

          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            className="w-full mt-4 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm transition"
          />

          <input
            type="password"
            name="password"
            placeholder="New Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full mt-4 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm transition"
          />

          {/* Action Buttons */}
          <div className="mt-10 flex justify-end gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 rounded-xl bg-gray-300 text-gray-700 hover:bg-gray-400 transition font-semibold cursor-pointer"
              onClick={handleCancel}
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleUpdateProfile}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 text-white hover:from-indigo-600 hover:to-indigo-700 transition font-semibold cursor-pointer"
            >
              Save Changes
            </motion.button>
          </div>
        </motion.div>
      </div>
    </>
  );
}
