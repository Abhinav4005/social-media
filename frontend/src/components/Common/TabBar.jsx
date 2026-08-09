import { memo } from "react";

/**
 * TabBar — hardened tab navigation with accessibility role attributes, memoization, and nullish safety.
 */
function TabBar({
    tabs = [],
    activeTab,
    onChange,
    variant = "pill",
    className = "",
}) {
    const safeTabs = Array.isArray(tabs) ? tabs : [];
    const safeOnChange = onChange ?? (() => {});

    if (variant === "card") {
        return (
            <div
                role="tablist"
                className={`flex gap-1.5 p-1.5 bg-gray-100 dark:bg-slate-900 rounded-2xl w-fit transition-colors duration-200 ${className}`}
            >
                {safeTabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            role="tab"
                            aria-selected={isActive}
                            onClick={() => safeOnChange(tab.id)}
                            type="button"
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                                isActive
                                    ? "bg-white dark:bg-slate-800 text-primary-600 dark:text-primary-400 shadow-md scale-105"
                                    : "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-slate-800/60"
                            }`}
                        >
                            {tab.icon && <span aria-hidden="true">{tab.icon}</span>}
                            <span>{tab.label}</span>
                            {tab.badge != null && (
                                <span className="ml-1 text-[11px] font-semibold opacity-80">
                                    ({tab.badge})
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>
        );
    }

    // Default "pill" variant
    return (
        <div
            role="tablist"
            className={`flex gap-2 border-b border-gray-100 dark:border-slate-800 pb-2 ${className}`}
        >
            {safeTabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                    <button
                        key={tab.id}
                        role="tab"
                        aria-selected={isActive}
                        onClick={() => safeOnChange(tab.id)}
                        type="button"
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                            isActive
                                ? "bg-primary-600 text-white shadow-lg shadow-primary-500/20"
                                : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800"
                        }`}
                    >
                        {tab.icon && <span aria-hidden="true">{tab.icon}</span>}
                        <span>{tab.label}</span>
                        {tab.badge != null && (
                            <span className="ml-0.5 opacity-90">({tab.badge})</span>
                        )}
                    </button>
                );
            })}
        </div>
    );
}

export default memo(TabBar);
