import axios from "axios";

const api = axios.create({
  baseURL: "https://oneride-backend-obpl.onrender.com",

  headers: {
    "Content-Type": "application/json",
  },
});

export default api;