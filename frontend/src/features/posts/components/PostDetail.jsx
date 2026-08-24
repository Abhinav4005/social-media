import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { commentOnPost, deletePost, getPostById, likePost, summarizeAIPost, generateAISmartReply } from "../../../api";
import { QUERY_KEYS } from "../../../constant/queryKeys";
import Button from '../../../components/UI/Button';
import Navbar from '../../../pages/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import { Pencil, Trash2, Heart, MessageCircle, Send, MoreHorizontal, ArrowLeft, Sparkles, Bot, Check, Loader2 } from 'lucide-react';
import DeleteModal from '../modals/DeleteModal';
import { useNavigate } from 'react-router-dom';
import CreatePostModal from '../modals/CreatePostModal';
import { formatTime } from '../../../utils/formatTime';
import AIUpgradeModal from '../../../components/Common/AIUpgradeModal';

const PostDetail = () => {
  const navigate = useNavigate();
  const { postId } = useParams();
  const queryClient = useQueryClient();
  const [newComment, setNewComment] = useState("");
  const [userLiked, setUserLiked] = useState(false);
  const [deletePopup, setDeletePopup] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedPost, setEditedPost] = useState({});
  const [aiSummaryModal, setAiSummaryModal] = useState(false);
  const [aiSummaryData, setAiSummaryData] = useState(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [smartReplies, setSmartReplies] = useState([]);
  const [isGeneratingReplies, setIsGeneratingReplies] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeMessage, setUpgradeMessage] = useState("");
  const { user } = useSelector((state) => state.auth);

  const { data: post, isLoading, isError } = useQuery({
    queryKey: QUERY_KEYS.post(postId),
    queryFn: () => getPostById(postId),
    enabled: !!postId,
  });

  const likeMutation = useMutation({
    mutationFn: () => likePost(postId),
    onMutate: async () => {
      await queryClient.cancelQueries(["post", postId]);
      const previousPost = queryClient.getQueryData(["post", postId]);
      queryClient.setQueryData(["post", postId], old => ({
        ...old,
        likes: old.userLiked ? old.likes - 1 : old.likes + 1,
        userLiked: !old.userLiked,
      }));
      return { previousPost };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(["post", postId], context.previousPost);
    },
    onSettled: () => {
      queryClient.invalidateQueries(["post", postId]);
    }
  });

  const commentMutation = useMutation({
    mutationFn: (commentData) => commentOnPost(postId, commentData),
    onSuccess: () => {
      queryClient.invalidateQueries(["post", postId]);
      setNewComment("");
    }
  });

  useEffect(() => {
    setUserLiked(post?.post_likes?.some(like => like.userId === user?.id));
  }, [post, user]);

  const handleEdit = () => {
    setOpenEditModal(true);
    setEditedPost(post);
    setIsEditing(true);
  }

  const deletePostUser = useMutation({
    mutationFn: () => deletePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries(['userPosts']);
      queryClient.invalidateQueries(['post', postId]);
      setDeletePopup(false);
      navigate("/profile");
    },
    onError: (error) => {
      console.error("Error deleting post:", error);
      setDeletePopup(false);
    }
  });

  const handleSummarizeThread = async () => {
    setIsSummarizing(true);
    setAiSummaryModal(true);
    try {
      const res = await summarizeAIPost({
        title: post?.title,
        description: post?.description,
        comments: post?.comments || [],
      });
      setAiSummaryData(res);
    } catch (err) {
      setAiSummaryModal(false);
      const msg = err.response?.data?.message || err.message;
      if (err.response?.status === 403 || err.response?.data?.upgradeRequired) {
        setUpgradeMessage(msg);
        setShowUpgradeModal(true);
      }
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleGenerateSmartReplies = async () => {
    setIsGeneratingReplies(true);
    try {
      const res = await generateAISmartReply({
        context: post?.description || post?.title || "Great post",
      });
      setSmartReplies(res?.replies || []);
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      if (err.response?.status === 403 || err.response?.data?.upgradeRequired) {
        setUpgradeMessage(msg);
        setShowUpgradeModal(true);
      }
    } finally {
      setIsGeneratingReplies(false);
    }
  };

  const handleDelete = () => {
    deletePostUser.mutate();
  }

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="max-w-4xl mx-auto mt-8 px-4">
          <div className="bg-white rounded-3xl shadow-xl p-8 animate-pulse">
            <div className="h-96 bg-gray-200 rounded-2xl mb-6"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </>
    );
  }

  if (isError) {
    return (
      <>
        <Navbar />
        <div className="max-w-4xl mx-auto mt-8 px-4">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
            <p className="text-red-600 text-lg font-semibold">⚠️ Error loading post</p>
            <button
              onClick={() => navigate(-1)}
              className="mt-4 px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition cursor-pointer"
            >
              Go Back
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto mt-8 mb-10 px-4">
        <motion.button
          whileHover={{ x: -4 }}
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-primary-600 mb-6 font-medium transition cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow-2xl rounded-3xl overflow-hidden border border-gray-100"
        >
          {/* Post Header */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  {post?.user?.profileImage ? (
                    <img
                      src={post.user.profileImage}
                      alt={post.user.name}
                      className="w-14 h-14 rounded-full object-cover ring-2 ring-primary-100"
                    />
                  ) : (
                    <img
                      src={`https://ui-avatars.com/api/?name=${post?.user?.name || "U"}&background=random`}
                      alt={post?.user?.name}
                      className="w-14 h-14 rounded-full border-2 border-gray-200"
                    />
                  )}
                  <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full ring-2 ring-white"></span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 capitalize text-lg">
                    {post?.user?.name || "Unknown User"}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {formatTime(post?.createdAt)}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              {user?.id === post?.userId && (
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleEdit}
                    className="p-2 rounded-xl bg-primary-50 text-primary-600 hover:bg-primary-100 transition cursor-pointer"
                    title="Edit Post"
                  >
                    <Pencil className="w-5 h-5" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setDeletePopup(true)}
                    className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition cursor-pointer"
                    title="Delete Post"
                  >
                    <Trash2 className="w-5 h-5" />
                  </motion.button>
                </div>
              )}
            </div>
          </div>

          {/* Media */}
          {post?.image && (
            <div className="relative bg-gray-100">
              <motion.img
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.4 }}
                src={post?.image}
                alt={post?.title}
                className="w-full aspect-video object-cover cursor-pointer"
              />
            </div>
          )}

          {post?.video && !post?.image && (
            <div className="relative bg-gray-100">
              <video controls className="w-full aspect-video object-cover">
                <source src={post?.video} type="video/mp4" />
              </video>
            </div>
          )}

          {/* Content */}
          <div className="p-6">
            {post?.title && (
              <h1 className="font-bold text-3xl text-gray-900 mb-4">
                {post?.title}
              </h1>
            )}
            {post?.description && (
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                {post?.description}
              </p>
            )}

            {/* Engagement Stats */}
            <div className="flex items-center justify-between py-4 border-y border-gray-100 mb-4">
              <div className="flex items-center gap-4">
                {post?.post_likes?.length > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      <span className="w-7 h-7 bg-red-500 rounded-full flex items-center justify-center text-white text-sm">
                        ❤️
                      </span>
                    </div>
                    <span className="text-sm text-gray-600 font-medium">
                      {post?.post_likes?.length} {post?.post_likes?.length === 1 ? 'like' : 'likes'}
                    </span>
                  </div>
                )}
              </div>
              <div className="text-sm text-gray-600">
                {post?.comments?.length || 0} {post?.comments?.length === 1 ? 'comment' : 'comments'}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 mb-6">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => likeMutation.mutate()}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl cursor-pointer font-semibold transition-all ${userLiked
                  ? "bg-red-50 text-red-600"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={userLiked ? "liked" : "unliked"}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    <Heart className={`w-5 h-5 ${userLiked ? "fill-red-600" : ""}`} />
                  </motion.div>
                </AnimatePresence>
                <span>{userLiked ? "Liked" : "Like"}</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleGenerateSmartReplies}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl cursor-pointer font-semibold bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-all border border-indigo-100"
              >
                <Sparkles className="w-5 h-5 text-indigo-600" />
                <span>AI Smart Reply</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleSummarizeThread}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl cursor-pointer font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/20 hover:opacity-95 transition-all"
              >
                <Bot className="w-5 h-5" />
                <span>Summarize</span>
              </motion.button>
            </div>

            {/* Smart Reply Suggestion Chips */}
            {smartReplies.length > 0 && (
              <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="mb-4 p-3 bg-indigo-50/70 border border-indigo-100 rounded-2xl">
                <div className="flex items-center gap-2 mb-2 text-xs font-bold text-indigo-700">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>✨ AI Suggested Replies (Click to auto-fill)</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {smartReplies.map((replyText, idx) => (
                    <button
                      key={idx}
                      onClick={() => setNewComment(replyText)}
                      className="px-3 py-1.5 bg-white hover:bg-indigo-100 border border-indigo-200 text-xs font-medium text-indigo-900 rounded-xl transition cursor-pointer shadow-2xs"
                    >
                      {replyText}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Comments Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-primary-600" />
                Comments
              </h2>

              {/* Add Comment */}
              <div className="flex gap-3 items-start">
                <div className="relative flex-shrink-0">
                  {user?.profileImage ? (
                    <img
                      src={user?.profileImage}
                      alt={user?.name}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-primary-100"
                    />
                  ) : (
                    <img
                      src={`https://ui-avatars.com/api/?name=${user?.name || "U"}&background=random`}
                      alt={user?.name}
                      className="w-10 h-10 rounded-full border-2 border-gray-200"
                    />
                  )}
                </div>
                <div className="flex-1 flex gap-2">
                  <input
                    type="text"
                    placeholder="Write a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && newComment.trim()) {
                        commentMutation.mutate({ content: newComment.trim() });
                      }
                    }}
                    className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={!newComment.trim()}
                    onClick={() => commentMutation.mutate({ content: newComment.trim() })}
                    className="px-5 py-3 rounded-xl font-semibold text-white transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    style={{ background: newComment.trim() ? 'var(--gradient-vibrant)' : '#9ca3af' }}
                  >
                    <Send className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>

              {/* Comments List */}
              <div className="space-y-4 max-h-[500px] overflow-y-auto">
                {post?.comments?.length > 0 ? (
                  post?.comments.map((comment) => (
                    !comment.parentId && (
                      <motion.div
                        key={comment.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex gap-3 items-start"
                      >
                        <div className="relative flex-shrink-0">
                          <img
                            src={`https://ui-avatars.com/api/?name=User${comment.userId}&background=random`}
                            alt="User"
                            className="w-10 h-10 rounded-full border-2 border-gray-200"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="bg-gray-50 rounded-2xl px-4 py-3">
                            <p className="font-semibold text-gray-900 text-sm mb-1">
                              User {comment.userId}
                            </p>
                            <p className="text-gray-700 text-sm leading-relaxed">
                              {comment.content}
                            </p>
                          </div>
                          <div className="flex items-center gap-4 mt-2 px-4">
                            <button className="text-xs text-gray-500 hover:text-primary-600 font-medium transition cursor-pointer">
                              Like
                            </button>
                            <button className="text-xs text-gray-500 hover:text-primary-600 font-medium transition cursor-pointer">
                              Reply
                            </button>
                            <span className="text-xs text-gray-400">
                              {formatTime(comment.createdAt)}
                            </span>
                          </div>

                          {/* Nested replies */}
                          {post?.comments.filter(c => c.parentId === comment.id).length > 0 && (
                            <div className="mt-3 space-y-3">
                              {post?.comments.filter(c => c.parentId === comment.id).map(reply => (
                                <div key={reply.id} className="flex gap-3 items-start">
                                  <img
                                    src={`https://ui-avatars.com/api/?name=User${reply.userId}&background=random`}
                                    alt="User"
                                    className="w-8 h-8 rounded-full border-2 border-gray-200"
                                  />
                                  <div className="flex-1">
                                    <div className="bg-gray-100 rounded-2xl px-4 py-3">
                                      <p className="font-semibold text-gray-900 text-sm mb-1">
                                        User {reply.userId}
                                      </p>
                                      <p className="text-gray-700 text-sm leading-relaxed">
                                        {reply.content}
                                      </p>
                                    </div>
                                    <div className="flex items-center gap-4 mt-2 px-4">
                                      <button className="text-xs text-gray-500 hover:text-primary-600 font-medium transition">
                                        Like
                                      </button>
                                      <span className="text-xs text-gray-400">
                                        {formatTime(reply.createdAt)}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )
                  ))
                ) : (
                  <div className="text-center py-12">
                    <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-400 font-medium">No comments yet</p>
                    <p className="text-gray-400 text-sm">Be the first to comment!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {deletePopup && (
          <DeleteModal
            isOpen={deletePopup}
            onClose={() => setDeletePopup(false)}
            onDelete={handleDelete}
          />
        )}

        {openEditModal && (
          <CreatePostModal
            isOpen={openEditModal}
            onClose={() => setOpenEditModal(false)}
            isEditing={isEditing}
            editedPost={editedPost}
          />
        )}

        {aiSummaryModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-indigo-100">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">✨ AI Thread Summary</h3>
                    <p className="text-xs text-gray-500">Gemini-powered insights</p>
                  </div>
                </div>
                <button onClick={() => setAiSummaryModal(false)} className="text-gray-400 hover:text-gray-600 font-bold p-1 cursor-pointer">✕</button>
              </div>

              <div className="py-5 space-y-4">
                {isSummarizing ? (
                  <div className="flex flex-col items-center justify-center py-8 space-y-3">
                    <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                    <p className="text-xs font-semibold text-gray-500 animate-pulse">Analyzing post & comments...</p>
                  </div>
                ) : (
                  <>
                    <div className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-extrabold rounded-full border border-emerald-200">
                      Overall Sentiment: {aiSummaryData?.sentiment || "Positive"}
                    </div>
                    <div className="space-y-2">
                      {aiSummaryData?.summary?.map((bullet, idx) => (
                        <div key={idx} className="p-3 bg-gray-50 rounded-2xl text-xs font-medium text-gray-800 border border-gray-100 leading-relaxed">
                          {bullet}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>

              <button
                onClick={() => setAiSummaryModal(false)}
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
              >
                Close Summary
              </button>
            </motion.div>
          </div>
        )}

        <AIUpgradeModal
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          message={upgradeMessage}
        />
      </div>
    </>
  );
};

export default PostDetail;
