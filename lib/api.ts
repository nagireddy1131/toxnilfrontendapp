import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}/api` : 'http://localhost:5001/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const userInfoStr = localStorage.getItem('userInfo');
        const adminInfoStr = localStorage.getItem('adminInfo');
        const user = adminInfoStr ? JSON.parse(adminInfoStr) : userInfoStr ? JSON.parse(userInfoStr) : null;
        if (user && user.token) {
            config.headers.Authorization = `Bearer ${user.token}`;
        }
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;
