import axiosInstance from "./axiosInstance";

export function fetchData() {
    return axiosInstance
        .get("/data") // The base URL is already set in axiosInstance
        .then((response) => response.data)
        .catch((error) => {
            console.error("Error fetching data:", error);
            throw error;
        });
}
