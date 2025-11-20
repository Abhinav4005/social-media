import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    onlineUsers: [],
    lastSeen: {}
};

const presenceSlice = createSlice({
    name: "presence",
    initialState,
    reducers: {
        setOnlineUsers: (state, action) => {
            state.onlineUsers = action.payload;
        },
        addOnlineUser: (state, action) => {
            console.log("Adding online user:", action.payload);
            if (!state.onlineUsers.includes(action.payload)) {
                state.onlineUsers.push(action.payload);
            }
        },
        removeOnlineUser: (state, action) => {
            state.onlineUsers = state.onlineUsers.filter(id => id !== action.payload);
        },
        updateLastSeen: (state, action) => {
            const { userId, lastSeen } = action.payload;
            state.lastSeen = state.lastSeen || {};
            state.lastSeen[userId] = lastSeen;
        }
    },
});

export const { setOnlineUsers, addOnlineUser, removeOnlineUser, updateLastSeen } = presenceSlice.actions;
export default presenceSlice.reducer;