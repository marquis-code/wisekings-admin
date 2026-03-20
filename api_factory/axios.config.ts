import axios from "axios";

const baseURL = import.meta.env.VITE_BASE_URL || "https://wisekings-backend-hq.onrender.com/api/v1";

const GATEWAY_ENDPOINT = axios.create({
  baseURL,
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
  async (error) => {
    const originalRequest = error.config;
    const isRefreshRequest = originalRequest.url.includes('/auth/refresh');

    if (error.response?.status === 401 && !originalRequest._retry && !isRefreshRequest) {
      originalRequest._retry = true;

      try {
        // Get refresh token from cookie
        const rawRefreshToken = document.cookie.split('; ').find(row => row.startsWith('wk_admin_refresh_token='))?.split('=')[1] || '';
        const refreshToken = decodeURIComponent(rawRefreshToken).replace(/^"|"$/g, '');

        if (refreshToken) {
          const res = await axios.post(`${GATEWAY_ENDPOINT.defaults.baseURL}/auth/refresh`, { refreshToken });
          const { accessToken, refreshToken: newRefreshToken } = res.data.data.tokens;

          // Update tokens in cookies (with expiration)
          const cookieOptions = "; path=/; max-age=604800; SameSite=Lax"; // 7 days
          document.cookie = `wk_admin_token=${accessToken}${cookieOptions}`;
          document.cookie = `wk_admin_refresh_token=${newRefreshToken}${cookieOptions}`;

          // Retry the original request
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return GATEWAY_ENDPOINT(originalRequest);
        }
      } catch (refreshError) {
        console.error("Admin session expired. Please login again.");
        // Optional: window.location.href = '/login';
      }
    }

    if (error.response?.status === 401) {
      console.error("Unauthorized - 401");
    }
    return Promise.reject(error.response?.data || error);
  }
);

export { GATEWAY_ENDPOINT };
