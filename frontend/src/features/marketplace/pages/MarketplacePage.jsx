import React, { useState } from "react";
import { Search, MapPin, Plus, Tag, Laptop, Sofa, Smartphone, Bike, Camera, Loader2, MessageCircle, Trash2, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Navbar from "../../../pages/Navbar";
import Sidebar from "../../../pages/Sidebar";
import FeedLayout from "../../../components/FeedLayout";
import EmptyState from "../../../components/Common/EmptyState";
import { getMarketplaceListings, deleteMarketplaceListing } from "../../../api";
import { QUERY_KEYS } from "../../../constant/queryKeys";
import { useToast } from "../../../context/ToastContext";
import CreateListingModal from "../modals/CreateListingModal";

const CATEGORIES = [
  { id: "all", label: "All Items", icon: ShoppingBag },
  { id: "ELECTRONICS", label: "Electronics", icon: Laptop },
  { id: "FURNITURE", label: "Furniture", icon: Sofa },
  { id: "VEHICLES", label: "Vehicles", icon: Bike },
  { id: "FASHION", label: "Fashion", icon: Tag },
  { id: "SPORTS", label: "Sports", icon: Camera },
];

export default function MarketplacePage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const currentUser = useSelector((state) => state.auth?.user);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  const { data: listings = [], isLoading } = useQuery({
    queryKey: QUERY_KEYS.marketplaceListings(selectedCategory, searchQuery),
    queryFn: () => getMarketplaceListings(selectedCategory, searchQuery),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteMarketplaceListing,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["marketplaceListings"] });
      showSuccess("Listing deleted successfully!");
    },
    onError: (err) => {
      showError(err.response?.data?.message || "Failed to delete listing");
    }
  });

  const handleContactSeller = (sellerId) => {
    if (!sellerId) return;
    navigate(`/chats?userId=${sellerId}`);
  };

  return (
    <>
      <Navbar />
      <FeedLayout
        left={<Sidebar />}
        center={
          <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-black text-gray-900 dark:text-gray-100 tracking-tight">Marketplace</h1>
                <p className="text-xs font-semibold text-gray-400 dark:text-gray-400">Buy and sell items in your local community</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Sell an Item
                </button>
              </div>
            </div>

            {/* Search & Categories Bar */}
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search marketplace items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl text-xs text-gray-900 dark:text-gray-100 shadow-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                {CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  const isActive = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${isActive
                          ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                          : "bg-white dark:bg-slate-900 text-gray-600 dark:text-gray-300 border border-gray-100 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800"
                        }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {cat.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Listings Grid */}
            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div key={n} className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 p-3 space-y-3 animate-pulse">
                    <div className="aspect-square w-full bg-gray-200 dark:bg-slate-800 rounded-xl" />
                    <div className="h-4 w-20 bg-gray-200 dark:bg-slate-800 rounded" />
                    <div className="h-3 w-32 bg-gray-100 dark:bg-slate-800 rounded" />
                  </div>
                ))}
              </div>
            ) : listings.length > 0 ? (
              <div>
                <h3 className="text-sm font-black text-gray-900 dark:text-gray-100 tracking-tight mb-4">
                  {selectedCategory === "all" ? "All Listings" : CATEGORIES.find(c => c.id === selectedCategory)?.label || "Items"} ({listings.length})
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {listings.map((item) => {
                    const isOwner = currentUser?.id === item.sellerId;
                    const displayImage = item.images?.[0] || item.image || "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=600&auto=format&fit=crop";

                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="group bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                      >
                        <div>
                          <div className="aspect-square w-full overflow-hidden relative bg-gray-100 dark:bg-slate-800">
                            <img
                              src={displayImage}
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            {item.location && (
                              <span className="absolute bottom-2 left-2 flex items-center gap-1 text-[10px] font-bold text-white bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded-full">
                                <MapPin className="w-3 h-3 text-indigo-400" />
                                {item.location}
                              </span>
                            )}
                          </div>
                          <div className="p-3">
                            <p className="text-base font-black text-indigo-600 dark:text-indigo-400">
                              ${item.price.toLocaleString()}
                            </p>
                            <h4 className="font-bold text-xs text-gray-900 dark:text-gray-100 truncate mt-0.5">
                              {item.title}
                            </h4>
                            {item.description && (
                              <p className="text-[11px] font-normal text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">
                                {item.description}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Seller / Actions Footer */}
                        <div className="p-3 pt-0 flex items-center justify-between border-t border-gray-50 dark:border-slate-800/50 mt-2">
                          <div className="flex items-center gap-1.5">
                            <img
                              src={item.seller?.profileImage || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"}
                              alt={item.seller?.name || "Seller"}
                              className="w-5 h-5 rounded-full object-cover"
                            />
                            <span className="text-[10px] font-bold text-gray-600 dark:text-gray-300 truncate max-w-[70px]">
                              {item.seller?.name || "Seller"}
                            </span>
                          </div>

                          {isOwner ? (
                            <button
                              onClick={() => deleteMutation.mutate(item.id)}
                              disabled={deleteMutation.isPending}
                              className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors cursor-pointer"
                              title="Delete listing"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleContactSeller(item.sellerId)}
                              className="flex items-center gap-1 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 px-2 py-1 rounded-lg transition-colors cursor-pointer"
                            >
                              <MessageCircle className="w-3 h-3" />
                              Chat
                            </button>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <EmptyState
                icon={ShoppingBag}
                title="No listings found"
                description={selectedCategory === "all" ? "Be the first to list an item for sale in your community!" : `No items found in category "${selectedCategory}".`}
              />
            )}
          </div>
        }
      />

      <CreateListingModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </>
  );
}
