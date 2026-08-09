import { memo } from "react";
import { motion } from "framer-motion";

/**
 * EmptyState — hardened centered placeholder for empty lists / no search results.
 */
function EmptyState({
    icon: Icon,
    title = "",
    description = "",
    action,
    iconBg = "bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900/30 dark:to-secondary-900/30",
    iconColor = "text-primary-400 dark:text-primary-500",
    className = "",
    noBorder = false,
}) {
    const wrapperClass = noBorder
        ? `py-10 text-center ${className}`
        : `bg-white dark:bg-slate-900 rounded-[24px] border border-gray-100 dark:border-slate-800 py-16 text-center px-6 ${className}`;

    const ActionIcon = action?.icon;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.05 }}
            className={wrapperClass}
            role="region"
            aria-label={title || "Empty state"}
        >
            {Icon && (
                <div className="relative w-20 h-20 mx-auto mb-5" aria-hidden="true">
                    <div className={`absolute inset-0 rounded-3xl ${iconBg}`} />
                    <div className="relative flex items-center justify-center w-full h-full">
                        <Icon className={`w-9 h-9 ${iconColor}`} />
                    </div>
                </div>
            )}

            {title && (
                <h2 className="text-base font-bold text-gray-800 dark:text-gray-200 mb-1">
                    {title}
                </h2>
            )}

            {description && (
                <p className="text-sm text-gray-400 dark:text-gray-500 mb-6 max-w-xs mx-auto">
                    {description}
                </p>
            )}

            {action?.label && (
                <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={action.onClick}
                    type="button"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 text-white text-sm font-semibold shadow-lg shadow-primary-300/30 dark:shadow-primary-900/30 cursor-pointer transition-all"
                >
                    {ActionIcon && <ActionIcon className="w-4 h-4" aria-hidden="true" />}
                    <span>{action.label}</span>
                </motion.button>
            )}
        </motion.div>
    );
}

export default memo(EmptyState);
