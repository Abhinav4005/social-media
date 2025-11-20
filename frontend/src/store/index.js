import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "./slices/authSlice"
import userReducer from "./slices/userSlice";
import presenceReducer from "./slices/presenceSlice";

const rootReducer = combineReducers({
    auth: authReducer,
    user: userReducer,
    presence: presenceReducer,
})

const persistConfig = {
    key: "root",
    storage,
    whitelist: ["auth", "presence"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware({
            serializableCheck: false,
        })
});

export const persistor = persistStore(store);

export default store;