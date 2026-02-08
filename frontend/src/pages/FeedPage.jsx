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
            <div className="bg-white p-4 rounded-2xl shadow-md mb-6">
              <div className="flex items-center gap-3">
                {user?.profileImage ? (
                  <img
                    src={user?.profileImage}
                    alt="User Avatar"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <img
                    src={`https://ui-avatars.com/api/?name=${user?.name || "U"}&background=random`}
                    alt="User"
                    className="w-10 h-10 rounded-full border border-gray-200"
                  />
                )}
                <Button
                  color="blue"
                  className="text-white cursor-pointer p-3 flex items-center gap-2 rounded-full shadow-md hover:scale-105 hover:shadow-lg transition-transform duration-200"
                  style={{ background: 'var(--gradient-vibrant)' }}
                  onClick={() => setIsModalOpen(true)}
                >
                  <Plus className="w-4 h-5" />
                  Create
                </Button>
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
