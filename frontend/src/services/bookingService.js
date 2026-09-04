import api from "../api/axios.js";


// ========================================
// CREATE BOOKING
// ========================================

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


// ========================================
// GET MY BOOKINGS
// ========================================

export const getMyBookings = async () => {
  const token = localStorage.getItem("token");

  const response = await api.get(
    "/bookings/my",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};


// ========================================
// GET BOOKINGS FOR MY RIDE
// ========================================

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


// ========================================
// CONFIRM BOOKING
// ========================================

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


// ========================================
// REJECT BOOKING
// ========================================

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


// ========================================
// CANCEL MY BOOKING
// ========================================

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


// ========================================
// GET BOOKING HISTORY
// ========================================

export const getBookingHistory = async () => {
  const token = localStorage.getItem("token");

  const response = await api.get(
    "/bookings/history",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};