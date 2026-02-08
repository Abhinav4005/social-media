import { Bell, MessagesSquare, Search, User, Sparkles, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { globalSearch } from "../api";
import useDebounce from "../utils/useDebounce";

export default function Navbar() {
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const { user } = useSelector((state) => state.auth);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebounce(searchQuery, 300);

  const { data: results, isLoading } = useQuery({
    queryKey: ["instantSearch", debouncedQuery],
    queryFn: () => globalSearch(debouncedQuery, "all", 5, 1),
    enabled: debouncedQuery.trim().length >= 2,
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getInitials = (name = "") => {
    return (
      name
        .split(" ")
        .map((n) => n[0]?.toUpperCase())
        .join("")
        .slice(0, 2))
  }

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'var(--gradient-vibrant)' }}
          >
            <Sparkles className="w-6 h-6 text-white" />
          </motion.div>
          <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
            MySocial
          </span>
        </Link>

        {/* Enhanced Search Bar */}
        <div className="relative group" ref={searchRef}>
          <motion.div
            className={`flex items-center bg-gray-50 rounded-xl px-4 py-3 w-96 transition-all duration-300 ${searchFocused ? 'ring-2 ring-primary-500 shadow-lg bg-white' : 'hover:bg-gray-100'
              }`}
          >
            <Search className={`w-5 h-5 transition-colors ${searchFocused ? 'text-primary-600' : 'text-gray-400'}`} />
            <input
              type="text"
              placeholder="Search users, posts, or topics..."
              className="bg-transparent outline-none ml-3 text-sm w-full placeholder-gray-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchQuery.trim()) {
                  navigate(`/search-page?q=${encodeURIComponent(searchQuery.trim())}`);
                  setSearchFocused(false);
                }
              }}
            />
            <kbd className="hidden sm:inline-block px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-100 border border-gray-200 rounded">
              ⌘K
            </kbd>
          </motion.div>

          {/* Instant Search Results Dropdown */}
          <AnimatePresence>
            {searchFocused && (searchQuery.trim() || isLoading) && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[100]"
              >
                <div className="max-h-[400px] overflow-y-auto p-2 space-y-2">
                  {isLoading ? (
                    <div className="flex flex-col gap-2 p-2">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="h-12 bg-gray-50 rounded-xl animate-pulse" />
                      ))}
                    </div>
                  ) : searchQuery.trim() && (results?.users?.length > 0 || results?.posts?.length > 0) ? (
                    <>
                      {results.users.slice(0, 3).map((user) => (
                        <motion.div
                          key={user.id}
                          whileHover={{ backgroundColor: 'rgb(249, 250, 251)' }}
                          onClick={() => {
                            navigate(`/user/${user.id}`);
                            setSearchFocused(false);
                          }}
                          className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors"
                        >
                          <img
                            src={user.profileImage || `https://ui-avatars.com/api/?name=${user.name}&background=random`}
                            alt={user.name}
                            className="w-10 h-10 rounded-full object-cover border border-gray-100"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
                            <p className="text-xs text-gray-500 truncate">@{user.email.split('@')[0]}</p>
                          </div>
                        </motion.div>
                      ))}

                      {results.posts.slice(0, 3).map((post) => (
                        <motion.div
                          key={post.id}
                          whileHover={{ backgroundColor: 'rgb(249, 250, 251)' }}
                          onClick={() => {
                            navigate(`/post/${post.id}`);
                            setSearchFocused(false);
                          }}
                          className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors"
                        >
                          <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600">
                            <Sparkles className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{post.title}</p>
                            <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Post</p>
                          </div>
                        </motion.div>
                      ))}

                      <button
                        onClick={() => {
                          navigate(`/search-page?q=${encodeURIComponent(searchQuery.trim())}`);
                          setSearchFocused(false);
                        }}
                        className="w-full py-3 text-sm font-bold text-primary-600 hover:bg-primary-50 transition-colors rounded-xl border-t border-gray-50 mt-1"
                      >
                        See all results for "{searchQuery}"
                      </button>
                    </>
                  ) : searchQuery.trim() && (
                    <div className="p-8 text-center">
                      <Search className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 text-sm font-medium">No results found for "{searchQuery}"</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <Link to="/notifications">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="relative p-2 rounded-xl hover:bg-primary-50 transition-colors group"
            >
              <Bell className="w-6 h-6 text-gray-600 group-hover:text-primary-600 transition-colors" />
              {/* Notification Badge */}
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
            </motion.div>
          </Link>

          {/* Messages */}
          <Link to="/chat">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="relative p-2 rounded-xl hover:bg-primary-50 transition-colors group"
            >
              <MessagesSquare className="w-6 h-6 text-gray-600 group-hover:text-primary-600 transition-colors" />
              {/* Message Badge */}
              <span className="absolute top-1 right-1 w-5 h-5 bg-primary-600 text-white text-xs font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                3
              </span>
            </motion.div>
          </Link>

          {/* Profile */}
          <Link to="/profile">
            {user ? (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                <div
                  className="w-11 h-11 rounded-full text-white text-sm font-bold flex items-center justify-center shadow-lg border-2 border-white cursor-pointer ring-2 ring-primary-100 hover:ring-primary-300 transition-all"
                  style={{ background: 'var(--gradient-vibrant)' }}
                >
                  {user.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={user.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    getInitials(user.name)
                  )}
                </div>
                {/* Online Indicator */}
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full ring-2 ring-white"></span>
              </motion.div>
            ) : (
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-xl hover:bg-primary-50 transition-colors group"
              >
                <User className="w-6 h-6 text-gray-600 group-hover:text-primary-600 transition-colors" />
              </motion.div>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}
