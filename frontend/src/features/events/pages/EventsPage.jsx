import { useState } from "react";
import { CalendarDays, MapPin, Plus, Loader2, Users } from "lucide-react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import Navbar from "../../../pages/Navbar";
import Sidebar from "../../../pages/Sidebar";
import FeedLayout from "../../../components/FeedLayout";
import EmptyState from "../../../components/Common/EmptyState";
import { getUpcomingEvents, getMyEvents, rsvpEvent } from "../../../api";
import { QUERY_KEYS } from "../../../constant/queryKeys";
import { useToast } from "../../../context/ToastContext";
import CreateEventModal from "../modals/CreateEventModal";

const EventShimmer = () => (
  <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 animate-pulse">
    <div className="flex items-center gap-4">
      <div className="w-14 h-16 bg-gray-200 dark:bg-slate-700 rounded-2xl" />
      <div className="space-y-2">
        <div className="h-3.5 w-40 bg-gray-200 dark:bg-slate-700 rounded" />
        <div className="h-2.5 w-28 bg-gray-100 dark:bg-slate-800 rounded" />
        <div className="h-2 w-36 bg-gray-100 dark:bg-slate-800 rounded" />
      </div>
    </div>
    <div className="h-8 w-20 bg-gray-200 dark:bg-slate-700 rounded-xl" />
  </div>
);

function formatEventDate(dateStr) {
  const d = new Date(dateStr);
  const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return {
    month: months[d.getMonth()],
    day: d.getDate().toString().padStart(2, "0"),
    full: `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]} at ${d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
  };
}

export default function EventsPage() {
  const [tab, setTab] = useState("upcoming");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  const { data: upcomingEvents = [], isLoading: loadingUpcoming } = useQuery({
    queryKey: QUERY_KEYS.upcomingEvents,
    queryFn: () => getUpcomingEvents(20, 0),
  });

  const { data: myEvents = [], isLoading: loadingMy } = useQuery({
    queryKey: QUERY_KEYS.myEvents,
    queryFn: getMyEvents,
  });

  const rsvpMutation = useMutation({
    mutationFn: ({ eventId, status }) => rsvpEvent(eventId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.upcomingEvents });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.myEvents });
      showSuccess("RSVP updated!");
    },
    onError: (err) => showError(err?.response?.data?.message || "Failed to update RSVP"),
  });

  const displayedEvents = tab === "upcoming" ? upcomingEvents : myEvents;
  const isLoading = tab === "upcoming" ? loadingUpcoming : loadingMy;

  const getUserRsvpStatus = (event) => {
    if (event.attendees && event.attendees.length > 0) {
      return event.attendees[0]?.status;
    }
    return null;
  };

  return (
    <>
      <Navbar />
      <FeedLayout
        left={<Sidebar />}
        center={
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-black text-gray-900 dark:text-gray-100 tracking-tight">Events</h1>
                <p className="text-xs font-semibold text-gray-400 dark:text-gray-400">Discover upcoming events and meetups near you</p>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Create event
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-gray-100 dark:border-slate-800 pb-3">
              {[
                { id: "upcoming", label: "Upcoming" },
                { id: "my", label: "My Events" },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${tab === t.id
                    ? "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900/50 shadow-xs"
                    : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800"
                    }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Event List */}
            {isLoading ? (
              <div className="space-y-4">
                <EventShimmer />
                <EventShimmer />
                <EventShimmer />
              </div>
            ) : displayedEvents.length === 0 ? (
              <EmptyState
                icon={CalendarDays}
                title={tab === "upcoming" ? "No upcoming events" : "No events yet"}
                description={
                  tab === "upcoming"
                    ? "There are no upcoming events right now. Create one or check back later!"
                    : "You haven't RSVP'd to any events yet. Browse upcoming events to get started."
                }
              />
            ) : (
              <div className="space-y-4">
                {displayedEvents.map((event) => {
                  const date = formatEventDate(event.startDate);
                  const rsvpStatus = getUserRsvpStatus(event);
                  const isBusy = rsvpMutation.isPending;

                  return (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={() => navigate(`/events/${event.id}`)}
                      className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-xs hover:shadow-md transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-16 bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-900/50 rounded-2xl flex flex-col items-center justify-center flex-shrink-0">
                          <span className="text-[10px] font-black uppercase text-indigo-600 dark:text-indigo-400 tracking-wider">{date.month}</span>
                          <span className="text-xl font-black text-gray-900 dark:text-gray-100 leading-tight">{date.day}</span>
                        </div>
                        <div>
                          <h4 className="font-bold text-base text-gray-900 dark:text-gray-100">{event.title}</h4>
                          {event.location && (
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-0.5 flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {event.location}
                            </p>
                          )}
                          <p className="text-[11px] font-semibold text-gray-400 dark:text-gray-400 mt-1 flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {date.full} • {event._count?.attendees || 0} attending
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            rsvpMutation.mutate({ eventId: event.id, status: rsvpStatus === "INTERESTED" ? "NOT_GOING" : "INTERESTED" });
                          }}
                          disabled={isBusy}
                          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer disabled:opacity-50 ${rsvpStatus === "INTERESTED"
                            ? "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900/50"
                            : "bg-gray-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 dark:hover:text-indigo-400 text-gray-700 dark:text-gray-300"
                            }`}
                        >
                          {isBusy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : rsvpStatus === "INTERESTED" ? "Interested ✓" : "Interested"}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            rsvpMutation.mutate({ eventId: event.id, status: rsvpStatus === "GOING" ? "NOT_GOING" : "GOING" });
                          }}
                          disabled={isBusy}
                          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer disabled:opacity-50 ${rsvpStatus === "GOING"
                            ? "bg-indigo-600 text-white shadow-sm"
                            : "bg-gray-100 dark:bg-slate-800 hover:bg-indigo-600 hover:text-white text-gray-700 dark:text-gray-300"
                            }`}
                        >
                          {isBusy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : rsvpStatus === "GOING" ? "Going ✓" : "Going"}
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        }
      />

      <CreateEventModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </>
  );
}
