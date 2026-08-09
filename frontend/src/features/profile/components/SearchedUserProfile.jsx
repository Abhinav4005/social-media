import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import {
  UserRoundCheck,
  UserRoundPlus,
  MessageSquare,
  MapPin,
  Calendar,
  Shield,
  Globe,
  Info,
  Grid2X2,
  UsersRound,
  CheckCircle2,
  ShieldCheck,
  Share2,
  Sparkles,
} from "lucide-react";
import Navbar from "../../../pages/Navbar";
import Button from "../../../components/UI/Button";
import PostCard from "../../posts/components/PostCard";
import { createOrGetRoom, getUserById, sendFriendRequest } from "../../../api";
import { privacyService } from "../../../services/privacy.service";
import { QUERY_KEYS } from "../../../constant/queryKeys";
import UserAvatar from "../../../components/Common/UserAvatar";
import TabBar from "../../../components/Common/TabBar";
import EmptyState from "../../../components/Common/EmptyState";
import { BRAND_THEME } from "../../../constant/constant";

const formatJoined = (date) => {
  if (!date) return "Recently";
  return new Intl.DateTimeFormat("en", { month: "short", year: "numeric" }).format(new Date(date));
};

const SearchedUserProfile = () => {
  const { user: currentUser } = useSelector((state) => state.auth);
  const { userId } = useParams();
  const navigate = useNavigate();
  const [requestSent, setRequestSent] = useState(false);
  const [isFriend, setIsFriend] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");

  const { data: user, isLoading, isError } = useQuery({
    queryKey: QUERY_KEYS.user(userId),
    queryFn: () => getUserById({ userId }),
    enabled: !!userId,
  });

  useEffect(() => {
    if (!user || !currentUser) return;

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
      navigate(`/chat/${room?.id}`);
    },
    onError: (err) => {
      console.error("Room creation failed:", err);
    },
  });

  const handleMessage = () => {
    mutation.mutate();
  };

  const sentRequestMutation = useMutation({
    mutationFn: (addresseeId) => sendFriendRequest(addresseeId),
    onMutate: () => {
      setRequestSent(true);
    },
    onError: (err) => {
      console.error("Error sending friend request:", err);
      setRequestSent(false);
    },
  });

  const handleFriendRequest = (addresseeId) => {
    sentRequestMutation.mutate(addresseeId);
  };

  const initials = useMemo(() => {
    if (!user?.name) return "U";
    return user.name
      .split(" ")
      .map((part) => part[0]?.toUpperCase())
      .slice(0, 2)
      .join("");
  }, [user?.name]);

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: `${user?.name || "Profile"} on Social Hub`,
        url: window.location.href,
      });
      return;
    }
    await navigator.clipboard?.writeText(window.location.href);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col">
        <Navbar />
        <div className="mx-auto max-w-6xl w-full px-4 sm:px-6 py-6 space-y-6">
          <div className="h-80 rounded-3xl animate-shimmer" />
          <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
            <div className="h-48 rounded-3xl animate-shimmer" />
            <div className="h-96 rounded-3xl animate-shimmer" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="text-center max-w-md bg-white dark:bg-slate-900 p-8 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-xs">
            <Shield className="w-12 h-12 text-rose-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">User Not Found</h2>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-2">
              The user profile you are looking for does not exist or has been removed.
            </p>
            <Button onClick={() => navigate(-1)} className="mt-6 bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold text-xs">
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const postsList = user.posts || [];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 dark:bg-slate-950 px-4 sm:px-6 py-6 transition-colors duration-200">
        <div className="mx-auto max-w-6xl space-y-6">

          {/* User Profile Header Card */}
          <div className="rounded-3xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs overflow-hidden transition-colors duration-200">
            <div className="relative h-56 sm:h-64 overflow-hidden">
              {user.coverImage ? (
                <img
                  src={user.coverImage}
                  alt="Cover"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            </div>

            <div className="px-6 pb-6 pt-0 sm:px-8">
              <div className="flex items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-4 relative z-10">
                <UserAvatar
                  name={user?.name}
                  profileImage={user?.profileImage}
                  size="2xl"
                  shape="circle"
                  showOnline
                  ring="ring-4 ring-white dark:ring-slate-900"
                />

                <div className="flex items-center gap-2.5 pb-1 flex-wrap">
                  {isFriend ? (
                    <div className="flex items-center gap-2 px-4 py-2.5 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold text-xs rounded-xl border border-indigo-100 dark:border-indigo-900/50">
                      <UserRoundCheck className="h-4 w-4" />
                      Friends
                    </div>
                  ) : requestSent ? (
                    <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-gray-400 font-bold text-xs rounded-xl border border-gray-200 dark:border-slate-700">
                      <UserRoundCheck className="h-4 w-4 text-gray-400" />
                      Request Sent
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleFriendRequest(user?.id)}
                      className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md hover:shadow-indigo-500/20 active:scale-95 transition-all cursor-pointer"
                    >
                      <UserRoundPlus className="h-4 w-4" />
                      Add Friend
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleMessage}
                    className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
                    title="Message User"
                  >
                    <MessageSquare className="h-4 w-4" />
                    Message
                  </button>

                  <button
                    type="button"
                    onClick={handleShare}
                    className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-200 font-bold text-xs rounded-xl border border-gray-200 dark:border-slate-700 transition-all cursor-pointer"
                  >
                    <Share2 className="h-4 w-4" />
                    Share
                  </button>

                  <button
                    type="button"
                    onClick={async () => {
                      if (window.confirm(`Are you sure you want to block ${user.name}?`)) {
                        try {
                          await privacyService.blockUser(user.id);
                          alert(`${user.name} has been blocked.`);
                          navigate("/");
                        } catch (err) {
                          alert(err.message || "Failed to block user");
                        }
                      }
                    }}
                    className="p-2.5 bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/50 rounded-xl border border-rose-100 dark:border-rose-900/50 transition-all cursor-pointer"
                    title="Block User"
                  >
                    <Shield className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="font-black text-2xl sm:text-3xl text-gray-900 dark:text-gray-100 tracking-tight">
                    {user.name}
                  </h1>
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-white shadow-xs">
                    <ShieldCheck className="h-3.5 w-3.5" />
                  </span>
                  <span className="px-2.5 py-0.5 bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase rounded-full">
                    Member
                  </span>
                </div>

                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300 max-w-2xl leading-relaxed">
                  {user.bio || "Connecting with people and sharing ideas on Social Hub."}
                </p>

                <div className="flex flex-wrap gap-4 text-xs font-semibold text-gray-500 dark:text-gray-400 pt-1">
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-indigo-500" />
                    {user.location || "Location not set"}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-indigo-500" />
                    Joined {formatJoined(user.createdAt)}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
                    <Globe className="h-3.5 w-3.5" />
                    @{user.name.replace(/\s+/g, "").toLowerCase()}
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-3">
                <TabBar
                  tabs={[
                    { id: "posts", label: "Posts", badge: postsList.length, icon: <Grid2X2 className="h-4 w-4" /> },
                    { id: "about", label: "About", icon: <Info className="h-4 w-4" /> },
                  ]}
                  activeTab={activeTab}
                  onChange={setActiveTab}
                  variant="pill"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">

            <aside className="space-y-5">
              
              <section className="rounded-3xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs transition-colors duration-200">
                <h3 className="text-xs font-black uppercase tracking-wider text-gray-400 dark:text-gray-400 mb-4">Activity Overview</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-gray-100 dark:border-slate-800 bg-gray-50/60 dark:bg-slate-800/40 p-4 text-center transition-all">
                    <div className="mx-auto mb-1.5 flex h-7 w-7 items-center justify-center rounded-xl bg-white dark:bg-slate-800 text-primary-600 dark:text-primary-400 shadow-xs">
                      <Grid2X2 className="h-3.5 w-3.5" />
                    </div>
                    <p className="font-black text-lg text-gray-900 dark:text-gray-100">{postsList.length}</p>
                    <p className="text-[10px] font-bold text-gray-400 dark:text-gray-400 uppercase mt-0.5">Posts</p>
                  </div>

                  <div className="rounded-2xl border border-gray-100 dark:border-slate-800 bg-gray-50/60 dark:bg-slate-800/40 p-4 text-center transition-all">
                    <div className="mx-auto mb-1.5 flex h-7 w-7 items-center justify-center rounded-xl bg-white dark:bg-slate-800 text-primary-600 dark:text-primary-400 shadow-xs">
                      <UsersRound className="h-3.5 w-3.5" />
                    </div>
                    <p className="font-black text-lg text-gray-900 dark:text-gray-100">{user.followers?.length || 0}</p>
                    <p className="text-[10px] font-bold text-gray-400 dark:text-gray-400 uppercase mt-0.5">Followers</p>
                  </div>
                </div>
              </section>

              <section className="rounded-3xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs transition-colors duration-200">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="h-4 w-4 text-primary-500" />
                  <h3 className="text-xs font-black uppercase tracking-wider text-gray-400 dark:text-gray-400">About</h3>
                </div>
                <p className="text-xs font-medium leading-relaxed text-gray-600 dark:text-gray-300">
                  {user.about || user.bio || "No detailed bio added yet."}
                </p>
              </section>
            </aside>

            <main className="space-y-4">
              {activeTab === "posts" && (
                postsList.length > 0 ? (
                  <div className="space-y-4">
                    {postsList.map((post) => (
                      <PostCard
                        key={post.id}
                        {...post}
                        user={post.user || { id: user.id, name: user.name, profileImage: user.profileImage }}
                      />
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    icon={Grid2X2}
                    title="No posts yet"
                    description={`${user.name} hasn't published any posts yet.`}
                  />
                )
              )}

              {activeTab === "about" && (
                <div className="rounded-3xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs transition-colors duration-200">
                  <h3 className="text-sm font-black text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-4 bg-primary-600 rounded-full" />
                    Bio & Information
                  </h3>
                  <p className="text-xs font-medium leading-relaxed text-gray-600 dark:text-gray-300">
                    {user.about || user.bio || "No additional information provided."}
                  </p>
                </div>
              )}
            </main>
          </div>
        </div>
      </main>
    </>
  );
};

export default SearchedUserProfile;
