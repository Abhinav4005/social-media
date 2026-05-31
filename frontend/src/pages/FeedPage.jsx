import FeedLayout from "../components/FeedLayout";
import PostCard from "../components/Posts/PostCard";
import Sidebar from "./Sidebar";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getPostFeed } from "../api";
import CreatePostModal from "../Modal/CreatePostModal";
import { useCallback, useEffect, useState } from "react";
import Notifications from "./Notification";
import { useSelector } from "react-redux";
import StoryTray from "../components/Strories/StoryTray";
import { motion } from "framer-motion";
import { Camera, Loader2, Smile, Video } from "lucide-react";
import { isUserOnline } from "../utils/messageStatus";

const PostShimmer = () => (
  <div className="mb-5 rounded-3xl border border-gray-100 bg-white p-5 shadow-[0_22px_60px_-42px_rgba(15,23,42,0.45)]">
    <div className="flex items-center gap-4 mb-5">
      <div className="w-12 h-12 rounded-full animate-shimmer bg-gray-200"></div>
      <div className="flex-1 space-y-2">
        <div className="w-32 h-4 rounded animate-shimmer bg-gray-200"></div>
        <div className="w-20 h-3 rounded animate-shimmer bg-gray-200"></div>
      </div>
    </div>
    <div className="space-y-3 mb-5">
      <div className="w-full h-4 rounded animate-shimmer bg-gray-200"></div>
      <div className="w-5/6 h-4 rounded animate-shimmer bg-gray-200"></div>
      <div className="w-2/3 h-4 rounded animate-shimmer bg-gray-200"></div>
    </div>
    <div className="w-full h-64 rounded-2xl animate-shimmer bg-gray-200 mb-5"></div>
    <div className="flex gap-6 pt-4 border-t border-gray-50">
      <div className="w-20 h-6 rounded animate-shimmer bg-gray-200"></div>
      <div className="w-20 h-6 rounded animate-shimmer bg-gray-200"></div>
    </div>
  </div>
);

const ErrorState = ({ refetch }) => (
  <div className="bg-white border border-gray-100 shadow-[0_15px_30px_-15px_rgba(0,0,0,0.05)] rounded-[32px] p-8 text-center flex flex-col items-center py-12">
    <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4 border border-red-100">
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    </div>
    <h3 className="font-royal text-2xl text-gray-900 mb-2 italic">Failed to Connect</h3>
    <p className="text-gray-500 text-sm max-w-sm mb-6 leading-relaxed">
      We couldn't load the feed posts. Please check your network connection or try again.
    </p>
    {refetch && (
      <button
        onClick={refetch}
        className="px-6 py-3 bg-gray-950 text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-black transition-all cursor-pointer shadow-lg active:scale-95"
      >
        Try Again
      </button>
    )}
  </div>
);

const EmptyState = () => (
  <div className="bg-white border border-gray-100 shadow-[0_15px_30px_-15px_rgba(0,0,0,0.05)] rounded-[32px] p-8 text-center flex flex-col items-center py-16">
    <div className="w-20 h-20 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mb-6 border border-indigo-100">
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 4a2 2 0 00-2-2m-2 4h.01M16 20h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>
    <h3 className="font-royal text-2xl text-gray-900 mb-3 italic">Your Feed is Quiet</h3>
    <p className="text-gray-500 text-sm max-w-sm leading-relaxed">
      No posts have been published yet. Be the first to share a moment with the community!
    </p>
  </div>
);

export default function FeedPage() {
  const { user } = useSelector((state) => state.auth);
  const {
    data: feedPosts,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["feedPosts"],
    queryFn: ({ pageParam = 1 }) => getPostFeed(pageParam),
    getNextPageParam: (lastPage) => {
      return lastPage?.hasMore ? lastPage?.page + 1 : undefined;
    },
  });

  const handleScroll = useCallback(() => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200 && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <FeedLayout
        left={<Sidebar />}
        center={
          <div className="space-y-5">
            {/* Create Post Composer */}
            <div className="rounded-3xl border border-gray-100 bg-white p-4 shadow-[0_22px_60px_-42px_rgba(15,23,42,0.45)]">
              <div className="flex items-center gap-4">
                <div className="relative flex-shrink-0">
                  {user?.profileImage ? (
                    <img
                      src={user?.profileImage}
                      alt="User Avatar"
                      className="h-11 w-11 rounded-full object-cover shadow-sm ring-1 ring-gray-100"
                    />
                  ) : (
                    <div
                      className="flex h-11 w-11 items-center justify-center rounded-full text-sm font-black text-white shadow-sm"
                      style={{ background: 'linear-gradient(135deg, var(--color-primary-500) 0%, var(--color-secondary-500) 100%)' }}
                    >
                      {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                    </div>
                  )}
                  {isUserOnline(user?.id) &&<span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-green-500 ring-2 ring-white shadow-sm"></span> }
                </div>

                <motion.div
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setIsModalOpen(true)}
                  className="flex-1 cursor-pointer rounded-2xl border border-gray-200 bg-gray-50 px-5 py-3.5 transition-all duration-200 hover:border-indigo-200 hover:bg-white hover:shadow-sm"
                >
                  <p className="text-sm font-semibold text-gray-400">
                    What's on your mind, <span className="font-black text-gray-700">{user?.name?.split(' ')[0] || 'there'}</span>?
                  </p>
                </motion.div>
              </div>

              <div className="mt-4 flex items-center gap-2 border-t border-gray-100 pt-3">
                {[
                  { icon: <Camera className="h-4 w-4" />, label: 'Photo', color: 'hover:bg-green-50 hover:text-green-700 hover:border-green-100' },
                  { icon: <Video className="h-4 w-4" />, label: 'Video', color: 'hover:bg-red-50 hover:text-red-700 hover:border-red-100' },
                  { icon: <Smile className="h-4 w-4" />, label: 'Feeling', color: 'hover:bg-amber-50 hover:text-amber-700 hover:border-amber-100' },
                ].map(({ icon, label, color }) => (
                  <motion.button
                    key={label}
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsModalOpen(true)}
                    className={`flex items-center gap-2 rounded-xl border border-transparent px-3 py-2 text-sm font-extrabold text-gray-500 transition-all duration-200 ${color}`}
                  >
                    {icon}
                    <span>{label}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Story tray */}
            <StoryTray />


            {/* Posts */}
            <div className="space-y-4">
              {isLoading ? (
                <>
                  <PostShimmer />
                  <PostShimmer />
                  <PostShimmer />
                </>
              ) : isError ? (
                <ErrorState refetch={refetch} />
              ) : feedPosts?.pages && feedPosts.pages.some(page => page?.posts && page.posts.length > 0) ? (
                feedPosts.pages.flatMap((page) =>
                  page?.posts?.map((post) => <PostCard key={post.id} {...post} />)
                )
              ) : (
                <EmptyState />
              )}
              {!isLoading && !isError && hasNextPage && (
                <button
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-gray-950 py-3 text-xs font-black uppercase tracking-[0.14em] text-white shadow-lg shadow-gray-200 transition-all hover:bg-indigo-700 active:scale-[0.98] disabled:opacity-70"
                >
                  {isFetchingNextPage ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Loading More
                    </>
                  ) : (
                    "Load More"
                  )}
                </button>
              )}
            </div>
          </div>
        }
        right={<Notifications />}
        className="min-h-screen bg-gray-50 p-6"
      />

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
