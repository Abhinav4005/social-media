import { useState } from "react";
import { X, Heart, CornerDownLeft, Send, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { commentLike, commentOnPost } from "../api";

export default function CommentsModal({ isOpen, onClose, comments = [], userId, postId }) {
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const queryClient = useQueryClient();

  const commentMutation = useMutation({
    mutationFn: (commentData) => commentOnPost(postId, commentData),
    onMutate: async (commentData) => {
      await queryClient.cancelQueries(["post", commentData.postId]);
      const previousComments = queryClient.getQueryData(["post", commentData.postId]);
      queryClient.setQueryData(["post", commentData.postId], (old) => ({
        ...old,
        comments: [...(old?.comments || []), { ...commentData, replies: [] }],
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
      setReplyingTo(null);
      onClose();
    }
  });

  const commentLikeMutation = useMutation({
    mutationFn: (commentId) => commentLike(postId, commentId),
    onMutate: async (commentId) => {
      await queryClient.cancelQueries(["post", postId]);
      const previousPost = queryClient.getQueryData(["post", postId]);
      queryClient.setQueryData(["post", postId], (old) => {
        if (!old) return { comments: [] };
        const updatedComments = (old.comments || []).map(comment => {
          if (comment.id === commentId) {
            return { ...comment, likes: comment.likes ? comment.likes + 1 : 1, userLiked: true };
          }
          return comment;
        });
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
    }
  });

  const handleComment = (parentId = null) => {
    if (!newComment.trim()) return;
    commentMutation.mutate({ content: newComment.trim(), userId, postId, parentId });
    setNewComment("");
    setReplyingTo(null);
  };

  const CommentNode = ({ comment, depth = 0 }) => {
    const [showReplyInput, setShowReplyInput] = useState(false);
    const [replyText, setReplyText] = useState("");

    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex gap-3 ${depth > 0 ? "ml-10 mt-2" : ""}`}
      >
        {/* Avatar */}
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-secondary-500 flex items-center justify-center text-white text-xs font-black shadow-sm">
          {String(comment.userId).slice(-1)}
        </div>

        <div className="flex-1 min-w-0">
          {/* Bubble */}
          <div className="bg-gray-50 rounded-2xl rounded-tl-sm px-4 py-3 inline-block max-w-full">
            <p className="text-xs font-black text-gray-700 mb-0.5">User {comment.userId}</p>
            <p className="text-sm text-gray-600 leading-relaxed">{comment.content}</p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 mt-1.5 ml-1">
            <button
              onClick={() => commentLikeMutation.mutate(comment.id)}
              className={`flex items-center gap-1 text-xs font-bold transition-colors cursor-pointer ${comment.userLiked ? "text-rose-500" : "text-gray-400 hover:text-rose-500"}`}
            >
              <Heart className={`w-3.5 h-3.5 ${comment.userLiked ? "fill-rose-500" : ""}`} />
              {comment.likes > 0 && <span>{comment.likes}</span>}
              Like
            </button>
            {depth === 0 && (
              <button
                onClick={() => setShowReplyInput(!showReplyInput)}
                className="flex items-center gap-1 text-xs font-bold text-gray-400 hover:text-primary-500 transition-colors cursor-pointer"
              >
                <CornerDownLeft className="w-3.5 h-3.5" />
                Reply
              </button>
            )}
          </div>

          {/* Reply input */}
          <AnimatePresence>
            {showReplyInput && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex gap-2 mt-2"
              >
                <input
                  type="text"
                  placeholder="Write a reply..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && replyText.trim()) {
                      commentMutation.mutate({ content: replyText.trim(), userId, postId, parentId: comment.id });
                      setReplyText("");
                      setShowReplyInput(false);
                    }
                  }}
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary-300 focus:bg-white transition-all"
                />
                <button
                  onClick={() => {
                    if (replyText.trim()) {
                      commentMutation.mutate({ content: replyText.trim(), userId, postId, parentId: comment.id });
                      setReplyText("");
                      setShowReplyInput(false);
                    }
                  }}
                  className="w-9 h-9 bg-primary-600 text-white rounded-xl flex items-center justify-center hover:bg-primary-700 transition-colors cursor-pointer shadow-sm"
                >
                  <Send className="w-4 h-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Nested replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-2 space-y-2">
              {comment.replies.map((reply) => (
                <CommentNode key={reply.id} comment={reply} depth={depth + 1} />
              ))}
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed inset-0 flex items-end sm:items-center justify-center z-50 px-0 sm:px-4"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ type: "spring", stiffness: 340, damping: 28 }}
          >
            <div className="bg-white w-full sm:max-w-lg rounded-t-[32px] sm:rounded-[32px] shadow-[0_-20px_60px_-10px_rgba(0,0,0,0.15)] sm:shadow-[0_40px_80px_-16px_rgba(0,0,0,0.2)] flex flex-col max-h-[85vh]">

              {/* Drag handle (mobile) */}
              <div className="flex justify-center pt-3 pb-1 sm:hidden">
                <div className="w-10 h-1 bg-gray-200 rounded-full" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center shadow-md shadow-primary-200">
                    <MessageCircle className="w-4.5 h-4.5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-base font-black text-gray-900 tracking-tight">Comments</h2>
                    <p className="text-[11px] font-bold text-gray-400">{comments.length} {comments.length === 1 ? "comment" : "comments"}</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Comments list */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                {comments.length > 0 ? (
                  comments.map(comment => (
                    <CommentNode key={comment.id} comment={comment} />
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
                      <MessageCircle className="w-7 h-7 text-gray-300" />
                    </div>
                    <p className="text-sm font-bold text-gray-500">No comments yet</p>
                    <p className="text-xs text-gray-400 mt-1">Be the first to share your thoughts</p>
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="px-6 py-4 border-t border-gray-100 bg-white rounded-b-[32px]">
                <div className="flex items-center gap-3 bg-gray-50 rounded-2xl px-4 py-2 border border-gray-200 focus-within:border-primary-300 focus-within:bg-white transition-all">
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleComment()}
                    className="flex-1 bg-transparent text-sm outline-none text-gray-700 placeholder-gray-400 font-medium py-1"
                  />
                  <motion.button
                    whileHover={newComment.trim() ? { scale: 1.05 } : {}}
                    whileTap={newComment.trim() ? { scale: 0.95 } : {}}
                    onClick={() => handleComment()}
                    disabled={!newComment.trim() || commentMutation.isLoading}
                    className="w-9 h-9 flex-shrink-0 bg-primary-600 text-white rounded-xl flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary-700 transition-colors cursor-pointer shadow-sm"
                  >
                    <Send className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
