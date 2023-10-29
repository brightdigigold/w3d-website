import axios from 'axios';
import { useRouter } from 'next/router';
import { AesDecrypt } from '@/components/middleware';

const api = axios.create({
  baseURL: `${process.env.baseUrl}`, // Replace with your API base URL
});

// Request interceptor (same as before)

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      config.headers['Content-Type'] = 'application/json';
    }
    return config;
});
  
// Response interceptor
api.interceptors.response.use(
  (response) => {
    return JSON.parse(AesDecrypt(response.data.payload));
  },
  (error) => {
    // const router = useRouter();

    if (error.response && error.response.status === 440) {
      // Redirect to the login page
      // router.push('/');
      
    }

    return Promise.reject(error);
  }
);

export default api;
