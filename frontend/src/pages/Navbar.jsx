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
          <span className="text-2xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent tracking-tighter">
            mysocial.
          </span>
        </Link>

        {/* Enhanced Search Bar */}
        <div className="relative group" ref={searchRef}>
          <motion.div
            className={`flex items-center bg-gray-50/50 backdrop-blur-sm rounded-2xl px-5 py-3 w-96 border border-gray-100 transition-all duration-300 ${searchFocused ? 'ring-4 ring-primary-500/10 shadow-2xl bg-white border-primary-200' : 'hover:bg-gray-100'
              }`}
          >
            <Search className={`w-5 h-5 transition-colors ${searchFocused ? 'text-primary-600' : 'text-gray-400'}`} />
            <input
              type="text"
              placeholder="Search people or stories..."
              className="bg-transparent outline-none ml-3 text-sm w-full placeholder-gray-300 font-extrabold"
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
            {/* <kbd className="hidden sm:inline-block px-2.5 py-1 text-[10px] font-black text-gray-400 bg-white border border-gray-200 rounded-lg shadow-sm">
              ⌘K
            </kbd> */}
          </motion.div>

          {/* Instant Search Results Dropdown - Glass Overhaul */}
          <AnimatePresence>
            {searchFocused && (searchQuery.trim() || isLoading) && (
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 15, scale: 0.95 }}
                className="absolute top-full left-0 right-0 mt-4 bg-white/90 backdrop-blur-2xl rounded-[28px] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] border border-white overflow-hidden z-[100]"
              >
                <div className="max-h-[440px] overflow-y-auto p-3 space-y-1">
                  {isLoading ? (
                    <div className="flex flex-col gap-3 p-2">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="h-14 bg-gray-50/50 rounded-2xl animate-pulse" />
                      ))}
                    </div>
                  ) : searchQuery.trim() && (results?.users?.length > 0 || results?.posts?.length > 0) ? (
                    <>
                      <div className="px-4 py-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">People</div>
                      {results.users.slice(0, 3).map((user) => (
                        <motion.div
                          key={user.id}
                          whileHover={{ backgroundColor: 'rgba(99, 102, 241, 0.05)', x: 4 }}
                          onClick={() => {
                            navigate(`/user/${user.id}`);
                            setSearchFocused(false);
                          }}
                          className="flex items-center gap-4 p-3 rounded-2xl cursor-pointer transition-all"
                        >
                          <img
                            src={user.profileImage || `https://ui-avatars.com/api/?name=${user.name}&background=random`}
                            alt={user.name}
                            className="w-11 h-11 rounded-xl object-cover border-2 border-white shadow-md"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-black text-gray-900 truncate">{user.name}</p>
                            <p className="text-xs text-gray-400 font-bold truncate tracking-tight">@{user.email.split('@')[0]}</p>
                          </div>
                        </motion.div>
                      ))}

                      <div className="px-4 py-2 mt-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Discover</div>
                      {results.posts.slice(0, 3).map((post) => (
                        <motion.div
                          key={post.id}
                          whileHover={{ backgroundColor: 'rgba(168, 85, 247, 0.05)', x: 4 }}
                          onClick={() => {
                            navigate(`/post/${post.id}`);
                            setSearchFocused(false);
                          }}
                          className="flex items-center gap-4 p-3 rounded-2xl cursor-pointer transition-all"
                        >
                          <div className="w-11 h-11 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 border-2 border-white shadow-sm">
                            <Sparkles className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-gray-900 truncate">{post.title}</p>
                            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-black opacity-60">Story Feed</p>
                          </div>
                        </motion.div>
                      ))}

                      <button
                        onClick={() => {
                          navigate(`/search-page?q=${encodeURIComponent(searchQuery.trim())}`);
                          setSearchFocused(false);
                        }}
                        className="w-full py-4 text-xs font-black text-indigo-600 hover:bg-indigo-50 transition-all rounded-2xl mt-4 border border-dashed border-indigo-100 uppercase tracking-widest"
                      >
                        Deep Dive Results
                      </button>
                    </>
                  ) : searchQuery.trim() && (
                    <div className="p-12 text-center">
                      <div className="w-16 h-16 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-4">
                        <Search className="w-8 h-8 text-gray-200" />
                      </div>
                      <p className="text-gray-400 font-bold italic">No echoes found for "{searchQuery}"</p>
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
                  className="w-11 h-11 rounded-[14px] text-white text-xs font-black flex items-center justify-center shadow-xl border border-white/40 cursor-pointer transition-all"
                  style={{ background: 'var(--gradient-primary)' }}
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
