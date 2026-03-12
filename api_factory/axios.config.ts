import axios from "axios";

const GATEWAY_ENDPOINT = axios.create({
  baseURL: "http://localhost:3000/api/v1", // Initial fallback
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request Interceptor
GATEWAY_ENDPOINT.interceptors.request.use(
  (config) => {
    // In Nuxt, we can't directly use composables outside setup easily 
    // without passing context or using a specific pattern.
    // However, since we're using a standard structure, we'll try to get the cookie.
    const rawToken = document.cookie.split('; ').find(row => row.startsWith('wk_admin_token='))?.split('=')[1] || '';
    const token = decodeURIComponent(rawToken).replace(/^"|"$/g, '');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
GATEWAY_ENDPOINT.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Logic for logout or refresh can be handled here or in a composable
      console.error("Unauthorized - 401");
    }
    return Promise.reject(error.response?.data || error);
  }
);

export { GATEWAY_ENDPOINT };
