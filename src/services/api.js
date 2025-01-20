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
    async (error) => {
        const originalRequest = error.config;

        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            // Handle token expiration (401 Unauthorized)
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');
                if (!refreshToken) {
                    throw new Error('No refresh token found');
                }

                // Request a new access token using the refresh token
                const response = await axios.post(
                    'http://127.0.0.1:8000/token/refresh/', 
                    { refresh: refreshToken }
                );

                // Save new access token
                localStorage.setItem('accessToken', response.data.access);

                // Set the Authorization header with the new token
                API.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;

                // Retry the original request with the new access token
                return API(originalRequest);

            } catch (refreshError) {
                console.error('Token refresh failed:', refreshError);

                // Handle failed refresh (e.g., logout the user)
                localStorage.clear();
                window.location.href = '/login'; // Redirect to login page
                return Promise.reject(refreshError);
            }
        }

        // Other errors, such as network or 500 server errors
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
