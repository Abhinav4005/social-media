import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "./slices/authSlice"
import userReducer from "./slices/userSlice";

const rootReducer = combineReducers({
    auth: authReducer,
    user: userReducer,
})

const persistConfig = {
    key: "root",
    storage,
    whitelist: ["auth"],
}

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