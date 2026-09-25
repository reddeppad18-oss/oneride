import api from "../api/axios.js";

/*
 * =========================
 * UPDATE PROVIDER LOCATION
 * =========================
 */
export const updateProviderLocation = async (
  latitude,
  longitude,
  providerType
) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("JWT token not found. Please login again.");
  }

  const response = await api.put(
    "/provider-location",
    {
      latitude,
      longitude,
      providerType,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};


/*
 * =========================
 * GET MY PROVIDER LOCATION
 * =========================
 */
export const getMyProviderLocation = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("JWT token not found. Please login again.");
  }

  const response = await api.get(
    "/provider-location",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};


/*
 * =========================
 * UPDATE AVAILABILITY
 * =========================
 */
export const updateProviderAvailability = async (
  available
) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("JWT token not found. Please login again.");
  }

  const response = await api.put(
    "/provider-location/availability",
    {
      available,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};