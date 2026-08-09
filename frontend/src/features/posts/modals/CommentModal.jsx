import { useState } from "react";
import { X, Heart, CornerDownLeft, Send, MessageCircle, Smile } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { commentLike, commentOnPost } from "../../../api";

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

const listVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 350, damping: 26 } },
};

export default function CommentsModal({ isOpen, onClose, comments = [], userId, postId, currentUser }) {
  const queryClient = useQueryClient();
  const [text, setText] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);

  const commentMutation = useMutation({
    mutationFn: (commentData) => commentOnPost(postId, commentData),
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"]);
      queryClient.invalidateQueries(["post", postId]);
      queryClient.invalidateQueries(["feedPosts"]);
      setText("");
      setReplyingTo(null);
    },
    onError: (err) => console.error("Comment failed:", err),
  });

  const likeMutation = useMutation({
    mutationFn: (commentId) => commentLike(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"]);
      queryClient.invalidateQueries(["post", postId]);
      queryClient.invalidateQueries(["feedPosts"]);
    },
  });

  if (!isOpen) return null;

  const handleSend = () => {
    if (!text.trim()) return;
    commentMutation.mutate({
      content: text.trim(),
      parentId: replyingTo ? replyingTo.id : null,
    });
  };

  const topLevelComments = comments.filter((c) => !c.parentId);

  const getReplies = (parentId) => comments.filter((c) => c.parentId === parentId);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/70 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ type: "spring", stiffness: 340, damping: 28 }}
          className="relative w-full max-w-lg overflow-hidden rounded-[28px] bg-white shadow-2xl shadow-indigo-500/10 border border-gray-100 dark:bg-slate-900 dark:border-slate-800 flex flex-col max-h-[85vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-gray-900 dark:text-white text-base leading-tight">
                  Comments
                </h3>
                <p className="text-xs text-gray-400 font-medium mt-0.5">
                  {comments.length} {comments.length === 1 ? "thought" : "thoughts"} shared
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </div>

          {/* Comment list */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 scrollbar-hide">
            {topLevelComments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center mb-3">
                  <Smile className="w-7 h-7 text-indigo-400" />
                </div>
                <p className="text-sm font-bold text-gray-700 dark:text-gray-300">No comments yet</p>
                <p className="text-xs text-gray-400 mt-1 font-medium max-w-[200px]">
                  Be the first to start the conversation!
                </p>
              </div>
            ) : (
              <motion.div variants={listVariants} initial="hidden" animate="show" className="space-y-4">
                {topLevelComments.map((comment) => (
                  <CommentItem
                    key={comment.id}
                    comment={comment}
                    replies={getReplies(comment.id)}
                    userId={userId}
                    onReply={(c) => setReplyingTo(c)}
                    onLike={(id) => likeMutation.mutate(id)}
                  />
                ))}
              </motion.div>
            )}
          </div>

          {/* Footer input */}
          <div className="p-4 border-t border-gray-100 dark:border-slate-800 bg-gray-50/70 dark:bg-slate-900/90 backdrop-blur-md">
            <AnimatePresence>
              {replyingTo && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: "auto", marginBottom: 8 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-xs font-semibold text-indigo-600 dark:text-indigo-400 overflow-hidden"
                >
                  <span className="truncate">
                    Replying to <span className="font-extrabold">@{replyingTo.user?.name || `User ${replyingTo.userId}`}</span>
                  </span>
                  <button
                    onClick={() => setReplyingTo(null)}
                    className="ml-2 hover:text-indigo-800 dark:hover:text-indigo-200 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center gap-2">
              <div className="relative flex-1 flex items-center">
                <input
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                  placeholder={replyingTo ? `Reply to ${replyingTo.user?.name || "user"}...` : "Write a comment..."}
                  className="w-full bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 text-xs font-semibold rounded-2xl pl-4 pr-10 py-3 border border-gray-200/80 dark:border-slate-700 outline-none focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                />
                <CornerDownLeft className="absolute right-3.5 w-4 h-4 text-gray-300 dark:text-gray-600 pointer-events-none" />
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSend}
                disabled={!text.trim() || commentMutation.isPending}
                className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white shadow-md shadow-indigo-500/25 transition-all cursor-pointer"
              >
                {commentMutation.isPending ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

function CommentItem({ comment, replies = [], userId, onReply, onLike }) {
  const isLiked = comment.likes?.some((l) => l.userId === userId);
  const likeCount = comment.likes?.length || 0;
  const userName = comment.user?.name || `User ${comment.userId}`;
  const [gFrom, gTo] = getGradient(userName);

  return (
    <motion.div variants={itemVariants} className="group space-y-2">
      <div className="flex items-start gap-3">
        {/* Avatar */}
        {comment.user?.profileImage ? (
          <img
            src={comment.user.profileImage}
            alt={userName}
            className="w-8 h-8 rounded-full object-cover flex-shrink-0 ring-2 ring-indigo-500/20"
          />
        ) : (
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-white flex-shrink-0 shadow-xs"
            style={{ background: `linear-gradient(135deg, ${gFrom}, ${gTo})` }}
          >
            {userName[0]?.toUpperCase()}
          </div>
        )}

        {/* Bubble */}
        <div className="flex-1 min-w-0">
          <div className="bg-gray-50 dark:bg-slate-800/80 rounded-2xl px-4 py-2.5 border border-gray-100/80 dark:border-slate-800">
            <p className="text-xs font-extrabold text-gray-900 dark:text-white truncate">
              {userName}
            </p>
            <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mt-0.5 leading-relaxed break-words">
              {comment.content}
            </p>
          </div>

          {/* Action row */}
          <div className="flex items-center gap-3 mt-1 px-2 text-[11px] font-bold text-gray-400">
            <button
              onClick={() => onLike(comment.id)}
              className={`flex items-center gap-1 transition-colors ${isLiked ? "text-rose-500" : "hover:text-gray-600 dark:hover:text-gray-200"}`}
            >
              <Heart className={`w-3 h-3 ${isLiked ? "fill-rose-500 text-rose-500" : ""}`} />
              {likeCount > 0 && <span>{likeCount}</span>}
            </button>

            <button
              onClick={() => onReply(comment)}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              Reply
            </button>
          </div>
        </div>
      </div>

      {/* Nested Replies */}
      {replies.length > 0 && (
        <div className="ml-11 pl-3 border-l-2 border-indigo-100 dark:border-slate-800 space-y-2">
          {replies.map((reply) => {
            const replyName = reply.user?.name || `User ${reply.userId}`;
            const [rgFrom, rgTo] = getGradient(replyName);
            const replyLiked = reply.likes?.some((l) => l.userId === userId);
            return (
              <div key={reply.id} className="flex items-start gap-2.5">
                {reply.user?.profileImage ? (
                  <img
                    src={reply.user.profileImage}
                    alt={replyName}
                    className="w-6 h-6 rounded-full object-cover flex-shrink-0"
                  />
                ) : (
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black text-white flex-shrink-0"
                    style={{ background: `linear-gradient(135deg, ${rgFrom}, ${rgTo})` }}
                  >
                    {replyName[0]?.toUpperCase()}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="bg-gray-50/80 dark:bg-slate-800/60 rounded-xl px-3 py-2 border border-gray-100/60 dark:border-slate-800">
                    <p className="text-[11px] font-extrabold text-gray-900 dark:text-white truncate">
                      {replyName}
                    </p>
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-300 mt-0.5 leading-relaxed break-words">
                      {reply.content}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 mt-0.5 px-2 text-[10px] font-bold text-gray-400">
                    <button
                      onClick={() => onLike(reply.id)}
                      className={`flex items-center gap-1 transition-colors ${replyLiked ? "text-rose-500" : "hover:text-gray-600"}`}
                    >
                      <Heart className={`w-2.5 h-2.5 ${replyLiked ? "fill-rose-500 text-rose-500" : ""}`} />
                      {reply.likes?.length > 0 && <span>{reply.likes.length}</span>}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
