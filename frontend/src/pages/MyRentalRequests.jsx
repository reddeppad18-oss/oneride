
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  MapPin,
  Users,
  IndianRupee,
  RefreshCw,
  Loader2,
  CheckCircle,
  Clock,
  XCircle,
  MessageCircle,
  CalendarDays,
  CarFront,
} from "lucide-react";

import {
  getMyRentalRequests,
  getRentalRequestResponses,
  respondToRentalCounterOffer,
} from "../services/rentalRequestService";

const MyRentalRequests = () => {
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [responses, setResponses] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState("");

  /*
   * =========================
   * LOAD REQUESTS
   * =========================
   */

  const loadRequests = async (showRefresh = false) => {
    try {
      setError("");

      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const data = await getMyRentalRequests();

      const requestList = Array.isArray(data) ? data : [];

      setRequests(requestList);

      const responseMap = {};

      await Promise.all(
        requestList.map(async (request) => {
          try {
            const responseData =
              await getRentalRequestResponses(request.id);

            responseMap[request.id] = Array.isArray(responseData)
              ? responseData
              : [];
          } catch (responseError) {
            console.error(
              `Failed to load responses for rental request ${request.id}:`,
              responseError
            );

            responseMap[request.id] = [];
          }
        })
      );

      setResponses(responseMap);
    } catch (requestError) {
      console.error(
        "Failed to load rental requests:",
        requestError
      );

      setError(
        requestError.response?.data?.message ||
          requestError.message ||
          "Failed to load your rental requests."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  /*
   * =========================
   * CUSTOMER COUNTER RESPONSE
   * =========================
   */

  const handleCounterResponse = async (responseId, action) => {
    try {
      setError("");
      setActionLoading(responseId);

      await respondToRentalCounterOffer(responseId, action);

      await loadRequests(true);
    } catch (actionError) {
      console.error(
        "Failed to respond to rental counter-offer:",
        actionError
      );

      setError(
        actionError.response?.data?.message ||
          actionError.message ||
          "Failed to process the counter-offer."
      );
    } finally {
      setActionLoading(null);
    }
  };

  /*
   * =========================
   * STATUS HELPERS
   * =========================
   */

  const getStatusClass = (status) => {
    switch (String(status || "").toUpperCase()) {
      case "ACCEPTED":
        return "status-success";

      case "REJECTED":
      case "CANCELLED":
      case "EXPIRED":
        return "status-danger";

      case "COUNTER_OFFERED":
        return "status-warning";

      case "SEARCHING":
      case "PENDING":
      default:
        return "status-pending";
    }
  };

  const getStatusIcon = (status) => {
    switch (String(status || "").toUpperCase()) {
      case "ACCEPTED":
        return <CheckCircle size={16} />;

      case "REJECTED":
      case "CANCELLED":
      case "EXPIRED":
        return <XCircle size={16} />;

      case "COUNTER_OFFERED":
        return <MessageCircle size={16} />;

      default:
        return <Clock size={16} />;
    }
  };

  const formatStatus = (status) => {
    if (!status) return "Unknown";

    return String(status)
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return "—";

    const date = new Date(`${dateValue}T00:00:00`);

    if (Number.isNaN(date.getTime())) {
      return dateValue;
    }

    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatDateTime = (dateTime) => {
    if (!dateTime) return "—";

    const date = new Date(dateTime);

    if (Number.isNaN(date.getTime())) {
      return dateTime;
    }

    return date.toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const formatPrice = (price) => {
    if (price === null || price === undefined) {
      return "—";
    }

    return `₹${Number(price).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  /*
   * =========================
   * RENDER
   * =========================
   */

  return (
    <div className="page-container">

      {/* HEADER */}

      <div className="page-header">

        <button
          type="button"
          className="secondary-button"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <div>
          <h1>My Rental Requests</h1>

          <p>
            Track your rental requests and offers from nearby
            rental providers.
          </p>
        </div>

        <button
          type="button"
          className="secondary-button"
          onClick={() => loadRequests(true)}
          disabled={refreshing}
        >
          {refreshing ? (
            <>
              <Loader2 size={18} className="spin" />
              Refreshing...
            </>
          ) : (
            <>
              <RefreshCw size={18} />
              Refresh
            </>
          )}
        </button>

      </div>

      {/* ERROR */}

      {error && (
        <div className="error-message">
          <XCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {/* LOADING */}

      {loading ? (
        <div className="loading-state">
          <Loader2 size={32} className="spin" />
          <p>Loading your rental requests...</p>
        </div>
      ) : requests.length === 0 ? (

        /* EMPTY STATE */

        <div className="empty-state">

          <CarFront size={42} />

          <h2>No Rental Requests Yet</h2>

          <p>
            You haven't requested a rental vehicle yet.
          </p>

          <button
            type="button"
            className="primary-button"
            onClick={() => navigate("/request-rental")}
          >
            Request a Rental Vehicle
          </button>

        </div>

      ) : (

        /* REQUEST CARDS */

        <div className="cards-grid">

          {requests.map((request) => {
            const requestResponses = responses[request.id] || [];

            return (
              <div
                className="form-card rental-request-card"
                key={request.id}
              >

                {/* REQUEST HEADER */}

                <div className="card-header">

                  <div>
                    <h2>
                      Rental Request #{request.id}
                    </h2>

                    <span className="request-date">
                      Requested: {formatDateTime(request.createdAt)}
                    </span>
                  </div>

                  <div
                    className={`status-badge ${getStatusClass(
                      request.status
                    )}`}
                  >
                    {getStatusIcon(request.status)}
                    {formatStatus(request.status)}
                  </div>

                </div>

                {/* VEHICLE TYPE */}

                <div className="request-vehicle-type">
                  <CarFront size={20} />

                  <div>
                    <small>Vehicle Type</small>
                    <strong>
                      {request.vehicleType || "Not specified"}
                    </strong>
                  </div>
                </div>

                {/* PICKUP LOCATION */}

                <div className="route-section">

                  <div className="route-point">

                    <span className="route-dot pickup-dot" />

                    <div>
                      <small>Pickup Location</small>

                      <strong>
                        {request.pickupAddress || "Not specified"}
                      </strong>
                    </div>

                  </div>

                </div>

                {/* RENTAL DATES */}

                <div className="rental-date-section">

                  <div className="detail-item">
                    <CalendarDays size={18} />

                    <div>
                      <small>Start Date</small>
                      <strong>
                        {formatDate(request.startDate)}
                      </strong>
                    </div>
                  </div>

                  <div className="detail-item">
                    <CalendarDays size={18} />

                    <div>
                      <small>End Date</small>
                      <strong>
                        {formatDate(request.endDate)}
                      </strong>
                    </div>
                  </div>

                </div>

                {/* REQUEST DETAILS */}

                <div className="request-details">

                  <div className="detail-item">

                    <Users size={18} />

                    <div>
                      <small>Passengers</small>

                      <strong>
                        {request.passengers ?? "—"}
                      </strong>
                    </div>

                  </div>

                  <div className="detail-item">

                    <IndianRupee size={18} />

                    <div>
                      <small>Offered Price</small>

                      <strong>
                        {formatPrice(request.offeredPrice)}
                      </strong>
                    </div>

                  </div>

                  {request.finalPrice !== null &&
                    request.finalPrice !== undefined && (
                      <div className="detail-item">

                        <IndianRupee size={18} />

                        <div>
                          <small>Final Price</small>

                          <strong>
                            {formatPrice(request.finalPrice)}
                          </strong>
                        </div>

                      </div>
                    )}

                </div>

                {/* DESCRIPTION */}

                {request.description && (
                  <div className="request-description">
                    <small>Additional Requirements</small>
                    <p>{request.description}</p>
                  </div>
                )}

                {/* NEGOTIABLE */}

                <div className="request-option">

                  {request.negotiable ? (
                    <>
                      <CheckCircle size={16} />
                      Price is negotiable
                    </>
                  ) : (
                    <>
                      <XCircle size={16} />
                      Price is not negotiable
                    </>
                  )}

                </div>

                {/* PROVIDER RESPONSES */}

                <div className="responses-section">

                  <div className="responses-header">

                    <h3>Provider Responses</h3>

                    <span>{requestResponses.length}</span>

                  </div>

                  {requestResponses.length === 0 ? (

                    <div className="no-responses">
                      <Clock size={18} />

                      <span>
                        Waiting for nearby rental providers
                        to respond...
                      </span>
                    </div>

                  ) : (

                    <div className="response-list">

                      {requestResponses.map((response) => {
                        const responseStatus = String(
                          response.status || ""
                        ).toUpperCase();

                        const isCounter =
                          responseStatus === "COUNTER_OFFERED";

                        const counterPrice = response.counterOffer;

                        const isActionLoading =
                          actionLoading === response.responseId;

                        return (
                          <div
                            className="provider-response"
                            key={response.responseId}
                          >

                            <div className="provider-response-main">

                              <div>

                                <strong>
                                  {response.providerName ||
                                    "Rental Provider"}
                                </strong>

                                <span
                                  className={`status-badge ${getStatusClass(
                                    response.status
                                  )}`}
                                >
                                  {getStatusIcon(response.status)}
                                  {formatStatus(response.status)}
                                </span>

                              </div>

                              {counterPrice !== null &&
                                counterPrice !== undefined && (
                                  <div className="counter-price">

                                    <small>
                                      Counter Offer
                                    </small>

                                    <strong>
                                      {formatPrice(counterPrice)}
                                    </strong>

                                  </div>
                                )}

                              {response.finalPrice !== null &&
                                response.finalPrice !== undefined && (
                                  <div className="counter-price">

                                    <small>
                                      Final Price
                                    </small>

                                    <strong>
                                      {formatPrice(response.finalPrice)}
                                    </strong>

                                  </div>
                                )}

                            </div>

                            {/* ACCEPT / REJECT COUNTER-OFFER */}

                            {isCounter && (
                              <div className="counter-actions">

                                <button
                                  type="button"
                                  className="primary-button"
                                  disabled={isActionLoading}
                                  onClick={() =>
                                    handleCounterResponse(
                                      response.responseId,
                                      "ACCEPT"
                                    )
                                  }
                                >
                                  {isActionLoading ? (
                                    <>
                                      <Loader2
                                        size={16}
                                        className="spin"
                                      />
                                      Processing...
                                    </>
                                  ) : (
                                    <>
                                      <CheckCircle size={16} />
                                      Accept {formatPrice(counterPrice)}
                                    </>
                                  )}
                                </button>

                                <button
                                  type="button"
                                  className="danger-button"
                                  disabled={isActionLoading}
                                  onClick={() =>
                                    handleCounterResponse(
                                      response.responseId,
                                      "REJECT"
                                    )
                                  }
                                >
                                  <XCircle size={16} />
                                  Reject
                                </button>

                              </div>
                            )}

                          </div>
                        );
                      })}

                    </div>
                  )}

                </div>

              </div>
            );
          })}

        </div>
      )}

    </div>
  );
};

export default MyRentalRequests;
