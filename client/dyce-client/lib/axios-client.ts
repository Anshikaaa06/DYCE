import axios from 'axios';

export const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api',
  withCredentials: true,
//   headers: {
//     'Content-Type': 'application/json',
//   },
});
