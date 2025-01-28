import axios from "axios";

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL ||
        (process.env.NODE_ENV === "development"
            ? "http://127.0.0.1:8000" // Local backend during development
            : "https://inventory-aar6.onrender.com"), // Deployed backend
    headers: {
        "Content-Type": "application/json",
    },
});

// Add Authorization header dynamically for each request
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        console.error("Request error:", error);
        return Promise.reject(error);
    }
);

// Handle 401 Unauthorized globally with token refresh logic
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem("refreshToken");
                if (!refreshToken) throw new Error("No refresh token found");

                // Refresh token API call
                const response = await axios.post(
                    `${axiosInstance.defaults.baseURL}/token/refresh/`, // Use dynamic baseURL
                    { refresh: refreshToken }
                );

                const newAccessToken = response.data.access;
                localStorage.setItem("accessToken", newAccessToken);

                // Update the Authorization header with the new token
                axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;

                // Retry the original request with the new token
                originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                console.error("Token refresh failed:", refreshError);

                // Handle failed refresh (e.g., log out the user)
                alert("Session expired. Please log in again.");
                localStorage.clear();
                window.location.href = "/login"; // Redirect to login
                return Promise.reject(refreshError);
            }
        }

        // Return other errors as is
        return Promise.reject(error);
    }
);

export default axiosInstance;
