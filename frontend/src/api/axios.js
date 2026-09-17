import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/*
 * =========================
 * ATTACH JWT TOKEN
 * =========================
 */

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers = config.headers || {};

      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


/*
 * =========================
 * RESPONSE INTERCEPTOR
 * =========================
 */

api.interceptors.response.use(
  (response) => response,

  (error) => {
    if (
      error.response?.status === 401 ||
      error.response?.status === 403
    ) {
      console.error(
        "Authentication failed:",
        error.response.status
      );
    }

    return Promise.reject(error);
  }
);

export default api;
