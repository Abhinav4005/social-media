import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        loginStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        setCredentials: (state, action) => {
            const { user } = action.payload;
            state.user = user;
            state.isAuthenticated = true;
            state.loading = false;
            state.error = null;
        },
        loginFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.isAuthenticated = false;
            state.user = null;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        clearCredentials: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.loading = false;
            state.error = null;
        },
    },
});

export const { loginStart, setCredentials, loginFailure, setLoading, clearCredentials } = authSlice.actions;
export const logout = clearCredentials;

export default authSlice.reducer;