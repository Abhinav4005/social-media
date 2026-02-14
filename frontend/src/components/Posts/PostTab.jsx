import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ThumbsUp, MessageCircle, Plus } from 'lucide-react';
import { useState } from 'react';
import CreatePostModal from '../../Modal/CreatePostModal';
import { motion } from 'framer-motion';

const PostTab = ({ posts, isLoading, isError }) => {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const navigate = useNavigate();

    return (
        <div className="w-full">
            {isLoading && (
                <div className="flex flex-col items-center justify-center py-20 animate-pulse">
                    <div className="w-12 h-12 bg-indigo-100/50 rounded-full mb-4"></div>
                    <p className="text-gray-400 font-extrabold text-sm uppercase tracking-[0.2em] opacity-80">Gathering your stories...</p>
                </div>
            )}

            {isError && (
                <div className="text-center py-20 bg-red-50/50 rounded-[32px] border border-red-100">
                    <p className="text-red-500 font-black text-2xl tracking-tighter mb-2">Something went wrong</p>
                    <p className="text-red-400/80 font-medium">We couldn't load your posts. Please try again later.</p>
                </div>
            )}

            {!isLoading && !isError && posts?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {posts.map((post, index) => (
                        <motion.div
                            key={post.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ y: -8 }}
                            className="group bg-white/60 backdrop-blur-xl rounded-[32px] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] border border-white transition-all duration-500 overflow-hidden flex flex-col cursor-pointer"
                            onClick={() => navigate(`/posts/${post.id}`)}
                        >
                            <div className="relative h-64 overflow-hidden">
                                <img
                                    src={post?.image || "/smart.jpeg"}
                                    alt={post.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            </div>

                            <div className="p-8 flex flex-col flex-1">
                                <h3 className="font-extrabold text-2xl text-gray-900 mb-3 line-clamp-1 group-hover:text-indigo-600 transition-colors tracking-tight">
                                    {post.title}
                                </h3>
                                <p className="text-gray-500/90 text-sm leading-relaxed mb-6 line-clamp-2">
                                    {post.description}
                                </p>

                                <div className="mt-auto pt-6 border-t border-gray-100/60 flex items-center gap-6">
                                    <div className="flex items-center gap-2 text-indigo-600 font-black text-xs uppercase tracking-widest">
                                        <div className="p-2 bg-indigo-50 rounded-xl">
                                            <ThumbsUp className="w-4 h-4" />
                                        </div>
                                        <span>{post?.post_likes?.length || 0}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-purple-600 font-black text-xs uppercase tracking-widest">
                                        <div className="p-2 bg-purple-50 rounded-xl">
                                            <MessageCircle className="w-4 h-4" />
                                        </div>
                                        <span>{post?.comments?.length || 0}</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : !isLoading && !isError && (
                <div className="flex flex-col items-center justify-center py-24 px-4 bg-gray-50/50 rounded-[40px] border border-dashed border-gray-200">
                    <div className="w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center mb-8 rotate-3">
                        <Plus className="w-10 h-10 text-gray-300" />
                    </div>
                    <p className="text-gray-300 font-black text-xl uppercase tracking-[0.2em] mb-8 italic opacity-60">No echoes found</p>
                    <motion.button
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-10 py-5 bg-gray-900 text-white font-black rounded-2xl shadow-2xl shadow-gray-200 hover:bg-black transition-all cursor-pointer flex items-center gap-3 uppercase tracking-widest text-xs"
                        onClick={() => setIsCreateOpen(true)}
                    >
                        Create First Memory
                    </motion.button>
                    {isCreateOpen &&
                        <CreatePostModal
                            isOpen={isCreateOpen}
                            onClose={() => setIsCreateOpen(false)}
                        />
                    }
                </div>
            )}
        </div>
    )
}

export default PostTab