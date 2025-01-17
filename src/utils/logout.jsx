import axiosInstance from "./axiosInstance";

function logoutUser() {
    localStorage.clear(); // Remove tokens
    axiosInstance.defaults.headers.common["Authorization"] = null; // Clear axios header
    window.location.href = "/login"; // Redirect to login
}

export default logoutUser;
