import { useState, memo } from "react";
import { motion } from "framer-motion";

/** Deterministic gradient palette keyed by name */
const GRADIENTS = [
    ["#6366f1", "#8b5cf6"],
    ["#ec4899", "#f43f5e"],
    ["#f59e0b", "#f97316"],
    ["#10b981", "#14b8a6"],
    ["#3b82f6", "#6366f1"],
    ["#a855f7", "#ec4899"],
];

function getGradient(name = "") {
    const code = [...(name || "?")].reduce((a, c) => a + c.charCodeAt(0), 0);
    return GRADIENTS[code % GRADIENTS.length];
}

function getInitials(name = "") {
    return (name || "?")
        .split(" ")
        .map((n) => n[0]?.toUpperCase())
        .filter(Boolean)
        .slice(0, 2)
        .join("") || "?";
}

/** Size map: { wrapper, text } */
const SIZE = {
    xs:    { wrapper: "w-7 h-7",   text: "text-[10px]" },
    sm:    { wrapper: "w-9 h-9",   text: "text-xs" },
    md:    { wrapper: "w-11 h-11", text: "text-sm" },
    lg:    { wrapper: "w-14 h-14", text: "text-base" },
    xl:    { wrapper: "w-16 h-16", text: "text-lg" },
    "2xl": { wrapper: "w-28 h-28 md:w-32 md:h-32", text: "text-3xl md:text-4xl" },
};

/** Shape map */
const SHAPE = {
    circle:  "rounded-full",
    rounded: "rounded-2xl",
    square:  "rounded-xl",
};

/** Online dot size relative to avatar size */
const ONLINE_DOT = {
    xs:    "w-2 h-2 border",
    sm:    "w-2.5 h-2.5 border",
    md:    "w-3 h-3 border-2",
    lg:    "w-3.5 h-3.5 border-2",
    xl:    "w-4 h-4 border-2",
    "2xl": "w-5 h-5 border-[3px]",
};

/**
 * UserAvatar — hardened unified avatar with image load error auto-fallback & memoization.
 */
function UserAvatar({
    name = "",
    profileImage,
    size = "md",
    shape = "circle",
    showOnline = false,
    animate = false,
    ring = "",
    className = "",
    alt,
}) {
    const [imgFailed, setImgFailed] = useState(false);
    const sizeStyle  = SIZE[size]   ?? SIZE.md;
    const shapeStyle = SHAPE[shape] ?? SHAPE.circle;
    const [c1, c2]   = getGradient(name);
    const initials   = getInitials(name);
    const imgAlt     = alt ?? name ?? "User Avatar";

    const hasValidImage = profileImage && !imgFailed;

    const renderContent = () => (
        <>
            {hasValidImage ? (
                <img
                    src={profileImage}
                    alt={imgAlt}
                    loading="lazy"
                    decoding="async"
                    onError={() => setImgFailed(true)}
                    className={`${sizeStyle.wrapper} ${shapeStyle} object-cover shadow-sm ${ring}`}
                />
            ) : (
                <div
                    aria-label={imgAlt}
                    role="img"
                    className={`${sizeStyle.wrapper} ${shapeStyle} flex items-center justify-center ${sizeStyle.text} font-bold text-white shadow-sm select-none ${ring}`}
                    style={{ background: `linear-gradient(135deg, ${c1}, ${c2})` }}
                >
                    {initials}
                </div>
            )}

            {showOnline && (
                <span
                    aria-label="Online"
                    className={`absolute -bottom-0.5 -right-0.5 ${ONLINE_DOT[size]} bg-emerald-400 border-white dark:border-slate-900 rounded-full shadow-sm`}
                />
            )}
        </>
    );

    if (!animate) {
        return (
            <div className={`relative flex-shrink-0 ${className}`}>
                {renderContent()}
            </div>
        );
    }

    return (
        <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`relative flex-shrink-0 ${className}`}
        >
            {renderContent()}
        </motion.div>
    );
}

export default memo(UserAvatar);
