import api from "../api/axios.js";


// =====================================================
// CREATE RENTAL BOOKING
// =====================================================

export const createRentalBooking = async (
  rentalId,
  startDate,
  endDate
) => {

  const token =
    localStorage.getItem("token");


  if (!token) {
    throw new Error(
      "JWT token not found. Please login again."
    );
  }


  const response = await api.post(
    "/rental-bookings",
    {
      rentalId,
      startDate,
      endDate,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );


  return response.data;
};


// =====================================================
// GET MY RENTAL BOOKINGS
// =====================================================

export const getMyRentalBookings = async () => {

  const token =
    localStorage.getItem("token");


  if (!token) {
    throw new Error(
      "JWT token not found. Please login again."
    );
  }


  const response = await api.get(
    "/rental-bookings/my",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );


  return response.data;
};


// =====================================================
// GET BOOKINGS FOR RENTAL
// =====================================================

export const getBookingsForRental = async (
  rentalId
) => {

  const token =
    localStorage.getItem("token");


  if (!token) {
    throw new Error(
      "JWT token not found. Please login again."
    );
  }


  const response = await api.get(
    `/rental-bookings/rental/${rentalId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );


  return response.data;
};


// =====================================================
// OWNER CONFIRMS BOOKING
// =====================================================

export const confirmRentalBooking = async (
  bookingId
) => {

  const token =
    localStorage.getItem("token");


  if (!token) {
    throw new Error(
      "JWT token not found. Please login again."
    );
  }


  const response = await api.put(
    `/rental-bookings/${bookingId}/confirm`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );


  return response.data;
};


// =====================================================
// OWNER REJECTS BOOKING
// =====================================================

export const rejectRentalBooking = async (
  bookingId
) => {

  const token =
    localStorage.getItem("token");


  if (!token) {
    throw new Error(
      "JWT token not found. Please login again."
    );
  }


  const response = await api.put(
    `/rental-bookings/${bookingId}/reject`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );


  return response.data;
};


// =====================================================
// CUSTOMER CANCELS BOOKING
// =====================================================

export const cancelRentalBooking = async (
  bookingId
) => {

  const token =
    localStorage.getItem("token");


  if (!token) {
    throw new Error(
      "JWT token not found. Please login again."
    );
  }


  const response = await api.put(
    `/rental-bookings/${bookingId}/cancel`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );


  return response.data;
};


// =====================================================
// OWNER COMPLETES BOOKING
// =====================================================

export const completeRentalBooking = async (
  bookingId
) => {

  const token =
    localStorage.getItem("token");


  if (!token) {
    throw new Error(
      "JWT token not found. Please login again."
    );
  }


  const response = await api.put(
    `/rental-bookings/${bookingId}/complete`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );


  return response.data;
};