import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { commentOnPost, deletePost, getPostById, likePost } from "../../api";
import Button from '../UI/Button';
import Navbar from '../../pages/Navbar';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { Pencil, Trash2 } from 'lucide-react';
import DeleteModal from '../../Modal/DeleteModal';
import { useNavigate } from 'react-router-dom';
import CreatePostModal from '../../Modal/CreatePostModal';

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
  const { user } = useSelector((state) => state.auth);

  const { data: post, isLoading, isError } = useQuery({
    queryKey: ["post", postId],
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

  const handleDelete = () => {
    deletePostUser.mutate();
  }

  if (isLoading) return <div className="text-center py-16 text-gray-500 animate-pulse">⏳ Loading post...</div>;
  if (isError) return <div className="text-center py-16 text-red-500">⚠️ Error loading post.</div>;

  return (
    <>
      <Navbar />
      <div className="max-w-3xl mx-auto mt-8 bg-white shadow-2xl rounded-3xl overflow-hidden border border-gray-200">

        {/* Media */}
        <div className='relative'>
          {post?.image && (
            <motion.img
              src={"/smart.jpeg"}
              alt={post?.title}
              className="w-full h-80 object-cover cursor-pointer"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            />
          )}
          <div className="absolute top-2 right-2 flex gap-2">
            <button
              onClick={handleEdit}
              className="w-10 h-10 rounded-full cursor-pointer bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition"
              title="Edit Post"
            >
              <Pencil />
            </button>
            <button
              onClick={() => {
                setDeletePopup(!deletePopup);
              }}
              className="w-10 h-10 rounded-full cursor-pointer bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition"
              title="Delete Post"
            >
              <Trash2 />
            </button>
          </div>
        </div>
        {deletePopup && <DeleteModal isOpen={deletePopup} onClose={()=> setDeletePopup(!deletePopup)} onDelete={handleDelete}/>}
        {post?.video && !post?.image && (
          <video controls className="w-full h-80 object-cover rounded-t-3xl">
            <source src={post.video} type="video/mp4" />
          </video>
        )}

        {/* Content */}
        <div className="p-6 flex flex-col gap-4">
          <h1 className="font-bold text-2xl text-gray-800">{post?.title}</h1>
          <p className="text-gray-700 text-base">{post?.description}</p>

          {/* Likes & Comments */}
          <div className="flex justify-between items-center text-gray-600 text-sm">
            <Button
              className="flex items-center gap-2 px-3 py-1 rounded-full transition transform hover:scale-105"
              onClick={() => likeMutation.mutate()}
            >
              <motion.span
                key={userLiked ? "liked" : "notLiked"} // key changes trigger animation
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                whileTap={{ scale: 1.3 }}
                transition={{ duration: 10 }}
                className={userLiked ? "text-red-500 text-lg" : "text-gray-400 text-lg"}
              >
                {userLiked ? "❤️" : "🤍"}
              </motion.span>
              <span>{post?.post_likes?.length || 0}</span>
            </Button>

            <span>💬 {post?.comments?.length || 0} Comments</span>
          </div>

          <hr className="my-4" />

          {/* Comments Section */}
          <div className="flex flex-col gap-3 max-h-64 overflow-y-auto">
            {post?.comments?.length > 0 ? (
              post?.comments.map((comment) => (
                !comment.parentId && (
                  <motion.div
                    key={comment.id}
                    className="flex flex-col bg-gray-50 p-3 rounded-xl shadow-sm hover:shadow-md transition"
                    whileHover={{ scale: 1.02 }}
                  >
                    <span className="font-semibold text-gray-700">User {comment.userId}</span>
                    <p className="text-gray-600 text-sm">{comment.content}</p>

                    {/* Nested replies */}
                    {post?.comments.filter(c => c.parentId === comment.id).map(reply => (
                      <div key={reply.id} className="ml-6 mt-2 bg-gray-100 p-2 rounded-lg text-sm text-gray-700 shadow-inner">
                        <span className="font-semibold">User {reply.userId}</span>: {reply.content}
                      </div>
                    ))}
                  </motion.div>
                )
              ))
            ) : (
              <p className="text-gray-400 text-center py-4">No comments yet</p>
            )}
          </div>

          {/* Add Comment */}
          <div className="mt-4 flex gap-2">
            <input
              type="text"
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
            />
            <Button
              className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition transform hover:scale-105"
              disabled={!newComment.trim()}
              onClick={() => commentMutation.mutate({ content: newComment.trim() })}
            >
              Post
            </Button>
          </div>
        </div>

        { openEditModal &&
         <CreatePostModal 
            isOpen={openEditModal} 
            onClose={()=> setOpenEditModal(!openEditModal)} 
            isEditing={isEditing} 
            editedPost={editedPost}
          />}
      </div>
    </>
  );
};

export default PostDetail;