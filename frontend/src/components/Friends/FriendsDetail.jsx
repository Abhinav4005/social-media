import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import Button from "../UI/Button";
import Navbar from "../../pages/Navbar";
import { createOrGetRoom, followUser, getUserById } from "../../api";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const FriendsDetail = () => {
    const {user: currentUser } = useSelector((state) => state.auth);
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

    console.log("Fetched user data:", currentUser);

    useEffect(() => {
        user?.followers?.forEach(follower => {
            if (follower.followerId === currentUser?.id ) setIsFollower(true);
        });
    }, [userId, user?.followers]);

    console.log("Is Follower:", isFollower);

    const mutation = useMutation({
        mutationFn: () => createOrGetRoom(null, "DM", [userId]),
        onSuccess:(room) => {
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
            
        }
    })

    const handleFollow = (followingId) => {
        followMutation.mutate(followingId);
    }

    // const handleFollowClick = () => {
    //     handleFollow(user?.id);
    // }

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
                        {/* <p className="text-gray-500">{user.email || "No email"}</p> */}
                    </div>
                </div>

                <div className="flex gap-4 mb-6">
                    <Button className="bg-indigo-500 text-white px-6 py-2 rounded-xl" onClick={()=> handleFollow(user?.id)}>
                        {isFollower ? "Unfollow" : "Follow"}
                    </Button>
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

export default FriendsDetail;