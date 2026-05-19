import axios from 'axios';

const baseURL =
  (import.meta.env.VITE_API_URL as string | undefined) ?? '/api';

export const http = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15_000,
});

http.interceptors.response.use(
  (res) => res,
  (err) => {
    const message =
      err?.response?.data?.message ||
      err?.message ||
      'Something went wrong while contacting the server';
    return Promise.reject(new Error(message));
  }
);
