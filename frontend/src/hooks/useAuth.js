import { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { authService } from "../services/auth.service";
import { setCredentials, logout as logoutAction } from "../store/slices/authSlice";

export function useAuth() {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth || {});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const signIn = useCallback(async (email, password) => {
        setLoading(true);
        setError(null);
        try {
            const data = await authService.signIn(email, password);
            if (data.user) {
                dispatch(setCredentials({ user: data.user }));
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
            if (data.user) {
                dispatch(setCredentials({ user: data.user }));
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
            dispatch(logoutAction());
        }
    }, [dispatch]);

    return {
        user,
        isAuthenticated: !!user,
        loading,
        error,
        signIn,
        signUp,
        logout,
    };
}
