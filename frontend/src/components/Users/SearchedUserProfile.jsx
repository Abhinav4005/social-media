import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import Button from "../UI/Button";
import Navbar from "../../pages/Navbar";
import { createOrGetRoom, followUser, getUserById, sendFriendRequest } from "../../api";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { UserRoundCheck, UserRoundPlus } from "lucide-react";

const SearchedUserProfile = () => {
    const { user: currentUser } = useSelector((state) => state.auth);
    const { userId } = useParams();
    const navigate = useNavigate();
    const [isFollower, setIsFollower] = useState(false);
    const [requestSent, setRequestSent] = useState(false);
    const [isFriend, setIsFriend] = useState(false);
    const [isAccepted, setIsAccepted] = useState(false);

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
        const requestSentCheck =
            user?.requestedFriendShips?.some(
                (request) =>
                    request?.addresseeId === currentUser.id && request?.status === "PENDING"
            ) ||
            user?.receivedFriendShips?.some(
                (request) =>
                    request?.requesterId === currentUser.id && request?.status === "PENDING"
            );
        setRequestSent(requestSentCheck || false);

        const checkIsFriend =
            user?.receivedFriendShips?.some(
                (request) => request?.requesterId === currentUser?.id && request?.status === "ACCEPTED"
            ) ||
            user?.requestedFriendShips?.some(
                (request) => request?.addresseeId === currentUser?.id && request?.status === "ACCEPTED"
            );
        setIsFriend(checkIsFriend || false);

    }, [userId, user?.followers, user?.requestedFriendShips, user?.receivedFriendShips]);

    // useEffect(() => {
    //     if(!user || !currentUser) return;

    //     const isFollower = user.followers.some(follower => follower.followerId === currentUser.id) || false;

    //     const allRequests = [
    //         ...(user?.requestedFriendShips || []),
    //         ...(user?.receivedFriendShips || []),
    //     ];

    //     const { requestSent, isFriend } = allRequests.reduce((acc, request) => {
    //         if(!acc.requestSent && request.status === "PENDING" 
    //             && (request.addresseeId === currentUser.id || request.requesterId === currentUser.id)
    //         ){
    //             acc.requestSent = true;
    //         }

    //         if(!acc.isFriend && request.status === "ACCEPTED" && 
    //             (request.addresseeId === currentUser.id || request.requesterId === currentUser.id)
    //         ){
    //             acc.isFriend = true;
    //         }

    //         if(acc.requestSent && acc.isFriend) return acc;

    //         return acc;
    //     },{
    //         requestSent: false,
    //         isFriend: false
    //     });
    //     setIsFollower(isFollower);
    //     setRequestSent(requestSent);
    //     setIsFriend(isFriend);
    // })

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

    const followMutation = useMutation({
        mutationFn: (followingId) => followUser(followingId),
        onMutate: () => {
            setIsFollower((prev) => !prev);
        },
        onError: (err) => {
            console.error("Error following/unfollowing user:", err);
            setIsFollower((prev) => !prev);
        }
    })

    const handleFollow = (followingId) => {
        followMutation.mutate(followingId);
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

    if (isLoading) return <p className="text-center py-20">⏳ Loading user...</p>;
    if (isError || !user) return <p className="text-center py-20 text-red-500">⚠️ Failed to load user</p>;

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-3xl mx-auto p-6">
                <div className="flex items-center gap-6 mb-6">
                    <div className="w-24 h-24 rounded-full bg-indigo-500 text-white flex items-center justify-center text-2xl font-bold">
                        {user.name
                            .split(" ")
                            .map((n) => n[0]?.toUpperCase())
                            .slice(0, 2)
                            .join("")}
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold capitalize">{user.name}</h1>
                    </div>
                </div>
                <div className="flex gap-4 mb-6">
                    {isFriend ? (
                        <Button
                            className="bg-blue-500 text-white px-6 py-2 rounded-xl flex items-center gap-1"
                        >
                            {<UserRoundCheck />} Friends
                        </Button>
                    ) : (
                        <Button
                            className="bg-blue-500 text-white px-6 py-2 rounded-xl flex items-center gap-1"
                            onClick={() => handleFriendRequest(user?.id)}
                        >
                            {requestSent ? "Cancel Request" : (<><UserRoundPlus /> Add Friend</>)}
                        </Button>
                    )}
                    {/* <Button className="bg-indigo-500 text-white px-6 py-2 rounded-xl" onClick={() => handleFollow(user?.id)}>
                        {isFollower ? "Unfollow" : "Follow"}
                    </Button> */}
                    <Button className="bg-green-500 text-white px-6 py-2 rounded-xl" onClick={handleMessage}>
                        Message
                    </Button>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow">
                    <h2 className="text-xl font-semibold">About</h2>
                    <p>{user?.bio || "No info available"}</p>
                </div>

                {/* User Posts Section */}
                {user.posts && user.posts.length > 0 && (
                    <div className="mt-8">
                        <h2 className="text-xl font-semibold mb-4">Posts</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {user.posts.map((post) => (
                                <div key={post.id} className="bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden">
                                    <img
                                        src={post.image}
                                        alt={post.title}
                                        className="w-full h-48 object-cover"
                                    />
                                    <div className="p-4">
                                        <h3 className="font-semibold text-gray-900 truncate">{post.title}</h3>
                                        <div className="flex justify-between text-gray-500 text-sm mt-2">
                                            <span>❤️ {post.post_likes?.length || 0}</span>
                                            <span>💬 {post.comments?.length || 0}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default SearchedUserProfile;