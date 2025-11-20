import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    profile: null,
    follower: [],
    following: [],
    feed: [],
    loading: false,
    error: null,
}

const userSlice = createSlice({
    name: "user",
    initialState: initialState,
    reducers: {
        setProfile: (state, action) => {
            state.profile = action.payload;
            state.loading = false;
            state.error = null;
        },
        setFollowers: (state, action) => {
            state.follower = action.payload;
            state.loading = false;
            state.error = null;
        },
        setFollowing: (state, action) => {
            state.following = action.payload;
            state.loading = false;
            state.error = null;
        }
    }
});

export const { setProfile, setFollowers, setFollowing } = userSlice.actions;

export default userSlice.reducer;

// export const selectUserProfile = (state) => state.user.profile;
// export const selectUserFollowers = (state) => state.user.follower;
// export const selectUserFollowing = (state) => state.user.following;
// export const selectUserFeed = (state) => state.user.feed;
// export const selectUserLoading = (state) => state.user.loading;
// export const selectUserError = (state) => state.user.error;

// export const setUserProfile = (profile) => (dispatch) => {
//     dispatch(setProfile(profile));
// };

// export const setUserFollowers = (followers) => (dispatch) => {
//     dispatch(setFollowers(followers));
// };

// export const setUserFollowing = (following) => (dispatch) => {
//     dispatch(setFollowing(following));
// };

// export const setUserFeed = (feed) => (dispatch) => {
//     dispatch({ type: 'user/setFeed', payload: feed });
// };

// export const setUserLoading = (loading) => (dispatch) => {
//     dispatch({ type: 'user/setLoading', payload: loading });
// };

// export const setUserError = (error) => (dispatch) => {
//     dispatch({ type: 'user/setError', payload: error });
// };

// export const clearUserProfile = () => (dispatch) => {
//     dispatch(setProfile(null));
// };

// export const clearUserFollowers = () => (dispatch) => {
//     dispatch(setFollowers([]));
// };

// export const clearUserFollowing = () => (dispatch) => {
//     dispatch(setFollowing([]));
// };

// export const clearUserFeed = () => (dispatch) => {
//     dispatch({ type: 'user/clearFeed' });
// };

// export const clearUserLoading = () => (dispatch) => {
//     dispatch({ type: 'user/clearLoading' });
// };

// export const clearUserError = () => (dispatch) => {
//     dispatch({ type: 'user/clearError' });
// };

// export const fetchUserProfile = (userId) => async (dispatch) => {
//     dispatch(setUserLoading(true));
//     try {
//         const response = await fetch(`/api/user/profile/${userId}`);
//         const data = await response.json();
//         if (response.ok) {
//             dispatch(setUserProfile(data.profile));
//         } else {
//             dispatch(setUserError(data.error));
//         }
//     } catch (error) {
//         dispatch(setUserError("Failed to fetch user profile"));
//     } finally {
//         dispatch(setUserLoading(false));
//     }
// };

