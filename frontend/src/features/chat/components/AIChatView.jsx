import React, { useState, useRef, useEffect } from "react";
import { Bot, Send, Sparkles, User, RefreshCw, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { sendAIChatMessage } from "../../../api";
import { useSelector } from "react-redux";
import { useToast } from "../../../context/ToastContext";

const QUICK_SUGGESTIONS = [
    "✨ Help me write an engaging post",
    "🛍️ Tips for selling items on Marketplace",
    "🎉 Give me a fun community event idea",
    "💡 How do community groups work here?"
];

export default function AIChatView() {
    const { user } = useSelector((state) => state.auth);
    const { showError } = useToast();
    const [messages, setMessages] = useState([
        {
            id: "welcome",
            sender: "AI_BOT",
            text: `Hello ${user?.name?.split(" ")[0] || "there"}! 👋 I am **SocialHub AI Bot**, your personal assistant. How can I help you create posts, list items, or discover features today?`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const chatEndRef = useRef(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isLoading]);

    const handleSend = async (textToSend) => {
        const query = textToSend || input.trim();
        if (!query || isLoading) return;

        const userMsg = {
            id: Date.now().toString(),
            sender: "USER",
            text: query,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages((prev) => [...prev, userMsg]);
        if (!textToSend) setInput("");
        setIsLoading(true);

        try {
            const res = await sendAIChatMessage({ message: query });
            const aiMsg = {
                id: (Date.now() + 1).toString(),
                sender: "AI_BOT",
                text: res?.reply || "I am here to help! What else would you like to know?",
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages((prev) => [...prev, aiMsg]);
        } catch (err) {
            showError("Failed to get AI response");
        } finally {
            setIsLoading(false);
        }
    };

    const handleClear = () => {
        setMessages([
            {
                id: Date.now().toString(),
                sender: "AI_BOT",
                text: "Chat cleared! How else can I assist you today? ✨",
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
        ]);
    };

    return (
        <div className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-slate-950 overflow-hidden">
            {/* AI Chat Header */}
            <div className="px-6 py-4 border-b border-gray-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-3.5">
                    <div className="relative">
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
                            <Bot className="w-6 h-6 animate-pulse" />
                        </div>
                        <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full"></span>
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-base font-black text-gray-900 dark:text-gray-100 tracking-tight">
                                SocialHub AI Bot
                            </h2>
                            <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 rounded-md border border-indigo-200 dark:border-indigo-800">
                                AI Companion
                            </span>
                        </div>
                        <p className="text-xs font-semibold text-gray-400 dark:text-gray-400">Powered by Gemini AI · Always Online</p>
                    </div>
                </div>

                <button
                    onClick={handleClear}
                    title="Reset Conversation"
                    className="p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                    <RefreshCw className="w-4 h-4" />
                </button>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((msg) => {
                    const isAI = msg.sender === "AI_BOT";
                    return (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex items-start gap-3 ${isAI ? "justify-start" : "justify-end"}`}
                        >
                            {isAI && (
                                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white flex-shrink-0 shadow-xs mt-1">
                                    <Bot className="w-4 h-4" />
                                </div>
                            )}

                            <div className={`max-w-[78%] space-y-1 ${isAI ? "items-start" : "items-end"}`}>
                                <div
                                    className={`px-4 py-3 rounded-2xl text-xs font-medium leading-relaxed shadow-xs ${isAI
                                            ? "bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 text-gray-800 dark:text-gray-200 rounded-tl-xs"
                                            : "bg-indigo-600 text-white rounded-tr-xs"
                                        }`}
                                >
                                    {msg.text}
                                </div>
                                <p className={`text-[10px] font-semibold text-gray-400 px-1 ${isAI ? "text-left" : "text-right"}`}>
                                    {msg.timestamp}
                                </p>
                            </div>

                            {!isAI && (
                                <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-slate-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 flex-shrink-0 font-bold text-xs mt-1">
                                    {user?.name?.[0] || "U"}
                                </div>
                            )}
                        </motion.div>
                    );
                })}

                {isLoading && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white">
                            <Bot className="w-4 h-4 animate-spin" />
                        </div>
                        <div className="px-4 py-3 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl rounded-tl-xs text-xs font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                            <Sparkles className="w-3.5 h-3.5 animate-pulse text-purple-500" />
                            <span>AI is thinking...</span>
                        </div>
                    </motion.div>
                )}
                <div ref={chatEndRef} />
            </div>

            {/* Suggestion Chips */}
            <div className="px-6 py-2 flex items-center gap-2 overflow-x-auto scrollbar-hide bg-slate-50 dark:bg-slate-950">
                {QUICK_SUGGESTIONS.map((chip, idx) => (
                    <button
                        key={idx}
                        onClick={() => handleSend(chip)}
                        className="flex-shrink-0 px-3 py-1.5 bg-white dark:bg-slate-900 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 border border-gray-200 dark:border-slate-800 text-[11px] font-bold text-gray-700 dark:text-gray-300 rounded-xl transition-all cursor-pointer shadow-2xs"
                    >
                        {chip}
                    </button>
                ))}
            </div>

            {/* Input Box */}
            <div className="p-4 border-t border-gray-200/80 dark:border-slate-800 bg-white dark:bg-slate-900">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSend();
                    }}
                    className="flex items-center gap-2"
                >
                    <input
                        type="text"
                        placeholder="Ask SocialHub AI anything..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="flex-1 px-4 py-3 bg-gray-50 dark:bg-slate-800/70 border border-gray-200 dark:border-slate-700 rounded-2xl text-xs font-semibold text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || isLoading}
                        className="p-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-2xl shadow-md shadow-indigo-500/20 transition-all cursor-pointer disabled:opacity-50"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </form>
            </div>
        </div>
    );
}
