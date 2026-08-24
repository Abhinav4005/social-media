import React, { useState } from "react";
import { Play, Heart, MessageCircle, Share2, Sparkles, TrendingUp, Music, Gamepad2, Tv, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Navbar from "../../../pages/Navbar";
import Sidebar from "../../../pages/Sidebar";
import FeedLayout from "../../../components/FeedLayout";
import { getWatchFeed, likePost } from "../../../api";
import { QUERY_KEYS } from "../../../constant/queryKeys";

const CATEGORIES = [
  { id: "all", label: "All Videos", icon: Sparkles },
  { id: "trending", label: "Trending", icon: TrendingUp },
  { id: "gaming", label: "Gaming", icon: Gamepad2 },
  { id: "music", label: "Music", icon: Music },
  { id: "tech", label: "Tech & Travel", icon: Tv },
];

const FALLBACK_VIDEOS = [
  {
    id: 1,
    title: "Minimal Desk Setup & Productivity 2024",
    channel: "Mindset Hub",
    views: "280K views",
    time: "3 days ago",
    duration: "10:14",
    category: "tech",
    likes: 1420,
    comments: 89,
    image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?q=80&w=600&auto=format&fit=crop",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  },
  {
    id: 2,
    title: "How to Build Better Habits & Daily Routine",
    channel: "Life Mastery",
    views: "1.5M views",
    time: "2 days ago",
    duration: "15:20",
    category: "trending",
    likes: 58200,
    comments: 1204,
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=600&auto=format&fit=crop",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  },
  {
    id: 3,
    title: "Easy 20-Minute Gourmet Pasta Cooking Class",
    channel: "Food & Recipes",
    views: "410K views",
    time: "5 days ago",
    duration: "08:45",
    category: "music",
    likes: 8900,
    comments: 310,
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=600&auto=format&fit=crop",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  },
  {
    id: 4,
    title: "Top 10 Unreal Engine 5 Indie Showcase Games",
    channel: "GamerCentral",
    views: "890K views",
    time: "1 day ago",
    duration: "14:10",
    category: "gaming",
    likes: 42100,
    comments: 950,
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
  },
];

export default function WatchPage() {
  const queryClient = useQueryClient();
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeVideo, setActiveVideo] = useState(null);
  const [likedVideos, setLikedVideos] = useState({});
  const [likeLocks, setLikeLocks] = useState({});

  const { data: dbPosts = [], isLoading } = useQuery({
    queryKey: QUERY_KEYS.watchFeed(activeCategory),
    queryFn: () => getWatchFeed(activeCategory),
  });

  const likeMutation = useMutation({
    mutationFn: (postId) => likePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.watchFeed(activeCategory) });
    },
  });

  // Map database video posts if available, combined with fallback curation for a full feed
  const dynamicDbVideos = dbPosts.map((post) => ({
    id: post.id,
    title: post.title || post.description || "Video Post",
    channel: post.user?.name || "Community Member",
    views: `${(post.post_likes?.length || 0) * 12 + 105} views`,
    time: "Recently",
    duration: "05:30",
    category: "trending",
    likes: post.post_likes?.length || 0,
    comments: post.comments?.length || 0,
    image: post.image || "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?q=80&w=600&auto=format&fit=crop",
    videoUrl: post.video || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  }));

  const allFeed = [...dynamicDbVideos, ...FALLBACK_VIDEOS];
  const filteredVideos =
    activeCategory === "all"
      ? allFeed
      : allFeed.filter((v) => v.category === activeCategory);

  const toggleLike = (id) => {
    if (likeLocks[id]) return;
    setLikeLocks((prev) => ({ ...prev, [id]: true }));
    setLikedVideos((prev) => ({ ...prev, [id]: !prev[id] }));
    if (typeof id === "number" && id > 10) {
      likeMutation.mutate(id);
    }
    setTimeout(() => {
      setLikeLocks((prev) => ({ ...prev, [id]: false }));
    }, 1000);
  };

  return (
    <>
      <Navbar />
      <FeedLayout
        left={<Sidebar />}
        center={
          <div className="space-y-6">
            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${isActive
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/30 scale-105"
                      : "bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800"
                      }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {cat.label}
                  </button>
                );
              })}
            </div>

            {/* Featured Hero Video */}
            <div className="overflow-hidden rounded-3xl bg-black border border-gray-100 dark:border-slate-800 shadow-xl relative group">
              <div className="relative aspect-video w-full overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop"
                  alt="Featured Video"
                  className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex items-center justify-center">
                  <motion.button
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() =>
                      setActiveVideo({
                        title: "Explore the Hidden Paradise of Islands",
                        channel: "Travel Lovers",
                        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
                      })
                    }
                    className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center text-indigo-600 shadow-2xl transition-transform cursor-pointer"
                  >
                    <Play className="w-8 h-8 fill-indigo-600 ml-1" />
                  </motion.button>
                </div>
                <span className="absolute bottom-4 right-4 bg-black/80 text-white text-xs font-bold px-2.5 py-1 rounded-md">
                  12:45
                </span>
              </div>
              <div className="p-5 text-white bg-gradient-to-b from-gray-900 to-black">
                <h2 className="text-xl font-black tracking-tight">Explore the Hidden Paradise of Islands</h2>
                <p className="text-xs font-semibold text-gray-400 mt-1">Travel Lovers • 2.3M views • 2 days ago</p>
              </div>
            </div>

            {/* Video Feed List */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-black text-gray-900 dark:text-gray-100 tracking-tight">
                  Recommended Videos
                </h3>
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer">
                  {filteredVideos.length} videos
                </span>
              </div>

              <div className="space-y-4">
                {filteredVideos.map((video) => {
                  const isLiked = likedVideos[video.id];
                  return (
                    <motion.div
                      key={video.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-col sm:flex-row gap-4 p-3 bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-xs hover:shadow-md transition-all group"
                    >
                      <div
                        onClick={() => setActiveVideo(video)}
                        className="relative w-full sm:w-48 h-32 rounded-xl overflow-hidden flex-shrink-0 cursor-pointer"
                      >
                        <img
                          src={video.image}
                          alt={video.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                          <Play className="w-8 h-8 text-white opacity-80 group-hover:opacity-100 transition-opacity fill-white" />
                        </div>
                        <span className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                          {video.duration}
                        </span>
                      </div>

                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div>
                          <h4
                            onClick={() => setActiveVideo(video)}
                            className="font-bold text-sm text-gray-900 dark:text-gray-100 leading-snug cursor-pointer hover:text-indigo-600 transition-colors"
                          >
                            {video.title}
                          </h4>
                          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-1">
                            {video.channel}
                          </p>
                          <p className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 mt-0.5">
                            {video.views} • {video.time}
                          </p>
                        </div>

                        {/* Interactive Buttons */}
                        <div className="flex items-center gap-4 mt-3 sm:mt-0">
                          <button
                            onClick={() => toggleLike(video.id)}
                            className={`flex items-center gap-1 text-xs font-bold transition-colors cursor-pointer ${isLiked ? "text-rose-500" : "text-gray-400 hover:text-rose-500"
                              }`}
                          >
                            <Heart className={`w-4 h-4 ${isLiked ? "fill-rose-500" : ""}`} />
                            {video.likes + (isLiked ? 1 : 0)}
                          </button>
                          <button className="flex items-center gap-1 text-xs font-bold text-gray-400 hover:text-indigo-500 transition-colors cursor-pointer">
                            <MessageCircle className="w-4 h-4" />
                            {video.comments}
                          </button>
                          <button className="flex items-center gap-1 text-xs font-bold text-gray-400 hover:text-indigo-500 transition-colors cursor-pointer">
                            <Share2 className="w-4 h-4" />
                            Share
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        }
      />

      {/* Video Modal Player */}
      <AnimatePresence>
        {activeVideo && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-4xl bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-800"
            >
              <div className="relative aspect-video w-full bg-black">
                <video
                  src={activeVideo.videoUrl}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="p-6 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white leading-tight">{activeVideo.title}</h2>
                  <p className="text-sm font-semibold text-slate-400 mt-1">{activeVideo.channel}</p>
                </div>
                <button
                  onClick={() => setActiveVideo(null)}
                  className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

