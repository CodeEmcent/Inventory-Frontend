import axios from 'axios';

const API = axios.create({
    baseURL: 'http://127.0.0.1:8000/', // Replace with your backend base URL
});

// Add JWT token to headers
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token'); // Assuming you store the JWT in localStorage
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default API;
