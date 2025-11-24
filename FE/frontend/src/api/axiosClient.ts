import axios from 'axios';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://localhost:44337/api/',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosClient;
