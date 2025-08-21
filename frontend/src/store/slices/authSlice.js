import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    token: null,
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
}

const authSlice = createSlice({
    name: "auth",
    initialState: initialState,
    reducers: {
        loginStart: (state) => {
            state.loading = true,
            state.error = null;
        },
        setCredentials: (state, action) => {
            const { token, user } = action.payload;
            state.token = token;
            state.user = user;
            state.isAuthenticated = true;
            state.loading = false;
            state.error = null;
        },
        loginFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.isAuthenticated = false;
            state.token = null;
            state.user = null;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        clearCredentials: (state) => {
            state.token = null;
            state.user = null;
            state.isAuthenticated = false;
            state.loading = false;
            state.error = null;
        }
    }
});

export const { loginStart, setCredentials, loginFailure, setLoading, clearCredentials } = authSlice.actions;

export default authSlice.reducer;