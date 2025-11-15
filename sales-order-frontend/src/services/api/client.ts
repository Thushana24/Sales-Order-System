import axios, { AxiosInstance, AxiosError, AxiosResponse } from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://localhost:7259/api";

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if needed
    // const token = localStorage.getItem('token');
    // if (token) config.headers.Authorization = `Bearer ${token}`;

    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error("[API Request Error]", error);
    return Promise.reject(error);
  },
);

// Response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(`[API Response] ${response.config.url} - ${response.status}`);
    return response;
  },
  (error: AxiosError) => {
    // Handle errors globally
    if (error.response) {
      console.error(
        "[API Response Error]",
        error.response.status,
        error.response.data,
      );

      // Handle specific status codes
      switch (error.response.status) {
        case 401:
          // Handle unauthorized
          console.error("Unauthorized access");
          break;
        case 404:
          console.error("Resource not found");
          break;
        case 500:
          console.error("Server error");
          break;
      }
    } else if (error.request) {
      console.error("[API Network Error]", error.message);
    }

    return Promise.reject(error);
  },
);

export default apiClient;
