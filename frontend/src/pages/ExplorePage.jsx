import React, { useState, useEffect } from "react";
import {
    Compass,
    Search,
    Users,
    MapPin,
    Clock,
    Sparkles,
    Filter,
    UserPlus,
    RefreshCw,
    Trash2,
    Calendar,
    Tag,
    Share2,
    CheckCircle,
} from "lucide-react";
import discoveryApi from "../api/discovery.api";
import { useToast } from "../context/ToastContext";

export default function ExplorePage() {
    const { showToast } = useToast();
    const [activeTab, setActiveTab] = useState("forYou");
    const [loading, setLoading] = useState(false);

    // PYMK State
    const [pymkUsers, setPymkUsers] = useState([]);

    // Search State
    const [searchQuery, setSearchQuery] = useState("");
    const [entityFilter, setEntityFilter] = useState("all");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [locationFilter, setLocationFilter] = useState("");
    const [dateRangeFilter, setDateRangeFilter] = useState("all");
    const [searchResults, setSearchResults] = useState(null);

    // History State
    const [viewHistory, setViewHistory] = useState([]);

    // Location State
    const [userCity, setUserCity] = useState("San Francisco");
    const [nearbyData, setNearbyData] = useState({ posts: [], events: [], creators: [] });

    // Personalization / Serendipity / Daily 5 State
    const [personalizedFeed, setPersonalizedFeed] = useState([]);
    const [serendipity, setSerendipity] = useState(null);
    const [daily5, setDaily5] = useState(null);

    useEffect(() => {
        loadTabContent(activeTab);
    }, [activeTab]);

    const loadTabContent = async (tab) => {
        setLoading(true);
        try {
            if (tab === "forYou") {
                const [persRes, d5Res] = await Promise.all([
                    discoveryApi.getPersonalizedFeed(),
                    discoveryApi.getDaily5Feed(),
                ]);
                setPersonalizedFeed(persRes.data || []);
                setDaily5(d5Res.data || null);
            } else if (tab === "pymk") {
                const res = await discoveryApi.getPymk(12);
                setPymkUsers(res.data || []);
            } else if (tab === "location") {
                const res = await discoveryApi.getNearbyContent({ city: userCity });
                setNearbyData(res.data || { posts: [], events: [], creators: [] });
            } else if (tab === "history") {
                const res = await discoveryApi.getRecentlyViewed();
                setViewHistory(res.data || []);
            } else if (tab === "serendipity") {
                const res = await discoveryApi.getSerendipityFeed();
                setSerendipity(res.data || null);
            }
        } catch (err) {
            showToast("Failed to load discovery content", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        try {
            const res = await discoveryApi.searchWithFilters({
                query: searchQuery,
                entity: entityFilter,
                category: categoryFilter,
                location: locationFilter,
                dateRange: dateRangeFilter,
            });
            setSearchResults(res.data);
        } catch (err) {
            showToast("Search failed", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleClearHistory = async () => {
        try {
            await discoveryApi.clearViewHistory();
            setViewHistory([]);
            showToast("Viewing history cleared", "success");
        } catch (err) {
            showToast("Failed to clear history", "error");
        }
    };

    const recordView = async (postId) => {
        try {
            await discoveryApi.recordPostView(postId);
        } catch (e) {
            // quiet record
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm uppercase tracking-wider mb-1">
                        <Compass className="w-5 h-5" /> SocialHub Discovery
                    </div>
                    <h1 className="text-3xl font-bold">Explore & Personalization Hub</h1>
                    <p className="text-slate-300 text-sm mt-1">
                        Discover unexpected stories, local moments, mutual connections, and intentional daily feeds.
                    </p>
                </div>

                {/* Daily 5 Meter Ring Badge */}
                {daily5 && (
                    <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-xl border border-white/15 flex items-center gap-3">
                        <div className="relative w-12 h-12 flex items-center justify-center font-bold text-amber-300">
                            <span className="text-sm">{daily5.viewedCount}/5</span>
                        </div>
                        <div>
                            <div className="text-xs text-slate-300 font-medium">Daily 5 Meter</div>
                            <div className="text-sm font-semibold text-white">
                                {daily5.isCompleted ? "Mindful Explorer ✨" : "Intentional Feed"}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Global Search Bar with Filters */}
            <form onSubmit={handleSearch} className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 space-y-3">
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <Search className="w-5 h-5 absolute left-3 top-3 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search posts, people, groups, events, or marketplace..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-slate-900 text-white pl-10 pr-4 py-2.5 rounded-lg border border-slate-700 focus:outline-none focus:border-indigo-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 transition"
                    >
                        <Search className="w-4 h-4" /> Search
                    </button>
                </div>

                {/* Filters Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                    <select
                        value={entityFilter}
                        onChange={(e) => setEntityFilter(e.target.value)}
                        className="bg-slate-900 text-slate-200 p-2 rounded-lg border border-slate-700"
                    >
                        <option value="all">All Entities</option>
                        <option value="posts">Posts</option>
                        <option value="users">People</option>
                        <option value="groups">Groups</option>
                        <option value="events">Events</option>
                        <option value="marketplace">Marketplace</option>
                    </select>

                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="bg-slate-900 text-slate-200 p-2 rounded-lg border border-slate-700"
                    >
                        <option value="all">All Categories</option>
                        <option value="tech">Technology</option>
                        <option value="design">Design & Art</option>
                        <option value="music">Music</option>
                        <option value="gaming">Gaming</option>
                        <option value="fitness">Fitness</option>
                        <option value="mindfulness">Mindfulness</option>
                    </select>

                    <input
                        type="text"
                        placeholder="City / Location"
                        value={locationFilter}
                        onChange={(e) => setLocationFilter(e.target.value)}
                        className="bg-slate-900 text-slate-200 p-2 rounded-lg border border-slate-700"
                    />

                    <select
                        value={dateRangeFilter}
                        onChange={(e) => setDateRangeFilter(e.target.value)}
                        className="bg-slate-900 text-slate-200 p-2 rounded-lg border border-slate-700"
                    >
                        <option value="all">Anytime</option>
                        <option value="today">Today</option>
                        <option value="week">This Week</option>
                        <option value="month">This Month</option>
                    </select>
                </div>
            </form>

            {/* Navigation Tabs */}
            <div className="flex border-b border-slate-700 space-x-4 overflow-x-auto pb-1 text-sm font-medium">
                {[
                    { id: "forYou", label: "For You", icon: Sparkles },
                    { id: "pymk", label: "People You May Know", icon: Users },
                    { id: "location", label: "Nearby Location", icon: MapPin },
                    { id: "history", label: "Recently Viewed", icon: Clock },
                    { id: "serendipity", label: "Serendipity", icon: Compass },
                ].map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 py-2 px-3 rounded-lg transition whitespace-nowrap ${isActive
                                    ? "bg-indigo-600 text-white font-semibold"
                                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                                }`}
                        >
                            <Icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Tab Content */}
            {loading ? (
                <div className="py-12 flex justify-center items-center text-slate-400 gap-2">
                    <RefreshCw className="w-5 h-5 animate-spin" /> Loading recommendations...
                </div>
            ) : (
                <div>
                    {/* SEARCH RESULTS OVERLAY IF SEARCH ACTIVE */}
                    {searchResults && (
                        <div className="bg-slate-800 p-5 rounded-xl border border-indigo-500/50 mb-6 space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <Search className="w-5 h-5 text-indigo-400" /> Search Results
                                </h3>
                                <button
                                    onClick={() => setSearchResults(null)}
                                    className="text-xs text-slate-400 hover:text-white"
                                >
                                    Clear Search
                                </button>
                            </div>

                            {searchResults.posts?.length > 0 && (
                                <div>
                                    <h4 className="text-xs font-semibold text-slate-400 uppercase mb-2">Posts</h4>
                                    <div className="grid gap-3">
                                        {searchResults.posts.map((p) => (
                                            <div key={p.id} className="bg-slate-900 p-3 rounded-lg border border-slate-700">
                                                <div className="font-semibold text-white">{p.title}</div>
                                                <div className="text-xs text-slate-400 mt-1">{p.description}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* TAB 1: FOR YOU PERSONALIZED */}
                    {activeTab === "forYou" && (
                        <div className="space-y-4">
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-amber-400" /> Personalised Recommendation Stream
                            </h2>
                            <div className="grid gap-4">
                                {personalizedFeed.map((post) => (
                                    <div
                                        key={post.id}
                                        onClick={() => recordView(post.id)}
                                        className="bg-slate-800 p-4 rounded-xl border border-slate-700 space-y-2 hover:border-indigo-500 transition cursor-pointer"
                                    >
                                        <div className="flex justify-between items-center text-xs">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
                                                    {post.user?.name?.[0]}
                                                </div>
                                                <span className="font-semibold text-white">{post.user?.name}</span>
                                            </div>
                                            <span className="bg-indigo-950 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-800 text-[11px]">
                                                {post.recommendationReason}
                                            </span>
                                        </div>
                                        <h3 className="font-bold text-white text-base">{post.title}</h3>
                                        <p className="text-slate-300 text-sm">{post.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* TAB 2: PYMK */}
                    {activeTab === "pymk" && (
                        <div className="space-y-4">
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                <Users className="w-5 h-5 text-indigo-400" /> People You May Know
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {pymkUsers.map((user) => (
                                    <div key={user.id} className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-col justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-full bg-indigo-700 flex items-center justify-center text-white text-lg font-bold">
                                                {user.name?.[0]}
                                            </div>
                                            <div>
                                                <div className="font-bold text-white text-sm">{user.name}</div>
                                                <div className="text-xs text-indigo-400">
                                                    {user.mutualFriendsCount} mutual friends
                                                </div>
                                                {user.isSameCity && (
                                                    <div className="text-[11px] text-emerald-400 flex items-center gap-1">
                                                        <MapPin className="w-3 h-3" /> Same city ({user.city})
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => showToast(`Friend request sent to ${user.name}`, "success")}
                                            className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                                        >
                                            <UserPlus className="w-3.5 h-3.5" /> Add Friend
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* TAB 3: LOCATION DISCOVERY */}
                    {activeTab === "location" && (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                    <MapPin className="w-5 h-5 text-emerald-400" /> Nearby Moments & Events
                                </h2>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-slate-400">Location:</span>
                                    <input
                                        type="text"
                                        value={userCity}
                                        onChange={(e) => setUserCity(e.target.value)}
                                        onBlur={() => loadTabContent("location")}
                                        className="bg-slate-800 text-white text-xs px-2 py-1 rounded border border-slate-700"
                                    />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                {/* Nearby Posts */}
                                <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700 space-y-3">
                                    <h3 className="text-sm font-bold text-slate-300">Local Posts ({nearbyData.posts?.length})</h3>
                                    {nearbyData.posts?.map((p) => (
                                        <div key={p.id} className="bg-slate-900 p-3 rounded-lg border border-slate-800 text-xs">
                                            <div className="font-semibold text-white">{p.title}</div>
                                            <div className="text-slate-400">{p.description}</div>
                                        </div>
                                    ))}
                                </div>

                                {/* Nearby Events */}
                                <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700 space-y-3">
                                    <h3 className="text-sm font-bold text-slate-300">Local Events ({nearbyData.events?.length})</h3>
                                    {nearbyData.events?.map((e) => (
                                        <div key={e.id} className="bg-slate-900 p-3 rounded-lg border border-slate-800 text-xs">
                                            <div className="font-semibold text-white">{e.title}</div>
                                            <div className="text-indigo-400">{e.location || userCity}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB 4: RECENTLY VIEWED */}
                    {activeTab === "history" && (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-indigo-400" /> Recently Viewed Posts
                                </h2>
                                {viewHistory.length > 0 && (
                                    <button
                                        onClick={handleClearHistory}
                                        className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" /> Clear History
                                    </button>
                                )}
                            </div>

                            {viewHistory.length === 0 ? (
                                <div className="py-8 text-center text-slate-400 text-sm">
                                    No recently viewed posts found.
                                </div>
                            ) : (
                                <div className="grid gap-3">
                                    {viewHistory.map((post) => (
                                        <div key={post.id} className="bg-slate-800 p-3 rounded-lg border border-slate-700 flex justify-between items-center text-xs">
                                            <div>
                                                <div className="font-semibold text-white">{post.title}</div>
                                                <div className="text-slate-400">{post.description}</div>
                                            </div>
                                            <div className="text-[10px] text-slate-500">
                                                Viewed {new Date(post.viewedAt).toLocaleTimeString()}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* TAB 5: SERENDIPITY */}
                    {activeTab === "serendipity" && serendipity?.post && (
                        <div className="space-y-4 max-w-xl mx-auto">
                            <div className="bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900 p-6 rounded-2xl border border-purple-500/30 text-center space-y-4 shadow-2xl">
                                <div className="text-xs font-bold uppercase tracking-wider text-purple-300 bg-purple-950/80 py-1 px-3 rounded-full inline-block">
                                    {serendipity.badge}
                                </div>
                                <h2 className="text-xl font-bold text-white">{serendipity.post.title}</h2>
                                <p className="text-slate-200 text-sm leading-relaxed">{serendipity.post.description}</p>
                                <div className="text-xs text-purple-400">By {serendipity.post.user?.name}</div>

                                <div className="flex justify-center gap-3 pt-4">
                                    <button
                                        onClick={() => showToast("Saved to private Scrapbook", "success")}
                                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5"
                                    >
                                        <Sparkles className="w-4 h-4" /> Save to Scrapbook
                                    </button>
                                    <button
                                        onClick={() => loadTabContent("serendipity")}
                                        className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5"
                                    >
                                        <RefreshCw className="w-4 h-4" /> Another Surprise
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
