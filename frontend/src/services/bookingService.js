import api from "../api/axios.js";

export const createBooking = async (rideId, seatsBooked) => {
  const token = localStorage.getItem("token");

  const response = await api.post(
    "/bookings",
    {
      rideId,
      seatsBooked,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const getMyBookings = async () => {
  const token = localStorage.getItem("token");

  const response = await api.get("/bookings/my", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const getBookingsForRide = async (rideId) => {
  const token = localStorage.getItem("token");

  const response = await api.get(
    `/bookings/ride/${rideId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const confirmBooking = async (bookingId) => {
  const token = localStorage.getItem("token");

  const response = await api.put(
    `/bookings/${bookingId}/confirm`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const rejectBooking = async (bookingId) => {
  const token = localStorage.getItem("token");

  const response = await api.put(
    `/bookings/${bookingId}/reject`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const cancelBooking = async (bookingId) => {
  const token = localStorage.getItem("token");

  const response = await api.put(
    `/bookings/${bookingId}/cancel`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};