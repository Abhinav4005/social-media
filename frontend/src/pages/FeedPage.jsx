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

const PostShimmer = () => (
  <div className="bg-white border border-gray-100 shadow-[0_15px_30px_-15px_rgba(0,0,0,0.05)] rounded-[32px] p-6 mb-6">
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

  console.log("FeedPost----->", feedPosts)

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
          <div className="space-y-6">
            {/* Create Post Composer */}
            <div className="bg-white/80 backdrop-blur-xl p-5 rounded-[28px] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.06)] mb-4 border border-white/70">
              <div className="flex items-center gap-4">
                <div className="relative flex-shrink-0">
                  {user?.profileImage ? (
                    <img
                      src={user?.profileImage}
                      alt="User Avatar"
                      className="w-12 h-12 rounded-full object-cover shadow-md"
                    />
                  ) : (
                    <div
                      className="w-12 h-12 rounded-full text-white font-black text-sm flex items-center justify-center shadow-md"
                      style={{ background: 'linear-gradient(135deg, var(--color-primary-500) 0%, var(--color-secondary-500) 100%)' }}
                    >
                      {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                    </div>
                  )}
                  <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full ring-2 ring-white shadow-sm"></span>
                </div>

                <motion.div
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setIsModalOpen(true)}
                  className="flex-1 bg-gray-50/80 hover:bg-gray-100/80 border border-gray-100 hover:border-primary-200 rounded-full px-5 py-3.5 cursor-pointer transition-all duration-200"
                >
                  <p className="text-gray-400 text-sm font-medium">
                    What's on your mind, <span className="text-gray-600 font-semibold">{user?.name?.split(' ')[0] || 'there'}</span>?
                  </p>
                </motion.div>
              </div>

              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-50">
                {[
                  { emoji: '📷', label: 'Photo', color: 'hover:bg-green-50 hover:text-green-600 hover:border-green-100' },
                  { emoji: '🎥', label: 'Video', color: 'hover:bg-red-50 hover:text-red-600 hover:border-red-100' },
                  { emoji: '😊', label: 'Feeling', color: 'hover:bg-yellow-50 hover:text-yellow-600 hover:border-yellow-100' },
                ].map(({ emoji, label, color }) => (
                  <motion.button
                    key={label}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsModalOpen(true)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-gray-500 text-sm font-bold border border-transparent transition-all duration-200 ${color}`}
                  >
                    <span className="text-base">{emoji}</span>
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
                  className="w-full py-3 mt-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-indigo-100 hover:shadow-indigo-200 transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  {isFetchingNextPage ? "Loading..." : "Load More"}
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
