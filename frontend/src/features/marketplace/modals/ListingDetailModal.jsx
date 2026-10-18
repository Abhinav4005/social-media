import React from "react";
import { X, MapPin, Tag, MessageCircle, CheckCircle2, AlertCircle, Trash2, Calendar, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { updateMarketplaceListingStatus, deleteMarketplaceListing } from "../../../api";
import { useToast } from "../../../context/ToastContext";

export default function ListingDetailModal({ item, currentUser, isOpen, onClose }) {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { showSuccess, showError } = useToast();

    const statusMutation = useMutation({
        mutationFn: updateMarketplaceListingStatus,
        onSuccess: (updated) => {
            queryClient.invalidateQueries({ queryKey: ["marketplaceListings"] });
            showSuccess(updated?.isSold ? "Listing marked as Sold!" : "Listing marked as Active!");
        },
        onError: (err) => {
            showError(err.response?.data?.message || "Failed to update listing status");
        }
    });

    const deleteMutation = useMutation({
        mutationFn: deleteMarketplaceListing,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["marketplaceListings"] });
            showSuccess("Listing deleted successfully!");
            onClose();
        },
        onError: (err) => {
            showError(err.response?.data?.message || "Failed to delete listing");
        }
    });

    if (!isOpen || !item) return null;

    const isOwner = currentUser?.id === item.sellerId;
    const displayImage = item.images?.[0] || item.image || "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=600&auto=format&fit=crop";

    const handleContactSeller = () => {
        if (!item.sellerId) return;
        const initialMsg = encodeURIComponent(`Hi ${item.seller?.name || "there"}, I'm interested in your listing "${item.title}" listed for $${item.price.toLocaleString()}. Is it still available?`);
        navigate(`/chats?userId=${item.sellerId}&initialMsg=${initialMsg}`);
        onClose();
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-10">
                        <div className="flex items-center gap-2">
                            <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 text-xs font-bold rounded-xl uppercase tracking-wider">
                                {item.category || "General"}
                            </span>
                            {item.isSold ? (
                                <span className="flex items-center gap-1 px-3 py-1 bg-rose-500/10 text-rose-500 text-xs font-bold rounded-xl">
                                    <AlertCircle className="w-3.5 h-3.5" />
                                    SOLD
                                </span>
                            ) : (
                                <span className="flex items-center gap-1 px-3 py-1 bg-emerald-500/10 text-emerald-500 text-xs font-bold rounded-xl">
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    AVAILABLE
                                </span>
                            )}
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Body Content */}
                    <div className="overflow-y-auto p-6 space-y-6">
                        {/* Image Preview */}
                        <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-gray-100 dark:bg-slate-800 border border-gray-100 dark:border-slate-800 shadow-inner">
                            <img
                                src={displayImage}
                                alt={item.title}
                                className="w-full h-full object-cover"
                            />
                            {item.isSold && (
                                <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center">
                                    <span className="px-6 py-2 bg-rose-600 text-white font-black text-xl rounded-2xl tracking-widest uppercase shadow-2xl rotate-[-6deg]">
                                        SOLD OUT
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Main Info */}
                        <div className="space-y-3">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h1 className="text-2xl font-black text-gray-900 dark:text-gray-100 leading-tight">
                                        {item.title}
                                    </h1>
                                    {item.location && (
                                        <p className="flex items-center gap-1 text-xs font-semibold text-gray-400 mt-1">
                                            <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                                            {item.location}
                                        </p>
                                    )}
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                                        ${item.price?.toLocaleString()}
                                    </p>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="p-4 bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-gray-100 dark:border-slate-800">
                                <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                                    Description
                                </h4>
                                <p className="text-xs font-medium text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                                    {item.description || "No description provided."}
                                </p>
                            </div>
                        </div>

                        {/* Seller Details Card */}
                        <div className="flex items-center justify-between p-4 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-2xl border border-indigo-100 dark:border-indigo-900/30">
                            <div className="flex items-center gap-3">
                                <img
                                    src={item.seller?.profileImage || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"}
                                    alt={item.seller?.name || "Seller"}
                                    className="w-12 h-12 rounded-full object-cover border-2 border-indigo-500/30"
                                />
                                <div>
                                    <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100">
                                        {item.seller?.name || "Seller"}
                                    </h3>
                                    <p className="text-[11px] font-semibold text-gray-500 dark:text-gray-400">
                                        {isOwner ? "You listed this item" : "Community Seller"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Modal Footer Actions */}
                    <div className="p-4 px-6 border-t border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/50 flex items-center justify-between gap-3">
                        {isOwner ? (
                            <div className="flex items-center justify-between w-full gap-3">
                                <button
                                    onClick={() => statusMutation.mutate({ id: item.id, isSold: !item.isSold })}
                                    disabled={statusMutation.isPending}
                                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${item.isSold
                                            ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md"
                                            : "bg-amber-500 hover:bg-amber-600 text-white shadow-md"
                                        }`}
                                >
                                    {item.isSold ? "Mark as Available" : "Mark as Sold"}
                                </button>
                                <button
                                    onClick={() => deleteMutation.mutate(item.id)}
                                    disabled={deleteMutation.isPending}
                                    className="flex items-center gap-2 px-4 py-2.5 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-600 dark:text-rose-400 rounded-xl text-xs font-bold transition-all cursor-pointer"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Delete Listing
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center justify-end w-full gap-3">
                                <button
                                    onClick={onClose}
                                    className="px-5 py-2.5 text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-all cursor-pointer"
                                >
                                    Close
                                </button>
                                <button
                                    onClick={handleContactSeller}
                                    disabled={item.isSold}
                                    className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <MessageCircle className="w-4 h-4" />
                                    {item.isSold ? "Item Sold" : "Contact Seller"}
                                </button>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
