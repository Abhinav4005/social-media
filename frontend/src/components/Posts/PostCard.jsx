import { Contact, Heart, MessageCircle, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { formatTime } from "../../utils/formatTime";
import { likePost } from "../../api";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import CommentsModal from "../../Modal/CommentModal";

export default function PostCard({ post_likes = [], comments = [], ...props }) {
  const queryClient = useQueryClient();
  const { user } = useSelector((state) => state.auth);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post_likes.length);

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
    console.log("PostCard - handleLike called with postId:", props.id);
    likeMutation.mutate(props.id);
  };

  console.log("Props in PostCard:", props);

  // console.log("props", props)

  return (
    <motion.div
      whileHover={{ scale: 1.02, boxShadow: "0px 10px 25px rgba(0,0,0,0.1)" }}
      className="bg-white border border-gray-200 shadow-sm rounded-2xl p-4 mb-6 transition"
      key={props.id}
    >
      {/* User Info */}
      <div className="flex items-center gap-3 mb-3">
        {props?.user?.profileImage ? (
          <img
            src={props.user.profileImage}
            alt={props.user.name}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <img
            src={`https://ui-avatars.com/api/?name=${
              props?.user.name || "U"
            }&background=random`}
            alt={props?.user?.name}
            className="w-10 h-10 rounded-full border border-gray-200"
          />
        )}
        <div>
          <h4 className="font-semibold text-gray-800 capitalize">
            {props?.user?.name}
          </h4>
          <p className="text-xs text-gray-500">
            {formatTime(props?.createdAt)}
          </p>
        </div>
      </div>

      {/* Content */}
      <p className="text-gray-700 mb-3">{props?.title}</p>
      <p className="text-gray-700 mb-3">{props?.description}</p>

      {/* Post Image */}
      {props.image && (
        <div className="rounded-lg overflow-hidden mb-3">
          <img
            src={props?.image}
            alt="Post"
            className="w-full max-h-96 object-cover rounded-lg hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      {props?.video && (
        <div className="rounded-lg overflow-hidden mb-3">
          <video
            src={props?.video}
            alt="Post video"
            controls
            playsInline
            // muted
            className="w-full max-h-96 object-cover rounded-lg hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      {/* Actions */}

      <div className="flex gap-6 pt-3 border-t border-gray-100 mt-2">
        <div className="flex items-center gap-2">
          <button
            onClick={handleLike}
            className="text-gray-600 hover:text-red-500 cursor-pointer transition transform hover:scale-110"
          >
            <Heart
              className={`w-5 h-5 ${liked ? "fill-red-500 text-red-500" : ""}`}
            />
          </button>
          <span className="text-sm">{post_likes.length}</span>
        </div>

        <button
          className="flex items-center gap-2 text-gray-600 cursor-pointer hover:text-blue-500 transition transform hover:scale-110"
          onClick={() => setOpenCommentModal(true)}
        >
          <MessageCircle className="w-5 h-5" />
          <span className="text-sm">{comments.length}</span>
        </button>
        <button
          onClick={() => console.log("Share clicked")}
          type="button"
          color="black"
          className="flex items-center gap-2 text-gray-600 cursor-pointer shadow-none p-2 rounded-md text-sm transition transform hover:scale-110"
        >
          <Send className="w-5 h-5" />
        </button>
        <CommentsModal
          isOpen={openCommentModal}
          onClose={() => setOpenCommentModal(false)}
          comments={comments}
          userId={user?.id}
          postId={props.id}
        />
      </div>
    </motion.div>
  );
}
