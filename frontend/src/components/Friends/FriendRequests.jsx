import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { cancelFriendRequest, getFriendRequests, respondToFriendRequest } from '../../api';
import Navbar from '../../pages/Navbar';

const FriendRequests = () => {

    const queryClient = useQueryClient();

    const { data, isLoading, isError } = useQuery({
        queryKey: ['friendRequests'],
        queryFn: getFriendRequests,
        enabled: true,
        refetchOnWindowFocus: false,
    });

    const [requests, setRequests] = useState(data?.requests);

    useEffect(() => {
        if (data?.requests) {
            setRequests(data.requests);
        }
    }, [data]);

    const requestRespondMutation = useMutation({
        mutationFn: ({ requestId, action }) => {
            console.log("Mutating with Action:", action, "for Request ID:", requestId);
            return respondToFriendRequest(requestId, action);
        },
        onMutate: async ({ requestId, action }) => {
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

    const handleAccept = (requestId, action) => {
        console.log("Handling Accept with Action:", action, "for Request ID:", requestId);
        requestRespondMutation.mutate({ requestId, action });
    }

    const handleDecline = useMutation({
        mutationFn: (requestId) => cancelFriendRequest(requestId),
        onMutate: async (requestId) => {
            await queryClient.cancelQueries({ queryKey: ['friendRequests'] });

            const previousRequest = queryClient.getQueryData(['friendRequests']);

            queryClient.setQueryData(['friendRequests'], (old) => {
                if(!old) return old;
                return {
                    ...old,
                    requests: old.requests.filter(req => req.id !== requestId)
                }
            })
            return { previousRequest };
        },
        onError: (err, requestId, context) => {
            if(context?.previousRequest) {
                queryClient.setQueryData(['friendRequests'], context.previousRequest);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['friendRequests'] });
        }
    })

    const handleDeclineRequest = (requestId) => {
        console.log("Handling Decline for Request ID:", requestId);
        handleDecline.mutate(requestId);
    }

    return (
        <>
            <Navbar />
            <div className='min-h-screen bg-gray-100 p-6'>
                <h1 className='text-2xl font-bold mb-6 text-gray-800'>Friend Requests</h1>
                <AnimatePresence>
                    {requests?.length > 0 ? (
                        <div className='grid gap-4'>
                            {requests.map((request, index) => {
                                return (
                                    <motion.div
                                        key={request.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: 200, scale: 0.8 }}
                                        transition={{ delay: index * 0.1 }}
                                        className='flex items-center justify-between bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow'
                                    >
                                        <div className='flex items-center gap-4'>
                                            <div className='relative'>
                                                <img
                                                    src={request.requester.profilImage}
                                                    alt={request.requester.name}
                                                    className='w-12 h-12 rounded-full object-cover'
                                                />
                                                {request.online && (
                                                    <span className='absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full'></span>
                                                )}
                                            </div>
                                            <div>
                                                <span className='text-gray-700'>{request.requester.name}</span>
                                                {request.mutualFriends > 0 && (
                                                    <p className='text-sm text-gray-500'>{request.mutualFriends} mutual friend(s)</p>
                                                )}
                                            </div>
                                            <div className='flex gap-2 ml-4'>
                                                <motion.button
                                                    whileHover={{ scale: 0.9 }}
                                                    className='px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition'
                                                    onClick={() => handleAccept(request.id, "ACCEPTED")}
                                                >
                                                    Accept
                                                </motion.button>
                                                <motion.button
                                                    whileHover={{ scale: 0.9 }}
                                                    className='px-4 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition'
                                                    onClick={() => handleDeclineRequest(request?.id)}
                                                >
                                                    Decline
                                                </motion.button>
                                            </div>
                                        </div>
                                    </motion.div>
                                )
                            })}
                        </div>
                    ) : (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-center text-gray-500 mt-10"
                        >
                            No friend requests at the moment.
                        </motion.p>
                    )}
                </AnimatePresence>
            </div>
        </>
    )
}

export default FriendRequests