import api from "../api/axios.js";

/*
 * =========================
 * CREATE RENTAL REQUEST
 * =========================
 */
export const createRentalRequest = async (
  requestData
) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("JWT token not found. Please login again.");
  }

  const response = await api.post(
    "/rental-requests",
    requestData,
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
 * GET MY RENTAL REQUESTS
 * =========================
 */
export const getMyRentalRequests = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("JWT token not found. Please login again.");
  }

  const response = await api.get(
    "/rental-requests/my",
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
 * GET RENTAL REQUEST
 * RESPONSES
 * =========================
 */
export const getRentalRequestResponses = async (
  requestId
) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("JWT token not found. Please login again.");
  }

  const response = await api.get(
    `/rental-requests/${requestId}/responses`,
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
 * GET PROVIDER RENTAL
 * REQUESTS
 * =========================
 */
export const getProviderRentalRequests = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("JWT token not found. Please login again.");
  }

  const response = await api.get(
    "/rental-requests/provider",
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
 * PROVIDER RESPONSE ACTION
 *
 * action:
 * ACCEPT
 * REJECT
 * COUNTER
 *
 * rentalListingId is required
 * when accepting a rental request.
 * =========================
 */
export const respondToRentalRequest = async (
  responseId,
  action,
  counterOffer = null,
  rentalListingId = null
) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("JWT token not found. Please login again.");
  }

  const response = await api.put(
    `/rental-requests/responses/${responseId}`,
    {
      action,
      counterOffer,
      rentalListingId,
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
 * CUSTOMER RESPONSE TO
 * COUNTER OFFER
 *
 * action:
 * ACCEPT
 * REJECT
 * =========================
 */
export const respondToRentalCounterOffer = async (
  responseId,
  action
) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("JWT token not found. Please login again.");
  }

  const response = await api.put(
    `/rental-requests/responses/${responseId}/customer`,
    null,
    {
      params: {
        action,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};