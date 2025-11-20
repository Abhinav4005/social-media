import { motion, AnimatePresence } from "framer-motion";
import { useMemo } from "react";

const TypingIndicator = ({ typingUsers, otherMembers }) => {
  if (!otherMembers || otherMembers.length === 0) return null;

  const typingMembers = useMemo(() => {
    return otherMembers.filter((m) => typingUsers.includes(m.user.id));
  }, [typingUsers, otherMembers]);

  if (typingMembers.length === 0) return null;

  const names = typingMembers.map((m) => m.user.name || "Someone");

  let typingText = "";
  if (names.length === 1) {
    typingText = `${names[0]} is typing`;
  } else if (names.length === 2) {
    typingText = `${names[0]} and ${names[1]} are typing`;
  } else {
    typingText = `${names[0]}, ${names[1]} and ${names.length - 2} others are typing`;
  }

  return (
    <AnimatePresence>
      <motion.div
        key="typing"
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 5 }}
        transition={{ duration: 0.2 }}
        className="absolute bottom-16 left-[470px] text-sm text-gray-600 italic flex items-center gap-2"
      >
        {/* Text */}
        <span>{typingText}</span>

        {/* Animated dots */}
        <span className="flex gap-1">
          <motion.span
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="w-2 h-2 rounded-full bg-gray-500"
          />
          <motion.span
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
            className="w-2 h-2 rounded-full bg-gray-500"
          />
          <motion.span
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
            className="w-2 h-2 rounded-full bg-gray-500"
          />
        </span>
      </motion.div>
    </AnimatePresence>
  );
};

export default TypingIndicator;