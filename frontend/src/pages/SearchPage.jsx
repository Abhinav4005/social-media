import { useState, useEffect } from "react";
import { Search, ArrowLeft, Users, FileText, Sparkles, X } from "lucide-react";
import Navbar from "./Navbar";
import { useQuery } from "@tanstack/react-query";
import { globalSearch } from "../api";
import { useNavigate, useSearchParams } from "react-router-dom";
import useDebounce from "../utils/useDebounce";
import { motion, AnimatePresence } from "framer-motion";

export default function SearchPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [tab, setTab] = useState("all");
  const [query, setQuery] = useState(initialQuery);
  const debouncedQuery = useDebounce(query, 500);
  const [results, setResults] = useState({ users: [], posts: [] });

  useEffect(() => {
    const q = searchParams.get("q") || "";
    setQuery(q);
  }, [searchParams]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["globalSearch", debouncedQuery, tab],
    queryFn: () => globalSearch(debouncedQuery, tab, 20, 1),
    enabled: debouncedQuery.trim().length >= 3,
  });

  useEffect(() => {
    if (data) {
      setResults({
        users: data.users?.map(user => ({
          id: user.id,
          name: user.name,
          username: user.email.split('@')[0],
          profileImage: user.profileImage || `https://ui-avatars.com/api/?name=${user.name}&background=random`
        })) || [],
        posts: data?.posts?.map(post => ({
          id: post?.id,
          title: post?.title,
          description: post?.description,
          likes: post?._count?.post_likes || 0,
          comments: post?._count?.comments || 0,
          user: post?.user
        })) || []
      })
    } else {
      setResults({ users: [], posts: [] });
    }
  }, [data]);

  const showResults = query.trim().length >= 3;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-gray-100 flex flex-col transition-colors duration-200">
      <Navbar />

      <main className="max-w-5xl mx-auto w-full p-6 md:p-10 flex-1">
        {/* Back Button */}
        <motion.button
          whileHover={{ x: -4 }}
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 mb-8 font-medium transition cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </motion.button>

        {/* Search Header */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent inline-block">
            Global Search
          </h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
            Find people, posts, and topics from across the community in one place.
          </p>
        </div>

        {/* Enhanced Search Input */}
        <div className="relative max-w-2xl mx-auto mb-12">
          <div className={`flex items-center bg-white dark:bg-slate-900 rounded-3xl px-6 py-5 shadow-xl border-2 transition-all ${query ? 'border-primary-100 dark:border-indigo-500 ring-4 ring-primary-50 dark:ring-indigo-950' : 'border-gray-50 dark:border-slate-800'
            }`}>
            <Search className={`w-6 h-6 mr-4 transition-colors ${query ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400'}`} />
            <input
              type="text"
              placeholder="Who or what are you looking for?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="bg-transparent outline-none text-lg w-full text-gray-900 dark:text-gray-100 placeholder-gray-400 font-medium"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="p-1 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {!showResults ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 bg-white rounded-[3rem] shadow-sm border border-gray-100"
          >
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
              <Search className="w-10 h-10 text-gray-300" />
            </div>
            <p className="text-2xl font-bold text-gray-800 mb-2">Search the Hub</p>
            <p className="text-gray-500 text-center max-w-xs leading-relaxed">
              Enter at least 3 characters to find people, posts, and topics from across the community.
            </p>
          </motion.div>
        ) : (
          <div className="space-y-10">
            {/* Tabs */}
            <div className="flex justify-center gap-2 p-1.5 bg-gray-100 dark:bg-slate-900 rounded-2xl w-fit mx-auto transition-colors duration-200">
              {[
                { id: "all", label: "All Results", icon: <Sparkles className="w-4 h-4" /> },
                { id: "users", label: "People", icon: <Users className="w-4 h-4" /> },
                { id: "posts", label: "Posts", icon: <FileText className="w-4 h-4" /> }
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${tab === t.id
                    ? "bg-white dark:bg-slate-800 text-primary-600 dark:text-primary-400 shadow-md scale-105"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-slate-800/60"
                    }`}
                >
                  {t.icon}
                  {t.label}
                </button>
              ))}
            </div>

            {/* Results Grid */}
            <div className="space-y-10">
              {isLoading && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-24 bg-white dark:bg-slate-900 rounded-3xl animate-pulse shadow-xs border border-gray-100 dark:border-slate-800" />
                  ))}
                </div>
              )}

              <AnimatePresence mode="wait">
                <motion.div
                  key={tab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-8"
                >
                  {/* Users Section */}
                  {(tab === "users" || tab === "all") && (
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 ml-2">People</h3>
                      {results.users.length === 0 && !isLoading ? (
                        <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-gray-200 dark:border-slate-800">
                          <p className="text-gray-500 dark:text-gray-400">No people found matching "{query}"</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {results.users.map((user) => (
                            <motion.div
                              key={user.id}
                              whileHover={{ y: -4, shadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)" }}
                              className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 shadow-xs border border-gray-100 dark:border-slate-800 rounded-3xl cursor-pointer transition-all"
                              onClick={() => navigate(`/user/${user.id}`)}
                            >
                              <div className="flex items-center gap-4">
                                <img
                                  src={user.profileImage}
                                  alt={user.name}
                                  className="w-14 h-14 rounded-full object-cover ring-2 ring-primary-50 dark:ring-slate-800"
                                />
                                <div>
                                  <p className="font-bold text-gray-900 dark:text-gray-100">{user.name}</p>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">@{user.username}</p>
                                </div>
                              </div>
                              <button className="px-4 py-2 text-xs font-bold bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition shadow-lg shadow-primary-200 dark:shadow-none cursor-pointer">
                                View
                              </button>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Posts Section */}
                  {(tab === "posts" || tab === "all") && (
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 ml-2">Posts</h3>
                      {results.posts.length === 0 && !isLoading ? (
                        <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-gray-200 dark:border-slate-800">
                          <p className="text-gray-500 dark:text-gray-400">No posts found matching "{query}"</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 gap-6">
                          {results.posts.map((post) => (
                            <motion.div
                              key={post.id}
                              whileHover={{ y: -2 }}
                              className="p-6 bg-white dark:bg-slate-900 shadow-xs border border-gray-100 dark:border-slate-800 rounded-3xl hover:shadow-xl transition-all cursor-pointer"
                              onClick={() => navigate(`/posts/${post.id}`)}
                            >
                              <div className="flex items-start gap-4 mb-4">
                                <img
                                  src={post.user?.profileImage || `https://ui-avatars.com/api/?name=${post.user?.name}&background=random`}
                                  className="w-10 h-10 rounded-full object-cover ring-2 ring-white dark:ring-slate-800"
                                />
                                <div>
                                  <p className="font-bold text-sm text-gray-900">{post.user?.name}</p>
                                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Post</p>
                                </div>
                              </div>
                              <h4 className="text-lg font-bold text-gray-800 mb-2">{post.title}</h4>
                              <p className="text-gray-600 line-clamp-2 md:line-clamp-3 leading-relaxed mb-4">
                                {post.description}
                              </p>
                              <div className="flex items-center gap-6 text-sm font-bold">
                                <span className="flex items-center gap-1.5 text-red-500">
                                  ❤️ {post.likes}
                                </span>
                                <span className="flex items-center gap-1.5 text-primary-600">
                                  💬 {post.comments}
                                </span>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
