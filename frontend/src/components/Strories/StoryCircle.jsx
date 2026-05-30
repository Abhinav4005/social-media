import React from "react";
import { motion } from "framer-motion";

const StoryCircle = ({ story }) => {
    // If no story is passed (safeguard for development)
    if (!story) return null;

    return (
        <motion.div
            whileHover={{ y: -3 }}
            className="group relative h-36 w-25 flex-shrink-0 cursor-pointer overflow-hidden rounded-2xl border border-white/70 shadow-sm"
        >
            <div className="absolute inset-0">
                <img
                    src={story.image}
                    alt={story.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            {/* User Avatar Badge - Using the same image for mock */}
            <div className="absolute top-3 left-3">
                <div className="p-0.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full overflow-hidden shadow-lg border border-white/20">
                    <img
                        src={story.image}
                        alt={story.name}
                        className="h-7 w-7 rounded-full object-cover"
                    />
                </div>
            </div>

            <div className="absolute bottom-3 left-3 right-3">
                <span className="text-[11px] font-black text-white truncate block tracking-tighter shadow-sm uppercase">
                    {story.name}
                </span>
            </div>

            {/* View Pulse Effect Overlay */}
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-white/30 rounded-3xl transition-colors duration-500" />
        </motion.div>
    );
};

export default StoryCircle;
