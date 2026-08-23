import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CalendarDays, MapPin, Image as ImageIcon, Loader2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEvent } from "../../../api";
import { QUERY_KEYS } from "../../../constant/queryKeys";
import { useToast } from "../../../context/ToastContext";
import { useNavigate } from "react-router-dom";

export default function CreateEventModal({ isOpen, onClose }) {
    const queryClient = useQueryClient();
    const { showSuccess, showError } = useToast();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        location: "",
        startDate: "",
        endDate: "",
        coverImage: "",
    });

    const createMutation = useMutation({
        mutationFn: (data) => createEvent(data),
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.upcomingEvents });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.myEvents });
            showSuccess("Event created successfully!");
            onClose();
            if (res?.data?.id) {
                navigate(`/events/${res.data.id}`);
            }
        },
        onError: (err) => {
            showError(err?.response?.data?.message || "Failed to create event");
        },
    });

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.title.trim() || formData.title.trim().length < 2) {
            showError("Event title must be at least 2 characters");
            return;
        }
        if (!formData.startDate) {
            showError("Start date and time are required");
            return;
        }
        createMutation.mutate(formData);
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                />

                {/* Modal Container */}
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden z-10"
                >
                    {/* Header Banner */}
                    <div className="relative h-24 bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 p-6 flex items-end justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white">
                                <CalendarDays className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-white tracking-tight">Create Event</h3>
                                <p className="text-xs font-medium text-purple-100">Plan a meetup, party, or community gathering</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 rounded-xl bg-black/20 hover:bg-black/40 text-white transition-all cursor-pointer"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                        {/* Title */}
                        <div>
                            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                                Event Title *
                            </label>
                            <input
                                type="text"
                                required
                                placeholder="e.g. React Meetup 2026, Summer Tech Party"
                                value={formData.title}
                                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800/60 border border-gray-200 dark:border-slate-700 rounded-2xl text-sm font-medium text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:border-indigo-500 transition-all"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                                Description
                            </label>
                            <textarea
                                rows={3}
                                placeholder="Tell people what your event is about..."
                                value={formData.description}
                                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800/60 border border-gray-200 dark:border-slate-700 rounded-2xl text-sm font-medium text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:border-indigo-500 transition-all resize-none"
                            />
                        </div>

                        {/* Date & Time Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                                    Start Date & Time *
                                </label>
                                <input
                                    type="datetime-local"
                                    required
                                    value={formData.startDate}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, startDate: e.target.value }))}
                                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-800/60 border border-gray-200 dark:border-slate-700 rounded-2xl text-xs font-semibold text-gray-900 dark:text-gray-100 focus:outline-none focus:border-indigo-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                                    End Date & Time
                                </label>
                                <input
                                    type="datetime-local"
                                    value={formData.endDate}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, endDate: e.target.value }))}
                                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-800/60 border border-gray-200 dark:border-slate-700 rounded-2xl text-xs font-semibold text-gray-900 dark:text-gray-100 focus:outline-none focus:border-indigo-500"
                                />
                            </div>
                        </div>

                        {/* Location */}
                        <div>
                            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                                Location
                            </label>
                            <div className="relative">
                                <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="e.g. Innovation Hub, Auditorium B or Online Zoom"
                                    value={formData.location}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-slate-800/60 border border-gray-200 dark:border-slate-700 rounded-2xl text-sm font-medium text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:border-indigo-500 transition-all"
                                />
                            </div>
                        </div>

                        {/* Cover Image URL */}
                        <div>
                            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                                Cover Image URL (Optional)
                            </label>
                            <div className="relative">
                                <ImageIcon className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                                <input
                                    type="url"
                                    placeholder="https://images.unsplash.com/photo-..."
                                    value={formData.coverImage}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, coverImage: e.target.value }))}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-slate-800/60 border border-gray-200 dark:border-slate-700 rounded-2xl text-sm font-medium text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:border-indigo-500 transition-all"
                                />
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-slate-800">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-5 py-2.5 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={createMutation.isPending}
                                className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
                            >
                                {createMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                                Create Event
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
