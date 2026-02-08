import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import Navbar from "./Navbar";
import { useQuery } from "@tanstack/react-query";
import { globalSearch } from "../api";
import { useNavigate } from "react-router-dom";
import useDebounce from "../utils/useDebounce";

export default function SearchPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("all");
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 500);
  const [results, setResults] = useState({ users: [], posts: [] });

  const { data, isLoading, isError } = useQuery({
    queryKey: ["globalSearch", debouncedQuery, tab],
    queryFn: () => globalSearch(debouncedQuery, tab, 10, 1),
    enabled: debouncedQuery.trim().length >= 3,
    keepPreviousData: true,
  });

  useEffect(() => {
    if (data) {
      setResults({
        users: data.users.map(user => ({
          id: user.id,
          name: user.name,
          username: user.email.split('@')[0],
          profileImage: user.profileImage || `https://i.pravatar.cc/150?u=${user.email}`
        })) || [],
        posts: data?.posts?.map(post => ({
          id: post?.id,
          text: post?.title,
          likes: post?._count?.likes || 0,
          comments: post?._count?.comments || 0
        })) || []
      })
    } else {
      setResults({ users: [], posts: [] });
    }
  }, [data]);

  const showResults = debouncedQuery.trim().length > 0;

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto p-4">
        <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2 mb-6 shadow-sm">
          <Search className="w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search users or posts..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="bg-transparent outline-none ml-2 text-sm w-full"
          />
        </div>

        {!showResults ? (
          <div className="flex flex-col items-center justify-center mt-20 text-center text-gray-500">
            <Search className="w-12 h-12 mb-4 text-gray-400" />
            <p className="text-lg font-medium">Start typing to search 🔍</p>
            <p className="text-sm">Find users and posts quickly</p>
          </div>
        ) : (
          <>
            <div className="flex gap-6 border-b mb-6">
              {["all", "users", "posts"].map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`pb-3 text-sm font-medium transition-colors ${tab === t
                      ? "border-b-2 border-primary-600 text-primary-600"
                      : "text-gray-500 hover:text-gray-700"
                    }`}
                >
                  {t.toUpperCase()}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              {(tab === "users" || tab === "all") && (
                <div className="space-y-3">
                  <h3 className="text-gray-700 font-semibold">Users</h3>
                  {results.users.length === 0 ? (
                    <p className="text-sm text-gray-500">No users found for "{query}"</p>
                  ) : (
                    results.users.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between p-3 bg-white shadow rounded-xl cursor-pointer"
                        onClick={() => navigate(`/user/${user.id}`)}
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={`https://i.pravatar.cc/40?u=${user.username}`}
                            alt="avatar"
                            className="w-10 h-10 rounded-full"
                          />
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-gray-500">@{user.username}</p>
                          </div>
                        </div>
                        <button className="px-3 py-1 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                          Follow
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}

              {(tab === "posts" || tab === "all") && (
                <div className="space-y-3">
                  <h3 className="text-gray-700 font-semibold">Posts</h3>
                  {results.posts.length === 0 ? (
                    <p className="text-sm text-gray-500">No posts found for "{query}"</p>
                  ) : (
                    results.posts.map((post) => (
                      <div key={post.id} className="p-4 bg-white shadow rounded-xl">
                        <p className="text-gray-800">{post.text}</p>
                        <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                          <span>❤️ {post.likes}</span>
                          <span>💬 {post.comments}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}