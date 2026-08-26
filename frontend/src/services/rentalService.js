import api from "../api/axios.js";

// Search rental vehicles by location
export const searchRentals = async (location) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("JWT token not found. Please login again.");
  }

  const response = await api.get("/rentals/search", {
    params: {
      location: location,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};


// Get rental vehicles posted by the logged-in user
export const getMyRentals = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("JWT token not found. Please login again.");
  }

  const response = await api.get("/rentals/my", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};


// Create a new rental vehicle listing
export const createRental = async (rentalData) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("JWT token not found. Please login again.");
  }

  const response = await api.post(
    "/rentals",
    rentalData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};


// Get a specific rental vehicle by ID
export const getRentalById = async (rentalId) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("JWT token not found. Please login again.");
  }

  const response = await api.get(
    `/rentals/${rentalId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};


// Update rental vehicle status
export const updateRentalStatus = async (
  rentalId,
  status
) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("JWT token not found. Please login again.");
  }

  const response = await api.put(
    `/rentals/${rentalId}/status`,
    {},
    {
      params: {
        status: status,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};


// Delete rental vehicle listing
export const deleteRental = async (rentalId) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("JWT token not found. Please login again.");
  }

  const response = await api.delete(
    `/rentals/${rentalId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};