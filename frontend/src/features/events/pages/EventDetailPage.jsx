import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import {
    CalendarDays,
    MapPin,
    Users,
    Clock,
    ArrowLeft,
    Loader2,
    Trash2,
    CheckCircle2,
    HelpCircle,
    XCircle,
} from "lucide-react";
import Navbar from "../../../pages/Navbar";
import Sidebar from "../../../pages/Sidebar";
import FeedLayout from "../../../components/FeedLayout";
import EmptyState from "../../../components/Common/EmptyState";
import { getEventById, rsvpEvent, deleteEvent } from "../../../api";
import { useToast } from "../../../context/ToastContext";

function formatFullDate(dateStr) {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export default function EventDetailPage() {
    const { id } = useParams();
    const eventId = parseInt(id, 10);
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { showSuccess, showError } = useToast();
    const { user: currentUser } = useSelector((state) => state.auth);

    const [activeTab, setActiveTab] = useState("details");

    const { data: event, isLoading: loadingEvent, error } = useQuery({
        queryKey: ["event", eventId],
        queryFn: () => getEventById(eventId),
        enabled: !isNaN(eventId),
    });

    const rsvpMutation = useMutation({
        mutationFn: (status) => rsvpEvent(eventId, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["event", eventId] });
            queryClient.invalidateQueries({ queryKey: ["upcomingEvents"] });
            queryClient.invalidateQueries({ queryKey: ["myEvents"] });
            showSuccess("RSVP status updated!");
        },
        onError: (err) => showError(err?.response?.data?.message || "Failed to update RSVP"),
    });

    const deleteMutation = useMutation({
        mutationFn: () => deleteEvent(eventId),
        onSuccess: () => {
            showSuccess("Event deleted");
            navigate("/events");
        },
        onError: (err) => showError(err?.response?.data?.message || "Failed to delete event"),
    });

    const currentRsvp = event?.attendees?.find((a) => a.userId === currentUser?.id)?.status;
    const isOrganizer = event?.organizerId === currentUser?.id;

    if (loadingEvent) {
        return (
            <>
                <Navbar />
                <FeedLayout
                    left={<Sidebar />}
                    center={
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                        </div>
                    }
                />
            </>
        );
    }

    if (error || !event) {
        return (
            <>
                <Navbar />
                <FeedLayout
                    left={<Sidebar />}
                    center={
                        <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 space-y-4">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Event not found</h2>
                            <p className="text-sm text-gray-400">The event you are looking for does not exist or has been deleted.</p>
                            <button
                                onClick={() => navigate("/events")}
                                className="px-5 py-2.5 bg-indigo-600 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
                            >
                                Back to Events
                            </button>
                        </div>
                    }
                />
            </>
        );
    }

    return (
        <>
            <Navbar />
            <FeedLayout
                left={<Sidebar />}
                center={
                    <div className="space-y-6">
                        {/* Back Button */}
                        <button
                            onClick={() => navigate("/events")}
                            className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-indigo-600 transition-all cursor-pointer"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Events
                        </button>

                        {/* Event Hero Card */}
                        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 overflow-hidden shadow-xs">
                            <div className="relative h-48 sm:h-64 bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 overflow-hidden">
                                {event.coverImage && (
                                    <img src={event.coverImage} alt={event.title} className="w-full h-full object-cover" />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                                {/* Organizer Delete Action */}
                                {isOrganizer && (
                                    <button
                                        onClick={() => deleteMutation.mutate()}
                                        disabled={deleteMutation.isPending}
                                        className="absolute top-4 right-4 p-2.5 bg-red-600/80 hover:bg-red-700 text-white rounded-xl backdrop-blur-md transition-all cursor-pointer"
                                        title="Delete Event"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}

                                {/* Details Overlay */}
                                <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
                                    <div className="space-y-1.5">
                                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[11px] font-bold">
                                            <Clock className="w-3.5 h-3.5" />
                                            {formatFullDate(event.startDate)}
                                        </div>
                                        <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">{event.title}</h1>
                                        {event.location && (
                                            <p className="text-xs font-medium text-gray-200 flex items-center gap-1">
                                                <MapPin className="w-3.5 h-3.5" />
                                                {event.location}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* RSVP Action Bar */}
                            <div className="p-4 sm:p-6 bg-gray-50/50 dark:bg-slate-800/40 border-b border-gray-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold">
                                        <Users className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold text-gray-900 dark:text-gray-100">
                                            {event.attendees?.length || 0} Attending
                                        </h4>
                                        <p className="text-[11px] text-gray-400 font-medium">
                                            Organized by {event.organizer?.name || "Community Member"}
                                        </p>
                                    </div>
                                </div>

                                {/* RSVP Options */}
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => rsvpMutation.mutate("INTERESTED")}
                                        disabled={rsvpMutation.isPending}
                                        className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${currentRsvp === "INTERESTED"
                                                ? "bg-amber-500 text-white shadow-sm"
                                                : "bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-slate-700 hover:bg-gray-100"
                                            }`}
                                    >
                                        <HelpCircle className="w-3.5 h-3.5" />
                                        Interested
                                    </button>
                                    <button
                                        onClick={() => rsvpMutation.mutate("GOING")}
                                        disabled={rsvpMutation.isPending}
                                        className={`flex items-center gap-1.5 px-5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${currentRsvp === "GOING"
                                                ? "bg-indigo-600 text-white shadow-md"
                                                : "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50 hover:bg-indigo-600 hover:text-white"
                                            }`}
                                    >
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                        Going
                                    </button>
                                </div>
                            </div>

                            {/* Tabs */}
                            <div className="flex border-b border-gray-100 dark:border-slate-800 px-6">
                                {[
                                    { id: "details", label: "Event Details" },
                                    { id: "attendees", label: `Attendees (${event.attendees?.length || 0})` },
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`py-3.5 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer ${activeTab === tab.id
                                                ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
                                                : "border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                                            }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* TAB CONTENT */}
                        {activeTab === "details" && (
                            <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-xs space-y-6">
                                <div>
                                    <h3 className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">About Event</h3>
                                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-medium leading-relaxed">
                                        {event.description || "No description provided for this event."}
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-100 dark:border-slate-800">
                                    <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-slate-800/50 rounded-2xl">
                                        <CalendarDays className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mt-0.5" />
                                        <div>
                                            <h4 className="text-xs font-bold text-gray-900 dark:text-gray-100">Date & Time</h4>
                                            <p className="text-xs text-gray-500 font-medium mt-0.5">{formatFullDate(event.startDate)}</p>
                                            {event.endDate && <p className="text-[11px] text-gray-400 mt-0.5">Until {formatFullDate(event.endDate)}</p>}
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-slate-800/50 rounded-2xl">
                                        <MapPin className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mt-0.5" />
                                        <div>
                                            <h4 className="text-xs font-bold text-gray-900 dark:text-gray-100">Location</h4>
                                            <p className="text-xs text-gray-500 font-medium mt-0.5">{event.location || "Online / TBD"}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "attendees" && (
                            <div className="space-y-4">
                                {!event.attendees || event.attendees.length === 0 ? (
                                    <EmptyState icon={Users} title="No attendees yet" description="Be the first to RSVP for this event!" />
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {event.attendees.map((attendee) => (
                                            <div
                                                key={attendee.id}
                                                className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-xs"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs overflow-hidden">
                                                        {attendee.user?.profileImage ? (
                                                            <img src={attendee.user.profileImage} alt={attendee.user.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            attendee.user?.name?.[0] || "U"
                                                        )}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-xs text-gray-900 dark:text-gray-100">{attendee.user?.name}</h4>
                                                        <p className="text-[11px] text-gray-400">{attendee.user?.email}</p>
                                                    </div>
                                                </div>

                                                <span
                                                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${attendee.status === "GOING"
                                                            ? "bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300"
                                                            : "bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-300"
                                                        }`}
                                                >
                                                    {attendee.status}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                }
            />
        </>
    );
}
