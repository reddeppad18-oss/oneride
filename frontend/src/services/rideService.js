import api from "../api/axios.js";

export const createRide = async (rideData) => {
const token = localStorage.getItem("token");

if (!token) {
throw new Error("JWT token not found. Please login again.");
}

const response = await api.post(
"/rides",
rideData,
{
headers: {
Authorization: `Bearer ${token}`,
},
}
);

return response.data;
};
export const searchRides = async (searchData) => {
  const token = localStorage.getItem("token");

  const response = await api.get("/rides/search", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      source: searchData.source || undefined,
      destination: searchData.destination || undefined,
      travelDate: searchData.travelDate || undefined,
      availableSeats: searchData.availableSeats || undefined,
      maxPrice: searchData.maxPrice || undefined,
      page: searchData.page ?? 0,
      size: searchData.size ?? 10,
      sortBy: searchData.sortBy || "travelDate",
    },
  });

  return response.data;
};
export const getMyRides = async () => {
  const token = localStorage.getItem("token");

  const response = await api.get("/rides/my", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};