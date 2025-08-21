import { useState } from "react";
import { X, Heart, CornerDownLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { commentLike, commentOnPost, getCommentLikes } from "../api";

export default function CommentsModal({ isOpen, onClose, comments = [], userId, postId }) {
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [userLiked, setUserLiked] = useState(false);
  const [likeError, setLikeError] = useState(null);
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
    mutationFn: (commentId) => commentLike(postId, commentId ),
    onMutate: async (commentId) => {
      await queryClient.cancelQueries(["post", postId]);
      const previousPost = queryClient.getQueryData(["post", postId]);
      // queryClient.setQueryData(["post", postId], (old) => {
      //   const updatedComments = old.comments.map(comment => {
      //     if(comment.id === commentId) {
      //       return {
      //         ...comment, 
      //         likes: comment.likes ? comment.likes + 1 : 1,
      //         userLiked: true
      //       };
      //     }
      //     return comment;
      //   });
      //   return { ...old, comments: updatedComments };
      // });
      queryClient.setQueryData(["post", postId], (old) => {
        if (!old) return { comments: [] }; // fallback agar data na mile
      
        const updatedComments = (old.comments || []).map(comment => {
          if (comment.id === commentId) {
            return {
              ...comment,
              likes: comment.likes ? comment.likes + 1 : 1,
              userLiked: true
            };
          }
          return comment;
        });
      
        return { ...old, comments: updatedComments };
      });
      
      return { previousPost };
    },
    onError: (err, variables, context) => {
      console.error("Error liking comment:", err);
      if(context?.previousPost) {
        queryClient.setQueryData(["post", postId], context.previousPost);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries(["post", postId]);
      setNewComment("");
      setReplyingTo(null);
    }
  })

  // const { data: commentLikes, isLoading: isCommentLikesLoading } = useQuery({
  //   queryKey: ["commentLikes", postId],
  //   queryFn: (commentId) => getCommentLikes(postId, commentId),
  //   enabled: !!postId,
  //   onSuccess: (data) => {
  //     setUserLiked(data.some(like => like.userId === userId));
  //   },
  //   onError: (error) => {
  //     setLikeError("Failed to fetch comment likes");
  //     console.error("Error fetching comment likes:", error);
  //   }
  // });

  const handleComment = (parentId = null) => {
    if (!newComment.trim()) return;
    commentMutation.mutate({ content: newComment.trim(), userId, postId, parentId });
    setNewComment("");
    setReplyingTo(null);
  }

  // Recursive component to render comments and nested replies
  const CommentNode = ({ comment }) => {
    const [showReplyInput, setShowReplyInput] = useState(false);

    return (
      <div className="flex flex-col gap-2 bg-gray-50 p-3 rounded-2xl shadow-sm hover:shadow-md transition">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-semibold text-white">
            {`U${comment.userId}`}
          </div>

          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-700">User {comment.userId}</p>
            <p className="text-gray-600 text-sm">{comment.content}</p>

            {/* Like & Reply buttons */}
            <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
              <button 
              className="flex items-center gap-1 hover:text-blue-500 cursor-pointer transition"
              onClick={() => commentLikeMutation.mutate(postId, comment.id)}>
                <Heart size={14} /> Like
              </button>
              <button
                className="flex items-center gap-1 hover:text-blue-500 transition"
                onClick={() => setShowReplyInput(!showReplyInput)}
              >
                <CornerDownLeft size={14} /> Reply
              </button>
            </div>

            {/* Reply input */}
            {showReplyInput && (
              <div className="flex gap-2 mt-2">
                <input
                  type="text"
                  placeholder="Write a reply..."
                  value={replyingTo === comment.id ? newComment : ""}
                  onChange={(e) => { setNewComment(e.target.value); setReplyingTo(comment.id); }}
                  className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-inner"
                />
                <button
                  className="bg-blue-500 text-white px-3 py-1 rounded-full hover:bg-blue-600 transition shadow"
                  onClick={() => handleComment(comment.id)}
                  disabled={!newComment.trim() || replyingTo !== comment.id}
                >
                  Post
                </button>
              </div>
            )}

            {/* Nested replies */}
            {comment.replies && comment.replies.length > 0 && (
              <div className="ml-6 mt-2 space-y-2">
                {comment.replies.map((reply) => (
                  <CommentNode key={reply.id} comment={reply} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/40 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 px-4"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <div className="bg-white w-full max-w-md rounded-3xl shadow-xl flex flex-col">

              {/* Header */}
              <div className="flex justify-between items-center p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold">Comments</h2>
                <button onClick={onClose} className="p-1 text-gray-500 hover:text-gray-800">
                  <X size={20} />
                </button>
              </div>

              {/* Comments List */}
              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 max-h-96">
                {comments.length > 0 ? (
                  comments.map(comment => (
                    <CommentNode key={comment.id} comment={comment} />
                  ))
                ) : (
                  <p className="text-gray-400 text-center py-4">No comments yet</p>
                )}
              </div>

              {/* Add new comment */}
              <div className="flex items-center gap-2 border-t border-gray-200 p-4">
                <input
                  type="text"
                  placeholder="Write a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-inner"
                />
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition shadow"
                  onClick={() => commentMutation.mutate({ content: newComment.trim(), postId })}
                  disabled={!newComment.trim()}
                >
                  Post
                </button>
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
