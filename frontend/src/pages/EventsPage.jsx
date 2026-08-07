import React from "react";
import { CalendarDays, MapPin, Users, Plus, Check } from "lucide-react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import FeedLayout from "../components/FeedLayout";

const events = [
  { id: 1, month: "JUN", day: "15", title: "Design Conference 2024", location: "Javits Convention Center, NY", details: "Sat, 15 Jun at 10:30 AM • 1.2K interested • 300 going" },
  { id: 2, month: "JUN", day: "22", title: "Live Music Festival", location: "Central Park, New York", details: "Sun, 22 Jun at 04:00 PM • 2.4K interested • 1.1K going" },
  { id: 3, month: "JUN", day: "30", title: "Startup Networking Night", location: "WeWork, New York", details: "Sun, 30 Jun at 07:00 PM • 854 interested • 310 going" },
];

export default function EventsPage() {
  return (
    <>
      <Navbar />
      <FeedLayout
        left={<Sidebar />}
        center={
          <div className="space-y-6">
            {/* Top Bar */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-black text-gray-900 dark:text-gray-100 tracking-tight">Events</h1>
                <p className="text-xs font-semibold text-gray-400 dark:text-gray-400">Discover upcoming events and meetups near you</p>
              </div>
              <button className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer">
                <Plus className="w-4 h-4" />
                Create event
              </button>
            </div>

            {/* Events List */}
            <div>
              <h3 className="text-lg font-black text-gray-900 dark:text-gray-100 tracking-tight mb-4">Upcoming events</h3>
              <div className="space-y-4">
                {events.map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-xs hover:shadow-md transition-all">
                    <div className="flex items-center gap-4">
                      {/* Date Badge */}
                      <div className="w-14 h-16 bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-900/50 rounded-2xl flex flex-col items-center justify-center flex-shrink-0">
                        <span className="text-[10px] font-black uppercase text-indigo-600 dark:text-indigo-400 tracking-wider">{event.month}</span>
                        <span className="text-xl font-black text-gray-900 dark:text-gray-100 leading-tight">{event.day}</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-base text-gray-900 dark:text-gray-100">{event.title}</h4>
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-0.5">{event.location}</p>
                        <p className="text-[11px] font-semibold text-gray-400 dark:text-gray-400 mt-1">{event.details}</p>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-gray-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 dark:hover:text-indigo-400 text-gray-700 dark:text-gray-300 text-xs font-bold rounded-xl transition-all cursor-pointer">
                      Interested
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        }
      />
    </>
  );
}
