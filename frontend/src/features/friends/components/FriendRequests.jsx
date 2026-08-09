import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
    UserCheck, UserX, UserPlus, Users,
    ArrowRight, Clock
} from 'lucide-react';
import { cancelFriendRequest, getFriendRequests, respondToFriendRequest } from '../../../api';
import Navbar from '../../../pages/Navbar';
import UserAvatar from '../../../components/Common/UserAvatar';
import SearchInput from '../../../components/Common/SearchInput';
import EmptyState from '../../../components/Common/EmptyState';
import LoadingSpinner from '../../../components/Common/LoadingSpinner';
import { QUERY_KEYS } from '../../../constant/queryKeys';
import { ROUTES } from '../../../constant/routes';

const listVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};
const cardVariants = {
    hidden: { opacity: 0, y: 18, scale: 0.97 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 300, damping: 26 } },
    exit: { opacity: 0, scale: 0.94, y: -8, transition: { duration: 0.18 } },
};

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

function RequestCard({ request, onAccept, onDecline }) {
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
            <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-primary-500 via-secondary-400 to-primary-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="flex items-center gap-4 p-5">
                <UserAvatar
                    name={request.requester?.name}
                    profileImage={request.requester?.profileImage}
                    size="lg"
                    shape="rounded"
                    showOnline={request.online}
                    ring="ring-2 ring-white dark:ring-slate-800"
                />

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

                <div className="flex items-center gap-2 flex-shrink-0">
                    <motion.button
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleAccept}
                        disabled={accepting || declining}
                        className="h-9 px-4 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 text-white text-xs font-semibold shadow-md shadow-primary-300/40 dark:shadow-primary-900/30 hover:from-primary-600 hover:to-primary-800 flex items-center gap-1.5 transition-all disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
                    >
                        {accepting ? <LoadingSpinner size="xs" /> : <UserCheck className="w-3.5 h-3.5" />}
                        Accept
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleDecline}
                        disabled={accepting || declining}
                        className="h-9 w-9 rounded-xl bg-gray-100 dark:bg-slate-800 text-gray-400 dark:text-gray-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:text-rose-500 dark:hover:text-rose-400 flex items-center justify-center transition-all disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
                    >
                        {declining
                            ? <LoadingSpinner size="xs" trackClass="border-gray-300/50 border-t-gray-500" />
                            : <UserX className="w-3.5 h-3.5" />
                        }
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
}

const FriendRequests = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const [search, setSearch] = useState("");

    const { data, isLoading } = useQuery({
        queryKey: QUERY_KEYS.friendRequests,
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
            await queryClient.cancelQueries({ queryKey: QUERY_KEYS.friendRequests });
            const previousRequests = queryClient.getQueryData(QUERY_KEYS.friendRequests);
            queryClient.setQueryData(QUERY_KEYS.friendRequests, (old) => {
                if (!old) return old;
                return { ...old, requests: old.requests.filter(req => req.id !== requestId) };
            });
            return { previousRequests };
        },
        onError: (_err, _vars, context) => {
            if (context?.previousRequests) queryClient.setQueryData(QUERY_KEYS.friendRequests, context.previousRequests);
        },
        onSettled: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.friendRequests }),
    });

    const handleDeclineMutation = useMutation({
        mutationFn: (requestId) => cancelFriendRequest(requestId),
        onMutate: async (requestId) => {
            await queryClient.cancelQueries({ queryKey: QUERY_KEYS.friendRequests });
            const previousRequest = queryClient.getQueryData(QUERY_KEYS.friendRequests);
            queryClient.setQueryData(QUERY_KEYS.friendRequests, (old) => {
                if (!old) return old;
                return { ...old, requests: old.requests.filter(req => req.id !== requestId) };
            });
            return { previousRequest };
        },
        onError: (_err, _vars, context) => {
            if (context?.previousRequest) queryClient.setQueryData(QUERY_KEYS.friendRequests, context.previousRequest);
        },
        onSettled: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.friendRequests }),
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

                <motion.div
                    initial={{ opacity: 0, y: -16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 280, damping: 24 }}
                    className="bg-white dark:bg-slate-900 rounded-[24px] border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden mb-5"
                >
                    <div className="h-1 bg-gradient-to-r from-primary-500 via-secondary-400 to-primary-600 animate-gradient-x" />

                    <div className="px-6 pt-6 pb-5">
                        <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center gap-3.5">
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

                        <SearchInput
                            value={search}
                            onChange={setSearch}
                            placeholder="Search requests…"
                        />
                    </div>
                </motion.div>

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
                                <EmptyState
                                    key="no-search"
                                    icon={UserX}
                                    title={`No results for "${search}"`}
                                    description="Try a different name"
                                    iconBg="bg-gray-100 dark:bg-slate-800"
                                    iconColor="text-gray-300 dark:text-gray-600"
                                />
                            ) : (
                                <EmptyState
                                    key="empty"
                                    icon={UserPlus}
                                    title="No requests yet"
                                    description="You're all caught up! When someone sends you a request, it'll appear here."
                                    action={{ label: "Explore Feed", icon: ArrowRight, onClick: () => navigate(ROUTES.HOME) }}
                                />
                            )}
                        </AnimatePresence>
                    )}
                </div>
            </main>
        </div>
    );
};

export default FriendRequests;
