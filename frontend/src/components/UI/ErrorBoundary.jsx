import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

/**
 * React ErrorBoundary Component.
 * Catches unhandled JavaScript errors in child component trees in production
 * and displays a graceful fallback screen or compact widget alert instead of crashing to a blank screen.
 *
 * Props:
 * - compact: boolean (render a lightweight inline fallback for widgets/sections)
 * - title: string (custom title)
 * - message: string (custom message)
 * - fallback: ReactNode | ((props: { error: Error, resetError: () => void }) => ReactNode)
 * - onReset: function (called when error boundary is reset)
 */
export class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("[ErrorBoundary] Uncaught UI Rendering Error:", error, errorInfo);
    }

    handleReload = () => {
        window.location.reload();
    };

    handleReset = () => {
        this.setState({ hasError: false, error: null });
        if (typeof this.props.onReset === "function") {
            this.props.onReset();
        }
    };

    render() {
        if (this.state.hasError) {
            // Render custom fallback prop if provided
            if (this.props.fallback) {
                if (typeof this.props.fallback === "function") {
                    return this.props.fallback({
                        error: this.state.error,
                        resetError: this.handleReset,
                    });
                }
                return this.props.fallback;
            }

            // Compact localized widget fallback
            if (this.props.compact) {
                return (
                    <div className="p-4 my-2 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-800 dark:text-rose-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm transition-all shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 font-bold">
                                <AlertTriangle className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="font-bold text-rose-900 dark:text-rose-100">
                                    {this.props.title || "Widget unavailable"}
                                </h4>
                                <p className="text-xs text-rose-600 dark:text-rose-300/80">
                                    {this.props.message || "An error occurred while loading this section."}
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={this.handleReset}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-semibold text-xs shadow-sm hover:shadow transition-all shrink-0 cursor-pointer"
                        >
                            <RefreshCw className="w-3.5 h-3.5" />
                            Retry
                        </button>
                    </div>
                );
            }

            return (
                <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-6 transition-colors duration-300">
                    <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-2xl border border-slate-100 dark:border-slate-700 text-center">
                        <div className="w-16 h-16 bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 rounded-2xl flex items-center justify-center mx-auto mb-5 font-bold text-2xl shadow-inner">
                            <AlertTriangle className="w-8 h-8" />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
                            {this.props.title || "Something went wrong"}
                        </h2>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                            {this.props.message || "An unexpected error occurred while rendering this page. Our team has been notified."}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-2.5">
                            <button
                                type="button"
                                onClick={this.handleReset}
                                className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-600/25 transition-all flex-1 cursor-pointer"
                            >
                                Try Again
                            </button>
                            <button
                                type="button"
                                onClick={this.handleReload}
                                className="px-5 py-3 rounded-2xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold text-sm transition-all flex-1 cursor-pointer"
                            >
                                Reload App
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
