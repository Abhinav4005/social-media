import { Send } from "lucide-react";

const ChatInput = () => {
    return (
        <div className="p-4 border-t border-gray-200 bg-white flex items-center gap-3">
            <input
                type="text"
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition">
                <Send size={20} />
            </button>
        </div>
    );
};

export default ChatInput;