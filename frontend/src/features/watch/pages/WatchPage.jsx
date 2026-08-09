import React from "react";
import { Play } from "lucide-react";
import Navbar from "../../../pages/Navbar";
import Sidebar from "../../../pages/Sidebar";
import FeedLayout from "../../../components/FeedLayout";

const topVideos = [
  { id: 1, title: "Minimal Desk Setup 2024", channel: "Mindset Hub", views: "280K views • 3 days ago", duration: "10:14", image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?q=80&w=600&auto=format&fit=crop" },
  { id: 2, title: "How to Build Better Habits", channel: "Food Recipes", views: "1.5M views • 2 days ago", duration: "15:20", image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=600&auto=format&fit=crop" },
  { id: 3, title: "Easy 20-Minute Pasta Recipe", channel: "Comedy Club", views: "410K views • 5 days ago", duration: "08:45", image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=600&auto=format&fit=crop" },
];

export default function WatchPage() {
  return (
    <>
      <Navbar />
      <FeedLayout
        left={<Sidebar />}
        center={
          <div className="space-y-6">
            <div className="overflow-hidden rounded-3xl bg-black border border-gray-100 dark:border-slate-800 shadow-xl relative group">
              <div className="relative aspect-video w-full overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop"
                  alt="Featured Video"
                  className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex items-center justify-center">
                  <button className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center text-indigo-600 shadow-2xl hover:scale-110 transition-transform cursor-pointer">
                    <Play className="w-8 h-8 fill-indigo-600 ml-1" />
                  </button>
                </div>
                <span className="absolute bottom-4 right-4 bg-black/80 text-white text-xs font-bold px-2.5 py-1 rounded-md">
                  12:45
                </span>
              </div>
              <div className="p-5 text-white bg-gradient-to-b from-gray-900 to-black">
                <h2 className="text-xl font-black tracking-tight">Explore the Hidden Paradise</h2>
                <p className="text-xs font-semibold text-gray-400 mt-1">Travel Lovers • 2.3M views • 2 days ago</p>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-black text-gray-900 dark:text-gray-100 tracking-tight">Top videos for you</h3>
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer">See all</span>
              </div>

              <div className="space-y-4">
                {topVideos.map((video) => (
                  <div key={video.id} className="flex gap-4 p-3 bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-xs hover:shadow-md transition-all">
                    <div className="relative w-44 h-28 rounded-xl overflow-hidden flex-shrink-0">
                      <img src={video.image} alt={video.title} className="w-full h-full object-cover" />
                      <span className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                        {video.duration}
                      </span>
                    </div>
                    <div className="flex flex-col justify-between py-1">
                      <div>
                        <h4 className="font-bold text-sm text-gray-900 dark:text-gray-100 leading-snug">{video.title}</h4>
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-1">{video.channel}</p>
                      </div>
                      <p className="text-[11px] font-semibold text-gray-400 dark:text-gray-400">{video.views}</p>
                    </div>
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
