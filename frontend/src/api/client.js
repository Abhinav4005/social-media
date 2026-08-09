import axios from "axios";
import { getApiErrorMessage } from "../utils/apiResponse";
import store from "../store";
import { clearCredentials } from "../store/slices/authSlice";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

const publicAuthPaths = ["/signin", "/signup", "/forgot-password", "/reset-password"];

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    timeout: 15000,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const status = error.response?.status;
        const currentPath = typeof window !== "undefined" ? window.location.pathname : "";
        const isPublicAuthPage = publicAuthPaths.some(path => currentPath.startsWith(path));

        const message = getApiErrorMessage(error);
        error.message = message;

        if ((status === 401 || status === 403) && !isPublicAuthPage) {
            if (originalRequest.url?.includes("/auth/refresh-token") || originalRequest._retry) {
                store.dispatch(clearCredentials());
                if (typeof window !== "undefined" && window.location.pathname !== "/signin") {
                    window.location.replace("/signin");
                }
                return Promise.reject(error);
            }

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then(() => apiClient(originalRequest))
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                await apiClient.post("/auth/refresh-token", {});
                processQueue(null);
                return apiClient(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                store.dispatch(clearCredentials());
                if (typeof window !== "undefined" && window.location.pathname !== "/signin") {
                    window.location.replace("/signin");
                }
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;
