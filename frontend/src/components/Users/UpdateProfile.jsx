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
    { label: "Full Name", name: "name", type: "text", icon: <User className="w-5 h-5 text-indigo-500" />, placeholder: "e.g. John Doe" },
    { label: "Email Address", name: "email", type: "email", icon: <Mail className="w-5 h-5 text-purple-500" />, placeholder: "e.g. john@example.com" },
    { label: "Location", name: "location", type: "text", icon: <MapPin className="w-5 h-5 text-pink-500" />, placeholder: "e.g. New York, USA" },
    { label: "New Password", name: "password", type: "password", icon: <Lock className="w-5 h-5 text-blue-500" />, placeholder: "Leave blank to keep current" },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Navbar />

      <main className="max-w-5xl mx-auto pt-10 pb-20 px-4">
        <motion.button
          whileHover={{ x: -6 }}
          onClick={handleCancel}
          className="flex items-center gap-2 text-gray-400 hover:text-indigo-600 mb-8 font-black uppercase tracking-widest text-xs transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Your Presence
        </motion.button>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/80 backdrop-blur-2xl rounded-[40px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] overflow-hidden border border-white/40 flex flex-col md:flex-row"
        >
          {/* Visual Side Banner */}
          <div className="md:w-2/5 bg-gray-900 p-12 flex flex-col items-center text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full blur-[120px] opacity-20 -mr-32 -mt-32" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500 rounded-full blur-[120px] opacity-20 -ml-32 -mb-32" />

            <div className="relative z-10">
              <h2 className="text-4xl font-black text-white mb-4 tracking-tighter italic">Refine Persona</h2>
              <p className="text-gray-400 font-extrabold text-[10px] mb-12 uppercase tracking-[0.3em] opacity-80">Identity Configuration</p>

              {/* Advanced Avatar Upload */}
              <div className="relative group mb-8">
                <div className="p-1 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-[36px] shadow-2xl">
                  <div className="w-48 h-48 rounded-[32px] overflow-hidden bg-gray-800 relative">
                    <img
                      src={avatarPreview}
                      alt="Avatar"
                      className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                    />
                    <label className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer">
                      <Camera className="w-10 h-10 text-white mb-2" />
                      <span className="text-white text-xs font-black uppercase tracking-widest">Upload New</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarChange}
                      />
                    </label>
                  </div>
                </div>

                <AnimatePresence>
                  {avatarFile && (
                    <motion.button
                      initial={{ scale: 0, rotate: -45 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: 45 }}
                      onClick={handleRemoveAvatar}
                      className="absolute -top-3 -right-3 bg-red-500 text-white rounded-2xl w-10 h-10 flex items-center justify-center hover:bg-red-600 shadow-xl border-4 border-gray-900 transition z-20 cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>

              <h3 className="text-2xl font-black text-white mb-1">{formData.name || "User"}</h3>
              <p className="text-gray-500 font-medium text-sm truncate max-w-[200px]">{formData.email}</p>
            </div>
          </div>

          {/* Elegant Form Area */}
          <div className="flex-1 p-8 md:p-16 space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {inputFields.slice(0, 2).map((field) => (
                <div key={field.name} className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2 px-1">
                    {field.icon}
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl px-6 py-4 text-gray-900 font-bold placeholder:text-gray-300 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:bg-white focus:border-indigo-200 transition-all"
                  />
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2 px-1">
                <FileText className="w-5 h-5 text-indigo-500" />
                Short Bio
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Briefly state your vibe..."
                rows="2"
                className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl px-6 py-4 text-gray-900 font-bold placeholder:text-gray-300 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:bg-white focus:border-indigo-200 transition-all resize-none"
              ></textarea>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2 px-1">
                <Info className="w-5 h-5 text-purple-500" />
                Deeper Narrative
              </label>
              <textarea
                name="about"
                value={formData.about}
                onChange={handleChange}
                placeholder="Go into detail about your interests..."
                rows="4"
                className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl px-6 py-4 text-gray-900 font-bold placeholder:text-gray-300 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:bg-white focus:border-indigo-200 transition-all resize-none"
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {inputFields.slice(2).map((field) => (
                <div key={field.name} className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2 px-1">
                    {field.icon}
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl px-6 py-4 text-gray-900 font-bold placeholder:text-gray-300 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:bg-white focus:border-indigo-200 transition-all"
                  />
                </div>
              ))}
            </div>

            {/* Premium Sticky-ish Footer Actions */}
            <div className="pt-8 flex flex-col sm:flex-row items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleUpdateProfile}
                disabled={mutation.isPending}
                className="w-full sm:flex-1 bg-gray-900 text-white py-5 rounded-2xl font-black text-lg shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] hover:bg-black transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50"
              >
                {mutation.isPending ? (
                  <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    Synchronize
                  </>
                )}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: "rgba(0,0,0,0.05)" }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCancel}
                className="w-full sm:w-auto px-10 py-5 text-gray-400 font-black uppercase tracking-widest text-sm transition-all cursor-pointer"
              >
                Discard
              </motion.button>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

