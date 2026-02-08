"use client";
import { useEffect, useState } from "react";
import { X, Image as ImageIcon, Video, MapPin, Smile, MoreHorizontal } from "lucide-react";
import { useSelector } from "react-redux";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost, updatePost } from "../api";
import { motion, AnimatePresence } from "framer-motion";

export default function CreatePostModal({ isOpen, onClose, isEditing = false, editedPost = {} }) {
  const queryClient = useQueryClient();
  const { user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    files: [],
  });

  useEffect(() => {
    if (isEditing) {
      setFormData({
        title: editedPost.title || "",
        description: editedPost.description || "",
        files: editedPost.files || [],
      });
    }
  }, [isEditing, editedPost]);

  const { mutate, isLoading, isError, error } = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"]);
      onClose();
    },
    onError: (error) => console.error(error),
  });

  const { mutate: updateUserPost, isLoading: isUpdating, error: updateError } = useMutation({
    mutationFn: ({ postId, data }) => updatePost(postId, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"]);
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

  const handlePost = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    formData.files.forEach((file) => data.append(file.type.startsWith("image") ? "image" : "video", file));

    if (isEditing) {
      updateUserPost({ postId: editedPost.id, data });
    } else {
      mutate(data);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex justify-center items-center z-[100] px-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-white rounded-[32px] shadow-2xl w-full max-w-[540px] overflow-hidden"
          >
            {/* Header */}
            <div className="relative p-6 border-b border-gray-50 flex items-center justify-center">
              <h2 className="text-2xl font-extrabold text-[#1a1f36]">
                {isEditing ? "Edit Post" : "Create New Post"}
              </h2>
              <button
                onClick={onClose}
                className="absolute right-6 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 transition-all active:scale-95"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-8">
              {/* User Section */}
              <div className="flex items-center gap-4 mb-8">
                <div className="relative">
                  {user?.profileImage ? (
                    <img
                      src={`${user.profileImage}`}
                      alt={user.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-primary-50"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-lg">
                      {user?.name?.charAt(0)}
                    </div>
                  )}
                  <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
                <div>
                  <h4 className="font-bold text-[#1a1f36] text-lg leading-tight">{user?.name}</h4>
                  <div className="flex items-center gap-1.5 text-gray-400 mt-1">
                    <Globe size={12} />
                    <span className="text-xs font-semibold">Public</span>
                  </div>
                </div>
              </div>

              {/* Input Section */}
              <div className="space-y-6">
                <input
                  type="text"
                  placeholder="Post Title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full text-lg font-medium text-gray-900 placeholder:text-gray-300 border-b border-gray-100 pb-3 outline-none focus:border-primary-500 transition-colors"
                />

                <textarea
                  placeholder="What's on your mind?"
                  rows="4"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full text-[17px] text-gray-600 placeholder:text-gray-300 leading-relaxed outline-none resize-none"
                ></textarea>

                {/* File Upload / Dashed Area */}
                <div className="space-y-4">
                  <label className="flex flex-col items-center justify-center w-full min-h-[100px] border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer hover:border-primary-400 hover:bg-primary-50/10 transition-all py-6">
                    <div className="flex flex-col items-center justify-center py-2">
                      <ImageIcon className="w-8 h-8 text-gray-300 mb-2" />
                      <p className="text-sm font-bold text-gray-400">Add Images/Videos</p>
                    </div>
                    <input
                      type="file"
                      multiple
                      accept="image/*,video/*"
                      className="hidden"
                      onChange={handleChange}
                    />
                  </label>

                  {/* Preview Grid */}
                  {formData.files.length > 0 && (
                    <div className="grid grid-cols-3 gap-3">
                      <AnimatePresence>
                        {formData.files.map((file, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="relative aspect-square rounded-2xl overflow-hidden group"
                          >
                            {file.type?.startsWith("image") ? (
                              <img
                                src={URL.createObjectURL(file)}
                                alt="preview"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <video
                                src={URL.createObjectURL(file)}
                                className="w-full h-full object-cover"
                              />
                            )}
                            <button
                              onClick={() => handleRemoveFile(idx)}
                              className="absolute top-2 right-2 bg-black/60 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X size={14} />
                            </button>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Actions (Optional but adds polish) */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-50">
                <div className="flex items-center gap-4">
                  <button className="text-gray-400 hover:text-primary-600 transition-colors">
                    <Smile size={24} />
                  </button>
                  <button className="text-gray-400 hover:text-primary-600 transition-colors">
                    <MapPin size={24} />
                  </button>
                  <button className="text-gray-400 hover:text-primary-600 transition-colors">
                    <MoreHorizontal size={24} />
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  <button
                    onClick={onClose}
                    className="px-6 py-3 rounded-2xl text-sm font-bold text-gray-500 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePost}
                    disabled={isLoading || isUpdating || !formData.description.trim()}
                    className="px-8 py-3 rounded-2xl bg-primary-600 text-white font-bold text-sm shadow-lg shadow-primary-200 hover:bg-primary-700 transition-all active:scale-[0.98] disabled:opacity-50 disabled:shadow-none"
                  >
                    {isLoading || isUpdating ? "Posting..." : isEditing ? "Update" : "Post"}
                  </button>
                </div>
              </div>

              {isError && (
                <p className="text-red-500 mt-4 text-xs font-bold text-center">
                  {error?.message || "Something went wrong"}
                </p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const Globe = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);
