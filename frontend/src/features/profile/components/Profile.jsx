import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  Bookmark,
  CalendarDays,
  CheckCircle2,
  Edit3,
  ExternalLink,
  Grid2X2,
  Image as ImageIcon,
  Info,
  Link2,
  MapPin,
  MessageCircle,
  Share2,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  UserRound,
  UsersRound,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getSavedPosts, getUserFollowers, getUserFollowing, getUserPosts, getUserProfile } from "../../../api";
import Navbar from "../../../pages/Navbar";
import UserAvatar from "../../../components/Common/UserAvatar";
import TabBar from "../../../components/Common/TabBar";
import { QUERY_KEYS } from "../../../constant/queryKeys";
import { ROUTES } from "../../../constant/routes";
import { BRAND_THEME } from "../../../constant/constant";
import PostCard from "../../posts/components/PostCard";

const formatJoined = (date) => {
  if (!date) return "Recently";
  return new Intl.DateTimeFormat("en", { month: "short", year: "numeric" }).format(new Date(date));
};

const formatCount = (num) => {
  if (!num) return "0";
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
};

const ProfileSkeleton = () => (
  <>
    <Navbar />
    <main className="min-h-screen bg-gray-50 dark:bg-slate-950 px-4 py-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="h-80 rounded-3xl animate-shimmer" />
        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <div className="space-y-4">
            <div className="h-48 rounded-3xl animate-shimmer" />
            <div className="h-40 rounded-3xl animate-shimmer" />
          </div>
          <div className="h-96 rounded-3xl animate-shimmer" />
        </div>
      </div>
    </main>
  </>
);

const EmptyPanel = ({ icon, title, text }) => (
  <div className="rounded-3xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center shadow-xs transition-colors duration-200">
    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
      {icon}
    </div>
    <h3 className="font-black text-base text-gray-900 dark:text-gray-100">{title}</h3>
    <p className="mx-auto mt-1.5 max-w-sm text-xs font-semibold leading-relaxed text-gray-400 dark:text-gray-400">{text}</p>
  </div>
);

export default function Profile() {
  const [activeTab, setActiveTab] = useState("posts");

  const { data: userProfile, isLoading, isError } = useQuery({
    queryKey: QUERY_KEYS.userProfile,
    queryFn: getUserProfile,
  });

  const { data: posts = [] } = useQuery({
    queryKey: QUERY_KEYS.userPosts,
    queryFn: getUserPosts,
  });

  const { data: savedPosts = [] } = useQuery({
    queryKey: QUERY_KEYS.saved,
    queryFn: getSavedPosts,
  });

  const { data: followers = [] } = useQuery({
    queryKey: QUERY_KEYS.followers,
    queryFn: getUserFollowers,
  });

  const { data: following = [] } = useQuery({
    queryKey: QUERY_KEYS.following,
    queryFn: getUserFollowing,
  });

  const initials = useMemo(() => {
    if (!userProfile?.name) return "U";
    return userProfile.name
      .split(" ")
      .map((part) => part[0]?.toUpperCase())
      .slice(0, 2)
      .join("");
  }, [userProfile?.name]);

  const photoPosts = useMemo(() => posts.filter((post) => post?.image), [posts]);

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: `${userProfile?.name || "Profile"} on Social Hub`,
        url: window.location.href,
      });
      return;
    }
    await navigator.clipboard?.writeText(window.location.href);
  };

  if (isLoading) return <ProfileSkeleton />;

  if (isError || !userProfile) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-gray-50 dark:bg-slate-950 px-4 py-8 transition-colors duration-200">
          <div className="mx-auto max-w-6xl">
            <EmptyPanel
              icon={<Info className="h-6 w-6" />}
              title="Profile unavailable"
              text="We could not load your profile right now. Please refresh and try again."
            />
          </div>
        </main>
      </>
    );
  }

  const profileHealthItems = [
    {
      icon: <UserRound className="h-4 w-4" />,
      label: "Identity",
      status: "Good",
      statusColor: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-100 dark:border-emerald-900/50",
      iconColor: "text-indigo-500 bg-indigo-50 dark:bg-indigo-950/50",
    },
    {
      icon: <ImageIcon className="h-4 w-4" />,
      label: "Media",
      status: userProfile.profileImage ? "Set" : "Missing",
      statusColor: userProfile.profileImage ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-100 dark:border-emerald-900/50" : "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 border border-amber-100 dark:border-amber-900/50",
      iconColor: "text-indigo-500 bg-indigo-50 dark:bg-indigo-950/50",
    },
    {
      icon: <MessageCircle className="h-4 w-4" />,
      label: "Social",
      status: `${formatCount(followers.length)} followers`,
      statusColor: "text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700",
      iconColor: "text-indigo-500 bg-indigo-50 dark:bg-indigo-950/50",
    },
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 dark:bg-slate-950 px-4 sm:px-6 py-6 transition-colors duration-200">
        <div className="mx-auto max-w-6xl space-y-6">

          {/* Profile Header Card */}
          <div className="rounded-3xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs overflow-hidden transition-colors duration-200">
            <div className="relative h-56 sm:h-64 overflow-hidden">
              {userProfile.coverImage ? (
                <img
                  src={userProfile.coverImage}
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
                  name={userProfile.name}
                  profileImage={userProfile.profileImage}
                  size="2xl"
                  shape="circle"
                  showOnline
                  ring="ring-4 ring-white dark:ring-slate-900"
                />

                <div className="flex items-center gap-2.5 pb-1">
                  <Link
                    to={ROUTES.UPDATE_PROFILE}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-primary-200 dark:shadow-none hover:bg-primary-700 transition-all duration-200"
                  >
                    <Edit3 className="h-4 w-4" />
                    Edit Profile
                  </Link>
                  <button
                    type="button"
                    onClick={handleShare}
                    className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-200 font-bold text-xs rounded-xl border border-gray-200 dark:border-slate-700 transition-all cursor-pointer"
                  >
                    <Share2 className="h-4 w-4" />
                    Share
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="font-black text-2xl sm:text-3xl text-gray-900 dark:text-gray-100 tracking-tight">
                    {userProfile.name}
                  </h1>
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-white shadow-xs">
                    <ShieldCheck className="h-3.5 w-3.5" />
                  </span>
                </div>

                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300 max-w-2xl leading-relaxed">
                  {userProfile.bio || "Building products, sharing ideas, and connecting with people around the world."}
                </p>

                <div className="flex flex-wrap gap-4 text-xs font-semibold text-gray-500 dark:text-gray-400 pt-1">
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-indigo-500" />
                    {userProfile.location || "Location not set"}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays className="h-3.5 w-3.5 text-indigo-500" />
                    Joined {formatJoined(userProfile.createdAt)}
                  </span>
                  {userProfile.website && (
                    <a
                      href={userProfile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      <Link2 className="h-3.5 w-3.5" />
                      Website
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>

              <div className="mt-6 pt-3">
                <TabBar
                  tabs={[
                    { id: "posts", label: "Posts", badge: posts.length, icon: <Grid2X2 className="h-4 w-4" /> },
                    { id: "photos", label: "Photos", badge: photoPosts.length, icon: <ImageIcon className="h-4 w-4" /> },
                    { id: "bookmarks", label: "Saved Bookmarks", badge: savedPosts.length, icon: <Bookmark className="h-4 w-4" /> },
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
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: "Posts", value: posts.length, icon: <Grid2X2 className="h-3.5 w-3.5" /> },
                    { label: "Followers", value: followers.length, icon: <UsersRound className="h-3.5 w-3.5" /> },
                    { label: "Following", value: following.length, icon: <TrendingUp className="h-3.5 w-3.5" /> },
                  ].map(({ label, value, icon }) => (
                    <div
                      key={label}
                      className="rounded-2xl border border-gray-100 dark:border-slate-800 bg-gray-50/60 dark:bg-slate-800/40 p-3 text-center transition-all hover:border-indigo-200 dark:hover:border-indigo-900/50 hover:bg-indigo-50/20"
                    >
                      <div className="mx-auto mb-1.5 flex h-7 w-7 items-center justify-center rounded-xl bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs">
                        {icon}
                      </div>
                      <p className="font-black text-base text-gray-900 dark:text-gray-100">{formatCount(value)}</p>
                      <p className="text-[10px] font-bold text-gray-400 dark:text-gray-400 uppercase mt-0.5">{label}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-3xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs transition-colors duration-200">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="h-4 w-4 text-indigo-500" />
                  <h3 className="text-xs font-black uppercase tracking-wider text-gray-400 dark:text-gray-400">About Me</h3>
                </div>
                <p className="text-xs font-medium leading-relaxed text-gray-600 dark:text-gray-300">
                  {userProfile.about || "No detailed bio added yet. Tell your friends and followers what you care about!"}
                </p>
              </section>

              <section className="rounded-3xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs transition-colors duration-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-black uppercase tracking-wider text-gray-400 dark:text-gray-400">Profile Health</h3>
                  <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 rounded-lg">100%</span>
                </div>

                <div className="w-full bg-gray-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden mb-4">
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-full w-full rounded-full" />
                </div>

                <div className="space-y-3">
                  {profileHealthItems.map((item) => (
                    <div key={item.label} className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5 text-xs font-bold text-gray-700 dark:text-gray-300">
                        <span className={`p-1.5 rounded-lg ${item.iconColor}`}>{item.icon}</span>
                        <span>{item.label}</span>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold ${item.statusColor}`}>
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            </aside>

            <main className="space-y-4">
              {activeTab === "posts" && (
                posts.length > 0 ? (
                  <div className="space-y-4">
                    {posts.map((post) => (
                      <PostCard
                        key={post.id}
                        {...post}
                        user={post.user || { id: userProfile.id, name: userProfile.name, profileImage: userProfile.profileImage }}
                      />
                    ))}
                  </div>
                ) : (
                  <EmptyPanel
                    icon={<Grid2X2 className="h-6 w-6" />}
                    title="No posts yet"
                    text="Share your first post with the community to get started!"
                  />
                )
              )}

              {activeTab === "photos" && (
                photoPosts.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {photoPosts.map((post) => (
                      <motion.div
                        key={post.id}
                        whileHover={{ scale: 1.02 }}
                        className="group relative aspect-square rounded-2xl overflow-hidden border border-gray-100 dark:border-slate-800 shadow-xs bg-slate-900 cursor-pointer"
                      >
                        <img src={post.image} alt={post.title || "Photo"} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-3 text-white text-center">
                          <p className="text-xs font-bold truncate">{post.title || "View Post"}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <EmptyPanel
                    icon={<ImageIcon className="h-6 w-6" />}
                    title="No photo posts"
                    text="Photos you attach to your posts will automatically appear here."
                  />
                )
              )}

              {activeTab === "bookmarks" && (
                savedPosts.length > 0 ? (
                  <div className="space-y-4">
                    {savedPosts.map((post) => (
                      <PostCard key={post.id} {...post} />
                    ))}
                  </div>
                ) : (
                  <EmptyPanel
                    icon={<Bookmark className="h-6 w-6" />}
                    title="No saved bookmarks"
                    text="Posts you bookmark will be saved here for quick access."
                  />
                )
              )}
            </main>
          </div>
        </div>
      </main>
    </>
  );
}
