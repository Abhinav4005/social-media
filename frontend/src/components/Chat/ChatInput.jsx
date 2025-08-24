import { Send } from "lucide-react";
import { useState } from "react";
import { socket } from "../../../socket";
import { useSelector } from "react-redux";

const ChatInput = () => {
    const { user } = useSelector((state) => state.auth);
    const [message, setMessage] = useState("");

    const handleSendMessage = () => {
        if(message.trim()) {
            socket.emit("send_message", { content: message, senderId: user?.id });
            setMessage("");
        }
    }

    return (
        <div className="p-4 border-t border-gray-200 bg-white flex items-center gap-3">
            <input
                type="text"
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-blue-400"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            <button 
            className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
            onClick={handleSendMessage}
            >
                <Send size={20} />
            </button>
        </div>
    );
};

export default ChatInput;