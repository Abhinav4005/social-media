import { Heart, MessageCircle, Send, MoreHorizontal, Bookmark } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { formatTime } from "../../utils/formatTime";
import { likePost } from "../../api";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import CommentsModal from "../../Modal/CommentModal";

export default function PostCard({ post_likes = [], comments = [], ...props }) {
  const queryClient = useQueryClient();
  const { user } = useSelector((state) => state.auth);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post_likes.length);
  const [saved, setSaved] = useState(false);
  const [openCommentModal, setOpenCommentModal] = useState(false);

  useEffect(() => {
    const isLiked = post_likes.some((like) => user?.id === like.userId);
    setLiked(isLiked);
  }, [post_likes, user]);

  const likeMutation = useMutation({
    mutationFn: (postId) => likePost(postId),
    onMutate: async (postId) => {
      await queryClient.cancelQueries(["post", postId]);
      const previousData = queryClient.getQueryData(["post", postId]);
      setLiked((prev) => !prev);
      setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
      return { previousData };
    },
    onError: (err, postId, context) => {
      if (context?.previousData) {
        setLikeCount(context.previousData.likes || 0);
        setLiked(context.previousData.userLiked || false);
      }
    },
    onSettled: (data, error, postId) => {
      queryClient.invalidateQueries(["post", postId]);
    },
  });

  const handleLike = () => {
    likeMutation.mutate(props.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="bg-white border border-gray-100 shadow-sm hover:shadow-xl rounded-2xl overflow-hidden mb-6 transition-all"
      key={props.id}
    >
      {/* User Info Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            {props?.user?.profileImage ? (
              <img
                src={props.user.profileImage}
                alt={props.user.name}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-primary-100"
              />
            ) : (
              <img
                src={`https://ui-avatars.com/api/?name=${props?.user.name || "U"
                  }&background=random`}
                alt={props?.user?.name}
                className="w-12 h-12 rounded-full border-2 border-gray-200"
              />
            )}
            {/* Online indicator */}
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full ring-2 ring-white"></span>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 capitalize hover:text-primary-600 cursor-pointer transition">
              {props?.user?.name}
            </h4>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              {formatTime(props?.createdAt)}
              <span className="text-gray-400">•</span>
              <span>🌍 Public</span>
            </p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 hover:bg-gray-100 rounded-full transition"
        >
          <MoreHorizontal className="w-5 h-5 text-gray-600" />
        </motion.button>
      </div>

      {/* Content */}
      {(props?.title || props?.description) && (
        <div className="px-4 pb-3">
          {props?.title && (
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {props.title}
            </h3>
          )}
          {props?.description && (
            <p className="text-gray-700 leading-relaxed">
              {props.description}
            </p>
          )}
        </div>
      )}

      {/* Post Image */}
      {props.image && (
        <div className="relative overflow-hidden bg-gray-100">
          <motion.img
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.4 }}
            src={props?.image}
            alt="Post"
            className="w-full aspect-video object-cover cursor-pointer"
          />
        </div>
      )}

      {/* Post Video */}
      {props?.video && (
        <div className="relative overflow-hidden bg-gray-100">
          <video
            src={props?.video}
            alt="Post video"
            controls
            playsInline
            className="w-full aspect-video object-cover"
          />
        </div>
      )}

      {/* Engagement Stats */}
      <div className="px-4 py-2 flex items-center justify-between text-sm text-gray-600 border-b border-gray-100">
        <div className="flex items-center gap-1">
          {likeCount > 0 && (
            <>
              <div className="flex -space-x-1">
                <span className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">
                  ❤️
                </span>
              </div>
              <span className="ml-1 hover:underline cursor-pointer">
                {likeCount} {likeCount === 1 ? "like" : "likes"}
              </span>
            </>
          )}
        </div>
        <div className="flex items-center gap-3">
          {comments.length > 0 && (
            <span className="hover:underline cursor-pointer">
              {comments.length} {comments.length === 1 ? "comment" : "comments"}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Like Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleLike}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${liked
                ? "text-red-500 bg-red-50"
                : "text-gray-600 hover:bg-gray-100"
              }`}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={liked ? "liked" : "unliked"}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                <Heart
                  className={`w-5 h-5 ${liked ? "fill-red-500" : ""}`}
                />
              </motion.div>
            </AnimatePresence>
            <span className="text-sm">Like</span>
          </motion.button>

          {/* Comment Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setOpenCommentModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-gray-600 hover:bg-gray-100 transition-all"
          >
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm">Comment</span>
          </motion.button>

          {/* Share Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => console.log("Share clicked")}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-gray-600 hover:bg-gray-100 transition-all"
          >
            <Send className="w-5 h-5" />
            <span className="text-sm">Share</span>
          </motion.button>
        </div>

        {/* Save Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setSaved(!saved)}
          className={`p-2 rounded-lg transition-all ${saved
              ? "text-primary-600 bg-primary-50"
              : "text-gray-600 hover:bg-gray-100"
            }`}
        >
          <Bookmark className={`w-5 h-5 ${saved ? "fill-primary-600" : ""}`} />
        </motion.button>
      </div>

      {/* Comments Modal */}
      <CommentsModal
        isOpen={openCommentModal}
        onClose={() => setOpenCommentModal(false)}
        comments={comments}
        userId={user?.id}
        postId={props.id}
      />
    </motion.div>
  );
}
