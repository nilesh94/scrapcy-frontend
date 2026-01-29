import axios from 'axios';

// URL Configuration
const API_URL = process.env.REACT_APP_API_URL || 'https://scrapcy-backend-new-1.onrender.com';

// 1. Set Base URL
axios.defaults.baseURL = API_URL;

// 2. Request Interceptor: Attach Access Token to every request
axios.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    error => Promise.reject(error)
);

// 3. Response Interceptor: Handle 401 Errors
axios.interceptors.response.use(
    (response) => response, // If success, just return response
    async (error) => {
        const originalRequest = error.config;

        // If error is 401 (Unauthorized) and we haven't tried refreshing yet
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // Mark as retried so we don't loop infinitely

            try {
                const refreshToken = localStorage.getItem('refreshToken');
                
                if (!refreshToken) {
                    // No refresh token? Logout user.
                    throw new Error("No refresh token available");
                }

                // Call Backend to get new Access Token
                const response = await axios.post(`${API_URL}/users/refresh`, {
                    refresh_token: refreshToken
                });

                const { access_token } = response.data;

                // Save new token
                localStorage.setItem('token', access_token);

                // Update the failed request with new token and retry it
                originalRequest.headers['Authorization'] = `Bearer ${access_token}`;
                return axios(originalRequest);

            } catch (refreshError) {
                console.error("Session expired. Logging out...", refreshError);
                // Clear storage and redirect to login
                localStorage.clear();
                window.location.href = '/login'; 
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default axios;
