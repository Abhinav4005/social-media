import FeedLayout from "../components/FeedLayout";
import PostCard from "../components/Posts/PostCard";
import Sidebar from "./Sidebar";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getPostFeed } from "../api";
import { Plus } from "lucide-react";
import Button from "../components/UI/Button";
import CreatePostModal from "../Modal/CreatePostModal";
import { useEffect, useState } from "react";
import Notifications from "./Notification";
import { useSelector } from "react-redux";

export default function FeedPage() {
  const { user } = useSelector((state) => state.auth);
  const {
    data: feedPosts,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["feedPosts"],
    queryFn: ({ pageParam = 1 }) => getPostFeed(pageParam),
    getNextPageParam: (lastPage) => {
      return lastPage?.hasMore ? lastPage?.page + 1 : undefined;
    },
  });

  console.log("FeedPost----->", feedPosts)

  // console.log("FeedPage - feedPosts:", feedPosts?.pages);

  const handleScroll = () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200 && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-4 mb-6 animate-pulse">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-gray-200"></div>
          <div className="flex flex-col gap-1">
            <div className="w-24 h-4 bg-gray-200 rounded"></div>
            <div className="w-16 h-3 bg-gray-200 rounded"></div>
          </div>
        </div>
        <div className="space-y-2 mb-3">
          <div className="w-full h-4 bg-gray-200 rounded"></div>
          <div className="w-3/4 h-4 bg-gray-200 rounded"></div>
        </div>
        <div className="w-full h-48 bg-gray-200 rounded-lg mb-3"></div>
        <div className="flex gap-6 pt-3 border-t border-gray-100 mt-2">
          <div className="w-16 h-4 bg-gray-200 rounded"></div>
          <div className="w-16 h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <p className="text-center mt-6 text-red-500">
        Failed to load posts. Please try again.
      </p>
    );
  }

  return (
    <>
      <FeedLayout
        left={<Sidebar />}
        center={
          <div className="space-y-6">
            {/* Create Post Button */}
            <div className="bg-white p-5 rounded-2xl shadow-lg mb-6 border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="relative">
                  {user?.profileImage ? (
                    <img
                      src={user?.profileImage}
                      alt="User Avatar"
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-primary-100"
                    />
                  ) : (
                    <img
                      src={`https://ui-avatars.com/api/?name=${user?.name || "U"}&background=random`}
                      alt="User"
                      className="w-12 h-12 rounded-full border-2 border-gray-200"
                    />
                  )}
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full ring-2 ring-white"></span>
                </div>

                <div
                  onClick={() => setIsModalOpen(true)}
                  className="flex-1 bg-gray-50 hover:bg-gray-100 rounded-full px-5 py-3 cursor-pointer transition-all duration-200 border border-gray-200 hover:border-primary-300"
                >
                  <p className="text-gray-500 text-sm">
                    What's on your mind, {user?.name?.split(' ')[0] || 'there'}?
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition text-gray-600 hover:text-primary-600"
                  >
                    <span className="text-xl">📷</span>
                    <span className="text-sm font-medium">Photo</span>
                  </button>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition text-gray-600 hover:text-primary-600"
                  >
                    <span className="text-xl">🎥</span>
                    <span className="text-sm font-medium">Video</span>
                  </button>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition text-gray-600 hover:text-primary-600"
                  >
                    <span className="text-xl">😊</span>
                    <span className="text-sm font-medium">Feeling</span>
                  </button>
                </div>
              </div>
            </div>


            {/* Posts */}
            <div className="space-y-4">
              {feedPosts?.pages?.length > 0 ? (
                feedPosts?.pages.flatMap((page) =>
                  page?.posts?.map((post) => <PostCard key={post.id} {...post} />)
                )
              ) : (
                <p className="text-center mt-6 text-gray-500">
                  No posts available. Be the first to post!
                </p>
              )}
              {hasNextPage && (
                <button
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  className="w-full py-2 mt-4 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition"
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
