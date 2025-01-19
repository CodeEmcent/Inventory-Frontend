import axios from 'axios';

const API = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000/', // Dynamic base URL
});

// Add JWT token to headers
API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        console.error('Error in request interceptor:', error);
        return Promise.reject(error);
    }
);

// Handle response errors globally
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            console.warn('Unauthorized! Redirecting to login...');
            localStorage.removeItem('accessToken');
            window.location.href = '/login'; // Adjust as needed for your app's routing
        }
        return Promise.reject(error);
    }
);

export default API;

// Example utility function for login
export const login = async (credentials) => {
    try {
        const response = await API.post('/api/token/', credentials);
        return response.data;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
};
