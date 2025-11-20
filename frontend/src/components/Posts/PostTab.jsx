import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ThumbsUp } from 'lucide-react';

const PostTab = ({ posts, isLoading, isError }) => {
    const navigate = useNavigate();
    const renderComments = (comments, parentId = null, level = 0) => {
        return comments
          .filter((c) => c.parentId === parentId)
          .map((c) => (
            <div key={c.id} className={`text-sm text-gray-600 mb-2 pl-${level * 4}`}>
              <span className="font-semibold">User {c.userId}:</span> {c.content}
              {renderComments(comments, c.id, level + 1)}
            </div>
          ));
      };
      
    return (
        <>
            {isLoading && (
                <p className="text-center text-gray-500 py-8 animate-pulse text-lg">Loading posts...</p>
            )}
            {isError && (
                <p className="text-center text-red-500 py-8 text-lg">Failed to load posts</p>
            )}
            {posts?.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                    {posts.map((post) => (
                        <div
                            key={post.id}
                            className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden flex flex-col cursor-pointer"
                            onClick={() => navigate(`/posts/${post.id}`)}
                        >
                            {post.image && (
                                <img
                                    src={post?.image != null ? post?.image : "/smart.jpeg"}
                                    alt={post.title}
                                    className="w-full h-56 object-cover"
                                />
                            )}
                            <div className="p-5 flex flex-col flex-1">
                                <h3 className="font-bold text-lg mb-2 line-clamp-2">{post.title}</h3>
                                <p className="text-gray-700 text-sm flex-1 line-clamp-3">{post.description}</p>

                                <div className="mt-4 flex justify-between items-center text-gray-500 text-sm">
                                    <button className="flex items-center gap-1 hover:text-blue-500 transition-colors">
                                    <ThumbsUp /> <span>{post?.post_likes?.length}</span>
                                    </button>
                                    <button className="flex items-center gap-1 hover:text-blue-500 transition-colors">
                                        💬 <span>{post?.comments?.length}</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-400 py-8 text-lg">🙅 No posts found</p>
            )}
        </>
    )
}

export default PostTab