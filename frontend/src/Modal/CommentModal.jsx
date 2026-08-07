import { useState } from "react";
import { X, Heart, CornerDownLeft, Send, MessageCircle, Smile } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { commentLike, commentOnPost } from "../api";

/* ── Avatar gradient palette ─────────────────────────────────── */
const AVATAR_GRADIENTS = [
  ["#6366f1", "#8b5cf6"],
  ["#ec4899", "#f43f5e"],
  ["#f59e0b", "#f97316"],
  ["#10b981", "#14b8a6"],
  ["#3b82f6", "#6366f1"],
  ["#a855f7", "#ec4899"],
];
function getGradient(name = "") {
  const code = [...(name || "U")].reduce((a, c) => a + c.charCodeAt(0), 0);
  return AVATAR_GRADIENTS[code % AVATAR_GRADIENTS.length];
}

/* ── Stagger variants ────────────────────────────────────────── */
const listVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 14, scale: 0.97 },
  show: {
    opacity: 1, y: 0, scale: 1,
    transition: { type: "spring", stiffness: 320, damping: 26 },
  },
};

/* ── Comment node ────────────────────────────────────────────── */
function CommentNode({ comment, depth = 0, postId, userId, commentMutation, commentLikeMutation }) {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [justLiked, setJustLiked] = useState(false);

  const handleLike = () => {
    setJustLiked(true);
    setTimeout(() => setJustLiked(false), 600);
    commentLikeMutation.mutate(comment.id);
  };

  const submitReply = () => {
    if (!replyText.trim()) return;
    commentMutation.mutate({ content: replyText.trim(), userId, postId, parentId: comment.id });
    setReplyText("");
    setShowReplyInput(false);
  };

  const [c1, c2] = getGradient(comment?.user?.name);
  const initials = (comment?.user?.name || "U").charAt(0).toUpperCase();

  return (
    <motion.div variants={itemVariants} className={`flex gap-3 ${depth > 0 ? "ml-9 mt-2" : ""}`}>
      {/* Avatar */}
      {comment?.user?.profileImage ? (
        <img
          src={comment.user.profileImage}
          alt={comment?.user?.name}
          className="w-8 h-8 rounded-full object-cover flex-shrink-0 ring-2 ring-white dark:ring-slate-900 shadow-sm"
        />
      ) : (
        <div
          className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md ring-2 ring-white dark:ring-slate-900"
          style={{ background: `linear-gradient(135deg, ${c1}, ${c2})` }}
        >
          {initials}
        </div>
      )}

      <div className="flex-1 min-w-0">
        {/* Bubble */}
        <div className="bg-gray-50/90 dark:bg-slate-800/70 backdrop-blur-sm border border-gray-100 dark:border-slate-700/50 rounded-2xl rounded-tl-sm px-4 py-3 inline-block max-w-full shadow-sm">
          <p
            className="text-[11px] font-semibold mb-0.5 tracking-wide"
            style={{ color: c1 }}
          >
            {comment?.user?.name || `User ${comment.userId}`}
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed">{comment.content}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 mt-1.5 ml-1">
          <motion.button
            whileTap={{ scale: 0.8 }}
            onClick={handleLike}
            className={`relative flex items-center gap-1 text-xs font-semibold transition-colors cursor-pointer select-none ${
              comment.userLiked ? "text-rose-500" : "text-gray-400 dark:text-gray-500 hover:text-rose-400"
            }`}
          >
            <AnimatePresence>
              {justLiked && (
                <motion.div
                  key="pulse"
                  initial={{ scale: 1, opacity: 0.7 }}
                  animate={{ scale: 2.6, opacity: 0 }}
                  exit={{}}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 rounded-full bg-rose-400 pointer-events-none"
                />
              )}
            </AnimatePresence>
            <motion.div animate={justLiked ? { scale: [1, 1.4, 1] } : { scale: 1 }} transition={{ duration: 0.3 }}>
              <Heart className={`w-3.5 h-3.5 ${comment.userLiked ? "fill-rose-500" : ""}`} />
            </motion.div>
            {comment.likes > 0 && <span>{comment.likes}</span>}
            Like
          </motion.button>

          {depth === 0 && (
            <motion.button
              whileTap={{ scale: 0.88 }}
              onClick={() => setShowReplyInput(!showReplyInput)}
              className="flex items-center gap-1 text-xs font-semibold text-gray-400 dark:text-gray-500 hover:text-primary-500 dark:hover:text-primary-400 transition-colors cursor-pointer"
            >
              <CornerDownLeft className="w-3.5 h-3.5" />
              Reply
            </motion.button>
          )}
        </div>

        {/* Reply input */}
        <AnimatePresence>
          {showReplyInput && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: "auto", marginTop: 8 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Write a reply..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && submitReply()}
                  autoFocus
                  className="flex-1 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-xl px-3 py-2 text-sm outline-none text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:border-primary-400 dark:focus:border-primary-500 focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-900/30 transition-all"
                />
                <motion.button
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={submitReply}
                  disabled={!replyText.trim()}
                  className="w-9 h-9 flex-shrink-0 text-white rounded-xl flex items-center justify-center disabled:opacity-30 shadow-sm cursor-pointer"
                  style={{ background: `linear-gradient(135deg, ${c1}, ${c2})` }}
                >
                  <Send className="w-3.5 h-3.5" />
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Nested replies */}
        {comment.replies?.length > 0 && (
          <motion.div variants={listVariants} initial="hidden" animate="show" className="mt-2 space-y-2">
            {comment.replies.map((reply) => (
              <CommentNode
                key={reply.id}
                comment={reply}
                depth={depth + 1}
                postId={postId}
                userId={userId}
                commentMutation={commentMutation}
                commentLikeMutation={commentLikeMutation}
              />
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

/* ── Main modal ──────────────────────────────────────────────── */
export default function CommentsModal({ isOpen, onClose, comments = [], userId, currentUser, postId }) {
  // Only render root-level comments; replies are nested inside each comment.replies[]
  const rootComments = comments.filter((c) => c.parentId == null);
  const [newComment, setNewComment] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const queryClient = useQueryClient();

  const commentMutation = useMutation({
    mutationFn: (commentData) => commentOnPost(postId, commentData),
    onMutate: async (commentData) => {
      await queryClient.cancelQueries(["post", commentData.postId]);
      const previousComments = queryClient.getQueryData(["post", commentData.postId]);
      // Inject the full current user so the optimistic comment renders with real name/avatar
      const optimisticComment = {
        ...commentData,
        id: `optimistic-${Date.now()}`,
        replies: [],
        likes: 0,
        userLiked: false,
        user: currentUser
          ? { id: currentUser.id, name: currentUser.name, profileImage: currentUser.profileImage }
          : null,
      };
      queryClient.setQueryData(["post", commentData.postId], (old) => ({
        ...old,
        comments: [...(old?.comments || []), optimisticComment],
      }));
      return { previousComments };
    },
    onError: (err, variables, context) => {
      if (context?.previousComments) {
        queryClient.setQueryData(["post", variables.postId], context.previousComments);
      }
      onClose();
    },
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries(["post", variables.postId]);
      setNewComment("");
      onClose();
    },
  });

  const commentLikeMutation = useMutation({
    mutationFn: (commentId) => commentLike(postId, commentId),
    onMutate: async (commentId) => {
      await queryClient.cancelQueries(["post", postId]);
      const previousPost = queryClient.getQueryData(["post", postId]);
      queryClient.setQueryData(["post", postId], (old) => {
        if (!old) return { comments: [] };
        const updatedComments = (old.comments || []).map((comment) =>
          comment.id === commentId
            ? { ...comment, likes: (comment.likes || 0) + 1, userLiked: true }
            : comment
        );
        return { ...old, comments: updatedComments };
      });
      return { previousPost };
    },
    onError: (err, variables, context) => {
      if (context?.previousPost) {
        queryClient.setQueryData(["post", postId], context.previousPost);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries(["post", postId]);
    },
  });

  const handleComment = () => {
    if (!newComment.trim()) return;
    commentMutation.mutate({ content: newComment.trim(), userId, postId, parentId: null });
    setNewComment("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-md z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Sheet wrapper */}
          <motion.div
            className="fixed inset-0 flex items-end sm:items-center justify-center z-50 px-0 sm:px-4 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="pointer-events-auto bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border border-white/60 dark:border-slate-700/50 w-full sm:max-w-lg rounded-t-[32px] sm:rounded-[28px] shadow-2xl flex flex-col max-h-[88vh] overflow-hidden"
              initial={{ y: 80, scale: 0.97, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: 80, scale: 0.97, opacity: 0 }}
              transition={{ type: "spring", stiffness: 360, damping: 30 }}
            >
              {/* Drag handle (mobile) */}
              <div className="flex justify-center pt-3 pb-0 sm:hidden">
                <div className="w-10 h-1 bg-gray-200 dark:bg-slate-700 rounded-full" />
              </div>

              {/* ── Header ── */}
              <div className="flex items-center justify-between px-6 pt-5 pb-4">
                <div className="flex items-center gap-3">
                  {/* Glowing icon */}
                  <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center shadow-lg shadow-primary-300/50 dark:shadow-primary-900/40">
                    <MessageCircle className="w-5 h-5 text-white" />
                    <span className="absolute inset-0 rounded-2xl ring-2 ring-primary-300/40 dark:ring-primary-600/30 animate-pulse pointer-events-none" />
                  </div>

                  <div>
                    <h2 className="text-base font-bold text-gray-900 dark:text-gray-100 tracking-tight leading-none">
                      Comments
                    </h2>
                    <AnimatePresence mode="wait">
                      <motion.p
                        key={rootComments.length}
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                        className="text-[11px] font-medium text-gray-400 dark:text-gray-500 mt-0.5"
                      >
                        {rootComments.length === 0
                          ? "No comments yet"
                          : `${rootComments.length} ${rootComments.length === 1 ? "comment" : "comments"}`}
                      </motion.p>
                    </AnimatePresence>
                  </div>
                </div>

                {/* Close — rotates on hover */}
                <motion.button
                  whileHover={{ scale: 1.08, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  transition={{ duration: 0.2 }}
                  className="w-9 h-9 flex items-center justify-center rounded-2xl bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-500 dark:text-gray-400 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </div>

              {/* Gradient divider */}
              <div className="mx-6 h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-slate-700 to-transparent" />

              {/* ── Comments list ── */}
              <div className="flex-1 overflow-y-auto px-6 py-4 scrollbar-hide">
                {rootComments.length > 0 ? (
                  <motion.div
                    variants={listVariants}
                    initial="hidden"
                    animate="show"
                    className="space-y-4"
                  >
                    {rootComments.map((comment) => (
                      <CommentNode
                        key={comment.id}
                        comment={comment}
                        postId={postId}
                        userId={userId}
                        commentMutation={commentMutation}
                        commentLikeMutation={commentLikeMutation}
                      />
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.15 }}
                    className="flex flex-col items-center justify-center py-16 text-center"
                  >
                    <div className="relative w-16 h-16 mb-5">
                      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900/30 dark:to-secondary-900/30" />
                      <div className="relative flex items-center justify-center w-full h-full">
                        <MessageCircle className="w-7 h-7 text-primary-400 dark:text-primary-500" />
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">No comments yet</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Be the first to share your thoughts!</p>
                  </motion.div>
                )}
              </div>

              {/* ── Input area ── */}
              <div className="px-5 py-4 border-t border-gray-100/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm">
                <motion.div
                  animate={
                    isFocused
                      ? { boxShadow: "0 0 0 3px rgba(99,102,241,0.18)" }
                      : { boxShadow: "0 0 0 0px rgba(99,102,241,0)" }
                  }
                  transition={{ duration: 0.2 }}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-2 border transition-colors duration-200 ${
                    isFocused
                      ? "bg-white dark:bg-slate-800 border-primary-300 dark:border-primary-600"
                      : "bg-gray-50 dark:bg-slate-800/60 border-gray-200 dark:border-slate-700"
                  }`}
                >
                  <Smile className="w-5 h-5 text-gray-300 dark:text-gray-600 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Add a comment…"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleComment()}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className="flex-1 bg-transparent text-sm outline-none text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 font-medium py-1"
                  />
                  <motion.button
                    whileHover={newComment.trim() ? { scale: 1.08 } : {}}
                    whileTap={newComment.trim() ? { scale: 0.9 } : {}}
                    onClick={handleComment}
                    disabled={!newComment.trim() || commentMutation.isLoading}
                    className={`w-9 h-9 flex-shrink-0 rounded-xl flex items-center justify-center transition-all duration-200 cursor-pointer shadow-sm ${
                      newComment.trim()
                        ? "bg-gradient-to-br from-primary-500 to-primary-700 text-white"
                        : "bg-gray-100 dark:bg-slate-700 text-gray-300 dark:text-gray-600 cursor-not-allowed"
                    }`}
                  >
                    <Send className="w-4 h-4" />
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
