import { Heart, MessageCircle, Send, MoreHorizontal, Bookmark, Globe } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { formatTime } from "../../utils/formatTime";
import { likePost } from "../../api";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import CommentsModal from "../../Modal/CommentModal";

export default function PostCard({ post_likes = [], comments = [], ...props }) {
  const navigate = useNavigate();
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

  const handleLike = () => likeMutation.mutate(props.id);

  const initials = props?.user?.name
    ? props.user.name.split(" ").map((n) => n[0]?.toUpperCase()).slice(0, 2).join("")
    : "U";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="mb-5 overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-[0_22px_60px_-42px_rgba(15,23,42,0.45)] transition-all duration-300 hover:shadow-[0_26px_70px_-42px_rgba(15,23,42,0.55)]"
    >
      {/* User Info Header */}
      <div className="flex items-center justify-between px-5 pb-4 pt-5">
        <div className="flex items-center gap-3.5">
          <div className="relative flex-shrink-0">
            {props?.user?.profileImage ? (
              <img
                src={props.user.profileImage}
                alt={props.user.name}
                className="h-11 w-11 rounded-full object-cover shadow-sm ring-1 ring-gray-100"
              />
            ) : (
              <div
                className="flex h-11 w-11 items-center justify-center rounded-full text-sm font-black text-white shadow-sm"
                style={{ background: "linear-gradient(135deg, var(--color-primary-500) 0%, var(--color-secondary-500) 100%)" }}
              >
                {initials}
              </div>
            )}
            <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-green-500 ring-2 ring-white shadow-sm" />
          </div>
          <div className="min-w-0">
            <h4
              onClick={() => props?.user?.id && navigate(`/user/${props.user.id}`)}
              className="cursor-pointer truncate text-[15px] font-black capitalize leading-tight tracking-tight text-gray-950 transition-colors hover:text-indigo-600"
            >
              {props?.user?.name}
            </h4>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-xs font-semibold text-gray-400">{formatTime(props?.createdAt)}</span>
              <span className="text-gray-300 text-xs">•</span>
              <div className="flex items-center gap-1 text-xs text-gray-400 font-medium">
                <Globe className="w-3 h-3" />
                <span>Public</span>
              </div>
            </div>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          transition={{ duration: 0.2 }}
          className="p-2.5 hover:bg-gray-100 rounded-full transition-colors"
        >
          <MoreHorizontal className="w-5 h-5 text-gray-400" />
        </motion.button>
      </div>

      {/* Content */}
      {(props?.title || props?.description) && (
      <div className="px-5 pb-4">
          {props?.title && (
            <h3 className="mb-2 text-[17px] font-black leading-snug tracking-tight text-gray-950">
              {props.title}
            </h3>
          )}
          {props?.description && (
            <p className="text-[15px] leading-relaxed text-gray-600">
              {props.description}
            </p>
          )}
        </div>
      )}

      {/* Post Image */}
      {props.image && (
        <div className="relative mx-5 mb-4 overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 shadow-sm">
          <motion.img
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.5 }}
            src={props?.image}
            alt="Post"
            className="w-full aspect-video object-cover cursor-pointer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-2xl pointer-events-none" />
        </div>
      )}

      {/* Post Video */}
      {props?.video && (
        <div className="relative mx-5 mb-4 overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 shadow-sm">
          <video
            src={props?.video}
            controls
            playsInline
            className="w-full aspect-video object-cover rounded-2xl"
          />
        </div>
      )}

      {/* Engagement Stats */}
      {(likeCount > 0 || comments.length > 0) && (
        <div className="flex items-center justify-between px-5 py-2.5 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            {likeCount > 0 && (
              <div className="flex items-center gap-1.5">
                <div className="flex items-center justify-center w-5 h-5 bg-red-500 rounded-full shadow-sm">
                  <span className="text-[10px]">❤️</span>
                </div>
                <span className="font-semibold text-gray-600 hover:underline cursor-pointer">
                  {likeCount} {likeCount === 1 ? "like" : "likes"}
                </span>
              </div>
            )}
          </div>
          {comments.length > 0 && (
            <span
              className="font-semibold text-gray-500 hover:text-primary-600 hover:underline cursor-pointer transition-colors"
              onClick={() => setOpenCommentModal(true)}
            >
              {comments.length} {comments.length === 1 ? "comment" : "comments"}
            </span>
          )}
        </div>
      )}

      {/* Divider */}
      <div className="mx-5 border-t border-gray-100" />

      {/* Actions */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-1">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.92 }}
            onClick={handleLike}
            className={`flex cursor-pointer items-center gap-2 rounded-2xl px-3.5 py-2.5 text-sm font-extrabold transition-all duration-200 ${liked ? "bg-red-50 text-red-500" : "text-gray-500 hover:bg-gray-50 hover:text-red-500"
              }`}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={liked ? "liked" : "unliked"}
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0 }}
                transition={{ duration: 0.15 }}
              >
                <Heart className={`w-5 h-5 ${liked ? "fill-red-500" : ""}`} />
              </motion.div>
            </AnimatePresence>
            <span>Like</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => setOpenCommentModal(true)}
            className="flex cursor-pointer items-center gap-2 rounded-2xl px-3.5 py-2.5 text-sm font-extrabold text-gray-500 transition-all duration-200 hover:bg-indigo-50 hover:text-indigo-600"
          >
            <MessageCircle className="w-5 h-5" />
            <span>Comment</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.92 }}
            className="flex cursor-pointer items-center gap-2 rounded-2xl px-3.5 py-2.5 text-sm font-extrabold text-gray-500 transition-all duration-200 hover:bg-green-50 hover:text-green-600"
          >
            <Send className="w-5 h-5" />
            <span>Share</span>
          </motion.button>
        </div>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setSaved(!saved)}
          className={`p-2.5 rounded-2xl transition-all cursor-pointer duration-200 ${saved ? "text-primary-600 bg-primary-50" : "text-gray-400 hover:bg-gray-50 hover:text-gray-600"
            }`}
        >
          <Bookmark className={`w-5 h-5 ${saved ? "fill-primary-600" : ""}`} />
        </motion.button>
      </div>

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
