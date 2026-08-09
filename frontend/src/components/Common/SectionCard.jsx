import { memo } from "react";
import { motion } from "framer-motion";

const sectionVariants = {
    hidden: { opacity: 0, y: 16, scale: 0.98 },
    show: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { type: "spring", stiffness: 280, damping: 26 },
    },
    exit: { opacity: 0, y: -12, scale: 0.98, transition: { duration: 0.15 } },
};

/**
 * SectionCard — hardened animated card container with gradient accent bar and icon header.
 */
function SectionCard({
    title = "",
    description = "",
    icon: Icon,
    iconColor = "from-primary-500 to-secondary-500",
    accentBar = true,
    className = "",
    children,
    animate = true,
}) {
    const cardContent = (
        <>
            {accentBar && (
                <div className="h-1 bg-gradient-to-r from-primary-500 via-secondary-400 to-primary-600 animate-gradient-x" />
            )}

            {(Icon || title) && (
                <div className="flex items-center gap-4 px-7 pt-6 pb-5 border-b border-gray-50 dark:border-slate-800/80">
                    {Icon && (
                        <div
                            className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${iconColor} flex items-center justify-center shadow-md flex-shrink-0`}
                            aria-hidden="true"
                        >
                            <Icon className="w-5 h-5 text-white" />
                        </div>
                    )}
                    <div>
                        {title && (
                            <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 tracking-tight">
                                {title}
                            </h3>
                        )}
                        {description && (
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                                {description}
                            </p>
                        )}
                    </div>
                </div>
            )}

            <div className="px-7 py-6">{children}</div>
        </>
    );

    const baseClasses = `bg-white dark:bg-slate-900 rounded-[24px] border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden ${className}`;

    if (!animate) {
        return (
            <section className={baseClasses}>
                {cardContent}
            </section>
        );
    }

    return (
        <motion.section
            variants={sectionVariants}
            initial="hidden"
            animate="show"
            exit="exit"
            className={baseClasses}
        >
            {cardContent}
        </motion.section>
    );
}

export default memo(SectionCard);
