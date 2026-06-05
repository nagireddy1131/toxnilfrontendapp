import axios from 'axios';

const api = axios.create({
    baseURL: 'https://toxnilbackendapp-1.onrender.com/api',
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
