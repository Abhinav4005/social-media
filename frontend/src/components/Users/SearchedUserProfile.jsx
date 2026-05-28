import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import {
    UserRoundCheck, UserRoundPlus, MessageSquare,
    MapPin, Calendar, Heart, Users, ImageIcon,
    Share2, Shield, Globe, Info
} from "lucide-react";
import Navbar from "../../pages/Navbar";
import Button from "../UI/Button";
import { createOrGetRoom, followUser, getUserById, sendFriendRequest } from "../../api";

const SearchedUserProfile = () => {
    const { user: currentUser } = useSelector((state) => state.auth);
    const { userId } = useParams();
    const navigate = useNavigate();
    const [isFollower, setIsFollower] = useState(false);
    const [requestSent, setRequestSent] = useState(false);
    const [isFriend, setIsFriend] = useState(false);
    const [activeTab, setActiveTab] = useState("posts");

    const { data: user, isLoading, isError } = useQuery({
        queryKey: ["userDetail", userId],
        queryFn: ({ queryKey }) => {
            const [_key, id] = queryKey;
            return getUserById({ userId: id });
        },
        enabled: !!userId,
    });

    useEffect(() => {
        if (!user || !currentUser) return;

        user.followers?.forEach(follower => {
            if (follower.followerId === currentUser.id) setIsFollower(true);
        });

        const requestSentCheck =
            user.requestedFriendShips?.some(
                (request) =>
                    request?.addresseeId === currentUser.id && request?.status === "PENDING"
            ) ||
            user.receivedFriendShips?.some(
                (request) =>
                    request?.requesterId === currentUser.id && request?.status === "PENDING"
            );
        setRequestSent(requestSentCheck || false);

        const checkIsFriend =
            user.receivedFriendShips?.some(
                (request) => request?.requesterId === currentUser?.id && request?.status === "ACCEPTED"
            ) ||
            user.requestedFriendShips?.some(
                (request) => request?.addresseeId === currentUser?.id && request?.status === "ACCEPTED"
            );
        setIsFriend(checkIsFriend || false);

    }, [userId, user, currentUser]);

    const mutation = useMutation({
        mutationFn: () => createOrGetRoom(null, "DM", [userId]),
        onSuccess: (room) => {
            navigate(`/chat/${room?.id}`)
        },
        onError: (err) => {
            console.error("Room creation failed:", err)
        }
    })

    const handleMessage = () => {
        mutation.mutate();
    }

    const sentRequestMutation = useMutation({
        mutationFn: (addresseeId) => sendFriendRequest(addresseeId),
        onMutate: () => {
            setRequestSent(true);
        },
        onError: (err) => {
            console.error("Error sending friend request:", err);
            setRequestSent(false);
        }
    })

    const handleFriendRequest = (addresseeId) => {
        sentRequestMutation.mutate(addresseeId);
    }

    const getInitials = (name = "") =>
        name
            .split(" ")
            .map((n) => n[0]?.toUpperCase())
            .join("")
            .slice(0, 2);

    if (isLoading) return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <div className="flex-1 flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center gap-4 text-gray-400"
                >
                    <div className="w-16 h-16 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin" />
                    <p className="font-bold text-lg">Loading Profile...</p>
                </motion.div>
            </div>
        </div>
    );

    if (isError || !user) return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                    <Shield className="w-16 h-16 text-red-100 mx-auto mb-4" />
                    <p className="text-2xl font-bold text-gray-800">User Not Found</p>
                    <p className="text-gray-500 mt-2">The profile you are looking for doesn't exist.</p>
                    <Button onClick={() => navigate(-1)} className="mt-6 bg-primary-600 text-white px-8 py-3 rounded-xl">Go Back</Button>
                </div>
            </div>
        </div>
    );

    const tabs = [
        { id: "posts", label: "Posts", icon: <ImageIcon className="w-4 h-4" /> },
        { id: "about", label: "About", icon: <Info className="w-4 h-4" /> }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100/70 via-indigo-50/40 to-purple-50/30 flex flex-col">
            <Navbar />

            <main className="max-w-4xl mx-auto w-full pt-8 pb-20 px-4 flex-1">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/90 backdrop-blur-2xl rounded-[40px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] overflow-hidden border border-white/40"
                >
                    {/* Cover Photo Header */}
                    <div className="relative h-40 md:h-52 overflow-hidden">
                        <div className="w-full h-full" style={{ background: 'var(--gradient-hero)' }} />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/40" />

                        {/* Share button */}
                        <button className="absolute top-6 right-6 p-2.5 bg-white/90 backdrop-blur-md hover:bg-white text-gray-800 hover:text-primary-600 rounded-2xl transition-all active:scale-95 shadow-lg cursor-pointer border border-white/40">
                            <Share2 size={18} />
                        </button>
                    </div>

                    {/* Profile Section */}
                    <div className="relative px-6 md:px-12 pb-10">
                        {/* Avatar Overlay */}
                        <div className="absolute -top-20 left-1/2 md:left-12 transform -translate-x-1/2 md:translate-x-0">
                            <div className="relative group">
                                <div className="p-1.5 bg-white rounded-full shadow-2xl border border-white/80">
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
                                </div>
                                <div className="absolute bottom-1 right-2 w-5.5 h-5.5 bg-green-500 border-4 border-white rounded-full shadow-lg" />
                            </div>
                        </div>

                        {/* Top Content Row */}
                        <div className="pt-20 md:pt-4 md:pl-40 flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div>
                                <h1 className="font-extrabold text-2xl md:text-3xl text-gray-900 capitalize flex items-center gap-2">
                                    {user.name}
                                    <div className="p-1 px-3 bg-primary-100 text-primary-600 rounded-full text-[10px] font-black uppercase tracking-wider">PRO</div>
                                </h1>
                                <div className="flex items-center gap-4 text-gray-400 mt-1 font-bold text-xs">
                                    <div className="flex items-center gap-1.5 border-r pr-4 border-gray-100">
                                        <Globe size={14} className="text-primary-400" />
                                        <span>Global Member</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <p className="text-primary-600">@{user.name.replace(/\s+/g, '').toLowerCase()}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                {isFriend ? (
                                    <Button className="bg-primary-50 text-primary-600 hover:bg-primary-100 px-6 py-2.5 rounded-2xl font-bold flex items-center gap-2 transition-all cursor-pointer text-sm border border-primary-100/50">
                                        <UserRoundCheck size={18} /> Friends
                                    </Button>
                                ) : requestSent ? (
                                    <div className="bg-slate-100 text-slate-500 border border-slate-200/60 px-6 py-2.5 rounded-2xl font-bold flex items-center gap-2 text-sm select-none shadow-sm">
                                        <UserRoundCheck size={18} className="text-slate-400" />
                                        <span>Request Sent</span>
                                    </div>
                                ) : (
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => handleFriendRequest(user?.id)}
                                        className="bg-primary-600 text-white px-6 py-2.5 rounded-2xl font-bold shadow-lg shadow-primary-200/50 hover:bg-primary-700 hover:shadow-xl flex items-center gap-2 transition-all cursor-pointer text-sm"
                                    >
                                        <UserRoundPlus size={18} /> Add Friend
                                    </motion.button>
                                )}

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleMessage}
                                    className="p-3 bg-green-500 text-white rounded-2xl shadow-lg shadow-green-100 hover:bg-green-600 transition-all flex items-center justify-center cursor-pointer"
                                >
                                    <MessageSquare size={18} />
                                </motion.button>
                            </div>
                        </div>

                        {/* Stats & About Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-12 pb-8 border-b border-gray-50">
                            <div className="lg:col-span-1 space-y-8">
                                {/* Detailed Stats */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-primary-50/50 rounded-2xl border border-primary-100/50">
                                        <div className="flex items-center justify-between mb-2 text-primary-600">
                                            <ImageIcon size={16} />
                                            <span className="text-xs font-black">FILES</span>
                                        </div>
                                        <p className="text-xl font-black text-primary-900">{user.posts?.length || 0}</p>
                                        <p className="text-[10px] text-primary-400 font-bold tracking-widest mt-0.5">POSTS</p>
                                    </div>
                                    <div className="p-4 bg-secondary-50/50 rounded-2xl border border-secondary-100/50">
                                        <div className="flex items-center justify-between mb-2 text-secondary-600">
                                            <Users size={16} />
                                            <span className="text-xs font-black">TEAM</span>
                                        </div>
                                        <p className="text-xl font-black text-secondary-900">{user.followers?.length || 0}</p>
                                        <p className="text-[10px] text-secondary-400 font-bold tracking-widest mt-0.5">FOLLOWERS</p>
                                    </div>
                                </div>

                                {/* Side Meta */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 p-3.5 bg-gray-50 rounded-2xl border border-gray-100/50">
                                        <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-primary-500 shadow-sm border border-gray-100">
                                            <MapPin size={16} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-gray-400 font-bold">LOCATION</p>
                                            <p className="text-xs font-black text-gray-900">{user.location || "Ayodhya, India"}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3.5 bg-gray-50 rounded-2xl border border-gray-100/50">
                                        <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-primary-500 shadow-sm border border-gray-100">
                                            <Calendar size={16} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-gray-400 font-bold">JOINED</p>
                                            <p className="text-xs font-black text-gray-900">Member Since 2024</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="lg:col-span-2">
                                {/* Tabs Selector */}
                                <div className="flex gap-1.5 p-1 bg-gray-50 rounded-2xl w-fit mb-6 border border-gray-100/80">
                                    {tabs.map(tab => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === tab.id
                                                ? "bg-white text-primary-600 shadow-sm"
                                                : "text-gray-400 hover:text-gray-600"
                                                }`}
                                        >
                                            {tab.label}
                                        </button>
                                    ))}
                                </div>

                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={activeTab}
                                        initial={{ opacity: 0, x: 10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -10 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        {activeTab === "about" ? (
                                            <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100/60">
                                                <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                                                    <span className="w-1.5 h-5 bg-primary-500 rounded-full" />
                                                    Bio & Information
                                                </h3>
                                                <p className="text-gray-500 text-sm leading-relaxed font-medium italic">
                                                    "{user.bio || "This user is keeping their life a mystery... No bio available yet."}"
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="space-y-6">
                                                {user.posts && user.posts.length > 0 ? (
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                        {user.posts.map((post) => (
                                                            <motion.div
                                                                key={post.id}
                                                                whileHover={{ y: -4 }}
                                                                className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all overflow-hidden group cursor-pointer"
                                                            >
                                                                <div className="relative aspect-square overflow-hidden">
                                                                    <img
                                                                        src={post.image}
                                                                        alt={post.title}
                                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                                                    />
                                                                    <div className="absolute top-4 left-4 p-2 px-3 bg-white/90 backdrop-blur-md rounded-xl text-[10px] font-black shadow-lg">
                                                                        {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                                    </div>
                                                                </div>
                                                                <div className="p-5">
                                                                    <h3 className="text-base font-black text-gray-900 truncate mb-4">{post.title}</h3>
                                                                    <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                                                        <div className="flex items-center gap-4">
                                                                            <div className="flex items-center gap-1.5 text-red-500 font-bold text-xs">
                                                                                <Heart size={14} fill="currentColor" />
                                                                                <span>{post.post_likes?.length || 0}</span>
                                                                            </div>
                                                                            <div className="flex items-center gap-1.5 text-primary-500 font-bold text-xs">
                                                                                <MessageSquare size={14} />
                                                                                <span>{post.comments?.length || 0}</span>
                                                                            </div>
                                                                        </div>
                                                                        <button className="p-2 text-gray-400 hover:text-primary-600 transition-colors cursor-pointer">
                                                                            <Share2 size={16} />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </motion.div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                                                        <ImageIcon size={40} className="mx-auto text-gray-200 mb-3" />
                                                        <p className="text-gray-400 font-bold text-sm">No posts to show yet</p>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </main>
        </div>
    );
};
export default SearchedUserProfile;