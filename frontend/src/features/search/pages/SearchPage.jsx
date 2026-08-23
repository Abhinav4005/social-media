import { useState, useEffect } from "react";
import { ArrowLeft, Users, FileText, Sparkles, UserCheck, CalendarDays } from "lucide-react";
import Navbar from "../../../pages/Navbar";
import { useQuery } from "@tanstack/react-query";
import { globalSearch } from "../../../api";
import { useNavigate, useSearchParams } from "react-router-dom";
import useDebounce from "../../../utils/useDebounce";
import { motion, AnimatePresence } from "framer-motion";
import SearchInput from "../../../components/Common/SearchInput";
import EmptyState from "../../../components/Common/EmptyState";
import TabBar from "../../../components/Common/TabBar";
import UserAvatar from "../../../components/Common/UserAvatar";
import { QUERY_KEYS } from "../../../constant/queryKeys";
import { ROUTES } from "../../../constant/routes";

export default function SearchPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [tab, setTab] = useState("all");
  const [query, setQuery] = useState(initialQuery);
  const debouncedQuery = useDebounce(query, 500);
  const [results, setResults] = useState({ users: [], posts: [], groups: [], events: [] });

  useEffect(() => {
    const q = searchParams.get("q") || "";
    setQuery(q);
  }, [searchParams]);

  const { data, isLoading } = useQuery({
    queryKey: QUERY_KEYS.globalSearch(debouncedQuery, tab),
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
          profileImage: user.profileImage || null,
        })) || [],
        posts: data?.posts?.map(post => ({
          id: post?.id,
          title: post?.title,
          description: post?.description,
          likes: post?._count?.post_likes || 0,
          comments: post?._count?.comments || 0,
          user: post?.user
        })) || [],
        groups: data?.groups || [],
        events: data?.events || [],
      });
    } else {
      setResults({ users: [], posts: [], groups: [], events: [] });
    }
  }, [data]);

  const showResults = query.trim().length >= 3;

  const TABS = [
    { id: "all", label: "All", icon: <Sparkles className="w-4 h-4" /> },
    { id: "users", label: "People", icon: <Users className="w-4 h-4" /> },
    { id: "posts", label: "Posts", icon: <FileText className="w-4 h-4" /> },
    { id: "groups", label: "Groups", icon: <UserCheck className="w-4 h-4" /> },
    { id: "events", label: "Events", icon: <CalendarDays className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-gray-100 flex flex-col transition-colors duration-200">
      <Navbar />

      <main className="max-w-5xl mx-auto w-full p-6 md:p-10 flex-1">
        <motion.button
          whileHover={{ x: -4 }}
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 mb-8 font-medium transition cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </motion.button>

        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent inline-block">
            Global Search
          </h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
            Find people, posts, groups, and events from across the community in one place.
          </p>
        </div>

        <div className="max-w-2xl mx-auto mb-12">
          <SearchInput
            value={query}
            onChange={setQuery}
            placeholder="Search people, posts, groups, events..."
            size="md"
            className="rounded-3xl px-6 py-5 shadow-xl border-2 bg-white dark:bg-slate-900 text-lg"
          />
        </div>

        {!showResults ? (
          <EmptyState
            icon={Sparkles}
            title="Search the Hub"
            description="Enter at least 3 characters to find people, posts, groups, and events across the community."
            iconBg="bg-gray-50"
            iconColor="text-gray-300"
            className="rounded-[3rem] shadow-sm border border-gray-100 bg-white dark:bg-slate-900"
          />
        ) : (
          <div className="space-y-10">
            <div className="flex justify-center overflow-x-auto pb-2">
              <TabBar tabs={TABS} activeTab={tab} onChange={setTab} variant="card" />
            </div>

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
                  {(tab === "users" || tab === "all") && (
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 ml-2">People</h3>
                      {results.users.length === 0 && !isLoading ? (
                        <EmptyState
                          icon={Users}
                          title={`No people found matching "${query}"`}
                          noBorder
                          iconBg="bg-gray-100 dark:bg-slate-800"
                          iconColor="text-gray-300 dark:text-gray-600"
                          className="rounded-3xl border border-dashed border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                        />
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {results.users.map((user) => (
                            <motion.div
                              key={user.id}
                              whileHover={{ y: -4 }}
                              className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 shadow-xs border border-gray-100 dark:border-slate-800 rounded-3xl cursor-pointer transition-all"
                              onClick={() => navigate(ROUTES.USER_PROFILE(user.id))}
                            >
                              <div className="flex items-center gap-4">
                                <UserAvatar
                                  name={user.name}
                                  profileImage={user.profileImage}
                                  size="lg"
                                  shape="circle"
                                  ring="ring-2 ring-primary-50 dark:ring-slate-800"
                                />
                                <div>
                                  <p className="font-bold text-gray-900 dark:text-gray-100">{user.name}</p>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">@{user.username}</p>
                                </div>
                              </div>
                              <button className="px-4 py-2 text-xs font-bold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition cursor-pointer">
                                View
                              </button>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* GROUPS */}
                  {(tab === "groups" || tab === "all") && (
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 ml-2">Groups</h3>
                      {results.groups.length === 0 && !isLoading ? (
                        <EmptyState
                          icon={UserCheck}
                          title={`No groups found matching "${query}"`}
                          noBorder
                          iconBg="bg-gray-100 dark:bg-slate-800"
                          iconColor="text-gray-300 dark:text-gray-600"
                          className="rounded-3xl border border-dashed border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                        />
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {results.groups.map((group) => (
                            <motion.div
                              key={group.id}
                              whileHover={{ y: -4 }}
                              className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 shadow-xs border border-gray-100 dark:border-slate-800 rounded-3xl cursor-pointer transition-all"
                              onClick={() => navigate(`/groups/${group.id}`)}
                            >
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold overflow-hidden">
                                  {group.coverImage ? (
                                    <img src={group.coverImage} alt={group.name} className="w-full h-full object-cover" />
                                  ) : (
                                    group.name[0]?.toUpperCase()
                                  )}
                                </div>
                                <div>
                                  <p className="font-bold text-gray-900 dark:text-gray-100">{group.name}</p>
                                  <p className="text-xs text-gray-400">{group._count?.members || 0} members</p>
                                </div>
                              </div>
                              <button className="px-4 py-2 text-xs font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 rounded-xl hover:bg-indigo-600 hover:text-white transition cursor-pointer">
                                Visit
                              </button>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* EVENTS */}
                  {(tab === "events" || tab === "all") && (
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 ml-2">Events</h3>
                      {results.events.length === 0 && !isLoading ? (
                        <EmptyState
                          icon={CalendarDays}
                          title={`No events found matching "${query}"`}
                          noBorder
                          iconBg="bg-gray-100 dark:bg-slate-800"
                          iconColor="text-gray-300 dark:text-gray-600"
                          className="rounded-3xl border border-dashed border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                        />
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {results.events.map((event) => (
                            <motion.div
                              key={event.id}
                              whileHover={{ y: -4 }}
                              className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 shadow-xs border border-gray-100 dark:border-slate-800 rounded-3xl cursor-pointer transition-all"
                              onClick={() => navigate(`/events/${event.id}`)}
                            >
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950 flex flex-col items-center justify-center font-bold text-indigo-600 dark:text-indigo-400">
                                  <CalendarDays className="w-5 h-5" />
                                </div>
                                <div>
                                  <p className="font-bold text-gray-900 dark:text-gray-100">{event.title}</p>
                                  <p className="text-xs text-gray-400">{event.location || "Online"}</p>
                                </div>
                              </div>
                              <button className="px-4 py-2 text-xs font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 rounded-xl hover:bg-indigo-600 hover:text-white transition cursor-pointer">
                                View Event
                              </button>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* POSTS */}
                  {(tab === "posts" || tab === "all") && (
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 ml-2">Posts</h3>
                      {results.posts.length === 0 && !isLoading ? (
                        <EmptyState
                          icon={FileText}
                          title={`No posts found matching "${query}"`}
                          noBorder
                          iconBg="bg-gray-100 dark:bg-slate-800"
                          iconColor="text-gray-300 dark:text-gray-600"
                          className="rounded-3xl border border-dashed border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                        />
                      ) : (
                        <div className="grid grid-cols-1 gap-6">
                          {results.posts.map((post) => (
                            <motion.div
                              key={post.id}
                              whileHover={{ y: -2 }}
                              className="p-6 bg-white dark:bg-slate-900 shadow-xs border border-gray-100 dark:border-slate-800 rounded-3xl hover:shadow-xl transition-all cursor-pointer"
                              onClick={() => navigate(ROUTES.POST_DETAIL(post.id))}
                            >
                              <div className="flex items-start gap-4 mb-4">
                                <UserAvatar
                                  name={post.user?.name}
                                  profileImage={post.user?.profileImage}
                                  size="md"
                                  shape="circle"
                                  ring="ring-2 ring-white dark:ring-slate-800"
                                />
                                <div>
                                  <p className="font-bold text-sm text-gray-900 dark:text-gray-100">{post.user?.name}</p>
                                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Post</p>
                                </div>
                              </div>
                              <h4 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2">{post.title}</h4>
                              <p className="text-gray-600 dark:text-gray-400 line-clamp-2 md:line-clamp-3 leading-relaxed mb-4">
                                {post.description}
                              </p>
                              <div className="flex items-center gap-6 text-sm font-bold">
                                <span className="flex items-center gap-1.5 text-red-500">
                                  ❤️ {post.likes}
                                </span>
                                <span className="flex items-center gap-1.5 text-indigo-600">
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
