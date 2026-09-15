import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,

  headers: {
    "Content-Type": "application/json",
  },
});


/* =========================
   RESPONSE INTERCEPTOR
========================= */

api.interceptors.response.use(
  (response) => {
    // Successful response
    return response;
  },

  (error) => {

    // User is not authenticated
    if (error.response?.status === 401) {

      localStorage.removeItem("token");

      // Show friendly message
      alert("Please login to continue");

      // Redirect to login page
      window.location.href = "/";
    }

    return Promise.reject(error);
  }
);


export default api;