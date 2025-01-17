import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://127.0.0.1:8000/token", // Backend base URL
    headers: {
        "Content-Type": "application/json",
    },
});

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem("refreshToken");
                if (!refreshToken) {
                    throw new Error("No refresh token found");
                }

                const response = await axios.post("http://127.0.0.1:8000/token/refresh/", {
                    refresh: refreshToken,
                });

                // Update access token
                localStorage.setItem("accessToken", response.data.access);
                axiosInstance.defaults.headers.common[
                    "Authorization"
                ] = `Bearer ${response.data.access}`;

                // Retry the original request with the new token
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                console.error("Token refresh failed:", refreshError);

                // Clear tokens and redirect to login
                localStorage.clear();
                window.location.href = "/login";
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
