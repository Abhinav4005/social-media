import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import Navbar from "../../pages/Navbar";
import { createOrGetRoom, followUser, getUserById } from "../../api";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  UserPlus, UserMinus, MessageSquare,
  Heart, MapPin, Calendar, ImageIcon, Globe, Share2
} from "lucide-react";

const getInitials = (name = "") =>
  name.split(" ").map((n) => n[0]?.toUpperCase()).slice(0, 2).join("");

const FriendsDetail = () => {
    const { user: currentUser } = useSelector((state) => state.auth);
    const { userId } = useParams();
    const navigate = useNavigate();
    const [isFollower, setIsFollower] = useState(false);

    const { data: user, isLoading, isError } = useQuery({
        queryKey: ["userDetail", userId],
        queryFn: ({ queryKey }) => {
            const [_key, id] = queryKey;
            return getUserById({ userId: id });
        },
        enabled: !!userId,
    });

    useEffect(() => {
        user?.followers?.forEach(follower => {
            if (follower.followerId === currentUser?.id) setIsFollower(true);
        });
    }, [userId, user?.followers]);

    const messageMutation = useMutation({
        mutationFn: () => createOrGetRoom(null, "DM", [userId]),
        onSuccess: (room) => navigate(`/chat/${room?.id}`),
        onError: (err) => console.error("Room creation failed:", err),
    });

    const followMutation = useMutation({
        mutationFn: (followingId) => followUser(followingId),
        onMutate: () => setIsFollower((prev) => !prev),
    });

    // ── Loading shimmer ──────────────────────────────────────────────
    if (isLoading) return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100/70 via-indigo-50/40 to-purple-50/30 flex flex-col">
            <Navbar />
            <main className="max-w-4xl mx-auto w-full pt-8 pb-20 px-4 flex-1">
                <div className="bg-white/90 rounded-[40px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] overflow-hidden border border-white/40 animate-pulse">
                    <div className="h-52 bg-gray-200/60" />
                    <div className="px-12 pb-10">
                        <div className="flex items-end gap-6 pt-4 pl-40">
                            <div className="flex-1 space-y-3">
                                <div className="h-7 w-48 rounded-xl bg-gray-200/70" />
                                <div className="h-4 w-32 rounded-lg bg-gray-100" />
                            </div>
                            <div className="flex gap-3">
                                <div className="h-10 w-28 rounded-2xl bg-primary-200/40" />
                                <div className="h-10 w-10 rounded-2xl bg-green-200/40" />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );

    if (isError || !user) return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100/70 via-indigo-50/40 to-purple-50/30 flex flex-col">
            <Navbar />
            <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-2xl font-bold text-gray-800 mb-2">User Not Found</p>
                    <p className="text-gray-500 text-sm mb-6">This profile could not be loaded.</p>
                    <button onClick={() => navigate(-1)} className="px-6 py-2.5 bg-primary-600 text-white rounded-2xl font-bold text-sm cursor-pointer hover:bg-primary-700 transition-all">
                        Go Back
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100/70 via-indigo-50/40 to-purple-50/30 flex flex-col">
            <Navbar />

            <main className="max-w-4xl mx-auto w-full pt-8 pb-20 px-4 flex-1">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/90 backdrop-blur-2xl rounded-[40px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] overflow-hidden border border-white/40"
                >
                    {/* Cover */}
                    <div className="relative h-40 md:h-52 overflow-hidden">
                        <div className="w-full h-full" style={{ background: 'var(--gradient-hero)' }} />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/40" />
                        <button className="absolute top-6 right-6 p-2.5 bg-white/90 backdrop-blur-md hover:bg-white text-gray-800 hover:text-primary-600 rounded-2xl transition-all shadow-lg cursor-pointer border border-white/40">
                            <Share2 size={18} />
                        </button>
                    </div>

                    {/* Profile Section */}
                    <div className="relative px-6 md:px-12 pb-10">
                        {/* Avatar */}
                        <div className="absolute -top-20 left-1/2 md:left-12 transform -translate-x-1/2 md:translate-x-0">
                            <div className="p-1.5 bg-white rounded-full shadow-2xl border border-white/80 relative">
                                {user.profileImage ? (
                                    <img
                                        src={user.profileImage}
                                        alt={user.name}
                                        className="w-28 h-28 md:w-32 md:h-32 rounded-full object-cover"
                                    />
                                ) : (
                                    <div
                                        className="w-28 h-28 md:w-32 md:h-32 rounded-full text-white text-3xl md:text-4xl font-extrabold flex items-center justify-center shadow-inner"
                                        style={{ background: 'linear-gradient(135deg, var(--color-primary-500) 0%, var(--color-secondary-500) 100%)' }}
                                    >
                                        {getInitials(user.name)}
                                    </div>
                                )}
                                <span className="absolute bottom-1 right-2 w-4 h-4 bg-green-500 border-4 border-white rounded-full shadow" />
                            </div>
                        </div>

                        {/* Name & Actions Row */}
                        <div className="pt-20 md:pt-4 md:pl-40 flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div>
                                <h1 className="font-extrabold text-2xl md:text-3xl text-gray-900 capitalize flex items-center gap-2">
                                    {user.name}
                                    <span className="px-3 py-1 bg-primary-100 text-primary-600 rounded-full text-[10px] font-black uppercase tracking-wider">Member</span>
                                </h1>
                                <div className="flex items-center gap-3 mt-1 text-gray-400 text-xs font-bold">
                                    <div className="flex items-center gap-1.5 border-r pr-3 border-gray-100">
                                        <Globe size={12} className="text-primary-400" />
                                        <span>Global Member</span>
                                    </div>
                                    <span className="text-primary-500">@{user.name.replace(/\s+/g, '').toLowerCase()}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => followMutation.mutate(user?.id)}
                                    className={`px-6 py-2.5 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all cursor-pointer shadow-md ${
                                        isFollower
                                            ? "bg-red-50 text-red-500 border border-red-100 hover:bg-red-100"
                                            : "bg-primary-600 text-white shadow-primary-200/50 hover:bg-primary-700 hover:shadow-xl"
                                    }`}
                                >
                                    {isFollower
                                        ? <><UserMinus size={16} /> Unfollow</>
                                        : <><UserPlus size={16} /> Follow</>
                                    }
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => messageMutation.mutate()}
                                    disabled={messageMutation.isPending}
                                    className="p-3 bg-green-500 text-white rounded-2xl shadow-lg hover:bg-green-600 transition-all cursor-pointer disabled:opacity-60"
                                >
                                    <MessageSquare size={18} />
                                </motion.button>
                            </div>
                        </div>

                        {/* Stats + Bio */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10 pt-8 border-t border-gray-50/80">
                            {/* Left column */}
                            <div className="lg:col-span-1 space-y-5">
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-4 bg-primary-50/50 rounded-2xl border border-primary-100/50">
                                        <div className="flex items-center justify-between mb-1.5 text-primary-600">
                                            <ImageIcon size={15} />
                                            <span className="text-[10px] font-black">FILES</span>
                                        </div>
                                        <p className="text-xl font-black text-primary-900">{user.posts?.length || 0}</p>
                                        <p className="text-[10px] text-primary-400 font-bold tracking-widest mt-0.5">POSTS</p>
                                    </div>
                                    <div className="p-4 bg-secondary-50/50 rounded-2xl border border-secondary-100/50">
                                        <div className="flex items-center justify-between mb-1.5 text-secondary-600">
                                            <Heart size={15} />
                                            <span className="text-[10px] font-black">FANS</span>
                                        </div>
                                        <p className="text-xl font-black text-secondary-900">{user.followers?.length || 0}</p>
                                        <p className="text-[10px] text-secondary-400 font-bold tracking-widest mt-0.5">FOLLOWERS</p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl border border-gray-100/50">
                                        <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-primary-500 shadow-sm border border-gray-100">
                                            <MapPin size={14} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-gray-400 font-bold">LOCATION</p>
                                            <p className="text-xs font-black text-gray-900">{user.location || "Ayodhya, India"}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl border border-gray-100/50">
                                        <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-primary-500 shadow-sm border border-gray-100">
                                            <Calendar size={14} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-gray-400 font-bold">JOINED</p>
                                            <p className="text-xs font-black text-gray-900">Member Since 2024</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right column — Bio + Posts */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Bio */}
                                <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100/60">
                                    <h3 className="text-base font-black text-gray-900 mb-3 flex items-center gap-2">
                                        <span className="w-1.5 h-5 bg-primary-500 rounded-full" />
                                        Bio & Information
                                    </h3>
                                    <p className="text-gray-500 text-sm leading-relaxed font-medium italic">
                                        "{user.bio || "This user is keeping their life a mystery... No bio available yet."}"
                                    </p>
                                </div>

                                {/* Posts */}
                                {user.posts && user.posts.length > 0 && (
                                    <div>
                                        <h3 className="text-sm font-black text-gray-700 mb-4 uppercase tracking-widest">Recent Posts</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                            {user.posts.slice(0, 4).map((post) => (
                                                <motion.div
                                                    key={post.id}
                                                    whileHover={{ y: -3 }}
                                                    className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all overflow-hidden group cursor-pointer"
                                                >
                                                    {post.image && (
                                                        <div className="relative aspect-video overflow-hidden">
                                                            <img
                                                                src={post.image}
                                                                alt={post.title}
                                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                                            />
                                                        </div>
                                                    )}
                                                    <div className="p-4">
                                                        <h4 className="text-sm font-black text-gray-900 truncate mb-2">{post.title}</h4>
                                                        <div className="flex items-center gap-4 text-xs text-gray-400 font-bold">
                                                            <span className="flex items-center gap-1 text-red-500">
                                                                <Heart size={12} fill="currentColor" /> {post.post_likes?.length || 0}
                                                            </span>
                                                            <span className="flex items-center gap-1 text-primary-500">
                                                                <MessageSquare size={12} /> {post.comments?.length || 0}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </main>
        </div>
    );
};

export default FriendsDetail;