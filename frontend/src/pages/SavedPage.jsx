import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Bookmark, Grid2X2, Loader2 } from "lucide-react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import FeedLayout from "../components/FeedLayout";
import PostCard from "../components/Posts/PostCard";
import { getSavedPosts } from "../api";

export default function SavedPage() {
  const { data: savedPosts = [], isLoading } = useQuery({
    queryKey: ["savedPosts"],
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
                <Loader2 className="mx-auto mb-2 h-5 w-5 animate-spin text-indigo-500" />
                Loading saved posts...
              </div>
            ) : savedPosts.length > 0 ? (
              <div className="space-y-4">
                {savedPosts.map((post) => (
                  <PostCard key={post.id} {...post} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-10 text-center shadow-xs">
                <Bookmark className="mx-auto mb-3 h-8 w-8 text-gray-400 dark:text-gray-500" />
                <h3 className="font-bold text-base text-gray-900 dark:text-gray-100">No saved items</h3>
                <p className="text-xs text-gray-400 dark:text-gray-400 mt-1">Posts you save will appear here for quick access later.</p>
              </div>
            )}
          </div>
        }
      />
    </>
  );
}
