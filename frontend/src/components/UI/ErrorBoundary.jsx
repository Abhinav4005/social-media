import React from "react";

/**
 * React ErrorBoundary Component.
 * Catches unhandled JavaScript errors in child component trees in production
 * and displays a graceful fallback screen instead of crashing to a blank white screen.
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

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
                    <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl border border-gray-100 text-center">
                        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-5 font-bold text-2xl">
                            !
                        </div>
                        <h2 className="text-2xl font-black text-gray-900 mb-2">Something went wrong</h2>
                        <p className="text-sm text-gray-500 mb-6">
                            An unexpected error occurred while rendering this page. Our team has been notified.
                        </p>
                        <button
                            onClick={this.handleReload}
                            className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-500/20 transition-all w-full"
                        >
                            Reload Application
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
