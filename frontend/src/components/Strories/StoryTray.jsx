import { useState } from "react";
import { motion } from "framer-motion";
import StoryCircle from "./StoryCircle";
import { useSelector } from "react-redux";
import { Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getStories } from "../../api";
import CreateStoryModal from "../../Modal/CreateStoryModal";

const StoryTray = () => {
  const { user } = useSelector((state) => state.auth);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: storiesFeed = [] } = useQuery({
    queryKey: ["stories"],
    queryFn: getStories,
    refetchInterval: 30000, // Poll active stories every 30s
  });

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="app-surface p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-gray-100 dark:border-slate-800 transition-colors duration-200"
    >
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        <motion.button
          whileHover={{ scale: 1.04, y: -2 }}
          whileTap={{ scale: 0.96 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="group relative h-44 w-32 flex-shrink-0 overflow-hidden rounded-2xl bg-gray-900 text-white shadow-md hover:shadow-xl dark:hover:shadow-indigo-950/40 transition-shadow duration-300 cursor-pointer"
        >
          {user?.profileImage ? (
            <img src={user.profileImage} alt="" className="h-full w-full object-cover opacity-70 transition-transform duration-500 group-hover:scale-110" />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-indigo-600 to-purple-600 transition-transform duration-500 group-hover:scale-105" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <motion.span
            whileHover={{ scale: 1.15, rotate: 90 }}
            className="absolute bottom-10 left-1/2 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full border-4 border-white dark:border-slate-900 bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg transition-transform duration-300"
          >
            <Plus className="h-5 w-5 text-white" />
          </motion.span>
          <span className="absolute bottom-4 left-2 right-2 text-center text-xs font-bold">Create story</span>
        </motion.button>

        {storiesFeed.map((story, index) => (
          <motion.div
            key={story.id || index}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
          >
            <StoryCircle story={story} />
          </motion.div>
        ))}
      </div>

      <CreateStoryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </motion.section>
  );
};

export default StoryTray;

