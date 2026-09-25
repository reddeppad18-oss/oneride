import api from "../api/axios.js";

/*
 * =========================
 * CREATE RIDE REQUEST
 * =========================
 */

export const createRideRequest = async (requestData) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("JWT token not found. Please login again.");
  }

  const response = await api.post(
    "/ride-requests",
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
 * GET MY RIDE REQUESTS
 * =========================
 */

export const getMyRideRequests = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("JWT token not found. Please login again.");
  }

  const response = await api.get(
    "/ride-requests/my",
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
 * GET REQUEST RESPONSES
 * =========================
 */

export const getRideRequestResponses = async (
  requestId
) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("JWT token not found. Please login again.");
  }

  const response = await api.get(
    `/ride-requests/${requestId}/responses`,
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
 * GET PROVIDER RIDE REQUESTS
 * =========================
 */

export const getProviderRideRequests = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("JWT token not found. Please login again.");
  }

  const response = await api.get(
    "/ride-requests/provider",
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
 * PROVIDER RESPONSE
 * =========================
 */

export const respondToRideRequest = async (
  responseId,
  action,
  counterOffer = null
) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("JWT token not found. Please login again.");
  }

  const response = await api.put(
    `/ride-requests/responses/${responseId}`,
    {
      action,
      counterOffer,
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
 * CUSTOMER RESPONSE
 * =========================
 */

export const respondToRideCounterOffer = async (
  responseId,
  action
) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("JWT token not found. Please login again.");
  }

  const response = await api.put(
    `/ride-requests/responses/${responseId}/customer`,
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

