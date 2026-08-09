import React, { createContext, useContext, useState, useCallback } from "react";
import Toast from "../components/UI/Toast";

const ToastContext = createContext(null);

/**
 * Toast Context Provider for managing global notification popups across the app.
 */
export const ToastProvider = ({ children }) => {
    const [toast, setToast] = useState({ message: null, type: "info" });

    const hideToast = useCallback(() => {
        setToast({ message: null, type: "info" });
    }, []);

    const showToast = useCallback((message, type = "info", durationMs = 4000) => {
        setToast({ message, type });
        setTimeout(() => {
            setToast((prev) => (prev.message === message ? { message: null, type: "info" } : prev));
        }, durationMs);
    }, []);

    const showSuccess = useCallback((message, durationMs = 4000) => {
        showToast(message, "success", durationMs);
    }, [showToast]);

    const showError = useCallback((message, durationMs = 4000) => {
        showToast(message, "error", durationMs);
    }, [showToast]);

    return (
        <ToastContext.Provider value={{ showToast, showSuccess, showError, hideToast }}>
            {children}
            <Toast message={toast.message} type={toast.type} onClose={hideToast} />
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
};
