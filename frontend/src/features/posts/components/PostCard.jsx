import { Bookmark, Globe2, Heart, MessageCircle, MoreHorizontal, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { likePost, savePost } from "../../../api";
import { formatTime } from "../../../utils/formatTime";
import CommentsModal from "../modals/CommentModal";
import { privacyService } from "../../../services/privacy.service";
import { useToast } from "../../../context/ToastContext";
import UserAvatar from "../../../components/Common/UserAvatar";
import SanitizedText from "../../../components/Common/SanitizedText";
import { QUERY_KEYS } from "../../../constant/queryKeys";
import { ROUTES } from "../../../constant/routes";

export default function PostCard({ post_likes = [], comments = [], ...post }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useSelector((state) => state.auth);
  const { showSuccess, showError } = useToast();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post_likes.length);
  const [saved, setSaved] = useState(false);
  const [openCommentModal, setOpenCommentModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const saveMutation = useMutation({
    mutationFn: () => savePost(post.id),
    onMutate: () => {
      setSaved((prev) => !prev);
    },
    onSuccess: (data) => {
      if (data?.isSaved) showSuccess("Post saved to bookmarks!");
      else showSuccess("Post removed from bookmarks");
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.saved });
    },
    onError: (err) => {
      setSaved((prev) => !prev);
      showError(err.message || "Failed to save post");
    }
  });

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}${ROUTES.POST_DETAIL(post.id)}`);
    setShowMenu(false);
    showSuccess("Post link copied to clipboard!");
  };

  const handleBlockUser = async () => {
    if (!post?.user?.id) return;
    try {
      await privacyService.blockUser(post.user.id);
      setShowMenu(false);
      showSuccess(`Blocked ${post.user.name || "user"}`);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.feed });
    } catch (err) {
      showError(err.message || "Failed to block user");
    }
  };

  useEffect(() => {
    setLiked(post_likes.some((like) => user?.id === like.userId));
    setLikeCount(post_likes.length);
    if (post?.savedPost && Array.isArray(post.savedPost)) {
      setSaved(post.savedPost.some((s) => s.userId === user?.id));
    }
  }, [post_likes, post?.savedPost, user?.id]);

  const likeMutation = useMutation({
    mutationFn: (postId) => likePost(postId),
    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.post(postId) });
      setLiked((value) => !value);
      setLikeCount((value) => (liked ? Math.max(0, value - 1) : value + 1));
    },
    onSettled: (data, error, postId) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.post(postId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.feed });
    },
  });

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="app-surface overflow-hidden bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-gray-100/60 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] transition-all duration-300"
    >
      <header className="flex items-center justify-between px-5 pt-5">
        <div className="flex min-w-0 items-center gap-3">
          <UserAvatar
            name={post?.user?.name}
            profileImage={post?.user?.profileImage}
            size="md"
            shape="circle"
            animate
            ring="ring-2 ring-white dark:ring-slate-800"
          />
          <div className="min-w-0">
            <button
              type="button"
              onClick={() => post?.user?.id && navigate(ROUTES.USER_PROFILE(post.user.id))}
              className="block truncate text-left text-[14px] font-bold text-gray-950 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              {post?.user?.name || "Unknown user"}
            </button>
            <div className="mt-0.5 flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
              <span>{formatTime(post?.createdAt)}</span>
              <span>·</span>
              <Globe2 className="h-3.5 w-3.5 text-primary-500" />
            </div>
          </div>
        </div>

        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            type="button"
            onClick={() => setShowMenu((prev) => !prev)}
            className="app-icon-button h-9 w-9 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none"
          >
            <MoreHorizontal className="h-5 w-5" />
          </motion.button>

          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100 dark:border-slate-800 py-2 z-30 animate-fadeIn text-sm font-medium">
              <button
                type="button"
                onClick={handleCopyLink}
                className="w-full px-4 py-2 text-left text-gray-700 dark:text-gray-200 hover:bg-primary-50 dark:hover:bg-slate-800 hover:text-primary-600 dark:hover:text-primary-400 transition-colors flex items-center gap-2"
              >
                🔗 Copy Post Link
              </button>

              {user?.id !== post?.user?.id && (
                <button
                  type="button"
                  onClick={handleBlockUser}
                  className="w-full px-4 py-2 text-left text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors flex items-center gap-2 font-bold"
                >
                  🚫 Block {post?.user?.name || "User"}
                </button>
              )}

              {user?.id === post?.user?.id && (
                <button
                  type="button"
                  onClick={() => {
                    setShowMenu(false);
                    showSuccess("Post deleted successfully");
                  }}
                  className="w-full px-4 py-2 text-left text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors flex items-center gap-2 font-bold"
                >
                  🗑️ Delete Post
                </button>
              )}
            </div>
          )}
        </div>
      </header>

      {(post?.title || post?.description) && (
        <div className="px-5 py-4">
          {post?.title && <h3 className="font-heading text-[16px] font-bold leading-7 text-gray-950 dark:text-gray-100">{post.title}</h3>}
          {post?.description && (
            <SanitizedText
              content={post.description}
              className="font-content mt-2 text-[15px] leading-7 text-gray-700 dark:text-gray-300"
            />
          )}
        </div>
      )}

      {post.image && (
        <div className="mx-5 mb-4 overflow-hidden rounded-2xl border border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/40 shadow-inner">
          <motion.img
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
            src={post.image}
            alt={post.title || "Post"}
            className="max-h-[520px] w-full object-cover"
          />
        </div>
      )}

      {post.video && (
        <div className="mx-5 mb-4 overflow-hidden rounded-2xl border border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/40 shadow-inner">
          <video src={post.video} controls playsInline className="max-h-[520px] w-full object-cover" />
        </div>
      )}

      {(likeCount > 0 || comments.length > 0) && (
        <div className="mx-5 flex items-center justify-between border-b border-gray-100/50 dark:border-slate-800 pb-3 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1.5">
            {likeCount > 0 && (
              <>
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-pink-500 text-white shadow-md"
                >
                  <Heart className="h-3.5 w-3.5 fill-white" />
                </motion.span>
                <span className="font-semibold">{likeCount}</span>
              </>
            )}
          </div>
          {comments.length > 0 && (
            <button type="button" onClick={() => setOpenCommentModal(true)} className="font-semibold hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              {comments.length} comments
            </button>
          )}
        </div>
      )}

      <footer className="grid grid-cols-[1fr_1fr_1fr_auto] gap-1 px-4 py-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="button"
          onClick={() => likeMutation.mutate(post.id)}
          className={`flex h-10 items-center justify-center gap-2 rounded-xl text-[13px] font-semibold transition-all ${
            liked ? "bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 shadow-xs" : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800"
          }`}
        >
          <Heart className={`h-4 w-4 ${liked ? "fill-red-600 dark:fill-red-400" : ""}`} />
          Like
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="button"
          onClick={() => setOpenCommentModal(true)}
          className="flex h-10 items-center justify-center gap-2 rounded-xl text-[13px] font-semibold text-gray-600 dark:text-gray-400 transition-all hover:bg-gray-50 dark:hover:bg-slate-800"
        >
          <MessageCircle className="h-4 w-4" />
          Comment
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="button"
          className="flex h-10 items-center justify-center gap-2 rounded-xl text-[13px] font-semibold text-gray-600 dark:text-gray-400 transition-all hover:bg-gray-50 dark:hover:bg-slate-800"
        >
          <Send className="h-4 w-4" />
          Share
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="button"
          onClick={() => saveMutation.mutate()}
          className={`app-icon-button h-10 w-10 ${saved ? "text-primary-600 dark:text-primary-400" : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800"}`}
        >
          <Bookmark className={`h-4 w-4 ${saved ? "fill-primary-600 dark:fill-primary-400" : ""}`} />
        </motion.button>
      </footer>

      <CommentsModal
        isOpen={openCommentModal}
        onClose={() => setOpenCommentModal(false)}
        comments={comments}
        userId={user?.id}
        currentUser={user}
        postId={post.id}
      />
    </motion.article>
  );
}
