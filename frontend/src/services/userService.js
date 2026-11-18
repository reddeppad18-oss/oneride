
import api from "../api/axios";

// Get the currently logged-in user using the JWT token
export const getCurrentUser = async () => {
  const response = await api.get("/user/me");
  return response.data;
};
