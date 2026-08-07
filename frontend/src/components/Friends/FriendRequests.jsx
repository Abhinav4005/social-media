import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
    UserCheck, UserX, UserPlus, Users,
    ArrowRight, Search, Clock
} from 'lucide-react';
import { cancelFriendRequest, getFriendRequests, respondToFriendRequest } from '../../api';
import Navbar from '../../pages/Navbar';

/* ── Avatar gradient palette ─────────────────────────────────── */
const GRADIENTS = [
    ["#6366f1", "#8b5cf6"],
    ["#ec4899", "#f43f5e"],
    ["#f59e0b", "#f97316"],
    ["#10b981", "#14b8a6"],
    ["#3b82f6", "#6366f1"],
    ["#a855f7", "#ec4899"],
];
function getGradient(name = "") {
    const code = [...(name || "?")].reduce((a, c) => a + c.charCodeAt(0), 0);
    return GRADIENTS[code % GRADIENTS.length];
}

/* ── Stagger variants ────────────────────────────────────────── */
const listVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};
const cardVariants = {
    hidden: { opacity: 0, y: 18, scale: 0.97 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 300, damping: 26 } },
    exit: { opacity: 0, scale: 0.94, y: -8, transition: { duration: 0.18 } },
};

/* ── Skeleton card ───────────────────────────────────────────── */
function SkeletonCard() {
    return (
        <div className="bg-white dark:bg-slate-900 rounded-[20px] border border-gray-100 dark:border-slate-800 p-5 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl animate-shimmer flex-shrink-0" />
            <div className="flex-1 space-y-2">
                <div className="h-3.5 w-36 rounded animate-shimmer" />
                <div className="h-2.5 w-24 rounded animate-shimmer" />
            </div>
            <div className="flex gap-2">
                <div className="h-9 w-20 rounded-xl animate-shimmer" />
                <div className="h-9 w-9 rounded-xl animate-shimmer" />
            </div>
        </div>
    );
}

/* ── Single request card ─────────────────────────────────────── */
function RequestCard({ request, onAccept, onDecline }) {
    const [c1, c2] = getGradient(request.requester?.name);
    const initials = (request.requester?.name || "?").slice(0, 2).toUpperCase();
    const [accepting, setAccepting] = useState(false);
    const [declining, setDeclining] = useState(false);

    const handleAccept = async () => {
        setAccepting(true);
        await onAccept(request.id);
        setAccepting(false);
    };
    const handleDecline = async () => {
        setDeclining(true);
        await onDecline(request.id);
        setDeclining(false);
    };

    return (
        <motion.div
            variants={cardVariants}
            layout
            className="group relative bg-white dark:bg-slate-900 rounded-[20px] border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-md dark:hover:shadow-slate-900/50 transition-all duration-200 overflow-hidden"
        >
            {/* Hover accent */}
            <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="flex items-center gap-4 p-5">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                    {request.requester?.profileImage ? (
                        <img
                            src={request.requester.profileImage}
                            alt={request.requester.name}
                            className="w-14 h-14 rounded-2xl object-cover ring-2 ring-white dark:ring-slate-800 shadow-sm"
                        />
                    ) : (
                        <div
                            className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-sm ring-2 ring-white dark:ring-slate-800 shadow-sm"
                            style={{ background: `linear-gradient(135deg, ${c1}, ${c2})` }}
                        >
                            {initials}
                        </div>
                    )}
                    {request.online && (
                        <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 border-2 border-white dark:border-slate-900 rounded-full shadow-sm" />
                    )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate">
                        {request.requester?.name || "Unknown"}
                    </h3>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                        {request.mutualFriends > 0 && (
                            <div className="flex items-center gap-1">
                                <Users className="w-3 h-3 text-primary-400" />
                                <span className="text-[11px] font-semibold text-gray-400 dark:text-gray-500">
                                    {request.mutualFriends} mutual
                                </span>
                            </div>
                        )}
                        <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-gray-300 dark:text-gray-600" />
                            <span className="text-[11px] text-gray-400 dark:text-gray-500 font-medium">Pending</span>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                    {/* Accept */}
                    <motion.button
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleAccept}
                        disabled={accepting || declining}
                        className="h-9 px-4 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 text-white text-xs font-semibold shadow-md shadow-primary-300/40 dark:shadow-primary-900/30 hover:from-primary-600 hover:to-primary-800 flex items-center gap-1.5 transition-all disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
                    >
                        {accepting ? (
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 0.7, ease: "linear" }}
                                className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full"
                            />
                        ) : (
                            <UserCheck className="w-3.5 h-3.5" />
                        )}
                        Accept
                    </motion.button>

                    {/* Decline */}
                    <motion.button
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleDecline}
                        disabled={accepting || declining}
                        className="h-9 w-9 rounded-xl bg-gray-100 dark:bg-slate-800 text-gray-400 dark:text-gray-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:text-rose-500 dark:hover:text-rose-400 flex items-center justify-center transition-all disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
                    >
                        {declining ? (
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 0.7, ease: "linear" }}
                                className="w-3.5 h-3.5 border-2 border-gray-300/50 border-t-gray-500 rounded-full"
                            />
                        ) : (
                            <UserX className="w-3.5 h-3.5" />
                        )}
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
}

/* ── Main component ──────────────────────────────────────────── */
const FriendRequests = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [searchFocused, setSearchFocused] = useState(false);

    const { data, isLoading } = useQuery({
        queryKey: ['friendRequests'],
        queryFn: getFriendRequests,
        refetchOnWindowFocus: false,
    });

    const [requests, setRequests] = useState([]);

    useEffect(() => {
        if (data?.requests) setRequests(data.requests);
    }, [data]);

    const requestRespondMutation = useMutation({
        mutationFn: ({ requestId, action }) => respondToFriendRequest(requestId, action),
        onMutate: async ({ requestId }) => {
            await queryClient.cancelQueries({ queryKey: ['friendRequests'] });
            const previousRequests = queryClient.getQueryData(['friendRequests']);
            queryClient.setQueryData(['friendRequests'], (old) => {
                if (!old) return old;
                return { ...old, requests: old.requests.filter(req => req.id !== requestId) };
            });
            return { previousRequests };
        },
        onError: (_err, _vars, context) => {
            if (context?.previousRequests) queryClient.setQueryData(['friendRequests'], context.previousRequests);
        },
        onSettled: () => queryClient.invalidateQueries({ queryKey: ['friendRequests'] }),
    });

    const handleDeclineMutation = useMutation({
        mutationFn: (requestId) => cancelFriendRequest(requestId),
        onMutate: async (requestId) => {
            await queryClient.cancelQueries({ queryKey: ['friendRequests'] });
            const previousRequest = queryClient.getQueryData(['friendRequests']);
            queryClient.setQueryData(['friendRequests'], (old) => {
                if (!old) return old;
                return { ...old, requests: old.requests.filter(req => req.id !== requestId) };
            });
            return { previousRequest };
        },
        onError: (_err, _vars, context) => {
            if (context?.previousRequest) queryClient.setQueryData(['friendRequests'], context.previousRequest);
        },
        onSettled: () => queryClient.invalidateQueries({ queryKey: ['friendRequests'] }),
    });

    const handleAccept = (requestId) => requestRespondMutation.mutate({ requestId, action: "ACCEPTED" });
    const handleDecline = (requestId) => handleDeclineMutation.mutate(requestId);

    const filtered = requests.filter(r =>
        r.requester?.name?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0b0f19] transition-colors duration-300">
            <Navbar />

            <main className="max-w-2xl mx-auto w-full px-4 py-8">

                {/* ── Header card ─────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, y: -16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 280, damping: 24 }}
                    className="bg-white dark:bg-slate-900 rounded-[24px] border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden mb-5"
                >
                    {/* Gradient accent bar */}
                    <div className="h-1 bg-gradient-to-r from-primary-500 via-secondary-400 to-primary-600 animate-gradient-x" />

                    <div className="px-6 pt-6 pb-5">
                        <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center gap-3.5">
                                {/* Glow icon */}
                                <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center shadow-lg shadow-primary-300/50 dark:shadow-primary-900/40">
                                    <UserPlus className="w-5 h-5 text-white" />
                                    <span className="absolute inset-0 rounded-2xl ring-2 ring-primary-300/30 dark:ring-primary-600/20 animate-pulse pointer-events-none" />
                                </div>
                                <div>
                                    <h1 className="text-[17px] font-bold text-gray-900 dark:text-gray-100 tracking-tight leading-none">
                                        Friend Requests
                                    </h1>
                                    <p className="text-[11px] font-medium text-gray-400 dark:text-gray-500 mt-0.5 uppercase tracking-widest">
                                        People who want to connect
                                    </p>
                                </div>
                            </div>

                            {/* Pending badge */}
                            <AnimatePresence>
                                {requests.length > 0 && (
                                    <motion.div
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0, opacity: 0 }}
                                        className="flex items-center gap-1.5 px-3.5 py-1.5 bg-primary-50 dark:bg-primary-900/30 rounded-full border border-primary-100 dark:border-primary-800/40"
                                    >
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse" />
                                        <span className="text-xs font-bold text-primary-600 dark:text-primary-400">
                                            {requests.length} Pending
                                        </span>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Search */}
                        <motion.div
                            animate={searchFocused
                                ? { boxShadow: "0 0 0 3px rgba(99,102,241,0.15)" }
                                : { boxShadow: "0 0 0 0px rgba(99,102,241,0)" }
                            }
                            transition={{ duration: 0.2 }}
                            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border transition-colors duration-200 ${searchFocused
                                ? "border-primary-400 dark:border-primary-500 bg-white dark:bg-slate-800"
                                : "border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/60"
                                }`}
                        >
                            <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <input
                                type="text"
                                placeholder="Search requests…"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                onFocus={() => setSearchFocused(true)}
                                onBlur={() => setSearchFocused(false)}
                                className="bg-transparent text-sm font-medium text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 outline-none flex-1"
                            />
                            <AnimatePresence>
                                {search && (
                                    <motion.button
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0, opacity: 0 }}
                                        onClick={() => setSearch("")}
                                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer"
                                    >
                                        <UserX className="w-3.5 h-3.5" />
                                    </motion.button>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </div>
                </motion.div>

                {/* ── List ────────────────────────────────── */}
                <div className="space-y-3">
                    {isLoading ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-3"
                        >
                            {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
                        </motion.div>
                    ) : (
                        <AnimatePresence mode="popLayout">
                            {filtered.length > 0 ? (
                                <motion.div
                                    variants={listVariants}
                                    initial="hidden"
                                    animate="show"
                                    className="space-y-3"
                                >
                                    {filtered.map(request => (
                                        <RequestCard
                                            key={request.id}
                                            request={request}
                                            onAccept={handleAccept}
                                            onDecline={handleDecline}
                                        />
                                    ))}
                                </motion.div>
                            ) : search ? (
                                <motion.div
                                    key="no-search"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-white dark:bg-slate-900 rounded-[24px] border border-gray-100 dark:border-slate-800 py-16 text-center"
                                >
                                    <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
                                        <Search className="w-6 h-6 text-gray-300 dark:text-gray-600" />
                                    </div>
                                    <p className="text-sm font-bold text-gray-600 dark:text-gray-400">No results for "{search}"</p>
                                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Try a different name</p>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="empty"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.1 }}
                                    className="bg-white dark:bg-slate-900 rounded-[24px] border border-gray-100 dark:border-slate-800 py-20 text-center px-6"
                                >
                                    {/* Gradient icon */}
                                    <div className="relative w-20 h-20 mx-auto mb-5">
                                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900/30 dark:to-secondary-900/30" />
                                        <div className="relative flex items-center justify-center w-full h-full">
                                            <UserPlus className="w-9 h-9 text-primary-400 dark:text-primary-500" />
                                        </div>
                                    </div>
                                    <h2 className="text-base font-bold text-gray-800 dark:text-gray-200 mb-1">
                                        No requests yet
                                    </h2>
                                    <p className="text-sm text-gray-400 dark:text-gray-500 mb-6 max-w-xs mx-auto">
                                        You're all caught up! When someone sends you a request, it'll appear here.
                                    </p>
                                    <motion.button
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                        onClick={() => navigate('/')}
                                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 text-white text-sm font-semibold shadow-lg shadow-primary-300/30 dark:shadow-primary-900/30 cursor-pointer transition-all"
                                    >
                                        Explore Feed <ArrowRight className="w-4 h-4" />
                                    </motion.button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    )}
                </div>
            </main>
        </div>
    );
};

export default FriendRequests;