import axiosInstance from "./axiosInstance";

async function loginUser(email, password) {
    try {
        const response = await axiosInstance.post("/token/", { email, password });
        console.log("Login successful:", response.data);

        // Save tokens in local storage
        localStorage.setItem("accessToken", response.data.access);
        localStorage.setItem("refreshToken", response.data.refresh);

        // Set the Authorization header for subsequent requests
        axiosInstance.defaults.headers.common[
            "Authorization"
        ] = `Bearer ${response.data.access}`;

        // Redirect to dashboard
        window.location.href = "/dashboard";
    } catch (error) {
        console.error("Login failed:", error.response?.data || error.message);
        alert("Login failed. Please check your credentials.");
    }
}

export default loginUser;
