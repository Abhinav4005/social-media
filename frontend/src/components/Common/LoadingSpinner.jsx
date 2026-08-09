import { memo } from "react";
import { motion } from "framer-motion";

const SIZE_MAP = {
    xs: "w-3.5 h-3.5",
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
};

/**
 * LoadingSpinner — hardened inline spinning border circle with accessibility attributes and memoization.
 */
function LoadingSpinner({
    size = "sm",
    trackClass = "border-white/30 border-t-white",
    className = "",
    label = "Loading",
}) {
    return (
        <motion.div
            role="status"
            aria-label={label}
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
            className={`${SIZE_MAP[size] ?? SIZE_MAP.sm} border-2 rounded-full flex-shrink-0 ${trackClass} ${className}`}
        />
    );
}

export default memo(LoadingSpinner);
