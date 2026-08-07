import { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { authService } from "../services/auth.service";
import { setCredentials, logout as logoutAction } from "../store/slices/authSlice";

/**
 * Custom Hook: useAuth
 * Encapsulates authentication state, login, signup, and token lifecycle management.
 * Fulfills Single Responsibility Principle (SRP) & Interface Segregation (ISP).
 */
export function useAuth() {
    const dispatch = useDispatch();
    const { user, token } = useSelector((state) => state.auth || {});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const signIn = useCallback(async (email, password) => {
        setLoading(true);
        setError(null);
        try {
            const data = await authService.signIn(email, password);
            if (data.token && data.user) {
                localStorage.setItem("token", data.token);
                dispatch(setCredentials({ user: data.user, token: data.token }));
            }
            setLoading(false);
            return data;
        } catch (err) {
            setLoading(false);
            const message = err.response?.data?.message || err.message || "Failed to sign in";
            setError(message);
            throw new Error(message);
        }
    }, [dispatch]);

    const signUp = useCallback(async (name, email, password) => {
        setLoading(true);
        setError(null);
        try {
            const data = await authService.signUp(name, email, password);
            if (data.token && data.user) {
                localStorage.setItem("token", data.token);
                dispatch(setCredentials({ user: data.user, token: data.token }));
            }
            setLoading(false);
            return data;
        } catch (err) {
            setLoading(false);
            const message = err.response?.data?.message || err.message || "Failed to sign up";
            setError(message);
            throw new Error(message);
        }
    }, [dispatch]);

    const logout = useCallback(async () => {
        try {
            await authService.logout();
        } catch (e) {
            console.error("Logout API error", e);
        } finally {
            localStorage.removeItem("token");
            dispatch(logoutAction());
        }
    }, [dispatch]);

    return {
        user,
        token,
        isAuthenticated: !!token,
        loading,
        error,
        signIn,
        signUp,
        logout,
    };
}
