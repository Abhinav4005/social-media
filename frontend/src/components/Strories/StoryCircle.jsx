import React from "react";
import { motion } from "framer-motion";

const StoryCircle = ({ story }) => {
    // If no story is passed (safeguard for development)
    if (!story) return null;

    return (
        <motion.div
            whileHover={{ y: -4 }}
            className="relative flex-shrink-0 w-32 h-44 rounded-3xl overflow-hidden group cursor-pointer shadow-lg border border-white/50"
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
            <div className="absolute top-4 left-4">
                <div className="p-0.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl overflow-hidden shadow-lg border border-white/20">
                    <img
                        src={story.image}
                        alt={story.name}
                        className="w-8 h-8 rounded-[10px] object-cover"
                    />
                </div>
            </div>

            <div className="absolute bottom-4 left-4 right-4">
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