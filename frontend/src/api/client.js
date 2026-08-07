import axios from "axios";
import { getApiErrorMessage } from "../utils/apiResponse";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

const publicAuthPaths = ["/signin", "/signup", "/forgot-password", "/reset-password"];

const apiClient = axios.create({
    baseURL: API_BASE_URL,
});

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;
        const isPublicAuthPage = publicAuthPaths.includes(window.location.pathname);

        if ((status === 401 || status === 403) && !isPublicAuthPage) {
            localStorage.removeItem("token");
            window.location.assign("/signin");
        }

        const message = getApiErrorMessage(error);
        error.message = message;

        return Promise.reject(error);
    }
);

export default apiClient;

