"use client";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
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
    setFormData({ ...formData, files });
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
      console.log("Updating Post with Data:", data);
      updateUserPost({ postId: editedPost.id, data });
    } else {
      mutate(data);
    }
  };

  console.log("user:", user);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/40 backdrop-blur-md flex justify-center items-center z-50"
    >
      <motion.div
        initial={{ y: -50, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: -50, opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 relative border border-gray-200"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition cursor-pointer"
        >
          <X size={24} />
        </button>

        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          {isEditing ? "Edit Post" : "Create New Post"}
        </h2>

        <div className="flex items-center gap-4 mb-6">
          {user?.profileImage ? (
            <img
              src={`${user.profileImage}`}
              alt="User Avatar"
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <img
            src={`https://i.pravatar.cc/150?u=${user.email}`}
            alt="User Avatar"
            className="w-12 h-12 rounded-full border border-gray-300 shadow-sm"
          />
          )}
          <span className="font-medium text-gray-700 capitalize">{user?.name}</span>
        </div>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Post Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition shadow-sm"
          />
          <textarea
            placeholder="What's on your mind?"
            rows="4"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none transition shadow-sm"
          ></textarea>

          {/* File Upload */}
          <label className="flex items-center gap-3 border border-dashed border-gray-300 p-3 rounded-xl cursor-pointer hover:bg-gray-50 transition duration-300">
            <span className="text-gray-600">Add Images/Videos</span>
            <input
              type="file"
              multiple
              accept="image/*,video/*"
              className="hidden"
              onChange={handleChange}
            />
          </label>

          {/* Preview Grid */}
          <div className="grid grid-cols-2 gap-3 mt-3">
            <AnimatePresence>
              {formData.files.map((file, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="relative"
                >
                  {file.type.startsWith("image") ? (
                    <img
                      src={URL.createObjectURL(file)}
                      alt="preview"
                      className="w-full h-32 object-cover rounded-xl shadow-sm"
                    />
                  ) : (
                    <video
                      src={URL.createObjectURL(file)}
                      className="w-full h-32 object-cover rounded-xl shadow-sm"
                      controls
                    />
                  )}
                  <motion.button
                    whileHover={{ scale: 1.2 }}
                    className="absolute top-2 right-2 bg-black/50 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-black/70 transition"
                    onClick={() => handleRemoveFile(idx)}
                  >
                    ×
                  </motion.button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-2 rounded-xl bg-gray-300 cursor-pointer text-gray-700 hover:bg-gray-400 transition font-semibold"
            onClick={onClose}
          >
            Cancel
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-2 rounded-xl cursor-pointer bg-gradient-to-r from-indigo-500 to-indigo-600 text-white hover:from-indigo-600 hover:to-indigo-700 transition font-semibold"
            onClick={handlePost}
            disabled={isLoading || isUpdating}
          >
            {(isLoading) ? "Posting..." : isEditing ? "Update Post" : "Post"}
          </motion.button>
        </div>

        {isError && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-500 mt-3 text-sm"
          >
            {error.message}
          </motion.p>
        )}
      </motion.div>
    </motion.div>
  );
}