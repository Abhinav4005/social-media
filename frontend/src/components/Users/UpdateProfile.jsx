"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { QueryClient, useMutation } from "@tanstack/react-query";
import { updateUserProfile } from "../../api";
import Navbar from "../../pages/Navbar";
import { setCredentials } from "../../store/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { User, Mail, FileText, Info, MapPin, Lock, Camera, X, Check, ArrowLeft } from "lucide-react";

export default function UpdateProfile() {
  const queryClient = new QueryClient();
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [avatarPreview, setAvatarPreview] = useState(
    user?.profileImage || "/default-avatar.png"
  );
  const [avatarFile, setAvatar] = useState(null);

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
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const mutation = useMutation({
    mutationFn: (userData) => updateUserProfile(userData),
    onSuccess: (data) => {
      queryClient.invalidateQueries(["userProfile"]);
      dispatch(setCredentials({ user: data?.user }))
      navigate("/profile");
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
    if (avatarFile) {
      data.append("profileImage", avatarFile);
    }
    mutation.mutate(data);
  }

  const handleCancel = () => {
    navigate("/profile")
  }

  const inputFields = [
    { label: "Full Name", name: "name", type: "text", icon: <User className="w-5 h-5" />, placeholder: "e.g. John Doe" },
    { label: "Email Address", name: "email", type: "email", icon: <Mail className="w-5 h-5" />, placeholder: "e.g. john@example.com" },
    { label: "Location", name: "location", type: "text", icon: <MapPin className="w-5 h-5" />, placeholder: "e.g. New York, USA" },
    { label: "New Password", name: "password", type: "password", icon: <Lock className="w-5 h-5" />, placeholder: "Leave blank to keep current" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1 flex flex-col items-center py-10 px-4">
        <motion.button
          whileHover={{ x: -4 }}
          onClick={handleCancel}
          className="max-w-3xl w-full flex items-center gap-2 text-gray-600 hover:text-primary-600 mb-6 font-medium transition self-center cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Profile
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-3xl bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100 flex flex-col md:flex-row"
        >
          {/* Left Sidebar (Desktop) / Header (Mobile) */}
          <div className="md:w-1/3 bg-gray-900 p-8 flex flex-col items-center text-center text-white relative">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <User className="w-32 h-32" />
            </div>

            <div className="relative z-10">
              <h2 className="text-2xl font-bold mb-2">Edit Profile</h2>
              <p className="text-gray-400 text-sm mb-8">Personalize your social identity</p>

              {/* Avatar Section */}
              <div className="relative group mb-6">
                <div className="w-32 h-32 rounded-3xl overflow-hidden border-4 border-primary-500 shadow-2xl relative">
                  <img
                    src={avatarPreview}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                  <label className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Camera className="w-8 h-8 text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                    />
                  </label>
                </div>

                <AnimatePresence>
                  {avatarFile && (
                    <motion.button
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      onClick={handleRemoveAvatar}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 shadow-lg border-2 border-white transition z-20 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>

              <h3 className="font-semibold text-lg">{formData.name || "User"}</h3>
              <p className="text-xs text-gray-500 truncate max-w-[150px]">{formData.email}</p>
            </div>
          </div>

          {/* Form Content */}
          <div className="flex-1 p-8 md:p-12">
            <div className="space-y-6">
              {/* Basic Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {inputFields.slice(0, 2).map((field) => (
                  <div key={field.name} className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                      {field.icon}
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all shadow-sm"
                    />
                  </div>
                ))}
              </div>

              {/* Bio Section */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Short Bio
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Tell us something interesting..."
                  rows="3"
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all shadow-sm resize-none"
                ></textarea>
              </div>

              {/* About Section */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                  <Info className="w-5 h-5" />
                  Detailed About
                </label>
                <textarea
                  name="about"
                  value={formData.about}
                  onChange={handleChange}
                  placeholder="Share your story, skills, or interests..."
                  rows="4"
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all shadow-sm resize-none"
                ></textarea>
              </div>

              {/* Remaining Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {inputFields.slice(2).map((field) => (
                  <div key={field.name} className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                      {field.icon}
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all shadow-sm"
                    />
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="pt-6 flex items-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleUpdateProfile}
                  className="flex-1 bg-gray-900 text-white py-4 rounded-2xl font-bold shadow-xl hover:bg-black transition-all flex items-center justify-center gap-2 cursor-pointer"
                  disabled={mutation.isPending}
                >
                  {mutation.isPending ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Check className="w-5 h-5" />
                      Save Changes
                    </>
                  )}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCancel}
                  className="px-8 py-4 bg-gray-100 text-gray-700 rounded-2xl font-bold hover:bg-gray-200 transition-all cursor-pointer"
                >
                  Cancel
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

