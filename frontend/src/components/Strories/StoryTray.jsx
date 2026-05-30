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
        <div className="mb-5 rounded-3xl border border-gray-100 bg-white p-4 shadow-[0_22px_60px_-42px_rgba(15,23,42,0.45)]">
            <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-hide">
                <motion.div
                    whileHover={{ y: -3 }}
                    onClick={() => setIsModalOpen(true)}
                    className="group relative h-36 w-25 flex-shrink-0 cursor-pointer overflow-hidden rounded-2xl shadow-sm ring-1 ring-gray-100"
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
                        <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-xl bg-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                            <Plus className="w-5 h-5 text-indigo-600" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.16em] text-white">Add story</span>
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
