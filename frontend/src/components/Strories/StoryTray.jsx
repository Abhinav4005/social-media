import React, { useState } from "react";
import StoryCircle from "./StoryCircle";
import { useSelector } from "react-redux";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import CreateStoryModal from "../../Modal/CreateStoryModal";

const StoryTray = () => {
    const { user } = useSelector((state) => state.auth);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const mockStories = [
        { id: 1, name: "Jessica", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=300&auto=format&fit=crop" },
        { id: 2, name: "Alex", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop" },
        { id: 3, name: "Sarah", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=300&auto=format&fit=crop" },
        { id: 4, name: "Mike", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop" },
        { id: 5, name: "Emma", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=300&auto=format&fit=crop" },
        { id: 6, name: "David", image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=300&auto=format&fit=crop" },
    ];

    return (
        <div className="w-full bg-white/40 backdrop-blur-xl rounded-[40px] p-6 border border-white/60 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] mb-8">
            <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-hide">
                <motion.div
                    whileHover={{ y: -4 }}
                    onClick={() => setIsModalOpen(true)}
                    className="relative flex-shrink-0 w-32 h-44 rounded-3xl overflow-hidden group cursor-pointer shadow-lg"
                >
                    <div className="absolute inset-0 bg-gray-900">
                        {user?.profileImage ? (
                            <img
                                src={user.profileImage}
                                alt="Your profile"
                                className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-500"
                            />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600" />
                        )}
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                    <div className="absolute bottom-0 inset-x-0 p-4 flex flex-col items-center">
                        <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-xl mb-3 group-hover:scale-110 transition-transform duration-300">
                            <Plus className="w-5 h-5 text-indigo-600" />
                        </div>
                        <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Add story</span>
                    </div>
                </motion.div>

                {mockStories.map((story) => (
                    <StoryCircle key={story.id} story={story} />
                ))}
            </div>

            <CreateStoryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
};

export default StoryTray;