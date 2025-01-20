import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://127.0.0.1:8000", // Backend base URL
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("accessToken")}`, // Add access token if available
    },
});

axiosInstance.interceptors.response.use(
    (response) => response, // Pass successful responses as is
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem("refreshToken");
                if (!refreshToken) throw new Error("No refresh token found");

                const response = await axios.post("http://127.0.0.1:8000/token/refresh/", {
                    refresh: refreshToken,
                });

                const newAccessToken = response.data.access;
                localStorage.setItem("accessToken", newAccessToken);
                axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;

                // Retry the original request
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                console.error("Token refresh failed:", refreshError);
                alert("Session expired. Please log in again.");
                localStorage.clear(); // Clear tokens
                window.location.href = "/login"; // Redirect to login
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
