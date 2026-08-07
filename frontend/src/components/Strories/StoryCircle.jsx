import { motion } from "framer-motion";

const StoryCircle = ({ story }) => {
  if (!story) return null;

  const storyItem = story.story || story;
  const user = storyItem.user || {};
  const mediaUrl = storyItem.mediaUrl || story.image || "/default-avatar.png";
  const name = user.name || story.name || "Story";
  const profileImage = user.profileImage || mediaUrl;

  return (
    <motion.button
      whileHover={{ scale: 1.04, y: -2 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      type="button"
      className="group relative h-44 w-32 flex-shrink-0 overflow-hidden rounded-2xl bg-gray-900 text-left text-white shadow-md hover:shadow-xl dark:hover:shadow-indigo-950/40 focus:outline-none transition-shadow duration-300 cursor-pointer"
    >
      {storyItem.mediaType === "VIDEO" ? (
        <video src={mediaUrl} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
      ) : (
        <img
          src={mediaUrl}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity group-hover:opacity-90" />
      <motion.span
        whileHover={{ scale: 1.1 }}
        className="absolute left-3 top-3 rounded-full border-2 border-indigo-500 bg-white p-0.5 shadow-md transition-transform"
      >
        <img src={profileImage} alt="" className="h-8 w-8 rounded-full object-cover" />
      </motion.span>
      <span className="absolute bottom-4 left-3 right-3 truncate text-xs font-bold">{name}</span>
    </motion.button>
  );
};

export default StoryCircle;

