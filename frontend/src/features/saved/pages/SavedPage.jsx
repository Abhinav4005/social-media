import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Bookmark, Loader2 } from "lucide-react";
import Navbar from "../../../pages/Navbar";
import Sidebar from "../../../pages/Sidebar";
import FeedLayout from "../../../components/FeedLayout";
import { PostCard } from "../../posts";
import EmptyState from "../../../components/Common/EmptyState";
import { getSavedPosts } from "../../../api";
import { QUERY_KEYS } from "../../../constant/queryKeys";

export default function SavedPage() {
  const { data: savedPosts = [], isLoading } = useQuery({
    queryKey: QUERY_KEYS.saved,
    queryFn: getSavedPosts,
  });

  return (
    <>
      <Navbar />
      <FeedLayout
        left={<Sidebar />}
        center={
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-black text-gray-900 dark:text-gray-100 tracking-tight">Saved</h1>
                <p className="text-xs font-semibold text-gray-400 dark:text-gray-400">All your saved posts, photos, and bookmarks</p>
              </div>
            </div>

            {isLoading ? (
              <div className="rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 text-center text-xs text-gray-400">
                <Loader2 className="mx-auto mb-2 h-5 w-5 animate-spin text-primary-500" />
                Loading saved posts...
              </div>
            ) : savedPosts.length > 0 ? (
              <div className="space-y-4">
                {savedPosts.map((post) => (
                  <PostCard key={post.id} {...post} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Bookmark}
                title="No saved items"
                description="Posts you save will appear here for quick access later."
              />
            )}
          </div>
        }
      />
    </>
  );
}
