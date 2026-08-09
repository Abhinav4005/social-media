import { useState, useEffect, useCallback } from "react";
import { userService } from "../services/user.service";

export function useUserProfile() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    const fetchProfile = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await userService.getUserProfile();
            setProfile(data.user);
            setLoading(false);
        } catch (err) {
            setLoading(false);
            const message = err.response?.data?.error || err.message || "Failed to fetch user profile";
            setError(message);
        }
    }, []);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const updateProfile = useCallback(async (formData) => {
        setSaving(true);
        setError(null);
        try {
            const data = await userService.updateUserProfile(formData);
            if (data.user) {
                setProfile(data.user);
            }
            setSaving(false);
            return data;
        } catch (err) {
            setSaving(false);
            const message = err.response?.data?.error || err.message || "Failed to update profile";
            setError(message);
            throw new Error(message);
        }
    }, []);

    return {
        profile,
        loading,
        saving,
        error,
        fetchProfile,
        updateProfile,
    };
}
