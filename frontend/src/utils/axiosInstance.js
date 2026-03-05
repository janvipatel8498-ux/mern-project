import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '',
    withCredentials: true,
});

// Optional: Add response interceptor to handle 401 globally
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // If it's an auth error but we are NOT on the login page
            if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
                localStorage.removeItem('userInfo');
                localStorage.removeItem('expirationTime');
                // Optional: window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
