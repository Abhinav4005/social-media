"use client";
import { useEffect, useState } from "react";
import { X, Image as ImageIcon, MapPin, Smile, MoreHorizontal, Globe, Users, Lock, Sparkles, Film, Trash2 } from "lucide-react";
import { useSelector } from "react-redux";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost, updatePost } from "../api";
import { motion, AnimatePresence } from "framer-motion";

const QUICK_EMOJIS = ["😊", "🔥", "❤️", "🚀", "🎉", "✨", "😍", "👍"];

export default function CreatePostModal({ isOpen, onClose, isEditing = false, editedPost = {} }) {
  const queryClient = useQueryClient();
  const { user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    files: [],
    location: "",
    privacy: "PUBLIC",
  });

  const [showLocationInput, setShowLocationInput] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showPrivacyDropdown, setShowPrivacyDropdown] = useState(false);

  useEffect(() => {
    if (isEditing) {
      setFormData({
        title: editedPost.title || "",
        description: editedPost.description || "",
        files: editedPost.files || [],
        location: editedPost.location || "",
        privacy: editedPost.privacy || "PUBLIC",
      });
    }
  }, [isEditing, editedPost]);

  const { mutate, isLoading, isError, error } = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"]);
      queryClient.invalidateQueries(["feedPosts"]);
      onClose();
    },
    onError: (error) => console.error(error),
  });

  const { mutate: updateUserPost, isLoading: isUpdating } = useMutation({
    mutationFn: ({ postId, data }) => updatePost(postId, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"]);
      queryClient.invalidateQueries(["feedPosts"]);
      onClose();
    },
    onError: (error) => {
      console.error("Error updating post:", error);
      onClose();
    },
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData({ ...formData, files: [...formData.files, ...files] });
  };

  const handleRemoveFile = (index) => {
    const newFiles = [...formData.files];
    newFiles.splice(index, 1);
    setFormData({ ...formData, files: newFiles });
  };

  const handleAddEmoji = (emoji) => {
    setFormData((prev) => ({
      ...prev,
      description: prev.description + emoji,
    }));
  };

  const handlePost = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    if (formData.location) data.append("location", formData.location);
    data.append("privacy", formData.privacy);

    formData.files.forEach((file) =>
      data.append(file.type.startsWith("image") ? "image" : "video", file)
    );

    if (isEditing) {
      updateUserPost({ postId: editedPost.id, data });
    } else {
      mutate(data);
    }
  };

  const isSubmitDisabled = isLoading || isUpdating || (!formData.description.trim() && formData.files.length === 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-md flex justify-center items-center z-[100] px-4 py-6 overflow-y-auto"
        >
          <motion.div
            initial={{ scale: 0.94, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.94, opacity: 0, y: 16 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl shadow-indigo-500/10 w-full max-w-[560px] overflow-hidden border border-gray-100 dark:border-slate-800 transition-colors duration-200"
          >
            {/* Modal Header */}
            <div className="relative px-6 py-4 border-b border-gray-100 dark:border-slate-800/80 flex items-center justify-between bg-gradient-to-r from-gray-50/50 via-white to-gray-50/50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                  <Sparkles className="h-4 w-4" />
                </span>
                <h2 className="text-lg font-black text-gray-900 dark:text-gray-100 tracking-tight">
                  {isEditing ? "Edit Post" : "Create New Post"}
                </h2>
              </div>
              
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition-all cursor-pointer active:scale-95"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto scrollbar-hide">
              {/* User Section & Audience Selector */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    {user?.profileImage ? (
                      <img
                        src={user.profileImage}
                        alt={user.name}
                        className="w-11 h-11 rounded-2xl object-cover ring-2 ring-indigo-500/20 dark:ring-indigo-400/20 shadow-xs"
                      />
                    ) : (
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-base shadow-xs">
                        {user?.name?.charAt(0) || "U"}
                      </div>
                    )}
                    <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full"></span>
                  </div>

                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-gray-100 text-sm leading-tight">
                      {user?.name || "User"}
                    </h4>
                    
                    {/* Privacy Selector Dropdown */}
                    <div className="relative mt-1">
                      <button
                        type="button"
                        onClick={() => setShowPrivacyDropdown((prev) => !prev)}
                        className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-100/80 dark:bg-slate-800/80 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-300 rounded-lg text-xs font-semibold transition-all cursor-pointer"
                      >
                        {formData.privacy === "PUBLIC" && <Globe size={12} className="text-indigo-500" />}
                        {formData.privacy === "FRIENDS" && <Users size={12} className="text-indigo-500" />}
                        {formData.privacy === "PRIVATE" && <Lock size={12} className="text-indigo-500" />}
                        <span className="capitalize">{formData.privacy.toLowerCase()}</span>
                      </button>

                      {showPrivacyDropdown && (
                        <div className="absolute left-0 top-full mt-1.5 w-36 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl shadow-xl z-20 py-1 text-xs font-semibold">
                          <button
                            type="button"
                            onClick={() => {
                              setFormData({ ...formData, privacy: "PUBLIC" });
                              setShowPrivacyDropdown(false);
                            }}
                            className="w-full px-3 py-1.5 text-left flex items-center gap-2 hover:bg-indigo-50 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-200"
                          >
                            <Globe size={12} className="text-indigo-500" /> Public
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setFormData({ ...formData, privacy: "FRIENDS" });
                              setShowPrivacyDropdown(false);
                            }}
                            className="w-full px-3 py-1.5 text-left flex items-center gap-2 hover:bg-indigo-50 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-200"
                          >
                            <Users size={12} className="text-indigo-500" /> Friends Only
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setFormData({ ...formData, privacy: "PRIVATE" });
                              setShowPrivacyDropdown(false);
                            }}
                            className="w-full px-3 py-1.5 text-left flex items-center gap-2 hover:bg-indigo-50 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-200"
                          >
                            <Lock size={12} className="text-indigo-500" /> Only Me
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Input Section */}
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Post Title (Optional)"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full text-base font-bold text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 border-b border-gray-100 dark:border-slate-800 pb-2 outline-none focus:border-indigo-500 dark:focus:border-indigo-400 transition-colors bg-transparent"
                />

                <textarea
                  placeholder={`What's on your mind, ${user?.name?.split(" ")[0] || "there"}?`}
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full text-sm font-medium text-gray-800 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 leading-relaxed outline-none resize-none bg-transparent"
                />

                {/* Location Bar Input if toggled */}
                {showLocationInput && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 px-3 py-2 bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 rounded-xl"
                  >
                    <MapPin className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <input
                      type="text"
                      placeholder="Add location (e.g. New York, NY)"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full bg-transparent text-xs font-semibold text-gray-800 dark:text-gray-200 placeholder-gray-400 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowLocationInput(false)}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    >
                      <X size={14} />
                    </button>
                  </motion.div>
                )}

                {/* Drag-and-Drop / Upload Area */}
                <div className="space-y-3">
                  <label className="flex flex-col items-center justify-center w-full py-5 border-2 border-dashed border-indigo-200/80 dark:border-indigo-900/60 rounded-2xl cursor-pointer bg-indigo-50/30 dark:bg-indigo-950/20 hover:border-indigo-500 dark:hover:border-indigo-400 hover:bg-indigo-50/60 dark:hover:bg-indigo-950/40 transition-all group">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                        <ImageIcon size={20} />
                      </div>
                      <p className="text-xs font-bold text-gray-700 dark:text-gray-300">
                        Drop photos or videos here, or <span className="text-indigo-600 dark:text-indigo-400 hover:underline">browse</span>
                      </p>
                      <p className="text-[10px] font-medium text-gray-400 dark:text-gray-500 mt-0.5">Supports PNG, JPG, MP4, WEBM</p>
                    </div>
                    <input
                      type="file"
                      multiple
                      accept="image/*,video/*"
                      className="hidden"
                      onChange={handleChange}
                    />
                  </label>

                  {/* Media Previews Grid */}
                  {formData.files.length > 0 && (
                    <div className="grid grid-cols-3 gap-2.5 pt-1">
                      <AnimatePresence>
                        {formData.files.map((file, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.85 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.85 }}
                            className="relative aspect-square rounded-xl overflow-hidden group border border-gray-100 dark:border-slate-800 shadow-xs bg-slate-900"
                          >
                            {file.type?.startsWith("image") ? (
                              <img
                                src={URL.createObjectURL(file)}
                                alt="preview"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <div className="relative w-full h-full">
                                <video
                                  src={URL.createObjectURL(file)}
                                  className="w-full h-full object-cover"
                                />
                                <span className="absolute bottom-1.5 left-1.5 bg-black/70 text-white p-1 rounded-md text-[10px] font-bold flex items-center gap-1">
                                  <Film size={10} /> Video
                                </span>
                              </div>
                            )}
                            <button
                              type="button"
                              onClick={() => handleRemoveFile(idx)}
                              className="absolute top-1.5 right-1.5 bg-black/70 hover:bg-rose-600 text-white p-1.5 rounded-full opacity-90 transition-all cursor-pointer"
                            >
                              <Trash2 size={12} />
                            </button>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Emojis Strip if toggled */}
              {showEmojiPicker && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-1.5 p-2 bg-gray-50 dark:bg-slate-800/80 rounded-xl border border-gray-100 dark:border-slate-800 overflow-x-auto"
                >
                  {QUICK_EMOJIS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => handleAddEmoji(emoji)}
                      className="p-1.5 text-base hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-transform active:scale-125 cursor-pointer"
                    >
                      {emoji}
                    </button>
                  ))}
                </motion.div>
              )}

              {/* Bottom Quick Toolbar & Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-slate-800">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setShowEmojiPicker((prev) => !prev)}
                    title="Add Emoji"
                    className={`p-2 rounded-xl text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors cursor-pointer ${
                      showEmojiPicker ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400" : ""
                    }`}
                  >
                    <Smile size={18} />
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setShowLocationInput((prev) => !prev)}
                    title="Add Location"
                    className={`p-2 rounded-xl text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors cursor-pointer ${
                      showLocationInput ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400" : ""
                    }`}
                  >
                    <MapPin size={18} />
                  </button>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  
                  <button
                    type="button"
                    onClick={handlePost}
                    disabled={isSubmitDisabled}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-md shadow-indigo-500/20 active:scale-95 transition-all cursor-pointer disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isLoading || isUpdating ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        <span>Posting...</span>
                      </>
                    ) : isEditing ? (
                      "Save Changes"
                    ) : (
                      "Publish Post"
                    )}
                  </button>
                </div>
              </div>

              {isError && (
                <p className="text-rose-500 text-xs font-bold text-center mt-2">
                  {error?.message || "Failed to publish post"}
                </p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
