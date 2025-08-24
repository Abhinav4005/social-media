import { motion } from "framer-motion";

const ChatMessages = () => {
  const messages = [
    { id: 1, sender: "Paras", text: "Hey Abhinav! Kaise ho?", mine: false, time: "10:30 AM" },
    { id: 2, sender: "Me", text: "Main thik hu! Tu bata?", mine: true, time: "10:31 AM" },
    { id: 3, sender: "Paras", text: "Bas badhiya! Kal milte hain?", mine: false, time: "10:32 AM" },
    { id: 4, sender: "Me", text: "Haan perfect 👍", mine: true, time: "10:33 AM" },
  ];

  return (
    <div className="flex-1 p-6 space-y-4 overflow-y-auto bg-gradient-to-b from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-950 scrollbar-hide">
      {messages.map((msg) => (
        <motion.div
          key={msg.id}
          initial={{ x: msg.mine ? 40 : -40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 120, damping: 15 }}
          className={`flex ${msg.mine ? "justify-end" : "items-start gap-3"}`}
        >
          {/* Avatar for other user */}
          {!msg.mine && (
            <div className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold shadow">
              {msg.sender.charAt(0)}
            </div>
          )}

          {/* Message bubble */}
          <div
            className={`relative px-4 py-2 rounded-2xl max-w-xs shadow-md backdrop-blur-md ${
              msg.mine
                ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-br-none"
                : "bg-white/70 dark:bg-gray-800/70 text-gray-800 dark:text-gray-200 rounded-bl-none"
            }`}
          >
            <p>{msg.text}</p>
            <span
              className={`absolute -bottom-4 text-[10px] ${
                msg.mine ? "right-1 text-blue-300" : "left-1 text-gray-500 dark:text-gray-400"
              }`}
            >
              {msg.time}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ChatMessages;