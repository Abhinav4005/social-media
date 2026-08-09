import { useState, memo } from "react";
import { Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * SearchInput — hardened animated search bar with focus-ring, ESC key clear, and memoization.
 */
function SearchInput({
    value = "",
    onChange,
    placeholder = "Search…",
    className = "",
    onFocus,
    onBlur,
    size = "md",
    autoFocus = false,
}) {
    const [focused, setFocused] = useState(false);

    const safeValue = value ?? "";
    const safeOnChange = onChange ?? (() => {});

    const handleFocus = (e) => {
        setFocused(true);
        onFocus?.(e);
    };

    const handleBlur = (e) => {
        setFocused(false);
        onBlur?.(e);
    };

    const handleClear = () => {
        safeOnChange("");
    };

    const handleKeyDown = (e) => {
        if (e.key === "Escape" && safeValue) {
            handleClear();
        }
    };

    const padding = size === "sm" ? "px-3 py-2" : "px-4 py-2.5";
    const iconSize = size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4";
    const textSize = size === "sm" ? "text-xs" : "text-sm";

    return (
        <motion.div
            animate={
                focused
                    ? { boxShadow: "0 0 0 3px rgba(99,102,241,0.15)" }
                    : { boxShadow: "0 0 0 0px rgba(99,102,241,0)" }
            }
            transition={{ duration: 0.2 }}
            className={`flex items-center gap-2.5 ${padding} rounded-xl border transition-colors duration-200 ${
                focused
                    ? "border-primary-400 dark:border-primary-500 bg-white dark:bg-slate-800"
                    : "border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/60"
            } ${className}`}
        >
            <Search className={`${iconSize} text-gray-400 flex-shrink-0`} aria-hidden="true" />

            <input
                type="text"
                autoFocus={autoFocus}
                placeholder={placeholder}
                value={safeValue}
                onChange={(e) => safeOnChange(e.target.value)}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                aria-label={placeholder || "Search input"}
                className={`bg-transparent ${textSize} font-medium text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 outline-none flex-1`}
            />

            <AnimatePresence>
                {safeValue && (
                    <motion.button
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        onClick={handleClear}
                        type="button"
                        aria-label="Clear search"
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer"
                    >
                        <X className={iconSize} />
                    </motion.button>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

export default memo(SearchInput);
