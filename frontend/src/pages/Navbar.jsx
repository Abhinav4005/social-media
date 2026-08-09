import { Bell, Home, MessagesSquare, Moon, Search, Sun, UsersRound, X } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getFriendRequests, globalSearch } from "../api";
import useDebounce from "../utils/useDebounce";
import { BRAND_THEME } from "../constant/constant";
import { useTheme } from "../context/ThemeContext";
import UserAvatar from "../components/Common/UserAvatar";
import { QUERY_KEYS } from "../constant/queryKeys";
import { ROUTES } from "../constant/routes";

/**
 * Modern Streamlined Navbar presentational component.
 * Features:
 * - Unified navigation action bar with active page indicator
 * - Expanded center search with focus glow and instant search results dropdown
 * - Clean icon set (Home, Friends, Chat, Notifications, Theme, Profile)
 */
export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchRef = useRef(null);
  const { user } = useSelector((state) => state.auth || {});
  const { isDark, toggleTheme } = useTheme();
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebounce(searchQuery, 300);

  const { data: results, isLoading } = useQuery({
    queryKey: QUERY_KEYS.globalSearch(debouncedQuery, "all"),
    queryFn: () => globalSearch(debouncedQuery, "all", 5, 1),
    enabled: debouncedQuery.trim().length >= 3,
  });

  const { data: friendRequests = [] } = useQuery({
    queryKey: QUERY_KEYS.friendRequests,
    queryFn: getFriendRequests,
    refetchInterval: 15000,
  });

  const pendingRequestsCount = Array.isArray(friendRequests)
    ? friendRequests.filter((r) => r.status === "PENDING").length
    : (friendRequests?.requests || []).filter((r) => r.status === "PENDING").length;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl shadow-xs transition-colors duration-200">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">

        {/* ── Logo Section ────────────────────────────────────────── */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <Link to={ROUTES.HOME} className="flex items-center gap-2.5 group">
            <div className="relative">
              <img
                src="/connecta-logo-icon.png"
                alt="Connecta Logo"
                className="h-9 w-9 object-contain drop-shadow-md transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-heading text-lg font-black tracking-tight bg-gradient-to-r from-secondary-600 via-primary-600 to-primary-500 bg-clip-text text-transparent leading-none">
                Connecta
              </span>
              <span className="text-[8.5px] font-bold tracking-widest text-gray-400 dark:text-gray-500 uppercase mt-0.5">
                Social Hub
              </span>
            </div>
          </Link>
        </div>

        {/* ── Center Search Bar ──────────────────────────────────── */}
        <div className="flex-1 max-w-md mx-2 sm:mx-6">
          <div ref={searchRef} className="relative w-full">
            <div className={`flex h-10 w-full items-center gap-2.5 rounded-2xl border px-3.5 transition-all duration-200 ${
              searchFocused
                ? "border-primary-400 dark:border-primary-500 bg-white dark:bg-slate-800 shadow-md shadow-primary-100/50 dark:shadow-none"
                : "border-gray-200/80 dark:border-slate-700/70 bg-gray-50/90 dark:bg-slate-800/50 hover:bg-gray-100/70 dark:hover:bg-slate-800"
            }`}>
              <Search className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search people, posts, tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                className="w-full bg-transparent text-[13px] font-medium text-gray-800 dark:text-gray-100 placeholder-gray-400 outline-none"
              />
              {searchQuery && (
                <button type="button" onClick={() => setSearchQuery("")} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 flex-shrink-0">
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Instant Search Results Dropdown */}
            <AnimatePresence>
              {searchFocused && debouncedQuery.trim().length >= 3 && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.98 }}
                  className="absolute left-0 right-0 top-12 overflow-hidden rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-2 shadow-xl shadow-gray-200/50 dark:shadow-slate-950/50 z-50"
                >
                  <div className="max-h-72 overflow-y-auto divide-y divide-gray-50 dark:divide-slate-800/60">
                    {isLoading ? (
                      <div className="p-4 text-center text-xs font-medium text-gray-400">Searching...</div>
                    ) : results && (results.users?.length > 0 || results.posts?.length > 0) ? (
                      <>
                        {results.users?.slice(0, 3).map((result) => (
                          <button
                            key={`user-${result.id}`}
                            type="button"
                            onClick={() => {
                              navigate(ROUTES.USER_PROFILE(result.id));
                              setSearchFocused(false);
                            }}
                            className="flex w-full items-center gap-3 rounded-xl p-2.5 text-left hover:bg-gray-50 dark:hover:bg-slate-800/70 transition-colors"
                          >
                            <UserAvatar
                              name={result.name}
                              profileImage={result.profileImage}
                              size="xs"
                              shape="circle"
                            />
                            <div className="min-w-0 flex-1">
                              <p className="text-[13px] font-bold text-gray-900 dark:text-gray-100 truncate">{result.name}</p>
                              <p className="truncate text-xs text-gray-400 font-medium">@{result.email?.split("@")[0]}</p>
                            </div>
                          </button>
                        ))}
                        {results.posts?.slice(0, 3).map((result) => (
                          <button
                            key={`post-${result.id}`}
                            type="button"
                            onClick={() => {
                              navigate(ROUTES.POST_DETAIL(result.id));
                              setSearchFocused(false);
                            }}
                            className="flex w-full items-center gap-3 rounded-xl p-2.5 text-left hover:bg-gray-50 dark:hover:bg-slate-800/70 transition-colors"
                          >
                            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary-50 dark:bg-primary-950/50 text-primary-600 dark:text-primary-400 flex-shrink-0">
                              <Search className="h-3.5 w-3.5" />
                            </span>
                            <p className="truncate text-[13px] font-bold text-gray-900 dark:text-gray-100">{result.title}</p>
                          </button>
                        ))}
                      </>
                    ) : (
                      <div className="p-4 text-center text-xs font-medium text-gray-400">No results found.</div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── Right Navigation & Actions ─────────────────────────── */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          
          {/* Home Link */}
          <Link
            to={ROUTES.HOME}
            title="Home"
            className={`relative flex h-9.5 w-9.5 items-center justify-center rounded-2xl transition-all duration-200 ${
              isActive(ROUTES.HOME)
                ? "bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 font-bold"
                : "text-gray-500 dark:text-gray-400 hover:bg-gray-100/80 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-gray-200"
            }`}
          >
            <Home className="h-4.5 w-4.5" />
            {isActive(ROUTES.HOME) && (
              <motion.span
                layoutId="active-nav-dot"
                className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-primary-600 dark:bg-primary-400"
              />
            )}
          </Link>

          {/* Friend Requests Link */}
          <Link
            to={ROUTES.FRIEND_REQUESTS}
            title="Friend Requests"
            className={`relative flex h-9.5 w-9.5 items-center justify-center rounded-2xl transition-all duration-200 ${
              isActive(ROUTES.FRIEND_REQUESTS)
                ? "bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 font-bold"
                : "text-gray-500 dark:text-gray-400 hover:bg-gray-100/80 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-gray-200"
            }`}
          >
            <UsersRound className="h-4.5 w-4.5" />
            {pendingRequestsCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary-600 px-1 text-[9px] font-bold text-white shadow-sm ring-2 ring-white dark:ring-slate-900 animate-pulse">
                {pendingRequestsCount}
              </span>
            )}
            {isActive(ROUTES.FRIEND_REQUESTS) && (
              <motion.span
                layoutId="active-nav-dot"
                className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-primary-600 dark:bg-primary-400"
              />
            )}
          </Link>

          {/* Chat Link */}
          <Link
            to={ROUTES.CHAT}
            title="Messages"
            className={`relative flex h-9.5 w-9.5 items-center justify-center rounded-2xl transition-all duration-200 ${
              location.pathname.startsWith(ROUTES.CHAT)
                ? "bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 font-bold"
                : "text-gray-500 dark:text-gray-400 hover:bg-gray-100/80 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-gray-200"
            }`}
          >
            <MessagesSquare className="h-4.5 w-4.5" />
            {location.pathname.startsWith(ROUTES.CHAT) && (
              <motion.span
                layoutId="active-nav-dot"
                className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-primary-600 dark:bg-primary-400"
              />
            )}
          </Link>

          {/* Notifications Link */}
          <Link
            to={ROUTES.NOTIFICATIONS}
            title="Notifications"
            className={`relative flex h-9.5 w-9.5 items-center justify-center rounded-2xl transition-all duration-200 ${
              isActive(ROUTES.NOTIFICATIONS)
                ? "bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 font-bold"
                : "text-gray-500 dark:text-gray-400 hover:bg-gray-100/80 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-gray-200"
            }`}
          >
            <Bell className="h-4.5 w-4.5" />
            {isActive(ROUTES.NOTIFICATIONS) && (
              <motion.span
                layoutId="active-nav-dot"
                className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-primary-600 dark:bg-primary-400"
              />
            )}
          </Link>

          {/* Divider */}
          <div className="h-5 w-[1px] bg-gray-200 dark:bg-slate-800 mx-1 hidden sm:block" />

          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle Theme"
            className="flex h-9.5 w-9.5 items-center justify-center rounded-2xl bg-gray-100/80 dark:bg-slate-800/80 text-gray-600 dark:text-amber-400 hover:bg-gray-200/80 dark:hover:bg-slate-700 transition-all duration-200 cursor-pointer shadow-xs"
          >
            {isDark ? (
              <Sun className="h-4.5 w-4.5 text-amber-400 animate-spin-once" />
            ) : (
              <Moon className="h-4.5 w-4.5 text-primary-600" />
            )}
          </button>

          {/* User Profile Link */}
          <Link
            to={ROUTES.PROFILE}
            title="My Profile"
            className="relative flex items-center rounded-2xl p-0.5 transition-all duration-200 hover:opacity-90 ml-0.5"
          >
            <UserAvatar
              name={user?.name}
              profileImage={user?.profileImage}
              size="sm"
              shape="rounded"
              showOnline
              ring="ring-2 ring-gray-100 dark:ring-slate-700 hover:ring-primary-300 dark:hover:ring-primary-500"
            />
          </Link>

        </div>

      </div>
    </header>
  );
}
