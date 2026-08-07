import React from "react";

/**
 * Modern Glassmorphic Toast Notification UI Component.
 */
export const Toast = ({ message, type = "info", onClose }) => {
    if (!message) return null;

    const typeStyles = {
        success: "bg-emerald-900/90 text-emerald-100 border-emerald-500/40 shadow-emerald-500/10",
        error: "bg-rose-900/90 text-rose-100 border-rose-500/40 shadow-rose-500/10",
        info: "bg-indigo-900/90 text-indigo-100 border-indigo-500/40 shadow-indigo-500/10",
    };

    const icons = {
        success: "✓",
        error: "✕",
        info: "ℹ",
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce-short">
            <div
                className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl border backdrop-blur-md shadow-2xl transition-all duration-300 font-medium text-sm ${
                    typeStyles[type] || typeStyles.info
                }`}
            >
                <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs">
                    {icons[type] || icons.info}
                </span>
                <span>{message}</span>
                {onClose && (
                    <button
                        onClick={onClose}
                        className="ml-3 text-white/60 hover:text-white font-bold text-xs focus:outline-none"
                    >
                        ✕
                    </button>
                )}
            </div>
        </div>
    );
};

export default Toast;
