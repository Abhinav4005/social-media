import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
    UserCheck, UserX, UserPlus, Users,
    ArrowRight, Loader2, Sparkles
} from 'lucide-react';
import { cancelFriendRequest, getFriendRequests, respondToFriendRequest } from '../../api';
import Navbar from '../../pages/Navbar';

const FriendRequests = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const { data, isLoading } = useQuery({
        queryKey: ['friendRequests'],
        queryFn: getFriendRequests,
        refetchOnWindowFocus: false,
    });

    const [requests, setRequests] = useState([]);

    useEffect(() => {
        if (data?.requests) {
            setRequests(data.requests);
        }
    }, [data]);

    const requestRespondMutation = useMutation({
        mutationFn: ({ requestId, action }) => respondToFriendRequest(requestId, action),
        onMutate: async ({ requestId }) => {
            await queryClient.cancelQueries({ queryKey: ['friendRequests'] });
            const previousRequests = queryClient.getQueryData(['friendRequests']);
            queryClient.setQueryData(['friendRequests'], (old) => {
                if (!old) return old;
                return {
                    ...old,
                    requests: old.requests.filter(req => req.id !== requestId)
                }
            })
            return { previousRequests };
        },
        onError: (err, requestId, action, context) => {
            if (context?.previousRequests) {
                queryClient.setQueryData(['friendRequests'], context.previousRequests);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['friendRequests'] });
        }
    })

    const handleDeclineMutation = useMutation({
        mutationFn: (requestId) => cancelFriendRequest(requestId),
        onMutate: async (requestId) => {
            await queryClient.cancelQueries({ queryKey: ['friendRequests'] });
            const previousRequest = queryClient.getQueryData(['friendRequests']);
            queryClient.setQueryData(['friendRequests'], (old) => {
                if (!old) return old;
                return {
                    ...old,
                    requests: old.requests.filter(req => req.id !== requestId)
                }
            })
            return { previousRequest };
        },
        onError: (err, requestId, context) => {
            if (context?.previousRequest) {
                queryClient.setQueryData(['friendRequests'], context.previousRequest);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['friendRequests'] });
        }
    })

    const getInitials = (name = "") =>
        name
            .split(" ")
            .map((n) => n[0]?.toUpperCase())
            .join("")
            .slice(0, 2);

    const handleAccept = (requestId) => requestRespondMutation.mutate({ requestId, action: "ACCEPTED" });
    const handleDeclineRequest = (requestId) => handleDeclineMutation.mutate(requestId);

    if (isLoading) return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <div className="flex-1 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />

            <main className="max-w-3xl mx-auto w-full p-6 md:p-10 flex-1">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary-100 rounded-xl">
                            <Sparkles className="w-5 h-5 text-primary-600" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Friend Requests</h1>
                            <p className="text-gray-400 text-xs font-medium leading-none mt-1">PEOPLE WANT TO CONNECT</p>
                        </div>
                    </div>
                    {requests?.length > 0 && (
                        <div className="px-4 py-1.5 bg-white border border-gray-100 rounded-full shadow-sm">
                            <span className="text-sm font-semibold text-primary-600">{requests.length} Pending</span>
                        </div>
                    )}
                </div>

                <div className="space-y-3">
                    <AnimatePresence mode="popLayout">
                        {requests?.length > 0 ? (
                            requests.map((request) => (
                                <motion.div
                                    key={request.id}
                                    layout
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="group bg-white p-4 pr-5 rounded-2xl shadow-sm hover:shadow-md border border-gray-100 transition-all flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="relative">
                                            {request.requester.profilImage ? (
                                                <img
                                                    src={request.requester.profilImage}
                                                    alt={request.requester.name}
                                                    className="w-12 h-12 rounded-xl object-cover shadow-sm group-hover:rotate-2 transition-transform"
                                                />
                                            ) : (
                                                <div
                                                    className="w-12 h-12 rounded-xl text-white font-black text-sm flex items-center justify-center shadow-sm"
                                                    style={{ background: 'var(--gradient-vibrant)' }}
                                                >
                                                    {getInitials(request.requester.name)}
                                                </div>
                                            )}
                                            {request.online && (
                                                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="text-base font-bold text-gray-900 tracking-tight">{request.requester.name}</h3>
                                            {request.mutualFriends > 0 && (
                                                <div className="flex items-center gap-1 mt-0.5">
                                                    <Users size={12} className="text-primary-400" />
                                                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{request.mutualFriends} Mutual</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="h-10 px-5 bg-primary-600 text-white rounded-xl font-bold text-xs shadow-lg shadow-primary-100 hover:bg-primary-700 transition-all flex items-center gap-2"
                                            onClick={() => handleAccept(request.id)}
                                        >
                                            <UserCheck size={14} />
                                            Accept
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="h-10 w-10 bg-gray-50 text-gray-400 rounded-xl hover:bg-red-50 hover:text-red-500 transition-all flex items-center justify-center"
                                            onClick={() => handleDeclineRequest(request?.id)}
                                        >
                                            <UserX size={16} />
                                        </motion.button>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="py-20 text-center"
                            >
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <UserPlus size={24} className="text-gray-300" />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900 mb-1">No requests right now</h2>
                                <p className="text-gray-400 text-sm mb-6">You're all caught up with your connections!</p>
                                <button
                                    onClick={() => navigate('/feed')}
                                    className="px-5 py-2.5 bg-gray-900 text-white rounded-xl font-bold text-xs hover:bg-black transition-all flex items-center gap-2 mx-auto"
                                >
                                    Explore <ArrowRight size={14} />
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>
        </div>
    )
}

export default FriendRequests