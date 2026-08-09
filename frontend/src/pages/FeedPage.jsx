import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { Camera, Loader2, Smile, Video } from "lucide-react";
import { motion } from "framer-motion";
import FeedLayout from "../components/FeedLayout";
import { PostCard, CreatePostModal } from "../features/posts";
import Sidebar from "./Sidebar";
import { NotificationList } from "../features/notifications";
import { StoryTray } from "../features/stories";
import { getNotifications, getPostFeed } from "../api";
import { QUERY_KEYS } from "../constant/queryKeys";

const PostShimmer = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="app-surface mb-4 p-5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-gray-100 dark:border-slate-800"
  >
    <div className="mb-4 flex items-center gap-3">
      <div className="h-11 w-11 rounded-full animate-shimmer" />
      <div className="flex-1 space-y-2">
        <div className="h-3 w-32 rounded animate-shimmer" />
        <div className="h-3 w-20 rounded animate-shimmer" />
      </div>
    </div>
    <div className="mb-4 space-y-2">
      <div className="h-3 w-full rounded animate-shimmer" />
      <div className="h-3 w-5/6 rounded animate-shimmer" />
    </div>
    <div className="h-72 rounded-2xl animate-shimmer" />
  </motion.div>
);

const EmptyState = ({ onOpenModal }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="app-surface p-10 text-center bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm"
    >
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
        <Smile className="h-7 w-7" />
      </div>
      <h3 className="font-heading text-lg font-bold text-gray-950 dark:text-gray-100">Your feed is quiet</h3>
      <p className="mx-auto mt-2 max-w-sm text-xs leading-relaxed text-gray-500 dark:text-gray-400 font-medium">
        No posts have been published yet. Share something with the community or connect with friends to fill your feed.
      </p>

      <div className="mt-6 flex items-center justify-center gap-3">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          type="button"
          onClick={onOpenModal}
          className="h-10 px-5 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xs font-bold shadow-md shadow-indigo-200 dark:shadow-none hover:from-indigo-600 hover:to-purple-700 transition-all cursor-pointer"
        >
          Create First Post
        </motion.button>
        <motion.a
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          href="/friend-requests"
          className="h-10 px-5 rounded-xl bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 text-xs font-bold hover:bg-gray-200 dark:hover:bg-slate-700 transition-all cursor-pointer flex items-center justify-center"
        >
          Find Friends
        </motion.a>
      </div>
    </motion.div>
  );
};

const ErrorState = ({ refetch }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="app-surface p-8 text-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-gray-100 dark:border-slate-800"
  >
    <h3 className="font-heading text-base font-bold text-gray-950 dark:text-gray-100">Could not load feed</h3>
    <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-500 dark:text-gray-400">
      Please check your connection and try again.
    </p>
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      type="button"
      onClick={refetch}
      className="app-primary-button mt-4 h-10 px-6 text-[13px] font-semibold"
    >
      Try again
    </motion.button>
  </motion.div>
);

export default function FeedPage() {
  const { user } = useSelector((state) => state.auth);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    data: feedPosts,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: QUERY_KEYS.feed,
    queryFn: ({ pageParam = 1 }) => getPostFeed(pageParam),
    getNextPageParam: (lastPage) => (lastPage?.hasMore ? lastPage?.page + 1 : undefined),
  });

  const { data: notifications, isLoading: notifLoading, isError: notifError } = useQuery({
    queryKey: QUERY_KEYS.notifications,
    queryFn: getNotifications,
    refetchInterval: 10000,
  });

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 240 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const initials = user?.name?.charAt(0)?.toUpperCase() || "U";

  return (
    <>
      <FeedLayout
        left={<Sidebar />}
        center={
          <div className="space-y-4">
            <section
              className="app-surface p-4 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-[0_2px_12px_rgba(0,0,0,0.02)] dark:shadow-none transition-colors duration-200"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  {user?.profileImage ? (
                    <img src={user.profileImage} alt="" className="h-10 w-10 rounded-full object-cover ring-1.5 ring-gray-100 dark:ring-slate-800 shadow-xs" />
                  ) : (
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-semibold text-white shadow-xs">
                      {initials}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="h-10 flex-1 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/70 px-4 text-left text-[13px] font-semibold text-gray-500 dark:text-gray-400 transition-all hover:bg-white dark:hover:bg-slate-800 hover:border-indigo-300 dark:hover:border-indigo-500"
                >
                  What's on your mind, {user?.name?.split(" ")[0] || "there"}?
                </button>
              </div>
              <div className="mt-3 grid grid-cols-3 border-t border-gray-100 dark:border-slate-800 pt-2.5">
                {[
                  { icon: <Camera className="h-4 w-4" />, label: "Photo/Video", color: "text-indigo-500" },
                  { icon: <Video className="h-4 w-4" />, label: "Tag friends", color: "text-purple-500" },
                  { icon: <Smile className="h-4 w-4" />, label: "Feeling/Activity", color: "text-pink-500" },
                ].map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    className="flex h-9 items-center justify-center gap-2 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <span className={item.color}>{item.icon}</span>
                    <span className="hidden sm:inline">{item.label}</span>
                  </button>
                ))}
              </div>
            </section>
            <StoryTray />
            <section className="space-y-4">
              {isLoading ? (
                <>
                  <PostShimmer />
                  <PostShimmer />
                </>
              ) : isError ? (
                <ErrorState refetch={refetch} />
              ) : feedPosts?.pages?.some((page) => page?.posts?.length > 0) ? (
                feedPosts.pages.flatMap((page) =>
                  page?.posts?.map((post) => <PostCard key={post.id} {...post} />)
                )
              ) : (
                <EmptyState onOpenModal={() => setIsModalOpen(true)} />
              )}

              {!isLoading && !isError && hasNextPage && (
                <button
                  type="button"
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  className="app-primary-button h-10 w-full text-[13px] font-semibold transition-colors bg-indigo-650 hover:bg-indigo-700 text-white rounded-xl disabled:opacity-70"
                >
                  {isFetchingNextPage ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Loading more
                    </span>
                  ) : (
                    "Load more"
                  )}
                </button>
              )}
            </section>
          </div>
        }
        right={<NotificationList notifications={notifications} isLoading={notifLoading} isError={notifError} />}
      />
      <CreatePostModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
