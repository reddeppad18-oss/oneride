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
} from "lucide-react";

import {
  getMyRideRequests,
  getRideRequestResponses,
  respondToRideCounterOffer,
} from "../services/rideRequestService";

const MyRideRequests = () => {
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

      const data = await getMyRideRequests();

      const requestList = Array.isArray(data) ? data : [];

      setRequests(requestList);

      /*
       * Load provider responses for every request.
       */

      const responseMap = {};

      await Promise.all(
        requestList.map(async (request) => {
          try {
            const responseData =
              await getRideRequestResponses(request.id);

            responseMap[request.id] = Array.isArray(responseData)
              ? responseData
              : [];
          } catch (responseError) {
            console.error(
              `Failed to load responses for request ${request.id}:`,
              responseError
            );

            responseMap[request.id] = [];
          }
        })
      );

      setResponses(responseMap);
    } catch (requestError) {
      console.error(
        "Failed to load ride requests:",
        requestError
      );

      setError(
        requestError.response?.data?.message ||
          requestError.message ||
          "Failed to load your ride requests."
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

  const handleCounterResponse = async (
    responseId,
    action
  ) => {
    try {
      setError("");
      setActionLoading(responseId);

      await respondToRideCounterOffer(
        responseId,
        action
      );

      await loadRequests(true);
    } catch (actionError) {
      console.error(
        "Failed to respond to counter offer:",
        actionError
      );

      setError(
        actionError.response?.data?.message ||
          actionError.message ||
          "Failed to process the counter offer."
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
    if (!status) return "UNKNOWN";

    return String(status)
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
      );
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

  /*
   * =========================
   * RENDER
   * =========================
   */

  return (
    <div className="page-container">

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
          <h1>My Ride Requests</h1>

          <p>
            Track your ride requests and responses from
            nearby providers.
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
              <Loader2
                size={18}
                className="spin"
              />
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

      {error && (
        <div className="error-message">
          <XCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="loading-state">
          <Loader2
            size={32}
            className="spin"
          />
          <p>Loading your ride requests...</p>
        </div>
      ) : requests.length === 0 ? (
        <div className="empty-state">

          <MapPin size={42} />

          <h2>No Ride Requests Yet</h2>

          <p>
            You haven't requested a ride yet.
          </p>

          <button
            type="button"
            className="primary-button"
            onClick={() => navigate("/request-ride")}
          >
            Request a Ride
          </button>

        </div>
      ) : (
        <div className="cards-grid">

          {requests.map((request) => {

            const requestResponses =
              responses[request.id] || [];

            return (
              <div
                className="form-card ride-request-card"
                key={request.id}
              >

                {/* =========================
                    REQUEST HEADER
                ========================= */}

                <div className="card-header">

                  <div>
                    <h2>
                      Ride Request #{request.id}
                    </h2>

                    <span className="request-date">
                      {formatDateTime(
                        request.createdAt
                      )}
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

                {/* =========================
                    ROUTE
                ========================= */}

                <div className="route-section">

                  <div className="route-point">

                    <span className="route-dot pickup-dot" />

                    <div>
                      <small>Pickup</small>

                      <strong>
                        {request.pickupAddress}
                      </strong>
                    </div>

                  </div>

                  <div className="route-line" />

                  <div className="route-point">

                    <span className="route-dot destination-dot" />

                    <div>
                      <small>Destination</small>

                      <strong>
                        {request.destinationAddress}
                      </strong>
                    </div>

                  </div>

                </div>

                {/* =========================
                    REQUEST DETAILS
                ========================= */}

                <div className="request-details">

                  <div className="detail-item">

                    <Users size={18} />

                    <div>
                      <small>Seats</small>

                      <strong>
                        {request.requestedSeats}
                      </strong>
                    </div>

                  </div>

                  <div className="detail-item">

                    <IndianRupee size={18} />

                    <div>
                      <small>Offered Price</small>

                      <strong>
                        ₹
                        {Number(
                          request.offeredPrice || 0
                        ).toFixed(2)}
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
                            ₹
                            {Number(
                              request.finalPrice
                            ).toFixed(2)}
                          </strong>
                        </div>

                      </div>
                    )}

                </div>

                {/* =========================
                    NEGOTIABLE
                ========================= */}

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

                {/* =========================
                    PROVIDER RESPONSES
                ========================= */}

                <div className="responses-section">

                  <div className="responses-header">

                    <h3>
                      Provider Responses
                    </h3>

                    <span>
                      {requestResponses.length}
                    </span>

                  </div>

                  {requestResponses.length === 0 ? (
                    <div className="no-responses">
                      <Clock size={18} />

                      <span>
                        Waiting for nearby providers
                        to respond...
                      </span>
                    </div>
                  ) : (
                    <div className="response-list">

                      {requestResponses.map(
                        (response) => {

                          const responseStatus =
                            String(
                              response.status || ""
                            ).toUpperCase();

                          const isCounter =
                            responseStatus ===
                            "COUNTER_OFFERED";

                          const counterPrice =
                            response.counterOffer;

                          return (
                            <div
                              className="provider-response"
                              key={response.responseId}
                            >

                              <div className="provider-response-main">

                                <div>

                                  <strong>
                                    {response.providerName ||
                                      "Ride Provider"}
                                  </strong>

                                  <span
                                    className={`status-badge ${getStatusClass(
                                      response.status
                                    )}`}
                                  >
                                    {getStatusIcon(
                                      response.status
                                    )}

                                    {formatStatus(
                                      response.status
                                    )}
                                  </span>

                                </div>

                                {counterPrice !==
                                  null &&
                                  counterPrice !==
                                    undefined && (
                                    <div className="counter-price">

                                      <small>
                                        Counter Offer
                                      </small>

                                      <strong>
                                        ₹
                                        {Number(
                                          counterPrice
                                        ).toFixed(2)}
                                      </strong>

                                    </div>
                                  )}

                              </div>

                              {/* CUSTOMER RESPONSE TO COUNTER */}

                              {isCounter && (
                                <div className="counter-actions">

                                  <button
                                    type="button"
                                    className="primary-button"
                                    disabled={
                                      actionLoading ===
                                      response.responseId
                                    }
                                    onClick={() =>
                                      handleCounterResponse(
                                        response.responseId,
                                        "ACCEPT"
                                      )
                                    }
                                  >
                                    {actionLoading ===
                                    response.responseId ? (
                                      <>
                                        <Loader2
                                          size={16}
                                          className="spin"
                                        />
                                        Processing...
                                      </>
                                    ) : (
                                      <>
                                        <CheckCircle
                                          size={16}
                                        />
                                        Accept ₹
                                        {Number(
                                          counterPrice
                                        ).toFixed(2)}
                                      </>
                                    )}
                                  </button>

                                  <button
                                    type="button"
                                    className="danger-button"
                                    disabled={
                                      actionLoading ===
                                      response.responseId
                                    }
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
                        }
                      )}

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

export default MyRideRequests;